export default class TerminationType {
    constructor({
        id = null,
        item_id = 47,
        name = '',
        description = '',
        settings = {
            reason_required: false,
            file_required: false,
            massive_allowed: false,
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