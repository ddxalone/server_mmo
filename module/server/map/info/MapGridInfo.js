const m_server = require("../../../server");
const common = require("../../../common");
const UnitBulletAmmo = require("./UnitBulletAmmo");
const UnitBulletGuide = require("./UnitBulletGuide");
const UnitBulletLaser = require("./UnitBulletLaser");
const UnitDead = require("./UnitDead");
const UnitTask = require("./UnitTask");
const UnitWreckage = require("./UnitWreckage");

/**
 * @callback callbackMapGridInfo
 * @param {MapGridInfo} map_grid_info
 */

/**
 * 地图断层信息
 * @class {MapGridInfo}
 */
class MapGridInfo {
    constructor(grid_id, x, y) {
        this.grid_id = grid_id;
        this.x = x;
        this.y = y;
        this.map_key = common.func.getMapKey(x, y);
        //断层合并ID不能为空 初始化为当前断层ID
        // this.merge_id = grid_id;
        //合并的指针直接赋值
        /**
         * @type {MapMergeInfo}
         */
        this.map_merge_info = null;
        //安全等级
        this.safe = 0;
        //所属恒星系
        this.galaxy_id = 0;

        //记录每个逻辑帧该做的操作 每个逻辑帧用完以后清空这个数据
        //1 玩家加入断层 在unit_info增加标记
        // 玩家离开断层 放到frame_unit里
        //2 NPC加入断层 在unit_info增加标记
        // NPC离开断层 放到frame_unit里
        //建筑加入断层 在unit_info增加标记
        //断层被合并 需要把合并的断层信息放到这里
        //断层合并  需要把被合并的断层信息放到这里
        //暂时不做断层分离 玩家在的时候断层不消失

        //舰船列表
        /**
         * @type {Object<number, UnitShipPlayer>}
         */
        this.map_unit_ship_player_list = {};
        /**
         * @type {Array<UnitShipPlayer>}
         */
        this.map_unit_ship_player_list_array = [];
        /**
         * @type {Object<number, UnitShipNpcer>}
         */
        this.map_unit_ship_npcer_list = {};
        /**
         * @type {Array<UnitShipNpcer>}
         */
        this.map_unit_ship_npcer_list_array = [];
        //建筑列表
        /**
         * @type {Object<number, UnitStation>}
         */
        this.map_unit_station_list = {};
        /**
         * @type {Array<UnitStation>}
         */
        this.map_unit_station_list_array = [];
        /**
         * @type {Object<number, Object<number, UnitBullet>>}
         */
        this.map_unit_bullet_list = {};
        /**
         * @type {Array<Array<UnitBullet>>}
         */
        this.map_unit_bullet_list_array = [];
        /**
         * @type {Object<number, UnitWarp>}
         */
        this.map_unit_warp_list = {};
        /**
         * @type {Array<UnitWarp>}
         */
        this.map_unit_warp_list_array = [];

        /**
         * @type {Object<number, UnitDead>}
         */
        this.map_unit_dead_list = {};
        /**
         * @type {Array<UnitDead>}
         */
        this.map_unit_dead_list_array = [];

        /**
         * @type {Object<number, UnitTask>}
         */
        this.map_unit_task_list = {};
        /**
         * @type {Array<UnitTask>}
         */
        this.map_unit_task_list_array = [];

        /**
         * @type {Object<number, UnitWreckage>}
         */
        this.map_unit_wreckage_list = {};
        /**
         * @type {Array<UnitWreckage>}
         */
        this.map_unit_wreckage_list_array = [];


        //矿物列表
        this.mapUnitMineralList = {};
        //碰撞体列表
        this.mapUnitCollideList = {};

        //当前断层的玩家状态
        this.grid_frame_units = {};
    }

    // setMergeId(merge_id) {
    //     this.merge_id = merge_id;
    // }

    setMapMergeInfo(map_merge_info) {
        this.map_merge_info = map_merge_info;
        // this.setMergeId(map_merge_info.merge_id);
    }

    setSafe(safe) {
        this.safe = safe;
    }

    setGalaxyId(galaxy_id) {
        this.galaxy_id = galaxy_id;
    }

    clearGridFrameUnit() {
        this.grid_frame_units = {};
    }

