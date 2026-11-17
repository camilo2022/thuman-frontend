export default class DisabilityType {
    constructor({
        id = null,
        item_id = 43,
        name = '',
        description = '',
        settings = {
            file_required: false,
            message: '',
            validations: []
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