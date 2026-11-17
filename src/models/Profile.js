export default class Profile {
    constructor({
        id = null,
        person_id = null,
        title = '',
        description = '',
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 124
        },
        relationships = {},
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.title = title;
        this.description = description;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 124,
            ...file, // si llega algo lo pisa sobre los defaults
        };
        this.relationships = relationships;
    }
}