/**
 * 玩家舰船属性实装
 * @class {PlayerShipAttributes}
 */
class PlayerShipAttributes {
    constructor() {
        this.attr = {};
        this.skill = {};
    }

    initAttr() {
        this.attr = {};
    }

    setAttr(key, value) {
        this.attr[key] = value;
    }

    addAttr(key, value) {
        if (this.attr[key]) {
            this.attr[key] += value;
        } else {
            this.attr[key] = value;
        }
    }

    getAttr(key) {
        return this.attr[key] || 0;
    }

    initSkill() {
        this.skill = {};
    }

    setSkill(key, value) {
        this.skill[key] = value;
    }

    addSkill(key, value) {
        if (this.skill[key]) {
            this.skill[key] += value;
        } else {
            this.skill[key] = value;
        }
    }

    getSkill(key) {
        return this.skill[key] || 0;
    }
}

module.exports = PlayerShipAttributes;

