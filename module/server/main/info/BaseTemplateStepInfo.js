const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @callback callbackBaseTemplateStepInfo
 * @param {BaseTemplateStepInfo} base_template_step_info
 */

/**
 * @class {BaseTemplateStepInfo}
 */
class BaseTemplateStepInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.template_id = dao.template_id;
        this.step = dao.step;
        /**
         * @type {Object<number, BaseTemplatePlanInfo>}
         */
        this.plan_list = {};
        /**
         *
         * @type {Array<BaseTemplatePlanInfo>}
         */
        this.plan_list_array = [];
    }

    /**
     * @param base_template_plan_info
     */
    setPlanInfo(base_template_plan_info) {
        this.plan_list[base_template_plan_info.plan_id] = base_template_plan_info;
    }

    buildPlanListArray() {
        this.plan_list_array = Object.values(this.plan_list);
    }

    getPlanInfo(id) {
        return this.plan_list[id];
    }

    /**
     * @param {callbackBaseTemplatePlanInfo} callback
     * @param thisObj
     */
    eachPlanInfos(callback, thisObj) {
        for (let plan_info of this.plan_list_array) {
            callback && callback.call(thisObj, plan_info)
        }
    }
}

module.exports = BaseTemplateStepInfo;
