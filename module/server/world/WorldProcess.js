const m_server = require("../index");
const common = require("../../common");
const m_player = require("../../player");
const NearGalaxyInfo = require("./info/NearGalaxyInfo");
const S2CWorldScan = require("./protocol/S2CWorldScan");
const S2CWorldScanChange = require("./protocol/S2CWorldScanChange");

class WorldProcess {
    constructor() {
        //每分钟触发
        this.server_minutes = 60;
        //玩家合层检测半径
        this.check_move_distance_player = common.setting.base_map_grid_radius / 10;
        //NPC触发归位检测半径
        this.check_move_distance_npcer = common.setting.base_map_grid_radius / 2;
    }

    static instance() {
        if (WorldProcess.m_instance == null) {
            WorldProcess.m_instance = new WorldProcess();
        }
        return WorldProcess.m_instance;
    }

    /**
     * 每秒执行
     * @param server_second
     */
    serverWorldAction(server_second) {
        //构建本帧的缓存
        m_server.ServerMapMerge.buildMergeInfoArray();

        m_server.ServerMapPlayer.eachIndexUnitPlayer((unit_ship_player) => {
            if (unit_ship_player.getMapFrameStatus() === common.define.PLAYER_MAP_FRAME_STATUS_RUN) {
                let player_info = m_player.PlayerList.getPlayerInfo(unit_ship_player.unit_id);
                if (player_info) {
                    unit_ship_player.move_distance += unit_ship_player.speed;
                    if (unit_ship_player.move_distance > this.check_move_distance_player) {
                        unit_ship_player.move_distance = 0;

                        m_server.ServerMapManage.unitMoveGrid(unit_ship_player);
                        player_info.setPoint(unit_ship_player.x, unit_ship_player.y);

                        m_server.ServerWorldScan.reScanList(player_info, unit_ship_player);

                        unit_ship_player.triggerWorldPosition();
                    }
                }
            }
        }, this);
        //处理所有合并数据
        m_server.ServerMapMerge.eachMergeInfo((map_merge_info) => {
            // 这里其实取得是上一次 的激活状态
            if (map_merge_info.getIsActive()) {
                map_merge_info.eachGridInfo((map_grid_info) => {
                    map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                        if (unit_ship_npcer.getIsWarpStatus() === false) {
                            let distance = common.func.getDistance(unit_ship_npcer.x, unit_ship_npcer.y, unit_ship_npcer.birth_point_x, unit_ship_npcer.birth_point_y);
                            if (distance > this.check_move_distance_npcer) {
                                unit_ship_npcer.warpBirth();
                                //TODO 要不要呼叫周围的人一起折跃归位
                            }
                        }
                    }, this);
                }, this);
            }
        }, this);

        let this_unix_time = common.func.getUnixTime();

        //每次存储触发
        if (this_unix_time >= m_server.ServerParam.getParam('update_time')) {
            m_server.ServerParam.updateParam(this_unix_time);
            console.log('每次存储触发')
        }

        //每10秒触发
        if (server_second % 10 === 0) {
            m_player.PlayerList.eachPlayerInfo((player_info) => {
                if (this_unix_time >= player_info.dao.update_time) {
                    player_info.updateUpdateTime();
                    player_info.dbHandlePlayerInfo();
                }
            }, this);
        }

        //每分钟触发
        let this_minutes = common.func.getThisMinutes();
        if (this.server_minutes !== this_minutes) {
            this.server_minutes = this_minutes;
            //每分钟触发
            console.log('每分钟触发', this.server_minutes);

            //每整5分钟触发
            if (this_minutes % 5 === 0) {

                //触发刷新死亡空间
                m_server.ServerWorldDead.refreshWorldDead();
                console.log('每整5分钟触发')
            }

            //每小时触发
            if (this_unix_time >= m_server.ServerParam.getParam('end_time_hour')) {
                m_server.ServerParam.setParam('end_time_hour', common.func.getThisHourUnixTime());

                m_server.ServerList.setMaxServerIdService(false);
                console.log('每小时触发')
            }

            //每天触发
            if (this_unix_time >= m_server.ServerParam.getParam('end_time_day')) {
                m_server.ServerParam.setParam('end_time_day', common.func.getThisDayUnixTime());
                console.log('每天触发')
            }

            //每周触发
            if (this_unix_time >= m_server.ServerParam.getParam('end_time_week')) {
                m_server.ServerParam.setParam('end_time_week', common.func.getThisWeekUnixTime());
                console.log('每周触发')
            }
        }
    }
}

WorldProcess.m_instance = null;

module.exports = WorldProcess;

