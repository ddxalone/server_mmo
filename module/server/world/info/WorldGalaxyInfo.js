const BaseDaoInfo = require("../../main/info/BaseDaoInfo");
const m_server = require("../../index");
const common = require("../../../common");

/**
 * @callback callbackWorldGalaxyInfo
 * @param {WorldGalaxyInfo} world_galaxy_info
 */

/**
 * 地图星系信息
 * @class {WorldGalaxyInfo}
 * @extends {BaseInfo}
 */

class WorldGalaxyInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.galaxy_id = dao.galaxy_id;
        this.x = this.dao.x * common.setting.draw_ratio;
        this.y = this.dao.y * common.setting.draw_ratio;
        this.name = dao.name;

        /**
         * 行星列表 planet_id
         * @type {Object<number, WorldPlanetInfo>}
         */
        this.world_planet_list = {};
        /**
         * 空间站列表 station_id
         * @type {Object<number, WorldStationInfo>}
         */
        this.world_station_list = {};
        /**
         * 死亡空间列表
         * @type {Object<number, WorldDeadInfo>}
         */
        this.world_dead_list = {};
        /**
         * 任务空间列表
         * @type {Object<number, WorldTaskInfo>}
         */
        this.world_task_list = {};
    }

    /**
     * 设置行星信息
     * @param world_planet_info
     */
    setPlanetInfo(world_planet_info) {
        this.world_planet_list[world_planet_info.planet_id] = world_planet_info;
    }

    /**
     * 初始化空间站列表
     * @param world_station_info
     */
    setStationInfo(world_station_info) {
        this.world_station_list[world_station_info.station_id] = world_station_info;
    }

    /**
     * @param {WorldDeadInfo} world_dead_info
     */
    setDeadInfo(world_dead_info) {
        this.world_dead_list[world_dead_info.dead_id] = world_dead_info;
    }

    /**
     * @param {WorldTaskInfo} world_task_info
     */
    setTaskInfo(world_task_info) {
        this.world_task_list[world_task_info.task_id] = world_task_info;
    }

    /**
     * @param dead_id
     * @returns {WorldDeadInfo}
     */
    getDeadInfo(dead_id) {
        return this.world_dead_list[dead_id];
    }

    /**
     * @param task_id
     * @return {WorldTaskInfo}
     */
    getTaskInfo(task_id) {
        return this.world_task_list[task_id];
    }

    /**
     * 遍历返回附近的空间站
     * @param {callbackWorldStationInfo} callback
     * @param thisObj
     */
    eachStationInfos(callback, thisObj) {
        for (let world_station_info of Object.values(this.world_station_list)) {
            callback && callback.call(thisObj, world_station_info);
        }
    }

    /**
     * 遍历返回附近的行星
     * @param {callbackWorldPlanetInfo} callback
     * @param thisObj
     */
    // eachGetPlanetInfo(callback, thisObj) {
    //     for (let planet_id in this.world_planet_list) {
    //         callback && callback.call(thisObj, this.world_planet_list[planet_id]);
    //     }
    // }

    /**
     * 遍历返回附近的死亡空间
     * @param {callbackWorldDeadInfo} callback
     * @param thisObj
     */
    eachDeadInfos(callback, thisObj) {
        for (let world_dead_info of Object.values(this.world_dead_list)) {
            callback && callback.call(thisObj, world_dead_info);
        }
    }

    /**
     * 遍历附近的任务空间
     * @param {callbackWorldTaskInfo} callback
     * @param thisObj
     */
    eachTaskInfos(callback, thisObj) {
        for (let world_task_info of Object.values(this.world_task_list)) {
            callback && callback.call(thisObj, world_task_info);
        }
    }
}

module.exports = WorldGalaxyInfo;
