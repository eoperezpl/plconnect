export default class Auth {

    constructor() {

        this.recaptcha_token = false;

        this.sso_url = "https://sso.prensalibre.com";

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
            polls: {
                callback: () => {},
                msg_error: "Event -> polls callback is not function"
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
        this.auth_socials = "5f27a8efzc452v7b56f90912bcdpoeRe5";
        this.auth_back = "932dfaf278s5f8t5h4sdf6348fzbcml4f";
        this.auth_accounts = "68s5f47w8s5f4asc25sdfa3sdf87cxgpeb";

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

        this.FindAuthBack = () => {
            let response = false;
            const back = localStorage.getItem(this.auth_back);
            if (back !== null) {
                response = back;
            }
            return response;
        };

        this.SetAuthBack = (back) => {
            localStorage.setItem(this.auth_back, back);
        };

        this.FindSocialData = () => {
            let response = false;
            const data = localStorage.getItem(this.auth_socials);
            if (data !== null) {
                try {
                    response = JSON.parse(data);
                }
                catch(e){
                    response = {};
                }

            }
            return response;
        };

        this.SetSocialData = (data, social) => {
            let dataToSave = "";
            data.social = social;
            try {
                dataToSave = JSON.stringify(data);
            }
            catch(e){
                dataToSave = "";
            }
            localStorage.setItem(this.auth_socials, dataToSave);
        };

        this.UnsetAuthToken = () => {
            localStorage.removeItem(this.auth_id);
            return !this.FindAuthToken();
        };

        this.parseJwt = (token) => {
            if (token) {
                var base64Url = token.split('.')[1];
                var base64 = decodeURIComponent(atob(base64Url).split('').map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(base64);
            }
            else{
                return false;
            }
        };

        this.DoPOST = (url, data, callback, eventsOnGo) => {

            // autoset token
            if(typeof data["token"] === "undefined") {
                data["token"] = this.FindAuthToken();
            }

            if(!eventsOnGo) eventsOnGo = {};

            fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: new Headers(
                  {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin':'*'
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
                  this.SendMsg(err);
                  this.EventTrigger("error");
                  this.execEventOnGo("error", eventsOnGo);
              });
        };

        this.DoGET = (url, data, callback, eventsOnGo) => {

            // If is an get request, DONT SEND TOKEN

            if(!eventsOnGo) eventsOnGo = {};

            let query = Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');

            fetch(url+"?"+query, {
                method: 'GET',
                mode: 'cors',
                headers: new Headers(
                  {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin':'*'
                  }),
                cache: 'no-cache',
            })
              .then((response) => {
                  return response.json();
              })
              .then((response) => {
                  callback(response);
              })
              .catch((err) => {
                  this.SendMsg(err);
                  this.EventTrigger("error");
                  this.execEventOnGo("error", eventsOnGo);
              });
        };

        this.SendMsg = (msg) => {
            console.log(`PL_API Says: ${msg}`);
        };

        this.execEventOnGo = (eventName, eventOnGoTree, params) => {
            if(!params) params = false;
            if(typeof eventOnGoTree[eventName] !== "undefined") {
                const token = this.FindAuthToken();
                if(!params) params = this.parseJwt(token);

                eventOnGoTree[eventName](params);
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

        this.getValidUrl = (url = '') => {
            let newUrl = window.decodeURIComponent(url);
            newUrl = newUrl
              .trim()
              .replace(/\s/g, '');
            if (/^(:\/\/)/.test(newUrl)) {
                return `http${newUrl}`;
            }
            if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
                return `http://${newUrl}`;
            }
            return newUrl;
        };

        // Set back url
        const urlParams = new URLSearchParams(window.location.search);
        const back_uri = urlParams.get('back');

        if (back_uri !== null) {
            this.SetAuthBack(back_uri);
        }

        // Singleton in window
        if (window.PlConnectApiInstance) {
            return window.PlConnectApiInstance;
        }
        window.PlConnectApiInstance = this;
    }

    AccountsFind() {
        let response = false;
        const data = localStorage.getItem(this.auth_accounts);
        if (data !== null) {
            try {
                response = JSON.parse(data);
            }
            catch(e){
                response = {};
            }

        }
        return response;
    };

    AccountSave(account, name) {

        const accounts = this.AccountsFind();

        let accountsToSave = {};

        if (accounts !== false && Object.keys(accounts).length > 0) {
            Object.keys(accounts).map(function(key, index) {
                accountsToSave[key] = accounts[key];
            });
        }
        accountsToSave[account] = name;

        // Save all
        let dataToSave = "";
        try {
            dataToSave = JSON.stringify(accountsToSave);
        }
        catch(e){
            dataToSave = "";
        }
        localStorage.setItem(this.auth_accounts, dataToSave);
    };

    Event(event, callbackEvent) {

        if (typeof this.events[event] !== "undefined") {
            this.events[event].callback = callbackEvent;
        }
        else{
            console.log("Event '"+event+"' is not defined");
        }
    }

    EventTrigger(event, params) {
        const token = this.FindAuthToken();
        if(!params) params = null;

        if (params === null) {
            params = this.parseJwt(token);
        }
        this.execEvent(event, params);
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

                        // save account logged
                        this.AccountSave(data.email, data.name+" "+data.lastname);

                        // Check polls
                        if (typeof data.polls !== "undefined") {
                            // Fire events
                            this.SendMsg("** User has polls **");
                            this.EventTrigger("polls", data.polls);
                            this.execEventOnGo("polls", eventsOnGo, data.polls);
                        }
                        else{
                            // Redirect to back
                            this.RedirectToBackURL();
                        }
                        // Fire events
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

            // check auth login if the user is disconnect
            this.AuthSocialLogin();
        }
    };

    RedirectToBackURL(urlBack) {
        // If the back url is ok, redirect
        if(!urlBack) urlBack = false;
        const backUrl = this.FindAuthBack();

        if (backUrl !== "" && backUrl !== "false" && backUrl !== false) {
            // clear authback
            this.SendMsg("Redirecting to \""+backUrl+"\".");
            this.SetAuthBack("");
            window.location.href = this.getValidUrl(backUrl);
        }
        else {
            window.location.href = this.getValidUrl(urlBack);
            this.SendMsg("URL Back is not config");
        }
    }

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

    AuthSocialLogin(eventsOnGo) {

        if(!eventsOnGo) eventsOnGo = {};

        //let socials_data = localStorage.getItem(this.auth_socials);
        let socials_data = this.FindSocialData();

        if (socials_data) {

            const urlParams = new URLSearchParams(window.location.search);

            const verifyTokens = (dataSend) => {
                this.DoPOST("https://foservices.prensalibre.com/auth/social-check", dataSend, (data) => {

                    if (typeof data.auth !== "undefined" && typeof data.token !== "undefined") {
                        if (data.auth === 1) {
                            this.SetAuthToken(data.token);
                            this.SetSocialData({}, socials_data.social); // clean the socialdata
                            this.EventTrigger("register_success");
                            this.execEventOnGo("register_success", eventsOnGo);
                            // Check login again
                            this.CheckLogin(eventsOnGo);
                        }
                        else {
                            this.EventTrigger("register_fail");
                            this.execEventOnGo("register_fail", eventsOnGo);
                        }
                    }
                    this.EventTrigger("finish");
                    this.execEventOnGo("finish", eventsOnGo);
                });
            };

            // Twitter
            if(socials_data.social === "twitter") {

                const oauth_token = urlParams.get('oauth_token');
                const oauth_verifier = urlParams.get('oauth_verifier');

                if (oauth_token !== null && oauth_verifier !== null) {

                    const data = {};
                    data.opt = 'check_token';
                    data.social = socials_data.social;
                    data.oauth_token = oauth_token;
                    data.oauth_verifier = oauth_verifier;

                    // Send to verify
                    verifyTokens(data);
                }
            }
            // Facebook
            else if(socials_data.social === "facebook") {

                let accessToken = null;
                let signedRequest = null;

                if (typeof socials_data.accessToken !== "undefined" && typeof socials_data.signedRequest !== "undefined") {
                    accessToken = socials_data.accessToken;
                    signedRequest = socials_data.signedRequest;
                }

                if (accessToken !== null && signedRequest !== null) {

                    const data = {};
                    data.opt = 'check_token';
                    data.social = socials_data.social;
                    data.accessToken = accessToken;
                    data.signedRequest = signedRequest;

                    // Send to verify
                    verifyTokens(data);
                }
            }
            // Google+
            else if(socials_data.social === "googleplus") {

                let accessToken = null;

                if (typeof socials_data.accessToken !== "undefined" && typeof socials_data.idToken !== "undefined") {
                    accessToken = socials_data.accessToken;
                }

                if (accessToken !== null) {

                    const data = {};
                    data.opt = 'check_token';
                    data.social = socials_data.social;
                    data.idToken = socials_data.idToken;
                    data.accessToken = accessToken;

                    // Send to verify
                    verifyTokens(data);
                }
            }
            // Linkedin
            else if(socials_data.social === "linkedin") {

                const oauth_token = urlParams.get('code');

                if (oauth_token !== null) {

                    const data = {};
                    data.opt = 'check_token';
                    data.social = socials_data.social;
                    data.oauth_token = oauth_token;

                    // Send to verify
                    verifyTokens(data);
                }
            }
            else{
                window.location.href = this.sso_url;
            }
        }
    }

    DoSocialLogin(social_network, action, eventsOnGo) {

        const self = this;
        if(!action) action = "start";
        if(!eventsOnGo) eventsOnGo = {};

        // Head for async scripts
        var head = document.getElementsByTagName("head");

        if (social_network === "facebook") {

            // trigger start event
            this.EventTrigger("start");

            // Load Facebook SDK
            const s = document.createElement("script");
            s.async = "true";
            s.defer = "defer";
            s.type = "text/javascript";
            s.src = "https://connect.facebook.net/en_US/sdk.js";
            s.onerror = function() {
                self.EventTrigger("error", "Tu navegador tiene habilitado el bloqueo de contenido, debes desactivarlo para poder iniciar sesión con Facebook");
                self.execEventOnGo("error", eventsOnGo);
                self.EventTrigger("finish");
            };
            s.onload = () => {

                // Start fb
                window.fbAsyncInit = function() {
                    FB.init({
                        appId            : '1044051069317309',
                        autoLogAppEvents : true,
                        xfbml            : true,
                        version          : 'v3.3'
                    });
                };

                const handleFb = (data) => {
                    if (data !== null) {
                        if (typeof data.accessToken !== "undefined") {
                            self.SetSocialData(data, social_network);
                            this.AuthSocialLogin();
                        }
                    }
                };

                FB.getLoginStatus((response) => {
                    if (typeof response.status !== "undefined") {
                        if (response.status === "connected") {
                            handleFb(response.authResponse);
                        }
                        else {
                            // I need start session and authorize
                            FB.login(function(response) {
                                handleFb(response.authResponse);
                            }, {scope: 'public_profile,email'});
                        }
                    }
                    else {
                        this.SendMsg("Error with facebook requests");
                    }
                    self.EventTrigger("finish");
                });
            };
            // If head is ok, add script
            if (typeof head[0] !== "undefined") {
                head[0].appendChild(s);
            }
        }
        else if (social_network === "twitter") {

            // trigger start event
            this.EventTrigger("start");

            // data for fo services
            const data = {};
            data.opt = action;
            data.social = social_network;

            const token =  this.DoPOST("https://foservices.prensalibre.com/auth/social-check", data, (data) => {
                if(typeof data.operation !== "undefined") {

                    if (data.operation === "start") {
                        // save social data and redirect
                        self.SetSocialData(data, social_network);
                        window.location.href = data.response;
                    }
                }
                self.EventTrigger("finish");
            });
        }
        else if (social_network === "googleplus") {

            // trigger start event
            this.EventTrigger("start");

            // Load Facebook SDK
            var s = document.createElement("script");
            s.async = "true";
            s.defer = "defer";
            s.type = "text/javascript";
            s.src = "https://apis.google.com/js/platform.js?onload=init";
            s.onerror = function() {
                self.EventTrigger("error", "Tu navegador tiene habilitado el bloqueo de contenido, debes desactivarlo para poder iniciar sesión con Google+");
                self.execEventOnGo("error", eventsOnGo);
                self.EventTrigger("finish");
            };
            s.onload = () => {

                gapi.load('auth2', function() {
                    // Retrieve the singleton for the GoogleAuth library and set up the client.
                    gapi.auth2.init({
                        client_id: '789855992784-58jngeah5o7rlee4kcujeat020rel4nj.apps.googleusercontent.com',
                        scope: "profile email"
                    }).then(function(auth2) {

                        // Sign the user in, and then retrieve their ID.
                        auth2.signIn().then(function() {
                            try {
                                const authUser = auth2.currentUser.get();
                                const userId = authUser.getId();
                                const accessToken = authUser.getAuthResponse().access_token;
                                const idToken = authUser.getAuthResponse().id_token;

                                if (userId !== "" && accessToken !== "" && idToken !== "") {
                                    const data = {
                                        user_id: userId,
                                        accessToken: accessToken,
                                        idToken: idToken,
                                    };
                                    self.SetSocialData(data, social_network);
                                    self.AuthSocialLogin();
                                }
                            }
                            catch(e) {
                                self.SendMsg("Error to sign with Google");
                            }
                        });
                        self.EventTrigger("finish");
                    });
                });
            };

            // If head is ok, add script
            if (typeof head[0] !== "undefined") {
                head[0].appendChild(s);
            }
        }
        else if (social_network === "linkedin") {

            // trigger start event
            this.EventTrigger("start");

            // data for fo services
            const data = {};
            data.opt = action;
            data.social = social_network;

            const token =  this.DoPOST("https://foservices.prensalibre.com/auth/social-check", data, (data) => {
                if(typeof data.operation !== "undefined") {

                    if (data.operation === "start") {
                        // save social data and redirect
                        self.SetSocialData(data, social_network);
                        window.location.href = data.response;
                    }
                }
                self.EventTrigger("finish");
            });
        }
        else{
            this.SendMsg("Social '"+social_network+"' network not available");
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
                    // Validate token for security
                    this.CheckLogin(eventsOnGo);
                }
                else {
                    this.EventTrigger("disconnect");
                    this.execEventOnGo("disconnect", eventsOnGo);
                    this.EventTrigger("finish");
                    this.execEventOnGo("finish", eventsOnGo);
                }
            }
            else{
                this.EventTrigger("finish");
                this.execEventOnGo("finish", eventsOnGo);
            }
        });
    }

    MakeLogout() {
        return this.UnsetAuthToken();
    }

    MakeRegister(user, password, password_confirm, name, lastname, eventsOnGo) {

        if(!user) user = "";
        if(!password) password = "";
        if(!password_confirm) password_confirm = "";
        if(!name) name = "";
        if(!lastname) lastname = "";
        if(!eventsOnGo) eventsOnGo = {};

        this.EventTrigger("start");
        this.execEventOnGo("start", eventsOnGo);

        const dataSend = {};
        dataSend.user = user;
        dataSend.password = password;
        dataSend.password_confirm = password_confirm;
        dataSend.name = name;
        dataSend.lastname = lastname;
        dataSend.recaptcha_token = this.recaptcha_token;

        this.DoPOST(this.primary_url + '/auth/register', dataSend, (data) => {

            if (typeof data.auth !== "undefined" && typeof data.token !== "undefined") {
                if (data.auth === 1) {
                    this.SetAuthToken(data.token);
                    this.EventTrigger("register_success");
                    this.execEventOnGo("register_success", eventsOnGo);
                    // Check login again
                    this.CheckLogin(eventsOnGo);
                }
                else {
                    this.EventTrigger("register_fail");
                    this.execEventOnGo("register_fail", eventsOnGo);
                }
            }
            else{
                this.EventTrigger("register_fail");
                this.execEventOnGo("register_fail", eventsOnGo);
            }
            this.EventTrigger("finish");
            this.execEventOnGo("finish", eventsOnGo);
        }, eventsOnGo);
    }
}