export default class PensionFund {
    constructor({
        id = null,
        item_id = 28,
        name = '',
        description = '',
        country_id = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.country_id = country_id;
        this.relationships = relationships;
    }
}