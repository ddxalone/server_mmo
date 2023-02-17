const m_server = require("../index");
const common = require("../../common");
const MapMergeInfo = require("./info/MapMergeInfo");

/**
 * @class {ServerMapMerge}
 */
class ServerMapMerge {
    constructor() {
        /**
         * 合并断层列表 merge_id
         * @type {Object<number, MapMergeInfo>}
         */
        this.map_merge_list = {};
        /**
         * @type {Array<MapMergeInfo>}
         */
        this.map_merge_list_array = [];
    }

    static instance() {
        if (ServerMapMerge.m_instance == null) {
            ServerMapMerge.m_instance = new ServerMapMerge();
        }
        return ServerMapMerge.m_instance;
    }

    /**
     * 获取合层
     * @param merge_id
     * @returns {MapMergeInfo}
     */
    getMapMergeInfo(merge_id) {
        // global.ff('getMapMergeInfo', merge_id, this.map_merge_list);
        return this.map_merge_list[merge_id] || null;
    }

    /**
     * 构建本帧合层缓存
     * @param intact
     */
    buildMergeInfoArray(intact = true) {
        this.map_merge_list_array = Object.values(this.map_merge_list);
        if (intact) {
            this.eachMergeInfo((map_merge_info) => {
                map_merge_info.buildGridInfoArray();
            }, this);
        }
    }

    /**
     * 遍历获取合层
     * @param {callbackMapMergeInfo} callback
     * @param thisObj
     */
    eachMergeInfo(callback, thisObj) {
        for (let map_merge_info of this.map_merge_list_array) {
            callback && callback.call(thisObj, map_merge_info);
        }
    }

    /**
     * 移除合层
     * @param merge_id
     */
    removeMapMergeInfo(merge_id) {
        delete this.map_merge_list[merge_id];
    }

    /**
     * 创建合层
     * @param merge_id
     * @returns {MapMergeInfo}
     */
    createMapMergeInfo(merge_id) {
        //先合并新增断层
        this.map_merge_list[merge_id] = new MapMergeInfo(merge_id);
        return this.map_merge_list[merge_id];
    }
}

ServerMapMerge.m_instance = null;

module.exports = ServerMapMerge;

