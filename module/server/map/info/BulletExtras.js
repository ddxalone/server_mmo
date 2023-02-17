const common = require("../../../common");
const BaseInfo = require("../../main/info/BaseInfo");

/**
 * @callback callbackBulletCreatePosInfo
 * @param {BulletCreatePosInfo} pos_info
 */

/**
 * @class {BulletExtras}
 * @extends {BaseInfo}
 */
class BulletExtras extends BaseInfo {
    constructor(type) {
        super();
        //分为创建弹药时处理 和 运行时处理
        //创建时 分为3部分
        // 1new extra信息等
        // 2update 更新弹药数量等太空换装
        // 3获取 传入武器基本信息

        //运行时 分为2部分
        // 1new extra等信息
        // 2获取 根据当前弹药信息 修正坐标和角度
        this.run_type = type;
        //武器extra原始值
        this.extra = {};
        //设置武器基础信息
        /**
         * @type {ShipWeapon}
         */
        this.base_weapon = null;
        //设置弹药基础信息
        this.base_bullet = null;
        //当前武器坐标 每次调用传入
        this.weapon_point = null;
        //当前武器角度 每次调用传入
        this.weapon_rotation = 0;
        //总波次
        this.delay_count = 0;
        //波次信息
        this.delay_totals = {};
        /**
         * 武器创建时的信息列表
         * @type {Object<number, Object<number, BulletCreatePosInfo>>}
         */
        this.pos_infos = {};

        /**
         * 武器运行时的信息列表
         * @type {BulletRunPosInfo}
         */
        this.pos_info = null;
        // //末日武器启动时间
        // this.doomsday_per_heat_frame = 0;
        // //末日武器产生的模块持续时间  玩家的模块时间都是和CD一致 NPC的模块时间要远小于武器CD时间
        // this.doomsday_battle_frame = 0;
    }

    /**
     * 设置武器extra基础属性
     * @param extra
     * @returns {BulletExtras}
     */
    setExtra(extra) {
        this.extra = extra;
        return this;
    }

    /**
     * 设置
     * @param base_weapon
     * @returns {BulletExtras}
     */
    setBaseWeapon(base_weapon) {
        this.base_weapon = base_weapon;
        return this;
    }

    /**
     * @param base_bullet
     * @returns {BulletExtras}
     */
    setBaseBullet(base_bullet) {
        this.base_bullet = base_bullet;
        return this;
    }

    setWeaponPoint(weapon_point) {
        this.weapon_point = weapon_point;
        return this;
    }

    setWeaponRotation(weapon_rotation) {
        this.weapon_rotation = weapon_rotation;
        return this;
    }

    /**
     * 弹药运行时设置循环针
     * @param loop_start_frame
     * @param loop_end_frame
     */
    setLoopFrame(loop_start_frame, loop_end_frame) {
        this.pos_info.setLoopStartFrame(loop_start_frame);
        this.pos_info.setLoopEndFrame(loop_end_frame);
    }

    setRepeatFrame(repeat_start_frame, repeat_end_frame) {
        this.pos_info.setRepeatStartFrame(repeat_start_frame);
        this.pos_info.setRepeatEndFrame(repeat_end_frame);
    }

    /**
     * 当更新武器时更新此参数,(太空换装)
     */
    updateExtras() {
        this.reInitPosInfos();
        //初始化第一帧
        this.initExtraStartDelay();
        //初始化除了波次外的其他属性
        this.initExtraStartProperty();
        return this;
    }

