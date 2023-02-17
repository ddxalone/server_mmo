const m_player = require("../../player");
const BaseDao = require("../../server/main/dao/BaseDao");
const AccountInfo = require("../info/AccountInfo");

/**
 * @class {AccountInfoDao}
 * @extends {BaseDao}
 */
class AccountInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_info';
        this.db_key = 'player_id';
        this.db_field = {
            player_id: 'number',
            open_id: 'string',
            platform: 'string',
            server_id: 'number',
            login_time: 'number',
            lock_time: 'number',
        };
    }

    static instance() {
        if (AccountInfoDao.m_instance == null) {
            AccountInfoDao.m_instance = new AccountInfoDao();
        }
        return AccountInfoDao.m_instance;
    }

    /**
     * @param dao
     * @returns {AccountInfo}
     */
    getInfo(dao) {
        return new AccountInfo(dao).setServerDao(this);
    }

    async getLoginServerList(open_id) {
        let wheres = {
            open_id: open_id,
        };
        return await super.initDaoListPromise(wheres);
    }

    async getAccountInfo(open_id, server_id) {
        let wheres = {
            open_id: open_id,
            server_id: server_id,
        };
        return await super.initDaoRowPromise(wheres);
    }
}

AccountInfoDao.m_instance = null;

module.exports = AccountInfoDao;
