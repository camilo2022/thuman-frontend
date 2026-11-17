export default class HealthEntityAffiliation {
    constructor({
        id = null,
        person_id =  null,
        country_id =  null,
        health_entity_id = null,
        observation = '',
        status = '',
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129
        },
        relationships = {}
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.country_id = country_id;
        this.health_entity_id = health_entity_id;
        this.observation = observation;
        this.status = status;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129,
            ...file,
        };
        this.relationships = relationships;
    }
}