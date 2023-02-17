const m_websocket = require("../../websocket");
const common = require("../../common");
const m_log = require("../../log");

/**
 * @class {BaseS2CProtocol}
 */
class BaseS2CProtocol {
    constructor(protocol) {
        this.draw_ratio = common.setting.draw_ratio;
        this.protocol = protocol;
        this.player_uuid = null;
        this.protocol_func = new common.protocol.list[this.protocol]();
    }

    /**
     * 设置playerUuid
     * @param player_uuid
     * @returns {BaseS2CProtocol}
     */
    setPlayerUuid(player_uuid) {
        this.player_uuid = player_uuid;
        return this;
    }

    /**
     * 设置状态
     * @param status
     * @returns {BaseS2CProtocol}
     */
    setStatus(status) {
        return this.setParam('status', status);
    }

    /**
     * 设置key value
     * @param key
     * @param param
     * @returns {*}
     */
    setParam(key, param) {
        this.protocol_func[key] = param;
        return this;
    }

    /**
     * 发送成功协议
     * @param player_uuid
     * @param protocol_body
     */
    wsSendSuccess(player_uuid, protocol_body = null) {
        if (player_uuid) {
            if (this.protocol > common.setting.protocol_cut) {
                this.setPlayerUuid(player_uuid);
                this.setStatus(common.define.PROTOCOL_STATUS_SUCCESS);
                //有自定义协议体 则发送自定义协议体
                if (protocol_body) {
                    let protocol_func = {};
                    for (let pos in this.protocol_func) {
                        if (protocol_body.hasOwnProperty(pos)) {
                            protocol_func[pos] = protocol_body[pos];
                        } else {
                            protocol_func[pos] = this.protocol_func[pos];
                        }
                    }
                    m_websocket.WsMessage.wsSendInfo(this.player_uuid, protocol_func);
                } else {
                    m_websocket.WsMessage.wsSendInfo(this.player_uuid, this.protocol_func);
                }
            } else {
                m_log.LogManage.server('protocol cut error');
            }
        }
    }

    /**
     * 发送失败协议
     * @param player_uuid
     * @param status
     */
    wsSendFail(player_uuid, status) {
        if (player_uuid && status) {
            if (this.protocol > common.setting.protocol_cut) {
                this.setPlayerUuid(player_uuid);
                this.setStatus(status);
                m_websocket.WsMessage.wsSendInfo(this.player_uuid, this.protocol_func);

                m_websocket.WsConnect.removeWsInfo(player_uuid);
            } else {
                m_log.LogManage.server('protocol cut error');
            }
        }
    }
}

module.exports = BaseS2CProtocol;
