const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseShipNpcerInfo = require("../info/BaseShipNpcerInfo");

/**
 * @class {BaseShipNpcerDao}
 * @extends {BaseDao}
 */
class BaseShipNpcerDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_ship_npcer_info';
        this.db_key = 'ship_type';
        this.db_field = {
            ship_type: 'number',
            classify: 'number',
            force: 'number',
            difficult: 'number',
            score: 'number',
            group_id: 'number',
            plan_id: 'number',
            patrol: 'number',
            is_boss: 'number',
            name: 'string',
            content: 'string',
            quality: 'number',
            shield: 'number',
            recover: 'number',
            armor: 'number',
            resume: 'number',
            speed: 'number',
            radius: 'number',
            mass: 'number',
            agile: 'number',
            power: 'number',
            charge: 'number',
            capacity: 'number',
            chase: 'number',
            alert: 'number',
            assist: 'number',
            damage: 'number',
            shield_electric: 'number',
            shield_thermal: 'number',
            shield_explode: 'number',
            armor_electric: 'number',
            armor_thermal: 'number',
            armor_explode: 'number',
            weapon: 'array',
            engine: 'array',
            res: 'string',
        };
    }

    static instance() {
        if (BaseShipNpcerDao.m_instance === null) {
            BaseShipNpcerDao.m_instance = new BaseShipNpcerDao();
        }
        return BaseShipNpcerDao.m_instance;
    }

    getInfo(dao) {
        return new BaseShipNpcerInfo(dao).setServerDao(this);
    }
}

BaseShipNpcerDao.m_instance = null;

module.exports = BaseShipNpcerDao;
