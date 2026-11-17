export default class AddendumType {
    constructor({
        id = null,
        item_id = 38,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}