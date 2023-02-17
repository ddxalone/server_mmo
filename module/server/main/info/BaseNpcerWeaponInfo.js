const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseNpcerWeaponInfo}
 */
class BaseNpcerWeaponInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.item_type = dao.item_type;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseNpcerWeaponInfo;
