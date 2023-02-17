const BaseUnit = require("./BaseUnit");
const m_server = require("../../index");
const common = require("../../../common");
const RenownInfos = require("./RenownInfos");


/**
 * @class {UnitTaskMap}
 * @extends {BaseUnit}
 */
class UnitTaskMap extends BaseUnit {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_TASK);

        //声望信息
        this.renown_infos = new RenownInfos()
            .setRenownType(common.static.NPCER_RENOWN_TYPE_STRICT)
            .initBaseRenown();
        this.force = 0;

        /**
         * @type {Object<number, UnitShipNpcer>}
         */
        this.npcer_infos = {};

        /**
         * @type {Array<UnitShipNpcer>}
         */
        this.npcer_infos_array = [];
    }

    setForce(force) {
        this.force = force;
        this.renown_infos.setForce(this.force);
    }

    loadInfoMap(world_task_info) {

    }

    addUnitShipNpcer(unit_ship_npcer) {
        this.npcer_infos[unit_ship_npcer.unit_id] = unit_ship_npcer;
    }

    removeUnitShipNpcer(unit_id) {
        delete this.npcer_infos[unit_id];
    }

    //已经把死亡空间刷新一类的机制拿到world上去了 这次来处理声望 更改NPC状态等信息 前后端同步处理
    //前端把玩家还是NPCER的 pointer到这个类上

    //第一步 玩家进入把玩家放到这里来 刚才构思了一下 这里要以合层为单位进行处理
    //那所有的处理方式就要以范围来进行了

    addRenownInfo(unit_ship_player) {
        //基础声望在玩家身上 这里只做动态调整的声望 每个玩家一个计时器

        //前端不需要这个方法 后端同步过去就好了 当变更的时候通知前端
    }

    buildNpcerInfoArray() {
        this.npcer_infos_array = Object.values(this.npcer_infos);
    }

    /**
     * @param {callbackUnitShipNpcer} callback
     * @param thisObj
     */
    eachNpcerInfos(callback, thisObj) {
        for (let unit_ship_npcer of this.npcer_infos_array) {
            callback && callback.call(thisObj, unit_ship_npcer);
        }
    }

    /**
     * 获取声望系统的声望
     * @param unit_ship_player
     * @return {*}
     */
    getRenownsRenown(unit_ship_player) {
        return this.renown_infos.getFinalRenown(unit_ship_player);
    }

    /**
     * 设定玩家攻击时产生的声望
     * @param unit_ship_player
     * @param unit_ship_npcer
     */
    setAttackRenown(unit_ship_player, unit_ship_npcer) {
        this.renown_infos.attackPlayerRenown(unit_ship_player, unit_ship_npcer);
    }

    /**
     * 更新NPCER单位AI及状态
     */
    taskSettle() {
        //每秒触发一次即可
        //自动恢复已知所有玩家的声望状态
        this.renown_infos.renownRecovery();

        this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
            //遍历玩家
            map_grid_info.eachShipPlayer((unit_ship_player) => {
                let nearest_distance = 0;
                let nearest_ship_npcer = null;

                this.eachNpcerInfos((unit_ship_npcer) => {
                    let distance = common.func.getDistance(unit_ship_player.x, unit_ship_player.y, unit_ship_npcer.x, unit_ship_npcer.y);
                    //??警戒范围太低了 追击范围??
                    if (distance < unit_ship_npcer.alert) {
                        if (nearest_distance === 0 || distance < nearest_distance) {
                            nearest_distance = distance;
                            nearest_ship_npcer = unit_ship_npcer;
                        }
                    }
                }, this);

                if (nearest_ship_npcer) {
                    this.renown_infos.hatredPlayerRenown(unit_ship_player, nearest_ship_npcer);

                    //TODO 这里可以增加NPC的缓存 如果没有最近的NPCER就是没发现玩家 就map方法就不用遍历玩家了
                }
            }, this)
        }, this);

        // ff(this.renown_infos.renown_list[1000]);
    }
}

module.exports = UnitTaskMap;
