const common = require("./index");

class Func {
    constructor() {
        this.draw_ratio = common.setting.draw_ratio;

        this.server_run_time = new Date().getTime();
    }

    static instance() {
        if (Func.m_instance == null) {
            Func.m_instance = new Func();
        }
        return Func.m_instance;
    }


    /**
     * 判断是否为json
     * @param str
     * @returns {boolean}
     */
    isJson(str) {
        try {
            JSON.parse(str);
            return str.indexOf('{') > -1;
        } catch (e) {
            return false;
        }
    }

    /**
     * 获取服务器时间戳
     * @return {number}
     */
    getUnixTime() {
        return Date.parse(new Date().toString()) / 1000;
    }

    /**
     * 获取毫秒时间戳
     * @returns {number}
     */
    getUnixMTime() {
        return new Date().getTime();
    }

    /**
     * 获取随机数
     * @param min
     * @param max
     * @returns {number}
     */
    getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * 获取随机角度
     */
    getRandRotation() {
        return this.getRand(0, 35999);
    }

    /**
     * 获取2点距离
     * @param start_x
     * @param start_y
     * @param end_x
     * @param end_y
     * @returns {number}
     */
    getDistance(start_x, start_y, end_x, end_y) {
        return Math.ceil(Math.sqrt(Math.pow(end_x - start_x, 2) + Math.pow(end_y - start_y, 2)));
    };

    /**
     * 获取敌方单位半径的逻辑距离
     * @param unit_info
     * @param target_unit_info
     */
    getUnitDistance(unit_info, target_unit_info) {
        return Math.max(this.getDistance(unit_info.x, unit_info.y, target_unit_info.x, target_unit_info.y) - target_unit_info.radius * this.draw_ratio);
    }

    /**
     * 获取大角度
     * @param start_x
     * @param start_y
     * @param end_x
     * @param end_y
     * @returns {number}
     */
    getAngle(start_x, start_y, end_x, end_y) {
        //Y轴要反着算 公式是 上X大 下X小   而像素是上X小 下X大
        return this.formatAngle(Math.atan2(end_x - start_x, start_y - end_y) / Math.PI * 180 * this.draw_ratio);
    }

    /**
     * 获取-180-180的角
     * @param start_x
     * @param start_y
     * @param end_x
     * @param end_y
     * @returns {number}
     */
    getRatAngle(start_x, start_y, end_x, end_y) {
        return this.formatRatAngle(Math.atan2(end_x - start_x, start_y - end_y) / Math.PI * 180 * this.draw_ratio);
    }

    /**
     * 根据一个点 角度 距离 计算终点坐标 初始角度12点 顺时针转
     * @param x
     * @param y
     * @param angle
     * @param range
     * @returns {{x: *, y: *}}
     */
    anglePoint(x, y, angle, range) {
        if (range) {
            let radian = this.angleToRadian(angle);
            return {
                x: Math.round(x + Math.sin(radian) * range),
                y: Math.round(y - Math.cos(radian) * range),
            };
        } else {
            return {
                x: x,
                y: y,
            };
        }
    }

    /**
     * 大角度转弧度
     * @param angle
     * @returns {number}
     */
    angleToRadian(angle) {
        return angle / this.draw_ratio * Math.PI / 180;
    }

    /**
     * 弧度转大角度
     * @param radian
     * @returns {number}
     */
    radianToAngle(radian) {
        return this.formatAngle(radian / Math.PI * 180 * this.draw_ratio);
    }

    /**
     * 返回一个0-35999的度数
     * @param angle
     * @param big
     * @returns {number}
     */

    formatAngle(angle) {
        let ret_angle = angle % 36000;
        return Math.round(ret_angle < 0 ? ret_angle + 36000 : ret_angle);
    }

    /**
     * 返回一个-18000-17999的度数
     * @param angle
     * @returns {number}
     */
    formatRatAngle(angle) {
        let ret_angle = this.formatAngle(angle);
        return ret_angle >= 18000 ? ret_angle - 36000 : ret_angle;
    }

    /**
     * @param number
     * @returns {number}
     */
    formatNumber(number) {
        return Math.floor(number);
    }

    /**
     * 数字前补0
     * @param number
     * @param bit
     * @returns {string}
     */
    fillZero(number, bit) {
        return (Array(bit).join('0') + number).slice(-bit);
    }

    Point(x = 0, y = 0) {
        return {x: x, y: y};
    }

    /**
     * 过滤遍历对象
     * @param filter
     * @param object
     * @param callback
     * @param thisObj
     */
    filterEachObject(filter, object, callback, thisObj) {
        if (filter) {
            for (let value of Object.values(object)) {
                if (filter(value)) {
                    callback && callback.call(thisObj, value);
                }
            }
        } else {
            for (let value of Object.values(object)) {
                callback && callback.call(thisObj, value);
            }
        }
    }

