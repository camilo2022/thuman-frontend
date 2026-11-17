export default class Severance {
    constructor({
        id = null,
        person_id = null,
        severance_type_id = null,
        reason = '',
        status = '',
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 127
        },
        relationships = {},
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.severance_type_id = severance_type_id;
        this.reason = reason;
        this.status = status;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 127,
            ...file,
        };
        this.relationships = relationships;
    }
}