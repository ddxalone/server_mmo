const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const WarpInfo = require("../../map/info/WarpInfo");
const NearGridInfo = require("../../map/info/NearGridInfo");

class C2SDeliverProduct extends BaseC2SProtocol {
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

        let product_id = this.p_data.product_id;
        let status = this.p_data.status;
        //1交付 2取消 3暂停 4恢复

        let player_product = player_info.getPlayerProduct(product_id);
        if (!player_product) {
            ff('制造线不存在');
            return;
        }

        let station_id = player_product.getStationId();

        let base_blueprint_item_info = player_product.getBaseBlueprintInfo();

        let base_product_item_info = player_product.getBaseProductInfo();

        let timestamp = common.func.getUnixTime();

        switch (status) {
            case 1:
                //交付
                //TODO 判断舰船数量是否超标
                if (!player_product.getIsFinish(timestamp)) {
                    ff('这个生产未完成 不能交付');
                    return;
                }
                //移除生产线
                player_info.removePlayerProduct(player_product);

                //创建舰船
                player_info.createPlayerShip(
                    base_product_item_info.ship_type,
                    base_product_item_info.classify,
                    station_id,
                    base_product_item_info.shield * this.draw_ratio,
                    base_product_item_info.armor * this.draw_ratio,
                    base_product_item_info.capacity * this.draw_ratio,
                    base_product_item_info.name
                );

                player_info.syncClientPlayerShip();
                player_info.syncClientPlayerProduct();
                break;

            case 2:
                //取消 取消返还一半材料 返还蓝图
                //TODO 未来判断是否超过物品叠加上限 或空间站物品数量上限
                if (player_product.getIsFinish(timestamp)) {
                    ff('这个生产已经完成了 不需要取消');
                    return;
                }
                let mineral_list = m_server.PriceService.buildProductMineral(base_product_item_info.price, base_product_item_info.quality);
                let player_station = player_info.safeGetPlayerStation(station_id);
                //移除生产线
                player_info.removePlayerProduct(player_product);

                //返还蓝图
                player_info.movePlayerBlueprintStackUseItemType(base_blueprint_item_info.item_type, 1);

                //返还矿物
                for (let item_type in mineral_list) {
                    let to_player_item = player_station.getStationItemFromItemTypeExceptItemId(item_type);

                    player_info.movePlayerItemStackUseItemType(
                        item_type,
                        common.static.ITEM_CLASSIFY_INFO_MINERAL,
                        mineral_list[item_type],
                        to_player_item,
                        0,
                        station_id,
                        common.static.SHIP_ITEM_STATUS_NULL
                    );
                }


                player_info.syncClientPlayerProduct();
                player_info.syncClientPlayerItem();
                break;
            case 3:
                //暂停
                if (player_product.getStatus() === common.static.PRODUCT_STATUS_PAUSE) {
                    ff('已暂停生产,无法暂停');
                    return;
                }
                //TODO 已完成的禁止暂停
                if (player_product.getIsFinish(timestamp)) {
                    ff('这个生产已经完成了 不需要暂停');
                    return;
                }
                //计算用过的时间
                let use_total = timestamp - player_product.getDaoValue('now_time');
                //剩余制造时间 = 剩余制造时间-用过的时间
                player_product.setDaoValue('less_total', player_product.getDaoValue('less_total') - use_total)

                player_info.syncClientPlayerProduct();
                break;
            case 4:
                //恢复
                if (player_product.getStatus() === common.static.PRODUCT_STATUS_NORMAL) {
                    ff('正常订单 无法恢复');
                    return;
                }
                //开始记录本次制造时间
                player_product.setDaoValue('now_time', timestamp);
                //修正结束时间
                player_product.setDaoValue('end_time', timestamp + player_product.getDaoValue('less_total'));

                player_product.setDaoValue('status', common.static.PRODUCT_STATUS_NORMAL);

                player_info.syncClientPlayerProduct();
                break;
        }
    }
}

module.exports = C2SDeliverProduct;
