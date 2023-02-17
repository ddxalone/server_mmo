const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const WarpInfo = require("../../map/info/WarpInfo");
const NearGridInfo = require("../../map/info/NearGridInfo");

class C2SWorldWarp extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
    }

    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }

        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        if (this.p_data.type && this.p_data.id) {
            switch (this.p_data.type) {
                case common.static.WORLD_UNIT_TYPE_DEAD:
                    let world_dead_info = m_server.ServerWorldDead.getIndexDeadInfo(this.p_data.id);

                    //死亡空间不存在 则拦截协议
                    if (!world_dead_info) {
                        return;
                    }

                    //正在折跃不处理
                    if (unit_ship_player.getIsWarpStatus()) {
                        return;
                    }

                    /**
                     * 停靠状态不处理
                     */
                    if (!unit_ship_player.getRun()) {
                        return;
                    }

                    //todo 折跃时间换算
                    //死亡空间半径 暂时都按照断层的一半来处理
                    //暂定死亡空间的舰船刷新在 死亡空间的一边
                    //折跃的时候都折跃到信标终点周围 避免直接搞进怪堆里 或者折跃后位置太散 再或者保存地点再折跃效果不一致等等

                    let dead_warp_point = common.func.Point(world_dead_info.global_x, world_dead_info.global_y);

                    let dead_warp_angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, dead_warp_point.x, dead_warp_point.y);

                    let dead_check_point = common.func.anglePoint(dead_warp_point.x, dead_warp_point.y, dead_warp_angle - 18000, common.define.DEAD_WARP_INTERCEPT_RANGE * this.draw_ratio);

                    //创建折跃点单位
                    let dead_warp_info = new WarpInfo()
                        .setUnitType(unit_ship_player.unit_type)
                        .setPoint(dead_check_point)
                        .setMassRatio(unit_ship_player.mass_ratio)
                        .setRadius(unit_ship_player.radius)
                        .updateShipWarpFrame();

                    //重新计算dead_warp_angle
                    dead_warp_angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, dead_check_point.x, dead_check_point.y);
                    unit_ship_player.beginWarpAction(dead_warp_info, dead_warp_angle);

                    m_server.ServerMapUnit.joinUnitWarp(dead_warp_info);
                    break;
                case common.static.WORLD_UNIT_TYPE_STATION:
                    let world_station_info = m_server.ServerWorldStation.getIndexStationInfo(this.p_data.id);
                    //空间站不存在 则拦截协议
                    if (!world_station_info) {
                        return;
                    }

                    //正在折跃不处理
                    if (unit_ship_player.getIsWarpStatus()) {
                        return;
                    }

                    /**
                     * 停靠状态不处理
                     */
                    if (!unit_ship_player.getRun()) {
                        return;
                    }

                    //todo 折跃时间换算
                    // 空间站折跃坐标的计算方式
                    // 断层会产生在空间站中心 空间大小会有限制 所以这块没问题
                    // 折跃会获取空间站半径的最近点 以此点 向后遍历获取折跃点

                    //获取空间站坐标
                    let station_warp_point = common.func.Point(world_station_info.global_x, world_station_info.global_y);
                    //计算玩家距离空间站的角度
                    let station_warp_angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, station_warp_point.x, station_warp_point.y);
                    //代入空间站半径后计算最终落点
                    let station_check_point = common.func.anglePoint(station_warp_point.x, station_warp_point.y, station_warp_angle - 18000, world_station_info.radius * this.draw_ratio);

                    //创建折跃点单位
                    let station_warp_info = new WarpInfo()
                        .setUnitType(unit_ship_player.unit_type)
                        .setPoint(station_check_point)
                        .setMassRatio(unit_ship_player.mass_ratio)
                        .setRadius(unit_ship_player.radius)
                        .updateShipWarpFrame();

                    //重新计算station_warp_angle
                    station_warp_angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, station_check_point.x, station_check_point.y);
                    unit_ship_player.beginWarpAction(station_warp_info, station_warp_angle);

                    m_server.ServerMapUnit.joinUnitWarp(station_warp_info);
                    break;
                case common.static.WORLD_UNIT_TYPE_TASK:
                    let player_task = player_info.getPlayerTask(this.p_data.id);
                    //玩家任务不存在 则拦截协议
                    if (!player_task) {
                        return;
                    }

                    //正在折跃不处理
                    if (unit_ship_player.getIsWarpStatus()) {
                        return;
                    }

                    /**
                     * 停靠状态不处理
                     */
                    if (!unit_ship_player.getRun()) {
                        return;
                    }

                    let world_task_info = m_server.ServerWorldTask.getIndexTaskInfo(player_task.task_id);
                    if (!world_task_info) {
                        // 如果世界信息不存在 则获取新的坐标 并创建任务空间
                        //初步构想 获取任务坐标 判断任务坐标是否能放下 不能的话重新找一个坐标
                        world_task_info = m_server.ServerWorldTask.createServerTaskInfo(player_task);
                    }

                    let task_warp_point = common.func.Point(world_task_info.global_x, world_task_info.global_y);

                    // ff('task_warp_point', task_warp_point);
                    //计算玩家距离空间站的角度
                    let task_warp_angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, task_warp_point.x, task_warp_point.y);
                    //代入空间站半径后计算最终落点
                    let task_check_point = common.func.anglePoint(task_warp_point.x, task_warp_point.y, task_warp_angle - 18000, common.define.DEAD_WARP_INTERCEPT_RANGE * this.draw_ratio);

                    //创建折跃点单位
                    let task_warp_info = new WarpInfo()
                        .setUnitType(unit_ship_player.unit_type)
                        .setPoint(task_check_point)
                        .setMassRatio(unit_ship_player.mass_ratio)
                        .setRadius(unit_ship_player.radius)
                        .updateShipWarpFrame();

                    //重新计算task_warp_angle
                    task_warp_angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, task_check_point.x, task_check_point.y);
                    unit_ship_player.beginWarpAction(task_warp_info, task_warp_angle);

                    m_server.ServerMapUnit.joinUnitWarp(task_warp_info);
                    break;
            }
        } else {
            //取消折跃 只有折跃中可取消
            //改规则  折跃全过程都会取消 但是好像会报错
            if (unit_ship_player.warp_status === common.static.SHIP_WARP_STATUS_WARPING || unit_ship_player.warp_status === common.static.SHIP_WARP_STATUS_START) {

                //TODO  在折跃状态 这个可能报错getWarpTargetId不存在
                //移除特效 修改状态
                let unit_warp = m_server.ServerMapUnit.getIndexUnitWarp(unit_ship_player.getWarpTargetId());
                m_server.ServerMapUnit.leaveUnitWarp(unit_warp, common.static.MAP_FRAME_TYPE_LEAVE);

                unit_ship_player.stopWarpAction();
            }
        }
    }

}

module.exports = C2SWorldWarp;
