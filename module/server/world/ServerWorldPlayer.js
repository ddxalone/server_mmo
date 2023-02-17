const m_server = require("../../server");
const common = require("../../common");
const m_mysql = require("../../mysql");
const {PlayerList} = require("../../player");

/**
 * 世界管理器
 * @class {ServerWorldPlayer}
 */
class ServerWorldPlayer {
    constructor() {
    }

    static instance() {
        if (ServerWorldPlayer.m_instance == null) {
            ServerWorldPlayer.m_instance = new ServerWorldPlayer();
        }
        return ServerWorldPlayer.m_instance;
    }

    addPlayerExp(player_id, add_exp) {
        //TODO 未来处理组队经验
        let player_info = PlayerList.getPlayerInfo(player_id);
        player_info.addExp(add_exp);

        player_info.syncClientExtra();
    }
}

ServerWorldPlayer.m_instance = null;

module.exports = ServerWorldPlayer;

