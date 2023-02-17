const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseForceInfo = require("../info/BaseForceInfo");

/**
 * @class {BaseForceDao}
 * @extends {BaseDao}
 */
class BaseForceDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_force_info';
        this.db_key = 'force';
        this.db_field = {
            force: 'number',//技能类型
            name: 'string',//技能名称
            content: 'string',//技能描述
        };
    }

    static instance() {
        if (BaseForceDao.m_instance === null) {
            BaseForceDao.m_instance = new BaseForceDao();
        }
        return BaseForceDao.m_instance;
    }

    getInfo(dao) {
        return new BaseForceInfo(dao).setServerDao(this);
    }
}

BaseForceDao.m_instance = null;

module.exports = BaseForceDao;
