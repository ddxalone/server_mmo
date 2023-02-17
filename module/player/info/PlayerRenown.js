const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerRenown
 * @param {PlayerRenown} player_renown
 */
/**
 * @class {PlayerRenown}
 */
class PlayerRenown extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.renown_id = dao.renown_id;
        this.force = dao.force;
        this.player_id = dao.player_id;

        this.base_force_info = null;
    }


    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseForceInfo() {
        this.base_force_info || (this.base_force_info = m_server.ServerBaseForce.getBaseForce(this.force).getDao());
        return this.base_force_info;
    }

    getClientPlayerRenown() {
        return {
            renown_id: this.renown_id,
            player_id: this.player_id,
            force: this.force,
            value: this.dao.value,
        }
    }
}

module.exports = PlayerRenown;
