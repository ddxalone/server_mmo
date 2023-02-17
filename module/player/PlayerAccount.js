const crypto = require("crypto");
const m_websocket = require("../websocket");
const m_server = require("../server");
const m_player = require("./index");
const common = require("../common");
const m_log = require("../log");

/**
 * 帐号相关操作
 */
class PlayerAccount {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;
        //正在登录的玩家列表
        this.player_login_action_list = {};
    }

    static instance() {
        if (PlayerAccount.m_instance == null) {
            PlayerAccount.m_instance = new PlayerAccount()
        }
        return PlayerAccount.m_instance;
    }

    /**
     * 获取帐号下的所有已创角的服务器列表
     * @param open_id
     */
    async getAccountServerList(open_id) {
        try {
            let account_info_list = await m_player.AccountInfoDao.getLoginServerList(open_id);
            let server_list = m_server.ServerList.getServerList();
            //分析登录区服
            let login_server_list = [];
            for (let player_id in account_info_list) {
                let account_info = account_info_list[player_id];
                let client_server_info = server_list[account_info.dao.server_id].getClientServerInfo();
                client_server_info.time = account_info.dao.login_time;
                login_server_list.push(client_server_info);
            }

            let all_server_list = [];
            for (let server_id in server_list) {
                all_server_list.push(server_list[server_id].getClientServerInfo());
            }

            return {all_server_list: all_server_list, login_server_list: login_server_list};
        } catch (e) {
            m_log.LogManage.error(e);
            return null;
        }
    }

    /**
     * 获取帐号基本信息
     * @param open_id
     * @param server_id
     * @returns {AccountInfo}
     */
    async getAccountInfo(open_id, server_id) {
        try {
            return await m_player.AccountInfoDao.getAccountInfo(open_id, server_id);
        } catch (e) {
            //这里判空和返回异常处理方式要不同
            m_log.LogManage.error(e);
            return null;
        }
    }

    /**
     * 创角
     * @param open_id
     * @param server_id
     * @param nickname
     * @param ip
     * @param timestamp
     * @return {null|PlayerInfo}
     */
    async createPlayerInfo(open_id, server_id, nickname, ip, timestamp) {
        try {
            let server_info = m_server.ServerList.getServerInfo(server_id);
            let point = m_server.ServerMapBlock.getEmptyGalaxyPoint(server_info.dao.galaxy_id, false);
            /**
             * @type {PlayerInfo} player_info
             */
            let player_info = await m_player.PlayerInfoDao.createRolePlayerInfo(open_id, server_id, point.x, point.y, nickname, ip, timestamp);
            //创建用户其他数据
            if (player_info === null || !player_info.player_id) {
                // return {error: 'create player_id lost'};
                m_log.LogManage.error(['create player_id lost', open_id, server_id]);
                return null;
            }

            //加载extra
            let player_extra = await m_player.PlayerExtraDao.createRolePlayerExtra(player_info.player_id, timestamp);
            player_info.initPlayerExtra(player_extra);

            let current_ship_id = m_server.ServerWorldShip.max_ship_id;
            player_info.initPlayerShips(await m_player.PlayerShipDao.createRolePlayerShip(player_info.player_id, current_ship_id, timestamp));
            //获取第一个舰船ID
            player_info.setShipId(current_ship_id);
            //这里先保存一下舰船id TODO 实测 这里注释掉后会再下一次更新后更新ship_id 现在没做保护退出 可能会有问题
            player_info.saveShipId();

            player_info.initPlayerItems(await m_player.PlayerItemDao.createRolePlayerItem(player_info.player_id, current_ship_id, timestamp));

            player_info.initPlayerBlueprints({});
            
            player_info.initPlayerProducts({});

            player_info.initPlayerSkills(await m_player.PlayerSkillDao.createRolePlayerSkill(player_info.player_id, timestamp));

            let task_x = Math.round(point.x / this.draw_ratio);
            let task_y = Math.round(point.y / this.draw_ratio);
            player_info.initPlayerTasks(await m_player.PlayerTaskDao.createRolePlayerTask(player_info.player_id, server_info.dao.galaxy_id, task_x, task_y, timestamp));

            player_info.initPlayerRenowns({});

            player_info.setIsNewbie(true);
            return player_info;
        } catch (e) {
            m_log.LogManage.error(e);
            return null;
        }
    }

    /**
     * 读取角色信息
     * @param player_id
     * @param open_id
     * @param extra
     * @return {Promise<{error: string}|{player_id}|*|{error: *}>}
     */
    async loadPlayerInfo(player_id, open_id, extra) {
        try {
            //如果保存玩家信息成功 则开始读取玩家信息
            let player_info = await m_player.PlayerInfoDao.getPlayerInfoDb(player_id);
            if (player_info === null || !player_info.player_id) {
                m_log.LogManage.error(['loaded player_id lost', player_id, open_id]);
                return null;
            }
            //加载extra
            player_info.initPlayerExtra(await m_player.PlayerExtraDao.getPlayerExtraDb(player_info.player_id));

            //加载ships
            player_info.initPlayerShips(await m_player.PlayerShipDao.getPlayerShipsDb(player_info.player_id));

            //加载item 给舰船的item建立索引
            player_info.initPlayerItems(await m_player.PlayerItemDao.getPlayerItemsDb(player_info.player_id));

            player_info.initPlayerBlueprints(await m_player.PlayerBlueprintDao.getPlayerBlueprintsDb(player_info.player_id));

            player_info.initPlayerProducts(await m_player.PlayerProductDao.getPlayerProductsDb(player_info.player_id));

            //加载技能
            player_info.initPlayerSkills(await m_player.PlayerSkillDao.getPlayerSkillsDb(player_info.player_id));

            //加载任务
            player_info.initPlayerTasks(await m_player.PlayerTaskDao.getPlayerTasksDb(player_info.player_id));

            //加载声望
            player_info.initPlayerRenowns(await m_player.PlayerRenownDao.getPlayerRenownsDb(player_info.player_id));
            return player_info;
        } catch (e) {
            m_log.LogManage.error(e);
            return null;
        }
    }


    /**
     * 获取服务器运行状态
     * @returns {*}
     */
    checkServerRun() {
        return m_server.ServerManage.getServerRunStatus();
    }

    /**
     * 检测服务器ID是否开启
     * @param server_id
     * @returns {boolean}
     */
    checkOpenServerId(server_id) {
        return m_server.ServerList.checkServerInfo(server_id);
    }

    /**
     * 获取IP
     * @param ip
     * @returns {string}
     */
    getExtraIp(ip) {
        if (!ip || (!!ip && !ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/))) {
            ip = "0.0.0.0";
        }
        return ip;
    }

    /**
     * 效验码
     * @param platform
     * @param open_id
     * @param random
     * @param ticket
     * @param extra
     * @param callback
     * @param thisObj
     */
    checkTicket(platform, open_id, random, ticket, extra, callback, thisObj) {
        if (platform) {
        } else {
            if (!platform || !open_id || !random || !ticket) {
                return callback && callback.call(thisObj, 'param lost')
            }
            let v_ticket = crypto.createHash('md5').update(platform + open_id + random + "planet_crack").digest('hex');
            //TODO
            if (ticket === v_ticket) {
                return callback && callback.call(thisObj, 'ticket fail');
            }
        }
        callback && callback.call(thisObj);
    }

    /**
     * 检测是否重复登录 检测通过返回true
     * @param player_uuid
     * @returns {boolean}
     */
    checkRepeatLogin(player_uuid) {
        let player_id = m_websocket.WsConnect.getWsInfoPlayerId(player_uuid);
        return !(player_id && player_uuid === m_player.PlayerList.getPlayerInfo(player_id).getPlayerUuid());
    }

    /**
     * 检测封号状态 正常登录返回true
     * @param lock_time
     * @returns {boolean}
     */
    checkLockTime(lock_time) {
        //TODO
        //增加1秒时间修正 如果踢人设置1.则只下线不会提示封号
        return lock_time === 0 || lock_time > common.func.getUnixTime();
    }

    /**
     * 判断用户是否正在登录 正在登录返回false
     * @param open_id
     * @returns {boolean}
     */
    checkLoginAction(open_id) {
        return !this.player_login_action_list[open_id];
    }

    /**
     * 添加正在登录标识
     * @param open_id
     */
    addLoginAction(open_id) {
        this.player_login_action_list[open_id] = true;
    }

    /**
     * 移除正在登录标识
     * @param open_id
     */
    delLoginAction(open_id) {
        delete this.player_login_action_list[open_id];
    }
}

PlayerAccount.m_instance = null;

module.exports = PlayerAccount;
