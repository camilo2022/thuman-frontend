<template>
    <ViewLicenseType :modelLicenseType="modelLicenseType" :licenseTypes="licenseTypes" :pagination="pagination"
        @index="indexLicenseType" @setting="settingLicenseType" @create="createLicenseType" @edit="editLicenseType"
        :showIndexLicenseType="showIndexLicenseType" :showCreateLicenseType="showCreateLicenseType" :paginate="paginate"
        :showEditLicenseType="showEditLicenseType" :showSettingLicenseType="showSettingLicenseType"
        @closeModals="closeModals" @submitLicenseTypeStore="submitLicenseTypeStore"
        @submitLicenseTypeUpdate="submitLicenseTypeUpdate" @submitLicenseTypeFind="submitLicenseTypeFind"
        @submitLicenseTypeDelete="submitLicenseTypeDelete" @submitLicenseTypeRestore="submitLicenseTypeRestore"
        @submitLicenseTypeSetting="submitLicenseTypeSetting"
        :modelLicenseTypeSettingValidation="modelLicenseTypeSettingValidation" :countries="countries"
        :isEditingLicenseTypeSettingValidation="isEditingLicenseTypeSettingValidation" @clean="cleanFormValidation"
        @submitLicenseTypeSettingValidationStore="submitLicenseTypeSettingValidationStore"
        @submitLicenseTypeSettingValidationUpdate="submitLicenseTypeSettingValidationUpdate"
        @submitLicenseTypeSettingValidationFind="submitLicenseTypeSettingValidationFind"
        @submitLicenseTypeSettingValidationDelete="submitLicenseTypeSettingValidationDelete"
        @submitLicenseTypeSettingValidationRestore="submitLicenseTypeSettingValidationRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewLicenseType from '@/components/templates/Internal/Setting/LicenseType/LicenseType.vue';

import ModelLicenseType from '@/models/LicenseType';

import LicenseTypeService from '@/services/LicenseTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const licenseTypes = ref([]);
const countries = ref([]);

const modelLicenseType = ref(new ModelLicenseType());
const modelLicenseTypeSetting = ref(new ModelLicenseType());

const formErrors = ref({});

const showIndexLicenseType = ref(true);
const showCreateLicenseType = ref(false);
const showEditLicenseType = ref(false);
const showSettingLicenseType = ref(false);

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

const submitLicenseTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await LicenseTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        licenseTypes.value = response.data.licenseTypes;

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

