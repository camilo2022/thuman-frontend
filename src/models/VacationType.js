export default class VacationType {
    constructor({
        id = null,
        item_id = 41,
        name = '',
        description = '',
        settings = {
            field_type: false,
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