const common = require("../../../common");
const m_server = require("../../../server");

/**
 * @class {BaseDaoInfo}
 */
class BaseDaoInfo {
    constructor(dao) {
        this.draw_ratio = common.setting.draw_ratio;

        this.dao = dao;

        //相对于数据库是否新增
        this.is_create = false;
        //相对于数据库是否改变
        this.is_change = false;
        //相对于数据库是否删除
        this.is_delete = false;

        this.server_dao = null;

        this.filter = null;
    }

    getDao() {
        return this.dao;
    }

    /**
     * @param server_dao
     * @return {*}
     */
    setServerDao(server_dao) {
        this.server_dao = server_dao;
        return this;
    }

    /**
     * @param is_create
     * @return {*}
     */
    setIsCreate(is_create) {
        this.is_create = is_create;
        return this;
    }

    /**
     * @param is_change
     * @return {*}
     */
    setIsChange(is_change) {
        this.is_change = is_change;
        return this;
    }

    /**
     * 设置删除
     */
    setIsDelete() {
        this.is_delete = true;
    }

    /**
     * 判断是否存在
     * @return {BaseDaoInfo|null}
     */
    getExist() {
        return this.is_delete ? null : this;
    }

    /**
     * 设置物品属性
     * @param param
     * @param value
     */
    setDaoValue(param, value) {
        if (this.dao[param] !== value) {
            this.setIsChange(true);
            this.dao[param] = value;
        }
    }

    getDaoValue(param) {
        return this.dao[param];
    }

    /**
     * 数据库更新 如果删除返回true
     * @return {boolean}
     */
    dbHandle() {
        if (this.is_delete) {
            this.server_dao.deleteDaoRow(this.dao);
            return true;
        } else if (this.is_create) {
            this.setIsCreate(false);
            this.setIsChange(false);
            this.server_dao.insertDaoRow(this.dao);
        } else if (this.is_change) {
            this.setIsChange(false);
            this.server_dao.updateDaoRow(this.dao);
        }
        return false;
    }

    /**
     * @param filter
     * @return {*}
     */
    setFilter(filter = null) {
        this.filter = filter;
        return this;
    }
}

module.exports = BaseDaoInfo;

