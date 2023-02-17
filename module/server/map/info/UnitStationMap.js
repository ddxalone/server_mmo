const BaseUnit = require("./BaseUnit");
const common = require("../../../common");

/**
 * @callback callbackUnitStationMap
 * @param {UnitStationMap} unit_station
 */
/**
 * @class {UnitStationMap}
 * @extends {BaseUnit}
 */
class UnitStationMap extends BaseUnit {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_STATION);

        this.cycle = 0;

        this.force = 0;
        this.res = '';
    }

    loadInfoMap(world_station_info) {
        this.radius = world_station_info.radius;
        this.radius_pow = Math.pow(this.radius, 2);
        return this;
    }

    setCyCle(cycle) {
        this.cycle = cycle;
    }

    setForce(force) {
        this.force = force;
    }
}

module.exports = UnitStationMap;
