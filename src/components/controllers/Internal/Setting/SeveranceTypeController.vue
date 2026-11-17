<template>
    <ViewSeveranceType :modelSeveranceType="modelSeveranceType" :severanceTypes="severanceTypes"
        :pagination="pagination" @index="indexSeveranceType" @setting="settingSeveranceType"
        @create="createSeveranceType" @edit="editSeveranceType" :showIndexSeveranceType="showIndexSeveranceType"
        :showCreateSeveranceType="showCreateSeveranceType" :paginate="paginate"
        :showEditSeveranceType="showEditSeveranceType" :showSettingSeveranceType="showSettingSeveranceType"
        @closeModals="closeModals" @submitSeveranceTypeStore="submitSeveranceTypeStore"
        @submitSeveranceTypeUpdate="submitSeveranceTypeUpdate" @submitSeveranceTypeFind="submitSeveranceTypeFind"
        @submitSeveranceTypeDelete="submitSeveranceTypeDelete" @submitSeveranceTypeRestore="submitSeveranceTypeRestore"
        @submitSeveranceTypeSetting="submitSeveranceTypeSetting"
        :modelSeveranceTypeSettingValidation="modelSeveranceTypeSettingValidation" :countries="countries"
        :isEditingSeveranceTypeSettingValidation="isEditingSeveranceTypeSettingValidation" @clean="cleanFormValidation"
        @submitSeveranceTypeSettingValidationStore="submitSeveranceTypeSettingValidationStore"
        @submitSeveranceTypeSettingValidationUpdate="submitSeveranceTypeSettingValidationUpdate"
        @submitSeveranceTypeSettingValidationFind="submitSeveranceTypeSettingValidationFind"
        @submitSeveranceTypeSettingValidationDelete="submitSeveranceTypeSettingValidationDelete"
        @submitSeveranceTypeSettingValidationRestore="submitSeveranceTypeSettingValidationRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewSeveranceType from '@/components/templates/Internal/Setting/SeveranceType/SeveranceType.vue';

import ModelSeveranceType from '@/models/SeveranceType';

import SeveranceTypeService from '@/services/SeveranceTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const severanceTypes = ref([]);
const countries = ref([]);

const modelSeveranceType = ref(new ModelSeveranceType());
const modelSeveranceTypeSetting = ref(new ModelSeveranceType());

const formErrors = ref({});

const showIndexSeveranceType = ref(true);
const showCreateSeveranceType = ref(false);
const showEditSeveranceType = ref(false);
const showSettingSeveranceType = ref(false);

const loadingIndex = ref(false);

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

const paginate = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 5,
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
});

const submitCountryAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await CountryService.all();
        countries.value = response.data.countries;

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
        loadingIndex.value = false;
    }
};

const submitSeveranceTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await SeveranceTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        severanceTypes.value = response.data.severanceTypes;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
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
        loadingIndex.value = false;
    }
};

const submitSeveranceTypeFind = async (severanceTypeId) => {
    try {
        const response = await SeveranceTypeService.find(severanceTypeId);
        modelSeveranceType.value.id = response.data.severanceType.id;
        modelSeveranceType.value.name = response.data.severanceType.name;
        modelSeveranceType.value.description = response.data.severanceType.description;
        modelSeveranceType.value.settings = response.data.severanceType.settings;
        modelSeveranceType.value.relationships = response.data.severanceType.relationships;


    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
};

const submitSeveranceTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de cesantía?',
        message: 'Se creará el tipo de cesantía con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SeveranceTypeService.store(modelSeveranceType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            await submitSeveranceTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'severanceType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitSeveranceTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de cesantía?',
        message: 'Se actualizará el tipo de cesantía con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SeveranceTypeService.update(modelSeveranceType.value.id, modelSeveranceType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitSeveranceTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'severanceType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitSeveranceTypeToggle = async () => {
    try {
        const response = await SeveranceTypeService.toggle(modelSeveranceTypeSetting.value.id, modelSeveranceTypeSetting.value);

        modelSeveranceType.value.settings.validations = response.data.severanceType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'severanceTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitSeveranceTypeSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de cesantía?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de cesantía sin afectar su información existente.',
        confirmText: 'Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        if (isEmptyHtml(modelSeveranceType.value.settings.message)) {
            formErrors.value = {
                ...formErrors.value,
                severanceTypeSetting_message: ['Es requerido.']
            }
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return
        }
        try {
            const response = await SeveranceTypeService.setting(modelSeveranceType.value.id, modelSeveranceType.value);

            modelSeveranceType.value.settings = response.data.severanceType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
            indexSeveranceType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'severanceTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitSeveranceTypeDelete = async (severanceTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de cesantía?',
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
            const response = await SeveranceTypeService.delete(severanceTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de cesantía  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitSeveranceTypeAll();
        } catch (error) {
            const status = error?.error?.status || error?.status;
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({
                    title: status === 409 ? 'Acción no permitida' : 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: status === 409 ? 'warning' : 'danger'
                });
            }
        }
    }
};

