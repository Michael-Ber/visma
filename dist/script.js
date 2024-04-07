/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/js/burger.js":
/*!*********************************!*\
  !*** ./src/assets/js/burger.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   burgerInteraction: () => (/* binding */ burgerInteraction)
/* harmony export */ });
const burgerInteraction = () => {
  try {
    const burgerBtn = document.querySelector('.header-burger__btn');
    const menu = document.querySelector('.header-burger__menu');
    const body = document.querySelector('body');
    const links = document.querySelectorAll('.header-burger__item');
    const close = document.querySelector('.header-burger__close');
    burgerBtn.addEventListener('click', () => {
      menu.classList.toggle('header-burger__menu_active');
      burgerBtn.classList.toggle('header-burger__btn_active');
      if (!menu.classList.contains('header-burger__menu_active')) {
        body.style.overflow = 'auto';
      }
    });
    window.addEventListener('resize', () => {
      menu.classList.remove('header-burger__menu_active');
      burgerBtn.classList.remove('header-burger__btn_active');
    });
    window.addEventListener('scroll', () => {
      if (menu.classList.contains('header-burger__menu_active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = 'auto';
      }
    });
    links.forEach(item => {
      item.addEventListener('click', () => {
        menu.classList.remove('header-burger__menu_active');
        burgerBtn.classList.remove('header-burger__btn_active');
      });
    });
    close.addEventListener('click', () => {
      menu.classList.remove('header-burger__menu_active');
      burgerBtn.classList.remove('header-burger__btn_active');
    });
  } catch (error) {
    console.log(error);
  }
};

/***/ }),

/***/ "./src/assets/js/fileupload.js":
/*!*************************************!*\
  !*** ./src/assets/js/fileupload.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fileUpload: () => (/* binding */ fileUpload)
/* harmony export */ });
const fileUpload = () => {
  try {
    const inputField = document.querySelector('#file');
    const notChoosenText = document.querySelector('.calculator__file-choosed');
    if (!inputField.value) {
      notChoosenText.innerHTML = 'файл не выбран';
    }
    inputField.addEventListener('input', e => {
      const name = e.target.files[0].name;
      notChoosenText.innerHTML = name;
    });
  } catch (error) {
    console.log(error);
  }
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/assets/js/main.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _burger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./burger.js */ "./src/assets/js/burger.js");
/* harmony import */ var _fileupload_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fileupload.js */ "./src/assets/js/fileupload.js");


window.addEventListener('DOMContentLoaded', () => {
  (0,_burger_js__WEBPACK_IMPORTED_MODULE_0__.burgerInteraction)();
  (0,_fileupload_js__WEBPACK_IMPORTED_MODULE_1__.fileUpload)();
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map