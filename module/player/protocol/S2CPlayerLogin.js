const common = require("../../common");
const m_protocol = require("../../protocol");
const BaseS2CProtocol = require("../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CPlayerLogin}
 * @extends {BaseS2CProtocol}
 */
class S2CPlayerLogin extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_PLAYER_LOGIN);
    }
}

module.exports = S2CPlayerLogin;
