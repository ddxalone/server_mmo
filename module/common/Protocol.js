class Protocol {
    constructor() {
        this.list = {};
        //帐号系列100
        //服务器通用系列200
        //玩家通用系列300
        //玩家地图系列400
        //玩家世界系列500

        //帐号登录
        let PROTOCOL_C2S_ACCOUNT_LOGIN = 100;
        let FUN_C2S_ACCOUNT_LOGIN = function () {
            this.protocol = PROTOCOL_C2S_ACCOUNT_LOGIN;
            this.platform = '';
            this.open_id = '';
            this.random = '';
            this.ticket = '';
            this.extra = {};
        };
        this.PROTOCOL_C2S_ACCOUNT_LOGIN = PROTOCOL_C2S_ACCOUNT_LOGIN;
        this.list[PROTOCOL_C2S_ACCOUNT_LOGIN] = FUN_C2S_ACCOUNT_LOGIN;

        //用户登录
        let PROTOCOL_C2S_PLAYER_LOGIN = 101;
        let FUN_C2S_PLAYER_LOGIN = function () {
            this.protocol = PROTOCOL_C2S_PLAYER_LOGIN;
            this.platform = '';
            this.open_id = '';
            this.random = '';
            this.ticket = '';
            this.server_id = 0;
            this.extra = {};
        };
        this.PROTOCOL_C2S_PLAYER_LOGIN = PROTOCOL_C2S_PLAYER_LOGIN;
        this.list[PROTOCOL_C2S_PLAYER_LOGIN] = FUN_C2S_PLAYER_LOGIN;

        //用户登出
        let PROTOCOL_C2S_PLAYER_LOGOUT = 102;
        let FUN_C2S_PLAYER_LOGOUT = function () {
            this.protocol = PROTOCOL_C2S_PLAYER_LOGOUT;
        };
        this.PROTOCOL_C2S_PLAYER_LOGOUT = PROTOCOL_C2S_PLAYER_LOGOUT;
        this.list[PROTOCOL_C2S_PLAYER_LOGOUT] = FUN_C2S_PLAYER_LOGOUT;

        //发送地图帧
        let PROTOCOL_C2S_SEND_MAP_INFO = 299;
        let FUN_C2S_SEND_MAP_INFO = function () {
            this.protocol = PROTOCOL_C2S_SEND_MAP_INFO;
            this.name = '';
            this.info = {};
        };
        this.PROTOCOL_C2S_SEND_MAP_INFO = PROTOCOL_C2S_SEND_MAP_INFO;
        this.list[PROTOCOL_C2S_SEND_MAP_INFO] = FUN_C2S_SEND_MAP_INFO;

        //请求登船
        let PROTOCOL_C2S_BOARD_SHIP = 300;
        let FUN_C2S_BOARD_SHIP = function () {
            this.protocol = PROTOCOL_C2S_BOARD_SHIP;
            this.station_id = 0;
        };
        this.PROTOCOL_C2S_BOARD_SHIP = PROTOCOL_C2S_BOARD_SHIP;
        this.list[PROTOCOL_C2S_BOARD_SHIP] = FUN_C2S_BOARD_SHIP;

        //请求移动装备到空间站
        let PROTOCOL_C2S_MOVE_ITEM = 301;
        let FUN_C2S_MOVE_ITEM = function () {
            this.protocol = PROTOCOL_C2S_MOVE_ITEM;
            this.item_id = 0;
            this.item_ids = [];
            this.count = 0;
            this.type = 0;
            this.id = 0;
            this.target_id = 0;
        };
        this.PROTOCOL_C2S_MOVE_ITEM = PROTOCOL_C2S_MOVE_ITEM;
        this.list[PROTOCOL_C2S_MOVE_ITEM] = FUN_C2S_MOVE_ITEM;

        //请求增加技能点
        let PROTOCOL_C2S_CHANGE_SKILL = 302;
        let FUN_C2S_CHANGE_SKILL = function () {
            this.protocol = PROTOCOL_C2S_CHANGE_SKILL;
            this.type = 0;
            this.level = 0;
        };
        this.PROTOCOL_C2S_CHANGE_SKILL = PROTOCOL_C2S_CHANGE_SKILL;
        this.list[PROTOCOL_C2S_CHANGE_SKILL] = FUN_C2S_CHANGE_SKILL;

        //请求舰船制造
        let PROTOCOL_C2S_INITIATE_PRODUCT = 303;
        let FUN_C2S_INITIATE_PRODUCT = function () {
            this.protocol = PROTOCOL_C2S_INITIATE_PRODUCT;
            this.blueprint_id = 0;
            this.count = 0;
        };
        this.PROTOCOL_C2S_INITIATE_PRODUCT = PROTOCOL_C2S_INITIATE_PRODUCT;
        this.list[PROTOCOL_C2S_INITIATE_PRODUCT] = FUN_C2S_INITIATE_PRODUCT;

        //请求舰船制造
        let PROTOCOL_C2S_DELIVER_PRODUCT = 304;
        let FUN_C2S_DELIVER_PRODUCT = function () {
            this.protocol = PROTOCOL_C2S_DELIVER_PRODUCT;
            this.product_id = 0;
            this.status = 0;
        };
        this.PROTOCOL_C2S_DELIVER_PRODUCT = PROTOCOL_C2S_DELIVER_PRODUCT;
        this.list[PROTOCOL_C2S_DELIVER_PRODUCT] = FUN_C2S_DELIVER_PRODUCT;

        //获取地图信息
        let PROTOCOL_C2S_MAP_GRID_INFO = 400;
        let FUN_C2S_MAP_GRID_INFO = function () {
            this.protocol = PROTOCOL_C2S_MAP_GRID_INFO;
        };
        this.PROTOCOL_C2S_MAP_GRID_INFO = PROTOCOL_C2S_MAP_GRID_INFO;
        this.list[PROTOCOL_C2S_MAP_GRID_INFO] = FUN_C2S_MAP_GRID_INFO;

        //请求地图移动
        let PROTOCOL_C2S_MAP_MOVE = 401;
        let FUN_C2S_MAP_MOVE = function () {
            this.protocol = PROTOCOL_C2S_MAP_MOVE;
            this.rat = 0;
            this.pow = 0;
        };
        this.PROTOCOL_C2S_MAP_MOVE = PROTOCOL_C2S_MAP_MOVE;
        this.list[PROTOCOL_C2S_MAP_MOVE] = FUN_C2S_MAP_MOVE;

        //请求执行操作
        let PROTOCOL_C2S_MAP_CONTROL = 402;
        let FUN_C2S_MAP_CONTROL = function () {
            this.protocol = PROTOCOL_C2S_MAP_CONTROL;
            this.control = 0;
            this.grid_id = 0;
            this.type = 0;
            this.id = 0;
        };
        this.PROTOCOL_C2S_MAP_CONTROL = PROTOCOL_C2S_MAP_CONTROL;
        this.list[PROTOCOL_C2S_MAP_CONTROL] = FUN_C2S_MAP_CONTROL;

        //请求更改物品状态
        let PROTOCOL_C2S_MAP_ITEM = 403;
        let FUN_C2S_MAP_ITEM = function () {
            this.protocol = PROTOCOL_C2S_MAP_ITEM;
            this.slot = 0;
            this.type = 0;
        };
        this.PROTOCOL_C2S_MAP_ITEM = PROTOCOL_C2S_MAP_ITEM;
        this.list[PROTOCOL_C2S_MAP_ITEM] = FUN_C2S_MAP_ITEM;

        //请求拾取物品状态
        let PROTOCOL_C2S_MAP_PICK_ITEM = 404;
        let FUN_C2S_MAP_PICK_ITEM = function () {
            this.protocol = PROTOCOL_C2S_MAP_PICK_ITEM;
            this.grid_id = 0;
            this.unit_type = 0;
            this.unit_id = 0;
            this.item_pos = 0;
        };
        this.PROTOCOL_C2S_MAP_PICK_ITEM = PROTOCOL_C2S_MAP_PICK_ITEM;
        this.list[PROTOCOL_C2S_MAP_PICK_ITEM] = FUN_C2S_MAP_PICK_ITEM;

        //请求扫描信息
        let PROTOCOL_C2S_WORLD_SCAN_EXACT = 500;
        let FUN_C2S_WORLD_SCAN_EXACT = function () {
            this.protocol = PROTOCOL_C2S_WORLD_SCAN_EXACT;
            this.type = 0;
            this.id = 0;
        };
        this.PROTOCOL_C2S_WORLD_SCAN_EXACT = PROTOCOL_C2S_WORLD_SCAN_EXACT;
        this.list[PROTOCOL_C2S_WORLD_SCAN_EXACT] = FUN_C2S_WORLD_SCAN_EXACT;

        //请求折跃到信标
        let PROTOCOL_C2S_WORLD_WARP = 501;
        let FUN_C2S_WORLD_WARP = function () {
            this.protocol = PROTOCOL_C2S_WORLD_WARP;
            this.type = 0;
            this.id = 0;
        };
        this.PROTOCOL_C2S_WORLD_WARP = PROTOCOL_C2S_WORLD_WARP;
        this.list[PROTOCOL_C2S_WORLD_WARP] = FUN_C2S_WORLD_WARP;

        //请求折跃到坐标
        let PROTOCOL_C2S_WARP_POINT = 502;
        let FUN_C2S_WARP_POINT = function () {
            this.protocol = PROTOCOL_C2S_WARP_POINT;
            this.type = 0;
            this.x = 0;
            this.y = 0;
        };
        this.PROTOCOL_C2S_WARP_POINT = PROTOCOL_C2S_WARP_POINT;
        this.list[PROTOCOL_C2S_WARP_POINT] = FUN_C2S_WARP_POINT;

        //请求新的委托任务
        let PROTOCOL_C2S_SEARCH_TASK = 503;
        let FUN_C2S_SEARCH_TASK = function () {
            this.protocol = PROTOCOL_C2S_SEARCH_TASK;
            this.force = 0;
            this.category = 0;
            this.difficult = 0;
        };
        this.PROTOCOL_C2S_SEARCH_TASK = PROTOCOL_C2S_SEARCH_TASK;
        this.list[PROTOCOL_C2S_SEARCH_TASK] = FUN_C2S_SEARCH_TASK;

        //请求确认委托任务
        let PROTOCOL_C2S_ACCEPT_TASK = 504;
        let FUN_C2S_ACCEPT_TASK = function () {
            this.protocol = PROTOCOL_C2S_ACCEPT_TASK;
            this.task_id = 0;
            this.status = 0;
        };
        this.PROTOCOL_C2S_ACCEPT_TASK = PROTOCOL_C2S_ACCEPT_TASK;
        this.list[PROTOCOL_C2S_ACCEPT_TASK] = FUN_C2S_ACCEPT_TASK;


        //帐号登录返回信息
        let PROTOCOL_S2C_ACCOUNT_LOGIN = 10100;
        let FUN_S2C_ACCOUNT_LOGIN = function () {
            this.protocol = PROTOCOL_S2C_ACCOUNT_LOGIN;
            this.status = 0;
            this.list = {};
            this.login = {};
        };
        this.PROTOCOL_S2C_ACCOUNT_LOGIN = PROTOCOL_S2C_ACCOUNT_LOGIN;
        this.list[PROTOCOL_S2C_ACCOUNT_LOGIN] = FUN_S2C_ACCOUNT_LOGIN;

        //用户登录返回信息
        let PROTOCOL_S2C_PLAYER_LOGIN = 10101;
        let FUN_S2C_PLAYER_LOGIN = function () {
            this.protocol = PROTOCOL_S2C_PLAYER_LOGIN;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_PLAYER_LOGIN = PROTOCOL_S2C_PLAYER_LOGIN;
        this.list[PROTOCOL_S2C_PLAYER_LOGIN] = FUN_S2C_PLAYER_LOGIN;

        //用户登出
        let PROTOCOL_S2C_PLAYER_LOGOUT = 10102;
        let FUN_S2C_PLAYER_LOGOUT = function () {
            this.protocol = PROTOCOL_S2C_PLAYER_LOGOUT;
            this.status = 0;
        };
        this.PROTOCOL_S2C_PLAYER_LOGOUT = PROTOCOL_S2C_PLAYER_LOGOUT;
        this.list[PROTOCOL_S2C_PLAYER_LOGOUT] = FUN_S2C_PLAYER_LOGOUT;

        //发送服务器时间
        let PROTOCOL_S2C_SERVER_TIME = 10200;
        let FUN_S2C_SERVER_TIME = function () {
            this.protocol = PROTOCOL_S2C_SERVER_TIME;
            this.status = 0;
            this.time = 0;
        };
        this.PROTOCOL_S2C_SERVER_TIME = PROTOCOL_S2C_SERVER_TIME;
        this.list[PROTOCOL_S2C_SERVER_TIME] = FUN_S2C_SERVER_TIME;

        //发送服务器信息
        let PROTOCOL_S2C_SERVER_PARAM = 10201;
        let FUN_S2C_SERVER_PARAM = function () {
            this.protocol = PROTOCOL_S2C_SERVER_PARAM;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_SERVER_PARAM = PROTOCOL_S2C_SERVER_PARAM;
        this.list[PROTOCOL_S2C_SERVER_PARAM] = FUN_S2C_SERVER_PARAM;

        //用户信息
        let PROTOCOL_S2C_PLAYER_INFO = 10300;
        let FUN_S2C_PLAYER_INFO = function () {
            this.protocol = PROTOCOL_S2C_PLAYER_INFO;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_PLAYER_INFO = PROTOCOL_S2C_PLAYER_INFO;
        this.list[PROTOCOL_S2C_PLAYER_INFO] = FUN_S2C_PLAYER_INFO;

        //用户信息变更协议
        let PROTOCOL_S2C_CHANGE_INFO = 10301;
        let FUN_S2C_CHANGE_INFO = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_INFO;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_INFO = PROTOCOL_S2C_CHANGE_INFO;
        this.list[PROTOCOL_S2C_CHANGE_INFO] = FUN_S2C_CHANGE_INFO;

        //用户信息变更协议
        let PROTOCOL_S2C_CHANGE_EXTRA = 10302;
        let FUN_S2C_CHANGE_EXTRA = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_EXTRA;
            this.status = 0;
            this.extra = {};
        };
        this.PROTOCOL_S2C_CHANGE_EXTRA = PROTOCOL_S2C_CHANGE_EXTRA;
        this.list[PROTOCOL_S2C_CHANGE_EXTRA] = FUN_S2C_CHANGE_EXTRA;

        //玩家变量改变
        let PROTOCOL_S2C_CHANGE_VARIABLE = 10303;
        let FUN_S2C_CHANGE_VARIABLE = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_VARIABLE;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_VARIABLE = PROTOCOL_S2C_CHANGE_VARIABLE;
        this.list[PROTOCOL_S2C_CHANGE_VARIABLE] = FUN_S2C_CHANGE_VARIABLE;

        //舰船变更协议
        let PROTOCOL_S2C_CHANGE_SHIP = 10304;
        let FUN_S2C_CHANGE_SHIP = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_SHIP;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_SHIP = PROTOCOL_S2C_CHANGE_SHIP;
        this.list[PROTOCOL_S2C_CHANGE_SHIP] = FUN_S2C_CHANGE_SHIP;

        //装备变更协议
        let PROTOCOL_S2C_CHANGE_ITEM = 10305;
        let FUN_S2C_CHANGE_ITEM = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_ITEM;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_ITEM = PROTOCOL_S2C_CHANGE_ITEM;
        this.list[PROTOCOL_S2C_CHANGE_ITEM] = FUN_S2C_CHANGE_ITEM;

        //技能变更协议
        let PROTOCOL_S2C_CHANGE_SKILL = 10306;
        let FUN_S2C_CHANGE_SKILL = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_SKILL;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_SKILL = PROTOCOL_S2C_CHANGE_SKILL;
        this.list[PROTOCOL_S2C_CHANGE_SKILL] = FUN_S2C_CHANGE_SKILL;

        //任务变更协议
        let PROTOCOL_S2C_CHANGE_TASK = 10307;
        let FUN_S2C_CHANGE_TASK = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_TASK;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_TASK = PROTOCOL_S2C_CHANGE_TASK;
        this.list[PROTOCOL_S2C_CHANGE_TASK] = FUN_S2C_CHANGE_TASK;

        //声望变更协议
        let PROTOCOL_S2C_CHANGE_RENOWN = 10308;
        let FUN_S2C_CHANGE_RENOWN = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_RENOWN;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_RENOWN = PROTOCOL_S2C_CHANGE_RENOWN;
        this.list[PROTOCOL_S2C_CHANGE_RENOWN] = FUN_S2C_CHANGE_RENOWN;

        //蓝图变更协议
        let PROTOCOL_S2C_CHANGE_BLUEPRINT = 10309;
        let FUN_S2C_CHANGE_BLUEPRINT = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_BLUEPRINT;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_BLUEPRINT = PROTOCOL_S2C_CHANGE_BLUEPRINT;
        this.list[PROTOCOL_S2C_CHANGE_BLUEPRINT] = FUN_S2C_CHANGE_BLUEPRINT;

        //生产队列变更协议
        let PROTOCOL_S2C_CHANGE_PRODUCT = 10310;
        let FUN_S2C_CHANGE_PRODUCT = function () {
            this.protocol = PROTOCOL_S2C_CHANGE_PRODUCT;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_CHANGE_PRODUCT = PROTOCOL_S2C_CHANGE_PRODUCT;
        this.list[PROTOCOL_S2C_CHANGE_PRODUCT] = FUN_S2C_CHANGE_PRODUCT;

        //地图信息
        let PROTOCOL_S2C_MAP_GRID_INFO = 10400;
        let FUN_S2C_MAP_GRID_INFO = function () {
            this.protocol = PROTOCOL_S2C_MAP_GRID_INFO;
            this.status = 0;
            this.frame = 0;
            this.info = 0;
            this.grid = 0;
        };
        this.PROTOCOL_S2C_MAP_GRID_INFO = PROTOCOL_S2C_MAP_GRID_INFO;
        this.list[PROTOCOL_S2C_MAP_GRID_INFO] = FUN_S2C_MAP_GRID_INFO;

        //返回帧信息
        let PROTOCOL_S2C_MAP_FRAME = 10401;
        let FUN_S2C_MAP_FRAME = function () {
            this.protocol = PROTOCOL_S2C_MAP_FRAME;
            this.status = 0;
            this.merge_id = 0;
            this.info = {};
            this.unit = {};
            this.player = {};
            this.action = {};
            this.frame = 0;
        };
        this.PROTOCOL_S2C_MAP_FRAME = PROTOCOL_S2C_MAP_FRAME;
        this.list[PROTOCOL_S2C_MAP_FRAME] = FUN_S2C_MAP_FRAME;

        //返回扫描信息
        let PROTOCOL_S2C_WORLD_SCAN = 10500;
        let FUN_S2C_WORLD_SCAN = function () {
            this.protocol = PROTOCOL_S2C_WORLD_SCAN;
            this.status = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_WORLD_SCAN = PROTOCOL_S2C_WORLD_SCAN;
        this.list[PROTOCOL_S2C_WORLD_SCAN] = FUN_S2C_WORLD_SCAN;

        //扫描通知协议
        let PROTOCOL_S2C_WORLD_SCAN_CHANGE = 10501;
        let FUN_S2C_WORLD_SCAN_CHANGE = function () {
            this.protocol = PROTOCOL_S2C_WORLD_SCAN_CHANGE;
            this.status = 0;
            this.type = 0;
            this.info = {};
        };
        this.PROTOCOL_S2C_WORLD_SCAN_CHANGE = PROTOCOL_S2C_WORLD_SCAN_CHANGE;
        this.list[PROTOCOL_S2C_WORLD_SCAN_CHANGE] = FUN_S2C_WORLD_SCAN_CHANGE;
    }

    static instance() {
        if (Protocol.m_instance == null) {
            Protocol.m_instance = new Protocol();
        }
        return Protocol.m_instance;
    }
}

Protocol.m_instance = null;

module.exports = Protocol;
