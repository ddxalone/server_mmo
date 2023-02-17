const UnitShipNpcerMap = require("./UnitShipNpcerMap");
const WarpInfo = require("./WarpInfo");
const NearGridInfo = require("../info/NearGridInfo");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const {ServerWorldBlock, ServerWorldPlayer} = require("../../index");

/**
 * @callback callbackUnitShipNpcer
 * @param {UnitShipNpcer} ship_npcer
 */
/**
 * @class {UnitShipNpcer}
 * @extends {UnitShip}
 */
class UnitShipNpcer extends UnitShipNpcerMap {
    constructor() {
        super();
        //遭受攻击触发状态
        this.harm_trigger_status = common.define.SHIP_NPCER_TRIGGER_STATUS_NULL;
        //被扫描触发
        this.byray_trigger_status = common.define.SHIP_NPCER_TRIGGER_STATUS_NULL;

        this.template_unit_id = 0;
        /**
         * @type {WorldDeadInfo}
         */
        this.world_dead_info = null;
        /**
         * @type {WorldTaskInfo}
         */
        this.world_task_info = null;
        //记录npcer的入场方式
        this.enter = 0;
        //后端专用判断是否为折跃离开
        this.warp_leave_status = false;
    }

    /**
     * @param base_unit_type
     * @returns {UnitShipNpcer}
     */
    setBaseUnitType(base_unit_type) {
        this.base_unit_type = base_unit_type;
        return this;
    }

    /**
     * @param template_unit_id
     * @returns {UnitShipNpcer}
     */
    setTemplateUnitId(template_unit_id) {
        this.template_unit_id = template_unit_id;
        return this;
    }

    /**
     * 死亡空间专属 设定
     * @param world_dead_info
     * @return {UnitShipNpcer}
     */
    setWorldDeadInfo(world_dead_info) {
        this.world_dead_info = world_dead_info;

        this.unit_dead = world_dead_info.unit_dead;

        //同时追加当前单位到信标
        this.unit_dead.addUnitShipNpcer(this);
        return this;
    }

    /**
     * 任务空间专属 设定
     * @param world_task_info
     * @return {UnitShipNpcer}
     */
    setWorldTaskInfo(world_task_info) {
        this.world_task_info = world_task_info;

        this.unit_task = world_task_info.unit_task;

        this.unit_task.addUnitShipNpcer(this);
        return this;
    }

    /**
     * 读取信息
     * @param {TemplateUnitInfo} npcer_info
     * @return {UnitShipNpcer}
     */
    loadInfo(npcer_info) {
        this.setUnitId(m_server.ServerMapUnit.unit_ship_npcer_id);
        this.setShipType(npcer_info.ship_type);
        this.setTemplateUnitId(npcer_info.template_unit_id);
        //初始化舰船基础信息
        this.initBaseShipInfo();
        //TODO 临时调整npcer伤害为0
        // this.base_damage = 0;
        this.reloadInfo(npcer_info);

        this.drop_item_list = m_server.DropService.getDropItemList(this);

        return this;
    }

    reloadInfo(npcer_info) {
        //获取所有装备信息
        let ship_item = this.loadInfoItem();
        //处理舰船装备
        this.updateShipNpcerItem(ship_item);
        //处理舰船信息
        super.loadInfoMap();
        //初始化舰船变量
        this.initShipNpcerVariable(npcer_info);
    }

