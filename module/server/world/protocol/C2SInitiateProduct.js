const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const WarpInfo = require("../../map/info/WarpInfo");
const NearGridInfo = require("../../map/info/NearGridInfo");

class C2SInitiateProduct extends BaseC2SProtocol {
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

        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        //TODO 蓝图列表 不是item_id 暂时只支持 从蓝图列表进行制造
        let blueprint_id = this.p_data.blueprint_id;
        let count = this.p_data.count;

        let station_id = player_info.getStationId();
        //TODO 必须停靠在空间站
        //TODO 限制生产数量可以大点 例如100
        if (station_id === 0) {
            ff('必须停靠');
            return;
        }

        let player_blueprint = player_info.getPlayerBlueprint(blueprint_id);
        if (!player_blueprint) {
            dd('蓝图不存在')
            return;
        }

        if (count > player_blueprint.getCount()) {
            dd('蓝图数量不足')
            return;
        }

        // let base_blueprint_item_info = player_blueprint.getBaseItemInfo();

        let base_product_info = player_blueprint.getBaseProductInfo();
        //建造是2倍系数
        let mineral_list = m_server.PriceService.buildProductMineral(base_product_info.price, base_product_info.quality, count * 2);

        // let need_list =

        // let time = common.func.getUnixMTime();
        // for (let i = 0; i < 10000; i++) {
        //     player_info.checkNeedListUseItemType(station_id, mineral_list);
        // }
        // dd(common.func.getUnixMTime() - time);

        if (!player_info.checkNeedListUseItemType(station_id, mineral_list)) {
            ff('材料不足');
            return;
        }

        //扣除蓝图数量
        player_info.setPlayerBlueprintValue(player_blueprint, 'count', player_blueprint.getCount() - count);
        //移除材料
        player_info.removePlayerItemCountUserType(station_id, mineral_list);
        // if (player_blueprint.classify !== common.static.ITEM_CLASSIFY_INFO_BLUEPRINT) {
        //     return;
        // }

        //生成生产队列
        for (let i = 0; i < count; i++) {
            player_info.createPlayerProduct(player_blueprint.item_type, player_blueprint.getProductItemType(), station_id, 10);
        }

        //通知前端更改物品信息
        player_info.syncClientPlayerItem();
        player_info.syncClientPlayerBlueprint();
        player_info.syncClientPlayerProduct();
    }
}

module.exports = C2SInitiateProduct;
