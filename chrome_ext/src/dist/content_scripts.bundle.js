/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/content_scripts/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common/MingleChannelNode.js":
/*!*****************************************!*\
  !*** ./src/common/MingleChannelNode.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MingleChannelNode; });\nclass MingleChannelNode {\n  constructor(type, channel_name, handleReceive) {\n    this.type = type;\n    this.channel_name = channel_name;\n    this.handleReceive = handleReceive;\n    this.channel = null;\n    this.setup = this.setup.bind(this);\n    this._setup = this._setup.bind(this);\n    this.setup();\n  }\n\n  setup() {\n    if (this.type === 'source') {\n      this.channel = chrome.runtime.connect({\n        name: this.channel_name\n      });\n\n      this._setup();\n    } else if (this.type == 'sink') {\n      chrome.runtime.onConnect.addListener(_channel => {\n        if (_channel.name === this.channel_name) {\n          this.channel = _channel;\n\n          this._setup();\n        }\n      });\n    }\n  }\n\n  _setup() {\n    this.channel.onDisconnect.addListener(() => {\n      // try to reconnect if the connection is gone\n      this.setup();\n    });\n    this.channel.onMessage.addListener(this.handleReceive);\n  }\n\n  send(msg) {\n    console.log(`posting message from ${this.type}`);\n    console.log(msg);\n    this.channel.postMessage(msg);\n  }\n\n}\n\n//# sourceURL=webpack:///./src/common/MingleChannelNode.js?");

/***/ }),

/***/ "./src/common/WindowHelpers.js":
/*!*************************************!*\
  !*** ./src/common/WindowHelpers.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst receive = (actions, handleReceive) => {\n  window.addEventListener('message', event => {\n    if (actions.includes(event.data.action)) {\n      handleReceive(event.data);\n    }\n  });\n};\n\nconst send = msg => {\n  window.postMessage(msg, '*');\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  send,\n  receive\n});\n\n//# sourceURL=webpack:///./src/common/WindowHelpers.js?");

/***/ }),

/***/ "./src/content_scripts/ScriptInjector.js":
/*!***********************************************!*\
  !*** ./src/content_scripts/ScriptInjector.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet inject = () => {\n  let s = document.createElement('script');\n  s.src = chrome.extension.getURL('mingle_scripts.bundle.js');\n  (document.head || document.documentElement).appendChild(s);\n\n  s.onload = function () {\n    s.parentNode.removeChild(s);\n  };\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  inject\n});\n\n//# sourceURL=webpack:///./src/content_scripts/ScriptInjector.js?");

/***/ }),

/***/ "./src/content_scripts/index.js":
/*!**************************************!*\
  !*** ./src/content_scripts/index.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ScriptInjector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScriptInjector */ \"./src/content_scripts/ScriptInjector.js\");\n/* harmony import */ var _common_MingleChannelNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/MingleChannelNode */ \"./src/common/MingleChannelNode.js\");\n/* harmony import */ var _common_WindowHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/WindowHelpers */ \"./src/common/WindowHelpers.js\");\n\n\n\nconst MCSource = new _common_MingleChannelNode__WEBPACK_IMPORTED_MODULE_1__[\"default\"]('source', 'mingle-content', msg => {\n  _common_WindowHelpers__WEBPACK_IMPORTED_MODULE_2__[\"default\"].send({\n    action: 'MINGLE_RECEIVE',\n    payload: msg\n  });\n});\n\nlet scriptEvents = () => {\n  _common_WindowHelpers__WEBPACK_IMPORTED_MODULE_2__[\"default\"].receive(['MINGLE_FORWARD', 'MINGLE_JOIN'], msg => {\n    MCSource.send(msg);\n  });\n};\n\n_ScriptInjector__WEBPACK_IMPORTED_MODULE_0__[\"default\"].inject();\nscriptEvents();\n\n//# sourceURL=webpack:///./src/content_scripts/index.js?");

/***/ })

/******/ });