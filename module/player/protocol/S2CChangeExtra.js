const common = require("../../common");
const m_protocol = require("../../protocol");
const BaseS2CProtocol = require("../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CChangeExtra}
 * @extends {BaseS2CProtocol}
 */
class S2CChangeExtra extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_CHANGE_EXTRA);
    }

    /**
     * @param extra
     * @returns {S2CChangeExtra}
     */
    setExtra(extra) {
        return this.setParam('extra', extra);
    }
}

module.exports = S2CChangeExtra;
