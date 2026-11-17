<template>
    <ViewVacationType :modelVacationType="modelVacationType" :vacationTypes="vacationTypes" :pagination="pagination"
        @index="indexVacationType" @setting="settingVacationType" @create="createVacationType" @edit="editVacationType"
        :showIndexVacationType="showIndexVacationType" :showCreateVacationType="showCreateVacationType"
        :paginate="paginate" :showEditVacationType="showEditVacationType"
        :showSettingVacationType="showSettingVacationType" @closeModals="closeModals"
        @submitVacationTypeStore="submitVacationTypeStore" @submitVacationTypeUpdate="submitVacationTypeUpdate"
        @submitVacationTypeFind="submitVacationTypeFind" @submitVacationTypeDelete="submitVacationTypeDelete"
        @submitVacationTypeRestore="submitVacationTypeRestore" @submitVacationTypeSetting="submitVacationTypeSetting"
        :modelVacationTypeSettingValidation="modelVacationTypeSettingValidation" :countries="countries"
        :isEditingVacationTypeSettingValidation="isEditingVacationTypeSettingValidation" @clean="cleanFormValidation"
        @submitVacationTypeSettingValidationStore="submitVacationTypeSettingValidationStore"
        @submitVacationTypeSettingValidationUpdate="submitVacationTypeSettingValidationUpdate"
        @submitVacationTypeSettingValidationFind="submitVacationTypeSettingValidationFind"
        @submitVacationTypeSettingValidationDelete="submitVacationTypeSettingValidationDelete"
        @submitVacationTypeSettingValidationRestore="submitVacationTypeSettingValidationRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewVacationType from '@/components/templates/Internal/Setting/VacationType/VacationType.vue';

import ModelVacationType from '@/models/VacationType';

import VacationTypeService from '@/services/VacationTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const vacationTypes = ref([]);
const countries = ref([]);

const modelVacationType = ref(new ModelVacationType());
const modelVacationTypeSetting = ref(new ModelVacationType());

const formErrors = ref({});
const isSubmitting = ref(false);

const showIndexVacationType = ref(true);
const showCreateVacationType = ref(false);
const showEditVacationType = ref(false);
const showSettingVacationType = ref(false);

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

const submitVacationTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await VacationTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        vacationTypes.value = response.data.vacationTypes;

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

