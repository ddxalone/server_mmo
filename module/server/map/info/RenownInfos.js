const BaseInfo = require("../../main/info/BaseInfo");
const common = require("../../../common");
const m_server = require("../../../server");

/**
 * @callback callbackRenownInfo
 * @param {RenownInfo} renown_info
 */

/**
 * @class {RenownInfos}
 * @extends {BaseInfo}
 */
class RenownInfos extends BaseInfo {
    constructor() {
        super();

        this.renown_type = 0;
        /**
         * @type {Object<number, RenownInfo>}
         */
        this.renown_list = {};
    }

    /**
     * 设置空间智能安全策略
     * @param renown_type
     * @return {RenownInfos}
     */
    setRenownType(renown_type) {
        this.renown_type = renown_type;
        return this;
    }

    /**
     * @return {RenownInfos}
     */
    initBaseRenown() {
        this.base_renown_info = common.configure.BASE_RENOWN_INFOS[this.renown_type];
        return this;
    }

    /**
     * 设置阵营
     * @param force
     * @return {RenownInfos}
     */
    setForce(force) {
        this.force = force;
        return this;
    }

    /**
     * @param {callbackRenownInfo} callback
     * @param thisObj
     */
    eachRenown(callback, thisObj) {
        for (let renown_info of Object.values(this.renown_list)) {
            callback && callback.call(thisObj, renown_info);
        }
    }

    /**
     * 更新已知所有玩家的声望状态 这里只能单向处理声望 要不在这里增 遍历到的玩家 再减
     */
    renownRecovery() {
        this.eachRenown((renown_info) => {
            renown_info.recoverRenown(this.base_renown_info.recover);

            //如果声望超过初始化 则移除自己即可
            if (renown_info.renown > this.base_renown_info.init) {
                this.removeRenownInfo(renown_info.unit_id);
            }
        }, this);
    }

    /**
     * 空间增加玩家仇恨
     * @param unit_ship_player
     * @param unit_ship_npcer
     */
    hatredPlayerRenown(unit_ship_player, unit_ship_npcer) {
        if (this.safeCreatePlayerRenown(unit_ship_player.unit_id)) {
            // NpcerDialogue.instance().hatredBuildTrigger(this.renown_type, this.getPlayerFinalRenown(unit_ship_player), unit_ship_player, unit_ship_npcer);

            //扣声望
        }
        this.getRenownInfo(unit_ship_player.unit_id).hatredRenown(this.base_renown_info.hatred);
    }

    /**
     * 玩家攻击时声望处理
     * @param unit_ship_player
     * @param unit_ship_npcer
     */
    attackPlayerRenown(unit_ship_player, unit_ship_npcer) {
        if (this.safeCreatePlayerRenown(unit_ship_player.unit_id)) {
            // NpcerDialogue.instance().hatredBuildTrigger(this.renown_type, this.getPlayerFinalRenown(unit_ship_player), unit_ship_player, unit_ship_npcer);
        }
        this.getRenownInfo(unit_ship_player.unit_id).setRenown(-2000);
    }

    /**
     * 移除声望
     * @param unit_id
     */
    removeRenownInfo(unit_id) {
        delete this.renown_list[unit_id];
    }

    /**
     * @param unit_id
     * @return {RenownInfo}
     */
    getRenownInfo(unit_id) {
        return this.renown_list[unit_id];
    }

    /**
     * 获取玩家在当前空间的声望
     * @param unit_id
     * @return {number}
     */
    getPlayerRenown(unit_id) {
        this.safeCreatePlayerRenown(unit_id);
        return this.renown_list[unit_id].renown;
    }

    /**
     * 获取玩家最终声望
     * @param unit_ship_player
     * @return {*}
     */
    getFinalRenown(unit_ship_player) {
        return Math.min(this.base_renown_info.max, this.getPlayerRenown(unit_ship_player.unit_id) + unit_ship_player.getForceRenown(this.force));
    }

    /**
     * 安全创建声望系统
     * @param unit_id
     * @return {boolean|RenownInfo}
     */
    safeCreatePlayerRenown(unit_id) {
        if (!this.renown_list[unit_id]) {
            let renown_info = new RenownInfo(unit_id)
                .initRenown(this.base_renown_info.init);

            this.renown_list[unit_id] = renown_info;
            return renown_info;
        }
        return false;
    }
}

class RenownInfo {
    constructor(unit_id) {
        this.unit_id = unit_id;
        this.renown = 0;
    }

    /**
     * @param init
     * @return {RenownInfo}
     */
    initRenown(init) {
        this.renown = init;
        return this;
    }

    /**
     * @param renown
     */
    setRenown(renown) {
        this.renown = renown;
    }

    /**
     * 增加声望 恢复
     */
    recoverRenown(recover) {
        this.renown += recover;
    }

    /**
     * 降低声望 警告
     */
    hatredRenown(hatred) {
        this.renown = Math.max(common.setting.base_min_renown, this.renown - hatred);
    }

    /**
     * 危险动作
     */
    dangerousRenown() {
        this.renown = -2000;
    }
}

module.exports = RenownInfos;

