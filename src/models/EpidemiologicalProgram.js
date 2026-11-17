export default class EpidemiologicalProgram {
    constructor({
        id = null,
        item_id = 32,
        name = '',
        description = '',
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
    }
}