    /**
     * npcer入场逻辑类
     * @returns {UnitShipNpcer}
     */
    npcerEnter() {
        //如果出场类型为折跃出场
        switch (this.enter) {
            case common.define.SHIP_NPCER_ENTER_TYPE_WARP:
                //获取舰船朝向反向的一个断层距离的坐标
                let point = common.func.anglePoint(this.x, this.y, common.func.formatAngle(this.rotation - 18000), common.setting.base_map_grid_radius);
                this.setX(point.x);
                this.setY(point.y);

                this.warpBirth();
                break;
            case common.define.SHIP_NPCER_ENTER_TYPE_STATION:
                this.berth_status = common.static.SHIP_BERTH_STATUS_LEAVE;
                this.berth_frame = common.setting.berth_static_frame;
                //获取一个空间站半径+舰船直径的坐标
                let end_distance = common.setting.station_berth_range + this.radius * 2 * this.draw_ratio;
                //获取每帧移动最大速度
                let move_frame_distance = Math.floor(end_distance / common.setting.berth_start_speed_frame / common.setting.base_run_frame);
                //获取出站角度 掉头180度
                //获取辅助力数值
                this.setTargetMoveAngle(this.rotation);

                this.auxiliary_point = common.func.anglePoint(0, 0, this.rotation, move_frame_distance);

                //从新更新出生坐标
                let birth_point = common.func.anglePoint(this.x, this.y, this.rotation, end_distance);
                this.birth_point_x = birth_point.x;
                this.birth_point_y = birth_point.y;
                //这里考虑一下 出站的形状 和 角度
                break;
        }
        this.setInit();

        return this;
    }

    /**
     * 基础属性初始化
     */
    getBaseShipInfo() {
        this.base_ship_info || (this.base_ship_info = m_server.ServerBaseShip.getShipNpcerDataValue(this.ship_type).getDao());
        return this.base_ship_info;
    }

    loadInfoItem() {
        //NPC是从基础表读取武器个数种类坐标
        let weapons = {};
        for (let slot in this.base_weapon) {
            let base_weapon = this.base_weapon[slot];
            weapons[slot] = {
                item_id: 0,
                item_type: base_weapon.type,
                slot: parseInt(slot),
                status: common.static.SHIP_ITEM_STATUS_ACTIVE,
                x: base_weapon.x,
                y: base_weapon.y,
            };
        }

        return {
            weapons: weapons,
        };
    }

    /**
     * @param {TemplateUnitInfo} npcer_info
     */
    initShipNpcerVariable(npcer_info) {
        this.setX(npcer_info.x);
        this.setY(npcer_info.y);
        this.setRotation(npcer_info.rotation);
        this.setTargetMoveAngle(this.rotation);

        this.setShield(this.shield_max);
        this.setArmor(this.armor_max);
        this.setSpeed(0);
        this.setCapacity(this.capacity_max);

        this.enter = npcer_info.enter;
        this.camp = npcer_info.camp;

        this.initBirthPoint();
    }

    /**
     * 获取NPC的折跃帧数 根据质量来
     */
    // getShipNpcerWarpFrame() {
    //     return Math.floor(Math.sqrt(this.mass_ratio / 10) + this.warp_static_frame * 2);
    // }

    shipNpcerDeath() {
        super.shipNpcerDeath();
        //触发死亡空间等下一步
        switch (this.base_unit_type) {
            case common.static.WORLD_NPCER_UNIT_TYPE_DEAD:
                this.world_dead_info.checkTriggerNextStepDeath(this.template_unit_id);

                //同时移除当前单位到信标
                this.unit_dead.removeUnitShipNpcer(this.unit_id);

                break;
            case common.static.WORLD_NPCER_UNIT_TYPE_TASK:
                this.world_task_info.checkTriggerNextStepDeath(this.template_unit_id);

                this.unit_task.removeUnitShipNpcer(this.unit_id);
                break;
        }

        this.map_grid_info.removeUnitInfo(this, common.static.MAP_FRAME_TYPE_DEAD);
    }

    shipHarmSettleDo() {
        //触发死亡空间等下一步
        switch (this.base_unit_type) {
            case common.static.WORLD_NPCER_UNIT_TYPE_DEAD:
                if (this.harm_trigger_status === common.define.SHIP_NPCER_TRIGGER_STATUS_NULL) {
                    this.harm_trigger_status = common.define.SHIP_NPCER_TRIGGER_STATUS_TRIGGER;

                    this.world_dead_info.checkTriggerNextStepHarm(this.template_unit_id);
                }
                break;
            case common.static.WORLD_NPCER_UNIT_TYPE_TASK:
                if (this.harm_trigger_status === common.define.SHIP_NPCER_TRIGGER_STATUS_NULL) {
                    this.harm_trigger_status = common.define.SHIP_NPCER_TRIGGER_STATUS_TRIGGER;

                    this.world_task_info.checkTriggerNextStepHarm(this.template_unit_id);
                }
                break;
        }

        super.shipHarmSettleDo();
    }

