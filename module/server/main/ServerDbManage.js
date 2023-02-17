const m_server = require("../index");

/**
 * @class {ServerDbManage}
 */
class ServerDbManage {
    constructor() {
    }

    static instance() {
        if (ServerDbManage.m_instance == null) {
            ServerDbManage.m_instance = new ServerDbManage();
        }
        return ServerDbManage.m_instance;
    }

    /**
     * 初始化数据库数据
     */
    async initServerDbData() {
        try {
            await m_server.ServerList.initServerList();
            await m_server.ServerParam.initServerParam();
            await m_server.ServerBaseTemplate.initServerBaseTemplate();
            await m_server.ServerBaseLevel.initServerBaseLevel();
            await m_server.ServerBaseDead.initServerBaseDead();
            await m_server.ServerBaseTask.initServerBaseTask();
            await m_server.ServerBaseShip.initServerBaseShip();
            await m_server.ServerBaseItem.initServerBaseItem();
            await m_server.ServerBaseSkill.initServerBaseSkill();
            await m_server.ServerBaseForce.initServerBaseForce();

            await m_server.ServerUniverse.initServerUniverse();
            await m_server.ServerWorldStation.initServerStation();
            await m_server.ServerWorldDead.initServerDead();
            await m_server.ServerWorldTask.initServerTask();
            await m_server.ServerWorldShip.initServerShip();
            await m_server.ServerWorldItem.initServerItem();
            await m_server.ServerWorldSkill.initServerSkill();

            await m_server.DropService.initDropList();

            m_server.ServerList.setMaxServerIdService(true);
        } catch (e) {
            dd(e);
        }
    }
}

ServerDbManage.m_instance = null;

module.exports = ServerDbManage;

