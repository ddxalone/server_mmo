const m_server = require("../../index");
const common = require("../../../common");

/**
 * 掉落物品信息
 * @class {UnitWreckageItem}
 */
class UnitWreckageItem {
    constructor(pos, item_type, count) {
        this.pos = pos;
        this.item_type = item_type;
        this.count = count;
    }

    /**
     * 初始化其他参数
     */
    initParams() {
        if (!this.main_classify) {
            this.main_classify = common.method.getMainClassifyUseItemType(this.item_type);
            this.classify = this.getBaseItemInfo().classify;
        }
    }

    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseItemInfo() {
        this.base_item_info || (this.base_item_info = m_server.ServerBaseItem.getItemDataValue(this.main_classify, this.item_type).getDao());
        return this.base_item_info;
    }

    getClientUnitWreckageItem() {
        return {
            pos: this.pos,
            item_type: this.item_type,
            count: this.count,
        }
    }
}

module.exports = UnitWreckageItem;
