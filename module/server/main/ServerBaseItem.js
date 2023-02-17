const m_server = require("../index");
const common = require("../../common");
const m_data = require("../../data");

/**
 * 宇宙事件初始化 所有数据库读取完成后 整体再执行初始化事件
 * @class {ServerBaseItem}
 */
class ServerBaseItem {
    constructor() {
        /**
         * 基础玩家武器列表
         * @type {Object<number, BaseItemWeaponInfo>}
         */
        this.base_item_weapon_list = {};
        /**
         * 基础玩家模块列表
         * @type {Object<number, BaseItemModuleInfo>}
         */
        this.base_item_module_list = {};
        /**
         * 基础玩家道具列表
         * @type {Object<number, BaseItemInfo>}
         */
        this.base_item_info_list = {};
        /**
         * 基础属性表
         * @type {Object<number, BaseAttributeInfo>}
         */
        this.base_attribute_list = {};
        /**
         * 基础套装表
         * @type {Object<number, BaseItemSuitInfo>}
         */
        this.base_item_suit_list = {};
        /**
         * 敌武属性表
         * @type {Object<number, BaseNpcerWeaponInfo>}
         */
        this.base_npcer_weapon_list = {};
    }

    static instance() {
        if (ServerBaseItem.m_instance == null) {
            ServerBaseItem.m_instance = new ServerBaseItem();
        }
        return ServerBaseItem.m_instance;
    }

    /**
     * 初始化舰船信息
     */
    async initServerBaseItem() {
        // m_server.BaseItemWeaponDao.initDaoList(null, this.initServerBaseItemResponse, this);
        // m_server.BaseItemModuleDao.initDaoList(null, this.initServerBaseItemResponse, this);
        this.initServerBaseAttributeResponse(await m_server.BaseAttributeDao.initDaoListPromiseFromData(m_data.BaseAttributeData));
        this.initServerBaseItemSuitResponse(await m_server.BaseItemSuitDao.initDaoListPromiseFromData(m_data.BaseItemSuitData));
        this.initServerBaseItemWeaponResponse(await m_server.BaseItemWeaponDao.initDaoListPromiseFromData(m_data.BaseItemWeaponData));
        this.initServerBaseItemModuleResponse(await m_server.BaseItemModuleDao.initDaoListPromiseFromData(m_data.BaseItemModuleData));
        this.initServerBaseItemInfoResponse(await m_server.BaseItemInfoDao.initDaoListPromiseFromData(m_data.BaseItemInfoData));
        this.initServerBaseNpcerWeaponResponse(await m_server.BaseNpcerWeaponDao.initDaoListPromiseFromData(m_data.BaseNpcerWeaponData));
    }

    initServerBaseAttributeResponse(base_attribute_list) {
        // for (let base_attribute_info of Object.values(base_attribute_list)) {
        //     this.setBaseAttribute(base_attribute_info);
        // }
        this.base_attribute_list = base_attribute_list;
        console.log("db base_attribute_list init done");
    }

    initServerBaseItemSuitResponse(base_item_suit_list) {
        // for (let base_item_suit_info of Object.values(base_item_suit_list)) {
        //     this.setBaseItemSuit(base_item_suit_info);
        // }
        this.base_item_suit_list = base_item_suit_list;
        console.log("db base_item_suit_list init done");
    }

    initServerBaseItemWeaponResponse(base_item_weapon_list) {
        // for (let base_item_info of Object.values(base_item_weapon_list)) {
        //     this.setBaseItemWeapon(base_item_info);
        //     this.addItemToSuit(base_item_info);
        // }
        this.base_item_weapon_list = base_item_weapon_list;
        for (let base_item_info of Object.values(base_item_weapon_list)) {
            this.addItemToSuit(base_item_info);
        }
        console.log("db base_item_weapon_list init done");
    }

    initServerBaseItemModuleResponse(base_item_module_list) {
        // for (let base_item_info of Object.values(base_item_module_list)) {
        //     this.setBaseItemModule(base_item_info);
        //     this.addItemToSuit(base_item_info);
        // }
        this.base_item_module_list = base_item_module_list;
        for (let base_item_info of Object.values(base_item_module_list)) {
            this.addItemToSuit(base_item_info);
        }
        console.log("db base_item_module_list init done");
    }

    initServerBaseItemInfoResponse(base_item_info_list) {
        // for (let base_item_info of Object.values(base_item_info_list)) {
        //     this.setBaseItemInfo(base_item_info);
        // }
        this.base_item_info_list = base_item_info_list;
        console.log("db base_item_info_list init done");
    }

    initServerBaseNpcerWeaponResponse(base_npcer_weapon_list) {
        // for (let item_type in base_npcer_weapon_list) {
        //     this.setBaseNpcerWeapon(base_npcer_weapon_list[item_type]);
        // }
        this.base_npcer_weapon_list = base_npcer_weapon_list;
        console.log("db base_npcer_weapon_list init done");
    }

    /**
     * 追加物品到suit信息
     * @param base_item_info
     */
    addItemToSuit(base_item_info) {
        let suit_type = base_item_info.getDao().suit_type;
        if (suit_type) {
            this.getItemSuitValue(suit_type).setSuitItemType(base_item_info);
        }
    }

    /**
     * @param attribute_type
     * @returns {BaseAttributeInfo}
     */
    getItemAttributeValue(attribute_type) {
        return this.base_attribute_list[attribute_type];
    }

    /**
     * @param suit_type
     * @returns {BaseItemSuitInfo}
     */
    getItemSuitValue(suit_type) {
        return this.base_item_suit_list[suit_type];
    }

    /**
     * @param main_classify
     * @param item_type
     * @returns {*}
     */
    getItemDataValue(main_classify, item_type) {
        switch (main_classify) {
            case common.static.ITEM_MAIN_CLASSIFY_WEAPON:
                return this.base_item_weapon_list[item_type];
            case common.static.ITEM_MAIN_CLASSIFY_ACTIVE:
            case common.static.ITEM_MAIN_CLASSIFY_PASSIVE:
                return this.base_item_module_list[item_type];
            case common.static.ITEM_MAIN_CLASSIFY_INFO:
                return this.base_item_info_list[item_type];
        }
    }

    getNpcerWeaponDataValue(item_type) {
        return this.base_npcer_weapon_list[item_type];
    }
}

ServerBaseItem.m_instance = null;

module.exports = ServerBaseItem;
