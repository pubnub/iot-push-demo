/* Cordova Push Notification Demo
 * index.js - this file should be in your_cordova_app_root/www/js
 * Also, you need PushNotification.js and PubNub.js in the dir too.
 *
 * Install Cordova Deivce Plugin w/ CLI...
 * $ cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git 
 *
 * Install Cordova Push Plugin w/ CLI...
 * $ cordova plugin add https://github.com/phonegap-build/PushPlugin.git 
 */

var channel = '';
var t = document.getElementById('temperature');
var pushNotification;

var pubnub = PUBNUB.init({
        subscribe_key: 'sub-c-f762fb78-2724-11e4-a4df-02ee2ddab7fe',
        publish_key:   'pub-c-156a6d5f-22bd-4a13-848d-b5b4d4b36695',
    });

function initialize() {
    bindEvents();
}
function bindEvents() {
    document.addEventListener('deviceready', init, false); 
}

function init() {
    pushNotification = window.plugins.pushNotification;

    if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
        pushNotification.register(successHandler, errorHandler, {
            'senderID':'837099162939',
            'ecb':'onNotificationGCM'
        });
    } else { // iOS
        pushNotification.register(tokenHandler, errorHandler, {
            'badge':'false',
            'sound':'false',
            'alert':'true',
            'ecb':'onNotificationAPN'
        }); 
    }
}

// Android
function successHandler(result) {
    console.log('Success: '+ result);
}

// iOS
function tokenHandler (result) {
    console.log('device token: '+ result);

    // Your iOS push server needs to know the token before it can push to this device
    channel = result.substr(result.length - 7).toLowerCase();

    var c = document.querySelector('.channel');
    c.innerHTML = 'Your Device ID: <strong>' + channel + '</strong>';
    c.classList.remove('blink'); 

    pubnub.publish({
        channel: channel,
        message: {
            regid: result
        },
        callback: function(m) {console.log(m);}
    });

    pubnub.subscribe({
        channel: channel,
        callback: function(m) {
            console.log(m);
            t.classList.remove('gears');
            if(m.setting) {
                t.textContent = m.setting + '°';
            }
        }
    });  
}

function errorHandler(error) {
    console.log('Error: '+ error);
}

function onNotificationGCM(e) {
    switch( e.event ){
        case 'registered':
            if ( e.regid.length > 0 ){
                console.log('regid = '+e.regid);
                deviceRegistered(e.regid);
            }
        break;

        case 'message':
            console.log(e);
            if (e.foreground){
                alert('The room temperature is set too high')
            }
        break;

        case 'error':
            console.log('Error: '+e.msg);
        break;

        default:
          console.log('An unknown event was received');
          break;
    }
}

function onNotificationAPN(e) {
    // Event callback that gets called when your device receives a notification
    console.log('onNotificationAPN called!');
    console.log(e);

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
    if (e.sound) {
        var sound = new Media(e.sound);
        sound.play();
    }
    if (e.alert) {
        navigator.notification.alert(e.alert);
    }
}

// Publish the channel name and regid to PubNub
function deviceRegistered(regid) {
    channel = regid.substr(regid.length - 8).toLowerCase();

    var c = document.querySelector('.channel');
    c.innerHTML = 'Your Device ID: <strong>' + channel + '</strong>';
    c.classList.remove('blink'); 

    pubnub.publish({
        channel: channel,
        message: {
            regid: regid
        }
    });

    pubnub.subscribe({
        channel: channel,
        callback: function(m) {
            console.log(m);
            t.classList.remove('gears');
            if(m.setting) {
                t.textContent = m.setting + '°';
            }
        }
    });  
}


initialize();

