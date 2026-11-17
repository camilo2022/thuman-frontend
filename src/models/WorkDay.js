export default class WorkDay {
    constructor({
        id = null,
        item_id = 2,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}