const m_server = require("../../../server");
const BaseDao = require("./BaseDao");
const BaseNpcerWeaponInfo = require("../info/BaseNpcerWeaponInfo");

/**
 * @class {BaseNpcerWeaponDao}
 * @extends {BaseDao}
 */
class BaseNpcerWeaponDao extends BaseDao {
    constructor() {
        super();
        this.db_name = 'base_npcer_weapon_info';
        this.db_key = 'item_type';
        this.db_field = {
            item_type: 'number',//装备类型
            classify: 'number',//装备分类11激光12弹药13导弹
            size: 'number',//装备规格
            barrage: 'number',//弹幕类型
            name: 'string',//装备名称
            content: 'string',//装备描述
            quality: 'number',//装备品质
            range: 'number',//武器射程固定
            angle: 'number',//武器转速固定
            fire_rate: 'number',//射击间隔固定
            scatter: 'number',//散射角度固定
            space: 'number',//弹药间距固定
            count: 'number',//弹药数量固定
            multiple: 'number',//多重打击固定
            velocity: 'number',//弹药速度固定
            agile: 'number',//弹药敏捷固定
            accelerate: 'number',//弹药加速固定
            blast: 'number',//爆炸半径固定
            sustain: 'number',//爆炸半径固定
            radius: 'number',//弹药半径固定
            damage_electric: 'number',//电磁伤害固定
            damage_thermal: 'number',//热能伤害固定
            damage_explode: 'number',//爆炸伤害固定
            damage: 'number',//武器伤害系数
            mass: 'number',//增加质量固定
            require: 'number',//需求能量固定
            cost: 'number',//电容消耗固定
            suit_type: 'number',//套装编号
            res: 'string',//资源
            attribute: 'object',//属性列表
            extra: 'object',//特殊属性
        };
    }

    static instance() {
        if (BaseNpcerWeaponDao.m_instance === null) {
            BaseNpcerWeaponDao.m_instance = new BaseNpcerWeaponDao();
        }
        return BaseNpcerWeaponDao.m_instance;
    }

    getInfo(dao) {
        return new BaseNpcerWeaponInfo(dao).setServerDao(this);
    }
}

BaseNpcerWeaponDao.m_instance = null;

module.exports = BaseNpcerWeaponDao;
