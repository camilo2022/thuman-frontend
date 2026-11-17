<template>
    <ViewGallery :modelGallery="modelGallery" :galleries="galleries" :modelGalleries="modelGalleries"
        :showCreateGallery="showCreateGallery" @create="createGallery" @submitGalleryStore="submitGalleryStore"
        @submitGalleryFind="submitGalleryFind" @closeModals="closeModals" @submitGalleryDelete="submitGalleryDelete"
        @submitGalleryRestore="submitGalleryRestore" @index="indexEntity" @submitGalleryDestroy="submitGalleryDestroy"
        :loadingData="loadingData" :loadingMore="loadingMore" :loadingGallery="loadingGallery"
        @loadMore="loadMoreGalleries" :pagination="pagination" />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import router from '@/router'

import ViewGallery from '../../../templates/Internal/Setting/Enterprise/Entity/Gallery/Gallery.vue';

import ModelEntity from '../../../../models/Entity';
import ModelGallery from '../../../../models/Gallery';

import EntityService from '../../../../services/EntityService';
import GalleryService from '../../../../services/GalleryService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useEntityStore } from '@/stores/entityStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelEntity = ref(new ModelEntity());
const modelGallery = ref(new ModelGallery());

const modelGalleries = ref([]);
const galleries = ref([]);
const loadingData = ref(false);
const loadingMore = ref(false);
const loadingGallery = ref(false);

const showCreateGallery = ref(false);

const entityStore = useEntityStore();
const entityId = useEntityStore().selectedId;
modelGallery.value.model_id = entityId;

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

const loadMoreGalleries = async (step = 10) => {
    pagination.per_page += step;
    pagination.current_page = 1;
    await submitGalleryAll({ mode: 'more' });
};

const submitGalleryAll = async ({ mode = 'initial' } = {}) => {
    if (mode === 'initial') loadingData.value = true;
    else loadingMore.value = true;
    try {
        if (!entityId) {
            router.push('/setting/enterprise/entity');
            return;
        }

        const response = await GalleryService.all(
            entityId,
            pagination.current_page,
            pagination.search,
            pagination.per_page,
            { withTrashed: true }
        );

        // lista paginada
        galleries.value = response.data.galleries;

        // si tu backend usa meta.pagination como en EntityService:
        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;

    } catch (error) {
        if (error?.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
    } finally {
        if (mode === 'initial') loadingData.value = false;
        else loadingMore.value = false;
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

const submitGalleryFind = async (galleryId) => {
    try {
        const response = await GalleryService.find(galleryId);
        modelGallery.value.id = response.data.template.id;
        modelGallery.value.model_id = response.data.template.model_id;
        modelGallery.value.model_type = response.data.template.model_type;
        modelGallery.value.file = null;
        modelGallery.value.file_type_id = response.data.template.file_type_id;
        modelGallery.value.file_subtype_id = response.data.template.file_subtype_id;
        modelGallery.value.name = response.data.template.name;
        modelGallery.value.path = response.data.template.path;
        modelGallery.value.mime = response.data.template.mime;
        modelGallery.value.extension = response.data.template.extension;
        modelGallery.value.size = response.data.template.size;
        modelGallery.value.metadata = response.data.template.metadata;


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

const submitGalleryStore = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar los archivos?',
        message: `Se subirán ${modelGalleries.value.length} archivo(s).`,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;
    loadingGallery.value = true;

    const results = {
        success: [],
        failed: [],
    };

    for (const gallery of modelGalleries.value) {
        cleanForm();

        modelGallery.value.file = gallery.file;

        if (gallery.file?.type?.startsWith('image/')) modelGallery.value.file_subtype_id = 126;
        else if (gallery.file?.type?.startsWith('video/')) modelGallery.value.file_subtype_id = 127;
        else if (gallery.file?.type?.startsWith('audio/')) modelGallery.value.file_subtype_id = 128;
        else modelGallery.value.file_subtype_id = null;

        try {
            await GalleryService.store(modelGallery.value);
            results.success.push(gallery.file?.name || 'archivo');
        } catch (error) {
            let msg = 'Ocurrió un error inesperado.';
            if (error?.errors) {
                msg = Object.values(error.errors).flat().join(' | ');
            } else if (error?.error?.error) {
                msg = error.error.error;
            }
            results.failed.push({ name: gallery.file?.name || 'archivo', message: msg });
        }
    }

    // refresca listado
    await submitGalleryAll();

    if (results.failed.length === 0) {
        alertStore.addAlert({
            title: 'Carga exitosa',
            message: `Se subieron ${results.success.length} archivo(s).`,
            type: 'success',
        });
        closeModals();
        loadingGallery.value = false;
        return;
    }

    alertStore.addAlert({
        title: results.success.length ? 'Carga parcial' : 'Error',
        message: 'Las imagenes no son validas.',
        type: results.success.length ? 'warning' : 'danger',
    });
    loadingGallery.value = false;

    // deja solo los fallidos para reintentar
    modelGalleries.value = modelGalleries.value.filter(g =>
        results.failed.some(f => f.name === g.file?.name)
    );
};

const submitGalleryDelete = async (galleryId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la imagen?',
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
            const response = await GalleryService.delete(galleryId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: 'La imagen fue inactivada exitosamente.', type: 'success' });
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
            await submitGalleryAll();
        }
    }
};

const submitGalleryRestore = async (galleryId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el archivo?',
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
            const response = await GalleryService.restore(galleryId);

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
            await submitGalleryAll();
        }
    }
};

const submitGalleryDestroy = async (galleryId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea eliminar permanentemente la imagen?',
        message: 'Esta acción eliminara permanentemente su uso en procesos activos y no podrá ser recuperado.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await GalleryService.destroy(galleryId);

            alertStore.addAlert({ title: 'Eliminación exitosa.', message: response.message, type: 'success' });
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
            await submitGalleryAll();
        }
    }
};

const indexEntity = () => {
    entityStore.clearSelected();
    router.push({ name: "Setting-entity" });
}

const createGallery = () => {
    showCreateGallery.value = true;
}

const closeModals = () => {
    showCreateGallery.value = false;
    modelGalleries.value = []
    cleanForm();
}

const cleanForm = () => {
    modelGallery.value.id = null;
    modelGallery.value.model_type = '';
    modelGallery.value.file = null;
    modelGallery.value.file_subtype_id = null;
    modelGallery.value.name = '';
    modelGallery.value.path = '';
    modelGallery.value.mime = '';
    modelGallery.value.extension = '';
    modelGallery.value.size = '';
    modelGallery.value.metadata = {};
}

onMounted(() => {
    submitGalleryAll({ mode: 'initial' });
    submitEntityFind();
})
</script>
