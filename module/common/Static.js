/**
 * 前后端都有的静态类
 */
class Static {
    constructor() {
        //舰船
        this.MAP_UNIT_TYPE_SHIP_PLAYER = 1;
        this.MAP_UNIT_TYPE_SHIP_NPCER = 2;
        //建筑
        this.MAP_UNIT_TYPE_STATION = 3;
        //弹药
        this.MAP_UNIT_TYPE_BULLET = 5;
        //折跃特效
        this.MAP_UNIT_TYPE_WARP = 6;
        //死亡空间信标
        this.MAP_UNIT_TYPE_DEAD = 7;
        //任务空间信标
        this.MAP_UNIT_TYPE_TASK = 8;
        //矿物
        this.MAP_UNIT_TYPE_MINERAL = 9;
        //碰撞
        this.MAP_UNIT_TYPE_COLLIDE = 10;
        //残骸
        this.MAP_UNIT_TYPE_WRECKAGE = 11;

        this.FIRE_TYPE_NULL = 0;//不开火
        this.FIRE_TYPE_EXACT = 1;//精准开火
        this.FIRE_TYPE_FORCE = 2;//强制开火 (多重打击)

        this.WORLD_UNIT_TYPE_SHIP_PLAYER = 1;
        this.WORLD_UNIT_TYPE_SHIP_NPCER = 2;
        this.WORLD_UNIT_TYPE_STAR_GALAXY = 3;
        this.WORLD_UNIT_TYPE_STAR_PLANET = 4;
        this.WORLD_UNIT_TYPE_STAR_SATELLITE = 5;
        this.WORLD_UNIT_TYPE_STATION = 6;
        this.WORLD_UNIT_TYPE_CURRENT = 7;
        this.WORLD_UNIT_TYPE_DEAD = 8;
        this.WORLD_UNIT_TYPE_TASK = 9;

        this.WORLD_NPCER_UNIT_TYPE_DEAD = 1;
        this.WORLD_NPCER_UNIT_TYPE_TASK = 2;

        this.ITEM_MAIN_CLASSIFY_WEAPON = 1;
        this.ITEM_MAIN_CLASSIFY_ACTIVE = 2;
        this.ITEM_MAIN_CLASSIFY_PASSIVE = 3;
        this.ITEM_MAIN_CLASSIFY_INFO = 4;

        this.ITEM_CLASSIFY_WEAPON_MIN = 10;
        this.ITEM_CLASSIFY_AMMO = 11;
        this.ITEM_CLASSIFY_GUIDE = 12;
        this.ITEM_CLASSIFY_LASER = 13;
        // this.ITEM_CLASSIFY_SMALL_AMMO = 11;
        // this.ITEM_CLASSIFY_SMALL_GUIDE = 12;
        // this.ITEM_CLASSIFY_SMALL_LASER = 13;
        // this.ITEM_CLASSIFY_LARGE_AMMO = 14;
        // this.ITEM_CLASSIFY_LARGE_GUIDE = 15;
        // this.ITEM_CLASSIFY_LARGE_LASER = 16;
        // this.ITEM_CLASSIFY_CAPITAL_AMMO = 17;
        // this.ITEM_CLASSIFY_CAPITAL_GUIDE = 18;
        // this.ITEM_CLASSIFY_CAPITAL_LASER = 19;
        this.ITEM_CLASSIFY_WEAPON_MAX = 19;

        this.ITEM_CLASSIFY_ACTIVE_MIN = 20;
        this.ITEM_CLASSIFY_ACTIVE_RECOVER = 21;//护盾注能装置
        this.ITEM_CLASSIFY_ACTIVE_RESUME = 22;//装甲修复装置
        this.ITEM_CLASSIFY_ACTIVE_THRUSTER = 23;//舰船推进装置
        this.ITEM_CLASSIFY_ACTIVE_STEALTH = 24;//舰船隐形装置
        this.ITEM_CLASSIFY_ACTIVE_BATTLE = 25;//武器模块装置
        this.ITEM_CLASSIFY_ACTIVE_CAPACITOR = 26;//电容注入装置
        this.ITEM_CLASSIFY_ACTIVE_STAGNANT = 27;//停滞缠绕装置
        this.ITEM_CLASSIFY_ACTIVE_STEERING = 28;//转向干扰装置
        this.ITEM_CLASSIFY_ACTIVE_SIPHON = 29//电容虹吸装置
        this.ITEM_CLASSIFY_ACTIVE_NEUTRALIZATION = 30;//电容中和装置
        this.ITEM_CLASSIFY_ACTIVE_MAX = 39;

        this.ITEM_CLASSIFY_PASSIVE_MIN = 40;
        this.ITEM_CLASSIFY_PASSIVE_SHIELD_EXTENDER = 41;//护盾扩展装置
        this.ITEM_CLASSIFY_PASSIVE_ARMOR_EXTENDER = 42;//装甲质量装置
        this.ITEM_CLASSIFY_PASSIVE_SHIELD_RESISTANCE = 43;//护盾抗性装置
        this.ITEM_CLASSIFY_PASSIVE_ARMOR_RESISTANCE = 44;//装甲抗性装置
        this.ITEM_CLASSIFY_PASSIVE_SHIELD_RECOVER = 45;//护盾充能装置
        this.ITEM_CLASSIFY_PASSIVE_ARMOR_RESUME = 46;//装甲维修装置
        this.ITEM_CLASSIFY_PASSIVE_CHARGE = 47;//电容回充装置
        this.ITEM_CLASSIFY_PASSIVE_CAPACITY = 48;//电容容量装置
        this.ITEM_CLASSIFY_PASSIVE_MASS = 49;//舰船质量装置
        this.ITEM_CLASSIFY_PASSIVE_OVERDRIVE = 50;//舰船速度装置
        this.ITEM_CLASSIFY_PASSIVE_ACCELERATOR = 51;//跃迁增益装置
        this.ITEM_CLASSIFY_PASSIVE_DAMAGE = 52;//武器伤害装置
        this.ITEM_CLASSIFY_PASSIVE_TRACKING = 53;//武器提升装置
        this.ITEM_CLASSIFY_PASSIVE_SHAPE = 54;//弹道形状装置
        this.ITEM_CLASSIFY_PASSIVE_SCAN = 55;//扫描增益装置
        this.ITEM_CLASSIFY_PASSIVE_MAX = 69;

        this.ITEM_CLASSIFY_INFO_MIN = 70;
        this.ITEM_CLASSIFY_INFO_MINERAL = 71;
        this.ITEM_CLASSIFY_INFO_BLUEPRINT = 90;
        this.ITEM_CLASSIFY_INFO_MAX = 99;

        this.SHIP_ITEM_TYPE_WEAPON_MAX = 20000;
        this.SHIP_ITEM_TYPE_ACTIVE_MAX = 40000;
        this.SHIP_ITEM_TYPE_PASSIVE_MAX = 60000;
        this.SHIP_ITEM_TYPE_INFO_MAX = 80000;

        this.BULLET_BARRAGE_TYPE_AMMO = 10;//普弹
        this.BULLET_BARRAGE_TYPE_AMMO_DOOMSDAY = 19;//末弹
        this.BULLET_BARRAGE_TYPE_GUIDE = 20;//普导
        this.BULLET_BARRAGE_TYPE_GUIDE_DOOMSDAY = 29;//末导
        this.BULLET_BARRAGE_TYPE_LASER_LINE = 30;//普光
        this.BULLET_BARRAGE_TYPE_LASER_DOT = 31;//点光
        this.BULLET_BARRAGE_TYPE_LASER_DOOMSDAY = 39;//末光

        this.UNIT_STATUS_NULL = 0;//默认状态
        this.UNIT_STATUS_INIT = 1;//初始化完毕
        this.UNIT_STATUS_RUN = 2;//放置到舞台运行
        this.UNIT_STATUS_DEATH = 3;//死亡
        this.UNIT_STATUS_BERTH = 4;//停泊状态

        this.ATTRIBUTE_SCOPE_CURRENT_WEAPON = 1;//当前武器
        this.ATTRIBUTE_SCOPE_CURRENT_MODULE = 2;//当前模块
        this.ATTRIBUTE_SCOPE_CURRENT_ITEM = 3;//当前装备
        this.ATTRIBUTE_SCOPE_SHIP = 4;//当前舰船
        this.ATTRIBUTE_SCOPE_RESISTANCE = 5;//抗性
        this.ATTRIBUTE_SCOPE_ALL_WEAPON = 6;//全部武器
        this.ATTRIBUTE_SCOPE_ALL_MODULE = 7;//全部模块
        this.ATTRIBUTE_SCOPE_ALL_ITEM = 8;//全部装备
        this.ATTRIBUTE_SCOPE_EXTRA = 9;//额外属性

        this.PLAYER_SKILL_CORE_ID = 1;//核心技能ID

        this.RATIO_TYPE_NORMAL = 1;//数值
        this.RATIO_TYPE_DRAW_RATIO = 2;//数值*100
        this.RATIO_TYPE_SERVER_FRAME = 3;//把厘秒换算成逻辑帧数 * common.setting.base_server_frame / this.draw_ratio
        this.RATIO_TYPE_FRAME_VALUE = 4;//把每秒数值算成逻辑帧数数值 / common.setting.base_server_frame * this.draw_ratio

        this.SHIP_ITEM_STATUS_NULL = 0;//其他位置
        this.SHIP_ITEM_STATUS_OFFLINE = 1;//下线
        this.SHIP_ITEM_STATUS_ONLINE = 2;//在线
        this.SHIP_ITEM_STATUS_ACTIVE = 3;//激活 主动装备特有
        this.SHIP_ITEM_STATUS_FROZEN = 4;//取消激活 下个CD变为在线


        this.SHIP_ITEM_QUALITY_NULL = 0;
        this.SHIP_ITEM_QUALITY_NORMAL = 1;
        this.SHIP_ITEM_QUALITY_IMPROVE = 2;
        this.SHIP_ITEM_QUALITY_STRENGTH = 3;
        this.SHIP_ITEM_QUALITY_RARE = 4;
        this.SHIP_ITEM_QUALITY_UNIQUE = 5;
        this.SHIP_ITEM_QUALITY_LEGEND = 6;

        this.WEAPON_EXTRA_TYPE_CREATE = 0;
        this.WEAPON_EXTRA_TYPE_RUN = 1;

        this.BULLET_EXTRA_CREATE_DELAY = 0;//弹药波次
        // this.BULLET_EXTRA_CREATE_ORIGINAL = 1;//原始角度 取消
        // this.BULLET_EXTRA_CREATE_ORIGINAL_SURROUND = 2;//原始全角 通过scatter控制
        // this.BULLET_EXTRA_CREATE_ROTATION = 3;//起始角度 取消
        // this.BULLET_EXTRA_CREATE_ROTATION_SURROUND = 4;//起始全角 放到run的第一帧处理
        // this.BULLET_EXTRA_CREATE_WAVE_ROTATION = 5;//波次角度 取消
        this.BULLET_EXTRA_CREATE_WAVE_ROTATION_SURROUND = 1;//波次全角
        // this.BULLET_EXTRA_CREATE_WAVE_SPACE = 7;//波次距离 取消
        this.BULLET_EXTRA_CREATE_WAVE_SPACE_SURROUND = 2;//波次全距
        // this.BULLET_EXTRA_CREATE_SPEED = 3;//起始速度
        // this.BULLET_EXTRA_CREATE_DOOMSDAY_PER_HEAT = 4;//末日武器预热帧数
        // this.BULLET_EXTRA_CREATE_DOOMSDAY_BATTLE = 5;//末日武器模块帧数

        this.BULLET_EXTRA_RUN_ORIGINAL = 0;//角度归位
        this.BULLET_EXTRA_RUN_SPEED_MAX = 1;//速度归位
        // this.BULLET_EXTRA_RUN_ROTATION = 1;//角度变更 对称
        this.BULLET_EXTRA_RUN_ROTATION_SURROUND = 2;//角度变更 全角
        this.BULLET_EXTRA_RUN_SPEED = 3;//调整速度
        // this.BULLET_EXTRA_RUN_SPEED_INCREMENT = 4;//调整速度增量
        this.BULLET_EXTRA_RUN_LOOP = 4;//循环开始
        this.BULLET_EXTRA_RUN_REPEAT = 5;//重复动作

        this.SKILL_CLASSIFY_MIN = 1;
        this.SKILL_CLASSIFY_SHIP = 1;//技能舰船精通
        this.SKILL_CLASSIFY_WEAPON = 2;//技能武器精通
        this.SKILL_CLASSIFY_BODY = 3;//技能船体精通
        this.SKILL_CLASSIFY_SPEED = 4;//技能导航精通
        this.SKILL_CLASSIFY_REPAIR = 5;//技能维修精通
        this.SKILL_CLASSIFY_SCAN = 6;//技能扫描精通
        this.SKILL_CLASSIFY_MAX = 6;

        this.MAP_CONTROL_TYPE_FIGHT = 1;//开始攻击
        this.MAP_CONTROL_TYPE_STATION_JOIN = 2;//请求进入空间站
        this.MAP_CONTROL_TYPE_STATION_LEAVE = 3;//请求离开空间站
        this.MAP_CONTROL_TYPE_RAY = 4;//请求扫描

        //单位帧同步类型加入
        this.MAP_FRAME_TYPE_BUILD = 1;
        this.MAP_FRAME_TYPE_EXIST = 2;
        this.MAP_FRAME_TYPE_LEAVE = 3;
        this.MAP_FRAME_TYPE_DEAD = 4;
        this.MAP_FRAME_TYPE_MOVE_IN = 5;
        this.MAP_FRAME_TYPE_MOVE_OUT = 6;

        this.CHANGE_TYPE_BUILD = 1;
        this.CHANGE_TYPE_EXIST = 2;
        this.CHANGE_TYPE_REMOVE = 3;


        this.STORE_TYPE_ITEM = 1;//仓库类型当前飞船装备
        this.STORE_TYPE_CONTAINER = 2;//仓库类型当前飞船货柜
        this.STORE_TYPE_CURRENT_STATION = 3;//仓库类型当前空间站
        this.STORE_TYPE_REMOTE_STATION = 4;//仓库类型远程空间站 (无论物品在远程的哪个位置)
        // this.STORE_TYPE_REMOTE = 3;//仓库类型远程
        // this.STORE_TYPE_OTHER = 4;//仓库类型其他
        // this.STORE_TYPE_SHIP_OTHER = 5;//仓库类型其他船身上

        this.OWNER_STORE_TYPE_SHIP_ITEM = 1;//装备所属类型属于舰船
        this.OWNER_STORE_TYPE_CONTAINER = 2;//装备所属类型属于货柜
        this.OWNER_STORE_TYPE_STATION = 3;//装备所属类型属于空间站
        this.OWNER_STORE_TYPE_SPACE = 4;//装备所属类型属于太空

        //默认物品数量 装配时使用此值
        this.DEFAULT_ITEM_COUNT = 1;

        this.ITEM_OPERATION_STATUS_ASSEMBLE = 1;//可装配
        this.ITEM_OPERATION_STATUS_TRANSFER = 2;//可转移
        this.ITEM_OPERATION_STATUS_LOGISTICS = 3;//可物流
        this.ITEM_OPERATION_STATUS_INVALID = 4;//无效的 例如我在太空

        this.STORE_TYPE_TO_NULL = 0;//无指定
        this.STORE_TYPE_TO_SLOT = 1;//船体
        this.STORE_TYPE_TO_SHIP = 2;//货柜
        this.STORE_TYPE_TO_STATION = 3;//仓库

        // this.STORE_TYPE_FROM_SLOT = 1;//当前槽位
        // this.STORE_TYPE_FROM_SHIP = 2;//当前舰船
        // this.STORE_TYPE_FROM_STATION = 3;//当前空间站 则可任意移动
        // this.STORE_TYPE_FROM_REMOTE = 4;//远程空间站 纳入物流

        this.STORE_TYPE_FROM_SHIP_CURRENT = 1;//当前舰船
        this.STORE_TYPE_FROM_SHIP_STATION = 2;//当前舰船在当前空间站
        this.STORE_TYPE_FROM_SHIP_REMOTE = 3;//当前舰船在远程空间站

        this.PATROL_MODEL_GUERRILLA = 1;//游击模式
        this.PATROL_MODEL_SNIPER = 2;//狙击模式

        this.CURRENT_ITEM_REQUIRE_ID = 301;//当前装备需求减少固定值ID
        this.CURRENT_ITEM_REQUIRE_PER_ID = 302;//当前装备需求减少百分比ID

        this.HARM_STATUS_NULL = 0;//受击标记 无
        this.HARM_STATUS_HARM = 1;//受击标记 受击
        // this.PATROL_MODEL_GUERRILLA_LEFT = 2;//顺时针游击模式
        // this.PATROL_MODEL_GUERRILLA_RIGHT = 3;//逆时针游击模式
        // this.PATROL_MODEL_SNIPER_LEFT = 5;//顺时针狙击模式
        // this.PATROL_MODEL_SNIPER_RIGHT = 6;//逆时针狙击模式

        // this.ORIENTATION_NULL = 0;//普通朝向
        // this.ORIENTATION_LEFT = 1;//向左
        // this.ORIENTATION_RIGHT = 2;//向右

        this.OVERHANG_PER_STEP_RATIO = 20;//超距伤害距离每等级系数20%
        this.OVERHANG_PER_MAX_RATIO = 10;//超距伤害距离最大加成系数20 20*10 = 200%

        //折跃落点范围


        this.SHIP_WARP_STATUS_NULL = 0;//不在折跃状态
        this.SHIP_WARP_STATUS_START = 1;//折跃启动状态
        this.SHIP_WARP_STATUS_WARPING = 2;//折跃中
        this.SHIP_WARP_STATUS_STOP = 3;//折跃停止状态

        this.SHIP_BATTLE_STATUS_NULL = 0;//不在模块状态
        this.SHIP_BATTLE_STATUS_START = 1;//模块启动状态
        this.SHIP_BATTLE_STATUS_BATTLING = 2;//模块中
        this.SHIP_BATTLE_STATUS_STOP = 3;//模块停止状态

        this.SHIP_STEALTH_STATUS_NULL = 0;//不在隐形状态
        this.SHIP_STEALTH_STATUS_START = 1;//隐形启动状态
        this.SHIP_STEALTH_STATUS_STEALTHING = 2;//隐形中
        this.SHIP_STEALTH_STATUS_STOP = 3;//隐形停止状态

        this.WEAPON_DOOMSDAY_STATUS_NULL = 0;//不在末日状态
        this.WEAPON_DOOMSDAY_STATUS_START = 1;//末日武器启动状态
        this.WEAPON_DOOMSDAY_STATUS_ATTACKING = 2;//末日武器释放中
        // this.WEAPON_DOOMSDAY_STATUS_STOP = 3;//末日武器停止状态

        this.NPCER_RENOWN_TYPE_STRICT = 1;//森严的 无差别攻击 不衰减
        this.NPCER_RENOWN_TYPE_WARNING = 2;//警示的 靠近升级 衰减 直至初始化数值
        this.NPCER_RENOWN_TPPE_GUARD = 3;//戒备的 靠近升级 衰减 直至初始化数值
        this.NPCER_RENOWN_TPPE_NATURAL = 4;//正常的 不挨揍不还手 衰减 直至初始化数值
        this.NPCER_RENOWN_TYPE_POLICE = 5;//治安的 声望低于0 则升级 声望高于0 则不升级 衰减 直至初始化数值

        this.NPCER_AI_STATUS_FIGHT = 1;//战斗中 -10 -> -5
        this.NPCER_AI_STATUS_ALERT = 2;//警戒中 -5 -> -2
        this.NPCER_AI_STATUS_PATROL = 3;//巡逻中 -2 -> 10

        this.NPCER_PATROL_SURROUND = 0;//环绕进攻模式
        this.NPCER_PATROL_STATIONARY = 1;//定点进攻模式

        this.SHIP_BERTH_STATUS_NULL = 0;//正常状态
        this.SHIP_BERTH_STATUS_JOIN = 1;//正在停靠
        this.SHIP_BERTH_STATUS_LEAVE = 2;//正在离站
        this.SHIP_BERTH_STATUS_DEPEND = 3;//挂靠

        this.ITEM_SIZE_NULL = 0;//无
        this.ITEM_SIZE_SMALL = 1;//小型
        this.ITEM_SIZE_LARGE = 2;//大型
        this.ITEM_SIZE_FLAGSHIP = 3;//旗舰级

        this.PLAYER_FORCE_RENOWN_DEFAULT = 1000;//玩家默认初始阵营声望

        this.FORCE_RENOWN_FIGHT = 500;//声望战斗值
        this.FORCE_RENOWN_BERTH = 800;//声望停靠值
        this.FORCE_RENOWN_SERVICE = 1000;//声望服务值

        this.FORCE_TASK_CATEGORY_DIFFICULT = {
            1: {
                1: 0,
                2: 1100,
                3: 1200,
                4: 1300,
                5: 1400,
                6: 1500,
            },
            2: {
                1: 1200,
                2: 1300,
                3: 1400,
                4: 1500,
                5: 1600,
                6: 1700,
            },
            3: {
                1: 1400,
                2: 1500,
                3: 1600,
                4: 1700,
                5: 1800,
                6: 1900,
            }
        };

        this.TASK_TYPE_MAIN = 1;//主线任务
        this.TASK_TYPE_OFFER = 2;//悬赏任务
        this.TASK_TYPE_FORCE = 3;//势力任务
        this.TASK_TYPE_EXPED = 4;//远征任务


        this.TASK_STATUS_NULL = 0;//未接受
        this.TASK_STATUS_TASKING = 1;//进行中
        this.TASK_STATUS_COMPLETE = 2;//已完成
        this.TASK_STATUS_REWARD = 3;//已领取
        this.TASK_STATUS_FAILED = 4;//失败

        this.SCAN_EXACT_NULL = 0;//不显示
        this.SCAN_EXACT_DISTANCE = 1;//显示距离
        this.SCAN_EXACT_NAME = 2;//显示名称
        this.SCAN_EXACT_SUCCESS = 3;//成功

        //矿物6种的开始ID
        this.START_MINERAL_ID = 71001;


        this.PRODUCT_STATUS_NORMAL = 1;//正常
        this.PRODUCT_STATUS_PAUSE = 2;//暂停
    }

    static instance() {
        if (Static.m_instance == null) {
            Static.m_instance = new Static();
        }
        return Static.m_instance;
    }
}

Static.m_instance = null;

module.exports = Static;
