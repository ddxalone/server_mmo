const m_player = require("../../../player");
const m_server = require("../../../server");
const common = require("../../../common");
const m_websocket = require("../../../websocket");
const S2CChangeItem = require("../../../player/protocol/S2CChangeItem");
const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");

class C2SMoveItem extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);

    }

    init() {
        this.DEFAULT_ITEM_COUNT = common.static.DEFAULT_ITEM_COUNT;
    }

    /**
     * 移动装备
     */
    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }

        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        let item_id = this.p_data.item_id;
        if (item_id < 0) {
            return;
        }
        let item_ids = this.p_data.item_ids;


        //还是不要生成多余的变量了 没什么意义
        let count = this.p_data.count;
        let type = this.p_data.type;
        let id = this.p_data.id;
        let target_id = this.p_data.target_id;

        if (item_id === target_id) {
            ff('这个毫无意义');
            return;
        }
        //ID不能存在批量ID里
        if (item_ids.indexOf(item_id) >= 0) {
            ff('ID不能存在批量ID里');
            return;
        }

        let slot_id = 0;
        let ship_id = 0;
        let station_id = 0;

        /**
         * @type {Array<PlayerItem>}
         */
        let player_items = [];

        let main_player_item = player_info.getPlayerItem(item_id);
        if (!main_player_item) {
            ff('装备不存在');
            return;
        }
        if (count < 1) {
            return;
        }
        if (count > main_player_item.getCount()) {
            ff('数量错误')
            return;
        }

        player_items.push(main_player_item);

        //是否为分离状态 简单的分离 不与其他物品相叠加
        //只有不传类型才认定为拆分
        let is_spite_item_status = false;
        /**
         * 批量操作 同时只能接收同一舰船下或同一空间站下的装备
         */
        let item_from_hash = main_player_item.getItemFromTypeHash();
        if (!type) {
            type = item_from_hash.type;

            if (count < main_player_item.getCount()) {
                is_spite_item_status = true;
            }
        }

        //批量操作是否有装备在槽位上
        let store_from_slot_status = main_player_item.getCurrentSlotStatus() ? common.define.STORE_FROM_SLOT_STATUS_MASTER : common.define.STORE_FROM_SLOT_STATUS_NULL;

        if (item_ids.length) {
            //TODO 未来要不要限制一次移动的数量 物品太多怕卡

            for (let item_id of item_ids) {
                let player_item = player_info.getPlayerItem(item_id);
                if (!player_item) {
                    return;
                }
                /**
                 * @type {{type: *, hash_id: *}}
                 */
                let sub_item_from_hash = player_item.getItemFromTypeHash();

                if (item_from_hash.type !== sub_item_from_hash.type && item_from_hash.hash_id !== sub_item_from_hash.hash_id) {
                    ff('批量装备不在一个组里');
                    return;
                }

                //批量装备 不允许从当前装备的槽位往当前舰船上槽位上放置
                if (store_from_slot_status < common.define.STORE_FROM_SLOT_STATUS_BATCH && player_item.getCurrentSlotStatus()) {
                    ff('有多个装备是从舰船上移动的');
                    store_from_slot_status = common.define.STORE_FROM_SLOT_STATUS_BATCH;
                }

                player_items.push(player_item);
            }
        }
        let current_player_ship = player_info.getCurrentPlayerShip();

        ff('类型 type[' + type + '] id[' + id + '] count[' + count + ']');
        // fff('yellow', '物品 slot[' + player_item.getSlot() + '] ship[' + player_item.getShipId() + '] station[' + player_item.getStationId() + '] status[' + player_item.getStatus() + ']');

        //定义目标的玩家物品
        /**
         * @type {PlayerItem}
         */
        let to_player_item = null;

        let item_operation_status = 0;
        //更新后的物品状态
        let item_status = common.static.SHIP_ITEM_STATUS_NULL;

        switch (type) {
            case common.static.STORE_TYPE_TO_SLOT:
                //物品当前所处类型
                item_operation_status = main_player_item.getItemOperationStatus();
                if (item_operation_status === common.static.ITEM_OPERATION_STATUS_ASSEMBLE) {
                    //可以不支持批量从舰船槽位到槽位 应该不支持 逻辑能实现 但是太耗费性能了 每个都要检查CD 等等 想想怎么限制
                    if (store_from_slot_status === common.define.STORE_FROM_SLOT_STATUS_BATCH) {
                        ff('多个装备中有一个在舰船上 无法批量装配');
                        return;
                    }
                    if (target_id) {
                        ff('不应该有target_id');
                        return;
                    }

                    //槽位为空的状态增加一个缓存
                    let first_null_status = {};
                    first_null_status[common.static.ITEM_MAIN_CLASSIFY_WEAPON] = true;
                    first_null_status[common.static.ITEM_MAIN_CLASSIFY_ACTIVE] = true;
                    first_null_status[common.static.ITEM_MAIN_CLASSIFY_PASSIVE] = true;

                    ship_id = player_info.getShipId();

                    //装备到插槽数量必定为1
                    count = this.DEFAULT_ITEM_COUNT;

                    for (let player_item of player_items) {
                        slot_id = id;
                        //多个物品只有第一个slot_id有效
                        id = 0;

                        let item_main_classify = player_item.getMainClassify();
                        if (slot_id) {
                            //只有指向的位置第一个slot_id有效 如果无效其他的都不处理
                            let main_classify = common.method.getMainClassifyFromSlot(slot_id);
                            if (main_classify !== item_main_classify) {
                                ff('槽位类型不一致 无法移动');
                                return;
                            }

                            if (slot_id === player_item.getSlot()) {
                                ff('槽位相同,不需要移动');
                                return;
                            }

                            if (current_player_ship.checkPosLegal(slot_id) === false) {
                                ff('槽位不合法');
                                return;
                            }

                            //如果是当前舰船上槽位的装备
                            if (player_info.getShipId() === player_item.getShipId() && player_item.getSlot()) {
                                let ship_item = unit_ship_player.getShipItem(player_item.getSlot());
                                if (player_item.getStatus() === common.static.SHIP_ITEM_STATUS_ACTIVE || ship_item.checkCoolDownStatus() === false) {
                                    ff('激活或者CD中1 跳过');
                                    continue;
                                }
                            }

                            ff('目标的slot_id', slot_id);
                            let scene_ship_item = current_player_ship.getShipItemFromSlot(slot_id);
                            if (scene_ship_item) {
                                ff('槽位有装备');
                                //如果装备在槽位上 互相换位置 保持原状态
                                //处理替换装备
                                let map_ship_item = unit_ship_player.getShipItem(slot_id);
                                if (scene_ship_item.getDaoValue('status') === common.static.SHIP_ITEM_STATUS_ACTIVE || map_ship_item.checkCoolDownStatus() === false) {
                                    ff('激活或者CD中1');
                                    continue;
                                }

                                ff('替换装备1 item_id[' + scene_ship_item.item_id + '] slot_id[' + player_item.getSlot() + '] ship_id[' + ship_id + '] station_id[' + 0 + '] status[' + scene_ship_item.getDaoValue('status') + ']');
                                player_info.movePlayerItem(scene_ship_item, count, player_item.getSlot(), ship_id, station_id, scene_ship_item.getDaoValue('status'));

                                //装备继承状态item_status
                                player_info.movePlayerItem(player_item, count, slot_id, ship_id, station_id, player_item.getDaoValue('status'));
                            } else {
                                ff('槽位是空的');
                                //判断在线还是离线
                                item_status = unit_ship_player.checkPowerAddRequire(player_item.getBaseItemRequire()) ? common.static.SHIP_ITEM_STATUS_ONLINE : common.static.SHIP_ITEM_STATUS_OFFLINE;

                                player_info.movePlayerItemStack(player_item, count, null, slot_id, ship_id, station_id, item_status);
                            }
                        } else {
                            if (first_null_status[item_main_classify] === false) {
                                ff('没有空槽位了 缓存');
                                continue;
                            }
                            slot_id = unit_ship_player.getFirstNullSlot(item_main_classify);
                            if (!slot_id) {
                                ff('没有空槽位了');
                                first_null_status[item_main_classify] = false;
                                continue;
                            }

                            //判断在线还是离线
                            item_status = unit_ship_player.checkPowerAddRequire(player_item.getBaseItemRequire()) ? common.static.SHIP_ITEM_STATUS_ONLINE : common.static.SHIP_ITEM_STATUS_OFFLINE;

                            player_info.movePlayerItemStack(player_item, count, null, slot_id, ship_id, station_id, item_status);
                        }
                    }
                } else {
                    ff('当前装备不可装配');
                    return;
                }
                break;
            case common.static.STORE_TYPE_TO_SHIP:
                ship_id = id ? id : player_info.getShipId();
                //目标舰船类
                let player_ship = player_info.getPlayerShip(ship_id);
                if (!player_ship) {
                    ff('舰船不存在');
                    return;
                }
                item_operation_status = main_player_item.getItemOperationStatus(player_ship.getStationId());
                if (item_operation_status <= common.static.ITEM_OPERATION_STATUS_TRANSFER) {
                    let main_player_item_status = true;
                    for (let player_item of player_items) {
                        //主物品使用传递的数量
                        if (main_player_item_status) {
                            main_player_item_status = false;

                            if (target_id) {
                                //目标存在 则执行目标堆叠
                                to_player_item = player_ship.getShipItem(target_id);
                            } else if (is_spite_item_status === false) {
                                //当不传type 且数量小于最大数量 认为是分离 否则认定为整理功能
                                to_player_item = player_ship.getShipItemFromItemTypeExceptItemId(player_item.item_type, player_item.item_id);
                            }
                        } else {
                            //其他物品使用全部数量
                            count = player_item.getCount();
                            //并执行堆叠
                            to_player_item = player_ship.getShipItemFromItemTypeExceptItemId(player_item.item_type, player_item.item_id);
                        }

                        player_info.movePlayerItemStack(player_item, count, to_player_item, slot_id, ship_id, station_id, item_status);

                        //只有第一次 target_id有效
                        // target_id = 0;
                    }
                } else if (item_operation_status === common.static.ITEM_OPERATION_STATUS_LOGISTICS) {
                    ff('装备不可转移到舰船');
                    return;
                } else {
                    ff('无效的 我或者目标有一个在太空');
                    return;
                }
                break;
            case common.static.STORE_TYPE_TO_STATION:
                ff('移动到仓库')
                station_id = id ? id : player_info.getStationId();
                if (!station_id) {
                    ff('玩家没有在空间站');
                    return;
                }
                let player_station = player_info.getPlayerStation(station_id);
                // let station_info = m_server.ServerWorldStation.getIndexStationInfo(station_id);
                if (!player_station) {
                    ff('不存在的空间站');
                    return;
                }
                item_operation_status = main_player_item.getItemOperationStatus(station_id);
                if (item_operation_status <= common.static.ITEM_OPERATION_STATUS_TRANSFER) {
                    let main_player_item_status = true;
                    for (let player_item of player_items) {
                        //主物品使用传递的数量
                        if (main_player_item_status) {
                            main_player_item_status = false;

                            if (target_id) {
                                to_player_item = player_station.getStationItem(target_id);
                            } else if (is_spite_item_status === false) {
                                to_player_item = player_station.getStationItemFromItemTypeExceptItemId(player_item.item_type, player_item.item_id);
                            }
                        } else {
                            //其他物品使用全部数量
                            count = player_item.getCount();
                            //并执行堆叠
                            to_player_item = player_station.getStationItemFromItemTypeExceptItemId(player_item.item_type, player_item.item_id);
                        }

                        player_info.movePlayerItemStack(player_item, count, to_player_item, slot_id, ship_id, station_id, item_status);

                        //只有第一次 target_id有效
                        target_id = 0;
                    }
                } else if (item_operation_status === common.static.ITEM_OPERATION_STATUS_LOGISTICS) {
                    ff('装备不可转移到空间站,纳入物流系统');
                    return;
                } else {
                    ff('无效的 我或者目标有一个在太空');
                    return;
                }
                break;
            default:
                return;
        }

        unit_ship_player.syncUnitShipPlayer();

        player_info.syncClientPlayerItem();

        //移动到槽位或者有任意装备从槽位移除
        if (type === common.static.STORE_TYPE_TO_SLOT || store_from_slot_status) {
            unit_ship_player.reloadInfo();

            unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);
        }
    }
}

module.exports = C2SMoveItem;
