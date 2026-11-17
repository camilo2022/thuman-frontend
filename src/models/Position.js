export default class Position {
    constructor({
        id = null,
        area_id = null,
        name = '',
        profile_category_id = null,
        description = '',
        settings = {
            polygraph: false,
            video_interview: false
        },
        permission_id = null,
        relationships = {},
    } = {}) {
        this.id = id;
        this.area_id = area_id;
        this.name = name;
        this.profile_category_id = profile_category_id;
        this.description = description;
        this.settings = settings;
        this.permission_id = permission_id;
        this.relationships = relationships;
    }
}