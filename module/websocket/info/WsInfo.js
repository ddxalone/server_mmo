/**
 * websocket信息类
 */

class WsInfo {
    constructor() {
        this.player_uuid = null;
        this.ws_connect = null;
        this.player_id = 0;
    }

    setPlayerUuid(player_uuid) {
        this.player_uuid = player_uuid;
    }

    getPlayerUuid() {
        return this.player_uuid;
    }

    setWsConnect(ws_connect) {
        this.ws_connect = ws_connect;
    }

    getWsConnect() {
        return this.ws_connect;
    }

    setPlayerId(player_id) {
        this.player_id = player_id;
    }

    getPlayerId() {
        return this.player_id;
    }
}

module.exports = WsInfo;
