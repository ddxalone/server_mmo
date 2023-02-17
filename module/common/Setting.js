class Setting {
    constructor() {
        //地图边长 ?? 地图明明可以再扩大1000倍
        this.base_map_max_size = 1000000000000;
        //块图数量
        this.base_map_block_number = 100;
        //块图边长
        this.base_map_block_max_size = this.base_map_max_size / this.base_map_block_number;
        //块图逻辑获取范围 如果为0则为当前1个 如果为1则为9个 2=25 3=49
        this.base_map_block_range = 1;
        //断层半径
        this.base_map_grid_radius = 1000000;//1000000?
        //服务器运行帧
        this.base_server_frame_time = 100;//200
        //每运行帧执行地图逻辑帧 也叫服务帧
        this.base_run_frame = 3;
        //每5个逻辑帧服务器world逻辑循环一次;
        this.base_server_frame = 10;
        //每秒帧数
        this.base_map_frame = 30;
        //开服日期 每周开一个新服
        this.init_open_server_unix_time = 1605837600;
        //存储数据库时间
        this.base_save_db_time = 30;//300
        //小于此数为接受协议 高于此数为发送协议
        this.protocol_cut = 10000;
        //渲染比例
        this.draw_ratio = 100;
        //控制力系数
        this.pow_ratio = 100;
        //新服务器获取的安等最低要求
        this.new_server_safe_ratio = 18;
        //最高安等
        this.server_safe_max = 20;
        //最小恒星系编号
        this.server_galaxy_min = 1;
        //最大恒星系编号
        this.server_galaxy_max = 9999;
        //遍历最近的100个服务器不能重名
        this.new_server_same_name_number = 100;


        //设定每个恒星系的半径s
        this.map_galaxy_radius = 100000000;
        //恒星系随机倍数
        this.map_galaxy_radius_ratio = 5;
        //设定恒星半径 为了显示效果 恒心大小要计算100的慢速移动和10倍的显示效果增强
        this.map_sun_radius = 10000000;
        //恒星随机比例
        this.map_sun_radius_ratio = 2;

        this.player_extra_number = 100;
        //基础抗性上限
        this.base_resistance_upper = 75;
        //基础连锁范围
        // this.base_chain_range = 50000;
        //追加伤害系数
        this.base_additional_damage_ratio = 0.5;
        //推力质量转换系数
        this.base_thruster_ratio = 0.5;
        //持续主动装备启动耗电系数
        // this.base_active_cost_ratio = 20;
        //基础技能有效范围 存在则必定1级 1级20 2级30 3级40 4级50 5级60
        //1级 10 2级14 3级17 4级20 5级22 6级24 7级26 8级28 9级3 10级3.1 11级3.3
        this.base_skill_range = 10;
        //折跃开始和结束的帧数
        this.warp_static_frame = 10;
        //模块开始和结束的固定帧数 末日武器预热帧数
        this.battle_static_frame = 50;
        //NPCER模块预热帧数
        this.doomsday_battle_frame = 100;

        //空间站停靠范围
        this.station_berth_range = 50000;
        //停靠和离站的静态帧数
        this.berth_static_frame = 50;
        //进站的时候开始加速的帧数
        this.berth_start_speed_frame = 40;
        //进站或者出站开始降速的帧数 TODO 废弃
        // this.berth_stop_speed_frame = 10;

        //攻击或受攻击倒计时
        this.base_attack_frame = 3000;//5分钟

        this.npcer_renown_fight = 500;//最终声望低于这个值开始攻击
        this.npcer_renown_alert = 800;//最终声望低于这个值开始警戒

        this.base_min_renown = -2000;//基础最低空间声望
        // this.base_max_renown = 0;//基础最高声望

        //射线扫描帧数
        this.base_ray_frame = 10;

        //基础扫描范围 算上加成最大不能超过 10000000000 块图边长 最低不能小于 1000000000 恒星间距
        this.base_scan_range = 6000000000;
    }

    static instance() {
        if (Setting.m_instance == null) {
            Setting.m_instance = new Setting();
        }
        return Setting.m_instance;
    }
}

Setting.m_instance = null;

module.exports = Setting;
