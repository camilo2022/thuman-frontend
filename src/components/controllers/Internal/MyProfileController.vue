<template>
    <ViewProfile :showCreateProfile="showCreateProfile" @create="createProfile" :showEditProfile="showEditProfile"
        @edit="editProfile" :currentStep="currentStep" :totalSteps="totalSteps" @next="nextStep" @prev="prevStep"
        :modelPerson="modelPerson" :modelProfile="modelProfile" @submitDepartamentAll="submitDepartamentAll"
        @submitCityAll="submitCityAll" :maritalStatuses="maritalStatuses" :sexes="sexes" :skills="skills"
        :countries="countries" :departaments="departaments" :cities="cities" :documentTypes="documentTypes"
        :academicQualifications="academicQualifications" :languageProficiencies="languageProficiencies"
        :professionalSkills="professionalSkills" :modelProfessionalSkill="modelProfessionalSkill"
        :professionalExperiences="professionalExperiences" :academicLevels="academicLevels"
        :formationStatuses="formationStatuses" :workArrangements="workArrangements" :currentLabel="currentLabel"
        :currentColor="currentColor" :languageLevels="languageLevels" :languages="languages" :editAboutMe="editAboutMe"
        :editEducation="editEducation" :editLanguage="editLanguage" :editSkill="editSkill"
        :editExperience="editExperience" :editAttachment="editAttachment" @toggleEditAboutMe="toggleEditAboutMe"
        @toggleEditEducation="toggleEditEducation" @toggleEditLanguage="toggleEditLanguage"
        @toggleEditSkill="toggleEditSkill" @toggleEditExperience="toggleEditExperience"
        @toggleEditAttachment="toggleEditAttachment" @submitProfileUpdate="submitProfileUpdate"
        @addProfessionalSkill="addProfessionalSkill" @removeProfessionalSkill="removeProfessionalSkill"
        @submitProfessionalSkillStoreOrUpdate="submitProfessionalSkillStoreOrUpdate"
        @addLanguageProficiencie="addLanguageProficiencie" @removeLanguageProficiencie="removeLanguageProficiencie"
        @submitProfessionalExperienceStoreOrUpdate="submitProfessionalExperienceStoreOrUpdate"
        @addAcademicQualification="addAcademicQualification" @removeAcademicQualification="removeAcademicQualification"
        @addProfessionalExperience="addProfessionalExperience"
        @removeProfessionalExperience="removeProfessionalExperience"
        @submitAcademicQualificationStoreOrUpdate="submitAcademicQualificationStoreOrUpdate"
        @submitProfileStore="submitProfileStore" :currentComponent="currentComponent"
        @submitLanguageProficiencieStoreOrUpdate="submitLanguageProficiencieStoreOrUpdate" :errors="formErrors"
        :filesAcademic="filesAcademic" @toFavorite="toFavorite" />
</template>

