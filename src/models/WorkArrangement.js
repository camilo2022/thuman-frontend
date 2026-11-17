export default class WorkArrangement {
    constructor({
        id = null,
        item_id = 3,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}