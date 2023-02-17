const UnitStationMap = require("./UnitStationMap");
const common = require("../../../common");

/**
 * @callback callbackUnitStation
 * @param {UnitStation} unit_station
 */
/**
 * @class {UnitStation}
 * @extends {UnitStationMap}
 */
class UnitStation extends UnitStationMap {
    constructor() {
        super();
    }

    loadInfo(world_station_info) {
        this.setUnitId(world_station_info.dao.station_id);
        this.setX(world_station_info.global_x);
        this.setY(world_station_info.global_y);
        //未来根据显示参数决定角度 world_station_info.dao.cycle
        this.setCyCle(world_station_info.dao.cycle);
        this.setForce(world_station_info.dao.force);

        this.setRotation(0);

        super.loadInfoMap(world_station_info);

        return this;
    }

    getClientUnitStation() {
        return {
            grid_id: this.grid_id,
            unit_id: this.unit_id,
            unit_type: this.unit_type,
            force: this.force,
            x: this.x,
            y: this.y,
            radius: this.radius,
            cycle: this.cycle,
        }
    }
}

module.exports = UnitStation;

