const BaseDaoInfo = require("./BaseDaoInfo");
/**
 * @class {BaseItemSuitInfo}
 */
class BaseItemSuitInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.suit_type = dao.suit_type;
        /**
         * @type {Object<number, BaseItemWeaponInfo|BaseItemModuleInfo>}
         */
        this.suit_item_type_list = {};
    }

    getDao() {
        return this.dao;
    }

    /**
     * 设置包含物品类型
     * @param base_item_info
     */
    setSuitItemType(base_item_info) {
        this.suit_item_type_list[base_item_info.item_type] = base_item_info;
    }
}

module.exports = BaseItemSuitInfo;
