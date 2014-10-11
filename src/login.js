var phantom = require('phantom');
var config = require('./config');

var authUrl = 'https://accounts.spotify.com/authorize/?client_id=' + config.clientId + '&response_type=code&redirect_uri=' + config.redirectUri + '&scope=playlist-modify-private&show_dialog=true'

console.log('[login] Auth URL: ' + authUrl);
phantom.cookiesEnabled = false;

function enterDetailsAndLogin(page, callback) {
    page.evaluate(function(username, password) {
        function setText(el, text) {
            el.value = text;
            var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
            evt.initCustomEvent('input', false, false, null);
            el.dispatchEvent(evt);
        }

        var clickElement = function (el) {
            var ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
                    "click",
                    true /* bubble */, true /* cancelable */,
                    window, null,
                    0, 0, 0, 0, /* coordinates */
                    false, false, false, false, /* modifier keys */
                    0 /*left*/, null
                );
                el.dispatchEvent(ev);
        };

        clickElement(document.getElementsByClassName('btn-primary')[0]);
        setText(document.getElementById('login-password'), password);
        setText(document.getElementById('login-username'), username);
        setTimeout(function() {
            clickElement(document.getElementsByClassName('btn-primary')[0]);

            setTimeout(function() {
                clickElement(document.getElementsByClassName('btn-primary')[0]);

            }, 2000);
        }, 2000);
    }, function(result) {
        callback(result);
    }, config.loginUsername, config.loginPassword);
}

function getAuthCodeFromUrl(url) {
    return url.split('=')[1];
}

exports.loginAndGetAuthCode = function(returnAuthCodeCallback) {
    phantom.create(function (ph) {
        ph.clearCookies(function() {
            ph.createPage(function (page) {
                page.open(authUrl, function (status) {
                    console.log("[login] Opened spotify login page? ", status);
                    setTimeout(function(){
                        enterDetailsAndLogin(page, function () {
                            setTimeout(function() {
                                page.evaluate(function() {
                                    return window.location.href;
                                }, function(url) {
                                    page.render('foo.png');

                                    console.log('[login] final authorization code URL: ' + url);
                                    var authCode = getAuthCodeFromUrl(url);
                                    console.log('[login] auth code ' + authCode);

                                    returnAuthCodeCallback(authCode);
                                })
                            }, 10000);
                        });
                    }, 10000);
                });
            });
        });
    });
}
