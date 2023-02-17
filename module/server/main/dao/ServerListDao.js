const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const ServerInfo = require("../info/ServerInfo");

/**
 * @class {ServerListDao}
 * @extends {BaseDao}
 */
class ServerListDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'server_list';
        this.db_key = 'server_id';
        this.db_field = {
            server_id: 'number',
            server_name: 'string',
            galaxy_id: 'number',
            x: 'number',
            y: 'number',
        };
    }

    static instance() {
        if (ServerListDao.m_instance === null) {
            ServerListDao.m_instance = new ServerListDao();
        }
        return ServerListDao.m_instance;
    }

    /**
     *
     * @param dao
     * @return {ServerInfo}
     */
    getInfo(dao) {
        return new ServerInfo(dao).setServerDao(this);
    }

    async insertServerInfo(server_info_result) {
        return await super.insertDaoRowPromise(server_info_result);
    }
}

ServerListDao.m_instance = null;

module.exports = ServerListDao;
