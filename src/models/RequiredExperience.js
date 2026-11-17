export default class RequiredExperience {
    constructor({
        id = null,
        position_id = null,
        name = '',
        duration_months = 0,
        description = '',
    } = {}) {
        this.id = id;
        this.position_id = position_id;
        this.name = name;
        this.duration_months = duration_months;
        this.description = description;
    }
}