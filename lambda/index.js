"use strict"

var aws = require('aws-sdk');
aws.config.update({
    region: 'us-west-2'
});

exports.lambda_handler = function(event, context, callback) {
    if (event.field == "get-tub-state") {
        aws.config.region = 'us-west-2';
        var iotData = new aws.IotData({
            endpoint: 'https://a3fqpqsy13jcnc.iot.us-west-2.amazonaws.com'
        });

        iotData.getThingShadow({
            thingName: "HotTub"
        }, function(err, data) {
            if (err) {
                console.log("Error : " + err, err.stack);
                return callback(err);
            } else {
                var shadow = JSON.parse(data.payload);
                var state = {
                    lastReportedTemperature: shadow.state.reported.temperature,
                    lastReportTimestamp: shadow.metadata.reported.temperature.timestamp,
                    targetTemperature: shadow.state.desired.set_temperature
                };
                return callback(null, state);
            }
        });
    }
}

exports.lambda_handler({
    field: 'get-tub-state'
}, null, function(err, res) {
    console.log(res);
});
