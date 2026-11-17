<template>
    <ViewCampaign :modelCampaign="modelCampaign" :campaigns="campaigns" :pagination="pagination"
        :departaments="departaments" :cities="cities" :showCreateCampaign="showCreateCampaign" @create="createCampaign"
        @submitCampaignStore="submitCampaignStore" :showEditCampaign="showEditCampaign" @edit="editCampaign"
        @submitCampaignFind="submitCampaignFind" @submitCampaignUpdate="submitCampaignUpdate" @closeModals="closeModals"
        @submitCampaignDelete="submitCampaignDelete" @submitCampaignRestore="submitCampaignRestore" :errors="formErrors"
        :loagindData="loagindData" @index="indexAlly" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import router from '@/router'

import ViewCampaign from '@/components/templates/Internal/Setting/Enterprise/Entity/Ally/Campaign/Campaign.vue';

import ModelAlly from '@/models/Ally';
import ModelCampaign from '@/models/Campaign';

import EntityService from '@/services/EntityService';
import CampaignService from '@/services/CampaignService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useEntityStore } from '@/stores/entityStore';
import { useAllyStore } from '@/stores/allyStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelAlly = ref(new ModelAlly());
const modelCampaign = ref(new ModelCampaign());

const isSubmitting = ref(false);
const formErrors = ref({});

const campaigns = ref([]);
const departaments = ref([]);
const cities = ref([]);
const showCreateCampaign = ref(false);
const showEditCampaign = ref(false);
const loagindData = ref(false);

const allyId = useAllyStore().selectedId;
modelCampaign.value.ally_id = allyId;

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

const submitCampaignAll = async () => {
    loagindData.value = true;
    try {
        if (!allyId) {
            router.push('/setting/enterprise/entity/allie');
            loagindData.value = false;
            return;
        }

        const response = await CampaignService.all(allyId, pagination.current_page, pagination.search, pagination.per_page, { withTrashed: true });
        campaigns.value = response.data.campaigns;

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
        if (!allyId) return;

        const response = await EntityService.find(allyId);
        modelAlly.value.id = response.data.ally.id;
        modelAlly.value.entity_id = response.data.ally.entity_id;
        modelAlly.value.name = response.data.ally.name;
        modelAlly.value.description = response.data.ally.description;
        modelAlly.value.relationships = response.data.ally.relationships;

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

const submitCampaignFind = async (campaignId) => {
    try {
        const response = await CampaignService.find(campaignId);

        modelCampaign.value.id = response.data.campaign.id;
        modelCampaign.value.ally_id = response.data.campaign.ally_id;
        modelCampaign.value.name = response.data.campaign.name;
        modelCampaign.value.description = response.data.campaign.description;

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

const submitCampaignStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea crear la campaña?',
        message: 'Se creará la campaña con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await CampaignService.store(modelCampaign.value);

            alertStore.addAlert({
                title: 'Registro exitoso',
                message: response.message,
                type: 'success'
            });

            closeModals();

            await submitCampaignAll();

        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'campaign');

                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
            } else {
                alertStore.addAlert({
                    title: 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        }
    }
};

const submitCampaignUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la campaña?',
        message: 'Se actualizará la campaña con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-question',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await CampaignService.update(
                modelCampaign.value.id,
                modelCampaign.value
            );

            alertStore.addAlert({
                title: 'Modificación exitosa.',
                message: response.message,
                type: 'success'
            });

            closeModals();

            await submitCampaignAll();

        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'campaign');

                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
            } else {
                alertStore.addAlert({
                    title: 'Acceso Denegado',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        }
    }
};

const submitCampaignDelete = async (campaignId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la campaña?',
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
            const response = await CampaignService.delete(campaignId);

            alertStore.addAlert({ title: 'Campaña inactivada', message: response.message, type: 'success' });
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
            await submitCampaignAll();
        }
    }
};

const submitCampaignRestore = async (campaignId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la campaña?',
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
            const response = await CampaignService.restore(campaignId);

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
            await submitCampaignAll();
        }
    }
};

const indexAlly = () => {
    useAllyStore().clearSelected();
    router.push({ name: "Setting-entity-ally" });
}

const createCampaign = () => {
    showCreateCampaign.value = true;
    showEditCampaign.value = false;
    cleanForm();
}

const editCampaign = () => {
    showEditCampaign.value = true;
    showCreateCampaign.value = false;
    cleanForm();
}

const closeModals = () => {
    showCreateCampaign.value = false;
    showEditCampaign.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelCampaign.value.id = null;
    modelCampaign.value.name = '';
    modelCampaign.value.description = '';
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
    submitCampaignAll();
})

watch(pagination, () => {
    submitCampaignAll()
}, { deep: true })

watch(() => modelCampaign.value.departament_id, () => {
    modelCampaign.value.city_id = null
    submitCityAll()
})
</script>
