const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseForce}
 */
class ServerBaseForce {
    constructor() {
        /**
         * 基础玩家技能列表
         * @type {Object<number, BaseForceInfo>}
         */
        this.base_force_list = {};
    }

    static instance() {
        if (ServerBaseForce.m_instance == null) {
            ServerBaseForce.m_instance = new ServerBaseForce();
        }
        return ServerBaseForce.m_instance;
    }

    /**
     * 初始化舰船信息
     */
    async initServerBaseForce() {
        this.initServerBaseForceResponse(await m_server.BaseForceDao.initDaoListPromiseFromData(m_data.BaseForceData));
    }

    initServerBaseForceResponse(base_force_list) {
        // for (let item_type in base_item_weapon_list) {
        //     this.setBaseForce(base_item_weapon_list[item_type]);
        // }
        this.base_force_list = base_force_list;
        console.log("db base_force_list init done");
    }

    // setBaseForce(base_force_list) {
    //     this.base_force_list[parseInt(base_force_list.force)] = base_force_list;
    // }

    /**
     * @param force
     * @returns {BaseForceInfo}
     */
    getBaseForce(force) {
        return this.base_force_list[force];
    }
}

ServerBaseForce.m_instance = null;

module.exports = ServerBaseForce;
