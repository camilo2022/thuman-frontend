export default class DocumentType {
    constructor({
        id = null,
        item_id = 4,
        person_type_id = null,
        name = '',
        description = '',
        settings = {
            abreviature: '',
            validations: []
        }
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.person_type_id = person_type_id;
        this.name = name;
        this.description = description;
        this.settings = settings;
    }
}