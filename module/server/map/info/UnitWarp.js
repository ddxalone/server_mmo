const UnitWarpMap = require("./UnitWarpMap");
const common = require("../../../common");
const m_server = require("../../../server");

/**
 * @callback callbackUnitWarp
 * @param {UnitWarp} unit_bullet
 */
/**
 * @class {UnitWarp}
 * @extends {UnitWarpMap}
 */
class UnitWarp extends UnitWarpMap {
    constructor() {
        super();

    }

    /**
     * 读取信息
     * @param warp_info
     * @returns {UnitWarp}
     */
    loadInfo(warp_info) {
        super.loadInfoMap(warp_info);

        return this;
    }

    warpSettle() {
        if (this.getInit()) {
            this.setRun();
        }
        if (this.getDeath()) {
            this.warpDeath();
        }
        this.warpWarpSettle();
    }

    disappearWarp() {
        if (this.getDeath() === false) {
            this.setDeath();
        }
    }

    warpDeath() {
        m_server.ServerMapUnit.leaveUnitWarp(this);
    }

    getClientUnitWarp() {
        return {
            grid_id: this.grid_id,
            unit_type: this.unit_type,
            unit_id: this.unit_id,
            warp_run_frame: this.warp_run_frame,
            warp_hop_frame: this.warp_hop_frame,
            x: this.x,
            y: this.y,
            radius: this.radius,
        }
    }
}

module.exports = UnitWarp;
