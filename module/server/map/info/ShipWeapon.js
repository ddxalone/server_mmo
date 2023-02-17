const ShipWeaponMap = require("./ShipWeaponMap");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @callback callbackShipWeapon
 * @param {ShipWeapon} ship_weapon
 */
/**
 * @class {ShipWeapon}
 * @extends {ShipWeaponMap}
 */
class ShipWeapon extends ShipWeaponMap {
    constructor() {
        super();
    }

    /**
     * 更新武器属性
     * @param ship_weapon
     * @returns {ShipWeapon}
     */
    loadInfo(ship_weapon) {
        // 玩家和NPC都走这里
        // 如果是玩家这里处理所有属性 ship_item 套装属性最后处理或者先算一下套装在这里处理 TODO
        this.setItemId(ship_weapon.item_id);
        this.setX(ship_weapon.x * this.draw_ratio);
        this.setY(ship_weapon.y * this.draw_ratio);
        this.setSlot(ship_weapon.slot);
        this.setItemType(ship_weapon.item_type);

        this.initBaseWeaponInfo();

        this.reloadInfo(ship_weapon);

        super.loadInfoMap();

        return this;
    }

    reloadInfo(ship_weapon) {
        this.setItemStatus(ship_weapon.status);

        //这个没用 NPC舰船上来就折跃 折跃的时候CD就好了
        // this.setNextFireFrame();
    }

    getBaseItemInfo() {
        if (!this.base_item_info) {
            if (this.base_ship.unit_type === common.static.MAP_UNIT_TYPE_SHIP_PLAYER) {
                this.base_item_info = m_server.ServerBaseItem.getItemDataValue(this.main_classify, this.item_type).getDao();
            } else {
                this.base_item_info = m_server.ServerBaseItem.getNpcerWeaponDataValue(this.item_type).getDao();
            }
        }
        return this.base_item_info;
    }

    getClientShipWeapon() {
        //未来会有攻击间隔等实时状态
        return {
            item_id: this.item_id,
            classify: this.classify,
            item_type: this.item_type,
            slot: this.slot,

            status: this.item_status,

            start_fire_frame: this.start_fire_frame,
            next_fire_frame: this.next_fire_frame,
            surplus_multiple: this.surplus_multiple,
            //剩余发射弹药数量
            surplus_count: this.surplus_count,

            //末日武器预热开始时间
            doomsday_pre_heat_start_frame: this.doomsday_pre_heat_start_frame,
            //末日武器预热结束时间
            doomsday_pre_heat_end_frame: this.doomsday_pre_heat_end_frame,
            doomsday_status: this.doomsday_status,
        }
    }
}

module.exports = ShipWeapon;
