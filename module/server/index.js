exports.HttpControl = require('./main/HttpControl').instance();
exports.ServerBaseDead = require('./main/ServerBaseDead').instance();
exports.ServerBaseTask = require('./main/ServerBaseTask').instance();
exports.ServerBaseItem = require('./main/ServerBaseItem').instance();
exports.ServerBaseShip = require('./main/ServerBaseShip').instance();
exports.ServerBaseSkill = require('./main/ServerBaseSkill').instance();
exports.ServerBaseForce = require('./main/ServerBaseForce').instance();
exports.ServerBaseTemplate = require('./main/ServerBaseTemplate').instance();
exports.ServerDbManage = require('./main/ServerDbManage').instance();
exports.ServerList = require('./main/ServerList').instance();
exports.ServerMain = require('./main/ServerMain').instance();
exports.ServerManage = require('./main/ServerManage').instance();
exports.ServerParam = require('./main/ServerParam').instance();
exports.ServerUniverse = require('./main/ServerUniverse').instance();
exports.ServerBaseLevel = require('./main/ServerBaseLevel').instance();

exports.DropService = require('./world/DropService').instance();
exports.PriceService = require('./world/PriceService').instance();
exports.ServerWorldPlayer = require('./world/ServerWorldPlayer').instance();
exports.ServerWorldBlock = require('./world/ServerWorldBlock').instance();
exports.ServerWorldDead = require('./world/ServerWorldDead').instance();
exports.ServerWorldTask = require('./world/ServerWorldTask').instance();
exports.ServerWorldItem = require('./world/ServerWorldItem').instance();
exports.ServerWorldBlueprint = require('./world/ServerWorldBluprint').instance();
exports.ServerWorldProduct = require('./world/ServerWorldProduct').instance();
exports.ServerWorldManage = require('./world/ServerWorldManage').instance();
exports.ServerWorldShip = require('./world/ServerWorldShip').instance();
exports.ServerWorldSkill = require('./world/ServerWorldSkill').instance();
exports.ServerWorldStation = require('./world/ServerWorldStation').instance();
exports.ServerWorldScan = require('./world/ServerWorldScan').instance();
exports.WorldProcess = require('./world/WorldProcess').instance();

exports.MapProcess = require('./map/MapProcess').instance();
exports.ProtocolMap = require('./map/ProtocolMap').instance();
exports.ProtocolWorld = require('./world/ProtocolWorld').instance();
exports.ServerMapBlock = require('./map/ServerMapBlock').instance();
exports.ServerMapManage = require('./map/ServerMapManage').instance();
exports.ServerMapMerge = require('./map/ServerMapMerge').instance();
exports.ServerMapPlayer = require('./map/ServerMapPlayer').instance();
exports.ServerMapUnit = require('./map/ServerMapUnit').instance();


exports.BaseAttributeDao = require('./main/dao/BaseAttributeDao').instance();
exports.BaseDeadDao = require('./main/dao/BaseDeadDao').instance();
exports.BaseTaskDao = require('./main/dao/BaseTaskDao').instance();
exports.BaseItemInfoDao = require('./main/dao/BaseItemInfoDao').instance();
exports.BaseItemModuleDao = require('./main/dao/BaseItemModuleDao').instance();
exports.BaseItemSuitDao = require('./main/dao/BaseItemSuitDao').instance();
exports.BaseItemWeaponDao = require('./main/dao/BaseItemWeaponDao').instance();
exports.BaseNpcerWeaponDao = require('./main/dao/BaseNpcerWeaponDao').instance();
exports.BaseShipNpcerDao = require('./main/dao/BaseShipNpcerDao').instance();
exports.BaseShipPlayerDao = require('./main/dao/BaseShipPlayerDao').instance();
exports.BaseSkillDao = require('./main/dao/BaseSkillDao').instance();
exports.BaseForceDao = require('./main/dao/BaseForceDao').instance();
exports.BaseTemplateDao = require('./main/dao/BaseTemplateDao').instance();
exports.BaseTemplatePlanDao = require('./main/dao/BaseTemplatePlanDao').instance();
exports.BaseTemplateStepDao = require('./main/dao/BaseTemplateStepDao').instance();
exports.ServerListDao = require('./main/dao/ServerListDao').instance();
exports.ServerParamDao = require('./main/dao/ServerParamDao').instance();
exports.ServerLevelDao = require('./main/dao/BaseLevelDao').instance();

exports.ServerGalaxyInfoDao = require('./world/dao/ServerGalaxyInfoDao').instance();
exports.ServerPlanetInfoDao = require('./world/dao/ServerPlanetInfoDao').instance();
exports.ServerStationInfoDao = require('./world/dao/ServerStationInfoDao').instance();
exports.ServerDeadInfoDao = require('./world/dao/ServerDeadInfoDao').instance();
