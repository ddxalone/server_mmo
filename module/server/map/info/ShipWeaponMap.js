const ShipItem = require("./ShipItem");
const ItemProperties = require("./ItemProperties");
const BulletExtras = require("./BulletExtras");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {ShipWeaponMap}
 * @extends {ShipItem}
 */
class ShipWeaponMap extends ShipItem {
    constructor() {
        super(common.static.ITEM_MAIN_CLASSIFY_WEAPON);

        this.battle_static_frame = common.setting.battle_static_frame;
        this.doomsday_battle_frame = common.setting.doomsday_battle_frame;

        /**
         * @type {BulletExtras}
         */
        this.bullet_extras = null;

        // this.slot = 0;
        // this.weapon_pos = 0;

        this.x = 0;
        this.y = 0;
        // this.rotation = 0;

        //实际运行参数
        this.range = 0;
        this.scatter = 0;
        this.space = 0;
        this.blast = 0;
        this.sustain = 0;
        this.count = 0;
        this.multiple = 0;
        this.radius = 0;
        this.damage_electric = 0;
        this.damage_thermal = 0;
        this.damage_explode = 0;
        // this.damage = 0;
        this.fire_rate = 0;
        this.require = 0;
        this.cost = 0;

        this.agile = 0;
        this.velocity = 0;
        this.accelerate = 0;

        this.barrage = 0;
        this.penetration_electric = 0;
        this.penetration_thermal = 0;
        this.penetration_explode = 0;

        this.chain = 0;
        this.through = 0;

        this.overload_per = 0;
        this.overhang_per = 0;

        //装备基础参数
        this.base_range = 0;
        this.base_angle = 0;
        this.base_scatter = 0;
        this.base_space = 0;
        this.base_blast = 0;
        this.base_sustain = 0;
        this.base_count = 0;
        this.base_multiple = 0;
        this.base_damage_electric = 0;
        this.base_damage_thermal = 0;
        this.base_damage_explode = 0;
        // this.base_damage = 0;
        this.base_fire_rate = 0;
        this.base_require = 0;
        this.base_cost = 0;
        this.base_mass = 0;

        this.base_agile = 0;
        this.base_velocity = 0;
        this.base_accelerate = 0;

        this.suit_type = 0;
        this.res = '';
        this.base_attribute = {};
        this.base_extra = {};

        // 正在进行的转速
        // this.move_rotation = 0;
        //武器相对舰船的距离
        this.weapon_distance = 0;
        //武器相对舰船的角度
        this.weapon_angle = 0;
        /**
         * @type {ShipTarget}
         */
        this.target_info = null;

        // this.server_frame = 0;

        //本次激活
        this.start_fire_frame = 0;
        //下一次可攻击的帧数
        this.next_fire_frame = 0;
        //剩余多重打击次数
        this.surplus_multiple = 0;
        //剩余发射弹药数量
        this.surplus_count = 0;

        //末日和模块用一样的特效 那就是说舰船那块要用统一的模型计时器参数 玩家的动作10秒播完 或者也采用折跃的2/3的机制等等 不行模块的时候是要开炮的
        //就是说模块的开启的时候 不能开火 末日没问题 开模块的时候其他武器呢? 还有末日武器不应该吃 模块的加成 不然

        //激活末日武器 会给舰船附加模块状态 末日武器本身也会生成各自的状态 因为可能可以安装多个
        //暂定 模块启动时间是5秒(因为这期间不能开炮)  武器的CD是30秒  35秒-1分钟 要算上摆模型的5秒-10秒 内无法折跃 5分钟内无法停靠
        //末日武器除了CD外需要增加一个武器开火时间 初步计划是2秒 不然无法判断是开火前还是已经开火了 还是不对
        // this.base_doomsday_attack_frame = 50;

        //末日武器预热开始时间
        this.doomsday_pre_heat_start_frame = 0;
        //末日武器预热结束时间
        this.doomsday_pre_heat_end_frame = 0;
        // this.doomsday_hop = 0;
        // this.doomsday_sum = 0;
        this.doomsday_status = 0;
    }

