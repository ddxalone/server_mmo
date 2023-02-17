const BaseDaoInfo = require("../../main/info/BaseDaoInfo");
/**
 * @class {ServerInfo}
 * @extends {BaseDaoInfo}
 */
class ServerInfo extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.server_id = dao.server_id;
        this.server_name = dao.server_name;
    }

    getClientServerInfo() {
        return {
            id: this.server_id,
            name: this.server_name,
        };
    }
}

module.exports = ServerInfo;
