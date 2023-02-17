class HarmAccumulative {
    constructor() {
        this.unit_type = 0;//单位类型
        this.ship_type = 0;//舰船类型
        this.unit_id = 0;//玩家存在
        this.force = 0;//npcer存在
        this.item_type = 0;//武器类型
        this.harm = 0;//累计伤害
    }

    addHarm(harm) {
        this.harm += harm;
    }

    getHarm() {
        return this.harm;
    }
}

module.exports = HarmAccumulative;