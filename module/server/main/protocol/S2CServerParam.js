const common = require("../../../common");
const m_protocol = require("../../../protocol");
const BaseS2CProtocol = require("../../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CServerParam}
 * @extends {BaseS2CProtocol}
 */
class S2CServerParam extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_SERVER_PARAM);
    }

    setInfo(info) {
        return this.setParam('info', info);
    }
}

module.exports = S2CServerParam;
