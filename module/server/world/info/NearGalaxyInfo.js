const m_server = require("../../../server");
const common = require("../../../common");
const ScanBeaconInfo = require("./ScanBeaconInfo");
const m_player = require("../../../player");
const S2CWorldScanChange = require("../protocol/S2CWorldScanChange");

/**
 * 获取附近的恒星系信息 扫描和定位都可以用
 * @class {NearGalaxyInfo}
 */
class NearGalaxyInfo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.distance = 0;
        /**
         * 最近的恒星系
         * @type {WorldGalaxyInfo}
         */
        this.nearest_galaxy_info = null;
        /**
         * 扫描范围内的恒星系列表 galaxy_id
         * @type {Object<number, WorldGalaxyInfo>}
         */
        this.near_galaxy_list = {};

        //最近的信标的类型
        this.grid_beacon_type = 0;
        //信标类
        this.grid_beacon_info = null;
        //最近的距离
        this.grid_beacon_distance = 0;

    }

    /**
     * 获取一个点最近的galaxy_info的信息和距离
     * @returns {NearGalaxyInfo}
     */
    getNearGalaxyInfo() {
        this.eachNearBlockGetGalaxyInfo((world_galaxy_info) => {
            let v_distance = common.func.getDistance(this.x, this.y, world_galaxy_info.x, world_galaxy_info.y);
            //只处理扫描范围内(块图边长)的恒星系信息
            if (v_distance < common.setting.base_map_block_max_size) {
                if (this.nearest_galaxy_info === null || v_distance < this.distance) {
                    this.nearest_galaxy_info = world_galaxy_info;
                    this.distance = v_distance;
                }
                this.near_galaxy_list[world_galaxy_info.galaxy_id] = world_galaxy_info;
            }
        }, this);
        return this;
    }

    /**
     * 获取周围block的断层
     * @param {callbackWorldGalaxyInfo} callback
     * @param thisObj
     */
    eachNearBlockGetGalaxyInfo(callback, thisObj) {
        let map_key_list = common.func.getNearMapKeyList(this.x, this.y);
        //遍历map_key_list
        for (let map_key of map_key_list) {
            m_server.ServerWorldBlock.eachBlockGetGalaxyInfo(map_key, callback, thisObj);
        }
    }

    /**
     * 获取最近的信标信息 每次只处理一个 要求所有的信标刷的远一些 至少2个断层以上??
     * @returns {NearGalaxyInfo}
     */
    getNearestBeaconInfo() {
        if (this.nearest_galaxy_info) {
            //TODO 构思一下怎么处理
            //恐怕是要改规划 玩家空间站 主权宣布设置 星系唯一还好说
            //采集器我期望是任意军团所属玩家可创建  是围绕行星的  可能断层下会有多个
            //之前的逻辑 即使2个任务空间的合层连到一起了 应该也不会影响npcer的动作 因为npcer只在断层内活动 具体未来要实测
            if (this.grid_beacon_type === 0) {
                this.nearest_galaxy_info.eachStationInfos((world_station_info) => {
                    let v_distance = common.func.getDistance(this.x, this.y, world_station_info.global_x, world_station_info.global_y);
                    if (v_distance < common.setting.base_map_grid_radius / 2) {
                        if (this.grid_beacon_info === null || v_distance < this.grid_beacon_distance) {
                            this.grid_beacon_info = world_station_info;
                            this.grid_beacon_distance = v_distance;
                            this.grid_beacon_type = common.static.WORLD_UNIT_TYPE_STATION;
                        }
                    }
                }, this);
            }

            if (this.grid_beacon_type === 0) {
                this.nearest_galaxy_info.eachDeadInfos((world_dead_info) => {
                    let v_distance = common.func.getDistance(this.x, this.y, world_dead_info.global_x, world_dead_info.global_y);
                    if (v_distance < common.setting.base_map_grid_radius / 2) {
                        if (this.grid_beacon_info === null || v_distance < this.grid_beacon_distance) {
                            this.grid_beacon_info = world_dead_info;
                            this.grid_beacon_distance = v_distance;
                            this.grid_beacon_type = common.static.WORLD_UNIT_TYPE_DEAD;
                        }
                    }
                }, this);
            }

            if (this.grid_beacon_type === 0) {
                this.nearest_galaxy_info.eachTaskInfos((world_task_info) => {
                    let v_distance = common.func.getDistance(this.x, this.y, world_task_info.global_x, world_task_info.global_y);
                    if (v_distance < common.setting.base_map_grid_radius / 2) {
                        if (this.grid_beacon_info === null || v_distance < this.grid_beacon_distance) {
                            this.grid_beacon_info = world_task_info;
                            this.grid_beacon_distance = v_distance;
                            this.grid_beacon_type = common.static.WORLD_UNIT_TYPE_TASK;
                        }
                    }
                }, this);
            }

            // if (this.grid_beacon_type === 0) {
            //     this.nearest_galaxy_info.eachGetPlanetInfo((world_planet_info) => {
            //         let v_distance = common.func.getDistance(this.x, this.y, world_planet_info.global_x, world_planet_info.global_y);
            //         if (v_distance < common.setting.base_map_grid_radius / 2) {
            //             if (this.grid_beacon_info === null || v_distance < this.grid_beacon_distance) {
            //                 this.grid_beacon_info = world_planet_info;
            //                 this.grid_beacon_distance = v_distance;
            //                 this.grid_beacon_type = common.static.WORLD_UNIT_TYPE_PLANET;
            //             }
            //         }
            //     }, this);
            // }
        }
        return this;
    }

    /**
     * 获取周围block的断层
     * @param {callbackWorldGalaxyInfo} callback
     * @param thisObj
     */
    eachGalaxyInfos(callback, thisObj) {
        for (let galaxy_id in this.near_galaxy_list) {
            callback && callback.call(thisObj, this.near_galaxy_list[galaxy_id]);
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
        near_beacon_list[common.static.WORLD_UNIT_TYPE_STATION] = {};
        near_beacon_list[common.static.WORLD_UNIT_TYPE_DEAD] = {};
        near_beacon_list[common.static.WORLD_UNIT_TYPE_TASK] = {};

        let scan_range = Math.floor(common.setting.base_scan_range * unit_ship_player.scan_range_per / 100)

        this.eachGalaxyInfos((world_galaxy_info) => {
            world_galaxy_info.eachStationInfos((world_station_info) => {
                let v_distance = common.func.getDistance(this.x, this.y, world_station_info.global_x, world_station_info.global_y);
                if (v_distance < scan_range) {
                    near_beacon_list[common.static.WORLD_UNIT_TYPE_STATION][world_station_info.station_id] = m_server.ServerWorldScan.createScanBeaconInfo(common.static.WORLD_UNIT_TYPE_STATION, unit_ship_player, v_distance, world_station_info);
                }
            }, this);
        }, this);
        this.eachGalaxyInfos((world_galaxy_info) => {
            world_galaxy_info.eachDeadInfos((world_dead_info) => {
                let v_distance = common.func.getDistance(this.x, this.y, world_dead_info.global_x, world_dead_info.global_y);
                if (v_distance < scan_range) {
                    near_beacon_list[common.static.WORLD_UNIT_TYPE_DEAD][world_dead_info.dead_id] = m_server.ServerWorldScan.createScanBeaconInfo(common.static.WORLD_UNIT_TYPE_DEAD, unit_ship_player, v_distance, world_dead_info);
                }
            }, this);
        }, this);
        this.eachGalaxyInfos((world_galaxy_info) => {
            world_galaxy_info.eachTaskInfos((world_task_info) => {
                let v_distance = common.func.getDistance(this.x, this.y, world_task_info.global_x, world_task_info.global_y);
                if (v_distance < scan_range) {
                    near_beacon_list[common.static.WORLD_UNIT_TYPE_TASK][world_task_info.task_id] = m_server.ServerWorldScan.createScanBeaconInfo(common.static.WORLD_UNIT_TYPE_TASK, unit_ship_player, v_distance, world_task_info);
                }
            }, this);
        }, this);
        return near_beacon_list;
    }

}

module.exports = NearGalaxyInfo;
