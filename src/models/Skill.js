export default class Skill {
    constructor({
        id = null,
        item_id = 29,
        skill_type_id = null,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.skill_type_id = skill_type_id;
        this.name = name;
        this.description = description;
    }
}