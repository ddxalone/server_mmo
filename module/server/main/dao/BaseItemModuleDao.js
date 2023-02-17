const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseItemModuleInfo = require("../info/BaseItemModuleInfo");

/**
 * @class {BaseItemModuleDao}
 * @extends {BaseDao}
 */
class BaseItemModuleDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_item_module_info';
        this.db_key = 'item_type';
        this.db_field = {
            item_type: 'number',//装备类型
            base_item_type: 'number',//基础装备类型
            classify: 'number',//装备分类11激光12弹药13导弹
            size: 'number',//装备规格
            name: 'string',//装备名称
            content: 'string',//装备描述
            quality: 'number',//装备品质
            cool_down: 'number',//冷却时间固定
            mass: 'number',//增加质量固定
            require: 'number',//需求能量固定
            cost: 'number',//电容消耗固定
            suit_type: 'number',//套装编号
            res: 'string',//资源
            need: 'object',//需求技能
            property: 'object',//基础属性
            attribute: 'object',//属性列表
            extra: 'object',//特殊属性
        };
    }

    static instance() {
        if (BaseItemModuleDao.m_instance === null) {
            BaseItemModuleDao.m_instance = new BaseItemModuleDao();
        }
        return BaseItemModuleDao.m_instance;
    }

    getInfo(dao) {
        return new BaseItemModuleInfo(dao).setServerDao(this);
    }
}

BaseItemModuleDao.m_instance = null;

module.exports = BaseItemModuleDao;
