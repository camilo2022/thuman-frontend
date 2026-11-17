<template>
    <ViewTemplate :modelTemplate="modelTemplate" :templates="templates" :pagination="pagination" :fileTypes="fileTypes"
        :fileSubtypes="fileSubtypes" :showCreateTemplate="showCreateTemplate" @create="createTemplate"
        @submitTemplateStore="submitTemplateStore" :showEditTemplate="showEditTemplate" @edit="editTemplate"
        @submitTemplateFind="submitTemplateFind" @submitTemplateUpdate="submitTemplateUpdate" @closeModals="closeModals"
        @submitTemplateDelete="submitTemplateDelete" @submitTemplateRestore="submitTemplateRestore"
        @submitTemplatePreview="submitTemplatePreview" @setting="settingTemplate" :showEditSetting="showEditSetting"
        @index="indexTemplate" :templatePreview="templatePreview" :showIndexTemplate="showIndexTemplate"
        @json="jsonBulider" :getData="getData" :loadingData="loadingData" @indexEntity="indexEntity"
        :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import router from '@/router'

import ViewTemplate from '@/components/templates/Internal/Setting/Enterprise/Entity/Template/Template.vue';

import ModelEntity from '@/models/Entity';
import ModelTemplate from '@/models/Template';

import EntityService from '@/services/EntityService';
import TemplateService from '@/services/TemplateService';
import FileTypeService from '@/services/FileTypeService';
import FileSubtypeService from '@/services/FileSubtypeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useEntityStore } from '@/stores/entityStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEntity = ref(new ModelEntity());
const modelTemplate = ref(new ModelTemplate());

const templates = ref([]);
const fileTypes = ref([]);
const fileSubtypes = ref([]);

const templatePreview = ref({ url: '', name: '' })

const showIndexTemplate = ref(true);
const showCreateTemplate = ref(false);
const showEditTemplate = ref(false);
const showEditSetting = ref(false);
const getData = ref(false);
const loadingData = ref(false);
const formErrors = ref({});
const loadedTemplateId = ref(null);
const loadingPreview = ref(false);
const previewRequestId = ref(0);

const entityStore = useEntityStore();
const entityId = useEntityStore().selectedId;
modelTemplate.value.model_id = entityId;

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
})

const submitTemplateAll = async () => {
    loadingData.value = true;
    try {
        if (!entityId) {
            router.push('/setting/enterprise/entity');
            loadingData.value = false;
            return;
        }

        const response = await TemplateService.all(entityId, pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        templates.value = response.data.templates;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loadingData.value = false;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitFileTypeAll = async () => {
    try {
        const response = await FileTypeService.all();
        fileTypes.value = response.data.fileTypes;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitFileSubtypeAll = async (fileTypeId) => {
    try {
        if (!fileTypeId) { fileSubtypes.value = []; return; }

        const response = await FileSubtypeService.all(1, '', null, fileTypeId);
        fileSubtypes.value = response.data.fileSubtypes;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitEntityFind = async () => {
    try {
        if (!entityId) return;

        const response = await EntityService.find(entityId);
        modelEntity.value.id = response.data.entity.id;
        modelEntity.value.enterprise_id = response.data.entity.enterprise_id;
        modelEntity.value.entity_type_id = response.data.entity.entity_type_id;
        modelEntity.value.name = response.data.entity.name;
        modelEntity.value.country_id = response.data.entity.country_id;
        modelEntity.value.document_type_id = response.data.entity.document_type_id;
        modelEntity.value.document_number = response.data.entity.document_number;
        modelEntity.value.person_id = response.data.entity.person_id;
        modelEntity.value.about_us.text = response.data.entity.about_us;
        modelEntity.value.about_us.image = response.data.entity.relationships.about_us;
        modelEntity.value.mission.text = response.data.entity.mission;
        modelEntity.value.mission.image = response.data.entity.relationships.mission;
        modelEntity.value.vision.text = response.data.entity.vision;
        modelEntity.value.vision.image = response.data.entity.relationships.vision;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitTemplateFind = async (templateId) => {
    getData.value = true;
    try {
        const response = await TemplateService.find(templateId);
        loadedTemplateId.value = templateId;
        const template = response.data.template;

        modelTemplate.value.id = template.id;
        modelTemplate.value.model_id = template.model_id;
        modelTemplate.value.model_type = template.model_type;

        modelTemplate.value.file = template.path
            ? {
                path: template.path,
                name: template.metadata?.client_original_name || template.name,
                mime: template.mime,
                extension: template.extension,
                size: template.size,
                metadata: template.metadata
            }
            : null;

        modelTemplate.value.file_type_id = template.file_type_id;
        await submitFileSubtypeAll(modelTemplate.value.file_type_id);
        modelTemplate.value.file_subtype_id = template.file_subtype_id;

        modelTemplate.value.settings = Array.isArray(template.settings)
            ? {}
            : (template.settings || {});

        modelTemplate.value.variables = template.relationships.file_subtype.settings.variables;
        modelTemplate.value.name = template.name;
        modelTemplate.value.path = template.path;
        modelTemplate.value.mime = template.mime;
        modelTemplate.value.extension = template.extension;
        modelTemplate.value.size = template.size;
        modelTemplate.value.metadata = template.metadata;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        getData.value = false;
    }
};

const submitTemplateStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la plantilla?',
        message: 'Se creará la plantilla con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TemplateService.store(modelTemplate.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            await submitTemplateAll();
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelTemplate');
                console.log(formErrors.value)
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            // await submitTemplateAll();
        }
    }
};

const submitTemplateUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la plantilla?',
        message: 'Se actualizará la plantilla con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TemplateService.update(modelTemplate.value.id, modelTemplate.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitTemplateAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'modelTemplate');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            // await submitTemplateAll();
        }
    }
};

const submitTemplateSettingsUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea guardar la configuración?',
        message: 'Se actualizará la plantilla con los cambios realizados en márgenes, secciones y subsecciones.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TemplateService.setting(modelTemplate.value.id, modelTemplate.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            indexTemplate();
            cleanForm();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitTemplateAll();
        }
    }
};

