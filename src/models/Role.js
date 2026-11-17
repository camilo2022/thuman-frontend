export default class Role {
    constructor({
        id = null,
        name = '',
        title = '',
        description = '',
        permission_id = null,
        relationships = {},
    } = {}) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.permission_id = permission_id;
        this.relationships = relationships;
    }
}