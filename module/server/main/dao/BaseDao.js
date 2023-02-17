const m_mysql = require("../../../mysql/index");
const common = require("../../../common");

/**
 * @class {BaseDao}
 */
class BaseDao {
    constructor() {
        /**
         * 虚函数
         * @type {string}
         */
        this.db_name = '';
        /**
         * 虚函数
         * @type {string}
         */
        this.db_key = '';
        /**
         * 虚函数
         * @type {{}}
         */
        this.db_field = {};
        /**
         * 虚函数
         * @type {boolean}
         */
        this.db_array = false;
    }

    /**
     * 虚函数 获取dao对应的entity 如果数据库结构比较简单 则直接返回dao即可
     */
    getInfo() {

    }

    /**
     * 创建单行info
     * @return {*}
     */
    createRowInfo(result = {}) {
        return this.getInfo(this.getDaoValue(result))
            .setIsCreate(true);
    }

    /**
     * 创建多行info
     * @param results
     * @return {[]}
     */
    createListInfo(results) {
        let list = [];
        for (let result of results) {
            list.push(this.createRowInfo(result));
        }
        return list;
    }

    createRow(result = {}) {

    }

    /**
     * 读取数据库 返回实例 初始化多条记录 同步方法
     * @param wheres
     * @returns {Promise<resolve, reject>}
     */
    initDaoListPromise(wheres) {
        return new Promise((resolve, reject) => {
            let fields = Object.keys(this.db_field);
            m_mysql.MysqlManage.select(this.db_name, fields, wheres, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(this.initDaoListPromiseFromData(results));
            }, this);
        })
    }

    /**
     * 读取配置文件 返回实例 同步方法
     * @param results
     */
    initDaoListPromiseFromData(results) {
        let info_list = {};
        //遍历结果集
        for (let result of results) {
            // let result = results[pos];
            //读取文件配置时 数组转object
            if (this.db_array) {
                result = this.arrayResultToResult(result);
            }
            info_list[result[this.db_key]] = this.getInfo(this.getDaoValue(result));
        }
        return info_list;
    }

    /**
     * 把数组格式的数据转换成db_field格式的
     * @return {*}
     */
    arrayResultToResult(array_result) {
        let result = {};
        let pos = 0;
        for (let field in this.db_field) {
            result[field] = array_result[pos];
            pos++;
        }
        return result;
    }

    /**
     * 获取单条记录 callback info 同步方法
     * @param wheres
     */
    initDaoRowPromise(wheres) {
        return new Promise((resolve, reject) => {
            let fields = Object.keys(this.db_field);
            m_mysql.MysqlManage.select(this.db_name, fields, wheres, (err, results) => {
                if (err) {
                    reject(err);
                }
                let info = null;
                //遍历结果集
                if (results && results[0]) {
                    info = this.getInfo(this.getDaoValue(results[0]));
                }
                // for (let pos in results) {
                //     let result = results[pos];
                //     info = this.getInfo(this.getDaoValue(result));
                //     break;
                // }
                resolve(info);
            }, this);
        })
    }

    /**
     * 创建单条记录 callback info 同步方法
     * @param dao
     * @returns {*}
     */
    insertDaoRowPromise(dao) {
        return new Promise((resolve, reject) => {
            let fields = this.getFieldValue(dao, true);
            m_mysql.MysqlManage.insert(this.db_name, fields, (err, result) => {
                if (err) {
                    reject(err);
                }
                //如果是自增ID则直接给info和dao赋值
                let insertId = (result && result.insertId) || 0;
                if (insertId) {
                    dao[this.db_key] = insertId;
                }
                resolve(this.getInfo(this.getDaoValue(dao)));
            }, this);
        })
    }

    /**
     * 创建多条记录 同步方法
     * @param dao_list
     * @param callback
     * @param thisObj
     */
    async insertDaoListPromise(dao_list, callback, thisObj) {
        let infos = {};
        for (let pos in dao_list) {
            let info = await this.insertDaoRowPromise(dao_list[pos]);
            infos[info[this.db_key]] = info;
        }
        return infos;
    }


    /**
     * 读取数据库 返回实例 初始化多条记录
     * @param wheres
     * @param callback
     * @param thisObj
     */
    initDaoList(wheres, callback, thisObj) {
        let fields = Object.keys(this.db_field);
        m_mysql.MysqlManage.select(this.db_name, fields, wheres, (err, results) => {
            if (err) {
                return callback && callback.call(thisObj, err);
            }
            this.initDaoListFromData(results, callback, thisObj);
        }, this);
    }

    /**
     * 读取配置文件 返回实例
     * @param results
     * @param callback
     * @param thisObj
     */
    initDaoListFromData(results, callback, thisObj) {
        let info_list = {};
        //遍历结果集
        for (let pos in results) {
            let result = results[pos];
            info_list[result[this.db_key]] = this.getInfo(this.getDaoValue(result));
        }
        callback && callback.call(thisObj, null, info_list);
    }

    /**
     * 获取单条记录 callback info
     * @param wheres
     * @param callback
     * @param thisObj
     */
    initDaoRow(wheres, callback, thisObj) {
        let fields = Object.keys(this.db_field);
        m_mysql.MysqlManage.select(this.db_name, fields, wheres, (err, results) => {
            if (err) {
                return callback && callback.call(thisObj, err);
            }
            let info = null;
            //遍历结果集
            if (results && results[0]) {
                info = this.getInfo(this.getDaoValue(results[0]));
            }
            // for (let pos in results) {
            //     let result = results[pos];
            //     info = this.getInfo(this.getDaoValue(result));
            //     break;
            // }
            callback && callback.call(thisObj, null, info);
        }, this);
    }

    /**
     * 创建多条记录
     * @param dao_list
     * @param callback
     * @param thisObj
     */
    // insertDaoList(dao_list, callback, thisObj) {
    //     let callback_count = Object.keys(dao_list).length;
    //     let infos = {};
    //     for (let pos in dao_list) {
    //         this.insertDaoRow(dao_list[pos], (err, info) => {
    //             if (err) {
    //                 if (callback_count > 0) {
    //                     callback_count = 0;
    //                     return callback && callback.call(thisObj, err);
    //                 }
    //                 return;
    //             }
    //             infos[info[this.db_key]] = info;
    //             callback_count--;
    //             if (callback_count === 0) {
    //                 return callback && callback.call(thisObj, null, infos);
    //             }
    //         }, this);
    //     }
    // }

    /**
     * 创建单条记录
     * @param dao
     * @returns {*}
     */
    insertDaoRow(dao) {
        let fields = this.getFieldValue(dao, true);
        m_mysql.MysqlManage.insert(this.db_name, fields, (err, result) => {
            if (err) {
                //TODO 记录日志
            }
        }, this);
    }

    /**
     * 更新列表中的单条数据
     * @param dao
     * @returns {*}
     */
    updateDaoRow(dao) {
        let wheres = {};
        wheres[this.db_key] = dao[this.db_key];
        let fields = this.getFieldValue(dao, false);
        m_mysql.MysqlManage.update(this.db_name, fields, wheres, (err, result) => {
            if (err) {
                //TODO 记录日志
            }
        }, this);
    }

    /**
     * 局部更新
     * @param wheres
     * @param fields
     */
    updateDaoPart(wheres, fields) {
        m_mysql.MysqlManage.update(this.db_name, fields, wheres, (err, result) => {
            if (err) {
                //TODO 记录日志
            }
        }, this);
    }

    /**
     * 删除记录
     * @param dao
     */
    deleteDaoRow(dao) {
        let wheres = {};
        wheres[this.db_key] = dao[this.db_key];
        m_mysql.MysqlManage.delete(this.db_name, wheres, (err, result) => {
            if (err) {
                //TODO 记录日志
            }
        }, this);
    }

    /**
     * field转换为dao
     * @param result
     */
    getDaoValue(result = {}) {
        let dao = {};
        for (let field in this.db_field) {
            dao[field] = this.getTypeValue(this.db_field[field], result[field]);
        }
        return dao;
    }

    /**
     * dao转换为field 是:含db_key
     * @param dao
     * @param is_db_key
     */
    getFieldValue(dao, is_db_key) {
        let fields = {};
        for (let field in this.db_field) {
            if (is_db_key === true || field !== this.db_key) {
                fields[field] = this.getTypeValue(this.db_field[field], dao[field]);
            }
        }
        return fields;
    }

    /**
     * 获取某个类型的值
     * @param type
     * @param value
     * @return {*}
     */
    getTypeValue(type, value) {
        switch (type) {
            case 'number':
                return parseInt(value) || 0;
            case 'string':
                return value || '';
            case 'array':
                return JSON.parse(value) || [];
            case 'object':
                return JSON.parse(value) || {};
            default:
                return null;
        }
    }

}

module.exports = BaseDao;
