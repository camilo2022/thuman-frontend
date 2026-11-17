export default class HealthEntity {
    constructor({
        id = null,
        item_id = 26,
        health_entity_type_id = null,
        name = '',
        description = '',
        country_id = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.health_entity_type_id = health_entity_type_id;
        this.name = name;
        this.description = description;
        this.country_id = country_id;
        this.relationships = relationships;
    }
}