    /**
     * 根据弹药总数量初始化弹药数据
     */
    reInitPosInfos() {
        this.delay_totals = {};
        this.pos_infos = {};
        //只会出现2种一种多一颗 一种少一颗
        let more = Math.ceil(this.base_weapon.count / this.base_weapon.multiple);
        let less = Math.floor(this.base_weapon.count / this.base_weapon.multiple);
        //说明数量和波次正好能整除
        if (more === less) {
            this.pos_infos[more] = {};
            for (let bullet_pos = 0; bullet_pos < more; bullet_pos++) {
                this.pos_infos[more][bullet_pos] = new BulletCreatePosInfo(bullet_pos, more);
            }
        } else {
            this.pos_infos[more] = {};
            for (let bullet_pos = 0; bullet_pos < more; bullet_pos++) {
                this.pos_infos[more][bullet_pos] = new BulletCreatePosInfo(bullet_pos, more);
            }
            this.pos_infos[less] = {};
            for (let bullet_pos = 0; bullet_pos < less; bullet_pos++) {
                this.pos_infos[less][bullet_pos] = new BulletCreatePosInfo(bullet_pos, less);
            }
        }
    }

    /**
     * 初始化总波次
     */
    initDelayCount() {
        this.delay_count = (this.extra[this.run_type] && this.extra[this.run_type][common.static.BULLET_EXTRA_CREATE_DELAY]) ? this.extra[this.run_type][common.static.BULLET_EXTRA_CREATE_DELAY] : 1;
    }

    /**
     * 初始化波次 延迟
     */
    initExtraStartDelay() {
        this.initDelayCount();
        //获取波次
        //先遍历第一遍 判断当前波次 并获取每波次的最大数量
        this.eachBulletCreatePosInfos((pos_info) => {
            let delay_frame = 0;
            if (this.delay_count > 1) {
                //根据弹药数量 平均分配 多余的放到第一组 公式在小数的时候并不太完全 但是基本符合需求
                //需要考虑对称 不然不好看
                // 方案一
                //如果是单数 需要把第一发弹药让出来 单独一个组
                let is_odd = pos_info.bullet_total % 2;
                //只要有散射角度或者间距 则认定为对称 即除了第一波以外每波2个弹药
                let is_symmetric = (this.base_weapon.scatter || this.base_weapon.space) ? 2 : 1;
                //延迟数量不能超过弹药数量的一半 超过了会左一发右一发 或者变成延迟很高的单发
                let delay_count = Math.min(this.delay_count, Math.ceil(pos_info.bullet_total / is_symmetric));
                delay_frame = Math.floor((pos_info.bullet_pos + is_odd) * delay_count / (pos_info.bullet_total + is_odd));

                //先获取对称后每波次的最大数量
                // let per_count = Math.max(1, Math.floor(pos_info.bullet_total / this.delay_count / 2)) * 2;
                //计算剩余未分配的弹药数量 如果是奇数最少1个 可以保证只有第一个数组是单数
                // delay_frame = Math.max(0, Math.floor((pos_info.bullet_pos - Math.max(pos_info.bullet_total % 2, pos_info.bullet_total - this.delay_count * per_count)) / per_count));
            }
            //设置延迟帧数 同当前第几波次
            pos_info.setDelayFrame(delay_frame);
            //汇总波次总数量
            this.delay_totals[pos_info.bullet_total] || (this.delay_totals[pos_info.bullet_total] = {});
            this.delay_totals[pos_info.bullet_total][delay_frame] || (this.delay_totals[pos_info.bullet_total][delay_frame] = 0);
            //设置当前弹药位于本波次的位置
            pos_info.setDelayPos(this.delay_totals[pos_info.bullet_total][delay_frame]);
            //当前波次总数量++
            this.delay_totals[pos_info.bullet_total][delay_frame]++;
        }, this);
        this.eachBulletCreatePosInfos((pos_info) => {
            //设置分割后的总数 用于未来弹药对称调整角度用
            pos_info.setDelayTotal(this.delay_totals[pos_info.bullet_total][pos_info.delay_frame]);
            //获取弹药处于本波次的角度
            pos_info.setRelativeRotation(this.getBulletTotalValue(pos_info.delay_pos, pos_info.delay_total, this.base_weapon.scatter));
            //调整起始行间距
            pos_info.setRelativeTransverse(this.getBulletTotalValue(pos_info.delay_pos, pos_info.delay_total, this.base_weapon.space));
            //记录原始角度
            pos_info.setRelativeOriginalRotation(pos_info.relative_rotation);
        }, this);
    }

