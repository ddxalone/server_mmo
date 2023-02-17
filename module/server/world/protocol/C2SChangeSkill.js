const m_player = require("../../../player");
const m_server = require("../../../server");
const common = require("../../../common");
const m_websocket = require("../../../websocket");
const S2CChangeItem = require("../../../player/protocol/S2CChangeItem");
const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");

class C2SChangeSkill extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
    }

    /**
     * 移动装备
     */
    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }

        let unit_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(player_info.player_id);
        if (!unit_ship_player) {
            return;
        }

        let skill_type = this.p_data.type;
        let level = this.p_data.level;

        //TODO 验证skill_type范围 验证level范围

        if (level < 0) {
            return;
        }

        let player_skill = player_info.getPlayerSkill(skill_type);
        //技能不存在视为0级
        let now_level = (player_skill && player_skill.getExist()) ? player_skill.getDaoValue('level') : 0;

        if (now_level - 1 === level) {
            //减技能
        } else if (now_level + 1 === level) {
            //加技能
            //判断技能是否在范围
            if (player_info.checkSkillInRange(skill_type) === false) {
                ff('不在范围');
                return;
            }
        } else {
            ff('error skill');
            return;
        }

        //判断技能是否存在 如果存在 则更新技能数值 如果不存在则创建新技能数值
        if (player_skill && player_skill.getExist()) {
            if (level) {
                player_info.setPlayerSkillValue(player_skill, 'level', level);
            } else {
                //删除技能
                player_info.removePlayerSkill(player_skill);
            }
        } else {
            // let player_skills = await m_player.PlayerSkillDao.createPlayerSkillService(player_info.player_id, [
            //     {
            //         skill_type: skill_type,
            //         level: level,
            //     },
            // ]);

            //基础的信息要在之前创建 即info前的几个固定的字段 dao的值在后面创建即可
            if (level) {
                if (level !== 1) {
                    dd('这不应该不为1');
                }
                // let skill_result_data = [{
                //     skill_type: skill_type,
                //     level: level,
                // }];
                // m_player.PlayerSkillDao.createPlayerSkill(player_info, skill_result_data);
                player_info.createPlayerSkill(skill_type, level);
            } else {
                //level 不能小于等于 0
            }
        }

        unit_ship_player.syncUnitShipPlayer();

        player_info.syncClientPlayerSkill();

        //可以判断如果是战斗技能则reload 好像现在没有非战斗技能

        //TODO 所有协议的这个reloadInfo 是不是可以考虑拿到 map_process 里统一处理和前端整体逻辑保持一致
        unit_ship_player.reloadInfo();

        unit_ship_player.map_grid_info.addFrameUnit(unit_ship_player, common.static.MAP_FRAME_TYPE_EXIST);
    }
}

module.exports = C2SChangeSkill;
