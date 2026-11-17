export default class Template {
    constructor({
        id = null,
        model_id = null,
        model_type = '',
        file = null,
        file_type_id = null,
        file_subtype_id = null,
        variables = {},
        settings = {},
        name = '',
        path = '',
        mime = '',
        extension = '',
        size = '',
        metadata = {}
    } = {}) {
        this.id = id,
        this.model_id = model_id,
        this.model_type = model_type,
        this.file = file,
        this.file_type_id = file_type_id,
        this.file_subtype_id = file_subtype_id,
        this.variables = variables,
        this.settings = settings,
        this.name = name,
        this.path = path,
        this.mime = mime,
        this.extension = extension,
        this.size = size,
        this.metadata = metadata
    }
}