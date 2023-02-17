const m_server = require("../../index");
const common = require("../../../common");
const TemplateUnitInfo = require("./TemplateUnitInfo");

/**
 * 死亡空间信息
 * @class {TemplateInfo}
 */

class TemplateInfo {
    constructor(base_info) {
        //死亡空间或者任务空间类
        this.base_info = base_info;
        //本死亡空间唯一基础单位ID
        this._template_unit_id = 0;

        this.rotation = this.base_info.rotation;

        this.global_x = 0;
        this.global_y = 0;

        //当前接单
        // this.step = 0;
        /**
         * 单位列表 unit_id
         * @type {Object<number, TemplateUnitInfo>}
         */
        this.unit_list = {};

        /**
         * 主线触发事件
         * @type {Object<number, Object<number, Object>>}
         */
        this.triggers = {};
        /**
         * 支线触发事件数组
         * @type {Object<number, Array<>>}
         */
        // this.trigger_slave = {};

        this.draw_ratio = common.setting.draw_ratio;
        //每种舰船刷新的个数 总得分除以这个值 刷新数量乘以这个值 保证小怪每种至少刷新2只 暂不能修改这个值
        this.base_type_count = 2;

        //合计数量
        this.count_total = 0;
        //阵营总数
        this.count_camp = [];
        //阶段数量
        this.count_step = [];
        //布局数量
        this.count_plan = [];
        //任务完成步骤剩余数量类型
        // this.complete_classify = null;


        /**
         * @type {PlayerTask}
         */
        // this.player_task = null;
        //用于判断离线任务
        // this.base_type = 0;
        //进攻者阵营
        this.attacker_force = 0;
    }

    get template_unit_id() {
        return ++this._template_unit_id;
    }

    /**
     * @param global_x
     * @param global_y
     * @returns {TemplateInfo}
     */
    setGlobalPoint(global_x, global_y) {
        this.global_x = global_x;
        this.global_y = global_y;
        return this;
    }

    /**
     * 设置进攻者阵营
     * @param force
     * @returns {TemplateInfo}
     */
    setAttackerForce(force) {
        this.attacker_force = force;
        return this;
    }

    /**
     * @param base_space_info
     * @returns {TemplateInfo}
     */
    loadBaseInfo(base_space_info) {
        this.force = base_space_info.dao.force;
        this.category = base_space_info.dao.category;
        this.difficult = base_space_info.dao.difficult;
        this.score = base_space_info.dao.score;
        this.template_id = base_space_info.dao.template_id;
        return this;
    }

    // /**
    //  * @param base_type
    //  */
    // setBaseType(base_type) {
    //     this.base_type = base_type;
    // }

    /**
     * 检测初始化触发阶段
     */
    checkTriggerNextStepType(type, template_unit_id) {
        if (type === common.define.TRIGGER_TYPE_INIT) {
            //初始化强制刷新第0阶段
            this.triggerStep(0);
            //触发成功了 再触发一遍 无目标的死亡 用于刷新数量
            //TODO 也许不应该写在这里 玩家下线再上线了这里也要刷新一下
            // this.checkTriggerNextStepType(common.define.TRIGGER_TYPE_DEATH);
        } else {
            let template_unit_info = this.getUnitInfo(template_unit_id);
            //TODO 新增加了阵营的判断 这个禁止为空
            if (!template_unit_info) {
                dd('end');
            }
            type === common.define.TRIGGER_TYPE_DEATH && this.delUnitToList(template_unit_info);

            this.checkNextStep(type, template_unit_info, (check_step) => {
                this.triggerStep(check_step);
                //触发成功了 再触发一遍
                // this.checkTriggerNextStepType(common.define.TRIGGER_TYPE_DEATH);
            }, this);
        }
    }

    /**
     * 玩家再次登录的时候 强制刷新当前任务状态 用于更新统计数量
     */
    // updateTaskPlayerCount() {
    //     this.checkNextStep(common.define.TRIGGER_TYPE_DEATH, null, (check_step) => {
    //         this.triggerStep(check_step);
    //     }, this);
    // }

