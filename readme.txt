
source 核心代码
    config 配置信息
    data 数据
    common 公共方法
    modules 模块层
        network 网络
            websocket
            http
        database 数据库层
    protocol 协议层
        base_protocol
    logic 逻辑层
        base_logic
    service 服务层
        base_service
        server 服务器信息
        world 世界服务
        map 地图服务
        chat 聊天服务
        player 玩家层
            money 货币处理
            info 信息处理
    entity 实体层 配合数据库
        base
        uuid
            list
            info
        group
            list
            info
        company
            list
            info
        player
            list
            info
        fight
            list
            info
    dao dao层 配合数据库
        base
    player 玩家层
        proxy 协议层
        logic 逻辑层
        model 模型层
        entity 实体层
        dao dao层


        module
        logic
        service
        info




        这样规划不合理
            例如日志系统,本身就是一个模块,
            但是任意地方都可以调用,那可能从dao层调用module层的代码了
            并且做了半天发现结构树太复杂 require 需要用到大量的../../../非常不直观
            还是按照模块自己分层吧.自己模块的需求决定分多少层


        m_模块层
            负责接口类处理 然后分发到逻辑层
        l_逻辑层
            逻辑层 链接各个service层进行处理
        s_服务层
            服务层 主要负责entity data层的数据处理
        d_数据层
            数据层 和entity平级 处理非数据库持久化数据
        c_配置文件

        p_局部变量
        g_全局变量




        m_模块层
        l_逻辑层
        s_服务层
        d_数据层


微型
小型
中型
大型
巨型
旗舰


空间站名称



主权范围
3个帝国势力
甘纳帝国 乔索贵族 亚纳海盗
博尔联邦 卡迪集团 瓦格同盟
欧伏部族 索萨邦国 底斯部落


共和国
合众国
政府

萨德斯克玛艾恩格诺尔沃纳弗曼托格索伏迪欧

艾德 诺萨 欧玛 欧克 欧斯



统一合作关系部
共和国
王国
财团
联合体
矿业
部落
共济会
真理会
XX团
海盗
联合企业
同盟
共和国
集团
社团

后勤部
工业
工作室
物流公司
销售部
住宅公司
星域银行
现代金融
合作组织
商业俱乐部
办公署
商业法庭
海军
服务公司
保安公司
空间航线巡管局
联合警备队
应用知识学院
加达里后勤部
共和议会
共和舰队
共和国司法部
市政管理局
共和安全局
米玛塔尔矿业联合体





3个中立势力
同盟国
-- 教会
贵族
集团
财团
-- 部族

3个敌对势力


高安任务 大量针对势力任务 少量敌对任务
低安任务 少量针对势力任务 大量敌对任务
海盗任务 大量针对势力任务 少量不减声望的任务

XX海盗领主
XX无人机母巢
部族XX族长 前锋
教会XX教主 执教
XX机械体首脑




-- 军委会 战斗任务
国安委 战斗任务
物流运输部 运输任务
-- 海军 战斗任务
-- 军事安全 战斗任务
-- 指挥部
发展协会 采集任务
-- 集团
槽位*伤害系数=dps HP 秒数
2*10=20 500 = 25秒
4*10=40 1000 = 25秒
3*30=90 5000 = 55秒
6*30=180 10000 = 55秒
4*90=360 50000 = 138秒
8*90=720 100000 = 138秒
建筑
8*18=144

最低dps 0技能下
2*3弹药 10点伤害 2秒射速 = 30dps
2炮60dps 护卫战斗至少持续20秒
护卫需要1200有效


map_galaxy_radius(直径) * 10 * 2 / 2 随机5倍 再加上恒星的半径 再加上额外算了一圈

全面提升被动槽位数量从4-8

槽位分布
新手船 2 2 2
护卫舰 2 3 3 = 6 微型
    零级 6
    一级 6
    二级 7
    三级 7
    四级 8
    五级 8
驱逐舰 4 3 4 = 7 微型
    零级 7
    一级 7
    二级 8
    三级 8
    四级 9
    五级 9
巡洋舰 3 4 5 = 9 巨型
    零级 --
    一级 --
    二级 9
    三级 9
    四级 10
    五级 10
战列舰 6 4 6 = 10 巨型
    零级 --
    一级 --
    二级 10
    三级 10
    四级 11
    五级 11
无畏   4 5 7 = 12 旗舰 会战模块
    零级 --
    一级 --
    二级 --
    三级 --
    四级 11
    五级 12
泰坦   8 5 8 = 13 旗舰 克洛诺斯(神) 泰西斯(海) 瑞亚(星)
    零级 --
    一级 --
    二级 --
    三级 --
    四级 12
    五级 13


    穿梭舰 2 3 4 = 7 跃迁类装备效率提升100%
    截击舰 2 4 3 = 7 推进类装备效率提升100%
    -- 运输舰 货舱容量提高100%
    狙击舰 4 3 5 = 8 射程提升100%
    侦查舰 4 4 4 = 8
    -- 电子舰
    -- 打捞舰
    突击舰 3 5 5 = 10 武器伤害增加100%
    轰炸舰 3 4 6 = 10 可装备巨型武器
    -- 采集舰 采集效率增加100%
    -- 强运舰 货舱容量提高100% 武器-3
    -- 干扰舰
    攻击舰 6 5 6 = 11 武器转速提升100% 堡垒模块
    堡垒舰 6 4 7 = 11 转速降低50% 伤害提升100%
    -- 强击舰 转速降低50% 伤害提升100%
    -- 攻坚舰 转速降低50% 伤害提升100%
    -- 特勤舰 转速降低50% 伤害提升100%
    -- 采掘舰 开启模块效率提升100% 堡垒模块
    -- 后勤舰
    歼星 4 6 7 = 13 转速降低50% 伤害提升100% 会战模块
    -- 货舰
    混沌 8 6 8 = 14

    所有世界单位构成[断层]
    -- 服务器ID用于开新服,主世界创建不同的断层,把市场订单等隔离,
    一但用户有更改旧世界的逻辑,则增加提示(脱离新手保护一类的),如果用户同步,将server_id改为0放到主世界内去 可以要求用户必须在空间站内
    如果到期(30天),则增加单区自动维护将所有数据放到主世界

    舰船受到攻击必定在一个断层(grid)
    建筑收到攻击,派发事件由其他方式通知

    断层创建 断层合并 断层分离 断层移除

    所有断层单独处理 只有在线用户可以创建新的断层
    玩家断层1倍断层增加迷雾
    断层创建后直接绑定坐标
    跃迁到一个位置 如果断层不存在 进行断层创建 否则加入断层  (暂时无视舰队)
    跃迁离一个位置 将自己移除断层
    断层增加是否活跃标志 有玩家的标记为活跃 其他不做帧同步逻辑处理
    断层检测 1-10秒1次就行
    地图移动 超出断层0.5倍距离    创建新的断层 把这2个断层关联
    如果断层内无物体 直接移除此断层
    如果用户 进入到重叠区域 则随机获取一个断层赋值即可
    所有NPC不会垮断层 当移动到断层0.5处 则往回移动

    太空抛物?


    需实测断层是正方形效率高还是圆形

    //这个方案感觉可行
    每次跃迁到地点产生一个grid 所有创建的物品放到grid里
    玩家单独自己一个虚拟grid 当远离生成新grid 与旧的grid合并  过一段时间后 一起处理消失

NPC建筑
高安的就1份
安等>0  攻击超过5%会有提示 超过10%有巡逻警察 根据安等决定到场时间

低安的允许
安等<0  不会有巡逻警察

星系之间 或 安等 < 0 没有主权 为法外之地
高安任务不会刷在法外之地
高安信号不会刷新在法外之地


安全等级

舰船爆炸进入维修系统
装备50%掉落 其他系统回收

资产转移系统
如果空间站爆炸 则漂浮一个无法被扫描的箱子 只有本人或者有权限的军团可定位


扫描系统
隐身系统



增强时间

武器系统
    自动开火
    重复

声望系统
技能系统
    -- 精通点数
    舰船精通 按照时间增加技能
        护卫舰操控学 所有武器伤害增加%
            截击舰操控学 伤害增加% 速度增加%
            穿梭舰操控学 速度 跃迁
            特勤舰操控学 隐身耗电 隐身折跃
        驱逐舰操控学 伤害
            狙击舰操控学 伤害 射程
            侦查舰操控学 扫描时间 跃迁
            偷猎舰操控学 隐身耗电 隐身加速
            -- 干扰舰操控学
            -- 拦截舰操控学
            -- 破坏舰操控学
            -- 登陆舰操控学
        巡洋舰操控学 伤害
            突击舰操控学 伤害 抗性
            轰炸舰操控学 伤害 射程
        战列舰操控学 伤害
            攻击舰操控学 伤害 转速
            堡垒舰操控学 伤害 射程
        无畏操控学 伤害
            歼星操控学 伤害 转速
        泰坦操控学 伤害
            混沌操控学 伤害 抗性


    武器精通 开炮增加技能
        微型射弹武器操控学 伤害
        微型制导武器操控学 伤害
        微型能量武器操控学 伤害

        微型武器控制理论 转速
        微型武器射击理论 射程
        微型武器散热理论 耗电
        微型武器优化理论 需求能量

        巨型射弹武器操控学 伤害
        巨型制导武器操控学 伤害
        巨型能量武器操控学 伤害

        巨型武器控制理论 转速
        巨型武器射击理论 射程
        巨型武器散热理论 耗电
        巨型武器优化理论 需求能量

        旗舰级射弹武器操控学 伤害
        旗舰级制导武器操控学 伤害
        旗舰级能量武器操控学 伤害

        旗舰级武器控制理论 转速
        旗舰级武器射击理论 射程
        旗舰级武器散热理论 耗电
        旗舰级武器优化理论 需求能量


        -- 高效射击理论 射速
        -- 武器装配优化理论 需求能量


    船体精通
        电容存储理论 电容量
        电容充能理论 回电速度
        能量精通理论 能量最大值
        质量优化理论 减少质量
        护盾扩充理论 护盾值
        护盾充能理论 回盾速度
        装甲增强理论 甲量

    导航精通
        加速操控理论 舰船最大速度
        折跃引擎优化理论 减少折跃耗电
        折跃引擎校对理论 增加折跃距离

        微型推进器增效技术 推进器最大速度
        微型推进器节能技术 推进器耗电
        微型推进器优化技术 推进器能量需求

    维修精通
        微型护盾维修增效技术 修量
        微型护盾维修节能技术 耗电
        微型护盾维修优化技术 能量

    -- 抗性精通
        微型护盾电磁抗性增效技术 护盾抗性装备 基础抗性增加%
        微型护盾爆破抗性增效技术 护盾抗性装备 基础抗性增加%
        微型护盾热能抗性增效技术 护盾抗性装备 基础抗性增加%
        微型护盾抗性节能技术 护盾抗性装备 基础抗性增加%
        微型护盾抗性优化技术 护盾抗性装备 基础抗性增加%

    扫描精通
        舰载扫描仪校对理论 强度
        舰载扫描仪效能理论 扫描时间



舰船技能 操控学
舰船武器伤害 操控学
舰船武器附加 理论
舰船加成 理论
舰船装备加成 技术



技能点规则
技能最高50级
技能加成最高50%
加减都50%

每秒增加1点自由技能
舰船行驶和战斗 每天24小时在线可额外增加大概半天的技能点
其实应该是驾驶的时候增加的更多 但是怕24小时挂机的
这样规划下来 一般来说同时增长的技能有10-20个   一共就是4W 技能点 每个技能增长2K 每小时增长100 约等于没涨....
-- 要不增加 自由技能点 和 活跃技能点 不好限制玩家在线时长了
1X技能5天完成 = 5 * 86400


