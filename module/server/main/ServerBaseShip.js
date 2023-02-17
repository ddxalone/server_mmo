const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseShip}
 */
class ServerBaseShip {
    constructor() {
        /**
         * 基础玩家舰船列表
         * @type {Object<number, BaseShipPlayerInfo>}
         */
        this.base_ship_player_list = {};
        /**
         * 基础NPC舰船列表
         * @type {Object<number, BaseShipNpcerInfo>}
         */
        this.base_ship_npcer_list = {};
    }

    static instance() {
        if (ServerBaseShip.m_instance == null) {
            ServerBaseShip.m_instance = new ServerBaseShip();
        }
        return ServerBaseShip.m_instance;
    }

    /**
     * 初始化舰船信息
     */
    async initServerBaseShip() {
        // m_server.BaseShipPlayerDao.initDaoList(null, this.initServerBaseShipPlayerResponse, this);
        // m_server.BaseShipNpcerDao.initDaoList(null, this.initServerBaseShipNpcerResponse, this);
        this.initServerBaseShipPlayerResponse(await m_server.BaseShipPlayerDao.initDaoListPromiseFromData(m_data.BaseShipPlayerData));
        this.initServerBaseShipNpcerResponse(await m_server.BaseShipNpcerDao.initDaoListPromiseFromData(m_data.BaseShipNpcerData));
    }

    initServerBaseShipPlayerResponse(base_ship_player_list) {
        // for (let ship_type in base_ship_player_list) {
        // this.setBaseShipPlayer(base_ship_player_list[ship_type]);
        // }
        this.base_ship_player_list = base_ship_player_list;
        console.log("db base_ship_player_list init done");
    }

    initServerBaseShipNpcerResponse(base_ship_npcer_list) {
        // for (let ship_type in base_ship_npcer_list) {
        //     this.setBaseShipNpcer(base_ship_npcer_list[ship_type]);
        // }
        this.base_ship_npcer_list = base_ship_npcer_list;
        //初始化NPCER的一些模版的信息
        m_server.ServerBaseTemplate.addShipNpcerScore(Object.values(base_ship_npcer_list));
        console.log("db base_ship_npcer_list init done");
    }

    /**
     * @param ship_type
     * @return {BaseShipPlayerInfo}
     */
    getShipPlayerDataValue(ship_type) {
        return this.base_ship_player_list[ship_type];
    }

    /**
     * @param ship_type
     * @return {BaseShipNpcerInfo}
     */
    getShipNpcerDataValue(ship_type) {
        return this.base_ship_npcer_list[ship_type];
    }

}

ServerBaseShip.m_instance = null;

module.exports = ServerBaseShip;