    /**
     * @param {TemplateUnitInfo} template_unit_info
     */
    addUnitToList(template_unit_info) {
        //增加总数量统计
        this.count_total++;
        //阵营总数
        this.count_camp[template_unit_info.force] || (this.count_camp[template_unit_info.force] = 0);
        this.count_camp[template_unit_info.force]++;
        //增加阶段数量统计
        this.count_step[template_unit_info.force] || (this.count_step[template_unit_info.force] = []);
        this.count_step[template_unit_info.force][template_unit_info.step] || (this.count_step[template_unit_info.force][template_unit_info.step] = 0);
        this.count_step[template_unit_info.force][template_unit_info.step]++;
        //增加布局数量统计
        this.count_plan[template_unit_info.force] || (this.count_plan[template_unit_info.force] = []);
        this.count_plan[template_unit_info.force][template_unit_info.plan_id] || (this.count_plan[template_unit_info.force][template_unit_info.plan_id] = 0);
        this.count_plan[template_unit_info.force][template_unit_info.plan_id]++;

        this.unit_list[template_unit_info.template_unit_id] = template_unit_info;
    }

    /**
     * 单位死亡 只是死亡 不同列表移除 为啥不移除?统计数据用?
     * @param template_unit_info
     */
    delUnitToList(template_unit_info) {
        //减去总数量统计
        this.count_total--;
        //阵营总数
        this.count_camp[template_unit_info.force]--;
        //减去阶段数量统计
        this.count_step[template_unit_info.force][template_unit_info.step]--;
        //减去布局数量统计
        this.count_plan[template_unit_info.force][template_unit_info.plan_id]--;

        delete this.unit_list[template_unit_info.template_unit_id];
    }

    /**
     * @param template_unit_id
     * @returns {TemplateUnitInfo}
     */
    getUnitInfo(template_unit_id) {
        return this.unit_list[template_unit_id];
    }

    /**
     * 检测是否触发下一步
     * @param type
     * @param template_unit_info
     * @param callback
     * @param thisObj
     */
    checkNextStep(type, template_unit_info, callback, thisObj) {
        //触发支线
        //构思一下移除支线的问题
        // 1.不能在这里移除 可能有多条任务线触发支线 移除了这里没用
        // 2.这里也可能触发多个线 不能移除
        for (let step in this.triggers) {
            let triggers = this.triggers[step];
            //这里要复制一个数组
            // ff('特殊', Object.values(trigger))
            for (let pos in triggers) {
                let trigger_info = triggers[pos];
                this.checkNextStepTrigger(type, template_unit_info, trigger_info, (check_step) => {
                    //触发成功了 就移除自己
                    delete triggers[pos];
                    callback && callback.call(thisObj, check_step)
                }, this);
            }

            //如果阶段全部完成 则移除阶段
            if (Object.keys(triggers).length === 0) {
                delete this.triggers[step];
            }
        }
        // ff('主线', Object.values(this.triggers))
        //触发主线 这里要复制一个数组
        // this.checkNextStepTrigger(type, unit_info, Object.values(this.triggers), callback, thisObj);
    }

