const m_mysql = require(".");

class MysqlManage {
    static instance() {
        if (MysqlManage.m_instance == null) {
            MysqlManage.m_instance = new MysqlManage();
        }
        return MysqlManage.m_instance;
    }

    select(dbname, fields, wheres, callback, thisObj) {
        m_mysql.MysqlServer.selectService(dbname, fields, wheres, callback, thisObj);
    }

    insert(dbname, fields, callback, thisObj) {
        m_mysql.MysqlServer.insertService(dbname, fields, callback, thisObj);
    }

    update(dbname, fields, wheres, callback, thisObj) {
        m_mysql.MysqlServer.updateService(dbname, fields, wheres, callback, thisObj);
    }

    delete(dbname, wheres, callback, thisObj) {
        m_mysql.MysqlServer.deleteService(dbname, wheres, callback, thisObj);
    }

    selectPromise(db_name, fields, wheres) {
        return new Promise((resolve, reject) => {
            m_mysql.MysqlManage.select(db_name, fields, wheres, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            }, this);
        })
    }
}

MysqlManage.m_instance = null;

module.exports = MysqlManage;
