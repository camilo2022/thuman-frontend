export default class Form {
  constructor({
    id = null,
    form_type_id = null,
    // enterprise_id = null,
    // entity_id = null,
    // headquarter_id = null,
    assignable_id = null,
    assignable_type = "",
    // area_id = null,
    // position_id = null,
    model_id = null,
    model_type = "",
    questions = {},
    relationships = {},
  } = {}) {
    this.id = id;
    this.form_type_id = form_type_id;
    this.assignable_id = assignable_id;
    this.assignable_type = assignable_type;
    this.model_id = model_id;
    this.model_type = model_type;
    this.questions = questions;
    this.relationships = relationships;
  }
}