    /**
     * 检测触发器是否触发下一步
     * @param type
     * @param {TemplateUnitInfo} template_unit_info
     * @param trigger_info
     * @param callback
     * @param thisObj
     */
    checkNextStepTrigger(type, template_unit_info, trigger_info, callback, thisObj) {
        let [classify, value, percent, step] = trigger_info;

        // ff(step_type, classify, value, percent, step);
        //检测触发几率
        // ff('开始检测几率', trigger_info);
        // let count = 0;
        // let compare = 0;
        // let compare_status = false;
        if (this.checkPercent(percent)) {
            // ff('几率触发成功');
            switch (classify) {
                case common.define.TRIGGER_CLASSIFY_ALL_LESS:
                    if (type === common.define.TRIGGER_TYPE_DEATH) {
                        //总数量触发 只触发防守阵营的
                        if (template_unit_info.camp === 0) {
                            //总数量<=设定数量 则触发
                            if (this.count_camp[template_unit_info.force] <= value) {
                                callback && callback.call(thisObj, step);
                            }
                        }
                    }
                    break;
                case common.define.TRIGGER_CLASSIFY_STEP_LESS:
                    if (type === common.define.TRIGGER_TYPE_DEATH) {
                        //总数量触发 只触发防守阵营的
                        if (template_unit_info.camp === 0) {
                            //单位阶段数量<=设定数量 则触发
                            if (this.count_step[template_unit_info.force][template_unit_info.step] <= value) {
                                callback && callback.call(thisObj, step);
                            }
                        }
                    }
                    break;
                case common.define.TRIGGER_CLASSIFY_PLAN_LESS:
                    if (type === common.define.TRIGGER_TYPE_DEATH) {
                        //模版ID = 0 则触发
                        if (this.count_plan[template_unit_info.force][value] === 0) {
                            callback && callback.call(thisObj, step);
                        }
                    }
                    break;
                case common.define.TRIGGER_CLASSIFY_UNIT_HARM:
                    if (type === common.define.TRIGGER_TYPE_HARM) {
                        //单位模版id = 设定值 则触发
                        if (template_unit_info.plan_id === value) {
                            callback && callback.call(thisObj, step);
                        }
                    }
                    break;
                case common.define.TRIGGER_CLASSIFY_UNIT_BYRAY:
                    if (type === common.define.TRIGGER_TYPE_RAY) {
                        if (template_unit_info.plan_id === value) {
                            callback && callback.call(thisObj, step);
                        }
                    }
                    break;
                default:
                    dd('不应该走到这里');
            }
        }
    }

    /**
     * 更新玩家任务数量
     */
    // updatePlayerTaskLessCount(count) {
    //     this.player_task && this.player_task.is_delete === false && this.player_task.updateTaskLessCount(count);
    // }

    /**
     * 检测几率
     * @param percent
     * @return {boolean}
     */
    checkPercent(percent) {
        //TODO 临时打印用方法
        if (percent < 100) {
            let rand = common.func.getRand(0, 99);
            ff('随机一个数', rand, percent);
            return rand < percent;
        }
        return percent >= 100 ? true : common.func.getRand(0, 99) < percent;
    }

    /**
     * 更新阶段的触发
     * @param base_template_step_info
     * @param check_step
     */
    updateStepTrigger(base_template_step_info, check_step) {
        let triggers = base_template_step_info.dao.trigger;
        if (Object.keys(triggers).length) {
            this.triggers[check_step] = {};
            for (let pos in triggers) {
                this.triggers[check_step][pos] = triggers[pos];
            }
        }
    }

    /**
     * 更新阶段的触发
     * @param base_template_step_info
     */
    updateStepActions(base_template_step_info) {
        let actions = base_template_step_info.dao.actions;
        if (Object.keys(actions).length) {
            for (let pos in actions) {
                let action_info = actions[pos];
                //如果是离场 则直接触发
                let [classify, value] = action_info;
                switch (classify) {
                    case common.define.ACTIONS_CLASSIFY_ALL_LEAVE:
                        for (let template_unit_info of Object.values(this.unit_list)) {
                            this.triggerLeave(template_unit_info.unit_ship_npcer);
                        }
                        break;
                    case common.define.ACTIONS_CLASSIFY_CAMP_LEAVE:
                        for (let template_unit_info of Object.values(this.unit_list)) {
                            if (template_unit_info.camp === value) {
                                this.triggerLeave(template_unit_info.unit_ship_npcer);
                            }
                        }
                        break;
                    case common.define.ACTIONS_CLASSIFY_PALN_LEAVE:
                        for (let template_unit_info of Object.values(this.unit_list)) {
                            if (template_unit_info.plan_id === value) {
                                this.triggerLeave(template_unit_info.unit_ship_npcer);
                            }
                        }
                        break;
                }
            }
        }
    }


