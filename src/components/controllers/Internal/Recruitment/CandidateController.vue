<template>
    <ViewCandidate :modelApplication="modelApplication" :applications="applications" :pagination="pagination"
        :filters="filters" :vacant="vacant" :modelVacant="modelVacant" :ShowHistory="ShowHistory" @history="history"
        :showIndex="showIndex" :showCurriculum="showCurriculum" :formatTime="formatTime" :contarMeses="contarMeses"
        @index="viewIndex" @curriculum="viewCurriculum" @submitCandidateFind="submitCandidateFind"
        :loadingData="loadingData" @detail="detailCandidate" :showCandidate="showCandidate" @close-detail="closeDetail"
        :loadingFind="loadingFind" :academicQualifications="academicQualifications"
        :languageProficiencies="languageProficiencies" :professionalSkills="professionalSkills"
        :professionalExperiences="professionalExperiences" :compatibility="compatibility" @indexVacant="indexVacant" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewCandidate from '@/components/templates/Internal/Recruitment/Vacant/Candidate/Candidate.vue';

import ModelVacant from '@/models/Vacant';
import ModelApplication from '@/models/Application';

import VacantService from '@/services/VacantService';
import ApplicationService from '@/services/ApplicationService';
import AcademicQualificationService from '@/services/AcademicQualificationService';
import LanguageProficiencieService from '@/services/LanguageProficiencieService';
import ProfessionalSkillService from '@/services/ProfessionalSkillService';
import ProfessionalExperienceService from '@/services/ProfessionalExperienceService';
import CityService from '@/services/CityService';
import DepartamentService from '@/services/DepartamentService';
import RequiredSkillService from '@/services/RequiredSkillService';

import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useRouter } from 'vue-router';

const modelVacant = ref(new ModelVacant());
const modelApplication = ref(new ModelApplication());

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const showIndex = ref(true)
const showCurriculum = ref(false)
const loading = ref(true);

const applications = ref([]);
const filters = ref([]);

const vacantId = useVacantStore().selectedId;

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const departaments = ref([]);
const cities = ref([]);

//Perfil del candidato
const academicQualifications = ref([]);
const languageProficiencies = ref([]);
const professionalSkills = ref([]);
const professionalExperiences = ref([]);

//Perfil de vacante
const requiredSkills = ref([]);

const loadingData = ref(false);
const loadingFind = ref(false);
const showCandidate = ref(false);
const activeCandidate = ref(null)
const selectedCandidateId = ref(null)
const compatibility = ref(null)
const router = useRouter();

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: null
})


