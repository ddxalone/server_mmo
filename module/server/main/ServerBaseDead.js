const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseDead}
 */
class ServerBaseDead {
    constructor() {
        /**
         * 基础死亡空间列表
         * @type {Object<number, BaseDeadInfo>}
         */
        this.base_dead_list = {};
        /**
         * @type {Array<BaseDeadInfo>}
         */
        this.base_dead_list_array = [];
    }

    static instance() {
        if (ServerBaseDead.m_instance == null) {
            ServerBaseDead.m_instance = new ServerBaseDead();
        }
        return ServerBaseDead.m_instance;
    }

    /**
     * 初始化宇宙信息
     */
    async initServerBaseDead() {
        this.initServerBaseDeadResponse(await m_server.BaseDeadDao.initDaoListPromiseFromData(m_data.BaseDeadData));
    }

    initServerBaseDeadResponse(base_dead_list) {
        this.base_dead_list = base_dead_list;
        this.buildBaseDeadArray();
        // this.eachBaseDead((base_dead_info) => {
        //     base_dead_info.setBaseTemplateInfo(m_server.ServerBaseTemplate.getBaseTemplate(base_dead_info.template_id));
        // });
        console.log("db base_dead_list init done");
    }

    buildBaseDeadArray() {
        this.base_dead_list_array = Object.values(this.base_dead_list);
    }

    /**
     * 获取某类型死亡空间基础信息
     * @param dead_type
     * @returns {BaseDeadInfo}
     */
    getBaseDead(dead_type) {
        return this.base_dead_list[dead_type];
    }

    /**
     * @param {callbackBaseDeadInfo} callback
     * @param thisObj
     */
    eachBaseDead(callback, thisObj) {
        for (let base_dead_info of this.base_dead_list_array) {
            callback && callback.call(thisObj, base_dead_info);
        }
    }
}

ServerBaseDead.m_instance = null;

module.exports = ServerBaseDead;