<script setup>
import { ref, computed, reactive, watch, watchEffect, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ViewProfile from '@/components/templates/Internal/MyProfile/MyProfile.vue';
import ViewProfileStep from '@/components/templates/External/Private/Profile/ProfileStep.vue';
import ViewProfileStepOne from '@/components/templates/External/Private/Profile/ProfileStepOne.vue';
import ViewProfileStepTwo from '@/components/templates/External/Private/Profile/ProfileStepTwo.vue';
import ViewProfileStepThree from '@/components/templates/External/Private/Profile/ProfileStepThree.vue';
import ViewProfileStepFour from '@/components/templates/External/Private/Profile/ProfileStepFour.vue';
import ViewProfileStepFive from '@/components/templates/External/Private/Profile/ProfileStepFive.vue';

import ModelPerson from '@/models/Person';
import ModelProfile from '@/models/Profile';
import ModelAcademicQualification from '@/models/AcademicQualification';
import ModelLanguageProficiencie from '@/models/LanguageProficiencie';
import ModelProfessionalExperience from '@/models/ProfessionalExperience';
import ModelProfessionalSkill from '@/models/ProfessionalSkill';

import CountryService from '@/services/CountryService';
import DepartamentService from '@/services/DepartamentService';
import CityService from '@/services/CityService';
import DocumentTypeService from '@/services/DocumentTypeService';
import MaritalStatusService from '@/services/MaritalStatusService';
import SexService from '@/services/SexService';
import AcademicLevelService from '@/services/AcademicLevelService';
import LanguageLevelService from '@/services/LanguageLevelService';
import LanguageService from '@/services/LanguageService';
import FormationStatusService from '@/services/FormationStatusService';
import SkillService from '@/services/SkillService';
import WorkArrangementService from '@/services/WorkArrangementService';

import PersonService from '@/services/PersonService';
import ProfileService from '@/services/ProfileService';

import AcademicQualificationService from '@/services/AcademicQualificationService';
import LanguageProficiencieService from '@/services/LanguageProficiencieService';
import ProfessionalSkillService from '@/services/ProfessionalSkillService';
import ProfessionalExperienceService from '@/services/ProfessionalExperienceService';

import { useLoaderStore } from "@/stores/loaderStore";
import { useAuthStore } from '@/stores/authStore';
import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import { useVacantStore } from "@/stores/vacantStore";

const loaderStore = useLoaderStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const swalStore = useSwalStore();
const vacantStore = useVacantStore();

const route = useRoute();
const router = useRouter();

const academicQualifications = ref([]);
const languageProficiencies = ref([]);
const professionalSkills = ref([]);
const professionalExperiences = ref([]);
professionalExperiences.value.push(new ModelProfessionalExperience());

const modelPerson = ref(new ModelPerson());
const modelProfile = ref(new ModelProfile());
const modelAcademicQualification = ref(new ModelAcademicQualification());
const modelLanguageProficiencie = ref(new ModelLanguageProficiencie());
const modelProfessionalSkill = ref(new ModelProfessionalSkill());
const modelProfessionalExperience = ref(new ModelProfessionalExperience());

modelProfile.value.person_id = authStore.getAuth.personId;

const countries = ref([]);
const departaments = ref({});
const cities = ref({});
const documentTypes = ref([]);
const maritalStatuses = ref([]);
const sexes = ref([]);
const academicLevels = ref([]);
const formationStatuses = ref([]);
const languages = ref([]);
const languageLevels = ref([]);
const skills = ref([]);
const workArrangements = ref([]);

const showCreateProfile = ref(false);
const showEditProfile = ref(false);

const editAboutMe = ref(false);
const editEducation = ref(false);
const editLanguage = ref(false);
const editSkill = ref(false);
const editExperience = ref(false);
const editAttachment = ref(false);
const formErrors = ref({});
const isSubmitting = ref(false);
const firstProfile = ref(false);
const isToggling = ref(false);
const filesAcademic = ref(false);

const steps = {
    0: ViewProfileStep,
    1: ViewProfileStepOne,
    2: ViewProfileStepTwo,
    3: ViewProfileStepThree,
    4: ViewProfileStepFour,
    5: ViewProfileStepFive
}

const currentStep = ref(0);
const totalSteps = ref(5);
const currentComponent = computed(() => steps[currentStep.value]);

const submitCountryAll = async () => {
    try {
        const response = await CountryService.all();
        countries.value = response.data.countries;

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

const submitDepartamentAll = async ({ key, countryId }) => {
    try {
        if (!countryId) { departaments.value[key] = []; return; }
        const response = await DepartamentService.all(1, '', null, countryId);
        departaments.value[key] = response.data.departaments;
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

const submitCityAll = async ({ key, departamentId }) => {
    try {
        if (!departamentId) { cities.value[key] = []; return; }
        const res = await CityService.all(1, '', null, departamentId);
        cities.value[key] = res.data.cities;
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

const submitDocumentTypeAll = async () => {
    try {
        const response = await DocumentTypeService.all(1, '', null, modelPerson.value.document_issue_country_id);
        documentTypes.value = response.data.documentTypes;
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

const submitMaritalStatusAll = async () => {
    try {
        const response = await MaritalStatusService.all();
        maritalStatuses.value = response.data.maritalStatuses;
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

const submitSexAll = async () => {
    try {
        const response = await SexService.all();
        sexes.value = response.data.sexes;
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

const submitFormationStatusAll = async () => {
    try {
        const response = await FormationStatusService.all();
        formationStatuses.value = response.data.formationStatuses;
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

const submitLanguageLevelAll = async () => {
    try {
        const response = await LanguageLevelService.all();
        languageLevels.value = response.data.languageLevels;
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

const submitLanguageAll = async () => {
    try {
        const response = await LanguageService.all();
        languages.value = response.data.languages;
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

const submitAcademicLevelAll = async () => {
    try {
        const response = await AcademicLevelService.all();
        academicLevels.value = response.data.academicLevels;
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
    try {
        const response = await SkillService.all();
        skills.value = response.data.skills;
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

const submitWorkArrangementAll = async () => {
    try {
        const response = await WorkArrangementService.all();
        workArrangements.value = response.data.workArrangements;
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

const submitAcademicQualificationAll = async () => {
    try {
        filesAcademic.value = true
        const response = await AcademicQualificationService.all(modelProfile.value.id);
        academicQualifications.value = response.data.academicQualifications;
        console.log(response.data.academicQualifications)
        academicQualifications.value.forEach(async (academicQualification, index) => {
            academicQualification.country_id = academicQualification.city?.departament.country_id;
            const k = `academic_${index}`;
            if (academicQualification.country_id) {
                await submitDepartamentAll({ key: k, countryId: academicQualification.country_id });
            }
            academicQualification.departament_id = academicQualification.city?.departament_id;
            if (academicQualification.departament_id) {
                await submitCityAll({ key: k, departamentId: academicQualification.departament_id });
            }

            academicQualification.city_id = academicQualification.city.id;
            academicQualification.academic_level_id = academicQualification.academic_level.id
            academicQualification.formation_status_id = academicQualification.formation_status.id
            academicQualification.file = {
                file: academicQualification.file ?? null,
                file_type_id: academicQualification.file?.file_type_id ?? 100,
                file_subtype_id: academicQualification.file?.file_subtype_id ?? 122
            }
        })
        console.log(academicQualifications.value)
        filesAcademic.value = false
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

const submitLanguageProficiencieAll = async () => {
    try {
        const response = await LanguageProficiencieService.all(modelProfile.value.id);
        languageProficiencies.value = response.data.languageProficiencies;
        languageProficiencies.value.forEach(async (languageProficiencie, index) => {
            languageProficiencie.language_id = languageProficiencie.language.id;
            languageProficiencie.language_level_id = languageProficiencie.language_level.id;
            languageProficiencie.file = {
                file: languageProficiencie.file,
                file_type_id: 100,
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

const submitProfessionalSkillAll = async () => {
    try {
        const response = await ProfessionalSkillService.all(modelProfile.value.id);
        professionalSkills.value = response.data.professionalSkills;
        professionalSkills.value.forEach((professionalSkill, index) => {

            if (!professionalSkill.skill) {
                return; // salta este registro
            }

            professionalSkill.skill_type = professionalSkill.skill.skill_type?.[0] || null;
            professionalSkill.skill_type_id = professionalSkill.skill_type?.id || null;
            professionalSkill.skill_id = professionalSkill.skill.id;
        });

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

const submitProfessionalExperienceAll = async () => {
    try {
        const response = await ProfessionalExperienceService.all(modelProfile.value.id);
        professionalExperiences.value = response.data.professionalExperiences;
        professionalExperiences.value.forEach(async (professionalExperience, index) => {
            professionalExperience.supervisor_dialing_country_id = professionalExperience.supervisor_dialing_country.id;
            professionalExperience.work_arrangement_id = professionalExperience.work_arrangement.id;

            professionalExperience.country_id = professionalExperience.city?.departament.country_id;
            const k = `experience_${index}`;
            if (professionalExperience.country_id) {
                await submitDepartamentAll({ key: k, countryId: professionalExperience.country_id });
            }

            professionalExperience.departament_id = professionalExperience.city?.departament_id;
            if (professionalExperience.departament_id) {
                await submitCityAll({ key: k, departamentId: professionalExperience.departament_id });
            }
            professionalExperience.city_id = professionalExperience.city.id;
            professionalExperience.file = {
                file: professionalExperience.file,
                file_type_id: 100,
                file_subtype_id: 123
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

const submitPersonFind = async () => {
    try {
        const response = await PersonService.find(authStore.getAuth.personId);

        modelPerson.value.id = response.data.person.id;
        modelPerson.value.first_name = response.data.person.first_name;
        modelPerson.value.second_name = response.data.person.second_name;
        modelPerson.value.first_last_name = response.data.person.first_last_name;
        modelPerson.value.second_last_name = response.data.person.second_last_name;
        modelPerson.value.birth_date = response.data.person.birth_date;

        modelPerson.value.document_issue_country_id = response.data.person.relationships?.document_issue_city?.departament?.country_id;
        if (modelPerson.value.document_issue_country_id) {
            await submitDepartamentAll({ key: 'person_document_issue', countryId: modelPerson.value.document_issue_country_id });
        }
        await submitDocumentTypeAll();
        modelPerson.value.document_issue_departament_id = response.data.person.relationships?.document_issue_city?.departament_id;
        if (modelPerson.value.document_issue_departament_id) {
            await submitCityAll({ key: 'person_document_issue', departamentId: modelPerson.value.document_issue_departament_id });
        }
        modelPerson.value.document_issue_city_id = response.data.person.relationships?.document_issue_city?.id;

        modelPerson.value.birth_country_id = response.data.person.relationships?.birth_city?.departament?.country_id;
        if (modelPerson.value.birth_country_id) {
            await submitDepartamentAll({ key: 'person_birth', countryId: modelPerson.value.birth_country_id });
        } modelPerson.value.birth_departament_id = response.data.person.relationships?.birth_city?.departament_id;
        if (modelPerson.value.birth_departament_id) {
            await submitCityAll({ key: 'person_birth', departamentId: modelPerson.value.birth_departament_id });
        }
        modelPerson.value.birth_city_id = response.data.person.relationships?.birth_city?.id;

        modelPerson.value.document_number = response.data.person.document_number;
        modelPerson.value.document_number_confirmation = response.data.person.document_number;
        modelPerson.value.document_issue_date = response.data.person.document_issue_date;
        modelPerson.value.document_type_id = response.data.person.document_type_id;

        modelPerson.value.country_id = response.data.person.relationships?.city?.departament?.country_id;
        if (modelPerson.value.country_id) {
            await submitDepartamentAll({ key: 'person_residence', countryId: modelPerson.value.country_id });
        }
        modelPerson.value.departament_id = response.data.person.relationships?.city?.departament_id;
        if (modelPerson.value.departament_id) {
            await submitCityAll({ key: 'person_residence', departamentId: modelPerson.value.departament_id });
        }
        modelPerson.value.city_id = response.data.person.relationships?.city?.id;

        modelPerson.value.address = response.data.person.address;
        modelPerson.value.neighborhood = response.data.person.neighborhood;
        modelPerson.value.dialing_country_id = response.data.person.dialing_country_id;
        modelPerson.value.phone_number = response.data.person.phone_number;
        modelPerson.value.phone_number_verified_at = response.data.person.phone_number_verified_at;
        modelPerson.value.email = response.data.person.email;
        modelPerson.value.email_verified_at = response.data.person.email_verified_at;
        modelPerson.value.person_type_id = response.data.person.person_type_id;
        modelPerson.value.sex_id = response.data.person.sex_id;
        modelPerson.value.gender_id = response.data.person.gender_id;
        modelPerson.value.blood_type_id = response.data.person.blood_type_id;
        modelPerson.value.marital_status_id = response.data.person.marital_status_id;
        modelPerson.value.file.file = response.data.person.relationships?.file;
        modelPerson.value.photo.file = response.data.person.relationships?.photo;
        modelPerson.value.relationships = response.data.person.relationships;

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
}

const submitProfileFind = async (opts = { resetUI: true }) => {
    try {
        const response = await ProfileService.find(null, modelProfile.value.person_id);
        modelProfile.value.id = response.data.profile.id;
        modelProfile.value.person_id = response.data.profile.person_id;
        modelProfile.value.title = response.data.profile.title;
        modelProfile.value.description = response.data.profile.description;
        modelProfile.value.file.file = response.data.profile.relationships?.file;
        modelProfile.value.relationships = response.data.profile.relationships;

        await submitAcademicQualificationAll();
        await submitLanguageProficiencieAll();
        await submitProfessionalSkillAll();
        await submitProfessionalExperienceAll();

        if (opts.resetUI) editProfile();
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        }
        createProfile(false);
    }
}

const submitProfileStore = async () => {
    if (validateStep5Front()) {
        firstProfile.value = true;
        const confirmed = await swalStore.openSwal({
            type: 'warning',
            title: '¿Desea registrar su perfil?',
            message: 'Se creará la perfil con la información ingresada.',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmColor: 'btn-question',
            cancelColor: 'btn-secondary',
            showConfirm: true,
            showCancel: true,
        });

        if (confirmed) {
            try {
                const response = await ProfileService.store(modelProfile.value);
                alertStore.addAlert({ title: 'Registro exitoso', message: response.message, type: 'success' });

                modelProfile.value.id = response.data.profile.id;
                modelProfile.value.person_id = response.data.profile.person_id;
                modelProfile.value.title = response.data.profile.title;
                modelProfile.value.description = response.data.profile.description;

                await submitPersonUpdate();
                await submitAcademicQualificationStoreOrUpdate();
                await submitLanguageProficiencieStoreOrUpdate();
                await submitProfessionalSkillStoreOrUpdate();
                await submitProfessionalExperienceStoreOrUpdate();
                await submitPersonFind();
                await submitProfileFind();
            } catch (error) {
                console.log(error)
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
        }
    } else {
        alertStore.addAlert({
            title: 'Error',
            message: 'Verifique los archivos adjuntos.',
            type: 'danger',
        });
    }
}

const submitAcademicQualificationStoreOrUpdate = async () => {
    console.log(academicQualifications.value)
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    let hasValidationErrors = false;
    let hasOtherErrors = false;

    let newErrors = {};
    try {
        for (let index = 0; index < academicQualifications.value.length; index++) {
            const academicQualification = academicQualifications.value[index];

            modelAcademicQualification.value.id = academicQualification?.id;
            modelAcademicQualification.value.profile_id = modelProfile.value.id;
            modelAcademicQualification.value.city_id = academicQualification.city_id;
            modelAcademicQualification.value.academic_level_id = academicQualification.academic_level_id;
            modelAcademicQualification.value.academic_institution = academicQualification.academic_institution;
            modelAcademicQualification.value.academic_title = academicQualification.academic_title;
            modelAcademicQualification.value.formation_status_id = academicQualification.formation_status_id;
            modelAcademicQualification.value.start_date = academicQualification.start_date;
            if (academicQualification.formation_status_id != 27) {
                modelAcademicQualification.value.end_date = null;
            } else {
                modelAcademicQualification.value.end_date = academicQualification.end_date;
            }
            modelAcademicQualification.value.file = academicQualification.file;
            console.log(modelAcademicQualification.value);

            try {
                if (modelAcademicQualification.value.id == null) {
                    await submitAcademicQualificationStore(index);
                } else {
                    await submitAcademicQualificationUpdate();
                }
            } catch (error) {
                if (error?.errors) {
                    hasValidationErrors = true;

                    Object.assign(
                        newErrors,
                        prefixErrorsByIndex(error.errors, 'academicQualifications', index)
                    );
                } else {
                    hasOtherErrors = true;
                }
            }
        }

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('academicQualifications_'))
        );
        formErrors.value = { ...keepOthers, ...newErrors };

        if (hasValidationErrors) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
            return;
        }

        if (hasOtherErrors) {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: 'Ocurrió un error inesperado.',
                type: 'danger'
            });
            return;
        }

        if (!firstProfile.value) {
            alertStore.addAlert({ title: 'Registro exitoso', message: 'La formación académica se ha registrado correctamente.', type: 'success' });
            toggleEditEducation();
        }
        modelAcademicQualification.value = new ModelAcademicQualification();
    } finally {
        isSubmitting.value = false;
    }
    modelAcademicQualification.value = new ModelAcademicQualification();
}

const submitAcademicQualificationStore = async (index) => {
    const response = await AcademicQualificationService.store(modelAcademicQualification.value);
    academicQualifications.value[index].id = response.data.academicQualification.id;
    return response;
}

const submitAcademicQualificationUpdate = async () => {
    const response = await AcademicQualificationService.update(
        modelAcademicQualification.value.id,
        modelAcademicQualification.value
    );
    return response;
};

const submitLanguageProficiencieStoreOrUpdate = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    let hasValidationErrors = false;
    let hasOtherErrors = false;

    let newErrors = {};

    try {
        for (let index = 0; index < languageProficiencies.value.length; index++) {
            const languageProficiencie = languageProficiencies.value[index];

            modelLanguageProficiencie.value.id = languageProficiencie?.id || null;
            modelLanguageProficiencie.value.profile_id = modelProfile.value.id;
            modelLanguageProficiencie.value.language_id = languageProficiencie.language_id;
            modelLanguageProficiencie.value.language_level_id = languageProficiencie.language_level_id;
            modelLanguageProficiencie.value.file = languageProficiencie.file;

            try {
                if (!modelLanguageProficiencie.value.id) {
                    await submitLanguageProficiencieStore(index);
                } else {
                    await submitLanguageProficiencieUpdate();
                }
            } catch (error) {
                if (error?.errors) {
                    hasValidationErrors = true;

                    Object.assign(
                        newErrors,
                        prefixErrorsByIndex(error.errors, 'languageProficiencies', index)
                    );
                } else {
                    hasOtherErrors = true;
                }
            }
        }

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('languageProficiencies_'))
        );
        formErrors.value = { ...keepOthers, ...newErrors };

        if (hasValidationErrors) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos del idioma estén diligenciados correctamente.',
                type: 'danger',
            });
            return;
        }

        if (hasOtherErrors) {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: 'Ocurrió un error inesperado.',
                type: 'danger',
            });
            return;
        }

        if (!firstProfile.value) {
            toggleEditLanguage();
            alertStore.addAlert({
                title: 'Lenguajes',
                message: 'Actualización completada con éxito.',
                type: 'success',
            });
        }

        modelLanguageProficiencie.value = new ModelLanguageProficiencie();
    } finally {
        isSubmitting.value = false;
    }
}

const submitLanguageProficiencieStore = async (index) => {
    const response = await LanguageProficiencieService.store(modelLanguageProficiencie.value);
    languageProficiencies.value[index].id = response.data.languageProficiencie.id;
    return response;
}

const submitLanguageProficiencieUpdate = async () => {
    const response = await LanguageProficiencieService.update(
        modelLanguageProficiencie.value.id,
        modelLanguageProficiencie.value
    );
    return response;
};

const submitPersonAndProfileBasic = async () => {
    await submitPersonFind();
    // crea un find básico que NO cargue listas ni llame editProfile()
    const response = await ProfileService.find(null, modelProfile.value.person_id);

    modelProfile.value.id = response.data.profile.id;
    modelProfile.value.person_id = response.data.profile.person_id;
    modelProfile.value.title = response.data.profile.title;
    modelProfile.value.description = response.data.profile.description;
    modelProfile.value.file.file = response.data.profile.relationships?.file;
    modelProfile.value.relationships = response.data.profile.relationships;
};

const submitProfessionalSkillStoreOrUpdate = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    let hasValidationErrors = false;
    let hasOtherErrors = false;
    const newErrors = {};
    try {
        for (let index = 0; index < professionalSkills.value.length; index++) {
            const professionalSkill = professionalSkills.value[index];

            modelProfessionalSkill.value.id = professionalSkill?.id;
            modelProfessionalSkill.value.profile_id = modelProfile.value.id;
            modelProfessionalSkill.value.skill_id = professionalSkill.skill_id;
            modelProfessionalSkill.value.percentage = Number(professionalSkill.percentage);

            try {
                if (!modelProfessionalSkill.value.id) {
                    await submitProfessionalSkillStore(index);
                } else {
                    await submitProfessionalSkillUpdate();
                }
            } catch (err) {
                const errors = getBackendErrors(err);

                if (errors) {
                    hasValidationErrors = true;
                    Object.assign(newErrors, prefixErrorsByIndex(errors, 'professionalSkills', index));
                } else {
                    hasOtherErrors = true;
                }
            }
        }

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('professionalSkills_'))
        );

        formErrors.value = { ...keepOthers, ...newErrors };

        if (hasValidationErrors) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos de habilidades estén diligenciados correctamente.',
                type: 'danger',
            });
            return;
        }

        if (hasOtherErrors) {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: 'Ocurrió un error inesperado.',
                type: 'danger',
            });
            return;
        }

        if (!firstProfile.value) {
            toggleEditSkill();
            alertStore.addAlert({
                title: 'Habilidades',
                message: 'Actualización completada con éxito.',
                type: 'success',
            });
        }

        modelProfessionalSkill.value = new ModelProfessionalSkill();
    } finally {
        isSubmitting.value = false;
    }
}

const submitProfessionalSkillStore = async (index) => {
    const response = await ProfessionalSkillService.store(modelProfessionalSkill.value);
    const errors = getBackendErrors(response);
    if (errors) throw response;

    professionalSkills.value[index].id = response.data.professionalSkill.id;
    return response;
};


const submitProfessionalSkillUpdate = async () => {
    const response = await ProfessionalSkillService.update(
        modelProfessionalSkill.value.id,
        modelProfessionalSkill.value
    );
    const errors = getBackendErrors(response);
    if (errors) throw response;
    return response;
};

const submitProfessionalExperienceStoreOrUpdate = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    let hasValidationErrors = false;
    let hasOtherErrors = false;

    const newErrors = {};

    try {
        for (let index = 0; index < professionalExperiences.value.length; index++) {
            const professionalExperience = professionalExperiences.value[index];

            modelProfessionalExperience.value.id = professionalExperience?.id;
            modelProfessionalExperience.value.profile_id = modelProfile.value.id;
            modelProfessionalExperience.value.company_name = professionalExperience.company_name;
            modelProfessionalExperience.value.supervisor_name = professionalExperience.supervisor_name;
            modelProfessionalExperience.value.supervisor_dialing_country_id = professionalExperience.supervisor_dialing_country_id;
            modelProfessionalExperience.value.supervisor_phone_number = professionalExperience.supervisor_phone_number;
            modelProfessionalExperience.value.city_id = professionalExperience.city_id;
            modelProfessionalExperience.value.company_address = professionalExperience.company_address;
            modelProfessionalExperience.value.start_date = professionalExperience.start_date;
            modelProfessionalExperience.value.end_date = professionalExperience.end_date;
            modelProfessionalExperience.value.position = professionalExperience.position;
            modelProfessionalExperience.value.work_arrangement_id = professionalExperience.work_arrangement_id;
            modelProfessionalExperience.value.position_description = professionalExperience.position_description;
            modelProfessionalExperience.value.file = professionalExperience.file;

            try {
                if (!modelProfessionalExperience.value.id) {
                    await submitProfessionalExperienceStore(index);
                } else {
                    await submitProfessionalExperienceUpdate();
                }
            } catch (error) {
                if (error?.errors) {
                    hasValidationErrors = true;

                    Object.assign(
                        newErrors,
                        prefixErrorsByIndex(error.errors, 'professionalExperiences', index)
                    );
                } else {
                    hasOtherErrors = true;
                }
            }
        }

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('professionalExperiences_'))
        );
        formErrors.value = { ...keepOthers, ...newErrors };

        if (hasValidationErrors) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos de experiencia laboral estén diligenciados correctamente.',
                type: 'danger',
            });
            return;
        }

        if (hasOtherErrors) {
            alertStore.addAlert({
                title: 'Acceso Denegado',
                message: 'Ocurrió un error inesperado.',
                type: 'danger',
            });
            return;
        }

        if (!firstProfile.value) {
            toggleEditExperience();
            alertStore.addAlert({
                title: 'Experiencia laboral',
                message: 'Actualización completada con éxito.',
                type: 'success',
            });
        }

        modelProfessionalExperience.value = new ModelProfessionalExperience();
    } finally {
        isSubmitting.value = false;
    }
}

const submitProfessionalExperienceStore = async (index) => {
    const response = await ProfessionalExperienceService.store(modelProfessionalExperience.value);
    professionalExperiences.value[index].id = response.data.professionalExperience.id;
    return response;
};

const submitProfessionalExperienceUpdate = async () => {
    return ProfessionalExperienceService.update(
        modelProfessionalExperience.value.id,
        modelProfessionalExperience.value
    );
};

const submitProfileUpdate = async () => {
    try {
        // guarda profile
        await ProfileService.update(modelProfile.value.id, modelProfile.value);

        // guarda person
        const okPerson = await submitPersonUpdate();

        //  si person falló (validación) -> mantener editAboutMe abierto
        if (!okPerson) {
            editAboutMe.value = true;
            return;
        }

        // refresca profile PERO sin cerrar UI
        await submitProfileFind({ resetUI: false });

        editAboutMe.value = false;
        editAttachment.value = false;

    } catch (error) {
        if (error.errors) {
            formErrors.value = prefixErrors(error.errors, 'profile');
            //  mantener edición
            editAboutMe.value = true;

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
            console.log(formErrors.value);
        } else {
            editAboutMe.value = true;
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};


const submitPersonUpdate = async () => {
    try {
        console.log(modelPerson.value);
        const response = await PersonService.update(modelPerson.value.id, modelPerson.value);

        const newPath = response?.data?.person?.relationships?.photo?.path;

        if (newPath) {
            modelPerson.value.relationships ??= {};
            modelPerson.value.relationships.photo ??= {};
            modelPerson.value.relationships.photo.path = newPath;

            authStore.setAuth({ photo: newPath });
        }

        const person = response?.data?.person;

        if (person?.relationships) {
            modelPerson.value.relationships ??= {};

            if (person.relationships.file) {
                modelPerson.value.relationships.file = person.relationships.file;
            }

            if (person.relationships.photo) {
                modelPerson.value.relationships.photo = person.relationships.photo;
                authStore.setAuth({ photo: person.relationships.photo.path });
            }
        }


        if (!firstProfile.value) {
            alertStore.addAlert({ title: 'Modificación exitosa', message: response.message, type: 'success' });
        }

        return true;
    } catch (error) {
        const errors = getBackendErrors(error) || error?.errors;

        if (errors) {
            // ❌ NO apagues el edit
            // editAboutMe.value = false;

            // (opcional pero recomendado) mantener otros errores y reemplazar solo person_
            const keepOthers = Object.fromEntries(
                Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('person_'))
            );
            formErrors.value = { ...keepOthers, ...prefixErrors(errors, 'person') };

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
            return false;
        }

        alertStore.addAlert({
            title: 'Acceso Denegado',
            message: error?.error?.error || 'Ocurrió un error inesperado.',
            type: 'danger'
        });

        return false;
    }
};

const submitAcademicQualificationDelete = async (academicQualificationId) => {
    try {
        const response = await AcademicQualificationService.delete(academicQualificationId);
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
    }
}

const submitLanguageProficiencieDelete = async (languageProficiencieId) => {
    try {
        const response = await LanguageProficiencieService.delete(languageProficiencieId);
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
    }
}

const submitProfessionalSkillDelete = async (professionalSkillId) => {
    try {
        const response = await ProfessionalSkillService.delete(professionalSkillId);
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
    }
}

const submitProfessionalExperienceDelete = async (professionalExperienceId) => {
    try {
        const response = await ProfessionalExperienceService.delete(professionalExperienceId);
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
    }
}

const addAcademicQualification = () => {
    const list = academicQualifications.value || [];

    if (list.length > 0) {
        const lastIndex = list.length - 1;
        const lastItem = list[lastIndex];

        const lastErrors = validateAcademicQualificationItem(lastItem, lastIndex);

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(
                ([k]) => !k.startsWith(`academicQualifications_${lastIndex}_`)
            )
        );

        formErrors.value = {
            ...keepOthers,
            ...lastErrors
        };

        if (Object.keys(lastErrors).length > 0) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Completa correctamente la formación actual antes de agregar otra.',
                type: 'danger'
            });
            return;
        }
    }

    academicQualifications.value.push(new ModelAcademicQualification());
};

const removeAcademicQualification = async (index) => {
    if (academicQualifications.value.length == 1) {
        alertStore.addAlert({ title: 'Acción Invalida', message: 'Debes mantener al menos un registro de formación académica.', type: 'warning' });
        return;
    }

    modelAcademicQualification.value = academicQualifications.value[index];
    if (modelAcademicQualification.value?.id) await submitAcademicQualificationDelete(modelAcademicQualification.value.id);
    academicQualifications.value.splice(index, 1);
};

const addLanguageProficiencie = () => {
    const list = languageProficiencies.value || [];

    if (list.length > 0) {
        const lastIndex = list.length - 1;
        const lastItem = list[lastIndex];

        const lastErrors = validateLanguageProficiencieItem(lastItem, lastIndex);

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(
                ([k]) => !k.startsWith(`languageProficiencies_${lastIndex}_`)
            )
        );

        formErrors.value = {
            ...keepOthers,
            ...lastErrors
        };

        if (Object.keys(lastErrors).length > 0) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Completa correctamente el idioma actual antes de agregar otro.',
                type: 'danger'
            });
            return;
        }
    }

    languageProficiencies.value.push(new ModelLanguageProficiencie());
};

const removeLanguageProficiencie = async (index) => {
    if (Array.isArray(index)) {
        const indices = [...index].sort((a, b) => b - a);
        for (const i of indices) {
            removeLanguageProficiencie(i);
        }
        return;
    }

    modelLanguageProficiencie.value = languageProficiencies.value[index];
    if (modelLanguageProficiencie.value?.id) await submitLanguageProficiencieDelete(modelLanguageProficiencie.value.id);
    languageProficiencies.value.splice(index, 1);
};

const addProfessionalSkill = () => {
    if (modelProfessionalSkill.value.skill_id) {
        const skill = skills.value.find(s => s.id === modelProfessionalSkill.value.skill_id);
        if (skill) {
            professionalSkills.value.push(new ModelProfessionalSkill({
                id: null,
                profile_id: null,
                skill_type_id: skill.skill_type.id,
                skill: skill,
                skill_id: skill.id,
                percentage: 0
            }))
        };
        modelProfessionalSkill.value.skill_id = null;
    }
}

const removeProfessionalSkill = async (skillId) => {
    const index = professionalSkills.value.findIndex(s => s.skill_id === skillId);
    if (index !== -1) {
        modelProfessionalSkill.value = professionalSkills.value[index];
        if (modelProfessionalSkill.value?.id) await submitProfessionalSkillDelete(modelProfessionalSkill.value.id);
        professionalSkills.value.splice(index, 1);
    }
    modelProfessionalSkill.value = new ModelProfessionalSkill();
};

const addProfessionalExperience = () => {
    const list = professionalExperiences.value || [];

    if (list.length > 0) {
        const lastIndex = list.length - 1;
        const lastExperience = list[lastIndex];

        const lastErrors = validateProfessionalExperienceItem(lastExperience, lastIndex);

        const keepOthers = Object.fromEntries(
            Object.entries(formErrors.value || {}).filter(
                ([k]) => !k.startsWith(`professionalExperiences_${lastIndex}_`)
            )
        );

        formErrors.value = {
            ...keepOthers,
            ...lastErrors
        };

        if (Object.keys(lastErrors).length > 0) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Completa correctamente la experiencia actual antes de agregar otra.',
                type: 'danger'
            });
            return;
        }
    }

    professionalExperiences.value.push(new ModelProfessionalExperience());
};

const removeProfessionalExperience = async (index) => {
    if (Array.isArray(index)) {
        const indices = [...index].sort((a, b) => b - a);
        for (const i of indices) {
            removeProfessionalExperience(i);
        }
        return;
    }

    modelProfessionalExperience.value = professionalExperiences.value[index];
    if (modelProfessionalExperience.value?.id) await submitProfessionalExperienceDelete(modelProfessionalExperience.value.id);
    professionalExperiences.value.splice(index, 1);
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

const createProfile = (boolean = true) => {
    showCreateProfile.value = boolean;
    showEditProfile.value = false;
    currentStep.value = 1
}

const editProfile = () => {
    showCreateProfile.value = false;
    showEditProfile.value = true;
    editAboutMe.value = false;
    editEducation.value = false;
    editLanguage.value = false;
    editSkill.value = false;
    editExperience.value = false;
    editAttachment.value = false;
    currentStep.value = 0
}

const toggleEditAboutMe = () => {
    if (editAboutMe.value) {
        submitPersonFind();
        submitProfileFind();
    }
    editAboutMe.value = !editAboutMe.value;
    clearErrorsByPrefixes('person', 'profile');

}

const toggleEditEducation = async () => {
    if (editEducation.value) {
        await submitAcademicQualificationAll();
    }
    editEducation.value = !editEducation.value;
    clearErrorsByPrefixes('academicQualifications');
};


const toggleEditLanguage = async () => {
    if (editLanguage.value) {
        await submitLanguageProficiencieAll();
    }
    editLanguage.value = !editLanguage.value;
    clearErrorsByPrefixes('languageProficiencies');
}

const toggleEditSkill = async () => {
    if (editSkill.value) await submitProfessionalSkillAll();
    editSkill.value = !editSkill.value;
    formErrors.value = {};
}

const toggleEditExperience = async () => {
    if (editExperience.value) await submitProfessionalExperienceAll();
    editExperience.value = !editExperience.value;
}

const toggleEditAttachment = async () => {
    formErrors.value = {};
    if (isToggling.value) return;
    isToggling.value = true;

    try {
        if (editAttachment.value) {
            await submitPersonAndProfileBasic();
        }
        editAttachment.value = !editAttachment.value;
    } finally {
        isToggling.value = false;
    }
};

const nextStep = () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    let ok = true;

    if (currentStep.value === 1) {
        ok = validateStep1Front(); // <- llena formErrors
        if (!ok) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger',
            });
            return;
        }
        if (academicQualifications.value.length === 0) {
            addAcademicQualification();
        }
    } else if (currentStep.value === 2) {
        ok = validateStep2Front();
        if (!ok) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos de formación e idiomas estén diligenciados correctamente.',
                type: 'danger',
            });
            return;
        }
    } else if (currentStep.value === 3) {
        ok = validateStep3Front();
        if (!ok) {
            alertStore.addAlert({ title: 'Error', message: 'Verifique las habilidades seleccionadas.', type: 'danger' });
            return;
        }
    } else if (currentStep.value === 4) {
        ok = validateStep4Front();
        if (!ok) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que la experiencia laboral esté diligenciada correctamente.',
                type: 'danger',
            });
            return;
        }
    } else if (currentStep.value === 5) {
        ok = validateStep5Front();
        if (!ok) {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique los archivos adjuntos.',
                type: 'danger',
            });
            return;
        }
    }

    if (currentStep.value < totalSteps.value) currentStep.value++;
};


