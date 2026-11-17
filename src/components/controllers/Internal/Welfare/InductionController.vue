<template>
    <ViewInduction :showIndexInduction="showIndexInduction" :showListInduction="showListInduction" :showStepInduction="showStepInduction" :showFormInduction="showFormInduction" :inductions="inductions" :steps="steps" 
        :modelInduction="modelInduction" :modelStep="modelStep" :modelProgress="modelProgress" @submitInductionFind="submitInductionFind" @submitStepFind="submitStepFind" @index="viewIndex" @list="viewList" @step="viewStep" 
        @submitProgressFinish="submitProgressFinish" @form="viewForm" />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed, inject } from 'vue';

import ViewInduction from '@/components/templates/Internal/Welfare/Induction/Induction.vue';

import ModelInduction from '@/models/Induction';
import ModelStep from '@/models/Step';
import ModelProgress from '@/models/Progress';

import InductionService from '@/services/InductionService';
import StepService from '@/services/StepService';
import ProgressService from '@/services/ProgressService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();
const authStore = useAuthStore();

const inductions = ref([]);
const steps = ref([]);

const modelInduction = ref(new ModelInduction());
const modelStep = ref(new ModelStep());
const modelProgress = ref(new ModelProgress());

const formErrors = ref({});

const showIndexInduction = ref(true);
const showListInduction = ref(false);
const showStepInduction = ref(false);
const showFormInduction = ref(false);
const hideSidebar = inject('hideSidebar');