武器精通还缺少模块的加成


曲线 和 是 432002
2
6
18
40
70
114
170
242
330
434
560
704
868
1056
1266
1502
1762
2048
2362
2704
3076
3478
3910
4374
4872
5402
5968
6568
7206
7880
8592
9342
10132
10962
11832
12746
13700
14700
15742
16828
17962
19140
20366
21640
22960
24332
25752
27222
28744
30316





抗性装备如果分大中小
小船一共没几个槽位 抗性再小这肯定没人装了
整体来说 感觉装备类型太多 槽位太少

移除主动抗性 不再规划抗性大中小
移除技能关于抗性的分类和设定 如果单抗40再加上技能50%基础加成  就60%
没技能的时候太弱 有技能的时候太强

移除所有关于质量的技能加成和装备加成 这个质量影响的范围太广了 包括 折跃耗电 隐身耗电 转身速度
如果按照50%的话 怕数值控不住 电量增加50% 折跃耗电减少50%  质量再减少50% 折跃距离会增加(影响很小)
这样的话 有一点电 就可以折跃走了 不好抓人 没有反跳需要通过PVE电量来控制逃跑
修 开炮 推子 都是耗电大户 开炮肯定耗不了太多点 如果用户选择不带推子 修又是满血停修 玩家再躲避一下子弹 电容基本是满的

尽量减少关于装备加成的技能
目前看 炮台(细化) 修 隐身 模块 有必要加成
抗性 武器升级 没啥必要
抗性已经移除了 武器升级扩大伤害可以有 扫描升级无关紧要 可以有
都按照25%来算的话 伤害不太够 拉不开差距

技能正负25%
整体设计 开炮 开修(有变数) 开推子 满技能永动没问题 但是加上折跃电要不够
带注电 或者1个电池(100%电量增加) 或者1个被动回电 折跃也够

低技能 开炮 开修(有变数) 永动没问题 折跃必须要等回电
带注电 可折跃  带2个被动回电 也可折跃永动


这样技能加成暂定20-30级上限 正负20% 一进一出  差不多有1.5倍差距

折跃耗电为整个游戏电量平衡的核心 抓人和反抓

无加成的船 折跃耗电要至少大于25% 破除永动
0技能也要实现舰船能折跃
假设30级技能上线 电量120 折跃耗电 80  启动百分比 80/120=67%
假设30级技能上线 电量130 折跃耗电 70  启动百分比 70/130=54%
假设40级技能上线 电量140 折跃耗电 60  启动百分比 60/140=43%
假设50级技能上线 电量150 折跃耗电 50  启动百分比 50/150=33%
必须设定冗余 有自回电 折跃距离 诸多因素

1通过扫描范围控制 2通过折跃距离控制

盾扩 钢板 电池 装备加成大概50%
其他装备加成大概25%
再加上装备的附甲属性套装属性

电磁
爆破
热能

git

截面半径
爆炸半径

爆炸速度
航行速度

质量

武器槽位 最多8个
模块槽位 最多8个
主动 被动
增加伤害3种
增加武器属性
电容回充速度
电容量
护盾抗性
装甲抗性
修护盾
修装甲
增加速度
减少跃迁时间
减少跃迁电容需求量


帧同步 map
状态同步 world


js number 最大支持 -9007199254740991 9007199254740992
按照地图像素精确到小数两位 每屏1000 像素 一共可以存储 90071992547 * 2 屏 的信息
结论足够用了
console.log(Math.floor(9007199254740992 / 100 / 1000));

一个轴
地图大小 10000000000000000  = 100000000000000 像素大小 = 100000000000 屏 = 100000000 恒星系
这个规划太大了 扩大恒星系直径到1000屏间距99000屏
地图大小 10000000000000000  = 100000000000000 像素大小 = 100000000000 屏 = 1000000 恒星系

10000个星系不能再多了
把宇宙分割为100*100份 每次遍历自己和正负+1的范围的物体
跃迁或者行进1000KM 判断一次是否 进行world切换

反推
规划10000个恒星系
每轴 100 恒星系 = 1000000 屏 = 1000000000 像素 = 100000000000 点 距离js最大值还差100000倍


最终
1屏 = 1000*100点 = 10W点
断层直径 = 10屏 = 100W点
恒星系大小1E点 = 1000屏 = 100个断层


宇宙地区则遍历全部,目前只有宇宙地图可能会用到全部
将世界分割成数个模块 断层之外的遍历 只遍历当前和附近的模块

现在开始规划宇宙大小
视觉效果 同屏出现 2个行星 1个恒星比较合适
一个恒星系一般按照5-20个行星规划 直径 = 200屏
舰船航行速度最快5-10秒 横穿星系大概要1000秒 16分钟
一个任务空间 大概5-10屏 比较合适  一个星系 一条直线 可以放置 40(1600) 个任务空间

恒星系间的距离 暂定 800屏
一条直线可以放置 1亿个星系

一般舰载扫描可以扫描附近 49个星系的数据 半径就是3倍恒星系大小 即3000屏 直径7000屏 每区块3000屏大小

把世界平分为10000份
不可移动的舰载扫描的东西都放到 [100][100] 这个数组去

旗舰视角世界放大3倍
1px=0.1km

物资迁移功能


矿物采集 采用立体视角 从恒星行星卫星采集



宇宙??universe
星系信息从数据库读取 galaxy
恒星信息从数据库读取 sun
行星信息从数据库读取 planet
空间站信息从数据库读取 station
堡垒信息从数据库读取 bastion




布普德特格阿巴帕达塔加艾拜派戴泰盖埃贝佩态垓厄伯柏伊比皮迪蒂吉乌杜图古奥博波多托戈鲍堡道陶高尤久安班潘丹坦甘因恩本彭登根宾平丁庭金昂邦庞唐汤冈翁蓬东通贡邓藤克夫弗兹斯什奇思卡瓦法扎萨莎贾查撒凯塞沙泽瑟舍哲彻基维菲齐西希库武富朱苏舒丘科沃福佐索肖乔赞桑香詹钱肯文芬增森申琴康冯方藏琼孔丰宗雄赫姆尔伍哈马纳玛娜拉夸亚海迈奈莱怀黑梅内雷韦惠奎耶陌勒米尼利丽威霍莫诺洛罗约休纽柳留汉曼南兰万旺温



UI从右到左 按钮
1 观察模式 控制模式
2 游击模式 狙击模式

横向移动速度减半 可考虑技能加成
增加狙击模式 和 游击模式
狙击模式 自带 舰船转动和武器转动 相当于转速*2 但是放弃了50%的移动能力





扫描 类型
星球 实体 信号 舰船?

如果任务公共那和死亡空间有啥区别?

任务公共可以有效减少服务器负载 根据贡献度 分奖励
私人任务  可以做剧情和故事线
也可以让无聊的人刷刷刷

代入感两者差不多



知识书



武器
激光 导弹 射弹
微型 巨型 旗舰

机制 触发 间隔N秒持续N秒

主动
盾修 大中小 节能的(省电) 紧凑的(需求) 高效的(修量) 附加的(抗性) 技师的(学习速度) 超载的(盾量?)
紫色 触发双倍 触发节能 抗性增加
N秒不受攻击 额外增加N护盾
大量提高电容转化效率
大量减少消耗电容
套装
召唤无人机摇修自己 每隔N秒召唤一个无人机 最多N个

甲修 同盾修

推子 大中小 启动耗电 每秒耗电
节能的 紧凑的 高效的 附加的 超载的(灵敏)
紫色 触发双倍 触发节能 抗性增加
套装
大量增加转身速度
大量增加横向速度
大量增加最大速度
自己不受碰撞影响
大量减少消耗电容

启动时向前跃迁一小段距离


隐身 激活一段时间进入隐身 被击中中断 激活耗电 持续耗电 电容%耗电
节能的(省电) 高效的(加快隐身速度) 超载的(减少重置时间) 附加的(速度)
紫色 受到攻击不中断隐身 触发双倍 触发节能
套装
电容高于N%时隐身不耗电
隐身可折跃

模块 电容%比耗电
移动速度降低90% 船体转向速度降低90% 伤害提升100% 射程提升100%
节能的 紧凑的 高效的(伤害和射程额外增加) 增益的(减少副作用) 技师的
紫色
套装
召唤影子


注电 快速充能电容 有CD
大中小 高效的(电量) 紧凑的 快速的(减少CD) 加速的(增加移动速度?)
紫色
电容低于多少自动加多少电 最多N秒触发一次



护盾抗性 单抗全抗
节能的 高效的 超载的
装甲抗性

被动
盾扩
钢板
回电
电容量
最大速度
灵敏度(质量) 影响加速度等 转向速度
货舱
跃迁耗电减少

武器伤害(全部)
武器射程(全部)
-- 武器射击速度(导弹,射弹专属,激光增加叠加速度)
-- 叠加伤害(激光专属)
武器转速(射弹,激光专属,导弹增加转向速度)


白装 蓝装 金装 紫装 绿装(套)
蓝装 一条随机属性
金装 两条随机属性
紫装 固定属性
绿装 固定属性 套装属性牛B


装备不可以设计大中小属性
只是通过能量值来限定装备空间



死亡空间规划
共6级 分别对应6个基础舰船类型
护卫 驱逐 巡洋 战列 无畏 泰坦
因为都是开放空间 所以不限制进入条件
难度依次增加
所有死亡空间等级以本等级舰船类型为主 向下浮动





整体比例1    :    2    :    4
具体比例1 : 1.2 : 2 : 2.4 : 4: 4.8

世界单位比例 1像素=100M
小中大
舰船半径比例
50:60:100:120:200:240

舰船质量单位(t)比例
10:100:1000

装备质量单位(t)比例
1:2:4

舰船货舱单位(t)比例
5:20:80

舰船速度单位(m/s) 横向速度减少50%
比例:64:16:4
意义:64=64像素每秒=6400M/S=6.4KM/S

质量加速公式(系统解释:舰船越大,虽然质量越大,但是引擎推力越大)
因为同时增加最大速度和推力 所以时间一致
10t 2秒到达满速 引擎推力 1mn 同级别推子 1mn
100t 10秒到达满速 引擎推力 2mn 同级别推子 2mn
1000t 50秒到达满速 引擎推力 4mn 同级别推子 4mn

10t 5秒到达满速 引擎推力 1mn 同级别推子 1mn
100t 10秒到达满速 引擎推力 5mn 同级别推子 5mn
1000t 20秒到达满速 引擎推力 25mn 同级别推子 25mn

质量转动公式
10t 5秒旋转180度
100t 10秒旋转180度
1000t 20秒旋转180度

血量比例
1:2:10:20:100:200
1:2:4:8:16:32:64

电容比例
1:2:10:20:100:200



那些船越大数越小的就只能百分比 或者大中小固定值
例如 速度 转速 血量

抗性介于两者之间 但是基础属性是百分比 所以只能百分比


血量是根本固定值 盾扩钢板 加成固定值
修分大中小和血量挂钩所以 固定值
??盾提 甲提 加成百分比
修要耗电 所以电容也分大中小 固定值 回电 固定大中小?电池 固定大中小?
推子耗电 但是和质量挂钩 百分比

被动 减质量的 百分比
被动 加最大速度的  百分比

主被动 抗性 只能百分比 可分大中小

被动 武器转速 只能百分比 可分大中小
被动 武器伤害 只能百分比 可分大中小


折跃耗电 %还是固定??? 最好固定 那就要和质量挂钩
隐身耗电 %还是固定??? 最好也固定 那就要和质量挂钩


