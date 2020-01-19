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
            startRangeBegin,
            startRangeEnd
        }, (err, res) => {
            sd.close();
            callback(err, res);
        });
    } else if (event.field == 'create-schedule') {
        sd.create(event.arguments, (err, res) => {
            sd.close();
            callback(err, res);
        });
    } else if (event.field == 'update-schedule') {
        sd.update(event.arguments, (err, res) => {
            sd.close();
            callback(err, res);
        });
    }
}

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
            startRangeBegin: new Date(parseInt(args[1])),
            startRangeEnd: new Date(parseInt(args[2]))
        }
    }, null, function(err, res) {
        console.log(err);
        console.log(JSON.stringify(res, null, 4));
    });
} else if (args[0] == 'create') {
    exports.lambda_handler({
        field: 'create-schedule',
        arguments: {
            email: args[1],
            temperature: parseInt(args[2]),
            start: new Date(args[3]),
            end: new Date(args[4])
        }
    }, null, function(err, res) {
        console.log(err);
        console.log(JSON.stringify(res, null, 4));
    });
} else if (args[0] == 'update') {
    exports.lambda_handler({
        field: 'update-schedule',
        arguments: {
            id: args[1],
            email: args[2],
            temperature: parseInt(args[3]),
            start: new Date(parseInt(args[4])),
            end: new Date(parseInt(args[5]))
        }
    }, null, function(err, res) {
        console.log(err);
        console.log(JSON.stringify(res, null, 4));
    });
}
