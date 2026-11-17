export default class Progress {
    constructor({
        id = null,
        person_id = null,
        step_id = null,
        questions = {},
        answers = {},
        start_at = null,
        end_at = null,
        status = '',
        result = '',
        relationships = {},
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.step_id = step_id;
        this.questions = questions;
        this.answers = answers;
        this.start_at = start_at;
        this.end_at = end_at;
        this.status = status;
        this.result = result;
        this.relationships = relationships;
    }
}