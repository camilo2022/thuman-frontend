
export default class Person {
    constructor({
        id = null,
        first_name = '',
        second_name = '',
        first_last_name = '',
        second_last_name = '',
        birth_date = '',
        birth_country_id = null,
        birth_departament_id = null,
        birth_city_id = null,
        document_type_id = null,
        document_issue_country_id = null,
        document_issue_departament_id = null,
        document_issue_city_id = null,
        document_number = null,
        document_number_confirmation = '',
        document_issue_date = '',
        country_id = null,
        departament_id = null,
        city_id = null,
        address = '',
        neighborhood = '',
        dialing_country_id = null,
        phone_number = null,
        phone_number_verified_at = null,
        email = null,
        email_verified_at = null,
        sex_id = null,
        gender_id = null,
        blood_type_id = null,
        marital_status_id = null,
        vacant_id = null,
        entity_id = null,
        photo = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 125
        },
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 102
        },
        signature = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 130
        },
        signature_authorized = false,
        relationships = {}
    } = {}) {
        this.id = id;
        this.first_name = first_name;
        this.second_name = second_name;
        this.first_last_name = first_last_name;
        this.second_last_name = second_last_name;
        this.birth_date = birth_date;
        this.birth_country_id = birth_country_id;
        this.birth_departament_id = birth_departament_id;
        this.birth_city_id = birth_city_id;
        this.document_number = document_number;
        this.document_issue_country_id = document_issue_country_id;
        this.document_issue_departament_id = document_issue_departament_id;
        this.document_issue_city_id = document_issue_city_id;
        this.document_number_confirmation = document_number_confirmation;
        this.document_issue_date = document_issue_date;
        this.country_id = country_id;
        this.departament_id = departament_id;
        this.city_id = city_id;
        this.address = address;
        this.neighborhood = neighborhood;
        this.dialing_country_id = dialing_country_id;
        this.phone_number = phone_number;
        this.phone_number_verified_at = phone_number_verified_at;
        this.email = email;
        this.email_verified_at = email_verified_at;
        this.document_type_id = document_type_id;
        this.sex_id = sex_id;
        this.gender_id = gender_id;
        this.blood_type_id = blood_type_id;
        this.marital_status_id = marital_status_id;
        this.vacant_id = vacant_id;
        this.entity_id = entity_id;
        this.photo = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 125,
            ...photo,
        };
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 102,
            ...file,
        };
        this.signature_authorized = signature_authorized;
        this.signature = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 130,
            ...signature,
        };
        this.relationships = relationships;
    }
}