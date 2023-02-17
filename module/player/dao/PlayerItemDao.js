const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerItem = require("../info/PlayerItem");

/**
 * @class {PlayerItemDao}
 * @extends {BaseDao}
 */
class PlayerItemDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_item';
        this.db_key = 'item_id';
        this.db_field = {
            item_id: 'number',
            player_id: 'number',
            classify: 'number',
            item_type: 'number',
            count: 'number',
            station_id: 'number',
            ship_id: 'number',
            slot: 'number',
            status: 'number',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerItemDao.m_instance === null) {
            PlayerItemDao.m_instance = new PlayerItemDao();
        }
        return PlayerItemDao.m_instance;
    }

    getInfo(dao) {
        return new PlayerItem(dao).setServerDao(this);
    }

    async getPlayerItemsDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoListPromise(wheres);
    }

    /**
     * @param player_id
     * @param ship_id
     * @param timestamp
     * @return {PlayerShip}
     */
    async createRolePlayerItem(player_id, ship_id, timestamp) {
        let player_item_results = [
            {
                item_id: m_server.ServerWorldItem.max_item_id,
                player_id: player_id,
                classify: 11,
                item_type: 11000,
                count: 1,
                ship_id: ship_id,
                slot: 10,
                create_time: timestamp,
                update_time: timestamp,
            },
            {
                item_id: m_server.ServerWorldItem.max_item_id,
                player_id: player_id,
                classify: 11,
                item_type: 11000,
                count: 1,
                ship_id: ship_id,
                slot: 11,
                create_time: timestamp,
                update_time: timestamp,
            },
        ];

        //如果需要登录修改的参数在这里修改

        return await super.insertDaoListPromise(player_item_results)
    }
}

PlayerItemDao.m_instance = null;

module.exports = PlayerItemDao;
