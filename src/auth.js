
import Fingerprint from 'fingerprintjs2';
import {CrossStorageHub} from 'cross-storage';
import {CrossStorageClient} from 'cross-storage';

export default class Auth {

    constructor() {

        this.started = false;

        // Token for recaptcha
        this.recaptcha_token = false;

        // Sso URL
        this.sso_domain = "sso.prensalibre.com";
        this.sso_url = "https://"+this.sso_domain;

        // Queue for functions to exec after pl api start
        this.enqueue_functions = {};

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

        // data saved for system
        this.data = {
            token: "",
            token_socials: "",
            back: "",
            skip_polls: "",
            saved_accounts: "",
        };

        // Hub url
        this.hub_url = this.sso_url+"/externals/CheckSession";

        // Primary url for sso ws.
        this.primary_url = "https://foservices.prensalibre.com";

        // Get hub
        this.GetHub = () => {

            const self = this;

            const parseData = (dataToParse) => {
                if(!self.started) {
                    try {
                        // Save data
                        const parsed = JSON.parse(dataToParse);
                        if(parsed !== null) {
                            self.data = parsed;
                        }
                        self.started = true;
                    }
                    catch(e){
                        self.SendMsg("Error getting token, please try again");
                    }
                    // Execute function start
                    if(typeof self.enqueue_functions.start === "function"){
                        const tmpFunc = self.enqueue_functions.start;
                        // Exec start
                        tmpFunc();
                        // Exec finish event
                        self.EventTrigger("finish");
                    }
                }
            };

            if (window.location.hostname === this.sso_domain) {
                const data = localStorage.getItem("sso-data");
                parseData(data);
            }
            else{
                const storage = new CrossStorageClient(this.hub_url);
                storage.onConnect().then(function() {
                    return storage.get('sso-data');
                }).then(function(res) {
                    // Parse data
                    parseData(res);
                }).catch(function(err) {
                    // Handle error
                    console.log(err);
                }).then(function() {
                    storage.close();
                });
            }
        };

        // Update hub
        this.UpdateHub = () => {
            const self = this;

            // Update hub only works with sso because all domains is only read
            if (window.location.hostname === this.sso_domain) {
                localStorage.setItem('sso-data', JSON.stringify(self.data));

                /*const storage = new CrossStorageClient(this.hub_url);
                storage.onConnect().then(function() {
                    return storage.set('sso-data', JSON.stringify(self.data));
                }).then(function() {
                    storage.close();
                });*/
            }
        };

        // Find the auth token in storage
        this.FindAuthToken = () => {
            if (typeof this.data !== "undefined" && typeof this.data.token !== "undefined" && this.data.token !== "") {
               return atob(this.data.token);
            }
            return "";
        };

        // Save the auth token in storage
        this.SetAuthToken = (token) => {
            this.data.token = btoa(token);
            this.UpdateHub();
        };

        // Remove the auth token in storage
        this.UnsetAuthToken = () => {
            this.data.token = "";
            this.UpdateHub();
        };

        // Find the skip polls in storage
        this.FindSkipPolls = () => {
            if (typeof this.data !== "undefined" && typeof this.data.skip_polls !== "undefined") {
                return this.data.skip_polls;
            }
            return null;
        };

        // Save the skip polls in storage
        this.SetSkipPolls = (skip) => {
            this.data.skip_polls = skip;
            this.UpdateHub();
        };

        this.FindAuthBack = () => {
            if (typeof this.data !== "undefined" && typeof this.data.back !== "undefined") {
                return this.data.back;
            }
            return null;
        };

        this.SetAuthBack = (back) => {
            this.data.back = back;
            this.UpdateHub();
        };

        this.FindSocialData = () => {
            let response = false;
            if (typeof this.data !== "undefined" && typeof this.data.token_socials !== "undefined" && this.data.token_socials !== "") {
                try {
                    response = JSON.parse(this.data.token_socials);
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
            this.data.token_socials = dataToSave;
            this.UpdateHub();
        };

        // Parse Jwt token
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

        // Do post to primary url
        this.DoPOST = (url, data, callback, eventsOnGo) => {

            const self = this;

            // autoset token
            if(typeof data["token"] === "undefined") {
                data["token"] = this.FindAuthToken();
            }

            if(!eventsOnGo) eventsOnGo = {};

            Fingerprint.get(function (components) {

                const fingerprintValues = components.map(function (component) { return component.value });
                data["fingerprint"] = Fingerprint.x64hash128(fingerprintValues.join(''), 31);

                // fetch
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
                        self.SendMsg(err);
                        self.EventTrigger("error");
                        self.execEventOnGo("error", eventsOnGo);
                    });
            });


        };

        // Do Get to primary url
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

        // Send msg in console
        this.SendMsg = (msg) => {
            console.log(`PL_API Says: ${msg}`);
        };

        // Exec any envent "on go"
        this.execEventOnGo = (eventName, eventOnGoTree, params) => {
            if(!params) params = false;
            if(eventOnGoTree && typeof eventOnGoTree[eventName] !== "undefined") {
                const token = this.FindAuthToken();
                if(!params) params = this.parseJwt(token);

                eventOnGoTree[eventName](params);
            }
        };

        // Exec event
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

        // Return url adding http
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

        // Singleton in window
        if (window.PlConnectApiInstance) {
            return window.PlConnectApiInstance;
        }
        window.PlConnectApiInstance = this;

        // Get hub data
        this.GetHub();

        // Set back url
        const urlParams = new URLSearchParams(window.location.search);
        const back_uri = urlParams.get('back');
        const skip_polls = urlParams.get('skip_polls');

        // Set skip polls
        if (skip_polls !== null) {
            this.SetSkipPolls(1);
        }
        // Set back uri
        if (back_uri !== null) {
            this.SetAuthBack(back_uri);
        }
    }

