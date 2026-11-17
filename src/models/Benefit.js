export default class Benefit {
    constructor({
        id = null,
        item_id = 19,
        name = '',
        description = '',
        icon = null,
        file_type_id = 97,
        file_subtype_id = 108
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        icon instanceof File ? this.icon = icon : delete this.icon ;
        this.file_type_id = file_type_id;
        this.file_subtype_id = file_subtype_id;
    }
}