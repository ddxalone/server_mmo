const m_server = require("../../index");

/**
 * 地图块图信息
 * @class {WorldBlockInfo}
 */

class WorldBlockInfo {
    constructor(map_key) {
        this.map_key = map_key;
        /**
         * 恒星系列表 galaxy_id
         * @type {Object<number, WorldGalaxyInfo>}
         */
        this.world_galaxy_list = {};
    }

    /**
     * 设置星系信息
     * @param world_galaxy_info
     */
    setGalaxyInfo(world_galaxy_info) {
        this.world_galaxy_list[world_galaxy_info.galaxy_id] = world_galaxy_info;
    }

    /**
     * 遍历块图获取恒星系信息
     * @param callback
     * @param thisObj
     */
    eachListGetGalaxyInfo(callback, thisObj) {
        for (let galaxy_id in this.world_galaxy_list) {
            callback && callback.call(thisObj, this.world_galaxy_list[galaxy_id]);
        }
    }
}

module.exports = WorldBlockInfo;
