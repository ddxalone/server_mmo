const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");
const WorldTaskInfo = require("./info/WorldTaskInfo");

/**
 * 玩家任务管理器
 * @class {ServerWorldTask}
 */
class ServerWorldTask {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;

        this._max_task_id = 1000;
        /**
         * 任务空间索引
         * @type {Object<number, WorldTaskInfo>}
         */
        this.world_index_task_list = {};
    }

    static instance() {
        if (ServerWorldTask.m_instance == null) {
            ServerWorldTask.m_instance = new ServerWorldTask();
        }
        return ServerWorldTask.m_instance;
    }

    set max_task_id(value) {
        this._max_task_id = Math.max(this._max_task_id, value);
    }

    get max_task_id() {
        return ++this._max_task_id;
    }

    async initServerTask() {
        let max_task_info = await m_mysql.MysqlManage.selectPromise('player_task', 'max(task_id) as max_task_id', '');
        this.max_task_id = (max_task_info && max_task_info[0].max_task_id) || 0;
    }

    /**
     * 增加死亡空间索引
     * @param world_task_info
     */
    setIndexTaskInfo(world_task_info) {
        this.world_index_task_list[world_task_info.task_id] = world_task_info;
    }

    /**
     * @param task_id
     * @returns {WorldTaskInfo}
     */
    getIndexTaskInfo(task_id) {
        return this.world_index_task_list[task_id];
    }

    /**
     * 添加任务空间到宇宙
     * @param {WorldGalaxyInfo} world_galaxy_info
     * @param {WorldTaskInfo} world_task_info
     */
    addWorldTask(world_galaxy_info, world_task_info) {
        //初始化星系内死亡空间info
        world_task_info.setGlobalX(world_galaxy_info.x + world_task_info.x);
        world_task_info.setGlobalY(world_galaxy_info.y + world_task_info.y);
        world_galaxy_info.setTaskInfo(world_task_info);

        //增加任务空间到索引
        this.setIndexTaskInfo(world_task_info);

        //把base的名称赋值到info
        world_task_info.loadBaseInfo(world_task_info.task_type);
    }

    /**
     * 基于玩家任务信息创建任务空间
     * @param player_task
     */
    createServerTaskInfo(player_task) {
        let point = m_server.ServerMapBlock.getEmptyGalaxyPoint(player_task.galaxy_id, true);
        let world_task_info = new WorldTaskInfo(player_task, point);

        //获取星系info
        let world_galaxy_info = m_server.ServerWorldBlock.getIndexGalaxyInfo(world_task_info.galaxy_id);

        this.addWorldTask(world_galaxy_info, world_task_info);

        m_server.ServerWorldScan.noticeWorldScan(common.static.WORLD_UNIT_TYPE_TASK, world_task_info);

        return world_task_info;
    }

    /**
     * 创建死亡空间
     * @param {WorldTaskInfo} world_task_info 信标信息
     * @param map_grid_info 断层信息
     */
    initWorldTaskDetail(world_task_info, map_grid_info) {
        world_task_info.initDetailInfo(map_grid_info);
        world_task_info.checkTriggerNextStepInit();
    }
}

ServerWorldTask.m_instance = null;

module.exports = ServerWorldTask;

