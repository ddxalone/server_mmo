const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseItemSuitInfo = require("../info/BaseItemSuitInfo");

/**
 * @class {BaseItemSuitDao}
 * @extends {BaseDao}
 */
class BaseItemSuitDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_item_suit_info';
        this.db_key = 'suit_type';
        this.db_field = {
            suit_type: 'number',//装备类型
            套装: 'number',//装备规格
            name: 'string',//装备名称
            content: 'string',//装备描述
            quality: 'number',//装备描述
            attribute: 'object',//属性列表
        };
    }

    static instance() {
        if (BaseItemSuitDao.m_instance === null) {
            BaseItemSuitDao.m_instance = new BaseItemSuitDao();
        }
        return BaseItemSuitDao.m_instance;
    }

    getInfo(dao) {
        return new BaseItemSuitInfo(dao).setServerDao(this);
    }
}

BaseItemSuitDao.m_instance = null;

module.exports = BaseItemSuitDao;
