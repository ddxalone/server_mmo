const BaseUnit = require("./BaseUnit");
const BulletExtras = require("./BulletExtras");
const HarmInfo = require("./HarmInfo");
const common = require("../../../common");

/**
 * @class {UnitBulletMap}
 * @extends {BaseUnit}
 */
class UnitBulletMap extends BaseUnit {
    constructor() {
        super(common.static.MAP_UNIT_TYPE_BULLET);
        //弹药分组ID
        this.unit_group_id = 0;

        this.velocity = 0;
        this.velocity_max = 0;
        this.agile = 0;
        this.accelerate = 0;
        this.blast = 0;
        this.sustain = 0;
        this.res = '';
        this.extra = {};

        this.barrage = 0;

        this.damage_electric = 0;
        this.damage_thermal = 0;
        this.damage_explode = 0;

        this.original_rotation = 0;
        this.delay_frame = 0;
        this.delay_pos = 0;
        this.delay_total = 0;
        //运行帧数 用于获取extra
        this.run_frame = 0;

        this.move_point = common.func.Point();
        this.move_rotation = 0;

        // this.ship_grid_id = 0;
        this.ship_unit_type = 0;
        this.ship_unit_id = 0;
        this.ship_force = 0;
        // this.ship_unit_info = null;

        // this.target_grid_id = 0;
        // this.target_unit_type = 0;
        // this.target_unit_id = 0;
        this.target_unit_info = null;

        //如果是导弹记录目标最后一次的位置 如果单位死亡则飞往这个位置
        this.target_last_x = 0;
        this.target_last_y = 0;

        //每运行帧移动的距离
        this.frame_add_speed = 0;
        //每地图帧移动的距离
        this.map_add_speed = 0;

        //出生点 坐标用于计算超距伤害
        this.birth_x = 0;
        this.birth_y = 0;
        //爆炸点坐标
        this.boom_point = common.func.Point();

        /**
         * @type {BulletExtras}
         */
        this.bullet_extras = null;

        //运行距离 用于计算强制爆炸
        this.less_distance = 0;

        this.chain = 0;
        this.through = 0;


        //舰船半径修正值
        this.ship_range_ratio = 0.8;

        /**
         * 爆炸击中单位
         * @type {BaseUnit}
         */
        this.boom_unit_info = null;

        /**
         * 范围爆炸影响的单位
         * @type {Object<number, Object<number, BaseUnit>>}
         */
        this.sustain_boom_unit_list = {};

        //最后爆炸击中的单位
        this.last_boom_unit_type = 0;
        this.last_boom_unit_id = 0;
        //是否触发过连锁 触发过了 则不执行extra路线更改
        this.last_chain_status = false;
        //表示本地图帧内的运行帧会触发一次转向(连锁)
        this.map_frame_chain_status = false;
        //表示本地图帧内触发过一次贯穿 激光专用
        this.map_frame_through_status = false;

        //当本帧爆炸的话生成这个距离 判断最近的 或者最靠近弹药起始坐标的
        this.check_boom_distance = 0;
        //当本帧爆炸记录爆炸角度差
        this.check_boom_angle = 0;
        //当本帧爆炸记录爆炸单位半径
        this.check_boom_range = 0;

        /**
         * 本帧内触发连锁的单位
         * @type {BaseUnit}
         */
        this.chain_unit_info = null;
        //本帧内触发连锁的爆炸半径
        this.check_chain_range = 0;
        //本地图帧连锁产生的爆炸角度 运行帧会用到
        this.chain_boom_rotation = 0;
        //追加伤害状态 连锁和贯穿都认定为追加伤害 造成50%伤害
        this.additional_damage_status = false;

        //本地图帧内 剩余运行帧数
        this.draw_less_frame = 0;
        //本地图帧 总计剩余运行帧数 这个值是不递减的
        this.draw_less_total_frame = 0;
        //弹药飞行距离修正值
        // this.run_distance_ratio = 0.9;
        //继承玩家的阵营
        this.camp = 0;
    }

