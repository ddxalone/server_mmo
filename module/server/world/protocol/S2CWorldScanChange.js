const common = require("../../../common");
const BaseS2CProtocol = require("../../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CWorldScanChange}
 * @extends {BaseS2CProtocol}
 */
class S2CWorldScanChange extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_WORLD_SCAN_CHANGE);
    }

    /**
     * @param type
     * @returns {S2CWorldScanChange}
     */
    setType(type) {
        return this.setParam('type', type);
    }

    /**
     * @param info
     * @returns {S2CWorldScanChange}
     */
    setInfo(info) {
        return this.setParam('info', info);
    }
}

module.exports = S2CWorldScanChange;
