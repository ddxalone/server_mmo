const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseShipPlayerInfo}
 */
class BaseShipPlayerInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.ship_type = dao.ship_type;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseShipPlayerInfo;
