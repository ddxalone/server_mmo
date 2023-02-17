const m_server = require("../../../server");

/**
 * @class {ItemProperties}
 */
class ItemProperties {
    constructor() {
        /**
         * @type {Object<number, ItemProperty>}
         */
        this.properties = {};
    }

    /**
     * @returns {ItemProperties}
     */
    initProperty(base_attribute) {
        //武器当前属性放到 当前武器里 全域属性放到舰船里
        //然后整体刷新舰船和武器属性
        for (let attribute_type in base_attribute) {
            attribute_type = parseInt(attribute_type);

            let base_item_attribute = this.getBaseAttribute(attribute_type);
            this.initItemProperty(attribute_type, base_item_attribute, base_attribute[attribute_type])
        }
        return this;
    }

    /**
     * 初始化套装属性
     * @param base_suit_attribute
     * @return {ItemProperties}
     */
    initSuitProperty(base_suit_attribute) {
        for (let count in base_suit_attribute) {
            count = parseInt(count);
            for (let attribute_type in base_suit_attribute[count]) {
                attribute_type = parseInt(attribute_type);

                let base_item_attribute = this.getBaseAttribute(attribute_type);
                this.initItemProperty(attribute_type, base_item_attribute, base_suit_attribute[count][attribute_type], count)
            }
        }
        return this;
    }

    getBaseAttribute(attribute_type) {
        return m_server.ServerBaseItem.getItemAttributeValue(attribute_type).getDao();
    }

    /**
     * 初始化装备属性
     * @param attribute_type
     * @param base_item_attribute
     * @param value
     * @param count
     */
    initItemProperty(attribute_type, base_item_attribute, value, count = 0) {
        this.properties[attribute_type] = new ItemProperty(attribute_type)
            .setBaseAttributeInfo(base_item_attribute)
            .setValue(value)
            .setCount(count);
    }

    /**
     * @param {callbackItemProperty} callback
     * @param thisObj
     */
    eachItemProperties(callback, thisObj) {
        for (let attribute_type in this.properties) {
            callback && callback.call(thisObj, this.properties[attribute_type]);
        }
    }
}

/**
 * @callback callbackItemProperty
 * @param {ItemProperty} property
 */
/**
 * @class {ItemProperty}
 */
class ItemProperty {
    constructor(attribute_type) {
        this.attribute_type = attribute_type;
        this.scope = 0;
        this.property = 0;
        this.value = 0;
        this.name = '';
        this.content = '';
        this.count = 0;
    }

    /**
     * @param base_item_attribute
     * @return {ItemProperty}
     */
    setBaseAttributeInfo(base_item_attribute) {
        this.scope = base_item_attribute.scope;
        this.property = base_item_attribute.property;
        this.name = base_item_attribute.name;
        this.content = base_item_attribute.content;
        return this;
    }

    /**
     * @param value
     * @return {ItemProperty}
     */
    setValue(value) {
        this.value = value;
        return this;
    }

    /**
     * @param count
     * @return {ItemProperty}
     */
    setCount(count) {
        this.count = count;
        return this;
    }
}

module.exports = ItemProperties;
