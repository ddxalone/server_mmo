/**
 * 目标管理类
 * @class {ShipTargetPlayer}
 */
const common = require("../../../common");
const ShipTarget = require("./ShipTarget");

class ShipTargetPlayer extends ShipTarget {
    constructor(unit_info) {
        super(unit_info);

        /**
         * 玩家锁定目标的射程系数
         * @type {number}
         */
        this.base_target_range_ratio = 2;
    }

    checkChooseTarget() {
        this.chooseAppointTarget();

        if (this.unit_info.range_max) {
            //检测目标是否合法
            if (this.checkTargetValid()) {
                //如果超出射程 切换目标 如果没有合适的目标 则仍然使用当前目标
                this.target_distance = common.func.getUnitDistance(this.unit_info, this.target_unit_info);
                if (this.target_distance < this.unit_info.range_max) {
                    //未触发切换目标需更新目标角度
                    this.target_angle = common.func.getRatAngle(this.unit_info.x, this.unit_info.y, this.target_unit_info.x, this.target_unit_info.y);
                } else if (this.target_distance < this.unit_info.range_max * this.base_target_range_ratio) {
                    this.chooseTarget(false);
                } else {
                    this.chooseTarget();
                }
            } else {
                this.chooseTarget();
            }
        }
    }

    /**
     * 选择指定单位攻击
     */
    chooseAppointTarget() {
        if (this.unit_info.appoint_unit_type && this.unit_info.appoint_unit_id) {
            this.target_unit_info = this.unit_info.map_grid_info.getMapMergeUnitInfo(this.unit_info.appoint_unit_type, this.unit_info.appoint_unit_id);
            this.unit_info.appoint_unit_type = 0;
            this.unit_info.appoint_unit_id = 0;
        }
    }

    /**
     * 选择目标
     * @param status true切换目标 false尝试切换目标
     */
    chooseTarget(status = true) {
        status && this.reInitTargetInfo();

        this.reInitTargetFrameParam();
        //先找寻攻击的目标 如果找到 则我的状态攻击

        // if (this.target_unit_info === null) {
        this.unit_info.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
            map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                //只选择防守方的npcer
                this.chooseTargetInfoPlayerToNpcer(unit_ship_npcer);
            }, this)
        }, this);
        // }

        if (this.target_unit_info) {
            this.target_angle = common.func.getRatAngle(this.unit_info.x, this.unit_info.y, this.target_unit_info.x, this.target_unit_info.y);
        }
    }

    /**
     * 检测某个单位是否可成为当前目标 并获取最近的
     * @param {UnitShipNpcer} unit_ship_npcer
     */
    chooseTargetInfoPlayerToNpcer(unit_ship_npcer) {
        if (unit_ship_npcer.getRun() && unit_ship_npcer.checkStealthIng() === false) {
            if (unit_ship_npcer.checkAttackPlayer()) {
                //这里加上两者的半径判断
                let v_distance = common.func.getUnitDistance(this.unit_info, unit_ship_npcer);
                //小于警戒范围
                if (v_distance < this.unit_info.range_max * this.base_target_range_ratio) {
                    let final_renown = unit_ship_npcer.getPlayerFinalRenown(this.unit_info);

                    if (final_renown < common.setting.npcer_renown_fight) {
                        //如果在射程内 判断角度差最小的单位
                        if (v_distance < this.unit_info.range_max) {
                            let v_angle = common.func.getAngle(this.unit_info.x, this.unit_info.y, unit_ship_npcer.x, unit_ship_npcer.y);
                            let abs_angle = Math.abs(common.func.formatRatAngle(this.unit_info.rotation - v_angle));
                            if (this.target_abs_angle === 0 || abs_angle < this.target_abs_angle) {
                                this.target_distance = v_distance;
                                this.target_unit_info = unit_ship_npcer;
                                this.target_angle = v_angle;
                                this.target_abs_angle = abs_angle;
                            }
                        } else if (this.target_distance === 0 || v_distance < this.target_distance) {
                            //如果当前距离小于目标距离
                            let v_angle = common.func.getAngle(this.unit_info.x, this.unit_info.y, unit_ship_npcer.x, unit_ship_npcer.y);
                            this.target_distance = v_distance;
                            this.target_unit_info = unit_ship_npcer;
                            this.target_angle = v_angle;
                        }
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
            return Math.floor(this.unit_info.range_max * ratio) >= this.getTargetDistance();
        }
        return false;
    }
}

module.exports = ShipTargetPlayer;