const submitInductionAll = async () => {
    try {
        const response = await InductionService.all(1, '', null, authStore.personId);
        inductions.value = response.data.inductions;
    } catch (error) {
        if(error.errors) {
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

const submitStepAll = async (inductionId) => {
    try {
        const response = await StepService.all(inductionId, 1, '', null, authStore.personId);
        steps.value = response.data.steps;
    } catch (error) {
        if(error.errors) {
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
        if(modelInduction.value.assignable_type == 'App\\Models\\Enterprise') {
            modelInduction.value.enterprise_id = modelInduction.value.relationships.assignable.id;
            modelInduction.value.entity_id = null;
            modelInduction.value.headquarter_id = null;
        } else if(modelInduction.value.assignable_type == 'App\\Models\\Entity') {
            modelInduction.value.enterprise_id = modelInduction.value.relationships.assignable.enterprise.id;
            modelInduction.value.entity_id = modelInduction.value.relationships.assignable.id;
            modelInduction.value.headquarter_id = null;
        } else if(modelInduction.value.assignable_type == 'App\\Models\\Headquarter') {
            modelInduction.value.enterprise_id = modelInduction.value.relationships.assignable.entity.enterprise.id;
            modelInduction.value.entity_id = modelInduction.value.relationships.assignable.entity.id;
            modelInduction.value.headquarter_id = modelInduction.value.relationships.assignable.id;
        } else {
            modelInduction.value.enterprise_id = null;
            modelInduction.value.entity_id = null;
            modelInduction.value.headquarter_id = null;
        }

        if(modelInduction.value.model_type == 'App\\Models\\Position') {
            modelInduction.value.area_id = modelInduction.value.relationships.model.area.id;
            modelInduction.value.position_id = modelInduction.value.relationships.model.id;
        } else if(modelInduction.value.model_type == 'App\\Models\\Area') {
            modelInduction.value.area_id = modelInduction.value.relationships.model.id;
            modelInduction.value.position_id = null;
        } else {
            modelInduction.value.position_id = null;
            modelInduction.value.area_id = null;
        }

        await submitStepAll(inductionId);
    } catch (error) {
        if(error.errors) {
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

const submitStepFind = async (stepId) => {
    try {
        const response = await StepService.find(stepId);
        modelStep.value.id = response.data.step.id;
        modelStep.value.induction_id = response.data.step.induction_id;
        modelStep.value.name = response.data.step.name;
        modelStep.value.description = response.data.step.description;
        modelStep.value.form_id = response.data.step.form_id;
        modelStep.value.relationships = response.data.step.relationships;
        
        await submitProgressFind();
        console.log(modelProgress.value)
        if(!modelProgress.value.id) {
            modelProgress.value.person_id = authStore.personId;
            modelProgress.value.step_id = modelStep.value.id;
            modelProgress.value.questions = modelStep.value.relationships.form.questions;
            await submitProgressStart();
            console.log(modelProgress.value)
        }

        submitInductionAll();
        submitStepAll(modelStep.value.induction_id)
        viewStep();
    } catch (error) {
        if(error.errors) {
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

const submitProgressFind = async (progressId = null) => {
    cleanForm();
    try {
        const response = await ProgressService.find(progressId, authStore.personId, modelStep.value.id, 'En curso');
        modelProgress.value.id = response.data.progress.id;
        modelProgress.value.person_id = response.data.progress.person_id;
        modelProgress.value.step_id = response.data.progress.step_id;
        modelProgress.value.questions = response.data.progress.questions;
        modelProgress.value.answers = response.data.progress.answers;
        modelProgress.value.start_at = response.data.progress.start_at;
        modelProgress.value.end_at = response.data.progress.end_at;
        modelProgress.value.status = response.data.progress.status;
        modelProgress.value.result = response.data.progress.result;
        modelProgress.value.relationships = response.data.progress.relationships;
    } catch (error) {
        if(error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
};

const submitProgressStart = async () => {
    try {
        console.log(modelProgress.value)
        const response = await ProgressService.start(modelProgress.value);
        modelProgress.value.id = response.data.progress.id;
        modelProgress.value.person_id = response.data.progress.person_id;
        modelProgress.value.step_id = response.data.progress.step_id;
        modelProgress.value.questions = response.data.progress.questions;
        modelProgress.value.answers = response.data.progress.answers;
        modelProgress.value.start_at = response.data.progress.start_at;
        modelProgress.value.end_at = response.data.progress.end_at;
        modelProgress.value.status = response.data.progress.status;
        modelProgress.value.result = response.data.progress.result;
        modelProgress.value.relationships = response.data.progress.relationships;
    } catch (error) {
        if(error.errors) {
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

const submitProgressFinish = async () => {
    try {
        console.log(modelProgress.value)
        const response = await ProgressService.finish(modelProgress.value.id, modelProgress.value);

        alertStore.addAlert({ title: 'Acción exitosa', message: response.message, type: 'success' });

        submitInductionAll();
        submitStepAll(modelInduction.value.id);
    } catch (error) {
        if(error.errors) {
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

const viewIndex = () => {
    showIndexInduction.value = true;
    showStepInduction.value = false;
    showFormInduction.value = false;
    hideSidebar.value = false;
}

const viewList = () => {
    showIndexInduction.value = true;
    if(inductions.value.length == 0) {
        alertStore.addAlert({ title: 'Aceso Denegado', message: 'No hay inducción asignada', type: 'danger' });
        return;
    } else {
        submitInductionFind(inductions.value[0].id);
    }
    showListInduction.value = true;
    showStepInduction.value = false;
    showFormInduction.value = false;
    hideSidebar.value = false;
}

const viewStep = () => {
    showIndexInduction.value = false;
    showStepInduction.value = true;
    showFormInduction.value = false;
    hideSidebar.value = true;
}

const viewForm = () => {
    showIndexInduction.value = false;
    showStepInduction.value = false;
    showFormInduction.value = true;
}

const cleanForm = () => {
    modelProgress.value.id = null;
    modelProgress.value.step_id = null;
    modelProgress.value.questions = {};
    modelProgress.value.answers = {};
    modelProgress.value.start_at = null;
    modelProgress.value.end_at = null;
    modelProgress.value.status = '';
    modelProgress.value.result = '';
    modelProgress.value.relationships = {};
}

onMounted(async () => {
    await submitInductionAll();
    if(inductions.value.reduce((acc, induction) => acc + (induction.steps_finished ?? 0), 0)){
        showListInduction.value = true;
        submitInductionFind(inductions.value[0].id);
    }
})
</script>