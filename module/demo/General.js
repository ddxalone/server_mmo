const m_server = require("../server");
const common = require("../common");
const BaseMapGalaxyData = require("../data/BaseMapGalaxyData");
const WarpInfo = require("../server/map/info/WarpInfo");

exports.testWarpTime = () => {
    let unit_type = common.static.MAP_UNIT_TYPE_SHIP_PLAYER;
    let mass = 20000;
    let mass_ratio = common.method.getMassRatio(mass);

    let warp_info = new WarpInfo()
        .setUnitType(unit_type)
        .setMassRatio(mass_ratio)
        .updateShipWarpFrame();

    dd(warp_info);
}

exports.testBlast = () => {
    let blast = {
        '旗舰无技能': 100,
        '旗舰满技能': 125,
        '大型无技能': 200,
        '大型满技能': 250,
        '小型无技能': 400,
        '小型满技能': 500,
    };
    let radius = {
        '护卫': 40,
        '驱逐': 50,
        '巡洋': 80,
        '战列': 100,
        '无畏': 160,
        '泰坦': 200,
        '空间站': 500,
    };

    let title = '                   ';
    for (let ship in radius) {
        title += ship + '(' + radius[ship] + ')' + '   ';
    }
    console.log(title);
    for (let type in blast) {
        let text = type + '(' + blast[type] + ')' + '      ';
        for (let ship in radius) {
            text += getRatio(blast[type], radius[ship]) + '        ';
        }
        console.log(text);
    }

    function getRatio(blast, radius) {
        let value = Math.floor(Math.min(1, blast / 20000 * radius) * 100);
        (value < 100) && (value = ' ' + value);
        return value + '%';
    }
}

exports.testDropQuality = () => {
    let quality = 2;
    let score = 100;
    let quality_list = {};
    for (let i = 0; i < 100000; i++) {
        let random_quality = m_server.DropService.getRandomQuality(quality, score);
        if (quality_list[random_quality]) {
            quality_list[random_quality]++;
        } else {
            quality_list[random_quality] = 1;
        }
    }
    dd(quality_list);

    //结论 当 品质是3 普通boss
    //score = 100   78白装 20绿装 2蓝装
    //score = 400   76白装 20绿装 3蓝装
    //score = 1000  75白装 21绿装 3.3蓝装
    //score = 10000 71白装 24绿装 4.5蓝装

    //结论 当 品质是5 地狱boss
    //score = 100   93紫装 6金装 0.2红装
    //score = 400   76白装 20绿装 3蓝装
    //score = 1000  75白装 21绿装 3.3蓝装
    //score = 10000 89紫装 9金装 0.6红装

    // 最终期望 100 就是 100掉率
    // 200 就是 200掉率
    // 直接换算成价值
    // 价值比例 1:2:8:64:1024:32768
    // 例如品质0
    // 则必掉白装 score = 100 final=1
    // 则必掉白装 score = 200 final=2??白装是没法的
    // 得分100
    // 品质1 66白装 33绿装 符合公式1:2 = 0.66*1+0.33*2 = 1.33
    // 品质2 61白装 30绿装 7.6蓝装 符合公式1:2:8 = 0.6*1+0.3*2+0.076*8 = 0.6+0.6+0.6 = 1.8
    // 品质3 78绿装 20蓝装 2.4紫装 符合公式2:8:64 = 0.78*2+0.20*8+0.024*64 = 1.56+1.6+1.5 = 4.6
    // 品质4 88蓝装 11紫装 0.6金装 符合公式8:64:1024 = 0.88*8+0.11*64+0.006*1024 = 7.04+7.04+6.144 = 20
    // 品质5 93紫装 5.8金装 0.2红装 符合公式64:1024:32768 = 0.93*64+0.058*1024+0.002*32768 = 60+59+65 = 180
    // 怎么导出来这个公式

    // 得分200
    // 品质0 期望价值 2 但是做不到
    // 品质1 期望价值 2.66 哪怕是全爆绿装 也才1*2 = 2的价值
    // 品质2 期望价值 3.6  如果全爆蓝装 则1*8= 8的价值 假设开平方 最大为1:1:1 = 0.33*1+0.33*2+0.33*8 = 0.33*11 = 3.3 勉强够 (如果要300呢)
    // 品质3 期望价值 9.2  最大为1:1:1 = 0.33*2+0.33*8+0.33*64 = 0.33*74 = 24
    // 品质4 期望价值 40 最大为1:1:1 0.33*(8+64*1024) = 365
    // 品质5 期望价值 360 最大为1:1:1 0.33*(64+1024+32768) = 11285

    // 得分1000
    // 品质0 期望价值 10 但是做不到
    // 品质1 期望价值 13.3 也做不到
    // 品质2 期望价值 18  如果全爆蓝装 则1*8= 8的价值 假设开平方 最大为1:1:1 = 0.33*1+0.33*2+0.33*8 = 0.33*11 = 3.3 做不到
    // 品质3 期望价值 46  最大为1:1:1 = 0.33*2+0.33*8+0.33*64 = 0.33*74 = 24 做不到 极限最大为0:0:1 = 64
    // 品质4 期望价值 200 最大为1:1:1 0.33*(8+64*1024) = 365
    // 品质5 期望价值 1800 最大为1:1:1 0.33*(64+1024+32768) = 11285

    // 得分1000
    // 品质2 期望价值 18 0*1+3*2+1.52*8 = 6+12.16
    // 品质3 期望价值 46 0*2+2*8+0.48*64 = 16+30 = 46
    // 品质4 期望价值 200 0*8+1.1*64+0.12*1024 = 70+123 = 193
    // 品质5 期望价值 1800 0.93*64+0.058*1024+0.002*32768 0.38*64+0.58*1024+0.04*32768 = 24+593+1310 = 1800

    // 得分1000
    // 品质5 期望价值 1800 0.60*64+0.37*1024+0.02*32768 = 38+378+655.36

    // 以上是计算过程 都废弃了 新公式大概是score100为1倍爆率200为2倍1000为10倍


    dd(quality_list);
}

