const UnitShipPlayerMap = require("./UnitShipPlayerMap");
const m_server = require("../../../server");
const common = require("../../../common");
const S2CChangeShip = require("../../../player/protocol/S2CChangeShip");
const NearGalaxyInfo = require("../../world/info/NearGalaxyInfo");
const S2CWorldScan = require("../../world/protocol/S2CWorldScan");
const S2CWorldScanChange = require("../../world/protocol/S2CWorldScanChange");
const S2CChangeVariable = require("../../../player/protocol/S2CChangeVariable");

/**
 * @callback callbackUnitShipPlayer
 * @param {UnitShipPlayer} ship_player
 */
/**
 * @constructor
 * @class {UnitShipPlayer}
 * @extends {UnitShipPlayerMap}
 */
class UnitShipPlayer extends UnitShipPlayerMap {
    constructor() {
        super();
        //ship_player表的主键
        // this.ship_id = 0;
        //同步player_info的登录状态
        this.online = false;
        //前端map加载完成要求请求场景信息
        this.map_frame_status = common.define.PLAYER_MAP_FRAME_STATUS_NULL;
        //操作动作信息 //--废弃 移动的操作增加缓存 其他操作用完需要移除
        this.frame_action = {};
        this.player_uuid = '';

        //如果用户折跃或死亡会触发个人的刷新所有信息的方法
        this.map_frame_move_merge = false;

        /**
         * @type {PlayerInfo}
         */
        this.player_info = null;

        this.name = '';
    }

    /**
     * 赋值玩家信息类
     * @param player_info
     * @return {UnitShipPlayer}
     */
    setPlayerInfo(player_info) {
        this.player_info = player_info;
        return this;
    }

    /**
     * 同步player_info和unit_ship_player
     */
    syncPlayerInfo() {
        // player_info.setGridId(unit_ship_player.grid_id);
        // player_info.setMapKey(unit_ship_player.map_key);
        //player表的数据都要处理
        this.setOnlineStatus(this.player_info.online);
        this.setPlayerUuid(this.player_info.player_uuid);
    }

    /**
     * 同步unit_ship_player到player_info
     */
    syncUnitShipPlayer() {
        //TODO 这两个方法未来检查和优化一下 感觉一些值修改unit_ship_player一些值修改player_info 容易出问题
        // 你比如说舰船 是读取的数据库所以在player_info上 然后同步到unit_ship_player
        // 可其他参数明显是在unit_ship_player上运算的 需要同步回player_info
        // 再比如说技能 目前是操作player_info的 然后触发reload 同步到unit_ship_player
        // 再比如说声望 我是想操作player_info的 不然在unit_ship_player再构建一份??
        // 哎别说可以考虑 出站的时候reload这个东西 其他时候不更新 这种延迟是能接受的
        //ship_id比较特别 ship_id是通过player_info同步到unit_ship_player
        // this.player_info.setShipId(this.ship_id);
        this.player_info.setStationId(this.station_id);
        this.player_info.setPoint(this.x, this.y);
        this.player_info.setRotation(this.rotation);

        this.player_info.setPlayerShipValue(null, 'shield', this.shield);
        this.player_info.setPlayerShipValue(null, 'armor', this.armor);
        this.player_info.setPlayerShipValue(null, 'speed', this.speed);
        this.player_info.setPlayerShipValue(null, 'capacity', this.capacity);

        this.player_info.syncClientPlayerShip();

        this.player_info.syncClientUnitShipPlayer();
    }

    setPlayerUuid(player_uuid) {
        this.player_uuid = player_uuid;
    }

    checkFrameAction() {
        return !!Object.keys(this.frame_action).length;
    }

    setFrameMoveAction(rat, pow) {
        // this.setFrameAction('move', action);
        this.frame_action['move'] = {'rat': rat, 'pow': pow};
    }

    setFrameItemAction(slot, status) {
        this.frame_action['item'] || (this.frame_action['item'] = {});
        this.frame_action['item'][slot] = status;
    }

    // setFrameAction(type, action) {
    //     this.frame_action[type] = action;
    // }

    getFrameAction() {
        return this.frame_action;
    }

    clearFrameAction() {
        this.frame_action = {};
    }

    setOnlineStatus(status) {
        this.online = status;
    }

    setMapFrameStatus(status) {
        this.map_frame_status = status;
    }

    getMapFrameStatus() {
        return this.map_frame_status
    }

    setMapFrameMoveMerge(status) {
        this.map_frame_move_merge = status;
    }

    getMapFrameMoveMerge() {
        return this.map_frame_move_merge;
    }

