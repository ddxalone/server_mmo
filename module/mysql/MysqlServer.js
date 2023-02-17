const mysql = require("mysql");
const c_config = require("../../config");
const m_log = require("../log");

/**
 * @class {MysqlServer}
 */
class MysqlServer {
    constructor() {
        this.mysql_connect_status = false;
        this.mysql_server = null;

        this.db_prefix = c_config.StoreConfig.mysql_pref;
    }

    static instance() {
        if (MysqlServer.m_instance == null) {
            MysqlServer.m_instance = new MysqlServer();
        }
        return MysqlServer.m_instance;
    }

    /**
     * 初始化mysql服务
     * @returns {boolean}
     */
    initMysqlServer(callback, thisObj) {
        let option = this.getMysqlOption();
        this.mysql_server = mysql.createConnection(option);
        this.mysql_server.connect((err) => {
            if (err) {
                return callback && callback.call(thisObj, err);
            }
            this.mysql_connect_status = true;
            callback && callback.call(thisObj);
        });
    }

    /**
     * 获取mysql配置
     * @returns {{password: *, database: *, port: *, host: *, user: *}}
     */
    getMysqlOption() {
        return {
            host: c_config.StoreConfig.mysql_host,
            user: c_config.StoreConfig.mysql_user,
            password: c_config.StoreConfig.mysql_pass,
            port: c_config.StoreConfig.mysql_port,
            database: c_config.StoreConfig.mysql_data,
        };
    }

    selectService(dbname, fields, wheres, callback, thisObj) {
        let field_str = this.makeSelectFieldStr(fields);
        let where_str = this.makeWhereStr(wheres);
        if (dbname && field_str) {
            let sql_str = 'SELECT ' + field_str + ' FROM `' + this.db_prefix + dbname + '` WHERE 1 ' + where_str;
            // ff(sql_str);
            this.queryService(sql_str, callback, thisObj);
        } else {
            callback && callback.call(thisObj, 'mysql select field error');
        }
    }

    insertService(dbname, fields, callback, thisObj) {
        let field_array = this.makeInsertFieldArray(fields);

        if (dbname && field_array['field_str'] && field_array['value_str']) {
            let sql_str = 'INSERT INTO' + ' `' + this.db_prefix + dbname + '` (' + field_array['field_str'] + ') VALUES (' + field_array['value_str'] + ')';
            // ff(sql_str);
            this.queryService(sql_str, callback, thisObj);
        } else if (dbname && field_array['field_str']) {
            let sql_str = 'INSERT INTO' + ' `' + this.db_prefix + dbname + '` ' + field_array['field_str'];
            // ff(sql_str);
            this.queryService(sql_str, callback, thisObj);
        } else {
            callback && callback.call(thisObj, 'mysql insert field error');
        }
    }

    updateService(dbname, fields, wheres, callback, thisObj) {
        let field_str = this.makeUpdateFieldStr(fields);

        let where_str = this.makeWhereStr(wheres);
        if (dbname && field_str) {
            let sql_str = 'UPDATE `' + this.db_prefix + dbname + '` SET ' + field_str + ' WHERE 1 ' + where_str;
            // ff(sql_str);
            this.queryService(sql_str, callback, thisObj);
        } else {
            callback && callback.call(thisObj, 'mysql update field error');
        }
    }

    deleteService(dbname, wheres, callback, thisObj) {
        let where_str = this.makeWhereStr(wheres);
        if (dbname && where_str) {
            let sql_str = 'DELETE FROM' + ' `' + this.db_prefix + dbname + '` WHERE 1 ' + where_str;
            // ff(sql_str);
            this.queryService(sql_str, callback, thisObj);
        } else {
            callback && callback.call(thisObj, 'mysql delete field error');
        }
    }

    queryService(sql_str, callback, thisObj) {
        if (this.mysql_connect_status) {
            this.mysql_server.query(sql_str, function (err, results) {
                if (callback) {
                    if (err) {
                        m_log.LogManage.error(err);
                        return callback && callback.call(thisObj, err);
                    }
                    // callback(null, results);
                    callback && callback.call(thisObj, null, results);
                }
            });
        } else {
            callback && callback.call(thisObj, 'mysql connect error');
        }
    }

    makeSelectFieldStr(fields) {
        let field_str = '*';
        //如果为空数组 则取全部值
        if (typeof fields == 'object') {
            if (fields.length) {
                for (let f in fields) {
                    if (field_str === '*') {
                        field_str = '`' + fields[f] + '`';
                    } else {
                        field_str += ',`' + fields[f] + '`';
                    }
                }
            }
        }
        if (typeof fields == 'string') {
            field_str = fields;
        }
        return field_str;
    }

    makeInsertFieldArray(fields) {
        let field_str = '';
        let value_str = '';
        if (typeof fields == 'object') {
            if (Object.keys(fields).length) {
                for (let f in fields) {
                    if (field_str === '' && value_str === '') {
                        field_str = '`' + f + '`';
                        value_str = '' + this.escape(fields[f]) + '';
                    } else {
                        field_str += ',`' + f + '`';
                        value_str += ',' + this.escape(fields[f]) + '';
                    }
                }
            }
        }
        //批量插入方法
        if (typeof fields == 'string') {
            field_str = fields;
        }
        return {'field_str': field_str, 'value_str': value_str};
    }

    makeUpdateFieldStr(fields) {
        let field_str = '';
        //如果为空数组 则取全部值
        if (Object.keys(fields).length) {
            for (let f in fields) {
                if (field_str === '') {
                    field_str = '`' + f + '` = ' + this.escape(fields[f]) + '';
                } else {
                    field_str += ',`' + f + '` = ' + this.escape(fields[f]) + '';
                }
            }
        }
        return field_str;
    }

    makeWhereStr(wheres) {
        let where_str = '';
        if (wheres) {
            if (typeof wheres == 'object') {
                if (Object.keys(wheres).length) {
                    for (let w in wheres) {
                        where_str += ' AND `' + w + '` = ' + this.escape(wheres[w]) + '';
                    }
                }
            }
            if (typeof wheres == 'string') {
                where_str = wheres;
            }
        }
        return where_str;
    }


    escape(string) {
        return this.mysql_server.escape(string);
    }
}

MysqlServer.m_instance = null;

module.exports = MysqlServer;
