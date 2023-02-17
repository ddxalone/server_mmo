const common = require("../../common");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");

/**
 * @class {LogLoginDao}
 * @extends {BaseDao}
 */
class LogLoginDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'log_login';
        this.db_key = 'log_id';
        this.db_field = {
            player_id: 'number',
            type: 'number',
            ip: 'string',
            create_time: 'number',
        };
    }

    static instance() {
        if (LogLoginDao.m_instance === null) {
            LogLoginDao.m_instance = new LogLoginDao();
        }
        return LogLoginDao.m_instance;
    }

    getInfo(dao) {
        return dao;
    }

    insertLoginLog(player_id, ip, type, timestamp) {
        let log_login_result = {
            player_id: player_id,
            type: type,
            ip: ip,
            create_time: timestamp,
        };

        this.insertDaoRow(log_login_result);
        // return await super.insertDaoRowPromise(log_login_result)
    }
}

LogLoginDao.m_instance = null;

module.exports = LogLoginDao;