    /**
     * 触发npcer折跃离开
     * @param unit_ship_npcer
     */
    triggerLeave(unit_ship_npcer) {
        //有质量的敌对才折跃 即非建筑和炮台
        if (unit_ship_npcer.mass_ratio) {
            //获取当前位置距离中心的角度
            let angle = common.func.getAngle(unit_ship_npcer.x, unit_ship_npcer.y, this.global_x, this.global_y);
            //根据这个角度反转180度 找到断层边界的位置机型折跃 因为不会创建unit_warp并且折跃完了直接离开 又是npcer所以不会创建新的断层
            let point = common.func.anglePoint(this.global_x, this.global_y, common.func.formatAngle(angle - 18000), common.setting.base_map_grid_radius);
            //折跃离开
            unit_ship_npcer.warpLeave(point.x, point.y);
        }
    }

    /**
     * 阶段触发
     * @param check_step
     */
    triggerStep(check_step) {
        ff('阶段触发', check_step);
        switch (check_step) {
            case 9:
                this.triggerStepSuccess();
                break;
            case 8:
                this.triggerStepFailed();
                break;
            default:
                this.triggerStepNext(check_step);
        }
    }

    /**
     * 触发成功
     */
    triggerStepSuccess() {
        // this.step = 0;
        this.triggers = {};
        //通知玩家任务完成 含在线和离线
        this.base_info.templateSuccess();
    }

    /**
     * 触发失败
     */
    triggerStepFailed() {
        // this.step = 0;
        this.triggers = {};
        //通知玩家任务完成 含在线和离线
        this.base_info.templateFailed();
    }

    /**
     * 执行下一步
     * @param check_step
     */
    triggerStepNext(check_step) {
        let base_template_step_info = m_server.ServerBaseTemplate.getBaseTemplateStepInfo(this.template_id, check_step);
        this.updateStepTrigger(base_template_step_info, check_step);
        base_template_step_info.eachPlanInfos((base_template_plan_info) => {
            this.createTemplateUnitHandle(base_template_plan_info);
        }, this);

        this.updateStepActions(base_template_step_info);
    }

