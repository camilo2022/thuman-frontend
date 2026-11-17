<template>
    <ViewDocumentType :modelDocumentType="modelDocumentType" :documentTypes="documentTypes" :personTypes="personTypes"
        :pagination="pagination" @index="indexDocumentType" @setting="settingDocumentType"
        :showIndexDocumentType="showIndexDocumentType" :showSettingDocumentType="showSettingDocumentType"
        :showCreateDocumentType="showCreateDocumentType" @create="createDocumentType"
        @submitDocumentTypeStore="submitDocumentTypeStore" :showEditDocumentType="showEditDocumentType"
        @edit="editDocumentType" @submitDocumentTypeFind="submitDocumentTypeFind"
        @submitDocumentTypeUpdate="submitDocumentTypeUpdate" :countries="countries" :paginate="paginate"
        @closeModals="closeModals" @submitDocumentTypeDelete="submitDocumentTypeDelete"
        @submitDocumentTypeRestore="submitDocumentTypeRestore"
        :modelDocumentTypeSettingValidation="modelDocumentTypeSettingValidation"
        :isEditingDocumentTypeSettingValidation="isEditingDocumentTypeSettingValidation" @clean="cleanFormValidation"
        @submitDocumentTypeSettingValidationStore="submitDocumentTypeSettingValidationStore"
        @submitDocumentTypeSettingValidationUpdate="submitDocumentTypeSettingValidationUpdate"
        @submitDocumentTypeSettingValidationFind="submitDocumentTypeSettingValidationFind"
        @submitDocumentTypeSettingValidationDelete="submitDocumentTypeSettingValidationDelete"
        @submitDocumentTypeSettingValidationRestore="submitDocumentTypeSettingValidationRestore" :errors="formErrors"
        :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';

import ViewDocumentType from '@/components/templates/Internal/Setting/DocumentType/DocumentType.vue';

import ModelDocumentType from '@/models/DocumentType'

import DocumentTypeService from '@/services/DocumentTypeService';
import PersonTypeService from '@/services/PersonTypeService';
import CountryService from '@/services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelDocumentType = ref(new ModelDocumentType());
const modelDocumentTypeSetting = ref(new ModelDocumentType());

const formErrors = ref({});
const isSubmitting = ref(false);

const documentTypes = ref([]);
const personTypes = ref([]);
const countries = ref([]);
const showIndexDocumentType = ref(true);
const showCreateDocumentType = ref(false);
const showEditDocumentType = ref(false);
const showSettingDocumentType = ref(false);

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
});

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

const submitPersonTypeAll = async () => {
    try {
        const response = await PersonTypeService.all();
        personTypes.value = response.data.personTypes;
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

const submitDocumentTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await DocumentTypeService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        documentTypes.value = response.data.documentTypes;

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

const submitDocumentTypeFind = async (documentTypeId) => {
    try {
        const response = await DocumentTypeService.find(documentTypeId);
        modelDocumentType.value.id = response.data.documentType.id;
        modelDocumentType.value.person_type_id = response.data.documentType.person_type_id;
        modelDocumentType.value.name = response.data.documentType.name;
        modelDocumentType.value.description = response.data.documentType.description;
        modelDocumentType.value.settings = response.data.documentType.settings;
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

const submitDocumentTypeStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de documento?',
        message: 'Se creará el tipo de documento con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await DocumentTypeService.store(modelDocumentType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'documentType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitDocumentTypeAll();
        }
    }
};

const submitDocumentTypeUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000)
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de documento?',
        message: 'Se actualizará el tipo de documento con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await DocumentTypeService.update(modelDocumentType.value.id, modelDocumentType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'documentType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitDocumentTypeAll();
        }
    }
};

const submitDocumentTypeSetting = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000)
    try {
        const response = await DocumentTypeService.setting(modelDocumentTypeSetting.value.id, modelDocumentTypeSetting.value);

        modelDocumentType.value.settings = response.data.documentType.settings;
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'documentTypeSetting');
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
        return false;
    } finally {

    }
};

const submitDocumentTypeDelete = async (documentTypeId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de documento?',
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
            const response = await DocumentTypeService.delete(documentTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            await submitDocumentTypeAll();
            closeModals();
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

const submitDocumentTypeRestore = async (documentTypeId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de documento?',
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
            const response = await DocumentTypeService.restore(documentTypeId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: response.message, type: 'success' });
            await submitDocumentTypeAll();
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
        }
    }
};

const indexDocumentType = () => {
    showIndexDocumentType.value = true;
    showSettingDocumentType.value = false;
    cleanFormValidation();
    cleanForm();
}

const createDocumentType = () => {
    showCreateDocumentType.value = true;
    showEditDocumentType.value = false;
    cleanForm();
}

