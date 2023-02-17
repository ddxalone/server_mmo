/**
 * 后台特有定义类
 */
class Define {
    constructor() {
        //帐号返回错误
        this.PROTOCOL_STATUS_SUCCESS = 1;
        //帐号返回错误

        this.ACCOUNT_LOGIN_STATUS_NOT_RUN = 2;
        this.ACCOUNT_LOGIN_STATUS_TICKET_ERROR = 3;
        this.ACCOUNT_LOGIN_STATUS_REPEAT_LOGIN = 4;
        this.ACCOUNT_LOGIN_STATUS_LOGIN_ACTION = 5;
        this.ACCOUNT_LOGIN_STATUS_LIST_DB_FAIL = 6;

        this.PLAYER_LOGIN_STATUS_NOT_RUN = 2;
        this.PLAYER_LOGIN_STATUS_NOT_OPEN = 3;
        this.PLAYER_LOGIN_STATUS_TICKET_ERROR = 4;
        this.PLAYER_LOGIN_STATUS_REPEAT_LOGIN = 5;
        this.PLAYER_LOGIN_STATUS_LOGIN_ACTION = 6;
        this.PLAYER_LOGIN_STATUS_ACCOUNT_ERROR = 7;
        this.PLAYER_LOGIN_STATUS_ACCOUNT_LOCK = 8;
        this.PLAYER_LOGIN_STATUS_DB_ERROR = 9;
        this.PLAYER_LOGIN_STATUS_DB_FAIL = 11;
        this.PLAYER_LOGIN_STATUS_PLAYER_ERROR = 12;
        //帐号登出被顶
        this.ACCOUNT_PLAYER_LOGOUT = 2;

        //登陆类型1
        this.LOGIN_LOG_TYPE_LOGIN = 1;
        this.LOGIN_LOG_TYPE_LOGOUT = 2;

        //玩家地图状态
        this.PLAYER_MAP_FRAME_STATUS_NULL = 0;
        this.PLAYER_MAP_FRAME_STATUS_JOIN = 1;
        this.PLAYER_MAP_FRAME_STATUS_RUN = 2;
        this.PLAYER_MAP_FRAME_STATUS_LEAVE = 3;

        //断层加入merge的状态 只有创建和离开
        this.MAP_GRID_TYPE_CREATE = 1;
        this.MAP_GRID_TYPE_REMOVE = 2;

        //通知客户端类型只有2种 更新和移除
        // this.CLIENT_REFRESH_STATUS_UPDATE = 1;
        // this.CLIENT_REFRESH_STATUS_REMOVE = 2;

        //舰船大类型
        this.SHIP_CLASSIFY_CLASSIFY_1 = 1;//护卫
        this.SHIP_CLASSIFY_CLASSIFY_2 = 2;//驱逐
        this.SHIP_CLASSIFY_CLASSIFY_3 = 3;//巡洋
        this.SHIP_CLASSIFY_CLASSIFY_4 = 4;//战列
        this.SHIP_CLASSIFY_CLASSIFY_5 = 5;//无畏
        this.SHIP_CLASSIFY_CLASSIFY_6 = 6;//泰坦

        this.WARP_TYPE_FULL_8 = 1;//全8个方向
        this.WARP_TYPE_HINDER_5 = 2;//后5个方向

        // this.STEP_TYPE_MAIN = 0;//主线
        // this.STEP_TYPE_SPECIAL = 1;//特殊
        // this.STEP_TYPE_COMPLETE = 2;//完成

        this.PLAN_TYPE_POINT = 0;//固定坐标
        this.PLAN_TYPE_RAND = 1;//随机分布
        this.PLAN_TYPE_SURROUND = 2;//随机环绕
        this.PLAN_TYPE_FORMATION = 3;//对称队列
        this.PLAN_TYPE_SYMMETRY = 4;//对称环绕

        this.TRIGGER_CLASSIFY_ALL_LESS = 0;//剩余数量
        this.TRIGGER_CLASSIFY_STEP_LESS = 1;//阶段数量
        this.TRIGGER_CLASSIFY_PLAN_LESS = 2;//布局数量
        this.TRIGGER_CLASSIFY_UNIT_HARM = 3;//布局受击
        this.TRIGGER_CLASSIFY_UNIT_BYRAY = 4;//布局扫描

        this.ACTIONS_CLASSIFY_ALL_LEAVE = 0;//全部离开
        this.ACTIONS_CLASSIFY_CAMP_LEAVE = 1;//阵营离开
        this.ACTIONS_CLASSIFY_PALN_LEAVE = 2;//布局离开

        this.TRIGGER_TYPE_INIT = 0;//触发类型初始化
        this.TRIGGER_TYPE_DEATH = 1;//触发类型死亡
        this.TRIGGER_TYPE_RAY = 2;//触发类型扫描
        this.TRIGGER_TYPE_HARM = 3;//触发类型受击

        this.SHIP_NPCER_TRIGGER_STATUS_NULL = 0;//巡逻状态切换触发状态
        this.SHIP_NPCER_TRIGGER_STATUS_TRIGGER = 1;//巡逻状态切换触发状态


        this.SHIP_NPCER_ENTER_TYPE_SHOW = 0;//直接出现
        this.SHIP_NPCER_ENTER_TYPE_WARP = 1;//折跃出现
        this.SHIP_NPCER_ENTER_TYPE_STATION = 2;//空间站出现

        this.DEAD_WARP_INTERCEPT_RANGE = 1000;//死亡空间拦截力场范围

        this.STORE_FROM_SLOT_STATUS_NULL = 0;//当前舰船的槽位上无物品
        this.STORE_FROM_SLOT_STATUS_MASTER = 1;//移动物品的主物品是否位于当前舰船的槽位上
        this.STORE_FROM_SLOT_STATUS_BATCH = 2;//移动物品的子商品是否位于当前舰船的槽位上

        this.ITEM_OPERATION_STATUS_NULL = 0;//物品分离堆叠状态无
        this.ITEM_OPERATION_STATUS_SPLIT = 1;//物品分离堆叠状态分离
        this.ITEM_OPERATION_STATUS_PACK = 2;//物品分离堆叠状态堆叠

        this.ITEM_DISTRIBUTION_QUALITY = 3;//决定物品分布的种类 目前是势力装


        //舰船分类
        this.DISTRIBUTION_FORCE_CLASSIFY = {};
        this.DISTRIBUTION_FORCE_CLASSIFY['欧伏'] = 1;
        this.DISTRIBUTION_FORCE_CLASSIFY['博尔'] = 2;
        this.DISTRIBUTION_FORCE_CLASSIFY['甘纳'] = 3;
        this.DISTRIBUTION_FORCE_CLASSIFY['索萨'] = 4;
        this.DISTRIBUTION_FORCE_CLASSIFY['卡迪'] = 5;
        this.DISTRIBUTION_FORCE_CLASSIFY['乔索'] = 6;
        this.DISTRIBUTION_FORCE_CLASSIFY['亚纳'] = 7;
        this.DISTRIBUTION_FORCE_CLASSIFY['底斯'] = 8;
        this.DISTRIBUTION_FORCE_CLASSIFY['瓦格'] = 9;
    }

    static instance() {
        if (Define.m_instance == null) {
            Define.m_instance = new Define();
        }
        return Define.m_instance;
    }
}

Define.m_instance = null;

module.exports = Define;
