const m_server = require("../../server");
const m_player = require("../../player");
const common = require("../../common");

/**
 * @callback callbackPlayerVariable
 * @param err
 * @param {PlayerVariable} player_variable
 */
/**
 * 用户变量信息
 * @class {PlayerVariable}
 */
class PlayerVariable {
    constructor() {
        //扫描的死亡空间信息
        /**
         * @type {Object<number, Object<number, ScanBeaconInfo>>}
         */
        this.scan_list = {};
        this.scan_list[common.static.WORLD_UNIT_TYPE_SHIP_PLAYER] = {};
        this.scan_list[common.static.WORLD_UNIT_TYPE_STATION] = {};
        this.scan_list[common.static.WORLD_UNIT_TYPE_DEAD] = {};
        this.scan_list[common.static.WORLD_UNIT_TYPE_TASK] = {};

        //精准扫描
        this.exact_type = 0;
        this.exact_id = 0;

        //玩家打开残骸的单位ID 当世界状态更新的时候 触发面板更新和关闭
        this.wreckage_unit_id = 0;
    }

    /**
     * 更新当前精扫进度
     * @param clear
     */
    updateCurrentExact(clear = false) {
        if (this.exact_type && this.exact_id) {
            let scan_beacon_info = this.scan_list[this.exact_type][this.exact_id];
            if (scan_beacon_info) {
                scan_beacon_info.updateIntensity(clear);
                return scan_beacon_info;
            }
        }
        return null
    }

    /**
     * @param {ScanBeaconInfo} scan_beacon_info
     * @param scan_initiate_per
     * @param server_frame
     */
    setExact(scan_beacon_info, scan_initiate_per, server_frame) {
        //如果信号不存在 则为保存当前信号的进度
        if (scan_beacon_info === null) {
            if (this.exact_type && this.exact_id) {
                scan_beacon_info = this.scan_list[this.exact_type][this.exact_id];
            }
            //如果仍然不存在 则return
            if (!scan_beacon_info) {
                //这里只是一个保护
                this.clearExact();
                return;
            }
        } else {
            this.exact_type = scan_beacon_info.type;
            this.exact_id = scan_beacon_info.id;
        }

        //每次进度减半 或者 -固定50
        // scan_beacon_info.intensity = Math.max(0, scan_beacon_info.intensity - 50);
        scan_beacon_info.intensity = Math.floor(scan_beacon_info.intensity / 2);

        scan_beacon_info.exact_total = Math.ceil(5000 / scan_beacon_info.radius_pow * scan_initiate_per);
        //如果已经有进度了 则begin时间需要调整到当前时间以前
        scan_beacon_info.exact_begin = server_frame - Math.floor(scan_beacon_info.intensity / 100 * scan_beacon_info.exact_total);
        scan_beacon_info.exact_end = scan_beacon_info.exact_begin + scan_beacon_info.exact_total;

        //追加2个时间点时间
        scan_beacon_info.exact_step_distance = scan_beacon_info.exact_begin + Math.floor(scan_beacon_info.exact_total / 3);
        scan_beacon_info.exact_step_name = scan_beacon_info.exact_begin + Math.floor(scan_beacon_info.exact_total / 3 * 2);
    }

    clearExact() {
        this.exact_type = 0;
        this.exact_id = 0;
    }

    /**
     * 每帧处理精扫逻辑
     * @param server_frame
     * @returns {ScanBeaconInfo|null}
     */
    exactAction(server_frame) {
        if (this.exact_type && this.exact_id) {
            let scan_beacon_info = this.scan_list[this.exact_type][this.exact_id];
            if (scan_beacon_info) {
                if (server_frame === scan_beacon_info.exact_end) {
                    scan_beacon_info.updateIntensityStep(common.static.SCAN_EXACT_SUCCESS);
                    this.updateCurrentExact(true);
                    this.clearExact();
                    return scan_beacon_info;
                } else if (server_frame === scan_beacon_info.exact_step_name) {
                    scan_beacon_info.updateIntensityStep(common.static.SCAN_EXACT_NAME);
                    this.updateCurrentExact(false);
                    return scan_beacon_info;
                } else if (server_frame === scan_beacon_info.exact_step_distance) {
                    scan_beacon_info.updateIntensityStep(common.static.SCAN_EXACT_DISTANCE);
                    this.updateCurrentExact(false);
                    return scan_beacon_info;
                }
                // fff('red', Math.floor(Math.min(100, (server_frame - scan_beacon_info.exact_begin) / scan_beacon_info.exact_total * 100)), server_frame)
                // return scan_beacon_info.updateIntensity(Math.floor(Math.min(100, (server_frame - scan_beacon_info.exact_begin) / scan_beacon_info.exact_total * 100)));
            }
        }
        return null
    }

    addScanList(scan_beacon_info) {
        this.scan_list[scan_beacon_info.type][scan_beacon_info.id] = scan_beacon_info;
    }

    /**
     * 设置扫描信号列表
     * @param scan_list
     * @returns {Object<number, Object<number, ScanBeaconInfo>>}
     */
    setScanList(scan_list) {
        // 遍历旧的列表
        // 如果新旧同时存在 则用旧的
        // 如果只有新的存在 则用新的
        // 如果只有旧的存在 则移除旧的
        for (let type in this.scan_list) {
            for (let id in this.scan_list[type]) {
                if (scan_list[type][id]) {
                    //如果旧的存在 新的存在 则移除新的
                    delete scan_list[type][id];
                } else {
                    //如果旧的存在 新的不存在 则移除旧的
                    delete this.scan_list[type][id];
                }
            }
            //剩下的是 新的存在 旧的不存在的 覆盖到旧的上
            Object.assign(this.scan_list[type], scan_list[type]);
        }

        return this.scan_list;
    }

    /**
     * @returns {*|{}}
     */
    getScanList() {
        //type不存在 则为整体 用于登录
        return this.scan_list;
    }

    getClientPlayerVariable() {
        return {
            exact_type: this.exact_type,
            exact_id: this.exact_id,
        }
    }

    //TODO 扫描精度相关逻辑处理 未来再分文件可能会将scan相关的方法移动到新文件里
}

module.exports = PlayerVariable;
