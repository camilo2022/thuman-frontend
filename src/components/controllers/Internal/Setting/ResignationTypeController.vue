<template>
    <ViewResignationType :modelResignationType="modelResignationType" :resignationTypes="resignationTypes"
        :pagination="pagination" @index="indexResignationType" @setting="settingResignationType"
        @create="createResignationType" @edit="editResignationType" :showIndexResignationType="showIndexResignationType"
        :showCreateResignationType="showCreateResignationType" :paginate="paginate"
        :showEditResignationType="showEditResignationType" :showSettingResignationType="showSettingResignationType"
        @closeModals="closeModals" @submitResignationTypeStore="submitResignationTypeStore"
        @submitResignationTypeUpdate="submitResignationTypeUpdate"
        @submitResignationTypeFind="submitResignationTypeFind"
        @submitResignationTypeDelete="submitResignationTypeDelete"
        @submitResignationTypeRestore="submitResignationTypeRestore"
        @submitResignationTypeSetting="submitResignationTypeSetting"
        :modelResignationTypeSettingValidation="modelResignationTypeSettingValidation" :countries="countries"
        :isEditingResignationTypeSettingValidation="isEditingResignationTypeSettingValidation"
        @clean="cleanFormValidation"
        @submitResignationTypeSettingValidationStore="submitResignationTypeSettingValidationStore"
        @submitResignationTypeSettingValidationUpdate="submitResignationTypeSettingValidationUpdate"
        @submitResignationTypeSettingValidationFind="submitResignationTypeSettingValidationFind"
        @submitResignationTypeSettingValidationDelete="submitResignationTypeSettingValidationDelete"
        @submitResignationTypeSettingValidationRestore="submitResignationTypeSettingValidationRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewResignationType from '@/components/templates/Internal/Setting/ResignationType/ResignationType.vue';

import ModelResignationType from '@/models/ResignationType';

import ResignationTypeService from '@/services/ResignationTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const resignationTypes = ref([]);
const countries = ref([]);

const modelResignationType = ref(new ModelResignationType());
const modelResignationTypeSetting = ref(new ModelResignationType());

const formErrors = ref({});

const showIndexResignationType = ref(true);
const showCreateResignationType = ref(false);
const showEditResignationType = ref(false);
const showSettingResignationType = ref(false);

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

const submitResignationTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await ResignationTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        resignationTypes.value = response.data.resignationTypes;

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

const submitResignationTypeFind = async (resignationTypeId) => {
    try {
        const response = await ResignationTypeService.find(resignationTypeId);
        modelResignationType.value.id = response.data.resignationType.id;
        modelResignationType.value.name = response.data.resignationType.name;
        modelResignationType.value.description = response.data.resignationType.description;
        modelResignationType.value.settings = response.data.resignationType.settings;
        modelResignationType.value.relationships = response.data.resignationType.relationships;


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

const submitResignationTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de renuncia?',
        message: 'Se creará el tipo de renuncia con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ResignationTypeService.store(modelResignationType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'resignationType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitResignationTypeAll();
        }
    }
};

const submitResignationTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de renuncia?',
        message: 'Se actualizará el tipo de renuncia con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ResignationTypeService.update(modelResignationType.value.id, modelResignationType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'resignationType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitResignationTypeAll();
        }
    }
};

const submitResignationTypeToggle = async () => {
    try {
        const response = await ResignationTypeService.toggle(modelResignationTypeSetting.value.id, modelResignationTypeSetting.value);

        modelResignationType.value.settings.validations = response.data.resignationType.settings.validations;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'resignationTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    }
};

const submitResignationTypeSetting = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea configurar el tipo de renuncia?',
        message: 'Esta acción permitirá actualizar la configuración del tipo de renuncia sin afectar su información existente.',
        confirmText: 'Configurar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ResignationTypeService.setting(modelResignationType.value.id, modelResignationType.value);

            modelResignationType.value.settings = response.data.resignationType.settings;

            alertStore.addAlert({ title: 'Configuración exitosa.', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'resignationTypeSetting');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitResignationTypeDelete = async (resignationTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de renuncia?',
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
            const response = await ResignationTypeService.delete(resignationTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El tipo de renuncia  fue inactivado exitosamente.', type: 'success' });
            closeModals();
            await submitResignationTypeAll();
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

const submitResignationTypeRestore = async (resignationTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de renuncia?',
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
            const response = await ResignationTypeService.restore(resignationTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: 'El tipo de renuncia  fue activado exitosamente.', type: 'success' });
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
            await submitResignationTypeAll();
        }
    }
};

function indexResignationType() {
    showIndexResignationType.value = true;
    showCreateResignationType.value = false;
    showEditResignationType.value = false;
    showSettingResignationType.value = false;
    cleanForm();
}

function createResignationType() {
    showIndexResignationType.value = true;
    showSettingResignationType.value = false;
    showCreateResignationType.value = true;
    showEditResignationType.value = false;
    cleanForm();
}

function editResignationType() {
    showIndexResignationType.value = true;
    showSettingResignationType.value = false;
    showCreateResignationType.value = false;
    showEditResignationType.value = true;
}

function settingResignationType() {
    showIndexResignationType.value = false;
    showSettingResignationType.value = true;
    showCreateResignationType.value = false;
    showEditResignationType.value = false;
}

const closeModals = () => {
    showCreateResignationType.value = false;
    showEditResignationType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelResignationType.value.id = null;
    modelResignationType.value.name = '';
    modelResignationType.value.description = '';
    modelResignationType.value.settings = {
        file_required: false,
        message: '',
        validations: []
    };
    modelResignationType.value.relationships = {};
    formErrors.value = {};
}

const settingValidationNextId = computed(() => {
    const validations = modelResignationType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelResignationTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingResignationTypeSettingValidation = computed(() => {
    const validations = modelResignationType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelResignationTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelResignationTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

const submitResignationTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelResignationType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelResignationTypeSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

const submitResignationTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de renuncia?',
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
            modelResignationTypeSetting.value = JSON.parse(JSON.stringify(modelResignationType.value))

            const modelResignationTypeSettingValidationCloned = {
                ...modelResignationTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelResignationTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelResignationTypeSetting.value.settings.validations.push(modelResignationTypeSettingValidationCloned);
            const response = await submitResignationTypeToggle()

            if (!response) {
                const idx = modelResignationTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelResignationTypeSettingValidationCloned.id)
                if (idx !== -1) modelResignationTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitResignationTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de renuncia?',
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
            modelResignationTypeSetting.value = JSON.parse(JSON.stringify(modelResignationType.value))

            const idx = modelResignationTypeSetting.value.settings.validations.findIndex(v => v.id === modelResignationTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelResignationTypeSetting.value.settings.validations[idx] = {
                    ...modelResignationTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitResignationTypeToggle();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitResignationTypeSettingValidationDelete = async (id) => {
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
        modelResignationTypeSetting.value = JSON.parse(JSON.stringify(modelResignationType.value))

        const idx = modelResignationTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelResignationTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelResignationTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitResignationTypeToggle();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

const submitResignationTypeSettingValidationRestore = async (id) => {
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
        modelResignationTypeSetting.value = JSON.parse(JSON.stringify(modelResignationType.value))

        const idx = modelResignationTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelResignationTypeSetting.value.settings.validations[idx].deleted_at = null
            modelResignationTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitResignationTypeToggle();
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
    submitResignationTypeAll();
})

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitResignationTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitResignationTypeAll();
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