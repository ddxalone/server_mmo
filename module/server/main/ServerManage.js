const m_server = require("../index");

/**
 * @class {ServerManage}
 */
class ServerManage {
    //TODO 未来干掉这个方法
    static instance() {
        if (ServerManage.m_instance == null) {
            ServerManage.m_instance = new ServerManage();
        }
        return ServerManage.m_instance;
    }

    /**
     * http协议在线游戏控制,用于后台操作或者支付操作
     */
    httpServerControl(query, callback) {
        m_server.HttpControl.httpServerControl(query, callback);
    }

    /**
     * 开启主线程
     */
    initServerProcess() {
        return m_server.ServerMain.startServerProcessService();
    }

    /**
     * 初始化服务器信息
     */
    initServerInfo() {
        //初始化地图信息
        m_server.ServerMapManage.initMapInfo();
        //初始化世界信息
        m_server.ServerWorldManage.initWorldInfo();
    }

    /**
     * 获取服务器运行状态
     * @returns {*}
     */
    getServerRunStatus() {
        return m_server.ServerMain.getServerRunStatusService();
    }
}

ServerManage.m_instance = null;

module.exports = ServerManage;
