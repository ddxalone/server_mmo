const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseSkillInfo}
 */
class BaseSkillInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.skill_type = dao.skill_type;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseSkillInfo;
