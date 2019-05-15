export default class Auth {

    constructor() {

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

        this.DoPOST = (url, data, callback) => {

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
                  console.error(err);
              });
        };

        this.SendMsg = (msg) => {
            console.log(msg);
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

    MakeLogin(user, password, eventsOnGo) {

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

    MakeRegister() {

    }
}