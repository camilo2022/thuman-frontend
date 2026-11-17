<template>
    <ViewBenefit :modelBenefit="modelBenefit" :benefits="benefits" :pagination="pagination"
        :showCreateBenefit="showCreateBenefit" @create="createBenefit" @submitBenefitStore="submitBenefitStore"
        :showEditBenefit="showEditBenefit" @edit="editBenefit" @submitBenefitFind="submitBenefitFind"
        @submitBenefitUpdate="submitBenefitUpdate" @closeModals="closeModals" @submitBenefitDelete="submitBenefitDelete"
        @submitBenefitRestore="submitBenefitRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewBenefit from '../../../templates/Internal/Setting/Benefit/Benefit.vue';

import ModelBenefit from '../../../../models/Benefit'

import BenefitService from '../../../../services/BenefitService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelBenefit = ref(new ModelBenefit());

const formErrors = ref({});

const benefits = ref([]);
const showCreateBenefit = ref(false);
const showEditBenefit = ref(false);

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

const submitBenefitAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await BenefitService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        benefits.value = response.data.benefits;

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

const submitBenefitFind = async (benefitId) => {
    try {
        const response = await BenefitService.find(benefitId);
        modelBenefit.value.id = response.data.benefit.id;
        modelBenefit.value.name = response.data.benefit.name;
        modelBenefit.value.description = response.data.benefit.description;

        modelBenefit.value.icon = null;

        // Nombre del archivo existente
        modelBenefit.value.icon_name = response.data.benefit.icon?.name ?? null;


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

const submitBenefitStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el beneficio?',
        message: 'Se creará el beneficio con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await BenefitService.store(modelBenefit.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'benefit');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitBenefitAll();
        }
    }
};

const submitBenefitUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el beneficio?',
        message: 'Se actualizará el beneficio con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await BenefitService.update(modelBenefit.value.id, modelBenefit.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'benefit');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitBenefitAll();
        }
    }
};

const submitBenefitDelete = async (benefitId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el beneficio?',
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
            const response = await BenefitService.delete(benefitId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'El beneficio  fue inactivado exitosamente.', type: 'success' });
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
            await submitBenefitAll();
        }
    }
};

const submitBenefitRestore = async (benefitId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el beneficio?',
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
            const response = await BenefitService.restore(benefitId);

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
            await submitBenefitAll();
        }
    }
};

const createBenefit = () => {
    showCreateBenefit.value = true;
    showEditBenefit.value = false;
    cleanForm();
}

const editBenefit = () => {
    showEditBenefit.value = true;
    showCreateBenefit.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateBenefit.value = false;
    showEditBenefit.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelBenefit.value.id = null;
    modelBenefit.value.name = '';
    modelBenefit.value.description = '';
    modelBenefit.value.icon = null;
    modelBenefit.value.icon_name = null;
    formErrors.value = {};
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};
    Object.entries(errors).forEach(([field, messages]) => {
        prefixed[`${prefix}_${field}`] = [...messages];
    });
    return prefixed;
};

onMounted(() => {
    submitBenefitAll()
})

watch(() => pagination.current_page, () => {
    submitBenefitAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitBenefitAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitBenefitAll();
    }
});
</script>
