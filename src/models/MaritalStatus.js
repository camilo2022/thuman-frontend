export default class MaritalStatus {
    constructor({
        id = null,
        item_id = 12,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}