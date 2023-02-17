const m_server = require("../../server");
const common = require("../../common");
const WorldBlockInfo = require("./info/WorldBlockInfo");

/**
 * 世界管理器
 * @class {ServerWorldBlock}
 */
class ServerWorldBlock {
    constructor() {
        /**
         * 块图列表 map_key
         * @type {Object<number, WorldBlockInfo>}
         */
        this.world_block_list = {};

        /**
         * 恒星系列表索引
         * @type {Object<number, WorldGalaxyInfo>}
         */
        this.world_index_galaxy_list = {};

        /**
         * 构建阵营,安等的galaxy_id的缓存数组
         * @type {Object<number, Object<number, Array>>}
         */
        this.random_galaxy_list = {};
    }

    static instance() {
        if (ServerWorldBlock.m_instance == null) {
            ServerWorldBlock.m_instance = new ServerWorldBlock();
        }
        return ServerWorldBlock.m_instance;
    }

    /**
     * 初始化块图
     */
    // initServerWorldBlock() {
    //     for (let keyX = 0; keyX < common.setting.base_map_block_number; keyX++) {
    //         for (let keyY = 0; keyY < common.setting.base_map_block_number; keyY++) {
    //             let map_key = common.func.getMapKeyPoint(keyX, keyY);
    //             this.createServerBlockInfo(map_key);
    //         }
    //     }
    // }

    /**
     * 创建块图
     * @param map_key
     */
    // createServerBlockInfo(map_key) {
    //     this.world_block_list[map_key] = new m_server.WorldBlockInfo.worldBlockInfo(map_key);
    // }

    /**
     * 获取世界块图
     * @param map_key
     * @returns {WorldBlockInfo}
     */
    getWorldBlockInfo(map_key) {
        if (!this.world_block_list[map_key]) {
            this.world_block_list[map_key] = new WorldBlockInfo(map_key);
        }
        return this.world_block_list[map_key];
    }


    /**
     * 随机一个安等符合要求的星系
     * @param safe_min
     * @param safe_max
     * @param forces
     * @returns {WorldGalaxyInfo}
     */
    getRandomGalaxyFromSafe(safe_min, safe_max, forces = null) {
        // let server_galaxy_min = common.setting.server_galaxy_min;
        // let server_galaxy_max = common.setting.server_galaxy_max;
        // //找到第一个安等符合要求的星系
        // let  i = 0;
        // while (true) {
        //     let random_galaxy_id = common.func.getRand(server_galaxy_min, server_galaxy_max);
        //     let world_galaxy_info = this.getIndexGalaxyInfo(random_galaxy_id);
        //     if (world_galaxy_info.dao.safe >= safe_min && world_galaxy_info.dao.safe <= safe_max
        //         && ((force && force === world_galaxy_info.dao.force) || force === 0)) {
        //         ff(i);
        //         return world_galaxy_info;
        //     }
        //     i++;
        // }

        let safe = common.func.getRand(safe_min, safe_max);
        let galaxy_list = null;
        let check = 100;
        if (forces instanceof Array) {
            //如果指定了阵营 则获取这个阵营下的安等下的列表
            do {
                galaxy_list = this.random_galaxy_list[forces[common.func.getRand(0, forces.length - 1)]][safe];
                check--;
            } while (!galaxy_list && check > 0)
        } else if (forces) {
            //如果指定阵营则直接获取阵营 安等进行随机
            do {
                safe = common.func.getRand(safe_min, safe_max);
                galaxy_list = this.random_galaxy_list[forces][safe];
                check--;
            } while (!galaxy_list && check > 0)
        } else {
            //随机一个阵营
            do {
                galaxy_list = this.random_galaxy_list[common.func.getRand(1, 9)][safe];
                check--;
            } while (!galaxy_list && check > 0)
        }

        //这里不是每个都能取到的
        if (galaxy_list) {
            return this.getIndexGalaxyInfo(galaxy_list[common.func.getRand(0, galaxy_list.length - 1)]);
        } else {
            dd('不存在这个阵营下安等的星系', forces, safe)
        }
    }

    /**
     * 创建恒星信息
     * @param dao
     */
    // createBlockGalaxyInfo(dao) {
    //     let map_key = common.func.getMapKey(dao.x, dao.y);
    //     let world_galaxy_info = this.getWorldBlockInfo(map_key).createGalaxyInfo(dao);
    //     //创建通过galaxy_id的索引 此索引只用来获取信息 不能以玩家为基点进行遍历
    //     this.setIndexGalaxyInfo(world_galaxy_info);
    // }

    /**
     * 设置星系信息归类到块图
     * @param world_galaxy_info
     */
    setBlockGalaxyInfo(world_galaxy_info) {
        let map_key = common.func.getMapKey(world_galaxy_info.x, world_galaxy_info.y);
        this.getWorldBlockInfo(map_key).setGalaxyInfo(world_galaxy_info);
        //创建通过galaxy_id的索引 此索引只用来获取信息 不能以玩家为基点进行遍历
        this.setIndexGalaxyInfo(world_galaxy_info);
    }

    /**
     * 添加星系信息到索引列表
     * @param world_galaxy_info
     */
    setIndexGalaxyInfo(world_galaxy_info) {
        this.world_index_galaxy_list[world_galaxy_info.galaxy_id] = world_galaxy_info;
    }

    /**
     * 获取星系信息通过恒星系编号
     * @param galaxy_id
     * @returns {WorldGalaxyInfo}
     */
    getIndexGalaxyInfo(galaxy_id) {
        return this.world_index_galaxy_list[galaxy_id];
    }

    /**
     * 获取一个点的星系的信息,安等，基础信息等
     * @param x
     * @param y
     * @returns {WorldGalaxyInfo|null}
     */
    // getNearestGalaxyInfo(x, y) {
    //     let near_galaxy_info = new m_server.NearGalaxyInfo.nearGalaxyInfo(x, y).getNearGalaxyInfo();
    //     if (near_galaxy_info.nearest_galaxy_info) {
    //         return near_galaxy_info.nearest_galaxy_info;
    //     }
    //     return null;
    // }


    /**
     *
     * @param map_key
     * @param {callbackWorldGalaxyInfo} callback
     * @param thisObj
     */
    eachBlockGetGalaxyInfo(map_key, callback, thisObj) {
        let worldBlockInfo = this.world_block_list[map_key];
        if (worldBlockInfo) {
            worldBlockInfo.eachListGetGalaxyInfo(callback, thisObj);
        }
    }

    buildIndexGalaxyInfo() {
        for (let world_galaxy_info of Object.values(this.world_index_galaxy_list)) {
            this.random_galaxy_list[world_galaxy_info.dao.force] || (this.random_galaxy_list[world_galaxy_info.dao.force] = {});
            this.random_galaxy_list[world_galaxy_info.dao.force][world_galaxy_info.dao.safe] || (this.random_galaxy_list[world_galaxy_info.dao.force][world_galaxy_info.dao.safe] = []);
            this.random_galaxy_list[world_galaxy_info.dao.force][world_galaxy_info.dao.safe].push(world_galaxy_info.galaxy_id);
        }

        // dd(this.random_galaxy_list)
    }

    /**
     * 输出空间站静态文件
     */
    outputGalaxyJson() {
        common.file.outputGalaxyFile(this.world_index_galaxy_list);
    }
}

ServerWorldBlock.m_instance = null;

module.exports = ServerWorldBlock;