    shipByRay() {
        //触发死亡空间等下一步
        switch (this.base_unit_type) {
            case common.static.WORLD_NPCER_UNIT_TYPE_DEAD:
                if (this.byray_trigger_status === common.define.SHIP_NPCER_TRIGGER_STATUS_NULL) {
                    this.byray_trigger_status = common.define.SHIP_NPCER_TRIGGER_STATUS_TRIGGER;

                    this.world_dead_info.checkTriggerNextStepByRay(this.template_unit_id);
                }
                break;
            case common.static.WORLD_NPCER_UNIT_TYPE_TASK:
                if (this.byray_trigger_status === common.define.SHIP_NPCER_TRIGGER_STATUS_NULL) {
                    this.byray_trigger_status = common.define.SHIP_NPCER_TRIGGER_STATUS_TRIGGER;

                    this.world_task_info.checkTriggerNextStepByRay(this.template_unit_id);
                }
                break;
        }
    }

    /**
     * 更新出生点坐标 或者 未来可能增加巡逻点
     */
    initBirthPoint() {
        this.birth_point_x = this.x;
        this.birth_point_y = this.y;
    }

    /**
     * 处理NPC激活时的瞬时状态 恢复和坐标
     */
    shipNpcerActiveAction(pass_active_server_frame) {
        if (this.getIsWarpStatus()) {
            this.jumpWarpAction(true);
        } else {
            //获取从当前点到出生点的角度
            let distance = common.func.getDistance(this.x, this.y, this.birth_point_x, this.birth_point_y);
            let angle = common.func.getAngle(this.x, this.y, this.birth_point_x, this.birth_point_y);

            //speed_max 是每秒的距离
            let move_distance = Math.min(distance, pass_active_server_frame * this.speed_max / this.base_server_frame);

            let point = common.func.anglePoint(this.x, this.y, angle, move_distance);

            this.setX(point.x);
            this.setY(point.y);
            //这里不能设置角度 折跃到这个位置 这里会触发一段时间
            // this.setRotation(angle);
        }
        //如果是NPC遍历到这里的时候证明这帧已经被激活 且还未初始化激活帧 恢复
        //计算非激活了多少帧 一次性回复盾甲电
        let recover = pass_active_server_frame * this.getNaturalRecovery(this.recover, this.shield, this.shield_max);
        let resume = pass_active_server_frame * this.getNaturalRecovery(this.resume, this.armor, this.armor_max);
        let charge = pass_active_server_frame * this.getNaturalRecovery(this.charge, this.capacity, this.capacity_max);
        if (recover) {
            this.addShield(recover);
        }
        if (resume) {
            this.addArmor(resume);
        }
        if (charge) {
            this.addCapacity(charge);
        }
    }

    /**
     * 折跃到出生点
     */
    warpBirth() {
        //方案一 不检测碰撞了 容易打乱阵形
        //创建折跃点单位
        let warp_info = new WarpInfo()
            .setUnitType(this.unit_type)
            .setX(this.birth_point_x)
            .setY(this.birth_point_y)
            .setMassRatio(this.mass_ratio)
            .setRadius(this.radius)
            .updateShipWarpFrame();

        //重新计算warp_angle
        let warp_angle = common.func.getAngle(this.x, this.y, this.birth_point_x, this.birth_point_y);
        this.beginWarpAction(warp_info, warp_angle);

        m_server.ServerMapUnit.joinUnitWarp(warp_info);
    }

