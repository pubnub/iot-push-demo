# [Demo] Simulated IoT panel desktop UI to send GCM push notifications to Android devices

A showcase demo and a quick tutorial of [PhoneGap][pg] and [PubNub][pubnub] data stream network JavaScript API, using a simulated IoT web user-interface to give you some use case ideas.

## How to try the demo

You need to pair an Android device with this [desktop app][desktop] to be able to receive push notificaations.

#### Android Instruction

 - Download [this apk][apk] and install it on your Android device 
 - Once your device is registered to this demo, you should get your 8-digit unique ID

 #### Desktop Instruction

 - Go to [pubnub.github.io/iot-push-demo][desktop]
 - Enter your 8-digit ID in the input box
 - Hover cursor over the temperature controller UI, and use mousewheel or trackpad to change the value
 - When you set the room temperature above **80F**, it sends you a push notification to your Android device


[pg]: http://phonegap.com
[pubnub]: http://www.pubnub.com/docs/javascript/javascript-sdk.html
[desktop]: https://pubnub.github.io/iot-push-demo
[apk]: https://github.com/pubnub/iot-push-demo/releases/tag/0.1
