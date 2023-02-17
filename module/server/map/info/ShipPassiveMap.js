const ShipItem = require("./ShipItem");
const ItemProperties = require("./ItemProperties");
const PlayerShipItemAttributes = require("./PlayerShipItemAttributes");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {ShipPassiveMap}
 */
class ShipPassiveMap extends ShipItem {
    constructor() {
        super(common.static.ITEM_MAIN_CLASSIFY_PASSIVE);
        /**
         * 属性列表 未处理的从base表读取出来的
         * @type {ItemProperties}
         */
        this.base_module_properties = null;
        /**
         * 装备白字属性 加成后 采用和绿字属性一样的处理方式
         * @type {PlayerShipItemAttributes}
         */
        this.module_attribute = new PlayerShipItemAttributes();

        // this.passive_pos = 0;

        this.cool_down = 0;
        this.require = 0;
        // this.cost = 0;

        // this.base_cool_down = 0;
        this.base_require = 0;
        // this.base_cost = 0;
        this.base_mass = 0;

        this.suit_type = 0;
        this.res = '';
        this.base_property = {};
        this.base_attribute = {};
        this.base_extra = {};

        // this.slot = 0;
    }

    // setPassivePos(passive_pos) {
    //     this.passive_pos = passive_pos;
    // }

    /**
     * 更新武器属性
     */
    loadInfoMap() {
        this.initItemPassiveAttribute();
    }

    /**
     * 虚方法
     */
    getBaseItemInfo() {

    }

    /**
     * 获取基础数据
     */
    initBasePassiveInfo() {
        let base_item_info = this.getBaseItemInfo();
        this.classify = base_item_info.classify;
        this.quality = base_item_info.quality;

        // this.base_range = base_item_info.range;
        // this.base_angle = base_item_info.angle;
        // this.base_scatter = base_item_info.scatter;
        // this.base_space = base_item_info.space;
        // this.base_blast = base_item_info.blast;
        // this.base_sustain = base_item_info.sustain;
        // this.base_damage = base_item_info.damage;
        // this.base_speed = base_item_info.speed;
        // this.base_mass = base_item_info.mass;
        // this.base_cool_down = base_item_info.cool_down;
        // this.base_power = base_item_info.power;
        this.base_require = base_item_info.require;
        // this.base_cost = base_item_info.cost;
        this.base_mass = base_item_info.mass;
        // this.base_shield = base_item_info.shield;
        // this.base_armor = base_item_info.armor;
        // this.base_recover = base_item_info.recover;
        // this.base_charge = base_item_info.charge;
        // this.base_capacity = base_item_info.capacity;
        // this.base_shield_electric = base_item_info.shield_electric;
        // this.base_shield_thermal = base_item_info.shield_thermal;
        // this.base_shield_explode = base_item_info.shield_explode;
        // this.base_armor_electric = base_item_info.armor_electric;
        // this.base_armor_thermal = base_item_info.armor_thermal;
        // this.base_armor_explode = base_item_info.armor_explode;

        this.suit_type = base_item_info.suit_type;
        this.res = base_item_info.res;
        this.base_property = base_item_info.property;
        this.base_attribute = base_item_info.attribute;
        this.base_extra = base_item_info.extra;
    }

    /**
     * 初始化装备属性
     */
    initItemPassiveAttribute() {
        //读取装备attribute
        this.base_item_properties = new ItemProperties()
            .initProperty(this.base_attribute);
        this.base_module_properties = new ItemProperties()
            .initProperty(this.base_property);

        // this.base_module_properties.eachItemProperties((property) => {
        //     this.base_module_attribute.addAttr(property.property, property.value);
        // }, this);
    }

    initPassiveAttributes() {
        this.item_attribute.initAttr();
        this.module_attribute.initAttr();
        // this.attr_cool_down = 0;
        // this.attr_cool_down_per = 0;
        // this.attr_require = 0;
        // this.attr_require_per = 0;
        // this.attr_cost = 0;
        // this.attr_cost_per = 0;
    }

    updatePassiveProperty() {
        //有冷却 耗电为普通耗电 吃加成
        //没冷却 耗电为帧耗电 不吃加成
        // if (this.base_cool_down) {
        //     this.cool_down = this.calculatePassiveProperty(common.static.RATIO_TYPE_SERVER_FRAME, this.base_cool_down, 'cool_down');
        // this.cost = this.calculatePassiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_cost, 'cost');
        // } else {
        //     this.cool_down = 0;
        // this.cost = this.calculatePassiveProperty(common.static.RATIO_TYPE_SERVER_FRAME, this.base_cost, 'cost');
        // }
        this.require = this.calculatePassiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_require, 'require');
        this.mass = this.calculatePassiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_mass, 'mass');
    }

    /**
     * 计算装备白字属性的最终值 只计算技能加成
     * @param ratio_type
     * @param base
     * @param property
     * @return {number}
     */
    calculateModuleAttributes(ratio_type, base, property) {
        return common.method.calculateShipProperty(
            ratio_type,
            base,
            0,
            0,
            this.calculatePassiveAttrBodyProperty('efficacy'),
            this.calculatePassiveSkillProperty('efficacy')
        );
    }

    /**
     * 计算船体加成
     */
    calculatePassiveAttrBodyProperty(property) {
        let skill_property = common.method.getSkillPropertyString(this.classify, property);
        if (skill_property) {
            return this.base_ship.ship_attributes.getAttr(skill_property);
        }
        return 0;
    }

    /**
     * 计算技能加成的数值
     */
    calculatePassiveSkillProperty(property) {
        let skill_property = common.method.getSkillPropertyString(this.classify, property);
        if (skill_property) {
            return this.base_ship.ship_attributes.getSkill(skill_property);
        }
        return 0;
    }

    /**
     * 计算绿字属性
     * @param ratio_type
     * @param base
     * @param property
     * @return {number}
     */
    calculatePassiveProperty(ratio_type, base, property) {
        return common.method.calculateShipProperty(
            ratio_type,
            base,
            this.calculatePassiveAttrProperty(property),
            this.calculatePassiveSkillProperty(property),
            this.calculatePassiveAttrProperty(property + '_per'),
            this.calculatePassiveSkillProperty(property + '_per')
        );
    }

    calculatePassiveAttrProperty(property) {
        return this.item_attribute.getAttr(property) +
            this.base_ship.ship_attributes.getAttr('module_' + property) +
            this.base_ship.ship_attributes.getAttr('global_' + property)
    }

    checkOnline() {
        return this.item_status !== common.static.SHIP_ITEM_STATUS_OFFLINE;
    }
}

module.exports = ShipPassiveMap;
