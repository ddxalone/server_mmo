const m_server = require("../index");
const m_data = require("../../data");
const common = require("../../common");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerUniverse}
 */
class ServerUniverse {
    constructor() {
    }

    static instance() {
        if (ServerUniverse.m_instance == null) {
            ServerUniverse.m_instance = new ServerUniverse();
        }
        return ServerUniverse.m_instance;
    }

    /**
     * 初始化宇宙信息
     */
    async initServerUniverse() {
        //需要把所用星系和空间站都加载到内存 用于判断安等和获取坐标 转移等操作
        //行星可不用 但是为了未来采集扩展也这么处理 占用内存不是很多
        //修改从数据库读取 改为从json读取
        //前端也需要加载这个json为的是 显示空间站名字以及行星渲染

        //空间站不走静态文件了走数据库 用于处理玩家空间站 及 NPC空间站互殴
        // this.initServerGalaxyInfoResponse(await m_server.ServerGalaxyInfoDao.initDaoListPromise(null));
        // this.initServerPlanetInfoResponse(await m_server.ServerPlanetInfoDao.initDaoListPromise(null,));
        // this.initServerStationInfoResponse(await m_server.ServerStationInfoDao.initDaoListPromise(null));

        this.initServerGalaxyInfoResponse(await m_server.ServerGalaxyInfoDao.initDaoListPromiseFromData(m_data.BaseMapGalaxyData));
        // this.initServerPlanetInfoResponse(await m_server.ServerPlanetInfoDao.initDaoListPromiseFromData(m_data.BaseMapPlanetData,));
        // this.initServerStationInfoResponse(await m_server.ServerStationInfoDao.initDaoListPromiseFromData(m_data.BaseMapStationData));
    }

    /**
     * @param {Object<number, WorldGalaxyInfo>} galaxy_info_list
     */
    initServerGalaxyInfoResponse(galaxy_info_list) {
        // let start_time = common.func.getUnixMTime();

        //结论 先转成数组用of遍历47毫秒 直接in遍历260毫秒
        // for (let i = 0; i < 1000; i++) {
        // for (let galaxy_id in galaxy_info_list) {
        // let temp = galaxy_info_list[galaxy_id];
        // m_server.ServerWorldBlock.setBlockGalaxyInfo(galaxy_info_list[galaxy_id]);
        // }
        for (let galaxy_info of Object.values(galaxy_info_list)) {
            //     let temp = galaxy_info;
            m_server.ServerWorldBlock.setBlockGalaxyInfo(galaxy_info);
        }
        // }

        // dd(common.func.getUnixMTime() - start_time);
        m_server.ServerWorldBlock.buildIndexGalaxyInfo();

        m_server.ServerWorldBlock.outputGalaxyJson();

        console.log("db galaxy_info init done");
    }

}

ServerUniverse.m_instance = null;

module.exports = ServerUniverse;
