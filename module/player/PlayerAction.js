const m_player = require("./index");
const common = require("../common");
const m_websocket = require("../websocket");
const m_server = require("../server");
const S2CPlayerLogout = require("./protocol/S2CPlayerLogout");
const NearGalaxyInfo = require("../server/world/info/NearGalaxyInfo");

/**
 * 玩家动作类
 */
class PlayerAction {
    constructor() {
    }

    static instance() {
        if (PlayerAction.m_instance == null) {
            PlayerAction.m_instance = new PlayerAction();
        }
        return PlayerAction.m_instance;
    }

    /**
     * 处理玩家登陆数据
     * @param player_info
     */
    loginPlayer(player_info) {
        player_info.setOnlineStatus(true);
        player_info.updateLoginTime();
        player_info.updateUpdateTime();

        //实时更新数据库信息
        player_info.saveLoginTime();

        //TODO 处理军团登录逻辑

        //TODO 处理队伍登录逻辑

        //TODO 分发消息
    }

    /**
     * 踢出玩家
     * @param player_id
     */
    kickPlayer(player_id) {
        let player_info = m_player.PlayerList.getPlayerInfo(player_id);
        if (player_info) {
            player_info.setOnlineStatus(false);
            player_info.updateLogoutTime();

            //实时更新数据库信息
            player_info.saveLogoutTime();

            new S2CPlayerLogout()
                .wsSendFail(player_info.getPlayerUuid(), common.define.ACCOUNT_PLAYER_LOGOUT);

            //玩家登出以后同步地图信息到info表
            //unit_ship_player登录的时候会同步这个信息
            //真下线的时候 应该同步 还没同步
            // m_server.ServerMapPlayer.getIndexUnitPlayer(player_id).syncUnitShipPlayer();

            //TODO 玩家登出以后尝试进行跃迁
            m_server.ServerMapPlayer.leaveUnitShipPlayer(player_info);
        }
    }


    //TODO
    playerLogout(player_uuid) {
        return;
    }
}

PlayerAction.m_instance = null;

module.exports = PlayerAction;
