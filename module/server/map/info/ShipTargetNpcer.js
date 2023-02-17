/**
 * 目标管理类
 * @class {ShipTargetNpcer}
 */
const common = require("../../../common");
const ShipTarget = require("./ShipTarget");

class ShipTargetNpcer extends ShipTarget {
    constructor(unit_info) {
        super(unit_info);

        //攻击距离修正值
        this.ai_attack_range_ratio = 0.6;
    }

    /**
     * 获取符合条件的目标信息 入口方法
     */
    checkChooseTarget() {
        if (this.unit_info.range_max) {
            //检测目标是否合法
            if (this.checkTargetValid()) {
                //新增机制 10秒内无视距离 追着屁股打
                this.target_distance = common.func.getUnitDistance(this.unit_info, this.target_unit_info);
                if (this.unit_info.npcer_ai_frame) {
                    this.unit_info.npcer_ai_frame--;

                    this.target_angle = common.func.getRatAngle(this.unit_info.x, this.unit_info.y, this.target_unit_info.x, this.target_unit_info.y);

                } else {
                    //如果超出射程 切换目标 如果没有合适的目标 则仍然使用当前目标
                    if (this.target_distance < this.unit_info.chase) {
                        this.chooseTarget(false);
                    } else {
                        this.chooseTarget();
                    }
                }
            } else {
                this.chooseTarget();
            }
        }
    }

    /**
     * 选择目标
     * @param status true切换目标 false尝试切换目标
     */
    chooseTarget(status = true) {
        status && this.reInitTargetInfo();

        this.reInitTargetFrameParam();
        //先找寻攻击的目标
        //只有防守方才会试图攻击玩家 不太好 不满足未来做势力战争的机制 先不管了吧 未来再扩展 影响不大
        if (this.unit_info.checkAttackPlayer()) {
            this.unit_info.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                map_grid_info.eachShipPlayer((unit_ship_player) => {
                    this.chooseTargetInfoNpcerToPlayer(unit_ship_player);
                }, this);
            }, this);
        }

        this.unit_info.map_grid_info.eachShipNpcer((unit_ship_npcer) => {
            this.chooseTargetInfoNpcerToNpcer(unit_ship_npcer);
        }, this);

        if (this.target_unit_info) {
            if (this.unit_info.npcer_ai_status === common.static.NPCER_AI_STATUS_FIGHT) {
                this.callAssistAttack();
            }

            //如果是警戒状态 则把警戒状态的距离赋值到这里
            if (this.unit_info.npcer_ai_status === common.static.NPCER_AI_STATUS_ALERT) {
                this.target_distance = this.target_distance_alert;
                this.callAssistAttack();
            }

            this.target_angle = common.func.getRatAngle(this.unit_info.x, this.unit_info.y, this.target_unit_info.x, this.target_unit_info.y);
        }
    }

    /**
     * 呼叫警戒范围的其他舰船协助攻击
     */
    callAssistAttack() {
        //TODO 按照现有规则NPC是不会切换断层的 只需要遍历当前断层下的所有同阵营的NPC就行
        this.unit_info.map_grid_info.eachShipNpcer((unit_ship_npcer) => {
            //如果是同势力
            if (this.unit_info.force === unit_ship_npcer.force) {
                //包含自己
                if (common.func.getUnitDistance(this.unit_info, unit_ship_npcer) < this.unit_info.assist) {
                    unit_ship_npcer.npcer_ai_status = this.unit_info.npcer_ai_status;
                    unit_ship_npcer.target_info.target_unit_info = this.target_unit_info;
                    //如果我是boss 或者 该目标不是boss 则跟随行动10秒
                    if (this.is_boss || !unit_ship_npcer.is_boss) {
                        unit_ship_npcer.npcer_ai_frame = 100;
                    }
                }
            }
        }, this);
    }


    /**
     * 检测某个单位是否可成为当前目标 并获取最近的
     * @param unit_ship_player
     */
    chooseTargetInfoNpcerToPlayer(unit_ship_player) {
        if (unit_ship_player.getRun() && unit_ship_player.checkStealthIng() === false) {
            //这里加上两者的半径判断
            let v_distance = common.func.getUnitDistance(this.unit_info, unit_ship_player);
            if (v_distance < this.unit_info.alert) {
                //获取玩家的声望
                let final_renown = this.unit_info.getPlayerFinalRenown(unit_ship_player);

                //任何情况 只要声望足够低 获取最近的可进攻的单位 并设定攻击状态
                if (final_renown < common.setting.npcer_renown_fight && (this.target_distance === 0 || v_distance < this.target_distance)) {
                    this.target_distance = v_distance;
                    this.target_unit_info = unit_ship_player;

                    this.unit_info.npcer_ai_status = common.static.NPCER_AI_STATUS_FIGHT;
                }
                //不在战斗状态 则判定警戒状态
                if (this.unit_info.npcer_ai_status !== common.static.NPCER_AI_STATUS_FIGHT) {
                    //获取警戒声望下 最近的单位 并设定状态为警戒
                    if (final_renown < common.setting.npcer_renown_alert && (this.target_distance_alert === 0 || v_distance < this.target_distance_alert)) {
                        this.target_distance_alert = v_distance;
                        this.target_unit_info = unit_ship_player;

                        this.unit_info.npcer_ai_status = common.static.NPCER_AI_STATUS_ALERT;
                    }
                }
            }
        }
    }

    /**
     * 检测某个单位是否可成为当前目标 并获取最近的
     * @param unit_ship_npcer
     */
    chooseTargetInfoNpcerToNpcer(unit_ship_npcer) {
        if (unit_ship_npcer.getRun() && unit_ship_npcer.checkStealthIng() === false) {
            if (this.unit_info.checkAttackNpcer(unit_ship_npcer.camp)) {
                //这里加上两者的半径判断
                let v_distance = common.func.getUnitDistance(this.unit_info, unit_ship_npcer);
                if (v_distance < this.unit_info.alert) {
                    //判断是否为敌对势力
                    if (this.target_distance === 0 || v_distance < this.target_distance) {
                        this.target_distance = v_distance;
                        this.target_unit_info = unit_ship_npcer;

                        this.unit_info.npcer_ai_status = common.static.NPCER_AI_STATUS_FIGHT;
                    }
                }
            }
        }
    }


    /**
     * 检测目标是否在最远射程或某个射程内
     * @param ratio
     * @return {boolean}
     */
    checkTargetInfoInRange(ratio = 1) {
        if (this.checkTargetValid()) {
            return Math.floor(this.unit_info.range_max * this.ai_attack_range_ratio * ratio) >= this.getTargetDistance();
        }
        return false;
    }

    getTargetMergeId() {
        return this.target_unit_info && this.target_unit_info.map_grid_info.map_merge_info.merge_id;
    }

    getTargetGridId() {
        return this.checkTargetValid() ? this.target_unit_info.grid_id : 0;
    }

    getTargetUnitType() {
        return this.checkTargetValid() ? this.target_unit_info.unit_type : 0;
    }

    getTargetUnitId() {
        return this.checkTargetValid() ? this.target_unit_info.unit_id : 0;
    }

    getTargetX() {
        return this.checkTargetValid() ? this.target_unit_info.x : null;
    }

    getTargetY() {
        return this.checkTargetValid() ? this.target_unit_info.y : null;
    }
}

module.exports = ShipTargetNpcer;
