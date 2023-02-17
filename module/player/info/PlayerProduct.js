const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerProduct
 * @param {PlayerProduct} player_product
 */
/**
 * @class {PlayerProduct}
 */
class PlayerProduct extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.product_id = dao.product_id;
        this.player_id = dao.player_id;
        this.blueprint_item_type = dao.blueprint_item_type;
        this.product_item_type = dao.product_item_type;

        this.base_blueprint_info = null;

        this.base_product_info = null;
    }

    getStatus() {
        return this.dao.status;
    }

    getStationId() {
        return this.dao.station_id;
    }

    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseBlueprintInfo() {
        this.base_blueprint_info || (this.base_blueprint_info = m_server.ServerBaseItem.getItemDataValue(common.static.ITEM_MAIN_CLASSIFY_INFO, this.blueprint_item_type).getDao());
        return this.base_blueprint_info;
    }

    /**
     * @returns {null}
     */
    getBaseProductInfo() {
        this.base_product_info || (this.base_product_info = m_server.ServerBaseShip.getShipPlayerDataValue(this.product_item_type).getDao());
        return this.base_product_info;
    }

    /**
     * 获取是否已经完成
     * @param timestamp
     * @returns {boolean}
     */
    getIsFinish(timestamp) {
        //当前时间>=结束时间
        return this.getDaoValue('end_time') <= timestamp;
    }

    getClientPlayerProduct() {
        return {
            product_id: this.product_id,
            station_id: this.dao.station_id,
            blueprint_item_type: this.dao.blueprint_item_type,
            product_item_type: this.dao.product_item_type,
            begin_time: this.dao.begin_time,
            end_time: this.dao.end_time,
            less_total: this.dao.less_total,
            now_time: this.dao.now_time,
            status: this.dao.status,
        };
    }
}

module.exports = PlayerProduct;