const editDocumentType = () => {
    showEditDocumentType.value = true;
    showCreateDocumentType.value = false;
    cleanForm();
}

const settingDocumentType = () => {
    showSettingDocumentType.value = true;
    showIndexDocumentType.value = false;
    cleanForm();
    swalStore.openSwal({
        type: 'info',
        title: '¿Qué es una expresión regular?',
        html: `
            <p style="text-align: justify; font-size: 15px !important;">
                Una <strong>expresión regular (regex)</strong> es una cadena que define un patrón para validar textos.
                Se utiliza para validar formatos como números, correos, fechas, etc.
            </p>

            <p><strong>Ejemplos de expresiones:</strong></p>

            <ul style="text-align: left; padding-left: 25px; font-size: 15px !important;">
                <li><strong>Solo números:</strong> <code>/^[0-9]+$/</code></li>
                <li><strong>Solo letras:</strong> <code>/^[A-Za-z ]+$/</code></li>
                <li><strong>Correo:</strong> <code>/^[^@]+@[^@]+/.[a-zA-Z]{2,}$/</code></li>
                <li><strong>Fecha (AAAA-MM-DD):</strong> <code>^/d{4}-/d{2}-/d{2}$/</code></li>
            </ul>

            <p style="text-align: justify; font-size: 15px !important;">
                Ingrese un patrón válido según el formato que desea validar.
            </p>
        `,
        confirmText: 'Entendido',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: false
    });
}

const closeModals = () => {
    showCreateDocumentType.value = false;
    showEditDocumentType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelDocumentType.value.id = null;
    modelDocumentType.value.person_type_id = null;
    modelDocumentType.value.settings = { abreviature: '', validations: [] };
    modelDocumentType.value.name = '';
    modelDocumentType.value.description = '';
    formErrors.value = {};
}

const settingValidationNextId = computed(() => {
    const validations = modelDocumentType.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelDocumentTypeSettingValidation = ref({
    id: 0,
    country_id: null,
    country: {},
    regex: '',
    message: '',
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingDocumentTypeSettingValidation = computed(() => {
    const validations = modelDocumentType.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelDocumentTypeSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelDocumentTypeSettingValidation.value = {
        id: 0,
        country_id: null,
        country: {},
        regex: '',
        message: '',
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {};
}

/* === FIND === */
const submitDocumentTypeSettingValidationFind = (id) => {
    formErrors.value = {}
    const item = modelDocumentType.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelDocumentTypeSettingValidation.value = { ...item }
}

/* === STORE === */
const submitDocumentTypeSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al tipo de documento?',
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
            modelDocumentTypeSetting.value = JSON.parse(JSON.stringify(modelDocumentType.value))

            const modelDocumentTypeSettingValidationCloned = {
                ...modelDocumentTypeSettingValidation.value,
                id: settingValidationNextId.value,
                country: findCountry(modelDocumentTypeSettingValidation.value.country_id),
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelDocumentTypeSetting.value.settings.validations.push(modelDocumentTypeSettingValidationCloned);
            const response = await submitDocumentTypeSetting()

            if (!response) {
                const idx = modelDocumentTypeSetting.value.settings.validations.findIndex(validation => validation.id === modelDocumentTypeSettingValidationCloned.id)
                if (idx !== -1) modelDocumentTypeSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

const submitDocumentTypeSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al tipo de documento?',
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
            modelDocumentTypeSetting.value = JSON.parse(JSON.stringify(modelDocumentType.value))

            const idx = modelDocumentTypeSetting.value.settings.validations.findIndex(v => v.id === modelDocumentTypeSettingValidation.value.id)

            if (idx !== -1) {
                modelDocumentTypeSetting.value.settings.validations[idx] = {
                    ...modelDocumentTypeSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitDocumentTypeSetting();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

/* === DELETE === */
const submitDocumentTypeSettingValidationDelete = async (id) => {
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
        modelDocumentTypeSetting.value = JSON.parse(JSON.stringify(modelDocumentType.value))

        const idx = modelDocumentTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelDocumentTypeSetting.value.settings.validations[idx].deleted_at = now()
            modelDocumentTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitDocumentTypeSetting();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

/* === RESTORE === */
const submitDocumentTypeSettingValidationRestore = async (id) => {
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
        modelDocumentTypeSetting.value = JSON.parse(JSON.stringify(modelDocumentType.value))

        const idx = modelDocumentTypeSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelDocumentTypeSetting.value.settings.validations[idx].deleted_at = null
            modelDocumentTypeSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitDocumentTypeSetting();
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
    submitDocumentTypeAll();
    submitPersonTypeAll();
})

watch(() => pagination.current_page, () => {
    submitDocumentTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitDocumentTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitDocumentTypeAll();
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