    /**
     * 读取信息
     * @param unit_bullet
     * @returns {UnitBulletMap}
     */
    loadInfoMap(unit_bullet) {
        this.unit_group_id = unit_bullet.unit_group_id;
        this.unit_id = unit_bullet.unit_id;
        this.classify = unit_bullet.classify;
        this.item_type = unit_bullet.item_type;

        // this.ship_grid_id = unit_bullet.ship_grid_id;
        this.ship_unit_type = unit_bullet.ship_unit_type;
        this.ship_ship_type = unit_bullet.ship_ship_type;
        this.ship_unit_id = unit_bullet.ship_unit_id;
        this.ship_force = unit_bullet.ship_force;

        this.x = unit_bullet.x;
        this.y = unit_bullet.y;
        this.rotation = unit_bullet.rotation;

        this.birth_x = unit_bullet.birth_x;
        this.birth_y = unit_bullet.birth_y;

        this.original_rotation = unit_bullet.original_rotation;
        this.original_weapon_rotation = unit_bullet.original_weapon_rotation;
        this.delay_frame = unit_bullet.delay_frame;
        this.delay_pos = unit_bullet.delay_pos;
        this.delay_total = unit_bullet.delay_total;
        this.run_frame = unit_bullet.run_frame;

        this.base_range = unit_bullet.base_range;
        this.range = unit_bullet.range;
        this.velocity = unit_bullet.velocity;
        this.velocity_max = unit_bullet.velocity_max;
        this.agile = unit_bullet.agile;
        this.accelerate = unit_bullet.accelerate;
        this.blast = unit_bullet.blast;
        this.sustain = unit_bullet.sustain;
        this.radius = unit_bullet.radius;

        this.res = unit_bullet.res;
        this.extra = unit_bullet.extra;

        this.barrage = unit_bullet.barrage;

        this.damage_electric = unit_bullet.damage_electric;
        this.damage_thermal = unit_bullet.damage_thermal;
        this.damage_explode = unit_bullet.damage_explode;

        this.penetration_electric = unit_bullet.penetration_electric;
        this.penetration_thermal = unit_bullet.penetration_thermal;
        this.penetration_explode = unit_bullet.penetration_explode;

        this.chain = unit_bullet.chain;
        this.through = unit_bullet.through;

        this.final_overload_per = unit_bullet.final_overload_per;
        this.overhang_per = unit_bullet.overhang_per;

        this.target_last_x = unit_bullet.target_last_x;
        this.target_last_y = unit_bullet.target_last_y;


        this.updateLessDistance(this.range);
        //每帧最大转度
        this.frame_max_rotation = this.agile > 0 ? Math.floor(this.agile / this.base_map_frame) : 0;

        this.initBulletExtra();

        this.bullet_extras.setLoopFrame(unit_bullet.loop_start_frame, unit_bullet.loop_end_frame);
        this.bullet_extras.setRepeatFrame(unit_bullet.repeat_start_frame, unit_bullet.repeat_end_frame);

        return this;
    }

    initBulletExtra() {
        this.bullet_extras = new BulletExtras(common.static.WEAPON_EXTRA_TYPE_RUN)
            .setExtra(this.extra)
            .setBaseBullet(this)
            .initPosInfo();
    }

    /**
     * 检测延迟发射判断是否能发射
     */
    useDelayFrame() {
        if (this.delay_frame > 0) {
            this.delay_frame--;
            return false;
        }
        return true;
    }

    /**
     * 检测是否有延迟发射
     * @return {boolean}
     */
    checkRunFrame() {
        return !!this.run_frame;
    }

    /**
     * 检测是否为最后一次击中的单位
     * @param unit_info
     * @return {boolean}
     */
    checkLastBoomUnitInfo(unit_info) {
        return this.last_boom_unit_type === unit_info.unit_type && this.last_boom_unit_id === unit_info.unit_id;
    }

    /**
     * 设置最后一次爆炸的目标信息
     * @param unit_info
     */
    setLastBoomUnitInfo(unit_info) {
        this.last_boom_unit_type = unit_info.unit_type;
        this.last_boom_unit_id = unit_info.unit_id;
    }

    /**
     * 设置爆炸单位
     * @param unit_info
     */
    setBoomUnitInfo(unit_info) {
        this.boom_unit_info = unit_info;
    }