    /**
     * 根据坐标获取块图的key
     * @param x
     * @param y
     * @returns {number}
     */
    getMapKey(x, y) {
        let keyX = Math.floor(x / common.setting.base_map_block_max_size) + common.setting.base_map_block_number / 2;
        let keyY = Math.floor(y / common.setting.base_map_block_max_size) + common.setting.base_map_block_number / 2;
        return this.getMapKeyPoint(keyX, keyY);
    }

    /**
     * 返回块图key
     * @param keyX
     * @param keyY
     * @returns {number}
     */
    getMapKeyPoint(keyX, keyY) {
        // return this.fillZero(keyY, 2) + '_' + this.fillZero(y, 2);
        return keyX * common.setting.base_map_block_number + keyY;
    }

    /**
     * 获取周边块图
     * @param x
     * @param y
     * @returns {array}
     */
    getNearMapKeyList(x, y) {
        let list = [];
        let block_number = common.setting.base_map_block_number;
        let block_range = common.setting.base_map_block_range;

        let keyX = Math.floor(x / common.setting.base_map_block_max_size) + block_number / 2;
        let keyY = Math.floor(y / common.setting.base_map_block_max_size) + block_number / 2;
        for (let x = Math.max(keyX - block_range, 0); x <= Math.min(keyX + block_range, block_number); x++) {
            for (let y = Math.max(keyY - block_range, 0); y <= Math.min(keyY + block_range, block_number); y++) {
                list.push(common.func.getMapKeyPoint(x, y));
            }
        }
        return list;
    }

