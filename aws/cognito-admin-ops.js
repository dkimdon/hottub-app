#!/usr/bin/env node

var async = require('async');
var _ = require('underscore');
var aws = require('aws-sdk');
aws.config.update({
    region: "us-west-2"
});
var path = require('path');

if (process.argv.length < 4) {
    console.log("Usage: " + __filename + " email action");
    console.log("  action: create/delete");
    console.log("Examples:");
    console.log(path.posix.basename(__filename) + " dkimdon@gmail.com create");
    console.log(path.posix.basename(__filename) + " dkimdon@gmail.com delete");
    process.exit(-1);
}

var email = process.argv[2];
var action = process.argv[3];

var userPoolId = 'us-west-2_SSZLAWrJ3';

var cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
});

var customFields = []
var agencyUpdates = []
var agencyIds = []

if (action === 'create') {
    console.log('going to create user ' + email);
    var userAttributes = [{
        Name: 'email',
        Value: email
    }]
    console.log(userAttributes);
    var params = {
        UserPoolId: userPoolId,
        Username: email,
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: userAttributes
    }
    async.series([
        function createUser(callback) {
            cognitoidentityserviceprovider.adminCreateUser(params, callback);
        },
    ], function(err, results) {
        if (err) {
            console.log(err);
            process.exit(-1);
        } else {
            console.log(JSON.stringify(results[0], null, 2));
            process.exit(0);
        }
    });
} else if (action === 'delete') {
    console.log('going to delete user ' + email);
    var params = {
        UserPoolId: userPoolId,
        Username: email
    }
    async.waterfall([
        function deleteUser(agencies, callback) {
            async.series([
                function doDeleteUser(callback) {
                    cognitoidentityserviceprovider.adminDeleteUser(params, callback);
                }
            ], callback);
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            process.exit(-1);
        } else {
            process.exit(0);
        }
    });
} else {
    console.log('unsupported action ' + action);
    process.exit(1);
}
