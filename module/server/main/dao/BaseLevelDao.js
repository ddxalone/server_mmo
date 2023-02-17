const BaseDao = require("./BaseDao");

/**
 * @class {BaseLevelDao}
 * @extends {BaseDao}
 */
class BaseLevelDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_level';
        this.db_key = 'level_id';
        this.db_field = {
            level_id: 'number',
            exp: 'number',
        };
    }

    static instance() {
        if (BaseLevelDao.m_instance === null) {
            BaseLevelDao.m_instance = new BaseLevelDao();
        }
        return BaseLevelDao.m_instance;
    }

    getInfo(dao) {
        return dao;
    }
}

BaseLevelDao.m_instance = null;

module.exports = BaseLevelDao;
