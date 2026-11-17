<template>
    <ViewVacant :modelVacant="modelVacant" :vacants="vacants" :pagination="pagination"
        @submitVacantFind="submitVacantFind" :showIndexVacant="showIndexVacant" :showViewVacant="showViewVacant"
        :formatTime="formatTime" @index="indexVacant" @view="viewVacant" :responsabilities="responsabilities"
        :academicRequirements="academicRequirements" :requiredExperiences="requiredExperiences"
        :requiredSkills="requiredSkills" :filtros="filtros" :showDetailVacant="showDetailVacant"
        :showFormVacant="showFormVacant" :showVideoInterviewVacant="showVideoInterviewVacant"
        @processApplication="processApplication" :formatCOP="formatCOP" :modelApplication="modelApplication"
        :modelForm="modelForm" @detail="detailVacant" @form="formVacant" @videoInterview="videoInterviewVacant"
        @submitApplicationStore="submitApplicationStore" :personId="authStore.getAuth.personId"
        :favorites="authStore.getAuth.favorites" @submitPersonToggle="submitPersonToggle" :errors="formErrors" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import router from "@/router";

import ViewVacant from "../../../templates/External/Public/Vacant/Vacant.vue";

import ModelApplication from "@/models/Application";
import ModelVacant from "@/models/Vacant";
import ModelForm from "@/models/Form";
import ModelPerson from "@/models/Person";

import FormService from '@/services/FormService';
import ProfileService from '@/services/ProfileService';
import VacantService from "@/services/VacantService";
import PersonService from '@/services/PersonService';
import ApplicationService from '@/services/ApplicationService';
import ResponsabilityService from "@/services/ResponsabilityService";
import RequiredSkillService from "@/services/RequiredSkillService";
import RequiredExperienceService from "@/services/RequiredExperienceService";
import AcademicRequirementService from "@/services/AcademicRequirementService";

import { useLoaderStore } from "@/stores/loaderStore";
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from "@/stores/alertStore";
import { useSwalStore } from "@/stores/swalStore";
import { useVacantStore } from "@/stores/vacantStore";
import { useRoute, useRouter } from "vue-router";

const loaderStore = useLoaderStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelApplication = ref(new ModelApplication());
const modelForm = ref(new ModelForm());
const modelVacant = ref(new ModelVacant());
const modelPerson = ref(new ModelPerson());

const vacants = ref([]);

const responsabilities = ref([]);
const academicRequirements = ref([]);
const requiredExperiences = ref([]);
const requiredSkills = ref([]);
const formErrors = ref([]);

const showIndexVacant = ref(true);
const showViewVacant = ref(false);
const showDetailVacant = ref(true);
const showFormVacant = ref(true);
const showVideoInterviewVacant = ref(true);
const isSubmitting = ref(false);

const vacantStore = useVacantStore();
const vacantId = useVacantStore().selectedId;
const routerd = useRouter()
const route = useRoute()

const filtros = ref({});
const pagination = reactive({
    search: "",
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: "grid",
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    experience: [],
    work_arrangement_id: [],
    enterprise_id: [],
    contract_type_id: [],
    salary: [],
    country_id: [],
    departament_id: [],
    city_id: [],
    area_id: null,
    status: 'Publicado',
});

const submitVacantAll = async () => {
    try {
        const response = await VacantService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.area_id, pagination.status, null, null, {
            experience: pagination.experience,
            workArrangementId: pagination.work_arrangement_id,
            enterpriseId: pagination.enterprise_id,
            contractTypeId: pagination.contract_type_id,
            salary: pagination.salary,
            countryId: pagination.country_id,
            departamentId: pagination.departament_id,
            cityId: pagination.city_id
        });
        vacants.value = response.data.vacants;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        filtros.value = response.data.filters

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: "warning" });
                });
            });
        } else {
            alertStore.addAlert({ title: "Acceso Denegado", message: error || "Ocurrió un error inesperado.", type: "danger" });
        }
    }
};

