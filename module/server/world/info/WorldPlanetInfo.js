const BaseDaoInfo = require("../../main/info/BaseDaoInfo");
const m_server = require("../../index");
const common = require("../../../common");

/**
 * @callback callbackWorldPlanetInfo
 * @param {WorldPlanetInfo} world_planet_info
 */

/**
 * 地图块图信息
 * @class {WorldPlanetInfo}
 * @extends {BaseDaoInfo}
 */

class WorldPlanetInfo extends BaseDaoInfo {
    constructor(dao) {
        super();
        this.planet_id = dao.planet_id;
        this.galaxy_id = dao.galaxy_id;
        this.global_x = 0;
        this.global_y = 0;
        this.x = this.dao.x * common.setting.draw_ratio;
        this.y = this.dao.y * common.setting.draw_ratio;
    }

    setGlobalX(global_x) {
        this.global_x = global_x;
    }

    setGlobalY(global_y) {
        this.global_y = global_y;
    }
}

module.exports = WorldPlanetInfo;
