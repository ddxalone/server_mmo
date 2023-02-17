const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");

/**
 * 世界管理器
 * @class {ServerWorldProduct}
 */
class ServerWorldProduct {
    constructor() {
        this._max_product_id = 1000;
    }

    static instance() {
        if (ServerWorldProduct.m_instance == null) {
            ServerWorldProduct.m_instance = new ServerWorldProduct();
        }
        return ServerWorldProduct.m_instance;
    }

    set max_product_id(value) {
        this._max_product_id = Math.max(this._max_product_id, value);
    }

    get max_product_id() {
        return ++this._max_product_id;
    }

    async initServerItem() {
        let max_product_info = await m_mysql.MysqlManage.selectPromise('player_product', 'max(product_id) as max_product_id', '');
        this.max_product_id = (max_product_info && max_product_info[0].max_product_id) || 0;
    }
}

ServerWorldProduct.m_instance = null;

module.exports = ServerWorldProduct;

