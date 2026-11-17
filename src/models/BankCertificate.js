export default class BankCertificate {
    constructor({
        id = null,
        person_id =  null,
        country_id =  null,
        bank_id = null,
        bank_account_type_id = null,
        account_number = '',
        observation = '',
        status = '',
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129
        },
        relationships = {}
    } = {}) {
        this.id = id;
        this.person_id = person_id;
        this.country_id = country_id;
        this.bank_id = bank_id;
        this.bank_account_type_id = bank_account_type_id;
        this.account_number = account_number;
        this.observation = observation;
        this.status = status;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 129,
            ...file,
        };
        this.relationships = relationships;
    }
}