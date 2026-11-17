|<template>
    <ViewDisabilityType :modelDisabilityType="modelDisabilityType" :disabilityTypes="disabilityTypes"
        :pagination="pagination" @index="indexDisabilityType" @setting="settingDisabilityType"
        @create="createDisabilityType" @edit="editDisabilityType" :showIndexDisabilityType="showIndexDisabilityType"
        :showCreateDisabilityType="showCreateDisabilityType" :paginate="paginate"
        :showEditDisabilityType="showEditDisabilityType" :showSettingDisabilityType="showSettingDisabilityType"
        @closeModals="closeModals" @submitDisabilityTypeStore="submitDisabilityTypeStore"
        @submitDisabilityTypeUpdate="submitDisabilityTypeUpdate" @submitDisabilityTypeFind="submitDisabilityTypeFind"
        @submitDisabilityTypeDelete="submitDisabilityTypeDelete"
        @submitDisabilityTypeRestore="submitDisabilityTypeRestore"
        @submitDisabilityTypeSetting="submitDisabilityTypeSetting"
        :modelDisabilityTypeSettingValidation="modelDisabilityTypeSettingValidation" :countries="countries"
        :isEditingDisabilityTypeSettingValidation="isEditingDisabilityTypeSettingValidation"
        @clean="cleanFormValidation"
        @submitDisabilityTypeSettingValidationStore="submitDisabilityTypeSettingValidationStore"
        @submitDisabilityTypeSettingValidationUpdate="submitDisabilityTypeSettingValidationUpdate"
        @submitDisabilityTypeSettingValidationFind="submitDisabilityTypeSettingValidationFind"
        @submitDisabilityTypeSettingValidationDelete="submitDisabilityTypeSettingValidationDelete"
        @submitDisabilityTypeSettingValidationRestore="submitDisabilityTypeSettingValidationRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewDisabilityType from '@/components/templates/Internal/Setting/DisabilityType/DisabilityType.vue';

import ModelDisabilityType from '@/models/DisabilityType';

import DisabilityTypeService from '@/services/DisabilityTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const disabilityTypes = ref([]);
const countries = ref([]);

const modelDisabilityType = ref(new ModelDisabilityType());
const modelDisabilityTypeSetting = ref(new ModelDisabilityType());

const formErrors = ref({});

const showIndexDisabilityType = ref(true);
const showCreateDisabilityType = ref(false);
const showEditDisabilityType = ref(false);
const showSettingDisabilityType = ref(false);

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

const submitDisabilityTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await DisabilityTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        disabilityTypes.value = response.data.disabilityTypes;

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

