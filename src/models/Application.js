export default class Application {
    constructor({
        id = null,
        compatibility = null,
        person_id = null,
        vacant_id = null,
        form_id = null,
        questions = {},
        answers = {},
        salary = null,
        observation = '',
        status = '',
        video = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 127
        },
        relationships = {},
    } = {}) {
        this.id = id;
        this.compatibility = compatibility;
        this.person_id = person_id;
        this.vacant_id = vacant_id;
        this.form_id = form_id;
        this.questions = questions;
        this.answers = answers;
        this.salary = salary;
        this.observation = observation;
        this.status = status;
        this.video = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 127,
            ...video,
        };
        this.relationships = relationships;
    }
}
