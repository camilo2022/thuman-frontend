export default class LanguageProficiencie {
    constructor({
        id = null,
        profile_id = null,
        language_id = null,
        language_level_id = null,
        file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 122
        }
    } = {}) {
        this.id = id;
        this.profile_id = profile_id;
        this.language_id = language_id;
        this.language_level_id = language_level_id;
        this.file = {
            file: {},
            file_type_id: 100,
            file_subtype_id: 122,
            ...file, // si llega algo lo pisa sobre los defaults
        };
    }
}