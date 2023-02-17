const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");

const fs = require("fs");
const path = require("path");

class C2SSendMapInfo extends BaseC2SProtocol {
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

        fs.writeFileSync(path.resolve(__dirname, '../../../../logs/' + this.p_data.name + '.json'), JSON.stringify(JSON.parse(this.p_data.info), null, "  "));
    }
}

module.exports = C2SSendMapInfo;
