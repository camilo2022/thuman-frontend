<template>
    <ViewAbsenceType :modelAbsenceType="modelAbsenceType" :absenceTypes="absenceTypes" :pagination="pagination"
        @index="indexAbsenceType" @setting="settingAbsenceType" @create="createAbsenceType" @edit="editAbsenceType"
        :showIndexAbsenceType="showIndexAbsenceType" :showCreateAbsenceType="showCreateAbsenceType" :paginate="paginate"
        :showEditAbsenceType="showEditAbsenceType" :showSettingAbsenceType="showSettingAbsenceType"
        @closeModals="closeModals" @submitAbsenceTypeStore="submitAbsenceTypeStore"
        @submitAbsenceTypeUpdate="submitAbsenceTypeUpdate" @submitAbsenceTypeFind="submitAbsenceTypeFind"
        @submitAbsenceTypeDelete="submitAbsenceTypeDelete" @submitAbsenceTypeRestore="submitAbsenceTypeRestore"
        @submitAbsenceTypeSetting="submitAbsenceTypeSetting"
        :modelAbsenceTypeSettingValidation="modelAbsenceTypeSettingValidation" :countries="countries"
        :isEditingAbsenceTypeSettingValidation="isEditingAbsenceTypeSettingValidation" @clean="cleanFormValidation"
        @submitAbsenceTypeSettingValidationStore="submitAbsenceTypeSettingValidationStore"
        @submitAbsenceTypeSettingValidationUpdate="submitAbsenceTypeSettingValidationUpdate"
        @submitAbsenceTypeSettingValidationFind="submitAbsenceTypeSettingValidationFind"
        @submitAbsenceTypeSettingValidationDelete="submitAbsenceTypeSettingValidationDelete"
        @submitAbsenceTypeSettingValidationRestore="submitAbsenceTypeSettingValidationRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewAbsenceType from '@/components/templates/Internal/Setting/AbsenceType/AbsenceType.vue';

import ModelAbsenceType from '@/models/AbsenceType';

import AbsenceTypeService from '@/services/AbsenceTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const absenceTypes = ref([]);
const countries = ref([]);

const modelAbsenceType = ref(new ModelAbsenceType());
const modelAbsenceTypeSetting = ref(new ModelAbsenceType());

const formErrors = ref({});

const showIndexAbsenceType = ref(true);
const showCreateAbsenceType = ref(false);
const showEditAbsenceType = ref(false);
const showSettingAbsenceType = ref(false);

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

const submitAbsenceTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await AbsenceTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        absenceTypes.value = response.data.absenceTypes;

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

const submitAbsenceTypeFind = async (absenceTypeId) => {
    try {
        const response = await AbsenceTypeService.find(absenceTypeId);
        modelAbsenceType.value.id = response.data.absenceType.id;
        modelAbsenceType.value.name = response.data.absenceType.name;
        modelAbsenceType.value.description = response.data.absenceType.description;
        modelAbsenceType.value.settings = response.data.absenceType.settings;
        modelAbsenceType.value.relationships = response.data.absenceType.relationships;


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

const submitAbsenceTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de permiso?',
        message: 'Se creará el tipo de permiso con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AbsenceTypeService.store(modelAbsenceType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            indexAbsenceType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'absenceType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAbsenceTypeAll();
        }
    }
};

const submitAbsenceTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de permiso?',
        message: 'Se actualizará el tipo de permiso con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await AbsenceTypeService.update(modelAbsenceType.value.id, modelAbsenceType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'absenceType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitAbsenceTypeAll();
        }
    }
};

