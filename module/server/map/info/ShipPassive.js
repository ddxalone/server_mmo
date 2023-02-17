const ShipPassiveMap = require("./ShipPassiveMap");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @callback callbackShipPassive
 * @param {ShipPassive} ship_passive
 */
/**
 * @class {ShipPassive}
 * @extends {ShipPassiveMap}
 */
class ShipPassive extends ShipPassiveMap {
    constructor() {
        super();

        this.base_item_info = null;
    }

    /**
     * 更新武器属性
     * @param ship_passive
     * @returns {ShipPassive}
     */
    loadInfo(ship_passive) {
        // 玩家和NPC都走这里
        // 如果是玩家这里处理所有属性 ship_item 套装属性最后处理或者先算一下套装在这里处理 TODO
        this.setItemId(ship_passive.item_id);
        this.setSlot(ship_passive.slot);
        this.setItemType(ship_passive.item_type);

        this.initBasePassiveInfo();

        this.reloadInfo(ship_passive);

        super.loadInfoMap();

        return this;
    }

    reloadInfo(ship_passive) {
        this.setItemStatus(ship_passive.status);
    }

    getBaseItemInfo() {
        this.base_item_info || (this.base_item_info = m_server.ServerBaseItem.getItemDataValue(this.main_classify, this.item_type).getDao());
        return this.base_item_info;
    }

    getClientShipPassive() {
        //未来会有攻击间隔等实时状态
        return {
            item_id: this.item_id,
            classify: this.classify,
            item_type: this.item_type,
            slot: this.slot,
            // passive_pos: this.passive_pos,

            status: this.item_status,
            // slot: this.slot,

            next_fire_frame: 0,
        }
    }
}

module.exports = ShipPassive;

