export default class Policy {
  constructor({
    id = null,
    uuid = null,
    type = "", // contract | addendum
    model_id = null,
    model = "",
    risk_manager_id = null,
    policy_type_id = null,
    position = null,
    code = "",
    value = null,
    insured_value = null,
    start_date = null,
    end_date = null,
    status = "",
    file = {
      file: {},
      file_type_id: 100,
      file_subtype_id: 129,
    },
    relationships = {},
  } = {}) {
    this.id = id;
    this.uuid = uuid;
    this.type = type;
    this.model_id = model_id;
    this.model = model;
    this.risk_manager_id = risk_manager_id;
    this.policy_type_id = policy_type_id;
    this.position = position;
    this.code = code;
    this.value = value;
    this.insured_value = insured_value;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;

    this.file = {
      file: {},
      file_type_id: 100,
      file_subtype_id: 129,
      ...file,
    };

    this.relationships = relationships;
  }

  get isContract() {
    return this.type === "contract";
  }

  get isAddendum() {
    return this.type === "addendum";
  }

  get model_type() {
    if (this.type === "contract") return "App\\Models\\Contract";
    if (this.type === "addendum") return "App\\Models\\Addendum";
    return "";
  }
}
