const fs = require("fs");
const path = require("path");
const m_server = require("../server");

class File {
    constructor() {

    }

    static instance() {
        if (File.m_instance == null) {
            File.m_instance = new File();
        }
        return File.m_instance;
    }

    /**
     * 输出星系信息
     * @param world_index_galaxy_list
     */
    outputGalaxyFile(world_index_galaxy_list) {
        let galaxy_db_field = m_server.ServerGalaxyInfoDao.db_field;
        let galaxy_list = [];
        for (let galaxy_id in world_index_galaxy_list) {
            let galaxy_info = [];
            for (let param in galaxy_db_field) {
                galaxy_info.push(world_index_galaxy_list[galaxy_id].dao[param]);
            }
            galaxy_list.push(galaxy_info);
        }
        fs.writeFileSync(path.resolve(__dirname, '../../../admin_mmo/public/data/world_galaxy.json'), JSON.stringify(galaxy_list));
    }

    /**
     * 输出空间站信息
     * @param world_index_station_list
     */
    outputStationFile(world_index_station_list) {
        let station_db_field = m_server.ServerStationInfoDao.db_field;
        let station_list = [];
        for (let station_id in world_index_station_list) {
            let station_info = [];
            for (let param in station_db_field) {
                station_info.push(world_index_station_list[station_id].dao[param]);
            }
            station_list.push(station_info);
        }
        fs.writeFileSync(path.resolve(__dirname, '../../../admin_mmo/public/data/world_station.json'), JSON.stringify(station_list));
    }
}

File.m_instance = null;

module.exports = File;
