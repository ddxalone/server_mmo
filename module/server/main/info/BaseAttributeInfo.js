const BaseDaoInfo = require("./BaseDaoInfo");

/**
 * @class {BaseAttributeInfo}
 */
class BaseAttributeInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.attribute_type = dao.attribute_type;
    }

    getDao() {
        return this.dao;
    }
}

module.exports = BaseAttributeInfo;
