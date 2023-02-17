const ws = require("ws");
const m_protocol = require("../protocol");
const m_log = require("../log");
const m_websocket = require("./index");
const common = require("../common");

class WsMessage {
    constructor() {
    }

    static instance() {
        if (WsMessage.m_instance == null) {
            WsMessage.m_instance = new WsMessage();
        }
        return WsMessage.m_instance;
    }

    /**
     * 处理接收的信息
     * @param player_uuid
     * @param protocol_body
     */
    wsReceiveInfo(player_uuid, protocol_body) {
        //协议号
        let protocol_sn;
        //协议参数
        let protocol_data = {};
        if (protocol_body) {
            for (let key in protocol_body) {
                if (key === "protocol") {
                    protocol_sn = protocol_body[key];
                }
                protocol_data[key] = protocol_body[key];
            }
            if (protocol_sn) {
                let emitter = m_protocol.ProtocolEmitter.getEmitter();
                if (protocol_sn !== common.protocol.PROTOCOL_C2S_SEND_MAP_INFO
                    && protocol_sn !== common.protocol.PROTOCOL_C2S_MAP_MOVE
                ) {
                    let protocol_name = common.protocol.list[protocol_sn].toString().match(/this.protocol = (.*);/)[1];
                    console.log('接收<<<===', protocol_name);
                    console.log(JSON.parse(JSON.stringify(protocol_data)))
                }
                emitter.emit(protocol_sn, player_uuid, protocol_data);
            } else {
                m_log.LogManage.server('错误的协议体');
            }
        } else {
            m_log.LogManage.warn('内部发送协议参数数量错误');
        }
    }

    /**
     * 触发送送的消息
     * @param player_uuid
     * @param protocol_body
     */
    wsSendInfo(player_uuid, protocol_body) {
        if (player_uuid) {
            let ws_connect = m_websocket.WsConnect.getWsInfoConnect(player_uuid);
            if (ws_connect) {
                if (ws_connect.readyState === ws.OPEN) {
                    if (protocol_body.protocol !== common.protocol.PROTOCOL_S2C_MAP_FRAME
                        && protocol_body.protocol !== common.protocol.PROTOCOL_S2C_PLAYER_INFO
                        && protocol_body.protocol !== common.protocol.PROTOCOL_S2C_ACCOUNT_LOGIN
                        && protocol_body.protocol !== common.protocol.PROTOCOL_S2C_MAP_GRID_INFO
                    ) {
                        let protocol_name = common.protocol.list[protocol_body.protocol].toString().match(/this.protocol = (.*);/)[1];
                        console.log('发送===>>>', protocol_name);
                        console.log(JSON.parse(JSON.stringify(protocol_body)))
                    }
                    ws_connect.send(JSON.stringify(protocol_body));
                }
            }
        }
    }
}

WsMessage.m_instance = null;

module.exports = WsMessage;
