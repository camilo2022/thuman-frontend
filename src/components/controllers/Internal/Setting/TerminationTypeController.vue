<template>
    <ViewTerminationType :modelTerminationType="modelTerminationType" :terminationTypes="terminationTypes"
        :pagination="pagination" @index="indexTerminationType" @setting="settingTerminationType"
        @create="createTerminationType" @edit="editTerminationType" :showIndexTerminationType="showIndexTerminationType"
        :showCreateTerminationType="showCreateTerminationType" :paginate="paginate"
        :showEditTerminationType="showEditTerminationType" :showSettingTerminationType="showSettingTerminationType"
        @closeModals="closeModals" @submitTerminationTypeStore="submitTerminationTypeStore"
        @submitTerminationTypeUpdate="submitTerminationTypeUpdate"
        @submitTerminationTypeFind="submitTerminationTypeFind"
        @submitTerminationTypeDelete="submitTerminationTypeDelete"
        @submitTerminationTypeRestore="submitTerminationTypeRestore"
        @submitTerminationTypeSetting="submitTerminationTypeSetting"
        :modelTerminationTypeSettingValidation="modelTerminationTypeSettingValidation" :countries="countries"
        :isEditingTerminationTypeSettingValidation="isEditingTerminationTypeSettingValidation"
        @clean="cleanFormValidation"
        @submitTerminationTypeSettingValidationStore="submitTerminationTypeSettingValidationStore"
        @submitTerminationTypeSettingValidationUpdate="submitTerminationTypeSettingValidationUpdate"
        @submitTerminationTypeSettingValidationFind="submitTerminationTypeSettingValidationFind"
        @submitTerminationTypeSettingValidationDelete="submitTerminationTypeSettingValidationDelete"
        @submitTerminationTypeSettingValidationRestore="submitTerminationTypeSettingValidationRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewTerminationType from '@/components/templates/Internal/Setting/TerminationType/TerminationType.vue';

import ModelTerminationType from '@/models/TerminationType';

import TerminationTypeService from '@/services/TerminationTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const terminationTypes = ref([]);
const countries = ref([]);

const modelTerminationType = ref(new ModelTerminationType());
const modelTerminationTypeSetting = ref(new ModelTerminationType());

const formErrors = ref({});

const showIndexTerminationType = ref(true);
const showCreateTerminationType = ref(false);
const showEditTerminationType = ref(false);
const showSettingTerminationType = ref(false);

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

const submitTerminationTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await TerminationTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        terminationTypes.value = response.data.terminationTypes;

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

const submitTerminationTypeFind = async (terminationTypeId) => {
    try {
        const response = await TerminationTypeService.find(terminationTypeId);
        modelTerminationType.value.id = response.data.terminationType.id;
        modelTerminationType.value.name = response.data.terminationType.name;
        modelTerminationType.value.description = response.data.terminationType.description;
        modelTerminationType.value.settings = response.data.terminationType.settings;
        modelTerminationType.value.relationships = response.data.terminationType.relationships;


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

const submitTerminationTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de terminación de contrato?',
        message: 'Se creará el tipo de terminación de contrato con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TerminationTypeService.store(modelTerminationType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            await submitTerminationTypeAll();
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'terminationType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitTerminationTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de terminación de contrato?',
        message: 'Se actualizará el tipo de terminación de contrato con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await TerminationTypeService.update(modelTerminationType.value.id, modelTerminationType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            await submitTerminationTypeAll();
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'terminationType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitTerminationTypeToggle = async () => {
    try {
        const response = await TerminationTypeService.toggle(modelTerminationTypeSetting.value.id, modelTerminationTypeSetting.value);

        modelTerminationType.value.settings.validations = response.data.terminationType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'terminationTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitTerminationTypeSetting = async () => {
    const message = modelTerminationType.value?.settings?.message || '';
    const requiredReason = modelTerminationType.value?.settings?.reason_required || false;
    if (requiredReason && !message.includes(':reason_name')) {
        alertStore.addAlert({
            title: 'Advertencia',
            message: 'La plantilla requiere la motivo, pero no fue encontrada. Agregue la variable [Motivo] antes de guardar.',
            type: 'warning'
        });
        return;
    } else if (!requiredReason && message.includes(':reason_name')) {
        alertStore.addAlert({
            title: 'Advertencia',
            message: 'La plantilla contiene la variable [Motivo], pero el tipo de terminación de contrato seleccionado no requiere motivo. Revise la configuración antes de guardar.',
            type: 'warning'
        });
        return;
    }
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de terminación de contrato?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de terminación de contrato sin afectar su información existente.',
        confirmText: 'Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        if (isEmptyHtml(modelTerminationType.value.settings.message)) {
            formErrors.value = {
                ...formErrors.value,
                terminationTypeSetting_message: ['Es requerido.']
            }
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return
        }
        try {
            const response = await TerminationTypeService.setting(modelTerminationType.value.id, modelTerminationType.value);

            modelTerminationType.value.settings = response.data.terminationType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
            submitTerminationTypeAll();
            indexTerminationType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'terminationTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitTerminationTypeDelete = async (terminationTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de terminación de contrato?',
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
            const response = await TerminationTypeService.delete(terminationTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de terminación de contrato fue inactivado exitosamente.', type: 'success' });
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
            await submitTerminationTypeAll();
        }
    }
};

const submitTerminationTypeRestore = async (terminationTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de terminación de contrato?',
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
            const response = await TerminationTypeService.restore(terminationTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de terminación de contrato fue activado exitosamente.', type: 'success' });
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
            await submitTerminationTypeAll();
        }
    }
};

