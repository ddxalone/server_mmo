/**
 * 玩家列表
 */
class PlayerList {
    constructor() {
        /**
         * @type {Object<number, PlayerInfo>}
         */
        this.player_list = {};
    }

    static instance() {
        if (PlayerList.m_instance == null) {
            PlayerList.m_instance = new PlayerList();
        }
        return PlayerList.m_instance;
    }

    /**
     * 追加用户信息到列表
     * @param {PlayerInfo} player_info
     */
    addPlayerToList(player_info) {
        this.player_list[player_info.player_id] = player_info;
    }

    /**
     * 获取用户信息
     * @param player_id
     * @returns {PlayerInfo}
     */
    getPlayerInfo(player_id) {
        return this.player_list[player_id];
    }

    /**
     * 检测用户是否存在
     * @param player_id
     * @returns {boolean}
     */
    checkPlayerInfoExist(player_id) {
        return !!this.player_list[player_id];
    }

    /**
     * 遍历玩家信息
     * @param {callbackPlayerInfo} callback
     * @param thisObj
     */
    eachPlayerInfo(callback, thisObj) {
        for (let player_info of Object.values(this.player_list)) {
            callback && callback.call(thisObj, player_info);
        }
    }
}

PlayerList.m_instance = null;

module.exports = PlayerList;
