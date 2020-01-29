'use strict'

var ScheduleDao = require('hottub-mysql-dao/lib/scheduleDao.js');

exports.lambda_handler = function(event, context, callback) {

    var sd = new ScheduleDao({
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        user: process.env.MYSQL_USER,
        pass: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DATABASE,
    });
    sd.open();
    if (event.field == 'get-schedules') {
        var {
            startRangeBegin,
            startRangeEnd
        } = event.arguments;
        sd.read({
            startRangeBegin: new Date(1000 * event.arguments.startRangeBegin),
            startRangeEnd: new Date(1000 * event.arguments.startRangeEnd)
        }, (err, res) => {
            sd.close();
            callback(err, res);
        });
    } else if (event.field == 'create-schedule') {
        sd.create({
            record: {
                temperature: event.arguments.temperature,
                start: new Date(1000 * event.arguments.start),
                end: new Date(1000 * event.arguments.end),
                email: event.identity.username
            }
        }, (err, res) => {
            sd.close();
            callback(err, res);
        });
    } else if (event.field == 'update-schedule') {
        sd.update({
            record: {
                id: event.arguments.id,
                temperature: event.arguments.temperature,
                start: new Date(1000 * event.arguments.start),
                end: new Date(1000 * event.arguments.end),
                email: event.identity.username
            }
        }, (err, res) => {
            sd.close();
            callback(err, res);
        });
    } else if (event.field == 'delete-schedule') {
        sd.del({
            id: event.arguments.id
        }, (err, res) => {
            sd.close();
            callback(err, res);
        });
    }
}

/*
var args = process.argv.slice(2);

process.env.MYSQL_HOST = "127.0.0.1";
process.env.MYSQL_PORT = "3306";
process.env.MYSQL_USER = "bwa";
process.env.MYSQL_PASS = "l1k3h0tw5t3R!";
process.env.MYSQL_DATABASE = "hottub";

if (args[0] == 'get') {
    exports.lambda_handler({
        field: 'get-schedules',
        arguments: {
            startRangeBegin: parseInt(args[1]),
            startRangeEnd: parseInt(args[2])
        }
    }, null, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.log(JSON.stringify(res, null, 4));
    });
} else if (args[0] == 'create') {
    exports.lambda_handler({
        field: 'create-schedule',
        arguments: {
            temperature: parseInt(args[1]),
            start: parseInt(args[2]),
            end: parseInt(args[3])
        },
        identity: {
            username: 'dkimdon@gmail.com'
        }
    }, null, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.log(JSON.stringify(res, null, 4));
    });
} else if (args[0] == 'update') {
    exports.lambda_handler({
        field: 'update-schedule',
        arguments: {
            id: parseInt(args[1]),
            temperature: parseInt(args[2]),
            start: parseInt(args[3]),
            end: parseInt(args[4])
        },
        identity: {
            username: 'dkimdon@gmail.com'
        }
    }, null, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.log(JSON.stringify(res, null, 4));
    });
} else if (args[0] == 'delete') {
    exports.lambda_handler({
        field: 'delete-schedule',
        arguments: {
            id: parseInt(args[1])
        }
    }, null, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.log(JSON.stringify(res, null, 4));
    });
}

*/
