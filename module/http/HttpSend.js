const https = require("https");
const m_log = require("../log");

class HttpSend {
    static instance() {
        if (HttpSend.m_instance == null) {
            HttpSend.m_instance = new HttpSend();
        }
        return HttpSend.m_instance;
    }

    /**
     * @param url
     * @param callback
     * @constructor
     */
    HttpsSendService(url, callback) {
        https.get(url, function (res) {
            if (res.statusCode === 200) {
                let ret = "";
                res.on('data', function (d) {
                    ret += d;
                });

                res.on('end', function () {
                    callback(null, ret);
                });
            } else {
                m_log.LogManage.warn(res.statusCode);
                callback("statusCode error:" + res.statusCode);
            }
        }).on('error', function (e) {
            m_log.LogManage.warn(e);
            callback(e);
        });
    }
}

HttpSend.m_instance = null;

module.exports = HttpSend;
