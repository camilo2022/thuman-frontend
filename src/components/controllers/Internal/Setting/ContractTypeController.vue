<template>
    <ViewContractType :modelContractType="modelContractType" :contractTypes="contractTypes" :pagination="pagination"
        :showCreateContractType="showCreateContractType" @create="createContractType"
        @submitContractTypeStore="submitContractTypeStore" :showEditContractType="showEditContractType"
        @edit="editContractType" @submitContractTypeFind="submitContractTypeFind" :fileSubtypes="fileSubtypes"
        @submitContractTypeUpdate="submitContractTypeUpdate" @closeModals="closeModals"
        @submitContractTypeDelete="submitContractTypeDelete" @submitContractTypeRestore="submitContractTypeRestore"
        :errors="formErrors" :loadingIndex="loadingIndex" @settings="settingContractType" :showSettingContractType="showSettingContractType" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewContractType from '@/components/templates/Internal/Setting/ContractType/ContractType.vue';

import ModelContractType from '@/models/ContractType'

import ContractTypeService from '@/services/ContractTypeService';
import FileSubtypeService from '@/services/FileSubtypeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelContractType = ref(new ModelContractType());

const formErrors = ref({});

const contractTypes = ref([]);
const fileSubtypes = ref([]);

const showCreateContractType = ref(false);
const showEditContractType = ref(false);
const showSettingContractType = ref(false)

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

const submitContractTypeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await ContractTypeService.all(pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        contractTypes.value = response.data.contractTypes;

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

const submitFileSubtypeAll = async () => {
    try {
        const response = await FileSubtypeService.all(1, '', null, 98);
        fileSubtypes.value = response.data.fileSubtypes;
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

const submitContractTypeFind = async (contractTypeId) => {
    try {
        const response = await ContractTypeService.find(contractTypeId);
        modelContractType.value.id = response.data.contractType.id;
        modelContractType.value.name = response.data.contractType.name;
        modelContractType.value.description = response.data.contractType.description;
        modelContractType.value.settings = response.data.contractType.settings;
        modelContractType.value.file_subtypes_id = response.data.contractType.file_subtypes_id;
        modelContractType.value.relationships = response.data.contractType.relationships;


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

const submitContractTypeStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el tipo de contrato?',
        message: 'Se creará el tipo de contrato con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ContractTypeService.store(modelContractType.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'contractType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitContractTypeAll();
        }
    }
};

const submitContractTypeUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el tipo de contrato?',
        message: 'Se actualizará el tipo de contrato con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await ContractTypeService.update(modelContractType.value.id, modelContractType.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'contractType');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitContractTypeAll();
        }
    }
};

const submitContractTypeDelete = async (contractTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el tipo de contrato?',
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
            const response = await ContractTypeService.delete(contractTypeId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            await submitContractTypeAll();
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

const submitContractTypeRestore = async (contractTypeId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el tipo de contrato?',
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
            const response = await ContractTypeService.restore(contractTypeId);

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
            await submitContractTypeAll();
        }
    }
};

const createContractType = () => {
    showCreateContractType.value = true;
    showEditContractType.value = false;
    showSettingContractType.value = false;
}

const editContractType = () => {
    showEditContractType.value = true;
    showCreateContractType.value = false;
    showSettingContractType.value = false;
}

const settingContractType = () => {
    showSettingContractType.value = true;
    showEditContractType.value = false;
    showCreateContractType.value = false;
}

const closeModals = () => {
    showCreateContractType.value = false;
    showEditContractType.value = false;
    showSettingContractType.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelContractType.value.id = null;
    modelContractType.value.name = '';
    modelContractType.value.description = '';
    modelContractType.value.settings = {
        health_entity_affiliation: false,
        pension_fund_affiliation: false,
        compensation_fund_affiliation: false,
        risk_manager_affiliation: false,
        bank_certificate: false,
        fiscal_document_certificate: false,
    }
    formErrors.value = {};
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {
        // settings.validations.0.regex → regex
        const field = path.split('.').pop();

        const key = prefix
            ? `${prefix}_${field}`
            : field;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

onMounted(() => {
    submitContractTypeAll();
    submitFileSubtypeAll();
})

watch(() => pagination.current_page, () => {
    submitContractTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitContractTypeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitContractTypeAll();
    }
});
</script>
