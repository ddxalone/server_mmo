const m_server = require("../../server");
const common = require("../../common");

/**
 * 死亡空间管理器
 * @class {ServerWorldDead}
 */
class ServerWorldDead {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;

        this._max_dead_id = 1000;
        /**
         * 死亡空间索引
         * @type {Object<number, WorldDeadInfo>}
         */
        this.world_index_dead_list = {};
    }

    static instance() {
        if (ServerWorldDead.m_instance == null) {
            ServerWorldDead.m_instance = new ServerWorldDead();
        }
        return ServerWorldDead.m_instance;
    }

    set max_dead_id(value) {
        this._max_dead_id = Math.max(this._max_dead_id, value);
    }

    get max_dead_id() {
        return ++this._max_dead_id;
    }

    async initServerDead() {
        this.initServerDeadInfoResponse(await m_server.ServerDeadInfoDao.initDaoListPromise(null));
    }

    initServerDeadInfoResponse(dead_info_list) {
        for (let world_dead_info of Object.values(dead_info_list)) {
            //获取星系info
            let world_galaxy_info = m_server.ServerWorldBlock.getIndexGalaxyInfo(world_dead_info.dao.galaxy_id);

            this.addWorldDead(world_galaxy_info, world_dead_info);
        }
        console.log("db dead_info init done");
    }

    /**
     * 增加死亡空间索引
     * @param world_dead_info
     */
    setIndexDeadInfo(world_dead_info) {
        this.world_index_dead_list[world_dead_info.dead_id] = world_dead_info;
    }

    /**
     * @param dead_id
     * @returns {WorldDeadInfo}
     */
    getIndexDeadInfo(dead_id) {
        return this.world_index_dead_list[dead_id];
    }

    /**
     * 添加死亡空间到宇宙
     * @param {WorldGalaxyInfo} world_galaxy_info
     * @param {WorldDeadInfo} world_dead_info
     */
    addWorldDead(world_galaxy_info, world_dead_info) {
        //初始化星系内死亡空间info
        world_dead_info.setGlobalX(world_galaxy_info.x + world_dead_info.x);
        world_dead_info.setGlobalY(world_galaxy_info.y + world_dead_info.y);
        world_galaxy_info.setDeadInfo(world_dead_info);

        //增加死亡空间到索引
        this.setIndexDeadInfo(world_dead_info);

        //增加死亡空间刷新数量
        let base_dead_info = m_server.ServerBaseDead.getBaseDead(world_dead_info.dao.dead_type);
        base_dead_info.addCount();

        //把base的名称赋值到info
        world_dead_info.loadBaseInfo(base_dead_info);

        this.max_dead_id = world_dead_info.dead_id;
    }

    /**
     * 刷新死亡空间
     */
    refreshWorldDead() {
        //遍历基础死亡空间信息
        m_server.ServerBaseDead.eachBaseDead((base_dead_info) => {
            //计算需要刷新的数量
            for (let pos = 0; pos < base_dead_info.getLessCount(); pos++) {
                //随机一个安等符合要求的星系
                let force_list = common.func.getRefreshDeadForce(base_dead_info.dao.force);
                let world_galaxy_info = m_server.ServerWorldBlock.getRandomGalaxyFromSafe(base_dead_info.dao.safe_min, base_dead_info.dao.safe_max, force_list);
                //获取一个空的星系坐标点
                let point = m_server.ServerMapBlock.getEmptyGalaxyPoint(world_galaxy_info.galaxy_id, true);
                let server_dead_result = {};
                server_dead_result.dead_id = this.max_dead_id;
                server_dead_result.galaxy_id = world_galaxy_info.galaxy_id;
                server_dead_result.dead_type = base_dead_info.dead_type;
                server_dead_result.x = Math.round(point.x / this.draw_ratio);
                server_dead_result.y = Math.round(point.y / this.draw_ratio);
                server_dead_result.create_time = common.func.getUnixTime();

                this.createServerDeadInfo(server_dead_result);
            }
        }, this);
    }

    /**
     * 创建死亡空间
     * @param server_dead_result
     */
    createServerDeadInfo(server_dead_result) {
        // let world_dead_info = await m_server.ServerDeadInfoDao.insertServerDead(server_dead_result);
        let world_dead_info = m_server.ServerDeadInfoDao.createRowInfo(server_dead_result);
        world_dead_info.dbHandle();

        //获取星系info
        let world_galaxy_info = m_server.ServerWorldBlock.getIndexGalaxyInfo(world_dead_info.dao.galaxy_id);

        this.addWorldDead(world_galaxy_info, world_dead_info);

        m_server.ServerWorldScan.noticeWorldScan(common.static.WORLD_UNIT_TYPE_DEAD, world_dead_info);
    }

    /**
     * 创建死亡空间
     * @param {WorldDeadInfo} world_dead_info 信标信息
     * @param map_grid_info 断层信息
     */
    initWorldDeadDetail(world_dead_info, map_grid_info) {
        world_dead_info.initDetailInfo(map_grid_info);
        world_dead_info.checkTriggerNextStepInit();
    }
}

ServerWorldDead.m_instance = null;

module.exports = ServerWorldDead;

