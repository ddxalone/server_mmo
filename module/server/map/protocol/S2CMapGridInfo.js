const common = require("../../../common");
const BaseS2CProtocol = require("../../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CMapGridInfo}
 */
class S2CMapGridInfo extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_MAP_GRID_INFO);
    }

    /**
     * @param info
     * @returns {S2CMapGridInfo}
     */
    setInfo(info) {
        return this.setParam('info', info);
    }

    /**
     * @param grid
     * @returns {S2CMapGridInfo}
     */
    setGrid(grid) {
        return this.setParam('grid', grid);
    }
    /**
     * @param frame
     * @returns {S2CMapGridInfo}
     */
    setFrame(frame) {
        return this.setParam('frame', frame);
    }

}

module.exports = S2CMapGridInfo;