const submitAbsenceTypeToggle = async () => {
    try {
        const response = await AbsenceTypeService.toggle(modelAbsenceTypeSetting.value.id, modelAbsenceTypeSetting.value);

        modelAbsenceType.value.settings.validations = response.data.absenceType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'absenceTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitAbsenceTypeSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de permiso?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de permiso sin afectar su información existente.',
        confirmText: 'Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        if (isEmptyHtml(modelAbsenceType.value.settings.message)) {
            formErrors.value = {
                ...formErrors.value,
                absenceTypeSetting_message: ['Es requerido.']
            }
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return
        }
        try {
            const response = await AbsenceTypeService.setting(modelAbsenceType.value.id, modelAbsenceType.value);

            modelAbsenceType.value.settings = response.data.absenceType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
            indexAbsenceType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'absenceTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitAbsenceTypeDelete = async (absenceTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de permiso?',
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
            const response = await AbsenceTypeService.delete(absenceTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de permiso fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitAbsenceTypeAll();
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

const submitAbsenceTypeRestore = async (absenceTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de permiso?',
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
            const response = await AbsenceTypeService.restore(absenceTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de permiso fue activado exitosamente.', type: 'success' });
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
            await submitAbsenceTypeAll();
        }
    }
};

function indexAbsenceType() {
    showIndexAbsenceType.value = true;
    showCreateAbsenceType.value = false;
    showEditAbsenceType.value = false;
    showSettingAbsenceType.value = false;
    cleanForm();
}

function createAbsenceType() {
    showIndexAbsenceType.value = true;
    showSettingAbsenceType.value = false;
    showCreateAbsenceType.value = true;
    showEditAbsenceType.value = false;
    cleanForm();
}

function editAbsenceType() {
    showIndexAbsenceType.value = true;
    showSettingAbsenceType.value = false;
    showCreateAbsenceType.value = false;
    showEditAbsenceType.value = true;
}

function settingAbsenceType() {
    showIndexAbsenceType.value = false;
    showSettingAbsenceType.value = true;
    showCreateAbsenceType.value = false;
    showEditAbsenceType.value = false;
}

const closeModals = () => {
    showCreateAbsenceType.value = false;
    showEditAbsenceType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelAbsenceType.value.id = null;
    modelAbsenceType.value.name = '';
    modelAbsenceType.value.description = '';
    modelAbsenceType.value.settings = {
        compensation_enabled: false,
        file_required: false,
        message: '',
        validations: []
    };
    modelAbsenceType.value.relationships = {};
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
    const validations = modelAbsenceType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelAbsenceTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingAbsenceTypeSettingValidation = computed(() => {
    const validations = modelAbsenceType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelAbsenceTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelAbsenceTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitAbsenceTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelAbsenceType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelAbsenceTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitAbsenceTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar La validación al tipo de permiso?',
        message: 'Se creará la validación con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        try {
            modelAbsenceTypeSetting.value = JSON.parse(JSON.stringify(modelAbsenceType.value))

            const modelAbsenceTypeSettingValidationCloned = {
                ...modelAbsenceTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelAbsenceTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelAbsenceTypeSetting.value.settings.validations.push(modelAbsenceTypeSettingValidationCloned);
            const response = await submitAbsenceTypeToggle()

            if (!response) {
                const idx = modelAbsenceTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelAbsenceTypeSettingValidationCloned.id)
                if (idx !== -1) modelAbsenceTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitAbsenceTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de permiso?',
        message: 'Se actualizará la validación con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        try {
            modelAbsenceTypeSetting.value = JSON.parse(JSON.stringify(modelAbsenceType.value))

            const idx = modelAbsenceTypeSetting.value.settings.validations.findIndex(v => v.id === modelAbsenceTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelAbsenceTypeSetting.value.settings.validations[idx] = {
                    ...modelAbsenceTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitAbsenceTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitAbsenceTypeSettingValidationDelete = async (id) => {
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
        modelAbsenceTypeSetting.value = JSON.parse(JSON.stringify(modelAbsenceType.value))

        const idx = modelAbsenceTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelAbsenceTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelAbsenceTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitAbsenceTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitAbsenceTypeSettingValidationRestore = async (id) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar La validación?',
        message: 'La validación podrá volver a usarse en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        modelAbsenceTypeSetting.value = JSON.parse(JSON.stringify(modelAbsenceType.value))

        const idx = modelAbsenceTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelAbsenceTypeSetting.value.settings.validations[idx].deleted_at = null
            modelAbsenceTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitAbsenceTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Activación exitosa.', message: 'La validación fue activada exitosamente.', type: 'success' })
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
    submitAbsenceTypeAll();
})

watch(() => pagination.current_page, () => {
    submitAbsenceTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAbsenceTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitAbsenceTypeAll();
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