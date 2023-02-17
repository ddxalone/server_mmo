const common = require("../../common");
const m_server = require("../../server");
const UnitStation = require("../map/info/UnitStation");

/**
 * 世界管理器
 * @class {ServerWorldStation}
 */
class ServerWorldStation {
    constructor() {
        this._max_station_id = 1000;
        //空间站列表 以后空间站周围的单位放到这里来处理
        //例如运送队的虚拟舰队等 不放在这里 放在 main/info/BaseStation.js 处理
        this.world_index_station_list = {}
    }

    static instance() {
        if (ServerWorldStation.m_instance == null) {
            ServerWorldStation.m_instance = new ServerWorldStation();
        }
        return ServerWorldStation.m_instance;
    }

    set max_station_id(value) {
        this._max_station_id = Math.max(this._max_station_id, value);
    }

    get max_station_id() {
        return ++this._max_station_id;
    }

    async initServerStation() {
        this.initServerStationInfoResponse(await m_server.ServerStationInfoDao.initDaoListPromise(null));
    }

    /**
     * 增加死亡空间索引
     * @param world_station_info
     */
    setIndexStationInfo(world_station_info) {
        this.world_index_station_list[world_station_info.station_id] = world_station_info;
    }

    /**
     * @param station_id
     * @returns {WorldStationInfo}
     */
    getIndexStationInfo(station_id) {
        return this.world_index_station_list[station_id];
    }

    /**
     * @param {Object<number, WorldStationInfo>} station_info_list
     */
    initServerStationInfoResponse(station_info_list) {
        for (let world_station_info of Object.values(station_info_list)) {
            //获取星系info
            let world_galaxy_info = m_server.ServerWorldBlock.getIndexGalaxyInfo(world_station_info.dao.galaxy_id);
            //初始化星系内行星info
            this.addWorldStation(world_galaxy_info, world_station_info);
        }

        this.outputStationJson();

        console.log("db station_info init done");
    }

    /**
     * @param {WorldGalaxyInfo} world_galaxy_info
     * @param {WorldStationInfo} world_station_info
     */
    addWorldStation(world_galaxy_info, world_station_info) {
        world_station_info.setGlobalX(world_galaxy_info.x + world_station_info.x);
        world_station_info.setGlobalY(world_galaxy_info.y + world_station_info.y);
        world_galaxy_info.setStationInfo(world_station_info);

        //增加空间站到索引
        this.setIndexStationInfo(world_station_info);

        this.max_station_id = world_station_info.station_id;
    }

    /**
     * 创建空间站
     * @param {WorldStationInfo} world_station_info 信标信息
     * @param new_grid_info 断层信息
     */
    initWorldStation(world_station_info, new_grid_info) {
        new UnitStation()
            .loadInfo(world_station_info)
            .moveSafeGridInfo(new_grid_info);
    }

    /**
     * 输出空间站静态文件
     */
    outputStationJson() {
        common.file.outputStationFile(this.world_index_station_list);
    }
}

ServerWorldStation.m_instance = null;

module.exports = ServerWorldStation;

