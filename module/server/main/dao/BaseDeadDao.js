const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseDeadInfo = require("../info/BaseDeadInfo");

/**
 * @class {BaseDeadDao}
 * @extends {BaseDao}
 */
class BaseDeadDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_dead_info';
        this.db_key = 'dead_type';
        this.db_field = {
            dead_type: 'number',
            force: 'number',
            category: 'number',
            difficult: 'number',
            template_id: 'number',
            score: 'number',
            name: 'string',
            content: 'string',
            safe_min: 'number',
            safe_max: 'number',
            count: 'number',
            radius: 'number',
        };
    }

    static instance() {
        if (BaseDeadDao.m_instance === null) {
            BaseDeadDao.m_instance = new BaseDeadDao();
        }
        return BaseDeadDao.m_instance;
    }

    /**
     * @param dao
     * @returns {BaseDeadInfo}
     */
    getInfo(dao) {
        return new BaseDeadInfo(dao).setServerDao(this);
    }
}

BaseDeadDao.m_instance = null;

module.exports = BaseDeadDao;
