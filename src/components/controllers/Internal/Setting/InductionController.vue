<template>
    <ViewInduction :modelInduction="modelInduction" :inductions="inductions" :pagination="pagination"
        :enterprises="enterprises" :entities="entities" :headquarters="headquarters" :areas="areas"
        :positions="positions" @create="createInduction" @edit="editInduction"
        :showCreateInduction="showCreateInduction" :showEditInduction="showEditInduction" @closeModals="closeModals"
        @submitInductionFind="submitInductionFind" @submitInductionStore="submitInductionStore"
        @submitInductionUpdate="submitInductionUpdate" @submitInductionDelete="submitInductionDelete"
        @submitInductionRestore="submitInductionRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewInduction from '@/components/templates/Internal/Setting/Induction/Induction.vue';

import ModelInduction from '@/models/Induction';

import InductionService from '@/services/InductionService';
import EnterpriseService from '@/services/EnterpriseService';
import EntityService from '@/services/EntityService';
import HeadquarterService from '@/services/HeadquarterService';
import AreaService from '@/services/AreaService';
import PositionService from '@/services/PositionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const inductions = ref([]);
const enterprises = ref([]);
const entities = ref([]);
const headquarters = ref([]);
const areas = ref([]);
const positions = ref([]);

const modelInduction = ref(new ModelInduction());

const formErrors = ref({});
const loadingIndex = ref(false);

const showIndexInduction = ref(true);
const showCreateInduction = ref(false);
const showEditInduction = ref(false);

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

const submitInductionAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await InductionService.all(pagination.current_page, pagination.search, pagination.per_page, null,{ withTrashed: true });
        inductions.value = response.data.inductions;

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
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loadingIndex.value = false;
    }
};

