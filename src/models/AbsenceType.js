export default class AbsenceType {
    constructor({
        id = null,
        item_id = 40,
        name = '',
        description = '',
        settings = {
            compensation_enabled: false,
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