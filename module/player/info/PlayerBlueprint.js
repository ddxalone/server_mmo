const m_player = require("../../player");
const common = require("../../common");
const m_server = require("../../server");
const BaseDaoInfo = require("../../server/main/info/BaseDaoInfo");

/**
 * @callback callbackPlayerBlueprint
 * @param {PlayerBlueprint} player_blueprint
 */
/**
 * @class {PlayerBlueprint}
 */
class PlayerBlueprint extends BaseDaoInfo {
    constructor(dao) {
        super(dao);
        this.blueprint_id = dao.blueprint_id;
        this.player_id = dao.player_id;
        this.type = dao.type;
        this.item_type = dao.item_type;

        this.base_blueprint_info = null;

        this.base_product_info = null;
    }

    getCount() {
        return this.dao.count;
    }

    /**
     * 获取基础物品信息
     * @return {*}
     */
    getBaseBlueprintInfo() {
        this.base_blueprint_info || (this.base_blueprint_info = m_server.ServerBaseItem.getItemDataValue(common.static.ITEM_MAIN_CLASSIFY_INFO, this.item_type).getDao());
        return this.base_blueprint_info;
    }

    /**
     * 获取产物的基础信息 目前只有舰船 未来会有建筑
     * @returns {null}
     */
    getBaseProductInfo() {
        this.base_product_info || (this.base_product_info = m_server.ServerBaseShip.getShipPlayerDataValue(this.getProductItemType()).getDao());
        return this.base_product_info;
    }

    /**
     * 获取产物类型
     * @returns {*}
     */
    getProductItemType() {
        return this.getBaseBlueprintInfo().extra.type;
    }

    getClientPlayerBlueprint() {
        return {
            blueprint_id: this.blueprint_id,
            type: this.type,
            item_type: this.item_type,
            count: this.dao.count,
        };
    }
}

module.exports = PlayerBlueprint;
