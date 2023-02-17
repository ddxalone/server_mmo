const m_server = require("../index");
const common = require("../../common");
const MapBlockInfo = require("./info/MapBlockInfo");
const NearGridInfo = require("./info/NearGridInfo");
const NearGalaxyInfo = require("../world/info/NearGalaxyInfo");

/**
 * 块图控制类
 * 目前已知除了断层跨块图 没有其他地方会单独对块图操作  即所有方法自动处理块图
 */
class ServerMapBlock {
    constructor() {
        //最大断层编号
        this.max_grid_id = 0;
        //块图列表 块图key => map_block_info = grid_list {grid_id => grid_info}
        //恒星系最大半径
        this.max_map_galaxy_radius = common.setting.map_galaxy_radius * common.setting.map_galaxy_radius_ratio;
        /**
         * 块图列表 map_key
         * @type {Object<number, MapBlockInfo>}
         */
        this.map_block_list = {};
    }

    static instance() {
        if (ServerMapBlock.m_instance == null) {
            ServerMapBlock.m_instance = new ServerMapBlock();
        }
        return ServerMapBlock.m_instance;
    }

    /**
     * 初始化块图信息
     */
    initServerMapBlock() {
    }

    getNewGridId() {
        return ++this.max_grid_id;
    }

    /**
     * 获取块图信息,自动创建
     * @param {number} map_key
     * @returns {MapBlockInfo}
     */
    getMapBlockInfo(map_key) {
        if (!this.map_block_list[map_key]) {
            this.map_block_list[map_key] = new MapBlockInfo(map_key);
        }
        return this.map_block_list[map_key];
    }

    /**
     * 创建块图信息和断层信息
     * @param x
     * @param y
     * @param nearest_galaxy_info
     * @returns {MapGridInfo}
     */
    createMapBlockGridInfo(x, y, nearest_galaxy_info) {
        let map_key = common.func.getMapKey(x, y);
        //创建断层
        return this.getMapBlockInfo(map_key).createGridInfo(this.getNewGridId(), x, y, nearest_galaxy_info);
    }

    /**
     * 获取断层信息
     * @param map_key
     * @param grid_id
     * @returns {MapGridInfo}
     */
    getMapBlockGridInfo(map_key, grid_id) {
        return this.getMapBlockInfo(map_key).getGridInfo(grid_id);
    }

    /**
     * 移除当前块图信息
     * @param map_key
     */
    removeMapBlockInfo(map_key) {
        delete this.map_block_list[map_key];
    }

    /**
     * 遍历指定块图所有断层
     * @param map_key
     * @param {callbackMapGridInfo} callback
     * @param thisObj
     */
    eachBlockGetGridInfo(map_key, callback, thisObj) {
        let mapBlockInfo = this.map_block_list[map_key];
        if (mapBlockInfo) {
            mapBlockInfo.eachListGetGridInfo(callback, thisObj);
        }
    }

    /**
     * 获取一个空的星系坐标点
     * @param galaxy_id
     * @param type true相对星系大坐标 false世界大坐标
     * @returns {{x: *, y: *}}
     */
    getEmptyGalaxyPoint(galaxy_id, type = false) {
        //从0-恒星系半径*随机系数获取一个点
        let world_galaxy_info = m_server.ServerWorldBlock.getIndexGalaxyInfo(galaxy_id);
        let point = common.func.Point();
        let global_point = common.func.Point();
        let check = false;
        do {
            check = true;
            point = common.func.anglePoint(
                0,
                0,
                common.func.getRandRotation(),
                common.func.getRand(0, this.max_map_galaxy_radius)
            );
            global_point.x = world_galaxy_info.x + point.x;
            global_point.y = world_galaxy_info.y + point.y;

            //如果存在最近的断层 则false
            let near_gird_info = new NearGridInfo(global_point.x, global_point.y).getNearGridInfo();
            if (near_gird_info.nearest_grid_info) {
                check = false;
            }
            if (check) {
                //如果获取到最新的信标 则false
                let near_galaxy_info = new NearGalaxyInfo(global_point.x, global_point.y).getNearGalaxyInfo().getNearestBeaconInfo();
                if (near_galaxy_info.grid_beacon_type) {
                    check = false;
                }
            }
        } while (check === false);
        return type ? point : global_point;
    }
}

ServerMapBlock.m_instance = null;

module.exports = ServerMapBlock;

