const ShipActiveMap = require("./ShipActiveMap");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @callback callbackShipActive
 * @param {ShipActive} ship_active
 */
/**
 * @class {ShipActive}
 * @extends {ShipActiveMap}
 */
class ShipActive extends ShipActiveMap {
    constructor() {
        super();

        this.base_item_info = null;
    }

    /**
     * 更新武器属性
     * @param ship_active
     * @returns {ShipActive}
     */
    loadInfo(ship_active) {
        this.setItemId(ship_active.item_id);
        this.setSlot(ship_active.slot);
        this.setItemType(ship_active.item_type);

        this.initBaseActiveInfo();

        this.reloadInfo(ship_active);

        super.loadInfoMap();

        return this;
    }

    reloadInfo(ship_active) {
        this.setItemStatus(ship_active.status);

        // this.next_cool_frame = ship_active.next_cool_frame;
    }

    getBaseItemInfo() {
        this.base_item_info || (this.base_item_info = m_server.ServerBaseItem.getItemDataValue(this.main_classify, this.item_type).getDao());
        return this.base_item_info;
    }

    getClientShipActive() {
        //未来会有攻击间隔等实时状态
        return {
            item_id: this.item_id,
            classify: this.classify,
            item_type: this.item_type,
            slot: this.slot,
            // active_pos: this.active_pos,

            status: this.item_status,

            start_cool_frame: this.start_cool_frame,
            next_cool_frame: this.next_cool_frame,
        }
    }
}

module.exports = ShipActive;
