const m_server = require("../../index");
const m_player = require("../../../player");
const common = require("../../../common");
const UnitShipNpcer = require("../../map/info/UnitShipNpcer");
// const UnitTask = require("../../map/info/UnitTask");
const BaseDaoInfo = require("../../main/info/BaseDaoInfo");
const TemplateInfo = require("./TemplateInfo");

/**
 * @callback callbackWorldTaskInfo
 * @param {WorldTaskInfo} world_task_info
 */

/**
 * 任务信息
 * @class {WorldTaskInfo}
 */

class WorldTaskInfo {
    constructor(player_task, point) {
        this.task_id = player_task.task_id;
        this.player_id = player_task.player_id;
        this.galaxy_id = player_task.galaxy_id;
        this.task_type = player_task.task_type;
        this.force = player_task.force;

        this.rotation = common.func.getRandRotation();

        this.global_x = 0;
        this.global_y = 0;

        this.x = point.x;
        this.y = point.y;
        this.name = '';
        this.radius = 0;
        this.radius_pow = 0;

        /**
         * @type {MapGridInfo}
         */
        this.map_grid_info = null;
        /**
         * TODO
         * @type {UnitTask}
         */
        this.unit_task = null;

        this.draw_ratio = common.setting.draw_ratio;

        /**
         * @type {TemplateInfo}
         */
        this.template_info = null;
        /**
         * @type {BaseTaskInfo}
         */
        this.base_task_info = null;
    }

    setGlobalX(global_x) {
        this.global_x = global_x;
    }

    setGlobalY(global_y) {
        this.global_y = global_y;
    }

    setName(name) {
        this.name = name;
    }

    setRadius(radius) {
        this.radius = radius;
        this.radius_pow = Math.pow(radius, 2);
    }

    // /**
    //  * 用于掉线时 刷新任务指针
    //  * @param player_task
    //  */
    // setPlayerTask(player_task) {
    //     this.template_info.setPlayerTask(player_task)
    // }

    loadBaseInfo(task_type) {
        this.base_task_info = m_server.ServerBaseTask.getBaseTask(task_type)
        this.setName(this.base_task_info.dao.name);
        this.setRadius(this.base_task_info.dao.radius);
    }


    /**
     * 初始化死亡空间信息
     */
    initDetailInfo(map_grid_info) {
        if (this.unit_task !== null) {
            dd('此时不应该再初始化死亡空间了');
        }

        this.template_info = new TemplateInfo(this)
            .setAttackerForce(this.force)
            .loadBaseInfo(this.base_task_info)
            .setGlobalPoint(this.global_x, this.global_y);

        this.map_grid_info = map_grid_info;
        this.unit_task = this.map_grid_info.createUnitTask(this);
    }

    /**
     * 检测初始化触发阶段
     */
    checkTriggerNextStepInit() {
        this.template_info.checkTriggerNextStepType(common.define.TRIGGER_TYPE_INIT);
    }

    /**
     * 检测舰船死亡触发阶段
     * @param template_unit_id
     */
    checkTriggerNextStepDeath(template_unit_id) {
        this.template_info.checkTriggerNextStepType(common.define.TRIGGER_TYPE_DEATH, template_unit_id);
    }

    /**
     * 检测NPC舰船受伤触发阶段
     * @param template_unit_id
     */
    checkTriggerNextStepHarm(template_unit_id) {
        this.template_info.checkTriggerNextStepType(common.define.TRIGGER_TYPE_HARM, template_unit_id);
    }

    /**
     * 检测NPC舰船受伤触发阶段
     * @param template_unit_id
     */
    checkTriggerNextStepByRay(template_unit_id) {
        this.template_info.checkTriggerNextStepType(common.define.TRIGGER_TYPE_RAY, template_unit_id);
    }

    /**
     * 创建世界单位
     * @param template_unit_info
     * @returns {UnitShipNpcer}
     */
    createUnitShipNpcer(template_unit_info) {
        return new UnitShipNpcer()
            .loadInfo(template_unit_info)
            .setBaseUnitType(common.static.WORLD_NPCER_UNIT_TYPE_TASK)
            .setWorldTaskInfo(this)
            .moveSafeGridInfo(this.map_grid_info)
            .npcerEnter();
    }

    /**
     * 任务成功
     */
    templateSuccess() {
        let player_info = m_player.PlayerList.getPlayerInfo(this.player_id);
        if (player_info) {
            //玩家在线
            let player_task = player_info.getPlayerTask(this.task_id);
            // player_task.completeTask();

            player_task.rewardTask();

            player_info.syncClientPlayerTask();
        } else {
            //离线任务
            m_player.PlayerTaskDao.updateStatusDb(this.task_id, common.static.TASK_STATUS_COMPLETE);
        }
    }

    /**
     * TODO
     * 任务失败
     */
    templateFailed() {
    }
}

module.exports = WorldTaskInfo;
