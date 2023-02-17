const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerProduct = require("../info/PlayerProduct");

/**
 * @class {PlayerProductDao}
 * @extends {BaseDao}
 */
class PlayerProductDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_product';
        this.db_key = 'product_id';
        this.db_field = {
            product_id: 'number',
            player_id: 'number',
            station_id: 'number',
            blueprint_item_type: 'number',
            product_item_type: 'number',
            begin_time: 'number',
            end_time: 'number',
            less_total: 'number',
            now_time: 'number',
            status: 'number',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerProductDao.m_instance === null) {
            PlayerProductDao.m_instance = new PlayerProductDao();
        }
        return PlayerProductDao.m_instance;
    }

    getInfo(dao) {
        return new PlayerProduct(dao).setServerDao(this);
    }

    async getPlayerProductsDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoListPromise(wheres);
    }
}

PlayerProductDao.m_instance = null;

module.exports = PlayerProductDao;
