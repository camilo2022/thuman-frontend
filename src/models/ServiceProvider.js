export default class ServiceProvider {
    constructor({
        id = null,
        item_id = 35,
        name = '',
        description = '',
        service_type_id = null,
        country_id = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.service_type_id = service_type_id;
        this.country_id = country_id;
        this.relationships = relationships;
    }
}