const prevStep = () => {
    if (currentStep.value > 1) currentStep.value--
}

const prefixErrors = (errors = {}, prefix = '') => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {
        const field = path.replace(/\./g, '_');

        const key = prefix
            ? `${prefix}_${field}`
            : field;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

const prefixErrorsByIndex = (errors = {}, prefix = '', index = null) => {
    const prefixed = {};

    Object.entries(errors).forEach(([path, messages]) => {
        const field = path.replace(/\./g, '_');

        const key = index !== null
            ? `${prefix}_${index}_${field}`
            : `${prefix}_${field}`;

        prefixed[key] = [...messages];
    });

    return prefixed;
};

const getBackendErrors = (err) =>
    err?.errors ||
    err?.response?.data?.errors ||
    err?.error?.errors ||
    err?.response?.data?.error?.errors ||
    null;

const clearErrorsByPrefixes = (...prefixes) => {
    const current = formErrors.value || {};

    formErrors.value = Object.fromEntries(
        Object.entries(current).filter(([key]) =>
            !prefixes.some((p) => key.startsWith(`${p}_`))
        )
    );
};

const toFavorite = async () => {
    router.push('/favorite');
    vacantStore.clearSelected();
}

onMounted(async () => {
    loaderStore.show();
    await submitPersonFind();
    await submitProfileFind();
    await submitCountryAll();
    await submitMaritalStatusAll();
    await submitAcademicLevelAll();
    await submitFormationStatusAll();
    await submitLanguageAll();
    await submitLanguageLevelAll();
    await submitSexAll();
    await submitSkillAll();
    await submitWorkArrangementAll();
    loaderStore.hide();
})

watch(() => modelPerson.value.document_issue_country_id, async () => {
    modelPerson.value.document_issue_departament_id = null;
    modelPerson.value.document_issue_city_id = null;
    modelPerson.value.document_type_id = null;
    await submitDocumentTypeAll();
    await submitDepartamentAll({ key: 'person_document_issue', countryId: modelPerson.value.document_issue_country_id });
});

watch(() => modelPerson.value.document_issue_departament_id, async () => {
    modelPerson.value.document_issue_city_id = null;
    if (modelPerson.value.document_issue_departament_id) await submitCityAll({ key: 'person_document_issue', departamentId: modelPerson.value.document_issue_departament_id });
});

watch(() => modelPerson.value.birth_country_id, async () => {
    modelPerson.value.birth_departament_id = null;
    modelPerson.value.birth_city_id = null;
    await submitDepartamentAll({ key: 'person_birth', countryId: modelPerson.value.birth_country_id });
});

watch(() => modelPerson.value.birth_departament_id, async () => {
    modelPerson.value.birth_city_id = null;
    if (modelPerson.value.birth_departament_id) {
        await submitCityAll({ key: 'person_birth', departamentId: modelPerson.value.birth_departament_id });
    }
});

watch(() => modelPerson.value.country_id, async () => {
    modelPerson.value.departament_id = null;
    modelPerson.value.city_id = null;
    await submitDepartamentAll({ key: 'person_residence', countryId: modelPerson.value.country_id });
});

watch(() => modelPerson.value.departament_id, async () => {
    modelPerson.value.city_id = null;
    if (modelPerson.value.departament_id) {
        await submitCityAll({ key: 'person_residence', departamentId: modelPerson.value.departament_id });
    }
});

watch(() => academicQualifications.value.map(item => item.country_id), async (newCountries, oldCountries) => {
    newCountries.forEach(async (newVal, index) => {
        if (newVal !== oldCountries[index]) {
            academicQualifications.value[index].departament_id = null;
            academicQualifications.value[index].city_id = null;
            if (newVal) await submitDepartamentAll({ key: `academic_${index}`, countryId: newVal });
        }
    })
})

watch(() => academicQualifications.value.map(item => item.departament_id), async (newDepartaments, oldDepartaments) => {
    newDepartaments.forEach(async (newVal, index) => {
        if (newVal !== oldDepartaments[index]) {
            academicQualifications.value[index].city_id = null;
            if (newVal) await submitCityAll({ key: `academic_${index}`, departamentId: newVal });
        }
    })
})

const validateStep1Front = (ctx = {}) => {
    const person = {};
    const profile = {};

    const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';
    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

    // 🔒 Título: sin caracteres especiales (solo letras con tildes/ñ, números y espacios)
    const isValidTitle = (v) => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+$/.test(String(v).trim());

    // ---- helpers de fechas
    const toDate = (v) => {
        if (!v) return null;
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
    };
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayD = startOfDay(new Date());
    const yearsAgo = (n) => new Date(todayD.getFullYear() - n, todayD.getMonth(), todayD.getDate());

    const {
        // parametrización documento/telefono (opcionales)
        documentNumberMin = null,
        documentNumberMax = null,
        documentNumberRegex = null, // opcional: RegExp

        phoneMin = null,
        phoneMax = null,
        phoneRegex = null, // opcional: RegExp
    } = ctx;

    // ===== PROFILE =====
    const title = String(modelProfile.value.title || '').trim();
    if (isEmpty(title)) addErr(profile, 'title', 'Es requerido.');
    else {
        if (title.length < 3) addErr(profile, 'title', 'Mínimo 3 caracteres.');
        if (title.length > 75) addErr(profile, 'title', 'Máximo 75 caracteres.');
        if (!isValidTitle(title)) addErr(profile, 'title', 'No debe contener caracteres especiales.');
    }

    const desc = String(modelProfile.value.description || '').trim();
    if (isEmpty(desc)) addErr(profile, 'description', 'Es requerido.');
    else {
        if (desc.length < 4) addErr(profile, 'description', 'Mínimo 4 caracteres.');
        if (desc.length > 500) addErr(profile, 'description', 'Máximo 500 caracteres.');
    }

    // ===== PERSON - Datos personales =====
    const onlyLetters = (value) => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(value)

    const fn = String(modelPerson.value.first_name || '').trim()
    if (isEmpty(fn)) addErr(person, 'first_name', 'Es requerido.')
    else {
        if (fn.length < 1) addErr(person, 'first_name', 'Mínimo 1 caracter.')
        if (fn.length > 25) addErr(person, 'first_name', 'Máximo 25 caracteres.')
        if (!onlyLetters(fn)) addErr(person, 'first_name', 'Solo se permiten letras.')
    }

    const sn = String(modelPerson.value.second_name || '').trim()
    if (!isEmpty(sn)) {
        if (sn.length < 1) addErr(person, 'second_name', 'Mínimo 1 caracter.')
        if (sn.length > 25) addErr(person, 'second_name', 'Máximo 25 caracteres.')
        if (!onlyLetters(sn)) addErr(person, 'second_name', 'Solo se permiten letras.')
    }

    const fln = String(modelPerson.value.first_last_name || '').trim()
    if (isEmpty(fln)) addErr(person, 'first_last_name', 'Es requerido.')
    else {
        if (fln.length < 3) addErr(person, 'first_last_name', 'Mínimo 3 caracteres.')
        if (fln.length > 25) addErr(person, 'first_last_name', 'Máximo 25 caracteres.')
        if (!onlyLetters(fln)) addErr(person, 'first_last_name', 'Solo se permiten letras.')
    }

    const sln = String(modelPerson.value.second_last_name || '').trim()
    if (!isEmpty(sln)) {
        if (sln.length < 3) addErr(person, 'second_last_name', 'Mínimo 3 caracteres.')
        if (sln.length > 25) addErr(person, 'second_last_name', 'Máximo 25 caracteres.')
        if (!onlyLetters(sln)) addErr(person, 'second_last_name', 'Solo se permiten letras.')
    }

    //  Selects: SOLO requerido
    if (isEmpty(modelPerson.value.marital_status_id)) addErr(person, 'marital_status_id', 'Es requerido.');
    if (isEmpty(modelPerson.value.sex_id)) addErr(person, 'sex_id', 'Es requerido.');

    // ===== Datos del documento =====
    if (isEmpty(modelPerson.value.document_issue_country_id)) addErr(person, 'document_issue_country_id', 'Es requerido.');
    if (isEmpty(modelPerson.value.document_issue_departament_id)) addErr(person, 'document_issue_departament_id', 'Es requerido.');
    if (isEmpty(modelPerson.value.document_issue_city_id)) addErr(person, 'document_issue_city_id', 'Es requerido.');

    if (isEmpty(modelPerson.value.document_type_id)) addErr(person, 'document_type_id', 'Es requerido.');

    // Documento: según parametrización
    const docNum = String(modelPerson.value.document_number || '').trim();
    if (isEmpty(docNum)) addErr(person, 'document_number', 'Es requerido.');
    else {
        const min = documentNumberMin ?? null;
        const max = documentNumberMax ?? 30;

        if (min !== null && docNum.length < min) addErr(person, 'document_number', `Mínimo ${min} caracteres.`);
        if (max !== null && docNum.length > max) addErr(person, 'document_number', `Máximo ${max} caracteres.`);

        if (documentNumberRegex instanceof RegExp && !documentNumberRegex.test(docNum)) {
            addErr(person, 'document_number', 'Formato de documento inválido.');
        }
    }

    // Fecha expedición: <= hoy y >= hoy - 120 años
    if (isEmpty(modelPerson.value.document_issue_date)) addErr(person, 'document_issue_date', 'Es requerido.');
    else {
        const d = toDate(modelPerson.value.document_issue_date);
        if (!d) addErr(person, 'document_issue_date', 'Fecha inválida.');
        else {
            const dd = startOfDay(d);
            if (dd > todayD) addErr(person, 'document_issue_date', 'No puede ser mayor a hoy.');
            if (dd < yearsAgo(120)) addErr(person, 'document_issue_date', 'No puede ser menor a 120 años.');
        }
    }

    const birthDateRaw = modelPerson.value.birth_date;
    const issueDateRaw = modelPerson.value.document_issue_date;

    if (!isEmpty(birthDateRaw) && !isEmpty(issueDateRaw)) {
        const birthDate = toDate(birthDateRaw);
        const issueDate = toDate(issueDateRaw);

        if (birthDate && issueDate) {
            const bd = startOfDay(birthDate);
            const id = startOfDay(issueDate);

            if (id < bd) {
                addErr(person, 'document_issue_date',
                    'La fecha de expedición no puede ser menor a la fecha de nacimiento.'
                );
            }
        }
    }

    // ===== Lugar y fecha de nacimiento =====
    if (isEmpty(modelPerson.value.birth_country_id)) addErr(person, 'birth_country_id', 'Es requerido.');
    if (isEmpty(modelPerson.value.birth_city_id)) addErr(person, 'birth_city_id', 'Es requerido.');

    if (isEmpty(modelPerson.value.birth_date)) addErr(person, 'birth_date', 'Es requerido.');
    else {
        const bd = toDate(modelPerson.value.birth_date);
        if (!bd) addErr(person, 'birth_date', 'Fecha inválida.');
        else {
            const bdd = startOfDay(bd);
            const minBirth = yearsAgo(120);
            const maxBirth = yearsAgo(18);
            if (bdd < minBirth) addErr(person, 'birth_date', 'La edad máxima permitida es 120 años.');
            if (bdd > maxBirth) addErr(person, 'birth_date', 'Debe ser mayor de edad (mínimo 18 años).');
        }
    }

    // ===== Datos de contacto =====
    if (isEmpty(modelPerson.value.dialing_country_id)) addErr(person, 'dialing_country_id', 'Es requerido.');

    const phone = String(modelPerson.value.phone_number || '').trim();
    if (isEmpty(phone)) addErr(person, 'phone_number', 'Es requerido.');
    else {
        const min = phoneMin ?? null;
        const max = phoneMax ?? 30;

        if (min !== null && phone.length < min) addErr(person, 'phone_number', `Mínimo ${min} caracteres.`);
        if (max !== null && phone.length > max) addErr(person, 'phone_number', `Máximo ${max} caracteres.`);
        if (phoneRegex instanceof RegExp && !phoneRegex.test(phone)) addErr(person, 'phone_number', 'Número inválido.');
    }

    // Email: 7–75
    const email = String(modelPerson.value.email || '').trim();
    if (isEmpty(email)) addErr(person, 'email', 'Es requerido.');
    else {
        if (email.length < 7) addErr(person, 'email', 'Mínimo 7 caracteres.');
        if (email.length > 75) addErr(person, 'email', 'Máximo 75 caracteres.');
        if (!isEmail(email)) addErr(person, 'email', 'Formato inválido.');
    }

    // ===== Residencia actual =====
    if (isEmpty(modelPerson.value.country_id)) addErr(person, 'country_id', 'Es requerido.');
    if (isEmpty(modelPerson.value.departament_id)) addErr(person, 'departament_id', 'Es requerido.');
    if (isEmpty(modelPerson.value.city_id)) addErr(person, 'city_id', 'Es requerido.');

    const addr = String(modelPerson.value.address || '').trim();
    if (isEmpty(addr)) addErr(person, 'address', 'Es requerido.');
    else {
        if (addr.length < 5) addErr(person, 'address', 'Mínimo 5 caracteres.');
        if (addr.length > 75) addErr(person, 'address', 'Máximo 75 caracteres.');
    }

    const neigh = String(modelPerson.value.neighborhood || '').trim();
    if (isEmpty(neigh)) addErr(person, 'neighborhood', 'Es requerido.');
    else {
        if (neigh.length < 3) addErr(person, 'neighborhood', 'Mínimo 3 caracteres.');
        if (neigh.length > 50) addErr(person, 'neighborhood', 'Máximo 50 caracteres.');
    }

    // ===== setear formErrors con prefijos (manteniendo otros)
    const keepOthers = Object.fromEntries(
        Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('person_') && !k.startsWith('profile_'))
    );

    const personPref = prefixErrors(person, 'person');
    const profilePref = prefixErrors(profile, 'profile');
    formErrors.value = { ...keepOthers, ...personPref, ...profilePref };

    return Object.keys(person).length === 0 && Object.keys(profile).length === 0;
};