    /**
     * 读取信息
     * @returns {UnitShipPlayer}
     */
    loadInfo() {
        // let current_player_ship = this.player_info.getCurrentPlayerShip();
        // this.setUnitId(this.player_info.dao.player_id);
        // this.setShipId(this.player_info.dao.ship_id);
        // this.setShipType(current_player_ship.dao.ship_type);


        //初始化舰船基础信息
        // this.initBaseShipInfo();
        this.reloadInfo();
        this.setInit();
        return this;
    }

    /**
     * 重新加载信息
     */
    reloadInfo() {
        let current_player_ship = this.player_info.getCurrentPlayerShip();

        if (this.player_info.dao.ship_id !== this.ship_id) {
            this.setUnitId(this.player_info.dao.player_id);
            this.setShipId(this.player_info.dao.ship_id);
            this.setShipType(current_player_ship.dao.ship_type);
            this.name = current_player_ship.dao.ship_name;

            this.clearBaseShipInfo();
            //初始化舰船基础信息
            this.initBaseShipInfo();

            this.updateCoreSkillProperty();
        }
        //读取装备信息 必须在舰船初始化之后(获取武器坐标)
        let ship_item = this.loadInfoItem(current_player_ship);
        //初始化装备信息
        this.updateShipPlayerItem(ship_item);

        let ship_skills = this.loadInfoSkill(this.player_info.player_skills);
        this.updateShipPlayerSkill(ship_skills);

        let ship_renowns = this.loadInfoRenown(this.player_info.player_renowns);
        this.updateShipPlayerRenown(ship_renowns);

        super.loadInfoMap();
        this.initPlayerInfoVariable();
        this.initShipPlayerVariable(current_player_ship);
    }

    /**
     * 基础属性初始化
     */
    getBaseShipInfo() {
        this.base_ship_info || (this.base_ship_info = m_server.ServerBaseShip.getShipPlayerDataValue(this.ship_type).getDao());
        return this.base_ship_info;
    }

    /**
     * 读取信息
     * @param {PlayerShip} ship_player
     */
    loadInfoItem(ship_player) {
        //NPC是从装备表读取武器个数种类坐标 武器有可能为空
        //这里开始读取舰船和武器基础数据 数据库数据 动态数据
        //后端统一生成类似前端的数组
        let weapons = {};
        let actives = {};
        let passives = {};
        ship_player.setFilter((ship_item) => {
            return ship_item.getExist() && ship_item.dao.slot;
        }).eachShipItem((ship_item) => {
            let slot = ship_item.dao.slot;
            //只遍历身上的装备
            //这只生成数据
            let main_classify = ship_item.getMainClassify();
            switch (main_classify) {
                case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                    let base_weapon_pos = this.getBaseWeaponPos(slot);
                    weapons[slot] = {
                        item_id: ship_item.item_id,
                        item_type: ship_item.item_type,
                        slot: slot,
                        status: ship_item.dao.status,
                        x: base_weapon_pos.x,
                        y: base_weapon_pos.y,
                    };
                    break;
                case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                    actives[slot] = {
                        item_id: ship_item.item_id,
                        item_type: ship_item.item_type,
                        slot: slot,
                        status: ship_item.dao.status,
                    };
                    break;
                case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                    passives[slot] = {
                        item_id: ship_item.item_id,
                        item_type: ship_item.item_type,
                        slot: slot,
                        status: ship_item.dao.status,
                    };
                    break;
            }
        }, this);

        return {
            weapons: weapons,
            actives: actives,
            passives: passives,
        };
    }

    loadInfoSkill(player_skills) {
        //增加经验直接修改player_info的skills 升级时触发reload事件会走本方法
        //前端只增加经验增加的提示 升级通过后端来判断
        let ship_skill = [];
        //TODO 这里封装成和前端差不多的数据 下一个方法 前后端格式保持一致
        for (let skill_info of Object.values(player_skills)) {
            ship_skill.push({
                skill_type: skill_info.skill_type,
                level: skill_info.dao.level,
            });
        }
        return ship_skill;
    }

    loadInfoRenown(player_renowns) {
        let ship_renown = {};
        //TODO 这里封装成和前端差不多的数据 下一个方法 前后端格式保持一致
        for (let renown_info of Object.values(player_renowns)) {
            ship_renown[renown_info.force] = renown_info.dao.value;
        }
        return ship_renown;
    }

    initPlayerInfoVariable() {
        this.setX(this.player_info.dao.x);
        this.setY(this.player_info.dao.y);
        this.setRotation(this.player_info.dao.rotation);
        this.setTargetMoveAngle(this.rotation);
        this.setStationId(this.player_info.dao.station_id);
    }

    initShipPlayerVariable(ship_player) {
        //基础属性初始化
        this.setShield(ship_player.dao.shield);
        this.setArmor(ship_player.dao.armor);
        this.setSpeed(ship_player.dao.speed);
        this.setCapacity(ship_player.dao.capacity);

        this.updateSpeed();
    }

