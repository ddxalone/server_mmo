const UnitShip = require("./UnitShip");
const ShipWeapon = require("./ShipWeapon");
const ShipActive = require("./ShipActive");
const ShipPassive = require("./ShipPassive");
const ShipPlayerSkills = require("./ShipPlayerSkills");
const ItemProperties = require("./ItemProperties");
const PlayerShipAttributes = require("./PlayerShipAttributes");
const ShipTargetPlayer = require("./ShipTargetPlayer");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @constructor
 * @class {UnitShipPlayerMap}
 * @extends {UnitShip}
 */
class UnitShipPlayerMap extends UnitShip {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_SHIP_PLAYER);

        this.pow_ratio = common.setting.pow_ratio;

        this.frame_action_move = {
            pow: 0,
            rat: 0,
        };


        this.base_skill = null;

        /**
         * @type {ItemProperties}
         */
        this.core_skills_properties = null;
        /**
         * @type {ShipPlayerSkills}
         */
        this.player_skills = new ShipPlayerSkills();

        //TODO
        this.player_renowns = {};

        this.ship_attributes = new PlayerShipAttributes();

        /**
         * 套装激活状态
         * @type {{}}
         */
        this.suit_active_item_infos = {};

        this.ship_id = 0;

        //玩家手动任命单位
        this.appoint_unit_type = 0;
        this.appoint_unit_id = 0;

        //玩家射线扫描单位
        this.ray_unit_type = 0;
        this.ray_unit_id = 0;
        this.ray_frame = 0;

        //TODO 应该有一个开始时间 不然没法做倒计时圈
        //攻击标记
        this.attack_frame = 0;
        //犯罪状态
        this.crime_status = 0;
        //犯罪倒计时
        this.crime_frame = 0;

        //激活物品的数量
        // this.weapon_active_count = 0;

        this.target_info = new ShipTargetPlayer(this);

        this.scan_initiate_per = 0;
        this.scan_range_per = 0;
    }

    /**
     * 读取信息
     */
    loadInfoMap() {
        //更新全部属性
        this.updateShipPlayerProperty();

        //更新舰船参数
        this.updateShipInfo();
    }

    setShipId(ship_id) {
        this.ship_id = ship_id;
    }

    /**
     * 检测碰撞
     */
    checkCollisionPlayer() {
        //我处于运行状态 且我停靠状态为null才判断碰撞
        if (this.getRun() && this.berth_status === common.static.SHIP_BERTH_STATUS_NULL) {
            // 玩家的碰撞检测其他玩家和npc的 只检测ID比自己大的玩家 和所有NPC
            this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                map_grid_info.eachShipPlayer((unit_ship_player) => {
                    //只遍历比我大的ID 可实现不重复遍历
                    if (unit_ship_player.getRun() && unit_ship_player.berth_status === common.static.SHIP_BERTH_STATUS_NULL && unit_ship_player.unit_id > this.unit_id) {
                        this.checkUnitCollision(unit_ship_player);
                    }
                }, this);
                map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                    if (unit_ship_npcer.getRun()) {
                        this.checkUnitCollision(unit_ship_npcer);
                    }
                }, this);
                map_grid_info.eachStation((unit_station) => {
                    this.checkUnitCollision(unit_station);
                }, this);
            }, this);
        }

        this.useCollision();
    }

    /**
     * 更新核心属性
     */
    updateCoreSkillProperty() {
        this.core_skills_properties = new ItemProperties()
            .initProperty(this.base_skill);
    }

    updateShipPlayerProperty() {
        //思路 property 是计算属性 attribute 是加成属性
        //技能加成分为 给船体加成 给武器加成 和给指定某类装备白字属性加成
        //装备属性最终值 = (基础+固定) * 装备百分比 * 技能百分比 + 白字基础 * 白字技能加成 ??
        //调整为
        //装备属性最终值 = (基础+固定 + 白字基础 * 白字技能) * 装备百分比 * 技能百分比
        this.initShipAttributes();

        this.initSuitActiveInfos();

        //计算船体加成
        let core_skill_level = this.player_skills.getCoreSkillLevel();
        this.core_skills_properties.eachItemProperties((property) => {
            this.ship_attributes.addSkill(property.property, core_skill_level * property.value);
        }, this);

        //先遍历技能 白字装备属性需要吃到 技能加成
        this.player_skills.eachShipPlayerSkill((ship_player_skill) => {
            this.addShipPlayerSkillAttributes(ship_player_skill);
        }, this);

        this.setFilter((ship_weapon) => {
            return ship_weapon.checkOnline();
        }).eachShipWeapon((ship_weapon) => {
            //初始化武器attr属性
            ship_weapon.initWeaponAttributes();
            //遍历绿字属性给武器或者舰船
            ship_weapon.base_item_properties.eachItemProperties((property) => {
                this.addPlayerShipAttributes(ship_weapon, null, property);
            }, this);
            this.addSuitActiveInfo(ship_weapon.suit_type, ship_weapon.item_type);
        }, this);

        this.setFilter((ship_active) => {
            return ship_active.checkOnline();
        }).eachShipActive((ship_active) => {
            //初始化attr属性
            ship_active.initActiveAttributes();

            //遍历白字属性给装备 同时计算技能加成
            //如果装备激活 且可提供持续BUFF
            if (ship_active.checkActive() && ship_active.checkContinuedBuff()) {
                ship_active.base_module_properties.eachItemProperties((property) => {
                    this.addPlayerShipModuleAttributes(ship_active, property);
                }, this);
            }

            //遍历绿字属性给武器或者舰船
            ship_active.base_item_properties.eachItemProperties((property) => {
                this.addPlayerShipAttributes(null, ship_active, property);
            }, this);

            this.addSuitActiveInfo(ship_active.suit_type, ship_active.item_type);
        }, this);

        this.setFilter((ship_passive) => {
            return ship_passive.checkOnline();
        }).eachShipPassive((ship_passive) => {
            //遍历白字属性给装备 同时计算技能加成
            ship_passive.initPassiveAttributes();
            // this.addPlayerItemProperty(common.static.ITEM_MAIN_CLASSIFY_PASSIVE, ship_passive);
            // ship_passive.updatePassiveProperty();

            ship_passive.base_module_properties.eachItemProperties((property) => {
                this.addPlayerShipModuleAttributes(ship_passive, property);
            }, this);

            ship_passive.base_item_properties.eachItemProperties((property) => {
                //遍历绿字属性给武器或者舰船
                this.addPlayerShipAttributes(null, ship_passive, property);
            }, this);

            this.addSuitActiveInfo(ship_passive.suit_type, ship_passive.item_type);
        });

        //处理套装属性
        for (let suit_type in this.suit_active_item_infos) {
            let suit_count = Object.keys(this.suit_active_item_infos[suit_type]).length;
            let base_item_suit = this.getBaseSuitInfo(suit_type);

            new ItemProperties()
                .initSuitProperty(base_item_suit.attribute)
                .eachItemProperties((property) => {
                    //如果拥有的种类 大于等于 属性需要的种类 则追加套装属性
                    if (suit_count >= property.count) {
                        this.addPlayerShipAttributes(null, null, property);
                    }
                }, this);
        }


        this.shield_max = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_shield, 'shield');
        this.armor_max = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_armor, 'armor');
        this.speed_max = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_speed, 'speed');
        this.capacity_max = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_capacity, 'capacity');
        this.power_max = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_power, 'power');
        this.recover = this.calculateShipBodyProperty(common.static.RATIO_TYPE_FRAME_VALUE, this.base_recover, 'recover');
        this.resume = this.calculateShipBodyProperty(common.static.RATIO_TYPE_FRAME_VALUE, this.base_resume, 'resume');
        this.charge = this.calculateShipBodyProperty(common.static.RATIO_TYPE_FRAME_VALUE, this.base_charge, 'charge');

        this.shield_upper_electric = this.calculateShipBodyResistanceProperty(common.setting.base_resistance_upper, 'shield_upper', 'shield_upper_electric');
        this.shield_upper_thermal = this.calculateShipBodyResistanceProperty(common.setting.base_resistance_upper, 'shield_upper', 'shield_upper_thermal');
        this.shield_upper_explode = this.calculateShipBodyResistanceProperty(common.setting.base_resistance_upper, 'shield_upper', 'shield_upper_explode');
        this.armor_upper_electric = this.calculateShipBodyResistanceProperty(common.setting.base_resistance_upper, 'armor_upper', 'armor_upper_electric');
        this.armor_upper_thermal = this.calculateShipBodyResistanceProperty(common.setting.base_resistance_upper, 'armor_upper', 'armor_upper_thermal');
        this.armor_upper_explode = this.calculateShipBodyResistanceProperty(common.setting.base_resistance_upper, 'armor_upper', 'armor_upper_explode');

        this.shield_electric = Math.min(this.shield_upper_electric, this.calculateShipBodyResistanceProperty(this.base_shield_electric, 'shield', 'shield_electric'));
        this.shield_thermal = Math.min(this.shield_upper_thermal, this.calculateShipBodyResistanceProperty(this.base_shield_thermal, 'shield', 'shield_thermal'));
        this.shield_explode = Math.min(this.shield_upper_explode, this.calculateShipBodyResistanceProperty(this.base_shield_explode, 'shield', 'shield_explode'));
        this.armor_electric = Math.min(this.armor_upper_electric, this.calculateShipBodyResistanceProperty(this.base_armor_electric, 'armor', 'armor_electric'));
        this.armor_thermal = Math.min(this.armor_upper_thermal, this.calculateShipBodyResistanceProperty(this.base_armor_thermal, 'armor', 'armor_thermal'));
        this.armor_explode = Math.min(this.armor_upper_explode, this.calculateShipBodyResistanceProperty(this.base_armor_explode, 'armor', 'armor_explode'));

        this.agile = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_agile, 'agile');

        //计算能量
        this.setPower(0);
        this.setMass(this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_mass, 'mass'));

        this.eachShipWeapon((ship_weapon) => {
            ship_weapon.updateWeaponProperty();
            this.checkItemParam(ship_weapon);
        }, this);
        this.eachShipActive((ship_active) => {
            ship_active.updateActiveProperty();
            this.checkItemParam(ship_active);
        }, this);
        this.eachShipPassive((ship_passive) => {
            ship_passive.updatePassiveProperty();
            this.checkItemParam(ship_passive);
        }, this);

        this.updateThrusterSpeedMax();

        //是不是应该在这里获取 模块冷却时间 扫描 折跃等特殊信息
        this.scan_initiate_per = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, 1, 'scan_initiate');
        this.scan_range_per = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, 1, 'scan_range');
    }

    /**
     * 获取推力加成后的速度
     */
    updateThrusterSpeedMax() {
        // 获取推力
        // let thruster_value = this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, 0, 'thruster');
        // //获取推力加成系数100倍
        // let thruster_ratio = Math.floor(Math.pow(thruster_value / this.mass, common.setting.base_thruster_ratio) * 100);
        // this.speed_max = Math.floor(this.speed_max * (thruster_ratio + 100) / 100);

        this.speed_max = Math.floor(this.speed_max * (Math.floor(Math.pow(this.calculateShipBodyProperty(common.static.RATIO_TYPE_DRAW_RATIO, 0, 'thruster') / this.mass, common.setting.base_thruster_ratio) * 100) + 100) / 100);
    }

    /**
     * 虚方法
     */
    getBaseSuitInfo() {

    }

    /**
     * 消耗电容 并返回是否成功
     * @param ship_item
     * @returns {boolean}
     */
    costCapacity(ship_item) {
        if (!ship_item.cost) {
            return true;
        }
        // let item_cost = ship_item.cost;
        //主动装备第一次耗电为每秒使用的N倍
        // if (ship_item.main_classify === common.static.ITEM_MAIN_CLASSIFY_ACTIVE && ship_item.checkContinuedCost() && ship_item.getActiveCostStatus()) {
        //     ship_item.setActiveCostStatus(false);
        //     item_cost = ship_item.cost * common.setting.base_active_cost_ratio;
        // }
        if (this.checkCapacity(ship_item) === false) {
            ship_item.setItemStatus(common.static.SHIP_ITEM_STATUS_ONLINE);

            this.changeItemStatus(ship_item);

            this.loadInfoMap();

            this.reloadUi();

            return false;
        }
        this.subCapacity(ship_item.cost);
        return true;
    }

    /**
     * 检测电容是否足够
     * @param ship_item
     * @return {boolean}
     */
    checkCapacity(ship_item) {
        // if (ship_item.main_classify === common.static.ITEM_MAIN_CLASSIFY_ACTIVE && ship_item.checkContinuedCost()) {
        //     return ship_item.cost * common.setting.base_active_cost_ratio <= this.capacity;
        // }
        return ship_item.cost < this.capacity;
    }

    /**
     * 虚方法
     */
    reloadUi() {

    }

    /**
     * 虚方法
     */
    changeItemStatus(ship_item) {

    }

    /**
     * 计算船体属性方法
     * @param ratio_type
     * @param base
     * @param property
     * @return {number}
     */
    calculateShipBodyProperty(ratio_type, base, property) {
        return common.method.calculateShipProperty(
            ratio_type,
            base,
            this.calculateShipBodyAttrProperty(property),
            this.calculateShipSkillProperty(property),
            this.calculateShipBodyAttrProperty(property + '_per'),
            this.calculateShipSkillProperty(property + '_per')
        );
    }

    /**
     * 获取舰船加成数值
     * @param property
     * @return {*}
     */
    calculateShipBodyAttrProperty(property) {
        return this.ship_attributes.getAttr(property);
    }

    /**
     * 计算船体抗性属性方法
     * @param base
     * @param mold
     * @param property
     * @return {number}
     */
    calculateShipBodyResistanceProperty(base, mold, property) {
        //抗性没有百分比 全是百分比
        return common.method.calculateShipProperty(
            common.static.RATIO_TYPE_DRAW_RATIO,
            base,
            this.calculateShipBodyResistanceAttrProperty(mold, property),
            this.calculateShipBodyResistanceSkillProperty(mold, property)
        );
    }

    /**
     * 获取舰船抗性加成数值
     * @param mold
     * @param property
     * @return {*}
     */
    calculateShipBodyResistanceAttrProperty(mold, property) {
        return this.calculateShipBodyAttrProperty(property)
            + this.calculateShipBodyAttrProperty(mold + '_almighty');
    }

    /**
     * 获取舰船抗性技能数值
     * @param mold
     * @param property
     * @returns {*}
     */
    calculateShipBodyResistanceSkillProperty(mold, property) {
        return this.calculateShipSkillProperty(property)
            + this.calculateShipSkillProperty(mold + '_almighty');
    }

    /**
     * 计算船体加成
     * @param property
     * @return {*}
     */
    calculateShipSkillProperty(property) {
        //船体加成 +技能加成
        return this.ship_attributes.getSkill(property);
    }

    // calculateBodyResistance(base, property) {
    //     return common.func.calculateResistance(base, this.ship_attributes.getAttr(property));
    // }

    /**
     * 初始化舰船加成属性
     */
    initShipAttributes() {
        this.ship_attributes.initAttr();
        this.ship_attributes.initSkill();

        //清空最大射程
        this.range = 0;
        this.range_max = 0;
    }

    initSuitActiveInfos() {
        this.suit_active_item_infos = {};
    }

    addSuitActiveInfo(suit_type, item_type) {
        if (suit_type && item_type) {
            this.suit_active_item_infos[suit_type] || (this.suit_active_item_infos[suit_type] = {});
            this.suit_active_item_infos[suit_type][item_type] = true;
        }
    }

    /**
     * 追加装备的白字属性到舰船或者当前装备
     * @param ship_module
     * @param property
     */
    addPlayerShipModuleAttributes(ship_module, property) {
        //这里要吃技能加成 包括船体加成和技能加成
        //有技能加成的 的数值把属性赋值给 装备变量(module_attribute)
        //然后计算出 一个数值 再加到舰船上
        //白字属性都是加强武器和船体的
        //无论什么属性都是取 efficacy 的加成量
        let property_skill_value = ship_module.calculateModuleAttributes(common.static.RATIO_TYPE_NORMAL, property.value, property.property);

        //这个是小数没转成大数
        //白字加成属性
        ship_module.module_attribute.setAttr(property.property, property_skill_value);

        switch (property.scope) {
            case common.static.ATTRIBUTE_SCOPE_CURRENT_WEAPON:
            case common.static.ATTRIBUTE_SCOPE_CURRENT_MODULE:
            case common.static.ATTRIBUTE_SCOPE_CURRENT_ITEM:
                break;
            case common.static.ATTRIBUTE_SCOPE_SHIP:
            case common.static.ATTRIBUTE_SCOPE_RESISTANCE:
            case common.static.ATTRIBUTE_SCOPE_ALL_WEAPON:
            case common.static.ATTRIBUTE_SCOPE_ALL_MODULE:
            case common.static.ATTRIBUTE_SCOPE_ALL_ITEM:
                this.ship_attributes.addAttr(property.property, property_skill_value);
                break;
            case common.static.ATTRIBUTE_SCOPE_EXTRA:
                break;
        }
    }

    /**
     * 追加装备的绿字属性到舰船或者当前装备
     * @param ship_weapon
     * @param ship_module
     * @param property
     */
    addPlayerShipAttributes(ship_weapon, ship_module, property) {
        switch (property.scope) {
            case common.static.ATTRIBUTE_SCOPE_CURRENT_WEAPON:
                ship_weapon && (ship_weapon.item_attribute.addAttr(property.property, property.value));
                break;
            case common.static.ATTRIBUTE_SCOPE_CURRENT_MODULE:
                ship_module && (ship_module.item_attribute.addAttr(property.property, property.value));
                break;
            case common.static.ATTRIBUTE_SCOPE_CURRENT_ITEM:
                ship_weapon && (ship_weapon.item_attribute.addAttr(property.property, property.value));
                ship_module && (ship_module.item_attribute.addAttr(property.property, property.value));
                break;
            case common.static.ATTRIBUTE_SCOPE_SHIP:
                this.ship_attributes.addAttr(property.property, property.value);
                break;
            case common.static.ATTRIBUTE_SCOPE_RESISTANCE:
                this.ship_attributes.addAttr(property.property, property.value);
                break;
            case common.static.ATTRIBUTE_SCOPE_ALL_WEAPON:
            case common.static.ATTRIBUTE_SCOPE_ALL_MODULE:
            case common.static.ATTRIBUTE_SCOPE_ALL_ITEM:
                this.ship_attributes.addAttr(property.property, property.value);
                break;
            case common.static.ATTRIBUTE_SCOPE_EXTRA:
                break;
        }
    }

    /**
     * 追加船体技能和普通技能到船体加成
     * @param {ShipPlayerSkill} ship_player_skill
     */
    addShipPlayerSkillAttributes(ship_player_skill) {
        ship_player_skill.skill_properties.eachItemProperties((property) => {
            this.ship_attributes.addSkill(property.property, ship_player_skill.level * property.value);
        }, this);
    }

    /**
     * 虚方法
     * TODO 不想放在这里
     */
    getBaseAttribute() {

    }

    /**
     * 处理帧动作
     * @param frame_action
     */
    playerAction(frame_action) {
        if (frame_action) {
            if (frame_action.move) {
                // 方向不改 最终期望方向不改 (最大速度x,y) 如果开推子则x,y*推子系数即可 每帧给的力的坐标不改
                this.frame_action_move = frame_action.move;
                // this.frame_action_move.rat = 3532;
                // this.frame_action_move.pow = 100;

                if (this.frame_action_move.pow) {
                    // 每帧最终期望x,y坐标 不含正侧加成 不含推子 含控制力量 角度
                    // this.target_move_angle = this.frame_action_move.rat * this.draw_ratio;
                    this.setTargetMoveAngle(this.frame_action_move.rat * this.draw_ratio);
                    this.pow_point = common.func.anglePoint(0, 0, this.target_move_angle, this.frame_action_move.pow / this.pow_ratio * this.frame_max_speed);
                }
            }
            if (frame_action.item) {
                for (let slot in frame_action.item) {
                    let ship_item = this.getShipItem(parseInt(slot));
                    ship_item.setItemStatus(frame_action.item[slot]);
                }

                this.loadInfoMap();

                this.reloadUi();
            }
        }
    }

    /**
     * 服务帧结算
     */
    shipPlayerSettle() {
        if (this.getInit()) {
            if (this.getStationId()) {
                this.setBerth();
            } else {
                this.setRun();
            }
        }
        if (this.getRun()) {
            this.shipBerthSettle() || this.shipWarpSettle() || this.shipBattleSettle() || this.shipStealthSettle();

            if (this.getArmor() === 0) {
                this.setDeath();
            } else {
                this.shipIncrement();

                this.rayIncrement();
            }
        } else if (this.getDeath()) {
            //死亡更改为停靠
            //TODO 别的玩家死亡需要测试 1别的玩家死亡在断层内死亡 2别的玩家不再断层内死亡
            this.setBerth();
        } else if (this.getBerth()) {
            if (this.getStationId() === 0) {
                this.setRun();
            }
        }
    }

    /**
     * 玩家舰船动作处理
     * @return {UnitShipPlayerMap}
     */
    shipPlayerAction() {
        this.checkCollisionPlayer();

        if (this.getIsBerthStatus()) {
            this.addShipRotation(this.getMoveRotation());

            this.shipBerthMove();
        } else if (this.getIsWarpStatus()) {
            this.shipStopTargetAngle();

            this.shipDisAttack();
        } else {
            this.shipPlayerAi();

            this.addShipRotation(this.getForwardRotation());

            //有力量 并且 非模块状态 则前进
            if (this.frame_action_move.pow && this.getIsBattleStatus() === false) {
                this.shipForward();
            } else {
                this.shipStop();
            }


            // 模块展开 可以考虑 和 武器预热同时进行 构思一下
            //TODO 这里还没有让普通武器不开火 需要构思一下
            // this.getBattleAttackStatus() &&

            if (this.getIsStealthStatus() === false) {
                if (this.shipAttack()) {
                    //修改攻击倒计时
                    this.attack_frame = common.setting.base_attack_frame;

                    if (this.target_info.checkTargetValid() && this.target_info.target_unit_info.unit_type === common.static.MAP_UNIT_TYPE_SHIP_NPCER) {
                        this.target_info.target_unit_info.setPlayerAttackRenown(this);
                    }
                }
            }

            this.shipDefense();
        }
        return this;
    }

    shipHarmSettleDo() {
        //修改攻击倒计时
        this.attack_frame = common.setting.base_attack_frame;

        super.shipHarmSettleDo();
    }

    /**
     * 处理玩家自动AI
     */
    shipPlayerAi() {
        this.target_info.checkChooseTarget();
    }

    /**
     * 射线扫描方法
     */
    rayIncrement() {
        if (this.ray_frame) {
            this.ray_frame--;
            if (this.ray_frame === 0) {
                this.clearRayParam(true);
            }
        }
    }

    /**
     * 清理射线参数
     */
    clearRayParam() {
        this.ray_frame = 0;
        this.ray_unit_type = 0;
        this.ray_unit_id = 0;
    }

    beginBoom() {
        this.clearRayParam();
        super.beginBoom();
    }

    /**
     * 虚方法
     */
    // shipPlayerDead() {
    //
    // }

    /**
     * @param ship_item
     */
    updateShipPlayerItem(ship_item) {
        //初始化增加属性
        this.updateShipPlayerWeapons(ship_item.weapons);
        this.updateShipPlayerActives(ship_item.actives);
        this.updateShipPlayerPassives(ship_item.passives);
    }

    /**
     * 更新武器列表
     */
    updateShipPlayerWeapons(weapons) {
        //遍历已生成的武器
        this.eachShipWeapon((ship_weapon) => {
            //如果item_id一致 并且 weapon_pos一致 则不处理 否则移除此装备
            if (weapons[ship_weapon.slot] && weapons[ship_weapon.slot].item_id === ship_weapon.item_id) {
                ship_weapon.reloadInfo(weapons[ship_weapon.slot]);
                delete weapons[ship_weapon.slot];
            } else {
                //如果数据不存在 则移除旧的已生成的武器
                this.delShipWeapon(ship_weapon);
            }
        }, this);

        //剩余的为服务端存在 客户端不存在
        if (Object.keys(weapons).length) {
            for (let weapon of Object.values(weapons)) {
                let ship_weapon = new ShipWeapon()
                    .setTargetInfo(this.target_info)
                    .setBaseShip(this)
                    .loadInfo(weapon);

                this.addShipWeapon(ship_weapon);
            }
        }
    }

    /**
     * 更新主动装备列表
     */
    updateShipPlayerActives(actives) {
        //遍历已生成的武器
        this.eachShipActive((ship_active) => {
            //如果item_id一致 或者 weapon_pos一致 则不处理 否则移除此装备
            if (actives[ship_active.slot] && actives[ship_active.slot].item_id === ship_active.item_id) {
                ship_active.reloadInfo(actives[ship_active.slot]);
                delete actives[ship_active.slot];
            } else {
                //如果数据不存在 则移除旧的已生成的武器
                this.delShipActive(ship_active);
            }
        }, this);

        //剩余的为服务端存在 客户端不存在
        if (Object.keys(actives).length) {
            for (let active of Object.values(actives)) {
                let ship_active = new ShipActive()
                    .setBaseShip(this)
                    .loadInfo(active);

                this.addShipActive(ship_active);
            }
        }
    }

    /**
     * 更新被动装备列表
     */
    updateShipPlayerPassives(passives) {
        //遍历已生成的武器
        this.eachShipPassive((ship_passive) => {
            //如果item_id一致 或者 weapon_pos一致 则不处理 否则移除此装备
            if (passives[ship_passive.slot] && passives[ship_passive.slot].item_id === ship_passive.item_id) {
                ship_passive.reloadInfo(passives[ship_passive.slot]);
                delete passives[ship_passive.slot];
            } else {
                //如果数据不存在 则移除旧的已生成的武器
                this.delShipPassive(ship_passive);
            }
        }, this);

        //剩余的为服务端存在 客户端不存在
        if (Object.keys(passives).length) {
            for (let passive of Object.values(passives)) {
                let ship_passive = new ShipPassive()
                    .setBaseShip(this)
                    .loadInfo(passive);

                this.addShipPassive(ship_passive);
            }
        }
    }

    /**
     * 技能属性很简单 考虑要不要再建一个类来处理了 类型 等级 属性名称 没了
     * @param ship_skills
     */
    updateShipPlayerSkill(ship_skills) {
        this.player_skills.updateSkills(ship_skills);
    }

    /**
     * TODO 还缺少同步的方法
     * @param player_renowns
     */
    updateShipPlayerRenown(player_renowns) {
        this.player_renowns = player_renowns;
    }

    /**
     * 获取某个阵营的声望
     * @param force
     * @return {*}
     */
    getForceRenown(force) {
        //TODO 暂定声望数值
        // this.player_renowns[force] = 1000;
        return this.player_renowns[force] || common.static.PLAYER_FORCE_RENOWN_DEFAULT;
    }

    /**
     * 获取当前用户是否可以折跃
     * @return {boolean}
     */
    getCanWarpStatus() {
        //TODO 后端逻辑还未实装
        return this.getIsWarpStatus() === false && this.getIsBattleStatus() === false;
    }

    /**
     * 获取当前用户是否可以停靠
     */
    getCanJoinStatus() {
        //TODO 后端逻辑还未实装
        return this.getIsWarpStatus() === false && this.getIsBattleStatus() === false;
    }
}

module.exports = UnitShipPlayerMap;

