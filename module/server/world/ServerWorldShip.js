const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");

/**
 * 世界管理器
 * @class {ServerWorldShip}
 */
class ServerWorldShip {
    constructor() {
        this._max_ship_id = 1000;
    }

    static instance() {
        if (ServerWorldShip.m_instance == null) {
            ServerWorldShip.m_instance = new ServerWorldShip();
        }
        return ServerWorldShip.m_instance;
    }

    set max_ship_id(value) {
        this._max_ship_id = Math.max(this._max_ship_id, value);
    }

    get max_ship_id() {
        return ++this._max_ship_id;
    }

    async initServerShip() {
        let max_ship_info = await m_mysql.MysqlManage.selectPromise('player_ship', 'max(ship_id) as max_ship_id', '');
        this.max_ship_id = (max_ship_info && max_ship_info[0].max_ship_id) || 0;
    }
}

ServerWorldShip.m_instance = null;

module.exports = ServerWorldShip;