function indexTerminationType() {
    showIndexTerminationType.value = true;
    showCreateTerminationType.value = false;
    showEditTerminationType.value = false;
    showSettingTerminationType.value = false;
    cleanForm();
}

function createTerminationType() {
    showIndexTerminationType.value = true;
    showSettingTerminationType.value = false;
    showCreateTerminationType.value = true;
    showEditTerminationType.value = false;
    cleanForm();
}

function editTerminationType() {
    showIndexTerminationType.value = true;
    showSettingTerminationType.value = false;
    showCreateTerminationType.value = false;
    showEditTerminationType.value = true;
}

function settingTerminationType() {
    showIndexTerminationType.value = false;
    showSettingTerminationType.value = true;
    showCreateTerminationType.value = false;
    showEditTerminationType.value = false;
}

const closeModals = () => {
    showCreateTerminationType.value = false;
    showEditTerminationType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelTerminationType.value.id = null;
    modelTerminationType.value.name = '';
    modelTerminationType.value.description = '';
    modelTerminationType.value.settings = {
        file_required: false,
        message: '',
        validations: []
    };
    modelTerminationType.value.relationships = {};
    formErrors.value = {};
}

const settingValidationNextId = computed(() => {
    const validations = modelTerminationType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelTerminationTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingTerminationTypeSettingValidation = computed(() => {
    const validations = modelTerminationType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelTerminationTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelTerminationTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitTerminationTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelTerminationType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelTerminationTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitTerminationTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de terminación de contrato?',
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
            modelTerminationTypeSetting.value = JSON.parse(JSON.stringify(modelTerminationType.value))

            const modelTerminationTypeSettingValidationCloned = {
                ...modelTerminationTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelTerminationTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelTerminationTypeSetting.value.settings.validations.push(modelTerminationTypeSettingValidationCloned);
            const response = await submitTerminationTypeToggle()

            if (!response) {
                const idx = modelTerminationTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelTerminationTypeSettingValidationCloned.id)
                if (idx !== -1) modelTerminationTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitTerminationTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de terminación de contrato?',
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
            modelTerminationTypeSetting.value = JSON.parse(JSON.stringify(modelTerminationType.value))

            const idx = modelTerminationTypeSetting.value.settings.validations.findIndex(v => v.id === modelTerminationTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelTerminationTypeSetting.value.settings.validations[idx] = {
                    ...modelTerminationTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitTerminationTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitTerminationTypeSettingValidationDelete = async (id) => {
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
        modelTerminationTypeSetting.value = JSON.parse(JSON.stringify(modelTerminationType.value))

        const idx = modelTerminationTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelTerminationTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelTerminationTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitTerminationTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitTerminationTypeSettingValidationRestore = async (id) => {
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
        modelTerminationTypeSetting.value = JSON.parse(JSON.stringify(modelTerminationType.value))

        const idx = modelTerminationTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelTerminationTypeSetting.value.settings.validations[idx].deleted_at = null
            modelTerminationTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitTerminationTypeToggle();
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

const isEmptyHtml = (html) => {
    const text = String(html || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()

    return text.length === 0
}

onMounted(() => {
    submitCountryAll();
    submitTerminationTypeAll();
})

watch(() => pagination.current_page, () => {
    submitTerminationTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTerminationTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitTerminationTypeAll();
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