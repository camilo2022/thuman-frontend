export default class InterviewInitial {
    constructor({
        id = null,
        application_id = null,
        entity_id = null,
        vacant_id = null,
        date_time = null,
        form_id = null,
        questions = {},
        answers = {},
        salary_min = null,
        salary_max = null,
        reviewer_observation = '',
        reviewer_score = 0,
        reviewer_id = null,
        reviewer_status = '',
        leader_observation = '',
        leader_score = 0,
        leader_id = null,
        leader_status = '',
        indication = '',
        status = '',
        relationships = {}
    } = {}) {
        this.id = id;
        this.application_id = application_id;
        this.entity_id = entity_id;
        this.vacant_id = vacant_id;
        this.date_time = date_time;
        this.form_id = form_id;
        this.questions = questions;
        this.answers = answers;
        this.salary_min = salary_min;
        this.salary_max = salary_max;
        this.reviewer_observation = reviewer_observation;
        this.reviewer_score = reviewer_score;
        this.reviewer_id = reviewer_id;
        this.reviewer_status = reviewer_status;
        this.leader_observation = leader_observation;
        this.leader_score = leader_score;
        this.leader_id = leader_id;
        this.leader_status = leader_status;
        this.indication = indication;
        this.status = status;
        this.relationships = relationships;
    }
}