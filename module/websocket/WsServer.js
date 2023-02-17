const https = require("https");
const ws = require("ws");
const fs = require("fs");
const c_config = require("../../config");


class WsServer {
    constructor() {
        //ws服务状态
        this.ws_open_status = false;
        //ws进程
        this.ws_server = null;
    }

    static instance() {
        if (WsServer.m_instance == null) {
            WsServer.m_instance = new WsServer();
        }
        return WsServer.m_instance;
    }

    /**
     * 初始化webSocket服务
     * @returns {boolean}
     */
    initWsServer() {
        let protocol = this.getProtocol();
        if (protocol === "https") {
            this.initHttpsWsServer();
        } else if (protocol === "http") {
            this.initHttpWsServer();
        } else {
            return false;
        }
        return true;
    }

    /**
     * 初始化https WsServer
     */
    initHttpsWsServer() {
        let options = this.getHttpsOption();
        let game_port = this.getGamePort();

        let https_server = https.createServer(options, function (req, res) {
        }).listen(game_port);

        let server_options = {};
        server_options.server = https_server;
        this.setWsServer(new ws.Server(server_options));
    }

    /**
     * 初始化http WsServer
     */
    initHttpWsServer() {
        let game_port = this.getGamePort();
        let server_options = {};
        server_options.port = game_port;
        this.setWsServer(new ws.Server(server_options));
    }

    /**
     * @param {WebSocketServer} ws_server
     */
    setWsServer(ws_server) {
        this.ws_open_status = true;
        this.ws_server = ws_server;
        this.ws_server.on('error', function (err) {
            console.log(err);
        })
    }

    getHttpsOption() {
        return {
            key: fs.readFileSync(c_config.NetworkConfig.key_path),
            cert: fs.readFileSync(c_config.NetworkConfig.cert_path),
            passphrase: c_config.NetworkConfig.key_pass,//如果秘钥文件有密码的话，用这个属性设置密码
        };
    }

    getGamePort() {
        return c_config.NetworkConfig.game_port;
    }

    getProtocol() {
        return c_config.NetworkConfig.protocol;
    }

    getWsServer() {
        if (this.ws_open_status) {
            return this.ws_server;
        }
        return null;
    }
}

WsServer.m_instance = null;

module.exports = WsServer;
