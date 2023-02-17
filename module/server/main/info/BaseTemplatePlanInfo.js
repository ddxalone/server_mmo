const common = require("../../../common");
const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @callback callbackBaseTemplatePlanInfo
 * @param {BaseTemplatePlanInfo} base_template_plan_info
 */

/**
 * @class {BaseTemplatePlanInfo}
 */
class BaseTemplatePlanInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.plan_id = dao.plan_id;
        this.template_id = dao.template_id;
        this.step = dao.step;
        this.x = this.dao.x * this.draw_ratio;
        this.y = this.dao.y * this.draw_ratio;
        this.rotation = this.dao.rotation * this.draw_ratio;
    }

    getCamp() {
        return this.dao.camp;
    }

    getEnter() {
        return this.dao.enter;
    }
}

module.exports = BaseTemplatePlanInfo;
