const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");

/**
 * 世界管理器
 * @class {ServerWorldBlueprint}
 */
class ServerWorldBlueprint {
    constructor() {
        this._max_blueprint_id = 1000;
    }

    static instance() {
        if (ServerWorldBlueprint.m_instance == null) {
            ServerWorldBlueprint.m_instance = new ServerWorldBlueprint();
        }
        return ServerWorldBlueprint.m_instance;
    }

    set max_blueprint_id(value) {
        this._max_blueprint_id = Math.max(this._max_blueprint_id, value);
    }

    get max_blueprint_id() {
        return ++this._max_blueprint_id;
    }

    async initServerItem() {
        let max_blueprint_info = await m_mysql.MysqlManage.selectPromise('player_blueprint', 'max(blueprint_id) as max_blueprint_id', '');
        this.max_blueprint_id = (max_blueprint_info && max_blueprint_info[0].max_blueprint_id) || 0;
    }
}

ServerWorldBlueprint.m_instance = null;

module.exports = ServerWorldBlueprint;

