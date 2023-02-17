const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerItem
 * @param {PlayerItem} player_item
 */
/**
 * @class {PlayerItem}
 */
class PlayerItem extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.player_id = dao.player_id;
        this.item_id = dao.item_id;
        this.classify = dao.classify;
        this.item_type = dao.item_type;

        /**
         * @type {PlayerStation}
         */
        this.player_station = null;
        /**
         * @type {PlayerShip}
         */
        this.player_ship = null;
        /**
         * @type {PlayerInfo}
         */
        this.player_info = null;

        this.base_item_info = null;
    }

    /**
     * 设置物品属性
     * @param param
     * @param value
     */
    setDaoValue(param, value) {
        //如果更改了ship_id
        switch (param) {
            case 'ship_id':
                this.changeShip(value);
                break;
            case 'station_id':
                this.changeStation(value);
                break;
        }
        super.setDaoValue(param, value);
    }

    /**
     * 物品更改舰船
     * @param value
     */
    changeShip(value) {
        let ship_id = this.getDaoValue('ship_id');
        if (ship_id !== value) {
            //如果旧的舰船ID存在
            if (ship_id) {
                //这里是个小循环引用
                this.player_ship.delShipItem(this.item_id);
            }
            //如果新的舰船存在
            if (value) {
                this.player_info.getPlayerShip(value).addShipItem(this);
            }
        }
    }

    /**
     * 物品更改空间站
     * @param value
     */
    changeStation(value) {
        let station_id = this.getDaoValue('station_id');
        if (station_id !== value) {
            if (station_id) {
                this.player_station.delStationItem(this.item_id);
            }
            if (value) {
                this.player_info.safeGetPlayerStation(value).addStationItem(this);
            }
        }
    }

    getMainClassify() {
        return common.method.getMainClassifyUseClassify(this.classify);
    }

    checkSlot() {
        return !!this.dao.slot;
    }

    getSlot() {
        return this.dao.slot;
    }

    getCount() {
        return this.dao.count;
    }

    getStatus() {
        return this.dao.status;
    }

    /**
     * @param {PlayerStation} player_station
     */
    setPlayerStation(player_station) {
        this.player_station = player_station;
    }

    /**
     * @param {PlayerShip} player_ship
     */
    setPlayerShip(player_ship) {
        this.player_ship = player_ship;
    }

    /**
     * @param {PlayerInfo} player_info
     */
    setPlayerInfo(player_info) {
        this.player_info = player_info;
    }

    /**
     * 获取存放的空间站ID
     */
    getStoreStationId() {
        return this.getStationId() || this.player_ship.getStationId();
    }

    getShipId() {
        return this.dao.ship_id;
    }

    getStationId() {
        return this.dao.station_id;
    }

    /**
     * 判断物品来源是否为当前空间站 或者在太空时物品也在太空
     * @return {number}
     */
    // getItemTypeFrom() {
    //     if (this.getShipId() === this.player_info.getShipId()) {
    //         return this.getSlot() ? common.static.STORE_TYPE_FROM_SLOT : common.static.STORE_TYPE_FROM_SHIP;
    //     }
    //     //如果玩家在空间站 且物品所属空间站 和 玩家空间站一致 则返回当前 否则返回远程
    //     return (this.player_info.getStationId() && this.getStoreStationId() === this.player_info.getStationId()) ? common.static.STORE_TYPE_FROM_STATION : common.static.STORE_TYPE_FROM_REMOTE;
    // }

    /**
     * 判断当前物品的相对于某个空间站的操作状态
     * @param station_id
     * @return {number}
     */
    getItemOperationStatus(station_id = 0) {
        station_id || (station_id = this.player_info.getStationId());
        //如果都在一个空间站 或者都在太空
        if (this.getStoreStationId() === station_id) {
            //如果我在空间站或者我支持太空换装
            if (station_id || this.player_info.getAssemblyInSpace()) {
                return common.static.ITEM_OPERATION_STATUS_ASSEMBLE;
            } else {
                return common.static.ITEM_OPERATION_STATUS_TRANSFER;
            }
        } else {
            //都在空间站 则可物流 否则无效
            return (this.getStoreStationId() && station_id) ? common.static.ITEM_OPERATION_STATUS_LOGISTICS : common.static.ITEM_OPERATION_STATUS_INVALID;
        }
    }

    /**
     * @return {{type: *, hash_id: *}}
     */
    getItemFromTypeHash() {
        if (this.getShipId()) {
            return {type: common.static.STORE_TYPE_TO_SHIP, hash_id: this.getShipId()};
        } else if (this.getStationId()) {
            return {type: common.static.STORE_TYPE_TO_STATION, hash_id: this.getStationId()};
        } else {
            dd('不会走到这里');
        }
    }

    /**
     * 获取是否为当前舰船正在使用的装备
     * @return {boolean}
     */
    getCurrentSlotStatus() {
        return this.getShipId() === this.player_info.getShipId() && !!this.getSlot();
    }

    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseItemInfo() {
        this.base_item_info || (this.base_item_info = m_server.ServerBaseItem.getItemDataValue(this.getMainClassify(), this.item_type).getDao());
        return this.base_item_info;
    }

    /**
     * 获取装备基础需求值 只含当前装备减需属性
     */
    getBaseItemRequire() {
        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(this.player_id);
        let base_item_info = this.getBaseItemInfo();
        let skill_property = common.method.getSkillPropertyString(this.classify, 'require');
        //只判断当前装备需求减少的属性
        return common.method.calculateShipProperty(
            common.static.RATIO_TYPE_DRAW_RATIO,
            base_item_info.require,
            base_item_info.attribute[common.static.CURRENT_ITEM_REQUIRE_ID] || 0,
            skill_property ? unit_ship_player.ship_attributes.getSkill(skill_property) : 0,
            base_item_info.attribute[common.static.CURRENT_ITEM_REQUIRE_PER_ID] || 0,
            skill_property ? unit_ship_player.ship_attributes.getSkill(skill_property + '_per') : 0
        );
    }

    getClientPlayerItem() {
        return {
            item_id: this.item_id,
            classify: this.classify,
            item_type: this.item_type,
            count: this.dao.count,
            station_id: this.dao.station_id,
            ship_id: this.dao.ship_id,
            slot: this.dao.slot,
            status: this.dao.status,
        };
    }
}

module.exports = PlayerItem;
