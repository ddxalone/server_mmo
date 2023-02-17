const UnitShip = require("./UnitShip");
const ShipWeapon = require("./ShipWeapon");
const ShipTargetNpcer = require("./ShipTargetNpcer");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {UnitShipNpcerMap}
 * @extends {UnitShip}
 */
class UnitShipNpcerMap extends UnitShip {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_SHIP_NPCER);

        //环绕距离修正值 为1的话 射程不够
        this.ai_range_ratio = 0.5;

        //玩家AI状态 战斗中 还是警戒中
        this.npcer_ai_status = 0;
        //玩家切换执行AI的时间
        this.npcer_ai_frame = 0;
        //出生坐标
        this.birth_point_x = 0;
        this.birth_point_y = 0;

        this.base_unit_type = 0;
        /**
         * @type {UnitDead}
         */
        this.unit_dead = null;
        /**
         * @type {UnitTask}
         */
        this.unit_task = null;

        //巡逻方式
        this.patrol = 0;
        //追击范围
        this.chase = 0;
        //警戒范围
        this.alert = 0;
        //协助范围
        this.assist = 0;

        this.target_info = new ShipTargetNpcer(this);

        /**
         * @type {Array<Object>}
         */
        this.drop_item_list = [];
        //记录npcer的阵营 用于后期声望判断
        this.camp = 0;
    }

    /**
     * 读取初始化信息
     */
    loadInfoMap() {
        this.updateShipNpcerProperty();

        this.updateShipInfo();
        //基础属性初始化
        // this.setShipNpcerFightModel();

    }

    /**
     * 检测碰撞
     */
    checkCollisionNpcer() {
        // 玩家的碰撞检测其他玩家和npc的 只检测ID比自己大的玩家 和所有NPC
        // this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
        //     map_grid_info.eachShipNpcer((unit_ship_npcer) => {
        //         if (unit_ship_npcer.getRun() && unit_ship_npcer.unit_id > this.unit_id) {
        //             this.checkCollision(unit_ship_npcer);
        //         }
        //     }, this);
        //     map_grid_info.eachStation((unit_station) => {
        //         this.checkCollision(unit_station);
        //     }, this);
        // }, this);

        //先试试直接调用衰减方法好不好
        this.useCollision();
    }

    updateShipNpcerProperty() {
        this.shield_max = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_shield);
        this.armor_max = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_armor);
        this.speed_max = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_speed);
        this.capacity_max = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_capacity);
        // this.power = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO,this.base_power );
        this.recover = common.method.calculateValue(common.static.RATIO_TYPE_FRAME_VALUE, this.base_recover);
        this.charge = common.method.calculateValue(common.static.RATIO_TYPE_FRAME_VALUE, this.base_charge);
        this.resume = common.method.calculateValue(common.static.RATIO_TYPE_FRAME_VALUE, this.base_resume);
        // this.damage = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO);

        this.shield_electric = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_shield_electric);
        this.shield_thermal = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_shield_thermal);
        this.shield_explode = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_shield_explode);
        this.armor_electric = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_armor_electric);
        this.armor_thermal = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_armor_thermal);
        this.armor_explode = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_armor_explode);

        this.agile = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_agile);
        this.mass = common.method.calculateValue(common.static.RATIO_TYPE_DRAW_RATIO, this.base_mass);

        this.eachShipWeapon((ship_weapon) => {
            ship_weapon.updateWeaponProperty();
        }, this);
    }

    /**
     * 服务帧结算
     */
    shipNpcerSettle() {
        //又想重新规划 结算负责修改各种状态 运行的时候获取状态进行逻辑处理
        if (this.getInit()) {
            this.setRun();
        }
        if (this.getRun()) {
            this.shipBerthSettle() || this.shipWarpSettle() || this.shipBattleSettle() || this.shipStealthSettle();

            if (this.getArmor() === 0) {
                this.setDeath();
                this.shipNpcerDeath();
            } else {
                this.shipIncrement();
            }
        } else if (this.getBerth()) {
            if (this.getStationId() === 0) {
                this.setRun();
            }
        }
    }

    /**
     * npcer舰船动作处理
     * @return {UnitShipNpcerMap}
     */
    shipNpcerAction() {
        this.checkCollisionNpcer();

        if (this.getIsBerthStatus()) {
            this.addShipRotation(this.getMoveRotation());

            this.shipBerthMove()
        } else if (this.getIsWarpStatus()) {
            this.shipStopTargetAngle();

            this.shipDisAttack();
        } else {
            this.shipNpcerAi();

            this.addShipRotation(this.getForwardRotation());

            if (this.getIsBattleStatus() === false) {
                this.shipForward();
            } else {
                this.shipStop();
            }
        }

        if (this.getIsStealthStatus() === false) {
            if (this.npcer_ai_status === common.static.NPCER_AI_STATUS_FIGHT) {
                this.shipAttack();
            }
        }
        return this;
    }

    shipHarmSettleDo() {
        super.shipHarmSettleDo();
    }

    /**
     * 处理npcer的Ai
     */
    shipNpcerAi() {
        //NPC状态 巡逻中 警戒中 攻击中
        this.target_info.checkChooseTarget();
        //如果目标合法
        if (this.target_info.checkTargetValid()) {
            switch (this.patrol) {
                case common.static.NPCER_PATROL_SURROUND:
                    this.updateFightSurroundPowPoint();
                    break;
                case common.static.NPCER_PATROL_STATIONARY:
                    this.updateFightStationaryPowPoint();
                    break;
            }
        } else {
            this.updatePatrolPowPoint();
        }
    }

    /**
     * 更新环绕攻击方式的pow_point
     */
    updateFightSurroundPowPoint() {
        // 获取目标距离
        let target_distance = this.target_info.getTargetDistance();
        // 获取目标角度
        let target_angle = this.target_info.getTargetAngle();
        // 获取射程
        let range = this.range_max * this.ai_range_ratio;

        let target_fix_angle = target_distance > range ?
            common.func.radianToAngle(Math.asin(range / target_distance)) :
            // common.func.formatAngle((2 - target_distance / range) * 9000);
            common.func.formatAngle((1.5 - target_distance / range / 2) * 9000);

        //当前和目标角度差
        let target_sub_angle = common.func.formatRatAngle(this.rotation - target_angle);
        if (target_sub_angle > 0) {
            this.setTargetMoveAngle(common.func.formatAngle(target_angle + target_fix_angle))
        } else {
            this.setTargetMoveAngle(common.func.formatAngle(target_angle - target_fix_angle));
        }
        this.pow_point = common.func.anglePoint(0, 0, this.target_move_angle, this.frame_max_speed);
    }

    /**
     * 更新定点攻击模式的pow_point
     */
    updateFightStationaryPowPoint() {
        // 获取目标距离
        let target_distance = this.target_info.getTargetDistance();
        // 获取射程
        let range = this.range_max * this.ai_range_ratio;
        if (Math.abs(target_distance - range) < 10) {
            this.pow_point.x = 0;
            this.pow_point.y = 0;
        } else {
            // 获取目标角度
            let target_angle = this.target_info.getTargetAngle();
            this.setTargetMoveAngle(target_angle);
            //移动获取目标和射程的距离可能为负
            let move_distance = Math.max(-this.frame_max_speed, Math.min(this.frame_max_speed, Math.ceil((target_distance - range) / this.base_map_frame)));

            this.pow_point = common.func.anglePoint(0, 0, this.target_move_angle, move_distance);
        }
    }

    /**
     * 更新巡逻状态下的pow_point
     */
    updatePatrolPowPoint() {
        // 获取目标距离
        let target_distance = common.func.getDistance(this.x, this.y, this.birth_point_x, this.birth_point_y);
        if (target_distance < 10) {
            this.pow_point.x = 0;
            this.pow_point.y = 0;
        } else {
            // 获取目标角度
            let target_angle = common.func.getAngle(this.x, this.y, this.birth_point_x, this.birth_point_y);
            // 获取射程
            this.setTargetMoveAngle(target_angle);
            //移动获取目标和射程的距离可能为负
            let move_distance = Math.max(-this.frame_max_speed, Math.min(this.frame_max_speed, Math.ceil(target_distance / this.base_map_frame - this.frame_max_speed)));

            this.pow_point = common.func.anglePoint(0, 0, this.target_move_angle, move_distance);
        }
    }

    /**
     * 虚方法
     */
    shipNpcerDeath() {
    }

    /**
     * 残骸处理
     */
    shipWreckageHandle() {
        //TODO 根据受伤信息创建处理残骸归属
        if (this.drop_item_list.length) {
            //创建残骸
            let wreckage_data = {
                grid_id: this.grid_id,
                unit_type: common.static.MAP_UNIT_TYPE_WRECKAGE,
                unit_id: this.unit_id,

                x: this.x,
                y: this.y,
                rotation: this.rotation,

                radius: this.radius,

                force: this.base_ship_info.force,
                size: this.size,

                wreckage_item_list: this.drop_item_list,
            };

            this.map_grid_info.createUnitWreckage(wreckage_data);
        }
    }

    updateShipNpcerItem(ship_npcer) {
        //初始化增加属性
        this.updateShipNpcerWeapons(ship_npcer.weapons);
    }

    /**
     * 更新武器列表
     */
    updateShipNpcerWeapons(weapons) {
        //遍历客户端
        this.eachShipWeapon((ship_weapon) => {
            //如果服务端存在
            if (weapons[ship_weapon.slot]) {
                // ship_weapon.updateShipWeapon(weapon[ship_weapon.slot]);
                ship_weapon.reloadInfo(weapons[ship_weapon.slot]);
                delete weapons[ship_weapon.slot];
            } else {
                //如果服务端不存在
                this.delShipWeapon(ship_weapon);
            }
        }, this);

        //剩余的为服务端存在 客户端不存在
        if (Object.keys(weapons).length) {
            for (let slot in weapons) {
                let weapon = weapons[slot];
                let ship_weapon = new ShipWeapon()
                    .setTargetInfo(this.target_info)
                    .setBaseShip(this)
                    .loadInfo(weapon);

                this.addShipWeapon(ship_weapon);
            }
        }
    }

    /**
     * 设定玩家攻击本单位刷新声望
     * @param unit_ship_player
     * @return {*}
     */
    setPlayerAttackRenown(unit_ship_player) {
        switch (this.base_unit_type) {
            case common.static.WORLD_NPCER_UNIT_TYPE_DEAD:
                this.unit_dead.setAttackRenown(unit_ship_player, this);
                break;
            case common.static.WORLD_NPCER_UNIT_TYPE_TASK:
                this.unit_task.setAttackRenown(unit_ship_player, this);
                break;
        }
    }

    /**
     * 获取相对于玩家的最终声望
     * @param unit_ship_player
     */
    getPlayerFinalRenown(unit_ship_player) {
        //触发死亡空间等下一步
        switch (this.base_unit_type) {
            case common.static.WORLD_NPCER_UNIT_TYPE_DEAD:
                return this.unit_dead.getRenownsRenown(unit_ship_player);
            case common.static.WORLD_NPCER_UNIT_TYPE_TASK:
                return this.unit_task.getRenownsRenown(unit_ship_player);
        }
    }

    /**
     * 根据势力判断是否可仅
     * @param camp
     * @returns {boolean}
     */
    checkAttackNpcer(camp) {
        return this.camp !== camp;
    }

    /**
     * 获取npcer是否可攻击玩家
     * @returns {boolean}
     */
    checkAttackPlayer() {
        return !this.camp;
    }
}

module.exports = UnitShipNpcerMap;

