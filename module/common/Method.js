const common = require("./index");

class Method {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;

        this.server_run_time = new Date().getTime();
    }

    static instance() {
        if (Method.m_instance == null) {
            Method.m_instance = new Method();
        }
        return Method.m_instance;
    }

    /**
     * 获取质量基础转换率
     */
    getMassRatio(mass) {
        //质量差10倍 系数差4倍
        return Math.floor(Math.pow(4, Math.log10(Math.floor(mass / this.draw_ratio)) - 2) * this.draw_ratio);
    }


    /**
     * 获取分类的主分类 很多时候用主分类判断就可以了
     * @param classify
     * @return {number}
     */
    getMainClassifyUseClassify(classify) {
        if (classify <= common.static.ITEM_CLASSIFY_WEAPON_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_WEAPON;
        } else if (classify <= common.static.ITEM_CLASSIFY_ACTIVE_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_ACTIVE;
        } else if (classify <= common.static.ITEM_CLASSIFY_PASSIVE_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_PASSIVE;
        } else if (classify <= common.static.ITEM_CLASSIFY_INFO_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_INFO;
        } else {
            ff('不应该走到这里2')
            return 0;
        }
    }

    /**
     * 根据物品编号获取分类的主分类 很多时候用主分类判断就可以了
     * @param item_type
     * @return {number}
     */
    getMainClassifyUseItemType(item_type) {
        if (item_type <= common.static.SHIP_ITEM_TYPE_WEAPON_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_WEAPON;
        } else if (item_type <= common.static.SHIP_ITEM_TYPE_ACTIVE_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_ACTIVE;
        } else if (item_type <= common.static.SHIP_ITEM_TYPE_PASSIVE_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_PASSIVE;
        } else if (item_type <= common.static.SHIP_ITEM_TYPE_INFO_MAX) {
            return common.static.ITEM_MAIN_CLASSIFY_INFO;
        } else {
            ff('不应该走到这里3')
            return 0;
        }
    }

    /**
     * 计算属性
     * @param type
     * @param base
     * @param attr
     * @param skill
     * @param attr_per
     * @param skill_per
     * @return {number}
     */
    calculateShipProperty(type, base, attr, skill, attr_per = 0, skill_per = 0) {
        //最终值 必须大于0
        let value = (base + attr + skill) * (100 + attr_per) * (100 + skill_per) / 10000;
        return this.calculateValue(type, value);
    }

    /**
     * 计算额外的百分比加成
     * @param base
     * @param per
     * @return {number}
     */
    calculatePerProperty(base, per) {
        return Math.floor(base * (100 + per) / 100);
    }

    /**
     * 获取数值
     * @param type
     * @param value
     * @return {number}
     */
    calculateValue(type, value) {
        switch (type) {
            case common.static.RATIO_TYPE_NORMAL:
                return Math.floor(value);
            case common.static.RATIO_TYPE_DRAW_RATIO:
                return Math.floor(value * this.draw_ratio);
            case common.static.RATIO_TYPE_SERVER_FRAME:
                //把100单位(1秒)转换为 帧数
                return Math.floor(value * common.setting.base_server_frame / this.draw_ratio);
            case common.static.RATIO_TYPE_FRAME_VALUE:
                //把每秒数值换算成每帧数值
                return Math.floor(value / common.setting.base_server_frame * this.draw_ratio);
        }
    }

    /**
     * 反向获取 并保留小数
     * @param type
     * @param value
     * @param bit
     * @return {number}
     */
    reverseValue(type, value, bit = 2) {
        switch (type) {
            case common.static.RATIO_TYPE_NORMAL:
                break;
            case common.static.RATIO_TYPE_DRAW_RATIO:
                value = value / this.draw_ratio;
                break;
            case common.static.RATIO_TYPE_SERVER_FRAME:
                //把100单位(1秒)转换为 帧数
                value = value / common.setting.base_server_frame * this.draw_ratio;
                break;
            case common.static.RATIO_TYPE_FRAME_VALUE:
                //把每秒数值换算成每帧数值
                value = value * common.setting.base_server_frame / this.draw_ratio;
                break;
        }
        return bit ? common.func.formatFloat(value, bit) : Math.floor(value)
    }


    /**
     * @param slot
     * @param main_classify
     * @return {number}
     */
    getPosFromSlot(slot, main_classify = 0) {
        main_classify || (main_classify = this.getMainClassifyFromSlot(slot));
        switch (main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return slot - 10;
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                return slot - 20;
            case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                return slot - 30;
            default:
                return slot;
        }
    }

    /**
     * @param main_classify
     * @param pos
     * @return {number}
     */
    getSlotFromPos(main_classify, pos) {
        switch (main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return pos + 10;
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                return pos + 20;
            case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                return pos + 30;
        }
    }

    /**
     * @param slot
     * @return {number}
     */
    getMainClassifyFromSlot(slot) {
        if (slot >= 40) {
            return 0;
        } else if (slot >= 30) {
            return common.static.ITEM_MAIN_CLASSIFY_PASSIVE;
        } else if (slot >= 20) {
            return common.static.ITEM_MAIN_CLASSIFY_ACTIVE;
        } else if (slot >= 10) {
            return common.static.ITEM_MAIN_CLASSIFY_WEAPON;
        }
        return 0;
    }

    /**
     * 获取左右平均分布的系数
     * @param pos
     * @param total
     * @return {number}
     */
    getPosRatio(pos, total) {
        // return (total % 2) ? ((pos % 2) ? (pos + 1) : -pos) : ((pos % 2) ? pos : (-pos - 1));
        // return (total % 2) ? ((pos % 2) ? (-pos - 1) : pos) : ((pos % 2) ? pos : (-pos - 1));
        return (pos % 2 === total % 2) ? -pos - 1 : pos;
    }

    /**
     * 获取技能加成类型前缀
     * @param classify
     * @param property
     */
    getSkillPropertyString(classify, property) {
        switch (classify) {
            case common.static.ITEM_CLASSIFY_AMMO:
            case common.static.ITEM_CLASSIFY_GUIDE:
            case common.static.ITEM_CLASSIFY_LASER:
                return 'weapon_' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_RECOVER:
                return 'active_recover' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_RESUME:
                return 'active_resume' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_THRUSTER:
                return 'active_thruster' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_STEALTH:
                return 'active_cloaking' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_BATTLE:
                return 'active_battle' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_CAPACITOR:
                return 'active_capacitor' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_STAGNANT:
                return 'active_stagnant' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_STEERING:
                return 'active_steering' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_SIPHON:
                return 'active_siphon' + property;
            case common.static.ITEM_CLASSIFY_ACTIVE_NEUTRALIZATION:
                return 'active_neutralization' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_DAMAGE:
                return 'passive_damage' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_TRACKING:
                return 'passive_tracking' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_SHAPE:
                return 'passive_shape' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_SHIELD_EXTENDER:
                return 'passive_shield_extender' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_ARMOR_EXTENDER:
                return 'passive_armor_extender' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_SHIELD_RESISTANCE:
                return 'passive_shield_resistance' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_ARMOR_RESISTANCE:
                return 'passive_armor_resistance' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_SHIELD_RECOVER:
                return 'passive_shield_recover' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_ARMOR_RESUME:
                return 'passive_armor_resume' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_CHARGE:
                return 'passive_charge' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_CAPACITY:
                return 'passive_capacity' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_MASS:
                return 'passive_mass' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_OVERDRIVE:
                return 'passive_overdrive' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_ACCELERATOR:
                return 'passive_accelerator' + property;
            case common.static.ITEM_CLASSIFY_PASSIVE_SCAN:
                return 'scan_item' + property;
            default:
                return '';
        }
    }

    /**
     * 检测主动装备是否提供持续BUFF
     * @param classify
     * @return {boolean}
     */
    checkActiveContinuedBuff(classify) {
        // 只要激活就生效的数值 放到舰船的基础属性上
        // 例如 没CD的修盾修甲
        // 有CD或没CD的模块 推子 隐身
        // 注电必有CD永久为false
        // 持续BUFF返回true 其他返回false
        switch (classify) {
            // case common.static.ITEM_CLASSIFY_ACTIVE_RECOVER:
            // case common.static.ITEM_CLASSIFY_ACTIVE_RESUME:
            //不在设置无CD的恢复装备
            // return !cool_down;
            // return false;
            case common.static.ITEM_CLASSIFY_ACTIVE_THRUSTER:
            case common.static.ITEM_CLASSIFY_ACTIVE_STEALTH:
            case common.static.ITEM_CLASSIFY_ACTIVE_BATTLE:
                return true;
            // case common.static.ITEM_CLASSIFY_ACTIVE_CAPACITOR:
            // //新增4类装备不提供持续buff 每帧处理 或者给目标打一个debuff 持续多久
            // case common.static.ITEM_CLASSIFY_ACTIVE_STAGNANT:
            // case common.static.ITEM_CLASSIFY_ACTIVE_STEERING:
            // case common.static.ITEM_CLASSIFY_ACTIVE_SIPHON:
            // case common.static.ITEM_CLASSIFY_ACTIVE_NEUTRALIZATION:
            //     return false;
        }
        return false;
    }

    /**
     * 检测主动装备是否提供持续耗电
     * @param classify
     * @param cool_down
     * @return {boolean}
     */
    // checkActiveContinuedCost(classify, cool_down) {
    //     //恢复类装备如果无CD则持续耗电
    //     switch (classify) {
    //         case common.static.ITEM_CLASSIFY_ACTIVE_RECOVER:
    //         case common.static.ITEM_CLASSIFY_ACTIVE_RESUME:
    //         case common.static.ITEM_CLASSIFY_ACTIVE_THRUSTER:
    //         case common.static.ITEM_CLASSIFY_ACTIVE_STEALTH:
    //             return !cool_down;
    //         case common.static.ITEM_CLASSIFY_ACTIVE_BATTLE:
    //         case common.static.ITEM_CLASSIFY_ACTIVE_CAPACITOR:
    //             return false;
    //     }
    //     return false;
    // }

    /**
     * 获取舰船的大类型
     * @param classify
     */
    getShipCategory(classify) {
        return Math.floor(classify / 10);
    }

    /**
     * 获取舰船的规格
     * @param category
     */
    getShipSize(category) {
        return Math.ceil(category / 2);
    }

}

Method.m_instance = null;

module.exports = Method;
