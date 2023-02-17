const uuid = require("uuid");
const common = require("../common");
const m_player = require("../player");
const m_websocket = require("./index");
const WsInfo = require("./info/WsInfo");

class WsConnect {
    constructor() {
        /**
         * @type {Object<string, WsInfo>}
         */
        this.ws_list = {};
    }

    static instance() {
        if (WsConnect.m_instance == null) {
            WsConnect.m_instance = new WsConnect();
        }
        return WsConnect.m_instance;
    }

    /**
     * 初始化webSocket接收服务
     * @returns {boolean}
     */
    initWsReceive() {
        let ws_server = m_websocket.WsServer.getWsServer();
        if (ws_server) {
            ws_server.on('connection', this.WsConnection);
            return true;
        }
        return false;
    }

    WsConnection(ws_connect, ws_req) {
        let player_uuid = uuid.v4();
        //存储uuid的链接信息
        m_websocket.WsConnect.saveConnectInfo(player_uuid, ws_connect);
        //console.log('client [%s] connected', player_uuid);
        ws_connect.on('message', (protocol_json) => {
            if (m_websocket.WsConnect.checkWsInfoExist(player_uuid)) {
                if (common.func.isJson(protocol_json)) {
                    let protocol_body = JSON.parse(protocol_json);
                    m_websocket.WsMessage.wsReceiveInfo(player_uuid, protocol_body);
                }
            }
        });
        ws_connect.on('error', () => {
            //当前端断线的时候 虚拟前端发送协议
            let C2S_PLAYER_LOGOUT = new common.protocol.list[common.protocol.PROTOCOL_C2S_PLAYER_LOGOUT]();
            m_websocket.WsMessage.wsReceiveInfo(player_uuid, C2S_PLAYER_LOGOUT);
        });
        ws_connect.on('close', () => {
            //当前端断线的时候 虚拟前端发送协议
            let C2S_PLAYER_LOGOUT = new common.protocol.list[common.protocol.PROTOCOL_C2S_PLAYER_LOGOUT]();
            m_websocket.WsMessage.wsReceiveInfo(player_uuid, C2S_PLAYER_LOGOUT);
        });
    }


    /**
     * 存储uuid和ws socket的对应关系
     */
    saveConnectInfo(player_uuid, ws_connect) {
        this.createWsInfo(player_uuid, ws_connect);
    }

    /**
     * 创建WsInfo
     * @param player_uuid
     * @param ws_connect
     */
    createWsInfo(player_uuid, ws_connect) {
        let wsInfo = new WsInfo();
        wsInfo.setPlayerUuid(player_uuid);
        wsInfo.setWsConnect(ws_connect);
        this.saveWsInfoToList(wsInfo);
    }

    /**
     * 存储wsF
     * @param wsInfo
     */
    saveWsInfoToList(wsInfo) {
        let player_uuid = wsInfo.getPlayerUuid();
        this.ws_list[player_uuid] = wsInfo;
    }

    /**
     * 移除wsInfo
     * @param player_uuid
     */
    removeWsInfo(player_uuid) {
        let ws_info = this.getWsInfo(player_uuid);
        if (ws_info) {
            let ws_connect = ws_info.getWsConnect();
            if (ws_connect) {
                this.closeWsConnect(ws_connect);
            }
        }
        delete this.ws_list[player_uuid];
    }

    /**
     * 关闭连接
     * @param ws_connect
     */
    closeWsConnect(ws_connect) {
        ws_connect.close();
    }

    /**
     * 获取ws
     * @param player_uuid
     * @returns {WsInfo|null}
     */
    getWsInfo(player_uuid) {
        return this.ws_list[player_uuid] || null;
    }

    /**
     * 获取ws_connect
     * @param player_uuid
     * @returns {null}
     */
    getWsInfoConnect(player_uuid) {
        let ws_info = this.getWsInfo(player_uuid);
        return ws_info ? ws_info.getWsConnect() : null;
    }

    /**
     * 获取ws_info的player_id
     * @param player_uuid
     * @returns {number}
     */
    getWsInfoPlayerId(player_uuid) {
        let ws_info = this.getWsInfo(player_uuid);
        return ws_info ? ws_info.getPlayerId() : 0;
    }

    /**
     * 当接收到ws请求,判断链接是否存在
     * @param player_uuid
     * @returns {boolean}
     */
    checkWsInfoExist(player_uuid) {
        return !!this.ws_list[player_uuid];
    }

    setWsInfoPlayerId(player_uuid, player_id) {
        let ws_info = this.getWsInfo(player_uuid);
        ws_info && ws_info.setPlayerId(player_id);
    }
}

WsConnect.m_instance = null;

module.exports = WsConnect;