const submitDisabilityTypeFind = async (disabilityTypeId) => {
    try {
        const response = await DisabilityTypeService.find(disabilityTypeId);
        modelDisabilityType.value.id = response.data.disabilityType.id;
        modelDisabilityType.value.name = response.data.disabilityType.name;
        modelDisabilityType.value.description = response.data.disabilityType.description;
        modelDisabilityType.value.settings = response.data.disabilityType.settings;
        modelDisabilityType.value.relationships = response.data.disabilityType.relationships;


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

const submitDisabilityTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de incapacidad?',
        message: 'Se creará el tipo de incapacidad con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await DisabilityTypeService.store(modelDisabilityType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            await submitDisabilityTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'disabilityType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitDisabilityTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de incapacidad?',
        message: 'Se actualizará el tipo de incapacidad con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await DisabilityTypeService.update(modelDisabilityType.value.id, modelDisabilityType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitDisabilityTypeAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'disabilityType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitDisabilityTypeToggle = async () => {
    try {
        const response = await DisabilityTypeService.toggle(modelDisabilityTypeSetting.value.id, modelDisabilityTypeSetting.value);

        modelDisabilityType.value.settings.validations = response.data.disabilityType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'disabilityTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitDisabilityTypeSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de incapacidad?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de incapacidad sin afectar su información existente.',
        confirmText: 'Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        if (isEmptyHtml(modelDisabilityType.value.settings.message)) {
            formErrors.value = {
                ...formErrors.value,
                disabilityTypeSetting_message: ['Es requerido.']
            }
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            return
        }
        try {
            const response = await DisabilityTypeService.setting(modelDisabilityType.value.id, modelDisabilityType.value);

            modelDisabilityType.value.settings = response.data.disabilityType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
            indexDisabilityType();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'disabilityTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitDisabilityTypeDelete = async (disabilityTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de incapacidad?',
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
            const response = await DisabilityTypeService.delete(disabilityTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de incapacidad  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitDisabilityTypeAll();
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

const submitDisabilityTypeRestore = async (disabilityTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de incapacidad?',
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
            const response = await DisabilityTypeService.restore(disabilityTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de incapacidad  fue activado exitosamente.', type: 'success' });
            closeModals();
            await submitDisabilityTypeAll();
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

function indexDisabilityType() {
    showIndexDisabilityType.value = true;
    showCreateDisabilityType.value = false;
    showEditDisabilityType.value = false;
    showSettingDisabilityType.value = false;
    cleanForm();
}

function createDisabilityType() {
    showIndexDisabilityType.value = true;
    showSettingDisabilityType.value = false;
    showCreateDisabilityType.value = true;
    showEditDisabilityType.value = false;
    cleanForm();
}

function editDisabilityType() {
    showIndexDisabilityType.value = true;
    showSettingDisabilityType.value = false;
    showCreateDisabilityType.value = false;
    showEditDisabilityType.value = true;
}

function settingDisabilityType() {
    showIndexDisabilityType.value = false;
    showSettingDisabilityType.value = true;
    showCreateDisabilityType.value = false;
    showEditDisabilityType.value = false;
}

const closeModals = () => {
    showCreateDisabilityType.value = false;
    showEditDisabilityType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelDisabilityType.value.id = null;
    modelDisabilityType.value.name = '';
    modelDisabilityType.value.description = '';
    modelDisabilityType.value.settings = {
        compensation_enabled: false,
        file_required: false,
        message: '',
        validations: []
    };
    modelDisabilityType.value.relationships = {};
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
    const validations = modelDisabilityType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelDisabilityTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingDisabilityTypeSettingValidation = computed(() => {
    const validations = modelDisabilityType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelDisabilityTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelDisabilityTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitDisabilityTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelDisabilityType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelDisabilityTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitDisabilityTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de incapacidad?',
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
            modelDisabilityTypeSetting.value = JSON.parse(JSON.stringify(modelDisabilityType.value))

            const modelDisabilityTypeSettingValidationCloned = {
                ...modelDisabilityTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelDisabilityTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelDisabilityTypeSetting.value.settings.validations.push(modelDisabilityTypeSettingValidationCloned);
            const response = await submitDisabilityTypeToggle()

            if (!response) {
                const idx = modelDisabilityTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelDisabilityTypeSettingValidationCloned.id)
                if (idx !== -1) modelDisabilityTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitDisabilityTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de incapacidad?',
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
            modelDisabilityTypeSetting.value = JSON.parse(JSON.stringify(modelDisabilityType.value))

            const idx = modelDisabilityTypeSetting.value.settings.validations.findIndex(v => v.id === modelDisabilityTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelDisabilityTypeSetting.value.settings.validations[idx] = {
                    ...modelDisabilityTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitDisabilityTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitDisabilityTypeSettingValidationDelete = async (id) => {
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
        modelDisabilityTypeSetting.value = JSON.parse(JSON.stringify(modelDisabilityType.value))

        const idx = modelDisabilityTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelDisabilityTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelDisabilityTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitDisabilityTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitDisabilityTypeSettingValidationRestore = async (id) => {
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
        modelDisabilityTypeSetting.value = JSON.parse(JSON.stringify(modelDisabilityType.value))

        const idx = modelDisabilityTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelDisabilityTypeSetting.value.settings.validations[idx].deleted_at = null
            modelDisabilityTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitDisabilityTypeToggle();
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
    submitDisabilityTypeAll();
})

watch(() => pagination.current_page, () => {
    submitDisabilityTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitDisabilityTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitDisabilityTypeAll();
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