<template>
    <!-- Controller template -->
    <ViewPersonnelRequisition :modelPersonnelRequisition="modelPersonnelRequisition" :modelPosition="modelPosition"
        :modelRequiredSkill="modelRequiredSkill" :modelBenefit="modelBenefit" :positions="positions"
        :pagination="pagination" :areas="areas" :academicLevels="academicLevels" :formationStatuses="formationStatuses"
        :showIndexPersonnelRequisition="showIndexPersonnelRequisition" :headquarters="headquarters"
        :showCreatePersonnelRequisition="showCreatePersonnelRequisition" :profileCategories="profileCategories"
        :showEditPersonnelRequisition="showEditPersonnelRequisition" @addAcademicRequirement="addAcademicRequirement"
        @submitPersonnelRequisitionFind="submitPersonnelRequisitionFind" :entities="entities"
        @removeAcademicRequirement="removeAcademicRequirement" :requiredSkills="requiredSkills" :skills="skills"
        :requiredBenefits="requiredBenefits" :benefits="benefits" :academicRequirements="academicRequirements"
        :typeContracts="typeContracts" :showDetailPersonnelRequisition="showDetailPersonnelRequisition"
        @index="indexPersonnelRequisition" @create="createPersonnelRequisition" @edit="editPersonnelRequisition"
        :currentLabel="currentLabel" :currentColor="currentColor" @addRequiredSkill="addRequiredSkill"
        @removeRequiredSkill="removeRequiredSkill" @addBenefit="addBenefit" @removeBenefit="removeBenefit"
        @addRequiredExperience="addRequiredExperience" @removeRequiredExperience="removeRequiredExperience"
        :responsabilities="responsabilities" @addResponsability="addResponsability"
        @submitPersonnelRequisitionPublished="submitPersonnelRequisitionPublished"
        @removeResponsability="removeResponsability" :requiredExperiences="requiredExperiences" :formatTime="formatTime"
        @detail="detailPersonnelRequisition" @submitPersonnelRequisitionStore="submitPersonnelRequisitionStore"
        @submitPersonnelRequisitionUpdate="submitPersonnelRequisitionUpdate" :workArrangements="workArrangements"
        :workDays="workDays" :vacants="vacants" @submitVacantFind="submitVacantFind" :loading="loading"
        @findPosition="submitPositionFind" :hiringReasons="hiringReasons" @close-detail="closeDetail"
        @exist="existPersonnelRequisition" :showExistPersonnelRequisition="showExistPersonnelRequisition"
        :showPublicPersonnelRequisition="showPublicPersonnelRequisition" @public="publicPersonnelRequisition"
        :statuses="statuses" :loadingIndex="loadingIndex" :loadingDetail="loadingDetail" :modelEmployee="modelEmployee"
        :employees="employeePersonOptions" :errors="formErrors" />

</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import router from '@/router'

import ViewPersonnelRequisition from '@/components/templates/Internal/Recruitment/PersonnelRequisition/PersonnelRequisition.vue';

import ModelPersonnelRequisition from '@/models/Vacant';
import ModelPosition from '@/models/Position';
import ModelAcademicRequirement from '@/models/AcademicRequirement';
import ModelRequiredExperience from '@/models/RequiredExperience';
import ModelRequiredSkill from '@/models/RequiredSkill';
import ModelResponsability from '@/models/Responsability';
import ModelBenefit from '@/models/Benefit';
import ModelEmployee from '@/models/Employee';

import PositionService from '@/services/PositionService';
import RequiredExperienceService from '@/services/RequiredExperienceService';
import RequiredSkillService from '@/services/RequiredSkillService';
import AcademicRequirementService from '@/services/AcademicRequirementService';
import ResponsabilityService from '@/services/ResponsabilityService';
import AcademicLevelService from '@/services/AcademicLevelService';
import FormationStatusService from '@/services/FormationStatusService';
import SkillService from '@/services/SkillService';
import ProfileCategoryService from '@/services/ProfileCategoryService';
import BenefitService from '@/services/BenefitService';
import PersonnelRequisitionService from '@/services/VacantService';
import ContractTypeService from '@/services/ContractTypeService';
import AreaService from '@/services/AreaService';
import WorkArrangementService from '@/services/WorkArrangementService';
import WorkDayService from '@/services/WorkDayService';
import HiringReasonService from '@/services/HiringReasonService';
import EntityService from '@/services/EntityService';
import HeadquarterService from '@/services/HeadquarterService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';
import EmployeeService from '@/services/EmployeeService';
import { useAuthStore } from '@/stores/authStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const academicRequirements = ref([]);
const requiredExperiences = ref([]);
const requiredSkills = ref([]);
const responsabilities = ref([]);
const requiredBenefits = ref([]);

const modelPersonnelRequisition = ref(new ModelPersonnelRequisition());
const modelPosition = ref(new ModelPosition());
const modelAcademicRequirement = ref(new ModelAcademicRequirement());
const modelRequiredExperience = ref(new ModelRequiredExperience());
const modelRequiredSkill = ref(new ModelRequiredSkill());
const modelResponsability = ref(new ModelResponsability());
const modelBenefit = ref(new ModelBenefit());
const modelEmployee = ref(new ModelEmployee());
const authStore = useAuthStore();