    /**
     * 初始化平行射击 当执行角度归位时 弹药按照0角度运行
     * @param extra_info
     */
    initExtraStartProperty(extra_info) {
        if (this.extra[this.run_type]) {
            //如果末日武器存在 末日武器是附在武器上的不是给每个弹药附属性
            // if (this.extra[this.run_type][common.static.BULLET_EXTRA_CREATE_DOOMSDAY_PER_HEAT]) {
            //     this.doomsday_per_heat_frame = this.extra[this.run_type][common.static.BULLET_EXTRA_CREATE_DOOMSDAY_PER_HEAT];
            //     this.doomsday_battle_frame = this.extra[this.run_type][common.static.BULLET_EXTRA_CREATE_DOOMSDAY_BATTLE];
            // }
            this.eachBulletCreatePosInfos((pos_info) => {
                for (let extra_type in this.extra[this.run_type]) {
                    let extra_info = this.extra[this.run_type][extra_type];
                    extra_type = parseInt(extra_type);
                    switch (extra_type) {
                        // case common.static.BULLET_EXTRA_CREATE_ORIGINAL:
                        //     //调整原始角度
                        //     pos_info.setRelativeOriginalRotation(this.getBulletAverageValue(pos_info.delay_pos, this.delay_totals[pos_info.delay_frame], extra_info * this.draw_ratio));
                        //     break;
                        // case common.static.BULLET_EXTRA_CREATE_ORIGINAL_SURROUND:
                        //     //调整原始全角
                        //     pos_info.setRelativeOriginalRotation(this.getBulletTotalValue(pos_info.delay_pos, this.delay_totals[pos_info.delay_frame], extra_info * this.draw_ratio));
                        //     break;
                        // case common.static.BULLET_EXTRA_CREATE_ROTATION:
                        //     //调整起始角度
                        //     pos_info.setRelativeRotation(this.getBulletAverageValue(pos_info.delay_pos, this.delay_totals[pos_info.delay_frame], extra_info * this.draw_ratio));
                        //     break;
                        // case common.static.BULLET_EXTRA_CREATE_ROTATION_SURROUND:
                        //     //调整起始全角
                        //     pos_info.setRelativeRotation(this.getBulletTotalValue(pos_info.delay_pos, this.delay_totals[pos_info.delay_frame], extra_info * this.draw_ratio));
                        //     break;
                        // case common.static.BULLET_EXTRA_CREATE_WAVE_ROTATION:
                        //     //波次角度
                        //     pos_info.setRelativeRotation(this.getBulletAverageValue(pos_info.bullet_pos, pos_info.bullet_total, extra_info * this.draw_ratio));
                        //     break;
                        case common.static.BULLET_EXTRA_CREATE_WAVE_ROTATION_SURROUND:
                            //波次全角
                            if (extra_info) {
                                pos_info.setRelativeRotation(this.getBulletTotalValue(pos_info.bullet_pos, pos_info.bullet_total, extra_info * this.draw_ratio));
                            } else {
                                //如果设置0则继承散射角度
                                pos_info.setRelativeRotation(this.getBulletTotalValue(pos_info.bullet_pos, pos_info.bullet_total, this.base_weapon.scatter));
                            }
                            break;
                        // case common.static.BULLET_EXTRA_CREATE_WAVE_SPACE:
                        //     //波次距离
                        //     pos_info.setRelativeTransverse(this.getBulletAverageValue(pos_info.bullet_pos, pos_info.bullet_total, extra_info * this.draw_ratio));
                        //     break;
                        case common.static.BULLET_EXTRA_CREATE_WAVE_SPACE_SURROUND:
                            //波次全距
                            if (extra_info) {
                                pos_info.setRelativeTransverse(this.getBulletTotalValue(pos_info.bullet_pos, pos_info.bullet_total, extra_info * this.draw_ratio));
                            } else {
                                pos_info.setRelativeTransverse(this.getBulletTotalValue(pos_info.bullet_pos, pos_info.bullet_total, this.base_weapon.space));
                            }
                            break;
                        // case common.static.BULLET_EXTRA_CREATE_SPEED:
                        //     //调整起始速度
                        //     pos_info.setAbsoluteSpeed(extra_info * this.draw_ratio);
                        //     break;
                    }
                }
            }, this);
        }
    }

