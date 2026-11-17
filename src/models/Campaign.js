export default class Campaign {
    constructor({
        id = null,
        ally_id = null,
        name = '',
        description = '',
        relationships = {},
    } = {}) {
        this.id = id;
        this.ally_id = ally_id;
        this.name = name;
        this.description = description;
        this.relationships = relationships;
    }
}