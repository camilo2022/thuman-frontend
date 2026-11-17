<template>
    <ViewPosition :modelPosition="modelPosition" :modelRequiredSkill="modelRequiredSkill" :positions="positions"
        :pagination="pagination" :areas="areas" :academicLevels="academicLevels" :formationStatuses="formationStatuses"
        :showIndexPosition="showIndexPosition" :showCreatePosition="showCreatePosition"
        :profileCategories="profileCategories" :showEditPosition="showEditPosition"
        @addAcademicRequirement="addAcademicRequirement" @submitPositionFind="submitPositionFind"
        @removeAcademicRequirement="removeAcademicRequirement" :requiredSkills="requiredSkills" :skills="skills"
        :academicRequirements="academicRequirements" :showDetailPosition="showDetailPosition" @index="indexPosition"
        @create="createPosition" @edit="editPosition" :currentLabel="currentLabel" :currentColor="currentColor"
        @addRequiredSkill="addRequiredSkill" @removeRequiredSkill="removeRequiredSkill"
        @addRequiredExperience="addRequiredExperience" @removeRequiredExperience="removeRequiredExperience"
        :responsabilities="responsabilities" @addResponsability="addResponsability"
        @removeResponsability="removeResponsability" :requiredExperiences="requiredExperiences" :formatTime="formatTime"
        @detail="detailPosition" @submitPositionStore="submitPositionStore" @submitPositionUpdate="submitPositionUpdate"
        @submitPositionDelete="submitPositionDelete" @submitPositionRestore="submitPositionRestore"
        :loadingDetail="loadingDetail" @close-detail="closeDetail" @setting="settingPosition" :modules="modules"
        :submodules="submodules" :showSettingPosition="showSettingPosition" @submitSubmoduleAll="submitSubmoduleAll"
        @submitPermissionAll="submitPermissionAll" :permissions="permissions"
        @submitPositionToggle="submitPositionToggle" :errors="formErrors" :loadingIndex="loadingIndex" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewPosition from '@/components/templates/Internal/Setting/Position/Position.vue';

import ModelPosition from '@/models/Position';
import ModelAcademicRequirement from '@/models/AcademicRequirement';
import ModelRequiredExperience from '@/models/RequiredExperience';
import ModelRequiredSkill from '@/models/RequiredSkill';
import ModelResponsability from '@/models/Responsability';

import PositionService from '@/services/PositionService';
import RequiredExperienceService from '@/services/RequiredExperienceService';
import RequiredSkillService from '@/services/RequiredSkillService';
import AcademicRequirementService from '@/services/AcademicRequirementService';
import ResponsabilityService from '@/services/ResponsabilityService';
import AcademicLevelService from '@/services/AcademicLevelService';
import FormationStatusService from '@/services/FormationStatusService';
import SkillService from '@/services/SkillService';
import ProfileCategoryService from '@/services/ProfileCategoryService';
import AreaService from '@/services/AreaService';
import ModuleService from '@/services/ModuleService';
import SubmoduleService from '@/services/SubmoduleService';
import PermissionService from '@/services/PermissionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const academicRequirements = ref([]);
const requiredExperiences = ref([]);
const requiredSkills = ref([]);
const responsabilities = ref([]);

const modelPosition = ref(new ModelPosition());
const modelAcademicRequirement = ref(new ModelAcademicRequirement());
const modelRequiredExperience = ref(new ModelRequiredExperience());
const modelRequiredSkill = ref(new ModelRequiredSkill());
const modelResponsability = ref(new ModelResponsability());

const formErrors = ref({
    position: {},
    academic_requirements: {},
    required_skills: {},
    required_experiences: {},
    responsabilities: {}
});
const isSubmitting = ref(false);

const positions = ref([]);
const academicLevels = ref([]);
const formationStatuses = ref([]);
const skills = ref([]);
const profileCategories = ref([]);
const areas = ref([]);
const modules = ref([]);
const submodules = ref([]);
const permissions = ref([]);

