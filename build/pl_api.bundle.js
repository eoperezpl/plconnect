var PL_API =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/auth.js":
/*!*********************!*\
  !*** ./src/auth.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Auth; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Auth =
/*#__PURE__*/
function () {
  function Auth() {
    var _this = this;

    _classCallCheck(this, Auth);

    this.recaptcha_token = false; //Default events

    this.events = {
      start: {
        callback: function callback() {},
        msg_error: "Event -> start callback is not function"
      },
      connect: {
        callback: function callback() {},
        msg_error: "Event -> connect callback is not function"
      },
      disconnect: {
        callback: function callback() {},
        msg_error: "Event -> disconnect callback is not function"
      },
      finish: {
        callback: function callback() {},
        msg_error: "Event -> finish callback is not function"
      },
      error: {
        callback: function callback() {},
        msg_error: "Event -> error callback is not function"
      },
      register_success: {
        callback: function callback() {},
        msg_error: "Event -> finish callback is not function"
      },
      register_fail: {
        callback: function callback() {},
        msg_error: "Event -> finish callback is not function"
      }
    };
    this.primary_url = "https://foservices.prensalibre.com";
    this.auth_id = "0f07e8e38a7b56f90912b3d0d874f7e7";

    this.FindAuthToken = function () {
      var response = false;
      var token = localStorage.getItem(_this.auth_id);

      if (token !== null) {
        response = atob(token);
      }

      return response;
    };

    this.SetAuthToken = function (token) {
      localStorage.setItem(_this.auth_id, btoa(token));
    };

    this.UnsetAuthToken = function () {
      localStorage.removeItem(_this.auth_id);
      return !_this.FindAuthToken();
    };

    this.parseJwt = function (token) {
      if (token) {
        var base64Url = token.split('.')[1];
        var base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(base64);
      } else {
        return false;
      }
    };

    this.DoPOST = function (url, data, callback, eventsOnGo) {
      if (!eventsOnGo) eventsOnGo = {};
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        cache: 'no-cache',
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        callback(response);
      })["catch"](function (err) {
        _this.EventTrigger("error");

        _this.execEventOnGo("error", eventsOnGo);
      });
    };

    this.SendMsg = function (msg) {
      console.log("PL_API Says: ".concat(msg));
    };

    this.execEventOnGo = function (eventName, eventOnGoTree) {
      if (typeof eventOnGoTree[eventName] !== "undefined") {
        var token = _this.FindAuthToken();

        eventOnGoTree[eventName](_this.parseJwt(token));
      }
    };

    this.execEvent = function (eventName, paramsSend) {
      // If the event exists
      if (typeof _this.events[eventName] !== "undefined") {
        // If the callback exists
        if (typeof _this.events[eventName].callback === "function") {
          // Call event
          var callbackTmp = _this.events[eventName].callback;
          callbackTmp(paramsSend);
        } else {
          _this.SendMsg(_this.events[eventName].msg_error);
        }
      } else {
        _this.SendMsg("The event '" + eventName + "' not exists");
      }
    }; // Singleton in window


    if (window.PlConnectApiInstance) {
      return window.PlConnectApiInstance;
    }

    window.PlConnectApiInstance = this;
  }

  _createClass(Auth, [{
    key: "Event",
    value: function Event(event, callbackEvent) {
      if (typeof this.events[event] !== "undefined") {
        this.events[event].callback = callbackEvent;
      } else {
        console.log("Event '" + event + "' is not defined");
      }
    }
  }, {
    key: "EventTrigger",
    value: function EventTrigger(event) {
      var token = this.FindAuthToken();
      this.execEvent(event, this.parseJwt(token));
    }
  }, {
    key: "CheckLogin",
    value: function CheckLogin(eventsOnGo) {
      var _this2 = this;

      if (!eventsOnGo) eventsOnGo = {}; // Exec start callback

      this.EventTrigger("start");
      this.execEventOnGo("start", eventsOnGo); // Check token

      var token = this.FindAuthToken(); // If token exists

      if (token) {
        this.DoPOST(this.primary_url + '/auth/check', {
          token: token
        }, function (data) {
          if (typeof data.auth !== "undefined") {
            if (data.auth === 1) {
              _this2.SendMsg("** User connected **");

              _this2.EventTrigger("connect");

              _this2.execEventOnGo("connect", eventsOnGo);
            } else {
              _this2.EventTrigger("disconnect");

              _this2.execEventOnGo("disconnect", eventsOnGo);
            }
          } // Call on_finish_validation


          _this2.EventTrigger("finish");

          _this2.execEventOnGo("finish", eventsOnGo);
        });
      } else {
        // Call on disconnect
        this.EventTrigger("disconnect");
        this.execEventOnGo("disconnect", eventsOnGo); // Call on_finish_validation

        this.EventTrigger("finish");
        this.execEventOnGo("finish", eventsOnGo);
      }
    }
  }, {
    key: "EnableRecaptcha",
    value: function EnableRecaptcha() {
      var _this3 = this;

      // Create script for google
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "https://www.google.com/recaptcha/api.js?render=6LcL9qMUAAAAAKrMzirXeGXdcBRsnPzf7T4Zlmy1";

      s.onload = function () {
        setTimeout(function () {
          grecaptcha.ready(function () {
            grecaptcha.execute('6LcL9qMUAAAAAKrMzirXeGXdcBRsnPzf7T4Zlmy1', {
              action: 'homepage'
            }).then(function (token) {
              _this3.SendMsg("Recaptcha Enabled");

              _this3.recaptcha_token = token;
            });
          });
        }, 500);
      };

      var head = document.getElementsByTagName("head"); // If head is ok, add script

      if (typeof head[0] !== "undefined") {
        head[0].appendChild(s);
      }
    }
  }, {
    key: "EnableSocialLogin",
    value: function EnableSocialLogin(id_container_buttons) {
      var container = document.getElementById(id_container_buttons); // Create buttons

      var fb_button = document.createElement("button");
      fb_button.innerHTML = "FB";
      container.appendChild(fb_button); // Facebook SDK

      var s = document.createElement("script");
      s.async = "true";
      s.defer = "defer";
      s.type = "text/javascript";
      s.src = "https://connect.facebook.net/en_US/sdk.js";

      s.onload = function () {
        // Start fb
        window.fbAsyncInit = function () {
          FB.init({
            appId: '1712939795618034',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v3.3'
          });
        }; // Add event to fb


        fb_button.addEventListener("click", function () {
          console.log("lalala");
          FB.getLoginStatus(function (response) {
            if (typeof response.status !== "undefined") {
              if (response.status === "connected") {
                console.log(response.authResponse.userID);
              } else {}
            } else {}
          });
        });
      };

      var head = document.getElementsByTagName("head"); // If head is ok, add script

      if (typeof head[0] !== "undefined") {
        head[0].appendChild(s);
      }
    }
  }, {
    key: "MakeLogin",
    value: function MakeLogin(user, password, eventsOnGo) {
      var _this4 = this;

      if (!user) user = "";
      if (!password) password = "";
      if (!eventsOnGo) eventsOnGo = {};
      this.EventTrigger("start");
      this.execEventOnGo("start", eventsOnGo);
      this.DoPOST(this.primary_url + '/auth/login', {
        user: user,
        password: password
      }, function (data) {
        if (typeof data.auth !== "undefined") {
          if (data.auth === 1) {
            _this4.SetAuthToken(data.token);

            _this4.EventTrigger("connect");

            _this4.execEventOnGo("connect", eventsOnGo);
          } else {
            _this4.EventTrigger("disconnect");

            _this4.execEventOnGo("disconnect", eventsOnGo);
          }
        }

        _this4.EventTrigger("finish");

        _this4.execEventOnGo("finish", eventsOnGo);
      });
    }
  }, {
    key: "MakeLogout",
    value: function MakeLogout() {
      return this.UnsetAuthToken();
    }
  }, {
    key: "MakeRegister",
    value: function MakeRegister(user, password, password_confirm, eventsOnGo) {
      var _this5 = this;

      if (!user) user = "";
      if (!password) password = "";
      if (!password_confirm) password_confirm = "";
      if (!eventsOnGo) eventsOnGo = {};
      this.EventTrigger("start");
      this.execEventOnGo("start", eventsOnGo);
      var dataSend = {};
      dataSend.user = user;
      dataSend.password = password;
      dataSend.password_confirm = password_confirm;
      dataSend.recaptcha_token = this.recaptcha_token;
      this.DoPOST(this.primary_url + '/auth/register', dataSend, function (data) {
        if (typeof data.auth !== "undefined") {
          if (data.auth === 1) {
            _this5.SetAuthToken(data.token);

            _this5.EventTrigger("register_success");

            _this5.execEventOnGo("register_success", eventsOnGo);
          } else {
            _this5.EventTrigger("register_fail");

            _this5.execEventOnGo("register_fail", eventsOnGo);
          }
        }

        _this5.EventTrigger("finish");

        _this5.execEventOnGo("finish", eventsOnGo);
      }, eventsOnGo);
    }
  }]);

  return Auth;
}();



/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Auth = __webpack_require__(/*! ./auth */ "./src/auth.js")["default"];

module.exports = {
  Auth: Auth
};

/***/ })

/******/ });
//# sourceMappingURL=pl_api.bundle.js.map