"use strict";

var assert = require("assert-plus");
var mysql = require('mysql');

class ScheduleDao {
    constructor(params) {
        assert.object(params, 'params');
        assert.string(params.host, 'host');
        assert.number(params.port, 'port');
        assert.string(params.user, 'user');
        assert.string(params.pass, 'pass');
        assert.string(params.database, 'database');

        this.host = params.host;
        this.port = params.port;
        this.user = params.user;
        this.pass = params.pass;
        this.database = params.database;
    }

    open() {
        this.connection = mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.pass,
            database: this.database,
        });
        this.connection.connect();
    }

    /**
     * Delete all rows from the schedule table.  This is used by the tests but it will
     * not typically be used by the application.
     *
     * @param {function} callback - Function to call upon completion
     */
    clear(callback) {
        assert.func(callback, 'callback');
        var sql = "DELETE FROM schedule";
        this.connection.query(sql, (err) => {
            if (err) {
                return callback(err);
            }
            return callback();
        });
    }

    /**
     * Create a new row in the schedule table.
     *
     * @param params.record - The record to create
     * @param {function} callback - Function to call upon completion
     */
    create(params, callback) {
        assert.object(params, 'params');
        assert.object(params.record, 'record');
        assert.equal(params.record.id, null, 'id');
        assert.string(params.record.email, 'email');
        assert.number(params.record.temperature, 'temperature');
        assert.date(params.record.start, 'start');
        assert.date(params.record.end, 'end');
        assert.func(callback, 'callback');

	var record = Object.assign({}, params.record);
        this.connection.query('INSERT INTO schedule SET ?', record, function(error, results, fields) {
            if (error) {
		return callback(error);
            } else {
		record.id = results.insertId;
		return callback(null, record);
            }
        });
    }

    /**
     * Update a row in the schedule table.
     *
     * @param params.record - The record to update
     * @param {function} callback - Function to call upon completion
     */
    update(params, callback) {
        assert.object(params, 'params');
        assert.object(params.record, 'record');
        assert.number(params.record.id, 'id');
        assert.string(params.record.email, 'email');
        assert.number(params.record.temperature, 'temperature');
        assert.date(params.record.start, 'start');
        assert.date(params.record.end, 'end');
        assert.func(callback, 'callback');

	var record = Object.assign({}, params.record);
	var id = record.id;
	delete record.id;
        this.connection.query('UPDATE schedule SET ? WHERE id = ?', [record, id], function(error, results, fields) {
            if (error) {
		return callback(error);
            } else {
		record.id = id;
		return callback(null, record);
            }
        });
    }


    /**
     * Read records from the schedule table with start times in the given range.
     *
     * @param params.startRangeBegin - The beginning of the start range
     * @param params.startRangeEnd - The end of the start range
     * @param {function} callback - Function to call upon completion.  Invoked with (err, res).
     */
    read(params, callback) {
        assert.object(params, 'params');
        assert.date(params.startRangeBegin, 'startRangeBegin');
        assert.date(params.startRangeEnd, 'startRangeEnd');
        assert.func(callback, 'callback');

        var sql = "SELECT `id`, `email`, `temperature`, `start`, `end` FROM `schedule` WHERE start >= ? AND start <= ?";

        this.connection.query(sql, [params.startRangeBegin, params.startRangeEnd], (err, results, fields) => {
            if (err) {
                return callback(err);
            }
            var objects = results.map((r) => {
                return Object.assign({}, r);
            });
            return callback(null, objects);
        });
    }

    /**
     * Delete a schedule.
     *
     * @param params.id - The id of the schedule to delete
     * @param {function} callback - Function to call upon completion.  Invoked with (err).
     */
    del(params, callback) {
        assert.object(params, 'params');
        assert.number(params.id);
        assert.func(callback, 'callback');

        var sql = "DELETE FROM `schedule` WHERE id = ?";

        this.connection.query(sql, [params.id], (err, results, fields) => {
            if (err) {
                return callback(err);
            }
            return callback();
        });
    }

    close() {
        this.connection.destroy();
    }
}

module.exports = ScheduleDao;
