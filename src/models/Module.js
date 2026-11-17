export default class Module {
    constructor({
        id = null,
        name = '',
        type = '',
        route = '',
    } = {}) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.route = route;
    }
}