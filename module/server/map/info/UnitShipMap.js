const BaseUnit = require("./BaseUnit");
const common = require("../../../common");
const m_server = require("../../../server");
const HarmAccumulative = require("./HarmAccumulative");

/**
 * @class {UnitShipMap}
 * @extends {BaseUnit}
 */
class UnitShipMap extends BaseUnit {
    constructor(unit_type) {
        super(unit_type);
        // this.warp_static_frame = common.setting.warp_static_frame;
        this.battle_static_frame = common.setting.battle_static_frame;
        this.ship_type = 0;
        //服务器ID 整数
        this.server_id = 0;
        //分类
        this.classify = 0;
        //种类
        this.category = 0;
        //规格
        this.size = 0;
        // 正在进行的移动力
        this.move_point = common.func.Point();
        // 碰撞移动力
        this.collision_point = common.func.Point();
        // 辅助移动力
        this.auxiliary_point = common.func.Point();
        // 正在进行的转速
        this.move_rotation = 0;
        // 质量系数
        this.mass_ratio = 0;
        // 控制方向
        this.pow_point = common.func.Point();
        // this.final_pow_point = common.func.Point();

        // 战斗模式 true游击 false狙击
        // this.fight_model = common.static.PATROL_MODEL_SNIPER;

        this.res = '';

        // 逻辑帧编号
        this.server_frame = 0;

        // 实际前进方向
        this.target_move_angle = 0;

        //折跃运行帧数
        this.warp_run_frame = 0;
        //折跃合计帧数
        this.warp_sum_frame = 0;
        //折跃ING开启帧数
        this.warp_ing_frame = 0;
        //折跃ING结束帧数
        this.warp_hop_frame = 0;

        this.warp_status = common.static.SHIP_WARP_STATUS_NULL;

        // 模块运行帧数
        this.battle_run_frame = 0;
        // 模块合计帧数
        this.battle_sum_frame = 0;
        // 模块ING开启帧数
        this.battle_ing_frame = 0;
        // 模块ING结束帧数
        this.battle_hop_frame = 0;

        this.battle_status = common.static.SHIP_BATTLE_STATUS_NULL;

        // 隐形运行帧数
        this.stealth_run_frame = 0;
        // 隐形合计帧数
        this.stealth_sum_frame = 0;
        // 隐形ING开启帧数
        this.stealth_ing_frame = 0;
        // 隐形ING结束帧数
        this.stealth_hop_frame = 0;

        this.stealth_status = common.static.SHIP_STEALTH_STATUS_NULL;


        this.moving = false;

        //如果是停泊状态这个值不能为0
        this.station_id = 0;
        /**
         * 武器数据
         * @type {Object<number, ShipWeapon>}
         */
        this.weapons = {};

        /**
         * 主动装备
         * @type {Object<number, ShipActive>}
         */
        this.actives = {};

        /**
         * 被动装备
         * @type {Object<number, ShipPassive>}
         */
        this.passives = {};

        //当前最终属性
        this.shield = 0;
        this.armor = 0;
        this.speed = 0;
        this.capacity = 0;

        this.shield_max = 0;
        this.armor_max = 0;
        this.speed_max = 0;
        this.capacity_max = 0;

        this.power = 0;
        this.power_max = 0;
        this.recover = 0;
        this.resume = 0;
        this.charge = 0;
        // this.damage = 0;

        this.shield_electric = 0;
        this.shield_thermal = 0;
        this.shield_explode = 0;
        this.armor_electric = 0;
        this.armor_thermal = 0;
        this.armor_explode = 0;

        this.shield_upper_electric = 0;
        this.shield_upper_thermal = 0;
        this.shield_upper_explode = 0;
        this.armor_upper_electric = 0;
        this.armor_upper_thermal = 0;
        this.armor_upper_explode = 0;

        this.mass = 0;

        this.agile = 0;

        //基础属性
        this.base_shield = 0;
        this.base_armor = 0;
        this.base_speed = 0;
        this.base_capacity = 0;

        this.base_power = 0;
        this.base_recover = 0;
        this.base_charge = 0;
        this.base_damage = 0;

        this.base_shield_electric = 0;
        this.base_shield_thermal = 0;
        this.base_shield_explode = 0;
        this.base_armor_electric = 0;
        this.base_armor_thermal = 0;
        this.base_armor_explode = 0;

        this.base_mass = 0;

        this.base_agile = 0;

        //每6帧受到的伤害
        // this.harm_electric = 0;
        // this.harm_thermal = 0;
        // this.harm_explode = 0;
        //受击标记 上一帧受击即打开此标记 在下一帧结算时处理
        this.harm_status = common.static.HARM_STATUS_NULL;

        //伤害分布 擦 这个6帧缓存比想象的麻烦一点
        //如果盾甲同时掉 先一起结算看看效果好不好
        this.harm_shield = 0;
        this.harm_armor = 0;

        // this.increase_shield = 0;
        // this.increase_armor = 0;
        // this.increase_capacity = 0;

        //舰船的射程为所有武器射程取最大的
        // this.range = 0;
        //最大射程 (面板显示的真实射程)
        this.range_max = 0;

        /**
         * 目标信息
         * @type {ShipTargetPlayer|ShipTargetNpcer}
         */
        this.target_info = null;
        // switch (this.unit_type) {
        //     case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
        //         this.target_info = new ShipTargetPlayer(this);
        //         break;
        //     case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
        //         this.target_info = new ShipTargetNpcer(this);
        //         break;
        // }
        //关系列表
        this.friendly = {};
        this.base_weapon = null;
        this.base_engine = null;

        //TODO 应该有起始时间戳 不然没法做倒计时圈
        //末日武器倒计时 在这期间无法折跃和移动 可以转向
        // this.doomsday_per_heat_frame = 0;

        //舰船计算最大射程修正值
        // this.ship_range_ratio = 0.9;
        //碰撞修正系数
        this.collision_ratio = 0.9;

        //朝向目标和最大距离的系数
        this.base_forward_range_ratio = 2;

        //驻停状态 0正常 1进站中 2离站中 3驻停中 都是在status=run下
        this.berth_status = 0;
        //停靠的剩余帧数
        this.berth_frame = 0;
        //不再处理终点坐标 直接把最大辅助力计算出来填到这里
        // this.auxiliary_max_x = 0;
        // this.auxiliary_max_y = 0;
        //停靠时为空间站坐标 离站时为终点坐标
        this.berth_end_x = 0;
        this.berth_end_y = 0;
        this.berth_station_id = 0;
    }

