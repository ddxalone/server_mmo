const common = require("../../../common");
const BaseUnit = require("./BaseUnit");
const UnitWreckageItem = require("./UnitWreckageItem");

/**
 * @callback callbackUnitWreckage
 * @param {UnitWreckage} unit_wreckage
 */
/**
 * @class {UnitWreckage}
 * @extends {BaseUnit}
 */
class UnitWreckage extends BaseUnit {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_WRECKAGE);

        this.force = 0;
        this.size = 0;
        /**
         * @type {Object<number, UnitWreckageItem>}
         */
        this.wreckage_items = {};
    }

    /**
     * @param wreckage_info
     * @return {UnitWreckage}
     */
    loadInfo(wreckage_info) {
        this.setUnitId(wreckage_info.unit_id);
        this.setX(wreckage_info.x);
        this.setY(wreckage_info.y);
        this.setRotation(wreckage_info.rotation);
        this.radius = wreckage_info.radius;

        this.setForce(wreckage_info.force);
        this.setSize(wreckage_info.size);

        this.reloadInfo(wreckage_info);

        return this;
    }

    reloadInfo(wreckage_info) {
        for (let pos in wreckage_info.wreckage_item_list) {
            let data = wreckage_info.wreckage_item_list[pos]
            this.wreckage_items[pos] = new UnitWreckageItem(data.pos, data.item_type, data.count);
        }
    }

    wreckageSettle() {
        if (Object.keys(this.wreckage_items).length === 0) {
            this.setDeath();

            this.map_grid_info.removeUnitInfo(this, common.static.MAP_FRAME_TYPE_DEAD);
        }
    }

    setForce(force) {
        this.force = force;
        this.force = 1;
    }

    setSize(size) {
        this.size = size;
    }

    getClientUnitWreckage() {
        let wreckage_item_list = {};
        for (let pos in this.wreckage_items) {
            let unit_wreckage_item = this.wreckage_items[pos];
            wreckage_item_list[pos] = unit_wreckage_item.getClientUnitWreckageItem();
        }

        return {
            unit_id: this.unit_id,
            grid_id: this.grid_id,
            unit_type: this.unit_type,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            radius: this.radius,
            force: this.force,
            size: this.size,

            wreckage_item_list: wreckage_item_list,
        }
    }
}

module.exports = UnitWreckage;

