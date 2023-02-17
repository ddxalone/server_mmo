const common = require("../../common");
const m_protocol = require("../../protocol");
const BaseS2CProtocol = require("../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CChangeRenown}
 * @extends {BaseS2CProtocol}
 */
class S2CChangeRenown extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_CHANGE_RENOWN);
    }

    /**
     * @param info
     * @returns {S2CChangeRenown}
     */
    setInfo(info) {
        return this.setParam('info', info);
    }
}

module.exports = S2CChangeRenown;