exports.randomGalaxy = () => {
    let time = common.func.getUnixMTime();
    for (let i = 1; i < 10000; i++) {
        m_server.ServerWorldBlock.getRandomGalaxyFromSafe(10, 12, 3);
    }

    ff('耗时 ' + (common.func.getUnixMTime() - time));

    dd('end');
}

exports.testCallback = () => {
    class class_a {
        constructor(i) {
            this.i = i;
        }

        setCallback(callback, thisObj) {
            this.callback = callback;
            this.thisObj = thisObj;
        }

        getCallback() {
            this.callback && this.callback.call(this.thisObj, this.i)
        }
    }

    class class_b {

    }

    let list = {};
    for (let i = 0; i < 10; i++) {
        list[i] = new class_a(i);
        list[i].setCallback((i) => {
            ff('i am ' + i);
        }, this);
    }


    for (let i = 0; i < 10; i++) {
        let cls = list[i];

        delete list[i];
        cls.getCallback();
    }
    dd();
};

exports.testMassRatioAndWarpFrame = () => {
    ff(Math.log10(100));

    let mass_list = [
        0.1,
        1,
        50,
        99,
        100,
        200,
        1000,
        2000,
        10000,
        20000,

        200,
        350,
        2000,
        3500,
        20000,
        35000,
    ];

    for (let mass of mass_list) {
        let mass_ratio = common.method.getMassRatio(mass * 100);


        let warp_sum = Math.ceil(Math.sqrt(mass_ratio / 10) * 2)

        ff(mass, mass_ratio, warp_sum + 's');
    }
};

exports.testGalaxyDistance = () => {
    let galaxy1 = 7045;
    let galaxy2 = 2143;
    let galaxy1_info = BaseMapGalaxyData.BaseMapGalaxyData[galaxy1 - 1];
    let galaxy2_info = BaseMapGalaxyData.BaseMapGalaxyData[galaxy2 - 1];

    let distance = common.func.getDistance(galaxy1_info[2], galaxy1_info[3], galaxy2_info[2], galaxy2_info[3]);


    if (Math.abs(galaxy1_info[2] - galaxy2_info[3]) < common.setting.map_galaxy_radius * common.setting.map_galaxy_radius_ratio * 10
        && Math.abs(galaxy1_info[3] - galaxy2_info[3]) < common.setting.map_galaxy_radius * common.setting.map_galaxy_radius_ratio * 10
    ) {
        // ff(x, sub_galaxy_info.x, y, sub_galaxy_info.y, map_galaxy_radius * map_galaxy_radius_ratio * 10);
        // console.log('[' + galaxy_id + '] check overlap false');
        ff('yes');
    } else {
        ff('no')
    }


    ff(common.setting.map_galaxy_radius);
    ff(galaxy1_info, galaxy2_info);
    dd(distance);
};

