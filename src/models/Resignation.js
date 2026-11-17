export default class Resignation {
    constructor({
        id = null,
        person_id = null,
        resignation_type_id = null,
        date = null,
        reason = '',
        status = '',
        relationships = {},
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.resignation_type_id = resignation_type_id;
        this.date = date;
        this.reason = reason;
        this.status = status;
        this.relationships = relationships;
    }
}