    /**
     * 根据当前武器坐标和角度计算修正后的武器数据
     */
    getExtraStartPosInfos(weapon_point, weapon_rotation) {
        this.setWeaponPoint(weapon_point);
        this.setWeaponRotation(weapon_rotation);
        this.eachBulletCreatePosInfos((pos_info) => {
            //有了武器坐标 和 武器角度 返回每个武器的起始坐标 起始角度 原始角度
            pos_info.setAbsoluteWeaponRotation(weapon_rotation);
            pos_info.setAbsoluteRotation(common.func.formatAngle(pos_info.relative_rotation + this.weapon_rotation));
            pos_info.setAbsoluteOriginalRotation(common.func.formatAngle(pos_info.relative_original_rotation + this.weapon_rotation));
            pos_info.setAbsolutePoint(common.func.anglePoint(this.weapon_point.x, this.weapon_point.y, this.weapon_rotation + 9000, pos_info.relative_transverse));
        }, this);
        return this.pos_infos;
    }

    /**
     * 初始化运行时的信息
     * @returns {BulletExtras}
     */
    initPosInfo() {
        this.pos_info = new BulletRunPosInfo();
        return this;
    }

    /**
     * 重置绝对速度和绝对角度
     */
    reInitPosInfo() {
        this.pos_info.setAbsoluteSpeedStatus(false);
        this.pos_info.setAbsoluteSpeed(0);
        this.pos_info.setAbsoluteRotationStatus(false);
        this.pos_info.setAbsoluteRotation(0);
    }

    /**
     * @returns {BulletRunPosInfo}
     */
    getPosInfo() {
        return this.pos_info;
    }

