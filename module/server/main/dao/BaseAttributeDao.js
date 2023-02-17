const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseAttributeInfo = require("../info/BaseAttributeInfo");

/**
 * @class {BaseAttributeDao}
 * @extends {BaseDao}
 */
class BaseAttributeDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_attribute_info';
        this.db_key = 'attribute_type';
        this.db_field = {
            attribute_type: 'number',//属性类型
            scope: 'number',//作用域
            property: 'string',//属性种类
            name: 'string',//装备名称
            content: 'string',//装备描述
            extra: 'object',//特殊属性
        };
    }

    static instance() {
        if (BaseAttributeDao.m_instance === null) {
            BaseAttributeDao.m_instance = new BaseAttributeDao();
        }
        return BaseAttributeDao.m_instance;
    }

    getInfo(dao) {
        return new BaseAttributeInfo(dao).setServerDao(this);
    }
}

BaseAttributeDao.m_instance = null;

module.exports = BaseAttributeDao;
