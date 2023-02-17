class HarmInfo {
    constructor() {
        this.ship_unit_type = 0;//类型
        this.ship_ship_type = 0;//舰船类型
        this.ship_unit_id = 0;//ID
        this.ship_force = 0;//阵营
        this.item_type = 0;//武器类型
        this.harm_electric = 0;//电伤
        this.harm_thermal = 0;//热伤
        this.harm_explode = 0;//爆伤
        this.penetration_electric = 0;//电穿
        this.penetration_thermal = 0;//热穿
        this.penetration_explode = 0;//爆穿
    }
}

module.exports = HarmInfo;