const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @callback callbackBaseTaskInfo
 * @param {BaseTaskInfo} base_task_info
 */

/**
 * @class {BaseTaskInfo}
 */
class BaseTaskInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.task_type = dao.task_type;
        //当前类型死亡空间数量统计
        this.count = 0;
    }
}

module.exports = BaseTaskInfo;
