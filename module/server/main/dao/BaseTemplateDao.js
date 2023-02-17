const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseTemplateInfo = require("../info/BaseTemplateInfo");

/**
 * @class {BaseTemplateDao}
 * @extends {BaseDao}
 */
class BaseTemplateDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_template_info';
        this.db_key = 'template_id';
        this.db_field = {
            template_id: 'number',
            name: 'string',
            content: 'string',
        };
    }

    static instance() {
        if (BaseTemplateDao.m_instance === null) {
            BaseTemplateDao.m_instance = new BaseTemplateDao();
        }
        return BaseTemplateDao.m_instance;
    }

    /**
     * @param dao
     * @returns {BaseTemplateInfo}
     */
    getInfo(dao) {
        return new BaseTemplateInfo(dao).setServerDao(this);
    }
}

BaseTemplateDao.m_instance = null;

module.exports = BaseTemplateDao;
