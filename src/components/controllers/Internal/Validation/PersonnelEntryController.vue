<template>
    <ViewPersonnelEntry :applications="applications" :pagination="pagination" :loadingData="loadingData"
        @submitVacantFind="submitVacantFind" :modelApplication="modelApplication" :contarMeses="contarMeses"
        :formatTime="formatTime" :academicQualifications="academicQualifications"
        :languageProficiencies="languageProficiencies" :professionalSkills="professionalSkills"
        :professionalExperiences="professionalExperiences" :compatibility="compatibility" :modelVacant="modelVacant"
        :academicRequirements="academicRequirements" :requiredExperiences="requiredExperiences"
        :requiredSkills="requiredSkills" :responsabilities="responsabilities" :currentLabel="currentLabel"
        :currentColor="currentColor" @submitApplicationFind="submitApplicationFind"
        @detailPersonnelEntry="detailPersonnelEntry" @detailCurriculum="detailCurriculum" @detailTest="detailTest"
        @detailInterview="detailInterview" @detailExam="detailExam" @close-detail="closeDetail"
        :showDetailPersonnelEntry="showDetailPersonnelEntry" :showDetailCurriculum="showDetailCurriculum"
        :showDetailInterview="showDetailInterview" :showDetailTest="showDetailTest" :showDetailExam="showDetailExam"
        :modelInterviewInitial="modelInterviewInitial" :modelInterviewPsychotechnical="modelInterviewPsychotechnical"
        :modelInterviewVideo="modelInterviewVideo" :modelTestTechnical="modelTestTechnical"
        :modelTestPsychotechnical="modelTestPsychotechnical" :modelExamMedical="modelExamMedical"
        :modelExamPolygraph="modelExamPolygraph" @authorization="authorization"
        :showAuthorizationModal="showAuthorizationModal" @submitApplicationHiring="submitApplicationHiring"
        @submitApplicationRejected="submitApplicationRejected" :showObservationModal="showObservationModal"
        @close-modals="closeModals" />
</template>
<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';

import ViewPersonnelEntry from '@/components/templates/Internal/Validation/PersonnelEntry/PersonnelEntry.vue';

import ModelApplication from '@/models/Application';
import ModelVacant from '@/models/Vacant';
import ModelPosition from '@/models/Position';
import ModelInterviewInitial from '@/models/InterviewInitial';
import ModelInterviewPsychotechnical from '@/models/InterviewPsychotechnical';
import ModelInterviewVideo from '@/models/InterviewVideo';
import ModelTestTechnical from '@/models/TestTechnical';
import ModelTestPsychotechnical from '@/models/TestPsychotechnical';
import ModelExamMedical from '@/models/ExamMedical';
import ModelExamPolygraph from '@/models/ExamPolygraph';

import ApplicationService from '@/services/ApplicationService';
import VacantService from '@/services/VacantService';
import ResponsabilityService from '@/services/ResponsabilityService';
import RequiredExperienceService from '@/services/RequiredExperienceService';
import RequiredSkillService from '@/services/RequiredSkillService';
import AcademicRequirementService from '@/services/AcademicRequirementService';
import AcademicQualificationService from '@/services/AcademicQualificationService';
import LanguageProficiencieService from '@/services/LanguageProficiencieService';
import ProfessionalSkillService from '@/services/ProfessionalSkillService';
import ProfessionalExperienceService from '@/services/ProfessionalExperienceService';
import InterviewInitialService from '@/services/InterviewInitialService';
import InterviewPsychotechnicalService from '@/services/InterviewPsychotechnicalService';
import InterviewVideoService from '@/services/InterviewVideoService';
import TestTechnicalService from '@/services/TestTechnicalService';
import TestPsychotechnicalService from '@/services/TestPsychotechnicalService';
import ExamMedicalService from '@/services/ExamMedicalService';
import ExamPolygraphService from '@/services/ExamPolygraphService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelApplication = ref(new ModelApplication());
const modelVacant = ref(new ModelVacant());
const modelPosition = ref(new ModelPosition());
const modelInterviewInitial = ref(new ModelInterviewInitial());
const modelInterviewPsychotechnical = ref(new ModelInterviewPsychotechnical());
const modelInterviewVideo = ref(new ModelInterviewVideo());
const modelTestTechnical = ref(new ModelTestTechnical());
const modelTestPsychotechnical = ref(new ModelTestPsychotechnical());
const modelExamMedical = ref(new ModelExamMedical());
const modelExamPolygraph = ref(new ModelExamPolygraph());

const applications = ref([]);
const academicRequirements = ref([]);
const requiredExperiences = ref([]);
const requiredSkills = ref([]);
const responsabilities = ref([]);

