const common = require("../../../common");
const BaseS2CProtocol = require("../../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CMapFrame}
 */
class S2CMapFrame extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_MAP_FRAME);
    }

    /**
     * @param merge_id
     * @returns {S2CMapFrame}
     */
    setMergeId(merge_id) {
        return this.setParam('merge_id', merge_id)
    }

    /**
     * @param info
     * @returns {S2CMapFrame}
     */
    setInfo(info) {
        return this.setParam('info', info);
    }

    /**
     * @param unit
     * @returns {S2CMapFrame}
     */
    setUnit(unit) {
        return this.setParam('unit', unit);
    }

    /**
     * @param action
     * @returns {S2CMapFrame}
     */
    setAction(action) {
        return this.setParam('action', action);
    }

    /**
     * @param frame
     * @returns {S2CMapFrame}
     */
    setFrame(frame) {
        return this.setParam('frame', frame);
    }

    /**
     * @param player
     * @returns {S2CMapFrame}
     */
    setPlayer(player) {
        return this.setParam('player', player)
    }

}

module.exports = S2CMapFrame;
