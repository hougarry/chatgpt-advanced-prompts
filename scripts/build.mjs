import FS from 'fs-extra';
import path from 'path';
import stylus from 'stylus';
import * as ejs from 'ejs';
import UglifyJS from 'uglify-js';
import { create } from 'markdown-to-html-cli';
import _ from 'colors-cli/toxic';

// Define paths to various files and directories
const deployDir = path.resolve(process.cwd(), '.deploy'); // Deployment directory
const faviconPath = path.resolve(process.cwd(), 'template', 'img', 'favicon.ico'); // Path to favicon
const rootIndexJSPath = path.resolve(process.cwd(), 'template', 'js', 'index.js'); // Path to root index.js
const dataJsonPath = path.resolve(process.cwd(), 'dist', 'data.json'); // Path to data.json
const dataJsonMinPath = path.resolve(process.cwd(), 'dist', 'data.min.json'); // Path to data.min.json
const cssPath = path.resolve(deployDir, 'css', 'index.css'); // Path to CSS file
const contributorsPath = path.resolve(process.cwd(), 'CONTRIBUTORS.svg'); // Path to CONTRIBUTORS.svg

// Anonymous async function to perform various tasks
;(async () => {
  try {
    // Ensure the deployment directory exists and is empty
    await FS.ensureDir(deployDir);
    await FS.emptyDir(deployDir);

    // Create necessary subdirectories
    await FS.ensureDir(path.resolve(deployDir, 'img'));
    await FS.ensureDir(path.resolve(deployDir, 'js'));
    await FS.ensureDir(path.resolve(deployDir, 'css'));
    await FS.ensureDir(path.resolve(deployDir, 'c'));

    // Copy favicon.ico to the deployment directory
    await FS.copySync(faviconPath, path.resolve(deployDir, 'img', 'favicon.ico'));
    
    // Copy various JavaScript files to the deployment directory
    await FS.copyFile(path.resolve(process.cwd(), 'template', 'js', 'copy-to-clipboard.js'), path.resolve(deployDir, 'js', 'copy-to-clipboard.js'));
    await FS.copyFile(path.resolve(process.cwd(), 'node_modules/@wcj/dark-mode/main.js'), path.resolve(deployDir, 'js', 'dark-mode.min.js'));
    await FS.copyFile(path.resolve(process.cwd(), 'node_modules/@uiw/github-corners/lib/index.js'), path.resolve(deployDir, 'js', 'github-corners.js'));

    // Minify and copy the root index.js to the deployment directory
    const jsData = await FS.readFileSync(rootIndexJSPath);
    await FS.outputFile(path.resolve(deployDir, 'js', 'index.js'), UglifyJS.minify(jsData.toString()).code);

    // Read and process Markdown files, generating data JSON
    const files = await readMarkdownPaths(path.resolve(process.cwd(), 'command'));
    const jsonData = await createDataJSON(files);

    // Write data JSON and related files
    await FS.outputFile(dataJsonPath, JSON.stringify(jsonData.json, null, 2));
    await FS.outputFile(dataJsonMinPath, JSON.stringify(jsonData.json));
    await FS.outputFile(path.resolve(deployDir, 'js', 'dt.js'), `var linux_commands=${JSON.stringify(jsonData.data)}`);

    // Create and compile Stylus to CSS
    const cssStr = await createStylToCss(
      path.resolve(process.cwd(), 'template', 'styl', 'index.styl'),
      path.resolve(deployDir, 'css', 'index.css'),
    );

    // Write the generated CSS to the deployment directory
    await FS.outputFileSync(cssPath, cssStr);
    console.log(`  ${'→'.green} ${jsonData.data.length}`);

    // Generate HTML files from EJS templates
    await createTmpToHTML(
      path.resolve(process.cwd(), 'template', 'index.ejs'),
      path.resolve(deployDir, 'index.html'),
      {
        p: '/index.html',
        n: 'ChatGPT-advanced-prompts searching database',
        d: 'the database of Chatgpt-advanced-prompts，值得收藏的GPT高级命令数据库。',
        command_length: jsonData.data.length
      }
    );

    // ... More HTML generation steps ...

    // Read CONTRIBUTORS.svg and include it in one of the HTML templates
    let svgStr = '';
    if (FS.existsSync(contributorsPath)) {
      svgStr = (await FS.readFile(contributorsPath)).toString();
    }

    // Include CONTRIBUTORS.svg in an HTML template
    await createTmpToHTML(
      path.resolve(process.cwd(), 'template', 'contributors.ejs'),
      path.resolve(deployDir, 'contributors.html'),
      {
        p: '/contributors.html',
        n: 'Search',
        d: 'the database of Chatgpt-advanced-prompts，值得收藏的GPT高级命令数据库。',
        arr: jsonData.data,
        command_length: jsonData.data.length,
        contributors: svgStr,
      }
    );

    // Generate individual HTML files for each command or prompt
    await Promise.all(jsonData.data.map(async (item, idx) => {
      item.command_length = jsonData.data.length;
      await createTmpToHTML(
        path.resolve(process.cwd(), 'template', 'details.ejs'),
        path.resolve(deployDir, 'c', `${item.n}.html`),
        item,
        path.resolve(process.cwd(), 'command'),
      );
    }));

  } catch (err) {
    console.log(`\n ERROR :> ${err}\n`)
    if (err && err.message) {
      console.log(`\n ERROR :> ${err.message.red_bt}\n`)
    }
    process.exit(1);
  }
})();