const submitAcademicRequirementAll = async () => {
    try {
        const response = await AcademicRequirementService.all(modelVacant.value.position_id);
        academicRequirements.value = response.data.academicRequirements;

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

const submitRequiredExperienceAll = async () => {
    try {
        const response = await RequiredExperienceService.all(modelVacant.value.position_id);
        requiredExperiences.value = response.data.requiredExperiences;
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

const submitRequiredSkillAll = async () => {
    try {
        const response = await RequiredSkillService.all(modelVacant.value.position_id);
        requiredSkills.value = response.data.requiredSkills;
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

const submitResponsabilityAll = async () => {
    try {
        const response = await ResponsabilityService.all(modelVacant.value.position_id);
        responsabilities.value = response.data.responsabilities;
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

const submitVacantFind = async (vacantId, uuid = null) => {
    loaderStore.show();
    try {
        if (!vacantId) return;

        const response = await VacantService.find(vacantId, uuid);
        modelVacant.value.id = response.data.vacant.id;
        modelVacant.value.uuid = response.data.vacant.uuid;
        modelVacant.value.hiring_reason_id = response.data.vacant.hiring_reason_id;
        modelVacant.value.position_id = response.data.vacant.position_id;
        modelVacant.value.headquarter_id = response.data.vacant.headquarter_id;
        modelVacant.value.contract_type_id = response.data.vacant.contract_type_id;
        modelVacant.value.work_arrangement_id = response.data.vacant.work_arrangement_id;
        modelVacant.value.work_day_id = response.data.vacant.work_day_id;
        modelVacant.value.salary_min = response.data.vacant.salary_min;
        modelVacant.value.salary_max = response.data.vacant.salary_max;
        modelVacant.value.start_date = response.data.vacant.start_date;
        modelVacant.value.end_date = response.data.vacant.end_date;
        modelVacant.value.description = response.data.vacant.description;
        modelVacant.value.quantity = response.data.vacant.quantity;
        modelVacant.value.settings = response.data.vacant.settings;
        modelVacant.value.relationships = response.data.vacant.relationships;

        await submitAcademicRequirementAll();
        await submitRequiredExperienceAll();
        await submitRequiredSkillAll();
        await submitResponsabilityAll();

        if (authStore.getAuth.personId) await submitApplicationFind();

        // vacantStore.setSelected(modelVacant.value.id, modelVacant.value);
        vacantStore.setSelected(modelVacant.value.id);
        loaderStore.hide();
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
        indexVacant();
    }
};

const submitProfileFind = async () => {
    try {
        const response = await ProfileService.find(null, authStore.getAuth.personId);
        return true;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            //alertStore.addAlert({ title: 'Acceso Denegado', message: 'No se encontró ningún perfil registrado a este usuario.', type: 'warning' });
        }
        return false;
    }
}

const submitApplicationFind = async () => {
    try {
        const response = await ApplicationService.find(null, authStore.getAuth.personId, modelVacant.value.id);

        modelApplication.value.id = response.data.application.id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.form_id = response.data.application.form_id;
        modelApplication.value.questions = response.data.application.questions;
        modelApplication.value.answers = response.data.application.answers;
        modelApplication.value.status = response.data.application.status;
        viewVacant();
        // alertStore.addAlert({ title: 'Ya has aplicado a esta vacante', message: 'No puedes volver a aplicar a esta vacante.', type: 'info' });
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
}

const submitFormFind = async () => {
    try {
        const response = await FormService.find(null, 134, 'App\\Models\\Entity', modelVacant.value.relationships?.headquarter?.entity_id, 'App\\Models\\Position', modelVacant.value.position_id);

        modelForm.value.id = response.data.form.id;
        modelForm.value.form_type_id = response.data.form.form_type_id;
        modelForm.value.entity_id = response.data.form.entity_id;
        modelForm.value.position_id = response.data.form.position_id;
        modelForm.value.questions = response.data.form.questions;
        modelForm.value.relationships = response.data.form.relationships;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    }
}

const submitApplicationStore = async () => {
    try {
        const response = await ApplicationService.store(modelApplication.value);

        submitVacantAll();
        indexVacant();
        alertStore.addAlert({ title: 'Aplicación exitosa.', message: response.message, type: 'success' });
    } catch (error) {
        formErrors.value = {};
        if (error.errors) {
            formErrors.value = error.errors;
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
}

const submitPersonToggle = async ([vacantId, entityId]) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 1000);
    if (!isAuthenticated()) {
        alertStore.addAlert({ title: 'Acceso Denegado', message: 'Inicia sesión para poder añadir vacantes a tus favoritos.', type: 'danger' });
        return;
    }
    try {
        modelPerson.value.vacant_id = vacantId;
        modelPerson.value.entity_id = entityId;

        const response = await PersonService.toggle(authStore.getAuth.personId, modelPerson.value);
        modelPerson.value.relationships = response.data.person.relationships;

        authStore.setAuth({
            favorites: response.data.person.relationships?.vacants.map(item => item.id),
            follows: response.data.person.relationships?.entities.map(item => item.id)
        });
        if (authStore.getAuth.favorites.includes(vacantId)) {
            alertStore.addAlert({ title: 'Añadido', message: 'Vacante añadida a favoritos.', type: 'success' });
        } else {
            alertStore.addAlert({ title: 'Removido', message: 'Vacante removida de favoritos.', type: 'info' });
        }
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

const processApplication = async () => {
    if (!isAuthenticated()) {
        const action = await swalStore.openSwal({
            type: 'info',
            title: 'Autenticación necesaria',
            message: 'Para postular a la vacante seleccionada debes iniciar sesión con tu cuenta. Si aun no tienes una, puedes registrarte facilmente.',
            confirmText: 'Iniciar sesión',
            cancelText: 'Ahora no',
            thirdText: 'Registrarme',

            confirmColor: 'btn-secondary',
            cancelColor: 'btn-secondary',
            thirdColor: 'btn-primary', // o un btn-outline, etc.

            showConfirm: true,
            showCancel: true,
            showThird: true,
        });
        if (action) router.push('/login');
        if (action === 'third') router.push('/register');
        return false;
    }

    const isProfile = await submitProfileFind();
    if (!isProfile) {
        const confirmed = await swalStore.openSwal({
            type: 'info',
            title: 'Creación de perfil requerida',
            message: 'Para postularte a la vacante seleccionada debes crear tu perfil profesional.',
            confirmText: 'Crear',
            cancelText: 'Cancelar',
            confirmColor: 'btn-question',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });

        confirmed ? router.push('/profile') : '';
        return false;
    }

    await submitFormFind();
    modelApplication.value.person_id = authStore.getAuth.personId;
    modelApplication.value.vacant_id = modelVacant.value.id;

    if (modelForm.value.id) {
        formVacant(); return;
    }

    if (modelVacant.value.settings.video_interview) {
        videoInterviewVacant(); return;
    }

    submitApplicationStore();
}

const isAuthenticated = () => {
    return authStore.isAuthenticated;
}

const formatTime = (durationMonths) => {
    if (!durationMonths) return `0 meses`;

    if (durationMonths < 12) {
        return `${durationMonths} mes${durationMonths !== 1 ? 'es' : ''}`;
    }

    const decades = Math.floor(durationMonths / 120);
    const years = Math.floor((durationMonths % 120) / 12);
    const remainingMonths = durationMonths % 12;

    let parts = [];

    if (decades > 0) {
        parts.push(`${decades} decada${decades !== 1 ? 's' : ''}`);
    }
    if (years > 0) {
        parts.push(`${years} año${years !== 1 ? 's' : ''}`);
    }
    if (remainingMonths > 0) {
        parts.push(`${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`);
    }

    return parts.join(' ');
};

const formatCOP = (n) => {
    const x = Number(n)
    return Number.isFinite(x)
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(x)
        : '—'
}

const indexVacant = () => {
    console.log(vacantStore);
    if (vacantStore.origin === 'empresa') {
        routerd.push({ name: 'EnterpriseExt' })
        vacantStore.clearSelected();
    }
    showIndexVacant.value = true;
    showViewVacant.value = false;
    showDetailVacant.value = false;
    showFormVacant.value = false;
    showVideoInterviewVacant.value = false;
    cleanForm();
}

const viewVacant = () => {
    showIndexVacant.value = false;
    showViewVacant.value = true;
    showDetailVacant.value = true;
    showFormVacant.value = false;
    showVideoInterviewVacant.value = false;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const detailVacant = () => {
    showIndexVacant.value = false;
    showViewVacant.value = true;
    showDetailVacant.value = true;
    showFormVacant.value = false;
    showVideoInterviewVacant.value = false;
}

const formVacant = () => {
    showIndexVacant.value = false;
    showViewVacant.value = true;
    showDetailVacant.value = true;
    showFormVacant.value = true;
    showVideoInterviewVacant.value = false;
}

const videoInterviewVacant = () => {
    showIndexVacant.value = false;
    showViewVacant.value = true;
    showDetailVacant.value = true;
    showFormVacant.value = true;
    showVideoInterviewVacant.value = true;
}

const cleanForm = () => {
    responsabilities.value = [];
    academicRequirements.value = [];
    requiredExperiences.value = [];
    requiredSkills.value = [];
    modelVacant.value.id = null;
    modelVacant.value.hiring_reason_id = null;
    modelVacant.value.position_id = null;
    modelVacant.value.headquarter_id = null;
    modelVacant.value.contract_type_id = null;
    modelVacant.value.work_arrangement_id = null;
    modelVacant.value.work_day_id = null;
    modelVacant.value.salary_min = null;
    modelVacant.value.salary_max = null;
    modelVacant.value.start_date = '';
    modelVacant.value.end_date = null;
    modelVacant.value.description = '';
    modelVacant.value.quantity = null;
    modelVacant.value.settings = {
        polygraph: false,
        video_interview: false
    };
    modelVacant.value.relationships = {};
    modelApplication.value.id = null;
    modelApplication.value.vacant_id = null;
    modelApplication.value.person_id = null;
    modelApplication.value.form_id = null;
    modelApplication.value.questions = {};
    modelApplication.value.answers = {};
    modelApplication.value.status = '';
    modelApplication.value.video.file = {};
    modelApplication.value.relationships = {};
}

if (vacantId) {
    submitVacantFind(vacantId);
    viewVacant();
}

onMounted(async () => {
    loaderStore.show();
    await submitVacantAll();
    const params = new URLSearchParams(window.location.search);
    const param = params.get("v");

    if (param) {
        await submitVacantFind(null, param);
        vacantStore.setSelected(modelVacant.value.id)
        viewVacant();
    }
    loaderStore.hide();
});

watch(pagination, () => {
    submitVacantAll()
}, { deep: true })
</script>
