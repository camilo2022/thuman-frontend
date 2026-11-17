export default class Reason {
    constructor({
        id = null,
        termination_type_id = null,
        item_id = 48,
        name = '',
        description = '',
        settings = {},
        relationships = {},
    } = {}) {
        this.id = id;
        this.termination_type_id = termination_type_id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.settings = settings;
        this.relationships = relationships;
    }
}