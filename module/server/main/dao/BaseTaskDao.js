const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseTaskInfo = require("../info/BaseTaskInfo");

/**
 * @class {BaseTaskDao}
 * @extends {BaseDao}
 */
class BaseTaskDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_task_info';
        this.db_key = 'task_type';
        this.db_field = {
            task_type: 'number',
            force: 'number',
            category: 'number',
            difficult: 'number',
            template_id: 'number',
            score: 'number',
            name: 'string',
            content: 'string',
            target: 'string',
            safe_min: 'number',
            safe_max: 'number',
            reward_score: 'number',
            target_task_type: 'number',
            radius: 'number',
        };
    }

    static instance() {
        if (BaseTaskDao.m_instance === null) {
            BaseTaskDao.m_instance = new BaseTaskDao();
        }
        return BaseTaskDao.m_instance;
    }

    /**
     * @param dao
     * @returns {BaseTaskInfo}
     */
    getInfo(dao) {
        return new BaseTaskInfo(dao).setServerDao(this);
    }
}

BaseTaskDao.m_instance = null;

module.exports = BaseTaskDao;