/**
 * Returns an array of paths for all Markdown files.
 * @param {String} filepath 
 */
function readMarkdownPaths(filepath) {
  return new Promise((resolve, reject) => {
    try {
      let pathAll = [];
      const files = FS.readdirSync(filepath);
      for (let i = 0; i < files.length; i++) {
        if (/\.md$/.test(files[i])) {
          pathAll.push(path.join(filepath, files[i]));
        }
      }
      resolve(pathAll);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Ensures that the directory exists.
 * @param {String} pathArr
 */
function createDataJSON(pathArr) {
  return new Promise((resolve, reject) => {
    try {
      const commandData = {};
      const indexes = [];
      pathArr.forEach((mdPath, i) => {
        const json = {}
        const con = FS.readFileSync(mdPath);
        const str = con.toString();
        let title;

        // Try to match the title based on the existing format
        const titleMatch = str.match(/[^===]+(?=[===])/g);
        if (titleMatch && titleMatch[0]) {
          title = titleMatch[0].replace(/\n/g, '').replace(/\r/, '');
        } else {
          // If the title doesn't match the expected format, use the file name as the title
          title = path.basename(mdPath, '.md');
        }

        // Command or Prompt Name
        json["n"] = title;
        // Command or Prompt Path
        json["p"] = `/${path.basename(mdPath, '.md').replace(/\\/g, '/')}`;

        // Command or Prompt Description
        let des = str.match(/\n==={1,}([\s\S]*?)##/i);
        if (!des) {
          throw `Invalid format: ${mdPath}`;
        }
        des = des[1] ? des[1].replace(/\n/g, '') : des[1];
        des = des.replace(/\r/g, '')
        json["d"] = des;

        indexes.push(json);
        commandData[title] = json;
      });
      resolve({
        json: commandData,
        data: indexes
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 * Create HTML files from EJS templates.
 * @param {String} fromPath EJS template path
 * @param {String} toPath HTML output path
 * @param {Object} desJson Data to pass to the template
 * @param {String} mdPath Path to Markdown files
 */
/**
 * Create HTML files from EJS templates.
 * @param {String} fromPath EJS template path
 * @param {String} toPath HTML output path
 * @param {Object} desJson Data to pass to the template
 * @param {String} mdPath Path to Markdown files
 */
async function createTmpToHTML(fromPath, toPath, desJson, mdPath) {
  try {
    // Replace the `deployDir` part of `toPath` with an empty string to get the current_path
    const current_path = toPath.replace(new RegExp(`${deployDir}`), '');

    // Read the content of the EJS template file
    const tmpStr = await FS.readFile(fromPath);

    // Initialize variables for Markdown-related data
    let mdPathName = '';
    let mdhtml = '';
    let relative_path = '';

    // Check if `mdPath` is provided (Markdown file is available)
    if (mdPath) {
      // Set `relative_path` to '../' to handle CSS/JS relative references
      relative_path = '../';

      // Construct the `mdPathName` by appending the Markdown file's name to '/command/'
      mdPathName = `/command/${desJson.n}.md`;

      // Read the content of the Markdown file and convert it to HTML using markdownToHTML function
      const READMESTR = await FS.readFile(path.resolve(mdPath, `${desJson.n}.md`));
      mdhtml = await markdownToHTML(READMESTR.toString());
    }

    // Generate HTML content by rendering the EJS template with provided data
    let html = ejs.render(tmpStr.toString(), {
      filename: fromPath,
      relative_path, // Current file's relative path to the root directory
      md_path: mdPathName || '',  // Markdown file path
      mdhtml: mdhtml || '',
      current_path,   // Current HTML path
      describe: desJson ? desJson : {},   // Current MD description
    }, {
      filename: fromPath
    });

    // Write the generated HTML content to the specified output file (`toPath`)
    await FS.outputFile(toPath, html);
    
    // Log a message to indicate the successful creation of the HTML file
    console.log(`  ${'♻️  →'.green} ${path.relative(process.cwd(), toPath)}`);

    // Resolve the Promise to indicate successful completion
    resolve();
  } catch (err) {
    // Reject the Promise and handle any errors that occur during the process
    reject(err);
  }
}


/**
 * Convert Markdown to HTML with rewriting of links.
 * @param {String} str Markdown content
 */
function markdownToHTML(str) {
  return create({
    rewrite: (node) => {
      if (node.type === 'element' && node.properties?.href && /.md/.test(node.properties.href) && !/^(https?:\/\/)/.test(node.properties.href)) {
        let href = node.properties.href;
        node.properties.href = href.replace(/([^\.\/\\]+)\.(md|markdown)/gi, '$1.html');
      }
    },
    markdown: str, document: undefined, 'dark-mode': false
  });
}

/**
 * Generate CSS from Stylus.
 * @param {String} stylPath Stylus file path
 */
function createStylToCss(stylPath) {
  return new Promise((resolve, reject) => {
    try {
      const stylStr = FS.readFileSync(stylPath, 'utf8');
      stylus(stylStr.toString())
        .set('filename', stylPath)
        .set('compress', true)
        .render((err, css) => {
          if (err) throw err;
          resolve(`${css}`);
        });
    } catch (err) {
      reject(err);
    }
  });
}