    setShipType(ship_type) {
        this.ship_type = ship_type;
    }

    /**
     * 基础属性初始化
     */
    initBaseShipInfo() {
        let base_ship_info = this.getBaseShipInfo();
        this.classify = base_ship_info.classify;
        this.category = common.method.getShipCategory(this.classify);
        this.size = common.method.getShipSize(this.category);

        this.base_shield = base_ship_info.shield;
        this.base_armor = base_ship_info.armor;
        this.base_speed = base_ship_info.speed;
        this.base_capacity = base_ship_info.capacity;

        this.base_power = base_ship_info.power;
        this.base_recover = base_ship_info.recover;
        this.base_charge = base_ship_info.charge;
        //玩家舰船是没有damage属性的
        this.base_damage = base_ship_info.damage;
        this.base_resume = base_ship_info.resume;

        this.base_shield_electric = base_ship_info.shield_electric;
        this.base_shield_thermal = base_ship_info.shield_thermal;
        this.base_shield_explode = base_ship_info.shield_explode;
        this.base_armor_electric = base_ship_info.armor_electric;
        this.base_armor_thermal = base_ship_info.armor_thermal;
        this.base_armor_explode = base_ship_info.armor_explode;

        this.radius = base_ship_info.radius;
        this.radius_pow = Math.pow(this.radius, 2);
        this.base_mass = base_ship_info.mass;

        this.base_agile = base_ship_info.agile;

        this.base_weapon = base_ship_info.weapon;
        this.base_engine = base_ship_info.engine;

        switch (this.unit_type) {
            case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                //玩家才有的属性
                this.base_skill = base_ship_info.skill;
                break;
            case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                this.difficult = base_ship_info.difficult;

                this.chase = base_ship_info.chase * this.draw_ratio;
                this.alert = base_ship_info.alert * this.draw_ratio;
                this.assist = base_ship_info.assist * this.draw_ratio;

                this.patrol = base_ship_info.patrol;

                this.is_boss = base_ship_info.is_boss;
                this.force = base_ship_info.force;

                this.score = base_ship_info.score;
                break;
        }

        this.res = base_ship_info.res;

    }

    /**
     * 虚方法
     */
    getBaseShipInfo() {

    }

    updateShipInfo() {
        //设置质量系数
        this.setMassRatio();
        //每帧最大速度
        this.frame_max_speed = Math.floor(this.speed_max / this.base_map_frame);
        //每帧最大转度
        // this.frame_max_rotation = this.mass_ratio ? Math.floor(180 * this.draw_ratio / (this.mass_ratio / this.draw_ratio * this.base_map_frame)) : 0;
        this.frame_max_rotation = Math.floor(this.agile / this.base_map_frame);
    }

    setShield(shield) {
        this.shield = Math.max(0, Math.min(this.shield_max, shield));
    }

    addShield(shield) {
        this.shield = Math.min(this.shield_max, this.shield + shield);
    }

    subShield(shield) {
        this.shield = Math.max(0, this.shield - shield);
    }

    getShield() {
        return this.shield;
    }

    setArmor(armor) {
        this.armor = Math.max(0, Math.min(this.armor_max, armor));
    }

    addArmor(armor) {
        this.armor = Math.min(this.armor_max, this.armor + armor);
    }

    subArmor(armor) {
        this.armor = Math.max(0, this.armor - armor);
    }

    getArmor() {
        return this.armor;
    }

    setCapacity(capacity) {
        this.capacity = Math.max(0, Math.min(this.capacity_max, capacity));
    }

    addCapacity(capacity) {
        this.capacity = Math.min(this.capacity_max, this.capacity + capacity);
    }

    subCapacity(capacity) {
        this.capacity = Math.max(0, this.capacity - capacity);
    }

    getCapacity() {
        return this.capacity;
    }

    setSpeed(speed) {
        this.speed = Math.min(speed, this.speed_max);
    }

    getSpeed() {
        return this.speed;
    }

    setStationId(station_id) {
        this.station_id = station_id;
    }

    getStationId() {
        return this.station_id;
    }

    setPower(power) {
        this.power = power;
    }

    getPower() {
        return this.power;
    }

    addPower(power) {
        this.power = this.getPower() + power;
    }

    setMass(mass) {
        this.mass = mass;
    }

