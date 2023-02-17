const General = require("./General");
const common = require("../common");

class DemoManage {
    static instance() {
        if (DemoManage.m_instance == null) {
            DemoManage.m_instance = new DemoManage();
        }
        return DemoManage.m_instance;
    }

    run() {
        let arr = {
            1: {'id': 1},
            2: {'id': 2},
            3: {'id': 3},
        }

        // for (let i = 0; i < 10000000; i++) {
        //     for (let type in arr) {
        //         let info = arr[type];
        //     }
        // }
        //
        // dd('end')
        // for (let i = 0; i < 10000000; i++) {
        //     for (let info of Object.values(arr)) {
        //     }
        // }
        //
        // dd('end')

        for (let i = 0; i < 10000000; i++) {
            Object.values(arr).map((info) => {
            }, this)
        }


        dd('end');

        // General.testWarpTime();
        // dd();
        // General.testDropQuality()
        // General.randomGalaxy()
        // General.testCallback()
        // General.testMassRatioAndWarpFrame();
        // General.testGalaxyDistance();
        // General.testThruster();
        // General.testgetNaturalRecovery();
        // General.testPosRatio();
        // General.bullet_delay();
        // General.testMap();

        // process.exit();
        // m_demo.general.distance();
        // m_demo.general.separate();
        // m_demo.general.copy();
        // m_demo.general.sort();
        // m_demo.general.angle();
        // m_demo.general.data();
        // m_demo.general.boom_point();
        // m_demo.general.name();
        // m_demo.general.time();
        // m_demo.general.warp();
        //未来测一下 调用本类的变量 和调用其他类的变量 性能能差多少


        // dd(common.func.anglePoint(0, 0, 15494, 5000));

        // let x = -2118;
        // let y = -4529;
        // dd(common.func.getDistance(x, y, 0, 0));

    }
}

DemoManage.m_instance = null;

module.exports = DemoManage;
