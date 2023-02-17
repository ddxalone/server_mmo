const m_server = require("../../server");
const m_protocol = require("../../protocol");
const C2SMapGridInfo = require("./protocol/C2SMapGridInfo");
const C2SMapMove = require("./protocol/C2SMapMove");
const C2SSendMapInfo = require("./protocol/C2SSendMapInfo");
const C2SMapControl = require("./protocol/C2SMapControl");
const C2SMapItem = require("./protocol/C2SMapItem");
const C2SMapPickItem = require("./protocol/C2SMapPickItem");

/**
 * 登录协议控制
 */
class ProtocolMap {
    static instance() {
        if (ProtocolMap.m_instance == null) {
            ProtocolMap.m_instance = new ProtocolMap();
        }
        return ProtocolMap.m_instance;
    }

    mapGridInfo(player_uuid, p_data) {
        new C2SMapGridInfo(player_uuid, p_data);
    }

    mapMove(player_uuid, p_data) {
        new C2SMapMove(player_uuid, p_data);
    }

    sendMapInfo(player_uuid, p_data) {
        new C2SSendMapInfo(player_uuid, p_data);
    }

    mapControl(player_uuid, p_data) {
        new C2SMapControl(player_uuid, p_data);
    }

    mapItem(player_uuid, p_data) {
        new C2SMapItem(player_uuid, p_data);
    }

    mapPickItem(player_uuid, p_data) {
        new C2SMapPickItem(player_uuid, p_data);
    }

}

ProtocolMap.m_instance = null;

module.exports = ProtocolMap;
