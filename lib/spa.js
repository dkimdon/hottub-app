const child_process = require('child_process');
const assert = require('assert-plus');

class Spa {

    constructor() {}

    readState() {
        var res = child_process.spawnSync('./balboa_worldwide_app/bin/bwa_status_json');
        console.log(res.stderr.toString());
        console.log(res.stdout.toString());
        if (res.status == 0) {
            var state = JSON.parse(res.stdout.toString());
            this.heating_mode = state.heating_mode;
            this.temperature = state.temperature;
            this.temperature_range = state.temperature_range;
            this.set_temperature = state.set_temperature;
            this.heating = state.heating;
            return 0;
        }
        return -1;
    }

    getState() {
        return {
            heating_mode: this.heating_mode,
            temperature_range: this.temperature_range,
            set_temperature: this.set_temperature,
            temperature: this.temperature,
        };
    }

    setControlState(params) {
        assert.object(params, 'params');
        assert.string(params.temperature_range, 'temperature_range');
        assert.string(params.heating_mode, 'heating_mode');
        assert.number(params.set_temperature, 'set_temperature');

        assert(params.heating_mode == 'ready' || params.heating_mode == 'rest');
        assert(params.temperature_range == 'high' || params.temperature_range == 'low');
        assert(params.set_temperature <= 106);

        var res = child_process.spawnSync(`./balboa_worldwide_app/bin/bwa_set params.temperature_range params.heating_mode params.set_temperature`);
        this.readState();
    }
}


module.exports = Spa;
