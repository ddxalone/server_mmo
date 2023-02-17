const m_server = require("../../server");

/**
 * 世界管理器
 * @class {ServerWorldManage}
 */
class ServerWorldManage {
    static instance() {
        if (ServerWorldManage.m_instance == null) {
            ServerWorldManage.m_instance = new ServerWorldManage();
        }
        return ServerWorldManage.m_instance;
    }

    initWorldInfo() {
        //初始化星系

        //初始化信标

        //初始化任务

        //初始化空间站
        // m_server.ServerWorldBlock.initServerWorldBlock();
    }

    // /**
    //  * 每秒遍历一次的世界方法
    //  * @param serverFrame
    //  */
    // serverWorldAction(serverFrame) {
    //     console.log('serverFrame', serverFrame);
    //
    // }
}

ServerWorldManage.m_instance = null;

module.exports = ServerWorldManage;

