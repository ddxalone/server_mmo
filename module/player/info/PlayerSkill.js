const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerSkill
 * @param {PlayerSkill} player_skill
 */
/**
 * @class {PlayerSkill}
 */
class PlayerSkill extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.skill_id = dao.skill_id;
        this.player_id = dao.player_id;
        this.skill_type = dao.skill_type;

        this.base_skill_info = null;
    }


    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseSkillInfo() {
        this.base_skill_info || (this.base_skill_info = m_server.ServerBaseSkill.getBaseSkill(this.skill_type).getDao());
        return this.base_skill_info;
    }

    getClientPlayerSkill() {
        return {
            skill_id: this.skill_id,
            skill_type: this.skill_type,
            level: this.dao.level,
            exp: this.dao.exp,
        }
    }
}

module.exports = PlayerSkill;
