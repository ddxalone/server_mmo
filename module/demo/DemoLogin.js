const m_demo = require(".");
const m_server = require("../server");
const crypto = require("crypto");
const common = require("../common");

class DemoLogin {
    constructor(open_id) {
        this.open_id = open_id;
    }

    /**
     * @returns {DemoLogin}
     */
    wsCreate() {
        this.ws = new m_demo.Websocket();
        this.ws.create(() => {
            this.accountLogin();
            //接收消息
            this.ws.message((data) => {
                switch (data.protocol) {
                    case common.protocol.PROTOCOL_S2C_ACCOUNT_LOGIN:
                        // console.log('<<==接收到帐号登录请求', JSON.stringify(data));
                        this.playerLogin();
                        break;
                    case common.protocol.PROTOCOL_S2C_PLAYER_LOGIN:
                        // console.log('<<==接收到角色登录请求', JSON.stringify(data));
                        this.getGridInfo();

                        //协议改了这个报错了
                        // this.getScanDead();
                        break;
                    case common.protocol.PROTOCOL_S2C_WORLD_SCAN:
                        // this.moveItem();
                        break;
                    default :
                    // console.log('<<==未处理协议', JSON.stringify(data));
                }
                if (data.protocol === common.protocol.PROTOCOL_S2C_WORLD_SCAN) {
                }
            }, this);
        }, this);
        return this;
    }

    runFrame(server_frame) {
        if (server_frame < 50) {
            ff('server_frame', server_frame)
        }
        switch (server_frame) {
            case 12:
                this.scanExact(8, 6542);
                // this.C2S_MOVE_ITEM = new common.protocol.list[common.protocol.PROTOCOL_C2S_MOVE_ITEM]();
                // this.moveItems();
                // this.warpDead(1001);
                // this.warpTask(1002);
                // this.warpStation(1001);
                break;

            case 28:
                this.scanExact(8, 11568);

                // this.shipProduct(1000, 1);

                this.deliverProduct(1001, 3);
                // this.shipProduct(1002, 1);
                // this.C2S_MOVE_ITEM = new common.protocol.list[common.protocol.PROTOCOL_C2S_MOVE_ITEM]();
                // this.moveItems();
                // this.warpDead(1001);
                // this.warpTask(1002);
                // this.warpStation(1001);
                break;

        }
    }

    deliverProduct(product_id, status) {
        this.DELIVER_PRODUCT = new common.protocol.list[common.protocol.PROTOCOL_C2S_DELIVER_PRODUCT]();
        this.DELIVER_PRODUCT.product_id = product_id;
        this.DELIVER_PRODUCT.status = status;
        this.ws.send(this.DELIVER_PRODUCT);
    }

    shipProduct(blueprint_id, count) {
        this.INITIATE_PRODUCT = new common.protocol.list[common.protocol.PROTOCOL_C2S_INITIATE_PRODUCT]();
        this.INITIATE_PRODUCT.blueprint_id = blueprint_id;
        this.INITIATE_PRODUCT.count = count;
        this.ws.send(this.INITIATE_PRODUCT);
    }

