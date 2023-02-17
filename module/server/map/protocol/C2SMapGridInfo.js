const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const common = require("../../../common");
const S2CMapGridInfo = require("./S2CMapGridInfo");
const S2CServerTime = require("../../main/protocol/S2CServerTime");
const S2CWorldScan = require("../../world/protocol/S2CWorldScan");
const S2CPlayerInfo = require("../../../player/protocol/S2CPlayerInfo");
const S2CServerParam = require("../../../server/main/protocol/S2CServerParam");
const NearGalaxyInfo = require("../../world/info/NearGalaxyInfo");

class C2SMapGridInfo extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
        this.s2cMapGridInfo = new S2CMapGridInfo();
    }

    run() {
        //TODO 这个协议可能被前端多次请求 理论上是不允许的
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }

        //发送当前系统时间
        new S2CServerTime()
            .setTime(common.func.getUnixMTime())
            .wsSendSuccess(this.player_uuid);

        //发送当前玩家信息
        new S2CPlayerInfo().setInfo(player_info.getClientPlayerInfo())
            .wsSendSuccess(this.player_uuid);

        //发送当前服务器信息
        new S2CServerParam().setInfo(m_server.ServerParam.getClientServerParam())
            .wsSendSuccess(this.player_uuid);

        let unit_ship_player = m_server.ServerMapPlayer.joinUnitShipPlayer(player_info);

        // let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);

        m_server.ServerWorldScan.reScanList(player_info, unit_ship_player);

        player_info.player_variable.setExact(null, unit_ship_player.scan_initiate_per, m_server.ServerMain.getServerUnixFrame());

        // let map_grid_info = m_server.ServerMapBlock.getMapBlockGridInfo(unit_ship_player.map_key, unit_ship_player.grid_id);
        // let map_merge_info = m_server.ServerMapMerge.getMapMergeInfo(map_grid_info.merge_id);

        //从登陆开始记录2帧日志
        m_server.MapProcess.save_map_frame_start = 0;
        m_server.MapProcess.save_map_frame_count = 0;

        //不应该在这里返回map信息 应该在协议一个map_action之后发送
        this.s2cMapGridInfo
            // .setMergeId(map_merge_info.merge_id)
            .setInfo(unit_ship_player.getClientUnitShipPlayer())
            .setGrid(unit_ship_player.map_grid_info.getClientGridInfo(true))
            .setFrame(m_server.ServerMain.getServerUnixFrame())
            .wsSendSuccess(this.player_uuid);
    }
}

module.exports = C2SMapGridInfo;
