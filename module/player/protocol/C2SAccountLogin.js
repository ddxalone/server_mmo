const m_player = require("../index");
const common = require("../../common");
const BaseC2SProtocol = require("../../protocol/info/BaseC2SProtocol");
const S2CAccountLogin = require("../../player/protocol/S2CAccountLogin");

/**
 * @class {C2SAccountLogin}
 * @extends {BaseC2SProtocol}
 */
class C2SAccountLogin extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
        this.s2cAccountLogin = new S2CAccountLogin();
    }

    /**
     * 服务器信息验证
     */
    run() {
        //检测服务器运行状态
        if (m_player.PlayerAccount.checkServerRun() === false) {
            //发送登录成功协议
            this.s2cAccountLogin.wsSendFail(this.player_uuid, common.define.ACCOUNT_LOGIN_STATUS_NOT_RUN);
            return;
        }

        m_player.PlayerAccount.checkTicket(this.p_data.platform, this.p_data.open_id, this.p_data.random, this.p_data.ticket, this.p_data.extra, this.checkAccount, this);
    }

    /**
     * 帐号状态验证
     * @param err
     */
    async checkAccount(err) {
        if (err) {
            this.s2cAccountLogin.wsSendFail(this.player_uuid, common.define.ACCOUNT_LOGIN_STATUS_TICKET_ERROR);
            return;
        }

        if (m_player.PlayerAccount.checkRepeatLogin(this.player_uuid) === false) {
            this.s2cAccountLogin.wsSendFail(this.player_uuid, common.define.ACCOUNT_LOGIN_STATUS_REPEAT_LOGIN);
            return;
        }

        //新增一个标识 正在登录中 登录完成修改为false 解决可能因为异步导致的bug 重要重要重要!!!
        if (this.checkLoginAction() === false) {
            this.s2cAccountLogin.wsSendFail(this.player_uuid, common.define.ACCOUNT_LOGIN_STATUS_LOGIN_ACTION);
            return;
        }
        this.addLoginAction();

        let accountServerList = await m_player.PlayerAccount.getAccountServerList(this.p_data.open_id);
        if (!accountServerList) {
            this.s2cAccountLogin.wsSendFail(this.player_uuid, common.define.ACCOUNT_LOGIN_STATUS_LIST_DB_FAIL);
            this.delLoginAction();
            return;
        }

        this.s2cAccountLogin
            .setList(accountServerList.all_server_list)
            .setLogin(accountServerList.login_server_list)
            .wsSendSuccess(this.player_uuid);
        this.delLoginAction();
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

module.exports = C2SAccountLogin;
