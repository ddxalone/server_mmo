const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseTemplate}
 */
class ServerBaseTemplate {
    constructor() {
        /**
         * 基础模版列表
         * @type {Object<number, BaseTemplateInfo>}
         */
        this.base_template_list = {};
        /**
         * @type {Array<BaseTemplateInfo>}
         */
        this.base_template_list_array = [];
        /**
         * NPCER舰船分组得分列表
         * @type {Object<number, Object<number, Object<number, Object<number, Object<number, number>>>>>}
         */
        this.group_score_list = {};
        /**
         * NPCER舰船布局得分列表
         * @type {Object<number, Object<number, Object<number, Object<number, number>>>>}
         */
        // this.group_plan_list = {};
    }

    static instance() {
        if (ServerBaseTemplate.m_instance == null) {
            ServerBaseTemplate.m_instance = new ServerBaseTemplate();
        }
        return ServerBaseTemplate.m_instance;
    }

    /**
     * 初始化宇宙信息
     */
    async initServerBaseTemplate() {
        this.initServerBaseTemplateResponse(await m_server.BaseTemplateDao.initDaoListPromiseFromData(m_data.BaseTemplateData));
        this.initServerBaseTemplateStepResponse(await m_server.BaseTemplateStepDao.initDaoListPromiseFromData(m_data.BaseTemplateStepData));
        this.initServerBaseTemplatePlanResponse(await m_server.BaseTemplatePlanDao.initDaoListPromiseFromData(m_data.BaseTemplatePlanData));
    }

    initServerBaseTemplateResponse(base_template_list) {
        this.base_template_list = base_template_list;
        this.buildBaseTemplateArray();
        console.log("db base_template_list init done");
    }

    initServerBaseTemplateStepResponse(base_template_step_list) {
        for (let base_template_step_info of Object.values(base_template_step_list)) {
            this.getBaseTemplate(base_template_step_info.template_id).setStepInfo(base_template_step_info);
        }

        this.eachBaseTemplate((base_dead_info) => {
            base_dead_info.buildStepListArray();
        }, this);
        console.log("db base_template_step_list init done");
    }

    initServerBaseTemplatePlanResponse(base_template_plan_list) {
        for (let base_template_plan_info of Object.values(base_template_plan_list)) {
            this.getBaseTemplate(base_template_plan_info.template_id).getStepInfo(base_template_plan_info.step).setPlanInfo(base_template_plan_info);
        }
        this.eachBaseTemplate((base_dead_info) => {
            base_dead_info.eachStepInfos((base_template_step_info) => {
                base_template_step_info.buildPlanListArray();
            }, this);
        }, this);

        console.log("db base_template_plan_list init done");
    }

    buildBaseTemplateArray() {
        this.base_template_list_array = Object.values(this.base_template_list);
    }

    /**
     * 获取某类型死亡空间基础信息
     * @param template_id
     * @returns {BaseTemplateInfo}
     */
    getBaseTemplate(template_id) {
        return this.base_template_list[template_id];
    }

    /**
     * 获取死亡空间某一步的信息
     * @param template_id
     * @param step
     * @returns {BaseTemplateStepInfo}
     */
    getBaseTemplateStepInfo(template_id, step) {
        return this.base_template_list[template_id].getStepInfo(step);
    }

    /**
     * @param {callbackBaseTemplateInfo} callback
     * @param thisObj
     */
    eachBaseTemplate(callback, thisObj) {
        for (let base_dead_info of this.base_template_list_array) {
            callback && callback.call(thisObj, base_dead_info);
        }
    }


    /**
     * 追加得分信息
     */
    addShipNpcerScore(base_ship_npcer_list) {
        for (let base_ship_npcer of base_ship_npcer_list) {
            //score_list 分组 阵营 难度 规格 舰船类型 => 得分
            let category = common.method.getShipCategory(base_ship_npcer.dao.classify);
            //有分组ID 布局ID为空的才加入
            if (base_ship_npcer.dao.group_id) {
                this.addGroupScore(
                    base_ship_npcer.dao.group_id,
                    base_ship_npcer.dao.force,
                    base_ship_npcer.dao.difficult,
                    category,
                    base_ship_npcer.dao.ship_type,
                    base_ship_npcer.dao.score,
                );
            }

            // if (base_ship_npcer.dao.plan_id) {
            //     this.addGroupPlan(
            //         base_ship_npcer.dao.plan_id,
            //         base_ship_npcer.dao.force,
            //         base_ship_npcer.dao.difficult,
            //         category,
            //         base_ship_npcer.dao.ship_type,
            //     );
            // }
        }
    }

    addGroupScore(group_id, force, difficult, category, ship_type, score) {
        this.group_score_list[group_id] || (this.group_score_list[group_id] = {});
        this.group_score_list[group_id][force] || (this.group_score_list[group_id][force] = {});
        this.group_score_list[group_id][force][difficult] || (this.group_score_list[group_id][force][difficult] = {});
        this.group_score_list[group_id][force][difficult][category] || (this.group_score_list[group_id][force][difficult][category] = {});
        this.group_score_list[group_id][force][difficult][category][ship_type] = Math.max(1, score);
    }

    // addGroupPlan(plan_id, force, difficult, category, ship_type) {
    //     this.group_plan_list[plan_id] || (this.group_plan_list[plan_id] = {});
    //     this.group_plan_list[plan_id][force] || (this.group_plan_list[plan_id][force] = {});
    //     this.group_plan_list[plan_id][force][difficult] || (this.group_plan_list[plan_id][force][difficult] = {});
    //     this.group_plan_list[plan_id][force][difficult][category] = ship_type;
    // }

    /**
     * 获取分组得分分类纬度的数据
     * @param group_id
     * @param force
     * @param difficult
     * @return {Object<number, Object<number, number>>}
     */
    getGroupScoreCategoryList(group_id, force, difficult) {
        return this.group_score_list[group_id][force][difficult];
    }

    /**
     * 获取分组布局的舰船ID
     * @param plan_id
     * @param force
     * @param difficult
     * @param category
     * @return {number}
     */
    // getGroupPlanCategoryShipType(plan_id, force, difficult, category) {
    //     return this.group_plan_list[plan_id][force][difficult][category];
    // }
}

ServerBaseTemplate.m_instance = null;

module.exports = ServerBaseTemplate;
