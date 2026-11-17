export default class Survey {
    constructor({
        id = null,
        form_id = null,
        questions = {},
        answers = {},
        person_id = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.form_id = form_id;
        this.questions = questions;
        this.answers = answers;
        this.person_id = person_id;
        this.relationships = relationships;
    }
}