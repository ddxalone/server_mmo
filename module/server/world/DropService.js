const m_server = require("../../server");
const common = require("../../common");

/**
 * 掉落处理服务层
 * @class {DropService}
 */
class DropService {
    constructor() {
        /**
         * 1势力 2规格 3品质 4权重
         * @type {Object<number,Object<number,Object<number,Object<number,number>>>>}
         */
        this.drop_list = {};

        //各个品质掉落的顺序表
        this.random_item_list = {};
        //品质向下蔓延的等级
        this.base_quality_range_level = 2;
        //规则1 有规格的装备特定规格才掉落 所有权重*3
        this.base_size_ratio = 3;
        //规则2 武器的权重*2
        this.base_weapon_ratio = 2;
        //规则2
        //权重 越高爆率越高
        this.base_item_drop_ratio = {
            0: 32768,
            1: 16384,
            2: 4096,
            3: 512,
            4: 32,
            5: 1,
        };
    }

    static instance() {
        if (DropService.m_instance == null) {
            DropService.m_instance = new DropService();
        }
        return DropService.m_instance;
    }

    async initDropList() {
        this.initItemDropList();
    }

    initItemDropList() {
        this.setItemDropListData(Object.values(m_server.ServerBaseItem.base_item_weapon_list));
        this.setItemDropListData(Object.values(m_server.ServerBaseItem.base_item_module_list));

        this.initRandomItemList();
    }

    /**
     * 分析基础武器或者模块信息
     * @param data
     * @return {[*, *]}
     */
    setItemDropListData(data) {
        //武器分组
        let item_type_group = {};
        //势力装特殊分组 势力装备只有同势力的才放到掉落列表
        // let distribution_group = {};
        let force_group = {};
        for (let datum of data) {
            let base_item_type = datum.getDaoValue('base_item_type');
            let quality = datum.getDaoValue('quality');
            let size = datum.getDaoValue('size');
            let main_classify = common.method.getMainClassifyUseClassify(datum.getDaoValue('classify'));
            //把所有装备按照基础物品ID放到数组里 包含品质未来计算权重
            item_type_group[base_item_type] || (item_type_group[base_item_type] = {});

            let item_weight = (size ? this.base_size_ratio : 1) * (main_classify === common.static.ITEM_MAIN_CLASSIFY_WEAPON ? this.base_weapon_ratio : 1);

            //先判断势力有哪些基础类型
            if (quality === common.define.ITEM_DISTRIBUTION_QUALITY) {
                let distribution_name = datum.getDaoValue('name').substr(0, 2);
                if (common.define.DISTRIBUTION_FORCE_CLASSIFY[distribution_name]) {
                    let force = common.define.DISTRIBUTION_FORCE_CLASSIFY[distribution_name];
                    //把基础物品类型放到阵营下
                    force_group[force] || (force_group[force] = {});
                    force_group[force][base_item_type] = size;

                    //同势力装备直接创建到掉落列表
                    this.drop_list[force] || (this.drop_list[force] = {});
                    this.drop_list[force][size] || (this.drop_list[force][size] = {});
                    this.drop_list[force][size][quality] || (this.drop_list[force][size][quality] = {});
                    this.drop_list[force][size][quality][datum.item_type] = item_weight;

                } else {
                    dd('未找到势力分布', datum)
                }
            } else {
                //非势力装备全部放到掉落列表
                item_type_group[base_item_type][quality] || (item_type_group[base_item_type][quality] = {});
                item_type_group[base_item_type][quality][datum.item_type] = item_weight;
            }
        }

        // ff(distribution_group);
        // ff(force_group)
        // ddf(item_type_group)
        //先遍历一遍 把数据按照势力装放到数组里
        //遍历阵营
        for (let force in force_group) {
            let base_item_types = force_group[force];
            // this.drop_list[force] || (this.drop_list[force] = {});
            //遍历阵营下的基础物品类型
            for (let base_item_type in base_item_types) {
                let size = base_item_types[base_item_type];
                // this.drop_list[force][size] || (this.drop_list[force][size] = {});

                for (let quality in item_type_group[base_item_type]) {
                    this.drop_list[force][size][quality] || (this.drop_list[force][size][quality] = {});

                    //把基础物品类型下的所有物品类型合并到掉落清单
                    Object.assign(this.drop_list[force][size][quality], item_type_group[base_item_type][quality]);
                }
            }
        }
    }

