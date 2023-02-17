const UnitTaskMap = require("./UnitTaskMap");


/**
 * @callback callbackUnitTask
 * @param {UnitTask} unit_task
 */
/**
 * @class {UnitTask}
 * @extends {BaseInfo}
 */
class UnitTask extends UnitTaskMap {
    constructor() {
        super();

    }


    loadInfo(task_info) {
        this.setUnitId(task_info.task_id);
        this.setForce(task_info.force);
        this.task_type = task_info.task_type;
        this.setX(task_info.global_x);
        this.setY(task_info.global_y);

        this.reloadInfo(task_info);
        // super.loadInfoMap(world_task_info);
        return this;
    }

    reloadInfo(task_info) {
    }


    getClientUnitTask() {
        let renowns = {};
        this.renown_infos.eachRenown((renown_info) => {
            renowns[renown_info.unit_id] = renown_info.renown;
        }, this);

        return {
            unit_id: this.unit_id,
            grid_id: this.grid_id,
            unit_type: this.unit_type,
            force: this.force,
            task_type: this.task_type,
            x: this.x,
            y: this.y,
            renowns: renowns,
        }
    }
}

module.exports = UnitTask;
