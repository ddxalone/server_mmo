const common = require("../../../common");

/**
 * @class {BaseInfo}
 */
class BaseInfo {
    constructor() {
        this.base_map_frame = common.setting.base_map_frame;
        this.base_run_frame = common.setting.base_run_frame;
        this.base_server_frame = common.setting.base_server_frame;
        this.draw_ratio = common.setting.draw_ratio;
    }
}

module.exports = BaseInfo;

