const log4js = require("log4js");

class LogService {
    constructor() {
        this.file_size = 10 * 1024 * 1024;
    }

    static instance() {
        if (LogService.m_instance == null) {
            LogService.m_instance = new LogService();
        }
        return LogService.m_instance;
    }

    initLogServer() {
        let log_config = this.loadLogConfig();
        log4js.configure(log_config);
        return true;
    }

    /**
     * @returns $ObjMap
     */
    loadLogConfig() {
        return {
            "appenders": {
                "rule-console": {
                    "type": "console"
                },
                "rule-server": {
                    "type": "dateFile",
                    "filename": __dirname + "../../../logs/module",
                    "encoding": "utf-8",
                    "maxLogSize": this.file_size,
                    "numBackups": 3,
                    "pattern": "yyyy-MM-dd.log",
                    "alwaysIncludePattern": true
                },
                "rule-warning": {
                    "type": "dateFile",
                    "filename": __dirname + "../../../logs/warning",
                    "encoding": "utf-8",
                    "maxLogSize": this.file_size,
                    "numBackups": 3,
                    "pattern": "yyyy-MM-dd.log",
                    "alwaysIncludePattern": true
                },
                "rule-error": {
                    "type": "dateFile",
                    "filename": __dirname + "../../../logs/error",
                    "encoding": "utf-8",
                    "maxLogSize": this.file_size,
                    "numBackups": 3,
                    "pattern": "yyyy-MM-dd.log",
                    "alwaysIncludePattern": true
                }
            },

            "categories": {
                "default": {
                    "appenders": [
                        "rule-console",
                    ],
                    "level": "debug"
                },
                "server": {
                    "appenders": [
                        "rule-server",
                    ],
                    // online
                    // "level": "info"
                    // dev
                    "level": "debug"
                },
                "warning": {
                    "appenders": [
                        "rule-warning",
                    ],
                    "level": "debug"
                },
                "error": {
                    "appenders": [
                        "rule-error"
                    ],
                    "level": "debug"
                }
            },
            replaceConsole: true
        }
    }

    logServerService(info) {
        log4js.getLogger("server").debug(info);
    }

    loggerWarnService(info) {
        log4js.getLogger("warning").info(info);
    }

    loggerErrorService(info) {
        log4js.getLogger("error").error(info);
    }
}

LogService.m_instance = null;

module.exports = LogService;
