<template>
    <ViewInterviewInitial :modelVacant="modelVacant" :modelApplication="modelApplication"
        :modelInterviewInitial="modelInterviewInitial" :loadingData="loadingData"
        @submitInterviewInitialStore="submitInterviewInitialStore" :getData="getData"
        @submitInterviewInitialReviewer="submitInterviewInitialReviewer"
        @submitInterviewInitialLeader="submitInterviewInitialLeader" :isDesist="isDesist" :isFinished="isFinished"
        @detail="detailInitialInterview" @detailCurriculum="detailCurriculum" @submitVacantFind="submitVacantFind"
        :loadingDetails="loadingDetails" :showDetailInitialInterview="showDetailInitialInterview"
        :showDetailCurriculum="showDetailCurriculum" @close-detail="closeDetail" :requiredSkills="requiredSkills"
        :requiredExperiences="requiredExperiences" :responsabilities="responsabilities"
        :academicRequirements="academicRequirements" :formatTime="formatTime" :currentLabel="currentLabel"
        :currentColor="currentColor" :requiredBenefits="requiredBenefits" :contarMeses="contarMeses"
        :academicQualifications="academicQualifications" :languageProficiencies="languageProficiencies"
        :professionalSkills="professionalSkills" :professionalExperiences="professionalExperiences"
        :isPending="isPending" :forms="forms" :modelForm="modelForm" :errors="formErrors" @index="indexCandidate"
        :pendingForm="pendingForm" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import ViewInterviewInitial from '../../../templates/Internal/Recruitment/Vacant/Candidate/Interview/InterviewInitial/InterviewInitial.vue';

import ModelApplication from '../../../../models/Application';
import ModelVacant from '../../../../models/Vacant';
import ModelForm from '../../../../models/Form';
import ModelInterviewInitial from '../../../../models/InterviewInitial';
import ApplicationService from '@/services/ApplicationService';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useVacantStore } from '@/stores/vacantStore';
import { useAlertStore } from '@/stores/alertStore';
import VacantService from '@/services/VacantService';
import { useSwalStore } from '@/stores/swalStore';
import InterviewInitialService from '@/services/InterviewInitialService';
import RequiredExperienceService from '@/services/RequiredExperienceService';
import AcademicRequirementService from '@/services/AcademicRequirementService';
import RequiredSkillService from '@/services/RequiredSkillService';
import ResponsabilityService from '@/services/ResponsabilityService';
import AcademicQualificationService from '@/services/AcademicQualificationService';
import LanguageProficiencieService from '@/services/LanguageProficiencieService';
import ProfessionalSkillService from '@/services/ProfessionalSkillService';
import ProfessionalExperienceService from '@/services/ProfessionalExperienceService';
import FormService from '@/services/FormService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const loadingData = ref(false);
const loadingDetails = ref(false);
const getData = ref(false);
const isDesist = ref(false);
const isFinished = ref(false);
const isPending = ref(false);
const activeVacant = ref(null)
const selectedVacantId = ref(null)
const academicRequirements = ref([]);
const requiredExperiences = ref([]);
const requiredSkills = ref([]);
const responsabilities = ref([]);
const requiredBenefits = ref([]);
const academicQualifications = ref([]);
const languageProficiencies = ref([]);
const professionalSkills = ref([]);
const professionalExperiences = ref([]);
const forms = ref([]);
const pendingForm = ref(true);

const formErrors = ref([]);
const isSubmitting = ref(false);
const router = useRouter();


const showDetailInitialInterview = ref(false);
const showDetailCurriculum = ref(false);

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelInterviewInitial = ref(new ModelInterviewInitial());
const modelForm = ref(new ModelForm());

const vacantId = useVacantStore().selectedId;
const personId = useAuthStore().personId;

const applicationStore = useApplicationStore();
const applicationId = useApplicationStore().selectedId;

