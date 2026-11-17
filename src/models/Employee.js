
export default class Employee {
    constructor({
        id = null,
        person_id = null,
        headquarter_id = null,
        position_id = null,
        start_date = null,
        end_date = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.headquarter_id = headquarter_id;
        this.position_id = position_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.relationships = relationships;
    }
}