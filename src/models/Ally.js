export default class Ally {
  constructor({
    id = null,
    entity_id = null,
    country_id = null,
    name = "",
    description = "",
    settings = {
      works: [],
    },
    work = {
      holidays: false,
      days: [],
    },
    relationships = {},
  } = {}) {
    this.id = id;
    this.entity_id = entity_id;
    this.country_id = country_id;
    this.name = name;
    this.description = description;
    this.settings = settings;
    this.work = work;
    this.relationships = relationships;
  }
}