exports.testThruster = () => {
    //舰船质量
    let ship_mass = 100;
    let thruster_mass = 100;
    let item_mass = 10;
    let item_count = 5;
    let thruster = 250;
    let ratio = 0.5;//0.3刚好是200% 100% 50% 25% 但是考虑到推子本身带来的质量过大调整系数

    for (let ship_size = 0; ship_size < 3; ship_size++) {
        for (let thruster_size = 0; thruster_size < 3; thruster_size++) {
            let total_mass = ship_mass * Math.pow(10, ship_size)
                + item_mass * Math.pow(10, ship_size) * item_count * (ship_size + 1)
                + thruster_mass * Math.pow(10, thruster_size);


            let total_thruster = thruster * Math.pow(10, thruster_size);

            let thruster_ratio = Math.floor(total_thruster / total_mass * 1000) / 1000;
            if (ship_size === thruster_size) {
                fff('red', getShipName(ship_size),
                    getThrusterName(thruster_size),
                    total_thruster,
                    total_mass,
                    thruster_ratio,
                    Math.floor(Math.pow(thruster_ratio, ratio) * 1000) / 1000)

            } else {
                ff(getShipName(ship_size),
                    getThrusterName(thruster_size),
                    total_thruster,
                    total_mass,
                    thruster_ratio,
                    Math.floor(Math.pow(thruster_ratio, ratio) * 1000) / 1000)
            }
        }
    }

    function getShipName(ship_size) {
        switch (ship_size) {
            case 0:
                return '小型舰船';
            case 1:
                return '大型舰船';
            case 2:
                return '旗舰级舰船';
        }
    }

    function getThrusterName(thruster_size) {
        switch (thruster_size) {
            case 0:
                return '小型推子';
            case 1:
                return '大型推子';
            case 2:
                return '旗舰级推子';
        }
    }

    dd('end');
};

exports.testgetNaturalRecovery = () => {
    for (let capacity_per = 0; capacity_per < 10000; capacity_per += 100) {
        if (capacity_per > 9700 || capacity_per < 100) {
            ff(capacity_per, Math.floor(100 / 25));
        } else if (capacity_per > 2500) {
            ff(capacity_per, Math.floor(100 * (10000 - capacity_per) / 7500));
        } else {
            ff(capacity_per, Math.floor(100 * (capacity_per) / 2500));
        }
    }
    dd('end');
}

exports.testPosRatio = () => {
    for (let total = 1; total <= 10; total++) {
        ff(total, 'start ------------------------------------------');
        for (let pos = 0; pos < total; pos++) {
            ff(pos, common.method.getPosRatio(pos, total));
        }
        ff(total, 'end ------------------------------------------');
    }

    dd('end');
};
/**
 * 断层圆形方形效率计算
 */
exports.distance = () => {
    //先创建 一些坐标
    let list = [];
    for (let pos = 0; pos < 10000; pos++) {
        list.push({x: common.func.getRand(1, 100), y: common.func.getRand(1, 100)});
    }

    let start = common.func.getUnixMTime();

    let count = 0;
    for (let pos1 in list) {
        for (let pos2 in list) {
            if (false) {
                // 6000 3800
                if (common.func.getDistance(list[pos1].x, list[pos1].y, list[pos2].x, list[pos2].y) < 90) {
                    count++;
                }
            } else {
                // 5300 3100
                if (Math.abs(list[pos1].x - list[pos2].x) < 80 && Math.abs(list[pos1].y - list[pos2].y) < 80) {
                    count++;
                }
            }
            //tween 9100
        }
    }

    console.log('count', count);
    console.log('time', common.func.getUnixMTime() - start);

    process.exit();
};

/**
 * 断层分离
 */
