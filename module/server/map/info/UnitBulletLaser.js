const UnitBullet = require("./UnitBullet");
const common = require("../../../common");

/**
 * @class {UnitBulletLaser}
 * @extends {UnitBullet}
 */
class UnitBulletLaser extends UnitBullet {
    constructor() {
        super();
        /**
         * @type {Object<number, LaserPoint>}
         */
        // this.laser_points = {};
        //虚拟激光第一帧的帧数
        // this.start_run_frame = 1;
    }

    /**
     * 弹药动作
     */
    bulletAi() {
        if (this.useDelayFrame()) {
            this.run_frame++;
            this.checkLaser();

            // this.initDraw();
        }
    }

    checkLaser() {
        //激光先设定全速
        this.velocity = this.velocity_max;
        this.updateAddSpeed();
        //生成路径点
        this.initLaserPoints();

        //如果仍然活着 强制爆炸
        // if (this.getRun()) {
        //     this.beginBoom();
        // }
    }

    /**
     * 获取激光路径点 直接计算命中
     */
    initLaserPoints() {
        let run_frame = 1;
        //虚拟的贯穿状态 如果不是贯穿第一帧 改为false
        let map_frame_through_status = false;
        while (true) {
            //触发了连锁 或 贯穿的非第一帧 不会改变模型
            if (this.last_chain_status === false && map_frame_through_status === false) {
                let pos_info = this.bullet_extras
                    .getExtraRunPosInfo(run_frame);
                //如果激光速度或者角度被更改(通过速度和角度控制激光长度和方向)
                this.addBulletRotation(pos_info);

                this.addBulletSpeed(pos_info);
            }

            this.checkExplode();

            //如果此时弹药死亡了 则说明击中人了
            if (this.getDeath()) {
                //获取当前点 到爆炸点的距离 修正速度 即渲染长度
                // let distance = common.func.getDistance(this.x, this.y, this.boom_point.x, this.boom_point.y);
                // this.velocity = distance * this.base_server_frame;
                // this.laser_points.push(this.initLaserPoint());
                break;
            }

            //重置贯穿状态
            map_frame_through_status = false;

            //在这里处理连锁
            if (this.map_frame_chain_status) {
                //创建连锁折点信息
                let distance = common.func.getDistance(this.x, this.y, this.boom_point.x, this.boom_point.y);
                //修正速度为当前坐标到爆炸坐标的距离
                this.velocity = distance * this.base_server_frame;
                this.updateAddSpeed();
                this.updateLessDistance(this.less_distance - this.map_add_speed);

                // this.laser_points.push(this.initLaserPoint());

                //更新弹药连锁后数据
                this.x = this.boom_point.x;
                this.y = this.boom_point.y;

                //连锁之后不再改变方向 调整速度为最大 调整角度为连锁角度
                this.rotation = this.chain_boom_rotation;
                this.velocity = this.velocity_max;
                this.updateAddSpeed();
            } else if (this.map_frame_through_status) {
                //贯穿思路 虚拟一个弹药击中目标后 继续按照原路径飞行 方向不调整 只调整速度为剩余的距离
                //一直到此帧结束 且 跳过帧修改位置阶段
                //考虑了半天 实在没法一次性 爆炸2次或多次 整个逻辑不支持
                //在这里处理贯穿

                //击中目标了 则说明剩余运行距离一定小于本帧要运行的距离 所以激光长度不用截断(修正)
                //直接新增渲染完整的帧内的激光模型
                // 不行如果一帧内贯穿的第二次 是要截断模型的

                //创建贯穿新起点信息
                let distance = common.func.getDistance(this.x, this.y, this.boom_point.x, this.boom_point.y);
                //计算剩余的速度 = 原速度-旧速度
                let less_velocity = this.velocity - distance * this.base_server_frame;
                this.velocity = distance * this.base_server_frame;
                this.updateAddSpeed();
                this.updateLessDistance(this.less_distance - this.map_add_speed);
                // this.laser_points.push(this.initLaserPoint());

                //更新弹药贯穿后数据
                this.x = this.boom_point.x;
                this.y = this.boom_point.y;

                //调整贯穿后的新速度 重新运行一帧
                this.velocity = less_velocity;
                this.updateAddSpeed();

                //下一帧不处理extra路线更改
                map_frame_through_status = true;
            } else {
                if (this.less_distance <= this.map_add_speed) {
                    //如果剩余距离过短修正渲染距离
                    // this.velocity = this.less_distance * this.base_server_frame;
                    // this.updateAddSpeed();
                    // this.laser_points.push(this.initLaserPoint());
                    this.setDeath();
                    break;
                }

                this.updateLessDistance(this.less_distance - this.map_add_speed);

                // this.laser_points.push(this.initLaserPoint());

                let next_point = common.func.anglePoint(this.x, this.y, this.rotation, this.map_add_speed);
                this.x = next_point.x;
                this.y = next_point.y;

                run_frame++;
            }

        }
    }
}

module.exports = UnitBulletLaser;