const validateStep2Front = () => {
    const newErrors = {}; // armamos TODO el step2 desde cero

    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';
    const isValidDate = (v) => !isEmpty(v) && !Number.isNaN(Date.parse(v));

    //  PDF, JPG, PNG, JPEG
    const allowedMime = new Set([
        'application/pdf',
        'image/jpeg', // jpg / jpeg
        'image/png',
    ]);

    const maxBytes = 2 * 1024 * 1024; // 2MB

    // helper: obtener archivo cuando FileUpload devuelve array u objeto
    const getFileObj = (raw) => (Array.isArray(raw) ? raw[0] : raw);

    const hasRealFile = (fileObj) =>
        (fileObj instanceof File) ||
        (fileObj &&
            typeof fileObj === 'object' &&
            (String(fileObj.path || '').trim() || String(fileObj.name || '').trim()));

    // ========= ACADEMIC QUALIFICATIONS
    academicQualifications.value.forEach((aq, i) => {
        Object.assign(newErrors, validateAcademicQualificationItem(aq, i));
    });

    // ========= LANGUAGE PROFICIENCIES
    languageProficiencies.value.forEach((lp, i) => {
        Object.assign(newErrors, validateLanguageProficiencieItem(lp, i));
    });

    // mantener errores de otros steps
    const keepOthers = Object.fromEntries(
        Object.entries(formErrors.value || {}).filter(([k]) =>
            !k.startsWith('academicQualifications_') && !k.startsWith('languageProficiencies_')
        )
    );

    formErrors.value = { ...keepOthers, ...newErrors };

    return Object.keys(newErrors).length === 0;
};

