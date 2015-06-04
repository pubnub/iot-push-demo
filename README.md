# Sending push notifications from Web app to Android devices (via GCM) and iOS devices (via APNS)

A showcase demo and a quick tutorial of [PhoneGap][pg] and [PubNub][pubnub] data stream network JavaScript API, using a simulated Smart room heater (à la Nest) web user-interface to give you some use case ideas.

![photo](https://raw.githubusercontent.com/pubnub/iot-push-demo/gh-pages/push-demo-photo.jpg)

## How to try the demo

This demo is only available for Android devices, due to the lack of openness of iOS app development.

There are two parts of demo- an Android app, and a web app.
First you access to the Android app to obtain your Registration ID, then you pair the device with the [desktop app][desktop] to be able to receive push notifications.

#### Android Instruction

 - Download [this apk][apk] and install it on your Android device 
 - Once your device is registered to this demo, you should get your 8-digit unique ID

#### Desktop Instruction

 - Go to [pubnub.github.io/iot-push-demo][desktop]
 - Enter your 8-digit ID in the input box
 - Hover cursor over the temperature controller UI, and use mousewheel or trackpad to change the value
 - When you set the room temperature above **80F**, it sends you a push notification to your Android device


## Source Code

This repo is for the web app only, however, I included the code to be used for Cordova/PhoneGap app under `cordova` folder.
The `index.js` file should be in `your_cordova_app_root/www/js` to build as an Android native app.

## Tutorials

I wrote a series of step-by-step instructions on how to send push notifications using Cordova plugin and PubNub APIs:

 - [Sending Android Push Notifications via GCM in JavaScript][cordova-gcm]
 - [Sending iOS Push Notifications via APNS in JavaScript][cordova-apns]

Also, I have PhoneGap/Cordova 101 tuts:

 - [Converting Your JavaScript App to an Android App w/ PhoneGap][cordova-blog-1]
 - [Converting Your JavaScript App to an iOS App w/ PhoneGap][cordova-blog-2]


[pg]: http://phonegap.com
[pubnub]: http://www.pubnub.com/docs/javascript/javascript-sdk.html
[desktop]: https://pubnub.github.io/iot-push-demo
[apk]: https://github.com/pubnub/iot-push-demo/releases/tag/0.1
[cordova-apns]: http://www.pubnub.com/blog/sending-ios-push-notifications-via-apns-javascript-using-apns-phonegap/
[cordova-gcm]: http://www.pubnub.com/blog/sending-android-push-notifications-via-gcm-javascript-using-phonegap/
[cordova-blog-1]: http://www.pubnub.com/blog/how-to-convert-your-javascript-app-into-an-android-app-with-phonegap/
[cordova-blog-2]: http://www.pubnub.com/blog/converting-your-javascript-app-to-an-ios-app-w-phonegap/
