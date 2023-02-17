const m_server = require("../../server");
const common = require("../../common");

/**
 * 价值处理服务层
 * @class {PriceService}
 */
class PriceService {
    constructor() {
        //基础矿物递增数量系数
        this.base_mineral_ratio = [2048, 1024, 512, 128, 16, 1];

        this.START_MINERAL_ID = common.static.START_MINERAL_ID;
    }

    static instance() {
        if (PriceService.m_instance == null) {
            PriceService.m_instance = new PriceService();
        }
        return PriceService.m_instance;
    }

    /**
     * 构建所需矿物
     * @param price
     * @param quality
     * @param ratio 建造是2倍
     */
    buildProductMineral(price, quality, ratio = 1) {
        // 71001	71	钛合金
        // 71002	71	斜长石
        // 71003	71	沉积岩
        // 71004	71	石英砂
        // 71005	71	氪金矿
        // 71006	71	富勒烯
        let mineral_list = {};
        for (let pos = 0; pos <= quality; pos++) {
            let mineral_id = this.START_MINERAL_ID + pos;
            mineral_list[mineral_id] = this.base_mineral_ratio[pos] / this.base_mineral_ratio[quality] * price * ratio;
        }

        return mineral_list;
    }
}

PriceService.m_instance = null;

module.exports = PriceService;

