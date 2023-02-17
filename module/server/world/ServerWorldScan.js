const m_server = require("../../server");
const m_player = require("../../player");
const common = require("../../common");
const ScanBeaconInfo = require("./info/ScanBeaconInfo");
const NearGalaxyInfo = require("./info/NearGalaxyInfo");
const NearGridInfo = require("../map/info/NearGridInfo");
const S2CWorldScanChange = require("./protocol/S2CWorldScanChange");
const S2CWorldScan = require("./protocol/S2CWorldScan");

/**
 * 玩家任务管理器
 * @class {ServerWorldScan}
 */
class ServerWorldScan {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;

    }

    static instance() {
        if (ServerWorldScan.m_instance == null) {
            ServerWorldScan.m_instance = new ServerWorldScan();
        }
        return ServerWorldScan.m_instance;
    }

    /**
     * 重新扫描 因为要获取扫描范围加成 所以放到这里处理
     */
    reScanList(player_info, unit_ship_player) {
        //TODO rescan的时候 如果旧的存在 需要把旧的信息递归过来 距离要不要重算没想好
        //登录map_grid协议 移动一段距离 折跃 死亡 4个地方触发重新扫描事件
        let near_beacon_list = new NearGalaxyInfo(unit_ship_player.x, unit_ship_player.y)
            .getNearGalaxyInfo()
            .getNearScanBeaconList(unit_ship_player);

        //遍历周围的断层 这里并没有把所有断层的合层丢到一起来处理 只是简单的处理周围的断层
        let near_grid_beacon_list = new NearGridInfo(unit_ship_player.x, unit_ship_player.y)
            // .getNearWorldGridInfo()
            .getNearScanBeaconList(unit_ship_player);

        Object.assign(near_beacon_list, near_grid_beacon_list);

        near_beacon_list = player_info.player_variable.setScanList(near_beacon_list);

        new S2CWorldScan()
            .setInfo(this.getClientScanBeaconInfos(near_beacon_list))
            .wsSendSuccess(player_info.player_uuid);
    }

    /**
     * 获取客户端扫描信息
     * @param near_beacon_list
     * @returns {{}}
     */
    getClientScanBeaconInfos(near_beacon_list) {
        let client_near_beacon_list = {};
        for (let type in near_beacon_list) {
            client_near_beacon_list[type] = {};
            for (let id in near_beacon_list[type]) {
                client_near_beacon_list[type][id] = near_beacon_list[type][id].getClientScanBeaconInfo();
            }
        }
        return client_near_beacon_list;
    }

    /**
     * 通知周围其他玩家舰船扫描信号变更
     * @param type
     * @param unit_info
     */
    noticeUnitScan(type, unit_info) {
        //遍历周围的断层
        new NearGridInfo(unit_info.x, unit_info.y)
            .eachNearBlockGetGridInfo((map_grid_info) => {
                map_grid_info.eachShipPlayer((unit_ship_player) => {
                    let distance = common.func.getDistance(unit_info.x, unit_info.y, unit_ship_player.x, unit_ship_player.y);
                    if (distance < Math.floor(common.setting.base_scan_range * unit_ship_player.scan_range_per / 100)) {
                        let scan_beacon_info = this.createScanBeaconInfo(type, unit_ship_player, distance, unit_info);
                        unit_ship_player.player_info.player_variable.addScanList(scan_beacon_info);

                        new S2CWorldScanChange()
                            .setType(common.static.CHANGE_TYPE_BUILD)
                            .setInfo(scan_beacon_info.getClientScanBeaconInfo())
                            .wsSendSuccess(unit_ship_player.player_uuid);
                    }
                }, this);
            }, this);


        // m_player.PlayerList.eachPlayerInfo((player_info) => {
        //     let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        //     if (unit_ship_player && unit_ship_player.getRun()) {
        //         let distance = common.func.getDistance(unit_info.x, unit_info.y, unit_ship_player.x, unit_ship_player.y);
        //         if (distance < Math.floor(common.setting.base_scan_range * unit_ship_player.scan_range_per / 100)) {
        //             let scan_beacon_info = this.createScanBeaconInfo(type, unit_ship_player, distance, unit_info);
        //             player_info.player_variable.addScanList(scan_beacon_info);
        //
        //             new S2CWorldScanChange()
        //                 .setType(common.static.CHANGE_TYPE_BUILD)
        //                 .setInfo(scan_beacon_info.getClientScanBeaconInfo())
        //                 .wsSendSuccess(player_info.player_uuid);
        //         }
        //     }
        // }, this);
    }

    /**
     * 通知周围其他玩家世界信号变更
     * @param type
     * @param world_info
     */
    noticeWorldScan(type, world_info) {
        //如何找到周围的玩家
        //这里可能不用这个方法 这里想办法直接获取player_info的信息得了 再想想
        //是遍历所有玩家 还是
        // let near_gird_info = new NearGridInfo(world_info.global_x, world_info.global_y).getNearWorldGridInfo();
        // near_gird_info.eachNearGridListGetGridInfo((map_grid_info) => {
        //     map_grid_info.eachShipPlayer((unit_ship_player) => {
        //         let distance = common.func.getDistance(world_info.global_x, world_info.global_y, unit_ship_player.x, unit_ship_player.y);
        //         if (distance < common.setting.base_scan_range * unit_ship_player.scan_range_per) {
        //
        //         }
        //     }, this);
        // }, this);

        new NearGridInfo(world_info.x, world_info.y)
            .eachNearBlockGetGridInfo((map_grid_info) => {
                map_grid_info.eachShipPlayer((unit_ship_player) => {
                    let distance = common.func.getDistance(world_info.global_x, world_info.global_y, unit_ship_player.x, unit_ship_player.y);
                    if (distance < Math.floor(common.setting.base_scan_range * unit_ship_player.scan_range_per / 100)) {
                        let scan_beacon_info = this.createScanBeaconInfo(type, unit_ship_player, distance, world_info);
                        unit_ship_player.player_info.player_variable.addScanList(scan_beacon_info);

                        new S2CWorldScanChange()
                            .setType(common.static.CHANGE_TYPE_BUILD)
                            .setInfo(scan_beacon_info.getClientScanBeaconInfo())
                            .wsSendSuccess(unit_ship_player.player_uuid);
                    }
                }, this);
            }, this);

        // m_player.PlayerList.eachPlayerInfo((player_info) => {
        //     let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        //     if (unit_ship_player && unit_ship_player.getRun()) {
        //         let distance = common.func.getDistance(world_info.global_x, world_info.global_y, unit_ship_player.x, unit_ship_player.y);
        //         if (distance < Math.floor(common.setting.base_scan_range * unit_ship_player.scan_range_per / 100)) {
        //             let scan_beacon_info = this.createScanBeaconInfo(type, unit_ship_player, distance, world_info);
        //             player_info.player_variable.addScanList(scan_beacon_info);
        //
        //             new S2CWorldScanChange()
        //                 .setType(common.static.CHANGE_TYPE_BUILD)
        //                 .setInfo(scan_beacon_info.getClientScanBeaconInfo())
        //                 .wsSendSuccess(player_info.player_uuid);
        //         }
        //     }
        // }, this);
    }

    createScanBeaconInfo(type, unit_ship_player, distance, world_info) {
        let scan_beacon_info = new ScanBeaconInfo(unit_ship_player);
        scan_beacon_info.setDistance(distance);
        switch (type) {
            case common.static.WORLD_UNIT_TYPE_SHIP_PLAYER:
                scan_beacon_info.setType(type);
                // scan_beacon_info.setSubType(world_info.dao.dead_type);
                scan_beacon_info.setId(world_info.unit_id);
                scan_beacon_info.setName(world_info.ship_type);
                scan_beacon_info.setRadius(world_info.radius);

                //如果 扫描强度为100% 则通知坐标给前端 用于刷新KM数
                // scan_beacon_info.setPoint(world_info.x, world_info.y);
                break;
            case common.static.WORLD_UNIT_TYPE_DEAD:
                //这个未来要创建一个类 结构也需要再优化一下
                //还有再次扫描的时候要怎么处理 是否初始化
                scan_beacon_info.setType(type);
                // scan_beacon_info.setSubType(world_info.dao.dead_type);
                scan_beacon_info.setId(world_info.dead_id);
                scan_beacon_info.setName(world_info.name);
                scan_beacon_info.setRadius(world_info.radius);

                //如果 扫描强度为100% 则通知坐标给前端 用于刷新KM数
                // scan_beacon_info.setPoint(world_info.global_x, world_info.global_y);
                //TODO 这个肯定有问题  也不知道干嘛用的 先注掉
                // this.scan_beacon_list[scan_beacon_info.dead_id] = scan_beacon_info;
                break;
            case common.static.WORLD_UNIT_TYPE_STATION:
                //这个未来要创建一个类 结构也需要再优化一下
                //还有再次扫描的时候要怎么处理 是否初始化
                scan_beacon_info.setType(type);
                // scan_beacon_info.setSubType(0);
                scan_beacon_info.setId(world_info.station_id);
                scan_beacon_info.setName(world_info.dao.name);
                scan_beacon_info.setRadius(world_info.radius);

                //如果 扫描强度为100% 则通知坐标给前端 用于刷新KM数
                // scan_beacon_info.setPoint(world_info.global_x, world_info.global_y);
                // this.scan_beacon_list[scan_beacon_info.station_id] = scan_beacon_info;
                break;
            case common.static.WORLD_UNIT_TYPE_TASK:
                //这个未来要创建一个类 结构也需要再优化一下
                //还有再次扫描的时候要怎么处理 是否初始化
                scan_beacon_info.setType(type);
                // scan_beacon_info.setSubType(0);
                scan_beacon_info.setId(world_info.task_id);
                scan_beacon_info.setName(world_info.name);
                scan_beacon_info.setRadius(world_info.radius);

                //如果 扫描强度为100% 则通知坐标给前端 用于刷新KM数
                // scan_beacon_info.setPoint(world_info.global_x, world_info.global_y);
                // this.scan_beacon_list[scan_beacon_info.station_id] = scan_beacon_info;
                break;
        }
        return scan_beacon_info;
    }

}

ServerWorldScan.m_instance = null;

module.exports = ServerWorldScan;

