const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const common = require("../../../common");
const S2CChangeShip = require("../../../player/protocol/S2CChangeShip");

class C2SMapControl extends BaseC2SProtocol {
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
        //靠近 环绕 进站  出站 折跃 移动到 锁定 等等
        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        let control = this.p_data.control;
        let grid_id = this.p_data.grid_id;
        let unit_type = this.p_data.type;
        let unit_id = this.p_data.id;
        if (!grid_id || !unit_type || !unit_id) {
            return;
        }

        switch (control) {
            case common.static.MAP_CONTROL_TYPE_FIGHT:
                let fight_unit_info = unit_ship_player.map_grid_info.map_merge_info.getGridUnitInfo(grid_id, unit_type, unit_id);

                if (!fight_unit_info) {
                    return;
                }

                //TODO 现在还能选择友军

                unit_ship_player.appoint_unit_type = unit_type;
                unit_ship_player.appoint_unit_id = unit_id;

                unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);

                break;
            case common.static.MAP_CONTROL_TYPE_STATION_JOIN:
                if (unit_type === common.static.MAP_UNIT_TYPE_STATION) {
                    let world_station_info = m_server.ServerWorldStation.getIndexStationInfo(unit_id);
                    if (!world_station_info) {
                        return;
                    }
                    if (unit_ship_player.getRun() === false) {
                        return;
                    }
                    if (unit_ship_player.berth_status === common.static.SHIP_BERTH_STATUS_JOIN || unit_ship_player.berth_status === common.static.SHIP_BERTH_STATUS_LEAVE) {
                        return;
                    }
                    //TODO 判断战斗状态什么的 否则无法进站什么的
                    unit_ship_player.berth_status = common.static.SHIP_BERTH_STATUS_JOIN;
                    unit_ship_player.berth_frame = common.setting.berth_static_frame;
                    //直接计算出最大推力
                    //计算我距离空间站的距离
                    let distance = common.func.getDistance(unit_ship_player.x, unit_ship_player.y, world_station_info.global_x, world_station_info.global_y);
                    // 获取一个空间站内圈 尽可能覆盖到舰船的位置 有修正值  不用这么麻烦 直接移动到 空间站中心附近就行
                    let move_frame_distance = distance / common.setting.berth_start_speed_frame / common.setting.base_run_frame;
                    //获取角度
                    let angle = common.func.getAngle(unit_ship_player.x, unit_ship_player.y, world_station_info.global_x, world_station_info.global_y);
                    //先不做进站特效了 直接掉头朝里
                    unit_ship_player.setTargetMoveAngle(angle);
                    //获取辅助力数值
                    unit_ship_player.auxiliary_point = common.func.anglePoint(0, 0, angle, move_frame_distance);
                    //设定空间站坐标
                    unit_ship_player.berth_end_x = world_station_info.global_x;
                    unit_ship_player.berth_end_y = world_station_info.global_y;
                    unit_ship_player.berth_station_id = unit_id;

                    unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);
                }
                break;
            case common.static.MAP_CONTROL_TYPE_STATION_LEAVE:
                //这个类型也没啥用
                if (unit_type === common.static.MAP_UNIT_TYPE_STATION) {
                    //TODO 少验证
                    unit_ship_player.berth_status = common.static.SHIP_BERTH_STATUS_LEAVE;
                    unit_ship_player.berth_frame = common.setting.berth_static_frame;
                    if (unit_ship_player.getStationId() === 0) {
                        return;
                    }
                    //调整角度转向
                    let world_station_info = m_server.ServerWorldStation.getIndexStationInfo(unit_ship_player.getStationId());
                    //获取 一个根据舰船直径紧贴空间站内圈的位置
                    //或者这个位置的坐标
                    //获取一个空间站半径+舰船直径的坐标
                    let end_distance = world_station_info.radius * this.draw_ratio + unit_ship_player.radius * 2 * this.draw_ratio;
                    //获取每帧移动最大速度
                    let move_frame_distance = Math.floor(end_distance / common.setting.berth_start_speed_frame / common.setting.base_run_frame);
                    //获取出站角度 掉头180度
                    let angle = common.func.formatAngle(unit_ship_player.rotation + 18000);
                    //设置玩家朝向
                    unit_ship_player.setTargetMoveAngle(angle);
                    //获取辅助力数值
                    unit_ship_player.auxiliary_point = common.func.anglePoint(0, 0, angle, move_frame_distance);

                    unit_ship_player.setStationId(0);
                    unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_BUILD);
                    unit_ship_player.syncUnitShipPlayer();
                    player_info.setPlayerShipValue(null, 'station_id', 0);

                    player_info.syncClientPlayerShip();
                }
                // 这应该是判断距离和是否在战斗 移动放到前端去处理
                //TODO
                // 规划一下要如何处理 先移动 再进站 还是 先折跃再进站

                // break;
                // }
                break;
            case common.static.MAP_CONTROL_TYPE_RAY:
                if (unit_ship_player.ray_frame) {
                    return;
                }
                // let ray_unit_info = null;
                // //TODO 这里没验证NPC和玩家还是建筑
                // //查到合层下的这个玩家或npc
                // unit_ship_player.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                //     ray_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id);
                // }, this);

                let ray_unit_info = unit_ship_player.map_grid_info.map_merge_info.getGridUnitInfo(grid_id, unit_type, unit_id);

                if (!ray_unit_info) {
                    return;
                }

                unit_ship_player.ray_unit_type = unit_type;
                unit_ship_player.ray_unit_id = unit_id;
                unit_ship_player.ray_frame = common.setting.base_ray_frame;

                unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);

                break;

        }
    }
}

module.exports = C2SMapControl;
