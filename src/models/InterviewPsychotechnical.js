export default class InterviewPsychotechnical {
    constructor({
        id = null,
        application_id = null,
        entity_id = null,
        vacant_id = null,
        date_time = null,
        questions = {},
        answers = {},
        psychologist_observation = '',
        psychologist_score = 0,
        psychologist_id = null,
        psychologist_status = '',
        indication = '',
        status = '',
        relationships = {}
    } = {}) {
        this.id = id;
        this.application_id = application_id;
        this.entity_id = entity_id;
        this.vacant_id = vacant_id;
        this.date_time = date_time;
        this.questions = questions;
        this.answers = answers;
        this.psychologist_observation = psychologist_observation;
        this.psychologist_score = psychologist_score;
        this.psychologist_id = psychologist_id;
        this.psychologist_status = psychologist_status;
        this.indication = indication;
        this.status = status;
        this.relationships = relationships;
    }
}