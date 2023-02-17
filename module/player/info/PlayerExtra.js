const m_player = require("../../player");
const common = require("../../common");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerExtra
 * @param err
 * @param {PlayerExtra} player_extra
 */
/**
 * @class {PlayerExtra}
 */
class PlayerExtra extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.player_id = dao.player_id;
    }

    getDao() {
        return this.dao;
    }

    getClientPlayerExtra() {
        return {
            player_id: this.player_id,
            ...this.dao
        };
    }
}

module.exports = PlayerExtra;
