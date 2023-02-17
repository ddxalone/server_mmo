const m_player = require("../../../player");
const m_server = require("../../../server");
const common = require("../../../common");
const m_websocket = require("../../../websocket");
const S2CChangeItem = require("../../../player/protocol/S2CChangeItem");
const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");

class C2SBoardShip extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
    }

    /**
     * 登船
     */
    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }
        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        let board_ship_info = player_info.getPlayerShip(this.p_data.id);
        if (!board_ship_info) {
            return;
        }

        let current_station_id = player_info.getStationId();
        if (!current_station_id) {
            //未停靠
            return;
        }

        if (current_station_id !== board_ship_info.dao.station_id) {
            //登船的空间站和自己不在一个
            return;
        }
        //TODO 这应该有

        player_info.setShipId(this.p_data.id);

        unit_ship_player.syncUnitShipPlayer();
        // player_info.syncClientUnitShipPlayer();

        unit_ship_player.reloadInfo();

        unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);
    }
}

module.exports = C2SBoardShip;
