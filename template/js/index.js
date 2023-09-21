/**
/**
 * Callback function for sorting an array.
 * Used with Array.sort().
 */
const sortArray = function (a, b) {
  return a.nIdx - b.nIdx;
}
  /**
  * Determine if the 'indexOf()' method captures a search term.
   * @returns {boolean} - Returns true if captured, otherwise false.
  */
  function indexOfCatch(a) {
    return a > -1;
  }

  (function () {
    class Commands {
      query = '';
      query_size = 5; // Number of search results to display in the search box
      page_size = 50; // Number of items to display per page

      // Shortcut function to get elements by ID
      $$(id) {
            return document.getElementById(id);
      }

      // Get the root path

      constructor() {
        function $$(id) {
            return document.getElementById(id);
        }

        // Initialize 'commands' property with 'linux_commands' data or an empty array
        this.commands = linux_commands || [];

          // Get references to HTML elements by ID
            this.elm_query = $$('query');
            this.elm_btn = $$('search_btn');
            this.elm_result = $$('result');
            this.elm_search_result = $$('search_list_result');

            // Determine the root path based on the current URL
            this.root_path = (function () {
            let elm_path = $$('current_path');
            let url = window.location.origin + window.location.pathname;
                return elm_path ? url.replace(/\/(c\/)?(\w|-)+\.html/, '').replace(/\/$/, '') : '';
            })();

            // Initialize the search functionality
            this.init();

            // Modify links on the page to navigate to the homepage
            this.goToIndex();
        }
      /**
        /**
         * Navigate to the homepage by modifying links.
         */
        goToIndex() {
          let elma = document.getElementsByTagName('A');
          for (let i = 0; i < elma.length; i++) {
              if (elma[i].pathname === '/' && !/^https?:/i.test(elma[i].protocol)) {
                  elma[i].href = this.root_path + '/';
              }
          }
      }
        /**
         * Bind an event listener to an element with compatibility handling.
         * @param {HTMLElement} element - The element to bind the event to.
         * @param {string} type - The type of event to bind.
         * @param {function} callback - The callback function to execute when the event occurs.
         */
      bindEvent(element, type, callback) {
          if (element.addEventListener) {
              element.addEventListener(type, callback, false);
          } else if (element.attachEvent) {
              element.attachEvent('on' + type, callback);
          }
      }
      
      isSreachIndexOF(oldstr, kw) {
        if (!oldstr || !kw) return -1;
        return oldstr.toLowerCase().indexOf(kw.toLowerCase());
      }
      // Get a URL parameter by name
      getQueryString(name) {
      // Create a regular expression to match the parameter name in the URL
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      // Decode the URL and search for the parameter using the regular expression
      let r = decodeURIComponent(window.location.hash.replace(/^(\#\!|\#)/, '')).match(reg);
      // If the parameter is found, return its value; otherwise, return null
      if (r != null) return unescape(r[2]);
      return null;
      }

/**
* Update the address bar in the browser using window.history.
* @memberof Commands
*/
      pushState() {
      // Check if the browser supports the history API
      if (window.history && window.history.pushState) {
      // If a search query exists, update the URL with the query as a hash
      if (this.query) {
          history.pushState({}, "linux_commands", `#!kw=${this.query}`);
      } else {
          // If no search query exists, revert the URL to its original state (no hash)
          history.pushState({}, "linux_commands", window.location.pathname);
      }
  }
}

        /**
        * A simple template function to replace placeholders in an HTML template with values from an object.
        * @param {string} str - The HTML template string.
        * @param {object} obj - An object containing values to replace in the template.
        * @return {string} - The processed HTML template.
        * @memberof Commands
        */
        simple(str, obj) {
        return str.replace(/\$\w+\$/gi, function (matchs) {
        let returns = obj[matchs.replace(/\$/g, "")];
        return typeof returns === "undefined" ? "" : returns;
  });
}

/**
* Create HTML content for keywords.
* @param {*} json - The JSON data to generate content from.
* @param {*} keywords - The search keywords.
* @param {*} islist - Indicates if this is for a list.
* @return {*} - An HTML string.
*/
createKeyworldsHTML(json, keywords, islist) {
  // HTML templates for list and regular items
        const listHTML = '<p></p>';
        const replaceHTML = `<i class="kw">$1</i>`;
        let name = json.n;
        let des = json.d;
        let reg = new RegExp(`(${keywords})`, "ig");
        if (keywords) {
            name = json.n.replace(reg, replaceHTML);
              des = json.d.replace(reg, replaceHTML) || '';
        }
        let rootp = this.root_path.replace(/\/$/, '');
        // Construct the HTML string
        const str = `<a href="${rootp}/c$url$.html"><strong>$name$</strong> - $des$</a>${islist ? listHTML : ''}`;
        return this.simple(str, {
        name,
        url: json.p,
        des
      });
}

      /**render search result
       * @param  {boolean} islist whether it's a list*/
      searchResult(islist = false) {
        let arr = this.commands
        const self = this
        let page_size = arr.length
        let arrResultHTML = []
        const show_list_count = islist ? this.page_size : this.query_size;
        let nameArr = [], desArr = [];
        if (indexOfCatch(arr && arr.length && toString.call(arr).indexOf('Array'))) {
          for (let i = 0; i < page_size; i++) {
            if (!arr[i]) break;
            const nIdx = self.isSreachIndexOF(arr[i].n, self.query);
            const dIdx = self.isSreachIndexOF(arr[i].d, self.query);
            let json = arr[i];
            if (indexOfCatch(nIdx)) {
              json.nIdx = nIdx;
              nameArr.push(json);
            } else if (indexOfCatch(dIdx)) {
              json.dIdx = dIdx;
              desArr.push(json);
            }
          }
        }
        nameArr.sort(sortArray);
        desArr.sort(sortArray);
  
  
        const resultData = nameArr.concat(desArr).slice(0, show_list_count);
        resultData.forEach(a => {
          arrResultHTML.push(self.createKeyworldsHTML(a, self.query, islist));
        })
  
        /** @type {HTMLElement} */
        let elm = islist ? this.elm_search_result : this.elm_result;
        elm.innerHTML = ''
        arrResultHTML.forEach((result, i) => {
          const el = document.createElement('li')
          el.innerHTML = result
          elm.appendChild(el);
        })
        if (!arrResultHTML.length) {
          const noResultTipHTML = document.createElement("LI");
          const tipSpan = document.createElement("span")
          const nullQueryStringTips = `请尝试输入一些字符，进行搜索！`
          const undefinedQueryTips = `没有搜索到任何内容，请尝试输入其它字符！`
          tipSpan.innerText = this.query ? undefinedQueryTips : nullQueryStringTips
          noResultTipHTML.appendChild(tipSpan);
          elm.appendChild(noResultTipHTML);
        }
      }
      /**
       * 移动搜索结果的光标
       * @param {"up"|"down"} type 触发事件类型
       * @memberof Commands
       */
      selectedResult(type) {
        /** @type {Array} */
        let items = this.elm_result.children;
        let index = 0;
        for (var i = 0; i < items.length; i++) {
          if (items[i].className == 'ok') {
            items[i].className = '';
            if (type == 'up') index = i - 1;
            else index = i + 1;
            break;
          };
        };
        if (items[index]) items[index].className = 'ok';
      }
      // 是否选中搜索结果
      isSelectedResult() {
        let items = this.elm_result.children;
        let isSel = false;
        for (let i = 0; i < items.length; i++) {
          if (items[i].className == 'ok') {
            isSel = items[i];
            break;
          };
        };
        return isSel;
      }
      init() {
        /**
         * 设定搜索结果的 CSS display 属性
         *
         * @param {string} [inputDisplay='none']
         */
        function setdisplay(inputDisplay) {
          self.elm_result.style.display = inputDisplay || 'none'
        }
        let self = this;
        let kw = self.getQueryString('kw');
        this.elm_query.value = kw;
        this.query = kw || '';
        if (this.elm_search_result) self.searchResult(true);
        this.bindEvent(this.elm_query, 'input', function (e) {
          self.query = e.target.value;
          self.pushState()
          if (self.query) {
            self.searchResult();
          } else {
            setdisplay()
          }
          if (!self.elm_search_result) {
            setdisplay(self.query ? 'block' : 'none')
          } else {
            self.elm_btn.click();
          }
        })
        this.bindEvent(this.elm_btn, 'click', function (e) {
          setdisplay();
          if (self.elm_search_result) self.searchResult(true);
          else window.location.href = self.root_path + '/list.html#!kw=' + self.query;
        })
        this.bindEvent(this.elm_query, 'focus', function (e) {
          self.searchResult();
          if (self.query) setdisplay('block');
        })
        this.bindEvent(this.elm_query, 'blur', function (e) {
          setTimeout(function () {
            setdisplay();
          }, 300)
        })
        // 输入Enter键
        this.bindEvent(document, 'keyup', function (e) {
          if (e.keyCode === 40) self.selectedResult("down");
          if (e.keyCode === 38) self.selectedResult("up");
          if (e.key == 'Enter') {
            let item = self.isSelectedResult();
            if (!item) return self.elm_btn.click();
            if (item.children[0]) item.children[0].click();
          }
        })
        if (kw) self.searchResult();
      }
    }
    new Commands()
  })()