const BaseInfo = require("../../main/info/BaseInfo");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {BaseUnit}
 * @extends {BaseInfo}
 */
class BaseUnit extends BaseInfo {
    constructor(unit_type) {
        super();
        //编号
        this.unit_id = 0;
        //单位类型
        this.unit_type = unit_type;
        //x坐标 整数 转换比例100
        this.x = 0;
        //y坐标 整数 转换比例100
        this.y = 0;
        //角度 整数 转换比例100
        this.rotation = 0;
        //半径 整数 转换比例100
        this.radius = 0;
        //
        this.radius_pow = 0;
        //质量
        // this.mass = 0;

        //断层 整数
        this.grid_id = 0;
        //断层所在块图 这个应该意义不是很大
        // this.map_key = 0;
        //如果触发move则保存此值用于前端转移
        // this.last_grid_id = 0;
        //先试试方案
        // this.last_grid_info = null;

        //拥有者类型
        this.owner_type = 0;
        //拥有者ID
        this.owner_id = 0;
        //是否为当前玩家 用于控制视角
        this.unit_status = common.static.UNIT_STATUS_NULL;


        /**
         * @type {MapMergeInfo}
         */
        // this.map_merge_info = null;
        /**
         * @type {MapGridInfo}
         */
        this.map_grid_info = null;

        this.filter = null;
    }

    setInit() {
        this.unit_status = common.static.UNIT_STATUS_INIT;
    }

    getInit() {
        return this.unit_status === common.static.UNIT_STATUS_INIT;
    }

    setRun() {
        this.unit_status = common.static.UNIT_STATUS_RUN;
    }

    getRun() {
        return this.unit_status === common.static.UNIT_STATUS_RUN;
    }

    setDeath() {
        this.unit_status = common.static.UNIT_STATUS_DEATH;
    }

    getDeath() {
        return this.unit_status === common.static.UNIT_STATUS_DEATH;
    }

    setBerth() {
        this.unit_status = common.static.UNIT_STATUS_BERTH;
    }

    getBerth() {
        return this.unit_status === common.static.UNIT_STATUS_BERTH;
    }

    setUnitId(unit_id) {
        this.unit_id = unit_id;
    }

    setServerId(server_id) {
        this.server_id = server_id;
    }

    getServerId() {
        return this.server_id;
    }

    setGridId(grid_id) {
        this.grid_id = grid_id;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    /**
     * 设置断层
     * @param {MapGridInfo} map_grid_info
     * @returns {BaseUnit}
     */
    setMapGridInfo(map_grid_info) {
        this.map_grid_info = map_grid_info;
        return this;
    }

    /**
     * 虚方法
     */
    // updateRenownStatus() {
    //
    // }

    /**
     * 添加单位到断层
     * @param {MapGridInfo} map_grid_info
     * @param status 是否触发更新前端状态 例如跃迁状态
     * @return {BaseUnit|UnitShipPlayer|UnitShipNpcer}
     */
    moveSafeGridInfo(map_grid_info, status = false) {
        //如果玩家仍然在当前断层 则不处理
        if (this.grid_id !== map_grid_info.grid_id) {
            //如果玩家已经在一个断层 则移除这个断层
            if (this.grid_id) {
                // ff('单位离开===>>>断层 merge_id:' + this.map_grid_info.map_merge_info.merge_id + ' grid_id:' + this.grid_id + '  unit_id[' + this.unit_id + ']');
                this.moveToGrid(map_grid_info);
                // ff('单位加入<<<===断层 merge_id:' + map_grid_info.map_merge_info.merge_id + ' grid_id:' + this.grid_id + ' unit_id[' + this.unit_id + ']');
                // map_grid_info.removeUnitInfo(this, common.static.MAP_FRAME_TYPE_LEAVE);
            } else {
                map_grid_info.addUnitInfo(this, common.static.MAP_FRAME_TYPE_BUILD);
                // ff('only单位加入<<<===断层 merge_id:' + map_grid_info.map_merge_info.merge_id + ' grid_id:' + this.grid_id + ' unit_id[' + this.unit_id + ']');
            }

            //如果玩家更改断层 则刷新本合层的 NPC声望事件
            // if (this.unit_type === common.static.MAP_UNIT_TYPE_SHIP_PLAYER) {
            //     this.updateRenownStatus();
            // }
        } else {
            if (status) {
                map_grid_info.addUnitInfo(this, common.static.MAP_FRAME_TYPE_EXIST);
            }
        }

        return this;
    }

    /**
     * 移动断层
     */
    moveToGrid(map_grid_info) {
        //TODO 研究一下  老断层正好离开了  触发了move 这个leave 找不到了 前端会报错
        // 是我正好触发了move 同时 目标断层 又触发了exist 就会报错
        // 问题好像不在这 我触发了 moveSafeGridInfo  又没有触发任何断层更改 这时候我是不知道这个合层信息的
        // 好像正常断层大小触发不了这种情况  在我进入新断层的时候 必定会触发合层 我会平稳过度 不触发的地方例如折跃和死亡都已经处理了
        this.map_grid_info.removeUnitInfo(this, common.static.MAP_FRAME_TYPE_MOVE_OUT);

        map_grid_info.addUnitInfo(this, common.static.MAP_FRAME_TYPE_MOVE_IN);
    }

    /**
     * 设置过滤方法
     * @param filter
     * @return {*}
     */
    setFilter(filter = null) {
        this.filter = filter;
        return this;
    }

}

module.exports = BaseUnit;