const submitLicenseTypeFind = async (licenseTypeId) => {
    try {
        const response = await LicenseTypeService.find(licenseTypeId);
        modelLicenseType.value.id = response.data.licenseType.id;
        modelLicenseType.value.name = response.data.licenseType.name;
        modelLicenseType.value.description = response.data.licenseType.description;
        modelLicenseType.value.settings = response.data.licenseType.settings;
        modelLicenseType.value.relationships = response.data.licenseType.relationships;


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

const submitLicenseTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de licencia?',
        message: 'Se creará el tipo de licencia con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await LicenseTypeService.store(modelLicenseType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            await submitLicenseTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'licenseType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitLicenseTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de licencia?',
        message: 'Se actualizará el tipo de licencia con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await LicenseTypeService.update(modelLicenseType.value.id, modelLicenseType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitLicenseTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'licenseType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitLicenseTypeToggle = async () => {
    try {
        const response = await LicenseTypeService.toggle(modelLicenseTypeSetting.value.id, modelLicenseTypeSetting.value);

        modelLicenseType.value.settings.validations = response.data.licenseType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'licenseTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitLicenseTypeSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de licencia?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de licencia sin afectar su información existente.',
        confirmText: 'Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        if (isEmptyHtml(modelLicenseType.value.settings.message)) {
            formErrors.value = {
                ...formErrors.value,
                licenseTypeSetting_message: ['Es requerido.']
            }
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return
        }
        try {
            const response = await LicenseTypeService.setting(modelLicenseType.value.id, modelLicenseType.value);

            modelLicenseType.value.settings = response.data.licenseType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
            indexLicenseType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'licenseTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitLicenseTypeDelete = async (licenseTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de licencia?',
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
            const response = await LicenseTypeService.delete(licenseTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de licencia  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitLicenseTypeAll();
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

const submitLicenseTypeRestore = async (licenseTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de licencia?',
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
            const response = await LicenseTypeService.restore(licenseTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de licencia  fue activado exitosamente.', type: 'success' });
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
            await submitLicenseTypeAll();
        }
    }
};

function indexLicenseType() {
    showIndexLicenseType.value = true;
    showCreateLicenseType.value = false;
    showEditLicenseType.value = false;
    showSettingLicenseType.value = false;
    cleanForm();
}

function createLicenseType() {
    showIndexLicenseType.value = true;
    showSettingLicenseType.value = false;
    showCreateLicenseType.value = true;
    showEditLicenseType.value = false;
    cleanForm();
}

function editLicenseType() {
    showIndexLicenseType.value = true;
    showSettingLicenseType.value = false;
    showCreateLicenseType.value = false;
    showEditLicenseType.value = true;
}

function settingLicenseType() {
    showIndexLicenseType.value = false;
    showSettingLicenseType.value = true;
    showCreateLicenseType.value = false;
    showEditLicenseType.value = false;
}

const closeModals = () => {
    showCreateLicenseType.value = false;
    showEditLicenseType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelLicenseType.value.id = null;
    modelLicenseType.value.name = '';
    modelLicenseType.value.description = '';
    modelLicenseType.value.settings = {
        compensation_enabled: false,
        file_required: false,
        message: '',
        validations: []
    };
    modelLicenseType.value.relationships = {};
    formErrors.value = {};
}

const settingValidationNextId = computed(() => {
    const validations = modelLicenseType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelLicenseTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingLicenseTypeSettingValidation = computed(() => {
    const validations = modelLicenseType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelLicenseTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelLicenseTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitLicenseTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelLicenseType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelLicenseTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitLicenseTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de licencia?',
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
            modelLicenseTypeSetting.value = JSON.parse(JSON.stringify(modelLicenseType.value))

            const modelLicenseTypeSettingValidationCloned = {
                ...modelLicenseTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelLicenseTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelLicenseTypeSetting.value.settings.validations.push(modelLicenseTypeSettingValidationCloned);
            const response = await submitLicenseTypeToggle()

            if (!response) {
                const idx = modelLicenseTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelLicenseTypeSettingValidationCloned.id)
                if (idx !== -1) modelLicenseTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitLicenseTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de licencia?',
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
            modelLicenseTypeSetting.value = JSON.parse(JSON.stringify(modelLicenseType.value))

            const idx = modelLicenseTypeSetting.value.settings.validations.findIndex(v => v.id === modelLicenseTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelLicenseTypeSetting.value.settings.validations[idx] = {
                    ...modelLicenseTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitLicenseTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitLicenseTypeSettingValidationDelete = async (id) => {
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
        modelLicenseTypeSetting.value = JSON.parse(JSON.stringify(modelLicenseType.value))

        const idx = modelLicenseTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelLicenseTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelLicenseTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitLicenseTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitLicenseTypeSettingValidationRestore = async (id) => {
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
        modelLicenseTypeSetting.value = JSON.parse(JSON.stringify(modelLicenseType.value))

        const idx = modelLicenseTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelLicenseTypeSetting.value.settings.validations[idx].deleted_at = null
            modelLicenseTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitLicenseTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Activación exitosa.', message: 'La validación fue activada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const isEmptyHtml = (html) => {
    const text = String(html || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()

    return text.length === 0
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
    submitLicenseTypeAll();
})

watch(() => pagination.current_page, () => {
    submitLicenseTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitLicenseTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitLicenseTypeAll();
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