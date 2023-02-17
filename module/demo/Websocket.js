const ws = require("ws");
const m_config = require("../../config");

class Websocket {
    constructor() {
        this.websocket = null;
    }

    create(callback, thisObj) {
        let game_addr = m_config.NetworkConfig.game_addr;
        let game_port = m_config.NetworkConfig.game_port;
        this.websocket = new ws("ws://" + game_addr + ":" + game_port);
        this.websocket.onopen = function (e) {
            callback && callback.call(thisObj, this.websocket);
        }
    }

    message(callback, thisObj) {
        this.websocket.onmessage = function (e) {
            callback && callback.call(thisObj, JSON.parse(e.data));
        }
    }

    send(data) {
        this.websocket.send(JSON.stringify(data));
    }
}

module.exports = Websocket;