    getMass() {
        return this.mass;
    }

    addMass(mass) {
        this.mass = this.getMass() + mass;
    }

    /**
     * 检测碰撞
     * @param unit_info
     */
    checkUnitCollision(unit_info) {
        let distance = common.func.getDistance(this.x, this.y, unit_info.x, unit_info.y);
        //发生碰撞
        if (distance < (this.radius + unit_info.radius) * this.draw_ratio * this.collision_ratio) {
            //需要根据质量进行碰撞比例计算
            let collision_distance = (this.radius + unit_info.radius) * this.draw_ratio * this.collision_ratio - distance;
            let angle = common.func.getAngle(this.x, this.y, unit_info.x, unit_info.y);

            if (unit_info.mass_ratio) {
                //算出目标质量比
                let unit_mass_proportion = unit_info.mass_ratio / (unit_info.mass_ratio + this.mass_ratio);
                let collision_point = common.func.anglePoint(0, 0, angle, collision_distance * unit_mass_proportion);
                //先算我的 然后对方按照我的 按照质量比取反
                unit_info.collision_point.x += collision_point.x;
                unit_info.collision_point.y += collision_point.y;

                //算出目标和我的质量比
                let mass_proportion = this.mass_ratio / unit_info.mass_ratio;

                this.collision_point.x -= Math.round(collision_point.x * mass_proportion);
                this.collision_point.y -= Math.round(collision_point.y * mass_proportion);
            } else {
                //建筑是没有质量的 可以理解为 质量无限大
                let collision_point = common.func.anglePoint(0, 0, angle, collision_distance);

                this.collision_point.x -= collision_point.x;
                this.collision_point.y -= collision_point.y;
            }
        }
    }

    useCollision() {
        if (this.collision_point.x > 0) {
            this.collision_point.x = Math.floor(this.collision_point.x / 2);
        }
        if (this.collision_point.x < 0) {
            this.collision_point.x = Math.ceil(this.collision_point.x / 2);
        }
        if (this.collision_point.y > 0) {
            this.collision_point.y = Math.floor(this.collision_point.y / 2);
        }
        if (this.collision_point.y < 0) {
            this.collision_point.y = Math.ceil(this.collision_point.y / 2);
        }
    }

    /**
     * 消耗电容 并返回是否成功
     * @param ship_item
     * @return {boolean}
     */
    costCapacity(ship_item) {
        return true;
    }

    /**
     * 检测电容是否足够
     * @param ship_item
     * @return {boolean}
     */
    checkCapacity(ship_item) {
        return true;
    }

    /**
     * 检测能量是否足够
     * @param require
     * @return {boolean}
     */
    checkPower(require) {
        return require <= this.power_max - this.power;
    }

    /**
     * 检测装备参数并追加到舰船属性
     * @param item_info
     */
    checkItemParam(item_info) {
        if (item_info.checkOnline()) {
            if (this.checkPower(item_info.require)) {
                this.addPower(item_info.require);
            } else {
                item_info.setItemStatus(common.static.SHIP_ITEM_STATUS_OFFLINE);
            }

            this.addMass(item_info.mass);
        }
    }

    /**
     * 虚方法
     */
    updateShipPlayerProperty() {

    }

    /**
     * 更新舰船最大射程
     * @param range
     */
    updateRange(range) {
        // this.range = Math.max(this.range, range);

        //有在屁股的炮台 导致舰船射程够了 但是子弹射程不够 差了半个身位 把身位扣掉
        range = Math.max(0, range - this.radius * this.draw_ratio);
        this.range_max = Math.max(this.range_max, range);
    }

    /**
     * 设置目标最终期望方向 大坐标
     * @param target_move_angle
     */
    setTargetMoveAngle(target_move_angle) {
        this.target_move_angle = target_move_angle;
    }

    /**
     * 增加受到伤害
     * @param harm_info
     */
    // addFrameHarm(harm_info) {
    //     //大改版 这里直接扣血
    //     // this.calculationOwnerNpcer(ship_unit_type, ship_unit_id, ship_force, item_type);
    //     // ff(this.unit_type, this.unit_id)
    //     // this.harm_electric += harm_electric;
    //     // this.harm_thermal += harm_thermal;
    //     // this.harm_explode += harm_explode;
    // }

    /**
     * 获取装备基础信息 目前为坐标
     * @param slot
     * @return {*}
     */
    getBaseWeaponPos(slot) {
        let pos = common.method.getPosFromSlot(slot);
        return this.base_weapon[pos];
    }

    /**
     * 记录逻辑帧编号 目前用于创建弹药
     * @param server_frame
     * @returns {UnitShipMap|UnitShipPlayer|UnitShipNpcer}
     */
    setServerFrame(server_frame) {
        this.server_frame = server_frame;
        return this;
    }

    /**
     * 设置质量系数
     */
    setMassRatio() {
        this.mass_ratio = common.method.getMassRatio(this.mass);
    }

    /**
     * 设置战斗模式 true游击 false狙击
     * @param {Boolean} fight_model
     */
    // setFightModel(fight_model) {
    //     this.fight_model = fight_model;
    // }

