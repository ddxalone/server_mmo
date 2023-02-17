const common = require("../common");

/**
 * 折跃服务层
 */
class WarpService {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;
    }

    static instance() {
        if (WarpService.m_instance === null) {
            WarpService.m_instance = new WarpService();
        }
        return WarpService.m_instance;
    }

    /**
     * 获取一个有效的折跃点坐标
     * @param type
     * @param near_gird_info
     * @param warp_point
     * @param warp_angle
     * @param check_radius
     * @return {*}
     */
    getValidWarpPoint(type, near_gird_info, warp_point, warp_angle, check_radius) {
        let valid_check_point = null;
        if (near_gird_info.nearest_grid_info && near_gird_info.distance < common.setting.base_map_grid_radius) {
            //从目标点开始编辑断层的合层内的所有单位 如果没有东西 则修正折跃坐标
            //按照 中心 左右下上 下左 下右 上左 上右 循序遍历
            let step = 0;
            while (valid_check_point === null) {
                this.getStepPoints(type, step, (x, y) => {
                    if (valid_check_point === null) {
                        let angle = common.func.getAngle(0, 0, x, y);
                        valid_check_point = this.getWarpPoint(near_gird_info, warp_point, warp_angle + angle, check_radius, step);
                    }
                }, this);
                step++;
            }
        }
        return valid_check_point || warp_point;
    }

    /**
     * 获取step的x,y矩阵,依次callback
     * @param type
     * @param step
     * @param callback
     * @param thisObj
     */
    getStepPoints(type, step, callback, thisObj) {
        switch (type) {
            case common.define.WARP_TYPE_FULL_8:
                //8个方向
                for (let y = -step; y <= step; y++) {
                    for (let x = -step; x <= step; x++) {
                        //只遍历最外圈
                        if (Math.abs(x) === step || Math.abs(y) === step) {
                            callback && callback.call(thisObj, x, y);
                        }
                    }
                }
                break;
            case common.define.WARP_TYPE_HINDER_5:
                //后5个方向
                for (let y = 0; y <= step; y++) {
                    for (let x = -step; x <= step; x++) {
                        //只遍历最外圈
                        if (Math.abs(x) === step || Math.abs(y) === step) {
                            callback && callback.call(thisObj, x, y);
                        }
                    }
                }
                break;
        }
    }

    /**
     * 获取一个点是否可以折跃 成功返回坐标 否则返回null
     * @param near_gird_info
     * @param warp_point
     * @param warp_angle
     * @param check_radius
     * @param step
     */
    getWarpPoint(near_gird_info, warp_point, warp_angle, check_radius, step) {
        let check = true;
        //获取检测坐标
        let check_point = common.func.anglePoint(warp_point.x, warp_point.y, warp_angle, check_radius * step);

        //遍历断层
        near_gird_info.nearest_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
            //遍历已存在的折跃特效
            check && map_grid_info.eachWarp((target_warp) => {
                //检测通过才继续检测
                if (check) {
                    let distance = common.func.getDistance(check_point.x, check_point.y, target_warp.x, target_warp.y);
                    //如果重叠
                    if (distance < check_radius + target_warp.radius * this.draw_ratio) {
                        // ff('检测失败 warp ', distance, check_point.x, check_point.y, target_warp.x, target_warp.y);
                        check = false;
                    }
                }
            }, this);
        }, this);

        //检测成功返回检测坐标 否则返回null
        return check ? check_point : null;
    }
}

WarpService.m_instance = null;

module.exports = WarpService;
