export default class ProfessionalSkill {
    constructor({
        id = null,
        profile_id = null,
        skill_type_id = null,
        skill = {},
        skill_id = null,
        percentage = 0
    } = {}) {
        this.id = id;
        this.profile_id = profile_id;
        this.skill_type_id = skill_type_id;
        this.skill = skill;
        this.skill_id = skill_id;
        this.percentage = percentage;
    }
}