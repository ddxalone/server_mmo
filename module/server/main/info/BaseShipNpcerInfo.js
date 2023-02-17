const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseShipNpcerInfo}
 */
class BaseShipNpcerInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.ship_type = dao.ship_type;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseShipNpcerInfo;
