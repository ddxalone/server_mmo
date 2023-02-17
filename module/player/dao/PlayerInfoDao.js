const common = require("../../common");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerInfo = require("../info/PlayerInfo");

/**
 * @class {PlayerInfoDao}
 * @extends {BaseDao}
 */
class PlayerInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_info';
        this.db_key = 'player_id';
        this.db_field = {
            player_id: 'number',
            open_id: 'string',
            server_id: 'number',
            platform: 'string',
            username: 'string',
            password: 'string',
            nickname: 'string',
            head_url: 'string',
            ip: 'string',

            money: 'number',
            gold: 'number',
            vip_level: 'number',
            recharge: 'number',

            x: 'number',
            y: 'number',
            rotation: 'number',
            ship_id: 'number',
            station_id: 'number',

            lock_time: 'number',
            create_time: 'number',
            update_time: 'number',
            login_time: 'number',
            logout_time: 'number',
        };
    }

    static instance() {
        if (PlayerInfoDao.m_instance === null) {
            PlayerInfoDao.m_instance = new PlayerInfoDao();
        }
        return PlayerInfoDao.m_instance;
    }

    getInfo(dao) {
        return new PlayerInfo(dao).setServerDao(this);
    }

    async getPlayerInfoDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoRowPromise(wheres);
    }

    updateLoginTimeDb(player_id, login_time) {
        let wheres = {player_id: player_id};
        let fields = {login_time: login_time};
        super.updateDaoPart(wheres, fields)
    }

    updateLogoutTimeDb(player_id, logout_time) {
        let wheres = {player_id: player_id};
        let fields = {logout_time: logout_time};
        super.updateDaoPart(wheres, fields)
    }

    updateShipIdDb(player_id, ship_id) {
        let wheres = {player_id: player_id};
        let fields = {ship_id: ship_id};
        super.updateDaoPart(wheres, fields)
    }

    /**
     * @param open_id
     * @param server_id
     * @param x
     * @param y
     * @param nickname
     * @param ip
     * @param timestamp
     * @return {PlayerInfo}
     */
    async createRolePlayerInfo(open_id, server_id, x, y, nickname, ip, timestamp) {
        let player_info_result = {
            open_id: open_id,
            password: '',
            nickname: nickname,
            ip: ip,
            server_id: server_id,
            money: 0,
            gold: 0,
            vip_level: 0,
            recharge: 0,
            map_key: common.func.getMapKey(x, y),
            x: x,
            y: y,
            create_time: timestamp,
            update_time: timestamp,
            login_time: timestamp,
            logout_time: timestamp,
        };

        return await super.insertDaoRowPromise(player_info_result)
    }
}

PlayerInfoDao.m_instance = null;

module.exports = PlayerInfoDao;
