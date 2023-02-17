const BaseDaoInfo = require("../../main/info/BaseDaoInfo");
const m_server = require("../../index");
const common = require("../../../common");


/**
 * @callback callbackWorldStationInfo
 * @param {WorldStationInfo} world_station_info
 */

/**
 * 地图块图信息
 * @class {WorldStationInfo}
 * @extends {BaseDaoInfo}
 */

class WorldStationInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.station_id = dao.station_id;
        this.galaxy_id = dao.galaxy_id;
        this.global_x = 0;
        this.global_y = 0;
        this.x = this.dao.x * common.setting.draw_ratio;
        this.y = this.dao.y * common.setting.draw_ratio;
        this.radius = this.dao.radius;
        this.radius_pow = Math.pow(this.radius, 2);
    }

    setGlobalX(global_x) {
        this.global_x = global_x;
    }

    setGlobalY(global_y) {
        this.global_y = global_y;
    }
}

module.exports = WorldStationInfo;
