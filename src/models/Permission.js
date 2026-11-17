export default class Permission {
    constructor({
        id = null,
        name = '',
        title = '',
        description = '',
        relationships = {},
    } = {}) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.relationships = relationships;
    }
}