const validateStep3Front = () => {
    const newErrors = {}; //  solo errores del step3

    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

    const totalSkills = (professionalSkills.value || []).length;
    if (totalSkills === 0) {
        // error general del step3
        addErr(newErrors, 'professionalSkills_min_one', 'Debes registrar al menos una habilidad (social o técnica).');
    }

    // helper: valida numeric
    const isNum = (v) => !isEmpty(v) && !Number.isNaN(Number(v));

    //  (opcional) valida duplicados (backend tiene unique por profile)
    const seen = new Set();
    professionalSkills.value.forEach((ps, i) => {
        const id = ps?.skill_id;
        if (!isEmpty(id)) {
            const key = String(id);
            if (seen.has(key)) {
                Object.assign(newErrors, prefixErrorsByIndex({ skill_id: ['Ya fue tomado.'] }, 'professionalSkills', i));
            } else {
                seen.add(key);
            }
        }
    });

    professionalSkills.value.forEach((ps, i) => {
        const local = {}; // errores de ESTE skill

        // required skill_id (backend)
        if (isEmpty(ps.skill_id)) addErr(local, 'skill_id', 'Es requerido.');

        // required percentage numeric (backend)
        if (isEmpty(ps.percentage)) addErr(local, 'percentage', 'Es requerido.');
        else if (!isNum(ps.percentage)) addErr(local, 'percentage', 'Debe ser un valor numérico.');
        else {
            const val = Number(ps.percentage);

            //  validación mínima según tipo (simulando regex backend)
            if (Number(ps.skill_type_id) === 21) {
                // estrellas 1..5 (en tu UI guardas 1..5)
                if (val < 1 || val > 5) addErr(local, 'percentage', 'Debe estar entre 1 y 5.');
            }

            if (Number(ps.skill_type_id) === 22) {
                // % 1..100 (si dejas 0, backend podría fallar por regex)
                if (val < 1 || val > 100) addErr(local, 'percentage', 'Debe estar entre 1 y 100.');
            }
        }

        if (Object.keys(local).length) {
            Object.assign(newErrors, prefixErrorsByIndex(local, 'professionalSkills', i));
        }
    });

    //  Reemplaza SOLO errores de professionalSkills_*
    const keepOthers = Object.fromEntries(
        Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('professionalSkills_'))
    );

    formErrors.value = { ...keepOthers, ...newErrors };

    return Object.keys(newErrors).length === 0;
};

