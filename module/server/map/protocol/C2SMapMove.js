const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");

class C2SMapMove extends BaseC2SProtocol {
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

        // m_log.LogManage.error(player_info.player_id);
        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        //折跃状态禁止移动
        if (unit_ship_player.getIsWarpStatus()) {
            return;
        }
        if (unit_ship_player.getRun()) {
            unit_ship_player.setFrameMoveAction(this.p_data.rat, this.p_data.pow);
        }
    }
}

module.exports = C2SMapMove;
