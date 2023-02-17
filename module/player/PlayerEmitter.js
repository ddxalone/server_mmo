const m_protocol = require("../protocol");
const m_player = require("./index");
const m_server = require("../server");
const common = require("../common");

/**
 * 协议事件分发
 */
class PlayerEmitter {
    constructor() {
    }

    static instance() {
        if (PlayerEmitter.m_instance == null) {
            PlayerEmitter.m_instance = new PlayerEmitter();
        }
        return PlayerEmitter.m_instance;
    }

    /**
     * 初始化emitter事件
     * @returns {boolean}
     */
    initPlayerEmitter() {
        let emitter = m_protocol.ProtocolEmitter.getEmitter();
        emitter.on(common.protocol.PROTOCOL_C2S_ACCOUNT_LOGIN, m_player.ProtocolLogin.accountLogin);
        emitter.on(common.protocol.PROTOCOL_C2S_PLAYER_LOGIN, m_player.ProtocolLogin.playerLogin);

        emitter.on(common.protocol.PROTOCOL_C2S_MAP_GRID_INFO, m_server.ProtocolMap.mapGridInfo);
        emitter.on(common.protocol.PROTOCOL_C2S_MAP_MOVE, m_server.ProtocolMap.mapMove);
        emitter.on(common.protocol.PROTOCOL_C2S_SEND_MAP_INFO, m_server.ProtocolMap.sendMapInfo);
        emitter.on(common.protocol.PROTOCOL_C2S_MAP_CONTROL, m_server.ProtocolMap.mapControl);
        emitter.on(common.protocol.PROTOCOL_C2S_MAP_ITEM, m_server.ProtocolMap.mapItem);
        emitter.on(common.protocol.PROTOCOL_C2S_MAP_PICK_ITEM, m_server.ProtocolMap.mapPickItem);

        emitter.on(common.protocol.PROTOCOL_C2S_WORLD_SCAN_EXACT, m_server.ProtocolWorld.worldScanExact);
        emitter.on(common.protocol.PROTOCOL_C2S_WORLD_WARP, m_server.ProtocolWorld.worldWarp);
        emitter.on(common.protocol.PROTOCOL_C2S_INITIATE_PRODUCT, m_server.ProtocolWorld.initiateProduct);
        emitter.on(common.protocol.PROTOCOL_C2S_DELIVER_PRODUCT, m_server.ProtocolWorld.deliverProduct);
        emitter.on(common.protocol.PROTOCOL_C2S_BOARD_SHIP, m_server.ProtocolWorld.boardShip);
        emitter.on(common.protocol.PROTOCOL_C2S_MOVE_ITEM, m_server.ProtocolWorld.moveItem);
        emitter.on(common.protocol.PROTOCOL_C2S_CHANGE_SKILL, m_server.ProtocolWorld.changeSkill);
        emitter.on(common.protocol.PROTOCOL_C2S_SEARCH_TASK, m_server.ProtocolWorld.searchTask);

        return true;
    }
}

PlayerEmitter.m_instance = null;

module.exports = PlayerEmitter;