    /**
     * 追加范围单位
     * @param unit_info
     */
    addSustainBoomUnitInfo(unit_info) {
        this.sustain_boom_unit_list[unit_info.unit_type] || (this.sustain_boom_unit_list[unit_info.unit_type] = {});
        this.sustain_boom_unit_list[unit_info.unit_type][unit_info.unit_id] = unit_info;
    }

    /**
     * 清楚爆炸单位
     */
    clearSustainBoomUnitList() {
        this.sustain_boom_unit_list = {};
    }

    setChainUnitInfo(unit_info) {
        this.chain_unit_info = unit_info;
    }

    /**
     * 虚方法
     */
    bulletAi() {

    }

    /**
     * 虚方法
     */
    initDraw() {
    }

    bulletAction() {
        //要等渲染完了才处理死亡
        // if (this.less_distance === 0) {
        //     ff('应该走不到这里了');
        //     this.setBoomPoint(this.x, this.y);
        //     this.beginBoom();
        // } else {
        this.bulletAi();
        // }
    }

    /**
     * 移动弹药的运行动作方法
     */
    bulletRunAction() {
        if (this.getRun()) {
            //剩余距离小于弹药的距离要提前爆炸
            if (this.less_distance <= this.map_add_speed) {
                this.setDrawLessFrame(this.less_distance);
                let boom_point = common.func.anglePoint(this.x, this.y, this.rotation, this.less_distance);
                this.setBoomPoint(boom_point.x, boom_point.y);
                //设置开始爆炸
                this.beginBoom();
            } else {
                //移除自己要在最后做统一移除
                this.updateLessDistance(this.less_distance - this.map_add_speed);
            }
        }
    }

    /**
     * 更新剩余运行距离
     * @param less_distance
     */
    updateLessDistance(less_distance) {
        this.less_distance = Math.max(less_distance, 0);
    }

    /**
     * 更新移动帧数
     */
    updateAddSpeed() {
        this.frame_add_speed = Math.ceil(this.velocity / this.base_map_frame);
        this.map_add_speed = this.frame_add_speed * this.base_run_frame;
    }

    /**
     * 更新移动坐标
     */
    updateMovePoint() {
        this.move_point = common.func.anglePoint(0, 0, this.rotation, this.frame_add_speed);
    }

    /**
     * 弹药加速
     */
    addSpeed() {
        this.setVelocity(this.velocity + this.accelerate);
    }

    /**
     * 设置速度含修正
     * @param velocity
     * @param $force
     */
    setVelocity(velocity, $force = false) {
        this.velocity = $force ? velocity : Math.min(velocity, this.velocity_max);
    }

    /**
     * 处理弹药速度
     */
    addBulletSpeed(pos_info = null) {
        if (pos_info && pos_info.absolute_speed_status) {
            //如果有调整速度 则不执行加速
            this.setVelocity(pos_info.absolute_speed, true);
        } else {
            this.addSpeed();
        }
        //更新速度变量
        this.updateAddSpeed();
    }

    checkTargetValid() {
        //目标存在 且 在同一个合层 才有效
        let valid = (!!this.target_unit_info
            && this.target_unit_info.getRun()
            && this.target_unit_info.map_grid_info.map_merge_info.merge_id === this.map_grid_info.map_merge_info.merge_id
            && this.target_unit_info.checkStealthIng() === false
        );
        valid || (this.target_unit_info = null);
        return valid;
    }

