export default class TestTechnical {
    constructor({
        id = null,
        application_id = null,
        entity_id = null,
        vacant_id = null,
        start_date = null,
        end_date = null,
        form_id = null,
        questions = {},
        answers = {},
        leader_observation = '',
        leader_score = 0,
        leader_id = null,
        leader_status = '',
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
        this.form_id = form_id;
        this.questions = questions;
        this.answers = answers;
        this.leader_observation = leader_observation;
        this.leader_score = leader_score;
        this.leader_id = leader_id;
        this.leader_status = leader_status;
        this.start_at = start_at;
        this.end_at = end_at;
        this.indication = indication;
        this.status = status;
        this.relationships = relationships;
    }
}
