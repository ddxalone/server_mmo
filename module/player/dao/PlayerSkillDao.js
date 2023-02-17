const common = require("../../common");
const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerSkill = require("../info/PlayerSkill");

/**
 * @class {PlayerSkillDao}
 * @extends {BaseDao}
 */
class PlayerSkillDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_skill';
        this.db_key = 'skill_id';
        this.db_field = {
            skill_id: 'number',
            player_id: 'number',
            skill_type: 'number',
            level: 'number',
            exp: 'number',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerSkillDao.m_instance === null) {
            PlayerSkillDao.m_instance = new PlayerSkillDao();
        }
        return PlayerSkillDao.m_instance;
    }

    /**
     * @param dao
     * @return {PlayerSkill}
     */
    getInfo(dao) {
        return new PlayerSkill(dao).setServerDao(this);
    }

    async getPlayerSkillsDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoListPromise(wheres);
    }

    /**
     * @param player_id
     * @param timestamp
     * @return {PlayerShip}
     */
    async createRolePlayerSkill(player_id, timestamp) {
        let player_skill_results = [
            {
                skill_id: m_server.ServerWorldSkill.max_skill_id,
                player_id: player_id,
                skill_type: common.static.PLAYER_SKILL_CORE_ID,
                exp: 0,
                level: 1,
                create_time: timestamp,
                update_time: timestamp,
            },
        ];

        //如果需要登录修改的参数在这里修改

        return await super.insertDaoListPromise(player_skill_results)
    }
}

PlayerSkillDao.m_instance = null;

module.exports = PlayerSkillDao;
