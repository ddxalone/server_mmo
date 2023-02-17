const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseShipPlayerInfo = require("../info/BaseShipPlayerInfo");

/**
 * @class {BaseShipPlayerDao}
 * @extends {BaseDao}
 */
class BaseShipPlayerDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_ship_player_info';
        this.db_key = 'ship_type';
        this.db_field = {
            ship_type: 'number',
            base_ship_type: 'number',
            classify: 'number',
            force: 'number',
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
            damage: 'number',
            shield_electric: 'number',
            shield_thermal: 'number',
            shield_explode: 'number',
            armor_electric: 'number',
            armor_thermal: 'number',
            armor_explode: 'number',
            level: 'number',
            price: 'number',
            skill: 'object',
            weapon: 'array',
            active: 'array',
            passive: 'array',
            engine: 'array',
            res: 'string',
        };
    }

    static instance() {
        if (BaseShipPlayerDao.m_instance === null) {
            BaseShipPlayerDao.m_instance = new BaseShipPlayerDao();
        }
        return BaseShipPlayerDao.m_instance;
    }

    getInfo(dao) {
        return new BaseShipPlayerInfo(dao).setServerDao(this);
    }
}

BaseShipPlayerDao.m_instance = null;

module.exports = BaseShipPlayerDao;
