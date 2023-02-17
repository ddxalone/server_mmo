const m_log = require(".");

class LogManage {
    static instance() {
        if (LogManage.m_instance == null) {
            LogManage.m_instance = new LogManage();
        }
        return LogManage.m_instance;
    }

//正常服务器的日志 默认debug 上线以后改为info
    server(info) {
        m_log.LogService.logServerService(info);
    }

//接到非法前端请求的日志
    warn(info) {
        m_log.LogService.loggerWarnService(info);
    }

//系统报错
    error(info) {
        m_log.LogService.loggerErrorService(info);
    }
}

LogManage.m_instance = null;

module.exports = LogManage;
