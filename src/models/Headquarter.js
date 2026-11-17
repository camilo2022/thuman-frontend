export default class Headquarter {
    constructor({
        id = null,
        entity_id = null,
        name = '',
        departament_id = null,
        city_id = null,
        address = '',
    } = {}) {
        this.id = id;
        this.entity_id = entity_id;
        this.name = name;
        this.departament_id = departament_id;
        this.city_id = city_id;
        this.address = address;
    }
}