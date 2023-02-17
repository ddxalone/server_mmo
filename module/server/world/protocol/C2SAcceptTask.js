const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const WarpInfo = require("../../map/info/WarpInfo");
const NearGridInfo = require("../../map/info/NearGridInfo");

class C2SAcceptTask extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
    }

    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }

    }
}

module.exports = C2SAcceptTask;