const showIndexPosition = ref(true);
const showCreatePosition = ref(false);
const showEditPosition = ref(false);
const showDetailPosition = ref(false);
const showSettingPosition = ref(false);
const activePosition = ref(null);
const selectedPositionId = ref(null);
const loadingDetail = ref(false);

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

const submitPositionAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await PositionService.all(pagination.current_page, pagination.search, pagination.per_page, null, null, null, { withTrashed: true });
        positions.value = response.data.positions;

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
        console.log(requiredSkills.value);
        requiredSkills.value.forEach(async (requiredSkill, index) => {
            if (requiredSkill.skill == null) return;
            requiredSkill.skill_type = requiredSkill.skill.skill_type[0];
            requiredSkill.skill_type_id = requiredSkill.skill.skill_type[0]?.id;
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
        loadingDetail.value = false;
    } catch (error) {
        loadingDetail.value = false;
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

const submitModuleAll = async () => {
    try {
        const response = await ModuleService.all(1, '', null, 'Interno');
        modules.value = response.data.modules;
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

const submitSubmoduleAll = async (moduleId) => {
    permissions.value = [];
    try {
        const response = await SubmoduleService.all(moduleId);
        submodules.value = response.data.submodules;
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

const submitPermissionAll = async ([roleId, permissionId]) => {
    if (!roleId && !permissionId) { permissions.value = []; return; }
    try {
        const response = await PermissionService.all(1, '', null, roleId, permissionId);
        permissions.value = response.data.permissions;
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

const submitPositionFind = async (positionId) => {
    try {
        loadingDetail.value = true;
        const response = await PositionService.find(positionId);
        modelPosition.value.id = response.data.position.id;
        modelPosition.value.area_id = response.data.position.area_id;
        modelPosition.value.name = response.data.position.name;
        modelPosition.value.profile_category_id = response.data.position.profile_category_id;
        modelPosition.value.settings = response.data.position.settings;
        modelPosition.value.description = response.data.position.description;
        modelPosition.value.relationships = response.data.position.relationships;

        submitAcademicRequirementAll();
        submitRequiredSkillAll();
        submitRequiredExperienceAll();
        submitResponsabilityAll();
    } catch (error) {
        loadingDetail.value = false;
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

const submitPositionStore = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);

    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea registrar el perfil de cargo?',
        message: 'Se creará el perfil de cargo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (!confirmed) return;

    try {

        if (!academicRequirements.value.length ||
            !requiredSkills.value.length ||
            !responsabilities.value.length) {

            alertStore.addAlert({
                title: 'Información incompleta',
                message: 'Debe agregar mínimo una formación, habilidad y responsabilidad.',
                type: 'warning'
            });

            return;
        }

        // 🔹 2. Crear position SOLO si no existe
        if (!modelPosition.value.id) {
            const response = await PositionService.store(modelPosition.value);
            modelPosition.value.id = response.data.position.id;
        }
        formErrors.value.position = {};
        // 🔹 3. Guardar relaciones
        await submitAcademicRequirementStoreOrUpdate();
        await submitRequiredSkillStoreOrUpdate();
        await submitRequiredExperienceStoreOrUpdate();
        await submitResponsabilityStoreOrUpdate();

        // 🔹 4. Verificar si quedaron errores en filas
        const hasAnyRowErrors =
            Object.keys(formErrors.value.academic_requirements || {}).length ||
            Object.keys(formErrors.value.required_skills || {}).length ||
            Object.keys(formErrors.value.required_experiences || {}).length ||
            Object.keys(formErrors.value.responsabilities || {}).length;

        if (!hasAnyRowErrors) {
            alertStore.addAlert({
                title: 'Registro exitoso',
                message: 'El perfil de cargo fue registrado correctamente.',
                type: 'success'
            });

            indexPosition();
        } else {
            alertStore.addAlert({
                title: 'Error',
                message: 'Verifique que todos los campos estén diligenciados correctamente.',
                type: 'danger'
            })
        }

    } catch (error) {

        if (error.errors) {
            formErrors.value.position = prefixErrors(error.errors, 'position');

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
        await submitPositionAll();
    }
};

const submitRequiredExperienceStoreOrUpdate = async () => {
    for (let index = 0; index < requiredExperiences.value.length; index++) {
        const requiredExperience = requiredExperiences.value[index];

        modelRequiredExperience.value.id = requiredExperience?.id || null;
        modelRequiredExperience.value.position_id = modelPosition.value.id;
        modelRequiredExperience.value.name = requiredExperience.name;
        modelRequiredExperience.value.duration_months = requiredExperience.duration_months;
        modelRequiredExperience.value.description = requiredExperience.description;

        if (!modelRequiredExperience.value.id) {
            await submitRequiredExperienceStore(index);
        } else {
            await submitRequiredExperienceUpdate();
        }
    }

    modelRequiredExperience.value = new ModelRequiredExperience();
};

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
    for (let index = 0; index < requiredSkills.value.length; index++) {
        const requiredSkill = requiredSkills.value[index];
        console.log(requiredSkill);
        if (requiredSkill.skill == null) return;
        modelRequiredSkill.value.id = requiredSkill?.id || null;
        modelRequiredSkill.value.position_id = modelPosition.value.id;
        modelRequiredSkill.value.skill_id = requiredSkill.skill_id;
        modelRequiredSkill.value.percentage = Number(requiredSkill.percentage);

        if (!modelRequiredSkill.value.id) {
            await submitRequiredSkillStore(index);
        } else {
            await submitRequiredSkillUpdate();
        }
    }

    modelRequiredSkill.value = new ModelRequiredSkill();
};

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
    for (let index = 0; index < academicRequirements.value.length; index++) {
        const academicRequirement = academicRequirements.value[index];

        modelAcademicRequirement.value.id = academicRequirement?.id || null;
        modelAcademicRequirement.value.position_id = modelPosition.value.id;
        modelAcademicRequirement.value.academic_level_id = academicRequirement.academic_level_id;
        modelAcademicRequirement.value.academic_title = academicRequirement.academic_title;
        modelAcademicRequirement.value.formation_status_id = academicRequirement.formation_status_id;

        if (!modelAcademicRequirement.value.id) {
            await submitAcademicRequirementStore(index);
        } else {
            await submitAcademicRequirementUpdate();
        }
    }

    modelAcademicRequirement.value = new ModelAcademicRequirement();
};

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
    for (let index = 0; index < responsabilities.value.length; index++) {
        const responsability = responsabilities.value[index];

        modelResponsability.value.id = responsability?.id || null;
        modelResponsability.value.position_id = modelPosition.value.id;
        modelResponsability.value.name = responsability.name;
        modelResponsability.value.description = responsability.description;

        if (!modelResponsability.value.id) {
            await submitResponsabilityStore(index);
        } else {
            await submitResponsabilityUpdate();
        }
    }

    modelResponsability.value = new ModelResponsability();
};

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
};

const submitPositionUpdate = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'warning',
        title: '¿Desea actualizar el perfil de cargo?',
        message: 'Se actualizará el perfil de cargo con la información ingresada.',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        confirmColor: 'btn-primary',
        cancelColor: 'btn-secondary',
        showConfirm: true,
        showCancel: true,
    });

    if (confirmed) {
        try {
            if (!academicRequirements.value.length ||
                !requiredSkills.value.length ||
                !responsabilities.value.length) {

                alertStore.addAlert({
                    title: 'Información incompleta',
                    message: 'Debe agregar mínimo una formación, habilidad y responsabilidad.',
                    type: 'warning'
                });

                return;
            }
            const response = await PositionService.update(modelPosition.value.id, modelPosition.value);

            await submitAcademicRequirementStoreOrUpdate();
            await submitRequiredSkillStoreOrUpdate();
            await submitRequiredExperienceStoreOrUpdate();
            await submitResponsabilityStoreOrUpdate();

            const hasAnyRowErrors =
                Object.keys(formErrors.value.academic_requirements || {}).length ||
                Object.keys(formErrors.value.required_skills || {}).length ||
                Object.keys(formErrors.value.required_experiences || {}).length ||
                Object.keys(formErrors.value.responsabilities || {}).length;

            if (!hasAnyRowErrors) {
                alertStore.addAlert({ title: 'Modificación exitosa.', message: response.message, type: 'success' });
                indexPosition();
            } else {
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            }

        } catch (error) {
            if (error.errors) {
                formErrors.value.position = prefixErrors(error.errors, 'position');
                alertStore.addAlert({ title: 'Error', message: 'Verifique que todos los campos estén diligenciados correctamente.', type: 'danger' });
            } else {
                alertStore.addAlert({ title: 'Error', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
            }
        } finally {
            await submitPositionAll();
        }
    }
};

const submitPositionToggle = async (permissionId) => {
    try {
        modelPosition.value.permission_id = permissionId;
        const response = await PositionService.toggle(modelPosition.value.id, modelPosition.value);
        modelPosition.value.relationships = response.data.position.relationships;
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

const submitPositionDelete = async (positionId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'danger',
        title: '¿Desea inactivar el perfil de cargo?',
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
            const response = await PositionService.delete(positionId);
            closeDetail()
            await submitPositionAll();
            alertStore.addAlert({ title: 'Inactivación exitosa.', message: response.message, type: 'success' });
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

const submitPositionRestore = async (positionId) => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    setTimeout(() => {
        isSubmitting.value = false;
    }, 2000);
    const confirmed = await swalStore.openSwal({
        type: 'question',
        title: '¿Desea activar el perfil de cargo?',
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
            const response = await PositionService.restore(positionId);

            alertStore.addAlert({ title: 'Activación exitosa.', message: response.message, type: 'success' });
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
            await submitPositionAll();
        }
    }
};

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
    if (!canAddRequiredExperience()) {
        alertStore.addAlert({
            title: 'Falta información',
            message: 'Completa la experiencia anterior antes de agregar una nueva.',
            type: 'warning'
        });
        return;
    }
    requiredExperiences.value.push(new ModelRequiredExperience());
};

const removeRequiredExperience = async (index) => {
    modelRequiredExperience.value = requiredExperiences.value[index];

    if (modelRequiredExperience.value?.id) {
        await submitRequiredExperienceDelete(modelRequiredExperience.value.id);
    }

    requiredExperiences.value.splice(index, 1);

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

const addAcademicRequirement = () => {
    if (!canAddAcademicRequirement()) {
        alertStore.addAlert({
            title: 'Falta información',
            message: 'Completa la formación anterior antes de agregar una nueva.',
            type: 'warning'
        });
        return;
    }
    academicRequirements.value.push(new ModelAcademicRequirement());
};

const removeAcademicRequirement = async (index) => {
    modelAcademicRequirement.value = academicRequirements.value[index];

    if (modelAcademicRequirement.value?.id) {
        await submitAcademicRequirementDelete(modelAcademicRequirement.value.id);
    }

    academicRequirements.value.splice(index, 1);

    cleanRowErrors('academic_requirements', index);
}

const addResponsability = () => {
    if (!canAddResponsability()) {
        alertStore.addAlert({
            title: 'Falta información',
            message: 'Completa la responsabilidad anterior antes de agregar una nueva.',
            type: 'warning'
        });
        return;
    }
    responsabilities.value.push(new ModelResponsability());
};

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

const indexPosition = () => {
    showIndexPosition.value = true;
    showCreatePosition.value = false;
    showEditPosition.value = false;
    showDetailPosition.value = false;
    showSettingPosition.value = false;
    cleanForm();
}

const createPosition = () => {
    showIndexPosition.value = false;
    showCreatePosition.value = true;
    showEditPosition.value = false;
    showDetailPosition.value = false;
    showSettingPosition.value = false;
    cleanForm();
}

const editPosition = () => {
    showIndexPosition.value = false;
    showCreatePosition.value = false;
    showEditPosition.value = true;
    showDetailPosition.value = false;
    showSettingPosition.value = false;
    cleanForm();
}

const detailPosition = (position) => {
    activePosition.value = position;
    selectedPositionId.value = position?.id ?? null;
    showDetailPosition.value = true;
}

const closeDetail = () => {
    showDetailPosition.value = false
}

const settingPosition = () => {
    showIndexPosition.value = false;
    showCreatePosition.value = false;
    showEditPosition.value = false;
    showDetailPosition.value = false;
    showSettingPosition.value = true;
    submodules.value = [];
    permissions.value = [];
    submitModuleAll();
}

const cleanForm = () => {
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
    formErrors.value = {
        position: {},
        academic_requirements: {},
        required_skills: {},
        required_experiences: {},
        responsabilities: {}
    };
}

const buildAcademicRequirementRowErrors = (errors = {}) => {
    const rowErrors = {};

    if (errors.academic_level_id) {
        rowErrors.academic_level_id = errors.academic_level_id;
    }
    if (errors.academic_title) {
        rowErrors.academic_title = errors.academic_title;
    }
    if (errors.formation_status_id) {
        rowErrors.formation_status_id = errors.formation_status_id;
    }

    return Object.keys(rowErrors).length > 0 ? rowErrors : null;
};

const buildRequiredSkillRowErrors = (errors = {}) => {
    const rowErrors = {};

    if (errors.skill_id) {
        rowErrors.skill_id = errors.skill_id;
    }

    if (errors.percentage) {
        rowErrors.percentage = errors.percentage;
    }

    return Object.keys(rowErrors).length > 0 ? rowErrors : null;
};

const buildRequiredExperienceRowErrors = (errors = {}) => {
    const rowErrors = {};

    if (errors.name) {
        rowErrors.name = errors.name;
    }

    if (errors.duration_months) {
        rowErrors.duration_months = errors.duration_months;
    }

    if (errors.description) {
        rowErrors.description = errors.description;
    }

    return Object.keys(rowErrors).length > 0 ? rowErrors : null;
};

const isFilled = (v) => v !== null && v !== undefined && String(v).trim() !== '';

const canAddAcademicRequirement = () => {
    if (!academicRequirements.value.length) return true;
    const last = academicRequirements.value[academicRequirements.value.length - 1];
    return isFilled(last.academic_level_id) &&
        isFilled(last.academic_title) &&
        isFilled(last.formation_status_id);
};

const canAddRequiredExperience = () => {
    if (!requiredExperiences.value.length) return true;
    const last = requiredExperiences.value[requiredExperiences.value.length - 1];
    return isFilled(last.name) &&
        Number(last.duration_months) > 0 &&
        isFilled(last.description);
};

const canAddResponsability = () => {
    if (!responsabilities.value.length) return true;
    const last = responsabilities.value[responsabilities.value.length - 1];
    return isFilled(last.name) &&
        isFilled(last.description);
};

const buildResponsabilityRowErrors = (errors = {}) => {
    const rowErrors = {};

    if (errors.name) {
        rowErrors.name = errors.name;
    }

    if (errors.description) {
        rowErrors.description = errors.description;
    }

    return Object.keys(rowErrors).length > 0 ? rowErrors : null;
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

const cleanRowErrors = (type, index) => {
    if (!formErrors.value[type]) return;

    delete formErrors.value[type][index];

    // Reindexar errores
    const reordered = {};
    Object.keys(formErrors.value[type]).forEach((key) => {
        const numericKey = Number(key);
        if (numericKey > index) {
            reordered[numericKey - 1] = formErrors.value[type][key];
        } else if (numericKey < index) {
            reordered[numericKey] = formErrors.value[type][key];
        }
    });

    formErrors.value[type] = reordered;
};

onMounted(() => {
    submitPositionAll();
    submitAcademicLevelAll();
    submitFormationStatusAll();
    submitAreaAll();
    submitProfileCategoryAll();
    submitSkillAll();
})

watch(() => pagination.current_page, () => {
    submitPositionAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPositionAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitPositionAll();
    }
});
</script>