const entities = ref([]);
const headquarters = ref([]);
const positions = ref([]);
const academicLevels = ref([]);
const formationStatuses = ref([]);
const skills = ref([]);
const benefits = ref([]);
const workArrangements = ref([]);
const workDays = ref([]);
const typeContracts = ref([]);
const profileCategories = ref([]);
const areas = ref([]);
const vacants = ref([]);
const hiringReasons = ref([]);
const statuses = ref([]);
const loadingIndex = ref(false);
const loadingDetail = ref(false);
const loading = ref(true);
const employees = ref([]);
const employeePersonOptions = computed(() =>
    (employees.value || []).map(emp => ({
        id: emp.person?.id,
        name: [
            emp.person?.first_name,
            emp.person?.second_name,
            emp.person?.first_last_name,
            emp.person?.second_last_name
        ].filter(Boolean).join(' '),
        raw: emp
    }))
)

const showIndexPersonnelRequisition = ref(true);
const showCreatePersonnelRequisition = ref(false);
const showEditPersonnelRequisition = ref(false);
const showDetailPersonnelRequisition = ref(false);
const showExistPersonnelRequisition = ref(false);
const showPublicPersonnelRequisition = ref(false);
const activeVacant = ref(null)
const selectedVacantId = ref(null)
const formErrors = ref({
    personnel_requisition: {},      // errores del form principal (vacant)
    position: {},                   // si también editas/creas position desde acá
    academic_requirements: {},      // errores por fila
    required_skills: {},            // errores por fila
    required_experiences: {},       // errores por fila
    responsabilities: {},           // errores por fila
    benefits: {}                    // opcional si validas beneficios
});

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0,
    area: null,
    status: null
})

