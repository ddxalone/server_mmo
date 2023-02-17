const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");

/**
 * 世界管理器
 * @class {ServerWorldItem}
 */
class ServerWorldItem {
    constructor() {
        this._max_item_id = 1000;
    }

    static instance() {
        if (ServerWorldItem.m_instance == null) {
            ServerWorldItem.m_instance = new ServerWorldItem();
        }
        return ServerWorldItem.m_instance;
    }

    set max_item_id(value) {
        this._max_item_id = Math.max(this._max_item_id, value);
    }

    get max_item_id() {
        return ++this._max_item_id;
    }

    async initServerItem() {
        let max_item_info = await m_mysql.MysqlManage.selectPromise('player_item', 'max(item_id) as max_item_id', '');
        this.max_item_id = (max_item_info && max_item_info[0].max_item_id) || 0;
    }
}

ServerWorldItem.m_instance = null;

module.exports = ServerWorldItem;

