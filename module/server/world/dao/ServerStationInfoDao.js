const BaseDao = require("../../main/dao/BaseDao");
const m_server = require("../../index");
const WorldStationInfo = require("../info/WorldStationInfo");

/**
 * @class {ServerStationInfoDao}
 * @extends {BaseDao}
 */
class ServerStationInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'server_station_info';
        this.db_key = 'station_id';
        this.db_field = {
            station_id: 'number',
            galaxy_id: 'number',
            force: 'number',
            name: 'string',
            x: 'number',
            y: 'number',
            radius: 'number',
            cycle: 'number',
        };
    }

    static instance() {
        if (ServerStationInfoDao.m_instance === null) {
            ServerStationInfoDao.m_instance = new ServerStationInfoDao();
        }
        return ServerStationInfoDao.m_instance;
    }

    getInfo(dao) {
        return new WorldStationInfo(dao).setServerDao(this);
    }
}

ServerStationInfoDao.m_instance = null;

module.exports = ServerStationInfoDao;
