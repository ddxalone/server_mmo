const m_server = require("../index");
const common = require("../../common");
const m_demo = require("../../demo");
const S2CWorldScanChange = require("../world/protocol/S2CWorldScanChange");

class MapProcess {
    constructor() {
        this.base_server_frame = common.setting.base_server_frame;
        this.base_run_frame = common.setting.base_run_frame;

        //不设置这个数
        this.save_map_frame_start = 0;
        this.save_map_frame_count = 0;
    }

    static instance() {
        if (MapProcess.m_instance == null) {
            MapProcess.m_instance = new MapProcess();
        }
        return MapProcess.m_instance;
    }

    /**
     * 每逻辑遍历一次的主方法 200毫秒一次
     * @param server_frame
     */
    serverMapAction(server_frame) {
        //先处理地图数据更改
        //例如 断层 跨地图处理
        //通知所有用户断层更改
        // 先一帧一帧的发 不行的话发过去的2帧
        // 数据要尽可能压缩
        this.mapAction(server_frame);
        //每次运行6帧 是为了处理缓存等问题 但是就无法第一时间处理 新来的逻辑了 考虑一下
        //结论 我觉得0.2秒的延迟和统一处理完全没有问题
        // 貌似延迟有点高 前端要增加0.2秒延迟避免卡顿
        // 协议通讯后端滞留最多0.2秒 前端发送滞留0.1秒 就有0.5秒的延迟了
        for (let run_frame = 0; run_frame < this.base_run_frame; run_frame++) {
            this.frameAction(server_frame, run_frame);
        }
    }

    /**
     * 玩家进程处理帧同步通讯逻辑
     * @param server_frame
     */
    mapAction(server_frame) {
        /**
         * @type {PlayerLogin}
         */
        if (server_frame === 10) {
            this.server_player = new m_demo.DemoLogin(123).wsCreate();
        }
        this.server_player && this.server_player.runFrame(server_frame);
        // m_demo.RobotManage.run(server_frame);

        // ff('server_frame', server_frame)

        // m_server.ServerMapMerge.eachMergeInfo((map_merge_info) => {
        //     map_merge_info.setServerFrame(server_frame);
        //     map_merge_info.setIsActive(false);
        // }, this);

        //这里更变遍历方式 避免同一个玩家因为切换合层导致遍历多次
        m_server.ServerMapPlayer.eachIndexUnitPlayer((unit_ship_player) => {
            unit_ship_player.setServerFrame(server_frame)
                .scanExactHandle();

            //折跃要在发送消息前处理 折跃时通知前端同步更新断层
            if (unit_ship_player.shipWarp()) {
                unit_ship_player.setMapFrameMoveMerge(true);
            }
            //玩家死亡提前处理
            if (unit_ship_player.shipDeath()) {
                unit_ship_player.setMapFrameMoveMerge(true);
            }
        }, this);


        //构建本帧的缓存
        m_server.ServerMapMerge.buildMergeInfoArray();

        m_server.ServerMapMerge.eachMergeInfo((map_merge_info) => {
            map_merge_info.setServerFrame(server_frame);
            //更新断层活跃状态
            map_merge_info.updateActiveStatus();
            //更新激活状态
            map_merge_info.mapMergeActiveAction(server_frame);
            //如果地图处于激活状态
        }, this);

        //处理所有接收到的玩家操作,发送消息给客户端
        //处理所有合并数据
        m_server.ServerMapMerge.eachMergeInfo((map_merge_info) => {
            // let frame_actions = this.mapActionMessage(map_merge_info, server_frame);
            this.mapActionMessage(map_merge_info);
            //先执行结算 结算伤害 死亡状态等
            this.mapActionSettle(map_merge_info, server_frame);
            //结算了有单位移除 重构一下缓存
            map_merge_info.buildGridInfoArray();

            this.mapActionAction(map_merge_info, server_frame);

            //TODO 临时记录日志方法
            if (this.save_map_frame_start > 0) {
                this.save_map_frame_start--;
            } else if (this.save_map_frame_count > 0) {
                this.save_map_frame_count--;

                common.func.logMerge('info_' + map_merge_info.merge_id + '_' + server_frame + '_server', map_merge_info);
            }

        }, this);
    }

