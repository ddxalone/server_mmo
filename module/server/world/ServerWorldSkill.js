const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");

/**
 * 世界管理器
 * @class {ServerWorldSkill}
 */
class ServerWorldSkill {
    constructor() {
        this._max_skill_id = 1000;
    }

    static instance() {
        if (ServerWorldSkill.m_instance == null) {
            ServerWorldSkill.m_instance = new ServerWorldSkill();
        }
        return ServerWorldSkill.m_instance;
    }

    set max_skill_id(value) {
        this._max_skill_id = Math.max(this._max_skill_id, value);
    }

    get max_skill_id() {
        return ++this._max_skill_id;
    }

    async initServerSkill() {
        let max_skill_info = await m_mysql.MysqlManage.selectPromise('player_skill', 'max(skill_id) as max_skill_id', '');
        this.max_skill_id = (max_skill_info && max_skill_info[0].max_skill_id) || 0;
    }
}

ServerWorldSkill.m_instance = null;

module.exports = ServerWorldSkill;

