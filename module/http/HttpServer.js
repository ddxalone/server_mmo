const http = require("http");
const url = require("url");
const m_server = require("../server");
const m_http = require("./index");
const c_config = require("../../config");

class HttpServer {
    static instance() {
        if (HttpServer.m_instance == null) {
            HttpServer.m_instance = new HttpServer();
        }
        return HttpServer.m_instance;
    }

    initHttpServer() {
        let http_addr = this.getHttpAddr();
        let http_port = this.getHttpPort();
        http.createServer(this.ServerReceive).listen(http_port, http_addr, () => {
            //console.log("server control init done");
        });
        return true;
    }

    /**
     * 请求进入
     * @param req
     * @param res
     * @constructor
     */
    ServerReceive(req, res) {
        // console.log(req.url);
        // favicon.ico也当成一次请求
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        if (req.method.toUpperCase() === 'GET') {
            let query = url.parse(req.url, true).query;
            if (query['ac']) {
                m_server.ServerManage.httpServerControl(query, (url_res) => {
                    m_http.HttpServer.writeOut(res, url_res);
                });
            } else {
                m_http.HttpServer.writeOut(res);
            }
        } else {
            m_http.HttpServer.writeOut(res);
        }
    }

    /**
     * 请求返回
     * @param query
     * @param res
     */
    writeOut(res, query = false) {
        res.write(JSON.stringify(query));
        res.end();
    }

    /**
     * 获取http地址
     * @returns {string}
     */
    getHttpAddr() {
        return c_config.NetworkConfig.http_addr;
    }

    /**
     * 获取http端口
     * @returns {number}
     */
    getHttpPort() {
        return parseInt(c_config.NetworkConfig.http_port);
    }
}

HttpServer.m_instance = null;

module.exports = HttpServer;
