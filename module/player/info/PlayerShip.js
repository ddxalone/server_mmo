const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerShip
 * @param {PlayerShip} player_ship
 */
/**
 * @class {PlayerShip}
 */
class PlayerShip extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.player_id = dao.player_id;
        this.ship_id = dao.ship_id;
        this.ship_type = dao.ship_type;

        /**
         * @type {PlayerStation}
         */
        this.player_station = null;
        /**
         * @type {Object<number, PlayerItem>}
         */
        this.ship_items = {};
        /**
         * @type {PlayerInfo}
         */
        this.player_info = null;

        this.base_ship_info = null;
    }

    /**
     * 设置物品属性
     * @param param
     * @param value
     */
    setDaoValue(param, value) {
        //如果更改了ship_id
        switch (param) {
            case 'station_id':
                this.changeStation(value);
                break;
        }
        super.setDaoValue(param, value);
    }

    /**
     * @param {PlayerInfo} player_info
     */
    setPlayerInfo(player_info) {
        this.player_info = player_info;
    }

    /**
     * @param {PlayerStation} player_station
     */
    setPlayerStation(player_station) {
        this.player_station = player_station;
    }

    /**
     * 物品更改空间站
     * @param value
     */
    changeStation(value) {
        let station_id = this.getDaoValue('station_id');
        if (station_id !== value) {
            if (station_id) {
                this.player_station.delStationShip(this.ship_id);
            }
            if (value) {
                this.player_info.safeGetPlayerStation(value).addStationShip(this);
            }
        }
    }

    /**
     * 设置舰船物品
     * @param {PlayerItem} player_item
     */
    addShipItem(player_item) {
        this.ship_items[player_item.item_id] = player_item;
        player_item.setPlayerShip(this);
    }

    /**
     * 删除舰船物品
     * @param item_id
     */
    delShipItem(item_id) {
        this.ship_items[item_id].setPlayerShip(null);
        delete this.ship_items[item_id];
    }

    /**
     * 获取舰船装备
     * @param item_id
     * @return {PlayerItem|null}
     */
    getShipItem(item_id) {
        return (this.ship_items[item_id] && this.ship_items[item_id].getExist()) || null;
    }

    /**
     * 获取某个槽位是否存在装备
     * @param slot
     * @return {null|PlayerItem}
     */
    getShipItemFromSlot(slot) {
        for (let ship_item of Object.values(this.ship_items)) {
            if (ship_item.getExist()) {
                if (ship_item.getSlot() === slot) {
                    return ship_item;
                }
            }
        }
        return null;
    }

    /**
     * 获取某个物品类型的第一个舰船物品
     * @param item_type
     * @return {null|PlayerItem}
     */
    getShipItemFromItemType(item_type) {
        for (let ship_item of Object.values(this.ship_items)) {
            if (ship_item.item_type === item_type) {
                return ship_item;
            }
        }
        return null;
    }

    /**
     * 获取除了物品ID以外的同类型的物品 用于堆叠
     * @param item_type
     * @param item_id
     * @return {null|PlayerItem}
     */
    getShipItemFromItemTypeExceptItemId(item_type, item_id = 0) {
        for (let ship_item of Object.values(this.ship_items)) {
            if (ship_item.getExist() && ship_item.item_type === item_type && ship_item.item_id !== item_id) {
                return ship_item;
            }
        }
        return null;
    }

    /**
     * @param {callbackPlayerItem} callback
     * @param thisObj
     */
    eachShipItem(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.ship_items, callback, thisObj);
        this.setFilter();
    }

    /**
     * 获取基础舰船信息
     * @return {*}
     */
    getBaseShipInfo() {
        this.base_ship_info || (this.base_ship_info = m_server.ServerBaseShip.getShipPlayerDataValue(this.ship_type).getDao());
        return this.base_ship_info;
    }

    /**
     * 检测某槽位是否存在
     * @param slot
     * @return {boolean}
     */
    checkPosLegal(slot) {
        switch (common.method.getMainClassifyFromSlot(slot)) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return !!this.getBaseShipInfo().weapon[common.method.getPosFromSlot(slot)];
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                return !!this.getBaseShipInfo().active[common.method.getPosFromSlot(slot)];
            case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                return !!this.getBaseShipInfo().passive[common.method.getPosFromSlot(slot)];
            default:
                return false;
        }
    }


    getStationId() {
        return this.dao.station_id;
    }

    // getShipTypeFrom() {
    //     if (this.ship_id() === this.player_info.getShipId()) {
    //         return common.static.STORE_TYPE_FROM_SHIP_CURRENT;
    //     }
    //     //如果玩家在空间站 且舰船所属空间站 和 玩家空间站一致 则返回当前 否则返回远程
    //     return (this.player_info.getStationId() && this.getStationId() === this.player_info.getStationId()) ? common.static.STORE_TYPE_FROM_SHIP_STATION : common.static.STORE_TYPE_FROM_SHIP_REMOTE;
    // }

    getClientPlayerShip() {
        return {
            ship_id: this.ship_id,
            ship_type: this.ship_type,
            station_id: this.dao.station_id,
            shield: this.dao.shield,
            armor: this.dao.armor,
            speed: this.dao.speed,
            capacity: this.dao.capacity,
        };
    }
}

module.exports = PlayerShip;