    changeItemStatus(ship_item) {
        this.player_info.setPlayerItemValueUseId(ship_item.item_id, 'status', ship_item.item_status);
        //TODO 这里未同步前端
    }

    /**
     * 计算玩家折跃耗电
     */
    getShipPlayerWarpCost() {

    }

    shipDeath() {
        if (this.getDeath()) {
            this.shipPlayerDeath();
            return true;
        }
        return false;
    }

    shipPlayerDeath() {
        //TODO 获取基地空间站信息 移动到那里
        if (this.getIsWarpStatus()) {
            let unit_warp = m_server.ServerMapUnit.getIndexUnitWarp(this.getWarpTargetId());
            m_server.ServerMapUnit.leaveUnitWarp(unit_warp, common.static.MAP_FRAME_TYPE_LEAVE);

            this.stopWarpAction(true);
        }

        let station_id = 1001;
        let world_station_info = m_server.ServerWorldStation.getIndexStationInfo(station_id);
        this.setStationId(station_id);

        this.setX(world_station_info.global_x);
        this.setY(world_station_info.global_y);
        this.setArmor(1);

        // TODO 测试数据
        this.setShield(this.shield_max);
        this.setArmor(this.armor_max);

        //TODO 这里没有发送ship同步 前端有没有问题
        this.player_info.setPlayerShipValue(null, 'station_id', station_id);


        // this.setBerth();
        /**
         * 清理移动参数
         */
        this.frame_action_move.pow = 0;
        this.move_point.x = 0;
        this.move_point.y = 0;

        this.move_rotation = 0;


        //这个方法不应该放在这里 应该放在map里
        this.move_distance = 0;
        m_server.ServerMapManage.unitMoveGrid(this, true);

        this.syncUnitShipPlayer();

        m_server.ServerWorldScan.reScanList(this.player_info, this);

        this.triggerWorldPosition();
    }

    /**
     * 玩家停靠后端自行处理方式
     */
    shipBerthJoin() {
        this.player_info.setPlayerShipValue(null, 'station_id', this.berth_station_id);

        super.shipBerthJoin();

        this.player_info.syncClientPlayerShip();

        this.syncUnitShipPlayer();
    }

    getBaseAttribute(attribute_type) {
        return m_server.ServerBaseItem.getItemAttributeValue(attribute_type).getDao();
    }

    /**
     * 获取基础套装属性
     * @param suit_type
     * @return {BaseItemSuitInfo}
     */
    getBaseSuitInfo(suit_type) {
        return m_server.ServerBaseItem.getItemSuitValue(suit_type).getDao();
    }

    /**
     * 折跃跳跃方法
     * @param success
     */
    jumpWarpAction(success = false) {
        super.jumpWarpAction(success);

        this.move_distance = 0;

        m_server.ServerMapManage.unitMoveGrid(this, true);

        m_server.ServerWorldScan.reScanList(this.player_info, this);

        this.triggerWorldPosition();

        this.syncUnitShipPlayer();
    }

    /**
     * 清理射线扫描 如果为true表示扫描完成
     * @param status
     */
    clearRayParam(status = false) {
        if (status) {
            //扫描完成 触发事件
            let ray_unit_info = this.map_grid_info.getMapMergeUnitInfo(this.ray_unit_type, this.ray_unit_id);
            ray_unit_info && ray_unit_info.shipByRay();
        }
        super.clearRayParam();
    }

    /**
     * 玩家切换断层触发声望逻辑
     */
    // updateRenownStatus() {
    //     this.map_grid_info.map_merge_info.eachGridInfo((map_grid_info) => {
    //         map_grid_info.eachStation((unit_bullet) => {
    //         }, this);
    //
    //         map_grid_info.eachDead((unit_dead) => {
    //             unit_dead.addRenownInfo(this);
    //         }, this);
    //     }, this);
    // }

    /**
     * 获取某个分类第一个空的槽位
     * @param main_classify
     * @return {number}
     */
    getFirstNullSlot(main_classify) {
        let slot_length = 0;
        switch (main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                slot_length = Object.keys(this.getBaseShipInfo().weapon).length;
                break;
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
                slot_length = Object.keys(this.getBaseShipInfo().active).length;
                break;
            case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                slot_length = Object.keys(this.getBaseShipInfo().passive).length;
                break;
        }
        for (let pos = 0; pos < slot_length; pos++) {
            let slot = common.method.getSlotFromPos(main_classify, pos);
            if (this.getShipItem(slot, main_classify)) {

            } else {
                return slot;
            }
        }
        return 0;
    }

