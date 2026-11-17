export default class AcademicLevel {
    constructor({
        id = null,
        item_id = 8,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}