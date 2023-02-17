const m_server = require("../index");
const m_data = require("../../data");
const common = require("../../common");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseLevel}
 */
class ServerBaseLevel {
    constructor() {
        this.levels = {};
    }

    static instance() {
        if (ServerBaseLevel.m_instance == null) {
            ServerBaseLevel.m_instance = new ServerBaseLevel();
        }
        return ServerBaseLevel.m_instance;
    }

    /**
     * 初始化宇宙信息
     */
    async initServerBaseLevel() {
        this.initServerBaseLevelResponse(await m_server.ServerLevelDao.initDaoListPromise(null));
    }

    /**
     * @param base_levels
     */
    initServerBaseLevelResponse(base_levels) {
        this.levels = base_levels;
        console.log("db base_level init done");
    }

    /**
     * 获取某个等级升级所需要的经验
     * @param level
     * @returns {number}
     */
    getLevelUpExp(level) {
        return this.levels[level].exp;
    }
}

ServerBaseLevel.m_instance = null;

module.exports = ServerBaseLevel;
