const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const common = require("../../../common");

class C2SMapPickItem extends BaseC2SProtocol {
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

        //靠近 环绕 进站  出站 折跃 移动到 锁定 等等
        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        let current_player_ship = player_info.getCurrentPlayerShip();

        let grid_id = this.p_data.grid_id;
        let unit_type = this.p_data.unit_type;
        let unit_id = this.p_data.unit_id;
        let item_pos = this.p_data.item_pos;
        if (!grid_id || !unit_type || !unit_id) {
            return;
        }

        let wreckage_unit_info = unit_ship_player.map_grid_info.map_merge_info.getGridUnitInfo(grid_id, unit_type, unit_id);

        if (!wreckage_unit_info) {
            return;
        }

        //拾取所有
        if (item_pos === -1) {
            for (let pos in wreckage_unit_info.wreckage_items) {
                let unit_wreckage_item = wreckage_unit_info.wreckage_items[pos];
                unit_wreckage_item.initParams();

                //unit_wreckage_item.item_id 不存在
                let to_player_item = current_player_ship.getShipItemFromItemTypeExceptItemId(unit_wreckage_item.item_type);

                player_info.movePlayerItemStackUseItemType(
                    unit_wreckage_item.item_type,
                    unit_wreckage_item.classify,
                    unit_wreckage_item.count,
                    to_player_item,
                    player_info.dao.ship_id,
                    0,
                    common.static.SHIP_ITEM_STATUS_NULL
                );
                delete wreckage_unit_info.wreckage_items[pos];
            }
            //TODO 未来判断成功一个再走此方法
            wreckage_unit_info.map_grid_info.addFrameUnit(wreckage_unit_info, common.static.MAP_FRAME_TYPE_EXIST);
        } else {
            let unit_wreckage_item = wreckage_unit_info.wreckage_items[item_pos];
            if (!unit_wreckage_item) {
                return;
            }

            unit_wreckage_item.initParams();

            let to_player_item = current_player_ship.getShipItemFromItemTypeExceptItemId(unit_wreckage_item.item_type);

            player_info.movePlayerItemStackUseItemType(
                unit_wreckage_item.item_type,
                unit_wreckage_item.classify,
                unit_wreckage_item.count,
                to_player_item,
                player_info.dao.ship_id,
                0,
                common.static.SHIP_ITEM_STATUS_NULL
            );

            delete wreckage_unit_info.wreckage_items[item_pos];

            wreckage_unit_info.map_grid_info.addFrameUnit(wreckage_unit_info, common.static.MAP_FRAME_TYPE_EXIST);
        }


        unit_ship_player.syncUnitShipPlayer();

        player_info.syncClientPlayerItem();
    }
}

module.exports = C2SMapPickItem;