    /**
     * 获取弹药unitId
     * @param slot
     * @param bullet_pos
     */
    getBulletUnitId(slot, bullet_pos) {
        //弹药不能超过几分钟 给他预留5位数 能到4.8个小时 4位的话是30分钟 暂定4位 3位是3分钟
        //bullet_pos从1位调整为2位 server_frame从4调整为3 3分钟足够了 从4调整为3 每秒10帧90秒
        //弹药ID规则 unit_id server_frame unit_type  weapon_pos bullet_pos
        //           N           3           1          1          2
        // return bullet_pos
        //     + common.method.getPosFromSlot(slot) * Math.pow(10, 2)
        //     + this.unit_type * Math.pow(10, 3)
        //     + (this.server_frame % 900) * Math.pow(10, 4)
        //     + this.unit_id * Math.pow(10, 7);
        return {
            'unit_group_id': this.unit_type + this.unit_id * 10,
            'unit_id': bullet_pos + common.method.getPosFromSlot(slot) * 100 + (this.server_frame % 900) * 1000,
        }
    }

    /**
     * 获取最终移动坐标
     */
    // getFinalPoint() {
    //     // let abs_angle = Math.abs(add_angle);
    //     //计算舰船角度和期望角度的角度差
    //     //加力系数50-100 0.5-1
    //     // let speed_ratio = abs_angle < 9000 ? (18000 - abs_angle) / 18000 : 0.5;
    //     // let speed_ratio = 1 - abs_angle / 18000;
    //     //计算出期望移动的距离
    //     //计算出期望移动的力 计算角度和推子
    //     // let speed_ratio = 1;
    //     // this.final_pow_point.x = Math.round(this.pow_point.x * speed_ratio);
    //     // this.final_pow_point.y = Math.round(this.pow_point.y * speed_ratio);
    // }

    /**
     * 舰船前进
     */
    shipForward() {
        // this.getFinalPoint();

        this.addShipSpeed();
    }

    /**
     * 获取前进舰船角度
     * @return {number}
     */
    getForwardRotation() {
        //目标和舰船当前角度差
        if (this.checkForwardInRange()) {
            return common.func.formatRatAngle(this.target_info.getTargetAngle() - this.rotation);
        }
        return this.getMoveRotation();
    }

    /**
     * 获取移动角度
     * @return {number}
     */
    getMoveRotation() {
        return common.func.formatRatAngle(this.target_move_angle - this.rotation);
    }

    shipBerthSettle() {
        if (this.berth_frame) {
            if (this.berth_status === common.static.SHIP_BERTH_STATUS_JOIN) {
                if (this.berth_frame === common.setting.berth_static_frame) {
                    this.shipBerthStart();
                }
                this.berth_frame--;
                if (this.berth_frame === 0) {
                    this.berth_status = common.static.SHIP_BERTH_STATUS_NULL;
                    this.setBerth();
                    this.shipBerthJoin();
                }
            } else if (this.berth_status === common.static.SHIP_BERTH_STATUS_LEAVE) {
                this.berth_frame--;
                if (this.berth_frame === 0) {
                    //TODO 这里为什么没问题
                    this.berth_status = common.static.SHIP_BERTH_STATUS_NULL;
                    this.shipBerthLeave();
                }
            }
            return true;
        }
        return false;
    }

    shipWarpSettle() {
        if (this.warp_run_frame) {
            if (this.warp_run_frame === this.warp_ing_frame) {
                this.warp_status = common.static.SHIP_WARP_STATUS_WARPING;
            }
            this.warp_run_frame--;
            //折跃时固定朝向 降低速度 减少电容 收缩武器
            if (this.warp_run_frame === 0) {
                this.finishWarpAction();
            }
            return true;
        }
        return false;
    }

    /**
     * 处理会战模式动作
     */
    shipBattleSettle() {
        if (this.battle_run_frame) {
            if (this.battle_run_frame === this.battle_ing_frame) {
                this.battle_status = common.static.SHIP_BATTLE_STATUS_BATTLING;
            }
            if (this.battle_run_frame === this.battle_hop_frame) {
                this.battle_status = common.static.SHIP_BATTLE_STATUS_STOP;
            }
            this.battle_run_frame--;
            if (this.battle_run_frame === 0) {
                this.finishBattleAction();
            }
            return true;
        }
        return false;
    }

    /**
     * 隐形结算
     * @returns {boolean}
     */
    shipStealthSettle() {
        if (this.stealth_run_frame) {
            if (this.stealth_run_frame === this.stealth_ing_frame) {
                this.stealth_status = common.static.SHIP_STEALTH_STATUS_STEALTHING;
            }
            if (this.stealth_run_frame === this.stealth_hop_frame) {
                this.stealth_status = common.static.SHIP_STEALTH_STATUS_STOP;
            }
            this.stealth_run_frame--;
            if (this.stealth_run_frame === 0) {
                this.finishStealthAction();
            }
            return true;
        }
        return false;
    }

    /**
     * 虚方法
     */
    shipBerthStart() {
    }

    /**
     * 虚方法
     */
    shipBerthJoin() {
        //最大辅助力清空
        this.auxiliary_point.x = 0;
        this.auxiliary_point.y = 0;
        //移动力清空
        this.move_point.x = 0;
        this.move_point.y = 0;
        //设置坐标为停靠点
        this.setX(this.berth_end_x);
        this.setY(this.berth_end_y);
        this.setStationId(this.berth_station_id);
        //清空停靠点
        this.berth_end_x = 0;
        this.berth_end_y = 0;
        this.berth_station_id = 0;
    }

