const common = require("../../../common");
const m_server = require("../../../server");
const S2CMapFrame = require("../protocol/S2CMapFrame");

/**
 * @callback callbackMapMergeInfo
 * @param {MapMergeInfo} map_merge_info
 */
/**
 * 合并断层信息
 * @class {MapMergeInfo}
 */
class MapMergeInfo {
    constructor(merge_id) {
        this.merge_id = merge_id;
        //断层改变状态
        this.merge_status = false;
        /**
         * 合并断层信息 grid_id
         * @type {Object<number, MapGridInfo>}
         */
        this.map_grid_list = {};
        /**
         * @type {Array<MapGridInfo>}
         */
        this.map_grid_list_array = [];

        /**
         * 断层单位状态改变信息
         * @type {{}}
         */
        // this.frame_unit = {};

        /**
         * 当前断层用于发送帧协议的动作数据
         * @type {{}}
         */
        this.frame_actions = {};

        //初始化协议
        this.s2cMapFrame = new S2CMapFrame()
            .setMergeId(this.merge_id);
        this.s2cMapFrameFull = new S2CMapFrame()
            .setMergeId(this.merge_id);

        this.server_frame = 0;
        //标记是否为活跃的 有玩家即活跃 否则不活跃
        this.is_active = false;
        //最后一次活跃的帧数
        this.last_active_server_frame = 0;
        /**
         * 把所有需要单独通知玩家的信息收集起来
         * @type {{}}
         */
        this.client_player_frame_list = {};
    }

    setServerFrame(server_frame) {
        this.server_frame = server_frame;
    }

    /**
     * 设置玩家动作
     * @param frame_actions
     */
    setFrameActions(frame_actions) {
        this.frame_actions = frame_actions;
    }

    /**
     * 更新断层活跃状态
     */
    updateActiveStatus() {
        let map_merge_is_active = false;
        this.eachGridInfo((map_grid_info) => {
            if (map_grid_info.map_unit_ship_player_list_array.length) {
                map_merge_is_active || (map_merge_is_active = true);
            }
        }, this);
        this.setIsActive(map_merge_is_active);
    }

    setIsActive(status) {
        this.is_active = status;
        //如果未激活且没有最后一次激活帧数
        (status || this.last_active_server_frame) || (this.last_active_server_frame = this.server_frame);
    }

    getIsActive() {
        return this.is_active;
    }

