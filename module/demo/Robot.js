const m_demo = require(".");
const crypto = require("crypto");
const common = require("../common");

class Robot {
    constructor(open_id, server_id, server_frame) {
        this.open_id = open_id;
        this.server_id = server_id;
        this.start_server_frame = server_frame;
        this.run_server_frame = 0;

        // this.random_stop_frame = common.func.getRand(0, 20);
        // this.random_stop_frame = this.server_id;
        this.random_stop_frame = 0;
    }

    run(server_frame) {
        this.run_server_frame = server_frame - this.start_server_frame;
        if (this.run_server_frame === 0) {
            this.wsCreate();
        }

        // if (this.server_id === 1) {
        //     return;
        // }
        //每100帧循环
        let loop_server_frame = this.run_server_frame % (100 + this.random_stop_frame);

        switch (loop_server_frame) {
            case 5:
                this.goRand();
                break;
            case 15:
                this.goStop();
                break;
            case 20:
                this.goWarp();
                break;
            case 35:
                // this.stopWarp();
                break;
            case 45:
                this.goRand();
                break;
            case 74:
                this.goStop();
                break;
            case 75:
                this.goWarp();
                break;
        }
    }

    /**
     * @returns {Robot}
     */
    wsCreate() {
        this.ws = new m_demo.Websocket();
        this.ws.create(() => {
            this.accountLogin();
            //接收消息
            this.ws.message((data) => {
                switch (data.protocol) {
                    case 10100:
                        // console.log('<<==接收到帐号登录请求', JSON.stringify(data));
                        this.playerLogin();
                        break;
                    case 10101:
                        // console.log('<<==接收到角色登录请求', JSON.stringify(data));
                        this.getGridInfo();

                        this.getScanDead();
                        break;
                    default :
                    // console.log('<<==未处理协议', JSON.stringify(data));
                }
                if (data.protocol === 10100) {
                }
            }, this);
        }, this);
        return this;
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
        C2S_PLAYER_LOGIN.server_id = this.server_id;
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
        let C2S_WORLD_SCAN = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_SCAN_EXACT]();

        this.ws.send(C2S_WORLD_SCAN);
    }

    goDown() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        // C2S_MAP_MOVE.move = {
        //     rat: 180,
        //     pow: 100,
        // };
        C2S_MAP_MOVE.rat = 180;
        C2S_MAP_MOVE.pow = 100;


        this.ws.send(C2S_MAP_MOVE);
    }

    goRand() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        // C2S_MAP_MOVE.move = {
        //     rat: common.func.getRand(0, 359),
        //     rat: Math.floor(common.func.formatAngle(this.server_id * 10000) / 100),
        // pow: 100,
        // };
        C2S_MAP_MOVE.rat = common.func.getRand(0, 359);
        C2S_MAP_MOVE.pow = 100;

        this.ws.send(C2S_MAP_MOVE);
    }

    goUp() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        C2S_MAP_MOVE.rat = 0;
        C2S_MAP_MOVE.pow = 100;

        this.ws.send(C2S_MAP_MOVE);
    }

    goStop() {
        let C2S_MAP_MOVE = new common.protocol.list[common.protocol.PROTOCOL_C2S_MAP_MOVE]();
        C2S_MAP_MOVE.rat = 0;
        C2S_MAP_MOVE.pow = 0;

        this.ws.send(C2S_MAP_MOVE);
    }

    goWarp() {
        let C2S_WORLD_WARP = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_WARP]();
        // C2S_WORLD_WARP.type = common.static.WORLD_NPCER_UNIT_TYPE_DEAD;
        C2S_WORLD_WARP.type = common.static.WORLD_UNIT_TYPE_STATION;
        C2S_WORLD_WARP.id = 1001;

        this.ws.send(C2S_WORLD_WARP);
    }

    stopWarp() {
        let C2S_WORLD_WARP = new common.protocol.list[common.protocol.PROTOCOL_C2S_WORLD_WARP]();
        C2S_WORLD_WARP.type = 0;
        C2S_WORLD_WARP.id = 0;

        this.ws.send(C2S_WORLD_WARP);
    }
}

module.exports = Robot;