    /**
     * 虚方法
     */
    shipBerthLeave() {
        this.auxiliary_point.x = 0;
        this.auxiliary_point.y = 0;
        //把辅助力继承给move或者碰撞力
        // this.move_point.x = this.auxiliary_point.x;
        // this.move_point.y = this.auxiliary_point.y;
        // this.auxiliary_point.x = 0;
        // this.auxiliary_point.y = 0;
    }

    /**
     * 停靠移动方式
     */
    shipBerthMove() {
        //先不管bug 不bug 效果不好
        //如果进站中 驻停 离站中 虚拟调整坐标
        //这个方法要放在哪里还没想好
        //理想状态 第1秒 从空间站飞出1-6个小飞机  第2秒 匀速推到 空间站 300像素处 5秒到点 切换视角到 空间站
        //出战 调整船头 为进入的角度转180度 快速切换到300像素处 匀速向外飞到500米处
        if (this.berth_status === common.static.SHIP_BERTH_STATUS_JOIN || this.berth_status === common.static.SHIP_BERTH_STATUS_LEAVE) {
            if (this.berth_frame < common.setting.berth_start_speed_frame) {
                //出站的时候直接使用move_point 带推子特效
                this.move_point.x = Math.round((this.move_point.x + this.auxiliary_point.x) / 2);
                this.move_point.y = Math.round((this.move_point.y + this.auxiliary_point.y) / 2);
            }
        }

        this.updateSpeed();
    }

    /**
     * 舰船停止
     */
    shipStop() {
        // if (this.move_rotation) {
        //     this.subShipRotation();
        // }
        // 停船 惯性计算
        if (this.move_point.x || this.move_point.y) {
            // 如果当前力距离期望力小于每次改变(6帧)增加的值 则赋值 否则增加改变的力
            this.subShipSpeed();
        }
    }

    /**
     * 舰船停船到指定角度
     */
    shipStopTargetAngle() {
        this.addShipRotation(this.getMoveRotation());
        // 停船 惯性计算
        if (this.move_point.x || this.move_point.y) {
            // 如果当前力距离期望力小于每次改变(6帧)增加的值 则赋值 否则增加改变的力
            this.subShipSpeed();
        }
    }

    /**
     * 检测当前目标是否处于完全隐形中
     */
    checkStealthIng() {
        return this.stealth_status === common.static.SHIP_STEALTH_STATUS_STEALTHING;
    }

    /**
     * 舰船加速
     */
    addShipSpeed() {
        this.pow_point.x && (this.move_point.x = Math.round((this.move_point.x + this.pow_point.x) / 2));
        this.pow_point.y && (this.move_point.y = Math.round((this.move_point.y + this.pow_point.y) / 2));

        Math.abs(this.move_point.x) < 5 && (this.move_point.x = 0);
        Math.abs(this.move_point.y) < 5 && (this.move_point.y = 0);

        this.updateSpeed();
    }

    /**
     * 舰船减速
     */
    subShipSpeed() {
        this.move_point.x && (this.move_point.x = (Math.abs(this.move_point.x) < this.base_server_frame ? 0 : Math.round(this.move_point.x / 1.2)));
        this.move_point.y && (this.move_point.y = (Math.abs(this.move_point.y) < this.base_server_frame ? 0 : Math.round(this.move_point.y / 1.2)));

        this.updateSpeed();
    }

    /**
     * 更新速度
     */
    updateSpeed() {
        //每0.033帧移动的距离
        let frame_speed = common.func.getDistance(0, 0, this.move_point.x + this.collision_point.x, this.move_point.y + this.collision_point.y);
        this.setSpeed(Math.ceil(frame_speed * this.base_map_frame));

        this.moving = !!(frame_speed);
    }

    /**
     * 增加舰船转向速度
     * @param add_angle
     */
    addShipRotation(add_angle) {
        //这里的角度是总计的 大约12次这个方法 就总36000到静止了 1秒多点
        if (Math.abs(add_angle) < 10) {
            this.move_rotation = 0;
            this.rotation = common.func.formatAngle(this.rotation + add_angle);
        } else {
            if (add_angle > 0) {
                this.move_rotation = Math.round((this.move_rotation + this.frame_max_rotation) / 2);
                this.move_rotation = Math.min(this.move_rotation, this.frame_max_rotation, Math.floor(add_angle / this.base_run_frame));
            } else {
                this.move_rotation = Math.round((this.move_rotation - this.frame_max_rotation) / 2);
                this.move_rotation = Math.max(this.move_rotation, -this.frame_max_rotation, Math.ceil(add_angle / this.base_run_frame));
            }
        }
    }

    /**
     * 角度减少
     */
    subShipRotation() {
        //这里的角度增量的 0.033秒 折合每秒增量2.97度就不动了
        if (Math.abs(this.move_rotation) < 10) {
            this.move_rotation = 0;
        } else {
            this.move_rotation = Math.round(this.move_rotation / 2);
        }
    }

    /**
     * 获取折跃状态
     * @returns {boolean}
     */
    getIsWarpStatus() {
        return !!this.warp_status;
    }

    /**
     * 获取模块状态
     * @return {boolean}
     */
    getIsBattleStatus() {
        return !!this.battle_status;
    }

    getIsBerthStatus() {
        return !!this.berth_status;
    }

    getIsStealthStatus() {
        return !!this.stealth_status;
    }

    /**
     * 获取能开火的模块状态
     * @return {boolean}
     */
    getBattleAttackStatus() {
        return this.battle_status === common.static.SHIP_BATTLE_STATUS_NULL || this.battle_status === common.static.SHIP_BATTLE_STATUS_BATTLING;
    }