    /**
     * @param run_frame
     * @returns {BulletRunPosInfo}
     */
    getExtraRunPosInfo(run_frame) {
        //重置修正速度和角度
        this.reInitPosInfo();
        //如果存在循环 则开始处理循环
        if (this.pos_info.loop_start_frame && this.pos_info.loop_end_frame) {
            if (run_frame > this.pos_info.loop_end_frame) {
                //(当前帧-起始帧)%(结束帧-起始帧+1)+起始帧
                run_frame = (run_frame - this.pos_info.loop_start_frame) % (this.pos_info.loop_end_frame - this.pos_info.loop_start_frame + 1) + this.pos_info.loop_start_frame;
            }
        }
        if (this.pos_info.repeat_start_frame && this.pos_info.repeat_end_frame) {
            //如果在重复内 则重复为第一帧
            if (run_frame > this.pos_info.repeat_start_frame && run_frame <= this.pos_info.repeat_end_frame) {
                run_frame = this.pos_info.repeat_start_frame;
            } else {
                //重置重复
                this.setRepeatFrame(0, 0);
            }
        }
        if (this.extra[run_frame]) {
            //获取当前帧需要处理的extra信息
            for (let extra_type in this.extra[run_frame]) {
                let extra_info = this.extra[run_frame][extra_type];
                extra_type = parseInt(extra_type);
                switch (extra_type) {
                    case common.static.BULLET_EXTRA_RUN_ORIGINAL:
                        //弹药角度归位
                        if (extra_info) {
                            this.pos_info.setAbsoluteRotation(this.base_bullet.original_rotation);
                        } else {
                            this.pos_info.setAbsoluteRotation(this.base_bullet.original_weapon_rotation);
                        }
                        this.pos_info.setAbsoluteRotationStatus(true);

                        break;
                    case common.static.BULLET_EXTRA_RUN_SPEED_MAX:
                        //弹药速度最大
                        if (extra_info) {
                            this.pos_info.setAbsoluteSpeed(this.base_bullet.velocity_max);
                        } else {
                            this.pos_info.setAbsoluteSpeed(0);
                        }
                        this.pos_info.setAbsoluteSpeedStatus(true);
                        break;
                    // case common.static.BULLET_EXTRA_RUN_ROTATION:
                    //     //角度相对于当前变更 考虑对称 角度
                    //     let delay_rotation = this.getBulletAverageValue(this.base_bullet.delay_pos, this.base_bullet.delay_total, extra_info * this.draw_ratio);
                    //     this.pos_info.setAbsoluteRotation(common.func.formatAngle(this.base_bullet.rotation + delay_rotation));
                    //     this.pos_info.setAbsoluteRotationStatus(true);
                    //     break;
                    case common.static.BULLET_EXTRA_RUN_ROTATION_SURROUND:
                        //角度相对于当前变更 考虑对称 全角
                        let delay_rotation_surround = this.getBulletTotalValue(this.base_bullet.delay_pos, this.base_bullet.delay_total, extra_info * this.draw_ratio);
                        this.pos_info.setAbsoluteRotation(common.func.formatAngle(this.base_bullet.rotation + delay_rotation_surround));
                        this.pos_info.setAbsoluteRotationStatus(true);
                        break;
                    case common.static.BULLET_EXTRA_RUN_SPEED:
                        //调整速度绝对
                        this.pos_info.setAbsoluteSpeed(extra_info * this.draw_ratio);
                        this.pos_info.setAbsoluteSpeedStatus(true);
                        break;
                    // case common.static.BULLET_EXTRA_RUN_SPEED_INCREMENT:
                    //     //调整速度相对
                    //     this.pos_info.setAbsoluteSpeed(this.base_bullet.velocity + extra_info * this.draw_ratio);
                    //     this.pos_info.setAbsoluteSpeedStatus(true);
                    //     break;
                    case common.static.BULLET_EXTRA_RUN_LOOP:
                        //开始循环
                        if (!(this.pos_info.loop_start_frame && this.pos_info.loop_end_frame)) {
                            this.setLoopFrame(run_frame, extra_info);
                        }
                        break;
                    case common.static.BULLET_EXTRA_RUN_REPEAT:
                        //开始循环
                        if (!(this.pos_info.repeat_start_frame && this.pos_info.repeat_end_frame)) {
                            this.setRepeatFrame(run_frame, extra_info);
                        }
                        break;
                }
            }
        }
        return this.pos_info;
    }

    /**
     * @param {callbackBulletCreatePosInfo} callback
     * @param thisObj
     */
    eachBulletCreatePosInfos(callback, thisObj) {
        for (let total in this.pos_infos) {
            for (let pos_info of Object.values(this.pos_infos[total])) {
                callback && callback.call(thisObj, pos_info);
            }
        }
    }

    /**
     * 根据位置总数平均值获取实际值
     * @param delay_pos
     * @param count
     * @param average
     * @returns {number}
     */
    getBulletAverageValue(delay_pos, count, average) {
        if (count <= 1 || average === 0) {
            return 0;
        }

        //复数 5=>-2.5 3=>-1.5 1=>-0.5 0=>0.5 2=>1.5 4=>2.5
        //单数 3=>-2 1=>-1 0=>0 2=>1 4=>2
        // let ratio = (count % 2) ? ((delay_pos % 2) ? (delay_pos + 1) : -delay_pos) : ((delay_pos % 2) ? delay_pos : (-delay_pos - 1));
        let ratio = common.method.getPosRatio(delay_pos, count);

        return Math.round(ratio / 2 * average);
        // 0 1 2 3 4 5
        // return Math.round((delay_pos - (count - 1) / 2) * average);
    }

    /**
     * 根据位置总数总范围获取实际值
     * @param delay_pos
     * @param count
     * @param total
     * @returns {number}
     */
    getBulletTotalValue(delay_pos, count, total) {
        if (count <= 1 || total === 0) {
            return 0;
        }
        // let ratio = (count % 2) ? ((delay_pos % 2) ? (delay_pos + 1) : -delay_pos) : ((delay_pos % 2) ? delay_pos : (-delay_pos - 1));
        let ratio = common.method.getPosRatio(delay_pos, count);

        return Math.round(ratio / 2 * total / count);
        // return Math.round((delay_pos - (count - 1) / 2) * total / count);
    }
}

