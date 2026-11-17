export default class Disability {
    constructor({
        id = null,
        person_id = null,
        disability_type_id = null,
        cie_code_id = null,
        start_date = null,
        end_date = null,
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
        this.disability_type_id = disability_type_id;
        this.cie_code_id = cie_code_id;
        this.start_date = start_date;
        this.end_date = end_date;
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