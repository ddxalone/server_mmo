const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @callback callbackBaseDeadInfo
 * @param {BaseDeadInfo} base_dead_info
 */

/**
 * @class {BaseDeadInfo}
 */
class BaseDeadInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.dead_type = dao.dead_type;
        //当前类型死亡空间数量统计
        this.count = 0;

        // /**
        //  * @type {BaseTemplateInfo}
        //  */
        // this.base_template_info = null;
    }

    /**
     * 获取缺少的死亡空间的数量
     * @returns {number}
     */
    getLessCount() {
        return this.dao.count - this.count;
    }

    // /**
    //  * @param base_template_info
    //  */
    // setBaseTemplateInfo(base_template_info) {
    //     this.base_template_info = base_template_info;
    // }

    addCount() {
        this.count++;
    }

    subCount() {
        this.count--;
    }
}

module.exports = BaseDeadInfo;
