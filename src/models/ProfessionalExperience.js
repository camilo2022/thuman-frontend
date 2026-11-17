export default class ProfessionalExperience {
    constructor({
        id = null,
        profile_id = null,
        company_name = '',
        supervisor_name = '',
        supervisor_dialing_country_id = null,
        supervisor_phone_number = '',
        country_id = null,
        departament_id = null,
        city_id = null,
        company_address = '',
        start_date = null,
        end_date = null,
        position = '',
        work_arrangement_id = null,
        position_description = '',
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 123
        }
    } = {}) {
        this.id = id;
        this.profile_id = profile_id;
        this.company_name = company_name;
        this.supervisor_name = supervisor_name;
        this.supervisor_dialing_country_id = supervisor_dialing_country_id;
        this.supervisor_phone_number = supervisor_phone_number;
        this.country_id = country_id;
        this.departament_id = departament_id;
        this.city_id = city_id;
        this.company_address = company_address;
        this.start_date = start_date;
        this.end_date = end_date;
        this.position = position;
        this.work_arrangement_id = work_arrangement_id;
        this.position_description = position_description;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 123,
            ...file
        };
    }
}