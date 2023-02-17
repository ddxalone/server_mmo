const UnitShipMap = require("./UnitShipMap");
const ShipTarget = require("./ShipTarget");
const common = require("../../../common");
const m_server = require("../../../server");
const HarmAccumulative = require("./HarmAccumulative");

/**
 * @class {UnitShip}
 * @extends {UnitShipMap}
 */
class UnitShip extends UnitShipMap {
    constructor(unit_type) {
        super(unit_type);

        this.move_distance = 0;
        //如果折跃则生成此信息 需要记录目标特效的ID(用于取消折跃删除特效)和坐标
        //目标特效 无断层 则不创建 不通知前端 不对 要创建 不然舰队起跳 后到的啥也看不到了
        this.warp_target_id = 0;
        this.warp_target_point = common.func.Point();

        this.base_ship_info = null;


        //累计伤害
        //TODO 还未做删除 应该是在脱离战斗的时候清空
        /**
         * @type {Object<number,Object<number,HarmAccumulative>>}
         */
        this.harm_accumulatives = {};
        //最后一次玩家攻击的信息 用于处理KM和掉落归属
        this.last_player_harm_unit_id = 0;
    }

    /**
     * 清理基础属性
     */
    clearBaseShipInfo() {
        this.base_ship_info = null;
    }

    beginBoom() {
        super.beginBoom();
    }

    /**
     * 设置折跃目标信息
     * @param warp_target_id
     */
    setWarpTargetId(warp_target_id) {
        this.warp_target_id = warp_target_id;
    }

    getWarpTargetId() {
        return this.warp_target_id;
    }

    /**
     * 设置折跃目标信息
     * @param x
     * @param y
     */
    setWarpTargetPoint(x, y) {
        this.warp_target_point.x = x;
        this.warp_target_point.y = y;

    }

    /**
     * 处理舰船折跃 并返回折跃是否完成
     */
    shipWarp() {
        if (this.getIsWarpStatus()) {
            if (this.warp_run_frame === this.warp_hop_frame) {
                let before_merge_id = this.map_grid_info.map_merge_info.merge_id;
                this.jumpWarpAction();
                //如果在同一个合层返回false
                return before_merge_id !== this.map_grid_info.map_merge_info.merge_id;
            }
        }
        return false;
    }

    /**
     * 开始折跃
     * @param warp_info
     * @param angle
     */
    beginWarpAction(warp_info, angle) {
        this.target_info.reInitTargetInfo();

        this.setWarpTargetId(warp_info.unit_id);
        this.setWarpTargetPoint(warp_info.x, warp_info.y);
        this.setTargetMoveAngle(angle);

        //折跃开始时间
        this.warp_run_frame = warp_info.warp_run_frame;
        //折跃结束时间
        this.warp_sum_frame = warp_info.warp_sum_frame;
        //折跃启动结束时间
        this.warp_ing_frame = warp_info.warp_ing_frame;
        //折跃跳跃时间
        this.warp_hop_frame = warp_info.warp_hop_frame;

        this.warp_status = common.static.SHIP_WARP_STATUS_START;

        this.map_grid_info.addFrameUnit(this, common.static.MAP_FRAME_TYPE_EXIST);
    }

    /**
     * 虚方法 折跃跳跃方法
     * @param success
     */
    jumpWarpAction(success = false) {
        if (success) {
            this.finishWarpAction();
        } else {
            this.warp_status = common.static.SHIP_WARP_STATUS_STOP;
        }

        this.setX(this.warp_target_point.x);
        this.setY(this.warp_target_point.y);

        this.setWarpTargetId(0);
        this.setWarpTargetPoint(0, 0);
    }

    /**
     * 终止折跃动作
     * @param force
     */
    stopWarpAction(force = false) {
        this.setWarpTargetId(0);
        this.setWarpTargetPoint(0, 0);

        if (force) {
            //强制取消 死亡
            this.finishWarpAction();
        } else {
            //手动取消
            //取消时 运行了N帧 / 2
            this.warp_run_frame = Math.max(1, Math.floor((this.warp_sum_frame - this.warp_run_frame) / 2));
            this.warp_ing_frame = 0;
            //这里需要-1 保证不会执行到hop 在循环的时候先给用户赋值this.server_frame 再++
            this.warp_hop_frame = this.warp_run_frame + 1;

            this.warp_status = common.static.SHIP_WARP_STATUS_STOP;
        }

        this.map_grid_info.addFrameUnit(this, common.static.MAP_FRAME_TYPE_EXIST);
    }

    /**
     * 移除武器信息 如果允许太空换装的话 这个方法才存在
     * @param {ShipWeapon} ship_weapon
     */
    delShipWeapon(ship_weapon) {
        super.delShipWeapon(ship_weapon);
    }


    /**
     * 增加累计伤害
     * @param {HarmInfo} harm_info
     */
    accumulativeHarmHandle(harm_info) {
        //todo 这里处理累计伤害
        this.harm_accumulatives[harm_info.ship_unit_type] || (this.harm_accumulatives[harm_info.ship_unit_type] = {});
        switch (harm_info.ship_unit_type) {
            case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                //如果是玩家造成伤害 如果不一致 则重写掉落
                if (this.last_player_harm_unit_id !== harm_info.ship_unit_id) {
                    this.last_player_harm_unit_id = harm_info.ship_unit_id;
                }
                //根据玩家ID记录累计伤害
                let harm_accumulative_player = this.harm_accumulatives[harm_info.ship_unit_type][harm_info.ship_unit_id];
                if (!harm_accumulative_player) {
                    harm_accumulative_player = new HarmAccumulative()
                    harm_accumulative_player.unit_type = harm_info.ship_unit_type;
                    //记录第一次攻击的玩家的检出类型
                    harm_accumulative_player.ship_type = harm_info.ship_ship_type;
                    harm_accumulative_player.unit_id = harm_info.ship_unit_id;
                    harm_accumulative_player.item_type = harm_info.item_type;

                    this.harm_accumulatives[harm_info.ship_unit_type][harm_info.ship_unit_id] = harm_accumulative_player;
                }

                harm_accumulative_player.addHarm(this.harm_shield + this.harm_armor);
                break;
            case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                //根据阵营记录累计伤害
                let harm_accumulative_npcer = this.harm_accumulatives[harm_info.ship_unit_type][harm_info.ship_force];
                if (!harm_accumulative_npcer) {
                    harm_accumulative_npcer = new HarmAccumulative()
                    harm_accumulative_npcer.unit_type = harm_info.ship_unit_type;
                    harm_accumulative_npcer.force = harm_info.ship_force;
                    harm_accumulative_npcer.item_type = harm_info.item_type;

                    this.harm_accumulatives[harm_info.ship_unit_type][harm_info.ship_force] = harm_accumulative_npcer;
                } else {
                    //记录最大的ship_type
                    if (harm_accumulative_npcer.ship_type < harm_info.ship_ship_type) {
                        harm_accumulative_npcer.ship_type = harm_info.ship_ship_type;
                        harm_accumulative_npcer.item_type = harm_info.item_type;
                    }
                }

                harm_accumulative_npcer.addHarm(this.harm_shield + this.harm_armor);
                break;
        }
    }
}

module.exports = UnitShip;