const submitTemplateDelete = async (templateId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la plantilla?',
        message: 'Esta acción suspenderá su uso en procesos activos, pero no eliminará su información.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TemplateService.delete(templateId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La plantilla fue inactivada exitosamente.', type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitTemplateAll();
        }
    }
};

const submitTemplateRestore = async (templateId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la plantilla?',
        message: 'Esta acción permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TemplateService.restore(templateId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitTemplateAll();
        }
    }
};

const submitTemplatePreview = async (templateId) => {
    if (loadingPreview.value) return;

    const requestId = ++previewRequestId.value;
    loadingPreview.value = true;

    try {
        if (loadedTemplateId.value !== templateId) {
            await submitTemplateFind(templateId);
        }

        if (
            !modelTemplate.value.settings ||
            Object.keys(modelTemplate.value.settings).length === 0
        ) {
            // fuerza a reconsultar en el próximo click
            loadedTemplateId.value = null;

            alertStore.addAlert({
                title: 'Configuración',
                message: 'La plantilla no cuenta con una configuración.',
                type: 'warning'
            });
            return;
        }

        const response = await TemplateService.preview(templateId);

        if (requestId !== previewRequestId.value) return;

        templatePreview.value.name = 'PREVIEW';
        templatePreview.value.url = `data:application/pdf;base64,${response.data}`;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({
                        title: error.attributes?.[field] || 'Error',
                        message,
                        type: 'warning'
                    });
                });
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    } finally {
        if (requestId === previewRequestId.value) {
            loadingPreview.value = false;
        }
    }
};

const mapListType = (value) => {
    switch (value) {
        case 'texto':
        case 'Texto':
        case 'alphabetic':
            return 'alphabetic'

        case 'numerico':
        case 'Numérico':
        case 'numeric':
            return 'numeric'

        case 'ordinal':
        case 'Ordinal':
            return 'ordinal'

        default:
            return 'alphabetic'
    }
}

const jsonBulider = async (data) => {
    console.log(data)
    const json = {
        settings: {
            margins: data.margins,
            orientation: data.orientation ?? 'portrait',
            size: data.size ?? 'letter',

            sections: data.sections.map(section => ({
                title: section.title,

                settings: {
                    is_visible: section.settings?.is_visible ?? true,
                    is_editable: section.settings?.is_editable ?? false
                },

                subsections: section.subsections.map(sub => {
                    const isList = sub.type === 'Lista'

                    const base = {
                        title: sub.title,
                        settings: {
                            is_visible: sub.settings?.is_visible ?? true,
                            is_editable: sub.allowEdit ?? false
                        },
                        entry_type: isList ? 'list' : 'text'
                    }

                    if (isList) {
                        return {
                            ...base,
                            list_type: mapListType(sub.list_type),
                            content: null,
                            items: sub.clauses.map(c => ({
                                title: c.title,
                                content: c.text
                            }))
                        }
                    }

                    return {
                        ...base,
                        content: sub.content ?? ""
                    }
                })
            }))
        }
    }

    modelTemplate.value.settings = json.settings

    submitTemplateSettingsUpdate()
}

const indexEntity = () => {
    entityStore.clearSelected();
    router.push({ name: "Setting-entity" });
}

const indexTemplate = () => {
    showIndexTemplate.value = true;
    showEditTemplate.value = false;
    showCreateTemplate.value = false;
    showEditSetting.value = false;
}

const createTemplate = () => {
    showCreateTemplate.value = true;
    showEditTemplate.value = false;
    cleanForm();
}

const editTemplate = () => {
    showEditTemplate.value = true;
    showCreateTemplate.value = false;
    cleanForm();
}

const settingTemplate = () => {
    showIndexTemplate.value = false;
    showEditTemplate.value = false;
    showCreateTemplate.value = false;
    showEditSetting.value = true;
}

const closeModals = () => {
    showCreateTemplate.value = false;
    showEditTemplate.value = false;
    cleanForm();
    formErrors.value = {};
}

const cleanForm = () => {
    modelTemplate.value.id = null;
    modelTemplate.value.model_type = '';
    modelTemplate.value.file = null;
    modelTemplate.value.file_type_id = null;
    modelTemplate.value.file_subtype_id = null;
    modelTemplate.value.settings = {};
    modelTemplate.value.variables = {};
    modelTemplate.value.name = '';
    modelTemplate.value.path = '';
    modelTemplate.value.mime = '';
    modelTemplate.value.extension = '';
    modelTemplate.value.size = '';
    modelTemplate.value.metadata = {};
    loadedTemplateId.value = null;
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};
    Object.entries(errors).forEach(([field, messages]) => {
        prefixed[`${prefix}_${field}`] = [...messages];
    });
    return prefixed;
};

onMounted(() => {
    submitTemplateAll();
    submitEntityFind();
    submitFileTypeAll();
})

watch(() => modelTemplate.value.file_type_id, async () => {
    modelTemplate.value.file_subtype_id = null;
    if (modelTemplate.value.file_type_id) await submitFileSubtypeAll(modelTemplate.value.file_type_id);
});

watch(() => pagination.current_page, () => {
    submitTemplateAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTemplateAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTemplateAll();
    }
});
</script>
