<template>
    <ViewHeadquarter :modelHeadquarter="modelHeadquarter" :headquarters="headquarters" :pagination="pagination"
        :departaments="departaments" :cities="cities" :showCreateHeadquarter="showCreateHeadquarter"
        @create="createHeadquarter" @submitHeadquarterStore="submitHeadquarterStore"
        :showEditHeadquarter="showEditHeadquarter" @edit="editHeadquarter"
        @submitHeadquarterFind="submitHeadquarterFind" @submitHeadquarterUpdate="submitHeadquarterUpdate"
        @closeModals="closeModals" @submitHeadquarterDelete="submitHeadquarterDelete"
        @submitHeadquarterRestore="submitHeadquarterRestore" :errors="formErrors" :loagindData="loagindData"
        @index="indexEntity" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import router from '@/router'

import ViewHeadquarter from '@/components/templates/Internal/Setting/Enterprise/Entity/Headquarter/Headquarter.vue';

import ModelEntity from '@/models/Entity';
import ModelHeadquarter from '@/models/Headquarter';

import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import EntityService from '@/services/EntityService';
import HeadquarterService from '@/services/HeadquarterService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useEntityStore } from '@/stores/entityStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEntity = ref(new ModelEntity());
const modelHeadquarter = ref(new ModelHeadquarter());

const isSubmitting = ref(false);
const formErrors = ref({});

const headquarters = ref([]);
const departaments = ref([]);
const cities = ref([]);
const showCreateHeadquarter = ref(false);
const showEditHeadquarter = ref(false);
const loagindData = ref(false);

const entityStore = useEntityStore();
const entityId = useEntityStore().selectedId;
modelHeadquarter.value.entity_id = entityId;

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

const submitDepartamentAll = async () => {
    try {
        const response = await DepartamentService.all(1, '', null, modelEntity.value.country_id);
        departaments.value = response.data.departaments;
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

const submitCityAll = async () => {
    try {
        if (modelHeadquarter.value.departament_id == null) {
            cities.value = [];
            return;
        }

        const response = await CityService.all(1, '', null, modelHeadquarter.value.departament_id);
        cities.value = response.data.cities;
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

const submitHeadquarterAll = async () => {
    loagindData.value = true;
    try {
        if (!entityId) {
            router.push('/setting/enterprise/entity');
            loagindData.value = false;
            return;
        }

        const response = await HeadquarterService.all(entityId, pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        headquarters.value = response.data.headquarters;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loagindData.value = false;
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

const submitEntityFind = async () => {
    try {
        if (!entityId) return;

        const response = await EntityService.find(entityId);
        modelEntity.value.id = response.data.entity.id;
        modelEntity.value.enterprise_id = response.data.entity.enterprise_id;
        modelEntity.value.entity_type_id = response.data.entity.entity_type_id;
        modelEntity.value.name = response.data.entity.name;
        modelEntity.value.country_id = response.data.entity.country_id;
        modelEntity.value.document_type_id = response.data.entity.document_type_id;
        modelEntity.value.document_number = response.data.entity.document_number;
        modelEntity.value.person_id = response.data.entity.person_id;
        modelEntity.value.about_us.text = response.data.entity.about_us;
        modelEntity.value.about_us.image = response.data.entity.relationships.about_us;
        modelEntity.value.mission.text = response.data.entity.mission;
        modelEntity.value.mission.image = response.data.entity.relationships.mission;
        modelEntity.value.vision.text = response.data.entity.vision;
        modelEntity.value.vision.image = response.data.entity.relationships.vision;

        submitDepartamentAll();
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

const submitHeadquarterFind = async (headquarterId) => {
    try {
        const response = await HeadquarterService.find(headquarterId);

        modelHeadquarter.value.id = response.data.headquarter.id;
        modelHeadquarter.value.entity_id = response.data.headquarter.entity_id;
        modelHeadquarter.value.name = response.data.headquarter.name;
        modelHeadquarter.value.address = response.data.headquarter.address;
        modelHeadquarter.value.departament_id = response.data.headquarter.relationships.city.departament_id;
        await submitDepartamentAll();
        modelHeadquarter.value.city_id = response.data.headquarter.city_id;

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

const submitHeadquarterStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea crear la sede?',
        message: 'Se creará la sede con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await HeadquarterService.store(modelHeadquarter.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'headquarter');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitHeadquarterAll();
        }
    }
};

const submitHeadquarterUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la sede?',
        message: 'Se actualizará la sede con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await HeadquarterService.update(modelHeadquarter.value.id, modelHeadquarter.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'headquarter');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitHeadquarterAll();
        }
    }
};

const submitHeadquarterDelete = async (headquarterId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la sede?',
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
            const response = await HeadquarterService.delete(headquarterId);

            alertStore.addAlert({ title: 'Sede inactivada', message: response.message, type: 'success' });
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
            await submitHeadquarterAll();
        }
    }
};

const submitHeadquarterRestore = async (headquarterId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la sede?',
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
            const response = await HeadquarterService.restore(headquarterId);

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
            await submitHeadquarterAll();
        }
    }
};

const indexEntity = () => {
    entityStore.clearSelected();
    router.push({ name: "Setting-entity" });
}

const createHeadquarter = () => {
    showCreateHeadquarter.value = true;
    showEditHeadquarter.value = false;
    cleanForm();
}

const editHeadquarter = () => {
    showEditHeadquarter.value = true;
    showCreateHeadquarter.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateHeadquarter.value = false;
    showEditHeadquarter.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelHeadquarter.value.id = null;
    modelHeadquarter.value.name = '';
    modelHeadquarter.value.departament_id = null;
    modelHeadquarter.value.city_id = null;
    modelHeadquarter.value.address = '';
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

onMounted(() => {
    submitHeadquarterAll();
    submitEntityFind();
})

watch(pagination, () => {
    submitHeadquarterAll()
}, { deep: true })

watch(() => modelHeadquarter.value.departament_id, () => {
    modelHeadquarter.value.city_id = null
    submitCityAll()
})
</script>