穿甲弹穿甲弹穿甲弹



技能和装备同步方法
方案一
玩家的基础舰船数据 采用后端传递
玩家的技能加成 直接作用于舰船基本数据
玩家将所有装备传递过来
前端合并(基础数据(含技能加成)) + 所有装备

方案二 先采用这种方案 前后端统一更好处理
玩家的基础舰船数据 读取本地
后端把玩家技能和装备传递给前端
前端合并 基础数据 技能加成 装备属性
优点 玩家技能升级时 传送数据较少
缺点 每个舰船需要传递完整技能列表
缺点 断层更改时 数据量会不会太大



增加爆炸半径
每颗弹药爆炸时持续1秒 如果敌方舰船速度很快可以逃离这个爆炸范围 则可以减少受到的伤害
有个歧义 理论上越大的武器 爆炸半径越大 再增加一个爆炸时间??





编号规则 想想如何纳入后台



主权归属 以势力空间站为准 谁多算谁的
一样多 就是争夺中  这是NPC之间的战争

玩家的话 只要本地非NPC 即可宣布主权 也以空间站数量为准



在整理玩家舰船属性值发现各个值存储的地方很多很散 这里先统一规划一下

局部变量ship_base_info为原始基础信息
算上加成(技能 被动装备 属性)后放到base_info里
额外增加sped字段 使用推子前的值
当前护盾 装甲 速度 电容 玩家的在dao里  npc的在this里

抗性可以用当前抗性(主动装备) 基础抗性(加成后)来记录

目前采用人舰合一的方案 所以坐标朝向存储到玩家信息里去了
护盾 装甲 速度 电容 拥有当前值和最大值
抗性和速度有主动使用装备 还需要一个东西记录使用前和使用后的值

玩家出现的属性有以下
属性 当前 基础 加成后
坐标 1
朝向 1
护盾 1 1 1
装甲 1 1 1
速度 1 1 1
电容 1 1 1
半径 0 1 1
质量 0 1 1
能量 0 1 1
盾抗 0 1 1
甲抗 0 1 1


声望问题
凡是进入任务空间或者死亡空间的所有玩家都会被死亡空间的NPCER攻击
NPCER互相攻击的问题??
暂时先分2派吧
野外

map系列是地图帧每秒5次 (逻辑帧)
frame系列是运行帧每秒30次

运行帧
base_run_frame 5
处理帧
base_server_frame 6
地图帧 每秒
base_map_frame 30
渲染帧
base_draw_frame 60


100微近单体 磁轨炮 核芯弹 集束器
150微远单体 加农炮 高爆弹 脉冲器
200微近散弹 散弹炮 轨道弹 相位器
300微远散弹 重解炮 离子弹 激光器
400巨近单体 磁轨炮 核芯弹 集束器
600巨远单体 加农炮 高爆弹 脉冲器
800巨近散弹 散弹炮 轨道弹 相位器
1200巨远散弹 重解炮 离子弹 激光器
1600旗舰近单体 磁轨炮 核芯弹 集束器
2400旗舰远单体 加农炮 高爆弹 脉冲器
3200旗舰近散弹 散弹炮 轨道弹 相位器
4800旗舰远散弹 重解炮 离子弹 激光器



微型100mm频射炮
微型125mm散弹炮
微型150mm加农炮
巨型400mm频射炮
巨型450mm散弹炮
巨型600mm加农炮
旗舰级1600mm频射炮
旗舰级2000mm散弹炮
旗舰级2400mm加农炮
微型100kt轨道弹
微型125kt速射弹
微型150kt散射弹
巨型400kt轨道弹
巨型450kt速射弹
巨型600kt散射弹
旗舰级1600kt轨道弹
旗舰级2000kt速射弹
旗舰级2400kt散射弹
微型100MW激光束
微型125MW量子波
微型150MW聚射线
巨型400MW激光束
巨型450MW量子波
巨型600MW聚射线
旗舰级1600MW激光束
旗舰级2000MW量子波
旗舰级2400MW聚射线



加农炮 散弹炮 频射炮 火炮
口径

轨道弹 速射弹 散射弹 火箭弹 鱼雷 制导弹
tnt单位

激光束 量子波 聚射线
穿透   大伤害持续时间长   小伤害短时间
能量单位


质子炮
频射炮
火炮
散弹炮
榴弹炮
速射炮
聚变弹


轨道弹
导弹
鱼雷
复式鱼雷
巡航导弹
轨道弹
核子弹

极光
射线
光束
激光
光束
激光束
量子波




前后端进入战场逻辑完全不同 好像没发同步规划
1 玩家登录
后端 创建玩家信息 把玩家移动到grid 先读取info 和 base 再加入断层
前端 接受后端数据 创建信息   先创建断层 再创建info 和 base

2 npc创建
后端 同玩家登录 能整合么??

2 玩家移动断层
后端 直接把玩家变量 移动到断层
前端 接受后端数据 放到当前断层



trigger

某ID死亡
id: 10001
当前阶段舰船数量<N
step_less: n
所有舰船数量小于N
total_less: n


ship_type类型小于n
ship_type : 101
type_less : n


安全等级20最高 0最低

安全系数:一般 高安
安全系数:危险 高安
安全系数:可怕 低安
安全系数:恐怖 低安
安全系数:致命 00

5个难度
6个大等级 影响掉落
18个小等级 影响掉率

-- 中转哨站
巡逻哨站 一般 17-20 200 护卫 71100 7000
科研哨站 危险 15-18 160 护卫 71200 7100
前线哨站 可怕 11-14 120 护卫

前沿阵地 一般 16-19 200 驱逐
基础阵地 危险 14-17 160 驱逐
作战阵地 可怕 10-13 120 驱逐

中转据点 危险 13-16 160 巡洋
战略据点 可怕 9-12  120 巡洋
野战据点 恐怖 5-8   80  巡洋

后勤基地 危险 12-15 160 战列
空军基地 可怕 8-11  120 战列
军事基地 恐怖 4-7   80  战列

工业堡垒 可怕 7-10  120 无畏
战斗堡垒 恐怖 3-6   80  无畏
武装堡垒 致命 1-4   40  无畏

防御要塞 可怕 6-9   120 泰坦
核心要塞 恐怖 2-5   80  泰坦
集结要塞 致命 0-3   40  泰坦



地图                          舰船面板
缩放


角色
技能
声望
装配
物品
军团
舰队??
星图
扫描
坐标



最近一句聊天                      武器

聊天弹窗 系统 星系 军团 私人




扫描
空间站 天体 信号 舰船 收藏

编号 名称 类型 距离 信号强度 操作
                            扫描 折跃 舰队折跃

名称 类型 距离 操作



护盾
装甲
电容
速度
线图


基础属性 * (1 + 技能加成) * (1 + 装备加成和)

=16*9=144种舰船  有点多
=3*16+6*6=48+36=84  擦也不少

=3*16=48

-- 舰船属性
1 => '欧伏部族', 射弹武器 高甲高盾
2 => '博尔联邦', 制导武器 高速度
3 => '甘纳帝国', 激光武器 高电量
4 => '索萨邦国', 射弹武器 高回血优势
5 => '卡迪集团', 制导武器 高转向速度优势
6 => '乔索贵族', 激光武器 高回电
7 => '亚纳海盗', 射弹武器 半径优势
8 => '底斯部落', 制导武器 质量优势
9 => '瓦格同盟', 激光武器 能量优势

-- 品质装备 主属性加成
1 普通 白 0%   无额外属性
2 改良 绿 5%   无额外属性
3 强化 蓝 10%  无额外属性
4 稀有 金 15%  一条额外属性(势力属性) 40%加成
5 史诗 紫 20%  两条额外属性(套装属性) 80%加成 套装40%
6 传说 红 25%  三条额外属性(套装属性) 120%加成 套装80%


总结 所有装备 帝国 拥有 中立和敌对的 同种族的
就是每种势力装备 有2种  帝国或中立 帝国或敌对



加技能 转伤

//废弃的逻辑
射程
转速
伤害

电量

盾修量
甲修量
回电

速度
盾量
甲量




-- 极品装备获取方式
友好声望通过任务方式获取
敌对声望通过死亡空间获取
史诗任务  死亡空间  发明合成?



装备数量
属性编号 和 属性对应关系 可以考虑静态
f 最小值
t 最大值
s 设置值
e 特殊值



装备更改计划3.0
所有装备固定属性
无随机属性 可堆叠



构思一下前端后端各自  玩家舰船属性附加和NPC舰船附加   以及装备处理方式

玩家 舰船 后端
从player读取 ship_type
根据ship_type读取舰船基本数据
读取所有装备 赋值武器 以及属性赋值 刷新舰船属性
坐标角度 当前盾量甲量电容速度


NPC 舰船 后端
读取ship_type
根据ship_type读取舰船基本数据
读取武器
坐标角度 当前盾量甲量电容速度




不设计增益模块的装备 例如盾提 给隐身抗性模块增益的装备
设计增益武器的装备 例如武器提升

1.赋值舰船基础属性

2.遍历武器
2.1赋值武器基础属性
2.2赋值舰船属性和武器属性

3.遍历主动装备
3.1赋值基础属性
3.2赋值属性

4.遍历被动装备
4.1赋值基础属性
4.2赋值属性


装备初始化
1.读取基础属性
2.读取属性 赋值给自己

刷新属性
遍历装备读取属性 判断是否上架
赋值给舰船 最后赋值给武器



读取用户
x y rotation 装备
读取舰船基础信息
读取武器坐标



品质属性直接修改base 废弃


不太想设计直线拐歪的弹幕  设计了
不太想设计飞一段时间再发散的弹幕 设计了
躲过去就是躲过去了  废弃 npc的尽量不设计

定义多重打击为激光特色 取消  改为都可
定义弹药数量为弹药和导弹特色 取消 改为都可

现在多重打击次数按照最小帧处理的 即 0.2秒
现在弹药散射角度为每个弹药的角度 废弃了
现在是按照飞行距离计算终点爆炸坐标 不是按照时间 不错 切合设计逻辑

射弹武器 extra 设计
延迟发射 根据波次(不是多重打击)
延迟 波次
d = {'m':2}
平行 平行宽度
p = {'w':30}
弧度 初始角度s从f度到t度,每次修正s度 变量有正负
r = {'s':20,'f':0,'t':40,'s':5}
环绕 有子弹超时的风险 效果也需要再议
扫射 貌似和机制冲突 每秒最多5发 效果不好

2021-04-26 武器精简 从4 5开始改变弹药轨迹
-- 规划一下 看看行不行
加农炮1 折返炮?? C轨迹 II型 2联2发 III型 1发
散弹炮1 O型 S型 8型 A型 扫射 来回扫射 N连射 固定初始角度

加农炮
散弹炮

轨道弹 男枪跟踪单
复式弹 后发

量子波 光棱坦克 连锁 持续 矩形(和弹药有啥区别) 女枪散弹
激光束






玩家弹幕及NPC弹幕
1.尽可能充分发挥帧同步游戏优势
2.尽可能参考横版飞机类游戏
3.要求玩家以一敌百
4.弹药发射过程不考虑真实性 要效果

设计特色如下:
设计方向
玩家弹幕 以 快 多 易命中 范围大为特色
目前已经设计了9种基础弹药模式
射弹武器 单发 散弹 连发?
制导武器 单发 散弹(未全部完成) 连发?
激光武器 单发 连发 连锁? 持续发射(未完成)? 长条状激光?

暂时想到未来要设计的
固定各种轨迹弹药(8字形 0字形 S字形)
弹道暂停一段时间 然后以很快速度射出
持续发射型激光 块状激光 折射激光


