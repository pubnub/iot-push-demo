/* 
 *  Push Notification Demo
 *  A simulated IoT panel desktop UI for Android GCM push notification demo using Cordova
 *  https://github.com/pubnub
 * 
 *  @girlie_mac (PubNub)
 *  License: MIT
 */

(function() {

    // Drawing temperature controller panel UI

    var width = 300;
    var height = 300;
    var tau = 2 * Math.PI;    
    var delta = 0.40;
    var minTemp = 40;
    var maxTemp = 95;
    var coldColor = '#F0CA78';
    var warmColor = '#F0788C';

    var i = d3.interpolateNumber(minTemp, maxTemp);
    var c = d3.interpolate(coldColor, warmColor);

    var arc = d3.svg.arc()
            .startAngle(0)
            .innerRadius(120)
            .outerRadius(150);

    var svg = d3.select('.container').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var meter = svg.append('g')
        .attr('class', 'progress-meter');

    meter.append('path')
        .attr('class', 'background')
        .attr('d', arc.endAngle(tau));

    var foreground = meter.append('path')
        .attr('class', 'foreground');

    var deg = meter.append('text')
        .attr('x', 12)
        .attr('y', 38)
        .attr('class', 'degree')
        .attr('text-anchor', 'middle');

    var text = meter.append('text')
        .text('HEAT SET TO')
        .attr('x', 2)
        .attr('y', -40)
        .attr('class', 'subtext')
        .attr('text-anchor', 'middle');

    // PubNub

    var pubnub = PUBNUB.init({
        subscribe_key: 'sub-c-f762fb78-2724-11e4-a4df-02ee2ddab7fe',
        publish_key:   'pub-c-156a6d5f-22bd-4a13-848d-b5b4d4b36695',
    });

    var os = 'android';
    var regid = '';
    var channel = '';
    var temperature = 0;
    var timer;

    var input = document.getElementById('channel');
    var knob = document.querySelector('.container');
    var check = document.querySelector('.fa-check-circle');
    var revoke = document.querySelector('.revoke');

    // Events
    knob.addEventListener('mousewheel', changeTemperature, false);
    knob.addEventListener('DOMMouseScroll', changeTemperature, false); // Moz
    input.addEventListener('keyup', pairDevice, false);
    revoke.addEventListener('click', revokeDecice, false);

    // Check if a device is paired
    if(localStorage.getItem('notify-demo-channel') && localStorage.getItem('notify-demo-regid')){
        channel = localStorage.getItem('notify-demo-channel');
        regid = localStorage.getItem('notify-demo-regid');
        disableInputBox();

        if(channel.length < 8) os = 'ios';
    }

    displayTemperature(delta);

    function disableInputBox() {
        input.setAttribute('disabled', 'disabled');
        input.setAttribute('placeholder', 'Your ID: ' + channel);
        check.style.display = 'inline-block';
        revoke.style.display = 'block';
    }

    function enableInputBox() {
        input.removeAttribute('disabled');
        input.setAttribute('placeholder', 'Enter your Device ID');
        check.style.display = 'none';
        revoke.style.display = 'none';
    }

    function changeTemperature(e) {
        e.preventDefault();
        e.stopPropagation();

        // Limit wheel move
        var deltaY = e.deltaY || e.detail;
        if(deltaY > 5) deltaY = 5;
        if(deltaY < -5) deltaY = -5;

        delta += deltaY /100;
       
        // Draw partial circle just for visual purpose - may have better way to do with d3
        if(delta < 0) delta = 0;
        if(delta > 0.85) delta = 0.85;

        displayTemperature(delta);
    }

    function displayTemperature(delta) {
        
        foreground.attr('d', arc.endAngle(tau * delta));
        foreground.attr('fill', c(delta));

        temperature = i(delta).toFixed(0);
        deg.text(temperature + '°');

        if(temperature < 80) {
            deg.attr('fill', '#666');
        } else {
            deg.attr('fill', c(delta));
        }

        if(!channel || !regid) return;

        window.clearTimeout(timer);
        timer = window.setTimeout(doneChangeTemperature, 7000);
    }

    function doneChangeTemperature(e) {
        console.log(temperature);

        pubnub.publish({
            channel: channel,
            message: {
                regid: regid,
                setting: temperature
            }
        });

        if(temperature >=80) {
            sendPush();
        }
    }

    function pairDevice(e) {
        if((e.keyCode || e.charCode) === 13) {
            channel = input.value;
            input.value = '';
            
            pubnub.history({
                channel  : channel,
                count    : 2,
                callback : function(m) {
                     console.log(m);
                    if((m[0][0] && m[0][0].regid) || (m[0][1] && m[0][1].regid)) {
                        regid = m[0][0].regid || m[0][1].regid;
                        console.log(regid);
                        // save in browser
                        localStorage.setItem('notify-demo-channel', channel);
                        localStorage.setItem('notify-demo-regid', regid);
                        disableInputBox();

                        if(channel.length < 8) os = 'ios';

                    } else {
                        alert('The ID you entered, '+ channel +' does not match with any devices');
                        enableInputBox();
                    }

                }
            });
        }
    }

    function revokeDecice(e) {
        localStorage.setItem('notify-demo-channel', '');
        localStorage.setItem('notify-demo-regid', '');
        enableInputBox();

        var gwtype = (os === 'ios') ? 'apns' : 'gcm';
        pubnub.mobile_gw_provision({
            device_id: regid,
            channel: channel, 
            op: 'remove', 
            gw_type: gwtype,
            callback: function(m) {console.log(m);}            
        });
        regid = '';
    }
    
    function sendPush() {
        console.log('sending push notification...');

        var gwtype = (os === 'ios') ? 'apns' : 'gcm';

        pubnub.mobile_gw_provision({
            device_id: regid,
            channel: channel, 
            op: 'add', 
            gw_type: gwtype,
            error: function(msg){console.log(msg);},
            callback: function() {
                var message = PNmessage();

                message.pubnub = pubnub;
                message.callback = function (msg){ console.log(msg); };
                message.error = function (msg){ console.log(msg); };
                message.channel = channel;
                message.apns = {
                    alert: 'The room temperature is set too high'
                };
                message.gcm = {
                    title: 'PubNub Push Demo',
                    message: 'The room temperature is set too high'
                };

                message.publish();
            }            
        });

    }

})();


