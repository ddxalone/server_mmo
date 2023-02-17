const C2SWorldScanExact = require("./protocol/C2SWorldScanExact");
const C2SWorldWarp = require("./protocol/C2SWorldWarp");
const C2SBoardShip = require("./protocol/C2SBoardShip");
const C2SMoveItem = require("./protocol/C2SMoveItem");
const C2SChangeSkill = require("./protocol/C2SChangeSkill");
const C2SSearchTask = require("./protocol/C2SSearchTask");
const C2SInitiateProduct = require("./protocol/C2SInitiateProduct");
const C2SDeliverProduct = require("./protocol/C2SDeliverProduct");

/**
 * 登录协议控制
 */
class ProtocolWorld {
    static instance() {
        if (ProtocolWorld.m_instance == null) {
            ProtocolWorld.m_instance = new ProtocolWorld();
        }
        return ProtocolWorld.m_instance;
    }

    worldScanExact(player_uuid, p_data) {
        new C2SWorldScanExact(player_uuid, p_data);
    }

    worldWarp(player_uuid, p_data) {
        new C2SWorldWarp(player_uuid, p_data);
    }

    initiateProduct(player_uuid, p_data) {
        new C2SInitiateProduct(player_uuid, p_data);
    }

    deliverProduct(player_uuid, p_data) {
        new C2SDeliverProduct(player_uuid, p_data);
    }

    moveItem(player_uuid, p_data) {
        new C2SMoveItem(player_uuid, p_data);
    }

    boardShip(player_uuid, p_data) {
        new C2SBoardShip(player_uuid, p_data);
    }

    changeSkill(player_uuid, p_data) {
        new C2SChangeSkill(player_uuid, p_data);
    }

    searchTask(player_uuid, p_data) {
        new C2SSearchTask(player_uuid, p_data);
    }
}

ProtocolWorld.m_instance = null;

module.exports = ProtocolWorld;