    /**
     * 初始化断层状态数组
     * @param unit_info 单位信息
     * @param type 事件类型
     * @returns {*}
     */
    addFrameUnit(unit_info, type) {
        //这里直接赋值 unit_info会不会好点 不行 新旧断层都要存储这个信息
        this.grid_frame_units[unit_info.unit_type] || (this.grid_frame_units[unit_info.unit_type] = {});
        //时间类型优先级判断 exist优先级最低
        //如果任意更新类型存在并且当前状态是exist 则跳过
        if (type === common.static.MAP_FRAME_TYPE_EXIST && this.grid_frame_units[unit_info.unit_type][unit_info.unit_id]) {
        } else {
            this.grid_frame_units[unit_info.unit_type][unit_info.unit_id] = type;
        }
    }

    /**
     * 添加单位到断层
     * @param {UnitShipPlayer|UnitBullet|UnitShipNpcer|UnitStation|UnitWarp|UnitDead|UnitTask|UnitWreckage|BaseUnit} unit_info
     * @param frame_type
     */
    addUnitInfo(unit_info, frame_type = null) {
        unit_info.setGridId(this.grid_id);
        // unit_info.setMapKey(this.map_key);
        unit_info.setMapGridInfo(this);
        // unit_info.setMapMergeInfo(this.map_merge_info);
        switch (unit_info.unit_type) {
            case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                this.map_unit_ship_player_list[unit_info.unit_id] = unit_info;
                this.addFrameUnit(unit_info, frame_type);
                break;
            case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                this.map_unit_ship_npcer_list[unit_info.unit_id] = unit_info;
                this.addFrameUnit(unit_info, frame_type);
                break;
            case common.static.MAP_UNIT_TYPE_STATION:
                this.map_unit_station_list[unit_info.unit_id] = unit_info;
                break;
            case common.static.MAP_UNIT_TYPE_BULLET:
                this.map_unit_bullet_list[unit_info.unit_group_id] || (this.map_unit_bullet_list[unit_info.unit_group_id] = {});
                this.map_unit_bullet_list[unit_info.unit_group_id][unit_info.unit_id] = unit_info;
                break;
            case common.static.MAP_UNIT_TYPE_WARP:
                this.map_unit_warp_list[unit_info.unit_id] = unit_info;
                this.addFrameUnit(unit_info, frame_type);
                break;
            case common.static.MAP_UNIT_TYPE_DEAD:
                this.map_unit_dead_list[unit_info.unit_id] = unit_info;
                break;
            case common.static.MAP_UNIT_TYPE_TASK:
                this.map_unit_task_list[unit_info.unit_id] = unit_info;
                break;
            case common.static.MAP_UNIT_TYPE_WRECKAGE:
                this.map_unit_wreckage_list[unit_info.unit_id] = unit_info;
                break;
        }
    }

    /**
     * 获取单位
     * @param unit_type
     * @param unit_id
     * @returns {UnitShipPlayer|UnitBullet|UnitShipNpcer|UnitStation|UnitWarp|UnitDead|UnitTask|UnitWreckage}
     */
    getUnitInfo(unit_type, unit_id) {
        switch (unit_type) {
            case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                return this.map_unit_ship_player_list[unit_id];
            case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                return this.map_unit_ship_npcer_list[unit_id];
            case common.static.MAP_UNIT_TYPE_STATION:
                return this.map_unit_station_list[unit_id];
            // case common.static.MAP_UNIT_TYPE_BULLET:
            //     return this.map_unit_bullet_list[unit_id];
            case common.static.MAP_UNIT_TYPE_WARP:
                return this.map_unit_warp_list[unit_id];
            case common.static.MAP_UNIT_TYPE_DEAD:
                return this.map_unit_dead_list[unit_id];
            case common.static.MAP_UNIT_TYPE_TASK:
                return this.map_unit_task_list[unit_id];
            case common.static.MAP_UNIT_TYPE_WRECKAGE:
                return this.map_unit_wreckage_list[unit_id];
        }
    }

