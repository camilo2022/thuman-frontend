export default class Step {
    constructor({
        id = null,
        induction_id = null,
        name = '',
        description = '',
        form_id = null,
        video = {
            file: {},
            file_type_id: 101,
            file_subtype_id: 127
        },
        relationships = {},
    } = {}) {
        this.id = id;
        this.induction_id = induction_id;
        this.name = name;
        this.description = description;
        this.form_id = form_id;
        this.video = {
            file: {},
            file_type_id: 101,
            file_subtype_id: 127,
            ...video,
        };
        this.relationships = relationships;
    }
}