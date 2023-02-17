const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerShip = require("../info/PlayerShip");

/**
 * @class {PlayerShipDao}
 * @extends {BaseDao}
 */
class PlayerShipDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_ship';
        this.db_key = 'ship_id';
        this.db_field = {
            ship_id: 'number',
            player_id: 'number',
            ship_type: 'number',
            station_id: 'number',
            shield: 'number',
            armor: 'number',
            speed: 'number',
            capacity: 'number',
            ship_name: 'string',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerShipDao.m_instance === null) {
            PlayerShipDao.m_instance = new PlayerShipDao();
        }
        return PlayerShipDao.m_instance;
    }

    getInfo(dao) {
        return new PlayerShip(dao).setServerDao(this);
    }

    async getPlayerShipsDb(player_id) {
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
    async createRolePlayerShip(player_id, ship_id, timestamp) {
        let player_ship_results = [
            {
                ship_id: ship_id,
                player_id: player_id,
                ship_type: 1,
                shield: 50000,
                armor: 50000,
                capacity: 100,
                create_time: timestamp,
                update_time: timestamp,
            },
        ];

        //如果需要登录修改的参数在这里修改
        return await super.insertDaoListPromise(player_ship_results)
    }
}

PlayerShipDao.m_instance = null;

module.exports = PlayerShipDao;
