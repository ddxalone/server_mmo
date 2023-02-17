/**
 * 服务器开启进程
 */
const cluster = require("cluster");

require('dotenv').config();

const m_websocket = require("./module/websocket");
const m_log = require("./module/log");
const m_protocol = require("./module/protocol");
const m_player = require("./module/player");
const m_http = require("./module/http");
const m_server = require("./module/server");
const m_mysql = require("./module/mysql");
const m_demo = require("./module/demo");

global.dd = require('./module/common').func.dd;
global.tt = require('./module/common').func.tt;
global.ff = require('./module/common').func.ff;
global.fff = require('./module/common').func.fff;
global.ddd = require('./module/common').func.ddd;
global.ddf = require('./module/common').func.ddf;
global.ffa = require('./module/common').func.ffa;
global.ffd = require('./module/common').func.ffd;

let _startApp = () => {
    m_demo.DemoManage.run();

    console.log('startApp...');
    if (!m_websocket.WsServer.initWsServer()) {
        console.log("websocket server init fail!");
        return;
    }
    console.log("websocket server init done!");

    if (!m_websocket.WsConnect.initWsReceive()) {
        console.log("websocket receive init fail!");
        return;
    }
    console.log("websocket receive init done!");

    if (!m_log.LogService.initLogServer()) {
        console.log("log server init fail!");
        return;
    }
    console.log("log server init done!");

    if (!m_protocol.ProtocolEmitter.initEmitter()) {
        console.log("protocol emitter init fail!");
        return;
    }
    console.log("protocol emitter init done!");

    if (!m_player.PlayerEmitter.initPlayerEmitter()) {
        console.log("player emitter init fail!");
        return;
    }
    console.log("player emitter init done!");

    if (!m_http.HttpServer.initHttpServer()) {
        console.log("http server init fail!");
        return;
    }
    console.log("http server init done");

    //初始化服务器信息
    m_server.ServerManage.initServerInfo();

    //初始化mysql
    m_mysql.MysqlServer.initMysqlServer(function (err) {
        if (err) {
            console.log("mysql server init fail!");
            process.exit();
        }
        console.log("mysql server init done!");

        //初始化数据库数据
        m_server.ServerDbManage.initServerDbData().then(() => {
            m_server.ServerMain.setServerRunStatusService(true);

            //启动主线程
            if (!m_server.ServerManage.initServerProcess()) {
                console.log("server process init fail!");
                process.exit();
            }
            console.log("server process init done!");
        });
    }, this);

    return;


    server.InitFightInfo();

    server.InitRechareInfo();

    server.InitMineralInfo();

    server.InitIntelligenceInfo();

    server.InitChatInfo();

    server.InitMailInfo();

    server.InitRankInfo();

    server.InitCacheInfo();

    server.InitPlayerInfo();

    server.InitWorldFightInfo();

    process.on('SIGINT', () => {
        if (global.InitDbStatus) {
            server.SafeQuitGame();
        } else {
            process.exit();
        }
    });
};

if (cluster.isMaster) {
    _startApp();
}

// Uncaught exception handler
process.on('uncaughtException', (err) => {
    console.log(err);
    m_log.LogManage.error(err);
});

