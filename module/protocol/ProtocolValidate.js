const m_protocol = require(".");
const common = require("../common");

/**
 * @class {ProtocolValidate}
 */
class ProtocolValidate {
    constructor() {
    }

    static instance() {
        if (ProtocolValidate.m_intance == null) {
            ProtocolValidate.m_intance = new ProtocolValidate();
        }
        return ProtocolValidate.m_intance;
    }

    /**
     * 验证器参数验证
     * @param player_uuid
     * @param protocol_body
     * @returns {boolean}
     */
    validate(player_uuid, protocol_body) {
        //协议key必须存在
        if (protocol_body.hasOwnProperty('protocol')) {
            //协议key的值不能为0 且<10000 且必须存在
            if (protocol_body.protocol
                && protocol_body.protocol < common.setting.protocol_cut
                && common.protocol.list.hasOwnProperty(protocol_body.protocol)
            ) {
                let protocol_fun = new common.protocol.list[protocol_body.protocol]();
                for (let key in protocol_fun) {
                    if (protocol_fun.hasOwnProperty(key) && protocol_body.hasOwnProperty(key)) {
                        if (this.paramsValidate(key, protocol_body[key]) === false) {
                            console.log('validate fail', key, protocol_body[key]);
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    /**
     * 验证器数值验证
     * @param key
     * @param param
     * @returns {boolean}
     */
    paramsValidate(key, param) {
        switch (key) {
            case 'item_ids':
                return Array.isArray(param);
            case 'random':
            case 'ticket':
            case 'platform':
            case 'open_id':
                break;
            case 'extra': {
                return typeof param === 'object';
            }
            default:
                return typeof param === 'number';
        }
        return true;
    }
}

ProtocolValidate.m_intance = null;

module.exports = ProtocolValidate;
