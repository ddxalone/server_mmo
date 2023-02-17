const BaseUnit = require("./BaseUnit");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {UnitWarpMap}
 * @extends {BaseUnit}
 */
class UnitWarpMap extends BaseUnit {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_WARP);
        //折跃运行时间
        this.warp_run_frame = 0;
        //折跃跳跃时间
        this.warp_hop_frame = 0;
        this.x = 0;
        this.y = 0;
        this.scale = 0;
    }

    /**
     * 读取信息
     * @param warp_info
     * @returns {UnitWarpMap}
     */
    loadInfoMap(warp_info) {
        this.setGridId(warp_info.grid_id);
        this.setUnitId(warp_info.unit_id);
        this.setX(warp_info.x);
        this.setY(warp_info.y);
        this.warp_run_frame = warp_info.warp_run_frame;
        this.warp_hop_frame = warp_info.warp_hop_frame;
        this.radius = warp_info.radius;

        this.setInit();
        return this;
    }

    warpWarpSettle() {
        //折跃特效没有折跃结束时间 在折跃跳跃时间就移除自己
        //这里要大于等于 是因为自己的折跃特效是一个下一帧即将死亡的特效 也丢给前端了 前端播放一个死亡动画即可
        if (this.warp_run_frame) {
            if (this.warp_run_frame === this.warp_hop_frame) {
                this.disappearWarp();
            }
            this.warp_run_frame--
        }
    }

    /**
     * 虚方法
     */
    disappearWarp() {

    }
}

module.exports = UnitWarpMap;