    /**
     * 初始化随机列表 掉落的时候 直接获取随机装备就行
     */
    initRandomItemList() {
        for (let force in this.drop_list) {
            this.random_item_list[force] = {};
            for (let size in this.drop_list[force]) {
                this.random_item_list[force][size] = {};
                for (let quality in this.drop_list[force][size]) {

                    //物品掉落表
                    let item_drop_list = {};
                    //生成无规格的物品掉落表
                    Object.assign(item_drop_list, this.drop_list[force] && this.drop_list[force][0] && this.drop_list[force][0][quality] || []);
                    if (size) {
                        //追加规格的物品掉落表
                        Object.assign(item_drop_list, this.drop_list[force] && this.drop_list[force][size] && this.drop_list[force][size][quality] || []);
                    }
                    let item_weight_list = [];
                    for (let item_type in item_drop_list) {
                        let item_weight = item_drop_list[item_type];
                        item_type = parseInt(item_type);
                        for (let pos = 0; pos < item_weight; pos++) {
                            item_weight_list.push(item_type);
                        }
                    }


                    //真全随机
                    let length = item_weight_list.length;
                    for (let index = 0; index < length - 1; index++) {
                        let randomIndex = Math.floor(Math.random() * (length - index)) + index;

                        [item_weight_list[index], item_weight_list[randomIndex]] = [item_weight_list[randomIndex], item_weight_list[index]];
                    }

                    this.random_item_list[force][size][quality] = item_weight_list;
                }
            }
        }
    }

    /**
     * 获取掉落列表
     * @param unit_ship_npcer
     * @return {Array<Object>}
     */
    getDropItemList(unit_ship_npcer) {
        //构思一下怎么写 这个功能会比较复杂 先写个大概功能最后再整理
        //先获取可能掉落物品的列表 获取权重
        //共32类装备 每类装备2个势力  每个势力7个分类
        //共9类武器 每类武器3个势力 每个势力1个分类
        //先决定个数 再去搞权重 这种机制几率好控制
        //缺点 遍历的有点多
        //爆率 可以动态调整权重随机数的最大 以及最小值 决定品质 不太行 权重曲线不是平均的
        //小本刷的快 掉落数量小 大本刷的慢 掉的多 整体数量稀有  整体数量上无差别 可以采用相同权重
        //难度影响掉落 简单:噩梦:地狱 1:2:3
        //核心平均产出1元/小时
        //中端副本每个产出0.08元 = 64白装 OR 32绿装 OR 8蓝装 OR 1紫装 OR 1/16金装 1/512红装
        //掉落向下顺延3个品质做权重处理 紫色怪物至少爆绿装 红色怪物至少爆紫装

        //开始 阵营 难度 品质 掉落和难度无关 只和品质有关
        //掉落数量 小怪 护卫0-1 泰坦掉落个0-3  boss 护卫1-3 泰坦6-8
        //

        let base_ship_info = unit_ship_npcer.getBaseShipInfo();
        let category = common.method.getShipCategory(base_ship_info.classify);
        let size = common.method.getShipSize(category);
        let force = base_ship_info.force;
        let quality = base_ship_info.quality;
        let is_boss = base_ship_info.is_boss;


        let score = base_ship_info.score;
        // score = 1000;
        //score 0   100   1000 10000
        //绿 22000 21000 21200 20000
        //蓝 5000  5500  6000  6700
        //紫 500   700   900   1300

        //泰坦小怪地狱
        // [category, quality, is_boss] = [6, 2, 0];
        //巡洋小怪地狱
        // [category, quality, is_boss] = [3, 2, 0];
        //巡洋小怪普通
        // [category, quality, is_boss] = [3, 0, 0];
        //护卫小怪普通 1-13
        // [category, quality, is_boss] = [1, 0, 0];
        //护卫boss普通
        // [category, quality, is_boss] = [1, 3, 1];
        //泰坦boss地狱 60-82
        // [category, quality, is_boss] = [6, 5, 1];
        // //
        // size = common.func.getShipSize(category);

        //如果是boss护卫1个起 泰坦6个起 小怪0个起
        let quality_rand_base = category * (is_boss ? 10 : 1);
        //20+品质*4 白色0-2 红色0-4
        let quality_rand_max = quality_rand_base + 12 + quality * 4;
        let drop_count_max = Math.floor(common.func.getRand(quality_rand_base, quality_rand_max) / 10);

        let drop_item_list = [];
        for (let pos = 0; pos < drop_count_max; pos++) {
            //开始算权重
            //1.获取总权重
            //2.染色 在从颜色里获取装备 保证品质爆率
            //染色逻辑
            let random_quality = this.getRandomQuality(quality, score);

            // random_quality = 5;
            //3.根据size 染色的色获取一个随机装备
            let random_item_type = this.getRandomItemType(force, size, random_quality);
            // let random_item_type = 1;
            let ship_drop_item = common.func.shipDropItem(pos, random_item_type, 1);

            drop_item_list.push(ship_drop_item);
        }

        return drop_item_list;
    }

