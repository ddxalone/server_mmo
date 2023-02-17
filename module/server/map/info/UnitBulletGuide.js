const UnitBullet = require("./UnitBullet");

/**
 * @class {UnitBulletGuide}
 * @extends {UnitBullet}
 */
class UnitBulletGuide extends UnitBullet {
    constructor() {
        super();
    }

    /**
     * 弹药动作
     */
    bulletAi() {
        if (this.useDelayFrame()) {
            this.run_frame++;
            this.checkTargetValid();
            //未触发连锁 才调整角度
            if (this.last_chain_status === false) {
                let pos_info = this.bullet_extras
                    .getExtraRunPosInfo(this.run_frame);

                //弹药转身
                this.addBulletRotation(pos_info);
                //弹药加速
                this.addBulletSpeed(pos_info);
            } else {
                this.addBulletSpeed();
            }
            //更新移动坐标
            this.updateMovePoint();
            //检测爆炸
            this.checkExplode();
            //执行爆炸
            // this.handleExplode();
            this.bulletRunAction();
            //弹药必须运行一次后再执行初始化
            // this.initDraw();
        }

    }
}

module.exports = UnitBulletGuide;
