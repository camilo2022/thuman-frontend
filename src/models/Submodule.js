export default class Submodule {
    constructor({
        id = null,
        model_id = null,
        model_type = '',
        role_id = null,
        permission_id = null,
        name = '',
        type = null,
        route = null,
        icon = '',
        relationships = {}
    } = {}) {
        this.id = id;
        this.model_id = model_id;
        this.model_type = model_type;
        this.role_id = role_id;
        this.permission_id = permission_id;
        this.name = name;
        this.type = type;
        this.route = route;
        this.icon = icon;
        this.relationships = relationships;
    }
}