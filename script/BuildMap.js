/**
 * 构建地图数据脚本
 * @type {module:cluster}
 */
const cluster = require("cluster");
const fs = require("fs");
const canvas = require("canvas");
const path = require("path");
const common = require("../module/common");

global.ff = require('../module/common').func.ff;
global.dd = require('../module/common').func.dd;

let _startApp = () => {

    // this.seed = 2321;
    // this.seed = 2324;
    this.seed = 43241123;

    let seedRandom = () => {
        // this.seed = (this.seed * 9301 + 49297) % 233280;
        // return this.seed / 233280;
        this.seed = (this.seed * 4096 + 150889) % 714025;
        return this.seed / 714025;
    };

    let getSeedRand = (min, max) => {
        return Math.floor(seedRandom() * (max - min + 1) + min);
    };


    let arguments = process.argv.splice(2);
    console.log('startBuildMap...', arguments);

    //保险期间分为两步处理 第一步 生成json 第二步通过json写入数据库
    //最终运行放到数据库里 方便检索 开服的时候把这个数据加入到内存即可

    // let base_name = '布普德特格阿巴帕达塔加艾拜派戴泰盖埃贝佩态垓厄伯柏伊比皮迪蒂吉乌杜图古奥博波多托戈鲍堡道陶高尤久安班潘丹坦甘因恩本彭登根宾平丁庭金昂邦庞唐汤冈翁蓬东通贡邓藤克夫弗兹斯什奇思卡瓦法扎萨莎贾查撒凯塞沙泽瑟舍哲彻基维菲齐西希库武富朱苏舒丘科沃福佐索肖乔赞桑香詹钱肯文芬增森申琴康冯方藏琼孔丰宗雄赫姆尔伍哈马纳玛娜拉夸亚海迈奈莱怀黑梅内雷韦惠奎耶陌勒米尼利丽威霍莫诺洛罗约休纽柳留汉曼南兰万旺温';
    // let base_name = '德里克伏尔戈静寂谷底特邪恶湾流地窖灼热之径因斯姆布荒野柯糟粕域卡彻维纳长征螺旋塔什蒙贡外走廊混浊黑渊伊梅瑟亚琉蓝穹摩登赫舞西玛绝金泽赛洱勒瓦拉阔廉破碎埃希幽暗索欧莎辛迪加美伯多孤独斐普罗宁尼逑瑞云环钴边艾血脉非波利源泉摄魂菲米贝精华佐佩根弗吉格温铎涌文姗安莫兰茨娜达列奥隆贵苏比乔诺恩肯本吕以哈萨日厄沙沃帕乐极回声永欢硬朗堂昆考奇郝几塞呐咖凯皮嫩阿雅乌曼弥陀马查坎芬那林妮扎巴托提丹尤杰欣忒耶但夏费缪佛胡威夫杜海穆万法努狄盖伦境区素廖惹奎森鲁伽舜藤基羯爱毕贾舍耳齐坦冷蒂按衮津科霍逖伐莱印雷魔培劳别纹毛幕典丁龙坚顿残洛彼泰荷然兹历迈约恒拜皇冠形衣带飞挥剑家权杖丝绒鞋座狮蝎半麒麟堤怪凤凰库驮农雯腾圣诗寇能珈电裔疆暂译熔星系名葡得赤昂的谢戴古宇图士朱汀博汉始密珥被新仑他班拿色卢北明邦拖所涅内撒了吞简坷路腊依泊切为度娅义舒杨首迷讷祖赖默释俄哥歇福柏力甘左柴仁宾南碧朵赞客杂必代若休歌理宝唐瓜卓康黛奈麦果围述犹三君纶郡至燃下上爵漠敦挨庸陶楞可浮部略留挪迦模发仙臣丽扬喀逾支通朔封黎横则儿论归察烈琳各细山溪罕孙浦门浓漫息酷由翰么玫壁把葛捏范孔湖泛光潘韦迭界包厦雪坡阮宗空轮耐礼口点承甸靠铁堡策奴呼派佳席';
    let base_first_name = ["埃索", "埃维", "艾里", "暗涌", "贝", "波赫", "大荒", "德克", "德里", "地", "底特", "对舞", "多", "非塔波", "斐", "伏尔", "孤独", "钴蓝", "黑", "混", "吉勒", "金纳", "精华", "静寂", "绝地", "绝", "卡", "卡多", "卡勒瓦", "卡尼", "柯埃", "柯尔", "琉蓝", "螺旋", "美特伯", "摩登", "宁静", "欧米", "欧", "佩利", "破", "普罗维", "逑瑞", "赛塔", "摄魂", "塔什", "特布", "特里", "特", "外", "维格", "维纳", "西玛", "邪恶", "辛迪", "血", "伊梅", "因斯", "幽暗", "域外", "源泉", "云", "糟粕", "长", "灼热", "阿尔", "阿戈", "阿根", "阿吉玛", "阿吉", "阿兰", "阿妮", "阿瑟伯", "阿沙", "阿瓦", "阿西", "埃德", "埃菲", "埃杰", "埃卡", "埃克", "埃拉", "埃勒", "埃马", "埃幕", "埃纳", "埃诗", "艾", "爱毕", "爱普", "安布", "安杰", "安克", "安纳", "安", "安塔", "安维", "安纹", "按卡", "暗泽裔", "奥比", "奥铎", "奥尔", "奥", "奥吉", "奥昆", "奥拉", "奥缪", "奥尼尔", "奥斯", "奥塔", "巴津", "巴利", "巴维格", "巴西尔", "半人", "贝达", "贝勒", "贝萨特", "本努", "别", "布达", "布莱", "残", "查拉", "达马", "达", "德拉", "狄塞", "铎", "厄尔", "厄佛", "厄拉", "厄沙", "恩", "法巴", "法", "飞", "飞龙", "菲彼", "菲霍", "菲惹", "费呐", "费塔", "费希", "芬纳", "凤凰", "夫拉", "弗里", "伏", "嘎亚", "盖伦特", "戈多", "戈诺", "戈印", "格里", "怪", "海", "郝", "郝拉", "荷", "赫", "赫瓦", "胡威", "皇", "回", "霍尔", "霍", "基伯", "基萨", "吉奎", "极", "加达里", "加尔", "加塔", "家", "贾科", "贾斯", "杰", "羯", "金", "咖诺", "卡柯", "卡兰", "凯", "凯诺", "凯莎", "坎塔", "考伊", "柯廖", "克马", "克希", "库拉", "库纳", "奎尔", "拉", "乐", "勒西", "雷电裔", "里芬", "列", "罗伯", "罗勒", "罗伦", "马瑞", "马森", "玛阿", "玛德", "玛", "玛耳", "玛几", "玛拉", "玛莫", "玛扎", "迈约", "毛鲁", "梅", "梅尼", "美人", "弥", "米", "米米", "米呐", "米沃", "魔布", "莫比", "莫", "莫戈", "莫卡什", "莫纳", "莫莎", "缪努", "木本", "那什", "纳茨", "纳迪", "纳伽", "纳基", "纳洛", "纳", "尼克", "尼梅", "牛", "诺", "诺莎", "欧比", "欧登", "欧迪", "欧尔", "欧卡", "欧柯", "欧克", "欧塔", "欧特萨", "欧瓦", "帕鲁", "帕罗", "帕诺", "帕特", "佩戈", "佩卡", "佩扎", "皮塔", "普维", "麒", "乔纳", "乔尼", "乔", "乔斯米", "权", "日", "熔火裔", "瑞", "萨巴", "萨堤", "萨坎", "萨娜", "萨", "萨藤", "萨托", "塞", "塞瓦", "瑟罗", "瑟", "瑟沙", "姗茨", "姗玛", "舍", "圣", "狮蝎", "狮", "丝", "斯芬", "斯卡", "斯塔达", "斯维", "苏", "素帕", "索", "索沙", "塔达", "泰", "泰根", "坦多", "腾达", "提亚", "天", "驮尔", "瓦尔", "维达", "维勒", "维列", "温特", "沃恩", "乌", "乌尔", "乌劳", "乌玛", "乌萨", "西", "希", "心", "亚", "耶", "耶克", "耶斯", "耶雅", "伊姆", "伊诺", "伊齐", "伊沙", "伊索", "伊万", "伊西", "衣", "以哈", "因科", "硬", "永", "尤多", "尤杰", "尤勒", "尤什", "泽蒙", "扎尔", "阿巴", "阿拜", "阿班", "阿比", "阿波", "阿布", "阿茨", "阿达", "阿德", "阿狄莎", "阿迪", "阿", "阿尔达", "阿尔帕", "阿尔皮", "阿瓜拉", "阿哈", "阿基", "阿加", "阿克艾", "阿克", "阿拉古", "阿拉", "阿勒", "阿里", "阿利", "阿列", "阿伦", "阿罗瑟", "阿马", "阿玛", "阿曼", "阿莫", "阿冉", "阿瑟", "阿什", "阿斯", "阿斯科", "阿斯里", "阿塔", "阿泰", "阿特", "阿提", "阿图", "阿希", "阿兹", "埃", "埃巴", "埃贝特", "埃博", "埃布", "埃察沃", "埃达", "埃迪", "埃顿", "埃尔", "埃尔克", "埃法斯", "埃费", "埃夫", "埃戈", "埃格", "埃基", "埃吉", "埃加", "埃加罗", "埃柯", "埃克诺", "埃克葡", "埃库", "埃莱", "埃里", "埃列", "埃罗", "埃玛", "埃美", "埃米", "埃莫", "埃皮", "埃萨", "埃什", "埃什马", "埃斯格", "埃斯", "埃斯塔", "埃斯", "埃索托", "埃塔", "埃特布", "埃特", "埃提", "埃托", "埃瓦", "埃瓦萨", "埃维斯", "埃文", "埃希", "埃谢", "埃耶罗", "埃伊", "埃泽", "埃泽拉", "埃卓", "埃卓勒", "挨达拉", "挨达", "艾奥", "艾德", "艾蒂", "艾恩", "艾尔", "艾格", "艾格塔", "艾哈", "艾拉", "艾瑞", "艾萨", "艾赛", "艾瑟", "艾沙", "艾塔", "艾特", "艾沃", "爱巴格", "爱贝", "爱多陶", "爱科", "爱拉", "爱马", "爱塔", "爱谢", "爱伊", "安巴", "安贝", "安达", "安大", "安德", "安多", "安恩", "安古", "安赫", "安吉", "安吉纳", "安加", "安迦", "安考", "安罗", "安玛", "安姆", "安那", "安娜", "安南", "安妮", "安尼", "安帕", "安乔", "安萨", "安斯", "安索", "安特", "安提", "安提雅", "安托", "安歇", "安耶", "安扎", "安朱", "昂", "昂托", "昂卓", "奥班", "奥贝", "奥波", "奥布", "奥达", "奥达特", "奥德", "奥德斯", "奥迪科", "奥迪", "奥法", "奥弗", "奥格", "奥古", "奥贾", "奥卡", "奥坎", "奥克坦", "奥勒迪", "奥勒", "奥罗", "奥马", "奥尼", "奥瑞", "奥萨", "奥塞", "奥沙", "奥斯玛", "奥斯蒙", "奥斯汀", "奥斯威", "奥苏拉", "奥苏", "奥索", "奥特", "奥图", "奥威", "奥围", "奥维", "奥伊瑟", "巴比尔", "巴蒂", "巴", "巴尔克", "巴尔勒", "巴尔", "巴戈", "巴拉", "巴罗", "巴麦", "巴米", "巴尼", "巴普", "巴日", "巴沙", "巴什", "巴斯", "巴维", "巴宇", "把杂", "拜", "拜盟", "班提", "邦丁", "邦戈维", "包法", "宝吉", "北极", "贝尔", "贝尔希", "被吉尔", "比丹", "必泽", "碧", "波彻", "波迪", "波尔", "波", "波玛", "波斯", "波塔", "波耶", "波伊", "伯茨布", "伯格", "伯", "伯瑟", "博达斯", "博拉", "博", "博因", "布夫", "布拉梅", "布拉", "布里", "布", "布瑞利", "布舍", "部洛达", "查尔", "查克", "查莫", "查姆", "查尼", "查", "查欧", "查什", "查因", "查卓", "柴兰", "彻尔", "彻拉", "彻列", "彻米", "彻谢", "承诺", "赤", "赤达", "出", "茨古", "茨库", "茨梅", "茨图瓦", "茨", "达卡", "达拉", "达尼", "达斯", "达图", "大布", "代莫", "戴瑞", "戴", "丹塔", "丹图", "丹亚", "德", "德勒", "德洛", "德妮", "德瑞", "德苏", "迪洛", "迪姆", "迪帕", "迪索", "迪塔", "迪亚", "底托", "蒂尔", "蒂梅", "杜安", "杜德", "杜吉里", "杜利", "顿瑞", "多登", "多迪", "多姆", "多尼", "多苏", "朵", "俄达", "俄库恩", "俄拉", "俄", "俄萨", "俄沃", "俄扎", "厄", "厄博", "厄迪", "厄基", "厄兰", "厄勒", "厄洛", "厄姆", "厄瑟斯", "厄什", "厄斯皮", "厄斯", "恩伯", "恩达", "恩多", "恩努", "恩诺", "恩斯", "洱", "发布", "法尔", "法格", "法胡", "法克", "法里", "法鲁", "法纳", "法瑞", "法若", "法斯", "法苏", "法塔", "法维", "法谢", "泛光", "菲尔", "菲格", "费比", "费尔", "费", "费舒", "芬尼", "芬", "夫斯", "夫维", "弗茨", "弗拉", "弗雷达", "弗列", "弗琉", "弗鲁", "弗洛", "弗", "弗瑞", "弗瑞特", "福尔塞", "福尔斯", "伽", "伽克", "嘎纳夫", "盖", "戈顿", "戈", "戈拉", "戈萨", "戈西", "戈伊", "格尔", "格夫", "格", "格昆", "格里安", "格鲁提", "格马", "格莫", "格瑞特", "各茨", "各乌", "贡蒂", "古夫", "古卡", "古摩洛", "古萨", "古索", "瓜塔", "果", "哈巴", "哈比", "哈", "哈德", "哈多", "哈尔", "哈洱", "哈格", "哈吉", "哈卡", "哈克", "哈拉", "哈莱", "哈勒", "哈利", "哈洛", "哈姆", "哈瑞", "哈萨", "哈斯米", "哈斯", "哈塔", "哈托", "哈希", "哈扬", "汉格", "赫比", "赫查", "赫达", "赫德基", "赫迪", "赫多", "赫古", "赫加", "赫拉", "赫勒", "赫利", "赫萨", "赫泽", "恒托", "胡尔", "胡", "胡塔", "湖", "霍杜", "霍多", "霍夫", "霍基", "霍利", "霍朔", "霍斯", "霍塔", "霍特", "霍希", "基布", "基", "基恩", "基尔", "基科", "基腊", "基里莫", "基玛", "基尼", "基斯尔", "基索", "基塔", "基扎", "吉安", "吉达", "吉杜", "吉尔", "吉夫", "吉", "吉纳", "吉尼", "吉舒", "吉斯", "加柏", "加德", "加恩", "加尔扎", "加拉", "加", "加冷", "加鲁", "加仑", "加蒙", "加密", "加莫", "加姆", "加纳", "加萨", "加舒", "贾查", "贾吉", "贾卡纳", "贾姆", "贾日", "贾", "贾什", "贾苏", "贾塔", "简尼", "杰丹", "杰尔", "杰斐", "杰拉", "杰尼", "杰士", "金科", "爵尔", "君", "郡尼", "郡索", "咖利", "卡巴", "卡贝", "卡德", "卡多尔", "卡尔", "卡尔加", "卡菲", "卡卡", "卡勒", "卡利", "卡罗", "卡梅", "卡美", "卡米", "卡密", "卡莫", "卡姆", "卡纳", "卡尼迪", "卡诺", "卡帕", "卡普", "卡瑟", "卡斯", "卡特", "卡图", "卡维", "卡兹", "坎克尼", "坎纳", "康诺", "考茨", "考萨", "靠斯", "柯埃佐", "柯达", "科", "科拉", "科马", "科梅", "科诺巴", "科坡", "科伊", "坷拉", "克", "克班", "克博", "克霍", "克加", "克拉", "克莱", "克劳", "克勒", "克雷", "克里", "克林", "克洛", "克纳赫", "克宁", "克挪", "克瑟", "克什", "客拉", "客拉瑞", "寇斯", "库比", "库", "库尔", "库尔尼", "库哈", "库勒", "库罗", "库欧", "库索", "库瓦", "库伊", "酷热", "阔尔", "拉巴", "拉彻", "拉达", "拉迪", "拉底赛", "拉尔库", "拉菲", "拉哥", "拉哈", "拉卡", "拉拉", "拉马", "拉姆", "拉纳", "拉妮", "拉涅", "拉沙", "拉什", "拉斯勒", "拉提", "拉瓦", "拉温", "拉希", "拉谢", "拉泽", "拉扎", "腊", "莱贝", "莱", "莱丁", "莱瑞", "莱耶", "莱伊", "赖", "兰", "兰多", "兰诺", "兰瑟", "朗基", "劳洛", "劳舒", "劳斯特", "劳韦", "老人", "勒比", "勒布", "勒茨", "勒", "勒非", "勒莫", "勒萨", "勒瑟", "勒斯布", "勒特", "雷苏", "黎巴", "里尔", "里尔米", "里瑞布", "里斯巴", "里苏", "里坦", "利伯", "利", "利多", "利勒", "利里", "利姆", "利帕", "利提", "利维", "列库", "列日", "琉基", "鲁", "鲁尔", "鲁美", "鲁米", "路瓦", "伦", "罗", "罗哈", "罗尼", "罗什", "罗乌", "罗西", "罗夏", "罗辛", "罗耶", "洛古", "洛克", "洛雷", "洛南", "略特", "马蒂", "马蒂米", "马顿", "马多", "马尔", "马耳", "马弗", "马哈", "马霍", "马科", "马", "马拉迪", "马鲁", "马洛", "马蒙卡", "马纳", "马萨", "马瑟", "马斯塔", "马特", "马图", "马伊", "玛布", "玛尔", "玛吉", "玛加", "玛么", "玛美", "玛什", "玛斯", "玛提", "玛乌", "玛兹", "迈尔", "麦", "麦伊", "曼", "曼贾", "曼那", "曼特", "毛尔梅", "毛", "梅茨", "梅尔", "梅尔克", "梅尔罗", "梅拉", "梅马", "梅蒙", "梅温", "美索", "美希", "门", "蒙多", "蒙尼", "蒙诺", "米尔", "米弗", "米克", "米罗", "米洛伊", "米迷", "米萨", "米瑟", "米亚", "米耶", "密茨", "密拉", "密斯", "摩", "摩赛", "魔", "莫茨", "莫尔", "莫哈", "莫卡", "莫克琳", "莫利", "莫提", "漠", "默", "缪", "缪勒", "缪塔", "姆", "姆什", "姆沃", "穆尔", "穆勒", "穆利", "拿", "哪", "那朵", "那吉", "那加", "那奎", "呐", "纳恩纳", "纳尔迪", "纳夫李", "纳夫", "纳古", "纳赫米", "纳霍", "纳卡", "纳克", "纳库", "纳奎", "纳尼", "纳瑟沙", "纳斯", "纳瓦", "纳伊", "纳泽", "娜玛", "娜伊", "南德", "讷", "讷赫", "内德", "妮弗", "尼拜", "尼德", "尼杜", "尼", "尼尔", "尼夫", "尼基", "尼勒", "尼曼", "尼沙", "尼什", "尼苏", "尼亚", "捏勒", "涅娜", "农德", "努尔瓦", "努罗", "努扎", "诺恩", "诺尔", "诺夫", "诺格", "诺玛", "诺索德", "诺托", "欧宝", "欧贝", "欧布洛", "欧德", "欧丁", "欧多", "欧法", "欧法斯", "欧菲卡", "欧菲", "欧格", "欧古", "欧加", "欧贾", "欧库", "欧拉", "欧乐", "欧勒", "欧里", "欧玛", "欧拿", "欧纳", "欧泊", "欧瑞", "欧斯", "欧特", "欧提", "欧图", "欧托", "欧沃", "欧西", "欧希", "欧耶", "欧伊", "欧伊特", "欧约", "帕查", "帕茨", "帕多", "帕尔", "帕卡", "帕克", "帕", "帕拉", "帕纳", "帕皮", "帕若", "帕萨", "帕厦", "帕瓦", "帕西", "派尼佳", "培德", "培", "佩布", "佩蒂", "佩", "佩尔克", "佩吉", "佩里", "佩门", "佩姆", "佩尼尔", "佩汀", "佩伊", "皮埃", "皮尔", "皮洛", "皮梅", "皮", "皮特", "皮亚", "坡", "普彻", "普尔", "普利", "普", "普姆", "齐提", "乔巴", "乔迪", "乔法", "乔勒", "乔利", "乔伦", "乔萨", "乔瑟", "乔特", "乔托", "乔万", "乔文", "乔亚", "切", "切文", "阮", "瑞比", "瑞蒂", "瑞多", "瑞果", "瑞拉", "瑞罗", "瑞纳", "瑞尼", "瑞舒", "瑞瓦", "若", "撒布", "撒了", "撒勒", "萨茨", "萨达", "萨德", "萨蒂", "萨尔", "萨法", "萨费", "萨夫", "萨伽", "萨哈", "萨赫", "萨基", "萨贾", "萨科", "萨肯", "萨库", "萨拉", "萨拉姆", "萨拉莎", "萨马", "萨米", "萨然", "萨塞", "萨瑟", "萨斯", "萨索", "萨塔", "萨亚", "萨泽", "塞杜萨", "塞卡", "塞伊", "赛丹", "赛", "赛罗", "赛通", "赛西", "三卡", "瑟尔", "瑟拉", "瑟米", "瑟莫", "瑟什", "瑟西", "瑟伊", "瑟依", "森", "森达", "沙比", "沙布", "沙尔赫", "沙尔", "沙夫", "沙格", "沙卡", "沙鲁", "沙玛", "沙日", "莎", "莎费", "莎迦", "莎瑞", "莎斯", "上德", "舍恩", "舍尔", "舍勒", "舍马", "什胡", "舒尔", "舒拉", "舒利", "舒鲁", "舒", "舒斯", "斯黛", "斯卡尔", "斯拉", "斯勒", "斯雷", "斯塔", "斯特", "斯提", "斯图", "斯托", "苏基", "苏加", "苏洛", "苏萨", "孙尼", "所里", "所特", "所特塔", "索巴", "索贝", "索尔", "索莫", "索娜", "索欧", "索萨", "索什", "他什", "他斯", "塔贝", "塔", "塔尔", "塔赫", "塔拉", "塔里", "塔梅卡", "塔诺", "塔萨", "塔瑟", "塔什蒙", "塔托", "塔辛", "塔伊", "泰尔", "泰特达", "坦卡", "坦纳", "坦", "坦特", "唐格", "忒", "忒什", "特贝", "特恩", "特格", "特凯", "特鲁", "特瑞", "特斯", "腾迪", "提达", "提尔", "提鲁", "提为", "天蛇", "铁里", "汀", "通", "图", "图尔", "图坎", "图勒", "图努", "图欧", "图塔", "图乌", "吞塔", "托德", "托蒂", "托尔", "托库", "托里", "托鲁", "托瑞", "托沙", "托斯", "托", "瓦安", "瓦胡", "瓦拉", "瓦", "瓦瑞", "瓦若", "瓦萨", "瓦什", "瓦斯", "瓦托", "瓦乌", "瓦伊", "万", "万泽", "威尔", "维查", "维尔", "维佛", "维", "维卡", "维考", "维拉", "维拉罗", "维林", "维洛", "维梅", "维尼", "维萨", "维斯克", "维斯", "维特", "维瓦", "维威", "维因", "维兹", "温", "温努", "沃尔", "沃欧", "沃斯", "乌比", "乌查", "乌恩", "乌法", "乌赫", "乌呼", "乌卡", "乌科", "乌克提", "乌勒", "乌米", "乌米夏", "乌莫", "乌尼", "乌欧", "乌欧苏", "乌斯", "乌苏", "乌特", "乌提", "乌汀", "乌托", "乌西", "乌亚", "乌伊特", "乌兹", "乌兹斯", "西非", "西卡", "西拉", "西梅", "西莫", "西姆贝", "西索", "西塔", "西坦尼", "西维", "西扎", "希伯", "希迭", "希恩", "希尔", "希克", "希拉", "希勒", "希礼", "希伦", "希罗", "希米", "希瑟", "希斯", "希瓦", "希扎", "息", "席", "细莎", "下德", "仙", "歇尔", "歇玛", "谢尔", "辛", "辛塔", "新加", "新伊", "休", "雪", "雅素", "亚勒", "亚玛", "亚努", "亚述", "亚特兰", "亚维", "亚耶", "杨", "耶博", "耶德", "耶蒂", "耶尔", "耶哈", "耶尼", "耶舒", "耶索", "耶万", "耶维", "耶泽", "耶扎", "伊巴", "伊波", "伊茨", "伊德", "伊德马", "伊俄", "伊恩", "伊尔", "伊弗", "伊戈", "伊格贝", "伊格赫", "伊格", "伊格诺", "伊", "伊哈", "伊加", "伊杰巴", "伊卡", "伊克", "伊库", "伊拉", "伊兰", "伊勒", "伊列", "伊林", "伊林福", "伊留", "伊琉", "伊卢", "伊鲁", "伊伦", "伊洛娜", "伊马", "伊玛", "伊米", "伊莫戈", "伊那", "伊纳", "伊娜", "伊佩", "伊切", "伊瑞", "伊萨", "伊瑟", "伊森杜", "伊森纳", "伊什", "伊始", "伊斯巴", "伊斯", "伊斯塔", "伊塔", "伊特尔", "伊特", "伊瓦", "伊维", "伊为图", "伊沃莱", "伊乌", "伊辛", "伊亚", "依布", "依尔", "依拉", "依然", "以尔", "以瑞", "因德", "因戈", "因加", "因纳", "因尼", "印恒", "印塔", "印卓", "尤", "尤查", "尤德", "尤洱", "尤费", "尤加", "尤拉", "尤里", "尤姆", "尤尼", "尤普林", "尤普", "尤瑞", "尤斯", "尤苏", "由迪", "犹达", "逾赫", "杂特", "赞", "泽法", "泽胡", "泽利", "泽玛", "泽", "扎", "扎赫费", "扎模", "扎塔", "扎维", "扎赞", "支什", "中心", "朱德", "朱", "卓瑟昆", "卓瑟", "兹姆", "兹", "左拉", "左", "佐尔", "佐仑"];
    let base_last_name = ["特亚", "希尔", "迪亚", "之域", "斯", "文", "野", "廉", "克", "窖", "里德", "美", "利斯", "德", "戈", "边域", "渊", "浊", "西斯", "泽", "谷", "径", "彻", "尔", "阔地", "迪", "佐", "之穹", "里斯", "赫斯", "斯特", "莎", "根弗", "碎", "登斯", "德洱", "蒙贡", "特", "菲斯", "纳", "环", "温铎", "特尔", "湾流", "加", "脉", "瑟亚", "姆尔", "走廊", "征", "之径", "诺特", "帕坚", "塔", "穆尔", "亚", "达扎", "日", "塞尔", "罗拉", "查", "洛特", "伦", "诺", "森", "洱", "林", "茨", "金", "雷乐", "赛克", "底玛", "玛", "娜", "布", "米", "欣", "忒特", "列", "尔斯", "贝", "勒斯", "妮", "宁", "勒恩", "恩斯", "印克", "译", "丹", "什德", "贵", "能", "达", "隆", "瓦纳", "宁斯", "瓦萨", "格特", "勒", "拉德", "斯克", "马", "列亚", "尼", "琉登", "冷", "迪尔", "沃", "衮克", "帕纳", "特勒", "兰", "拉", "咖", "拜", "挥", "座", "哪", "坎", "培森", "伽", "波迪", "托", "地区", "芬", "蛇", "怪", "夫", "逖", "卡", "尔玛", "冠", "剑", "声", "龙", "沙", "姆", "纳德", "乐", "特尼", "利", "纹", "姆西", "纳耶", "恩", "牛", "鞋", "波", "凯", "奇", "杜", "克斯", "雯", "土", "赛什", "蒂", "历赫", "利米", "日雅", "恒", "戈尔", "里", "格夫", "鱼", "陀", "西亚", "赛", "拉奥", "忒", "伐", "西兹", "塔德", "拉茨", "呂", "惹", "赛肯", "然", "夏", "苏斯", "达茨", "头", "高", "莫", "耶斯", "瑞", "索夫", "万", "寇拉", "蒙", "贝拉", "瑞冷", "萨", "米德", "琉特", "巴", "嫩", "麟", "诺尔", "尔特", "杖", "旯", "托布", "罗斯", "伊", "帕", "洱德", "丁", "纳特", "塔尔", "地", "人", "妖", "绒", "克隆", "比", "伊恩", "里尔", "提亚", "拉斯", "堂", "杜尔", "奎特", "法", "基", "皮肯", "曼", "塞", "伯", "形", "顿", "提", "塔但", "鲁卡", "拉利", "珈", "拉肯", "带", "塔罗", "朗", "欢", "佛", "典", "特农", "拉特", "宗", "翰", "鲁列", "德班", "哈", "厄", "左拉", "胡姆", "罗尼", "首星", "巴茨", "察", "哥夫", "达里", "然特", "迪斯", "蒂尼", "卡利", "库茨", "勒克", "卢浮", "马拉", "玛至", "伦纳", "劳特", "提辛", "通", "托恩", "瓦", "谢", "扎德", "扎尼", "兹", "西", "瑞尔", "达戈", "圣纳", "瓦斯", "苏", "鲁迪", "克尔", "库古", "尼尔", "撒热", "宾", "卡拉", "佩斯", "亚斯", "科", "菲", "西尔", "法尔", "扎伊", "戈德", "纳克", "欧斯", "鲁勒", "努尔", "莱玛", "纳达", "多", "空", "贾比", "加瓦", "瑟茨", "哈姆", "多德", "内特", "诺冷", "尔勒", "瑞恩", "德尔", "伊欧", "沙特", "维伊", "达德", "瓦德", "费", "恩的", "吉勒", "则", "奥", "尼恩", "比斯", "恩托", "罗", "哈瓦", "拉甘", "伊勒", "温姆", "瑟斯", "梅尔", "亚尔", "列热", "坦特", "尼亚", "马克", "纳卡", "格农", "奥德", "古尔", "卡特", "伯纳", "库", "提尔", "勒姆", "比赫", "比尔", "拉尔", "依尔", "纳的", "奥克", "贝尔", "诺德", "策", "达特", "费尔", "克什", "蓝德", "祖恩", "拜尔", "辛", "基特", "卡恩", "山", "勒的", "米亚", "莫拉", "玛尔", "瑟尔", "威尔", "拉勒", "肯", "恩汀", "亚德", "瑟", "萨美", "尼丝", "宁科", "彻里", "尔列", "特恩", "特利", "特斯", "特维", "略尔", "瑞亚", "那德", "蒙勒", "塔列", "赫", "多尼", "格斯", "克勒", "索斯", "拉热", "印", "莱索", "耶", "纳尔", "涅", "里克", "尔尼", "代尔", "鲁尔", "古伦", "根", "奈斯", "恩德", "尼托", "尼维", "菲特", "杰特", "胡恩", "海仑", "姆尼", "温伦", "伊马", "阿", "梅登", "莫尼", "塔卡", "格勒", "特诺", "马特", "索", "列托", "希拉", "拉伦", "尔金", "乌", "莫特", "维夫", "归斯", "士尔", "那茨", "马布", "耶特", "拉亚", "克鲁", "姗", "雅姆", "基林", "亚希", "铎德", "什", "达斯", "星", "里姆", "柯", "莎尔", "林佩", "莎拉", "伯格", "托温", "莱尔", "斯汀", "托特", "兰特", "伯特", "那伊", "列斯", "斯顿", "佩列", "热", "马尔", "库尔", "达兰", "梅米", "塔伦", "罗特", "贾", "梅", "浓", "金斯", "里普", "之地", "壁", "口", "维", "顿斯", "罕", "康", "娜的", "林特", "温", "米图", "但", "德里", "尼斯", "瑞达", "潘特", "尔拉", "瓦勒", "维特", "扎", "儿", "比伦", "博", "坎姆", "戴斯", "基尼", "迈", "梅德", "莎茨", "诺达", "多尔", "纳亚", "坎马", "格尔", "特班", "拉夫", "图尔", "左", "伦特", "托尔", "佩拉", "尼冷", "之源", "蒙克", "达尔", "利拉", "库仑", "希", "查格", "烈", "洛勒", "加德", "勒古", "瑟文", "吉", "利杜", "多姆", "可辛", "萨德", "溪", "杰萨", "孔", "基什", "汉", "塔米", "卡尼", "提克", "诺蒂", "歌德", "恩杜", "维巴", "特伦", "南", "巴克", "加戈", "泽克", "基能", "列尔", "那能", "科恩", "萨基", "提茨", "尔利", "农", "什马", "坦", "贝尼", "蒂姆", "贾拉", "那利", "托姆", "玫", "昂特", "撒", "理林", "列法", "芬登", "格德", "特德", "明", "加拉", "加芬", "托肯", "天", "那", "吉森", "塔阔", "迪克", "毛乌", "尔沙", "瑟拉", "玛贝", "佩尔", "瑟姆", "泽恩", "祖", "伯德", "瑞克", "格", "法", "克肯", "他", "拉蒂", "加尔", "克楞", "摩德", "希恩", "瓦基", "尔茨", "努", "尔维", "赞", "鲁", "达恩", "赫什", "勒布", "喀", "境", "勒瑟", "加什", "萨斯", "兰尼", "里纳", "伊蒙", "克拉", "汀", "庸汀", "荷", "欧", "科尔", "梅特", "简恩", "古姆", "因", "尔德", "班", "托勒", "尔克", "纳拉", "卡肯", "维科", "西勒", "勒瑞", "勒尼", "里农", "格力", "哈布", "腊", "拉姆", "玛鲁", "埃能", "斯基", "拉赫", "仑", "素尔", "蒙莫", "诺加", "蒙尼", "亚哈", "戈伊", "那格", "贝达", "达隆", "帕斯", "沃斯", "登", "仁", "葛", "希亚", "罗瑟", "塔克", "乔尔", "勒特", "威克", "拉比", "利布", "拿", "拉卡", "乌敦", "洛克", "利姆", "玛的", "勒维", "塔尼", "马丹", "乌拉", "珥", "赤", "密", "考", "扎尔", "菲尔", "尼姆", "里若", "克恩", "帕拉", "提雅", "克特", "克克", "克蒙", "塔蒙", "斯塔", "纳斯", "依", "赫拉", "铎", "劳提", "多夫", "库夫", "耐", "尤库", "拉塔", "特姆", "洛", "约亚", "厦", "尔加", "娅", "列登", "蒂特", "封", "勒尔", "克基", "莱伦", "玛嫩", "亚然", "维克", "莱", "范", "拉法", "勒里", "丽", "吉亚", "古夫", "恩界", "博拉", "帕德", "沙德", "什那", "鲁特", "巴尔", "拜伦", "麦拉", "马蒂", "凯肯", "义尔", "提科", "贝因", "鲁法", "迪特", "迪恩", "杜因", "弗德", "托德", "塔林", "伽肯", "舒", "厄贾", "涅内", "姆福", "依惹", "漫", "南姆", "斯肯", "泽尔", "切", "维图", "科德", "迈伦", "诺米", "萨塞", "色拉", "图", "萨蒙", "约", "茨亚", "尼肯", "沙米", "纳塔", "纳伊", "呐", "斯托", "希文", "格曼", "库拉", "米特", "西丁", "北卡", "涅尔", "乔拉", "斯姆", "雅蒙", "韦尔", "密陀", "斯昆", "米娅", "惹勒", "耶德", "库瓦", "尼米", "图班", "安", "舍拉", "凯伦", "尔达", "亚玛", "奴尼", "逖库", "拉马", "加斯", "尔臣", "瑞斯", "萨瑟", "轮", "玛伦", "雅", "伦德", "拉克", "维尔", "耳", "尔堡", "撒拿", "茨尔", "罗因", "提勒", "仁托", "伦卓", "伊拉", "色基", "提特", "泽兰", "卡莱", "燃", "比什", "卡德", "纳茨", "尤", "尔瑟", "坎能", "苏德", "度", "耶维", "路", "瑟勒", "姆塔", "瑞纳", "弗伦", "巴德", "诺斯", "比雅", "卡伦", "加塔", "瓦林", "卡尔", "基森", "达伦", "乌尔", "乌得", "埃勒", "瓦特", "希达", "论", "纶", "托维", "拖", "基奥", "拉能", "米达", "伊森", "索科", "邦", "里奇", "里拉", "图恩", "恩索", "罗德", "法德", "西欧", "彻尔", "伐姆", "库索", "库乌", "拉迪", "勒库", "瑟新", "希茨", "皮尔", "伊德", "莫德", "耶尔", "甸", "巴浦", "杰斯", "泰德", "拉蒙", "瑞勒", "基尔", "利亚", "亚米", "里庸", "多斯", "贵斯", "君勒", "伦杜", "默里", "塞特", "亚林", "尤尔", "横农", "缪尔", "伊顿", "斯加", "赫德", "多吉", "理克", "沃底", "娜拉", "沙撒", "兰伦", "卡蒙", "鲁瑞", "茨瓦", "姆恩", "纳莫", "洛斯", "索蒙", "巴塔", "卡诺", "科米", "克索", "密斯", "尼特", "特内", "祖尔", "米肯", "尼迪", "卡姆", "苏达", "登左", "罗加", "玛琳", "勒贾", "恩塔", "坎拿", "基斯", "古勒", "拉那", "默克", "哈德", "特里", "巴拉", "亚诺", "夏基", "得", "尤斯", "马卡", "点", "斯勒", "罗瑞", "释", "贝的", "横", "耶恩"];

    let force_name = {
        1: '欧伏部族',
        2: '博尔联邦',
        3: '甘纳帝国',
        4: '索萨协会',
        5: '卡迪集团',
        6: '乔索贵族',
        7: '亚纳海盗',
        8: '底斯部落',
        9: '瓦格同盟',
    };

    let depart_name = [
        '快递部',
        '避世会',
        '矿业公司',
        '矿业股份',
        '后勤部',
        '速装工业',
        '矿钻集团',
        '钢铁集团',
        '载诺集团',
        '娱乐公司',
        '研究所',
        '物流公司',
        '销售部',
        '建筑集团',
        '住宅公司',
        '基金集团',
        '星域银行',
        '现代金融',
        '合作组织',
        '俱乐部',
        '商业法庭',
        '档案所',
        '空军',
        '内部安全',
        '服务公司',
        '安全部队',
        '保安公司',
        '秩序局',
        '巡管局',
        '和平工业',
        '警备队',
        '科学学会',
        '贸易学会',
        '议会',
        '舰队',
        '司法部',
        '管理局',
        '安全局',
        '联合体',
        '建设部',
        '总装部',
        '精炼集团',
        '运输',
        '通讯社',
        '联合收割',
        '食品',
        '学院',
        '议长专团',
        '内政部',
        '军务部',
        '评估局',
        '内务府',
        '商管局',
        '民事法庭',
        '理事会',
        '货运局',
        '短途物流',
        '矿业',
        '制药',
        '传媒',
        '实验室',
        '银行',
        '保险',
        '投资银行',
        '大学',
        '总统团队',
        '参议院',
        '最高法院',
        '政府部',
        '情报处',
        '海关局',
        '关系部',
        '领事馆',
        '矿业集团',
        '社团',
        '委员会',
        '救济会',
        '商业局',
        '警察局',
        '联合财团',
        '内议会',
        '创新集团',
        '工作室',
        '矿业协会',
        '调查处',
        '混合企业',
        '军事学院',
        '空军学院',
        '教育中心',
        '工学院',
        '战争学院',
        '护卫军',
        '联合会',
    ];

    let station_name = [
        '储存工厂',
        // '复合体',
        '矿物储备',
        '矿冶站',
        '精炼厂',
        '开采终端',
        '库房',
        '种植园',
        '包装厂',
        '工厂',
        '研究中心',
        '科技产品',
        '储藏设施',
        '出版社',
        '零售中心',
        '生产工厂',
        '铸造厂',
        '保险库',
        '仓库',
        '办公署',
        '财政部',
        '学院',
        '商业法庭',
        '会计所',
        '律法学院',
        '事务所',
        '信息中心',
        '档案馆',
        '组装车间',
        '支援部',
        '测试设施',
        '知识学院',
        '学院',
        '法庭',
        '贸易站',
        '回收设施',
        '贮存厂',
        '造船厂',
        '贮存舱',
    ];
    //配置文件规划
    //宇宙地图只记录恒星系等
    let file_json = path.resolve(__dirname, '../resource/map/');
    let file_js_server = path.resolve(__dirname, '../module/data/');
    let file_js_client = path.resolve(__dirname, '../../client_mmo/src/data/');
    let file_thumb_json = path.resolve(__dirname, '../resource/map/MapUniverseThumb.json');
    let file_tiles_path = path.resolve(__dirname, '../resource/map/tiles/');

    let file_sql = path.resolve(__dirname, '../resource/map/');

    mkdirSync(path.resolve(__dirname, '../resource/map/tiles/'));
    mkdirSync(path.resolve(__dirname, '../resource/img/'));

    function mkdirSync(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (mkdirSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }

    let galaxy_infos = {};
    let planet_infos = {};
    let station_infos = {};

    //设定地图最大直径
    let map_max_size = common.setting.base_map_max_size;
    //设定每个恒星系的半径
    let map_galaxy_radius = common.setting.map_galaxy_radius;
    //恒星系随机倍数
    let map_galaxy_radius_ratio = common.setting.map_galaxy_radius_ratio;
    //自转 最小时间
    // let map_revolution_min_time = 86400;
    //显示参数最小值
    let map_revolution_min_time = 0;
    //自转 最大时间
    // let map_revolution_max_time = 100 * 86400;
    //显示参数最大值
    let map_revolution_max_time = 99;
    //设定恒星数量
    let map_max_galaxy_num = 10000;
    //设定恒星半径 为了显示效果 恒心大小要计算100的慢速移动和10倍的显示效果增强
    let map_sun_radius = common.setting.map_sun_radius;
    //恒星随机比例
    let map_sun_radius_ratio = common.setting.map_sun_radius_ratio;
    //块图数量(单轴)
    let base_map_block_number = common.setting.base_map_block_number;

    //空间站半径
    let map_station_radius_min = 400;
    let map_station_radius_max = 500;

    //恒星显示半径比例1:1000
    let galaxy_show_radius_ratio = 1000 * 100;
    //空间站显示半径比例1:100   1000=100-200像素(半径)
    // let station_show_radius_ratio = 100 * 100;

    let ring_point_list = {};
    makeRing();

    let rebuild_status = false;
    let skip_json_status = false;
    let skip_sql_status = false;

    if (arguments[0]) {
        for (let pos in arguments) {
            if (arguments[pos] === 'rebuild') {
                rebuild_status = true;
            }
            if (arguments[pos] === 'skip_json') {
                skip_json_status = true;
            }
            if (arguments[pos] === 'skip_sql') {
                skip_sql_status = true;
            }
        }
    }
    if (rebuild_status) {
        rebuildMap();

        let galaxy_text = JSON.stringify(galaxy_infos);
        galaxy_text = galaxy_text.replace(/},/g, "},\n");
        fs.writeFileSync(file_json + '/BaseMapGalaxy.json', galaxy_text);

        let planet_text = JSON.stringify(planet_infos);
        planet_text = planet_text.replace(/},/g, "},\n");
        fs.writeFileSync(file_json + '/BaseMapPlanet.json', planet_text);

        let station_text = JSON.stringify(station_infos);
        station_text = station_text.replace(/},/g, "},\n");
        fs.writeFileSync(file_json + '/BaseMapStation.json', station_text);

        let galaxy_array_text = JSON.stringify(objectValues(galaxy_infos));
        let galaxy_server_text = 'const BaseMapGalaxyData = ' + galaxy_array_text + ';exports.BaseMapGalaxyData = BaseMapGalaxyData;';
        let galaxy_client_text = 'export const BaseMapGalaxyData = ' + galaxy_array_text + ';';
        fs.writeFileSync(file_json + '/BaseMapGalaxyData.js', galaxy_array_text);
        // fs.writeFileSync(file_js_server + '/BaseMapGalaxyData.js', galaxy_server_text);
        // fs.writeFileSync(file_js_client + '/BaseMapGalaxyData.js', galaxy_client_text);

        // let planet_array_text = JSON.stringify(objectValues(planet_infos));
        // let planet_server_text = 'const BaseMapPlanetData = ' + planet_array_text + ';exports.BaseMapPlanetData = BaseMapPlanetData;';
        // let planet_client_text = 'export const BaseMapPlanetData = ' + planet_array_text + ';';
        // // fs.writeFileSync(file_json, planet_text);
        // fs.writeFileSync(file_js_server + '/BaseMapPlanetData.js', planet_server_text);
        // fs.writeFileSync(file_js_client + '/BaseMapPlanetData.js', planet_client_text);

        // let station_array_text = JSON.stringify(objectValues(station_infos));
        // let station_server_text = 'const BaseMapStationData = ' + station_array_text + ';exports.BaseMapStationData = BaseMapStationData;';
        // let station_client_text = 'export const BaseMapStationData = ' + station_array_text + ';';
        // // fs.writeFileSync(file_json, station_text);
        // fs.writeFileSync(file_js_server + '/BaseMapStationData.js', station_server_text);
        // fs.writeFileSync(file_js_client + '/BaseMapStationData.js', station_client_text);
    } else {
        galaxy_infos = JSON.parse(fs.readFileSync(file_json + '/BaseMapGalaxy.json').toString());
        planet_infos = JSON.parse(fs.readFileSync(file_json + '/BaseMapPlanet.json').toString());
        station_infos = JSON.parse(fs.readFileSync(file_json + '/BaseMapStation.json').toString());
    }

    if (skip_json_status === false) {
        buildJson();
    }

    if (skip_sql_status === false) {
        buildSql();
    }

    //过滤掉key
    function objectValues(obj) {
        if (typeof obj === 'object') {
            let arr = [];
            for (let pos in obj) {
                // obj[pos] = Object.values(obj);
                arr.push(objectValues(obj[pos]));
            }
            return arr;
        } else {
            return obj;
        }
    }


    testDraw();


    function makeRing() {
        //开始考虑环装方案
        //取100个点
        //正好用这个数当安全等级
        let ring_max = 20;
        for (let force = 1; force <= 3; force++) {
            for (let ring = 0; ring <= ring_max; ring++) {
                let angle = ring * (100 / ring_max) + (force - 1) * 120;
                let range = (ring + 1) * (map_max_size / 2 / (ring_max + 1));
                ring_point_list[force * 100 + ring] = this.anglePoint(0, 0, angle, range);
            }
        }
    }

    function getName() {
        let first_length = base_first_name.length - 1;
        let last_length = base_last_name.length - 1;
        // let name_length = 1;
        // let name_ratio = getSeedRand(1, 1000);
        // if (name_ratio < 100) {
        //     name_length = 5;
        // } else if (name_ratio < 300) {
        //     name_length = 4;
        // } else if (name_ratio < 600) {
        //     name_length = 3;
        // } else if (name_ratio < 995) {
        //     name_length = 2;
        // }
        // let name = '';
        // for (let name_pos = 0; name_pos < name_length; name_pos++) {
        //     let pos = getSeedRand(0, total_length);
        //     name += base_name.substr(pos, 1);
        // }

        return base_first_name[getSeedRand(0, first_length)] +
            base_last_name[getSeedRand(0, last_length)];
    }

    function rebuildMap() {
        this.draw_ratio = common.setting.draw_ratio;
        let nearest_ring_id = 0;
        let count_list = {};

        let station_id = 1000;

        //最低安等因为触发几率太低 增加保底空间站数量
        let less_safe_station = {
            1: 3,
            2: 6,
            3: 9,
        };

        //检测星系间距离的值
        let check_galaxy_distance = map_galaxy_radius * map_galaxy_radius_ratio * 2;

        for (let galaxy_id = 1; galaxy_id < map_max_galaxy_num; galaxy_id++) {
            let x = 0;
            let y = 0;
            //检测恒星系是否重叠
            let check = false;
            while (check === false) {
                check = true;
                x = getSeedRand(-Math.round(map_max_size / 2), Math.round(map_max_size / 2));
                y = getSeedRand(-Math.round(map_max_size / 2), Math.round(map_max_size / 2));
                //处理恒星在宇宙的位置
                //初步计划距离中心0.5倍半径100%可以放置
                //超过0.5判断阈值 最高到1
                let distance = common.func.getDistance(x, y, 0, 0);
                if (distance > map_max_size / 2 * 0.95) {
                    // console.log('[' + galaxy_id + '] check distance false');
                    check = false;
                } else if (distance > map_max_size / 8) {
                    //从中心开始7/8的所有恒星进入阈值
                    if (seedRandom() < ((distance - map_max_size / 8) / (map_max_size / 2 - map_max_size / 8))) {
                        // console.log('[' + galaxy_id + '] check distance ratio false');
                        check = false;
                    }
                }

                //处理环装阈值
                if (check) {
                    //先获取最近的距离 再根据这个距离判断阈值
                    let nearest_distance = map_max_size;
                    for (let ring_id in ring_point_list) {
                        let ring_point_info = ring_point_list[ring_id];
                        let distance = common.func.getDistance(x, y, ring_point_info.x, ring_point_info.y);
                        if (distance < nearest_distance) {
                            nearest_distance = distance;
                            nearest_ring_id = ring_id;
                        }
                    }

                    //按照这一套公式下来最远距离大概是 1/5宇宙大小
                    //最近的100%
                    if (nearest_distance < map_max_size / 10) {

                    } else if (seedRandom() < (nearest_distance - map_max_size / 10) / (map_max_size / 5 - map_max_size / 10)) {
                        // console.log('[' + galaxy_id + '] check ring ratio false');
                        check = false;
                    }
                }


                if (check) {
                    //恒星不能离得太近
                    // ff(Object.keys(galaxy_infos).length);
                    for (let sub_galaxy_id in galaxy_infos) {
                        let sub_galaxy_info = galaxy_infos[sub_galaxy_id];
                        if (Math.abs(x - sub_galaxy_info.x * this.draw_ratio) < check_galaxy_distance
                            && Math.abs(y - sub_galaxy_info.y * this.draw_ratio) < check_galaxy_distance
                        ) {
                            // ff(x, sub_galaxy_info.x, y, sub_galaxy_info.y, map_galaxy_radius * map_galaxy_radius_ratio * 10);
                            console.log('[' + galaxy_id + '] check overlap false');
                            check = false;
                            break;
                        }
                    }
                }
            }
            console.log('[' + galaxy_id + '] check ok');

            //恒星实际半径
            let galaxy_radius = getSeedRand(map_sun_radius, map_sun_radius * map_sun_radius_ratio);

            let galaxy_info = {
                galaxy_id: galaxy_id,
                name: getName(),
                //X坐标
                x: Math.round(x / this.draw_ratio),
                //Y坐标
                y: Math.round(y / this.draw_ratio),
                //恒星半径
                radius: Math.floor(galaxy_radius / galaxy_show_radius_ratio),
                //自转周期 1-300天
                cycle: getSeedRand(map_revolution_min_time, map_revolution_max_time),
                //阵营ID
                force: Math.floor(nearest_ring_id / 100),
                //中心系数
                safe: nearest_ring_id % 100,
                //质量 前端显示用
                //行星信息
                // planets: {},
                //空间站信息
                // stations: {},
            };
            galaxy_infos[galaxy_id] = galaxy_info;

            let galaxy_size = map_galaxy_radius * getSeedRand(1, map_galaxy_radius_ratio);

            // if (false) {
            //     let planet_number = getSeedRand(2, 10);
            //     //随机1-5倍大小
            //     //第一个恒星系刷满行星 用于测试
            //     if (galaxy_id === 1) {
            //         planet_number = 10;
            //         galaxy_size = map_galaxy_radius * map_galaxy_radius_ratio;
            //     }
            //     for (let planet_pos = 0; planet_pos < planet_number; planet_pos++) {
            //         //轨道半径
            //         let orbit = Math.floor(galaxy_radius + (planet_pos + 1) / (planet_number + 1) * galaxy_size);
            //         //实际角度 直接计算运行100天 的角度即可
            //         let angle = getSeedRand(1, 359);
            //         //计算恒星系内的相对坐标
            //         let planet_point = this.anglePoint(0, 0, angle, orbit);
            //         //宇宙坐标x
            //         let x = Math.round(planet_point.x / this.draw_ratio);
            //         //宇宙坐标y
            //         let y = Math.round(planet_point.y / this.draw_ratio);
            //         let planet_id = galaxy_id * 100 + planet_pos;
            //         // galaxy_info.planets[planet_id] = {
            //         //     planet_id: planet_id,
            //         //     x: Math.round(x / this.draw_ratio),
            //         //     y: Math.round(y / this.draw_ratio),
            //         //     //半径 恒星的半径/4 - 恒星的半径/2
            //         //     radius: getSeedRand(galaxy_radius / 4 / this.draw_ratio, galaxy_radius / 2 / this.draw_ratio),
            //         //     //自转周期 1-300天
            //         //     cycle: getSeedRand(map_revolution_min_time, map_revolution_max_time),
            //         //     //质量 前端显示用
            //         // };
            //         planet_infos[planet_id] = {
            //             planet_id: planet_id,
            //             galaxy_id: galaxy_id,
            //             x: Math.round(x / this.draw_ratio),
            //             y: Math.round(y / this.draw_ratio),
            //             //半径 恒星的半径/4 - 恒星的半径/2
            //             radius: getSeedRand(galaxy_radius / 4 / galaxy_show_radius_ratio, galaxy_radius / 2 / galaxy_show_radius_ratio),
            //             //自转周期 1-300天
            //             cycle: getSeedRand(map_revolution_min_time, map_revolution_max_time),
            //             //质量 前端显示用
            //         };
            //     }
            // }

            //构建建筑
            //整体原则 越中心 越密 还要考虑主权的问题
            //要考虑主权的问题 就要先考虑环形地图行星构建的问题
            //over 主权 安等 全有了
            //1.0-0.5 安全 0.4-0.1低安 0.0- -1.0 00地区
            //高安 星系内全部治安 有巡逻警察
            //低安 只有空间站有炮执法
            //00 按声望办事
            //声望
            // -50主动攻击
            // -20无法进入空间站 无法使用空间站服务


            //判断当前主权是谁 本地的空间站要全部是当前主权的 未来再做攻击
            //高安 只有123
            //低安少量的123 其他456
            //00  少量456 其他789
            //根据force搞完空间站数量 再刷新force

            //低安有10%概率 刷新为123
            //00有20%概率 刷新为456

            if (galaxy_info.safe > 15) {
            } else if (galaxy_info.safe > 10) {
                //低安
                // if (getSeedRand(0, 9) > 0) {
                galaxy_info.force += 3;
                // }
            } else {
                //00
                // if (getSeedRand(0, 4) > 0) {
                galaxy_info.force += 6;
                // } else {
                //     galaxy_info.force += 3;
                // }
            }

            //获取某个安等一定范围的主权归属海盗 其他主权为0
            if (galaxy_info.force > 6) {
                let land_safe = 4;
                let land_range = 500000000;
                let force_land_ring = ((galaxy_info.force - 1) % 3 + 1) * 100 + land_safe;
                let land_ring_point = ring_point_list[force_land_ring];
                if (land_range > common.func.getDistance(galaxy_info.x, galaxy_info.y, land_ring_point.x / this.draw_ratio, land_ring_point.y / this.draw_ratio)
                    && Math.abs(galaxy_info.safe - land_safe) < 2
                ) {
                    galaxy_info.land = galaxy_info.force
                } else {
                    galaxy_info.land = 0;
                }
            } else {
                galaxy_info.land = galaxy_info.force;
            }

            let station_number = 0;
            if (galaxy_id === 1) {
                station_number = 4;
            } else if (galaxy_info.safe >= 15) {
                //15-20 1-3  2-4
                station_number = Math.floor(getSeedRand((galaxy_info.safe - 10) * 2, (galaxy_info.safe - 10) * 2 + 20) / 10);
            } else if (galaxy_info.safe > 10) {
                //10-14 低安 0.5 - 0.1
                if (seedRandom() < (galaxy_info.safe - 10) / 10) {
                    station_number = 1;
                }
            } else {
                // 0-10  00地区  0%-10%
                //部分地区指定空间站数量
                // if (less_safe_station[galaxy_info.safe] !== undefined) {
                //     if (less_safe_station[galaxy_info.safe] > 0) {
                //         if (seedRandom() < (galaxy_info.safe) / 50) {
                //             station_number = 1;
                //             less_safe_station[galaxy_info.safe]--;
                //         }
                //     }
                // } else if (seedRandom() < (galaxy_info.safe) / 100) {
                //     station_number = 1;
                // }
                //00地区 有主权才有空间站
                if (galaxy_info.land > 0 && seedRandom() < (galaxy_info.safe) / 10) {
                    station_number = 1;
                }
            }

            //如果空间站只有1个 那尽量靠近恒星
            for (let station_pos = 0; station_pos < station_number; station_pos++) {
                //轨道半径
                let orbit = Math.floor(galaxy_radius + (station_pos + 1) / (station_number + 5) * galaxy_size);
                //实际角度 随机360
                let angle = getSeedRand(0, 359);
                //计算恒星系内的相对坐标
                let station_point = this.anglePoint(0, 0, angle, orbit);
                //宇宙坐标x
                let x = station_point.x;
                //宇宙坐标y
                let y = station_point.y;

                station_infos[station_id] = {
                    station_id: station_id,
                    galaxy_id: galaxy_id,
                    //空间站名称
                    name: force_name[galaxy_info.force] + getRandDepartName() + ' ' + getRandStationName(),
                    //主权归属
                    force: galaxy_info.force,
                    //x坐标
                    x: Math.round(x / this.draw_ratio),
                    //y坐标
                    y: Math.round(y / this.draw_ratio),
                    //半径
                    radius: getSeedRand(map_station_radius_min, map_station_radius_max),
                    //质量 前端显示用
                    //自转周期 1-300天
                    cycle: getSeedRand(map_revolution_min_time, map_revolution_max_time),
                };

                station_id++;
            }
            // console.log(galaxy_info.safe, station_number);
            count_list[galaxy_info.safe] || (count_list[galaxy_info.safe] = {})
            count_list[galaxy_info.safe][galaxy_info.force] || (count_list[galaxy_info.safe][galaxy_info.force] = {
                'station': 0,
                'total': 0,
            })
            count_list[galaxy_info.safe][galaxy_info.force]['station'] += station_number;
            count_list[galaxy_info.safe][galaxy_info.force]['total']++;
        }
        ff(count_list);
        // return galaxy_infos;
    }

    function buildJson() {
        //构建宇宙缩略图
        let universe_thumb = {};
        for (let galaxy_id in galaxy_infos) {
            let galaxy_info = galaxy_infos[galaxy_id];
            universe_thumb[galaxy_id] = {
                x: galaxy_info.x,
                y: galaxy_info.y,
            };

            // for (let galaxy_key in galaxy_info) {
            //         let planet_info = galaxy_info[galaxy_key];
            //         if (typeof planet_info !== 'object') {
            //             universe_thumb[galaxy_id][galaxy_key] = galaxy_info[galaxy_key];
            //         }
            // }
        }
        //简单格式化
        let universe_thumb_text = JSON.stringify(universe_thumb).replace(/},/g, "},\n");
        fs.writeFileSync(file_thumb_json, universe_thumb_text);

        //为什么不直接按照galaxy_id存储呢??
        //哦 如果按照id遍历 那需要先遍历每个星系的坐标 判断坐标是否在范围内
        //如果按照区块的话 直接获取就进的几个区块再进行遍历即可
        if (false) {
            let tiles_info = {};
            //初始化
            for (let x = 0; x < base_map_block_number; x++) {
                for (let y = 0; y < base_map_block_number; y++) {
                    let tiles_key = common.func.getMapKeyPoint(x, y);
                    tiles_info[tiles_key] = {};
                }
            }
            for (let galaxy_id in galaxy_infos) {
                let galaxy_info = galaxy_infos[galaxy_id];
                let tiles_key = common.func.getMapKey(galaxy_info.x * this.draw_ratio, galaxy_info.y * this.draw_ratio);
                tiles_info[tiles_key][galaxy_id] = galaxy_info;
            }

            for (let x = 0; x < base_map_block_number; x++) {
                for (let y = 0; y < base_map_block_number; y++) {
                    let tiles_key = common.func.getMapKeyPoint(x, y);
                    // if (Object.keys(tiles_info[tiles_key]).length) {
                    fs.writeFileSync(file_tiles_path + '/' + tiles_key + '.json', JSON.stringify(tiles_info[tiles_key]));
                    // }
                }
            }
        }
    }

    function buildSql() {
        let galaxy_text = '';
        let planet_text = '';
        let station_text = '';
        for (let galaxy_id in galaxy_infos) {
            let galaxy_info = galaxy_infos[galaxy_id];
            galaxy_text += 'INSERT INTO `server_galaxy_info` VALUES (' +
                galaxy_info.galaxy_id + ',' +
                '"' + galaxy_info.name + '",' +
                galaxy_info.x + ',' +
                galaxy_info.y + ',' +
                galaxy_info.radius + ',' +
                galaxy_info.cycle + ',' +
                galaxy_info.force + ',' +
                galaxy_info.safe + ');' + "\n";

        }

        for (let planet_id in planet_infos) {
            let planet_info = planet_infos[planet_id];
            planet_text += 'INSERT INTO `server_planet_info` VALUES (' +
                planet_info.planet_id + ',' +
                planet_info.galaxy_id + ',' +
                planet_info.x + ',' +
                planet_info.y + ',' +
                planet_info.radius + ',' +
                planet_info.cycle + ');' + "\n";
        }

        for (let station_id in station_infos) {
            let station_info = station_infos[station_id];
            station_text += 'INSERT INTO `pk_zone_server_station_info` VALUES (' +
                station_info.station_id + ',' +
                station_info.galaxy_id + ',' +
                station_info.force + ',' +
                '"' + station_info.name + '",' +
                station_info.x + ',' +
                station_info.y + ',' +
                station_info.radius + ',' +
                station_info.cycle + ');' + "\n";
        }

        galaxy_text = 'TRUNCATE TABLE `server_galaxy_info`;' + "\n" + galaxy_text;
        fs.writeFileSync(file_sql + '/BaseMapGalaxy.sql', galaxy_text);

        planet_text = 'TRUNCATE TABLE `server_planet_info`;' + "\n" + planet_text;
        fs.writeFileSync(file_sql + '/BaseMapPlanet.sql', planet_text);

        station_text = 'TRUNCATE TABLE `pk_zone_server_station_info`;' + "\n" + station_text;
        fs.writeFileSync(file_sql + '/BaseMapStation.sql', station_text);

        //     + 'TRUNCATE TABLE `server_planet_info`;' + "\n"
        //     + 'TRUNCATE TABLE `server_station_info`;' + "\n";
        // let universe_text = top_text + galaxy_text + planet_text + station_text;
        // fs.writeFileSync(file_sql, universe_text);
    }

    //虚拟绘制星图
    function testDraw() {
        //宇宙缩略图
        let file_universe_png = path.resolve(__dirname, '../resource/img/BaseMapUniverse.png');
        //图块缩略图
        let file_tiles_png = path.resolve(__dirname, '../resource/img/BaseMapTiles.png');
        //恒星系缩略图
        let file_galaxy_png = path.resolve(__dirname, '../resource/img/BaseMapGalaxy.png');
        //环形坐标点
        let file_ring_point_png = path.resolve(__dirname, '../resource/img/RingPoint.png');
        let canvas_size = 1000;

        drawUniverse();
        //废弃了
        drawTiles();
        drawGalaxy();
        drawRingPoint();

        function drawUniverse() {
            this.draw_ratio = common.setting.draw_ratio;
            //缩放比例
            let universe_ratio = canvas_size / map_max_size * this.draw_ratio;
            // console.log(universe_ratio);
            let canvas_universe = new canvas.Canvas(canvas_size, canvas_size);
            let context_universe = canvas_universe.getContext('2d');
            //绘制背景
            drawRectFill(context_universe, 0, 0, canvas_size, canvas_size, '#000000');
            //遍历宇宙
            let count = 0;
            let galaxy_list = {};
            for (let galaxy_id in galaxy_infos) {
                let galaxy_info = galaxy_infos[galaxy_id];
                //测试用判断条件 局部渲染
                if (
                    true
                    //     //     galaxy_info.force === 1                    &&
                    // galaxy_info.safe === 0
                ) {
                    let x = galaxy_info.x * universe_ratio + canvas_size / 2;
                    let y = galaxy_info.y * universe_ratio + canvas_size / 2;
                    //恒星半径 这个值必定很小很小 这是实际显示半径
                    let radius = Math.max(galaxy_info.radius * universe_ratio, 1);
                    // 0 红色 255 0
                    // 5 浅红 255 128
                    // 10 黄色 255 255
                    // 15 浅绿 128 255
                    // 20 绿色 0 255
                    let safe_model = true;
                    if (safe_model) {
                        let red = fillZero(Math.floor(Math.min(20 - galaxy_info.safe, 10) * 25.5).toString(16));
                        let green = fillZero(Math.floor(Math.min(galaxy_info.safe, 10) * 25.5).toString(16));
                        let blue = fillZero(Math.floor((galaxy_info.land) * 25.5).toString(16));

                        // if (galaxy_info.land > 6) {
                        //     drawArcFill(context_universe, x, y, radius, '#0000FF');
                        // } else {
                        drawArcFill(context_universe, x, y, radius, '#' + red + green + blue);
                        // }
                    } else {
                        if (galaxy_info.safe > 10) {
                            drawArcFill(context_universe, x, y, radius, '#00FF00');
                        } else {
                            drawArcFill(context_universe, x, y, radius, '#FF0000');
                        }
                    }

                    galaxy_list[galaxy_info.safe] || (galaxy_list[galaxy_info.safe] = {});
                    galaxy_list[galaxy_info.safe][galaxy_info.force] || (galaxy_list[galaxy_info.safe][galaxy_info.force] = 0);
                    galaxy_list[galaxy_info.safe][galaxy_info.force]++;
                    count++;
                }
            }

            ff(galaxy_list);
            ff('符合条件的恒星系 ' + count);
            fs.writeFileSync(file_universe_png, canvas_universe.toBuffer());
        }

        function drawTiles() {
            this.draw_ratio = common.setting.draw_ratio;
            //缩放比例 把地图单轴分割成100份
            let tiles_ratio = canvas_size / (map_max_size / base_map_block_number);
            //地图比例
            let map_ratio = map_max_size / base_map_block_number;
            // console.log(tiles_ratio);
            let canvas_tiles = new canvas.Canvas(canvas_size, canvas_size);
            let context_tiles = canvas_tiles.getContext('2d');
            drawRectFill(context_tiles, 0, 0, canvas_size, canvas_size, '#000000');
            //遍历宇宙
            for (let galaxy_id in galaxy_infos) {
                let galaxy_info = galaxy_infos[galaxy_id];
                //获取最中心的一个块图
                if (galaxy_info.x > 0 && galaxy_info.x * this.draw_ratio < map_ratio
                    && galaxy_info.y > 0 && galaxy_info.y * this.draw_ratio < map_ratio
                ) {
                    let x = galaxy_info.x * this.draw_ratio * tiles_ratio;
                    let y = galaxy_info.y * this.draw_ratio * tiles_ratio;
                    //恒星半径 这个值必定很小很小
                    let radius = Math.max(galaxy_info.radius * tiles_ratio, 5);
                    drawArcFill(context_tiles, x, y, radius, '#FF0000');


                    // for (let planet_id in planet_infos) {
                    //     let planet_info = planet_infos[planet_id];
                    //     let orbit = Math.max(common.func.getDistance(0, 0, planet_info.x * this.draw_ratio, planet_info.y * this.draw_ratio) * tiles_ratio, 1);
                    //     drawArc(context_tiles, x, y, orbit, '#FF0000');
                    // }
                }
            }


            fs.writeFileSync(file_tiles_png, canvas_tiles.toBuffer());
        }

        function drawGalaxy() {
            //缩放比例 因为恒星系最外一个行星会比预想的大一圈 再加上恒星的半径 所以比例再 / 2
            let galaxy_ratio = canvas_size / (map_galaxy_radius * map_galaxy_radius_ratio * 2);
            let canvas_galaxy = new canvas.Canvas(canvas_size, canvas_size);
            let context_galaxy = canvas_galaxy.getContext('2d');
            drawRectFill(context_galaxy, 0, 0, canvas_size, canvas_size);
            //获取第一个恒星系
            let galaxy_info = galaxy_infos[1];
            let x = canvas_size / 2;
            let y = canvas_size / 2;
            //恒星半径 这个值必定很小很小
            let radius = Math.max(galaxy_info.radius * galaxy_ratio, 1);

            drawArcFill(context_galaxy, x, y, radius, '#FF0000');

            //获取所有行星轨道并绘制圆圈
            // for (let planet_id in planet_infos) {
            //     let planet_info = planet_infos[planet_id];
            //     let orbit = Math.max(common.func.getDistance(0, 0, planet_info.x, planet_info.y) * galaxy_ratio, 1);
            //
            //     drawArc(context_galaxy, x, y, orbit, '#FF0000');
            //
            //     let planet_orbit = Math.max(planet_info.radius * galaxy_ratio, 1);
            //
            //     // console.log((planet_info.x - galaxy_info.x) * galaxy_ratio,(planet_info.y - galaxy_info.y) * galaxy_ratio);
            //     //根据行星宇宙坐标计算相对于恒星的坐标
            //     let planet_x = planet_info.x * galaxy_ratio + canvas_size / 2;
            //     let planet_y = planet_info.y * galaxy_ratio + canvas_size / 2;
            //     drawArcFill(context_galaxy, planet_x, planet_y, planet_orbit, '#FF0000');
            // }

            for (let station_id in station_infos) {
                let station_info = station_infos[station_id];
                if (station_info.galaxy_id === 1) {
                    let station_x = station_info.x * this.draw_ratio * galaxy_ratio + canvas_size / 2;
                    let station_y = station_info.y * this.draw_ratio * galaxy_ratio + canvas_size / 2;

                    let radius = Math.max(station_info.radius * galaxy_ratio, 5);

                    drawRectFill(context_galaxy, station_x - radius / 2, station_y - radius / 2, radius, radius, '#FFFF00');
                }
            }

            fs.writeFileSync(file_galaxy_png, canvas_galaxy.toBuffer());
        }

        function drawRingPoint() {
            //缩放比例
            let ring_ratio = canvas_size / map_max_size;
            let canvas_ring = new canvas.Canvas(canvas_size, canvas_size);
            let context_ring = canvas_ring.getContext('2d');
            //绘制背景
            drawRectFill(context_ring, 0, 0, canvas_size, canvas_size, '#000000');
            //遍历宇宙
            for (let pos in ring_point_list) {
                let ring_info = ring_point_list[pos];
                let x = ring_info.x * ring_ratio + canvas_size / 2;
                let y = ring_info.y * ring_ratio + canvas_size / 2;
                //恒星半径 这个值必定很小很小 这是实际显示半径
                drawArcFill(context_ring, x, y, 10, '#FF0000');
            }
            fs.writeFileSync(file_ring_point_png, canvas_ring.toBuffer());
        }
    }

    function fillZero(number, bit = 2) {
        return (Array(bit).join('0') + number).slice(-bit);
    }

    function getRandDepartName() {
        return depart_name[getSeedRand(0, depart_name.length - 1)];
    }

    function getRandStationName() {
        return station_name[getSeedRand(0, station_name.length - 1)];
    }
};

//小坐标
anglePoint = (x, y, angle, range) => {
    let radian = angleToRadian(angle);
    return {
        x: Math.round(x + Math.sin(radian) * range),
        y: Math.round(y - Math.cos(radian) * range),
    };
};

angleToRadian = (angle) => {
    return angle * Math.PI / 180;
};

drawRectFill = (content, x, y, width, height, color) => {
    content.fillStyle = color;
    content.beginPath();
    content.fillRect(x, y, width, height);
    content.fill();
};

drawArcFill = (content, x, y, radius, color) => {
    content.fillStyle = color;
    content.beginPath();
    content.arc(x, y, radius, 0, Math.PI * 2);
    content.closePath();
    content.fill();
};

drawArc = (content, x, y, radius, color) => {
    content.strokeStyle = color;
    content.lineWidth = 1;
    content.beginPath();
    content.arc(x, y, radius, 0, Math.PI * 2);
    content.closePath();
    content.stroke();
};

if (cluster.isMaster) {
    _startApp();
}
