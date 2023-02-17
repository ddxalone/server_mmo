const m_server = require("../../index");
const common = require("../../../common");
const MapGridInfo = require("./MapGridInfo");

/**
 * 地图块图信息
 * @class {MapBlockInfo}
 */

class MapBlockInfo {
    constructor(map_key) {
        this.map_key = map_key;
        /**
         * 断层列表 grid_id
         * @type {Object<number, MapGridInfo>}
         */
        this.map_grid_list = {};
    }

    /**
     * 读取世界信息,例如空间站,信标
     */
    loadWorldInfo() {

    }

    /**
     * 获创建断层信息
     * @param grid_id
     * @param x
     * @param y
     * @param nearest_galaxy_info
     * @returns {MapGridInfo}
     */
    createGridInfo(grid_id, x, y, nearest_galaxy_info) {
        let map_grid_info = new MapGridInfo(grid_id, x, y);

        if (nearest_galaxy_info) {
            map_grid_info.setGalaxyId(nearest_galaxy_info.dao.galaxy_id);
            map_grid_info.setSafe(nearest_galaxy_info.dao.safe);
        }

        this.map_grid_list[grid_id] = map_grid_info;
        return map_grid_info;
    }

    /**
     * 获取断层信息
     * @param grid_id
     * @returns {MapGridInfo|null}
     */
    getGridInfo(grid_id) {
        return this.map_grid_list[grid_id] || null;
    }

    /**
     * 移除断层
     * @param grid_id
     */
    removeGridInfo(grid_id) {
        delete this.map_grid_list[grid_id];
        this.removeSafeBlockInfo();
    }

    /**
     * 安全移除块图
     */
    removeSafeBlockInfo() {
        if (Object.keys(this.map_grid_list).length === 0) {
            m_server.ServerMapBlock.removeMapBlockInfo(this.map_key);
        }
    }

    /**
     * 返回所有断层
     * @param {callbackMapGridInfo} callback
     * @param thisObj
     */
    eachListGetGridInfo(callback, thisObj) {
        for (let grid_id in this.map_grid_list) {
            callback && callback.call(thisObj, this.map_grid_list[grid_id]);
        }
    }

}

module.exports = MapBlockInfo;
