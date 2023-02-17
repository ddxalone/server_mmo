const common = require("../../../common");
const BaseS2CProtocol = require("../../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CWorldScan}
 * @extends {BaseS2CProtocol}
 */
class S2CWorldScan extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_WORLD_SCAN);
    }

    /**
     * @param info
     * @returns {S2CWorldScan}
     */
    setInfo(info) {
        return this.setParam('info', info);
    }
}

module.exports = S2CWorldScan;
