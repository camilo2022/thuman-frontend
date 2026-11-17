<template>
    <ViewSkill :modelSkill="modelSkill" :skills="skills" :skillTypes="skillTypes" :pagination="pagination"
        :showCreateSkill="showCreateSkill" @create="createSkill" @submitSkillStore="submitSkillStore"
        :showEditSkill="showEditSkill" @edit="editSkill" @submitSkillFind="submitSkillFind"
        @submitSkillUpdate="submitSkillUpdate" @closeModals="closeModals" @submitSkillDelete="submitSkillDelete"
        @submitSkillRestore="submitSkillRestore" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewSkill from '../../../templates/Internal/Setting/Skill/Skill.vue';

import ModelSkill from '../../../../models/Skill'

import SkillService from '../../../../services/SkillService';
import SkillTypeService from '../../../../services/SkillTypeService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelSkill = ref(new ModelSkill());

const isSubmitting = ref(false);

const formErrors = ref({});
const skills = ref([]);
const skillTypes = ref([]);
const showCreateSkill = ref(false);
const showEditSkill = ref(false);

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

const submitSkillTypeAll = async () => {
    try {
        const response = await SkillTypeService.all();
        skillTypes.value = response.data.skillTypes;
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

const submitSkillAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await SkillService.all(pagination.current_page, pagination.search, pagination.per_page, null, { withTrashed: true });
        skills.value = response.data.skills;

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

const submitSkillFind = async (skillId) => {
    try {
        const response = await SkillService.find(skillId);
        modelSkill.value.id = response.data.skill.id;
        modelSkill.value.skill_type_id = response.data.skill.skill_type_id;
        modelSkill.value.name = response.data.skill.name;
        modelSkill.value.description = response.data.skill.description;

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

const submitSkillStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la habilidad?',
        message: 'Se creará la habilidad con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {

        try {
            const response = await SkillService.store(modelSkill.value);

            alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            formErrors.value = {};
            if (error.errors) {
                formErrors.value = error.errors;
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitSkillAll();
        }
    }
};

const submitSkillUpdate = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la habilidad?',
        message: 'Se actualizará la habilidad con la información ingresada.',
        confirmText: 'Actualizar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await SkillService.update(modelSkill.value.id, modelSkill.value);

            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            closeModals();
        } catch (error) {
            if (error.errors) {
                formErrors.value = error.errors;
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitSkillAll();
        }
    }
};

const submitSkillDelete = async (skillId) => {
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar la habilidad?',
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
            const response = await SkillService.delete(skillId);

            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
            await submitSkillAll();
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

const submitSkillRestore = async (skillId) => {
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar la habilidad?',
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
            const response = await SkillService.restore(skillId);

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
            await submitSkillAll();
        }
    }
};

const createSkill = () => {
    showCreateSkill.value = true;
    showEditSkill.value = false;
}

const editSkill = () => {
    showEditSkill.value = true;
    showCreateSkill.value = false;
}

const closeModals = () => {
    showCreateSkill.value = false;
    showEditSkill.value = false;
    cleanForm();
}

const cleanForm = () => {
    modelSkill.value.id = null;
    modelSkill.value.skill_type_id = null;
    modelSkill.value.name = '';
    modelSkill.value.description = '';
    formErrors.value = {};
}

onMounted(() => {
    submitSkillAll();
    submitSkillTypeAll();
});

watch(() => pagination.current_page, () => {
    submitSkillAll();
    submitSkillTypeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page === 1) {
        submitSkillAll();
        submitSkillTypeAll();
    } else {
        pagination.current_page = 1;
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page === 1) {
        submitSkillAll();
        submitSkillTypeAll();
    } else {
        pagination.current_page = 1;
    }
});
</script>