    /**
     * 更新激活状态
     */
    mapMergeActiveAction() {
        if (this.getIsActive()) {
            this.eachGridInfo((map_grid_info) => {
                //如果激活且有最后一次激活帧 则处理激活阶段的NPC状态 瞬时处理
                if (this.last_active_server_frame) {
                    if (this.server_frame > this.last_active_server_frame) {
                        let pass_active_server_frame = this.server_frame - this.last_active_server_frame;
                        map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                            unit_ship_npcer.shipNpcerActiveAction(pass_active_server_frame);
                            //这个有没有用??
                            unit_ship_npcer.map_grid_info.addFrameUnit(this, common.static.MAP_FRAME_TYPE_EXIST);
                        }, this);
                    }
                    //初始化最后一次激活帧
                    this.last_active_server_frame = 0;
                } else {
                    map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                        //处理npc的折跃
                        unit_ship_npcer.shipWarp();
                    }, this);
                }
            }, this);
        }
    }

    clearClientPlayerFrameList() {
        this.client_player_frame_list = {};
    }

    addClientPlayerFrameUnit(unit_id, frame_info) {
        this.client_player_frame_list[unit_id] = frame_info;
    }

    getClientPlayerFrameUnit(unit_id) {
        return this.client_player_frame_list[unit_id] || null;
    }

    /**
     * 设置合层帧协议(更改)
     */
    setProtocolMapFrame() {
        this.s2cMapFrame
            .setFrame(this.server_frame)
            .setUnit(this.getClientFrameUnit())
            .setAction(this.frame_actions);
    }

    /**
     * 设置合成帧协议(全)
     */
    setProtocolMapFrameFull() {
        this.s2cMapFrameFull
            .setFrame(this.server_frame)
            .setInfo(this.getClientMergeInfo())
            .setAction(this.frame_actions);
    }

    getMergeStatus() {
        return this.merge_status;
    }

    /**
     * 合层改变状态
     * @param status
     */
    setMergeStatus(status) {
        this.merge_status = status;
    }

    /**
     * 添加断层信息到当前合层
     * @param {MapGridInfo} map_grid_info
     */
    addGridInfo(map_grid_info) {
        this.map_grid_list[map_grid_info.grid_id] = map_grid_info;
        map_grid_info.setMapMergeInfo(this);

        // this.addFrameGrid(map_grid_info.grid_id, common.define.MAP_GRID_TYPE_CREATE);
    }

    /**
     * 检查某断层是否存在
     * @param grid_id
     * @returns {boolean}
     */
    // checkGridInfo(grid_id) {
    //     return !!this.map_grid_list[grid_id];
    // }

    /**
     * gird_id可能不存在
     * @param grid_id
     * @param unit_type
     * @param unit_id
     * @return {MapGridInfo|UnitShipPlayer|UnitBullet|UnitShipNpcer|UnitStation|UnitWarp|UnitDead|UnitWreckage}
     */
    getGridUnitInfo(grid_id, unit_type, unit_id) {
        let map_grid_info = this.getGridInfo(grid_id);
        return map_grid_info && map_grid_info.getUnitInfo(unit_type, unit_id);
    }

    /**
     * @param grid_id
     * @returns {MapGridInfo}
     */
    getGridInfo(grid_id) {
        return this.map_grid_list[grid_id];
    }

    /**
     * 移除合层下的某断层
     * @param grid_id
     */
    removeGridInfo(grid_id) {
        delete this.map_grid_list[grid_id];
        // this.addFrameGrid(grid_id, common.define.MAP_GRID_TYPE_REMOVE);

        this.removeSafeMergeInfo();
    }

    /**
     * @returns {boolean}
     */
    checkMapGridList() {
        return !!Object.keys(this.map_grid_list).length;
    }

    /**
     * 安全移除合层
     */
    removeSafeMergeInfo() {
        if (this.checkMapGridList() === false) {
            // ff('安全移除合层 merge_id:' + this.merge_id);

            m_server.ServerMapMerge.removeMapMergeInfo(this.merge_id);
        }
    }

    /**
     * 合并另一个合层
     * @param {MapMergeInfo} merge_map_merge_info
     */
    // mergeOtherMergeInfo(merge_map_merge_info) {
    //     //如果触发合并则新旧都修改状态 旧的会移除不需要修改
    //     //遍历grid_id 暂时不加保护 报错说明真的有错误
    //     merge_map_merge_info.eachGridInfo((map_grid_info) => {
    //         this.addMergeInfoSimple(map_grid_info.grid_id, map_grid_info);
    //     }, this);
    // }

    /**
     * 构建本帧断层缓存
     */
    buildGridInfoArray(intact = true) {
        this.map_grid_list_array = Object.values(this.map_grid_list);
        if (intact) {
            this.eachGridInfo((map_grid_info) => {
                map_grid_info.buildListArray();
            }, this);
        }
    }

    /**
     * 遍历合并断层返回断层信息
     * @param {callbackMapGridInfo} callback
     * @param thisObj
     */
    eachGridInfo(callback, thisObj) {
        for (let map_grid_info of this.map_grid_list_array) {
            callback && callback.call(thisObj, map_grid_info);
        }
    }

    /**
     * 获取新断层周边断层数组 批量分层
     * 实现了一半 最终发现还是没法处理 先不处理的 影响真的不大
     * @param {callbackMapGridInfo} callback
     * @param thisObj
     */
    separateGridInfo(callback, thisObj) {
        //断层分离的时候先把新增的断层加入到列表 不然会计算错误 最后再移除
        //获取附近的断层列表 必须倒序 以新增的断层为基点
        let grid_id_list = Object.keys(this.map_grid_list).sort((a, b) => {
            return b - a;
        });
        let separate_grid_array = {};
        //是否在新断层周围
        //第一个为true
        for (let pos in grid_id_list) {
            separate_grid_array[grid_id_list[pos]] = (pos === '0');
        }

        let is_change = true;
        do {
            is_change = false;
            //从后往前两两遍历 只要在距离内
            this.eachGridInfo((map_grid_info) => {
                this.eachGridInfo((check_map_grid_info) => {
                    if (map_grid_info.grid_id !== check_map_grid_info.grid_id) {
                        let v_distance = common.func.getDistance(map_grid_info.x, map_grid_info.y, check_map_grid_info.x, check_map_grid_info.y);
                        if (v_distance < common.setting.base_map_grid_radius * 2) {
                            if (separate_grid_array[map_grid_info.grid_id] && separate_grid_array[check_map_grid_info.grid_id] === false) {
                                separate_grid_array[check_map_grid_info.grid_id] = true;
                                //只要有新改变,则重新遍历一整遍
                                is_change = true;
                            }
                        }
                    }
                }, this)
            }, this);
        } while (is_change);

        for (let grid_id in separate_grid_array) {
            callback && callback.call(thisObj, this.map_grid_list[grid_id], separate_grid_array[grid_id]);
        }
    }

    /**
     * 清理断层状态改变信息
     */
    clearFrameUnit() {
        this.eachGridInfo((map_grid_info) => {
            map_grid_info.clearGridFrameUnit();
        }, this);
    }

    /**
     * 获取断层状态改变信息
     */
    getClientFrameUnit() {
        let frame_unit = {};

        this.eachGridInfo((map_grid_info) => {
            if ((Object.keys(map_grid_info.grid_frame_units).length)) {
                for (let unit_type in map_grid_info.grid_frame_units) {
                    unit_type = parseInt(unit_type);
                    for (let unit_id in map_grid_info.grid_frame_units[unit_type]) {
                        unit_id = parseInt(unit_id);
                        let type = map_grid_info.grid_frame_units[unit_type][unit_id];

                        frame_unit[type] || (frame_unit[type] = {});

                        // let client_type = null;
                        //如果是断层创建 则追加所有断层信息
                        switch (type) {
                            case common.static.MAP_FRAME_TYPE_BUILD:
                            case common.static.MAP_FRAME_TYPE_EXIST:
                            case common.static.MAP_FRAME_TYPE_MOVE_IN:
                                let frame_unit_info = null;
                                switch (unit_type) {
                                    case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                                        //TODO 这个需要测试 一个玩家停靠刷新自己通知前端 其他玩家看自己 和 自己停靠刷新自己通知前端
                                        //我草要麻烦 整个机制要改 停靠的时候 协议要用 player_info里的信息 然后去构建unit_ship_player
                                        //再不然停靠的时候 额外通知一下前端的
                                        // 自己
                                        let unit_ship_player = map_grid_info.getUnitInfo(unit_type, unit_id);
                                        //停靠是不通过通用协议发送状态的 所以玩家各自发送各自自己的
                                        if (unit_ship_player.getBerth()) {
                                            this.addClientPlayerFrameUnit(unit_id, unit_ship_player.getClientUnitShipPlayer());
                                        } else {
                                            frame_unit_info = unit_ship_player.getClientUnitShipPlayer();
                                        }
                                        break;
                                    case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                                        frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitShipNpcer();
                                        break;
                                    case common.static.MAP_UNIT_TYPE_STATION:
                                        frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitStation();
                                        break;
                                    // case common.static.MAP_UNIT_TYPE_BULLET:
                                    //     frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitBullet();
                                    //     break;
                                    case common.static.MAP_UNIT_TYPE_WARP:
                                        frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitWarp();
                                        break;
                                    case common.static.MAP_UNIT_TYPE_DEAD:
                                        frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitDead();
                                        break;
                                    case common.static.MAP_UNIT_TYPE_TASK:
                                        frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitTask();
                                        break;
                                    case common.static.MAP_UNIT_TYPE_WRECKAGE:
                                        frame_unit_info = map_grid_info.getUnitInfo(unit_type, unit_id).getClientUnitWreckage();
                                        break;
                                }
                                if (frame_unit_info) {
                                    //TODO 正式环境 不传x y
                                    frame_unit[type][map_grid_info.grid_id] || (frame_unit[type][map_grid_info.grid_id] = {
                                        grid_id: map_grid_info.grid_id,
                                        x: map_grid_info.x,
                                        y: map_grid_info.y,
                                    });
                                    frame_unit[type][map_grid_info.grid_id][unit_type] || (frame_unit[type][map_grid_info.grid_id][unit_type] = {});

                                    frame_unit[type][map_grid_info.grid_id][unit_type][unit_id] = frame_unit_info;
                                }
                                break;
                            case common.static.MAP_FRAME_TYPE_LEAVE:
                            case common.static.MAP_FRAME_TYPE_MOVE_OUT:

                                frame_unit[type][map_grid_info.grid_id] || (frame_unit[type][map_grid_info.grid_id] = {});
                                frame_unit[type][map_grid_info.grid_id][unit_type] || (frame_unit[type][map_grid_info.grid_id][unit_type] = {});

                                frame_unit[type][map_grid_info.grid_id][unit_type][unit_id] = true;
                                break;
                        }
                    }
                }
            }
        }, this);
        return frame_unit;
    }

    getClientMergeInfo() {
        let client_merge_info = {};
        this.eachGridInfo((map_grid_info) => {
            client_merge_info[map_grid_info.grid_id] = map_grid_info.getClientGridInfo();
        }, this);
        return client_merge_info;
    }
}

module.exports = MapMergeInfo;
