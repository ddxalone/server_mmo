const m_server = require("../../../server");
const common = require("../../../common");
const m_player = require("../../../player");

/**
 * 获取合并地图断层信息
 * @class {NearGridInfo}
 */
class NearGridInfo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.distance = 0;
        /**
         * 最近的gridInfo
         * @type {MapGridInfo}
         */
        this.nearest_grid_info = null;
        /**
         * 2倍断层半径内的gridInfo grid_id
         * @type {Object<number, MapGridInfo>}
         */
        this.near_grid_list = {};

        /**
         * 执行分离grid后,所有非新增断层的信息放到这里
         * @type {Object<number, MapGridInfo>}
         */
        // this.separate_grid_list = {};
    }

    /**
     * 重新初始化 并调整坐标
     * @param x
     * @param y
     * @returns {NearGridInfo}
     */
    // reInit(x, y) {
    //     this.x = x;
    //     this.y = y;
    //     this.distance = 0;
    //     this.nearest_grid_info = null;
    //     this.near_grid_list = {};
    //     return this;
    // }

    /**
     * 遍历附近的grid_info
     * @param {callbackMapGridInfo} callback
     * @param thisObj
     */
    eachNearGridListGetGridInfo(callback, thisObj) {
        for (let grid_id in this.near_grid_list) {
            callback && callback.call(thisObj, this.near_grid_list[grid_id]);
        }
    }

    /**
     * 检查附近是否有断层
     * @returns {boolean}
     */
    checkNearGirdList() {
        return !!Object.keys(this.near_grid_list).length;
    }

    /**
     * 获取一个点最近的block_info的信息和距离
     * @returns {NearGridInfo}
     */
    getNearGridInfo() {
        this.eachNearBlockGetGridInfo((map_grid_info) => {
            let v_distance = common.func.getDistance(this.x, this.y, map_grid_info.x, map_grid_info.y);
            //只处理2倍半径距离的断层 如果触发合并那么这所有的断层都要合并
            if (v_distance < common.setting.base_map_grid_radius * 2) {
                this.addNearGridListSafe(v_distance, map_grid_info);
            }
        }, this);
        return this;
    }

    /**
     * 获取周围全部断层信息
     * @returns {NearGridInfo}
     */
    getNearWorldGridInfo() {
        this.eachNearBlockGetGridInfo((map_grid_info) => {
            let v_distance = common.func.getDistance(this.x, this.y, map_grid_info.x, map_grid_info.y);
            //只处理2倍半径距离的断层 如果触发合并那么这所有的断层都要合并
            this.addNearGridListSafe(v_distance, map_grid_info);
        }, this);
        return this;
    }

    /**
     * 安全追加所有断层到列表
     * @param v_distance
     * @param map_grid_info
     */
    addNearGridListSafe(v_distance, map_grid_info) {
        if (this.nearest_grid_info === null || v_distance < this.distance) {
            this.nearest_grid_info = map_grid_info;
            this.distance = v_distance;
        }
        if (!this.near_grid_list[map_grid_info.grid_id]) {
            this.near_grid_list[map_grid_info.grid_id] = map_grid_info;
            //合层不用判断是否为最近
            map_grid_info.map_merge_info.eachGridInfo((merge_grid_info) => {
                if (!this.near_grid_list[merge_grid_info.grid_id]) {
                    this.near_grid_list[merge_grid_info.grid_id] = merge_grid_info;
                }
            }, this);
        }
    }

    /**
     * 合并合层并返回第一个可用的合层
     * @returns {MapMergeInfo}
     */
    mergeMapMergeInfo() {
        /**
         * @type {MapMergeInfo}
         */
        let master_map_merge_info = null;
        // 被合并断层 需要移除的断层 通知主断层也要移除
        this.eachNearGridListGetGridInfo((nearest_grid_info) => {
            //第一个断层的合层为主合层
            if (master_map_merge_info === null) {
                master_map_merge_info = nearest_grid_info.map_merge_info;
            } else {
                //所有附近断层和以及相关合层中的断层移动到第一个合层
                if (master_map_merge_info.merge_id !== nearest_grid_info.map_merge_info.merge_id) {
                    // ff('合并断层 ' + nearest_grid_info.grid_id + ' => 从' + nearest_grid_info.map_merge_info.merge_id + '到' + master_map_merge_info.merge_id)
                    nearest_grid_info.map_merge_info.removeGridInfo(nearest_grid_info.grid_id);
                    master_map_merge_info.addGridInfo(nearest_grid_info);
                }
            }
        }, this);
        return master_map_merge_info;
    }

    /**
     * 获取周围block的断层
     * @param {callbackMapGridInfo} callback
     * @param thisObj
     */
    eachNearBlockGetGridInfo(callback, thisObj) {
        let map_key_list = common.func.getNearMapKeyList(this.x, this.y);
        //遍历map_key_list
        for (let map_key of map_key_list) {
            m_server.ServerMapBlock.eachBlockGetGridInfo(map_key, callback, thisObj);
        }
    }


    /**
     *
     * @param unit_ship_player
     * @returns {{}}
     */
    getNearScanBeaconList(unit_ship_player) {
        //粗扫 只需要范围
        let near_beacon_list = {};
        near_beacon_list[common.static.WORLD_UNIT_TYPE_SHIP_PLAYER] = {};

        let scan_range = Math.floor(common.setting.base_scan_range * unit_ship_player.scan_range_per / 100)

        this.eachNearBlockGetGridInfo((map_grid_info) => {
            map_grid_info.eachShipPlayer((scan_ship_player) => {
                if (scan_ship_player.getRun()) {
                    let v_distance = common.func.getDistance(this.x, this.y, scan_ship_player.x, scan_ship_player.y);
                    if (v_distance < scan_range) {
                        near_beacon_list[common.static.WORLD_UNIT_TYPE_SHIP_PLAYER][scan_ship_player.unit_id] = m_server.ServerWorldScan.createScanBeaconInfo(common.static.WORLD_UNIT_TYPE_SHIP_PLAYER, unit_ship_player, v_distance, scan_ship_player);
                    }
                }
            }, this);
        }, this);
        //
        // this.eachNearGridListGetGridInfo((map_grid_info) => {
        //     map_grid_info.eachShipPlayer((scan_ship_player) => {
        //         let v_distance = common.func.getDistance(this.x, this.y, scan_ship_player.x, scan_ship_player.y);
        //         if (v_distance < scan_range) {
        //             near_beacon_list[common.static.WORLD_UNIT_TYPE_SHIP_PLAYER][scan_ship_player.unit_id] = m_server.ServerWorldScan.createScanBeaconInfo(common.static.WORLD_UNIT_TYPE_SHIP_PLAYER, unit_ship_player, v_distance, scan_ship_player);
        //         }
        //     }, this);
        // }, this);

        return near_beacon_list;
    }
}

module.exports = NearGridInfo;
