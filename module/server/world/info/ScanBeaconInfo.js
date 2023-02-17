const m_player = require("../../../player");
const m_server = require("../../../server");
const common = require("../../../common");

/**
 * @class {ScanBeaconInfo}
 */
class ScanBeaconInfo {
    constructor(unit_ship_player) {
        this.unit_ship_player = unit_ship_player;
        this.type = 0;
        this.id = 0;
        this.name = 0;
        this.distance = 0;
        this.intensity = 0;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.radius_pow = 0;
        this.exact_begin = 0;
        this.exact_end = 0;
        this.exact_total = 0;
        this.intensity_step = 0;

        //触发显示距离 33%
        this.exact_step_distance = 0;
        //触发显示名称 66%
        this.exact_step_name = 0;
    }

    setType(type) {
        this.type = type;
    }

    setName(name) {
        this.name = name;
    }

    setId(id) {
        this.id = id;
    }

    setDistance(distance) {
        this.distance = distance;
    }

    setIntensity(intensity) {
        this.intensity = intensity;
    }

    setPoint(x, y) {
        this.x = x;
        this.y = y;
    }

    setRadius(radius) {
        this.radius = radius;
        this.radius_pow = Math.pow(radius, 2);
    }

    /**
     * 更近精扫进度
     * @param clear
     */
    // updateIntensityTest(clear = false) {
    //     this.intensity = Math.floor(Math.min(100, (this.unit_ship_player.server_frame - this.exact_begin) / this.exact_total * 100));
    //     if (clear) {
    //         this.exact_total = 0;
    //         this.exact_begin = 0;
    //         this.exact_end = 0;
    //         this.exact_step_distance = 0;
    //         this.exact_step_name = 0;
    //     }
    //     ff('更新intensity', this.intensity);
    // }

    /**
     * 更新扫描精度
     * @param clear
     * @returns {ScanBeaconInfo|null}
     */
    updateIntensity(clear) {
        this.intensity = Math.floor(Math.min(100, (this.unit_ship_player.server_frame - this.exact_begin) / this.exact_total * 100));
        if (clear) {
            this.exact_total = 0;
            this.exact_begin = 0;
            this.exact_end = 0;
            this.exact_step_distance = 0;
            this.exact_step_name = 0;
        }
        ff('更新intensity', this.intensity);
        //33以下没有名字 66以下有名字 99以下有距离 100的时候更新距离 和坐标
        // let intensity_step = this.intensity_step;
        // this.intensity = intensity;
        // this.intensity_step = Math.floor(intensity / 33.3);
        // if (this.intensity_step === common.static.SCAN_EXACT_SUCCESS) {
        //     this.scanFinish();
        // }
        // return intensity_step < this.intensity_step ? this : null;
    }

    /**
     * 更新阶段
     * @param intensity_step
     * @returns {ScanBeaconInfo|null}
     */
    updateIntensityStep(intensity_step) {
        if (intensity_step === common.static.SCAN_EXACT_SUCCESS) {
            //如果成功了 完成扫描
            this.scanSuccess();
            this.intensity_step = common.static.SCAN_EXACT_SUCCESS;
        } else {
            //如果没成功 取当前或者设置高的 并调整 最高为99%的阶段
            this.intensity_step = Math.min(Math.max(this.intensity_step, intensity_step), common.static.SCAN_EXACT_NAME);
        }
    }

    /**
     * 精准扫描完成 确认距离和坐标
     */
    scanSuccess() {
        switch (this.type) {
            case common.static.WORLD_UNIT_TYPE_SHIP_PLAYER:
                //这样取得坐标有延迟 擦了个擦
                let scan_ship_player = m_server.ServerMapPlayer.getIndexUnitPlayer(this.id);
                this.setDistance(common.func.getDistance(this.unit_ship_player.x, this.unit_ship_player.y, scan_ship_player.x, scan_ship_player.y));
                this.setPoint(scan_ship_player.x, scan_ship_player.y);
                break;
            case common.static.WORLD_UNIT_TYPE_STATION:
                let scan_station = m_server.ServerWorldStation.getIndexStationInfo(this.id);
                this.setDistance(common.func.getDistance(this.unit_ship_player.x, this.unit_ship_player.y, scan_station.global_x, scan_station.global_y));
                this.setPoint(scan_station.global_x, scan_station.global_y);
                break;
            case common.static.WORLD_UNIT_TYPE_DEAD:
                let scan_dead = m_server.ServerWorldDead.getIndexDeadInfo(this.id);
                this.setDistance(common.func.getDistance(this.unit_ship_player.x, this.unit_ship_player.y, scan_dead.global_x, scan_dead.global_y));
                this.setPoint(scan_dead.global_x, scan_dead.global_y);
                break;
            case common.static.WORLD_UNIT_TYPE_TASK:
                let scan_task = m_server.ServerWorldTask.getIndexTaskInfo(this.id);
                this.setDistance(common.func.getDistance(this.unit_ship_player.x, this.unit_ship_player.y, scan_task.global_x, scan_task.global_y));
                this.setPoint(scan_task.global_x, scan_task.global_y);
                break;
        }
    }

    getClientScanBeaconInfo() {
        let distance = this.intensity_step > common.static.SCAN_EXACT_NULL ? this.distance : 0;
        let name = this.intensity_step > common.static.SCAN_EXACT_DISTANCE ? this.name : '';
        let x = this.intensity_step > common.static.SCAN_EXACT_NAME ? this.x : 0;
        let y = this.intensity_step > common.static.SCAN_EXACT_NAME ? this.y : 0;
        return {
            type: this.type,
            id: this.id,
            name: name,
            distance: distance,
            intensity: this.intensity,
            x: x,
            y: y,
            exact_total: this.exact_total,
            exact_begin: this.exact_begin,
            exact_end: this.exact_end,
        }
    }
}

module.exports = ScanBeaconInfo;
