export default class ContractType {
    constructor({
        id = null,
        item_id = 1,
        name = '',
        description = '',
        settings = {
            health_entity_affiliation: false,
            pension_fund_affiliation: false,
            compensation_fund_affiliation: false,
            risk_manager_affiliation: false,
            bank_certificate: false,
            fiscal_document_certificate: false,
            requires_end_date: true
        },
        file_subtypes_id = [],
        relationships = {}
    } = {}) {
        this.id = id;
        this.item_id = item_id;
        this.name = name;
        this.description = description;
        this.settings = settings;
        this.file_subtypes_id = file_subtypes_id;
        this.relationships = relationships;
    }
}