const ShipItemMap = require("./ShipItemMap");

/**
 * @class {ShipItem}
 * @extends {ShipItemMap}
 */
class ShipItem extends ShipItemMap {
    constructor(main_classify) {
        super(main_classify);
    }
}

module.exports = ShipItem;
