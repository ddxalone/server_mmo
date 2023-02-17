const BaseDao = require("../../main/dao/BaseDao");
const m_server = require("../../index");
const WorldDeadInfo = require("../info/WorldDeadInfo");

/**
 * @class {ServerDeadInfoDao}
 * @extends {BaseDao}
 */
class ServerDeadInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'server_dead_info';
        this.db_key = 'dead_id';
        this.db_field = {
            dead_id: 'number',
            galaxy_id: 'number',
            dead_type: 'number',
            x: 'number',
            y: 'number',
            create_time: 'number',
        };
    }

    static instance() {
        if (ServerDeadInfoDao.m_instance === null) {
            ServerDeadInfoDao.m_instance = new ServerDeadInfoDao();
        }
        return ServerDeadInfoDao.m_instance;
    }

    getInfo(dao) {
        return new WorldDeadInfo(dao).setServerDao(this);
    }

    async insertServerDead(server_dead_result) {
        return await super.insertDaoRowPromise(server_dead_result);
    }
}

ServerDeadInfoDao.m_instance = null;

module.exports = ServerDeadInfoDao;
