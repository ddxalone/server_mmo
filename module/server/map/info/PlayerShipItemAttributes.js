/**
 * 玩家舰船装备属性实装
 * @class {PlayerShipItemAttributes}
 */
class PlayerShipItemAttributes {
    constructor() {
        this.attr = {};
    }

    initAttr() {
        this.attr = {};
    }

    setAttr(key, value) {
        this.attr[key] = value;
    }

    addAttr(key, value) {
        if (!this.attr[key]) {
            this.attr[key] = value;
        } else {
            this.attr[key] += value;
        }
    }

    getAttr(key) {
        return this.attr[key] || 0;
    }
}

module.exports = PlayerShipItemAttributes;

