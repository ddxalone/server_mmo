const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseTemplatePlanInfo = require("../info/BaseTemplatePlanInfo");

/**
 * @class {BaseTemplatePlanDao}
 * @extends {BaseDao}
 */
class BaseTemplatePlanDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_dead_unit_info';
        this.db_key = 'plan_id';
        this.db_field = {
            plan_id: 'number',
            step_id: 'number',
            template_id: 'number',
            step: 'number',
            group_id: 'number',
            group_ratio: 'number',
            designated: 'number',
            camp: 'number',
            x: 'number',
            y: 'number',
            rotation: 'number',
            range: 'number',
            type: 'number',
            enter: 'number',
            patrol: 'number',
        };
    }

    static instance() {
        if (BaseTemplatePlanDao.m_instance === null) {
            BaseTemplatePlanDao.m_instance = new BaseTemplatePlanDao();
        }
        return BaseTemplatePlanDao.m_instance;
    }

    getInfo(dao) {
        return new BaseTemplatePlanInfo(dao).setServerDao(this);
    }
}

BaseTemplatePlanDao.m_instance = null;

module.exports = BaseTemplatePlanDao;
