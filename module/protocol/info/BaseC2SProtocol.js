const m_protocol = require("../../protocol");
const m_websocket = require("../../websocket");
const m_player = require("../../player");
const m_log = require("../../log");
const common = require("../../common");

/**
 * @class {BaseC2SProtocol}
 */
class BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        this.draw_ratio = common.setting.draw_ratio;
        this.player_uuid = player_uuid;
        this.p_data = p_data;

        /**
         * @method init
         */
        this.init();

        if (this.checkValidate()) {
            /**
             * @method run
             */
            this.run();
        } else {
            ff('验证请求非法');
        }
    }

    /**
     * 初始化虚方法
     */
    init() {

    }

    /**
     * 运行虚方法
     */
    run() {

    }

    /**
     * 验证器参数验证
     * @returns {boolean}
     */
    checkValidate() {
        return m_protocol.ProtocolValidate.validate(this.player_uuid, this.p_data);
    }

    /**
     * 获取在线玩家信息
     * @returns {null|PlayerInfo}
     */
    getPlayerInfo() {
        let player_id = m_websocket.WsConnect.getWsInfoPlayerId(this.player_uuid);
        if (!player_id) {
            return null;
        }
        let player_info = m_player.PlayerList.getPlayerInfo(player_id);
        if (!player_info) {
            return null;
        }
        if (player_info.checkOnline() === false) {
            return null;
        }
        return player_info;
    }
}

module.exports = BaseC2SProtocol;