    /**
     * 批量装配装备时修改需求
     * @param require
     */
    checkPowerAddRequire(require) {
        if (this.checkPower(require)) {
            this.power += require;
            return true;
        }
        return false;
    }

    shipKillMailHandle() {

    }

    /**
     * 触发world位移事件
     */
    triggerWorldPosition() {
        //登录第一个协议 移动一段距离 折跃 死亡 4个地方触发重通知更新扫描仪事件
        m_server.ServerWorldScan.noticeUnitScan(common.static.WORLD_UNIT_TYPE_SHIP_PLAYER, this);
    }

    /**
     * 精扫逻辑
     */
    scanExactHandle() {
        //每秒触发精扫逻辑 如果有升级则返回 否则返回null
        let scan_beacon_info = this.player_info.player_variable.exactAction(this.server_frame);
        //如果精扫等级提升
        if (scan_beacon_info) {
            new S2CWorldScanChange()
                .setType(common.static.CHANGE_TYPE_EXIST)
                .setInfo(scan_beacon_info.getClientScanBeaconInfo())
                .wsSendSuccess(this.player_uuid);

            //如果扫描完成移除精扫信息
            if (scan_beacon_info.intensity_step === common.static.SCAN_EXACT_SUCCESS) {
                //这里直接赋值了
                new S2CChangeVariable()
                    .setInfo({exact_type: 0, exact_id: 0})
                    .wsSendSuccess(this.player_uuid);
            }
        }
    }

    /**
     * @returns {*}
     */
    getClientUnitShipPlayer() {
        let weapons = {};
        let actives = {};
        let passives = {};
        let skills = this.player_skills.getClientShipPlayerSkills();

        this.eachShipWeapon((ship_weapon) => {
            weapons[ship_weapon.slot] = ship_weapon.getClientShipWeapon();
        }, this);
        this.eachShipActive((ship_active) => {
            actives[ship_active.slot] = ship_active.getClientShipActive();
        }, this);
        this.eachShipPassive((ship_passive) => {
            passives[ship_passive.slot] = ship_passive.getClientShipPassive();
        }, this);

        return {
            grid_id: this.grid_id,
            unit_id: this.unit_id,
            unit_type: this.unit_type,
            ship_type: this.ship_type,
            ship_id: this.ship_id,
            x: this.x,
            y: this.y,
            rotation: this.rotation,

            // unit_status: this.unit_status,
            station_id: this.station_id,

            // last_grid_id: this.last_grid_id,

            shield: this.getShield(),
            armor: this.getArmor(),
            speed: this.getSpeed(),
            capacity: this.getCapacity(),

            pow_point: this.pow_point,
            move_point: this.move_point,
            auxiliary_point: this.auxiliary_point,
            // final_pow_point: this.final_pow_point,
            move_rotation: this.move_rotation,
            frame_action_move: this.frame_action_move,
            target_move_angle: this.target_move_angle,
            collision_point: this.collision_point,

            // harm_electric: this.harm_electric,
            // harm_thermal: this.harm_thermal,
            // harm_explode: this.harm_explode,
            harm_status: this.harm_status,

            // target_grid_id: this.target_info.getTargetUnitType(),
            target_unit_type: this.target_info.getTargetUnitType(),
            target_unit_id: this.target_info.getTargetUnitId(),

            //折跃开始时间
            warp_run_frame: this.warp_run_frame,
            //折跃结束时间
            warp_sum_frame: this.warp_sum_frame,
            //折跃启动结束时间
            warp_ing_frame: this.warp_ing_frame,
            //折跃跳跃时间
            warp_hop_frame: this.warp_hop_frame,
            warp_status: this.warp_status,

            // 模块开始帧数
            battle_run_frame: this.battle_run_frame,
            // 模块结束帧数
            battle_sum_frame: this.battle_sum_frame,
            // 模块启动结束帧数
            battle_ing_frame: this.battle_ing_frame,
            // 模块结束开始帧数
            battle_hop_frame: this.battle_hop_frame,

            battle_status: this.battle_status,
            moving: this.moving,

            appoint_unit_type: this.appoint_unit_type,
            appoint_unit_id: this.appoint_unit_id,

            ray_unit_type: this.ray_unit_type,
            ray_unit_id: this.ray_unit_id,
            ray_frame: this.ray_frame,

            berth_status: this.berth_status,
            berth_frame: this.berth_frame,
            berth_end_x: this.berth_end_x,
            berth_end_y: this.berth_end_y,
            berth_station_id: this.berth_station_id,

            last_player_harm_unit_id: this.last_player_harm_unit_id,

            weapons: weapons,
            actives: actives,
            passives: passives,
            skills: skills,
            renowns: this.player_renowns,
        }
    }
}

module.exports = UnitShipPlayer;

