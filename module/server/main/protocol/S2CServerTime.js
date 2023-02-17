const common = require("../../../common");
const m_protocol = require("../../../protocol");
const BaseS2CProtocol = require("../../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CServerTime}
 * @extends {BaseS2CProtocol}
 */
class S2CServerTime extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_SERVER_TIME);
    }

    /**
     * @param time
     * @returns {S2CServerTime}
     */
    setTime(time) {
        return this.setParam('time', time);
    }
}

module.exports = S2CServerTime;
