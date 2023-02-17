const PlayerShipItemAttributes = require("./PlayerShipItemAttributes");
const common = require("../../../common");

/**
 * @class {ShipItemMap}
 */
class ShipItemMap {
    constructor(main_classify) {
        this.main_classify = main_classify;

        this.item_id = 0;

        this.slot = 0;

        this.item_status = common.static.SHIP_ITEM_STATUS_NULL;

        this.classify = 0;
        this.quality = 0;

        this.mass = 0;

        this.base_map_frame = common.setting.base_map_frame;
        this.base_run_frame = common.setting.base_run_frame;
        this.base_server_frame = common.setting.base_server_frame;
        this.draw_ratio = common.setting.draw_ratio;

        /**
         * 属性列表 未处理的从base表读取出来的
         * @type {ItemProperties}
         */
        this.base_item_properties = null;
        /**
         * 绿字属性
         * @type {PlayerShipItemAttributes}
         */
        this.item_attribute = new PlayerShipItemAttributes();

        this.item_type = 0;

        /**
         * 父容器舰船类
         * @type {UnitShip|UnitShipPlayer|UnitShipNpcer}
         */
        this.base_ship = null;
    }

    /**
     * @param base_ship
     * @return {ShipItemMap}
     */
    setBaseShip(base_ship) {
        this.base_ship = base_ship;
        return this;
    }

    /**
     * @param item_id
     */
    setItemId(item_id) {
        this.item_id = item_id;
    }

    /**
     * @param item_type
     */
    setItemType(item_type) {
        this.item_type = item_type;
    }

    /**
     * @param slot
     * @return {ShipItemMap}
     */
    setSlot(slot) {
        this.slot = slot;
        return this;
    }

    /**
     * @param item_status
     */
    setItemStatus(item_status) {
        this.item_status = item_status;
    }

    /**
     * 检测物品是否冷却恢复了
     * @return {boolean}
     */
    checkCoolDownStatus() {
        switch (this.main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return this.checkFireStatus();
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                return this.checkCoolStatus();
        }
        return true;
    }

    /**
     * 检测是否为冻结装备
     * @return {boolean}
     */
    checkFrozenItem() {
        switch (this.main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return this.checkWeaponDoomsday();
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                return this.checkContinuedBuff();
        }
        return false;
    }

    /**
     * 虚方法
     */
    checkWeaponDoomsday() {
    }

    /**
     * 虚方法
     */
    checkActiveBattle() {
    }

    /**
     * 虚方法
     */
    checkContinuedBuff() {
    }

    /**
     * 虚方法
     */
    checkFireStatus() {
    }

    /**
     * 虚方法
     */
    checkCoolStatus() {
    }

}

module.exports = ShipItemMap;