    //获取最近一次周几的24点 周日为7周一为1
    getThisWeekUnixTime(week = 7) {
        week = week ? week : 7;
        let nowDate = new Date();
        let nowWeek = nowDate.getDay() ? nowDate.getDay() : 7;
        //计算传入的周几距离今天几天
        let AddDate = week - nowWeek + 1;
        (week < nowWeek) && (AddDate += 7);
        //今天0点的时间
        return Date.parse((new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0)).toString()) / 1000 + AddDate * 86400;
    }

    //获取最近一次24点的时间戳
    getThisDayUnixTime() {
        let nowDate = new Date();
        return Date.parse((new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0)).toString()) / 1000 + 86400;
    }

    //获取最近一次整点的时间戳
    getThisHourUnixTime() {
        let nowDate = new Date();
        return Date.parse((new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), 0, 0)).toString()) / 1000 + 3600;
    }

    //获取当前小时数
    getThisHour() {
        return new Date().getHours();
    }

    //获取当前分钟数
    getThisMinutes() {
        return new Date().getMinutes();
    }

    //获取当前秒数
    getThisSeconds() {
        return new Date().getSeconds();
    }

    /**
     * 获取死亡空间刷新的势力范围
     * @param force
     * @returns {number[]}
     */
    getRefreshDeadForce(force) {
        //高安的死亡 刷新在另外两族高安和另外两族中立的区域 和 敌对海盗势力
        //中立的死亡 刷新在另外两族中立和本族高安 和 敌对海盗势力
        //海盗的死亡 刷在本地和敌对的高安或中立势力
        // switch (force) {
        //     case 1:
        //         return [2, 3, 5, 6, 7];
        //     case 2:
        //         return [1, 3, 4, 6, 8];
        //     case 3:
        //         return [1, 2, 4, 5, 9];
        //     case 4:
        //         return [1, 5, 6, 7];
        //     case 5:
        //         return [2, 4, 6, 8];
        //     case 6:
        //         return [3, 5, 6, 9]
        //     case 7:
        //         return [1, 4, 7];
        //     case 8:
        //         return [2, 5, 8];
        //     case 9:
        //         return [2, 5, 8];
        // }
        switch (force) {
            case 1:
            case 4:
            case 7:
                return [1, 4, 7];
            case 2:
            case 5:
            case 8:
                return [2, 5, 8];
            case 3:
            case 6:
            case 9:
                return [3, 6, 9];
        }
    }

    /**
     * 获取任务空间刷新的势力
     * @param force
     * @returns {number[]}
     */
    getSearchTaskForce(force) {
        //TODO 测试数据
        switch (force) {
            case 1:
                return [7, 7, 7, 8, 9];
            case 4:
                return [7, 7, 8, 9];
            case 2:
                return [8, 8, 8, 7, 9];
            case 5:
                return [8, 8, 7, 9];
            case 3:
                return [9, 9, 9, 7, 8];
            case 6:
                return [9, 9, 7, 8];
            case 7:
                return [1, 1, 4, 4, 2, 3, 5, 6];
            case 8:
                return [2, 2, 5, 5, 1, 3, 4, 6];
            case 9:
                return [3, 3, 6, 6, 1, 2, 4, 5];
        }
    }

    shipDropItem(pos, item_type, count) {
        return {
            pos: pos,
            item_type: item_type,
            count: count,
        }
    }

    logMerge(name, map_merge_info) {
        const fs = require("fs");
        const path = require("path");


        let cache = [];
        let str = JSON.stringify(map_merge_info, function (key, value) {
            if (key === 'map_frame_status'
                || key === 'target_info'
                || key === 'player_uuid'
                || key === 'frame_action'
                || key === 'active_list'
                || key === 'passive_list'
                || key === 'map_key'
                || key === 'base_unit_type'
                || key === 'template_unit_id'
                || key === 'extra'
                || key === 'online'
                || key === 'player_info'
                || key === 'frame_actions'
                || key === 's2cMapFrameFull'
                || key === 's2cMapFrame'
                || key === 'move_distance'
                || key === 'warp_target_id'
                || key === 'warp_target_point'
                || key === 'map_frame_move_merge'
                || key === 'birth_point'
            ) {
                return;
            }

            if (key === 'target_unit_info'

            ) {
                if (value !== null) {
                    return 'has object';
                }
            }
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return 'object';
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, "  ");
        cache = null; // Enable garbage collection
        fs.writeFileSync(path.resolve(__dirname, '../../logs/' + name + '.json'), str);

    }

    fff(color, ...args) {
        let styles = {
            'bold': ['\x1B[1m', '\x1B[22m'],
            'italic': ['\x1B[3m', '\x1B[23m'],
            'underline': ['\x1B[4m', '\x1B[24m'],
            'inverse': ['\x1B[7m', '\x1B[27m'],
            'strikethrough': ['\x1B[9m', '\x1B[29m'],
            'white': ['\x1B[37m', '\x1B[39m'],
            'grey': ['\x1B[90m', '\x1B[39m'],
            'black': ['\x1B[30m', '\x1B[39m'],
            'blue': ['\x1B[34m', '\x1B[39m'],
            'cyan': ['\x1B[36m', '\x1B[39m'],
            'green': ['\x1B[32m', '\x1B[39m'],
            'magenta': ['\x1B[35m', '\x1B[39m'],
            'red': ['\x1B[31m', '\x1B[39m'],
            'yellow': ['\x1B[33m', '\x1B[39m'],
            'whiteBG': ['\x1B[47m', '\x1B[49m'],
            'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
            'blackBG': ['\x1B[40m', '\x1B[49m'],
            'blueBG': ['\x1B[44m', '\x1B[49m'],
            'cyanBG': ['\x1B[46m', '\x1B[49m'],
            'greenBG': ['\x1B[42m', '\x1B[49m'],
            'magentaBG': ['\x1B[45m', '\x1B[49m'],
            'redBG': ['\x1B[41m', '\x1B[49m'],
            'yellowBG': ['\x1B[43m', '\x1B[49m']
        };

        let color_str = styles[color] ? styles[color][0] + '%s' + styles[color][1] : '\x1B[31m%s\x1B[39m';
        // console.log(color_str, (new Error()).stack.split("\n")[2].trim(), '\n', 'time:' + (new Date().getTime() - common.func.server_run_time), '\n', ...args);
        console.log(color_str, (new Error()).stack.split("\n")[2].trim(), '\n', ...args);
    }

    tt(...args) {
        let color_str = '\x1B[31m%s\x1B[39m';
        console.log(color_str, new Error(), '\n', ...args);
    }

    ff(...args) {
        // console.log((new Error()).stack.split("\n")[2].trim().replace(/.*at (.*) \(.*\\(.*)\)/i,"$1 => $2"), '\n', ...args);
        // console.log((new Error()).stack.split("\n")[2].trim(), '\n', 'time:' + (new Date().getTime() - common.func.server_run_time), '\n', ...args);
        console.log((new Error()).stack.split("\n")[2].trim(), '\n', ...args);
    }

    ffa(...args) {
        let data = (new Error()).stack.split("\n");
        let pos = 0;
        for (let datum of data) {
            if (pos > 1) {
                console.log(datum.trim());
            }

            pos++;
        }
        console.log('\n', ...args);
    }

    dd(...args) {
        // console.log((new Error()).stack.split("\n")[2].trim().replace(/.*at (.*) \(.*\\(.*)\)/i,"$1 => $2"), '\n', ...args);
        // console.log((new Error()).stack.split("\n")[2].trim(), '\n', 'time:' + (new Date().getTime() - common.func.server_run_time), '\n', ...args);
        console.log((new Error()).stack.split("\n")[2].trim(), '\n', ...args);
        process.exit();
    }

    ddf(...args) {
        console.log(JSON.stringify(args, null, 4));
        process.exit();
    }

    ffd(args) {
        let new_args = {};
        for (let pos in args) {
            if (args.hasOwnProperty(pos)) {
                if (typeof args[pos] !== 'object') {
                    new_args[pos] = args[pos];
                }
            }
        }
        console.log((new Error()).stack.split("\n")[2].trim(), '\n', new_args);
    }
    /**
     * 打印不继承属性的单个单位
     * @param args
     */
    ddd(args) {
        let new_args = {};
        for (let pos in args) {
            if (args.hasOwnProperty(pos)) {
                if (typeof args[pos] !== 'object') {
                    new_args[pos] = args[pos];
                }
            }
        }
        console.log((new Error()).stack.split("\n")[2].trim(), '\n', new_args);
        process.exit();
    }
}

Func.m_instance = null;

module.exports = Func;