    /**
     * 弹药增加角度
     */
    addBulletRotation(pos_info) {
        if (pos_info.absolute_rotation_status) {
            //如果有绝对角度 则赋值
            this.rotation = pos_info.absolute_rotation;
        } else if (this.classify === common.static.ITEM_CLASSIFY_GUIDE || this.target_unit_info && this.target_unit_info.getRun()) {
            //如果单位活着 更新目标
            if (this.target_unit_info && this.target_unit_info.getRun()) {
                this.target_last_x = this.target_unit_info.x;
                this.target_last_y = this.target_unit_info.y;
            }
            //如果目标单位存在且跟当前目标在一个合层
            let angle = common.func.getAngle(this.x, this.y, this.target_last_x, this.target_last_y);
            let add_angle = common.func.formatRatAngle(angle - this.rotation);
            if (Math.abs(add_angle) < this.base_run_frame) {
                this.move_rotation = 0;
                this.rotation = common.func.formatAngle(this.rotation + add_angle);
            } else {
                if (add_angle > 0) {
                    this.move_rotation = common.func.formatRatAngle((this.move_rotation + this.frame_max_rotation) / 2);
                    this.move_rotation = Math.min(this.move_rotation, this.frame_max_rotation, Math.floor(add_angle / this.base_run_frame));
                } else {
                    this.move_rotation = common.func.formatRatAngle((this.move_rotation - this.frame_max_rotation) / 2);
                    this.move_rotation = Math.max(this.move_rotation, -this.frame_max_rotation, Math.ceil(add_angle / this.base_run_frame));
                }
            }
        } else {
            this.move_rotation = 0;
        }
    }

    /**
     * 清理爆炸参数
     */
    clearFrameValue() {
        //当本帧爆炸的话生成这个距离 判断最近的 或者最靠近弹药起始坐标的
        this.check_boom_distance = 0;
        //当本帧爆炸记录爆炸角度差
        this.check_boom_angle = 0;
        //当本帧爆炸记录爆炸单位半径
        this.check_boom_range = 0;
        //清理本帧需要改变路线状态
        this.map_frame_chain_status = false;

        this.setBoomUnitInfo(null);

        this.clearSustainBoomUnitList();

        //清理连锁的参数
        this.check_chain_range = 0;

        this.setChainUnitInfo(null);
        //清理贯穿的参数
        this.map_frame_through_status = false;
    }