    /**
     * 移除一个单位到当前断层
     * @param {BaseUnit|UnitBullet} unit_info
     * @param frame_type
     */
    removeUnitInfo(unit_info, frame_type = null) {
        switch (unit_info.unit_type) {
            case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                //移除单位时 只有离开通知前端 死亡不通知前端前端自行处理
                // this.map_unit_ship_player_list[unit_info.unit_id] = null;
                delete this.map_unit_ship_player_list[unit_info.unit_id];
                break;
            case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                // this.map_unit_ship_npcer_list[unit_info.unit_id] = null;
                delete this.map_unit_ship_npcer_list[unit_info.unit_id];
                break;
            case common.static.MAP_UNIT_TYPE_STATION:
                // this.map_unit_station_list[unit_info.unit_id] = null;
                delete this.map_unit_station_list[unit_info.unit_id];
                break;
            case common.static.MAP_UNIT_TYPE_BULLET:
                // this.map_unit_bullet_list[unit_info.unit_id] = null;
                delete this.map_unit_bullet_list[unit_info.unit_group_id][unit_info.unit_id];
                if (Object.keys(this.map_unit_bullet_list[unit_info.unit_group_id]).length === 0) {
                    delete this.map_unit_bullet_list[unit_info.unit_group_id];
                }
                break;
            case common.static.MAP_UNIT_TYPE_WARP:
                // this.map_unit_warp_list[unit_info.unit_id] = null;
                delete this.map_unit_warp_list[unit_info.unit_id];
                break;
            case common.static.MAP_UNIT_TYPE_DEAD:
                delete this.map_unit_dead_list[unit_info.unit_id];
                break;
            case common.static.MAP_UNIT_TYPE_TASK:
                delete this.map_unit_task_list[unit_info.unit_id];
                break;
            case common.static.MAP_UNIT_TYPE_WRECKAGE:
                delete this.map_unit_wreckage_list[unit_info.unit_id];
                break;
        }

        //移除单位时 只有离开通知前端 死亡不通知前端前端自行处理
        if (frame_type === common.static.MAP_FRAME_TYPE_LEAVE || frame_type === common.static.MAP_FRAME_TYPE_MOVE_OUT) {
            //离开了 就把自己删除了  frame_unit 就取不到东西了
            this.addFrameUnit(unit_info, frame_type);
        }
    }

    /**
     * 安全从块图和合层移除断层
     */
    removeSafeGridInfo() {
        // ff('触发安全离开断层', Object.keys(this.map_unit_ship_player_list)
        //     , Object.keys(this.map_unit_ship_npcer_list)
        //     , Object.keys(this.map_unit_station_list)
        //     , Object.keys(this.map_unit_bullet_list)
        //     , Object.keys(this.map_unit_warp_list));
        if (this.map_unit_ship_player_list_array.length === 0
            && this.map_unit_ship_npcer_list_array.length === 0
            && this.map_unit_station_list_array.length === 0
            && this.map_unit_bullet_list_array.length === 0
            && this.map_unit_warp_list_array.length === 0
            && this.map_unit_dead_list_array.length === 0
            && this.map_unit_task_list_array.length === 0
            && this.map_unit_wreckage_list_array.length === 0
        ) {
            // ff('安全移除断层 merge_id:' + this.map_merge_info.merge_id + ' grid_id:' + this.grid_id);

            m_server.ServerMapBlock.getMapBlockInfo(this.map_key).removeGridInfo(this.grid_id);
            this.map_merge_info.removeGridInfo(this.grid_id);

            m_server.ServerMapManage.separateMergeGridInfo(this.map_merge_info);
        }
    }

    /**
     * 构建本帧单位列表缓存
     */
    buildListArray() {
        this.map_unit_ship_player_list_array = Object.values(this.map_unit_ship_player_list);
        this.map_unit_ship_npcer_list_array = Object.values(this.map_unit_ship_npcer_list);
        this.map_unit_station_list_array = Object.values(this.map_unit_station_list);
        // this.map_unit_bullet_list_array = Object.values(this.map_unit_bullet_list);
        this.map_unit_bullet_list_array = [];
        for (let map_unit_bullet_group_list of Object.values(this.map_unit_bullet_list)) {
            this.map_unit_bullet_list_array.push(Object.values(map_unit_bullet_group_list))
        }
        this.map_unit_warp_list_array = Object.values(this.map_unit_warp_list);
        this.map_unit_dead_list_array = Object.values(this.map_unit_dead_list);
        this.map_unit_task_list_array = Object.values(this.map_unit_task_list);
        this.map_unit_wreckage_list_array = Object.values(this.map_unit_wreckage_list);

        this.eachDead((unit_dead) => {
            unit_dead.buildNpcerInfoArray();
        }, this)
    }

