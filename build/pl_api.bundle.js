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

    this.recaptcha_token = false;
    this.sso_url = "https://sso.prensalibre.com"; //Default events

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
      polls: {
        callback: function callback() {},
        msg_error: "Event -> polls callback is not function"
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
    this.auth_socials = "5f27a8efzc452v7b56f90912bcdpoeRe5";
    this.auth_back = "932dfaf278s5f8t5h4sdf6348fzbcml4f";
    this.auth_accounts = "68s5f47w8s5f4asc25sdfa3sdf87cxgpeb";

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

    this.FindAuthBack = function () {
      var response = false;
      var back = localStorage.getItem(_this.auth_back);

      if (back !== null) {
        response = back;
      }

      return response;
    };

    this.SetAuthBack = function (back) {
      localStorage.setItem(_this.auth_back, back);
    };

    this.FindSocialData = function () {
      var response = false;
      var data = localStorage.getItem(_this.auth_socials);

      if (data !== null) {
        try {
          response = JSON.parse(data);
        } catch (e) {
          response = {};
        }
      }

      return response;
    };

    this.SetSocialData = function (data, social) {
      var dataToSave = "";
      data.social = social;

      try {
        dataToSave = JSON.stringify(data);
      } catch (e) {
        dataToSave = "";
      }

      localStorage.setItem(_this.auth_socials, dataToSave);
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
      // autoset token
      if (typeof data["token"] === "undefined") {
        data["token"] = _this.FindAuthToken();
      }

      if (!eventsOnGo) eventsOnGo = {};
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }),
        cache: 'no-cache',
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        callback(response);
      })["catch"](function (err) {
        _this.SendMsg(err);

        _this.EventTrigger("error");

        _this.execEventOnGo("error", eventsOnGo);
      });
    };

    this.DoGET = function (url, data, callback, eventsOnGo) {
      // If is an get request, DONT SEND TOKEN
      if (!eventsOnGo) eventsOnGo = {};
      var query = Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      }).join('&');
      fetch(url + "?" + query, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }),
        cache: 'no-cache'
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        callback(response);
      })["catch"](function (err) {
        _this.SendMsg(err);

        _this.EventTrigger("error");

        _this.execEventOnGo("error", eventsOnGo);
      });
    };

    this.SendMsg = function (msg) {
      console.log("PL_API Says: ".concat(msg));
    };

    this.execEventOnGo = function (eventName, eventOnGoTree, params) {
      if (!params) params = false;

      if (typeof eventOnGoTree[eventName] !== "undefined") {
        var token = _this.FindAuthToken();

        if (!params) params = _this.parseJwt(token);
        eventOnGoTree[eventName](params);
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
    };

    this.getValidUrl = function () {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var newUrl = window.decodeURIComponent(url);
      newUrl = newUrl.trim().replace(/\s/g, '');

      if (/^(:\/\/)/.test(newUrl)) {
        return "http".concat(newUrl);
      }

      if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
        return "http://".concat(newUrl);
      }

      return newUrl;
    }; // Set back url


    var urlParams = new URLSearchParams(window.location.search);
    var back_uri = urlParams.get('back');

    if (back_uri !== null) {
      this.SetAuthBack(back_uri);
    } // Singleton in window


    if (window.PlConnectApiInstance) {
      return window.PlConnectApiInstance;
    }

    window.PlConnectApiInstance = this;
  }

  _createClass(Auth, [{
    key: "AccountsFind",
    value: function AccountsFind() {
      var response = false;
      var data = localStorage.getItem(this.auth_accounts);

      if (data !== null) {
        try {
          response = JSON.parse(data);
        } catch (e) {
          response = {};
        }
      }

      return response;
    }
  }, {
    key: "AccountSave",
    value: function AccountSave(account, name) {
      var accounts = this.AccountsFind();
      var accountsToSave = {};

      if (accounts !== false && Object.keys(accounts).length > 0) {
        Object.keys(accounts).map(function (key, index) {
          accountsToSave[key] = accounts[key];
        });
      }

      accountsToSave[account] = name; // Save all

      var dataToSave = "";

      try {
        dataToSave = JSON.stringify(accountsToSave);
      } catch (e) {
        dataToSave = "";
      }

      localStorage.setItem(this.auth_accounts, dataToSave);
    }
  }, {
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
    value: function EventTrigger(event, params) {
      var token = this.FindAuthToken();
      if (!params) params = null;

      if (params === null) {
        params = this.parseJwt(token);
      }

      this.execEvent(event, params);
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
              // save account logged
              _this2.AccountSave(data.email, data.name + " " + data.lastname); // Check polls


              if (typeof data.polls !== "undefined") {
                // Fire events
                _this2.SendMsg("** User has polls **");

                _this2.EventTrigger("polls", data.polls);

                _this2.execEventOnGo("polls", eventsOnGo, data.polls);
              } else {
                // Redirect to back
                _this2.RedirectToBackURL();
              } // Fire events


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
        this.execEventOnGo("finish", eventsOnGo); // check auth login if the user is disconnect

        this.AuthSocialLogin();
      }
    }
  }, {
    key: "RedirectToBackURL",
    value: function RedirectToBackURL(urlBack) {
      // If the back url is ok, redirect
      if (!urlBack) urlBack = false;
      var backUrl = this.FindAuthBack();

      if (backUrl !== "" && backUrl !== "false" && backUrl !== false) {
        // clear authback
        this.SendMsg("Redirecting to \"" + backUrl + "\".");
        this.SetAuthBack("");
        window.location.href = this.getValidUrl(backUrl);
      } else {
        window.location.href = this.getValidUrl(urlBack);
        this.SendMsg("URL Back is not config");
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
    key: "AuthSocialLogin",
    value: function AuthSocialLogin(eventsOnGo) {
      var _this4 = this;

      if (!eventsOnGo) eventsOnGo = {}; //let socials_data = localStorage.getItem(this.auth_socials);

      var socials_data = this.FindSocialData();

      if (socials_data) {
        var urlParams = new URLSearchParams(window.location.search);

        var verifyTokens = function verifyTokens(dataSend) {
          _this4.DoPOST("https://foservices.prensalibre.com/auth/social-check", dataSend, function (data) {
            if (typeof data.auth !== "undefined" && typeof data.token !== "undefined") {
              if (data.auth === 1) {
                _this4.SetAuthToken(data.token);

                _this4.SetSocialData({}, socials_data.social); // clean the socialdata


                _this4.EventTrigger("register_success");

                _this4.execEventOnGo("register_success", eventsOnGo); // Check login again


                _this4.CheckLogin(eventsOnGo);
              } else {
                _this4.EventTrigger("register_fail");

                _this4.execEventOnGo("register_fail", eventsOnGo);
              }
            }

            _this4.EventTrigger("finish");

            _this4.execEventOnGo("finish", eventsOnGo);
          });
        }; // Twitter


        if (socials_data.social === "twitter") {
          var oauth_token = urlParams.get('oauth_token');
          var oauth_verifier = urlParams.get('oauth_verifier');

          if (oauth_token !== null && oauth_verifier !== null) {
            var data = {};
            data.opt = 'check_token';
            data.social = socials_data.social;
            data.oauth_token = oauth_token;
            data.oauth_verifier = oauth_verifier; // Send to verify

            verifyTokens(data);
          }
        } // Facebook
        else if (socials_data.social === "facebook") {
            var accessToken = null;
            var signedRequest = null;

            if (typeof socials_data.accessToken !== "undefined" && typeof socials_data.signedRequest !== "undefined") {
              accessToken = socials_data.accessToken;
              signedRequest = socials_data.signedRequest;
            }

            if (accessToken !== null && signedRequest !== null) {
              var _data = {};
              _data.opt = 'check_token';
              _data.social = socials_data.social;
              _data.accessToken = accessToken;
              _data.signedRequest = signedRequest; // Send to verify

              verifyTokens(_data);
            }
          } // Google+
          else if (socials_data.social === "googleplus") {
              var _accessToken = null;

              if (typeof socials_data.accessToken !== "undefined" && typeof socials_data.idToken !== "undefined") {
                _accessToken = socials_data.accessToken;
              }

              if (_accessToken !== null) {
                var _data2 = {};
                _data2.opt = 'check_token';
                _data2.social = socials_data.social;
                _data2.idToken = socials_data.idToken;
                _data2.accessToken = _accessToken; // Send to verify

                verifyTokens(_data2);
              }
            } // Linkedin
            else if (socials_data.social === "linkedin") {
                var _oauth_token = urlParams.get('code');

                if (_oauth_token !== null) {
                  var _data3 = {};
                  _data3.opt = 'check_token';
                  _data3.social = socials_data.social;
                  _data3.oauth_token = _oauth_token; // Send to verify

                  verifyTokens(_data3);
                }
              } else {
                window.location.href = this.sso_url;
              }
      }
    }
  }, {
    key: "DoSocialLogin",
    value: function DoSocialLogin(social_network, action, eventsOnGo) {
      var _this5 = this;

      var self = this;
      if (!action) action = "start";
      if (!eventsOnGo) eventsOnGo = {}; // Head for async scripts

      var head = document.getElementsByTagName("head");

      if (social_network === "facebook") {
        // trigger start event
        this.EventTrigger("start"); // Load Facebook SDK

        var _s = document.createElement("script");

        _s.async = "true";
        _s.defer = "defer";
        _s.type = "text/javascript";
        _s.src = "https://connect.facebook.net/en_US/sdk.js";

        _s.onerror = function () {
          self.EventTrigger("error", "Tu navegador tiene habilitado el bloqueo de contenido, debes desactivarlo para poder iniciar sesión con Facebook");
          self.execEventOnGo("error", eventsOnGo);
          self.EventTrigger("finish");
        };

        _s.onload = function () {
          // Start fb
          window.fbAsyncInit = function () {
            FB.init({
              appId: '1044051069317309',
              autoLogAppEvents: true,
              xfbml: true,
              version: 'v3.3'
            });
          };

          var handleFb = function handleFb(data) {
            if (data !== null) {
              if (typeof data.accessToken !== "undefined") {
                self.SetSocialData(data, social_network);

                _this5.AuthSocialLogin();
              }
            }
          };

          FB.getLoginStatus(function (response) {
            if (typeof response.status !== "undefined") {
              if (response.status === "connected") {
                handleFb(response.authResponse);
              } else {
                // I need start session and authorize
                FB.login(function (response) {
                  handleFb(response.authResponse);
                }, {
                  scope: 'public_profile,email'
                });
              }
            } else {
              _this5.SendMsg("Error with facebook requests");
            }

            self.EventTrigger("finish");
          });
        }; // If head is ok, add script


        if (typeof head[0] !== "undefined") {
          head[0].appendChild(_s);
        }
      } else if (social_network === "twitter") {
        // trigger start event
        this.EventTrigger("start"); // data for fo services

        var data = {};
        data.opt = action;
        data.social = social_network;
        var token = this.DoPOST("https://foservices.prensalibre.com/auth/social-check", data, function (data) {
          if (typeof data.operation !== "undefined") {
            if (data.operation === "start") {
              // save social data and redirect
              self.SetSocialData(data, social_network);
              window.location.href = data.response;
            }
          }

          self.EventTrigger("finish");
        });
      } else if (social_network === "googleplus") {
        // trigger start event
        this.EventTrigger("start"); // Load Facebook SDK

        var s = document.createElement("script");
        s.async = "true";
        s.defer = "defer";
        s.type = "text/javascript";
        s.src = "https://apis.google.com/js/platform.js?onload=init";

        s.onerror = function () {
          self.EventTrigger("error", "Tu navegador tiene habilitado el bloqueo de contenido, debes desactivarlo para poder iniciar sesión con Google+");
          self.execEventOnGo("error", eventsOnGo);
          self.EventTrigger("finish");
        };

        s.onload = function () {
          gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            gapi.auth2.init({
              client_id: '789855992784-58jngeah5o7rlee4kcujeat020rel4nj.apps.googleusercontent.com',
              scope: "profile email"
            }).then(function (auth2) {
              // Sign the user in, and then retrieve their ID.
              auth2.signIn().then(function () {
                try {
                  var authUser = auth2.currentUser.get();
                  var userId = authUser.getId();
                  var accessToken = authUser.getAuthResponse().access_token;
                  var idToken = authUser.getAuthResponse().id_token;

                  if (userId !== "" && accessToken !== "" && idToken !== "") {
                    var _data4 = {
                      user_id: userId,
                      accessToken: accessToken,
                      idToken: idToken
                    };
                    self.SetSocialData(_data4, social_network);
                    self.AuthSocialLogin();
                  }
                } catch (e) {
                  self.SendMsg("Error to sign with Google");
                }
              });
              self.EventTrigger("finish");
            });
          });
        }; // If head is ok, add script


        if (typeof head[0] !== "undefined") {
          head[0].appendChild(s);
        }
      } else if (social_network === "linkedin") {
        // trigger start event
        this.EventTrigger("start"); // data for fo services

        var _data5 = {};
        _data5.opt = action;
        _data5.social = social_network;

        var _token = this.DoPOST("https://foservices.prensalibre.com/auth/social-check", _data5, function (data) {
          if (typeof data.operation !== "undefined") {
            if (data.operation === "start") {
              // save social data and redirect
              self.SetSocialData(data, social_network);
              window.location.href = data.response;
            }
          }

          self.EventTrigger("finish");
        });
      } else {
        this.SendMsg("Social '" + social_network + "' network not available");
      }
    }
  }, {
    key: "MakeLogin",
    value: function MakeLogin(user, password, keep_session, eventsOnGo) {
      var _this6 = this;

      if (!user) user = "";
      if (!password) password = "";
      if (!keep_session) keep_session = false;
      if (!eventsOnGo) eventsOnGo = {};
      this.EventTrigger("start");
      this.execEventOnGo("start", eventsOnGo);
      this.DoPOST(this.primary_url + '/auth/login', {
        user: user,
        password: password,
        keep_session: keep_session
      }, function (data) {
        if (typeof data.auth !== "undefined") {
          if (data.auth === 1) {
            _this6.SetAuthToken(data.token); // Validate token for security


            _this6.CheckLogin(eventsOnGo);
          } else {
            _this6.EventTrigger("disconnect");

            _this6.execEventOnGo("disconnect", eventsOnGo);

            _this6.EventTrigger("finish");

            _this6.execEventOnGo("finish", eventsOnGo);
          }
        } else {
          _this6.EventTrigger("finish");

          _this6.execEventOnGo("finish", eventsOnGo);
        }
      });
    }
  }, {
    key: "MakeLogout",
    value: function MakeLogout(eventsOnGo) {
      var disconnect = this.UnsetAuthToken();
      this.EventTrigger("disconnect");
      return disconnect;
    }
  }, {
    key: "MakeRegister",
    value: function MakeRegister(user, password, password_confirm, name, lastname, eventsOnGo) {
      var _this7 = this;

      if (!user) user = "";
      if (!password) password = "";
      if (!password_confirm) password_confirm = "";
      if (!name) name = "";
      if (!lastname) lastname = "";
      if (!eventsOnGo) eventsOnGo = {};
      this.EventTrigger("start");
      this.execEventOnGo("start", eventsOnGo);
      var dataSend = {};
      dataSend.user = user;
      dataSend.password = password;
      dataSend.password_confirm = password_confirm;
      dataSend.name = name;
      dataSend.lastname = lastname;
      dataSend.recaptcha_token = this.recaptcha_token;
      this.DoPOST(this.primary_url + '/auth/register', dataSend, function (data) {
        if (typeof data.auth !== "undefined" && typeof data.token !== "undefined") {
          if (data.auth === 1) {
            _this7.SetAuthToken(data.token);

            _this7.EventTrigger("register_success");

            _this7.execEventOnGo("register_success", eventsOnGo); // Check login again


            _this7.CheckLogin(eventsOnGo);
          } else {
            _this7.EventTrigger("register_fail");

            _this7.execEventOnGo("register_fail", eventsOnGo);
          }
        } else {
          _this7.EventTrigger("register_fail");

          _this7.execEventOnGo("register_fail", eventsOnGo);
        }

        _this7.EventTrigger("finish");

        _this7.execEventOnGo("finish", eventsOnGo);
      }, eventsOnGo);
    }
  }, {
    key: "GetUserID",
    value: function GetUserID() {
      var token = this.parseJwt(this.FindAuthToken());

      if (typeof token.sub !== "undefined") {
        return token.sub;
      } else {
        return 0;
      }
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