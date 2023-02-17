const m_server = require("../../server");
const m_player = require("../.");
const BaseDao = require("../../server/main/dao/BaseDao");
const PlayerBlueprint = require("../info/PlayerBlueprint");

/**
 * @class {PlayerBlueprintDao}
 * @extends {BaseDao}
 */
class PlayerBlueprintDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'player_blueprint';
        this.db_key = 'blueprint_id';
        this.db_field = {
            blueprint_id: 'number',
            player_id: 'number',
            item_type: 'number',
            count: 'number',
            create_time: 'number',
            update_time: 'number',
        };
    }

    static instance() {
        if (PlayerBlueprintDao.m_instance === null) {
            PlayerBlueprintDao.m_instance = new PlayerBlueprintDao();
        }
        return PlayerBlueprintDao.m_instance;
    }

    getInfo(dao) {
        return new PlayerBlueprint(dao).setServerDao(this);
    }

    async getPlayerBlueprintsDb(player_id) {
        let wheres = {
            player_id: player_id,
        };
        return await super.initDaoListPromise(wheres);
    }
}

PlayerBlueprintDao.m_instance = null;

module.exports = PlayerBlueprintDao;
