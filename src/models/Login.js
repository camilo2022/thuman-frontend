export default class Login {
    constructor({
        document_number = '', 
        email = '', 
        password = ''
    } = {}) {
        this.document_number = document_number;
        this.email = email;
        this.password = password;
    }
}