const submitAreaAll = async () => {
    try {
        const response = await AreaService.all();
        areas.value = response.data.areas;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitPositionAll = async (areaId) => {
    try {
        if (!areaId) return;

        const response = await PositionService.all(areaId);
        positions.value = response.data.positions;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitEnterpriseAll = async () => {
    try {
        const response = await EnterpriseService.all();
        enterprises.value = response.data.enterprises;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitEntityAll = async (enterpriseId) => {
    try {
        if (!enterpriseId) return;

        const response = await EntityService.all(enterpriseId);
        entities.value = response.data.entities;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitHeadquarterAll = async (entityId) => {
    try {
        if (!entityId) return;

        const response = await HeadquarterService.all(entityId);
        headquarters.value = response.data.headquarters;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitInductionFind = async (inductionId) => {
    try {
        const response = await InductionService.find(inductionId);
        modelInduction.value.id = response.data.induction.id;
        modelInduction.value.name = response.data.induction.name;
        modelInduction.value.description = response.data.induction.description;
        modelInduction.value.assignable_type = response.data.induction.assignable_type;
        modelInduction.value.assignable_id = response.data.induction.assignable_id;
        modelInduction.value.model_type = response.data.induction.model_type;
        modelInduction.value.model_id = response.data.induction.model_id;

        modelInduction.value.relationships = response.data.induction.relationships;
        if (modelInduction.value.assignable_type == 'App\\Models\\Enterprise') {
            modelInduction.value.enterprise_id = modelInduction.value.relationships.assignable.id;
            modelInduction.value.entity_id = null;
            modelInduction.value.headquarter_id = null;
        } else if (modelInduction.value.assignable_type == 'App\\Models\\Entity') {
            modelInduction.value.enterprise_id = modelInduction.value.relationships.assignable.enterprise.id;
            await submitEntityAll(modelInduction.value.enterprise_id);
            modelInduction.value.entity_id = modelInduction.value.relationships.assignable.id;
            modelInduction.value.headquarter_id = null;
        } else if (modelInduction.value.assignable_type == 'App\\Models\\Headquarter') {
            modelInduction.value.enterprise_id = modelInduction.value.relationships.assignable.entity.enterprise.id;
            await submitEntityAll(modelInduction.value.enterprise_id);
            modelInduction.value.entity_id = modelInduction.value.relationships.assignable.entity.id;
            await submitHeadquarterAll(modelInduction.value.entity_id);
            modelInduction.value.headquarter_id = modelInduction.value.relationships.assignable.id;
        } else {
            modelInduction.value.enterprise_id = null;
            modelInduction.value.entity_id = null;
            modelInduction.value.headquarter_id = null;
        }

        if (modelInduction.value.model_type == 'App\\Models\\Position') {
            modelInduction.value.area_id = modelInduction.value.relationships.model.area.id;
            await submitPositionAll(modelInduction.value.area_id);
            modelInduction.value.position_id = modelInduction.value.relationships.model.id;
        } else if (modelInduction.value.model_type == 'App\\Models\\Area') {
            modelInduction.value.area_id = modelInduction.value.relationships.model.id;
            modelInduction.value.position_id = null;
        } else {
            modelInduction.value.position_id = null;
            modelInduction.value.area_id = null;
        }


    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitInductionStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la inducción?',
        message: 'Se creará la inducción con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            if (modelInduction.value.assignable_type == 'App\\Models\\Enterprise') {
                modelInduction.value.assignable_id = modelInduction.value.enterprise_id;
            } else if (modelInduction.value.assignable_type == 'App\\Models\\Entity') {
                modelInduction.value.assignable_id = modelInduction.value.entity_id;
            } else if (modelInduction.value.assignable_type == 'App\\Models\\Headquarter') {
                modelInduction.value.assignable_id = modelInduction.value.headquarter_id;
            } else {
                modelInduction.value.assignable_id = null;
            }

            if (modelInduction.value.position_id) {
                modelInduction.value.model_id = modelInduction.value.position_id;
                modelInduction.value.model_type = 'App\\Models\\Position';
            } else if (modelInduction.value.area_id) {
                modelInduction.value.model_id = modelInduction.value.area_id;
                modelInduction.value.model_type = 'App\\Models\\Area';
            } else {
                modelInduction.value.model_id = null;
                modelInduction.value.model_type = null;
            }

            const response = await InductionService.store(modelInduction.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
            await submitInductionAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'induction');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitInductionUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la inducción?',
        message: 'Se actualizará la inducción con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            if (modelInduction.value.assignable_type == 'App\\Models\\Enterprise') {
                modelInduction.value.assignable_id = modelInduction.value.enterprise_id;
            } else if (modelInduction.value.assignable_type == 'App\\Models\\Entity') {
                modelInduction.value.assignable_id = modelInduction.value.entity_id;
            } else if (modelInduction.value.assignable_type == 'App\\Models\\Headquarter') {
                modelInduction.value.assignable_id = modelInduction.value.headquarter_id;
            } else {
                modelInduction.value.assignable_id = null;
            }

            if (modelInduction.value.position_id) {
                modelInduction.value.model_id = modelInduction.value.position_id;
                modelInduction.value.model_type = 'App\\Models\\Position';
            } else if (modelInduction.value.area_id) {
                modelInduction.value.model_id = modelInduction.value.area_id;
                modelInduction.value.model_type = 'App\\Models\\Area';
            } else {
                modelInduction.value.model_id = null;
                modelInduction.value.model_type = null;
            }

            const response = await InductionService.update(modelInduction.value.id, modelInduction.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
            await submitInductionAll();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'induction');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    }
};

const submitInductionDelete = async (inductionId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la inducción?',
        message: 'Esta ación suspenderá su uso en procesos activos, pero no eliminará su información.',
        confirmText: 'Inactivar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await InductionService.delete(inductionId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitInductionAll();
        }
    }
};

const submitInductionRestore = async (inductionId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la inducción?',
        message: 'Esta ación permitirá nuevamente su uso en procesos activos.',
        confirmText: 'Activar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await InductionService.restore(inductionId);

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
                alertStore.addAlert({ title: 'Aceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitInductionAll();
        }
    }
};

const createInduction = () => {
    showIndexInduction.value = true;
    showCreateInduction.value = true;
    showEditInduction.value = false;
    cleanForm();
}

const editInduction = () => {
    showIndexInduction.value = true;
    showCreateInduction.value = false;
    showEditInduction.value = true;
}

const closeModals = () => {
    showCreateInduction.value = false;
    showEditInduction.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelInduction.value.id = null;
    modelInduction.value.name = '';
    modelInduction.value.description = '';
    modelInduction.value.enterprise_id = null;
    modelInduction.value.entity_id = null;
    modelInduction.value.headquarter_id = null;
    modelInduction.value.assignable_type = null;
    modelInduction.value.assignable_id = null;
    modelInduction.value.area_id = null;
    modelInduction.value.position_id = null;
    modelInduction.value.model_type = null;
    modelInduction.value.model_id = null;
    formErrors.value = {};
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

watch(() => modelInduction.value.enterprise_id, async () => {
    entities.value = [];
    headquarters.value = [];
    modelInduction.value.entity_id = null;
    modelInduction.value.headquarter_id = null;
    if (modelInduction.value.enterprise_id) await submitEntityAll(modelInduction.value.enterprise_id);
});

watch(() => modelInduction.value.entity_id, async () => {
    headquarters.value = [];
    modelInduction.value.headquarter_id = null;
    if (modelInduction.value.entity_id) await submitHeadquarterAll(modelInduction.value.entity_id);
});

watch(() => modelInduction.value.area_id, async () => {
    positions.value = [];
    modelInduction.value.position_id = null;
    if (modelInduction.value.area_id) await submitPositionAll(modelInduction.value.area_id);
});

onMounted(() => {
    submitAreaAll();
    submitEnterpriseAll();
    submitInductionAll();
})

watch(() => pagination.current_page, () => {
    submitInductionAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitInductionAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitInductionAll();
    }
});

</script>