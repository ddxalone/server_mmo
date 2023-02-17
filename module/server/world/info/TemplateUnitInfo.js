const common = require("../../../common");

/**
 * @class {TemplateUnitInfo}
 */
class TemplateUnitInfo {
    constructor(template_unit_id, ship_type) {
        this.draw_ratio = common.setting.draw_ratio;
        this.ship_type = ship_type;
        this.global_x = 0;
        this.global_y = 0;
        this.enter = 0;
        this.step = 0;
        this.camp = 0;
        this.force = 0;

        //每个空间的基础单位ID 用于触发等
        this.template_unit_id = template_unit_id;

        /**
         * @type {UnitShipNpcer}
         */
        this.unit_ship_npcer = null;
    }

    /**
     * @param unit_ship_npcer
     */
    setUnitShipNpcer(unit_ship_npcer) {
        this.unit_ship_npcer = unit_ship_npcer;
    }

    /**
     * @param force
     * @returns {TemplateUnitInfo}
     */
    setForce(force) {
        this.force = force;
        return this;
    }

    /**
     * @param base_template_plan_info
     * @return {TemplateUnitInfo}
     */
    setInfo(base_template_plan_info) {
        this.plan_id = base_template_plan_info.plan_id;
        this.step = base_template_plan_info.step;
        this.enter = base_template_plan_info.getEnter();
        this.camp = base_template_plan_info.getCamp();
        return this;
    }

    /**
     * @param global_x
     * @param global_y
     * @return {TemplateUnitInfo}
     */
    setGlobalPoint(global_x, global_y) {
        this.global_x = global_x;
        this.global_y = global_y;
        return this;
    }

    /**
     * @param x
     * @param y
     * @return {TemplateUnitInfo}
     */
    setPoint(x, y) {
        this.x = this.global_x + x;
        this.y = this.global_y + y;
        return this;
    }

    /**
     * @param rotation
     * @return {TemplateUnitInfo}
     */
    setRotation(rotation) {
        this.rotation = rotation;
        return this;
    }
}

module.exports = TemplateUnitInfo;
