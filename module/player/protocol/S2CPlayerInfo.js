const common = require("../../common");
const m_protocol = require("../../protocol");
const BaseS2CProtocol = require("../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CPlayerInfo}
 * @extends {BaseS2CProtocol}
 */
class S2CPlayerInfo extends BaseS2CProtocol{
    constructor() {
        super(common.protocol.PROTOCOL_S2C_PLAYER_INFO);
    }

    /**
     * @param info
     * @returns {S2CPlayerInfo}
     */
    setInfo(info) {
        return this.setParam('info', info);
    }
}

module.exports = S2CPlayerInfo;
