const UnitDeadMap = require("./UnitDeadMap");


/**
 * @callback callbackUnitDead
 * @param {UnitDead} unit_dead
 */
/**
 * @class {UnitDead}
 * @extends {BaseInfo}
 */
class UnitDead extends UnitDeadMap {
    constructor() {
        super();

    }


    loadInfo(dead_info) {
        this.setUnitId(dead_info.dead_id);
        this.setForce(dead_info.force);
        this.dead_type = dead_info.dead_type;
        this.setX(dead_info.global_x);
        this.setY(dead_info.global_y);

        this.reloadInfo(dead_info);
        // super.loadInfoMap(world_dead_info);
        return this;
    }

    reloadInfo(dead_info) {
    }


    getClientUnitDead() {
        let renowns = {};
        this.renown_infos.eachRenown((renown_info) => {
            renowns[renown_info.unit_id] = renown_info.renown;
        }, this);

        return {
            unit_id: this.unit_id,
            grid_id: this.grid_id,
            unit_type: this.unit_type,
            force: this.force,
            dead_type: this.dead_type,
            x: this.x,
            y: this.y,
            renowns: renowns,
        }
    }
}

module.exports = UnitDead;