exports.separate = () => {
    let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].sort((a, b) => {
        return b - a;
    });
    let rule = [
        [1, 4],
        [4, 5],
        [5, 19],
        [1, 20],
    ];

    console.log('list', list);
    let obj = {};
    let init = true;
    for (let pos in list) {
        obj[list[pos]] = init;
        if (init) init = false;
    }
    console.log('obj', obj);

    let is_end = false;
    while (is_end === false) {
        is_end = true;
        for (let pos in list) {
            let id = list[pos];
            for (let check_pos in list) {
                let check_id = list[check_pos];
                if (in_rule(id, check_id)) {
                    //如果目标为true 则修目标为true
                    if (obj[id] && obj[check_id] === false) {
                        obj[check_id] = true;
                        //有一个触发 则重新遍历
                        is_end = false;
                    }
                }
            }
        }
    }

    function in_rule(id, check_id) {
        let id_is_in = false;
        let check_id_is_in = false;
        //遍历规则
        for (let pos in rule) {
            let ru = rule[pos];
            id_is_in = false;
            check_id_is_in = false;
            //遍历规则下的所有项
            for (let p in ru) {
                let v = ru[p];
                if (v === id) {
                    id_is_in = true;
                }
                if (v === check_id) {
                    check_id_is_in = true;
                }
            }
            //如果都包含则为true
            if (id_is_in && check_id_is_in) {
                return true;
            }
        }
        return false;
    }

    // while (list.length) {
    //     let first = list.shift();
    //     for (let id in obj) {
    //         let nearest = false;
    //         //规则
    //         if (rule[first] && rule[first][id]) {
    //             nearest = true;
    //         }
    //         if (nearest) {
    //             if (obj[first]) {
    //                 obj[id] = true;
    //             }
    //         }
    //     }
    // }

    console.log(obj);
    process.exit();
};


exports.copy = () => {
    function a() {
        this.value = {a: 1};
        this.getValue = () => {
            this.value.a = 2;
            let value = this.value;
            this.clearValue();
            global.ff(value, this.value);
            return value;
        };
        this.clearValue = () => {
            this.value = {};
        }
    }

    let aa = new a();
    global.dd(aa.getValue());
};


exports.sort = () => {
    let a = {};
    a['11'] = true;
    a['21'] = true;
    a['101'] = true;
    a['1'] = true;
    a['2'] = true;
    global.dd(a);
};

exports.angle = () => {
    //从12点开始 顺时针
    ff(common.func.anglePoint(0, 0, 0, 100));
    ff(common.func.anglePoint(0, 0, 4500, 100));
    ff(common.func.anglePoint(0, 0, 9000, 100));
    ff(common.func.anglePoint(0, 0, 13500, 100));
    ff(common.func.anglePoint(0, 0, 18000, 100));
    ff(common.func.anglePoint(0, 0, 22500, 100));
    ff(common.func.anglePoint(0, 0, 27000, 100));
    ff(common.func.anglePoint(0, 0, 31500, 100));
    ff(common.func.anglePoint(0, 0, 36000, 100));

    ff(common.func.getAngle(0, 0, 0, -100));
    ff(common.func.getAngle(0, 0, 71, -71));
    ff(common.func.getAngle(0, 0, 100, -0));
    ff(common.func.getAngle(0, 0, 71, 71));
    ff(common.func.getAngle(0, 0, 0, 100));
    ff(common.func.getAngle(0, 0, -71, 71));
    ff(common.func.getAngle(0, 0, -100, 0));
    ff(common.func.getAngle(0, 0, -71, -71));
    ff(common.func.getAngle(0, 0, -0, -100));
    dd('end');
};

exports.data = () => {

    const common = require("../common");
    console.log(typeof common.define.ACCOUNT_PLAYER_LOGOUT, common.define.ACCOUNT_PLAYER_LOGOUT)
    dd('end');
    // const BaseShipPlayerInfo = require("../data/BaseShipPlayerInfo");.BaseShipPlayerInfo;
    // console.log(BaseShipPlayerInfo.aaa());
    // dd('end');
};

