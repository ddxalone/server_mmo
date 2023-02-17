/**
 * 构建舰船数据脚本
 * @type {module:cluster}
 */
const cluster = require("cluster");
const fs = require("fs");
const canvas = require("canvas");
const path = require("path");
const common = require("../module/common");

let _startApp = () => {
    let arguments = process.argv.splice(2);
    console.log('startBuildShip...', arguments);

    //舰船一共6大类 小型巨型战舰有2种衍生 旗舰有1种衍生 共16种
    //每种族各一艘 抗性不同 槽位相同 武器系统加成不同
    let max_ship_type = {
        1: {
            name: '护卫舰',
            content: '护卫舰描述',
            shield: 1000,//护盾
            armor: 1000,//装甲
            speed: 1000,//速度
            radius: 100,//半径
            agile: 100,//灵敏
            power: 100,//能量
            capacity: 100,//电容
            // weapon: 2,//武器槽位
            // active: 2,//主动槽位
            // passive: 2,//被动槽位
            shield_electric: 20,
            shield_thermal: 20,
            shield_explode: 20,
            armor_electric: 20,
            armor_thermal: 20,
            armor_explode: 20,
            //技能加成
            skills: {
                energy: 0.01
            },
            weapon: [
                {
                    x: 100,
                    y: 100,
                },
            ]
        }
    };
    for (let ship_type = 1; ship_type <= max_ship_type; ship_type++) {

    }

    function makeShip() {

    }

    function makeStep() {

    }
};

if (cluster.isMaster) {
    _startApp();
}
