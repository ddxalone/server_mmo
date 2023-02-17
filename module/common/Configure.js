const common = require("../common");

/**
 * 前后端都有的静态类
 */
class Configure {
    constructor() {
        this.BASE_RENOWN_INFOS = {};
        //森严的 无差别攻击
        this.BASE_RENOWN_INFOS[common.static.NPCER_RENOWN_TYPE_STRICT] = {
            'init': -1800,//初始化声望
            'recover': 1,//每秒恢复的声望
            'hatred': 20,//每秒产生的仇恨
            'max': -2000,//输出的最高声望
        };

        //警示的 玩家<-2攻击 直到攻击
        this.BASE_RENOWN_INFOS[common.static.NPCER_RENOWN_TYPE_WARNING] = {
            'init': -300,//声望<900攻击 900-1050警戒 1050-2000巡逻(警戒)
            'recover': 2,//每秒恢复的声望
            'hatred': 12,//每秒产生的仇恨
            'max': 750,//输出的最高声望
        };

        //戒备的 玩家-5攻击 超过-2警戒 直到攻击
        this.BASE_RENOWN_INFOS[common.static.NPCER_RENOWN_TPPE_GUARD] = {
            'init': -100,//初始化声望
            'recover': 3,//每秒恢复的声望
            'hatred': 8,//每秒增加的声望
            'max': 750,//输出的最高声望
        };

        //正常的 玩家-5攻击 超过-2警戒 直到攻击
        this.BASE_RENOWN_INFOS[common.static.NPCER_RENOWN_TPPE_NATURAL] = {
            'init': 0,//初始化声望
            'recover': 5,//每秒恢复的声望
            'hatred': 0,//每秒增加的声望
            'max': 2000,//输出的最高声望
        };

        //治安的 TODO 玩家-5攻击 超过-2警戒 直到攻击
        this.BASE_RENOWN_INFOS[common.static.NPCER_RENOWN_TYPE_POLICE] = {
            'init': 0,//初始化声望
            'recover': 5,//每秒恢复的声望
            'hatred': 5,//每秒增加的声望
            'max': 2000,//输出的最高声望
        };
    }

    static instance() {
        if (Configure.m_instance == null) {
            Configure.m_instance = new Configure();
        }
        return Configure.m_instance;
    }
}

Configure.m_instance = null;

module.exports = Configure;
