export default class PolicyType {
    constructor({
        id = null,
        item_id = 37,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}