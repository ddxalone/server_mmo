const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseForceInfo}
 */
class BaseForceInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.force = dao.force;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseForceInfo;
