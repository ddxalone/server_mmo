const m_server = require("../../index");
const common = require("../../../common");
const UnitShipNpcer = require("../../map/info/UnitShipNpcer");
const UnitDead = require("../../map/info/UnitDead");
const BaseDaoInfo = require("../../main/info/BaseDaoInfo");
const TemplateInfo = require("./TemplateInfo");

/**
 * @callback callbackWorldDeadInfo
 * @param {WorldDeadInfo} world_dead_info
 */

/**
 * 死亡空间信息
 * @class {WorldDeadInfo}
 */

class WorldDeadInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.dead_id = dao.dead_id;
        this.dead_type = dao.dead_type;

        this.rotation = common.func.getRandRotation();

        this.global_x = 0;
        this.global_y = 0;

        this.x = this.dao.x * common.setting.draw_ratio;
        this.y = this.dao.y * common.setting.draw_ratio;
        this.name = '';

        this.radius = 0;
        this.radius_pow = 0;

        /**
         * @type {MapGridInfo}
         */
        this.map_grid_info = null;
        /**
         * @type {UnitDead}
         */
        this.unit_dead = null;

        this.draw_ratio = common.setting.draw_ratio;

        /**
         * @type {TemplateInfo}
         */
        this.template_info = null;
        /**
         * @type {BaseDeadInfo}
         */
        this.base_dead_info = null;
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

    loadBaseInfo(base_dead_info) {
        this.setName(base_dead_info.dao.name);
        this.setRadius(base_dead_info.dao.radius);

        this.base_dead_info = base_dead_info;
    }


    /**
     * 初始化死亡空间信息
     */
    initDetailInfo(map_grid_info) {
        if (this.unit_dead !== null) {
            dd('此时不应该再初始化死亡空间了');
        }
        this.template_info = new TemplateInfo(this)
            .loadBaseInfo(this.base_dead_info)
            .setGlobalPoint(this.global_x, this.global_y);

        this.map_grid_info = map_grid_info;
        this.unit_dead = this.map_grid_info.createUnitDead(this);
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
            .setBaseUnitType(common.static.WORLD_NPCER_UNIT_TYPE_DEAD)
            .setWorldDeadInfo(this)
            .moveSafeGridInfo(this.map_grid_info);
    }

    /**
     * 死亡空间成功
     */
    templateSuccess() {
        //TODO 死亡空间完成了
        //降声望 移除一类的
    }

    /**
     * TODO
     * 死亡空间失败
     */
    templateFailed() {
    }
}

module.exports = WorldDeadInfo;
