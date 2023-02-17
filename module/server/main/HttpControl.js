/**
 * @class {HttpControl}
 */

class HttpControl {
    static instance() {
        if (HttpControl.m_instance == null) {
            HttpControl.m_instance = new HttpControl();
        }
        return HttpControl.m_instance;
    }

    /**
     * http协议在线游戏控制,用于后台操作或者支付操作
     */
    httpServerControl(query, callback) {
        //TODO
    }
}

HttpControl.m_instance = null;

module.exports = HttpControl;