exports.boom_point = () => {

    let base_check_range = 10000;

    for (let abs_angle = 0; abs_angle < 9000; abs_angle += 100) {
        let check_range = base_check_range;
        if (abs_angle < 1) {
            check_range += 3333 * 6;
        } else if (abs_angle < 9000) {
            check_range = Math.min(base_check_range + 3333 * 6, check_range / Math.cos(common.func.angleToRadian(9000 - abs_angle)));
        }
        console.log('角度', abs_angle, '范围', check_range);
    }
    dd('end');
    //sin(半径/ 半径+6帧移动距离)
    //求出 低于这个角度 按照最大值来取
    let a = Math.asin(check_range / (check_range + 3333 * 6));
    let b = common.func.radianToAngle(a);
    // 当角度小于b 则取 check_range + 3333 * 6 为命中距离
    // 当角度大于b 小于90度 例如45度则取 (check_range + 3333 * 6) * sin(45)为命中距离

    let c = Math.cos(common.func.angleToRadian(9000 - 1));
    let d = check_range / c;
    dd('角度', b, ' 比例', d);


    dd(Math.sin(common.func.angleToRadian(3000)));
    let x = 0, y = -0, rotation = 3000, range = 100;
    let s_x = 1, s_y = -1, radius = 100;
    //假设缓存以后能炸到 (速度很快) 找前进距离和 目标半径的 前面的交点
    let distance = common.func.getDistance(x, y, s_x, s_y);

    let boom_point = common.func.anglePoint(x, y, rotation, distance - radius);
    boom_point.x += x;
    boom_point.y += y;
    dd(distance, boom_point);

    let angle = common.func.getAngle(x, y, s_x, s_y);
    //垂线长度
    let line = Math.sin(common.func.angleToRadian(angle - rotation)) * radius;
    //垂线和半径tga

    let angle2 = Math.acos(line / radius) / Math.PI * 180;


    //垂足坐标
    let floor_point = common.func.anglePoint(s_x, s_y, -(9000 - (angle - rotation)), line);
    //我去 查了半天 好麻烦的算法..
    //构思一个差不多的方案就行


    dd(distance, angle, line, angle2);
};

exports.name = () => {
    let base_name = '德里克伏尔戈静寂谷底特邪恶湾流地窖灼热之径因斯姆布大荒野柯糟粕域卡彻维纳长征螺旋塔什蒙贡外走廊混浊黑渊伊梅瑟亚琉蓝穹摩登赫舞西玛绝金泽赛洱勒瓦拉阔廉破碎埃希幽暗索欧莎辛迪加美伯多孤独斐普罗宁尼逑瑞云环钴边艾血脉非波利源泉摄魂菲米贝精华佐佩根弗吉格温铎涌文姗安莫兰茨娜达列奥隆贵苏比乔诺恩肯本吕以哈萨日厄沙沃帕乐极回声永欢硬朗堂昆考奇郝几塞呐咖凯皮嫩阿雅乌曼弥陀马查坎芬那林妮扎巴托提丹尤杰欣忒耶但夏费缪佛胡威夫杜海穆万法努狄盖伦境区素廖惹奎森鲁伽舜藤基羯爱毕贾舍耳齐坦冷蒂按衮津科霍逖伐莱印雷魔培劳别纹毛幕典丁龙坚顿残洛彼泰荷然兹历迈约恒拜皇冠形衣带飞挥剑家权杖丝绒鞋座狮蝎半麒麟堤怪凤凰库驮农雯腾圣诗寇能珈电裔疆暂译熔星系名葡得赤昂的谢戴古宇图士朱汀博汉始密珥被新仑他班拿色卢北明邦拖所涅内撒了吞简坷路腊依泊切为度娅义舒杨首迷讷祖赖默释俄哥歇福柏力甘左柴仁宾南碧朵赞客杂必代若休歌理宝唐瓜卓康黛奈麦果围述犹三君纶郡至燃下上爵漠敦挨庸陶楞可浮部略留挪迦模发仙臣丽扬喀逾支通朔封黎横则儿论归察烈琳各细山溪罕孙浦门浓漫息酷由翰么玫壁把葛捏范孔湖泛光潘韦迭老界包厦雪坡阮宗空轮耐礼口点承甸靠铁堡策奴呼派佳席';

    let extra_name = '萨德斯克玛艾恩格诺尔沃纳弗曼托格索伏迪欧';


    let base_name_length = base_name.length;
    let extra_name_length = extra_name.length;
    for (let pos = 0; pos < 1000; pos++) {
        // for (let name_pos = 0; name_pos < base_name_length; name_pos++) {
        //     for (let extra_pos = 0; extra_pos < extra_name_length; extra_pos++) {
        // console.log(base_name.substr(name_pos, 1) + base_name.substr(extra_pos, 1));
        let name_random = common.func.getRand(0, base_name_length - 1);
        let extra_random = common.func.getRand(0, extra_name_length - 1);
        console.log(base_name.substr(name_random, 1) + extra_name.substr(extra_random, 1));
        // }
        // }
    }

    //盖诺
    //兹萨
    //热德
    //暗迪
    //布恩
    //萨德
    //塞尔
    //印格
    //沙纳
    process.exit();
};


