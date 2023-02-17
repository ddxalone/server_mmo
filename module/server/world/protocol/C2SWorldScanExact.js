const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const S2CWorldScanChange = require("./S2CWorldScanChange");
const S2CChangeVariable = require("../../../player/protocol/S2CChangeVariable");

class C2SWorldScanExact extends BaseC2SProtocol {
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
        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }


        let type = this.p_data.type;
        let id = this.p_data.id;

        let scan_beacon_info = player_info.player_variable.scan_list[type][id];
        if (!scan_beacon_info) {
            return;
        }
        //不能扫自己
        if (type === common.static.WORLD_UNIT_TYPE_SHIP_PLAYER && id === player_info.player_id) {
            return;
        }
        if (player_info.player_variable.exact_type === type && player_info.player_variable.exact_id === id && scan_beacon_info.intensity < 100) {
            //如果是正在扫描的信号 扫描精度不到100 则禁止重新发起扫描
            return;
        }

        //切换信号 需要更新原信号的进度
        let current_scan_beacon_info = player_info.player_variable.updateCurrentExact(true);
        if (current_scan_beacon_info) {
            new S2CWorldScanChange()
                .setType(common.static.CHANGE_TYPE_EXIST)
                .setInfo(current_scan_beacon_info.getClientScanBeaconInfo())
                .wsSendSuccess(this.player_uuid);
        }

        player_info.player_variable.setExact(scan_beacon_info, unit_ship_player.scan_initiate_per, unit_ship_player.server_frame);

        new S2CChangeVariable()
            .setInfo({exact_type: type, exact_id: id})
            .wsSendSuccess(this.player_uuid)

        new S2CWorldScanChange()
            .setType(common.static.CHANGE_TYPE_EXIST)
            .setInfo(scan_beacon_info.getClientScanBeaconInfo())
            .wsSendSuccess(this.player_uuid);
    }
}

module.exports = C2SWorldScanExact;
