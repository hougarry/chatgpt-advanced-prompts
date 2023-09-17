const fs = require('fs');
const { Readable, Writable, PassThrough } = require('stream');
const Pend = require('pend');
const { EventEmitter } = require('events');

class FdSlicer extends EventEmitter {
  constructor(fd, options = {}) {
    super();

    this.fd = fd;
    this.pend = new Pend();
    this.pend.max = 1;
    this.refCount = 0;
    this.autoClose = !!options.autoClose;
  }

  read(buffer, offset, length, position, callback) {
    this.pend.go(cb => {
      fs.read(this.fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
        cb();
        callback(err, bytesRead, buffer);
      });
    });
  }

  write(buffer, offset, length, position, callback) {
    this.pend.go(cb => {
      fs.write(this.fd, buffer, offset, length, position, (err, written, buffer) => {
        cb();
        callback(err, written, buffer);
      });
    });
  }

  createReadStream(options) {
    return new ReadStream(this, options);
  }

  createWriteStream(options) {
    return new WriteStream(this, options);
  }

  ref() {
    this.refCount += 1;
  }

  unref() {
    this.refCount -= 1;

    if (this.refCount > 0) return;
    if (this.refCount < 0) throw new Error("invalid unref");

    if (this.autoClose) {
      fs.close(this.fd, err => {
        if (err) {
          this.emit('error', err);
        } else {
          this.emit('close');
        }
      });
    }
  }
}

class ReadStream extends Readable {
  constructor(context, options = {}) {
    super(options);

    this.context = context;
    this.context.ref();

    this.start = options.start || 0;
    this.endOffset = options.end;
    this.pos = this.start;
    this.destroyed = false;
  }

  _read(n) {
    if (this.destroyed) return;

    let toRead = Math.min(this._readableState.highWaterMark, n);
    if (this.endOffset != null) {
      toRead = Math.min(toRead, this.endOffset - this.pos);
    }
    if (toRead <= 0) {
      this.destroyed = true;
      this.push(null);
      this.context.unref();
      return;
    }
    this.context.pend.go(cb => {
      if (this.destroyed) return cb();
      const buffer = Buffer.alloc(toRead);
      fs.read(this.context.fd, buffer, 0, toRead, this.pos, (err, bytesRead) => {
        if (err) {
          this.destroy(err);
        } else if (bytesRead === 0) {
          this.destroyed = true;
          this.push(null);
          this.context.unref();
        } else {
          this.pos += bytesRead;
          this.push(buffer.slice(0, bytesRead));
        }
        cb();
      });
    });
  }

  destroy(err) {
    if (this.destroyed) return;
    err = err || new Error("stream destroyed");
    this.destroyed = true;
    this.emit('error', err);
    this.context.unref();
  }
}

class WriteStream extends Writable {
  constructor(context, options = {}) {
    super(options);

    this.context = context;
    this.context.ref();

    this.start = options.start || 0;
    this.endOffset = (options.end == null) ? Infinity : +options.end;
    this.bytesWritten = 0;
    this.pos = this.start;
    this.destroyed = false;

    this.on('finish', this.destroy.bind(this));
  }

  _write(buffer, _encoding, callback) {
    if (this.destroyed) return;

    if (this.pos + buffer.length > this.endOffset) {
      const err = new Error("maximum file length exceeded");
      err.code = 'ETOOBIG';
      this.destroy();
      callback(err);
      return;
    }
    this.context.pend.go(cb => {
      if (this.destroyed) return cb();
      fs.write(this.context.fd, buffer, 0, buffer.length, this.pos, (err, bytes) => {
        if (err) {
          this.destroy();
          cb();
          callback(err);
        } else {
          this.bytesWritten += bytes;
          this.pos += bytes;
          this.emit('progress');
          cb();
          callback();
        }
      });
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.context.unref();
  }
}

const { MAX_SAFE_INTEGER } = Number;

class BufferSlicer extends EventEmitter {
  constructor(buffer, options) {
    super();

    options = options || {};
    this.refCount = 0;
    this.buffer = buffer;
    this.maxChunkSize = options.maxChunkSize || MAX_SAFE_INTEGER;
  }

  read(buffer, offset, length, position, callback) {
    const end = position + length;
    const delta = end - this.buffer.length;
    const written = (delta > 0) ? delta : length;
    this.buffer.copy(buffer, offset, position, end);
    setImmediate(() => {
      callback(null, written);
    });
  }

  write(buffer, offset, length, position, callback) {
    buffer.copy(this.buffer, position, offset, offset + length);
    setImmediate(() => {
      callback(null, length, buffer);
    });
  }

  createReadStream(options = {}) {
    const readStream = new PassThrough(options);
    readStream.destroyed = false;
    readStream.start = options.start || 0;
    readStream.endOffset = options.end;
    // by the time this function returns, we'll be done.
    readStream.pos = readStream.endOffset || this.buffer.length;

    // respect the maxChunkSize option to slice up the chunk into smaller pieces.
    const entireSlice = this.buffer.slice(readStream.start, readStream.pos);
    let offset = 0;
    while (true) {
      const nextOffset = offset + this.maxChunkSize;
      if (nextOffset >= entireSlice.length) {
        // last chunk
        if (offset < entireSlice.length) {
          readStream.write(entireSlice.slice(offset, entireSlice.length));
        }
        break;
      }
      readStream.write(entireSlice.slice(offset, nextOffset));
      offset = nextOffset;
    }

    readStream.end();
    readStream.destroy = () => {
      readStream.destroyed = true;
    };
    return readStream;
  }

  createWriteStream(options) {
    const bufferSlicer = this;
    options = options || {};
    const writeStream = new Writable(options);
    writeStream.start = options.start || 0;
    writeStream.endOffset = (options.end == null) ? this.buffer.length : +options.end;
    writeStream.bytesWritten = 0;
    writeStream.pos = writeStream.start;
    writeStream.destroyed = false;
    writeStream._write = (buffer, encoding, callback) => {
      if (writeStream.destroyed) return;

      const end = writeStream.pos + buffer.length;
      if (end > writeStream.endOffset) {
        const err = new Error("maximum file length exceeded");
        err.code = 'ETOOBIG';
        writeStream.destroyed = true;
        callback(err);
        return;
      }
      buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length);

      writeStream.bytesWritten += buffer.length;
      writeStream.pos = end;
      writeStream.emit('progress');
      callback();
    };
    writeStream.destroy = () => {
      writeStream.destroyed = true;
    };
    return writeStream;
  }

  ref() {
    this.refCount += 1;
  }

  unref() {
    this.refCount -= 1;

    if (this.refCount < 0) {
      throw new Error("invalid unref");
    }
  }
}

function createFromBuffer(buffer, options) {
  return new BufferSlicer(buffer, options);
}

function createFromFd(fd, options) {
  return new FdSlicer(fd, options);
}

exports.createFromBuffer = createFromBuffer;
exports.createFromFd = createFromFd;
exports.BufferSlicer = BufferSlicer;
exports.FdSlicer = FdSlicer;
