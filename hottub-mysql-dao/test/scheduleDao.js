"use strict";
var assert = require('assert');
var async = require('async');
var ScheduleDao = require('../lib/scheduleDao.js');

describe('Schedule DAO', () => {
    var sd;
    before(() => {
        sd = new ScheduleDao({
            host: 'localhost',
            port: 3306,
            user: 'bwa',
            pass: 'l1k3h0tw5t3r',
            database: 'hottub',
        });
        sd.open();
    });
    beforeEach((done) => {
        sd.clear(done);
    });
    after(() => {
        sd.close();
    });
    it('basically works', (done) => {
        var record = {
            email: 'foo@bar.com',
            temperature: 106,
            start: new Date(2020, 1, 1, 18, 30),
            end: new Date(2020, 1, 1, 19, 0)
        };
        sd.create({
            record
        }, (err) => {
            sd.read({
                startRangeBegin: new Date(2020, 1, 1, 18, 0),
                startRangeEnd: new Date(2020, 1, 1, 19, 0),
            }, (err, res) => {
                assert.equal(res.length, 1);
                delete res[0].id;
                assert.deepStrictEqual(res, [record]);
                done();
            });
        });
    });
    it('range selection works', (done) => {
        var records = [{
            email: '1@bar.com',
            temperature: 101,
            start: new Date(2020, 1, 1, 1, 0),
            end: new Date(2020, 1, 1, 2, 0)
        }, {
            email: '2@bar.com',
            temperature: 102,
            start: new Date(2020, 1, 1, 2, 0),
            end: new Date(2020, 1, 1, 3, 0)
        }, {
            email: '3@bar.com',
            temperature: 103,
            start: new Date(2020, 1, 1, 3, 0),
            end: new Date(2020, 1, 1, 4, 0)
        }, {
            email: '4@bar.com',
            temperature: 104,
            start: new Date(2020, 1, 1, 4, 0),
            end: new Date(2020, 1, 1, 5, 0)
        }, {
            email: '5@bar.com',
            temperature: 105,
            start: new Date(2020, 1, 1, 5, 0),
            end: new Date(2020, 1, 1, 6, 0)
        }];
        async.each(records, (record, callback) => {
            sd.create({
                record
            }, callback);
        }, (err) => {
            sd.read({
                startRangeBegin: new Date(2020, 1, 1, 2, 0),
                startRangeEnd: new Date(2020, 1, 1, 4, 0),
            }, (err, res) => {
                assert.equal(res.length, 3);
                res.forEach(record => {
                    delete record.id
                });
                assert.deepStrictEqual(res, records.slice(1, 4));
                done();
            });
        });
    });
});
