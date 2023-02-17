const BaseInfo = require("../../main/info/BaseInfo");
const common = require("../../../common");
const m_server = require("../../../server");

/**
 * @class {WarpInfo}
 * @extends {BaseInfo}
 */
class WarpInfo extends BaseInfo {
    constructor() {
        super();
        this.unit_id = m_server.ServerMapUnit.map_warp_id;
        this.unit_type = 0;
        //折跃运行时间
        this.warp_run_frame = 0;
        //折跃合计时间
        this.warp_sum_frame = 0;
        //折跃启动结束时间
        this.warp_ing_frame = 0;
        //折跃跳跃时间
        this.warp_hop_frame = 0;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
    }

    /**
     * @param unit_type
     * @return {WarpInfo}
     */
    setUnitType(unit_type) {
        this.unit_type = unit_type;
        return this;
    }

    /**
     * @param mass_ratio
     * @return {WarpInfo}
     */
    setMassRatio(mass_ratio) {
        this.mass_ratio = mass_ratio;
        return this;
    }

    /**
     * @param point
     * @return {WarpInfo}
     */
    setPoint(point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    /**
     * @param x
     * @return {WarpInfo}
     */
    setX(x) {
        this.x = x;
        return this;
    }

    /**
     * @param y
     * @return {WarpInfo}
     */
    setY(y) {
        this.y = y;
        return this;
    }

    /**
     * @param radius
     * @return {WarpInfo}
     */
    setRadius(radius) {
        this.radius = radius;
        return this;
    }

    /**
     * @return {WarpInfo}
     */
    updateShipWarpFrame() {
        //mass_ratio 是 100 为基础 缩小了 4/10的值
        //质量护卫100 驱逐 150 巡洋400 战列 600 无畏 1600 泰坦 2500
        //期望护卫舰 5秒 驱逐舰8秒 泰坦 1分钟
        //实际护卫30帧 泰坦16秒160帧
        let warp_sum = Math.ceil(Math.sqrt(this.mass_ratio / 10) * this.base_server_frame * (this.unit_type === common.static.MAP_UNIT_TYPE_SHIP_PLAYER ? 2 : 1));
        warp_sum = Math.ceil(warp_sum / 10);
        warp_sum = Math.max(3, warp_sum);

        //折跃运行帧数 30--
        this.warp_run_frame = warp_sum;
        //折跃合计时间 30
        this.warp_sum_frame = warp_sum;
        //启动结束时间为整体折跃时间的2/3 20
        this.warp_ing_frame = Math.floor(warp_sum / 3 * 2);
        //折跃跳跃时间为整体折跃时间的1/3 10
        this.warp_hop_frame = Math.floor(warp_sum / 3);
        return this;
    }
}

module.exports = WarpInfo;