    // Find saved accounts in device
    AccountsFind() {
        let response = false;
        if (typeof this.data.saved_accounts !== "undefined" && this.data.saved_accounts !== "") {
            try {
                response = JSON.parse(this.data.saved_accounts);
            }
            catch(e){
                response = {};
            }
        }
        return response;
    };

    // Save an account in the device
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
        this.data.saved_accounts = dataToSave;
        this.UpdateHub();
    };

    // Set any event callback
    Event(event, callbackEvent) {

        if (typeof this.events[event] !== "undefined") {
            this.events[event].callback = callbackEvent;
        }
        else{
            console.log("Event '"+event+"' is not defined");
        }
    }

    // Exec any event, this send automatically the login token
    EventTrigger(event, params) {
        const token = this.FindAuthToken();
        if(!params) params = null;

        if (params === null) {
            params = this.parseJwt(token);
        }
        this.execEvent(event, params);
    }

    // Check if an user is logged in the device
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

                        // find skip polls
                        const skip = this.FindSkipPolls();

                        // Check polls
                        if (typeof data.polls !== "undefined" && !skip) {
                            // Fire events
                            this.SendMsg("** User has polls **");
                            this.EventTrigger("polls", data.polls);
                            this.execEventOnGo("polls", eventsOnGo, data.polls);
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

    // Redirect app to url for back to original site
    RedirectToBackURL(urlBack) {
        // If the back url is ok, redirect
        if(!urlBack) urlBack = false;
        let backUrl = this.FindAuthBack();
        const token = this.FindAuthToken();

        if (urlBack) {
           backUrl = urlBack;
        }

        const urlHasVars = (backUrl.indexOf("?") > -1);
        const pattern = /^((http|https|ftp):\/\/)/;

        if (backUrl !== "" && backUrl !== "false" && backUrl) {
            // clear authback
            this.SendMsg("Redirecting to \""+backUrl+"\".");
            this.SetAuthBack("");

            if(!pattern.test(backUrl)) {
                window.location.href = backUrl;
            }
            else{
                window.location.href = this.getValidUrl(backUrl);
            }
        }
        else {
            //window.location.href = this.getValidUrl(urlBack);
            this.SendMsg("URL Back is not config");
        }
    }

    // Create an recaptcha for google, this is integrated with backend.
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

    // Enable libraries for login with socials
    AuthSocialLogin(eventsOnGo) {

        if(!eventsOnGo) eventsOnGo = {};

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
                            this.EventTrigger("finish");
                            this.execEventOnGo("finish", eventsOnGo);
                        }
                    }
                    else {
                        this.EventTrigger("finish");
                        this.execEventOnGo("finish", eventsOnGo);
                    }
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

    // Create requests for login with socials
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
                        self.EventTrigger("finish");
                    }
                    // self.EventTrigger("finish");
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
                else{
                    self.EventTrigger("finish");
                }
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
                                self.EventTrigger("finish");
                            }
                        });
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
                else{
                    self.EventTrigger("finish");
                }
            });
        }
        else{
            this.SendMsg("Social '"+social_network+"' network not available");
        }
    }

    // Attempt to login with backend, if the login it's ok, create sessions.
    MakeLogin(user, password, keep_session, eventsOnGo) {

        if(!user) user = "";
        if(!password) password = "";
        if(!keep_session) keep_session = false;
        if(!eventsOnGo) eventsOnGo = {};

        this.EventTrigger("start");
        this.execEventOnGo("start", eventsOnGo);

        this.DoPOST(this.primary_url + '/auth/login', {user: user, password: password, keep_session: keep_session}, (data) => {

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

    // Logout an user from app
    MakeLogout(eventsOnGo) {

        this.EventTrigger("start");
        this.execEventOnGo("start", eventsOnGo);

        this.DoPOST(this.primary_url + '/auth/logout', {}, (data) => {
            if (typeof data.status !== "undefined" && data.status === 1) {
                const disconnect = this.UnsetAuthToken();
                this.EventTrigger("disconnect");
                this.execEventOnGo("disconnect", eventsOnGo);
                return disconnect;
            }
            this.EventTrigger("finish");
            this.execEventOnGo("finish", eventsOnGo);
        });
    }

    // Attempt for register user in backend.
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

    // Create an PL api Hub, this is the storage for app, this uses only in sso.
    EnableSsoHub() {
        // Config s.t. subdomains can get, but only the root domain can set and del
        const access = ['get', 'set', 'del'];
        CrossStorageHub.init([
            {origin: /\.sso.prensalibre.com$/, allow: access},
            {origin: /:\/\/(www\.)?sso.prensalibre.com$/, allow: access},
            {origin: /\.pagos.prensalibre.com$/, allow: access},
            {origin: /:\/\/(www\.)?pagos.prensalibre.com$/, allow: access},
            {origin: /\.prensalibre.com$/, allow: access},
            {origin: /:\/\/(www\.)?prensalibre.com$/, allow: access},
            {origin: /\.guatevision.com$/, allow: access},
            {origin: /:\/\/(www\.)?guatevision.com$/, allow: access},
            {origin: /\.clasificadospl.com$/, allow: access},
            {origin: /:\/\/(www\.)?clasificadospl.com$/, allow: access},
        ]);
    }

    // Retrive the user id from token
    GetUserID() {
        const token = this.parseJwt(this.FindAuthToken());
        if(typeof token.sub !== "undefined") {
            return token.sub;
        }
        else{
            return 0;
        }
    }

    // This function is executed after PL Api start. This not have events on go
    Start(callback) {
        // If not have callback
        if (typeof callback !== "function") {
            this.SendMsg("Function Start require an callback");
           return false;
        }
        // Exec start callback
        this.EventTrigger("start");
        this.enqueue_functions.start = callback;

        if(this.started) {
            callback();
        }
    }
}