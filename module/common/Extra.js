class Extra {
    constructor(props) {
        this.EXTRA_LEVEL = '01';//等级
        this.EXTRA_EXP = '02';//经验
        this.EXTRA_SKILL_POINTS = '03';//技能点
    }

    static instance() {
        if (Extra.m_instance == null) {
            Extra.m_instance = new Extra();
        }
        return Extra.m_instance;
    }
}

Extra.m_instance = null;

module.exports = Extra;
