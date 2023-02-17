const m_server = require("../../server");
const m_player = require("../../player");
const common = require("../../common");
const PlayerVariable = require("./PlayerVariable");
const PlayerStation = require("./PlayerStation");
const S2CChangeShip = require("../protocol/S2CChangeShip");
const S2CChangeInfo = require("../protocol/S2CChangeInfo");
const S2CChangeExtra = require("../protocol/S2CChangeExtra");
const S2CChangeItem = require("../protocol/S2CChangeItem");
const S2CChangeBlueprint = require("../protocol/S2CChangeBlueprint");
const S2CChangeProduct = require("../protocol/S2CChangeProduct");
const S2CChangeSkill = require("../protocol/S2CChangeSkill");
const S2CChangeTask = require("../protocol/S2CChangeTask");
const S2CChangeRenown = require("../protocol/S2CChangeRenown");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerInfo
 * @param {PlayerInfo} player_info
 */
/**
 * @class {PlayerInfo}
 */
class PlayerInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.player_id = dao.player_id;
        // this.grid_id = 0;
        // this.map_key = 0;
        this.player_uuid = null;
        this.online = false;
        this.is_newbie = false;
        //玩家不需要存储的运行变量
        this.player_variable = new PlayerVariable(this);
        /**
         * @type {PlayerExtra}
         */
        this.player_extra = null;
        /**
         * @type {Object<number, PlayerStation>}
         */
        this.player_stations = {};
        /**
         * @type {Object<number, PlayerShip>}
         */
        this.player_ships = null;
        /**
         * @type {Object<number, PlayerItem>}
         */
        this.player_items = null;
        /**
         * @type {Object<number, PlayerBlueprint>}
         */
        this.player_blueprints = null;
        /**
         * @type {Object<number, PlayerProduct>}
         */
        this.player_products = null;
        /**
         * @type {Object<number, PlayerSkill>}
         */
        this.player_skills = null;
        /**
         * @type {Object<number, PlayerTask>}
         */
        this.player_tasks = null;
        /**
         * @type {Object<number, PlayerRenown>}
         */
        this.player_renowns = null;

        //是否更改参数,前端状态
        this.change_infos = {};
        this.change_extras = {};
        this.change_items = {};
        this.change_blueprints = {};
        this.change_products = {};
        this.change_ships = {};
        this.change_skills = {};
        this.change_tasks = {};
        this.change_renowns = {};
    }

    getDao() {
        return this.dao;
    }

    setPlayerUuid(player_uuid) {
        this.player_uuid = player_uuid;
        return this;
    }

    setIsNewbie(status) {
        this.is_newbie = status;
    }

    getPlayerUuid() {
        return this.player_uuid;
    }

    setOnlineStatus(status) {
        this.online = status;
    }

    checkOnline() {
        return this.online;
    }

    updateLoginTime() {
        //TODO 应该改为setDaoValue的形式
        this.dao.login_time = common.func.getUnixTime();
    }

    updateLogoutTime() {
        //TODO 应该改为setDaoValue的形式
        this.dao.logout_time = common.func.getUnixTime();
        //如果登录时间比当前时间还靠后 则修正登出时间为登录时间+1秒
        (this.dao.logout_time < this.dao.login_time) && (this.dao.logout_time = this.dao.login_time + 1)
    }

    updateUpdateTime() {
        //TODO 应该改为setDaoValue的形式
        this.dao.update_time = common.func.getUnixTime() + common.setting.base_save_db_time;
    }

    setPoint(x, y) {
        if (this.getDaoValue('x') !== x) {
            this.setDaoValue('x', x);
            this.addChangeInfo('x', x);
        }
        if (this.getDaoValue('y') !== y) {
            this.setDaoValue('y', y);
            this.addChangeInfo('y', y);
        }
    }

    setStationId(station_id) {
        if (this.getStationId() !== station_id) {
            this.setDaoValue('station_id', station_id)
            this.addChangeInfo('station_id', station_id);
        }
    }

    getStationId() {
        return this.dao.station_id;
    }

    setShipId(ship_id) {
        if (this.getShipId() !== ship_id) {
            this.setDaoValue('ship_id', ship_id);
            this.addChangeInfo('ship_id', ship_id);
        }
    }

    getShipId() {
        return this.dao.ship_id;
    }

    setRotation(rotation) {
        if (this.getRotation() !== rotation) {
            this.setDaoValue('rotation', rotation);
            this.addChangeInfo('rotation', rotation);
        }
    }

    getRotation() {
        return this.dao.rotation;
    }

    setIp(ip) {
        this.setDaoValue('ip', ip);
    }

    /**
     * @param {PlayerExtra} player_extra
     */
    initPlayerExtra(player_extra) {
        this.player_extra = player_extra;
    }

    setPlayerExtra(param, value) {
        this.player_extra.setDaoValue(param, value);
        this.addChangeExtra(param, value);
    }

    getPlayerExtra(param) {
        return this.player_extra.getDaoValue(param);
    }

    /**
     * 增加extra值
     * @param param
     * @param value
     */
    addPlayerExtra(param, value = 1) {
        this.setPlayerExtra(param, this.getPlayerExtra(param) + value);
    }

    /**
     * 减少extra值
     * @param param
     * @param value
     */
    subPlayerExtra(param, value = 1) {
        this.setPlayerExtra(param, this.getPlayerExtra(param) - value);
    }

    /**
     * @param player_skills
     */
    initPlayerSkills(player_skills) {
        this.player_skills = player_skills;
    }

    /**
     * @param player_tasks
     */
    initPlayerTasks(player_tasks) {
        this.player_tasks = player_tasks;
        //赋值当前用户指针
        this.setFilter((player_task) => {
            return player_task.getExist()
        }).eachPlayerTasks((player_task) => {
            this.initPlayerTaskPointer(player_task);
        }, this)
    }

    /**
     * @param player_renowns
     */
    initPlayerRenowns(player_renowns) {
        this.player_renowns = player_renowns;
    }

    /**
     * @param player_ships
     */
    initPlayerShips(player_ships) {
        this.player_ships = player_ships;
        //赋值当前用户指针
        this.setFilter((player_ship) => {
            return player_ship.getExist()
        }).eachPlayerShips((player_ship) => {
            this.initPlayerShipPointer(player_ship);
        }, this)
    }

    /**
     * @param player_items
     */
    initPlayerItems(player_items) {
        this.player_items = player_items;

        this.setFilter((player_item) => {
            return player_item.getExist();
        }).eachPlayerItems((player_item) => {
            this.initPlayerItemPointer(player_item);
        }, this);
    }

    /**
     * @param player_blueprints
     */
    initPlayerBlueprints(player_blueprints) {
        this.player_blueprints = player_blueprints;

        // this.setFilter((player_blueprint) => {
        //     return player_blueprint.getExist();
        // }).eachPlayerBlueprints((player_blueprint) => {
        //     this.initPlayerBlueprintPointer(player_blueprint);
        // }, this);
    }

    /**
     * @param player_products
     */
    initPlayerProducts(player_products) {
        this.player_products = player_products;

        // this.setFilter((player_product) => {
        //     return player_product.getExist();
        // }).eachPlayerProducts((player_product) => {
        //     this.initPlayerProductPointer(player_product);
        // }, this);
    }

    /**
     * @param {PlayerShip} player_ship
     */
    initPlayerShipPointer(player_ship) {
        player_ship.setPlayerInfo(this);

        if (player_ship.getStationId()) {
            this.safeGetPlayerStation(player_ship.getStationId()).addStationShip(player_ship);
        }
    }

    /**
     * @param {PlayerItem} player_item
     */
    initPlayerItemPointer(player_item) {
        //赋值当前用户指针
        player_item.setPlayerInfo(this);

        if (player_item.getShipId()) {
            this.getPlayerShip(player_item.getShipId()).addShipItem(player_item);
        }

        if (player_item.getStationId()) {
            this.safeGetPlayerStation(player_item.getStationId()).addStationItem(player_item);
        }
    }

    /**
     * @param {PlayerBlueprint} player_blueprint
     */
    // initPlayerBlueprintPointer(player_blueprint) {
    //     player_blueprint.setPlayerInfo(this);
    // }

    /**
     * @param {PlayerProduct} player_product
     */
    // initPlayerProductPointer(player_product) {
    //     player_product.setPlayerInfo(this);
    //
    //     //生产是否要追加到前端用空间站 先不用试试效果 要看生产那边的UI需不需要
    //     // this.safeGetPlayerStation(player_product.getStationId());
    // }

    /**
     * @param {PlayerTask} player_task
     */
    initPlayerTaskPointer(player_task) {
        //赋值当前用户指针
        player_task.setPlayerInfo(this);

        // let world_task_info = m_server.ServerWorldTask.getIndexTaskInfo(player_task.task_id);
        // if (world_task_info) {
        //     world_task_info.setPlayerTask(player_task);
        //
        //     world_task_info.template_info.updateTaskPlayerCount();
        // }
    }

    /**
     * 同步客户端用户信息
     */
    syncClientUnitShipPlayer() {
        if (this.checkChangeInfos()) {
            new S2CChangeInfo()
                .setInfo(this.getChangeInfos())
                .wsSendSuccess(this.player_uuid);
        }
    }

    syncClientExtra() {
        if (this.checkChangeExtras()) {
            new S2CChangeExtra()
                .setExtra(this.getChangeExtras())
                .wsSendSuccess(this.player_uuid);
        }
    }

    /**
     * 同步客户端舰船信息
     */
    syncClientPlayerShip() {
        if (this.checkChangeShips()) {
            new S2CChangeShip()
                .setInfo(this.getChangeShips())
                .wsSendSuccess(this.player_uuid);
        }
    }

    /**
     * 同步客户端装备信息
     */
    syncClientPlayerItem() {
        if (this.checkChangeItems()) {
            new S2CChangeItem()
                .setInfo(this.getChangeItems())
                .wsSendSuccess(this.player_uuid);
        }
    }

    syncClientPlayerBlueprint() {
        if (this.checkChangeBlueprints()) {
            new S2CChangeBlueprint()
                .setInfo(this.getChangeBlueprints())
                .wsSendSuccess(this.player_uuid);
        }
    }

    syncClientPlayerProduct() {
        if (this.checkChangeProducts()) {
            new S2CChangeProduct()
                .setInfo(this.getChangeProducts())
                .wsSendSuccess(this.player_uuid);
        }
    }

    /**
     * 同步客户端技能信息
     */
    syncClientPlayerSkill() {
        if (this.checkChangeSkills()) {
            new S2CChangeSkill()
                .setInfo(this.getChangeSkills())
                .wsSendSuccess(this.player_uuid);
        }
    }

    /**
     * 同步客户端声望
     */
    syncClientPlayerRenown() {
        if (this.checkChangeRenowns()) {
            new S2CChangeRenown()
                .setInfo(this.getChangeRenowns())
                .wsSendSuccess(this.player_uuid);
        }
    }

    /**
     * 同步客户端任务
     */
    syncClientPlayerTask() {
        if (this.checkChangeTasks()) {
            new S2CChangeTask()
                .setInfo(this.getChangeTasks())
                .wsSendSuccess(this.player_uuid);
        }
    }

    /**
     * @param {PlayerShip} player_ship
     * @param param
     * @param value
     */
    setPlayerShipValue(player_ship, param, value) {
        //TODO 调用这个方法的地方 都应该new S2CChangeShip协议 但是没有
        // 现在怀疑 船掉血了 回空间站缓存 当前血量没给保存住
        player_ship || (player_ship = this.getCurrentPlayerShip());
        if (player_ship.getDaoValue(param) !== value) {
            player_ship.setDaoValue(param, value);
            this.addChangeShip(common.static.CHANGE_TYPE_EXIST, player_ship);
        }
    }

    /**
     * @param item_id
     * @param param
     * @param value
     */
    setPlayerItemValueUseId(item_id, param, value) {
        this.setPlayerItemValue(this.getPlayerItem(item_id), param, value);
    }

    /**
     * @param {PlayerItem} player_item
     * @param param
     * @param value
     */
    setPlayerItemValue(player_item, param, value) {
        if (player_item.getDaoValue(param) !== value) {
            player_item.setDaoValue(param, value);
            this.addChangeItem(common.static.CHANGE_TYPE_EXIST, player_item);
        }
        if (param === 'count' && value === 0) {
            this.removePlayerItem(player_item);
        }
    }

    /**
     * @param {PlayerBlueprint} player_blueprint
     * @param param
     * @param value
     */
    setPlayerBlueprintValue(player_blueprint, param, value) {
        if (player_blueprint.getDaoValue(param) !== value) {
            player_blueprint.setDaoValue(param, value);
            this.addChangeBlueprint(common.static.CHANGE_TYPE_EXIST, player_blueprint);
        }
        if (param === 'count' && value === 0) {
            this.removePlayerBlueprint(player_blueprint);
        }
    }

    /**
     * 设置玩家技能
     * @param {PlayerSkill} player_skill
     * @param param
     * @param value
     */
    setPlayerSkillValue(player_skill, param, value) {
        player_skill.setDaoValue(param, value);
        this.addChangeSkill(common.static.CHANGE_TYPE_EXIST, player_skill);
    }

    setPlayerRenownValue(player_renown, param, value) {
        //TODO
    }

    /**
     * 设置玩家任务 任务只更新内存变量 不写数据库
     * @param {PlayerTask} player_task
     */
    setPlayerTaskChange(player_task) {
        this.addChangeTask(common.static.CHANGE_TYPE_EXIST, player_task);
    }

    /**
     * 设置技能
     * @param {PlayerSkill} player_skill
     */
    buildPlayerSkill(player_skill) {
        this.player_skills[player_skill.skill_type] = player_skill;
        this.addChangeSkill(common.static.CHANGE_TYPE_BUILD, player_skill);
    }

    /**
     * 创建任务
     * @param player_task
     */
    buildPlayerTask(player_task) {
        this.player_tasks[player_task.task_id] = player_task;
        this.addChangeTask(common.static.CHANGE_TYPE_BUILD, player_task);

        this.initPlayerTaskPointer(player_task);
    }

    /**
     * 创建声望
     * @param {PlayerRenown} player_renown
     */
    buildPlayerRenown(player_renown) {
        this.player_renowns[player_renown.force] = player_renown;
        this.addChangeRenown(common.static.CHANGE_TYPE_BUILD, player_renown)
    }

    /**
     * 创建舰船
     * @param {PlayerShip} player_ship
     */
    buildPlayerShip(player_ship) {
        this.player_ships[player_ship.ship_id] = player_ship;
        this.initPlayerShipPointer(player_ship);

        this.addChangeShip(common.static.CHANGE_TYPE_BUILD, player_ship);
    }

    /**
     * 设置物品
     * @param {PlayerItem} player_item
     */
    buildPlayerItem(player_item) {
        this.player_items[player_item.item_id] = player_item;

        this.initPlayerItemPointer(player_item);

        this.addChangeItem(common.static.CHANGE_TYPE_BUILD, player_item);
        return player_item;
    }

    /**
     * 构建蓝图信息
     * @param player_blueprint
     * @returns {*}
     */
    buildPlayerBlueprint(player_blueprint) {
        this.player_blueprints[player_blueprint.blueprint_id] = player_blueprint;

        this.addChangeBlueprint(common.static.CHANGE_TYPE_BUILD, player_blueprint);
        return player_blueprint;
    }

    /**
     * 构建制造信息
     * @param player_product
     * @returns {*}
     */
    buildPlayerProduct(player_product) {
        this.player_products[player_product.product_id] = player_product;

        this.addChangeProduct(common.static.CHANGE_TYPE_BUILD, player_product);
        return player_product;
    }

    /**
     * 创建玩家舰船 异步更新数据库
     */
    createPlayerShip(ship_type, classify, station_id, shield, armor, capacity, ship_name) {
        let timestamp = common.func.getUnixTime();
        let ship_result_data = {
            ship_id: m_server.ServerWorldShip.max_ship_id,
            player_id: this.player_id,
            classify: classify,
            ship_type: ship_type,
            station_id: station_id,
            shield: shield,
            armor: armor,
            capacity: capacity,
            ship_name: ship_name,
            create_time: timestamp,
            update_time: timestamp,
        };

        this.buildPlayerShip(m_player.PlayerShipDao.createRowInfo(ship_result_data));
    }

    /**
     * 创建玩家技能 异步更新数据库
     */
    createPlayerSkill(skill_type, level) {
        let timestamp = common.func.getUnixTime();
        let skill_result_data = {
            skill_id: m_server.ServerWorldSkill.max_skill_id,
            player_id: this.player_id,
            create_time: timestamp,
            update_time: timestamp,
            skill_type: skill_type,
            level: level,
        };

        this.buildPlayerSkill(m_player.PlayerSkillDao.createRowInfo(skill_result_data));
    }

    /**
     * 创建玩家物品 异步更新数据库
     * @param item_type
     * @param classify
     * @return {*}
     */
    createPlayerItem(item_type, classify) {
        let timestamp = common.func.getUnixTime();
        let item_result_data = {
            item_id: m_server.ServerWorldItem.max_item_id,
            item_type: item_type,
            classify: classify,
            player_id: this.player_id,
            create_time: timestamp,
            update_time: timestamp,
        };

        return this.buildPlayerItem(m_player.PlayerItemDao.createRowInfo(item_result_data));
    }

    /**
     * 创建玩家物品 异步更新数据库
     * @param item_type
     * @param count
     * @return {*}
     */
    createPlayerBlueprint(item_type, count) {
        let timestamp = common.func.getUnixTime();
        let blueprint_result_data = {
            blueprint_id: m_server.ServerWorldBlueprint.max_blueprint_id,
            player_id: this.player_id,
            item_type: item_type,
            create_time: timestamp,
            update_time: timestamp,
        };

        return this.buildPlayerBlueprint(m_player.PlayerBlueprintDao.createRowInfo(blueprint_result_data));
    }

    /**
     * 创建玩家物品 异步更新数据库
     * @param blueprint_item_type
     * @param product_item_type
     * @param station_id
     * @param less_total
     * @returns {PlayerItem}
     */
    createPlayerProduct(blueprint_item_type, product_item_type, station_id, less_total) {
        //TODO
        let timestamp = common.func.getUnixTime();
        let product_result_data = {
            product_id: m_server.ServerWorldProduct.max_product_id,
            player_id: this.player_id,
            blueprint_item_type: blueprint_item_type,
            product_item_type: product_item_type,
            station_id: station_id,
            begin_time: timestamp,
            end_time: timestamp + less_total,
            less_total: less_total,
            now_time: timestamp,
            status: common.static.PRODUCT_STATUS_NORMAL,//暂停 摧毁 完成的话 不做更新 做交付按钮
            create_time: timestamp,
            update_time: timestamp,
        };

        return this.buildPlayerProduct(m_player.PlayerProductDao.createRowInfo(product_result_data));
    }

    /**
     * 创建任务
     * @param type
     * @param status
     * @param task_type
     * @param force
     * @param galaxy_id
     */
    createPlayerTask(type, status, task_type, force, galaxy_id) {
        let timestamp = common.func.getUnixTime();
        let task_result_data = {
            task_id: m_server.ServerWorldTask.max_task_id,
            force: force,
            player_id: this.player_id,
            type: type,
            galaxy_id: galaxy_id,
            task_type: task_type,
            status: status,
            create_time: timestamp,
            update_time: timestamp,
        }

        return this.buildPlayerTask(m_player.PlayerTaskDao.createRowInfo(task_result_data));
    }

    /**
     * 删除玩家技能
     * @param player_skill
     */
    removePlayerSkill(player_skill) {
        player_skill.setIsDelete();
        this.addChangeSkill(common.static.CHANGE_TYPE_REMOVE, player_skill);
    }

    /**
     * 删除玩家舰船
     * @param player_ship
     */
    removePlayerShip(player_ship) {
        player_ship.setIsDelete();
        this.addChangeShip(common.static.CHANGE_TYPE_REMOVE, player_ship);

        //删除舰船下所有装备
        player_ship.setFilter((ship_item) => {
            return ship_item.getExist();
        }).eachShipItem((ship_item) => {
            this.removePlayerItem(ship_item);
        }, this)
    }

    /**
     * 删除玩家物品
     * @param player_item
     */
    removePlayerItem(player_item) {
        player_item.setIsDelete();
        this.addChangeItem(common.static.CHANGE_TYPE_REMOVE, player_item);
    }

    /**
     * 删除玩家物品
     * @param player_blueprint
     */
    removePlayerBlueprint(player_blueprint) {
        player_blueprint.setIsDelete();
        this.addChangeBlueprint(common.static.CHANGE_TYPE_REMOVE, player_blueprint);
    }

    /**
     * 删除玩家物品
     * @param player_product
     */
    removePlayerProduct(player_product) {
        player_product.setIsDelete();
        this.addChangeProduct(common.static.CHANGE_TYPE_REMOVE, player_product);
    }

    /**
     * 移除玩家任务
     * @param player_task
     */
    removePlayerTask(player_task) {
        player_task.setIsDelete();
        this.addChangeTask(common.static.CHANGE_TYPE_REMOVE, player_task);
    }

    /**
     * 更新玩家所有属性最终操作
     */
    dbHandlePlayerInfo() {
        this.dbHandle();

        this.player_extra.dbHandle();

        this.eachPlayerSkills((player_skill) => {
            player_skill.dbHandle() && this.destroyPlayerSkill(player_skill.skill_type);
        }, this);
        this.eachPlayerShips((player_ship) => {
            player_ship.dbHandle() && this.destroyPlayerShip(player_ship.ship_id);
        }, this);
        this.eachPlayerItems((player_item) => {
            player_item.dbHandle() && this.destroyPlayerItem(player_item.item_id);
        }, this);
        this.eachPlayerBlueprints((player_blueprint) => {
            player_blueprint.dbHandle() && this.destroyPlayerItem(player_blueprint.blueprint_id);
        }, this);
        this.eachPlayerProducts((player_product) => {
            player_product.dbHandle() && this.destroyPlayerItem(player_product.product_id);
        }, this);
        this.eachPlayerTasks((player_task) => {
            player_task.dbHandle() && this.destroyPlayerTask(player_task.task_id);
        }, this);
    }

    /**
     * 销毁玩家技能
     * @param skill_type
     */
    destroyPlayerSkill(skill_type) {
        delete this.player_skills[skill_type];
    }

    /**
     * 销毁玩家舰船
     * @param ship_id
     */
    destroyPlayerShip(ship_id) {
        delete this.player_ships[ship_id];
    }

    /**
     * 销毁玩家物品
     * @param item_id
     */
    destroyPlayerItem(item_id) {
        delete this.player_items[item_id];
    }

    /**
     * 销毁玩家任务
     * @param task_id
     */
    destroyPlayerTask(task_id) {
        delete this.player_tasks[task_id];
    }

    /**
     * 移动装备
     * @param {PlayerItem} player_item
     * @param count
     * @param slot
     * @param ship_id
     * @param station_id
     * @param status
     */
    movePlayerItem(player_item, count, slot, ship_id, station_id, status) {
        this.setPlayerItemValue(player_item, 'count', count);
        this.setPlayerItemValue(player_item, 'slot', slot);
        this.setPlayerItemValue(player_item, 'ship_id', ship_id);
        this.setPlayerItemValue(player_item, 'station_id', station_id);
        this.setPlayerItemValue(player_item, 'status', status);
    }

    /**
     * 检测某空间站下某多个类型物品数量是否足够
     */
    checkNeedListUseItemType(station_id, mineral_list) {
        //深拷贝一个数组
        let need_list = {};
        for (let mineral_id in mineral_list) {
            need_list[mineral_id] = mineral_list[mineral_id];
        }
        this.getPlayerStation(station_id)
            .setFilter((player_item) => {
                return player_item.getExist();
            }).eachStationPlayerItems((player_item) => {
            let item_type = player_item.item_type;
            //如果尚有剩余
            if (need_list[item_type] && need_list[item_type] > 0) {
                if (need_list[item_type] > player_item.getCount()) {
                    need_list[item_type] = need_list[item_type] - player_item.getCount();
                } else {
                    delete need_list[item_type];
                }
            }
        }, this);

        //如果还有数据 则说明不满足条件
        return !Object.keys(need_list).length;
    }

    /**
     * 移除某空间站下某个类型的物品数量
     */
    removePlayerItemCountUserType(station_id, mineral_list) {
        //深拷贝一个数组
        this.getPlayerStation(station_id)
            .setFilter((player_item) => {
                return player_item.getExist();
            }).eachStationPlayerItems((player_item) => {
            let item_type = player_item.item_type;
            //扣除数量
            if (mineral_list[item_type] && mineral_list[item_type] > 0) {
                //如果扣除数量大于 拥有数量
                if (mineral_list[item_type] > player_item.getCount()) {
                    //修正扣除物品数量
                    mineral_list[item_type] -= player_item.getCount();
                    //扣除物品数量为0
                    this.setPlayerItemValue(player_item, 'count', 0);
                } else {
                    this.setPlayerItemValue(player_item, 'count', player_item.getCount() - mineral_list[item_type]);

                    delete mineral_list[item_type];
                }
            }
        }, this);
    }

    /**
     * 物品移动数量 旧物品只修改数量或者移除 新装备更新状态及数量
     * @param {PlayerItem} player_item
     * @param count
     * @param {PlayerItem} to_player_item
     * @param slot_id
     * @param ship_id
     * @param station_id
     * @param item_status
     */
    movePlayerItemStack(player_item, count, to_player_item, slot_id, ship_id, station_id, item_status) {
        if (to_player_item) {
            //类型一致才允许对接 并且物品不在槽位才允许堆叠
            if (player_item.item_type === to_player_item.item_type && to_player_item.getSlot() === 0) {
                //修正原物品数量
                ff(player_item.getCount(), typeof player_item.getCount())
                this.setPlayerItemValue(player_item, 'count', player_item.getCount() - count);
                ff(player_item.getCount(), typeof player_item.getCount())
                //如果数量为0则移除自己

                count += to_player_item.getCount();
                player_item = to_player_item;
            }
            // 是不是不会走到这里 会 实测了一下 一般来说 移动到一个错误的ID都是执行错误
            // 不会通过这个操作来整理背包 所以这里不做任何处理是正确的
        } else {
            //如果不完全移动 则分裂一个新物品
            if (count < player_item.getCount()) {
                //修正原物品数量
                this.setPlayerItemValue(player_item, 'count', player_item.getCount() - count);

                //创建分裂商品
                to_player_item = this.createPlayerItem(player_item.item_type, player_item.classify);
                player_item = to_player_item;
            }
            //完全移动直接转移
        }

        this.movePlayerItem(player_item, count, slot_id, ship_id, station_id, item_status);
    }

    /**
     * 凭空创建商品并移动
     * @param item_type
     * @param classify
     * @param count
     * @param {PlayerItem} to_player_item
     * @param ship_id
     * @param station_id
     * @param item_status
     */
    movePlayerItemStackUseItemType(item_type, classify, count, to_player_item, ship_id, station_id, item_status) {
        let player_item = null;
        if (to_player_item) {
            //类型一致才允许对接 并且物品不在槽位才允许堆叠
            if (item_type === to_player_item.item_type && to_player_item.getSlot() === 0) {
                count += to_player_item.getCount();
                player_item = to_player_item;
            } else {
                // 这里如果目标不一致 需要创建新道具
                to_player_item = null;
            }
        }
        if (to_player_item === null) {
            to_player_item = this.createPlayerItem(item_type, classify);
            player_item = to_player_item;
        }

        this.movePlayerItem(player_item, count, 0, ship_id, station_id, item_status);
    }

    /**
     * 凭空创建蓝图
     * @param item_type
     * @param count
     */
    movePlayerBlueprintStackUseItemType(item_type, count) {
        let player_blueprint = this.getBlueprintFromItemType(item_type);
        if (player_blueprint) {
            this.setPlayerBlueprintValue(player_blueprint, 'count', player_blueprint.getCount() + count);
        } else {
            this.createPlayerBlueprint(item_type, count);
        }
    }

    addChangeInfo(param, value) {
        this.change_infos[param] = value;
    }

    checkChangeInfos() {
        return !!Object.keys(this.change_infos).length;
    }

    getChangeInfos() {
        let change_infos = this.change_infos;

        this.clearChangeInfos();
        return change_infos;
    }

    clearChangeInfos() {
        this.change_infos = {};
    }

    addChangeExtra(param, value) {
        this.change_extras[param] = value;
    }

    checkChangeExtras() {
        return !!Object.keys(this.change_extras).length;
    }

    getChangeExtras() {
        let change_extras = this.change_extras;
        this.clearChangeExtras();

        return change_extras;
    }

    clearChangeExtras() {
        this.change_extras = {};
    }

    /**
     * @param type
     * @param {PlayerSkill} player_skill
     */
    addChangeSkill(type, player_skill) {
        //存在优先级最低 其他情况互相覆盖
        if (type === common.static.CHANGE_TYPE_EXIST && this.change_skills[player_skill.skill_type]) {
        } else {
            this.change_skills[player_skill.skill_type] = type;
        }
    }

    checkChangeSkills() {
        return !!Object.keys(this.change_skills).length;
    }

    getChangeSkills() {
        let change_skills = {};
        for (let skill_type in this.change_skills) {
            let type = this.change_skills[skill_type];
            change_skills[type] || (change_skills[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_skills[type][skill_type] = this.getPlayerSkill(skill_type).getClientPlayerSkill();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_skills[type][skill_type] = true;
                    break;
            }
        }

        this.clearChangeSkills();

        return change_skills;
    }

    clearChangeSkills() {
        this.change_skills = {};
    }

    /**
     * 任务实时通知 也不存在map 精简写法
     * @param type
     * @param {PlayerTask} player_task
     */
    addChangeTask(type, player_task) {
        //存在优先级最低 其他情况互相覆盖
        //任务实时通知 也不存在map 精简写法
        let change_tasks = {};
        change_tasks[type] = {};
        switch (type) {
            case common.static.CHANGE_TYPE_BUILD:
            case common.static.CHANGE_TYPE_EXIST:
                change_tasks[type][player_task.task_id] = player_task.getClientPlayerTask();
                break;
            case common.static.CHANGE_TYPE_REMOVE:
                change_tasks[type][player_task.task_id] = true;
                break;
        }

        new S2CChangeTask()
            .setInfo(change_tasks)
            .wsSendSuccess(this.player_uuid);

        //任务状态更新直接出发更新前端
        // this.syncClientPlayerTask();
    }

    checkChangeTasks() {
        return !!Object.keys(this.change_tasks).length;
    }

    getChangeTasks() {
        let change_tasks = {};
        for (let task_id in this.change_tasks) {
            let type = this.change_tasks[task_id];
            change_tasks[type] || (change_tasks[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_tasks[type][task_id] = this.getPlayerTask(task_id).getClientPlayerTask();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_tasks[type][task_id] = true;
                    break;
            }
        }

        this.clearChangeTasks();

        return change_tasks;
    }

    clearChangeTasks() {
        this.change_tasks = {};
    }


    /**
     * @param type
     * @param {PlayerRenown} player_renown
     */
    addChangeRenown(type, player_renown) {
        //存在优先级最低 其他情况互相覆盖
        if (type === common.static.CHANGE_TYPE_EXIST && this.change_renowns[player_renown.force]) {
        } else {
            this.change_renowns[player_renown.force] = type;
        }
    }

    checkChangeRenowns() {
        return !!Object.keys(this.change_renowns).length;
    }

    getChangeRenowns() {
        let change_renowns = {};
        for (let force in this.change_renowns) {
            let type = this.change_renowns[force];
            change_renowns[type] || (change_renowns[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_renowns[type][force] = this.getPlayerRenown(force).getClientPlayerRenown();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_renowns[type][force] = true;
                    break;
            }
        }

        this.clearChangeRenowns();

        return change_renowns;
    }

    clearChangeRenowns() {
        this.change_renowns = {};
    }

    /**
     * @param type
     * @param {PlayerShip} player_ship
     */
    addChangeShip(type, player_ship) {
        //存在优先级最低 其他情况互相覆盖
        if (type === common.static.CHANGE_TYPE_EXIST && this.change_ships[player_ship.ship_id]) {
        } else {
            this.change_ships[player_ship.ship_id] = type;
        }
    }

    checkChangeShips() {
        return !!Object.keys(this.change_ships).length;
    }

    getChangeShips() {
        let change_ships = {};
        for (let ship_id in this.change_ships) {
            let type = this.change_ships[ship_id];
            change_ships[type] || (change_ships[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_ships[type][ship_id] = this.getPlayerShip(ship_id).getClientPlayerShip();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_ships[type][ship_id] = true;
                    break;
            }
        }

        this.clearChangeShips();

        return change_ships;
    }

    clearChangeShips() {
        this.change_ships = {};
    }

    /**
     * @param type
     * @param {PlayerItem} player_item
     */
    addChangeItem(type, player_item) {
        //存在优先级最低 其他情况互相覆盖
        if (type === common.static.CHANGE_TYPE_EXIST && this.change_items[player_item.item_id]) {
        } else {
            this.change_items[player_item.item_id] = type;
        }
    }

    checkChangeItems() {
        return !!Object.keys(this.change_items).length;
    }

    getChangeItems() {
        let change_items = {};
        for (let item_id in this.change_items) {
            let type = this.change_items[item_id];
            change_items[type] || (change_items[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_items[type][item_id] = this.getPlayerItem(item_id).getClientPlayerItem();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_items[type][item_id] = true;
                    break;
            }
        }

        this.clearChangeItems();

        return change_items;
    }

    clearChangeItems() {
        this.change_items = {};
    }

    /**
     * @param type
     * @param {PlayerBlueprint} player_blueprint
     */
    addChangeBlueprint(type, player_blueprint) {
        //存在优先级最低 其他情况互相覆盖
        if (type === common.static.CHANGE_TYPE_EXIST && this.change_blueprints[player_blueprint.blueprint_id]) {
        } else {
            this.change_blueprints[player_blueprint.blueprint_id] = type;
        }
    }

    checkChangeBlueprints() {
        return !!Object.keys(this.change_blueprints).length;
    }

    getChangeBlueprints() {
        let change_blueprints = {};
        for (let blueprint_id in this.change_blueprints) {
            let type = this.change_blueprints[blueprint_id];
            change_blueprints[type] || (change_blueprints[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_blueprints[type][blueprint_id] = this.getPlayerBlueprint(blueprint_id).getClientPlayerBlueprint();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_blueprints[type][blueprint_id] = true;
                    break;
            }
        }

        this.clearChangeBlueprints();

        return change_blueprints;
    }

    clearChangeBlueprints() {
        this.change_blueprints = {};
    }

    /**
     * @param type
     * @param {PlayerProduct} player_product
     */
    addChangeProduct(type, player_product) {
        //存在优先级最低 其他情况互相覆盖
        if (type === common.static.CHANGE_TYPE_EXIST && this.change_products[player_product.product_id]) {
        } else {
            this.change_products[player_product.product_id] = type;
        }
    }

    checkChangeProducts() {
        return !!Object.keys(this.change_products).length;
    }

    getChangeProducts() {
        let change_products = {};
        for (let product_id in this.change_products) {
            let type = this.change_products[product_id];
            change_products[type] || (change_products[type] = {});
            switch (type) {
                case common.static.CHANGE_TYPE_BUILD:
                case common.static.CHANGE_TYPE_EXIST:
                    change_products[type][product_id] = this.getPlayerProduct(product_id).getClientPlayerProduct();
                    break;
                case common.static.CHANGE_TYPE_REMOVE:
                    change_products[type][product_id] = true;
                    break;
            }
        }

        this.clearChangeProducts();

        return change_products;
    }

    clearChangeProducts() {
        this.change_products = {};
    }

    /**
     * 安全获取玩家空间站信息
     * @param station_id
     * @return {PlayerStation}
     */
    safeGetPlayerStation(station_id) {
        //TODO 移除空间站功能还没做
        this.player_stations[station_id] || (this.player_stations[station_id] = new PlayerStation(station_id));
        return this.player_stations[station_id];
    }

    /**
     * 获取玩家技能信息
     * @param skill_type
     * @return {PlayerSkill|null}
     */
    getPlayerSkill(skill_type) {
        return (this.player_skills[skill_type] && this.player_skills[skill_type].getExist()) || null;
    }

    /**
     * 获取玩家任务
     * @param task_id
     * @return {PlayerTask|null}
     */
    getPlayerTask(task_id) {
        return (this.player_tasks[task_id] && this.player_tasks[task_id].getExist()) || null;
    }

    /**
     * @param force
     * @return {PlayerRenown|null}
     */
    getPlayerRenown(force) {
        return (this.player_renowns[force] && this.player_renowns[force].getExist()) || null;
    }

    /**
     * 获取玩家空间站信息
     * @param station_id
     * @return {PlayerStation}
     */
    getPlayerStation(station_id) {
        return this.player_stations[station_id];
    }

    /**
     * @param item_id
     * @return {PlayerItem|null}
     */
    getPlayerItem(item_id) {
        return (this.player_items[item_id] && this.player_items[item_id].getExist()) || null;
    }

    /**
     * @param blueprint_id
     * @returns {PlayerBlueprint|null}
     */
    getPlayerBlueprint(blueprint_id) {
        return (this.player_blueprints[blueprint_id] && this.player_blueprints[blueprint_id].getExist()) || null;
    }

    /**
     * @param product_id
     * @returns {PlayerProduct|null}
     */
    getPlayerProduct(product_id) {
        return (this.player_products[product_id] && this.player_products[product_id].getExist()) || null;
    }

    /**
     * @param ship_id
     * @returns {PlayerShip|null}
     */
    getPlayerShip(ship_id) {
        return (this.player_ships[ship_id] && this.player_ships[ship_id].getExist()) || null;
    }

    /**
     * @returns {PlayerShip}
     */
    getCurrentPlayerShip() {
        return this.player_ships[this.dao.ship_id];
    }

    /**
     * 实时存储登入时间
     */
    saveLoginTime() {
        m_player.PlayerInfoDao.updateLoginTimeDb(this.dao.player_id, this.dao.login_time);
        m_player.LogLoginDao.insertLoginLog(this.dao.player_id, this.dao.ip, common.define.LOGIN_LOG_TYPE_LOGIN, this.dao.login_time);
    }

    /**
     * 实时存储登出时间
     */
    saveLogoutTime() {
        m_player.PlayerInfoDao.updateLogoutTimeDb(this.dao.player_id, this.dao.logout_time);
        m_player.LogLoginDao.insertLoginLog(this.dao.player_id, this.dao.ip, common.define.LOGIN_LOG_TYPE_LOGOUT, this.dao.logout_time);
    }

    saveShipId() {
        m_player.PlayerInfoDao.updateShipIdDb(this.dao.player_id, this.dao.ship_id);
    }

    /**
     * @param {callbackPlayerSkill} callback
     * @param thisObj
     */
    eachPlayerSkills(callback, thisObj) {
        // for (let player_skill of Object.values(this.player_skills)) {
        //     callback && callback.call(thisObj, player_skill);
        // }
        common.func.filterEachObject(this.filter, this.player_skills, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param {callbackPlayerShip} callback
     * @param thisObj
     */
    eachPlayerShips(callback, thisObj) {
        // for (let player_ship of Object.values(this.player_ships)) {
        //     callback && callback.call(thisObj, player_ship);
        // }
        common.func.filterEachObject(this.filter, this.player_ships, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param {callbackPlayerItem} callback
     * @param thisObj
     */
    eachPlayerItems(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.player_items, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param {callbackPlayerBlueprint} callback
     * @param thisObj
     */
    eachPlayerBlueprints(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.player_blueprints, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param {callbackPlayerProduct} callback
     * @param thisObj
     */
    eachPlayerProducts(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.player_products, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param {callbackPlayerTask} callback
     * @param thisObj
     */
    eachPlayerTasks(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.player_tasks, callback, thisObj);
        this.setFilter();
    }

    /**
     * @param {callbackPlayerRenown} callback
     * @param thisObj
     */
    eachPlayerRenowns(callback, thisObj) {
        common.func.filterEachObject(this.filter, this.player_renowns, callback, thisObj);
        this.setFilter();
    }

    /**
     * @return {PlayerBlueprint|null}
     */
    getBlueprintFromItemType(item_type) {
        for (let player_blueprint of Object.values(this.player_blueprints)) {
            if (player_blueprint.getExist() && player_blueprint.item_type === item_type) {
                return player_blueprint;
            }
        }
        return null;
    }

    /**
     * 检测一个技能是否可以加点
     * @param check_skill_type
     */
    checkSkillInRange(check_skill_type) {
        //获取玩家的技能
        let check_player_skill = this.getPlayerSkill(check_skill_type);
        //如果玩家技能存在
        if (check_player_skill && check_player_skill.getExist()) {
            return true;
        }
        //不存在 则获取技能基础信息(坐标)
        let check_base_skill_info = m_server.ServerBaseSkill.getBaseSkill(check_skill_type).getDao();

        //遍历玩家技能 不再使用each遍历到就中断退出
        for (let player_skill of Object.values(this.player_skills)) {
            let base_skill_info = player_skill.getBaseSkillInfo();
            //获取技能间距
            let distance = common.func.getDistance(check_base_skill_info.x, check_base_skill_info.y, base_skill_info.x, base_skill_info.y);
            if (distance < (player_skill.getDaoValue('level') + 1) * common.setting.base_skill_range) {
                //有一个存在则返回true
                return true;
            }
        }

        return false;
    }

    /**
     * 获取是否可以在太空装配
     * @return {boolean}
     */
    getAssemblyInSpace() {
        return true;
    }

    /**
     * 增加经验
     * @param exp
     */
    addExp(exp) {
        //暂时不做跳级
        let new_exp = this.getPlayerExtra(common.extra.EXTRA_EXP) + exp;
        let level_up_exp = m_server.ServerBaseLevel.getLevelUpExp(this.getPlayerExtra(common.extra.EXTRA_LEVEL));
        if (new_exp >= level_up_exp) {
            new_exp -= level_up_exp;

            this.levelUpHandle();
        }

        this.setPlayerExtra(common.extra.EXTRA_EXP, new_exp);
    }

    /**
     * 升级
     */
    levelUpHandle() {
        this.addPlayerExtra(common.extra.EXTRA_LEVEL);
        this.addPlayerExtra(common.extra.EXTRA_SKILL_POINTS);
    }

    getClientPlayerInfo() {
        let skills = {};
        this.setFilter((player_skill) => {
            return player_skill.getExist()
        }).eachPlayerSkills((player_skill) => {
            skills[player_skill.skill_type] = player_skill.getClientPlayerSkill();
        }, this);

        let ships = {};
        this.setFilter((player_ship) => {
            return player_ship.getExist()
        }).eachPlayerShips((player_ship) => {
            ships[player_ship.ship_id] = player_ship.getClientPlayerShip();
        }, this);

        let items = {};
        this.setFilter((player_item) => {
            return player_item.getExist();
        }).eachPlayerItems((player_item) => {
            items[player_item.item_id] = player_item.getClientPlayerItem();
        }, this);

        let blueprints = {};
        this.setFilter((player_blueprint) => {
            return player_blueprint.getExist();
        }).eachPlayerBlueprints((player_blueprint) => {
            blueprints[player_blueprint.blueprint_id] = player_blueprint.getClientPlayerBlueprint();
        }, this);

        let products = {};
        this.setFilter((player_product) => {
            return player_product.getExist();
        }).eachPlayerProducts((player_product) => {
            products[player_product.product_id] = player_product.getClientPlayerProduct();
        }, this);

        let tasks = {};
        this.setFilter((player_task) => {
            return player_task.getExist();
        }).eachPlayerTasks((player_task) => {
            tasks[player_task.task_id] = player_task.getClientPlayerTask();
        }, this);

        let renowns = {};
        this.setFilter((player_renown) => {
            return player_renown.getExist();
        }).eachPlayerRenowns((player_renown) => {
            renowns[player_renown.force] = player_renown.getClientPlayerRenown();
        }, this);

        return {
            player_id: this.player_id,
            server_id: this.dao.server_id,
            player_extra: this.player_extra.getClientPlayerExtra(),
            player_variable: this.player_variable.getClientPlayerVariable(),
            player_skills: skills,
            player_ships: ships,
            player_items: items,
            player_blueprints: blueprints,
            player_products: products,
            player_tasks: tasks,
            player_renowns: renowns,
            ship_id: this.dao.ship_id,
            station_id: this.dao.station_id,
            // station_infos: client_station_infos,
            x: this.dao.x,
            y: this.dao.y,
        }
    }
}

module.exports = PlayerInfo;
