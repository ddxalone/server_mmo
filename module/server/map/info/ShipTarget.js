/**
 * 目标管理类
 * @class {ShipTarget}
 */
const common = require("../../../common");

class ShipTarget {
    constructor(unit_info) {
        this.draw_ratio = common.setting.draw_ratio;
        /**
         * 当前目标所属单位信息
         * @type {BaseUnit|UnitShipPlayer|UnitShipNpcer}
         */
        this.unit_info = unit_info;
        /**
         * @type {BaseUnit|UnitShipPlayer|UnitShipNpcer}
         */
        this.target_unit_info = null;
        // 距离目标的距离
        this.target_distance = 0;
        // 第二距离目标的距离
        this.target_distance_alert = 0;
        // 距离目标的角度
        this.target_angle = 0;
        // 用于计算最小角度的变量
        this.target_abs_angle = 0;
    }

    /**
     * 清理目标
     */
    reInitTargetInfo() {
        this.target_unit_info = null;
    }

    /**
     * 重置判断参数
     */
    reInitTargetFrameParam() {
        this.target_distance = 0;
        this.target_distance_alert = 0;
        this.target_angle = 0;
        this.target_abs_angle = 0;
    }

    /**
     * 在获成功取目标之后获取距离目标的距离
     * @returns {number}
     */
    getTargetDistance() {
        return this.target_distance;
    }

    /**
     * 在成功获取到目标之后获取角度
     * @returns {number}
     */
    getTargetAngle() {
        return this.target_angle;
    }

    /**
     * 虚方法
     */
    checkChooseTarget() {

    }

    /**
     * 选择目标
     * @param status true切换目标 false尝试切换目标
     */
    chooseTarget(status = true) {
    }

    /**
     * 返回目标是否是一个有效目标
     * @return {boolean}
     */
    checkTargetValid() {
        //目标存在 且 在同一个合层 才有效
        let valid = (!!this.target_unit_info
            && this.target_unit_info.getRun()
            && this.target_unit_info.map_grid_info.map_merge_info.merge_id === this.unit_info.map_grid_info.map_merge_info.merge_id
            && this.target_unit_info.checkStealthIng() === false
        );
        valid || (this.target_unit_info = null);
        return valid;
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

module.exports = ShipTarget;