exports.time = () => {
    let date = null;
    date = new Date(common.func.getThisWeekUnixTime(6) * 1000);
    ff(date.toString());

    date = new Date(common.func.getThisDayUnixTime() * 1000);
    ff(date.toString());

    date = new Date(common.func.getThisHourUnixTime() * 1000);
    ff(date.toString());

    ff(common.func.getThisHour());


    process.exit();
};


exports.warp = () => {
    //假设我从下方向上方折跃
    //假设终点坐标为00
    let warp_angle = 0;
    let radius = 100;
    let warp_point = common.func.Point(0, 0);

    let step = 0;
    do {
        for (let y = -step; y <= step; y++) {
            for (let x = -step; x <= step; x++) {
                //只遍历最外圈
                if (Math.abs(x) === step || Math.abs(y) === step) {
                    let angle = common.func.getAngle(0, 0, x, y);
                    let point = common.func.anglePoint(warp_point.x, warp_point.y, warp_angle + angle, radius * step);
                    fff('redBG', x, y, angle, point);
                }
            }
        }
        step++;
    } while (step <= 2)


    dd('end');
}


exports.testMap = () => {
    // Object.prototype[Symbol.iterator] = function () {
    //     const keys = Object.keys(this);
    //     let index = 0;
    //     return {
    //         next: () => {
    //             return {
    //                 value: [keys[index], this[keys[index++]]], // 每次迭代的结果
    //                 done: index > keys.length // 迭代结束标识 false停止迭代，true继续迭代
    //             };
    //         }
    //     }
    // }


    let count = 5000000;
    let map = new Map();
    let obj = {};
    let arr = [];


    ff('set----------------------');
    let arr_start = common.func.getUnixMTime();
    for (let i = 0; i < count; i++) {
        arr.push(new obj_class(i));
    }
    fff('red', 'arr set time ', common.func.getUnixMTime() - arr_start);

    let obj_start = common.func.getUnixMTime();
    for (let i = 0; i < count; i++) {
        obj[i] = new obj_class(i);
    }
    fff('red', 'obj set time ', common.func.getUnixMTime() - obj_start);

    let map_start = common.func.getUnixMTime();
    for (let i = 0; i < count; i++) {
        map.set(i, new obj_class(i));
    }
    fff('red', 'map set time ', common.func.getUnixMTime() - map_start);

    fff('red', 'get----------------------');
    arr_start = common.func.getUnixMTime();
    for (let i = 0; i < count; i++) {
        let temp = arr[i];
        if (i === 10) {
            ff(temp);
        }
    }
    fff('red', 'arr get time ', common.func.getUnixMTime() - arr_start);

    arr_start = common.func.getUnixMTime();
    for (let i = 0, len = arr.length; i < len; i++) {
        let temp = arr[i];
        if (i === 10) {
            ff(temp);
        }
    }
    fff('red', 'arr2 get time ', common.func.getUnixMTime() - arr_start);

    obj_start = common.func.getUnixMTime();
    for (let i = 0; i < count; i++) {
        let temp = obj[i];
        if (i === 10) {
            ff(temp);
        }
    }
    fff('red', 'obj get time ', common.func.getUnixMTime() - obj_start);

    map_start = common.func.getUnixMTime();
    for (let i = 0; i < count; i++) {
        let temp = map.get(i)
        if (i === 10) {
            ff(temp);
        }
    }
    fff('red', 'map get time ', common.func.getUnixMTime() - map_start);


    fff('red', 'each----------------------');
    arr_start = common.func.getUnixMTime();
    for (let v of arr) {
        let temp = v;
        if (v.id === 10) {
            ff(temp);
        }
    }
    fff('red', 'arr each time ', common.func.getUnixMTime() - arr_start);


    obj_start = common.func.getUnixMTime();
    for (let i in obj) {
        let temp = obj[i];
        if (i === '10') {
            ff(temp);
        }
    }
    fff('red', 'obj each time ', common.func.getUnixMTime() - obj_start);

    obj_start = common.func.getUnixMTime();
    let obj_keys = Object.keys(obj);
    for (let i of obj_keys) {
        let temp = obj[i];
        if (i === '10') {
            ff(temp);
        }
    }
    fff('red', 'obj2 each time ', common.func.getUnixMTime() - obj_start);


    obj_start = common.func.getUnixMTime();
    let obj_values = Object.values(obj);
    for (let v of obj_values) {
        let temp = v;
        if (v.id === 10) {
            ff(temp);
        }
    }
    fff('red', 'obj3 each time ', common.func.getUnixMTime() - obj_start);

    // obj_start = common.func.getUnixMTime();
    // for (let i of obj) {
    //     let temp = obj[i];
    //     if (i === '10') {
    //         ff(temp);
    //     }
    // }
    // fff('red','obj3 each time ', common.func.getUnixMTime() - obj_start);


    map_start = common.func.getUnixMTime();
    for (let [k, v] of map) {
        let temp = v;
        if (k === 10) {
            ff(temp);
        }
    }
    fff('red', 'map each time ', common.func.getUnixMTime() - map_start);

    map_start = common.func.getUnixMTime();
    map.forEach((v, k) => {
        let temp = v;
        if (k === 10) {
            ff(temp);
        }
    }, this)
    fff('red', 'map2 each time ', common.func.getUnixMTime() - map_start);


    //结论 map在遍历的时候速度快10倍
    //set get object比map快10倍
    //那所有遍历的地方 改成map性能会高很多

    //map有个最大的问题 无法排序
    //TODO 未来有大数据了就改

    dd('end');
}

