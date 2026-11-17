export default class Vacation {
    constructor({
        id = null,
        person_id = null,
        vacation_type_id = null,
        period = '',
        days = 0,
        start_date = null,
        end_date = null,
        status = '',
        relationships = {},
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.vacation_type_id = vacation_type_id;
        this.period = period;
        this.days = days;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.relationships = relationships;
    }
}