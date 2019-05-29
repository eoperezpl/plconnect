export default class Auth {

    constructor() {

        this.recaptcha_token = false;

        //Default events
        this.events = {
            start: {
                callback: () => {},
                msg_error: "Event -> start callback is not function"
            },
            connect: {
                callback: () => {},
                msg_error: "Event -> connect callback is not function"
            },
            disconnect: {
                callback: () => {},
                msg_error: "Event -> disconnect callback is not function"
            },
            finish: {
                callback: () => {},
                msg_error: "Event -> finish callback is not function"
            },
            error: {
                callback: () => {},
                msg_error: "Event -> error callback is not function"
            },
            register_success: {
                callback: () => {},
                msg_error: "Event -> finish callback is not function"
            },
            register_fail: {
                callback: () => {},
                msg_error: "Event -> finish callback is not function"
            }
        };
        this.primary_url = "https://foservices.prensalibre.com";
        this.auth_id = "0f07e8e38a7b56f90912b3d0d874f7e7";

        this.FindAuthToken = () => {
            let response = false;
            const token = localStorage.getItem(this.auth_id);
            if (token !== null) {
                response = atob(token);
            }
            return response;
        };

        this.SetAuthToken = (token) => {
            localStorage.setItem(this.auth_id, btoa(token));
        };

        this.UnsetAuthToken = () => {
            localStorage.removeItem(this.auth_id);
            return !this.FindAuthToken();
        };

        this.parseJwt = (token) => {
            if (token) {
                var base64Url = token.split('.')[1];
                var base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(base64);
            }
            else{
                return false;
            }
        };

        this.DoPOST = (url, data, callback, eventsOnGo) => {

            if(!eventsOnGo) eventsOnGo = {};

            fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: new Headers(
                  {
                      'Content-Type': 'application/json'
                  }),
                cache: 'no-cache',
                body: JSON.stringify(data)
            })
              .then((response) => {
                  return response.json();
              })
              .then((response) => {
                  callback(response);
              })
              .catch((err) => {
                  this.EventTrigger("error");
                  this.execEventOnGo("error", eventsOnGo);
              });
        };

        this.SendMsg = (msg) => {
            console.log(`PL_API Says: ${msg}`);
        };

        this.execEventOnGo = (eventName, eventOnGoTree) => {
            if(typeof eventOnGoTree[eventName] !== "undefined") {
                const token = this.FindAuthToken();
                eventOnGoTree[eventName](this.parseJwt(token));
            }
        };

        this.execEvent = (eventName, paramsSend) => {
            // If the event exists
            if (typeof this.events[eventName] !== "undefined") {

                // If the callback exists
                if (typeof this.events[eventName].callback === "function") {
                    // Call event
                    const callbackTmp = this.events[eventName].callback;
                    callbackTmp(paramsSend);
                }
                else {
                    this.SendMsg(this.events[eventName].msg_error);
                }
            }
            else{
                this.SendMsg("The event '"+eventName+"' not exists");
            }
        };

        // Singleton in window
        if (window.PlConnectApiInstance) {
            return window.PlConnectApiInstance;
        }
        window.PlConnectApiInstance = this;
    }

    Event(event, callbackEvent) {

        if (typeof this.events[event] !== "undefined") {
            this.events[event].callback = callbackEvent;
        }
        else{
            console.log("Event '"+event+"' is not defined");
        }
    }

    EventTrigger(event) {
        const token = this.FindAuthToken();
        this.execEvent(event, this.parseJwt(token));
    }

    CheckLogin(eventsOnGo) {

        if (!eventsOnGo) eventsOnGo = {};

        // Exec start callback
        this.EventTrigger("start");
        this.execEventOnGo("start", eventsOnGo);

        // Check token
        const token = this.FindAuthToken();

        // If token exists
        if (token) {
            this.DoPOST(this.primary_url + '/auth/check', {token: token}, (data) => {

                if (typeof data.auth !== "undefined") {
                    if (data.auth === 1) {
                        this.SendMsg("** User connected **");
                        this.EventTrigger("connect");
                        this.execEventOnGo("connect", eventsOnGo);
                    }
                    else {
                        this.EventTrigger("disconnect");
                        this.execEventOnGo("disconnect", eventsOnGo);
                    }
                }
                // Call on_finish_validation
                this.EventTrigger("finish");
                this.execEventOnGo("finish", eventsOnGo);
            });
        }
        else {
            // Call on disconnect
            this.EventTrigger("disconnect");
            this.execEventOnGo("disconnect", eventsOnGo);

            // Call on_finish_validation
            this.EventTrigger("finish");
            this.execEventOnGo("finish", eventsOnGo);
        }
    };

    EnableRecaptcha() {
        // Create script for google
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://www.google.com/recaptcha/api.js?render=6LcL9qMUAAAAAKrMzirXeGXdcBRsnPzf7T4Zlmy1";
        s.onload = () => {
            setTimeout(()=>{
                grecaptcha.ready(() => {
                    grecaptcha.execute('6LcL9qMUAAAAAKrMzirXeGXdcBRsnPzf7T4Zlmy1', {action: 'homepage'}).then((token) => {
                        this.SendMsg("Recaptcha Enabled");
                        this.recaptcha_token = token;
                    });
                });
            }, 500);
        };
        var head = document.getElementsByTagName("head");

        // If head is ok, add script
        if (typeof head[0] !== "undefined") {
            head[0].appendChild(s);
        }
    }

    EnableSocialLogin(id_container_buttons) {

        var container = document.getElementById(id_container_buttons);

        // Create buttons
        var fb_button = document.createElement("button");
        fb_button.innerHTML = "FB";
        container.appendChild(fb_button);

        // Facebook SDK
        var s = document.createElement("script");
        s.async = "true";
        s.defer = "defer";
        s.type = "text/javascript";
        s.src = "https://connect.facebook.net/en_US/sdk.js";
        s.onload = () => {

            // Start fb
            window.fbAsyncInit = function() {
                FB.init({
                    appId            : '1712939795618034',
                    autoLogAppEvents : true,
                    xfbml            : true,
                    version          : 'v3.3'
                });
            };

            // Add event to fb
            fb_button.addEventListener("click", () => {
                console.log("lalala");
                FB.getLoginStatus((response) => {
                    if (typeof response.status !== "undefined") {
                        if (response.status === "connected") {
                            console.log(response.authResponse.userID);
                        }
                        else{

                        }
                    }
                    else {

                    }
                })
            });
        };
        var head = document.getElementsByTagName("head");
        // If head is ok, add script
        if (typeof head[0] !== "undefined") {
            head[0].appendChild(s);
        }
    }

    MakeLogin(user, password, eventsOnGo) {

        if(!user) user = "";
        if(!password) password = "";
        if(!eventsOnGo) eventsOnGo = {};

        this.EventTrigger("start");
        this.execEventOnGo("start", eventsOnGo);

        this.DoPOST(this.primary_url + '/auth/login', {user: user, password: password}, (data) => {

            if (typeof data.auth !== "undefined") {
                if (data.auth === 1) {
                    this.SetAuthToken(data.token);
                    this.EventTrigger("connect");
                    this.execEventOnGo("connect", eventsOnGo);
                }
                else {
                    this.EventTrigger("disconnect");
                    this.execEventOnGo("disconnect", eventsOnGo);
                }
            }
            this.EventTrigger("finish");
            this.execEventOnGo("finish", eventsOnGo);
        });
    }

    MakeLogout() {
        return this.UnsetAuthToken();
    }

    MakeRegister(user, password, password_confirm, eventsOnGo) {

        if(!user) user = "";
        if(!password) password = "";
        if(!password_confirm) password_confirm = "";
        if(!eventsOnGo) eventsOnGo = {};

        this.EventTrigger("start");
        this.execEventOnGo("start", eventsOnGo);

        const dataSend = {};
        dataSend.user = user;
        dataSend.password = password;
        dataSend.password_confirm = password_confirm;
        dataSend.recaptcha_token = this.recaptcha_token;

        this.DoPOST(this.primary_url + '/auth/register', dataSend, (data) => {

            if (typeof data.auth !== "undefined") {
                if (data.auth === 1) {
                    this.SetAuthToken(data.token);
                    this.EventTrigger("register_success");
                    this.execEventOnGo("register_success", eventsOnGo);
                }
                else {
                    this.EventTrigger("register_fail");
                    this.execEventOnGo("register_fail", eventsOnGo);
                }
            }
            this.EventTrigger("finish");
            this.execEventOnGo("finish", eventsOnGo);
        }, eventsOnGo);
    }
}