NPC弹幕 以 多 慢 预判特效(激光) 固定角度(弹幕造型)为主要方向
无用的子弹一定要多
极少量引用制导武器和激光武器
极少设计不可躲避的弹幕

综上以上弹幕
小船以躲为主要玩法 发射弹幕 弹药速度快 发射速度快 高命中 低伤害
大船以抗为主要玩法 发射弹幕 弹药速度中 发射速度慢 高范围 高伤害
平衡性 引入爆炸速度(其实不想设计这种数值)


激光机制修改
激光可变性 不一定要以目标为终点
可实现 可变 多重 折叠 等效果
激光可变 参照射弹武器 按照固定移动速度规划路径
中途遇到打击物则做激光武器的局部渲染





飞船在走merge改变的时候 需要移除所有的弹药  或者把所有需要用到的玩家的信息 赋值到弹药上
不然 弹药在飞行过程中 此时有玩家加入到这个merge 必然会有东西处理不了





导弹可通过extra动态设定敏捷
frame_max_rotation 做成一个方法

导弹增加 导弹方向的机制
在未调整某个属性前 导弹不执行自动导航
试了一下  暂时不改版问题也不大


要不要增加根据extra实际计算后获取的真实射程???  有效射程

调整武器在命中时就要计算剩余运行里程




舰船不分种族


玩家装备 弹药导弹激光 大中小 每种2种规则 每种装备 普通1 改良1 强化(势力)3 稀有若干5 史诗若干5 传说若干5
3*3*2*20 = 共计360种武器
单发 弹药数量2 多重打击N
散射 弹药数量N 多重打击2






TODO
折跃信号干扰器

技能增加的时候增加横向拖动 效果不错




如果空间站要做血量的话 就不能使用静态文件
如果行星要做采集的话 也就不能使用静态文件











船体属性

武器
每秒总伤害
电热爆
最大射程


护盾
护盾  当前/最大
护盾回复    当前
护盾抗性
电热爆


装甲系统
装甲  当前/最大
装甲维修 resume 当前
装甲抗性
电热爆



船体系统
能量  当前/最大
速度  当前/最大
电容  当前/最大
回电 charge 当前
半径
质量




信息看板
map npc 不显示需求
map 玩家看板 显示装备?

普通 npc看板 (无此情况)
普通 玩家看板 只显示舰船基础信息 描述 需求

查看NPC的舰船 和 玩家的舰船 当成类似物品的显示处理方式即可
map 查看玩家 打开舰船面板
map 查看自己 打开装配面吧




武器属性看板
5个标签?
信息 基础属性(武器) 扩展 额外 装备属性(套装属性) 需求 弹幕

普通装备属性看板
信息 属性 需求



射击间隔



基础属性
伤害
电热爆
每秒伤害
电热爆
射程
射击速度
伤害系数damage

弹药数量count
多重打击multiple
爆炸半径blast
爆炸速度sustain


需求能量require
电容消耗cost


如果两排


基础属性
伤害
电热爆
每秒伤害
电热爆
射程          射击速度
-- 伤害系数
弹药数量      多重打击
爆炸半径      爆炸速度
需求能量      电容消耗
特殊属性
1
2
3
套装属性
1/6件 2/6件 3/6件 4/6件
5/6件 6/6件
1
2
3


装备的

基础属性
抗性
需求能量
电容消耗
特殊属性
1
2
3
套装属性
1/6件 2/6件 3/6件 4/6件
5/6件 6/6件
1
2
3


3
4
5
6
7
8


散射角度scatter
弹药间距space


套装编号suit_type
武器再加一个 套装需求件数 就可以实现套装有多个武器了

微小中大巨旗舰


新手 2 1 1
跑得快的 2 2 1
折跃块的 2 1 2
扫描的 2 1 2
攻击的 2 2 2

高级跑得快
高级折跃快
高级扫描


T1 护卫舰操控学 新手的 跑得快的 折跃快的 扫描的 攻击的
T2 穿梭舰操控学 折跃快的
T2 特勤舰操控学 扫描的
T2 截击舰操控学 跑得快的

T3 探测护卫舰
T3 攻击护卫舰

T4 强袭护卫舰

T5 轰炸护卫舰

T6 掠夺护卫舰


T1 驱逐舰操控学 高攻击的 高射程的 高速度的
T2 狙击舰操控学 射程远的
T2 侦查舰操控学 无法被扫描的
T2 偷猎舰操控学 隐秘 高攻击的

T3 战术驱逐舰
T3 战略驱逐舰



T1 巡洋舰操控学 高攻 高射程 跳刀加成 没用啊 可以直接折跃
T2 突击舰操控学 高攻高防
T2 轰炸舰操控学 高攻高高射程 低防
T2 工业舰操控学 高货柜

T3 货运巡洋舰

T1 战列舰操控学 高攻 高防 高射程
T2 攻击舰操控学 高攻高防
T2 堡垒舰操控学 高攻击的 模块加成

T1 无畏操控学
T2 歼星操控学
T2 货舰操控学

T1 泰坦操控学
T2 混沌操控学




金鹏
雷鸟

皇冠鹤 yes
金丝雀
火烈鸟 yes
火斑鸠 yes
雨燕 yes
鱼鹰 yes
雉鸡
北灰鹟
赤腹鹰 yes
草原雕
长尾雀 yes
白额雁 yes
兀鹫
白鹭 yes
朱雀 yes
鸿雁 yes
蜂鹰 yes no
黄鹂
蜂鸟
黄雀
海鸥
白鹤
白鹭
白隼 yes
百灵
斑鸫
苍鹰 yes
苍鹭
大鸨 yes
丹雀
杜鹃
红嘴鸥
太阳鸟


控制菜单



彗星
星云
红巨星
激变星
黑洞
银河猎魂




拉斯忒亚
乌瑞亚
欧律诺墨
厄洛斯
赫玛墨涅
混沌





item_info 上有一个按钮 为主要功能
在飞船上 卸载 移到背包
在背包里 装备 移到飞船
在仓库里 装备 移到飞船
在其他里 运输 移到仓库



物品面板设计  再额外做一个 二级物品打开的面板(其他舰船货柜) 拖动怎么实现?! 掉落也可以用 不行 不一样
机库 货柜 仓库 远程 其他


 军团? 远程机库? 舰队? 其他飞船的仓库


左侧竖版设计
优点 可动态 可查看舰船背包
缺点 要开发 结构不统一


个人仓库
仓库
机库
飞机1
飞机2
飞机3




军团仓库
仓库1
仓库2
仓库3
仓库4
仓库5




舰船货柜  当前机库  当前仓库  远程机库  远程仓库

舰船货柜  当前机库  当前仓库  军团机库  军团仓库

货柜 机库 仓库

机库
空间站1
    飞机1
        装备
            物品1
        货柜
            物品2
    飞机2
        装备
            物品3
            物品4
        货柜
            物品5
            物品6
空间站2


货柜
物品1
物品2


仓库
空间站1
    物品1
    物品2



舰船上的物品的station_id搞成空的
不用频繁的修改
遍历道具的时候如果遇到ship_id 则无视station_id
遍历舰船的时候顺道遍历舰船上的物品



TODO
弹药的base_ship要移除 想到了回头查查





快递业务只能运送到空间站仓库  包括船和物品
支持批量 但是一次只能选择 同一空间站下的或者同一舰船下的物品 或 舰船



主动装备
白字属性 激活时才生效
绿字属性 装备上就生效

被动装备 激活时才生效


关于冷却时间
因为只有注电是不消耗电容的 所以无法采用无CD模式 不然就跟被动回电没区别了
只要取消了这个装备 那所有装备除了武器都可以实现无CD 考虑一下

其他的所有机制都可以采用帧耗电帧增加属性的机制
模块尽量采用有CD的方式 主要是限制模块在使用期间不能折跃 方便被抓

隐身和折跃耗电采用舰船基础电容百分比的机制 (和wow闪现一致)
隐身可能会增加一个初始耗电


最初是考虑了两种主动装备的冷却
1是有冷却 2是没冷却
甲修和盾修特别 采用两种冷却方式 极个别无冷却机制
注电采用冷却机制


需要增加是否自动循环 是否结束当前循环等状态
有持续生效的 例如推子模块隐身
有瞬间生效的 例如盾修甲修注电

这里推子和模块 和隐身还有区别
推子和模块在激活时点击 为取消当前循环 但是属性仍然生效
隐身如果有CD??那隐身无CD??



护盾充能装备 有CD 无CD 有CD点击下个CD停止 瞬间恢复
装甲维修装备 有CD 无CD 有CD点击下个CD停止 瞬间恢复
舰船加速装备 有CD 无CD 有CD点击下个CD停止 持续生效
舰船隐身装备 无CD 点击停止 持续生效   点击改为active 然后增加一个变量 慢慢隐身  点击改为online 慢慢现身
武器模块装备 有CD 无CD 有CD点击下个CD停止 持续生效
电容注入装备 有CD 有CD点击下个CD停止 瞬间恢复


显示的时候把 瞬间恢复的数值平均到每秒

增加BUFF位




耗电和提供BUFF 其实是2套路子 暂不做冷却和持续时间
无CD装备 每帧耗电 增加BUFF
有CD的装备 CD时耗电 持续整个CD增加BUFF 或 瞬间生效




关于指针这块必须重新完整规划 太乱了  问题太多 未来也不好查

先理顺一下有多少种可能
player npcer bullet(unit_info,target)
target weapon(base_ship)


主要是有个玩家切换断层的问题

后端 player获取target 如果target跟我在一个合层 则不重新获取
前端 根据后端的unit_type unit_id从index获取target

后端直接target 使用指针如何
这样切换断层 也不怕了

假设a 设定target 指针 为 b
b更换断层  通知前端 更新b

此时后端不用处理
前端也不用处理 指针没变  只需要判断合层是否存在





敌舰ID规划
敌舰分阵营 级别 难度 舰船类型(不重要)
结论 因为掉落不同直接一个死亡空间一套舰船即可了
死亡空间ID + 2位 标志位
71100 71101
死亡空间有5个难度
2+4+6+4+2=18个难度
死亡空间ID为
阵营+级别+个数





哦 不光有多重打击 和 弹药数量
还有 近炮远炮
初步设定
近炮是远炮伤害的2倍
散弹单体伤害是近炮的1/2
散弹全中的伤害是远炮的2倍



天启毁灭激光器


擦擦擦擦
规划战斗 规划战斗 规划战斗
到底要做成什么样的风格??!!
总结一下
如果要有近炮 那最好敌舰路线固定 体现打程序的快乐还是不错的 就是背板
背板有个问题 弹药要提前发射 但是如何提前 现在发射速度又很快 或者通过走位实现背板也行

大船装小炮的问题
按照规划大炮装中炮可以很快的清扫低级死亡空间
那就需要让舰船的刷新范围大一些 射程比玩家稍微远一些 ?? 这样好像只会恶心到同级别的小船




整理逻辑

处理断层移动
处理折跃效果
处理状态改变
发送协议
处理回复
处理逻辑




怪太多 射程一致会挤在一起 移除npc之间的碰撞 效果好多了还节约性能


2分钟
120dps 按照有效输出 100秒

12000有效
boss2000 有效

针对抗性输出大概70% * 90 + 30% * 70 = 84%  先忽略

10000有效
每个怪200有效
50个怪

大规划 key怪
小怪战 boss战

10波
3个boss
第一波 6小怪
第二波 1小怪头+8小怪  小怪头死亡触发下一波
第三波 boss1+10个小怪 击杀boss触发下一波
第四波 12小怪
第五波 2头+14小怪
第六波 boss2+16小怪
第七波 18小怪
第八波 3头+20小怪
第九波 boss3+22小怪


