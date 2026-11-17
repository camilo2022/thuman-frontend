export default class OrganizationalStructure {
  constructor({
    id = null,
    entity_id = null,
    position_id = null,
    parent_position_id = null,
    start_date = null,
    end_date = null,
    reason = "",
    status = "",
    relationships = {},
  } = {}) {
    this.id = id;
    this.entity_id = entity_id;
    this.position_id = position_id;
    this.parent_position_id = parent_position_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.reason = reason;
    this.status = status;
    this.relationships = relationships;
  }
}