const submitCandidateFind = async (candidateId) => {
    try {
        loadingDetails.value = true
        const response = await ApplicationService.find(candidateId);
        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.compatibility = response.data.application.compatibility;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;
        if (showDetailCurriculum.value) {
            submitAcademicQualificationAll(response.data.application.relationships.person.profile.id)
            submitLanguageProficiencieAll(response.data.application.relationships.person.profile.id)
            submitProfessionalSkillAll(response.data.application.relationships.person.profile.id)
            submitProfessionalExperienceAll(response.data.application.relationships.person.profile.id)
        }

        applicationStore.setSelected(modelApplication.value.id, modelApplication.value);
        loadingDetails.value = false
    } catch (error) {
        loadingDetails.value = false
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

            academicQualification.departament_id = academicQualification.city?.departament_id;

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

            professionalExperience.departament_id = professionalExperience.city?.departament_id;

            professionalExperience.city_id = professionalExperience.city.id;
            professionalExperience.file = {
                file: professionalExperience.file,
                file_type_id: 99,
                file_subtype_id: 122
            }
        })
        loadingDetails.value = false;
    } catch (error) {
        loadingDetails.value = false;
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
        loadingDetails.value = true
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
        modelVacant.value.end_date = response.data.vacant.end_date
        modelVacant.value.description = response.data.vacant.description;
        modelVacant.value.quantity = response.data.vacant.quantity;
        modelVacant.value.settings = response.data.vacant.settings;
        modelVacant.value.relationships = response.data.vacant.relationships;
        submitFormFind(response.data.vacant.relationships.headquarter.entity.id);
        if (showDetailInitialInterview.value) {
            submitAcademicRequirementAll(response.data.vacant.position_id);
            submitRequiredSkillAll(response.data.vacant.position_id);
            submitRequiredExperienceAll(response.data.vacant.position_id);
            submitResponsabilityAll(response.data.vacant.position_id);
        }
        loadingDetails.value = false
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

const submitRequiredExperienceAll = async (positionId) => {
    try {
        const response = await RequiredExperienceService.all(positionId);
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

const submitAcademicRequirementAll = async (positionId) => {
    try {
        const response = await AcademicRequirementService.all(positionId);
        academicRequirements.value = response.data.academicRequirements;
        academicRequirements.value.forEach(async (academicRequirement, index) => {
            academicRequirement.academic_level_id = academicRequirement.academic_level.id
            academicRequirement.academic_level = academicRequirement.academic_level
            academicRequirement.formation_status_id = academicRequirement.formation_status.id
            academicRequirement.formation_status = academicRequirement.formation_status
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

const submitResponsabilityAll = async (positionId) => {
    try {
        const response = await ResponsabilityService.all(positionId);
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

const submitInterviewInitialFind = async (applicationId) => {
    try {
        loadingData.value = true;

        const response = await InterviewInitialService.find(null, applicationId);
        // statuses.value = response.data.statuses;
        modelInterviewInitial.value.id = response.data.interviewInitial.id;
        modelInterviewInitial.value.application_id = response.data.interviewInitial.application_id;
        modelInterviewInitial.value.date_time = response.data.interviewInitial.date_time;
        modelInterviewInitial.value.questions = response.data.interviewInitial.questions;
        modelInterviewInitial.value.answers = response.data.interviewInitial.answers;
        modelInterviewInitial.value.salary_min = response.data.interviewInitial.salary_min;
        modelInterviewInitial.value.salary_max = response.data.interviewInitial.salary_max;
        modelInterviewInitial.value.reviewer_observation = response.data.interviewInitial.reviewer_observation;
        modelInterviewInitial.value.reviewer_score = response.data.interviewInitial.reviewer_score;
        modelInterviewInitial.value.reviewer_id = response.data.interviewInitial.reviewer_id;
        modelInterviewInitial.value.reviewer_status = response.data.interviewInitial.reviewer_status;
        modelInterviewInitial.value.leader_observation = response.data.interviewInitial.leader_observation;
        modelInterviewInitial.value.leader_score = response.data.interviewInitial.leader_score;
        modelInterviewInitial.value.leader_id = response.data.interviewInitial.leader_id;
        modelInterviewInitial.value.leader_status = response.data.interviewInitial.leader_status;
        modelInterviewInitial.value.indication = response.data.interviewInitial.indication;
        modelInterviewInitial.value.status = response.data.interviewInitial.status;
        modelInterviewInitial.value.relationships = response.data.interviewInitial.relationships;
        getData.value = true;
        loadingData.value = false;

        if (modelInterviewInitial.value.status == 'Desistió') isDesist.value = true;
        if (modelInterviewInitial.value.status == 'Realizado') isFinished.value = true;
        if (modelInterviewInitial.value.status == 'Pendiente') isPending.value = true;
    } catch (error) {
        loadingData.value = false;

        // if (error.errors) {
        //     Object.entries(error.errors).forEach(([field, messages]) => {
        //         messages.forEach((message) => {
        //             alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
        //         });
        //     });
        // } else {
        //     alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        // }
    }
};

const submitInterviewInitialStore = async () => {

    if (modelInterviewInitial.value.status == 'Reprogramado' || modelInterviewInitial.value.status == 'Desistió' || modelInterviewInitial.value.status == 'Realizado') {
        await submitInterviewInitialUpdate();
    } else {
        const confirmed = await swalStore.openSwal({
            type: 'warning',
            title: '¿Desea registrar el agendamiento de la entrevista inicial?',
            message: 'Se creará el agendamiento de la entrevista inicial con la información ingresada.',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmColor: 'btn-primary',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });
        if (confirmed) {
            try {
                modelInterviewInitial.value.application_id = applicationId;
                modelInterviewInitial.value.vacant_id = vacantId;
                const response = await InterviewInitialService.store(modelInterviewInitial.value);
                submitInterviewInitialFind(applicationId);
                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });
                formErrors.value = {};
            } catch (error) {
                if (error.errors) {
                    formErrors.value = prefixErrors(error.errors, 'interviewInitial');
                    alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
                } else {
                    alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
                }
            }
        } else {
            alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación del agendamiento de la entrevista inicial.', type: 'info' });
        }
    }
};

const submitInterviewInitialUpdate = async () => {

    let confirmed = false

    // Configuración de mensajes por estado
    const statusMessages = {
        'Reprogramado': {
            title: '¿Está seguro que desea reprogramar la entrevista?',
            message: 'Esta acción reajustara el agendamiento de la entrevista.',
            confirmColor: 'btn-primary'
        },
        'Desistió': {
            title: '¿Está seguro de registrar el desistimiento del candidato?',
            message: 'Al confirmar, el proceso se registrará como "Desistido" y quedará finalizado de forma definitiva.',
            confirmColor: 'btn-danger'
        },
        'Realizado': {
            title: '¿Confirmar que la entrevista fue realizada?',
            message: 'Al confirmar, la entrevista se marcará como finalizada y continuará su proceso de evaluación.',
            confirmColor: 'btn-primary'
        }
    }

    const selectedStatus = modelInterviewInitial.value.status

    const swalOptions = {
        type: 'warning',
        title: statusMessages[selectedStatus].title,
        message: statusMessages[selectedStatus].message,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: statusMessages[selectedStatus].confirmColor,
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (confirmed) {
        try {
            modelInterviewInitial.value.application_id = applicationId;
            const response = await InterviewInitialService.update(modelInterviewInitial.value.id, modelInterviewInitial.value);
            submitInterviewInitialFind(applicationId);
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
            formErrors.value = {};
        } catch (error) {
            if (error.errors) {
                formErrors.value = prefixErrors(error.errors, 'interviewInitial');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        }
    } else {
    }
};


const submitInterviewInitialReviewer = async (payload) => {
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'warning',
        title: payload.reviewer_status === 'Aprobado'
            ? '¿Desea aprobar la entrevista?'
            : '¿Desea rechazar la entrevista?',
        message:
            payload.reviewer_status === 'Aprobado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Esta acción marcará la entrevista como no aprobada.',
        confirmText: payload.reviewer_status === 'Aprobado' ? 'Aprobar' : 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: payload.reviewer_status === 'Aprobado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (!confirmed) return

    try {
        const dataToSend = {
            ...modelInterviewInitial.value,     // copia del estado actual
            application_id: applicationId,
            reviewer_status: payload.reviewer_status,
            reviewer_id: personId,
            form_id: modelForm.value.id,
            questions: payload.questions,
            answers: payload.answers,
            reviewer_observation: payload.reviewer_observation,
            reviewer_score: payload.reviewer_score,
        }

        const response = await InterviewInitialService.reviewer(
            modelInterviewInitial.value.id,
            dataToSend
        )

        await submitInterviewInitialFind(applicationId)

        alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' })
        formErrors.value = {}
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'interviewInitialReviewer')
            alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' })
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' })
        }
    }
}

const submitInterviewInitialLeader = async (status) => {
    let confirmed = false

    // Texto dinámico según el estado
    const swalOptions = {
        type: 'warning',
        title: status === 'Aprobado'
            ? '¿Desea aprobar la entrevista?'
            : '¿Desea rechazar la entrevista?',
        message:
            status === 'Aprobado'
                ? 'Esta acción aprobará al postulante para la siguiente fase.'
                : 'Esta acción marcará la entrevista como no aprobada.',
        confirmText: status === 'Aprobado' ? 'Aprobar' : 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: status === 'Aprobado' ? 'btn-success' : 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    }

    confirmed = await swalStore.openSwal(swalOptions)

    if (!confirmed) return

    try {
        const dataToSend = {
            ...modelInterviewInitial.value,
            application_id: applicationId,
            leader_status: status,
            leader_id: personId,
            leader_observation: modelInterviewInitial.value.leader_observation,
            leader_score: modelInterviewInitial.value.leader_score,
        }

        const response = await InterviewInitialService.leader(
            modelInterviewInitial.value.id,
            dataToSend
        )

        await submitInterviewInitialFind(applicationId)

        alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' })
        formErrors.value = {}
    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'interviewInitialLeader')
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            })
        } else {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            })
        }
    }

}

const submitFormFind = async (entityId) => {
    try {
        if (!entityId) return;

        const response = await FormService.find(null, 138, 'App\\Models\\Entity', entityId, null);
        forms.value = response.data.form;
        modelForm.value.id = response.data.form.id;
        modelForm.value.form_type_id = response.data.form.form_type_id;
        modelForm.value.entity_id = response.data.form.entity_id;
        modelForm.value.area_id = response.data.form.relationships?.position?.area_id;
        modelForm.value.position_id = response.data.form.position_id;
        modelForm.value.questions = response.data.form.questions;
        modelForm.value.relationships = response.data.form.relationships;
        pendingForm.value = false;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            //alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loadingData.value = false;
    }
};

function detailInitialInterview(vacante) {
    activeVacant.value = vacante
    selectedVacantId.value = vacante?.id ?? null
    showDetailCurriculum.value = false     // 👈 apaga CV
    showDetailInitialInterview.value = true
}

function detailCurriculum(vacante) {
    activeVacant.value = vacante
    selectedVacantId.value = vacante?.id ?? null
    showDetailInitialInterview.value = false // 👈 apaga Vacante
    showDetailCurriculum.value = true
    submitCandidateFind(applicationId)
}

function closeDetail() {
    showDetailInitialInterview.value = false
    showDetailCurriculum.value = false
    activeVacant.value = null
}

function contarMeses(fechaInicio, fechaFin) {
    // Verificar si alguna fecha es null, undefined o cadena vacía
    if (!fechaInicio || !fechaFin) {
        console.warn('Una o ambas fechas son inválidas:', fechaInicio, fechaFin);
        return formatTime(0); // o podrías retornar null, según lo que necesites
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validar que las fechas sean válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        console.warn('Formato de fecha inválido:', fechaInicio, fechaFin);
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

const currentLabel = (percentage) => {
    if (percentage < 20) return 'Principiante'
    if (percentage < 40) return 'Básico'
    if (percentage < 60) return 'Intermedio'
    if (percentage < 90) return 'Avanzado'
    return 'Experto'
}

const currentColor = (percentage) => {
    if (percentage < 20) return '#E45858'
    if (percentage < 40) return '#FFA500'
    if (percentage < 60) return '#FFD700'
    if (percentage < 90) return '#7255F8'
    return '#4CAF50'
}


const init = async () => {
    try {
        await Promise.all([
        ]);
    } finally {

    }
};

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
    init();
});

function indexCandidate() {
    if (route.query.type === 'interviewInitial') {
        router.push({ name: "RecruitmentScheduleInterviewInitial" });
        applicationStore.clearSelected();
        useVacantStore().clearSelected();
        return;
    }
    applicationStore.clearSelected();
    router.push({ name: "RecruitmentCandidate" });
}


if (applicationId) {
    submitCandidateFind(applicationId)
    submitVacantFind()
    submitInterviewInitialFind(applicationId)
}

</script>