1 4
2 6
3 8
4 10
5 12
6 14
7 16
8 18
9 20



死亡空间初稿总结
炮台转速想移到舰船上
1首先解决 大船装小炮威力太大的问题
2npc 武器统一让武器飘出的弹幕更整齐
3减少运算
劣势  不拟真 减少了自由的装备时间 和最初的规划 不一致 先不改了 大型武器会有问题




磁电涡流
涡流变压器 盾抗
涡流电磁切割机 激光武器
涡流磁导率线圈 回电
涡流感应电动势驱动器 注电
涡流磁场稳固器 盾修


凯达的防御
凯达水晶核心 回电
凯达灵能网络 盾扩
凯达离子护盾 盾修


单极压缩模块组
单极电磁轨道炮 射弹武器
单极电磁蓄电池组 电池
单极磁通压缩装置 伤害
单极发电机 回电


电极发生器
电极回路线圈
电极铂金稳定器
电极仓熔纤机




装备同质化有点严重呀....要不要设置垃圾武器??
1白1绿1蓝3紫4金3红=13
13*6*3 = 234种武器

除了暗黑有垃圾武器 dnf基本没有垃圾武器
wow有垃圾武器 不是垃圾而是不是最好的



目前质量
影响转向速度
折跃启动时间
碰撞时碰撞距离
未来影响推子的加速度



增加一个灵活度(转向速度)
弹药爆炸半径调整为爆炸精度


构思一下名字
白色 100mmXX炮
绿色 100mmXX炮
蓝色 100mmXX炮
紫色 势力100mmXX炮
金色 100mm特殊XX炮
红色 全特殊

换思路


    单炮    散炮     单导    多导     单光    多光
            1   烈焰    血狮     质子
            2   碧炎    红龙     勇士
            3   暴风    天使     雷暴
            4   原罪    冲击     恐惧
            5   流星    三管     混合
            6   雷火    光学     空间
            7   线圈    镭射     战术
            8   彩霞    棱镜     中子
            9   能量    加农     微波
            10  脉冲    电磁     粒子
            1   冷凝    阵列     重力
            2   血鸦    暴风
            3   火炬    暗宇
            4   命运    胡峰
            5   单极    天基
            6   多拉    行星
            7   幽灵    幽灵



改良
加强

欧伏
索萨
亚纳

烈焰
碧炎
暴风
原罪
流星
雷火
线圈
彩霞
能量
脉冲
冷凝
血鸦
火炬
命运
单极
多拉
幽灵

血狮
红龙
天使
冲击
三管
光学
镭射
棱镜
加农
电磁
阵列
暴风
暗宇
胡峰
天基
行星
幽灵

质子
勇士
雷暴
恐惧
混合
空间
战术
中子
微波
粒子

重力



6*3*7=126个武器套装
按照其他三件每个3件计算
需要372个坑

实际拥有 +
9*3*7 个坑   189 + (9*7=63)其他杂乱装备 + 28(抗性)   = 280个

坑有点少 武器有点多呀     还有不含武器的套装
也会有多个武器的套装(少)

加技能的属性
这个不好规划 技能分类太散加成意义不大 不像POE那样每级增加的数值是变多的

抗性穿透




10种弹幕 6金4红
弹药 单体
1 斜后 向前
2 斜前 向前
3 横向 向前
4 交叉1次
5 交叉2次
6 向外 向内
7 循环交叉
8 O型向前
9 向前停2帧快速飞行
10 向后停2帧快速飞行




dps
弹药 6 4
制导 7 3
激光 5 3


分裂(麻烦 备用)

贯穿与连锁  一个拥有距离优势 一个准确率优势 伤害都是额外增加50%
贯穿是弹药继续按原路线飞行 伤害为50%
不可击中同一个目标 增加次数

分裂是弹药击中时找到一个最近的目标 变更方向继续飞行 伤害为50%

同时贯穿与连锁
先连锁 再贯穿 感觉弹幕形状会乱
先贯穿 再连锁 如果贯穿次数太多 感觉连锁不太容易触发

要不先判断连锁 不能连锁 再贯穿



智能模式 手动模式

先做智能模式

先规划一下装备的状态  增加一个状态 叫期望开启/关闭 闪金圈
1 武器
离线 不加属性 灰色
在线 加属性 不开火 正常
激活 进度射程就开火 光圈
开火 CD中 转圈
停火 CD中




构思一下物品移动
共有5个部位 1船体 2背包 3当前空间站仓库 4远程空间站仓库 5当前空间站其他船背包
状态有2种 1停靠 2在太空

规整一下 类型 1船体 2飞船 3空间站
to
1船体   只能是当前飞船 必须传递slot_id
2飞船   只能是当前空间站 传递id认定为当前空间站 其他飞船的背包 无认定为当前背包
3空间站 传递id认定为其他空间站 不传ID认定为当前空间站

from
1船体
2当前空间站
3远程空间站



TODO 人在空间站 不向其他人发送多余消息
遍历的时候 不处理在空间的玩家信息
但是发送消息的时候把自己push进去




个人资产        军团资产
舰船货柜
当前空间站
    舰船1
    舰船2
    舰船3
空间站1
    舰船1
    舰船2
    舰船3
空间站2




12月1日
开始做套装 完善数值吧
然后完善装备详情页面
完善舰船详情页面


折跃启动耗电比例75% 再追加距离
隐身耗电比例待定
CD和耗电
0技能开炮80%永动 开盾修25%永动
80%是25%的回电效率
标准护卫舰盾量500甲量500电量100 峰值回电5g/s 2个炮台
得出每个炮台耗电为 5*25%/2 0.625g/s
得出每个盾修耗电为 5-1.25 = 3.75g/s


盾修甲修特点 甲修修的快 盾修消耗小
盾修容易实现永动 转换效率比较高2倍或者1.5倍 每秒修量很低
甲修不容易永动  每秒修量很高 效率较低


转换量100电容换750盾换500甲
盾修转换效率是甲修的1.5倍
盾修每秒修量是甲修的0.5倍
盾修2秒CD
盾甲每秒耗电4g 每秒增加30盾 即8+60盾
甲修2秒CD
修盾每秒耗电12g 每秒增加60甲 即24+120甲


?甲修时间是盾修的2倍

盾修小型是2秒 大型是4秒 旗舰级为8秒
甲修小型是4秒 大型是8秒 旗舰级为16秒






白装
绿装 无属性
蓝装 无属性
紫装 势力属性
金装
红装



size_ratio >1 的数不能出现在小型舰船上
有射程 转向速度
例如一个装备 +20速度 对于小船来说提升10% 算10分
但是到了大船上 +20速度 提升100% 相当于100分了



电容恢复速度
小型 5 / 100 = 20秒
大型 20 / 1000 = 50秒
旗舰级 80 / 10000 = 125秒


能量10倍
HP10倍
电量10倍
dps3倍
回电4倍
回满时间10/4=2.5倍



回电的结论
注电可以更好的利用回电峰值 所以数值要比回电小
回电是理论最高回电 实际应用基本达不到全效率 即使全效率了 也会因为折跃 隐身 等情况破除全效率
注电20秒50 200 800
回电每秒5  20  80
按照这个数值 增加的电量
小船通过注电要40秒 回电要20秒
中船要 100秒 50秒
大船要 250秒 125秒
收益过大
电量 100 1000 10000


凭空想象数值有点难回头做完副本 再做一个PK模式 再说吧




装备需求
222 标配 武器*2 + 盾修 + 注电 + 抗性 + 伤害 = 20 + 8 + 8 + 5 + 5

武器 10
护盾充能装备 10 100 1000 8
装甲维修装备 10 100 1000 7
舰船加速装备 10 100 1000 12
舰船隐身装备 5
武器模块装备 20 200 2000 20
电容注入装备 10 100 1000 8

护盾扩展装备 10 100 1000 6
装甲钢板装备 10 100 1000 5
护盾抗性装备 5
装甲抗性装备 4
电容回充装备 10 100 1000 6
电容容量装备 10 100 1000 7
舰船质量装备 1
舰船速度装备 1
折跃增益装备 1
武器伤害装备 5
武器增益装备 5
弹道控制装备 5
扫描增益装备 1




技能需求列表
训练时间总计:XX天XX小时XX秒
主技能需求
    X巡洋舰操作 等级5
        ✔飞船操纵学 等级2
            ○高级飞船操纵学 等级2
副技能需求


质量和推子
护卫 100 1000 10000
每件装备 10 100 1000质量左右
推子 100 1000 10000质量
250N推力 2500M推子 25000推力
提升pow(((推力-质量)/推力),2) 百分比速度

pow(推力/质量,0.3)

护卫装护卫推子 提升100% 250/250 = 1     =pow(1,0.3)=1
护卫装战列推子 提升200% 2500/250 = 10   =pow(10,0.3)=1.99
实际                   2500/1150 = 2   =pow(2,0.3)=1.23
战列装旗舰推子 提升200% 25000/2500 = 10 =pow(10,0.3)=1.99

战列装护卫推子 提升50% 250/2500=0.1     =pow(0.1,0.3)=0.50
旗舰装护卫推子 提升25% 250/25000=0.01   =pow(0.01,0.3)=0.25
旗舰装战列推子 提升50% 2500/25000=0.1   =pow(0.1,0.3)=0.50




空间站 展开收缩
物品机库 空间站物品列表
舰船机库 空间站舰船列表

停泊的舰船
当前舰船  舰船货柜
舰船1   舰船货柜
舰船2   舰船货柜

个人资产
空间站列表  空间站船和物品


我的舰船
当前舰船
个人资产



定位 所在星系名称  搜索   下拉过滤
缩放比例




扫描功能
首次列表为空
点击扫描获取列表
点击列表元素 精准扫描 完全定位后可折跃
精准扫描 不存在的信号 移除 提示信号已消失
超过范围的信号 灰色  再次扫描 清空  要不增加有效时间
改 重新构思了一下
扫描分为2部
第一步全局扫描  持续1秒 扫描按钮变灰
第二步精准扫描  按钮变为 重新扫描




近期内规划方向
1技能树改天赋树 分为大点和小点
1.1 大的天赋点 例如 多重打击次数+1 弹药数量+1 连锁次数+1 穿透次数+1 5秒内不受攻击增加20%护盾 受到伤害增加抗性 增加抗性 抗性上限 转身速度

2战斗方向调整
2.1移除爆炸速度属性 增加爆炸范围属性 就是有AOE效果的弹药
2.2调整不再区分弹药武器 制导武器 激光武器了
2.3武器只需区分大中小 特色化每种武器的弹道形状 伤害分布
2.3.1 1普通多发弹药 22*2大光球前行命中大范围爆炸 3雷电蓝光柱 4神族海盗船顺发 5标准散弹 6魂斗罗男枪跟踪弹 7前发散弹跟踪导弹 8后发散弹跟踪导弹
2.4舰船也不分种族了 基础抗性平均分布 全靠天赋和装备 保留NPC舰船的抗性分布
2.5装备系统增加size字段
2.6特色化套装 从192套 缩减到30-50套
2.7考虑一下如果同波次的弹药在同一帧命中一个单位则把数个小在一定范围内的爆炸效果合并为1个较大的特效


产生的问题
1装备数量会大幅减少 会极大的减少同质化严重的现象 也可能导致装备选择性变差 使游戏自由度减少
1.1预计武器数量会从264减少到50左右 装备数量会从700+ 减少到200+
2天赋树相对技能树可增加大量特色属性 而不是仅仅增加基础属性 但是也会导致 玩家可能不会均衡发展 容易走极端路线 容易出现不平衡


