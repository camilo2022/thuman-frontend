export default class User {
    constructor({
        person_id = null,
        current_password = '',
        password = '',
        password_confirmation = '',
        permission_id = null,
        relationships = {},
    } = {}) {
        this.person_id = person_id;
        this.current_password = current_password;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.permission_id = permission_id;
        this.relationships = relationships;
    }
}