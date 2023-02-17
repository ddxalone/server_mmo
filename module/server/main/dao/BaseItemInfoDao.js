const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseItemInfo = require("../info/BaseItemInfo");

/**
 * @class {BaseItemInfoDao}
 * @extends {BaseDao}
 */
class BaseItemInfoDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_item_info';
        this.db_key = 'item_type';
        this.db_field = {
            item_type: 'number',//装备类型
            classify: 'number',//装备分类11激光12弹药13导弹
            name: 'string',//装备名称
            content: 'string',//装备描述
            quality: 'number',//装备品质
            res: 'string',//资源
            extra: 'object',//特殊属性
        };
    }

    static instance() {
        if (BaseItemInfoDao.m_instance === null) {
            BaseItemInfoDao.m_instance = new BaseItemInfoDao();
        }
        return BaseItemInfoDao.m_instance;
    }

    getInfo(dao) {
        return new BaseItemInfo(dao).setServerDao(this);
    }
}

BaseItemInfoDao.m_instance = null;

module.exports = BaseItemInfoDao;