天赋树 初步规划了大概100种技能点
不做连线
小点 没点可点击5次 每次扩大范围 大概思路是 点2点可跳到隔壁 点5点 可以跳2个格
大点 一次性需要5点




2.3.1 铺开来做
初步构想 设计10或20种弹幕
弹幕大小最小为2*2 数量*多重
1普通多发弹药 黄色 箭头状 2*4 绿蓝多重+1 规格数量+1
2金色 2*4 4*2 弹药 导弹 激光 6个势力
3紫色
1 标准散弹6*2


?????怎么搞着搞着又回去了   主要还有个衍生的问题 擦了个擦

散弹
8字形
散射弹
先散再向前


导弹
6 双发频射 魂斗罗男枪跟踪单 敏捷高 双法跟不上DPS
7 普通群发跟踪单
8 普通后发跟踪单
2 雷鸟4号 后发散角120度 停止转向  快速正前方发射导弹  降低角度 可让弹药更密集 可能需要追加extra速度递减或递增的逻辑
敏捷型导弹

激光
3 2*2大光球缓慢移动 大范围爆炸
4 雷电蓝光柱
5 星际海盗船顺发
大光柱




持续光柱?


弹药 热 红色
导弹 爆 黄色
激光 电 蓝色



增加一个 多重打击没发伤害增加10%的功能
过载 每次多重打击伤害额外提高10%  每波次弹药都比上一波次弹药伤害提高10%
远狙 每飞行2%距离提升1%伤害





僚机 挂靠 跟随 阵形



规划一下整体的游戏流程和养成路线
未来的守城战 工业系统

先考虑闭合现有系统 完善现有UI功能
1先修复换船的功能
2物品详情 各个按钮规划 技能详情 技能操作规划
3隐身系统 模块系统 折跃耗电等



空间站名称  1AU
所属星系
信息 展开/折叠 全选 折跃


舰船名称
舰船类型
销毁 精炼 信息 更名 市场 激活/物流


物品名称 数量
槽位 类型
销毁 精炼 信息 拆分 市场 装配/物流


装备 只处理和装备相关的功能 装配 卸下? 销毁?
货柜 仓库 远程
控制菜单
装载/物流 市场 销毁 查看

详情菜单
转载/卸载 停用/启用 市场


仓库 堆叠 排序 过滤 全选 选择
货柜 机库 仓库
出售 市场 销毁 精炼 拆分(有可能可以省略) 激活(舰船特有)





折跃和停靠 虽说不能同时出现
但是如果是2个按钮的话  会在自动驾驶方面舒服一点
那距离有点远是选择移动过去停靠 还是折跃过去停靠 多远
折跃到XX KM 按下的时候向上弹一个窗 选择距离
还有停留点 导致被弹出的情况 可以考虑 折跃到距离空间站10KM的地方 但是空间站可停靠范围为50KM 1000KM为界限 超过则折跃 不超过则移动
未来把折跃落点的判断方式 放到舰队折跃里 单体折跃不考虑折跃点重叠的问题 或者说像EVE一样 折跃到一个范围 而不是精确一点 (这个再议 主要是折跃有一个时间 这期间可能发送诸多位移变化)


规划提示时分为2行
第一行为整体动作终点 设定目的地 行进到XX空间站 行进到XX空间
第二行为当前行为动作 例如折跃引擎启动中 折跃中 折跃到空间站


又改了 增加一个导航按钮  控制按钮更改为 折跃和停靠


物品的销毁和抛弃

销毁 信息 拆分 装配




阵营特色




护盾容量
护盾充能
护盾注能

装甲质量
装甲自修
装甲维修

电容量
电容回充
电容注入



任务系统 强调世界观
NPC的财富系统 和声望系统结合


沉淀一下 折跃特效 再看看
然后考虑一下主动装备的属性能不能做成buff
优点 频繁的开关 节约性能
缺点 可能只能做成额外增伤 不能做成a类增伤



舰船颜色
1护卫 白绿蓝紫金红
2驱逐 白绿蓝紫金红
3巡洋 绿蓝紫金红
4战雷 绿蓝紫金红
5无畏 蓝紫金红
6泰坦 紫金红





资产页面改造
空间站未来增加图标
点击图标打开详情 取消现在的控制面板 在详情最下方增加控制面板
点击文字  高亮 展开和合并空间站 并展示空间站内道具


点击舰船图标 打开详情
点击文字 高亮 展示舰船内道具


点击物品图标 打开详情
点击物品文字 附加一个高亮效果 没有操作


装配页面改造
点击物品图标 打开详情
点击物品文字 附加一个高亮效果 没有操作


这个设定应该不会太差
巡洋开始 允许有僚机  旗舰开始有挂靠点
战列有2个 或1个驱逐
无畏有4个护卫=2个驱逐=1个巡洋
泰坦有8个护卫=4个驱逐=2个巡洋=1个战列


玩法 低端的刷任务
高端的打死亡
再高端势力战争


已知问题
1折跃特效有问题
2折跃中推子效果还没做
3开始规划主线任务支线任务 和死亡空间随机事件
4装配页面和物品页面不要最下方的详情了  批量的问题



降低声望如何和谐的处理


扫描系统  发现未知信号 增加跃迁到附近选项



接到任务以后不会刷新任务点 直到折跃点生成才生成任务空间 只要完成了任务空间任务就完成 无论玩家是否在线
掉落则根据其他拾取规则决定 即任务共有2部门奖励 1任务奖励 2掉落奖励
当断层处于无人状态一段时间 任务空间消失
只有接任务的人能触发任务空间 如果已经在任务空间坐标的人 ?? 如果任务空间 断层已存在 则重新找一个 任务地点

主线任务 支线任务 玩家同时只能接20个支线任务
任务类型 战斗 采集 运输 护送

任务奖励 固定奖励 随机奖励? 就算要随机奖励 也要在玩家接到任务就生成奖励 要不就做牌子机制(攥N个换装备) 或者2者都存在

分析一下 牌子机制 无聊 简单的刷刷刷 数值好控制 但是任务难度不能太高
随机奖励机制 相对刺激  奖励数据和掉落一样 比较难控制  玩家会提前知道奖励 就有选择了 比副本更难处理 垃圾任务怎么处理
也必须接了任务才能知道任务奖励 任务种类和难度太多了 30个 不可能在列表就显示奖励 那就有个放弃任务的问题(不想掉声望)
除了主线任务 不太想做任务链 太烦了   要不做任务链?把最好的奖励放在最后面 不然接了任务一看奖励不好放弃 是我不太希望出现的玩法

这样 放弃任务给一个倒计时  仍然占任务坑位  倒计时结束 坑位占位结束


任务等级:一般 高安
任务等级:危险 高安
任务等级:可怕 低安
任务等级:恐怖 低安
任务等级:致命 00

1级任务(恐怖)
1级任务(困难)
2级任务(一般)

重新构思死亡空间和任务系统


想想能不能做一套任务或者死亡空间所有等级通用 不行 低级的船少 高级的船多 貌似可以
想想能不能做一套任务或者死亡空间所有等级通用 不行 低级的船少 高级的船多 貌似可以
想想能不能做一套任务或者死亡空间所有等级通用 不行 低级的船少 高级的船多 貌似可以


增加机制 警戒范围 连锁警戒
增加机制 敌舰瞬间出现 未来增加机制敌舰从空间站出现切换图层
增加机制 受攻击时触发 构思一下 only one
增加机制 玩家进入警戒范围触发 only one
修改机制 触发的机制(后台已修改)


整体构思一下如何实现
1阶段(刚刚建立,运行中,废弃的哨站)好不好实现
2从空间站出来的飞机特效如何实现 (入场方式) 0为折跃入场 已规划
3倒计时后折跃走(离场方式) 未规划

触发了trigger  再遍历一次trigger? 如果遇到折跃走 执行处理 不对放这里不好
//再不然就建个新表 dead_step_unit 是用于刷新的
dead_unit_action 记录离场或者其他的NPC动态动作
移动到
切换攻击模式
撤退


//延迟20秒触发



4敌舰巡逻方式
进入警戒范围开始攻击
受到攻击开始反击
暴动攻击
不反击

5支线触发机制修改 已规划


任务去之前要知道大中小

任务要多 类型也要多
增加探索的话 就是1随机触发事件 2玩家的操作会影响结果
连锁型(远征)  跳跃型(特殊材料 世界掉落)
战利品获取方式 1击杀 2破解 3提供解码器(兑换)
任务 限时
还有不接任务就触发任务


1当玩家进入空间时提示

1.1这可能是一个刚刚建立的哨所,武装还不太完善,应该也没有什么重要的物资
1.2这是一个正在运行中的哨所,有完善的武装,一定有有价值的物资
1.3这一个废弃的哨所,通过设施可以看出这里曾经很辉煌,但已经人去楼空,应该不太容易发现有价值的物资

被伏击 被增援 被撤退


dead dead_step  dead_step_unit 要重新规划了

定一个一个定义类型 难度参数 阵营 随机做任务


部分任务 设定时间倒计时 触发特定事件
友方撤离 任务完成
敌方撤离 拉走一部分奖励 不影响任务完成
增员 增加敌对 增加掉落奖励 可能增员boss


截获到信号

靠近 触发警报 触发增员
攻击 掉血触发警报 触发增员
击毁 触发增员



TODO
转生系统



警戒范围(前后端)

死亡空间倒计时逻辑(仅后端)


声望 只要进了任务空间或者死亡空间 就认定为侵略 则此死亡空间或者任务空间内的敌人都为敌对
NONO 我还是比较喜欢 进入空间都是蓝+的 可以设定一些特殊的玩法
那这时候不减声望就很容易出现漏洞了
所以要有临时行为
总结 进入死亡空间先按照个人声望进行判定
无论玩法对当前阵营声望如何 如果玩家发起的攻击 则加入死亡空间的临时 敌对名单 (有效期)
记录在哪?断层 ?死亡空间上 ?玩家上[否] ? 这块需要规划
如果声望<=0 进入先声望降级
进入名单 停留一段时间 遭受进攻 [声望降级]
偷窃??发现 -> 成功与失败


警戒范围及连锁警戒范围
以及归位范围
是针对所有玩家还是针对当前玩家 现在看要根据声望来

玩家声望越低 警戒范围越大?
归位重置巡逻状态?


假定玩家A声望0 玩家B声望0
假定怪物1暴动 怪物2触发 怪物3靠近怪物2
A进入 声望降级 怪物1向A移动  从暴动状态切换为暴动状态 最好带动周边攻击
A到边界归位 带动周边怪物 归位
A超过射程 转火B 带动周边转火 只有定点的舰船才触发 环绕的只会被动触发转火 这个规则要不要



NPC出战逻辑方式
1瞬间出现 固定当前角度运行XX帧
前端放置此单位在远景图层 当运行到XX帧修改此单位图层 恢复正常AI
受击逻辑规则从刚出生开始 就生效


关于NCP攻击状态的逻辑规划
巡逻中 是不需要单位目标的
警戒中 是针对某个玩家进行警戒
攻击中 也是针对某个玩家进行攻击
这个状态是读取死亡空间针对某个玩家的状态 对于NPC来说是全域的 (这个状态会根据触发时间进行升级)
就必须说像一个死亡空间的警戒状态
例如:
1.和平 >0 玩家随便走 但是一旦攻击 则转为攻击中
2.警戒 >-5 玩家呆一段时间或进入 触发警戒 再过一段时间 触发攻击
3.攻击 >-10 玩家进入就触发攻击

