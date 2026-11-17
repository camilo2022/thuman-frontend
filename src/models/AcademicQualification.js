export default class AcademicQualification {
    constructor({
        id = null,
        profile_id = null,
        country_id = null,
        departament_id = null,
        city_id = null,
        academic_level_id = null,
        academic_institution = '',
        academic_title = '',
        formation_status_id = null,
        start_date = null,
        end_date = null,
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 122
        }
    } = {}) {
        this.id = id;
        this.profile_id = profile_id;
        this.country_id = country_id;
        this.departament_id = departament_id;
        this.city_id = city_id;
        this.academic_level_id = academic_level_id;
        this.academic_institution = academic_institution;
        this.academic_title = academic_title;
        this.formation_status_id = formation_status_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 122,
            ...file, // si llega algo lo pisa sobre los defaults
        };
    }
}