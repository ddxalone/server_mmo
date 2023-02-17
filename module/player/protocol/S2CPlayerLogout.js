const common = require("../../common");
const m_protocol = require("../../protocol");
const BaseS2CProtocol = require("../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CPlayerLogout}
 * @extends {BaseS2CProtocol}
 */
class S2CPlayerLogout extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_PLAYER_LOGOUT);
    }
}

module.exports = S2CPlayerLogout;
