export default class Entity {
    constructor({
        id = null,
        enterprise_id = null,
        entity_type_id = null,
        name = '',
        country_id = null,
        document_type_id = null,
        document_number = '',
        person_id = null,
        banner = {
            image: null,
            file_type_id: 97,
            file_subtype_id: 107
        },
        mission = {
            text: '',
            image: null,
            file_type_id: 97,
            file_subtype_id: 108
        },
        vision = {
            text: '',
            image: null,
            file_type_id: 97,
            file_subtype_id: 109
        },
        about_us = {
            text: '',
            image: null,
            file_type_id: 97,
            file_subtype_id: 110
        },
        settings = {
            vacations: []
        },
        vacation = {
            period: '',
            legal_days: null,
            days: []
        },
        relationships = {}
    } = {}) {
        this.id = id;
        this.enterprise_id = enterprise_id;
        this.entity_type_id = entity_type_id;
        this.name = name;
        this.country_id = country_id;
        this.document_type_id = document_type_id;
        this.document_number = document_number;
        this.person_id = person_id;
        this.banner = {
            image: {},
            file_type_id: 97,
            file_subtype_id: 107,
            ...banner,
        };
        this.mission = {
            image: {},
            file_type_id: 97,
            file_subtype_id: 108,
            ...mission,
        };
        this.vision = {
            image: {},
            file_type_id: 97,
            file_subtype_id: 109,
            ...vision,
        };
        this.about_us = {
            image: {},
            file_type_id: 97,
            file_subtype_id: 110,
            ...about_us,
        };
        this.settings = settings;
        this.vacation = vacation;
        this.relationships = relationships;
    }
}