    shipIncrement() {
        // this.initIncrement();

        this.shipRecovery();
        //受伤放到最后
        this.shipHarmSettle();
    }

    /**
     * 初始化增量
     */
    // initIncrement() {
    //     this.harm_shield = 0;
    //     this.harm_armor = 0;
    //
    //     // this.increase_shield = 0;
    //     // this.increase_armor = 0;
    //     // this.increase_capacity = 0;
    // }

    /**
     * 舰船恢复
     */
    shipRecovery() {
        // this.increase_shield = Math.min(this.recover, this.shield_max - this.getShield());
        // this.increase_armor = Math.min(this.resume, this.armor_max - this.getArmor());
        // this.increase_capacity = Math.min(this.charge, this.capacity_max - this.getCapacity());

        if (this.recover) {
            this.addShield(this.getNaturalRecovery(this.recover, this.shield, this.shield_max));
        }
        if (this.resume) {
            this.addArmor(this.getNaturalRecovery(this.resume, this.armor, this.armor_max));
        }
        if (this.charge) {
            this.addCapacity(this.getNaturalRecovery(this.charge, this.capacity, this.capacity_max));
        }
    }

    /**
     * 获取自然回充量
     */
    getNaturalRecovery(add, now, max) {
        //25%峰值 最低1/25
        let capacity_per = Math.floor(now / max * 10000);
        if (capacity_per > 9700 || capacity_per < 100) {
            return Math.floor(add / 25);
        } else if (capacity_per > 2500) {
            return Math.floor(add * (10000 - capacity_per) / 7500);
        } else {
            return Math.floor(add * capacity_per / 2500);
        }
    }

    /**
     * 处理舰船受到的伤害
     */
    shipHarmSettle() {
        if (this.checkFrameHarm()) {
            this.initFrameHarm();

            this.shipHarmSettleDo();
        }
    }

    /**
     * 虚方法
     */
    shipHarmSettleDo() {
        //这时候 已经判断过受伤了
        if (this.stealth_status === common.static.SHIP_STEALTH_STATUS_START) {
            //TODO 只要受到伤害 就重置隐身状态
            this.stealth_run_frame = this.stealth_sum_frame;
        }
    }

    /**
     * 处理舰船受到的伤害
     * @param {HarmInfo} harm_info
     */
    shipHarm(harm_info) {
        this.harm_status = common.static.HARM_STATUS_HARM;

        let armor_harm_per = this.harmShield(harm_info);
        let death_status = false;
        if (armor_harm_per) {
            death_status = this.harmArmor(armor_harm_per, harm_info);
        }

        this.accumulativeHarmHandle(harm_info);
        // 如果死亡了
        if (death_status) {
            //增加经验
            this.addRewardNpcer();
            //处理残骸
            this.shipWreckageHandle();

            this.shipKillMailHandle();
        }
    }

    /**
     * 虚方法
     */
    addRewardNpcer() {
    }

    /**
     * 虚方法
     */
    accumulativeHarmHandle() {
    }

    /**
     * 虚方法 击杀邮件处理
     */
    shipKillMailHandle() {
        //TODO 这个方法只有玩家有
        // ff('生成km邮件时累计信息', this.harm_accumulatives)
    }

    /**
     * 虚方法
     */
    shipWreckageHandle() {
    }

    /**
     * 检测当前是否承受了伤害
     * @returns {boolean}
     */
    checkFrameHarm() {
        return this.harm_status === common.static.HARM_STATUS_HARM;
    }

    /**
     * 重置受到伤害
     */
    initFrameHarm() {
        this.harm_status = common.static.HARM_STATUS_NULL;
    }

    /**
     * 扣减护盾并返回剩余伤害的百分比
     * @param {HarmInfo} harm_info
     * @returns {number}
     */
    harmShield(harm_info) {
        //当前承受伤害计算护盾抗性后可产生多少伤害
        this.harm_shield = Math.floor(
            harm_info.harm_electric * (1 - Math.max(0, this.shield_electric - harm_info.penetration_electric) / 10000)
            + harm_info.harm_thermal * (1 - Math.max(0, this.shield_thermal - harm_info.penetration_thermal) / 10000)
            + harm_info.harm_explode * (1 - Math.max(0, this.shield_explode - harm_info.penetration_explode) / 10000));
        //如果打掉护盾
        if (this.harm_shield) {
            //如果-减少的量高于当前护盾
            if (this.harm_shield < this.getShield()) {
                //如果未击穿护盾
                this.subShield(this.harm_shield);
            } else {
                //如果击穿护盾
                //计算装甲还应承受伤害的百分比
                let armor_harm_per = Math.floor((1 - this.getShield() / this.harm_shield) * 100);
                this.harm_shield = this.getShield();
                this.setShield(0);
                return armor_harm_per;
            }
        }
        return 0;
    }


