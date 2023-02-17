let events = require("events");

/**
 * @class {ProtocolEmitter}
 */
class ProtocolEmitter {
    constructor() {
        /**
         * @type {events.EventEmitter}
         */
        this.emitter = null;
    }

    static instance() {
        if (ProtocolEmitter.m_instance == null) {
            ProtocolEmitter.m_instance = new ProtocolEmitter();
        }
        return ProtocolEmitter.m_instance;
    }

    /**
     * 初始化emitter服务
     * @returns {boolean}
     */
    initEmitter() {
        this.emitter = new events.EventEmitter();
        return true;
    }

    /**
     * 获取emitter服务
     * @return {events.EventEmitter}
     */
    getEmitter() {
        return this.emitter;
    }
}

ProtocolEmitter.m_instance = null;

module.exports = ProtocolEmitter;
