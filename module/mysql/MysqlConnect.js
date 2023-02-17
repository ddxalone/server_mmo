class MysqlConnect {
    static instance() {
        if (MysqlConnect.m_instance == null) {
            MysqlConnect.m_instance = new MysqlConnect();
        }
        return MysqlConnect.m_instance;
    }
}

MysqlConnect.m_instance = null;

module.exports = MysqlConnect;