    /**
     * 扣减装甲
     * @param armor_harm_per
     * @param {HarmInfo} harm_info
     * @returns {boolean}
     */
    harmArmor(armor_harm_per, harm_info) {
        //当前剩余承受伤害计算装甲抗性后可产生多少伤害
        this.harm_armor = Math.floor(
            (harm_info.harm_electric * (1 - Math.max(0, this.armor_electric - harm_info.penetration_electric) / 10000)
                + harm_info.harm_thermal * (1 - Math.max(0, this.armor_thermal - harm_info.penetration_thermal) / 10000)
                + harm_info.harm_explode * (1 - Math.max(0, this.armor_explode - harm_info.penetration_explode) / 10000))
            * armor_harm_per / 100);
        if (this.harm_armor) {
            if (this.harm_armor < this.armor) {
                //未击穿装甲
                this.subArmor(this.harm_armor);
            } else {
                //击穿装甲
                this.harm_armor = this.getArmor();
                this.setArmor(0);
                //设置开始爆炸
                this.beginBoom();
                return true;
            }
        }
        return false;
    }

    /**
     * 舰船爆炸
     */
    beginBoom() {
        //这里仍然需要播放掉血 下一个服务帧再执行死亡
        // this.setDeath();

        //TODO 玩家死亡记得释放 折跃状态 模块状态 末日状态等等 回头做
        ff('舰船死亡', this.unit_type, this.ship_type, this.unit_id, this.server_frame);
    }

    shipDefense() {
        if (this.getRun()) {
            this.setFilter((ship_active) => {
                return ship_active.checkActive()
            }).eachShipActive((ship_active) => {
                ship_active.activeDefense();
            }, this)
        }
    }

    shipAttack() {
        let attack_status = false;
        if (this.getRun()) {
            //调整为只要进入最大射程则所有炮开火 如果不在最大射程把弹药打完
            let fire_in_range = this.checkFireInRange();
            //如果在范围内 获取目标和舰船的角度
            let add_angle = fire_in_range ? common.func.formatRatAngle(this.target_info.getTargetAngle() - this.rotation) : 0;
            this.setFilter((ship_weapon) => {
                //激活状态或者末日武器在准备和进攻中
                return ship_weapon.checkActive();
            }).eachShipWeapon((ship_weapon) => {
                //如果在射程内并且激活了 则强制开火
                let weapon_attack_status = ship_weapon.weaponAttack(add_angle, fire_in_range && ship_weapon.checkActive());
                attack_status || (attack_status = weapon_attack_status);
            }, this);
        }
        return attack_status
    }

    shipDisAttack() {
        this.setFilter((ship_weapon) => {
            return ship_weapon.checkActive()
        }).eachShipWeapon((ship_weapon) => {
            // let weapon_point = ship_weapon.getWeaponPoint();
            // ship_weapon.subWeaponRotation();
            //使用多重打击次数
            ship_weapon.useMultipleCount();
        }, this);
    }

    /**
     * 检测是否在武器射程内
     * @return {boolean}
     */
    checkFireInRange() {
        return this.target_info.checkTargetInfoInRange();
    }

    /**
     * 检测是否应该朝向目标
     */
    checkForwardInRange() {
        return this.target_info.checkTargetInfoInRange(this.base_forward_range_ratio);
    }

    /**
     * @param slot
     * @param main_classify
     * @return {ShipPassive|null|ShipActive|ShipWeapon}
     */
    getShipItem(slot, main_classify = 0) {
        main_classify || (main_classify = common.method.getMainClassifyFromSlot(slot));
        switch (main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return this.getShipWeapon(slot);
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                return this.getShipActive(slot);
            case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                return this.getShipPassive(slot);
        }
        return null;
    }

    /**
     * 添加武器到列表
     * @param {ShipWeapon} ship_weapon
     */
    addShipWeapon(ship_weapon) {
        this.weapons[ship_weapon.slot] = ship_weapon;
    }

    /**
     * 移除武器信息 如果允许太空换装的话 这个方法才存在
     * @param {ShipWeapon} ship_weapon
     */
    delShipWeapon(ship_weapon) {
        delete this.weapons[ship_weapon.slot];
    }

    /**
     * 获取武器信息
     * @param slot
     * @return {ShipWeapon}
     */
    getShipWeapon(slot) {
        return this.weapons[slot];
    }

