<template>
    <ViewPhoneValidation :modelPhoneValidation="modelPhoneValidation" :phoneValidations="phoneValidations"
        :pagination="pagination" @submitPhoneValidationFind="submitPhoneValidationFind" @index="indexPhoneValidation"
        @setting="settingPhoneValidation" :showIndexPhoneValidation="showIndexPhoneValidation"
        :showSettingPhoneValidation="showSettingPhoneValidation"
        :modelPhoneValidationSettingValidation="modelPhoneValidationSettingValidation" :paginate="paginate"
        :isEditingPhoneValidationSettingValidation="isEditingPhoneValidationSettingValidation"
        @clean="cleanFormValidation"
        @submitPhoneValidationSettingValidationStore="submitPhoneValidationSettingValidationStore"
        @submitPhoneValidationSettingValidationUpdate="submitPhoneValidationSettingValidationUpdate"
        @submitPhoneValidationSettingValidationFind="submitPhoneValidationSettingValidationFind"
        @submitPhoneValidationSettingValidationDelete="submitPhoneValidationSettingValidationDelete"
        @submitPhoneValidationSettingValidationRestore="submitPhoneValidationSettingValidationRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';

import ViewPhoneValidation from '../../../templates/Internal/Setting/PhoneValidation/PhoneValidation.vue';

import ModelPhoneValidation from '../../../../models/Country'

import PhoneValidationService from '../../../../services/CountryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const formErrors = ref({});

const modelPhoneValidation = ref(new ModelPhoneValidation());
const modelPhoneValidationSetting = ref(new ModelPhoneValidation());

const phoneValidations = ref([]);
const showIndexPhoneValidation = ref(true);
const showSettingPhoneValidation = ref(false);

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

const submitPhoneValidationAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await PhoneValidationService.all(pagination.current_page, pagination.search, pagination.per_page);
        phoneValidations.value = response.data.countries;

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

