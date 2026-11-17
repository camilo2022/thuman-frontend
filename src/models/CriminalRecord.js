export default class CriminalRecord {
    constructor({
        id = null,
        application_id = null,
        status = '',
        observation = '',
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129,
        },
        relationships = {}
    } = {}) {
        this.id = id;
        this.application_id = application_id;
        this.status = status;
        this.observation = observation;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129,
            ...file, // si llega algo lo pisa sobre los defaults
        };
        this.relationships = relationships;
    }
}