const submitVacationTypeFind = async (vacationTypeId) => {
    try {
        const response = await VacationTypeService.find(vacationTypeId);
        modelVacationType.value.id = response.data.vacationType.id;
        modelVacationType.value.name = response.data.vacationType.name;
        modelVacationType.value.description = response.data.vacationType.description;
        modelVacationType.value.settings = response.data.vacationType.settings;
        modelVacationType.value.relationships = response.data.vacationType.relationships;


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

const submitVacationTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de vacaciones?',
        message: 'Se creará el tipo de vacaciones con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await VacationTypeService.store(modelVacationType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            await submitVacationTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'vacationType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitVacationTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de vacaciones?',
        message: 'Se actualizará el tipo de vacaciones con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await VacationTypeService.update(modelVacationType.value.id, modelVacationType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitVacationTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'vacationType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitVacationTypeToggle = async () => {
    try {
        const response = await VacationTypeService.toggle(modelVacationTypeSetting.value.id, modelVacationTypeSetting.value);

        modelVacationType.value.settings.validations = response.data.vacationType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'vacationTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitVacationTypeSetting = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const type = modelVacationType.value?.settings?.field_type || '';
    const message = modelVacationType.value?.settings?.message || '';
    if (type === 'numeric' && (message.includes(':start_date') || message.includes(':end_date'))) {
        alertStore.addAlert({
            title: 'Advertencia',
            message: 'La plantilla contiene rango de fechas [Fecha inicio] y [Fecha fin] para vacaciones con "tipo de solicitud" por días. Revise la configuración antes de guardar.',
            type: 'warning'
        });
        return;
    } else if (type === 'date_range' && message.includes(':days')) {
        alertStore.addAlert({
            title: 'Advertencia',
            message: 'La plantilla contiene cantidad de días [Días] para vacaciones con "tipo de solicitud" por rango de fechas. Revise la configuración antes de guardar.',
            type: 'warning'
        });
        return;
    }
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de vacaciones?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de vacaciones sin afectar su información existente.',
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        if (isEmptyHtml(modelVacationType.value.settings.message)) {
            formErrors.value = {
                ...formErrors.value,
                vacationTypeSetting_message: ['Es requerido.']
            }
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return
        }
        try {
            const response = await VacationTypeService.setting(modelVacationType.value.id, modelVacationType.value);

            modelVacationType.value.settings = response.data.vacationType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
            indexVacationType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'vacationTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitVacationTypeDelete = async (vacationTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de vacaciones?',
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
            const response = await VacationTypeService.delete(vacationTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitVacationTypeAll();
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

const submitVacationTypeRestore = async (vacationTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de vacaciones?',
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
            const response = await VacationTypeService.restore(vacationTypeId);

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
            await submitVacationTypeAll();
        }
    }
};

function indexVacationType() {
    showIndexVacationType.value = true;
    showCreateVacationType.value = false;
    showEditVacationType.value = false;
    showSettingVacationType.value = false;
    cleanForm();
}

function createVacationType() {
    showIndexVacationType.value = true;
    showSettingVacationType.value = false;
    showCreateVacationType.value = true;
    showEditVacationType.value = false;
    cleanForm();
}

function editVacationType() {
    showIndexVacationType.value = true;
    showSettingVacationType.value = false;
    showCreateVacationType.value = false;
    showEditVacationType.value = true;
}

function settingVacationType() {
    showIndexVacationType.value = false;
    showSettingVacationType.value = true;
    showCreateVacationType.value = false;
    showEditVacationType.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateVacationType.value = false;
    showEditVacationType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelVacationType.value.id = null;
    modelVacationType.value.name = '';
    modelVacationType.value.description = '';
    modelVacationType.value.settings = {
        field_type: '',
        message: '',
        validations: []
    };
    modelVacationType.value.relationships = {};
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
    const validations = modelVacationType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelVacationTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    minimum_days: null,
    prerequisite: false,
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingVacationTypeSettingValidation = computed(() => {
    const validations = modelVacationType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelVacationTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelVacationTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        minimum_days: null,
        prerequisite: false,
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitVacationTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelVacationType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelVacationTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitVacationTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de vacaciones?',
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
            modelVacationTypeSetting.value = JSON.parse(JSON.stringify(modelVacationType.value))

            const modelVacationTypeSettingValidationCloned = {
                ...modelVacationTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelVacationTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelVacationTypeSetting.value.settings.validations.push(modelVacationTypeSettingValidationCloned);
            const response = await submitVacationTypeToggle()

            if (!response) {
                const idx = modelVacationTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelVacationTypeSettingValidationCloned.id)
                if (idx !== -1) modelVacationTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitVacationTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de vacaciones?',
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
            modelVacationTypeSetting.value = JSON.parse(JSON.stringify(modelVacationType.value))

            const idx = modelVacationTypeSetting.value.settings.validations.findIndex(v => v.id === modelVacationTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelVacationTypeSetting.value.settings.validations[idx] = {
                    ...modelVacationTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitVacationTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitVacationTypeSettingValidationDelete = async (id) => {
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
        modelVacationTypeSetting.value = JSON.parse(JSON.stringify(modelVacationType.value))

        const idx = modelVacationTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelVacationTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelVacationTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitVacationTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitVacationTypeSettingValidationRestore = async (id) => {
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
        modelVacationTypeSetting.value = JSON.parse(JSON.stringify(modelVacationType.value))

        const idx = modelVacationTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelVacationTypeSetting.value.settings.validations[idx].deleted_at = null
            modelVacationTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitVacationTypeToggle();
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
    submitVacationTypeAll();
})

watch(() => pagination.current_page, () => {
    submitVacationTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitVacationTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitVacationTypeAll();
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