/**
 * 弹药波次 考虑对称
 */
exports.bullet_delay = () => {
    let total = 20;
    // let delay = 10;
    //获取总数下各个波数的弹药分布
    for (let delay = 1; delay <= total; delay++) {
        //把余数放到第一个数组
        //先获取对称后每波次的最大数量
        let per = Math.max(1, Math.floor(total / delay / 2)) * 2;
        //计算剩余未分配的弹药数量
        let surplus = Math.max(total % 2, total - delay * per);
        let list = {};
        for (let pos = 0; pos < total; pos++) {
            let value = Math.max(0, Math.floor((pos - surplus) / per));
            list[value] || (list[value] = 0);
            list[value]++
            // ff(pos, Math.max(0, Math.floor((pos - surplus) / per)));
            // ff(pos, Math.floor(pos - (total % delay)  /  delay));
            // ff(pos, Math.floor(pos / total * delay));
        }
        ff(delay, JSON.stringify(Object.values(list)));
    }
    //获取固定波在各个总数下的弹药分布

    let max_total = 20;
    let delay = 10;
    for (let total = 1; total <= max_total; total++) {
        //把余数放到第一个数组
        //先获取对称后每波次的最大数量
        let per = Math.max(1, Math.floor(total / delay / 2)) * 2;
        //计算剩余未分配的弹药数量 如果是奇数最少1个 可以保证只有第一个数组是单数
        let surplus = Math.max(total % 2, total - delay * per);
        let list = {};
        for (let pos = 0; pos < total; pos++) {
            let value = Math.max(0, Math.floor((pos - surplus) / per));
            list[value] || (list[value] = 0);
            list[value]++
            // ff(pos, Math.max(0, Math.floor((pos - surplus) / per)));
            // ff(pos, Math.floor(pos - (total % delay)  /  delay));
            // ff(pos, Math.floor(pos / total * delay));
        }
        ff(total, JSON.stringify(Object.values(list)));
    }
    dd('end');
};


class obj_class {
    constructor(id) {
        this.id = id;
    }
}