    /**
     * @param {callbackUnitShipPlayer} callback
     * @param thisObj
     */
    eachShipPlayer(callback, thisObj) {
        for (let unit_ship_player of this.map_unit_ship_player_list_array) {
            callback && callback.call(thisObj, unit_ship_player);
        }
    }

    /**
     * 遍历npc舰船
     * @param {callbackUnitShipNpcer} callback
     * @param thisObj
     */
    eachShipNpcer(callback, thisObj) {
        for (let unit_ship_npcer of this.map_unit_ship_npcer_list_array) {
            callback && callback.call(thisObj, unit_ship_npcer);
        }
    }

    /**
     * 遍历建筑
     * @param {callbackUnitStation} callback
     * @param thisObj
     */
    eachStation(callback, thisObj) {
        for (let unit_station of this.map_unit_station_list_array) {
            callback && callback.call(thisObj, unit_station);
        }
    }

    /**
     * @param {callbackUnitBullet} callback
     * @param thisObj
     */
    eachBullet(callback, thisObj) {
        for (let unit_group_bullet of this.map_unit_bullet_list_array) {
            for (let unit_bullet of unit_group_bullet) {
                callback && callback.call(thisObj, unit_bullet);
            }
        }
    }

    /**
     * @param {callbackUnitWarp} callback
     * @param thisObj
     */
    eachWarp(callback, thisObj) {
        for (let unit_warp of this.map_unit_warp_list_array) {
            callback && callback.call(thisObj, unit_warp);
        }
    }

    /**
     * @param {callbackUnitDead} callback
     * @param thisObj
     */
    eachDead(callback, thisObj) {
        for (let unit_dead of this.map_unit_dead_list_array) {
            callback && callback.call(thisObj, unit_dead);
        }
    }

    /**
     * @param {callbackUnitTask} callback
     * @param thisObj
     */
    eachTask(callback, thisObj) {
        for (let unit_task of this.map_unit_task_list_array) {
            callback && callback.call(thisObj, unit_task);
        }
    }

    /**
     * @param {callbackUnitWreckage} callback
     * @param thisObj
     */
    eachWreckage(callback, thisObj) {
        for (let unit_wreckage of this.map_unit_wreckage_list_array) {
            callback && callback.call(thisObj, unit_wreckage);
        }
    }

    /**
     * 创建弹药 比较特别 有后端创建or前端自主创建两种方式
     * @param bullet_data
     */
    createUnitBullet(bullet_data) {
        /**
         * @type {UnitBulletAmmo|UnitBulletGuide|UnitBulletLaser|UnitBullet}
         */
        let unit_bullet = null;
        switch (bullet_data.barrage) {
            case common.static.BULLET_BARRAGE_TYPE_AMMO:
            case common.static.BULLET_BARRAGE_TYPE_AMMO_DOOMSDAY:
                unit_bullet = new UnitBulletAmmo();
                break;
            case common.static.BULLET_BARRAGE_TYPE_GUIDE:
            case common.static.BULLET_BARRAGE_TYPE_GUIDE_DOOMSDAY:
                unit_bullet = new UnitBulletGuide();
                break;
            case common.static.BULLET_BARRAGE_TYPE_LASER_LINE:
            case common.static.BULLET_BARRAGE_TYPE_LASER_DOT:
            case common.static.BULLET_BARRAGE_TYPE_LASER_DOOMSDAY:
                unit_bullet = new UnitBulletLaser();
                break;
            default:
                return;
        }
        unit_bullet
            .loadInfo(bullet_data)
            .moveSafeGridInfo(this);

        //后端指针可直接创建 前端指针须在最后遍历创建
        if (bullet_data.classify === common.static.ITEM_CLASSIFY_GUIDE) {
            unit_bullet.pointerInfo(bullet_data);
        }
    }

    /**
     * 创建残骸 比较特别 有后端创建or前端自主创建两种方式
     */
    createUnitWreckage(unit_data) {
        new UnitWreckage()
            .loadInfo(unit_data)
            .moveSafeGridInfo(this);
    }

