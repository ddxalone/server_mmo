exports.PlayerList = require('./PlayerList').instance();
exports.PlayerAction = require('./PlayerAction').instance();
exports.PlayerAccount = require('./PlayerAccount').instance();
exports.PlayerEmitter = require('./PlayerEmitter').instance();
exports.ProtocolLogin = require('./ProtocolLogin').instance();
exports.WarpService = require('./WarpService').instance();
// exports.AccountInfo = require('./info/AccountInfo');
// exports.PlayerInfo = require('./info/PlayerInfo');
// exports.PlayerExtra = require('./info/PlayerExtra');
// exports.PlayerShip = require('./info/PlayerShip');
// exports.PlayerItem = require('./info/PlayerItem');
// exports.C2SAccountLogin = require('./protocol/C2SAccountLogin');
// exports.C2SPlayerLogin = require('./protocol/C2SPlayerLogin');
// exports.S2CAccountLogin = require('./protocol/S2CAccountLogin');
// exports.S2CPlayerLogin = require('./protocol/S2CPlayerLogin');
// exports.S2CPlayerLogout = require('./protocol/S2CPlayerLogout');
// exports.S2CPlayerInfo = require('./protocol/S2CPlayerInfo');

exports.AccountInfoDao = require('./dao/AccountInfoDao').instance();
exports.PlayerInfoDao = require('./dao/PlayerInfoDao').instance();
exports.PlayerExtraDao = require('./dao/PlayerExtraDao').instance();
exports.PlayerShipDao = require('./dao/PlayerShipDao').instance();
exports.PlayerItemDao = require('./dao/PlayerItemDao').instance();
exports.PlayerBlueprintDao = require('./dao/PlayerBlueprintDao').instance();
exports.PlayerProductDao = require('./dao/PlayerProductDao').instance();
exports.PlayerSkillDao = require('./dao/PlayerSkillDao').instance();
exports.PlayerTaskDao = require('./dao/PlayerTaskDao').instance();
exports.PlayerRenownDao = require('./dao/PlayerRenownDao').instance();
exports.LogLoginDao = require('./dao/LogLoginDao').instance();
