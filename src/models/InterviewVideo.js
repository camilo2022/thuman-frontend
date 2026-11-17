export default class InterviewVideo {
  constructor({
    id = null,
    application_id = null,
    form_id = null,
    questions = {},
    answers = {},
    reviewer_id = null,
    reviewer_observation = "",
    status = "",
    relationships = {},
  } = {}) {
    this.id = id;
    this.application_id = application_id;
    this.form_id = form_id;
    this.questions = questions;
    this.answers = answers;
    this.reviewer_id = reviewer_id;
    this.reviewer_observation = reviewer_observation;
    this.status = status;
    this.relationships = relationships;
  }
}