const academicQualifications = ref([]);
const languageProficiencies = ref([]);
const professionalSkills = ref([]);
const professionalExperiences = ref([]);

const showDetailPersonnelEntry = ref(false);
const showDetailCurriculum = ref(false);
const showDetailInterview = ref(false);
const showDetailTest = ref(false);
const showDetailExam = ref(false);

const showAuthorizationModal = ref(false);
const showObservationModal = ref(false);

const compatibility = ref(null)
const loadingData = ref(false);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    status: 'Finalista'
})

const submitApplicationAll = async () => {
    try {
        const response = await ApplicationService.all(pagination.current_page, pagination.search, pagination.per_page, null, null, pagination.status, { inProcess: true });
        applications.value = response.data.applications;

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
    }
};

const submitRequiredExperienceAll = async () => {
    try {
        const response = await RequiredExperienceService.all(modelPosition.value.id);
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

const submitAcademicRequirementAll = async () => {
    try {
        const response = await AcademicRequirementService.all(modelPosition.value.id);
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

const submitRequiredSkillAll = async () => {
    try {
        const response = await RequiredSkillService.all(modelPosition.value.id);
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

const submitResponsabilityAll = async () => {
    try {
        const response = await ResponsabilityService.all(modelPosition.value.id);
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
        compatibility.value = calculateCompatibility(professionalSkills.value, requiredSkills.value)
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

const submitVacantFind = async (vacantId) => {
    try {
        loadingData.value = true;
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

        modelPosition.value.id = response?.data?.vacant?.relationships?.position?.id || null;

        await submitAcademicRequirementAll();
        await submitRequiredSkillAll();
        await submitRequiredExperienceAll();
        await submitResponsabilityAll();
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
        loadingData.value = false;
    }
};

const submitApplicationFind = async (applicationId) => {
    try {
        loadingData.value = true;
        const response = await ApplicationService.find(applicationId);

        modelApplication.value.id = response.data.application.id;
        modelApplication.value.vacant_id = response.data.application.vacant_id;
        modelApplication.value.person_id = response.data.application.person_id;
        modelApplication.value.created_at = response.data.application.created_at;
        modelApplication.value.updated_at = response.data.application.updated_at;
        modelApplication.value.status = response.data.application.status;
        modelApplication.value.relationships = response.data.application.relationships;
        modelApplication.value.compatibility = response.data.application.compatibility;

        submitInterviewVideoFind(applicationId);
        submitInterviewInitialFind(applicationId);
        submitInterviewPsychotechnicalFind(applicationId);
        submitTestTechnicalFind(applicationId);
        submitTestPsychotechnicalFind(applicationId);
        submitExamMedicalFind(applicationId);
        submitExamPolygraphFind(applicationId);
        await submitAcademicQualificationAll(response.data.application.relationships.person.profile.id);
        await submitLanguageProficiencieAll(response.data.application.relationships.person.profile.id);
        await submitProfessionalSkillAll(response.data.application.relationships.person.profile.id);
        await submitProfessionalExperienceAll(response.data.application.relationships.person.profile.id);
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
        loadingData.value = false;
    }
};

const submitInterviewVideoFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await InterviewVideoService.find(null, applicationId);

        modelInterviewVideo.value.id = response.data.interviewVideo.id;
        modelInterviewVideo.value.application_id = response.data.interviewVideo.application_id;
        modelInterviewVideo.value.form_id = response.data.interviewVideo.form_id;
        modelInterviewVideo.value.questions = response.data.interviewVideo.questions;
        modelInterviewVideo.value.answers = response.data.interviewVideo.answers;
        modelInterviewVideo.value.reviewer_id = response.data.interviewVideo.reviewer_id;
        modelInterviewVideo.value.reviewer_observation = response.data.interviewVideo.reviewer_observation;
        modelInterviewVideo.value.status = response.data.interviewVideo.status;
        modelInterviewVideo.value.relationships = response.data.interviewVideo.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitInterviewInitialFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await InterviewInitialService.find(null, applicationId);

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

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitInterviewPsychotechnicalFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await InterviewPsychotechnicalService.find(null, applicationId);

        modelInterviewPsychotechnical.value.id = response.data.interviewPsychotechnical.id;
        modelInterviewPsychotechnical.value.application_id = response.data.interviewPsychotechnical.application_id;
        modelInterviewPsychotechnical.value.date_time = response.data.interviewPsychotechnical.date_time;
        modelInterviewPsychotechnical.value.questions = response.data.interviewPsychotechnical.questions;
        modelInterviewPsychotechnical.value.answers = response.data.interviewPsychotechnical.answers;
        modelInterviewPsychotechnical.value.psychologist_observation = response.data.interviewPsychotechnical.psychologist_observation;
        modelInterviewPsychotechnical.value.psychologist_score = response.data.interviewPsychotechnical.psychologist_score;
        modelInterviewPsychotechnical.value.psychologist_id = response.data.interviewPsychotechnical.psychologist_id;
        modelInterviewPsychotechnical.value.psychologist_status = response.data.interviewPsychotechnical.psychologist_status;
        modelInterviewPsychotechnical.value.indication = response.data.interviewPsychotechnical.indication;
        modelInterviewPsychotechnical.value.status = response.data.interviewPsychotechnical.status;
        modelInterviewPsychotechnical.value.relationships = response.data.interviewPsychotechnical.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitTestTechnicalFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await TestTechnicalService.find(null, applicationId);

        modelTestTechnical.value.id = response.data.testTechnical.id;
        modelTestTechnical.value.application_id = response.data.testTechnical.application_id;
        modelTestTechnical.value.start_date = response.data.testTechnical.start_date;
        modelTestTechnical.value.end_date = response.data.testTechnical.end_date;
        modelTestTechnical.value.form_id = response.data.testTechnical.form_id;
        modelTestTechnical.value.questions = response.data.testTechnical.questions;
        modelTestTechnical.value.answers = response.data.testTechnical.answers;
        modelTestTechnical.value.leader_observation = response.data.testTechnical.leader_observation;
        modelTestTechnical.value.leader_id = response.data.testTechnical.leader_id;
        modelTestTechnical.value.leader_status = response.data.testTechnical.leader_status;
        modelTestTechnical.value.start_at = response.data.testTechnical.start_at;
        modelTestTechnical.value.end_at = response.data.testTechnical.end_at;
        modelTestTechnical.value.indication = response.data.testTechnical.indication;
        modelTestTechnical.value.status = response.data.testTechnical.status;
        modelTestTechnical.value.relationships = response.data.testTechnical.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitTestPsychotechnicalFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await TestPsychotechnicalService.find(null, applicationId);

        modelTestPsychotechnical.value.id = response.data.testPsychotechnical.id;
        modelTestPsychotechnical.value.application_id = response.data.testPsychotechnical.application_id;
        modelTestPsychotechnical.value.start_date = response.data.testPsychotechnical.start_date;
        modelTestPsychotechnical.value.end_date = response.data.testPsychotechnical.end_date;
        modelTestPsychotechnical.value.form_id = response.data.testPsychotechnical.form_id;
        modelTestPsychotechnical.value.questions = response.data.testPsychotechnical.questions;
        modelTestPsychotechnical.value.answers = response.data.testPsychotechnical.answers;
        modelTestPsychotechnical.value.psychologist_observation = response.data.testPsychotechnical.psychologist_observation;
        modelTestPsychotechnical.value.psychologist_id = response.data.testPsychotechnical.psychologist_id;
        modelTestPsychotechnical.value.psychologist_status = response.data.testPsychotechnical.psychologist_status;
        modelTestPsychotechnical.value.start_at = response.data.testPsychotechnical.start_at;
        modelTestPsychotechnical.value.end_at = response.data.testPsychotechnical.end_at;
        modelTestPsychotechnical.value.indication = response.data.testPsychotechnical.indication;
        modelTestPsychotechnical.value.status = response.data.testPsychotechnical.status;
        modelTestPsychotechnical.value.relationships = response.data.testPsychotechnical.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitExamMedicalFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await ExamMedicalService.find(null, applicationId);

        modelExamMedical.value.id = response.data.examMedical.id;
        modelExamMedical.value.application_id = response.data.examMedical.application_id;
        modelExamMedical.value.date_time = response.data.examMedical.date_time;
        modelExamMedical.value.country_id = response.data.examMedical.relationships?.city?.departament?.country_id;
        modelExamMedical.value.departament_id = response.data.examMedical.relationships?.city?.departament_id;
        modelExamMedical.value.city_id = response.data.examMedical.city_id;
        modelExamMedical.value.health_entity_id = response.data.examMedical.health_entity_id;
        modelExamMedical.value.address = response.data.examMedical.address;
        modelExamMedical.value.neighborhood = response.data.examMedical.neighborhood;
        modelExamMedical.value.result = response.data.examMedical.result;
        modelExamMedical.value.description = response.data.examMedical.description;
        modelExamMedical.value.indication = response.data.examMedical.indication;
        modelExamMedical.value.status = response.data.examMedical.status;
        modelExamMedical.value.relationships = response.data.examMedical.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitExamPolygraphFind = async (applicationId) => {
    loadingData.value = true;
    try {
        const response = await ExamPolygraphService.find(null, applicationId);

        modelExamPolygraph.value.id = response.data.examPolygraph.id;
        modelExamPolygraph.value.application_id = response.data.examPolygraph.application_id;
        modelExamPolygraph.value.date_time = response.data.examPolygraph.date_time;
        modelExamPolygraph.value.country_id = response.data.examPolygraph.relationships?.city?.departament?.country_id;
        modelExamPolygraph.value.departament_id = response.data.examPolygraph.relationships?.city?.departament_id;
        modelExamPolygraph.value.city_id = response.data.examPolygraph.city_id;
        modelExamPolygraph.value.service_provider_id = response.data.examPolygraph.service_provider_id;
        modelExamPolygraph.value.address = response.data.examPolygraph.address;
        modelExamPolygraph.value.neighborhood = response.data.examPolygraph.neighborhood;
        modelExamPolygraph.value.result = response.data.examPolygraph.result;
        modelExamPolygraph.value.description = response.data.examPolygraph.description;
        modelExamPolygraph.value.indication = response.data.examPolygraph.indication;
        modelExamPolygraph.value.status = response.data.examPolygraph.status;
        modelExamPolygraph.value.relationships = response.data.examPolygraph.relationships;

    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
    } finally {
        loadingData.value = false;
    }
};

const submitApplicationHiring = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea aprobar el ingreso?',
        message: 'Al aprobar esta solicitud, se otorgará a Recursos Humanos el aval para proceder con la creación del contrato.',
        confirmText: 'Aprobar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-success',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelApplication.value.relationships = {};
            const response = await ApplicationService.hiring(modelApplication.value.id, modelApplication.value);
            closeModals();
            alertStore.addAlert({ title: 'Accion exitosa', message: response.message, type: 'success' });
        } catch (error) {
            console.log(error)
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            closeDetail();
            await submitApplicationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la aprobación de ingreso de personal.', type: 'info' });
    }
}

const submitApplicationRejected = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Está seguro de que desea rechazar el ingreso?',
        message: 'Al rechazar esta solicitud, el proceso de ingreso será cancelado.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-danger',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            modelApplication.value.relationships = {};
            const response = await ApplicationService.rejected(modelApplication.value.id, modelApplication.value);
            closeModals();
            alertStore.addAlert({ title: 'Accion exitosa', message: response.message, type: 'success' });
        } catch (error) {
            if (error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    messages.forEach((message) => {
                        alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                    });
                });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            closeDetail();
            await submitApplicationAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló el rechazado de ingreso de personal.', type: 'info' });
    }
}

const contarMeses = (fechaInicio, fechaFin) => {
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

const detailPersonnelEntry = () => {
    showDetailPersonnelEntry.value = true
    showDetailCurriculum.value = false
    showDetailInterview.value = false
    showDetailTest.value = false
    showDetailExam.value = false
}

const detailCurriculum = () => {
    showDetailPersonnelEntry.value = false
    showDetailCurriculum.value = true
    showDetailInterview.value = false
    showDetailTest.value = false
    showDetailExam.value = false
}

const detailInterview = () => {
    showDetailPersonnelEntry.value = false
    showDetailCurriculum.value = false
    showDetailInterview.value = true
    showDetailTest.value = false
    showDetailExam.value = false
}

const detailTest = () => {
    showDetailPersonnelEntry.value = false
    showDetailCurriculum.value = false
    showDetailInterview.value = false
    showDetailTest.value = true
    showDetailExam.value = false
}

const detailExam = () => {
    showDetailPersonnelEntry.value = false
    showDetailCurriculum.value = false
    showDetailInterview.value = false
    showDetailTest.value = false
    showDetailExam.value = true
}

const closeDetail = () => {
    showDetailPersonnelEntry.value = false
    showDetailCurriculum.value = false
    showDetailInterview.value = false
    showDetailTest.value = false
    showDetailExam.value = false
}

const authorization = (status) => {
    if (status == 'approved') {
        showAuthorizationModal.value = true
        showObservationModal.value = false
    } else if (status == 'rejected') {
        showObservationModal.value = true
        showAuthorizationModal.value = false
    }
}

const closeModals = () => {
    showAuthorizationModal.value = false
    showObservationModal.value = false
    modelApplication.value.salary = null
    modelApplication.value.observation = ''
}

watch([professionalSkills, requiredSkills], ([newProfessionalSkills, newRequiredSkills]) => {
    compatibility.value = calculateCompatibility(newProfessionalSkills, newRequiredSkills)
}, { immediate: true })

onMounted(() => {
    submitApplicationAll();
})

watch(() => pagination.current_page, () => {
    submitApplicationAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitApplicationAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitApplicationAll();
    }
});
</script>