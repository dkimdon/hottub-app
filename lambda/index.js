"use strict"

var aws = require('aws-sdk');
aws.config.update({
    region: 'us-west-2'
});

exports.lambda_handler = function(event, context, callback) {
    if (event.field == "ping") {
        return callback(null, {
            id: event.arguments.id
        });
    } 
}
