"use strict";
var assert = require('assert');
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
                sd.close();
                done();
            });
        });
    });
});
