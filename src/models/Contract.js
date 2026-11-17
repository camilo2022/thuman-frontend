export default class Contract {
    constructor({
        id = null,
        application_id = null,
        person_id = null,
        headquarter_id = null,
        contract_type_id = null,
        position_id = null,
        salary = 0,
        payment_period_id = null,
        start_date = null,
        end_date = null,
        person_observation = '',
        person_signed_at = null,
        transport_allowance = 0,
        person_status = '',
        legal_representative_signed_at = null,
        legal_representative_status = '',
        settings = {
            accept_terms: false,
            accept_privacy_policy: false,
            documents: []
        },
        file_subtypes_id = [],
        signature = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 130
        },
        relationships = {}
    } = {}) {
        this.id = id;
        this.application_id = application_id;
        this.person_id = person_id;
        this.headquarter_id = headquarter_id;
        this.contract_type_id = contract_type_id;
        this.position_id = position_id;
        this.salary = salary;
        this.payment_period_id = payment_period_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.person_observation = person_observation;
        this.person_signed_at = person_signed_at;
        this.person_status = person_status;
        this.legal_representative_signed_at = legal_representative_signed_at;
        this.legal_representative_status = legal_representative_status;
        this.settings = settings;
        this.transport_allowance = transport_allowance;
        this.file_subtypes_id = file_subtypes_id;
        this.signature = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 130,
            ...signature,
        };
        this.relationships = relationships;
    }
}