const submitEmployeeAll = async (positionId) => {
    employees.value = [];
    try {
        const response = await EmployeeService.all(1, '', null, null, { positionId: positionId });
        employees.value = response.data.employees;
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

const submitEmployeeFind = async () => {
    try {
        const response = await EmployeeService.find(null, authStore.employeeId);
        modelEmployee.value.id = response.data.employee.id;
        modelEmployee.value.person_id = response.data.employee.person_id;
        modelEmployee.value.headquarter_id = response.data.employee.headquarter_id;
        modelEmployee.value.position_id = response.data.employee.position_id;
        modelEmployee.value.start_date = response.data.employee.start_date;
        modelEmployee.value.end_date = response.data.employee.end_date;
        modelEmployee.value.relationships = response.data.employee.relationships;
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

const submitProfileCategoryAll = async () => {
    try {
        const response = await ProfileCategoryService.all();
        profileCategories.value = response.data.profileCategories;
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

const submitBenefitAll = async () => {
    try {
        const response = await BenefitService.all();
        benefits.value = response.data.benefits;
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

const submitArrangementAll = async () => {
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

const submitPersonnelRequisitionAll = async () => {
    try {
        loadingIndex.value = true;
        const response = await PersonnelRequisitionService.all(pagination.current_page, pagination.search, pagination.per_page, pagination.area, pagination.status);
        vacants.value = response.data.vacants;
        statuses.value = response.data.statuses

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
        loadingIndex.value = false;
    } catch (error) {
        loadingIndex.value = false;
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

const submitEntityAll = async () => {
    try {
        const response = await EntityService.all();
        entities.value = response.data.entities;

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

const submitHeadquarterAll = async (entityId) => {
    try {
        if (!entityId) { headquarters.value = []; return; }

        const response = await HeadquarterService.all(entityId);
        headquarters.value = response.data.headquarters;
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

const submitWorkDayAll = async () => {
    try {
        const response = await WorkDayService.all();
        workDays.value = response.data.workDays;

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

const submitAreaAll = async () => {
    try {
        const response = await AreaService.all();
        areas.value = response.data.areas;
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

const submitHiringReasonAll = async () => {
    try {
        const response = await HiringReasonService.all();
        hiringReasons.value = response.data.hiringReasons;
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

const submitPositionAll = async () => {
    try {
        const response = await PositionService.all(1, '', null, null, null, authStore.employeeId);
        positions.value = response.data.positions;
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

const submitContractTypeAll = async () => {
    try {
        const response = await ContractTypeService.all();
        typeContracts.value = response.data.contractTypes;
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

const submitVacantFind = async (vancantId) => {
    try {
        loadingDetail.value = true;
        const response = await PersonnelRequisitionService.find(vancantId);
        modelPersonnelRequisition.value.id = response.data.vacant.id;
        modelPersonnelRequisition.value.hiring_reason_id = response.data.vacant.hiring_reason_id;
        modelPersonnelRequisition.value.position_id = response.data.vacant.position_id;
        modelPersonnelRequisition.value.person_id = response.data.vacant.person_id;
        modelPersonnelRequisition.value.headquarter_id = response.data.vacant.headquarter_id;
        modelPersonnelRequisition.value.contract_type_id = response.data.vacant.contract_type_id;
        modelPersonnelRequisition.value.work_arrangement_id = response.data.vacant.work_arrangement_id;
        modelPersonnelRequisition.value.work_day_id = response.data.vacant.work_day_id;
        modelPersonnelRequisition.value.salary_min = response.data.vacant.salary_min;
        modelPersonnelRequisition.value.salary_max = response.data.vacant.salary_max;
        modelPersonnelRequisition.value.start_date = response.data.vacant.start_date ? response.data.vacant.start_date.split('/').reverse().join('-')
            : '';
        modelPersonnelRequisition.value.settings = response.data.vacant.settings.polygraph;
        modelPersonnelRequisition.value.settings = response.data.vacant.settings.video_interview;
        modelPersonnelRequisition.value.end_date = response.data.vacant.end_date
            ? response.data.vacant.end_date.split('/').reverse().join('-')
            : null;
        modelPersonnelRequisition.value.description = response.data.vacant.description;
        modelPersonnelRequisition.value.quantity = response.data.vacant.quantity;
        modelPersonnelRequisition.value.settings = response.data.vacant.settings;
        modelPersonnelRequisition.value.relationships = response.data.vacant.relationships;
        console.log(modelPersonnelRequisition.value)

        modelPosition.value.id = response?.data?.vacant?.relationships?.position?.id || null;
        if (modelPersonnelRequisition.value.position_id) {
            submitPositionFind(modelPersonnelRequisition.value.position_id);
        }

        await submitAcademicRequirementAll();
        await submitRequiredSkillAll();
        await submitRequiredExperienceAll();
        await submitResponsabilityAll();
        loadingDetail.value = false;
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

const submitPersonnelRequisitionFind = async (personnelRequisitionId) => {
    try {
        loadingDetail.value = true;
        const response = await PersonnelRequisitionService.find(personnelRequisitionId);
        modelPersonnelRequisition.value.id = response.data.vacant.id;
        modelPersonnelRequisition.value.hiring_reason_id = response.data.vacant.hiring_reason_id;
        modelPersonnelRequisition.value.position_id = response.data.vacant.position_id;
        modelPersonnelRequisition.value.headquarter_id = response.data.vacant.headquarter_id;
        modelPersonnelRequisition.value.contract_type_id = response.data.vacant.contract_type_id;
        modelPersonnelRequisition.value.work_arrangement_id = response.data.vacant.work_arrangement_id;
        modelPersonnelRequisition.value.work_day_id = response.data.vacant.work_day_id;
        modelPersonnelRequisition.value.salary_min = response.data.position.salary_min;
        modelPersonnelRequisition.value.salary_max = response.data.position.salary_max;
        modelPersonnelRequisition.value.start_date = response.data.position.start_date;
        modelPersonnelRequisition.value.end_date = response.data.position.end_date;
        modelPersonnelRequisition.value.description = response.data.position.description;
        modelPersonnelRequisition.value.quantity = response.data.position.quantity;
        modelPersonnelRequisition.value.settings = response.data.position.settings;
        modelPersonnelRequisition.value.relationships = response.data.position.relationships;

        await submitAcademicRequirementAll();
        await submitRequiredSkillAll();
        await submitRequiredExperienceAll();
        await submitResponsabilityAll();
        loadingDetail.value = false;
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

const submitPositionFind = async (positionId) => {
    if (!positionId) {
        clearData();
        return;
    };
    try {
        loadingDetail.value = true;
        const response = await PositionService.find(positionId);
        if (!modelPosition.value.settings) {
            modelPosition.value.settings = {
                polygraph: false,
                video_interview: false
            };
        }
        if (!modelPersonnelRequisition.value.settings) {
            modelPersonnelRequisition.value.settings = {
                polygraph: false,
                video_interview: false
            };
        }
        modelPosition.value.id = response.data.position.id;
        modelPosition.value.area_id = response.data.position.area_id;
        modelPosition.value.name = response.data.position.name;
        modelPosition.value.profile_category_id = response.data.position.profile_category_id;
        modelPosition.value.description = response.data.position.description;
        modelPosition.value.settings.polygraph = response.data.position.settings.polygraph ?? false;
        modelPosition.value.settings.video_interview = response.data.position.settings.video_interview ?? false;
        modelPersonnelRequisition.value.settings.polygraph = response.data.position.settings.polygraph ?? false;
        modelPersonnelRequisition.value.settings.video_interview = response.data.position.settings.video_interview ?? false;
        modelPosition.value.relationships = response.data.position.relationships;

        if (modelPersonnelRequisition.value.hiring_reason_id && modelPersonnelRequisition.value.hiring_reason_id != 352 && modelPosition.value.id) {
            submitEmployeeAll(modelPosition.value.id);
        }

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
        loadingDetail.value = false;
    }
}

const submitPersonnelRequisitionStore = async ($type) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar la requisición?',
        message: 'Se creará la requisición con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            if (!academicRequirements.value.length || !requiredSkills.value.length || !responsabilities.value.length) {
                alertStore.addAlert({
                    title: 'Información incompleta',
                    message: 'Debe agregar mínimo una formación, habilidad y responsabilidad.',
                    type: 'warning'
                });
                return false;
            }
            const ok = await (
                modelPersonnelRequisition.value.position_id == null
                    ? submitPositionStore($type)
                    : submitPositionUpdate($type)
            );

            if (!ok) return;

            const hasAnyRowErrors =
                Object.keys(formErrors.value.academic_requirements || {}).length ||
                Object.keys(formErrors.value.required_skills || {}).length ||
                Object.keys(formErrors.value.required_experiences || {}).length ||
                Object.keys(formErrors.value.responsabilities || {}).length;

            const ids = requiredBenefits.value.map(b => b.id);
            modelPersonnelRequisition.value.benefits_id = ids;
            modelPersonnelRequisition.value.entity_id = modelEmployee.value.relationships?.headquarter?.entity?.id
            modelPersonnelRequisition.value.headquarter_id = modelEmployee.value.headquarter_id
            modelPersonnelRequisition.value.settings.polygraph = modelPosition.value.settings.polygraph ?? false;
            modelPersonnelRequisition.value.settings.video_interview = modelPosition.value.settings.video_interview ?? false;

            const response = await PersonnelRequisitionService.store(
                modelPersonnelRequisition.value
            );


            if (hasAnyRowErrors) {
                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique habilidades, formaciones, experiencias y responsabilidades.',
                    type: 'danger'
                });
                formErrors.value.personnel_requisition = {};
            } else {
                alertStore.addAlert({
                    title: 'Modificación exitosa.',
                    message: response.message,
                    type: 'success'
                });

                indexPersonnelRequisition();
            }

        } catch (error) {
            console.log(error?.errors);
            if (error?.errors) {
                const nextErrors = prefixErrors(error.errors, 'personnel_requisition');
                console.log('POSITION ERRORS NUEVOS:', prefixErrors(error.errors, 'personnel_requisition'));
                formErrors.value.personnel_requisition = nextErrors;

                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
            } else {
                alertStore.addAlert({
                    title: 'Error',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        } finally {
            await submitPersonnelRequisitionAll();
        }
    } else {
        alertStore.addAlert({ title: 'Accion cancelada', message: 'Se canceló la creación de la requsición personal.', type: 'info' });
    }
}

const submitRequiredExperienceStoreOrUpdate = async (requiredEx) => {
    requiredExperiences.value.forEach(async (requiredExperience, index) => {
        modelRequiredExperience.value.id = requiredExperience?.id;
        modelRequiredExperience.value.position_id = modelPosition.value.id;
        modelRequiredExperience.value.name = requiredExperience.name;
        modelRequiredExperience.value.duration_months = requiredExperience.duration_months;
        modelRequiredExperience.value.description = requiredExperience.description;

        if (modelRequiredExperience.value.id == null) {
            await submitRequiredExperienceStore(index);
        } else {
            await submitRequiredExperienceUpdate();
        }
    })
    modelRequiredExperience.value = new ModelRequiredExperience();
}

const detailPosition = () => {
    showDetailPersonnelRequisition.value = !showDetailPersonnelRequisition.value
}

const submitRequiredExperienceStore = async (index) => {
    try {
        const response = await RequiredExperienceService.store(modelRequiredExperience.value);
        requiredExperiences.value[index].id = response.data.requiredExperience.id;

        if (formErrors.value.required_experiences?.[index]) {
            delete formErrors.value.required_experiences[index];
        }
    } catch (error) {
        if (!error.errors) {
            alertStore.addAlert({
                title: 'Error',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
            return;
        }

        const rowErrors = buildRequiredExperienceRowErrors(error.errors);
        if (!rowErrors) return;

        if (!formErrors.value.required_experiences) {
            formErrors.value.required_experiences = {};
        }

        formErrors.value.required_experiences[index] = rowErrors;
    }
};

const submitRequiredExperienceUpdate = async () => {
    const index = requiredExperiences.value.findIndex(
        e => e.id === modelRequiredExperience.value.id
    );

    try {
        await RequiredExperienceService.update(
            modelRequiredExperience.value.id,
            modelRequiredExperience.value
        );

        if (index !== -1 && formErrors.value.required_experiences?.[index]) {
            delete formErrors.value.required_experiences[index];
        }

    } catch (error) {
        if (!error.errors || index === -1) return;

        if (!formErrors.value.required_experiences) {
            formErrors.value.required_experiences = {};
        }

        formErrors.value.required_experiences[index] =
            buildRequiredExperienceRowErrors(error.errors);
    }
};

const submitRequiredSkillStoreOrUpdate = async () => {
    requiredSkills.value.forEach(async (requiredSkill, index) => {
        modelRequiredSkill.value.id = requiredSkill?.id;
        modelRequiredSkill.value.position_id = modelPosition.value.id;
        modelRequiredSkill.value.skill_id = requiredSkill.skill_id;
        modelRequiredSkill.value.percentage = Number(requiredSkill.percentage);

        if (modelRequiredSkill.value.id == null) {
            await submitRequiredSkillStore(index);
        } else {
            await submitRequiredSkillUpdate();
        }
    })
    modelRequiredSkill.value = new ModelRequiredSkill();
}

const submitRequiredSkillStore = async (index) => {
    try {
        const response = await RequiredSkillService.store(modelRequiredSkill.value);
        requiredSkills.value[index].id = response.data.requiredSkill.id;

        if (formErrors.value.required_skills?.[index]) {
            delete formErrors.value.required_skills[index];
        }
    } catch (error) {
        if (!error.errors) {
            alertStore.addAlert({
                title: 'Error',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
            return;
        }

        const rowErrors = buildRequiredSkillRowErrors(error.errors);
        if (!rowErrors) return;

        if (!formErrors.value.required_skills) {
            formErrors.value.required_skills = {};
        }

        formErrors.value.required_skills[index] = rowErrors;
    }
};

const submitRequiredSkillUpdate = async () => {
    const index = requiredSkills.value.findIndex(
        s => s.id === modelRequiredSkill.value.id
    );

    try {
        await RequiredSkillService.update(
            modelRequiredSkill.value.id,
            modelRequiredSkill.value
        );

        if (index !== -1 && formErrors.value.required_skills?.[index]) {
            delete formErrors.value.required_skills[index];
        }

    } catch (error) {
        if (!error.errors || index === -1) return;

        if (!formErrors.value.required_skills) {
            formErrors.value.required_skills = {};
        }

        formErrors.value.required_skills[index] =
            buildRequiredSkillRowErrors(error.errors);
    }
};

const submitAcademicRequirementStoreOrUpdate = async () => {
    academicRequirements.value.forEach(async (academicRequirement, index) => {
        modelAcademicRequirement.value.id = academicRequirement?.id;
        modelAcademicRequirement.value.position_id = modelPosition.value.id;
        modelAcademicRequirement.value.academic_level_id = academicRequirement.academic_level_id;
        modelAcademicRequirement.value.academic_title = academicRequirement.academic_title;
        modelAcademicRequirement.value.formation_status_id = academicRequirement.formation_status_id;

        if (modelAcademicRequirement.value.id == null) {
            await submitAcademicRequirementStore(index);
        } else {
            await submitAcademicRequirementUpdate();
        }
    })
    modelAcademicRequirement.value = new ModelAcademicRequirement();
}

const submitAcademicRequirementStore = async (index) => {
    try {
        const response = await AcademicRequirementService.store(modelAcademicRequirement.value);
        academicRequirements.value[index].id = response.data.academicRequirement.id;

        if (formErrors.value.academic_requirements?.[index]) {
            delete formErrors.value.academic_requirements[index];
        }
    } catch (error) {
        if (!error.errors) {
            alertStore.addAlert({
                title: 'Error',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
            return;
        }

        const rowErrors = buildAcademicRequirementRowErrors(error.errors);
        if (!rowErrors) return;

        if (!formErrors.value.academic_requirements) {
            formErrors.value.academic_requirements = {};
        }

        formErrors.value.academic_requirements[index] = rowErrors;
    }
};

const submitAcademicRequirementUpdate = async () => {
    const index = academicRequirements.value.findIndex(
        a => a.id === modelAcademicRequirement.value.id
    );

    try {
        await AcademicRequirementService.update(
            modelAcademicRequirement.value.id,
            modelAcademicRequirement.value
        );

        if (index !== -1 && formErrors.value.academic_requirements?.[index]) {
            delete formErrors.value.academic_requirements[index];
        }

    } catch (error) {
        if (!error.errors || index === -1) return;

        if (!formErrors.value.academic_requirements) {
            formErrors.value.academic_requirements = {};
        }

        formErrors.value.academic_requirements[index] =
            buildAcademicRequirementRowErrors(error.errors);
    }
};

const submitResponsabilityStoreOrUpdate = async () => {
    responsabilities.value.forEach(async (responsability, index) => {
        modelResponsability.value.id = responsability?.id;
        modelResponsability.value.position_id = modelPosition.value.id;
        modelResponsability.value.name = responsability.name;
        modelResponsability.value.description = responsability.description;

        if (modelResponsability.value.id == null) {
            await submitResponsabilityStore(index);
        } else {
            await submitResponsabilityUpdate();
        }
    })
    modelResponsability.value = new ModelResponsability();
}

const submitResponsabilityStore = async (index) => {
    try {
        const response = await ResponsabilityService.store(modelResponsability.value);
        responsabilities.value[index].id = response.data.responsability.id;

        if (formErrors.value.responsabilities?.[index]) {
            delete formErrors.value.responsabilities[index];
        }
    } catch (error) {
        if (!error.errors) {
            alertStore.addAlert({
                title: 'Error',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
            return;
        }

        const rowErrors = buildResponsabilityRowErrors(error.errors);
        if (!rowErrors) return;

        if (!formErrors.value.responsabilities) {
            formErrors.value.responsabilities = {};
        }

        formErrors.value.responsabilities[index] = rowErrors;
    }
};

const submitResponsabilityUpdate = async () => {
    const index = responsabilities.value.findIndex(
        r => r.id === modelResponsability.value.id
    );

    try {
        await ResponsabilityService.update(
            modelResponsability.value.id,
            modelResponsability.value
        );

        if (index !== -1 && formErrors.value.responsabilities?.[index]) {
            delete formErrors.value.responsabilities[index];
        }

    } catch (error) {
        if (!error.errors || index === -1) return;

        if (!formErrors.value.responsabilities) {
            formErrors.value.responsabilities = {};
        }

        formErrors.value.responsabilities[index] =
            buildResponsabilityRowErrors(error.errors);
    }
}

const submitPositionStore = async ($type) => {
    try {

        modelPosition.value.area_id = modelEmployee.value?.relationships?.position?.area?.id;

        const response = await PositionService.store(modelPosition.value);

        formErrors.value.position = {};

        modelPosition.value.id = response.data.position.id;
        modelPersonnelRequisition.value.position_id = response.data.position.id;

        await submitAcademicRequirementStoreOrUpdate();
        await submitRequiredSkillStoreOrUpdate();
        await submitRequiredExperienceStoreOrUpdate();
        await submitResponsabilityStoreOrUpdate();

        return true; // ✅ OK
    } catch (error) {
        if (error?.errors) {
            const nextErrors = prefixErrors(error.errors, 'position');
            formErrors.value.position = nextErrors;

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Error',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }
        return false;
    }
};

const submitPositionUpdate = async ($type) => {

    try {
        if (modelPersonnelRequisition.value?.relationships?.position) {
            const pos = modelPersonnelRequisition.value.relationships.position;
            modelPosition.value.id = modelPersonnelRequisition.value.position_id;
            modelPosition.value.name = pos.name;
            modelPosition.value.description = pos.description;
            modelPosition.value.area_id = pos.area_id;
            modelPosition.value.profile_category_id = pos.profile_category_id;
            modelPosition.value.settings.polygraph = pos.settings?.polygraph ?? false;
            modelPosition.value.settings.video_interview = pos.settings?.video_interview ?? false;
        } else {
            modelPosition.value.id = modelPersonnelRequisition.value.position_id;
        }
        const response = await PositionService.update(modelPosition.value.id, modelPosition.value);
        modelPersonnelRequisition.value.settings.polygraph = modelPosition.value.settings.polygraph
        modelPersonnelRequisition.value.settings.video_interview = modelPosition.value.settings.video_interview
        modelPersonnelRequisition.value.position_id = modelPosition.value.id
        // alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });

        formErrors.value.position = {};

        if ($type == 'create') {
            await submitAcademicRequirementStoreOrUpdate();
            await submitRequiredSkillStoreOrUpdate();
            await submitRequiredExperienceStoreOrUpdate();
            await submitResponsabilityStoreOrUpdate();
        }

        return true;

    } catch (error) {
        if (error.errors) {
            const nextErrors = prefixErrors(error.errors, 'position');
            formErrors.value.position = nextErrors;

            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            });
        } else {
            alertStore.addAlert({
                title: 'Error',
                message: error?.error?.error || 'Ocurrió un error inesperado.',
                type: 'danger'
            });
        }

        return false;
    }
}

const submitPersonnelRequisitionUpdate = async ($type) => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar la requisición?',
        message: 'Se actualizará la requisición con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            if (!academicRequirements.value.length || !requiredSkills.value.length || !responsabilities.value.length) {
                alertStore.addAlert({
                    title: 'Información incompleta',
                    message: 'Debe agregar mínimo una formación, habilidad y responsabilidad.',
                    type: 'warning'
                });
                return false;
            }
            const ok = await (
                modelPersonnelRequisition.value.position_id == null
                    ? submitPositionStore($type)
                    : submitPositionUpdate($type)
            );

            if (!ok) return;

            const hasAnyRowErrors =
                Object.keys(formErrors.value.academic_requirements || {}).length ||
                Object.keys(formErrors.value.required_skills || {}).length ||
                Object.keys(formErrors.value.required_experiences || {}).length ||
                Object.keys(formErrors.value.responsabilities || {}).length;

            const ids = requiredBenefits.value.map(b => b.id);
            modelPersonnelRequisition.value.benefits_id = ids;
            modelPersonnelRequisition.value.settings.polygraph = modelPosition.value.settings.polygraph ?? false;
            modelPersonnelRequisition.value.settings.video_interview = modelPosition.value.settings.video_interview ?? false;

            const response = await PersonnelRequisitionService.update(
                modelPersonnelRequisition.value.id,
                modelPersonnelRequisition.value
            );

            if (hasAnyRowErrors) {
                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
                formErrors.value.personnel_requisition = {};
            } else {
                alertStore.addAlert({
                    title: 'Modificación exitosa.',
                    message: response.message,
                    type: 'success'
                });
                indexPersonnelRequisition();
            }


        } catch (error) {
            console.log(error?.errors);
            if (error?.errors) {
                const nextErrors = prefixErrors(error.errors, 'personnel_requisition');
                console.log('POSITION ERRORS NUEVOS:', prefixErrors(error.errors, 'personnel_requisition'));
                formErrors.value.personnel_requisition = nextErrors;

                alertStore.addAlert({
                    title: 'Error',
                    message: 'Verifique que todos los campos estén diligenciados correctamente.',
                    type: 'danger'
                });
            } else {
                alertStore.addAlert({
                    title: 'Error',
                    message: error?.error?.error || 'Ocurrió un error inesperado.',
                    type: 'danger'
                });
            }
        } finally {
            await submitPersonnelRequisitionAll();
        }
    }
}

const submitPersonnelRequisitionPublished = async () => {
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea publicar la vacante?',
        message: 'Se publicará la vacante con la información ingresada.',
        confirmText: 'Publicar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            const response = await PersonnelRequisitionService.published(modelPersonnelRequisition.value.id, modelPersonnelRequisition.value);
            alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
            indexPersonnelRequisition();
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
            await submitPersonnelRequisitionAll();
        }
    }
}

const submitRequiredExperienceDelete = async (requiredExperienceId) => {
    try {
        const response = await RequiredExperienceService.delete(requiredExperienceId);
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

const submitRequiredSkillDelete = async (requiredSkillId) => {
    try {
        const response = await RequiredSkillService.delete(requiredSkillId);
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

const submitAcademicRequirementDelete = async (academicRequirementId) => {
    try {
        const response = await AcademicRequirementService.delete(academicRequirementId);
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

const submitResponsabilityDelete = async (responsabilityId) => {
    try {
        const response = await ResponsabilityService.delete(responsabilityId);
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

const addRequiredExperience = () => {
    requiredExperiences.value.push(new ModelRequiredExperience());
}

const removeRequiredExperience = async (index) => {
    modelRequiredExperience.value = requiredExperiences.value[index];

    if (modelRequiredExperience.value?.id) {
        await submitRequiredExperienceDelete(modelRequiredExperience.value.id);
    }

    requiredExperiences.value.splice(index, 1);

    // ✅ limpiar error de esa fila y reindexar los de abajo
    cleanRowErrors('required_experiences', index);

    modelRequiredExperience.value = new ModelRequiredExperience();
};

const addRequiredSkill = () => {
    if (modelRequiredSkill.value.skill_id) {
        const skill = skills.value.find(s => s.id === modelRequiredSkill.value.skill_id);
        if (skill) {
            requiredSkills.value.push(new ModelRequiredSkill({
                id: null,
                profile_id: null,
                skill_type_id: skill.skill_type.id,
                skill: skill,
                skill_id: skill.id,
                percentage: 0
            }))
        };
        modelRequiredSkill.value.skill_id = null;
    }
}

const removeRequiredSkill = async (skillId) => {
    const index = requiredSkills.value.findIndex(s => s.skill_id === skillId);
    if (index !== -1) {

        modelRequiredSkill.value = requiredSkills.value[index];

        if (modelRequiredSkill.value?.id) {
            await submitRequiredSkillDelete(modelRequiredSkill.value.id);
        }

        requiredSkills.value.splice(index, 1);

        cleanRowErrors('required_skills', index);
    }

    modelRequiredSkill.value = new ModelRequiredSkill();
}

const addBenefit = () => {
    if (modelBenefit.value.id) {
        const benefit = benefits.value.find(s => s.id === modelBenefit.value.id);
        if (benefit) {
            // Solo agregar si no está ya
            if (!requiredBenefits.value.some(rb => rb.id === benefit.id)) {
                requiredBenefits.value.push(benefit);
                modelPersonnelRequisition.value.benefits_id.push(benefit.id);
            }
        }
        // Resetear el select
        modelBenefit.value = new ModelBenefit();
    }
};

const removeBenefit = (benefitId) => {
    const index = requiredBenefits.value.findIndex(b => b.id === benefitId);
    if (index !== -1) {
        requiredBenefits.value.splice(index, 1);
    }

    // Quitar también de ids
    const idxId = modelPersonnelRequisition.value.benefits_id.findIndex(id => id === benefitId);
    if (idxId !== -1) {
        modelPersonnelRequisition.value.benefits_id.splice(idxId, 1);
    }
};

const areasWithAll = computed(() => [
    { id: null, name: "Todas las áreas" },
    ...(areas.value || [])
]);

const addAcademicRequirement = () => {
    academicRequirements.value.push(new ModelAcademicRequirement());
}

const removeAcademicRequirement = async (index) => {
    modelAcademicRequirement.value = academicRequirements.value[index];

    if (modelAcademicRequirement.value?.id) {
        await submitAcademicRequirementDelete(modelAcademicRequirement.value.id);
    }

    academicRequirements.value.splice(index, 1);

    cleanRowErrors('academic_requirements', index);
}

const addResponsability = () => {
    responsabilities.value.push(new ModelResponsability());
}

const removeResponsability = async (index) => {
    modelResponsability.value = responsabilities.value[index];

    if (modelResponsability.value?.id) {
        await submitResponsabilityDelete(modelResponsability.value.id);
    }

    responsabilities.value.splice(index, 1);

    cleanRowErrors('responsabilities', index);
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

const prefixErrors = (errors = {}, prefix = '') => {
    const next = {};

    Object.entries(errors || {}).forEach(([path, messages]) => {
        const field = path.split('.').pop();
        const key = prefix ? `${prefix}_${field}` : field;
        next[key] = Array.isArray(messages) ? [...messages] : [messages];
    });

    return next;
};

const cleanRowErrors = (type, index) => {
    if (!formErrors.value[type]) return;

    delete formErrors.value[type][index];

    const reordered = {};
    Object.keys(formErrors.value[type]).forEach((key) => {
        const k = Number(key);
        if (k > index) reordered[k - 1] = formErrors.value[type][key];
        else if (k < index) reordered[k] = formErrors.value[type][key];
    });

    formErrors.value[type] = reordered;
};

const resetFormErrors = () => {
    formErrors.value = {
        personnel_requisition: {},
        position: {},
        academic_requirements: {},
        required_skills: {},
        required_experiences: {},
        responsabilities: {},
        benefits: {}
    };
};

const buildAcademicRequirementRowErrors = (errors = {}) => {
    const row = {};
    if (errors.academic_level_id) row.academic_level_id = errors.academic_level_id;
    if (errors.academic_title) row.academic_title = errors.academic_title;
    if (errors.formation_status_id) row.formation_status_id = errors.formation_status_id;
    return Object.keys(row).length ? row : null;
};

const buildRequiredSkillRowErrors = (errors = {}) => {
    const row = {};
    if (errors.skill_id) row.skill_id = errors.skill_id;
    if (errors.percentage) row.percentage = errors.percentage;
    return Object.keys(row).length ? row : null;
};

const buildRequiredExperienceRowErrors = (errors = {}) => {
    const row = {};
    if (errors.name) row.name = errors.name;
    if (errors.duration_months) row.duration_months = errors.duration_months;
    if (errors.description) row.description = errors.description;
    return Object.keys(row).length ? row : null;
};

const buildResponsabilityRowErrors = (errors = {}) => {
    const row = {};
    if (errors.name) row.name = errors.name;
    if (errors.description) row.description = errors.description;
    return Object.keys(row).length ? row : null;
};

const indexPersonnelRequisition = () => {
    showIndexPersonnelRequisition.value = true
    showCreatePersonnelRequisition.value = false
    showEditPersonnelRequisition.value = false
    showDetailPersonnelRequisition.value = false
    showExistPersonnelRequisition.value = false
    showPublicPersonnelRequisition.value = false
    resetFormErrors();
}

// const createPersonnelRequisition = () => {
//     submitEmployeeFind();
//     submitPositionAll();
//     showIndexPersonnelRequisition.value = false
//     showCreatePersonnelRequisition.value = true
//     showEditPersonnelRequisition.value = false
//     showDetailPersonnelRequisition.value = false
//     showExistPersonnelRequisition.value = false
//     showPublicPersonnelRequisition.value = false
//     cleanForm();
// }

const existPersonnelRequisition = () => {
    cleanForm();
    submitEmployeeFind();
    submitPositionAll();
    showIndexPersonnelRequisition.value = false
    showCreatePersonnelRequisition.value = false
    showEditPersonnelRequisition.value = false
    showDetailPersonnelRequisition.value = false
    showExistPersonnelRequisition.value = true
    showPublicPersonnelRequisition.value = false
}

const editPersonnelRequisition = () => {
    // submitEmployeeFind();
    submitPositionAll();
    showIndexPersonnelRequisition.value = false
    showCreatePersonnelRequisition.value = false
    showEditPersonnelRequisition.value = true
    showDetailPersonnelRequisition.value = false
    showExistPersonnelRequisition.value = false
    showPublicPersonnelRequisition.value = false
}

const publicPersonnelRequisition = () => {
    showIndexPersonnelRequisition.value = false
    showCreatePersonnelRequisition.value = false
    showEditPersonnelRequisition.value = false
    showDetailPersonnelRequisition.value = false
    showExistPersonnelRequisition.value = false
    showPublicPersonnelRequisition.value = true
}

function detailPersonnelRequisition(vacante) {
    activeVacant.value = vacante
    selectedVacantId.value = vacante?.id ?? null
    showDetailPersonnelRequisition.value = true
}

function closeDetail() {
    showDetailPersonnelRequisition.value = false
    activeVacant.value = null
}

const cleanForm = () => {
    modelPersonnelRequisition.value.id = null;
    modelPersonnelRequisition.value.hiring_reason_id = null;
    modelPersonnelRequisition.value.position_id = null;
    modelPersonnelRequisition.value.headquarter_id = null;
    modelPersonnelRequisition.value.contract_type_id = null;
    modelPersonnelRequisition.value.work_arrangement_id = null;
    modelPersonnelRequisition.value.work_day_id = null;
    modelPersonnelRequisition.value.salary_min = null;
    modelPersonnelRequisition.value.salary_max = null;
    modelPersonnelRequisition.value.start_date = '';
    modelPersonnelRequisition.value.end_date = null;
    modelPersonnelRequisition.value.description = '';
    modelPersonnelRequisition.value.quantity = null;
    modelPersonnelRequisition.value.settings = {
        polygraph: false,
        video_interview: false
    };
    modelPersonnelRequisition.value.relationships = {};
    modelPersonnelRequisition.value.entity_id = null;
    modelPersonnelRequisition.value.person_id = null;
    modelPersonnelRequisition.value.benefits_id = [];
    modelPersonnelRequisition.value.uuid = null;
    modelPosition.value.id = null;
    modelPosition.value.area_id = null;
    modelPosition.value.name = '';
    modelPosition.value.profile_category_id = null;
    modelPosition.value.description = '';
    modelPosition.value.settings.polygraph = false;
    modelPosition.value.settings.video_interview = false;
    modelPosition.value.relationships = {};
    academicRequirements.value = [];
    requiredExperiences.value = [];
    requiredSkills.value = [];
    responsabilities.value = [];
    requiredBenefits.value = [];
    formErrors.value = {
        personnel_requisition: {},
        academic_requirements: {},
        required_skills: {},
        required_experiences: {},
        required_benefits: {},
        responsabilities: {}
    };
}

const clearData = () => {
    modelPosition.value = new ModelPosition();

    if (!modelPosition.value.settings) {
        modelPosition.value.settings = {
            polygraph: false,
            video_interview: false
        };
    }

    modelPersonnelRequisition.value.position_id = null;

    academicRequirements.value = [];
    requiredExperiences.value = [];
    requiredSkills.value = [];
    responsabilities.value = [];
    employees.value = [];
};

const init = async () => {
    loading.value = true;
    try {
        await Promise.all([
            submitEntityAll(),
            submitPersonnelRequisitionAll(),
            submitAcademicLevelAll(),
            submitFormationStatusAll(),
            submitProfileCategoryAll(),
            submitSkillAll(),
            submitBenefitAll(),
            submitContractTypeAll(),
            submitAreaAll(),
            submitArrangementAll(),
            submitWorkDayAll(),
            submitHiringReasonAll(),
            submitPositionAll()
        ]);
    } finally {
        loading.value = false;
    }
};

watch(() => modelPersonnelRequisition.value.entity_id, async () => {
    headquarters.value = [];
    modelPersonnelRequisition.value.entity_id ?
        await submitHeadquarterAll(modelPersonnelRequisition.value.entity_id) :
        modelPersonnelRequisition.value.headquarter_id = null;
});

onMounted(() => {
    init();
});

watch(pagination, () => {
    submitPersonnelRequisitionAll()
}, { deep: true })
</script>