    /**
     * 取第一个能炸到的目标 调整爆炸坐标
     * @param run_frame
     */
    checkExplode(run_frame = this.base_run_frame) {
        this.clearFrameValue();
        //如果尚未爆炸
        if (this.getRun()) {
            switch (this.ship_unit_type) {
                case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                    this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                        map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                            //如果和玩家非同阵营
                            if (unit_ship_npcer.checkAttackPlayer()) {
                                this.checkUnitExplode(unit_ship_npcer, run_frame);
                            }
                        }, this);
                    }, this);
                    break;
                case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                    //如果和玩家非同阵营
                    if (this.checkAttackPlayer()) {
                        this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                            //遍历舰船
                            map_grid_info.eachShipPlayer((unit_ship_player) => {
                                this.checkUnitExplode(unit_ship_player, run_frame);
                            }, this);
                        }, this);
                    }

                    this.map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                        if (this.checkAttackNpcer(unit_ship_npcer.camp)) {
                            this.checkUnitExplode(unit_ship_npcer, run_frame);
                        }
                    }, this);
                    break;
            }

            //如果单位存在 则说明爆炸了 处理最近的 单位
            if (this.boom_unit_info) {
                this.setLastBoomUnitInfo(this.boom_unit_info);
                //计算当前点和爆炸目标的切角长度
                let line = Math.floor(Math.sin(common.func.angleToRadian(this.check_boom_angle)) * this.check_boom_distance);
                let less_line = Math.floor(this.check_boom_distance - Math.sqrt(Math.pow(this.check_boom_range, 2) - Math.pow(line, 2)));

                let boom_point = common.func.anglePoint(this.x, this.y, this.rotation, less_line);

                this.setDrawLessFrame(less_line, run_frame);

                //强行修正坐标
                this.setBoomPoint(boom_point.x, boom_point.y);

                //检测范围伤
                this.sustainHandle();
                //先判断连锁 是 判断是否连锁到人 是 触发连锁
                //先判断连锁 是 判断是否连锁到人 否 触发穿透
                //先判断连锁 否 触发穿透

                this.chainHandle() || this.throughHandle() || this.beginBoom();
                //设定以后的弹药只造成50%伤害
                this.additional_damage_status = true;
            }
        }
    }

    /**
     * 处理范围伤
     */
    sustainHandle() {
        if (this.sustain) {
            //获取剩余弹药飞行距离
            switch (this.ship_unit_type) {
                case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                    this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                        map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                            if (unit_ship_npcer.checkAttackPlayer()) {
                                this.checkUnitChainSustain(unit_ship_npcer);
                            }
                        }, this);
                    }, this);
                    break;
                case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                    if (this.checkAttackPlayer()) {
                        this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                            //遍历舰船
                            map_grid_info.eachShipPlayer((unit_ship_player) => {
                                this.checkUnitChainSustain(unit_ship_player);
                            }, this);
                        }, this);
                    }
                    this.map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                        if (this.checkAttackNpcer(unit_ship_npcer.camp)) {
                            this.checkUnitChainSustain(unit_ship_npcer);
                        }
                    }, this)
                    break;
            }
        }
    }

    /**
     * 检测单位是否触发范围伤害
     * @param unit_info
     */
    checkUnitChainSustain(unit_info) {
        if (unit_info.getRun() && unit_info.checkStealthIng() === false) {
            if (this.checkLastBoomUnitInfo(unit_info) === false) {
                //获取爆炸点和舰船的距离 计算目标半径
                let v_distance = Math.max(0, common.func.getUnitDistance(this.boom_point, unit_info));
                if (v_distance < this.sustain) {
                    this.addSustainBoomUnitInfo(unit_info);
                }
            }
        }
    }

    /**
     * 连锁处理方式
     * @return {boolean}
     */
    chainHandle() {
        //如果有连锁次数
        if (this.chain) {
            //检测是否可以连锁到目标
            this.checkChain();
            //如果连锁到目标
            if (this.chain_unit_info) {
                //使用连锁次数
                this.chain--;
                //表示本地图帧内的运行帧会触发一次转向
                this.map_frame_chain_status = true;

                //触发了连锁 则不再更改extra路线
                this.last_chain_status = true;

                //获取爆炸和舰船的角度 + 当前爆炸的角度差
                this.chain_boom_rotation = common.func.getAngle(this.boom_point.x, this.boom_point.y, this.chain_unit_info.x, this.chain_unit_info.y);

                //如果触发了连锁
                this.beginBoom(false);
                return true;
            }
        }
        return false;
    }

    /**
     * 贯穿处理方式
     * @return {boolean}
     */
    throughHandle() {
        if (this.through) {
            this.through--;

            this.map_frame_through_status = true;

            this.beginBoom(false);
            return true;
        }
        return false;
    }

    /**
     * 检测当前单位和目标单位的爆炸点
     * @param {BaseUnit|UnitShipMap} unit_info
     * @param run_frame
     */
    checkUnitExplode(unit_info, run_frame) {
        //这个方法有问题 是选择了第一个爆炸的目标 这个目标可能在身后 效果非常不好
        //可能要分2步处理 第一步 选择一个最近的 第二步 选择最靠近弹药方向的
        //已经爆炸了就不再判断了
        if (unit_info.getRun() && unit_info.checkStealthIng() === false) {
            if (this.checkLastBoomUnitInfo(unit_info) === false) {
                //先判断剩余飞行距离 超过距离的单位不再判断
                if (common.func.getUnitDistance(this, unit_info) < this.less_distance) {
                    //重新获取弹药距离单位的真实距离
                    let v_distance = common.func.getDistance(this.x, this.y, unit_info.x, unit_info.y);
                    // 爆炸点范围为舰船半径
                    let v_boom_range = Math.floor(unit_info.radius * this.draw_ratio * this.ship_range_ratio);

                    //生成检测半径
                    let v_check_range = v_boom_range;
                    //获取最近的可爆炸距离
                    if (this.check_boom_distance) {
                        v_check_range = Math.min(v_check_range, this.check_boom_distance);
                    }
                    //过滤掉 距离小于检测爆炸范围+下帧运行距离的数据
                    if (v_distance < v_check_range + this.frame_add_speed * run_frame) {
                        //获取弹药和舰船的角度差
                        let v_boom_angle = common.func.formatRatAngle(common.func.getAngle(this.x, this.y, unit_info.x, unit_info.y) - this.rotation);
                        //绝对角度差
                        let v_abs_angle = Math.abs(v_boom_angle);

                        if (v_abs_angle < 8950) {
                            //画圆矩形
                            v_check_range = Math.floor(v_check_range / Math.cos(common.func.angleToRadian(8950 - v_abs_angle)));
                        }

                        //如果在爆炸范围内
                        if (v_distance < v_check_range) {
                            this.check_boom_distance = v_distance;
                            this.check_boom_angle = v_boom_angle;
                            this.check_boom_range = v_boom_range;

                            this.setBoomUnitInfo(unit_info);
                        }
                    }
                }
            }
        }
    }

    /**
     * 检测连锁
     */
    checkChain() {
        //获取剩余弹药飞行距离
        switch (this.ship_unit_type) {
            case common.static.MAP_UNIT_TYPE_SHIP_PLAYER:
                this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                    map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                        if (unit_ship_npcer.checkAttackPlayer()) {
                            this.checkUnitChain(unit_ship_npcer);
                        }
                    }, this);
                }, this);
                break;
            case common.static.MAP_UNIT_TYPE_SHIP_NPCER:
                if (this.checkAttackPlayer()) {
                    this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
                        //遍历舰船
                        map_grid_info.eachShipPlayer((unit_ship_player) => {
                            this.checkUnitChain(unit_ship_player);
                        }, this);
                    }, this);
                }
                this.map_grid_info.eachShipNpcer((unit_ship_npcer) => {
                    if (this.checkAttackNpcer(unit_ship_npcer.camp)) {
                        this.checkUnitChain(unit_ship_npcer);
                    }
                }, this);
                break;
        }
    }

    /**
     * 检测连锁单位
     */
    checkUnitChain(unit_info) {
        if (unit_info.getRun() && unit_info.checkStealthIng() === false) {
            if (this.checkLastBoomUnitInfo(unit_info) === false) {
                //获取爆炸点和舰船的距离
                // let v_distance = common.func.getDistance(this.boom_point.x, this.boom_point.y, unit_info.x, unit_info.y);
                let v_distance = common.func.getUnitDistance(this.boom_point, unit_info);
                //先判断剩余飞行距离 超过距离的单位不再判断
                // let v_check_range = Math.min(common.setting.base_chain_range, this.less_distance);
                let v_check_range = this.less_distance;
                if (this.check_chain_range) {
                    v_check_range = Math.min(v_check_range, this.check_chain_range);
                }
                if (v_distance < v_check_range) {
                    this.check_chain_range = v_distance;

                    this.setChainUnitInfo(unit_info);
                }
            }
        }
    }

    /**
     * 处理单位爆炸功能
     * @param unit_info
     * @param is_sustain
     */
    handleUnitHarm(unit_info, is_sustain = false) {
        let ratio = this.getReductionHarmRatio(unit_info, is_sustain);
        let harm_info = new HarmInfo();
        harm_info.ship_unit_type = this.ship_unit_type;//类型
        harm_info.ship_ship_type = this.ship_ship_type;//类型
        harm_info.ship_unit_id = this.ship_unit_id;//ID
        harm_info.ship_force = this.ship_force;//阵营
        harm_info.item_type = this.item_type;//武器类型
        harm_info.harm_electric = Math.round(this.damage_electric * ratio / 100);//电伤
        harm_info.harm_thermal = Math.round(this.damage_thermal * ratio / 100);//热伤
        harm_info.harm_explode = Math.round(this.damage_explode * ratio / 100);//爆伤
        harm_info.penetration_electric = this.penetration_electric;//电穿
        harm_info.penetration_thermal = this.penetration_thermal;//热穿
        harm_info.penetration_explode = this.penetration_explode;//爆穿
        unit_info.shipHarm(harm_info);
    }

    /**
     * 计算因为爆炸速度爆炸半径导致的伤害减免系数
     * @param unit_info
     * @param is_sustain
     * @return {number}
     */
    getReductionHarmRatio(unit_info, is_sustain = false) {
        //如果是连锁或贯穿则只造成50%伤害
        //如果是范围伤害 再折算一次追加伤害

        let additional_damage_ratio = Math.floor((this.additional_damage_status ? common.setting.base_additional_damage_ratio : 1) * (is_sustain ? common.setting.base_additional_damage_ratio : 1) * 100);
        //计算超距额外伤害
        //弹药爆炸距离每超过基础射程20%伤害额外增加N%,最高为基础射程的200%
        if (this.overhang_per) {
            let distance = common.func.getDistance(this.birth_x, this.birth_y, this.boom_point.x, this.boom_point.y);
            additional_damage_ratio = common.method.calculatePerProperty(additional_damage_ratio, this.overhang_per * Math.min(common.static.OVERHANG_PER_MAX_RATIO, Math.floor(distance / this.base_range / common.static.OVERHANG_PER_STEP_RATIO)));
        }
        //计算过载额外伤害
        if (this.final_overload_per) {
            additional_damage_ratio = common.method.calculatePerProperty(additional_damage_ratio, this.final_overload_per);
        }

        // if (unit_info.radius === 0) {
        //     return additional_damage_ratio;
        // }
        //blast爆炸精度
        //爆炸精度/转向速度
        // return Math.floor(Math.min(1, this.blast / unit_info.agile) * additional_damage_ratio);
        //新公式 爆炸精度100-500 / 25000 * 目标半径50-250
        return Math.floor(Math.min(1, this.blast * unit_info.radius_pow / 100000000) * additional_damage_ratio);
    }

    /**
     * 设置爆炸点
     * @param x
     * @param y
     */
    setBoomPoint(x, y) {
        this.boom_point.x = x;
        this.boom_point.y = y;
    }

    /**
     * 开始爆炸
     * @param status
     */
    beginBoom(status = true) {
        if (this.boom_unit_info) {
            this.handleUnitHarm(this.boom_unit_info);
            for (let unit_type in this.sustain_boom_unit_list) {
                for (let unit_id in this.sustain_boom_unit_list[unit_type]) {
                    let sustain_unit_info = this.sustain_boom_unit_list[unit_type][unit_id];
                    //检测范围爆炸单位是否为最后攻击单位(本帧之前已赋值) 如果不是则判断范围伤害
                    if (this.checkLastBoomUnitInfo(sustain_unit_info) === false) {
                        this.handleUnitHarm(sustain_unit_info, true);
                    }
                }
            }
        }

        if (status) {
            this.setDeath();
        }

        this.bulletBoomDraw();
    }

    /**
     * 虚方法
     */
    bulletDead() {

    }

    /**
     * 虚方法
     */
    bulletBoomDraw() {

    }

    /**
     * 弹药移动
     */
    bulletMove() {
        //如果有玩家控制的力量 则执行移动
        if (this.map_frame_chain_status && this.draw_less_frame === 0) {
            this.x = this.boom_point.x;
            this.y = this.boom_point.y;

            this.rotation = this.chain_boom_rotation;
            this.move_rotation = 0;

            this.updateMovePoint();

            //如果有剩余本帧总计运行帧数 则重新检测碰撞
            if (this.draw_less_total_frame) {
                this.checkExplode(this.draw_less_total_frame);
            }
        } else {
            if (this.move_rotation) {
                this.rotation = common.func.formatAngle(this.rotation + this.move_rotation);
            }
            if (this.move_point.x) {
                this.x += this.move_point.x;
            }
            if (this.move_point.y) {
                this.y += this.move_point.y;
            }
        }

        this.useDrawLessFrame();
    }

    useDrawLessFrame() {
        if (this.draw_less_frame) {
            this.draw_less_frame--;
        }
    }

    /**
     * 设定剩余帧数
     * @param less_line
     * @param run_frame
     */
    setDrawLessFrame(less_line, run_frame = this.base_run_frame) {
        this.draw_less_frame = Math.min(run_frame - 1, Math.max(0, Math.ceil(less_line / this.frame_add_speed)));
        this.draw_less_total_frame = run_frame - 1 - this.draw_less_frame;
    }

    /**
     * 判断是否为同阵营势力
     * @param camp
     * @returns {boolean}
     */
    checkAttackNpcer(camp) {
        return this.camp !== camp;
    }

    /**
     * 获取npcer是否和玩家同阵营
     * @returns {boolean}
     */
    checkAttackPlayer() {
        return !this.camp;
    }
}

module.exports = UnitBulletMap;

