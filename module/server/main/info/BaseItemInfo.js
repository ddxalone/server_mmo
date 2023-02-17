const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseItemInfo}
 */
class BaseItemInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.item_type = dao.item_type;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseItemInfo;