突然想到未来空间站巡逻的哨兵 也应该采用警戒模式 但是这个警戒数据存到哪里 应该是全域的
就是先读取个人声望 如果死亡空间存在 则读取死亡空间声望

死亡空间增加属性 默认降级 就是个人声望在这个基础上进行降级
当用户的行为影响到事件了 进行再次降级
NPC舰船AI遍历 所有有变更声望列表的玩家 且在当前死亡空间的舰船
从低到高决定状态
例如 玩家A声望2 玩家B声望-0 玩家C声望-4
死亡空间 降等等级为-1
A进入 追加A到声望列表修改为0 实际为2-1=1 安全
B进入 追加B到声望列表修改为0 实际为0-1=-1 触发警戒
      提示此为警戒区域,请离开否则我们要发动攻击  2分钟后 修改为-5 实际为0-1-5 = -6
C进入 追加A到声望列表修改为0 实际为-4-1=-5 触发攻击


待机状态获取警戒范围
攻击状态获取追击范围
警戒范围=攻击范围 追击范围(原规则)


新思路 每个死亡空间来个力场效果 避免玩家直接跳到怪堆里
跃迁干扰力场 信号探测力场



结论
step_unit
入场状态  0瞬间出现 1折跃出现 2虚拟出站方式出现
离场状态  折跃走  自爆
巡逻状态 暴动 待机 不攻击
攻击状态 攻击中 警戒中 巡逻中
这个逻辑靠谱 这个逻辑靠谱 这个逻辑靠谱
如果NPC舰船处于攻击中 则遍历攻击范围内 声望低于-2的所有玩家舰船 如果攻击范围内无玩家 则降级为警戒中 开火
如果NPC舰船处于警戒中 则遍历警戒范围内 声望低于-0的所有玩家舰船 如果警戒范围内无玩家 则降级为巡逻中 不开火
如果NPC舰船处于巡逻中 则遍历警戒范围内 声望低于-2的所有玩家舰船 有则攻击中 -0则警戒中 无则持续巡逻 溜达机制

攻击模式 环绕(小船) 定点(大船) 可根据质量自行判断 以前有类似的机制

方案 增加怪物字段警戒半径 巡逻半径
死亡空间 增加玩家动作表 处理 移动 切换状态
死亡空间 增加倒计时信息和动态倒计时信息 worldProcess里处理逻辑 触发巡逻(循环) 移动到等

逻辑1 怪物状态分为正常(有警戒半径 巡逻半径) 暴动 昏睡(麻痹的?)
逻辑2 任何情况怪物进入战斗 则触发周边战斗 可能会每秒遍历 看情况再说
逻辑3




//TODO
如果一个断层特别大 覆盖了2个信号 或者空间站 还没有处理方式



//TODO
又构思了一个方案  DPS不与弹药波次做绑定
弹药波次属性只用来控制弹药形状
把弹药数量属性弱化，变成总弹药数量
好处1，比之前更容易理解一点
好处2，可以做男枪那种连发的弹幕 不用纠结攻速和波次的关系了
好处3，为未来天赋点做层级预留空间 （转生）
天赋修改为 贯穿和分裂攻击伤害增加10% 弹药数量+1 都可升5-10级
去掉之前的 多重打击次数+1 弹药数量+1 贯穿次数+1 分裂次数+1 这4个大点



新课题
这个死亡空间状态是放倒前端处理
还是每次舰船更改状态 通知前端
现在折跃是后端判断 通知前端的

貌似不对啊
1.首先这个状态不能记录在断层上 必须记录的合层上
一丢丢的动作异常都可能导致不同步 不用说这个动作层级改变的状态了
2.现在合层可能存在多个断层 且可能存在多个信号
也就是说要把同一个合层的所有信号状态都告诉前端

结论增加一个信标 记录这一堆东西 同单位一样传递给前端




我草 混乱了

WorldProcess 处理全部npcer的ai框架 serverWorldAction

WorldDeadInfo 记录世界死亡空间状态 例如 阶段 触发事件等
    WorldDeadInfo.unit_dead = UnitDead
TemplateUnitInfo 只记录刷新过哪些船 哪些船还活着

UnitDead 死亡空间信息 包含 声望等
RenownInfos 任何系统可用的声望规则



在UnitDead 建玩家和NPCER的索引?? 以后NPCER没有ship_target方法??
//多个NPCER阵营怎么办



//TODO
MapProcess 构建缓存有空优化一下



声望从0到2000 1000为中立
死亡空间 声望从-2000 到0 计算最终声望
最终声望 -2000 到 2000




//没想明白 颜色是针对当前玩家的 攻击方式是针对所有玩家的
如果玩家攻击一个NPCER 则该阵营的NPCER10分钟内为红色

您对XX阵营的敌舰发起了攻击  未来15分钟内会自动攻击该阵营??
无势力声望NPC 则自动攻击 这个赋值到信标上
9大势力声望为-则自动攻击 这个赋值到信标上
10警察任何时候都不自动攻击 自动攻击后5分钟内 则自动攻击 这个赋值到玩家上

PVP 声望为负 在00 则自动攻击
或者 舰队长攻击 记录到舰队上5分钟内自动攻击
个人攻击 记录到个人上 5分钟内自动攻击

另外需要全域记录玩家的违法 犯罪记录 或者后端记录在玩家上



连锁的东西太多了 又引申出 罪犯  嫌犯的状态了 @!##$^%$#^$

新增 PVP倒计时 15分钟 PVE倒计时 5分钟
罪犯 高安开火  来警察 必死 无法折跃 死的船无法自动维修 死了取消罪犯标记 变为嫌犯15分钟
嫌犯 当玩家在 低安主动发起攻击  或者偷窃道具 则为嫌犯
     攻击嫌犯的玩家不增加嫌犯标记
     无法停靠空间站 不给驻留BUFF 炮台自动攻击



玩家的血条旁边多个符号 蓝＋ 红－ 白等 绿星 和 红星




基础机制写完了 先构思 18 个死亡空间

破译 考古 挖坟 挖矿 拾取 机制

每个死亡空间至少有1个奖励机制
就是打的快得到3份 否则得到2份
都可以有  折跃走 自爆 (慎用)
呼叫增员 ?
护送
到达
限时击毁

考虑了一天 还是基本的杀杀杀比较好 很难做到有探索事件 隐秘事件等等
增加一个扫描系统 增加固定死亡空间 信标  当扫描 则会触发事件 增员等等
扫描特效 想了半天 不好实现呀

死亡1
起始20+怪物+1个建筑+1个boss 攻击BOSS 触发阶段支线 呼叫增员10个+boss2




本来做了一个npcer扫描 逻辑都写完了 发现还要处理图层的问题 pass


迷雾效果 和 力场效果


新思路 step增加刷新个数 刷新范围字段
另外任务 增加触发几率字段


ID ID ID ID 规划了无数个版本了
武器ID 第一位阵营 第二位难度+规格 第34位ID BOSS武器+50
7000
7005

7050

舰船 第1位阵营 第二位难度 第三位规格 第4位ID 第2位为0



修改弹药数量和多重打击数量机制
修改后多重打击数量只影响弹药模型 不再影响dps
那过载机制也会受影响

18级副本
lv1 护卫舰 只要装了最垃圾的修或者盾扩 武器装满 就打得过
lv1 驱逐舰 只要装了最垃圾的修或者抗 就打得过
lv1 巡洋舰



像散弹这种可以定义为辅炮


//TODO 调整订单状态的npc离得再近点 不然现在的玩法一后退就躲 开子弹了

开始制作 20220415
base_item_info 50% 和 物品堆叠数量


重新看了一下 现在插入数据是先执行数据insert然后返回info
查询init是select然后返回info

只有这个2方法有同步方法
目前应该是只出现在 服务器启动 和 用户登录附近
其实除了player_info player_extra 其他创角的信息其实可以不用同步方法修饰 倒是没太所谓

player_info.saveShipId 这个方法是干嘛的 注掉肯定不这么处理 但是具体怎么处理没想好

下一步要做的 构思一下 游戏后期新增道具 可不可以 先new info 未来在做移除 插入



20220420 填坑中
市场如何处理
整体来讲想设计一种 系统统一定价的系统 类似传奇那种 但是要做系统定价
这里省略几千字自己的思路 只说一下困境
需要设定一个物品基数 当低于这个基数 说明市场缺货 需要提高市场价格
例如传奇 每天刷50块黑铁矿
要考虑 有可能市场并不那么活跃

爆船数量要-1 就是说有负数 这个不在前端显示
当低于-1 价格每天上涨10%
每种商品市场去库存基数数量 或者基数价值 低于这个价值则上涨 高于这个价值则下跌

会产生一个玩法 某个冷门物品 一个玩家每天无脑买空 价格无脑上涨 他再一股脑抛售掉
增加限制 每次只能出售100个 或者价值100块的 后端计算当超过这个价值重新调整一次价格



//TODO  物品筛选功能
左边空间站 收缩
→↓菜单展开 DONE 动画未完成

已存在的
过滤  下拉  全选反选
列表方式 平铺 每行
是否显示船体装备
整理



//TODO
开炮的时候 炮台收缩 这个还做不到 玩家不变形的时候 舰船和炮台是一张整图
NPC舰船到射程一半 才开炮 提升NPC的射程 done



20220505
先解决炮塔和建筑的资源问题
具体炮塔是否寄生在建筑上考虑一下


建筑武器的问题 1要么采用最早做的那一版武器的模式 2要不采用舰船的模式
优劣
 1武器可转向 可任意装配小型中型大型武器
 2可设定血条 那种穿透或者反射的弹幕 可以直接摧毁炮台
劣势
 1每个武器要定义转向速度 放在舰船上又不生效 有歧义
 2需要写单独的机制 但不会太麻烦  然后写一个寄生的机制 建筑死亡炮台也死亡


//TODO
空间站环绕的灯


//废弃不要太空垃圾了
矿物储藏库
装备储藏库

废墟
残骸

连接导管

压缩阵列
提炼阵列



小怪要不要特殊的boss资源
目前设定护卫舰一共7种资源 驱逐6 7+6+5+4+3+2 = 27种*9阵营 = 243种
护卫共需要1个建筑boss和8个普通boss 全当boss都不够 那至少保证当前副本boss资源唯一?也挺难

低难度boss可适当降级
护卫小怪1234 boss567
驱逐小怪123  boss456
巡洋小怪123  boss45 + 驱逐boss
战列小怪12   boss34 + 巡洋boss
无畏小怪12   boss3 + 战列boss + 巡洋boss
泰坦小怪1    boss2 + 无畏boss + 战列boss


前散=前方散射
漫散=波次散射
全散=打一圈
散导=散射的导弹
连导=连射导弹
蓄光=蓄力的大激光

环光=?

继续构思
因为发现一个问题 飞机类游戏最容易中单 是因为屏幕有边界 而中单极大的受到这个限制
而平面360角度自由对战 如果出现大量往前发射的弹药会导致 玩家一直围着一个方向转即可躲避大量弹药 再甚者后退即可轻松躲避
暗黑类游戏呢?1施法时或攻击时要停止 导致中弹 2尽可能最大化输出 贴怪物脸或受自身射程影响

结论多安置360度弹药的飞机 单体攻击的飞机 射程要近 速度要快

TODO
有点想在武器舰船阶段空间 阵营下一层增加一个难度的纬度了 类似普通噩梦地狱


射弹 各种单发双法散弹 少量制导   漫散为特点
阵营1射弹 1   2    3   4    5    6
小怪武器 单发 双发 前散 全散 散导 漫散
首领武器 双发 全散 散导 漫散

