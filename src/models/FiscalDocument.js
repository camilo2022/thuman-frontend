export default class FiscalDocument {
    constructor({
        id = null,
        item_id = 31,
        name = '',
        description = '',
        settings = {
            abreviature: ''
        },
        country_id = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.settings = settings;
        this.country_id = country_id;
        this.relationships = relationships;
    }
}