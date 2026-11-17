export default class Termination {
    constructor({
        id = null,
        person_id = null,
        termination_type_id = null,
        reason_id = null,
        model_id = null,
        model_type = null,
        date = null,
        decision = '',
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
        this.termination_type_id = termination_type_id;
        this.reason_id = reason_id;
        this.model_id = model_id;
        this.model_type = model_type;
        this.date = date;
        this.decision = decision;
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