const validateStep4Front = () => {
    const newErrors = {};

    professionalExperiences.value.forEach((pe, i) => {
        Object.assign(newErrors, validateProfessionalExperienceItem(pe, i));
    });

    const keepOthers = Object.fromEntries(
        Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('professionalExperiences_'))
    );

    formErrors.value = { ...keepOthers, ...newErrors };
    return Object.keys(newErrors).length === 0;
};


const validateStep5Front = () => {
    const person = {};
    const profile = {};

    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const maxBytes = 2 * 1024 * 1024; // 2048 KB (2MB)

    const personDoc = modelPerson.value?.file?.file;
    if (!(personDoc instanceof File)) {
        addErr(person, 'file', 'Debes adjuntar tu documento de identidad.');
    } else {
        if (personDoc.type !== 'application/pdf') addErr(person, 'file', 'Extensión inválida. Solo PDF.');
        if (personDoc.size > maxBytes) addErr(person, 'file', 'No debe exceder 2048 KB.');

        if (Number(modelPerson.value?.file?.file_type_id) !== 100) addErr(person, 'file', 'Tipo de archivo inválido.');
        if (Number(modelPerson.value?.file?.file_subtype_id) !== 102) addErr(person, 'file', 'Subtipo de archivo inválido.');
    }

    const personPhoto = modelPerson.value?.photo?.file;
    if (!(personPhoto instanceof File)) {
        addErr(person, 'photo', 'Debes adjuntar tu fotografía.');
    } else {
        const allowedImg = new Set(['image/jpeg', 'image/png']);
        if (!allowedImg.has(personPhoto.type)) addErr(person, 'photo', 'Extensión inválida. Solo JPG/JPEG/PNG.');
        if (personPhoto.size > maxBytes) addErr(person, 'photo', 'No debe exceder 2048 KB.');

        if (Number(modelPerson.value?.photo?.file_type_id) !== 100) addErr(person, 'photo', 'Tipo de archivo inválido.');
        if (Number(modelPerson.value?.photo?.file_subtype_id) !== 125) addErr(person, 'photo', 'Subtipo de archivo inválido.');
    }

    const cv = modelProfile.value?.file?.file;
    if (!(cv instanceof File)) {
        addErr(profile, 'file', 'Debes adjuntar tu hoja de vida.');
    } else {
        if (cv.type !== 'application/pdf') addErr(profile, 'file', 'Extensión inválida. Solo PDF.');
        if (cv.size > maxBytes) addErr(profile, 'file', 'No debe exceder 2048 KB.');

        if (Number(modelProfile.value?.file?.file_type_id) !== 100) addErr(profile, 'file', 'Tipo de archivo inválido.');
        if (Number(modelProfile.value?.file?.file_subtype_id) !== 124) addErr(profile, 'file', 'Subtipo de archivo inválido.');
    }

    const keepOthers = Object.fromEntries(
        Object.entries(formErrors.value || {}).filter(([k]) => !k.startsWith('person_') && !k.startsWith('profile_'))
    );

    formErrors.value = {
        ...keepOthers,
        ...prefixErrors(person, 'person'),
        ...prefixErrors(profile, 'profile'),
    };

    return Object.keys(person).length === 0 && Object.keys(profile).length === 0;
};

