export default class ExamPolygraph {
  constructor({
    id = null,
    application_id = null,
    entity_id = null,
    vacant_id = null,
    date_time = null,
    country_id = null,
    departament_id = null,
    city_id = null,
    service_provider_id = 1,
    address = "",
    neighborhood = "",
    result = null,
    description = "",
    file = {
      file: {},
      file_type_id: 96,
      file_subtype_id: 105,
    },
    indication = "",
    status = "",
    relationships = {},
  } = {}) {
    this.id = id;
    this.application_id = application_id;
    this.entity_id = entity_id;
    this.vacant_id = vacant_id;
    this.date_time = date_time;
    this.country_id = country_id;
    this.departament_id = departament_id;
    this.city_id = city_id;
    this.service_provider_id = service_provider_id;
    this.address = address;
    this.neighborhood = neighborhood;
    this.result = result;
    this.description = description;
    this.file = {
      file: {},
      file_type_id: 96,
      file_subtype_id: 105,
      ...file, // si llega algo lo pisa sobre los defaults
    };
    this.indication = indication;
    this.status = status;
    this.relationships = relationships;
  }
}