    /**
     * 创建死亡空间信标
     * @param world_dead_info
     * @return {*}
     */
    createUnitDead(world_dead_info) {
        let unit_dead = new UnitDead()
            .loadInfo(world_dead_info);

        unit_dead.moveSafeGridInfo(this);
        return unit_dead;
    }

    /**
     * 创建死亡空间信标
     * @param world_task_info
     * @return {*}
     */
    createUnitTask(world_task_info) {
        let unit_task = new UnitTask()
            .loadInfo(world_task_info);

        unit_task.moveSafeGridInfo(this);
        return unit_task;
    }

    /**
     * 尝试查找同合层下的某个单位
     * @param unit_type
     * @param unit_id
     * @return {*}
     */
    getMapMergeUnitInfo(unit_type, unit_id) {
        let unit_info = null;
        this.map_merge_info.eachGridInfo((map_grid_info) => {
            unit_info = map_grid_info.getUnitInfo(unit_type, unit_id);
        }, this);
        return unit_info;
    }

    /**
     * @param status 是否只返回断层信息
     * @returns {{grid_id, safe: number, x, y, galaxy_id: number}}
     */
    getClientGridInfo(status = false) {
        let client_grid_info = {
            grid_id: this.grid_id,
            safe: this.safe,
            galaxy_id: this.galaxy_id,
            x: this.x,
            y: this.y,
        };
        if (status) {
            return client_grid_info;
        }
        client_grid_info[common.static.MAP_UNIT_TYPE_SHIP_PLAYER] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_SHIP_NPCER] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_STATION] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_BULLET] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_WARP] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_DEAD] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_TASK] = {};
        client_grid_info[common.static.MAP_UNIT_TYPE_WRECKAGE] = {};

        this.eachShipPlayer((unit_ship_player) => {
            if (unit_ship_player.getBerth()) {
                this.map_merge_info.addClientPlayerFrameUnit(unit_ship_player.unit_id, unit_ship_player.getClientUnitShipPlayer());
            } else {
                client_grid_info[common.static.MAP_UNIT_TYPE_SHIP_PLAYER][unit_ship_player.unit_id] = unit_ship_player.getClientUnitShipPlayer();
            }
        }, this);
        this.eachShipNpcer((unit_ship_npcer) => {
            if (unit_ship_npcer.getDeath() === false) {
                client_grid_info[common.static.MAP_UNIT_TYPE_SHIP_NPCER][unit_ship_npcer.unit_id] = unit_ship_npcer.getClientUnitShipNpcer();
            }
        }, this);
        this.eachStation((unit_station) => {
            client_grid_info[common.static.MAP_UNIT_TYPE_STATION][unit_station.unit_id] = unit_station.getClientUnitStation();
        }, this);
        this.eachBullet((unit_bullet) => {
            if (unit_bullet.getDeath() === false) {
                client_grid_info[common.static.MAP_UNIT_TYPE_BULLET][unit_bullet.unit_group_id] || (client_grid_info[common.static.MAP_UNIT_TYPE_BULLET][unit_bullet.unit_group_id] = {});
                client_grid_info[common.static.MAP_UNIT_TYPE_BULLET][unit_bullet.unit_group_id][unit_bullet.unit_id] = unit_bullet.getClientUnitBullet();
            }
        }, this);
        this.eachWarp((unit_warp) => {
            client_grid_info[common.static.MAP_UNIT_TYPE_WARP][unit_warp.unit_id] = unit_warp.getClientUnitWarp();
        }, this);
        this.eachDead((unit_dead) => {
            client_grid_info[common.static.MAP_UNIT_TYPE_DEAD][unit_dead.unit_id] = unit_dead.getClientUnitDead();
        }, this);
        this.eachTask((unit_task) => {
            client_grid_info[common.static.MAP_UNIT_TYPE_TASK][unit_task.unit_id] = unit_task.getClientUnitTask();
        }, this);
        this.eachWreckage((unit_wreckage) => {
            client_grid_info[common.static.MAP_UNIT_TYPE_WRECKAGE][unit_wreckage.unit_id] = unit_wreckage.getClientUnitWreckage();
        }, this);
        return client_grid_info;
    }
}

module.exports = MapGridInfo;
