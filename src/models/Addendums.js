export default class Addendum {
    constructor({
        id = null,
        contract = null,
        addendum_type = null,
        headquarter = null,
        contract_type = null,
        position = null,
        salary = null,
        payment_period = null,
        start_date = null,
        end_date = null,
        person_observation = '',
        person_signed_at = null,
        person_status = '',
        legal_representative_signed_at = null,
        legal_representative_status = '',
        settings = {},
        file_subtypes = [],
        person_signed = null,
        legal_representative_signed = null,
        relationships = {}
    } = {}) {
        this.id = id;
        this.contract = contract;
        this.addendum_type = addendum_type;
        this.headquarter = headquarter;
        this.contract_type = contract_type;
        this.position = position;
        this.salary = salary;
        this.payment_period = payment_period;
        this.start_date = start_date;
        this.end_date = end_date;
        this.person_observation = person_observation;
        this.person_signed_at = person_signed_at;
        this.person_status = person_status;
        this.legal_representative_signed_at = legal_representative_signed_at;
        this.legal_representative_status = legal_representative_status;
        this.settings = settings;
        this.file_subtypes = file_subtypes;
        this.person_signed = person_signed;
        this.legal_representative_signed = legal_representative_signed;
        this.relationships = relationships;
    }
}