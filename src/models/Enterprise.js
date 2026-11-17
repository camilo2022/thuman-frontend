export default class Enterprise {
    constructor({
        id = null,
        name = '',
        description = '',
        logo = null,
        file_type_id = 97,
        file_subtype_id = 108
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        logo instanceof File ? this.logo = logo : delete this.logo ;
        this.file_type_id = file_type_id;
        this.file_subtype_id = file_subtype_id;
    }
}