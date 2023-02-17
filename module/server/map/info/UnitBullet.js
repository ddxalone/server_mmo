const UnitBulletMap = require("./UnitBulletMap");
const common = require("../../../common");

/**
 * @callback callbackUnitBullet
 * @param {UnitBullet} unit_bullet
 */
/**
 * @class {UnitBullet}
 * @extends {UnitBulletMap}
 */
class UnitBullet extends UnitBulletMap {
    constructor() {
        super();
    }

    /**
     * 读取信息
     * @param unit_bullet
     * @returns {UnitBullet}
     */
    loadInfo(unit_bullet) {
        super.loadInfoMap(unit_bullet);

        this.setInit();

        return this;
    }

    pointerInfo(bullet_info) {
        // bullet_info.ship_grid_id && (this.ship_unit_info = this.map_grid_info.map_merge_info.getGridUnitInfo(bullet_info.ship_grid_id, bullet_info.ship_unit_type, bullet_info.ship_unit_id));
        bullet_info.target_grid_id && (this.target_unit_info = this.map_grid_info.map_merge_info.getGridUnitInfo(bullet_info.target_grid_id, bullet_info.target_unit_type, bullet_info.target_unit_id) || null);
    }

    /**
     * 开始爆炸
     */
    bulletBoomDraw() {
    }

    /**
     * 服务帧结算
     */
    bulletSettle() {
        if (this.getInit()) {
            this.setRun();
        }
        if (this.getRun()) {

        } else if (this.getDeath() && this.draw_less_frame <= 0) {
            this.bulletDead();
        }
    }

    /**
     * 服务帧结算
     */
    bulletDead() {
        this.map_grid_info.removeUnitInfo(this, common.static.MAP_FRAME_TYPE_DEAD);
    }

    getClientUnitBullet() {
        return {
            grid_id: this.grid_id,
            unit_group_id: this.unit_group_id,
            unit_id: this.unit_id,
            unit_type: this.unit_type,
            classify: this.classify,
            item_type: this.item_type,

            ship_unit_type: this.ship_unit_type,
            ship_unit_id: this.ship_unit_id,
            ship_force: this.ship_force,

            x: this.x,
            y: this.y,
            rotation: this.rotation,

            original_rotation: this.original_rotation,
            original_weapon_rotation: this.original_weapon_rotation,
            delay_frame: this.delay_frame,
            delay_pos: this.delay_pos,
            delay_total: this.delay_total,
            run_frame: this.run_frame,

            base_range: this.base_range,
            range: this.range,
            velocity: this.velocity,
            velocity_max: this.velocity_max,
            agile: this.agile,
            accelerate: this.accelerate,
            blast: this.blast,
            sustain: this.sustain,
            radius: this.radius,

            res: this.res,
            extra: this.extra,

            barrage: this.barrage,

            damage_electric: this.damage_electric,
            damage_thermal: this.damage_thermal,
            damage_explode: this.damage_explode,

            // target_grid_id: this.target_grid_id,
            target_unit_type: (this.target_unit_info && this.target_unit_info.unit_type) || 0,
            target_unit_id: (this.target_unit_info && this.target_unit_info.unit_id) || 0,

            move_point: this.move_point,
            move_rotation: this.move_rotation,

            birth_x: this.birth_x,
            birth_y: this.birth_y,
            // unit_status: this.unit_status,
            less_distance: this.less_distance,

            penetration_electric: this.penetration_electric,
            penetration_thermal: this.penetration_thermal,
            penetration_explode: this.penetration_explode,

            chain: this.chain,
            through: this.through,

            final_overload_per: this.final_overload_per,
            overhang_per: this.overhang_per,

            // boom_point : this.boom_point,
            // chain_boom_rotation:this.chain_boom_rotation,

            // draw_less_frame: this.draw_less_frame,

            last_boom_unit_type: this.last_boom_unit_type,
            last_boom_unit_id: this.last_boom_unit_id,

            last_chain_status: this.last_chain_status,

            additional_damage_status: this.additional_damage_status,

            loop_start_frame: this.bullet_extras.getPosInfo().loop_start_frame,
            loop_end_frame: this.bullet_extras.getPosInfo().loop_end_frame,
            repeat_start_frame: this.bullet_extras.getPosInfo().repeat_start_frame,
            repeat_end_frame: this.bullet_extras.getPosInfo().repeat_end_frame,
            // is_server: true,
            camp: this.camp,
        }
    }
}

module.exports = UnitBullet;