const submitPhoneValidationFind = async (phoneValidationId) => {
    try {
        const response = await PhoneValidationService.find(phoneValidationId);
        modelPhoneValidation.value.id = response.data.country.id;
        modelPhoneValidation.value.subregion_id = response.data.country.subregion_id;
        modelPhoneValidation.value.name = response.data.country.name;
        modelPhoneValidation.value.iso3 = response.data.country.iso3;
        modelPhoneValidation.value.iso2 = response.data.country.iso2;
        modelPhoneValidation.value.numeric_code = response.data.country.numeric_code;
        modelPhoneValidation.value.phone_code = response.data.country.phone_code;
        modelPhoneValidation.value.currency = response.data.country.currency;
        modelPhoneValidation.value.currency_name = response.data.country.currency_name;
        modelPhoneValidation.value.currency_symbol = response.data.country.currency_symbol;
        modelPhoneValidation.value.tld = response.data.country.tld;
        modelPhoneValidation.value.native = response.data.country.native;
        modelPhoneValidation.value.nationality = response.data.country.nationality;
        modelPhoneValidation.value.latitude = response.data.country.latitude;
        modelPhoneValidation.value.longitude = response.data.country.longitude;
        modelPhoneValidation.value.emoji = response.data.country.emoji;
        modelPhoneValidation.value.emojiU = response.data.country.emojiU;
        modelPhoneValidation.value.translations = response.data.country.translations;
        modelPhoneValidation.value.settings = response.data.country.settings;

        
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

const submitPhoneValidationSetting = async () => {
    try {
        const response = await PhoneValidationService.setting(modelPhoneValidationSetting.value.id, modelPhoneValidationSetting.value);

        modelPhoneValidation.value.settings = response.data.country.settings
        return true;
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(
                error.errors,
                'phoneValidation'
            );
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
        return false;
    } finally {

    }
};

const indexPhoneValidation = () => {
    showIndexPhoneValidation.value = true;
    showSettingPhoneValidation.value = false;
    cleanFormValidation();
}

const settingPhoneValidation = () => {
    showSettingPhoneValidation.value = true;
    showIndexPhoneValidation.value = false;
    cleanFormValidation();
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

const settingValidationNextId = computed(() => {
    const validations = modelPhoneValidation.value?.settings?.validations ?? []
    const ids = validations.map(validation => Number(validation?.id) || 0)
    return (ids.length ? Math.max(...ids) : 0) + 1
})

const now = () => {
    const d = new Date()
    const p = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const modelPhoneValidationSettingValidation = ref({
    id: 0,
    regex: '',
    message: '',
    created_at: now(),
    updated_at: now(),
    deleted_at: null
})

const isEditingPhoneValidationSettingValidation = computed(() => {
    const validations = modelPhoneValidation.value?.settings?.validations ?? []
    return validations.some(validation => validation.id === modelPhoneValidationSettingValidation.value.id)
})

const findCountry = (id) => {
    return countries.value?.find(country => country.id === id) ?? null
}

const cleanFormValidation = () => {
    modelPhoneValidationSettingValidation.value = {
        id: 0,
        regex: '',
        message: '',
        created_at: now(),
        updated_at: now(),
        deleted_at: null
    }
    formErrors.value = {}
}

/* === FIND === */
const submitPhoneValidationSettingValidationFind = (id) => {
    const item = modelPhoneValidation.value.settings.validations.find(v => v.id === id)

    if (!item) return

    modelPhoneValidationSettingValidation.value = { ...item }
    alertStore.addAlert({ title: 'Búsqueda exitosa.', message: 'La validación fue encontrada exitosamente.', type: 'success' })
}

/* === STORE === */
const submitPhoneValidationSettingValidationStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la validación al codigo de teléfono?',
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
            modelPhoneValidationSetting.value = JSON.parse(JSON.stringify(modelPhoneValidation.value))

            const modelPhoneValidationSettingValidationCloned = {
                ...modelPhoneValidationSettingValidation.value,
                id: settingValidationNextId.value,
                created_at: now(),
                updated_at: now(),
                deleted_at: null
            }

            modelPhoneValidationSetting.value.settings.validations.push(modelPhoneValidationSettingValidationCloned);
            const response = await submitPhoneValidationSetting()

            if (!response) {
                const idx = modelPhoneValidationSetting.value.settings.validations.findIndex(validation => validation.id === modelPhoneValidationSettingValidationCloned.id)
                if (idx !== -1) modelPhoneValidationSetting.value.settings.validations.splice(idx, 1)
                return
            }

            alertStore.addAlert({ title: 'Registro exitoso', message: 'La validación fue creada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

/* === UPDATE === */
const submitPhoneValidationSettingValidationUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la validación al codigo de teléfono?',
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
            modelPhoneValidationSetting.value = JSON.parse(JSON.stringify(modelPhoneValidation.value))

            const idx = modelPhoneValidationSetting.value.settings.validations.findIndex(v => v.id === modelPhoneValidationSettingValidation.value.id)

            if (idx !== -1) {
                modelPhoneValidationSetting.value.settings.validations[idx] = {
                    ...modelPhoneValidationSettingValidation.value,
                    updated_at: now()
                }
            }

            const response = await submitPhoneValidationSetting();
            if (!response) return

            alertStore.addAlert({ title: 'Modificación exitosa.', message: 'La validación fue actualizada exitosamente.', type: 'success' })
            cleanFormValidation()
        } catch (error) {

        }
    }
}

/* === DELETE === */
const submitPhoneValidationSettingValidationDelete = async (id) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea eliminar la validación?',
        message: 'Se suspenderá su uso en procesos activos, pero no se eliminará la información.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true
    })

    if (confirmed) {
        modelPhoneValidationSetting.value = JSON.parse(JSON.stringify(modelPhoneValidation.value))

        const idx = modelPhoneValidationSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelPhoneValidationSetting.value.settings.validations[idx].deleted_at = now()
            modelPhoneValidationSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitPhoneValidationSetting();
        if (!response) return

        alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La validación fue inactivada exitosamente.', type: 'success' })
        cleanFormValidation()
    }
}

/* === RESTORE === */
const submitPhoneValidationSettingValidationRestore = async (id) => {
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
        modelPhoneValidationSetting.value = JSON.parse(JSON.stringify(modelPhoneValidation.value))

        const idx = modelPhoneValidationSetting.value.settings.validations.findIndex(v => v.id === id)
        if (idx !== -1) {
            modelPhoneValidationSetting.value.settings.validations[idx].deleted_at = null
            modelPhoneValidationSetting.value.settings.validations[idx].updated_at = now()
        }

        const response = await submitPhoneValidationSetting();
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
    submitPhoneValidationAll()
})

watch(() => pagination.current_page, () => {
    submitPhoneValidationAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPhoneValidationAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPhoneValidationAll();
    }
});
</script>
