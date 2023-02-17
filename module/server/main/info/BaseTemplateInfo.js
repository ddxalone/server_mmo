const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @callback callbackBaseTemplateInfo
 * @param {BaseTemplateInfo} base_dead_info
 */

/**
 * @class {BaseTemplateInfo}
 */
class BaseTemplateInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.template_id = dao.template_id;
        /**
         * @type {Object<number, BaseTemplateStepInfo>}
         */
        this.step_list = {};

        /**
         * @type {Array<BaseTemplateStepInfo>}
         */
        this.step_list_array = [];
    }

    /**
     * @param base_dead_step_info
     */
    setStepInfo(base_dead_step_info) {
        this.step_list[base_dead_step_info.step] = base_dead_step_info;
    }

    buildStepListArray() {
        this.step_list_array = Object.values(this.step_list);
    }

    /**
     * @param step
     * @returns {BaseTemplateStepInfo}
     */
    getStepInfo(step) {
        return this.step_list[step];
    }

    /**
     * @param {callbackBaseTemplateStepInfo} callback
     * @param thisObj
     */
    eachStepInfos(callback, thisObj) {
        for (let step_info of this.step_list_array) {
            callback && callback.call(thisObj, step_info);
        }
    }
}

module.exports = BaseTemplateInfo;
