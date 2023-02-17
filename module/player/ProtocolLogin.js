const m_player = require("./index");
const m_protocol = require("../protocol");
const C2SPlayerLogin = require("./protocol/C2SPlayerLogin");
const C2SAccountLogin = require("./protocol/C2SAccountLogin");

/**
 * 登录协议控制
 */
class ProtocolLogin {
    static instance() {
        if (ProtocolLogin.m_instance == null) {
            ProtocolLogin.m_instance = new ProtocolLogin();
        }
        return ProtocolLogin.m_instance;
    }

    /**
     * 帐号登录接口
     * @param player_uuid
     * @param p_data
     */
    accountLogin(player_uuid, p_data) {
        new C2SAccountLogin(player_uuid, p_data);
    }

    /**
     * 角色登录接口
     * @param player_uuid
     * @param p_data
     */
    playerLogin(player_uuid, p_data) {
        new C2SPlayerLogin(player_uuid, p_data);
    }

    //TODO
    GameLogout(player_uuid, p_data) {
        // m_protocol.ProtocolValidate.validate(common.protocol.FUN_C2S_PLAYER_LOGOUT, p_data);
        //
        // let ret_data = new common.protocol.FUN_C2S_GAME_LOGOUT();
        // ret_data.aaa = 12345;
        // ret_data.bbb = ret_data.ticket;
        // console.log(ret_data)
        //
        //
        // let ret_data2 = new common.protocol.FUN_C2S_GAME_LOGOUT();
        // console.log(ret_data2)
        //
        // console.log(ret_data === ret_data2 ? 'yes' : 'no');
        // // m_websocket.WsMessage.wsSendInfo(player_uuid, ret_data);
    }

}

ProtocolLogin.m_instance = null;

module.exports = ProtocolLogin;
