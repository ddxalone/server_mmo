const ShipItem = require("./ShipItem");
const ItemProperties = require("./ItemProperties");
const PlayerShipItemAttributes = require("./PlayerShipItemAttributes");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {ShipActiveMap}
 */
class ShipActiveMap extends ShipItem {
    constructor() {
        super(common.static.ITEM_MAIN_CLASSIFY_ACTIVE);
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

        // this.active_pos = 0;

        this.cool_down = 0;
        this.require = 0;
        this.cost = 0;

        this.base_cool_down = 0;
        this.base_require = 0;
        this.base_cost = 0;
        this.base_mass = 0;

        this.suit_type = 0;
        this.res = '';
        this.base_property = {};
        this.base_attribute = {};
        this.base_extra = {};

        // this.slot = 0;

        //开始激活时间
        this.start_cool_frame = 0;
        //下一次激活时间
        this.next_cool_frame = 0;
    }

    setItemStatus(item_status) {
        //如果是持续耗电装备 则设定首次激活耗电
        // if (this.checkContinuedCost() && this.item_status !== common.static.SHIP_ITEM_STATUS_ACTIVE) {
        //     this.setActiveCostStatus(item_status === common.static.SHIP_ITEM_STATUS_ACTIVE);
        // }
        super.setItemStatus(item_status);
    }

    // setActivePos(active_pos) {
    //     this.active_pos = active_pos;
    // }

    /**
     * 记录逻辑帧编号 用于计算攻速
     * @param server_frame
     */
    // setServerFrame(server_frame) {
    //     this.server_frame = server_frame;
    // }

    /**
     * 更新武器属性
     */
    loadInfoMap() {
        this.initItemActiveAttribute();
    }

    /**
     * 虚方法
     */
    getBaseItemInfo() {

    }

    /**
     * 获取基础数据
     */
    initBaseActiveInfo() {
        let base_item_info = this.getBaseItemInfo();
        this.classify = base_item_info.classify;
        this.quality = base_item_info.quality;

        this.base_cool_down = base_item_info.cool_down;
        this.base_require = base_item_info.require;
        this.base_cost = base_item_info.cost;
        this.base_mass = base_item_info.mass;

        this.suit_type = base_item_info.suit_type;
        this.res = base_item_info.res;
        this.base_property = base_item_info.property;
        this.base_attribute = base_item_info.attribute;
        this.base_extra = base_item_info.extra;
    }

    /**
     * 初始化装备属性
     */
    initItemActiveAttribute() {
        //读取装备attribute
        this.base_item_properties = new ItemProperties()
            .initProperty(this.base_attribute);
        this.base_module_properties = new ItemProperties()
            .initProperty(this.base_property);

        // this.base_module_properties.eachItemProperties((property) => {
        //     this.base_module_attribute.addAttr(property.property, property.value);
        // }, this);
    }

    initActiveAttributes() {
        this.item_attribute.initAttr();
        this.module_attribute.initAttr();
    }

