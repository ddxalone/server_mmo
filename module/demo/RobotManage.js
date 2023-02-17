const m_demo = require(".");
const crypto = require("crypto");
const common = require("../common");
const Robot = require("./Robot");

class RobotManage {
    constructor() {
        //每间隔10帧创建一个角色
        this.player_num = 100;//2
        this.player_open_id = 'robot_';

        /**
         * @type {Object<number, Robot>}
         */
        this.players = {};
    }

    static instance() {
        if (RobotManage.m_instance == null) {
            RobotManage.m_instance = new RobotManage();
        }
        return RobotManage.m_instance;
    }

    run(server_frame) {
        //每间隔10帧创建一个角色
        // if (server_frame % 10 === 0) {
        //     let server_id = Math.floor(server_frame / 10);
        //     if (server_id > 0 && server_id <= this.player_num) {
        //         this.players[server_id] = new Robot(this.player_open_id, server_id, server_frame);
        //     }
        // }

        //同时创建10个角色
        if (server_frame === 30) {
            for (let append_open_id = 1; append_open_id <= this.player_num; append_open_id++) {
                let key = this.player_open_id + common.func.fillZero(append_open_id, 4);
                this.players[key] = new Robot(key, 1, server_frame);
            }
        }

        for (let key in this.players) {
            this.players[key].run(server_frame);
        }
    }
}

RobotManage.m_instance = null;

module.exports = RobotManage;
