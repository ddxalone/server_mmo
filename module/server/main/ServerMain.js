const m_server = require("../index");
const m_log = require("../../log");
const common = require("../../common");

/**
 * @class {ServerMain}
 */
class ServerMain {
    constructor() {
        //服务器整体运行状态
        this.server_run_status = false;
        //服务器开启时间
        this.server_start_time = 0;
        //服务器逻辑运行时间 毫秒
        this.server_run_time = 0;
        //服务器实际运行时间 帧
        this.server_unix_frame = 0;
        //服务器实际运行时间 秒
        this.server_unix_second = 0;
        //服务器遍历帧 毫秒
        this.base_server_frame_time = common.setting.base_server_frame_time;

        this.base_server_frame = common.setting.base_server_frame;
    }

    static instance() {
        if (ServerMain.m_instance == null) {
            ServerMain.m_instance = new ServerMain();
        }
        return ServerMain.m_instance;
    }

    /**
     * 获取服务帧
     * @returns {number}
     */
    getServerUnixFrame() {
        return this.server_unix_frame;
    }

    /**
     * 处理主线程
     * @returns {boolean}
     */
    startServerProcessService() {
        setInterval(() => {
            if (this.server_run_status) {
                //健康检查
                this.checkServerRunTimes();
                //只要服务器不是特别卡 可以保证1秒5帧 不会少帧
                let sub_map_frame = this.getServerSubFrame();
                for (let i = 0; i < sub_map_frame; i++) {
                    //服务器world逻辑帧每秒一次足够用了
                    if (this.server_unix_frame % this.base_server_frame === 0) {

                        m_server.WorldProcess.serverWorldAction(this.server_unix_second);
                        this.server_unix_second++;
                    }
                    m_server.MapProcess.serverMapAction(this.server_unix_frame);
                    this.server_unix_frame++;
                    // ff('发送消息', common.func.getUnixMTime() - this.unit_time);
                    // this.unit_time = common.func.getUnixMTime();
                }
            }
        });
        return true;
    }

    /**
     * 检测服务器运行时间 如果超时就写日志
     */
    checkServerRunTimes() {
        let now_time = new Date().getTime();
        if (now_time - this.server_run_time > 1000) {
            m_log.LogManage.warn("server Busy : " + (now_time - this.server_run_time) + ' in ' + this.server_unix_frame)
        }
        this.server_run_time = now_time;
    }

    /**
     * 根据服务器帧数差判断需要运行的帧数
     * @returns {number}
     */
    getServerSubFrame() {
        return this.getServerRunFrame() - this.server_unix_frame;
    }

    /**
     * 获取服务器运行帧数
     * @returns {number}
     */
    getServerRunFrame() {
        return Math.floor((new Date().getTime() - this.server_start_time) / this.base_server_frame_time);
    }

    setServerRunStatusService(status) {
        //服务器开启时间
        this.server_start_time = common.func.getUnixMTime();
        //服务器逻辑运行时间 毫秒
        this.server_run_time = this.server_start_time;

        this.server_run_status = status;
    }

    getServerRunStatusService() {
        return this.server_run_status;
    }
}

ServerMain.m_instance = null;

module.exports = ServerMain;

