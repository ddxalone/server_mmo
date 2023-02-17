const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseSkill}
 */
class ServerBaseSkill {
    constructor() {
        /**
         * 基础玩家技能列表
         * @type {Object<number, BaseSkillInfo>}
         */
        this.base_skill_list = {};
    }

    static instance() {
        if (ServerBaseSkill.m_instance == null) {
            ServerBaseSkill.m_instance = new ServerBaseSkill();
        }
        return ServerBaseSkill.m_instance;
    }

    /**
     * 初始化舰船信息
     */
    async initServerBaseSkill() {
        this.initServerBaseSkillResponse(await m_server.BaseSkillDao.initDaoListPromiseFromData(m_data.BaseSkillData));
    }

    initServerBaseSkillResponse(base_skill_list) {
        // for (let skill_type in base_skill_list) {
        //     this.setBaseSkill(base_skill_list[skill_type]);
        // }
        this.base_skill_list = base_skill_list;
        console.log("db base_skill_list init done");
    }

    // setBaseSkill(base_skill_info) {
    //     this.base_skill_list[parseInt(base_skill_info.skill_type)] = base_skill_info;
    // }

    /**
     * @param skill_type
     * @returns {BaseSkillInfo}
     */
    getBaseSkill(skill_type) {
        return this.base_skill_list[skill_type];
    }
}

ServerBaseSkill.m_instance = null;

module.exports = ServerBaseSkill;
