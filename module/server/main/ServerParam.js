const m_server = require("../index");
const common = require("../../common");

/**
 * @class {ServerParam}
 */
class ServerParam {
    constructor() {
        this.server_param = {};
    }

    static instance() {
        if (ServerParam.m_instance == null) {
            ServerParam.m_instance = new ServerParam();
        }
        return ServerParam.m_instance;
    }

    /**
     * 获取客户端用服务器信息
     * TODO
     */
    getClientServerParam() {
        return {
            update_time: this.server_param.update_time,
        };
    }

    /**
     * 初始化服务器
     */
    async initServerParam() {
        this.initServerParamResponse(await m_server.ServerParamDao.initDaoListPromise(null));
    }

    /**
     * 处理结果
     * @param server_param_list
     */
    initServerParamResponse(server_param_list) {
        for (let pos in server_param_list) {
            this.createParam(server_param_list[pos]);
        }
        //更新更新时间戳
        this.setParam('update_time', common.func.getUnixTime() + common.setting.base_save_db_time);
        console.log("db server_param init done");
    }

    createParam(server_param_dao) {
        this.server_param[server_param_dao.title] = server_param_dao.value;
    }

    /**
     * 更新更新时间到下一次 触发写数据库
     */

    getParam(title) {
        return this.server_param[title];
    }

    setParam(title, value) {
        this.server_param[title] = value;
    }

    updateParam(this_unix_time) {
        this.setParam('update_time', this_unix_time + common.setting.base_save_db_time);
        this.updateParamDao('update_time');
        this.updateParamDao('end_time_day');
        this.updateParamDao('end_time_hour');
        this.updateParamDao('end_time_week');
    }

    updateParamDao(title) {
        let server_param_result = {
            title: title,
            value: this.server_param[title],
        };
        m_server.ServerParamDao.updateDaoRow(server_param_result);
    }
}

ServerParam.m_instance = null;

module.exports = ServerParam;
