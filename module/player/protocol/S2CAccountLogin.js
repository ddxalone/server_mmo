const common = require("../../common");
const m_protocol = require("../../protocol");
const BaseS2CProtocol = require("../../protocol/info/BaseS2CProtocol");

/**
 * @class {S2CAccountLogin}
 * @extends {BaseS2CProtocol}
 */
class S2CAccountLogin extends BaseS2CProtocol {
    constructor() {
        super(common.protocol.PROTOCOL_S2C_ACCOUNT_LOGIN);
    }

    /**
     *
     * @param all_server_list
     * @returns {S2CAccountLogin}
     */
    setList(all_server_list) {
        return this.setParam('list', all_server_list);
    }

    /**
     * @param login_server_list
     * @returns {S2CAccountLogin}
     */
    setLogin(login_server_list) {
        return this.setParam('login', login_server_list);
    }
}

module.exports = S2CAccountLogin;
