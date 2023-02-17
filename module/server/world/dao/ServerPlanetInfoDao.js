const BaseDao = require("../../main/dao/BaseDao");
const m_server = require("../../index");
const WorldPlanetInfo = require("../info/WorldPlanetInfo");

/**
 * @class {ServerPlanetInfoDao}
 * @extends {BaseDao}
 */
class ServerPlanetInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'server_planet_info';
        this.db_key = 'planet_id';
        this.db_field = {
            planet_id: 'number',
            galaxy_id: 'number',
            x: 'number',
            y: 'number',
            radius: 'number',
            cycle: 'number',
        };
        //表示数据为array db_field的顺序为info的顺序
        this.db_array = true;
    }

    static instance() {
        if (ServerPlanetInfoDao.m_instance === null) {
            ServerPlanetInfoDao.m_instance = new ServerPlanetInfoDao();
        }
        return ServerPlanetInfoDao.m_instance;
    }

    getInfo(dao) {
        return new WorldPlanetInfo(dao).setServerDao(this);
    }
}

ServerPlanetInfoDao.m_instance = null;

module.exports = ServerPlanetInfoDao;
