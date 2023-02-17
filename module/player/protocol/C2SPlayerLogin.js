const m_player = require("../index");
const common = require("../../common");
const m_websocket = require("../../websocket");
const BaseC2SProtocol = require("../../protocol/info/BaseC2SProtocol");
const S2CPlayerLogin = require("../../player/protocol/S2CPlayerLogin");
const m_server = require("../../server");

class C2SPlayerLogin extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
        this.s2cPlayerLogin = new S2CPlayerLogin();
    }

    /**
     * 服务器状态监测
     */
    run() {
        //检测服务器运行状态
        if (m_player.PlayerAccount.checkServerRun() === false) {
            //发送登录成功协议
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_NOT_RUN);
            return;
        }

        //检测服务器ID是否开启
        if (m_player.PlayerAccount.checkOpenServerId(this.p_data.server_id) === false) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_NOT_OPEN);
            return;
        }

        this.p_data.extra.ip = m_player.PlayerAccount.getExtraIp(this.p_data.extra.ip);

        m_player.PlayerAccount.checkTicket(this.p_data.platform, this.p_data.open_id, this.p_data.random, this.p_data.ticket, this.p_data.extra, this.checkAccount, this);
    }

    /**
     * 用户状态检测
     * @param err
     */
    async checkAccount(err) {
        if (err) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_TICKET_ERROR);
            return;
        }

        if (m_player.PlayerAccount.checkRepeatLogin(this.player_uuid) === false) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_REPEAT_LOGIN);
            return;
        }

        //新增一个标识 正在登录中 登录完成修改为false 解决可能因为异步导致的bug 重要重要重要!!!
        if (this.checkLoginAction() === false) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_LOGIN_ACTION);
            return;
        }
        this.addLoginAction();

        //存在
        let account_info = await m_player.PlayerAccount.getAccountInfo(this.p_data.open_id, this.p_data.server_id);
        if (account_info === null) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_ACCOUNT_ERROR);
            this.delLoginAction();
            return;
        }
        if (account_info.player_id) {
            //console.log("玩家存在");
            if (m_player.PlayerAccount.checkLockTime(account_info.dao.lock_time) === false) {
                this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_ACCOUNT_LOCK);
                this.delLoginAction();
                return;
            }
            let player_id = account_info.player_id;
            if (m_player.PlayerList.checkPlayerInfoExist(player_id)) {
                //console.log("玩家在线");
                //踢出旧玩家 玩家登录
                m_player.PlayerAction.kickPlayer(player_id);
                this.onlinePlayerInfo(player_id);
            } else {
                // console.log("玩家不在线");
                //读取数据库 玩家登陆
                let player_info = await m_player.PlayerAccount.loadPlayerInfo(player_id, this.p_data.open_id, this.p_data.extra);
                this.playerOnline(player_info);
            }
        } else {
            //console.log("玩家不存在");
            //先创建基础表获得player_id
            //为了保证两个表数据统一 先计算时间戳传递到写入方法中
            let timestamp = common.func.getUnixTime();
            let nickname = '';

            let player_info = await m_player.PlayerAccount.createPlayerInfo(this.p_data.open_id, this.p_data.server_id, nickname, this.p_data.extra.ip, timestamp);
            this.playerOnline(player_info);
        }
    }

    /**
     * @param {PlayerInfo} player_info
     */
    playerOnline(player_info) {
        if (player_info === null) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_DB_ERROR);
            this.delLoginAction();
            return;
        }
        //前面已经拦截了 这里不需要了
        // if (!player_info.player_id) {
        //     this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_DB_FAIL);
        //     this.delLoginAction();
        //     return;
        // }
        m_player.PlayerList.addPlayerToList(player_info);

        this.onlinePlayerInfo(player_info.player_id);
    }

    /**
     * 执行玩家上线操作
     */
    onlinePlayerInfo(player_id) {
        //设置玩家状态
        let player_info = m_player.PlayerList.getPlayerInfo(player_id);

        if (!player_info) {
            this.s2cPlayerLogin.wsSendFail(this.player_uuid, common.define.PLAYER_LOGIN_STATUS_PLAYER_ERROR);
            this.delLoginAction();
            return;
        }
        //建立对应关系
        m_websocket.WsConnect.setWsInfoPlayerId(this.player_uuid, player_id);
        player_info.setPlayerUuid(this.player_uuid);

        player_info.setIp(this.p_data.extra.ip);

        //执行玩家登录操作
        m_player.PlayerAction.loginPlayer(player_info);

        //完全登录成功后移除正在登陆的标记
        this.s2cPlayerLogin.wsSendSuccess(this.player_uuid);
        this.delLoginAction();
        //console.log("玩家成功登录");

    }

    checkLoginAction() {
        return m_player.PlayerAccount.checkLoginAction(this.p_data.open_id);
    }

    addLoginAction() {
        m_player.PlayerAccount.addLoginAction(this.p_data.open_id);
    }

    delLoginAction() {
        m_player.PlayerAccount.delLoginAction(this.p_data.open_id);
    }
}

module.exports = C2SPlayerLogin;
