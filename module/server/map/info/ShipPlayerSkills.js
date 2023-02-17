const common = require("../../../common");
const m_server = require("../../../server");
const ItemProperties = require("./ItemProperties");

/**
 * @callback callbackShipPlayerSkill
 * @param {ShipPlayerSkill} ship_player_skill
 */
/**
 * @class {ShipPlayerSkills}
 */
class ShipPlayerSkills {
    constructor() {
        /**
         * @type {Object<number, ShipPlayerSkill>}
         */
        this.player_skills = {};
    }

    /**
     * @param ship_skills
     */
    updateSkills(ship_skills) {
        //这里可直接遍历后端技能树
        for (let skill_info of ship_skills) {
            //只有新增 没有移除
            if (!this.player_skills[skill_info.skill_type]) {
                let base_skill_info = this.getBaseSkillInfo(skill_info.skill_type);
                this.player_skills[skill_info.skill_type] = new ShipPlayerSkill(skill_info.skill_type)
                    .setBaseSkillInfo(base_skill_info);
            }
            this.player_skills[skill_info.skill_type].loadInfo(skill_info);
        }
    }

    getBaseSkillInfo(skill_type) {
        return m_server.ServerBaseSkill.getBaseSkill(skill_type).getDao();
    }

    /**
     * @param {callbackShipPlayerSkill} callback
     * @param thisObj
     */
    eachShipPlayerSkill(callback, thisObj) {
        for (let ship_player_skill of Object.values(this.player_skills)) {
            callback && callback.call(thisObj, ship_player_skill);
        }
    }

    /**
     * 获取核心技能等级
     * @returns {number}
     */
    getCoreSkillLevel() {
        return this.player_skills[common.static.PLAYER_SKILL_CORE_ID].level;
    }

    getClientShipPlayerSkills() {
        let skills = {};
        this.eachShipPlayerSkill((ship_player_skill) => {
            skills[ship_player_skill.skill_type] = ship_player_skill.getClientShipPlayerSkill();
        }, this);
        return skills;
    }
}

class ShipPlayerSkill {
    constructor(skill_type) {
        this.skill_type = skill_type;
        this.level = 0;
        this.attribute = null;
        this.least = 0;
        this.max = 0;

    }

    /**
     * @param base_skill_info
     * @return {ShipPlayerSkill}
     */
    setBaseSkillInfo(base_skill_info) {
        this.attribute = base_skill_info.attribute;
        this.least = base_skill_info.least;
        this.max = base_skill_info.max;

        this.skill_properties = new ItemProperties()
            .initProperty(base_skill_info.attribute);

        return this;
    }

    /**
     * @param ship_skill
     * @return {ShipPlayerSkill}
     */
    loadInfo(ship_skill) {
        this.level = ship_skill.level;
        return this;
    }

    getClientShipPlayerSkill() {
        return {
            skill_type: this.skill_type,
            level: this.level,
        }
    }
}

module.exports = ShipPlayerSkills;
