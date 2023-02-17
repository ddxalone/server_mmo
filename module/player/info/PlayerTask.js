const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerTask
 * @param {PlayerTask} player_task
 */
/**
 * @class {PlayerTask}
 */
class PlayerTask extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.task_id = dao.task_id;
        this.force = dao.force;
        this.type = dao.type;
        this.player_id = dao.player_id;
        this.galaxy_id = dao.galaxy_id;
        this.task_type = dao.task_type;
        // this.x = this.dao.x * this.draw_ratio;
        // this.y = this.dao.y * this.draw_ratio;

        /**
         * @type {PlayerInfo}
         */
        this.player_info = null;

        this.base_task_info = null;

        //触发完成剩余数量 null未触发
        // this.task_less_count = 0;
    }


    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseTaskInfo() {
        this.base_task_info || (this.base_task_info = m_server.ServerBaseTask.getBaseTask(this.task_type).getDao());
        return this.base_task_info;
    }

    /**
     * @param {PlayerInfo} player_info
     */
    setPlayerInfo(player_info) {
        this.player_info = player_info;
    }

    /**
     * 更新任务数量
     * @param task_less_count
     */
    // updateTaskLessCount(task_less_count) {
    //     if (this.task_less_count !== task_less_count) {
    //         this.task_less_count = task_less_count;
    //
    //         this.player_info.setPlayerTaskChange(this);
    //     }
    // }

    /**
     * 完成任务
     */
    completeTask() {
        //TODO
        this.setDaoValue('status', common.static.TASK_STATUS_COMPLETE);
        this.player_info.setPlayerTaskChange(this);
    }

    /**
     * 发放奖励
     */
    rewardTask() {
        //TODO
        this.setDaoValue('status', common.static.TASK_STATUS_REWARD);
        this.player_info.setPlayerTaskChange(this);

        //告知用户得到奖励 再发送 如果任务过期了等等 不发送奖励 发送
        this.player_info.removePlayerTask(this);
    }

    /**
     * 任务失败
     */
    failedTask() {
        this.setDaoValue('status', common.static.TASK_STATUS_FAILED);
        this.player_info.setPlayerTaskChange(this);

        //告知用户得到奖励 再发送 如果任务过期了等等 不发送奖励 发送
        this.player_info.removePlayerTask(this);
    }

    getClientPlayerTask() {
        return {
            task_id: this.task_id,
            type: this.type,
            force: this.force,
            player_id: this.player_id,
            galaxy_id: this.galaxy_id,
            task_type: this.task_type,
            // task_less_count: this.task_less_count,
            status: this.dao.status,
        }
    }
}

module.exports = PlayerTask;
