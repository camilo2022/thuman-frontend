export default class Permission {
    constructor({
        id = null,
        item_id = 39,
        name = '',
        description = '',
        settings = {
            channels: []
        },
        relationships = {},
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.settings = settings;
        this.relationships = relationships;
    }
}