    // setWeaponPos(weapon_pos) {
    //     this.weapon_pos = weapon_pos;
    // }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    /**
     * 给武器设置舰船的目标类
     * @param target_info
     * @return {ShipWeaponMap}
     */
    setTargetInfo(target_info) {
        this.target_info = target_info;
        return this;
    }

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
        this.initItemWeaponAttribute();
        this.initBulletExtras();
    }

    /**
     * 虚方法
     */
    getBaseItemInfo() {

    }

    /**
     * 获取基础数据
     */
    initBaseWeaponInfo() {
        let base_item_info = this.getBaseItemInfo();
        this.classify = base_item_info.classify;
        this.quality = base_item_info.quality;

        this.base_range = base_item_info.range;
        this.base_angle = base_item_info.angle;
        this.base_scatter = base_item_info.scatter;
        this.base_space = base_item_info.space;
        this.base_blast = base_item_info.blast;
        this.base_sustain = base_item_info.sustain;
        this.base_count = base_item_info.count;
        this.base_multiple = base_item_info.multiple;

        this.base_velocity = base_item_info.velocity;
        this.base_agile = base_item_info.agile;
        this.base_accelerate = base_item_info.accelerate;
        this.base_damage_electric = base_item_info.damage_electric;
        this.base_damage_thermal = base_item_info.damage_thermal;
        this.base_damage_explode = base_item_info.damage_explode;
        // this.base_damage = base_item_info.damage;
        this.base_fire_rate = base_item_info.fire_rate;
        this.base_require = base_item_info.require;
        this.base_cost = base_item_info.cost;
        this.base_mass = base_item_info.mass;
        this.base_radius = base_item_info.radius;

        this.suit_type = base_item_info.suit_type;
        this.res = base_item_info.res;
        this.base_attribute = base_item_info.attribute;
        this.base_extra = base_item_info.extra;

        this.barrage = base_item_info.barrage;
    }

    /**
     * 初始化装备属性
     */
    initItemWeaponAttribute() {
        if (this.base_ship.unit_type === common.static.MAP_UNIT_TYPE_SHIP_PLAYER) {
            //读取装备attribute
            this.base_item_properties = new ItemProperties()
                .initProperty(this.base_attribute);
        }
    }

    initBulletExtras() {
        this.bullet_extras = new BulletExtras(common.static.WEAPON_EXTRA_TYPE_CREATE)
            .setExtra(this.base_extra)
            .setBaseWeapon(this);
    }

    initWeaponAttributes() {
        this.item_attribute.initAttr();
    }

    /**
     * 更新装备最终属性
     */
    updateWeaponProperty() {
        if (this.base_ship.unit_type === common.static.MAP_UNIT_TYPE_SHIP_PLAYER) {
            this.range = this.calculateWeaponRangeProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_range, 'range');
            this.angle = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_angle, 'angle');
            this.scatter = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_scatter, 'scatter');
            this.space = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_space, 'space');
            this.blast = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_blast, 'blast');
            this.sustain = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_sustain, 'sustain');
            this.count = this.calculateWeaponProperty(common.static.RATIO_TYPE_NORMAL, this.base_count, 'count');
            this.multiple = this.calculateWeaponProperty(common.static.RATIO_TYPE_NORMAL, this.base_multiple, 'multiple');
            //伤害规则变更
            this.damage_electric = this.calculateWeaponDamageProperty(this.base_damage_electric, 'damage', 'damage_electric');
            this.damage_thermal = this.calculateWeaponDamageProperty(this.base_damage_thermal, 'damage', 'damage_thermal');
            this.damage_explode = this.calculateWeaponDamageProperty(this.base_damage_explode, 'damage', 'damage_explode');
            //武器不存在无CD的情况
            this.fire_rate = this.calculateWeaponProperty(common.static.RATIO_TYPE_SERVER_FRAME, this.base_fire_rate, 'fire_rate');
            this.require = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_require, 'require');
            this.cost = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_cost, 'cost');
            this.mass = this.calculateWeaponProperty(common.static.RATIO_TYPE_DRAW_RATIO, this.base_mass, 'mass');
            this.penetration_electric = this.calculateWeaponPenetrationProperty('penetration', 'penetration_electric');
            this.penetration_thermal = this.calculateWeaponPenetrationProperty('penetration', 'penetration_thermal');
            this.penetration_explode = this.calculateWeaponPenetrationProperty('penetration', 'penetration_explode');

            this.chain = this.calculateWeaponProperty(common.static.RATIO_TYPE_NORMAL, 0, 'chain');
            this.through = this.calculateWeaponProperty(common.static.RATIO_TYPE_NORMAL, 0, 'through');

            //获取超距伤害 过载伤害
            this.overload_per = this.calculateWeaponPerProperty('overload');
            this.overhang_per = this.calculateWeaponPerProperty('overhang');

        } else {
            this.range = this.base_range * this.draw_ratio;
            this.angle = this.base_angle * this.draw_ratio;
            this.scatter = this.base_scatter * this.draw_ratio;
            this.space = this.base_space * this.draw_ratio;
            this.blast = this.base_blast * this.draw_ratio;
            this.sustain = this.base_sustain * this.draw_ratio;
            this.count = this.base_count;
            this.multiple = this.base_multiple;
            this.damage_electric = this.calculateWeaponDamageRatio(this.base_damage_electric * this.draw_ratio);
            this.damage_thermal = this.calculateWeaponDamageRatio(this.base_damage_thermal * this.draw_ratio);
            this.damage_explode = this.calculateWeaponDamageRatio(this.base_damage_explode * this.draw_ratio);
            this.fire_rate = Math.floor(this.base_fire_rate * this.base_server_frame / this.draw_ratio);
            this.require = this.base_require * this.draw_ratio;
            this.cost = this.base_cost * this.draw_ratio;
            this.mass = this.base_mass * this.draw_ratio;
        }

        this.agile = this.base_agile * this.draw_ratio;
        this.velocity = this.base_velocity * this.draw_ratio;
        this.accelerate = this.base_accelerate * this.draw_ratio;
        this.radius = this.base_radius;

        this.updateShipRange();

        //这里要计算出武器的距离 未来直接用角度+舰船角度 即可算出舰船的global坐标 用于创建弹幕和计算角度
        //武器的距离
        this.weapon_distance = Math.floor(common.func.getDistance(10000, 10000, this.x, this.y) * (this.base_ship.radius / this.draw_ratio));
        //武器的角度
        this.weapon_angle = common.func.getAngle(10000, 10000, this.x, this.y);

        //每帧最大转速
        // this.frame_max_rotation = Math.floor(this.angle / this.base_map_frame);

        //调整散射角度 count后 需要更新extras的参数
        this.bullet_extras.updateExtras()
    }

    updateShipRange() {
        if (this.item_status !== common.static.SHIP_ITEM_STATUS_OFFLINE) {
            this.base_ship.updateRange(this.range);
        }
    }

    /**
     * 计算伤害穿透的数值
     * @param mold
     * @param property
     * @return {number}
     */
    calculateWeaponPenetrationProperty(mold, property) {
        return common.method.calculateShipProperty(
            common.static.RATIO_TYPE_DRAW_RATIO,
            0,
            this.calculateWeaponPenetrationAttrProperty(mold, property),
            this.calculateWeaponSkillProperty(property)
        );
    }

    /**
     * 获取伤害穿透的数值
     * @param mold
     * @param property
     * @return {*}
     */
    calculateWeaponPenetrationAttrProperty(mold, property) {
        return this.calculateWeaponAttrProperty(property)
            + this.calculateWeaponAttrProperty(mold + '_almighty');
    }

    /**
     * 计算装备最终值
     * @param ratio_type
     * @param base
     * @param property
     * @return {number}
     */
    calculateWeaponProperty(ratio_type, base, property) {
        return common.method.calculateShipProperty(
            ratio_type,
            base,
            this.calculateWeaponAttrProperty(property),
            this.calculateWeaponSkillProperty(property),
            this.calculateWeaponAttrProperty(property + '_per'),
            this.calculateWeaponSkillProperty(property + '_per')
        );
    }

    /**
     * 计算百分比加成值 没有基础值 简单的加法 装备百分比+技能百分比
     * @param property
     */
    calculateWeaponPerProperty(property) {
        return this.calculateWeaponAttrProperty(property + '_per') + this.calculateWeaponSkillProperty(property + '_per')
    }

    /**
     * 计算装备最终值武器伤害
     * @param base
     * @param property
     * @param property_almighty
     * @return {number}
     */
    calculateWeaponDamageProperty(base, property, property_almighty) {
        let weapon_classify_property = this.getWeaponDamageClassifyPropertyString(property);
        return this.calculateWeaponDamageRatio(
            common.method.calculateShipProperty(
                common.static.RATIO_TYPE_DRAW_RATIO,
                base,
                this.calculateWeaponAttrProperty(property) + this.calculateWeaponAttrProperty(property_almighty) + this.calculateWeaponAttrProperty(weapon_classify_property),
                this.calculateWeaponSkillProperty(property),
                this.calculateWeaponAttrProperty(property + '_per') + this.calculateWeaponAttrProperty(property_almighty + '_per') + this.calculateWeaponAttrProperty(weapon_classify_property + '_per'),
                this.calculateWeaponSkillProperty(property + '_per')
            ));
    }

    /**
     * 计算武器范围最终值
     * @param ratio_type
     * @param base
     * @param property
     * @return {number}
     */
    calculateWeaponRangeProperty(ratio_type, base, property) {
        let weapon_classify_property = this.getWeaponDamageClassifyPropertyString(property);
        return this.calculateWeaponDamageRatio(
            common.method.calculateShipProperty(
                ratio_type,
                base,
                this.calculateWeaponAttrProperty(property) + this.calculateWeaponAttrProperty(weapon_classify_property),
                this.calculateWeaponSkillProperty(property),
                this.calculateWeaponAttrProperty(property + '_per') + this.calculateWeaponAttrProperty(weapon_classify_property + '_per'),
                this.calculateWeaponSkillProperty(property + '_per')
            ));
    }

    /**
     * 获取武器分类加成属性名称
     * @return {string}
     */
    getWeaponDamageClassifyPropertyString(property) {
        switch (this.classify) {
            case common.static.ITEM_CLASSIFY_AMMO:
                return property + '_ammo';
            case common.static.ITEM_CLASSIFY_GUIDE:
                return property + '_guide';
            case common.static.ITEM_CLASSIFY_LASER:
                return property + '_laser';
        }
    }

    /**
     * 计算伤害和额外伤害的加成 武器最终伤害=武器加成后伤害*武器伤害系数*舰船伤害加成系数
     * @param damage
     * @return {number}
     */
    calculateWeaponDamageRatio(damage) {
        return Math.floor(damage * this.base_ship.base_damage);
    }

    /**
     * 计算装备属性加成
     * @param property
     * @return {*}
     */
    calculateWeaponAttrProperty(property) {
        return this.item_attribute.getAttr(property) +
            this.base_ship.ship_attributes.getAttr('weapon_' + property) +
            this.base_ship.ship_attributes.getAttr('global_' + property);
    }

    /**
     * 计算技能加成的数值
     */
    calculateWeaponSkillProperty(property) {
        let skill_property = 'weapon_' + property;
        // 武器伤害和范围是分武器类型的 其他属性不分
        // 技能里 不支持所有伤害 所有抗性穿透
        switch (property) {
            case 'damage':
            case 'range':
            case 'blast':
                let class_skill_property = '';
                switch (this.classify) {
                    case common.static.ITEM_CLASSIFY_AMMO:
                        class_skill_property = skill_property + '_ammo';
                        break;
                    case common.static.ITEM_CLASSIFY_GUIDE:
                        class_skill_property = skill_property + '_guide';
                        break;
                    case common.static.ITEM_CLASSIFY_LASER:
                        class_skill_property = skill_property + '_laser';
                        break;
                }
                return this.base_ship.ship_attributes.getSkill(skill_property) + this.base_ship.ship_attributes.getSkill(class_skill_property);
        }
        //船体加成 +技能加成 默认含_per
        //船体加成 都是 weapon_+property
        //伤害加成 额外加上类型的 伤害加成
        // let skill_property = common.method.getSkillPropertyString(this.classify, property);
        // if (skill_property) {
        return this.base_ship.ship_attributes.getSkill(skill_property);
        // }
        // return 0;
        // return this.base_ship.ship_attributes.getSkill(damage_property);
    }

    /**
     * 武器朝向目标 真实角度
     */
    // addWeaponRotation() {
    //     // 思路这里只获取武器转速 计算未来6帧武器想要如何转动 (真实)
    //     // 渲染层根据target_info的角度和距离计算显示角度 按照当前角度和目标角度的比例进行虚拟渲染
    //     let add_angle = common.func.formatRatAngle(this.target_info.getTargetAngle() - this.base_ship.rotation - this.rotation);
    //     this.turnWeaponRotation(add_angle);
    //     // if (this.checkActive()) {
    //     //     ff(this.base_ship.unit_type, this.base_ship.unit_id, this.item_status);
    //     this.weaponAttack(add_angle);
    //     // }
    //     // this.rotation = this.target_info.getTargetAngle() - this.base_ship.rotation - this.rotation + this.rotation;
    // }

    /**
     * 武器归位
     */
    // subWeaponRotation() {
    //     this.turnWeaponRotation(common.func.formatRatAngle(-this.rotation));
    //
    //     //使用多重打击次数
    //     this.useMultiple();
    // }

    /**
     * 武器转向
     * @param add_angle 武器相对目标的角度
     */
    // turnWeaponRotation(add_angle) {
    //     let abs_angle = Math.abs(add_angle);
    //     if (abs_angle < this.base_run_frame) {
    //         //强行修正 因为6帧缓存的存在 最后几点处理不了
    //         this.move_rotation = 0;
    //         this.rotation = common.func.formatAngle(this.rotation + add_angle);
    //     } else {
    //         let abs_rotation = Math.floor(abs_angle / this.base_run_frame);
    //         if (add_angle > 0) {
    //             this.move_rotation = Math.ceil((this.move_rotation + this.frame_max_rotation) / 2);
    //             this.move_rotation = Math.min(this.move_rotation, this.frame_max_rotation, abs_rotation);
    //         } else {
    //             this.move_rotation = Math.ceil((this.move_rotation - this.frame_max_rotation) / 2);
    //             this.move_rotation = Math.max(this.move_rotation, -this.frame_max_rotation, -abs_rotation);
    //         }
    //     }
    // }

    /**
     * 武器移动 处理帧
     */
    // weaponMove() {
    //     if (this.move_rotation) {
    //         this.rotation = common.func.formatAngle(this.rotation + this.move_rotation);
    //     }
    // }

    /**
     * 返回武器世界坐标
     * @returns {{x: *, y: *}}
     */
    getWeaponPoint() {
        return common.func.anglePoint(this.base_ship.x, this.base_ship.y, common.func.formatAngle(this.base_ship.rotation + this.weapon_angle), this.weapon_distance);
    }

    /**
     * 武器攻击
     * @param add_angle
     * @param status 是否可发起新的攻击
     * @return {boolean}
     */
    weaponAttack(add_angle, status) {
        if (this.checkAttackStatus(add_angle, status)) {
            //这里消减多重打击次数和弹药数量
            let count = this.useMultipleCount();

            if (count) {
                let weapon_point = this.getWeaponPoint();
                let weapon_rotation = this.base_ship.rotation;

                //把当前武器的参数传递给bullet_extras 吐出新参数用于赋值
                //其中包含 坐标 角度 原始角度(用于归位) 当前速度
                let pos_infos = this.bullet_extras
                    .getExtraStartPosInfos(weapon_point, weapon_rotation);

                let final_overload_per = (this.multiple - this.surplus_multiple) * this.overload_per;

                for (let bullet_pos = 0; bullet_pos < count; bullet_pos++) {
                    let pos_info = pos_infos[count][bullet_pos];

                    let bullet_unit_id = this.base_ship.getBulletUnitId(this.slot, bullet_pos);

                    let bullet_data = {
                        grid_id: this.base_ship.grid_id,
                        unit_type: common.static.MAP_UNIT_TYPE_BULLET,
                        unit_group_id: bullet_unit_id.unit_group_id,
                        unit_id: bullet_unit_id.unit_id,
                        classify: this.classify,
                        item_type: this.item_type,

                        // ship_grid_id: this.base_ship.grid_id,
                        ship_unit_type: this.base_ship.unit_type,
                        ship_ship_type :this.base_ship.ship_type,
                        ship_unit_id: this.base_ship.unit_id,
                        ship_force: this.base_ship.force,

                        x: pos_info.absolute_point.x,
                        y: pos_info.absolute_point.y,
                        rotation: pos_info.absolute_rotation,

                        birth_x: pos_info.absolute_point.x,
                        birth_y: pos_info.absolute_point.y,

                        original_rotation: pos_info.absolute_original_rotation,
                        original_weapon_rotation: pos_info.absolute_weapon_rotation,
                        delay_frame: pos_info.delay_frame,
                        delay_pos: pos_info.delay_pos,
                        delay_total: pos_info.delay_total,
                        run_frame: 0,

                        base_range: this.base_range,
                        range: this.range,
                        velocity: pos_info.absolute_speed,
                        velocity_max: this.velocity,
                        agile: this.agile,
                        accelerate: this.accelerate,
                        blast: this.blast,
                        sustain: this.sustain,
                        radius: this.radius,

                        res: this.res,
                        extra: this.base_extra,

                        barrage: this.barrage,

                        damage_electric: this.damage_electric,
                        damage_thermal: this.damage_thermal,
                        damage_explode: this.damage_explode,

                        target_grid_id: this.target_info.getTargetGridId(),
                        target_unit_type: this.target_info.getTargetUnitType(),
                        target_unit_id: this.target_info.getTargetUnitId(),

                        target_last_x: this.target_info.getTargetX(),
                        target_last_y: this.target_info.getTargetY(),
                        // move_point: common.func.Point(),
                        // move_rotation: 0,
                        less_distance: this.range,

                        penetration_electric: this.penetration_electric,
                        penetration_thermal: this.penetration_thermal,
                        penetration_explode: this.penetration_explode,

                        chain: this.chain,
                        through: this.through,

                        final_overload_per: final_overload_per,
                        overhang_per: this.overhang_per,

                        // boom_point: common.func.Point(),
                        // chain_boom_rotation: 0,

                        // draw_less_frame: 0,
                        last_boom_unit_type: 0,
                        last_boom_unit_id: 0,

                        last_chain_status: false,

                        additional_damage_status: false,

                        // 超距伤害
                        // 过载伤害

                        loop_start_frame: 0,
                        loop_end_frame: 0,
                        repeat_start_frame: 0,
                        repeat_end_frame: 0,

                        camp: this.base_ship.camp,
                    };
                    this.base_ship.map_grid_info.createUnitBullet(bullet_data);
                }
                return true;
            }
        }
        return false;
    }

    /**
     * 判断是否为末日武器
     * @returns {boolean}
     */
    checkWeaponDoomsday() {
        switch (this.barrage) {
            case common.static.BULLET_BARRAGE_TYPE_AMMO_DOOMSDAY:
            case common.static.BULLET_BARRAGE_TYPE_GUIDE_DOOMSDAY:
            case common.static.BULLET_BARRAGE_TYPE_LASER_DOOMSDAY:
                return true;
        }
        return false;
    }

    /**
     * 判断主动装备是可提供持续BUFF
     * @return {boolean}
     */
    // checkContinuedBuff() {
    //     return this.checkWeaponDoomsday();
    // }

    /**
     * 检测是否在模块状态
     * @returns {boolean}
     */
    getIsDoomsdayStatus() {
        return !!this.doomsday_status;
    }

    /**
     * 检测是否能开炮
     * @param add_angle
     * @param status
     * @return {boolean}
     */
    checkAttackStatus(add_angle, status) {
        //有多重打击 则开火
        if (this.checkSurplusStatus()) {
            //如果是末日武器
            if (this.getIsDoomsdayStatus()) {
                //判断是否能开火
                if (this.base_ship.server_frame === this.doomsday_pre_heat_end_frame) {
                    this.doomsday_status = common.static.WEAPON_DOOMSDAY_STATUS_ATTACKING;
                }
                //如果是预热状态 直接返回
                if (this.doomsday_status === common.static.WEAPON_DOOMSDAY_STATUS_START) {
                    this.perHeatWeaponDoomsday();
                    return false;
                }
            }
            return this.base_ship.getBattleAttackStatus();
        } else {
            if (this.getIsDoomsdayStatus()) {
                //如果没弹药 则重置状态
                this.doomsday_pre_heat_start_frame = 0;
                this.doomsday_pre_heat_end_frame = 0;
                this.doomsday_status = common.static.WEAPON_DOOMSDAY_STATUS_NULL;
            }
            //没有多重打击次数了 则判断是否能开火
            if (status
                && this.checkFrozenStatus()
                && this.checkAttackAngle(add_angle)
                && this.base_ship.costCapacity(this)
            ) {
                this.setNextFireFrame();
                this.initMultiple();
                this.initCount();

                //如果是末日武器 调整预热状态参数
                if (this.checkWeaponDoomsday()) {
                    //如果末日武器没状态 则初始化末日武器状态
                    this.doomsday_pre_heat_start_frame = this.base_ship.server_frame;
                    this.doomsday_pre_heat_end_frame = this.base_ship.server_frame + this.battle_static_frame + 1;
                    //进入启动状态 并返回不攻击
                    this.doomsday_status = common.static.WEAPON_DOOMSDAY_STATUS_START;

                    this.perHeatWeaponDoomsday();
                    //自动开启舰船的会战模式
                    //如果设定了模块持续时间 则使用模块持续时间 否则使用武器CD
                    if (this.base_ship.unit_type === common.static.MAP_UNIT_TYPE_SHIP_PLAYER) {
                        //如果是玩家使用装备CD
                        this.base_ship.beginBattleAction(this.fire_rate);
                    } else {
                        //如果是NPCER使用静态数值
                        this.base_ship.beginBattleAction(this.doomsday_battle_frame);
                    }
                    return false;
                }

                return this.base_ship.getBattleAttackStatus();
            }
        }

        return false;
    }

    /**
     * 虚方法
     */
    perHeatWeaponDoomsday() {
    }

    /**
     * 检测角度是否可攻击
     * @param add_angle
     * @return {boolean}
     */
    checkAttackAngle(add_angle) {
        return Math.abs(add_angle) < this.angle;
    }

    /**
     * 检测是否在武器射程内
     * @return {boolean}
     */
    // checkFireInRange() {
    //     return this.base_ship.target_info.checkTargetInfoInRange(this.range);
    // }

    /**
     * 检测是否到了开火时间
     * @returns {boolean}
     */
    checkFireStatus() {
        return this.next_fire_frame <= this.base_ship.server_frame;
    }

    /**
     * 检测并更新冻结状态
     * @return {boolean}
     */
    checkFrozenStatus() {
        //如果是冻结状态
        if (this.item_status === common.static.SHIP_ITEM_STATUS_FROZEN) {
            //如果CD结束了  则修正成在线
            if (this.checkFireStatus()) {
                this.item_status = common.static.SHIP_ITEM_STATUS_ONLINE;

                this.base_ship.changeItemStatus(this);

                this.base_ship.loadInfoMap();

                this.base_ship.reloadUi();
            }
            return false;
        }
        return this.checkFireStatus();
    }

    /**
     * 设置下次开火时间
     */
    setNextFireFrame() {
        this.start_fire_frame = this.base_ship.server_frame;
        this.next_fire_frame = this.base_ship.server_frame + this.fire_rate;
    }

    /**
     * 检测是否有剩余波次
     * @returns {boolean}
     */
    checkSurplusStatus() {
        return !!(this.surplus_multiple && this.surplus_count);
    }

    /**
     * 初始化多重打击次数
     */
    initMultiple() {
        this.surplus_multiple = this.multiple;
    }

    initCount() {
        this.surplus_count = this.count;
    }

    /**
     * 使用多重打击次数
     */
    // useMultiple() {
    //     if (this.checkSurplusStatus()) {
    //         this.surplus_multiple--;
    //     }
    // }

    /**
     * 使用弹药数量
     * @returns {number}
     */
    useMultipleCount() {
        let count = 0;
        if (this.checkSurplusStatus()) {
            count = Math.ceil(this.surplus_count / this.surplus_multiple);

            this.surplus_count -= count;
            this.surplus_multiple--;
        }
        return count;
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
}

module.exports = ShipWeaponMap;

