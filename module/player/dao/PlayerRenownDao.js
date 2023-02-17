const common = require("../../common");
const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerRenown = require("../info/PlayerRenown");

/**
 * @class {PlayerRenownDao}
 * @extends {BaseDao}
 */
class PlayerRenownDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_renown';
        this.db_key = 'renown_id';
        this.db_field = {
            renown_id: 'number',
            player_id: 'number',
            force: 'number',
            value: 'number',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerRenownDao.m_instance === null) {
            PlayerRenownDao.m_instance = new PlayerRenownDao();
        }
        return PlayerRenownDao.m_instance;
    }

    /**
     * @param dao
     * @return {PlayerRenown}
     */
    getInfo(dao) {
        return new PlayerRenown(dao).setServerDao(this);
    }

    async getPlayerRenownsDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoListPromise(wheres);
    }
}

PlayerRenownDao.m_instance = null;

module.exports = PlayerRenownDao;
