export default class EntityType {
    constructor({
        id = null,
        item_id = 30,
        name = '',
        description = '',
        settings = {
            abreviature: ''
        }
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.settings = settings;
    }
}