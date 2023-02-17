const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @class {AccountInfo}
 */
class AccountInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.player_id = dao.player_id;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = AccountInfo;