    /**
     * 创建本次单位
     * @param {BaseTemplatePlanInfo} base_template_plan_info
     */
    createTemplateUnitHandle(base_template_plan_info) {
        let ship_types = [];
        //是否为指定刷新 指定刷新只刷一只
        let type_count;
        if (base_template_plan_info.dao.designated) {
            ship_types = this.getDesignatedShipTypes(base_template_plan_info);
            type_count = base_template_plan_info.dao.designated;
        } else {
            //获取分组得分的舰船类型
            ship_types = this.getGroupRatioShipTypes(base_template_plan_info);
            type_count = this.base_type_count;
        }
        ff('刷新舰船', ship_types.length, '*', type_count, '=', ship_types.length * type_count, ship_types);

        //根据死亡空间角度转换刷新坐标
        let distance = common.func.getDistance(0, 0, base_template_plan_info.x, base_template_plan_info.y);
        let angle = common.func.getAngle(0, 0, base_template_plan_info.x, base_template_plan_info.y);
        let plan_point = common.func.anglePoint(0, 0, this.rotation + angle, distance);
        // 刷新范围 系数护卫本为1巡洋本为1.5无畏本为2.25
        let plan_range = base_template_plan_info.dao.range * this.draw_ratio * Math.pow(1.5, ((this.category + 1) / 2) - 1);

        //刚才梳理了一下大小坐标的问题 所有死亡空间的内部坐标目前为小坐标 就是计算位置什么的 计算完了给死亡空间单位赋值时转为大坐标
        //所有角度目前直接使用的大坐标
        // 修改为引入的时候就改为大坐标

        // ff('类型', base_template_plan_info.dao.type = 3)
        switch (base_template_plan_info.dao.type) {
            case common.define.PLAN_TYPE_POINT:
                // 固定坐标
                for (let ship_type of ship_types) {
                    for (let count = 0; count < type_count; count++) {
                        let point = plan_range ? common.func.anglePoint(plan_point.x, plan_point.y, common.func.getRandRotation(), common.func.getRand(1, plan_range)) : plan_point;
                        //小范围调整角度 10度
                        this.createTemplateUnitInfo(base_template_plan_info, ship_type, point, common.func.formatAngle(this.rotation + base_template_plan_info.rotation + common.func.getRand(-1000, 1000)));
                    }
                }
                break;
            case common.define.PLAN_TYPE_RAND:
                // 随机分布
                for (let ship_type of ship_types) {
                    for (let count = 0; count < type_count; count++) {
                        let point = plan_range ? common.func.anglePoint(plan_point.x, plan_point.y, common.func.getRandRotation(), common.func.getRand(1, plan_range)) : plan_point;
                        this.createTemplateUnitInfo(base_template_plan_info, ship_type, point, common.func.getRandRotation());
                    }
                }
                break;
            case common.define.PLAN_TYPE_SURROUND:
                // 随机环绕
                for (let ship_type of ship_types) {
                    for (let count = 0; count < type_count; count++) {
                        let point = plan_range ? common.func.anglePoint(plan_point.x, plan_point.y, common.func.getRandRotation(), plan_range) : plan_point;
                        this.createTemplateUnitInfo(base_template_plan_info, ship_type, point, common.func.getRandRotation());
                    }
                }
                break;
            case common.define.PLAN_TYPE_FORMATION:
                // 对称队列 四方阵
                // 从后往前依次刷新(舰船类型是从高到低)
                // 先决定每一半有多少列
                let row = Math.ceil(Math.pow(ship_types.length / 2, 0.5));
                // 再决定每行多少个
                let line = Math.floor(ship_types.length / row);
                //如果正好组成方阵 row正好是line的一半
                // 从中心到两侧 先line再row 依次刷新 朝向采用设定的朝向 舰船朝向保持一致
                //当前列
                let now_row = 0;
                //当前行
                let now_line = 0;
                for (let ship_type of ship_types) {
                    for (let count = 0; count < type_count; count++) {
                        //初始化坐标
                        let point = common.func.Point(plan_point.x, plan_point.y);
                        if (plan_range) {
                            //获取x坐标 count=1左侧 count=0右侧 必定按照偶数规则处理
                            // let pos_ratio_x = common.method.getPosRatio(now_row * 2 + count, 2);
                            let pos_ratio_x = common.method.getPosRatio(now_row * 2 + count, type_count);
                            let x = Math.round(pos_ratio_x / 2 * plan_range / row);
                            //获取Y坐标 上下均分即可
                            let pos_ratio_y = common.method.getPosRatio(now_line, line);
                            let y = Math.round(pos_ratio_y / 2 * plan_range / line);

                            //获取距离和角度 根据当前死亡空间角度换算坐标
                            let distance = common.func.getDistance(0, 0, x, y);
                            let angle = common.func.getAngle(0, 0, x, y);
                            point = common.func.anglePoint(plan_point.x, plan_point.y, common.func.formatAngle(angle + this.rotation + base_template_plan_info.rotation), distance);
                        }

                        this.createTemplateUnitInfo(base_template_plan_info, ship_type, point, common.func.formatAngle(this.rotation + base_template_plan_info.rotation));
                    }

                    //列数递增
                    now_row++;
                    //列数满了 换行
                    if (now_row === row) {
                        now_row = 0;
                        now_line++;
                    }
                    //会有余数 按照新一行的规则处理  这些余数刷在界外
                }

                break;
            case common.define.PLAN_TYPE_SYMMETRY:
                // 对称环绕 环形阵
                // 计算每个舰船间隔多少度
                let now_angle = 0;
                for (let ship_type of ship_types) {
                    for (let count = 0; count < type_count; count++) {
                        //初始化坐标
                        let point = common.func.Point(plan_point.x, plan_point.y);
                        let final_angle = this.rotation + base_template_plan_info.rotation;
                        if (plan_range) {
                            //获取x坐标 count=1左侧 count=0右侧 必定按照偶数规则处理
                            //获取Y坐标 上下均分即可
                            let pos_ratio_angle = common.method.getPosRatio(now_angle, ship_types.length);
                            let angle = Math.round(pos_ratio_angle / 2 * 18000 / ship_types.length + 9000) * (count ? 1 : -1);
                            final_angle = common.func.formatAngle(angle + this.rotation + base_template_plan_info.rotation);
                            point = common.func.anglePoint(plan_point.x, plan_point.y, final_angle, plan_range);
                        }

                        this.createTemplateUnitInfo(base_template_plan_info, ship_type, point, final_angle);
                    }
                    //角度递增
                    now_angle++;
                }

                break;
        }
    }

