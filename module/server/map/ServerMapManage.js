const m_server = require("../index");
const common = require("../../common");
const NearGridInfo = require("./info/NearGridInfo");
const NearGalaxyInfo = require("../world/info/NearGalaxyInfo");

class ServerMapManage {
    constructor() {
        //地图唯一编号
        // this.map_unit_id = 1000;
    }

    static instance() {
        if (ServerMapManage.m_instance == null) {
            ServerMapManage.m_instance = new ServerMapManage();
        }
        return ServerMapManage.m_instance;
    }

    // getMapUnitId() {
    //     return this.map_unit_id++;
    // }

    /**
     * 初始化地图信息
     */
    initMapInfo() {
        m_server.ServerMapBlock.initServerMapBlock();
        //初始化地图其他信息
    }

    /**
     * 单位移动断层
     * @param base_unit
     * @param status 当移动时是否触发前端更新
     */
    unitMoveGrid(base_unit, status = false) {
        //获取最近的断层和列表和距离
        let near_gird_info = new NearGridInfo(base_unit.x, base_unit.y).getNearGridInfo();

        // ff('base_unit', base_unit)
        // ff('near_gird_info', near_gird_info);
        //最近的断层存在 且在断层1/2距离内 加入断层
        if (near_gird_info.nearest_grid_info && near_gird_info.distance < common.setting.base_map_grid_radius / 2) {
            //如果我只是简单的加入此断层 需要通知我自己 这个合层所有的状态 旧断层所有移除
            base_unit.moveSafeGridInfo(near_gird_info.nearest_grid_info, status);
        } else {
            let near_galaxy_info = new NearGalaxyInfo(base_unit.x, base_unit.y).getNearGalaxyInfo().getNearestBeaconInfo();
            let grid_x = base_unit.x;
            let gird_y = base_unit.y;
            //如果1/2断层范围内有信标 调整新建断层坐标到这个信标
            //然后开始处理这个信标 空间站 个人任务 空间信号
            if (near_galaxy_info.grid_beacon_type) {
                grid_x = near_galaxy_info.grid_beacon_info.global_x;
                gird_y = near_galaxy_info.grid_beacon_info.global_y;
            }

            //创建新断层 修正坐标
            let new_grid_info = m_server.ServerMapBlock.createMapBlockGridInfo(grid_x, gird_y, near_galaxy_info.nearest_galaxy_info);

            //周围是否有断层
            if (near_gird_info.checkNearGirdList()) {
                //合并合层并返回第一个可用的合层
                let map_merge_info = near_gird_info.mergeMapMergeInfo();
                //把新断层放到merge里
                map_merge_info.addGridInfo(new_grid_info);
                //这是这个合并状态为修改过
                map_merge_info.setMergeStatus(true);
                //分离断层
                this.separateMergeGridInfo(map_merge_info);
            } else {
                //创建合层
                let map_merge_info = m_server.ServerMapMerge.createMapMergeInfo(new_grid_info.grid_id);
                //把新断层放到新merge里
                map_merge_info.addGridInfo(new_grid_info);
                //这是这个合并状态为修改过
                map_merge_info.setMergeStatus(true);
            }

            if (near_galaxy_info.grid_beacon_type) {
                switch (near_galaxy_info.grid_beacon_type) {
                    case common.static.WORLD_UNIT_TYPE_STATION:
                        m_server.ServerWorldStation.initWorldStation(near_galaxy_info.grid_beacon_info, new_grid_info);
                        break;
                    case common.static.WORLD_UNIT_TYPE_DEAD:
                        //获取死亡空间信息
                        m_server.ServerWorldDead.initWorldDeadDetail(near_galaxy_info.grid_beacon_info, new_grid_info);
                        break;
                    case common.static.WORLD_UNIT_TYPE_TASK:
                        //初始化任务空间
                        m_server.ServerWorldTask.initWorldTaskDetail(near_galaxy_info.grid_beacon_info, new_grid_info);
                        break;
                }
            }

            //玩家移动到新断层后 旧断层会删除
            base_unit.moveSafeGridInfo(new_grid_info, status);
        }
    }

    /**
     * 分离断层逻辑处理
     * @param {MapMergeInfo} map_merge_info
     */
    separateMergeGridInfo(map_merge_info) {
        //递归断层分离 直到没有callback
        let separate_status = null;
        let separate_map_merge_info = null;

        map_merge_info.buildGridInfoArray(false);

        //如果是移除断层触发的分离 则map_grid_list有可能为空
        if ((map_merge_info.checkMapGridList())) {
            let while_count = 0;
            do {
                while_count++;
                if (while_count > 100) {
                    dd('死循环了');
                }
                separate_status = null;
                separate_map_merge_info = null;

                map_merge_info.separateGridInfo((separate_grid_info, status) => {
                    //获取第一个 true是一个断层 false可能为多个需要递归
                    separate_status === null && (separate_status = status);
                    //处理非第一个的类型
                    if (separate_status !== status) {
                        if (separate_map_merge_info === null) {
                            if (m_server.ServerMapMerge.getMapMergeInfo(separate_grid_info.grid_id)) {
                                dd('这个grid_id不应该有merge信息',
                                    separate_grid_info.grid_id,
                                    m_server.ServerMapMerge.getMapMergeInfo(separate_grid_info.grid_id)
                                )
                            }
                            separate_map_merge_info = m_server.ServerMapMerge.createMapMergeInfo(separate_grid_info.grid_id);
                            //这是这个合并状态为修改过
                            map_merge_info.setMergeStatus(true);
                            separate_map_merge_info.setMergeStatus(true);
                        }
                        // ff('分离断层 断层ID:' + separate_grid_info.grid_id + ' => 从' + map_merge_info.merge_id + '到' + separate_map_merge_info.merge_id)
                        map_merge_info.removeGridInfo(separate_grid_info.grid_id);
                        separate_map_merge_info.addGridInfo(separate_grid_info);
                    }
                }, this);

                //如果 separate_status为true 那么 separate_map_merge_info可能是多个
                //如果 separate_status为false 那么 map_merge_info可能是多个
                if (separate_status === true) {
                    map_merge_info = separate_map_merge_info;
                }
            } while (map_merge_info);
        }
    }
}

ServerMapManage.m_instance = null;

module.exports = ServerMapManage;

