export default class Vacant {
    constructor({
        id = null,
        uuid = null,
        hiring_reason_id = null,
        entity_id = null,
        position_id = null,
        person_id = null,
        headquarter_id = null,
        contract_type_id = null,
        work_arrangement_id = null,
        work_day_id = null,
        salary_min = null,
        salary_max = null,
        start_date = '',
        end_date = null,
        description = '',
        quantity = null,
        settings = {
            polygraph: false,
            video_interview: false
        },
        benefits_id = [],
        relationships = {},
    } = {}) {
        this.id = id;
        this.uuid = uuid;
        this.hiring_reason_id = hiring_reason_id;
        this.entity_id = entity_id;
        this.position_id = position_id;
        this.person_id = person_id;
        this.headquarter_id = headquarter_id;
        this.contract_type_id = contract_type_id;
        this.work_arrangement_id = work_arrangement_id;
        this.work_day_id = work_day_id;
        this.salary_min = salary_min;
        this.salary_max = salary_max;
        this.start_date = start_date;
        this.end_date = end_date;
        this.description = description;
        this.quantity = quantity;
        this.settings = settings;
        this.benefits_id = benefits_id;
        this.relationships = relationships;
    }
}