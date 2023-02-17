const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseDeadStepInfo = require("../info/BaseTemplateStepInfo");

/**
 * @class {BaseTemplateStepDao}
 * @extends {BaseDao}
 */
class BaseTemplateStepDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_template_step_info';
        this.db_key = 'step_id';
        this.db_field = {
            step_id: 'number',
            template_id: 'number',
            step: 'number',
            content: 'string',
            trigger: 'array',
            actions: 'array',
        };
    }

    static instance() {
        if (BaseTemplateStepDao.m_instance === null) {
            BaseTemplateStepDao.m_instance = new BaseTemplateStepDao();
        }
        return BaseTemplateStepDao.m_instance;
    }

    /**
     * @param dao
     * @returns {BaseDeadStepInfo}
     */
    getInfo(dao) {
        return new BaseDeadStepInfo(dao).setServerDao(this);
    }
}

BaseTemplateStepDao.m_instance = null;

module.exports = BaseTemplateStepDao;
