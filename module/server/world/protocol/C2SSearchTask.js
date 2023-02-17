const BaseC2SProtocol = require("../../../protocol/info/BaseC2SProtocol");
const m_server = require("../../../server");
const m_player = require("../../../player");
const common = require("../../../common");
const WarpInfo = require("../../map/info/WarpInfo");
const NearGridInfo = require("../../map/info/NearGridInfo");

class C2SSearchTask extends BaseC2SProtocol {
    constructor(player_uuid, p_data) {
        super(player_uuid, p_data);
    }

    init() {
    }

    run() {
        let player_info = this.getPlayerInfo();
        if (player_info === null) {
            return;
        }
        let {force, category, difficult} = this.p_data;
        //TODO 验证

        //从基础任务列表随机一个任务
        let force_list = common.func.getSearchTaskForce(force);
        ff('可获取的势力列表', force_list, force_list.length);
        let task_force = force_list[common.func.getRand(0, force_list.length - 1)];
        ff('随机一个势力', task_force);
        let task_type = m_server.ServerBaseTask.getRandomTaskType(task_force, category, difficult);
        ff('随机到的任务类型', task_type)

        if (task_type) {
            let base_task_info = m_server.ServerBaseTask.getBaseTask(task_type);
            //TODO 做到这里的 有问题 高安要能刷新高级任务
            let world_galaxy_info = m_server.ServerWorldBlock.getRandomGalaxyFromSafe(base_task_info.dao.safe_min, base_task_info.dao.safe_max, task_force);
            //创建一个未接受的任务
            player_info.createPlayerTask(
                common.static.TASK_TYPE_OFFER,
                common.static.TASK_STATUS_NULL,
                task_type,
                force,
                world_galaxy_info.galaxy_id,
            )

            player_info.syncClientPlayerTask();

        } else {
            dd('任务缺失');
        }
    }
}

module.exports = C2SSearchTask;