    scanExact(type, id) {
        this.WORLD_SCAN_EXACT = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_SCAN_EXACT]();
        this.WORLD_SCAN_EXACT.type = type;
        this.WORLD_SCAN_EXACT.id = id;
        this.ws.send(this.WORLD_SCAN_EXACT);
    }

    warpDead(dead_id) {
        this.C2S_WORLD_WARP = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_WARP]();
        this.C2S_WORLD_WARP.type = common.static.WORLD_UNIT_TYPE_DEAD;
        this.C2S_WORLD_WARP.id = dead_id;
        this.ws.send(this.C2S_WORLD_WARP);
    }

    warpTask(task_id) {
        this.C2S_WORLD_WARP = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_WARP]();
        this.C2S_WORLD_WARP.type = common.static.WORLD_UNIT_TYPE_TASK;
        this.C2S_WORLD_WARP.id = task_id;
        this.ws.send(this.C2S_WORLD_WARP);
    }

    warpStation(station_id) {
        this.C2S_WORLD_WARP = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_WARP]();
        this.C2S_WORLD_WARP.type = common.static.WORLD_UNIT_TYPE_STATION;
        this.C2S_WORLD_WARP.id = station_id;
        this.ws.send(this.C2S_WORLD_WARP);
    }

    moveToSlot(slot_id, item_id = 11556) {
        this.C2S_MOVE_ITEM.item_id = item_id;
        this.C2S_MOVE_ITEM.count = 1;
        this.C2S_MOVE_ITEM.type = 1;
        this.C2S_MOVE_ITEM.id = slot_id;
        this.ws.send(this.C2S_MOVE_ITEM);
    }

    moveToShip(ship_id, item_id = 11556) {
        this.C2S_MOVE_ITEM.item_id = item_id;
        this.C2S_MOVE_ITEM.count = 1;
        this.C2S_MOVE_ITEM.type = 2;
        this.C2S_MOVE_ITEM.id = ship_id;
        this.ws.send(this.C2S_MOVE_ITEM);
    }

    moveToStation(station_id, item_id = 11556) {
        this.C2S_MOVE_ITEM.item_id = item_id;
        this.C2S_MOVE_ITEM.count = 1;
        this.C2S_MOVE_ITEM.type = 3;
        this.C2S_MOVE_ITEM.id = station_id;
        this.ws.send(this.C2S_MOVE_ITEM);
    }

    playerGoToStation(station_id) {

        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(1000);
        let world_station_info = m_server.ServerWorldStation.getIndexStationInfo(station_id);
        let world_galaxy_info = m_server.ServerWorldBlock.getIndexGalaxyInfo(world_station_info.galaxy_id);
        let x = world_galaxy_info.x + world_station_info.x;
        let y = world_galaxy_info.y + world_station_info.y;

        unit_ship_player.setX(x);
        unit_ship_player.setY(y);

        m_server.ServerMapManage.unitMoveGrid(unit_ship_player);

        unit_ship_player.syncUnitShipPlayer();
        unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);

    }

    // joinStation(station_id) {
    //     let C2S_MAP_CONTROL = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_CONTROL]();
    //     C2S_MAP_CONTROL.control = 1;
    //     C2S_MAP_CONTROL.type = 3;
    //     C2S_MAP_CONTROL.id = station_id;
    //     this.ws.send(C2S_MAP_CONTROL);
    //
    //     this.playerGoToStation(station_id);
    // }

    leaveStation() {
        let C2S_MAP_CONTROL = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_CONTROL]();
        C2S_MAP_CONTROL.control = 2;
        C2S_MAP_CONTROL.type = 3;
        C2S_MAP_CONTROL.id = 0;
        this.ws.send(C2S_MAP_CONTROL);
    }

    useItem(slot, type) {
        let C2S_MAP_ITEM = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_ITEM]();
        C2S_MAP_ITEM.slot = slot;
        C2S_MAP_ITEM.type = type;
        this.ws.send(C2S_MAP_ITEM);
    }

    moveItems() {
        //当前10号已经有一个装备了
        //9461物品在货柜里
        //共有3种to 4种from 2种空间站状态(在和不在)  共24种情况需要测试
        //to_ship 还要分为当前和非当前 to_station同理(to_station在太空没有当前)
        //from不太考虑 只有当前舰船 才会返回slot和ship  不是当前slot和ship 且我在站里 跟我一个站的 认定为空间站 这句读不懂了
        //有个问题from 是 空间站或者远程的 有可能是同站其他船上的装备 或者 槽位上的装备

        // this.moveToSlot(11);
        // this.moveToShip(1104);
        // this.moveToShip(11);
        // return;

        //进去空间站
        // this.joinStation(1000);

        //放下东西
        // this.moveToStation(0);

        //离开空间站
        // this.leaveStation();

        this.moveToSlot(10, 11556);//武器1
        this.moveToSlot(11, 11557);//武器2
        this.moveToSlot(20, 12084);//修盾
        // this.moveToSlot(20, 12168);//修甲
        // this.moveToSlot(10, 11570);//减需装备
        // this.moveToSlot(20, 12140);//旗舰级装备
        this.moveToSlot(21, 12252);//1mn推子

        // this.useItem(10,2);
        // this.useItem(11,2);
        this.useItem(20, 2);
        this.useItem(21, 2);
        return;

        //太空 槽位->槽位
        this.moveToSlot(0);
        this.moveToSlot(1);
        this.moveToSlot(19);
        this.moveToSlot(20);
        this.moveToSlot(40);
        this.moveToSlot(12);
        this.moveToSlot(12);
        this.moveToSlot(10);

        //太空 槽位->舰船
        this.moveToSlot(11);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);


        //太空 槽位->空间站
        this.moveToSlot(11);
        this.moveToStation(0);
        this.moveToStation(999);
        this.moveToStation(100000);
        this.moveToStation(1000);

        //太空 舰船->槽位
        this.moveToShip(0);
        this.moveToSlot(11);
        this.moveToShip(0);
        //注意 这一步会把另外一件装备 拿到背包里
        this.moveToSlot(12);


        //把这个装备移动回来
        this.C2S_MOVE_ITEM.item_id = 9460;
        this.C2S_MOVE_ITEM.count = 1;
        this.C2S_MOVE_ITEM.type = 1;
        this.C2S_MOVE_ITEM.id = 12;
        this.ws.send(this.C2S_MOVE_ITEM);

        //太空 舰船->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //太空 舰船->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(0);
        this.moveToStation(1000);


        //进去空间站
        this.joinStation(1000);

        //放下东西
        this.moveToStation(0);

        //离开空间站
        this.leaveStation();

        //太空 空间站->槽位
        this.moveToShip(0);
        this.moveToSlot(11);
        this.moveToShip(0);
        this.moveToSlot(12);

        //太空 空间站->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //太空 空间站->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(0);
        this.moveToStation(1000);


        //太空 远程->槽位
        this.moveToSlot(0);
        this.moveToSlot(1);
        this.moveToSlot(19);
        this.moveToSlot(20);
        this.moveToSlot(40);
        this.moveToSlot(12);
        this.moveToSlot(12);
        this.moveToSlot(10);
        //太空 远程->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //太空 远程->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(1001);
        this.moveToStation(0);
        this.moveToStation(1000);


        this.moveToShip(1104);


        //太空 远程->槽位
        this.moveToSlot(0);
        this.moveToSlot(1);
        this.moveToSlot(19);
        this.moveToSlot(20);
        this.moveToSlot(40);
        this.moveToSlot(12);
        this.moveToSlot(12);
        this.moveToSlot(10);
        //太空 远程->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //太空 远程->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(1000);
        this.moveToShip(1104);
        this.moveToStation(0);
        this.moveToStation(1000);


        this.joinStation(1000);

        //空间站 槽位->槽位
        this.moveToSlot(0);
        this.moveToSlot(1);
        this.moveToSlot(19);
        this.moveToSlot(20);
        this.moveToSlot(40);
        this.moveToSlot(12);
        this.moveToSlot(12);
        this.moveToSlot(10);

        //空间站 槽位->舰船
        this.moveToSlot(11);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToSlot(11);
        this.moveToShip(1001);


        //空间站 槽位->空间站
        this.moveToSlot(11);
        this.moveToStation(0);
        this.moveToStation(999);
        this.moveToStation(100000);
        this.moveToStation(1000);
        this.moveToSlot(11);
        this.moveToStation(1001);


        //空间站 舰船->槽位
        this.moveToShip(0);
        this.moveToSlot(11);
        this.moveToShip(0);
        this.moveToSlot(12);

        //空间站 舰船->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //空间站 舰船->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(0);
        this.moveToStation(1000);

        //空间站 空间站->槽位
        this.moveToShip(0);
        this.moveToSlot(11);
        this.moveToShip(0);
        this.moveToSlot(12);

        //空间站 空间站->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //空间站 空间站->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(0);
        this.moveToStation(1000);


        //把这个物品放到其他舰船上

        //空间站 槽位->槽位
        this.moveToShip(1104);
        this.moveToSlot(12);

        //空间站 空间站->槽位
        this.moveToShip(1104);
        this.moveToSlot(11);
        this.moveToShip(1104);
        this.moveToSlot(12);

        //空间站 空间站->舰船
        this.moveToShip(1104);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //空间站 空间站->空间站
        this.moveToShip(1104);
        this.moveToStation(0);
        this.moveToShip(1104);
        this.moveToStation(1001);
        this.moveToShip(1104);
        this.moveToStation(1000);


        //空间站 远程->槽位
        this.moveToSlot(0);
        this.moveToSlot(1);
        this.moveToSlot(19);
        this.moveToSlot(20);
        this.moveToSlot(40);
        this.moveToSlot(12);
        this.moveToSlot(12);
        this.moveToSlot(10);

        this.moveToShip(1104);
        //空间站 远程->舰船
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(1104);
        this.moveToShip(1001);


        //空间站 远程->空间站
        this.moveToStation(1000);
        this.moveToStation(1104);
        this.moveToStation(1001);
        this.moveToStation(1001);
        this.moveToStation(1000);
        this.moveToStation(1104);
        this.moveToStation(1000);


        this.moveToShip(1104);


        //空间站 远程->槽位
        this.moveToSlot(0);
        this.moveToSlot(1);
        this.moveToSlot(19);
        this.moveToSlot(20);
        this.moveToSlot(40);
        this.moveToSlot(12);
        this.moveToSlot(12);
        this.moveToSlot(10);
        //空间站 远程->舰船
        this.moveToShip(0);
        this.moveToShip(1);
        this.moveToShip(1103);
        this.moveToShip(0);
        this.moveToShip(1001);

        //空间站 远程->空间站
        this.moveToStation(0);
        this.moveToStation(1001);
        this.moveToStation(1000);
        this.moveToShip(1104);
        this.moveToStation(0);
        this.moveToStation(1000);

        return;

        //随机10000次检测
        for (let i = 0; i < 10000; i++) {
            let rand = common.func.getRand(1, 11);
            switch (rand) {
                case 1:
                    this.joinStation(1001);
                    break;
                case 2:
                    this.joinStation(1000);
                    break;
                case 3:
                    this.leaveStation();
                    break;
                case 4:
                    this.moveToSlot(10);
                    break;
                case 5:
                    this.moveToSlot(12);
                    break;
                case 6:
                    this.moveToShip(1001);
                    break;
                case 7:
                    this.moveToShip(1103);
                    break;
                case 8:
                    this.moveToShip(1104);
                    break;
                case 9:
                    this.moveToShip(0);
                    break;
                case 10:
                    this.moveToStation(1000);
                    break;
                case 11:
                    this.moveToStation(1001);
                    break;
            }
        }

        // C2S_MOVE_ITEM.item_id = 9988;
        // C2S_MOVE_ITEM.count = 1;
        // C2S_MOVE_ITEM.type = 1;
        // C2S_MOVE_ITEM.id = 20;
        // this.ws.send(C2S_MOVE_ITEM);
        //
        // C2S_MOVE_ITEM.item_id = 9989;
        // C2S_MOVE_ITEM.count = 1;
        // C2S_MOVE_ITEM.type = 1;
        // C2S_MOVE_ITEM.id = 21;
        // this.ws.send(C2S_MOVE_ITEM);
        //
        // C2S_MOVE_ITEM.item_id = 10418;
        // C2S_MOVE_ITEM.count = 1;
        // C2S_MOVE_ITEM.type = 1;
        // C2S_MOVE_ITEM.id = 30;
        // this.ws.send(C2S_MOVE_ITEM);
        //
        // C2S_MOVE_ITEM.item_id = 10419;
        // C2S_MOVE_ITEM.count = 1;
        // C2S_MOVE_ITEM.type = 1;
        // C2S_MOVE_ITEM.id = 31;
        // this.ws.send(C2S_MOVE_ITEM);
    }

    accountLogin() {
        //发送消息
        let C2S_ACCOUNT_LOGIN = new common.protocol.list[common.protocol.PROTOCOL_C2S_ACCOUNT_LOGIN]();
        C2S_ACCOUNT_LOGIN.platform = 'local';
        C2S_ACCOUNT_LOGIN.open_id = this.open_id;
        C2S_ACCOUNT_LOGIN.random = '123';
        C2S_ACCOUNT_LOGIN.ticket = crypto.createHash('md5').update(C2S_ACCOUNT_LOGIN.platform + C2S_ACCOUNT_LOGIN.open_id + C2S_ACCOUNT_LOGIN.random + "planet_crack").digest('hex');

        // console.log('==>>发送帐号登录请求', JSON.stringify(C2S_ACCOUNT_LOGIN));
        this.ws.send(C2S_ACCOUNT_LOGIN);
    };

    playerLogin() {
        //发送消息
        let C2S_PLAYER_LOGIN = new common.protocol.list[common.protocol.PROTOCOL_C2S_PLAYER_LOGIN]();
        C2S_PLAYER_LOGIN.platform = 'local';
        C2S_PLAYER_LOGIN.open_id = this.open_id;
        C2S_PLAYER_LOGIN.random = '123';
        C2S_PLAYER_LOGIN.server_id = 1;
        C2S_PLAYER_LOGIN.ticket = crypto.createHash('md5').update(C2S_PLAYER_LOGIN.platform + C2S_PLAYER_LOGIN.open_id + C2S_PLAYER_LOGIN.random + "planet_crack").digest('hex');

        // console.log('==>>发送角色登录请求', JSON.stringify(C2S_PLAYER_LOGIN));
        this.ws.send(C2S_PLAYER_LOGIN);
    }

    getGridInfo() {
        //发送消息
        let C2S_MAP_GRID_INFO = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_GRID_INFO]();

        // console.log('==>>发送地图信息请求', JSON.stringify(C2S_MAP_GRID_INFO));
        this.ws.send(C2S_MAP_GRID_INFO);
    }

    getScanDead() {
        //发送消息
        //协议改了这个报错了
        let C2S_WORLD_SCAN = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_SCAN_EXACT]();
        C2S_WORLD_SCAN.type = 5;

        this.ws.send(C2S_WORLD_SCAN);
    }

    goDown() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        C2S_MAP_MOVE.move = {
            rat: 180,
            pow: 100,
        };

        this.ws.send(C2S_MAP_MOVE);
    }

    goUp() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        C2S_MAP_MOVE.move = {
            rat: 0,
            pow: 100,
        };

        this.ws.send(C2S_MAP_MOVE);
    }

    goStop() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        C2S_MAP_MOVE.move = {
            rat: 0,
            pow: 0,
        };

        this.ws.send(C2S_MAP_MOVE);
    }

}

module.exports = DemoLogin;