导弹 3种弹药 2种导弹 1种激光   连发导弹为特点
阵营2制导 1   2    3   4    5    6
小怪武器 双发 前散 散导 全散 普光 连导
首领武器 双发 散导 前散 连导

激光 3种弹药 2种激光 1种导弹    什么激光为特点?  其实那种大激光效果挺好的  构思中
阵营3激光 1   2    3   4    5    6
小怪武器 双发 前散 普光 全散 散导 蓄光
首领武器 双发 散导 全散 蓄光

          1    2    3     4    5    6
小怪舰船 正前 180散 360散 导弹 360散 激光
小怪炮台 正前 180散

18个难度
护卫难度1   舰船资源 护卫123=3 boss456
护卫难度2   舰船资源 护卫1234=4 boss567
护卫难度3   舰船资源 护卫2345=4 boss67建筑1

驱逐难度1   舰船资源 驱逐12护卫12=4 boss345
驱逐难度2   舰船资源 驱逐12护卫234=5 boss56建筑2
驱逐难度3   舰船资源 驱逐23护卫345=5 boss456

巡洋难度1   舰船资源 巡洋1驱逐12护卫123=6 boss巡洋3驱逐4建筑3
巡洋难度2   舰船资源 巡洋12驱逐12护卫23=6 boss巡洋34驱逐5
巡洋难度3   舰船资源 巡洋23驱逐23护卫34=6 boss巡洋45驱逐6

战列难度1   舰船资源 战列1巡洋1驱逐1护卫12=5 boss战列23巡洋3
战列难度2   舰船资源 战列12巡洋12驱逐2护卫3=6 boss战列34巡洋4
战列难度3   舰船资源 战列12巡洋23驱逐3护卫4=6 boss建筑4战列4巡洋5

无畏难度1   舰船资源 无畏1战列1巡洋1驱逐1护卫2=5 boss无畏2战列2巡洋2
无畏难度2   舰船资源 无畏12战列2巡洋2驱逐2护卫3=6 boss建筑5战列3巡洋3
无畏难度3   舰船资源 无畏12战列3巡洋3驱逐3护卫4=6 boss无畏3战列4巡洋4

泰坦难度1   舰船资源 泰坦1无畏1战列1巡洋1驱逐1护卫2=7 boss建筑6无畏2战列2
泰坦难度2   舰船资源 泰坦1无畏12战列2巡洋2驱逐2护卫3=7 boss泰坦2无畏2战列3
泰坦难度3   舰船资源 泰坦1无畏12战列3巡洋3驱逐3护卫4=7 boss泰坦2无畏3战列4


220610
设计18种模版先




需要资源 建筑6种 炮台 单发双法是必须的
难度用体积区分?
激光导弹弹药用不同的模型?
6种 要么小中大*单双 要么激光导弹弹药*单双 小中大更好一些

舰船资源 第一位大类型 第二位小类型 第三位阵营
空间站资源 第一位阵营 第二三位 编号 小于10为空间站  资源半径500
                                 大于10的为建筑形状的舰船 资源半径200
                                 大于20为炮台 资源半径100


20220507
下一步做数值 或者 规划任务系统
其实应该做数值 光数值第一版全做完 不至少也要1个月?


20220513
激光增加那种持续的跟踪的激光??继承上一波弹药的显示容器 应该能实现   未击中怎么办??
激光增加一种蓄力的激光 要求支持NPC 蓄力期间船体不转向

其实那种大激光效果挺好的  构思中
1要给武器增加蓄力特效 没想好放在武器上还是舰船上还是弹药上
2要停船 停转向 1先停船 等5帧 停转向 等5帧 放红框  发射
3解决造成持续伤害的问题
4容器接力的问题


//TODO 这个好像没实装
玩家的末日武器也可以考虑用类似的方案  弹药小范围散弹 导弹群 激光光束
激光大光柱子 无限穿透
炮弹 子母弹 无限穿透
导弹 导弹群落 散射


!@#!@#怎么写
当武器要开火 给舰船附加一个属性


末日武器有初步的规划了  试一下


现在好像没有大型武器 对大型单位的碰撞判断
都是以弹药为中心 对大单位进行碰撞判断






BUFF规划
违法 犯罪 深红色
攻击 浅红色
模块 黄色 绿色
折跃 蓝色 绿色


2个问题 1是忘了
2是 停止激活了仍然在开炮



关于模块的逻辑
以模块结束为时间点
如果我在结束过程中
ing则修正进入模块中的时间为 结束过程用掉的时间 0则直接进入模块模式 超过0则ing=server+超过的帧数
start修正开始时间 向前-5秒
hop修正进入结束时间为来的时间
end修正结束时间为进入结束时间 向后5秒


如果我在模块过程中
ing为当前时间 ing=server
start修正ing-5秒 start=ing-50 例如我刚开0帧 产生了60帧(必定大于50) 则
hop=同上
end=同上

如果我在模块开启过程中
ing=不变
start=不变
hop=同上
end=同上

跳出来思考 启动时间 不会因为请求多次而调整 但是可能会影响CD显示



//TODO 折跃过程中进站 就有问题了 这个未来规划

//TODO还差NPC的末日武器特效

明天搞 模块装备 或者 折跃倒计时BUFF

220526
BUFF搞定 下一步
折跃的时候攻击朝向不对
模块装备


220531
历时一个月 终于可以回到数值填充的路上上去了


220623
这又忙了多久 还是没开始做数值 最近搞了背景和转向 及视角跟踪
18个死亡空间设计
目前设定死亡空间分为普通和远征
普通刷新1号BOSS 概率刷新2号BOSS
远征刷新2号BOSS 概率刷新3号BOSS

主0 普通小怪10个 BOSS1个  攻击BOSS 触发1 '我们受到的攻击,请求支援'
主1 刷10个小怪 阶段数量<6 10% 触发3
主2 BOSS死亡 触发9
支3



//TODO 触发完死亡 要移除所有支线
//新问题 如果击杀BOSS 死亡就消失 很难触发到支线任务


创建触发信息那需要改
现在有多个阶段的触发都可能存在 还要考虑移除


//TODO DONE
目前所有死亡空间坐标有问题 x都为正的 y都为-的 感觉位数也多了2个0 done




//TODO
更新阶段通知前端的方式 应该是个半全局的公告性质的
巡逻方式移到NPCER上 done


//TODO DONE
撤离貌似还没做 倒计时也没做 不太想做了

//TODO DONE
统计数量那可以做数量统计 不用每次都遍历 done

//TODO DONE
新问题 规划一下这个分组ID和模版ID
现在期望同一个模版 调用不同的BOSS


//TODO DONE
还差血条方向 前端  done
死亡空间 数量缓存 现在每次在遍历 done



//TODO
其实大部分时候打怪 并不会去主动选择怪物 所以在死亡空间激活机制上 尽量少使用先杀小怪 触发2boss的机制
考虑一下


要不开始做任务?
不知道怎么开始做进阶 另外舰船加成 技能的机制换了 这边怎么处理

陨铁矿
钛合金
石英砂
同位素
贫铀矿
富勒烯
钙辉石
重稀土
石灰岩
辉长岩


钛合金
斜长石
沉积岩
石英砂
稀磷矿
富勒烯



昨天构思了一下
舰船不做蓝图机制 改成WOW商业技能的机制
装备?不做蓝图只掉落成品

制造CD? 制造时间

打怪经验 掉落 升级特效 残骸特效



//TODO 增加基础类型
名称也准备 增加主名称 和基础类型名称
例如
标准小型重解炮
小型重解炮

改良小型重解炮
小型重解炮

欧伏小型重解炮
小型重解炮

烈火之怒
小型重解炮


//构思一下掉落
先把装备按照势力分布获取数据
然后再分析掉落    无势力的最后再说
掉落数量想采用传奇的机制 掉落质量还没想好
获取品质为3的装备 匹配中文 如果是这个势力的 则加入掉落到这个势力的列表


主线任务呢?

势力任务规划

细节和要扣查的地方很多
下一步 做任务??!!

完全没想好任务怎么规划
任务一定是私有的
任务点 ? 任务 无需进空间站 接任务  交任务也无需进入空间站

塞尔达 和 不朽的任务模式 明显塞尔达的更舒服

任务分为 势力9 规格6 难度3

0护卫普通 2 4
1驱逐普通 3 5
2巡洋普通 4 6
3战列普通 5 7
4无畏普通 6 8
5泰坦普通 7 9

当前势力声望1.0 需要势力声望至少达到 0 才可以获取任务
您已满足当前声望需求
您已经接取了当前级别的任务
您在1个小时内接到任务放弃不掉声望
再次连续放弃任务会损失声望
                     任务列表
快递任务 暂时不做
     获取新任务       任务名称[未接受][已接受][已完成]
战斗任务
     消灭海盗
     警告:完成该任务将会降低对应势力声望?? 要不要这个设定
采集任务 暂时不做
物资任务 暂时不做


手动接的任务 任务有效期7天 有上限限制 0 /10
其他任务 例如 故事线和远程 都有24小时期限 不太容易获得 不设上限

远征点击完了完成有啥用 获取LP
任务奖励如果有物品不去空间站交任务怎么办?
随便找个本势力的空间站放一下(不好找)
要不就设定出生空间站 基地空间站24小时冷却

当隐藏任务点数到达一定程度 触发这个
然后把远征也放到任务列表里
您收到了一项特殊的任务,这将会对您的势力声望产生极大的影响



[主线] 红 大概持续 4 5天
[远征] 紫
[势力] 绿
[委托] 白

一共3个面板
1是当前任务列表
2是委托任务接受列表
3是任务详情


[未确认] 白色 没有这个状态
[已接受] 红色
[已完成] 绿色
[已交付] 灰色



[任务类型]名称[规格6][难度5][势力名称]   过期时间
目标:[敌对势力名称] 消灭[舰船名称] 10/10   [未达成/已达成]
奖励:忠诚点数

距离


例:
[主线]名称[等级4][致命]  [阵营LOGO] 倒计时:23:59:59
地点: [星系名称][安等] 距离               折跃/离站
目标: 消灭[阵营LOGO][海盗的舰船] 10/10
奖励:忠诚点数10000 电子货币10000 [100毫米炮]1


           任务详情
[主线]名称[等级4][致命]  倒计时:23:59:59
    我是任务描述,我还是描述,去消灭他们吧
    飞去目标所在地,消灭出现的海盗.
地点:
    [星系名称][安等] 距离               折跃/离站
目标:
    [星系名称][安等]  消灭[海盗的舰船] 10/10
奖励:
    忠诚点数10000 电子货币10000 [100毫米炮]1

     拒绝   放弃   接受



荣誉点数


准备再调整模版哪里的任务类型放到选项上 而不是阶段上
因为如果是任务,需要完成的步骤 则需要提前统计任务数量
就是说 刚刚到达最后一步的时候就要触发一些逻辑




扫描
一定要在击毁目标之前完成扫描


委托任务
势力 下拉框  等级下拉框 类型下拉框

当前声望 声望需求
进度条
维修服务 运送服务 市场服务 0停靠服务 11级任务 22级任务 33级任务
攻击  停靠 一级 服务  二级 三级 四级 五级 六级
-5    -3   -2  0     1    2   3   4    5

按钮 获取(确定) 减次数  增加次数倒计时

                            接受

三选一 五选一 根据UI高度来
方案有很多 整体例如让用户能刷刷刷 又不能无限刷刷刷
一 每隔N分钟 增加一次选择次数 5次可以依次做完
二 5选其中之一
三




新问题
海盗死亡空间的刷新 应该刷新在高安低安和00
那海军的空间 刷在哪 刷子在敌对势力?和本势力?
