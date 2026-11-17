export default class RequiredSkill {
    constructor({
        id = null,
        position_id = null,
        skill_type_id = null,
        skill = {},
        skill_id = null,
        percentage = 0
    } = {}) {
        this.id = id;
        this.position_id = position_id;
        this.skill_type_id = skill_type_id;
        this.skill = skill;
        this.skill_id = skill_id;
        this.percentage = percentage;
    }
}