const m_server = require("../index");
const common = require("../../common");
const UnitWarp = require("./info/UnitWarp");

/**
 * 地区单位控制类
 */
class ServerMapUnit {
    constructor() {
        //所有Player的unit_id为自己的ID
        //所有Npc的unit_id为递增ID
        this._unit_ship_npcer_id = 1000;
        //折跃ID
        this._map_warp_id = 1000;
        /**
         * 折跃信号列表索引,禁止遍历 因为折跃信号持续时间很短又是跨合层跨断层跨块图 所以放到全局里
         * @type {Object<number, UnitWarp>}
         */
        this.unit_warp_index_list = {};
    }

    static instance() {
        if (ServerMapUnit.m_instance == null) {
            ServerMapUnit.m_instance = new ServerMapUnit();
        }
        return ServerMapUnit.m_instance;
    }

    get unit_ship_npcer_id() {
        return ++this._unit_ship_npcer_id;
    }

    get map_warp_id() {
        return ++this._map_warp_id;
    }

    /**
     * @param {UnitWarp} unit_warp
     * @constructor
     */
    addUnitWarpToIndexList(unit_warp) {
        this.unit_warp_index_list[unit_warp.unit_id] = unit_warp;
    }

    delUnitWarpToIndexList(unit_id) {
        delete this.unit_warp_index_list[unit_id];
    }

    /**
     * @param unit_id
     * @returns {UnitWarp}
     */
    getIndexUnitWarp(unit_id) {
        return this.unit_warp_index_list[unit_id];
    }

    /**
     * 添加折跃单位
     * @param warp_info
     */
    joinUnitWarp(warp_info) {
        let unit_warp = new UnitWarp()
            .loadInfo(warp_info);
        m_server.ServerMapManage.unitMoveGrid(unit_warp, true);
        this.addUnitWarpToIndexList(unit_warp);
    }

    /**
     * 移除折跃单位
     * @param unit_warp
     * @param type
     */
    leaveUnitWarp(unit_warp, type = common.static.MAP_FRAME_TYPE_DEAD) {
        this.delUnitWarpToIndexList(unit_warp.unit_id);
        unit_warp.map_grid_info.removeUnitInfo(unit_warp, type);
    }
}

ServerMapUnit.m_instance = null;

module.exports = ServerMapUnit;

