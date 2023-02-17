const BaseDao = require("../../main/dao/BaseDao");
const m_server = require("../../index");
const WorldGalaxyInfo = require("../info/WorldGalaxyInfo");

/**
 * @class {ServerGalaxyInfoDao}
 * @extends {BaseDao}
 */
class ServerGalaxyInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'server_galaxy_info';
        this.db_key = 'galaxy_id';
        this.db_field = {
            galaxy_id: 'number',
            name: 'string',
            x: 'number',
            y: 'number',
            radius: 'number',
            cycle: 'number',
            force: 'number',
            safe: 'number',
            land: 'number',
        };
        //表示数据为array db_field的顺序为info的顺序
        this.db_array = true;
    }

    static instance() {
        if (ServerGalaxyInfoDao.m_instance === null) {
            ServerGalaxyInfoDao.m_instance = new ServerGalaxyInfoDao();
        }
        return ServerGalaxyInfoDao.m_instance;
    }

    getInfo(dao) {
        return new WorldGalaxyInfo(dao).setServerDao(this);
    }
}

ServerGalaxyInfoDao.m_instance = null;

module.exports = ServerGalaxyInfoDao;