/**
 * @class {BulletCreatePosInfo}
 */
class BulletCreatePosInfo {
    constructor(bullet_pos, bullet_total) {
        this.bullet_pos = bullet_pos;
        this.bullet_total = bullet_total;
        //创建后停滞的帧数
        this.delay_frame = 0;
        //分割后的位置
        this.delay_pos = 0;
        //分割后的总数
        this.delay_total = 0;
        //弹药当前角度 相对于0
        this.relative_rotation = 0;
        //记录原始弹药角度 用于归位
        this.relative_original_rotation = 0;
        //横向修正坐标
        this.relative_transverse = 0;
        //记录武器原始角度 用于弹药归位
        this.absolute_weapon_rotation = 0;
        //绝对速度
        this.absolute_speed = 0;
        //绝对弹药当前角度
        this.absolute_rotation = 0;
        //绝对原始弹药角度
        this.absolute_original_rotation = 0;
        //绝对起始位置
        this.absolute_point = {};
    }

    setDelayFrame(delay_frame) {
        this.delay_frame = delay_frame;
    }

    setDelayPos(delay_pos) {
        this.delay_pos = delay_pos;
    }

    setDelayTotal(delay_total) {
        this.delay_total = delay_total;
    }

    setRelativeRotation(relative_rotation) {
        this.relative_rotation = relative_rotation;
    }

    setRelativeOriginalRotation(relative_original_rotation) {
        this.relative_original_rotation = relative_original_rotation;
    }

    setRelativeTransverse(relative_transverse) {
        this.relative_transverse = relative_transverse;
    }

    setAbsoluteSpeed(absolute_speed) {
        this.absolute_speed = absolute_speed;
    }

    setAbsoluteWeaponRotation(absolute_weapon_rotation) {
        this.absolute_weapon_rotation = absolute_weapon_rotation;
    }

    setAbsoluteRotation(absolute_rotation) {
        this.absolute_rotation = absolute_rotation;
    }

    setAbsoluteOriginalRotation(absolute_original_rotation) {
        this.absolute_original_rotation = absolute_original_rotation;
    }

    setAbsolutePoint(absolute_point) {
        this.absolute_point = absolute_point;
    }
}

/**
 * @class {BulletRunPosInfo}
 */
class BulletRunPosInfo {
    constructor() {
        //是否更改过速度
        this.absolute_speed_status = false;
        //是否更改过角度
        this.absolute_rotation_status = false;
        //绝对速度
        this.absolute_speed = 0;
        //绝对弹药当前角度
        this.absolute_rotation = 0;
        //循环开始帧数
        this.loop_start_frame = 0;
        //循环结束帧数
        this.loop_end_frame = 0;
        //重复开始帧数
        this.repeat_start_frame = 0;
        //重复结束帧数
        this.repeat_end_frame = 0;
    }

    setAbsoluteSpeedStatus(absolute_speed_status) {
        this.absolute_speed_status = absolute_speed_status;
    }

    setAbsoluteRotationStatus(absolute_rotation_status) {
        this.absolute_rotation_status = absolute_rotation_status;
    }

    setAbsoluteSpeed(absolute_speed) {
        this.absolute_speed = absolute_speed;
    }

    setAbsoluteRotation(absolute_rotation) {
        this.absolute_rotation = absolute_rotation;
    }

    setLoopStartFrame(loop_start_frame) {
        this.loop_start_frame = loop_start_frame;
    }

    setLoopEndFrame(loop_end_frame) {
        this.loop_end_frame = loop_end_frame;
    }

    setRepeatStartFrame(repeat_start_frame) {
        this.repeat_start_frame = repeat_start_frame;
    }

    setRepeatEndFrame(repeat_end_frame) {
        this.repeat_end_frame = repeat_end_frame;
    }
}

module.exports = BulletExtras;
