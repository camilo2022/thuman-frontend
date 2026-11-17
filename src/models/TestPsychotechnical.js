export default class TestPsychotechnical {
    constructor({
        id = null,
        application_id = null,
        entity_id = null,
        vacant_id = null,
        start_date = null,
        end_date = null,
        questions = {},
        answers = {},
        psychologist_observation = '',
        psychologist_id = null,
        psychologist_status = '',
        start_at = null,
        end_at = null,
        indication = '',
        status = '',
        relationships = {}
    } = {}) {
        this.id = id;
        this.application_id = application_id;
        this.entity_id = entity_id;
        this.vacant_id = vacant_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.questions = questions;
        this.answers = answers;
        this.psychologist_observation = psychologist_observation;
        this.psychologist_id = psychologist_id;
        this.psychologist_status = psychologist_status;
        this.start_at = start_at;
        this.end_at = end_at;
        this.indication = indication;
        this.status = status;
        this.relationships = relationships;
    }
}
