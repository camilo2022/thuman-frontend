export default class Termination {
    constructor({
        id = null,
        name = '',
        description = '',
        enterprise_id = null,
        entity_id = null,
        headquarter_id = null,
        assignable_id = null,
        assignable_type = '',
        area_id = null,
        position_id = null,
        model_id = null,
        model_type = '',
        relationships = {},
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.enterprise_id = enterprise_id;
        this.entity_id = entity_id;
        this.headquarter_id = headquarter_id;
        this.assignable_id = assignable_id;
        this.assignable_type = assignable_type;
        this.area_id = area_id;
        this.position_id = position_id;
        this.model_id = model_id;
        this.model_type = model_type;
        this.relationships = relationships;
    }
}