const submitSeveranceTypeRestore = async (severanceTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de cesantía?',
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
            const response = await SeveranceTypeService.restore(severanceTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de cesantía  fue activado exitosamente.', type: 'success' });
            closeModals();
            await submitSeveranceTypeAll();
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
    }
};

function indexSeveranceType() {
    showIndexSeveranceType.value = true;
    showCreateSeveranceType.value = false;
    showEditSeveranceType.value = false;
    showSettingSeveranceType.value = false;
    cleanForm();
}

function createSeveranceType() {
    showIndexSeveranceType.value = true;
    showSettingSeveranceType.value = false;
    showCreateSeveranceType.value = true;
    showEditSeveranceType.value = false;
    cleanForm();
}

function editSeveranceType() {
    showIndexSeveranceType.value = true;
    showSettingSeveranceType.value = false;
    showCreateSeveranceType.value = false;
    showEditSeveranceType.value = true;
}

function settingSeveranceType() {
    showIndexSeveranceType.value = false;
    showSettingSeveranceType.value = true;
    showCreateSeveranceType.value = false;
    showEditSeveranceType.value = false;
}

const closeModals = () => {
    showCreateSeveranceType.value = false;
    showEditSeveranceType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelSeveranceType.value.id = null;
    modelSeveranceType.value.name = '';
    modelSeveranceType.value.description = '';
    modelSeveranceType.value.settings = {
        compensation_enabled: false,
        file_required: false,
        message: '',
        validations: []
    };
    modelSeveranceType.value.relationships = {};
    formErrors.value = {};
}

const isEmptyHtml = (html) => {
    const text = String(html || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()

    return text.length === 0
}

const settingValidationNextId = computed(() => {
    const validations = modelSeveranceType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelSeveranceTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingSeveranceTypeSettingValidation = computed(() => {
    const validations = modelSeveranceType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelSeveranceTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelSeveranceTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitSeveranceTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelSeveranceType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelSeveranceTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitSeveranceTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de cesantía?',
        message: 'Se creará la validación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        try {
            modelSeveranceTypeSetting.value = JSON.parse(JSON.stringify(modelSeveranceType.value))

            const modelSeveranceTypeSettingValidationCloned = {
                ...modelSeveranceTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelSeveranceTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelSeveranceTypeSetting.value.settings.validations.push(modelSeveranceTypeSettingValidationCloned);
            const response = await submitSeveranceTypeToggle()

            if (!response) {
                const idx = modelSeveranceTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelSeveranceTypeSettingValidationCloned.id)
                if (idx !== -1) modelSeveranceTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitSeveranceTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de cesantía?',
        message: 'Se actualizará la validación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        try {
            modelSeveranceTypeSetting.value = JSON.parse(JSON.stringify(modelSeveranceType.value))

            const idx = modelSeveranceTypeSetting.value.settings.validations.findIndex(v => v.id === modelSeveranceTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelSeveranceTypeSetting.value.settings.validations[idx] = {
                    ...modelSeveranceTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitSeveranceTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitSeveranceTypeSettingValidationDelete = async (id) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la validación?',
        message: 'Se suspenderá su uso en procesos activos, pero no se eliminará la información.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        modelSeveranceTypeSetting.value = JSON.parse(JSON.stringify(modelSeveranceType.value))

        const idx = modelSeveranceTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelSeveranceTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelSeveranceTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitSeveranceTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitSeveranceTypeSettingValidationRestore = async (id) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la validación?',
        message: 'La validación podrá volver a usarse en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        modelSeveranceTypeSetting.value = JSON.parse(JSON.stringify(modelSeveranceType.value))

        const idx = modelSeveranceTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelSeveranceTypeSetting.value.settings.validations[idx].deleted_at = null
            modelSeveranceTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitSeveranceTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Activación exitosa.', message: 'La validación fue restaurada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {

        const field = path.split('.').pop();

        const key = prefix
            ? `${prefix}_${field}`
            : field;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

onMounted(() => {
    submitCountryAll();
    submitSeveranceTypeAll();
})

watch(() => pagination.current_page, () => {
    submitSeveranceTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitSeveranceTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitSeveranceTypeAll();
    }
});

watch(() => paginate.current_page, () => {
    submitCountryAll();
});

watch(() => paginate.search, () => {
    if (paginate.current_page !== 1) {
        paginate.current_page = 1;
    } else {
        submitCountryAll();
    }
});

watch(() => paginate.per_page, () => {
    if (paginate.current_page !== 1) {
        paginate.current_page = 1;
    } else {
        submitCountryAll();
    }
});
</script>