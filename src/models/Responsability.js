export default class Responsability {
    constructor({
        id = null,
        name = '',
        description = ''
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}