const validateProfessionalExperienceItem = (pe, i) => {
    const local = {};

    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';
    const isValidDate = (v) => !isEmpty(v) && !Number.isNaN(Date.parse(v));

    const allowedMime = new Set([
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);

    const maxBytes = 2 * 1024 * 1024;

    const toDateOnly = (d) => {
        const x = new Date(d);
        x.setHours(0, 0, 0, 0);
        return x;
    };
    const today = toDateOnly(new Date());

    const company = String(pe.company_name || '').trim();
    if (isEmpty(company)) addErr(local, 'company_name', 'Es requerido.');
    else {
        if (company.length < 5) addErr(local, 'company_name', 'Mínimo 5 caracteres.');
        if (company.length > 80) addErr(local, 'company_name', 'Máximo 80 caracteres.');
    }

    const boss = String(pe.supervisor_name || '').trim();
    if (isEmpty(boss)) addErr(local, 'supervisor_name', 'Es requerido.');
    else {
        if (boss.length < 5) addErr(local, 'supervisor_name', 'Mínimo 5 caracteres.');
        if (boss.length > 80) addErr(local, 'supervisor_name', 'Máximo 80 caracteres.');
    }

    if (isEmpty(pe.supervisor_dialing_country_id)) {
        addErr(local, 'supervisor_dialing_country_id', 'Es requerido.');
    }

    const phone = String(pe.supervisor_phone_number || '').trim();
    if (isEmpty(phone)) {
        addErr(local, 'supervisor_phone_number', 'Es requerido.');
    }

    if (isEmpty(pe.city_id)) addErr(local, 'city_id', 'Es requerido.');

    const addr = String(pe.company_address || '').trim();
    if (isEmpty(addr)) addErr(local, 'company_address', 'Es requerido.');
    else {
        if (addr.length < 5) addErr(local, 'company_address', 'Mínimo 5 caracteres.');
        if (addr.length > 75) addErr(local, 'company_address', 'Máximo 75 caracteres.');
    }

    if (isEmpty(pe.start_date)) {
        addErr(local, 'start_date', 'Es requerido.');
    } else if (!isValidDate(pe.start_date)) {
        addErr(local, 'start_date', 'Debe ser una fecha válida.');
    } else {
        const s = toDateOnly(pe.start_date);
        if (s > today) addErr(local, 'start_date', 'No puede ser mayor al día actual.');
    }

    const currentlyWorkingHere = !!pe.currently_working;

    if (!currentlyWorkingHere) {
        if (!isValidDate(pe.end_date)) {
            addErr(local, 'end_date', 'Es requerido y debe ser una fecha válida.');
        } else if (isValidDate(pe.start_date)) {
            const s = toDateOnly(pe.start_date);
            const e = toDateOnly(pe.end_date);
            if (e < s) addErr(local, 'end_date', 'No puede ser menor a la fecha de inicio.');
            if (e > today) addErr(local, 'end_date', 'No puede ser mayor al día actual.');
        }
    } else {
        if (!isEmpty(pe.end_date)) addErr(local, 'end_date', 'Debe estar vacío si actualmente trabaja aquí.');
    }

    const pos = String(pe.position || '').trim();
    if (isEmpty(pos)) addErr(local, 'position', 'Es requerido.');
    else {
        if (pos.length < 3) addErr(local, 'position', 'Mínimo 3 caracteres.');
        if (pos.length > 50) addErr(local, 'position', 'Máximo 50 caracteres.');
    }

    if (isEmpty(pe.work_arrangement_id)) addErr(local, 'work_arrangement_id', 'Es requerido.');

    const pd = String(pe.position_description || '').trim();
    if (isEmpty(pd)) addErr(local, 'position_description', 'Es requerido.');
    else {
        if (pd.length < 5) addErr(local, 'position_description', 'Mínimo 5 caracteres.');
        if (pd.length > 100) addErr(local, 'position_description', 'Máximo 100 caracteres.');
    }

    const raw = pe?.file?.file;
    const fileObj = Array.isArray(raw) ? raw[0] : raw;

    const hasFile =
        (fileObj instanceof File) ||
        (fileObj &&
            typeof fileObj === 'object' &&
            (String(fileObj.path || '').trim() || String(fileObj.name || '').trim()));

    const mustHaveFile = !currentlyWorkingHere;

    if (mustHaveFile && !hasFile) {
        addErr(local, 'file', 'Es requerido.');
    } else if (fileObj instanceof File) {
        if (!allowedMime.has(fileObj.type)) addErr(local, 'file', 'Extensión inválida.');
        if (fileObj.size > maxBytes) addErr(local, 'file', 'No debe exceder 2048 KB.');
    }

    return prefixErrorsByIndex(local, 'professionalExperiences', i);
};

const validateAcademicQualificationItem = (aq, i) => {
    const local = {};

    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';
    const isValidDate = (v) => !isEmpty(v) && !Number.isNaN(Date.parse(v));

    const allowedMime = new Set([
        'application/pdf',
        'image/jpeg',
        'image/png',
    ]);

    const maxBytes = 2 * 1024 * 1024;

    const getFileObj = (raw) => (Array.isArray(raw) ? raw[0] : raw);

    const hasRealFile = (fileObj) =>
        (fileObj instanceof File) ||
        (fileObj &&
            typeof fileObj === 'object' &&
            (String(fileObj.path || '').trim() || String(fileObj.name || '').trim()));

    if (isEmpty(aq.country_id)) addErr(local, 'country_id', 'Es requerido.');
    if (isEmpty(aq.departament_id)) addErr(local, 'departament_id', 'Es requerido.');
    if (isEmpty(aq.city_id)) addErr(local, 'city_id', 'Es requerido.');
    if (isEmpty(aq.academic_level_id)) addErr(local, 'academic_level_id', 'Es requerido.');
    if (isEmpty(aq.formation_status_id)) addErr(local, 'formation_status_id', 'Es requerido.');

    const inst = String(aq.academic_institution || '').trim();
    if (isEmpty(inst)) addErr(local, 'academic_institution', 'Es requerido.');
    else {
        if (inst.length < 2) addErr(local, 'academic_institution', 'Mínimo 2 caracteres.');
        if (inst.length > 150) addErr(local, 'academic_institution', 'Máximo 150 caracteres.');
    }

    const title = String(aq.academic_title || '').trim();
    if (isEmpty(title)) addErr(local, 'academic_title', 'Es requerido.');
    else {
        if (title.length < 2) addErr(local, 'academic_title', 'Mínimo 2 caracteres.');
        if (title.length > 150) addErr(local, 'academic_title', 'Máximo 150 caracteres.');
    }

    if (isEmpty(aq.start_date)) addErr(local, 'start_date', 'Es requerido.');
    else if (!isValidDate(aq.start_date)) addErr(local, 'start_date', 'Debe ser una fecha válida.');

    if (Number(aq.formation_status_id) === 27) {
        if (isEmpty(aq.end_date)) addErr(local, 'end_date', 'Es requerido.');
        else if (!isValidDate(aq.end_date)) addErr(local, 'end_date', 'Debe ser una fecha válida.');
        else if (isValidDate(aq.start_date)) {
            const s = new Date(aq.start_date);
            const e = new Date(aq.end_date);
            if (e < s) addErr(local, 'end_date', 'Debe ser una fecha posterior o igual a la fecha de inicio.');
        }
    } else {
        if (!isEmpty(aq.end_date) && !isValidDate(aq.end_date)) {
            addErr(local, 'end_date', 'Debe ser una fecha válida.');
        }
    }

    const raw = aq?.file?.file;
    const fileObj = getFileObj(raw);
    const mustHaveFile = Number(aq.formation_status_id) === 27;

    if (mustHaveFile && !hasRealFile(fileObj)) {
        addErr(local, 'file', 'Es requerido.');
    } else if (fileObj instanceof File) {
        if (!allowedMime.has(fileObj.type)) {
            addErr(local, 'file', 'Extensión inválida. Solo PDF, JPG, PNG y JPEG.');
        }
        if (fileObj.size > maxBytes) {
            addErr(local, 'file', 'No debe exceder 2048 KB.');
        }
    }

    return prefixErrorsByIndex(local, 'academicQualifications', i);
};

const validateLanguageProficiencieItem = (lp, i) => {
    const local = {};

    const addErr = (bag, key, msg) => {
        if (!bag[key]) bag[key] = [];
        bag[key].push(msg);
    };

    const isEmpty = (v) => v === null || v === undefined || String(v).trim() === '';

    const allowedMime = new Set([
        'application/pdf',
        'image/jpeg',
        'image/png',
    ]);

    const maxBytes = 2 * 1024 * 1024;

    const getFileObj = (raw) => (Array.isArray(raw) ? raw[0] : raw);

    // campos requeridos
    if (isEmpty(lp.language_id)) addErr(local, 'language_id', 'Es requerido.');
    if (isEmpty(lp.language_level_id)) addErr(local, 'language_level_id', 'Es requerido.');

    // archivo opcional, pero si existe se valida
    const raw = lp?.file?.file;
    const fileObj = getFileObj(raw);

    if (fileObj instanceof File) {
        if (!allowedMime.has(fileObj.type)) {
            addErr(local, 'file', 'Extensión inválida. Solo PDF, JPG, PNG y JPEG.');
        }
        if (fileObj.size > maxBytes) {
            addErr(local, 'file', 'No debe exceder 2048 KB.');
        }
    }

    return prefixErrorsByIndex(local, 'languageProficiencies', i);
};
</script>