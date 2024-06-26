'use strict'

var aws = require('aws-sdk');
aws.config.update({
    region: 'us-west-2'
});

const THING_NAME = 'HotTub';
const ENDPOINT = 'https://a3fqpqsy13jcnc-ats.iot.us-west-2.amazonaws.com';

exports.lambda_handler = function(event, context, callback) {
    if (event.field == 'get-tub-state') {
        var iotData = new aws.IotData({
            endpoint: ENDPOINT
        });

        iotData.getThingShadow({
            thingName: THING_NAME
        }, function(err, data) {
            if (err) {
                console.log('Error : ' + err, err.stack);
                return callback(err);
            } else {
                var shadow = JSON.parse(data.payload);
                var {
                    temperature,
                    temperature_timestamp,
                    last_seen_timestamp
                } = shadow.state.reported;
                var {
                    set_temperature,
                    heating_mode,
                    temperature_range
                } = shadow.state.desired;
                var state = {
                    lastReportedTemperature: temperature,
                    lastReportTimestamp: temperature_timestamp,
                    lastSeenTimestamp: last_seen_timestamp,
                    targetTemperature: heating_mode == 'ready' ? shadow.state.desired.set_temperature : null,
                    externalController: shadow.state.desired.external_controller
                };
                return callback(null, state);
            }
        });
    } else if (event.field == 'set-tub-state') {
        var iotData = new aws.IotData({
            endpoint: ENDPOINT
        });
        var {
            targetTemperature
        } = event.arguments;
        if (targetTemperature != null && typeof targetTemperature != 'number') {
            return callback('targetTemperature must be a number');
        }
        var desired = {};
        if (!targetTemperature) {
            desired.heating_mode = 'rest';
            desired.temperature_range = 'low';
            desired.set_temperature = 50;
        } else {
            // # 50 - 80
            if (targetTemperature > 50 && targetTemperature <= 80) {
                desired.temperature_range = 'low';
            } else if (targetTemperature > 80 && targetTemperature <= 106) {
                desired.temperature_range = 'high';
            } else {
                return callback('Invalid temperature: ' + targetTemperature);
            }
            desired.heating_mode = 'ready';
            desired.set_temperature = targetTemperature;
        }
        var shadow = {
            state: {
                desired
            }
        };
        iotData.updateThingShadow({
            thingName: THING_NAME,
            payload: JSON.stringify(shadow)
        }, function(err, data) {
            if (err) {
                console.log('Error : ' + err, err.stack);
                return callback(err);
            } else {
                var shadow = JSON.parse(data.payload);
                var {
                    set_temperature,
                    heating_mode,
                    temperature_range
                } = shadow.state.desired;
                var state = {
                    targetTemperature: heating_mode == 'ready' ? shadow.state.desired.set_temperature : null
                };
                return callback(null, state);
            }
        });
    }
}
/*
var args = process.argv.slice(2);

if (args[0] == 'get') {
    exports.lambda_handler({
        field: 'get-tub-state'
    }, null, function(err, res) {
        console.log(JSON.stringify(res, null, 4));
    });
} else if (args[0] == 'set') {
    exports.lambda_handler({
        field: 'set-tub-state',
        arguments: {
            targetTemperature: args[1] ? parseInt(args[1]) : null
        }
    }, null, function(err, res) {
        console.log(err);
        console.log(JSON.stringify(res, null, 4));
    });
}
*/