    /**
     * 收集map_merge的信息
     * @param map_merge_info
     */
    mapActionMessage(map_merge_info) {
        let frame_actions = {};
        //只要有一个玩家刚进入游戏 则获取全部客户端merge信息
        let player_map_frame_join_list = {};
        let has_player = false;
        map_merge_info.eachGridInfo((map_grid_info) => {
            map_grid_info.eachShipPlayer((unit_ship_player) => {
                if (unit_ship_player.checkFrameAction()) {
                    frame_actions[unit_ship_player.unit_id] = unit_ship_player.getFrameAction();
                    unit_ship_player.clearFrameAction();
                }
                //有某个玩家需要加载地图
                if (unit_ship_player.getMapFrameStatus() === common.define.PLAYER_MAP_FRAME_STATUS_JOIN) {
                    player_map_frame_join_list[unit_ship_player.unit_id] = true;
                }
                //折跃要在发送消息前处理 折跃时通知前端同步更新断层
                if (unit_ship_player.getMapFrameMoveMerge()) {
                    unit_ship_player.setMapFrameMoveMerge(false);
                    player_map_frame_join_list[unit_ship_player.unit_id] = true;
                }
                has_player || (has_player = true);
            }, this);
        }, this);

        if (has_player) {
            //清理单独通知玩家的信息类
            map_merge_info.clearClientPlayerFrameList();

            map_merge_info.setFrameActions(frame_actions);
            map_merge_info.setProtocolMapFrame();

            if (map_merge_info.getMergeStatus() || Object.keys(player_map_frame_join_list).length) {
                map_merge_info.setProtocolMapFrameFull();
            }

            //第二遍遍历发送协议
            map_merge_info.eachGridInfo((map_grid_info) => {
                map_grid_info.eachShipPlayer((unit_ship_player) => {
                    if (unit_ship_player.getMapFrameStatus() === common.define.PLAYER_MAP_FRAME_STATUS_JOIN) {
                        unit_ship_player.setMapFrameStatus(common.define.PLAYER_MAP_FRAME_STATUS_RUN);
                    }
                    if (map_merge_info.getMergeStatus() || player_map_frame_join_list[unit_ship_player.unit_id]) {
                        // ff('断层修改', server_frame, map_merge_info.getMergeStatus());
                        // ff('玩家加入', server_frame, unit_ship_player.unit_id, player_map_frame_join_list[unit_ship_player.unit_id])
                        map_merge_info.s2cMapFrameFull
                            .setPlayer(map_merge_info.getClientPlayerFrameUnit(unit_ship_player.unit_id))
                            .wsSendSuccess(unit_ship_player.player_uuid);
                    } else {
                        // ff('局部发送', server_frame)
                        map_merge_info.s2cMapFrame
                            .setPlayer(map_merge_info.getClientPlayerFrameUnit(unit_ship_player.unit_id))
                            .wsSendSuccess(unit_ship_player.player_uuid);
                    }
                    //通知自己的协议单独发送
                }, this);
            }, this);
        }
        //无论是否有玩家都需要清理单位
        map_merge_info.clearFrameUnit();

        map_merge_info.eachGridInfo((map_grid_info) => {
            //协议通知完了 再移除断层试一下效果
            //这个方法下有分离断层 所以单独遍历一次
            map_grid_info.removeSafeGridInfo();
        }, this);


        map_merge_info.setMergeStatus(false);

        // return frame_actions;
    }

    mapActionSettle(map_merge_info, server_frame) {
        map_merge_info.eachGridInfo((map_grid_info) => {
            map_grid_info.eachShipPlayer((unit_ship_player) => {
                unit_ship_player
                    .shipPlayerSettle();
            }, this);

            if (map_merge_info.getIsActive()) {
                map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                    unit_ship_npcer
                        .setServerFrame(server_frame)
                        .shipNpcerSettle();
                }, this);
            }

            map_grid_info.eachBullet((unit_bullet) => {
                unit_bullet.bulletSettle();
            }, this);

            map_grid_info.eachWarp((unit_warp) => {
                unit_warp
                    .warpSettle();
            }, this);


            map_grid_info.eachStation((unit_station) => {

            }, this);

            //信标结算每秒一次就行
            if (server_frame % this.base_server_frame === 0) {
                map_grid_info.eachDead((unit_dead) => {
                    unit_dead.deadSettle();
                }, this);
                map_grid_info.eachTask((unit_dead) => {
                    unit_dead.taskSettle();
                }, this);
            }

            map_grid_info.eachWreckage((unit_wreckage) => {
                unit_wreckage.wreckageSettle();
            }, this);

        }, this);
    }

    mapActionAction(map_merge_info, server_frame) {
        map_merge_info.eachGridInfo((map_grid_info) => {
            map_grid_info.eachShipPlayer((unit_ship_player) => {
                if (unit_ship_player.getRun()) {
                    //处理玩家动作
                    unit_ship_player.playerAction(map_merge_info.frame_actions[unit_ship_player.unit_id]);
                    unit_ship_player.shipPlayerAction();
                }
            }, this);
            if (map_merge_info.getIsActive()) {
                map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                    if (unit_ship_npcer.getRun()) {
                        unit_ship_npcer.shipNpcerAction();
                    }
                }, this);
            }
            map_grid_info.eachBullet((unit_bullet) => {
                if (unit_bullet.getRun()) {
                    unit_bullet.bulletAction();
                }
            }, this);
            // map_grid_info.eachWarp((unit_warp) => {
            //     if (unit_warp.getRun()) {
            //         unit_warp.warpAction();
            //     }
            // }, this);
        }, this);
    }

    /**
     * 地图处理主线程
     * @param server_frame
     * @param run_frame
     */
    frameAction(server_frame, run_frame) {
        //地图帧
        // let map_frame = server_frame * this.base_run_frame + run_frame;

        //按照断层分组开始处理地图逻辑
        //处理所有合并数据
        m_server.ServerMapMerge.eachMergeInfo((map_merge_info) => {
            map_merge_info.eachGridInfo((map_grid_info) => {
                map_grid_info.eachShipPlayer((unit_ship_player) => {
                    if (unit_ship_player.getRun()) {
                        unit_ship_player.shipMove();
                    }
                }, this);
                map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                    if (unit_ship_npcer.getRun()) {
                        unit_ship_npcer.shipMove();
                    }

                    // let time = common.func.getUnixMTime();
                    // for (let i = 0; i < 10000; i++) {
                    //     m_server.DropService.createNpcerWreckage(unit_ship_npcer);
                    // }
                    // dd('end',m_server.DropService.test, common.func.getUnixMTime() - time);
                }, this);
                map_grid_info.eachStation((unit_station) => {
                }, this);
                map_grid_info.eachBullet((unit_bullet) => {
                    if (unit_bullet.getRun() || (unit_bullet.getDeath() && unit_bullet.draw_less_frame > 0)) {
                        unit_bullet.bulletMove();
                    }
                }, this);
            }, this);
        }, this);
    }
}

MapProcess.m_instance = null;

module.exports = MapProcess;