    /**
     * 折跃离开
     * @param x
     * @param y
     */
    warpLeave(x, y) {
        //方案一 不检测碰撞了 容易打乱阵形
        //创建折跃点单位
        let warp_info = new WarpInfo()
            .setUnitType(this.unit_type)
            .setX(x)
            .setY(y)
            .setMassRatio(this.mass_ratio)
            .setRadius(this.radius)
            .updateShipWarpFrame();

        //npcer可能会折跃离开
        this.warp_leave_status = true;
        //重新计算warp_angle
        let warp_angle = common.func.getAngle(this.x, this.y, x, y);
        this.beginWarpAction(warp_info, warp_angle);
    }

    /**
     * 折跃跳跃方法
     * @param success
     */
    jumpWarpAction(success = false) {
        //如果是触发折跃离开 则折跃完后移除
        if (this.warp_leave_status) {
            //这个方法在同步消息之前 直接离开就行
            this.setDeath();
            this.map_grid_info.removeUnitInfo(this, common.static.MAP_FRAME_TYPE_LEAVE);
        } else {
            super.jumpWarpAction(success);

            this.map_grid_info.addFrameUnit(this, common.static.MAP_FRAME_TYPE_EXIST);
        }
    }

    addRewardNpcer() {
        if (this.last_player_harm_unit_id) {
            //最后一击获得全部经验
            ServerWorldPlayer.addPlayerExp(this.last_player_harm_unit_id,
                Math.floor(this.score / 20
                    * Math.pow(2, this.category - 1)
                    * Math.pow(3, this.difficult - 1)
                    * (this.is_boss ? 2 : 1)
                ));
        }
    }

    getClientUnitShipNpcer() {
        let weapons = {};
        this.eachShipWeapon((ship_weapon) => {
            weapons[ship_weapon.slot] = ship_weapon.getClientShipWeapon();
        }, this);

        return {
            grid_id: this.grid_id,
            unit_id: this.unit_id,
            unit_type: this.unit_type,
            ship_type: this.ship_type,
            x: this.x,
            y: this.y,
            rotation: this.rotation,

            shield: this.getShield(),
            armor: this.getArmor(),
            speed: this.getSpeed(),
            capacity: this.getCapacity(),

            birth_point_x: this.birth_point_x,
            birth_point_y: this.birth_point_y,

            pow_point: this.pow_point,
            move_point: this.move_point,
            auxiliary_point: this.auxiliary_point,
            move_rotation: this.move_rotation,
            target_move_angle: this.target_move_angle,
            collision_point: this.collision_point,

            // harm_electric: this.harm_electric,
            // harm_thermal: this.harm_thermal,
            // harm_explode: this.harm_explode,
            harm_status: this.harm_status,

            // fight_model: this.fight_model,
            // target_grid_id: this.target_info.target_grid_id,
            target_unit_type: this.target_info.getTargetUnitType(),
            target_unit_id: this.target_info.getTargetUnitId(),

            //折跃开始时间
            warp_run_frame: this.warp_run_frame,
            //折跃结束时间
            warp_sum_frame: this.warp_sum_frame,
            //折跃启动结束时间
            warp_ing_frame: this.warp_ing_frame,
            //折跃跳跃时间
            warp_hop_frame: this.warp_hop_frame,
            warp_status: this.warp_status,

            // 模块开始帧数
            battle_run_frame: this.battle_run_frame,
            // 模块结束帧数
            battle_sum_frame: this.battle_sum_frame,
            // 模块启动结束帧数
            battle_ing_frame: this.battle_ing_frame,
            // 模块结束开始帧数
            battle_hop_frame: this.battle_hop_frame,

            battle_status: this.battle_status,

            moving: this.moving,

            npcer_ai_status: this.npcer_ai_status,

            base_unit_type: this.base_unit_type,
            unit_dead_id: (this.unit_dead && this.unit_dead.unit_id) || 0,
            unit_task_id: (this.unit_task && this.unit_task.unit_id) || 0,

            drop_item_list: this.drop_item_list,

            berth_status: this.berth_status,
            berth_frame: this.berth_frame,

            camp: this.camp,

            last_player_harm_unit_id: this.last_player_harm_unit_id,

            weapons: weapons,
        }
    }
}

module.exports = UnitShipNpcer;

