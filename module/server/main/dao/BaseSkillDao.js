const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseSkillInfo = require("../info/BaseSkillInfo");

/**
 * @class {BaseSkillDao}
 * @extends {BaseDao}
 */
class BaseSkillDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_skill_info';
        this.db_key = 'skill_type';
        this.db_field = {
            skill_type: 'number',//技能类型
            name: 'string',//技能名称
            content: 'string',//技能描述
            x: 'number',//x坐标
            y: 'number',//y坐标
            attribute: 'object',//属性里诶啊哦
            least: 'number',//需求最小点数
            max: 'number',//最大点数
            extra: 'object',//特殊属性
        };
    }

    static instance() {
        if (BaseSkillDao.m_instance === null) {
            BaseSkillDao.m_instance = new BaseSkillDao();
        }
        return BaseSkillDao.m_instance;
    }

    getInfo(dao) {
        return new BaseSkillInfo(dao).setServerDao(this);
    }
}

BaseSkillDao.m_instance = null;

module.exports = BaseSkillDao;
