export default class AcademicRequirement {
    constructor({
        id = null,
        position_id = null,
        academic_level_id = null,
        academic_level = {},
        academic_title = '',
        formation_status_id = null,
        formation_status = {}
    } = {}) {
        this.id = id;
        this.position_id = position_id;
        this.academic_level_id = academic_level_id;
        this.academic_level = academic_level;
        this.academic_title = academic_title;
        this.formation_status_id = formation_status_id;
        this.formation_status = formation_status;
    }
}