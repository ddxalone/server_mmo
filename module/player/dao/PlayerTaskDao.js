const common = require("../../common");
const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerTask = require("../info/PlayerTask");

/**
 * @class {PlayerTaskDao}
 * @extends {BaseDao}
 */
class PlayerTaskDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_task';
        this.db_key = 'task_id';
        this.db_field = {
            task_id: 'number',
            force: 'number',
            player_id: 'number',
            type: 'number',
            galaxy_id: 'number',
            task_type: 'number',
            x: 'number',
            y: 'number',
            status: 'number',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerTaskDao.m_instance === null) {
            PlayerTaskDao.m_instance = new PlayerTaskDao();
        }
        return PlayerTaskDao.m_instance;
    }

    /**
     * @param dao
     * @return {PlayerTask}
     */
    getInfo(dao) {
        return new PlayerTask(dao).setServerDao(this);
    }

    async getPlayerTasksDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoListPromise(wheres);
    }

    /**
     * @param player_id
     * @param galaxy_id
     * @param x
     * @param y
     * @param timestamp
     * @return {PlayerShip}
     */
    async createRolePlayerTask(player_id, galaxy_id, x, y, timestamp) {
        //TODO 自动创建第一个任务
        let player_task_results = [
            {
                task_id: m_server.ServerWorldTask.max_task_id,
                player_id: player_id,
                task: common.static.TASK_TYPE_MAIN,
                galaxy_id: galaxy_id,
                task_type: 701,
                x: x,
                y: y,
                status: 1,
                create_time: timestamp,
                update_time: timestamp,
            },
        ];

        // 如果需要登录修改的参数在这里修改

        return await super.insertDaoListPromise(player_task_results)
    }

    updateStatusDb(task_id, status) {
        let wheres = {task_id: task_id};
        let fields = {status: status};
        super.updateDaoPart(wheres, fields)
    }
}

PlayerTaskDao.m_instance = null;

module.exports = PlayerTaskDao;
