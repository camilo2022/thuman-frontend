export default class ResignationType {
    constructor({
        id = null,
        item_id = 46,
        name = '',
        description = '',
        settings = {
            file_required: '',
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