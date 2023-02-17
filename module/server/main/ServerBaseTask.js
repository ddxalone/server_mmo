const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseTask}
 */
class ServerBaseTask {
    constructor() {
        /**
         * 基础死亡空间列表
         * @type {Object<number, BaseTaskInfo>}
         */
        this.base_task_list = {};
        /**
         * @type {Array<BaseTaskInfo>}
         */
        this.base_task_list_array = [];

        //各个势力难度等级的任务列表
        this.random_task_list = {};
    }

    static instance() {
        if (ServerBaseTask.m_instance == null) {
            ServerBaseTask.m_instance = new ServerBaseTask();
        }
        return ServerBaseTask.m_instance;
    }

    /**
     * 初始化宇宙信息
     */
    async initServerBaseTask() {
        this.initServerBaseTaskResponse(await m_server.BaseTaskDao.initDaoListPromiseFromData(m_data.BaseTaskData));
    }

    initServerBaseTaskResponse(base_task_list) {
        this.base_task_list = base_task_list;
        this.buildBaseTaskArray();
        // this.eachBaseTask((base_task_info) => {
        //     base_task_info.setBaseTemplateInfo(m_server.ServerBaseTemplate.getBaseTemplate(base_task_info.template_id));
        // });
        //构建缓存
        this.initRandomTaskList();
        console.log("db base_task_list init done");
    }

    buildBaseTaskArray() {
        this.base_task_list_array = Object.values(this.base_task_list);
    }

    /**
     * 获取某类型死亡空间基础信息
     * @param task_type
     * @returns {BaseTaskInfo}
     */
    getBaseTask(task_type) {
        return this.base_task_list[task_type];
    }

    /**
     * @param {callbackBaseTaskInfo} callback
     * @param thisObj
     */
    eachBaseTask(callback, thisObj) {
        for (let base_task_info of this.base_task_list_array) {
            callback && callback.call(thisObj, base_task_info);
        }
    }

    initRandomTaskList() {
        // let target_task_type_list = [];
        let target_task_type_list = this.base_task_list_array
            .filter((base_task_info) => {
                return base_task_info.dao.target_task_type;
            }).map((base_task_info) => {
                return base_task_info.dao.target_task_type;
            });
        // dd(test)
        this.eachBaseTask((base_task_info) => {
            let {task_type, force, category, difficult, target_task_type} = base_task_info.dao;
            //如果有后续任务 那么后续任务 无法成为第一个任务
            // target_task_type && (target_task_type_list.push(target_task_type));
            //如果未找到 说明不是后续任务 则添加到可截取任务列表
            if (target_task_type_list.indexOf(task_type) < 0) {
                this.random_task_list[force] || (this.random_task_list[force] = {});
                this.random_task_list[force][category] || (this.random_task_list[force][category] = {});
                this.random_task_list[force][category][difficult] || (this.random_task_list[force][category][difficult] = []);

                this.random_task_list[force][category][difficult].push(task_type);
            }
        }, this);
        // dd(target_task_type_list)
        // dd(this.random_task_list[3][1][1])
    }


    /**
     * 获取随机任务
     * @param force
     * @param category
     * @param difficult
     * @returns {null|*}
     */
    getRandomTaskType(force, category, difficult) {
        let random_item_list = (this.random_task_list[force] && this.random_task_list[force][category] && this.random_task_list[force][category][difficult]);
        if (random_item_list) {
            return random_item_list[common.func.getRand(0, random_item_list.length - 1)];
        }
        return null;
    }
}

ServerBaseTask.m_instance = null;

module.exports = ServerBaseTask;