    /**
     * 获取得分转换成pow的系数
     */
    getRatioPowRatio(score) {
        //把得分转换为pow系数 系数越大说明爆率越低
        //100-0 1-1.1 100-1000 1-0.9 10000=0.79 就及其夸张了
        if (score < 100) {
            return Math.round(Math.pow(100 - score, 0.5) + 100) / 100;
        }
        return Math.round(100 - Math.pow(score - 100, 1 / 3)) / 100;
    }

    /**
     * 获取品质的下限 向下降2级
     * @param quality
     * @return {number}
     */
    getMinQuality(quality) {
        //品质向下兼容2个 及白怪掉白装 蓝怪掉 白绿蓝 红怪掉 紫金红
        return Math.max(0, quality - this.base_quality_range_level);
    }

    /**
     * 获取权重后随即的品质
     * @param quality
     * @param score
     */
    getRandomQuality(quality, score) {
        if (quality) {
            //按比例转成权重系数后的数组
            let quality_weight_list = {};
            // 获取品质总权重
            let quality_weight_total = 0;
            // 遍历可能出现的品质类型
            let pos = 0;
            for (let weight_quality = this.getMinQuality(quality); weight_quality <= quality; weight_quality++) {
                // quality_weight_list[weight_quality] = Math.floor(Math.pow(this.base_item_drop_ratio[weight_quality], ratio_pow_ratio));
                let final_ratio = 1;
                if (pos) {
                    if (score > 100) {
                        //从第二个品质开始 *1倍爆率 *2倍爆率 可以理解为3个品质 最初级品质爆率不变 第二个品质爆率提升100% 提三个品质爆率提升200% 最后和提升300% /3 = 100%
                        //但其实分母也增加了 实际增加量不到这个数值
                        final_ratio = (score / 100 - 1) * pos + 1;
                    } else {
                        final_ratio = (Math.pow(score / 100, pos));
                    }
                }

                quality_weight_list[weight_quality] = Math.floor(this.base_item_drop_ratio[weight_quality] * final_ratio);
                quality_weight_total += quality_weight_list[weight_quality];

                // ff(final_ratio)
                pos++;
            }
            // dd(quality_weight_list)
            //随机一个权重
            let random_quality_weight = common.func.getRand(1, quality_weight_total);

            //遍历权重规则
            for (let weight_quality in quality_weight_list) {
                //如果在范围内
                if (random_quality_weight <= quality_weight_list[weight_quality]) {
                    return weight_quality;
                }
                //修正参数
                random_quality_weight -= quality_weight_list[weight_quality];
            }
        }
        return 0;
    }

    /**
     * 获取随机装备
     * @param force
     * @param size
     * @param quality
     * @returns {null|*}
     */
    getRandomItemType(force, size, quality) {
        let random_item_list = this.random_item_list[force] && this.random_item_list[force][size] && this.random_item_list[force][size][quality];
        //TODO
        if (!random_item_list) {
            dd('缺失掉落表', force, size, quality);
        }
        return random_item_list[common.func.getRand(0, random_item_list.length - 1)];
    }
}

DropService.m_instance = null;

module.exports = DropService;

