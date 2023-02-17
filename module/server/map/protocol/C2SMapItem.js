const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const common = require("../../../common");

class C2SMapItem extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
    }

    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }
        if (!this.p_data.slot) {
            return;
        }

        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        //这里考虑一下延迟的问题
        let ship_item = unit_ship_player.getShipItem(this.p_data.slot);
        if (!ship_item) {
            return;
        }
        if (ship_item.item_status !== this.p_data.type) {
            return;
        }

        //TODO 未检测该装备是否在当前飞船上

        let item_status = common.static.SHIP_ITEM_STATUS_NULL;
        //考虑一下是发送修改后的状态 还是发送修改前的状态
        switch (this.p_data.type) {
            case common.static.SHIP_ITEM_STATUS_ONLINE:
                //如果不在冷却中 则触发为激活
                if (ship_item.checkCoolDownStatus() === false) {
                    return;
                }
                if (unit_ship_player.checkCapacity(ship_item) === false) {
                    return;
                }
                if (ship_item.main_classify === common.static.ITEM_MAIN_CLASSIFY_PASSIVE) {
                    item_status = common.static.SHIP_ITEM_STATUS_OFFLINE;
                } else {
                    item_status = common.static.SHIP_ITEM_STATUS_ACTIVE;
                }
                break;
            case common.static.SHIP_ITEM_STATUS_ACTIVE:
                //如果不在冷却中 则触发为激活
                //末日武器 在CD中 或者 模块在CD中
                //提供持续BUFF的都加到冻结里 例如末日武器 模块 隐形 推子
                if (ship_item.checkFrozenItem() && ship_item.checkCoolDownStatus() === false) {
                    item_status = common.static.SHIP_ITEM_STATUS_FROZEN;
                } else {
                    item_status = common.static.SHIP_ITEM_STATUS_ONLINE;
                }
                break;
            case common.static.SHIP_ITEM_STATUS_OFFLINE:
                if (unit_ship_player.checkPower(ship_item.require) === false) {
                    return;
                }
                item_status = common.static.SHIP_ITEM_STATUS_ONLINE;
                break;
            default:
                return;
        }

        let player_item = player_info.getPlayerItem(ship_item.item_id);

        fff('red', '更改物品状态', item_status);
        player_info.setPlayerItemValue(player_item, 'status', item_status);

        // unit_ship_player.syncUnitShipPlayer();

        player_info.syncClientPlayerItem();

        // 更新map的物品状态
        if (unit_ship_player.getRun()) {
            // let map_item = {};
            // map_item.slot = this.p_data.slot;
            // map_item.status = item_status;
            unit_ship_player.setFrameItemAction(this.p_data.slot, item_status);
        }
        // unit_ship_player.reloadInfo();
        //
        // unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);
    }
}

module.exports = C2SMapItem;