    /**
     * @param {callbackShipWeapon} callback
     * @param thisObj
     */
    eachShipWeapon(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.weapons, callback, thisObj);
        this.setFilter();
    }

    /**
     * 添加武器到列表
     * @param {ShipActive} ship_active
     */
    addShipActive(ship_active) {
        this.actives[ship_active.slot] = ship_active;
    }

    /**
     * 移除武器信息 如果允许太空换装的话 这个方法才存在
     * @param {ShipActive} ship_active
     */
    delShipActive(ship_active) {
        delete this.actives[ship_active.slot];
    }

    /**
     * 获取主动装备
     * @param slot
     * @return {ShipActive}
     */
    getShipActive(slot) {
        return this.actives[slot];
    }

    /**
     * @param {callbackShipActive} callback
     * @param thisObj
     */
    eachShipActive(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.actives, callback, thisObj);
        this.setFilter();
    }

    /**
     * 添加武器到列表
     * @param {ShipPassive} ship_passive
     */
    addShipPassive(ship_passive) {
        this.passives[ship_passive.slot] = ship_passive;
    }

    /**
     * 移除武器信息 如果允许太空换装的话 这个方法才存在
     * @param {ShipPassive} ship_passive
     */
    delShipPassive(ship_passive) {
        delete this.passives[ship_passive.slot];
    }

    /**
     * 获取被动装备
     * @param slot
     * @return {ShipPassive}
     */
    getShipPassive(slot) {
        return this.passives[slot];
    }

    /**
     *
     * @param {callbackShipPassive} callback
     * @param thisObj
     */
    eachShipPassive(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.passives, callback, thisObj);
        this.setFilter();
    }

    /**
     * 处理帧
     */
    shipMove() {
        //如果有玩家控制的力量 则执行移动
        if (this.move_rotation) {
            this.rotation = common.func.formatAngle(this.rotation + this.move_rotation);
        }
        if (this.move_point.x || this.collision_point.x) {
            this.x += this.move_point.x + this.collision_point.x;
        }
        if (this.move_point.y || this.collision_point.y) {
            this.y += this.move_point.y + this.collision_point.y;
        }

        // this.eachShipWeaponOnline((ship_weapon) => {
        //     ship_weapon.weaponMove();
        // }, this);
    }

    /**
     * 完成折跃
     */
    finishWarpAction() {
        //折跃开始时间
        this.warp_run_frame = 0;
        //折跃结束时间
        this.warp_sum_frame = 0;
        //折跃启动结束时间
        this.warp_ing_frame = 0;
        //折跃跳跃时间
        this.warp_hop_frame = 0;
        this.warp_status = common.static.SHIP_WARP_STATUS_NULL;
    }

    /**
     * 完成模块
     */
    finishBattleAction() {
        //模块开始时间
        this.battle_run_frame = 0;
        //模块结束时间
        this.battle_sum_frame = 0;
        //模块启动结束时间
        this.battle_ing_frame = 0;
        //模块跳跃时间
        this.battle_hop_frame = 0;
        this.battle_status = common.static.SHIP_BATTLE_STATUS_NULL;
    }

    /**
     * 完成模块
     */
    finishStealthAction() {
        //模块开始时间
        this.stealth_run_frame = 0;
        //模块结束时间
        this.stealth_sum_frame = 0;
        //模块启动结束时间
        this.stealth_ing_frame = 0;
        //模块跳跃时间
        this.stealth_hop_frame = 0;
        this.stealth_status = common.static.SHIP_STEALTH_STATUS_NULL;
    }

    /**
     * 开始会战模式
     * @param hop_frame 产生的模块的需要的总时间
     */
    beginBattleAction(hop_frame) {
        //hop_frame是产生的CD 其中前摇在这个时间内 后摇不在这个时间内

        //至少产生 静态时间 即结束需要的时间
        hop_frame = Math.max(hop_frame, this.battle_static_frame);
        //如果产生时间 超过了运行时间-开始-结束时间 刷新模块
        if (hop_frame > this.battle_run_frame - this.battle_static_frame * 2) {
            switch (this.battle_status) {
                case common.static.SHIP_BATTLE_STATUS_STOP:
                    //如果我正处于结束阶段 则 剩余时间=产生时间+开始+结束-剩余时间
                    this.battle_run_frame = hop_frame + this.battle_static_frame * 2 - this.battle_run_frame;
                    break;
                case common.static.SHIP_BATTLE_STATUS_BATTLING:
                    //如果我在模块中 剩余时间=产生时间+结束时间
                    this.battle_run_frame = hop_frame + this.battle_static_frame;
                    break;
                case common.static.SHIP_BATTLE_STATUS_START:
                    //如果我在开始过程中 剩余时间=产生时间+结束+开始-用掉的时间
                    this.battle_run_frame = hop_frame + this.battle_static_frame * 2 - (this.battle_sum_frame - this.battle_run_frame);
                    break;
                case common.static.SHIP_BATTLE_STATUS_NULL:
                    //如果我没开过模块 剩余时间=产生时间+开始+结束
                    this.battle_run_frame = hop_frame + this.battle_static_frame * 2;
                    break;
            }

            //模块ing开始时间 = 产生时间 + 开始时间
            this.battle_ing_frame = hop_frame + this.battle_static_frame;
            //
            this.battle_hop_frame = this.battle_static_frame;
            //模块合计时间为模块CD+一前一后2个静态时间
            this.battle_sum_frame = hop_frame + this.battle_static_frame * 2;

            //如果刚好在结束的第一帧 则直接进入模块ing模式
            //TODO 这块感觉有问题 到时候测测吧 这块换成新方法以后应该是run_time == ing_frame
            // if (this.server_frame === this.battle_ing_frame) {
            //     this.battle_status = common.static.SHIP_BATTLE_STATUS_BATTLING;
            // } else {
            //     this.battle_status = common.static.SHIP_BATTLE_STATUS_START;
            // }

            if (this.battle_run_frame === this.battle_ing_frame) {
                this.battle_status = common.static.SHIP_BATTLE_STATUS_BATTLING;
            } else {
                this.battle_status = common.static.SHIP_BATTLE_STATUS_START;
            }
        }
    }

    /**
     * 开始隐形
     */
    beginStealthAction() {
        let stealth_sum = Math.ceil(Math.sqrt(this.mass_ratio / 10) * this.base_server_frame);

        //折跃运行帧数 30--
        this.stealth_run_frame = stealth_sum;
        //折跃合计时间 30
        this.stealth_sum_frame = stealth_sum;
        //启动结束时间为整体折跃时间的2/3 20
        this.stealth_ing_frame = Math.floor(stealth_sum / 3 * 2);
        //折跃跳跃时间为整体折跃时间的1/3 10
        this.stealth_hop_frame = Math.floor(stealth_sum / 3);

        this.stealth_status = common.static.SHIP_STEALTH_STATUS_START;
    }
}

module.exports = UnitShipMap;