    /**
     * 创建世界单位
     * @param base_template_plan_info
     * @param ship_type
     * @param point
     * @param rotation
     */
    createTemplateUnitInfo(base_template_plan_info, ship_type, point, rotation) {
        let template_unit_info = new TemplateUnitInfo(this.template_unit_id, ship_type)
            .setForce(this.getForceUseCamp(base_template_plan_info.getCamp()))
            .setInfo(base_template_plan_info)
            .setGlobalPoint(this.global_x, this.global_y)
            .setPoint(point.x, point.y)
            .setRotation(rotation);

        this.addUnitToList(template_unit_info);

        template_unit_info.setUnitShipNpcer(this.base_info.createUnitShipNpcer(template_unit_info));
    }

    /**
     * 获取分组得分的舰船类型
     * @param base_template_plan_info
     * @return {[]}
     */
    getGroupRatioShipTypes(base_template_plan_info) {
        let ship_types = [];
        //最终得分比例为当前死亡空间的基础得分*本布局的得分比例
        let total_score = Math.floor(this.score * base_template_plan_info.dao.group_ratio / this.base_type_count);

        //获取分组得分分类纬度的数据
        let group_score_category_list = m_server.ServerBaseTemplate.getGroupScoreCategoryList(
            base_template_plan_info.dao.group_id,
            this.getForceUseCamp(base_template_plan_info.getCamp()),
            this.difficult
        );
        ff('刷新死亡的规格', this.category)
        //从高级向低级平均分布总得分
        for (let category = this.category; category > 0; category--) {
            //本层得分 平均机制
            let category_score = Math.floor(total_score / category);
            //随机获取一个舰船 并减去得分如果 本层得分为0则继续下一层
            let group_score_list = group_score_category_list[category];
            let group_score_keys = Object.keys(group_score_list);

            while (category_score > 0) {
                let ship_type = group_score_keys[common.func.getRand(0, group_score_keys.length - 1)];
                let score = group_score_list[ship_type];
                category_score -= score;
                total_score -= score;

                ship_types.push(parseInt(ship_type));
            }
        }
        return ship_types;
    }

    /**
     * 获取固定模版舰船类型
     * @param base_template_plan_info
     * @returns {[]}
     */
    getDesignatedShipTypes(base_template_plan_info) {
        let ship_types = [];
        //获取分组得分分类纬度的数据
        let group_score_category_list = m_server.ServerBaseTemplate.getGroupScoreCategoryList(
            base_template_plan_info.dao.group_id,
            this.getForceUseCamp(base_template_plan_info.getCamp()),
            this.difficult
        );
        let group_score_list = group_score_category_list[this.category];
        let group_score_keys = Object.keys(group_score_list);
        let ship_type = group_score_keys[common.func.getRand(0, group_score_keys.length - 1)];
        ship_types.push(parseInt(ship_type));
        return ship_types;
    }

    /**
     * 获取势力通过阵营
     * @param camp
     * @returns {number|*}
     */
    getForceUseCamp(camp) {
        return camp ? this.attacker_force : this.force;
    }
}

module.exports = TemplateInfo;
