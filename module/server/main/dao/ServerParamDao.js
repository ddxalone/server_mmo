const BaseDao = require("./BaseDao");

/**
 * @class {ServerParamDao}
 * @extends {BaseDao}
 */
class ServerParamDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'server_param';
        this.db_key = 'title';
        this.db_field = {
            title: 'string',
            value: 'string',
        };
    }

    static instance() {
        if (ServerParamDao.m_instance === null) {
            ServerParamDao.m_instance = new ServerParamDao();
        }
        return ServerParamDao.m_instance;
    }

    getInfo(dao) {
        return dao;
    }
}

ServerParamDao.m_instance = null;

module.exports = ServerParamDao;
