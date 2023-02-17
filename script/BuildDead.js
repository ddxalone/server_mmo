/**
 * 构建地图数据脚本
 * @type {module:cluster}
 */
const cluster = require("cluster");
const fs = require("fs");
const canvas = require("canvas");
const path = require("path");
const common = require("../module/common");

let _startApp = () => {
    let arguments = process.argv.splice(2);
    console.log('startBuildDead...', arguments);
    // 所有的死亡以首次进入为开始点
    // 击杀敌舰为触发点
    // boss血量减少也需要触发 ??? 会导致怪物变多 耗费性能还是让boss最后出现吧

    // 击杀特定舰船或建筑
    // 空间内舰船少于N
    // 某类型敌舰小于0

    // 死亡空间类型
    // 1杀怪 触发下一步 杀boss完成

    // 舰船出场方式
    // 1已经存在
    // -- 2从建筑下出现
    // 3折跃入场

    // 难度
    let max_dead_type = 1;
    let max_difficulty = 1;
    let max_step = 5;

    makeDead();

    /**
     * 获取死亡空间阶段数量
     * @returns {number}
     */
    function getDeadMaxStep() {
        return max_step;
    }

    /**
     * 获取舰船组合
     */
    function getShipGroup() {
        return {}
    }

    function getShowType() {
        return 1;
    }

    function makeDead() {
        let max_step = getDeadMaxStep();
        for (let step = 1; step <= max_step; step++) {
            makeStep();
        }
    }

    function makeStep() {

    }
};

if (cluster.isMaster) {
    _startApp();
}
