/**
 * @callback callbackPlayerStation
 * @param {PlayerStation} player_station
 */

const common = require("../../common");

/**
 * @class {PlayerStation}
 */
class PlayerStation {
    constructor(station_id) {
        this.station_id = station_id;
        this.name = '';
        this.x = 0;
        this.y = 0;
        /**
         * @type {Object<number, PlayerShip>}
         */
        this.station_ships = {};
        /**
         * @type {Object<number, PlayerItem>}
         */
        this.station_items = {};

        /**
         * @type {PlayerInfo}
         */
        this.player_info = null;

        this.base_station_info = null;

        this.filter = null;
    }

    /**
     * @param x
     * @return {PlayerStation}
     */
    setX(x) {
        this.x = x;
        return this;
    }

    /**
     * @param y
     * @return {PlayerStation}
     */
    setY(y) {
        this.y = y;
        return this;
    }

    /**
     * @param name
     * @return {PlayerStation}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * @param {PlayerShip} player_ship
     */
    addStationShip(player_ship) {
        this.station_ships[player_ship.ship_id] = player_ship;
        player_ship.setPlayerStation(this);
    }

    /**
     * @param ship_id
     * @returns {PlayerShip|null}
     */
    getStationShip(ship_id) {
        return (this.station_ships[ship_id] && this.station_ships[ship_id].getExist()) || null;
    }

    /**
     * 删除舰船物品
     * @param ship_id
     */
    delStationShip(ship_id) {
        this.station_ships[ship_id].setPlayerStation(null);
        delete this.station_ships[ship_id];
    }

    /**
     * @param item_id
     * @returns {PlayerItem|null}
     */
    getStationItem(item_id) {
        return (this.station_items[item_id] && this.station_items[item_id].getExist()) || null;
    }

    /**
     * @param {PlayerItem} player_item
     */
    addStationItem(player_item) {
        this.station_items[player_item.item_id] = player_item;
        player_item.setPlayerStation(this);
    }

    /**
     * 删除舰船物品
     * @param item_id
     */
    delStationItem(item_id) {
        this.station_items[item_id].setPlayerStation(null);
        delete this.station_items[item_id];
    }

    /**
     * 遍历空间站下的物品
     * @param {callbackPlayerItem} callback
     * @param thisObj
     */
    eachStationPlayerItems(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.station_items, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param item_type
     * @param item_id
     * @returns {null|PlayerItem}
     */
    getStationItemFromItemTypeExceptItemId(item_type, item_id = 0) {
        for (let station_item of Object.values(this.station_items)) {
            if (station_item.getExist() && station_item.item_type === item_type && station_item.item_id !== item_id) {
                return station_item;
            }
        }
        return null;
    }

    /**
     * @param filter
     * @return {*}
     */
    setFilter(filter = null) {
        this.filter = filter;
        return this;
    }

    getClientPlayerStation() {
        return {
            station_id: this.station_id,
            name: this.name,
            x: this.x,
            y: this.y,
        }
    }
}


module.exports = PlayerStation;