const submitCandidateAll = async () => {
    try {
        loadingData.value = true;
        const response = await ApplicationService.all(pagination.current_page, pagination.search, pagination.per_page, vacantId, null, pagination.status);

        applications.value = response.data.applications;
        filters.value = response.data.filters;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loadingData.value = false;
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

const submitVacantFind = async () => {
    try {
        if (!vacantId) return;

        const response = await VacantService.find(vacantId);
        modelVacant.value.id = response.data.vacant.id;
        modelVacant.value.hiring_reason_id = response.data.vacant.hiring_reason_id;
        modelVacant.value.position_id = response.data.vacant.position_id;
        modelVacant.value.headquarter_id = response.data.vacant.headquarter_id;
        modelVacant.value.contract_type_id = response.data.vacant.contract_type_id;
        modelVacant.value.work_arrangement_id = response.data.vacant.work_arrangement_id;
        modelVacant.value.work_day_id = response.data.vacant.work_day_id;
        modelVacant.value.salary_min = response.data.vacant.salary_min;
        modelVacant.value.salary_max = response.data.vacant.salary_max;
        modelVacant.value.start_date = response.data.vacant.start_date;
        modelVacant.value.settings = response.data.vacant.settings.polygraph;
        modelVacant.value.settings = response.data.vacant.settings.video_interview;
        modelVacant.value.end_date = response.data.vacant.end_date;
        modelVacant.value.description = response.data.vacant.description;
        modelVacant.value.quantity = response.data.vacant.quantity;
        modelVacant.value.settings = response.data.vacant.settings;
        modelVacant.value.relationships = response.data.vacant.relationships;
        submitRequiredSkillAll(response.data.vacant.position_id);

        
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


const submitRequiredSkillAll = async (positionId) => {
    try {
        const response = await RequiredSkillService.all(positionId);
        requiredSkills.value = response.data.requiredSkills;
        requiredSkills.value.forEach(async (requiredSkill, index) => {
            requiredSkill.skill_type = requiredSkill.skill.skill_type[0];
            requiredSkill.skill_type_id = requiredSkill.skill.skill_type[0].id;
            requiredSkill.skill_id = requiredSkill.skill.id;
            requiredSkill.skill = requiredSkill.skill;
            requiredSkill.percentage = requiredSkill.percentage;
        })
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

const submitCandidateFind = async (candidateId) => {
    try {
        loadingFind.value = true;
        const response = await ApplicationService.find(candidateId);
        
        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.compatibility = response.data.application.compatibility;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;
        await submitAcademicQualificationAll(response.data.application.relationships.person.profile.id)
        await submitLanguageProficiencieAll(response.data.application.relationships.person.profile.id)
        await submitProfessionalSkillAll(response.data.application.relationships.person.profile.id)
        await submitProfessionalExperienceAll(response.data.application.relationships.person.profile.id)
        if (!showCandidate.value) {
            applicationStore.setSelected(modelApplication.value.id, modelApplication.value);
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

const submitAcademicQualificationAll = async (profileId) => {
    try {
        const response = await AcademicQualificationService.all(profileId);
        academicQualifications.value = response.data.academicQualifications;
        academicQualifications.value.forEach(async (academicQualification, index) => {
            academicQualification.country_id = academicQualification.city?.departament.country_id;
            if (academicQualification.country_id) await submitDepartamentAll(academicQualification.country_id);

            academicQualification.departament_id = academicQualification.city?.departament_id;
            if (academicQualification.departament_id) await submitCityAll(academicQualification.departament_id);

            academicQualification.city_id = academicQualification.city.id;
            academicQualification.academic_level_id = academicQualification.academic_level.id
            academicQualification.formation_status_id = academicQualification.formation_status.id
            academicQualification.file = {
                file: academicQualification.file,
                file_type_id: 99,
                file_subtype_id: 122
            }
        })
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

const submitLanguageProficiencieAll = async (profileId) => {
    try {
        const response = await LanguageProficiencieService.all(profileId);
        languageProficiencies.value = response.data.languageProficiencies;
        languageProficiencies.value.forEach(async (languageProficiencie, index) => {
            languageProficiencie.language_id = languageProficiencie.language.id;
            languageProficiencie.language_level_id = languageProficiencie.language_level.id;
            languageProficiencie.file = {
                file: languageProficiencie.file,
                file_type_id: 99,
                file_subtype_id: 122
            }
        })
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

const submitProfessionalSkillAll = async (profileId) => {
    try {
        const response = await ProfessionalSkillService.all(profileId);
        professionalSkills.value = response.data.professionalSkills;
        professionalSkills.value.forEach(async (professionalSkill, index) => {
            professionalSkill.skill_type = professionalSkill.skill.skill_type[0];
            professionalSkill.skill_type_id = professionalSkill.skill.skill_type[0]?.id;
            professionalSkill.skill_id = professionalSkill.skill.id;
            professionalSkill.percentage = professionalSkill.percentage;
        })
        if (showCandidate.value) {
            compatibility.value = calculateCompatibility(professionalSkills.value, requiredSkills.value)
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

const submitProfessionalExperienceAll = async (profileId) => {
    try {
        const response = await ProfessionalExperienceService.all(profileId);
        professionalExperiences.value = response.data.professionalExperiences;
        professionalExperiences.value.forEach(async (professionalExperience, index) => {
            professionalExperience.supervisor_dialing_country_id = professionalExperience.supervisor_dialing_country.id;
            professionalExperience.work_arrangement_id = professionalExperience.work_arrangement.id;

            professionalExperience.country_id = professionalExperience.city?.departament.country_id;
            if (professionalExperience.country_id) await submitDepartamentAll(professionalExperience.country_id);

            professionalExperience.departament_id = professionalExperience.city?.departament_id;
            if (professionalExperience.departament_id) await submitCityAll(professionalExperience.departament_id);

            professionalExperience.city_id = professionalExperience.city.id;
            professionalExperience.file = {
                file: professionalExperience.file,
                file_type_id: 99,
                file_subtype_id: 122
            }
        })
        loadingFind.value = false;
    } catch (error) {
        loadingFind.value = false;
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

const submitDepartamentAll = async (countryId) => {
    try {
        if (!countryId) { departaments.value = []; return; }

        const response = await DepartamentService.all(1, '', null, countryId);
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

const submitCityAll = async (departamentId) => {
    try {
        if (!departamentId) { cities.value = []; return; }

        const response = await CityService.all(1, '', null, departamentId);
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

function contarMeses(fechaInicio, fechaFin) {
    // Verificar si alguna fecha es null, undefined o cadena vacía
    if (!fechaInicio || !fechaFin) {
        return formatTime(0); // o podrías retornar null, según lo que necesites
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validar que las fechas sean válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return formatTime(0);
    }

    let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
    meses += fin.getMonth() - inicio.getMonth();

    // Si el día final es menor al del inicio, no se ha completado el mes
    if (fin.getDate() < inicio.getDate()) {
        meses--;
    }

    return formatTime(meses);
}


function formatTime(durationMonths) {
    if (!durationMonths) return `0 meses`;

    const years = Math.floor(durationMonths / 12);
    const remainingMonths = durationMonths % 12;

    if (years === 0) {
        return `${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`;
    }

    if (remainingMonths === 0) {
        return `${years} año${years !== 1 ? 's' : ''}`;
    }

    return `${years} año${years !== 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`;
}

const calculateCompatibility = (professionalSkills, requiredSkills) => {
    const prof = Array.isArray(professionalSkills) ? professionalSkills : [];
    const reqs = Array.isArray(requiredSkills) ? requiredSkills : [];

    // Si no hay requerimientos, definimos compatibilidad como 0 (o el valor que prefieras).
    if (reqs.length === 0) return 0;

    // Helper: convierte a número [0..100] o NaN si no es convertible
    const toPct = (x) => {
        const n = Number(x);
        if (!Number.isFinite(n)) return NaN;
        return Math.max(0, Math.min(100, n));
    };

    // Indexa habilidades del candidato
    const candidateMap = new Map(
        prof
            .filter(ps => ps && ps.skill && ps.skill.id != null)
            .map(ps => [ps.skill.id, toPct(ps.percentage)])
    );

    let sum = 0;
    let count = 0;

    for (const req of reqs) {
        if (!req || !req.skill || req.skill.id == null) continue;

        const requiredPct = toPct(req.percentage);

        // Si el requerido no es un número válido o es <= 0, lo omitimos del cómputo
        if (!Number.isFinite(requiredPct) || requiredPct <= 0) continue;

        const candPct = candidateMap.get(req.skill.id);

        let score = 0;
        if (!Number.isFinite(candPct)) {
            // No tiene la skill → 0
            score = 0;
        } else if (candPct >= requiredPct) {
            score = 100;
        } else {
            score = (candPct / requiredPct) * 100;
        }

        sum += score;
        count += 1;
    }

    // Si nada fue computable (p. ej., todos requerimientos inválidos), devuelve 0
    if (count === 0) return 0;

    const avg = Math.max(0, Math.min(100, sum / count));
    return Math.round(avg);
};


watch(
    [professionalSkills, requiredSkills],
    ([newProfessional, newRequired]) => {
        compatibility.value = calculateCompatibility(newProfessional, newRequired)
    },
    { immediate: true }
)


function closeDetail() {
    showCandidate.value = false
    activeCandidate.value = null
}

function detailCandidate(candidate) {
    activeCandidate.value = candidate
    selectedCandidateId.value = candidate?.id ?? null
    showCandidate.value = true
}

const viewIndex = () => {
    applicationStore.clearSelected();
    showIndex.value = true;
    showCurriculum.value = false;
    cleanForms();
}

const viewCurriculum = () => {
    showCurriculum.value = true;
    showIndex.value = false;
    showCandidate.value = false
}

const cleanForms = () => {
    modelApplication.value.id = null;
    modelApplication.value.vacant_id = null;
    modelApplication.value.person_id = null;
    modelApplication.value.created_at = null;
    modelApplication.value.updated_at = null;
    modelApplication.value.status = null;
    modelApplication.value.relationships = {};
}

const init = async () => {
    // loading.value = true;
    // applicationStore.clearSelected();
    try {
        await Promise.all([
            submitCandidateAll(),
            submitVacantFind()
        ]);
    } finally {
        // loading.value = false;
    }
};

onMounted(() => {
    init();
});

function indexVacant() {
    router.push({ name: "RecruitmentVacant" }); 
}

if (applicationId) {
    viewCurriculum()
    submitCandidateFind(applicationId)
}

watch(pagination, () => {
    submitCandidateAll()
}, { deep: true })
</script>