const m_server = require("../index");
const common = require("../../common");
const UnitShipPlayer = require("./info/UnitShipPlayer");
const UnitWarp = require("../map/info/UnitWarp");

/**
 * 地区单位控制类
 */
class ServerMapPlayer {
    constructor() {
        /**
         * 玩家数据列表索引,禁止遍历
         * @type {Object<number, UnitShipPlayer>}
         */
        this.unit_player_index_list = {};

        /**
         * @type {Array<UnitShipPlayer>}
         */
        this.unit_player_index_list_array = [];
    }

    static instance() {
        if (ServerMapPlayer.m_instance == null) {
            ServerMapPlayer.m_instance = new ServerMapPlayer();
        }
        return ServerMapPlayer.m_instance;
    }

    /**
     * TODO 移除方法还没做
     * @param {UnitShipPlayer} unit_ship_player
     * @constructor
     */
    AddUnitPlayerToIndexList(unit_ship_player) {
        this.unit_player_index_list[unit_ship_player.unit_id] = unit_ship_player;

        this.unit_player_index_list_array = Object.values(this.unit_player_index_list);
    }

    /**
     * 玩家离线 离开地图
     * @param {PlayerInfo} player_info
     */
    leaveUnitShipPlayer(player_info) {
        //TODO 玩家离线后不再登录 5分钟离开太空后 还没有把unit_ship_player信息同步到player_info 应不应该放在这里还不知道
        // let unit_ship_player = this.getIndexUnitPlayer(player_info.player_id);
        //???todo玩家下线了 就怎么了 回头查查
        // unit_ship_player.setMapFrameStatus(false);
        // this.syncPlayerInfo(player_info, unit_ship_player);
    }

    /**
     * @param player_id
     * @returns {UnitShipPlayer}
     */
    getIndexUnitPlayer(player_id) {
        return this.unit_player_index_list[player_id];
    }

    /**
     * 只在主线程遍历
     * @param {callbackUnitShipPlayer} callback
     * @param thisObj
     */
    eachIndexUnitPlayer(callback, thisObj) {
        //避免因为玩家切换断层导致遍历到多次
        for (let unit_ship_player of this.unit_player_index_list_array) {
            callback && callback.call(thisObj, unit_ship_player);
        }
    }

    /**
     * 创建舰船
     * @param {PlayerInfo} player_info
     * @returns {UnitShipPlayer}
     */
    joinUnitShipPlayer(player_info) {
        //新增路的玩家应该把数据放到某个缓存的地方 在action里 处理新增
        //似乎是不用 action是单线程 循序执行  那种非map方法 可以写在非action的任意地方
        let unit_ship_player = this.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            unit_ship_player = new UnitShipPlayer()
                .setPlayerInfo(player_info)
                .loadInfo();

            // ff(player_info);
            // dd(unit_ship_player.getClientUnitShipPlayer().weapons[0]);
            m_server.ServerMapManage.unitMoveGrid(unit_ship_player);
            this.AddUnitPlayerToIndexList(unit_ship_player);

            unit_ship_player.triggerWorldPosition();
            //TODO 把player_info赋值给 unit_ship_player 用于增加技能点
        }

        // if (player_info.dao.station_id) {
        //     unit_ship_player.setStationId(player_info.dao.station_id);
        // }
        unit_ship_player.setMapFrameStatus(common.define.PLAYER_MAP_FRAME_STATUS_JOIN);

        unit_ship_player.syncUnitShipPlayer();
        unit_ship_player.syncPlayerInfo();

        return unit_ship_player;
    }
}

ServerMapPlayer.m_instance = null;

module.exports = ServerMapPlayer;

