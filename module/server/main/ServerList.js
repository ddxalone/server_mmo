const m_server = require("../index");
const common = require("../../common");

/**
 * @class {ServerList}
 */
class ServerList {
    constructor() {
        /**
         * 服务器参数状态
         * @type {Object<number, ServerInfo>}
         */
        this.server_list = {};
        //初始化完毕的服务器编号
        this.open_max_server_id = 0;
    }

    static instance() {
        if (ServerList.m_instance == null) {
            ServerList.m_instance = new ServerList();
        }
        return ServerList.m_instance;
    }

    /**
     * 初始化服务器列表
     */
    async initServerList() {
        // dd(await m_server.ServerListDao.initDaoListPromise(null));
        this.initServerListResponse(await m_server.ServerListDao.initDaoListPromise(null));
    }

    /**
     * @param server_info_list
     */
    initServerListResponse(server_info_list) {
        for (let server_info of Object.values(server_info_list)) {
            this.createServerInfo(server_info);
        }
        console.log("db server_list init done");
    }

    /**
     * 创建区服信息
     * @param server_info
     */
    createServerInfo(server_info) {
        this.server_list[server_info.server_id] = server_info;
        this.setOpenMaxServerId(server_info.server_id);
    }

    /**
     * 获取信息
     * @param server_id
     * @returns {ServerInfo}
     */
    getServerInfo(server_id) {
        return this.server_list[server_id];
    }

    getServerList() {
        return this.server_list;
    }

    checkServerInfo(server_id) {
        return !!this.server_list[server_id];
    }

    /**
     *
     * 设置新增服务器状态 并执行初始化
     * 未来每小时判断的是否开服的时候 可以采用this.max_open_id变量
     */
    setMaxServerIdService(first_start) {
        //逻辑开启最大服务器ID
        let max_server_id = this.getLogicMaxServerId();
        let start_server_id = first_start ? 1 : this.open_max_server_id;
        //实际开启服务器最大ID
        for (let server_id = start_server_id; server_id <= max_server_id; server_id++) {
            //初始化新服信息
            if (!this.checkServerInfo(server_id)) {
                this.createNewServerInfo(server_id);
            }
        }
    }

    /**
     * 创建新服务器
     * @param server_id
     */
    createNewServerInfo(server_id) {
        let new_server_safe_ratio = common.setting.new_server_safe_ratio;
        let server_safe_max = common.setting.server_safe_max;
        let server_info_result = {};
        while (true) {
            //随机一个安等符合要求的星系
            let world_galaxy_info = m_server.ServerWorldBlock.getRandomGalaxyFromSafe(new_server_safe_ratio, server_safe_max, [1, 2, 3]);

            if (this.checkDifferentServerName(world_galaxy_info.name)) {
                server_info_result.server_id = server_id;
                server_info_result.server_name = world_galaxy_info.name;
                server_info_result.galaxy_id = world_galaxy_info.galaxy_id;
                server_info_result.x = world_galaxy_info.x;
                server_info_result.y = world_galaxy_info.y;
                break;
            }
        }
        // let server_info = await m_server.ServerListDao.insertServerInfo(server_info_result);
        let server_info = m_server.ServerListDao.createRowInfo(server_info_result);
        server_info.dbHandle();
        this.createServerInfo(server_info);
    }

    /**
     * 检测服务器名是否重复
     * @param world_galaxy_name
     * @returns {boolean}
     */
    checkDifferentServerName(world_galaxy_name) {
        //检查最近的100个服务器,不能重名
        let server_keys = Object.keys(this.server_list).reverse().slice(0, common.setting.new_server_same_name_number);
        for (let pos in server_keys) {
            let server_id = server_keys[pos];
            let server_info = this.getServerInfo(server_id);
            if (world_galaxy_name === server_info.dao.server_name) {
                return false;
            }
        }
        return true;
    }

    /**
     * 设置初始化完毕的服务器裂帛啊
     * @param max_server_id
     */
    setOpenMaxServerId(max_server_id) {
        this.open_max_server_id = Math.max(this.open_max_server_id, max_server_id);
    }

    /**
     * 获取理论应当开启的服务器最大编号
     */
    getLogicMaxServerId() {
        let timestamp = Date.parse(new Date().toString()) / 1000;
        let max_server_id = Math.floor((timestamp - common.setting.init_open_server_unix_time) / (7 * 24 * 60 * 60) + 1);
        return Math.max(max_server_id, 1);
    }

}

ServerList.m_instance = null;

module.exports = ServerList;
