const common = require("../../common");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerExtra = require("../info/PlayerExtra");

/**
 * @class {PlayerExtraDao}
 * @extends {BaseDao}
 */
class PlayerExtraDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_extra';
        this.db_key = 'player_id';
        this.db_field = {
            player_id: 'number',
            create_time: 'number',
            update_time: 'number',
        };
        this.initExtra();
    }

    static instance() {
        if (PlayerExtraDao.m_instance === null) {
            PlayerExtraDao.m_instance = new PlayerExtraDao();
        }
        return PlayerExtraDao.m_instance;
    }

    initExtra() {
        for (let i = 1; i < common.setting.player_extra_number; i++) {
            this.db_field[common.func.fillZero(i, 2)] = 'number';
        }
    }

    getInfo(dao) {
        return new PlayerExtra(dao).setServerDao(this);
    }

    /**
     * @param player_id
     * @returns {PlayerExtra}
     */
    async getPlayerExtraDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoRowPromise(wheres);
    }

    /**
     * @param player_id
     * @param timestamp
     * @return {PlayerExtra}
     */
    async createRolePlayerExtra(player_id, timestamp) {
        let player_extra_result = {
            player_id: player_id,
            create_time: timestamp,
            update_time: timestamp,
            login_time: timestamp,
            logout_time: timestamp,
        };

        for (let i = 1; i < common.setting.player_extra_number; i++) {
            player_extra_result[common.func.fillZero(i, 2)] = 0;
        }

        //如果需要创角修改的参数在这里修改
        player_extra_result[common.extra.EXTRA_LEVEL] = 1;

        return await super.insertDaoRowPromise(player_extra_result)
    }
}

PlayerExtraDao.m_instance = null;

module.exports = PlayerExtraDao;