    updateActiveProperty() {
        //有冷却 耗电为普通耗电 吃加成
        //没冷却 耗电为帧耗电 不吃加成
        //模块有冷却 但不为持续耗电
        this.cool_down = this.calculateActiveProperty(common.static.RATIO_TYPE_SERVER_FRAME, this.base_cool_down, 'cool_down');
        // if (this.checkContinuedCost()) {
        //     this.cost = this.calculateActiveProperty(common.static.RATIO_TYPE_FRAME_VALUE, this.base_cost, 'cost');
        // } else {

        //隐形装置百分比耗电 TODO 尚未测试
        if (this.checkActiveStealth()) {
            this.cost = this.calculateActiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_ship.base_capacity * this.base_cost / 100, 'cost');
        } else {
            this.cost = this.calculateActiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_cost, 'cost');
        }

        // }
        this.require = this.calculateActiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_require, 'require');
        this.mass = this.calculateActiveProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_mass, 'mass');
    }

    /**
     * 计算装备白字属性的最终值 只计算技能加成 和 船体加成
     * @param ratio_type
     * @param base
     * @param property
     * @return {number}
     */
    calculateModuleAttributes(ratio_type, base, property) {
        //白字属性获取的 efficacy 的加成
        return common.method.calculateShipProperty(
            ratio_type,
            base,
            0,
            0,
            this.calculateActiveAttrBodyProperty('efficacy'),
            this.calculateActiveSkillProperty('efficacy')
        );
    }

    /**
     * 计算船体加成
     */
    calculateActiveAttrBodyProperty(property) {
        let skill_property = common.method.getSkillPropertyString(this.classify, property);
        if (skill_property) {
            return this.base_ship.ship_attributes.getAttr(skill_property);
        }
        return 0;
    }

    /**
     * 计算技能加成的数值
     */
    calculateActiveSkillProperty(property) {
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
    calculateActiveProperty(ratio_type, base, property) {
        return common.method.calculateShipProperty(
            ratio_type,
            base,
            this.calculateActiveAttrProperty(property),
            this.calculateActiveSkillProperty(property),
            this.calculateActiveAttrProperty(property + '_per'),
            this.calculateActiveSkillProperty(property + '_per')
        );
    }

    calculateActiveAttrProperty(property) {
        return this.item_attribute.getAttr(property) +
            this.base_ship.ship_attributes.getAttr('module_' + property) +
            this.base_ship.ship_attributes.getAttr('global_' + property)
    }

    activeDefense() {
        if (this.checkDefenseStatus()) {
            //非持续耗电检测状态
            //如果不提供持续BUFF 则在这里处理
            if (this.checkActiveTarget() && this.base_ship.target_info.checkTargetValid()) {
                this.base_module_properties.eachItemProperties((property) => {
                    //只吃技能加成和船体加成
                    let property_skill_value = this.calculateModuleAttributes(common.static.RATIO_TYPE_DRAW_RATIO, property.value, property.property);

                    //TODO 如何实装
                    switch (property.property) {
                        case 'stagnant_per':
                            break;
                        case 'steering_per':
                            //TODO 不做了  多对一的时候对一不公平
                            break;
                        case 'siphon':
                            let siphon_value = Math.min(this.base_ship.target_info.target_unit_info.capacity, property_skill_value);
                            this.base_ship.addCapacity(siphon_value);
                            this.base_ship.target_info.target_unit_info.subCapacity(property_skill_value);
                            break;
                        case 'neutralization':
                            this.base_ship.target_info.target_unit_info.subCapacity(property_skill_value);
                            break;
                    }

                }, this);
            } else if (this.checkContinuedBuff() === false) {
                this.base_module_properties.eachItemProperties((property) => {
                    //只允许增加当前的值 当前盾量 当前加量 当前电容量
                    //只吃技能加成和船体加成
                    let property_skill_value = this.calculateModuleAttributes(common.static.RATIO_TYPE_DRAW_RATIO, property.value, property.property);

                    switch (property.property) {
                        case 'shield':
                            this.base_ship.addShield(property_skill_value);
                            break;
                        case 'armor':
                            this.base_ship.addArmor(property_skill_value);
                            break;
                        case 'capacity':
                            this.base_ship.addCapacity(property_skill_value);
                            break;
                    }
                }, this);
            }
        }
    }

    /**
     * 检测是否触发CD
     * @returns {boolean}
     */
    checkDefenseStatus() {
        // 护盾充能装备 有CD 无CD 有CD点击下个CD停止 瞬间恢复
        // 装甲维修装备 有CD 无CD 有CD点击下个CD停止 瞬间恢复
        // 舰船加速装备 有CD 无CD 有CD点击下个CD停止 持续生效
        // 舰船隐形装备 无CD 点击停止 持续生效   点击改为active 然后增加一个变量 慢慢隐身  点击改为online 慢慢现身
        // 武器模块装备 有CD 无CD 有CD点击下个CD停止 持续生效
        // 电容注入装备 有CD 有CD点击下个CD停止 瞬间恢复

        //检测是否到CD了 并更新frozen状态
        if (this.checkFrozenStatus()) {
            //检测主动模块是否需要目标
            if (this.checkActiveTarget() === false || (this.checkActiveTarget() && this.base_ship.target_info.checkTargetValid())) {
                if (this.base_ship.costCapacity(this)) {
                    this.setNextCoolFrame();

                    //如果是末日武器 调整预热状态参数
                    if (this.checkActiveBattle()) {
                        //自动开启舰船的会战模式
                        //如果设定了模块持续时间 则使用模块持续时间 否则使用武器CD
                        this.base_ship.beginBattleAction(this.cool_down);
                    }

                    if (this.checkActiveStealth()) {
                        this.base_ship.beginStealthAction();
                    }

                    return true;
                }
            }
        }
        return false;
    }

    checkOnline() {
        return this.item_status !== common.static.SHIP_ITEM_STATUS_OFFLINE;
    }

    /**
     * 判断装备是否处于正在激活状态
     * @return {boolean}
     */
    checkActive() {
        // 激活或者正在取消激活状态
        return (this.item_status === common.static.SHIP_ITEM_STATUS_ACTIVE || this.item_status === common.static.SHIP_ITEM_STATUS_FROZEN);
        // return this.item_status === common.static.SHIP_ITEM_STATUS_ACTIVE;
    }

    /**
     * 检测是否为模块装备
     * @returns {boolean}
     */
    checkActiveBattle() {
        return this.classify === common.static.ITEM_CLASSIFY_ACTIVE_BATTLE;
    }

    /**
     * 检测是否为隐身装备
     * @returns {boolean}
     */
    checkActiveStealth() {
        return this.classify === common.static.ITEM_CLASSIFY_ACTIVE_STEALTH;
    }

    /**
     * 判断主动装备是可提供持续BUFF
     * @return {boolean}
     */
    checkContinuedBuff() {
        return common.method.checkActiveContinuedBuff(this.classify);
    }

    /**
     * 判断是否需要目标
     */
    checkActiveTarget() {
        switch (this.classify) {
            case common.static.ITEM_CLASSIFY_ACTIVE_STAGNANT:
            case common.static.ITEM_CLASSIFY_ACTIVE_STEERING:
            case common.static.ITEM_CLASSIFY_ACTIVE_SIPHON:
            case common.static.ITEM_CLASSIFY_ACTIVE_NEUTRALIZATION:
                return true;
        }
        return false;
    }

    /**
     * 判断主动装备是否持续耗电
     */
    // checkContinuedCost() {
    //     return common.method.checkActiveContinuedCost(this.classify, this.base_cool_down);
    // }

    /**
     * 检测是否冷却结束
     * @return {boolean}
     */
    checkCoolStatus() {
        return this.next_cool_frame <= this.base_ship.server_frame;
    }

    /**
     * 检测取消激活状态是否触发为在线
     * @return {boolean}
     */
    checkFrozenStatus() {
        //如果是冻结状态
        if (this.item_status === common.static.SHIP_ITEM_STATUS_FROZEN) {
            //如果CD结束了  则修正成在线
            if (this.checkCoolStatus()) {
                this.item_status = common.static.SHIP_ITEM_STATUS_ONLINE;

                this.base_ship.changeItemStatus(this);

                this.base_ship.loadInfoMap();

                this.base_ship.reloadUi();
            }
            return false;
        }
        return this.checkCoolStatus();
    }

    setNextCoolFrame() {
        this.start_cool_frame = this.base_ship.server_frame;
        this.next_cool_frame = Math.round(this.base_ship.server_frame + this.cool_down);
    }
}

module.exports = ShipActiveMap;

