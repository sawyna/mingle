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

/***/ "./src/content_scripts/eventChannel.js":
/*!*********************************************!*\
  !*** ./src/content_scripts/eventChannel.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet contentPort = chrome.runtime.connect({\n  name: 'mingle-content'\n});\n\nlet handleScriptEvent = event => {\n  if (event.data.action === 'MINGLE_FORWARD' || event.data.action === 'MINGLE_JOIN') {\n    console.log(`received event in content script`);\n    console.log(event.data);\n    contentPort.postMessage(event.data);\n  }\n};\n\nlet scriptEvents = () => {\n  window.addEventListener('message', handleScriptEvent, false);\n};\n\nlet contentEvents = () => {\n  contentPort.onMessage.addListener(message => {\n    window.postMessage({\n      action: 'MINGLE_RECEIVE',\n      payload: message\n    });\n  });\n};\n\nlet init = () => {\n  scriptEvents();\n  contentEvents();\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  init: init\n});\n\n//# sourceURL=webpack:///./src/content_scripts/eventChannel.js?");

/***/ }),

/***/ "./src/content_scripts/index.js":
/*!**************************************!*\
  !*** ./src/content_scripts/index.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scriptInjector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scriptInjector */ \"./src/content_scripts/scriptInjector.js\");\n/* harmony import */ var _eventChannel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./eventChannel */ \"./src/content_scripts/eventChannel.js\");\n\n\nObject(_scriptInjector__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n_eventChannel__WEBPACK_IMPORTED_MODULE_1__[\"default\"].init();\n\n//# sourceURL=webpack:///./src/content_scripts/index.js?");

/***/ }),

/***/ "./src/content_scripts/scriptInjector.js":
/*!***********************************************!*\
  !*** ./src/content_scripts/scriptInjector.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet inject = () => {\n  let s = document.createElement('script');\n  s.src = chrome.extension.getURL('mingle_scripts.bundle.js');\n  (document.head || document.documentElement).appendChild(s);\n\n  s.onload = function () {\n    s.parentNode.removeChild(s);\n  };\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (inject);\n\n//# sourceURL=webpack:///./src/content_scripts/scriptInjector.js?");

/***/ })

/******/ });