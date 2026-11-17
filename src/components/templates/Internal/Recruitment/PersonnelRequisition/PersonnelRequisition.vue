<script setup>
import ViewIndex from "./Index.vue"
import ViewEdit from "./Edit.vue"
import ViewCreate from "./Create.vue"
import ViewExist from "./Exist.vue"
import ViewPublic from "./PublicVacant.vue"

// props que vienen del controlador
const props = defineProps({
    modelPersonnelRequisition: Object,
    modelPosition: Object,
    modelRequiredSkill: Object,
    modelBenefit: Object,
    PersonnelRequisitions: Array,
    profileCategories: Array,
    areas: Array,
    headquarters: Array,
    entities: Array,
    academicLevels: Array,
    formationStatuses: Array,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    requiredBenefits: Array,
    responsabilities: Array,
    skills: Array,
    vacants: Array,
    benefits: Array,
    positions: Array,
    typeContracts: Array,
    pagination: Object,
    showIndexPersonnelRequisition: Boolean,
    showCreatePersonnelRequisition: Boolean,
    showEditPersonnelRequisition: Boolean,
    showDetailPersonnelRequisition: Boolean,
    showExistPersonnelRequisition: Boolean,
    showPublicPersonnelRequisition: Boolean,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
    workArrangements: Array,
    workDays: Array,
    submitRequiredSkillAll: Array,
    loading: Boolean,
    hiringReasons: Array,
    statuses: Array,
    loadingIndex: Boolean,
    loadingDetail: Boolean,
    modelEmployee: Object,
    employees: Array,
    errors: Object
})

const emit = defineEmits([
    "create", "edit", "close", "index", "open-detail", "close-detail", "exist", "public", 'detail', 'addAcademicRequirement', 'removeAcademicRequirement', 'addRequiredSkill',
    'removeRequiredSkill', 'addRequiredExperience', 'addBenefit', 'removeBenefit', 'removeRequiredExperience', 'addResponsability', 'removeResponsability',
    'submitPersonnelRequisitionStore', 'submitPersonnelRequisitionUpdate', 'submitPersonnelRequisitionDelete', 'submitPersonnelRequisitionRestore', 'submitVacantFind',
    'submitPersonnelRequisitionPublished', 'findPosition'
])
</script>

<template>

    <ViewIndex v-if="props.showIndexPersonnelRequisition" @create="emit('create')" @edit="emit('edit')"
        @exist="emit('exist')" @detail="emit('detail')" @close-detail="emit('close-detail')" @public="emit('public')"
        :showDetailPersonnelRequisition="props.showDetailPersonnelRequisition"
        @submitPersonnelRequisitionFind="emit('submitPersonnelRequisitionFind', $event)"
        @submitPersonnelRequisitionDelete="emit('submitPersonnelRequisitionDelete', $event)"
        @submitPersonnelRequisitionRestore="emit('submitPersonnelRequisitionRestore', $event)"
        :modelPersonnelRequisition="props.modelPersonnelRequisition" :formatTime="props.formatTime"
        :academicRequirements="props.academicRequirements" :requiredExperiences="props.requiredExperiences"
        :requiredSkills="props.requiredSkills" :responsabilities="props.responsabilities"
        :currentLabel="props.currentLabel" :currentColor="props.currentColor" :vacants="props.vacants"
        :pagination="props.pagination" @submitVacantFind="emit('submitVacantFind', $event)"
        :requiredBenefits="props.requiredBenefits" :areas="props.areas" :statuses="props.statuses"
        :loadingIndex="props.loadingIndex" :loadingDetail="props.loadingDetail" />

    <ViewCreate :modelPersonnelRequisition="props.modelPersonnelRequisition" :modelPosition="props.modelPosition"
        :modelRequiredSkill="props.modelRequiredSkill" :modelBenefit="props.modelBenefit" :areas="props.areas"
        :academicLevels="props.academicLevels" :formationStatuses="props.formationStatuses"
        :hiringReasons="props.hiringReasons" v-if="props.showCreatePersonnelRequisition" @close="emit('close')"
        @index="emit('index')" :skills="props.skills" :benefits="props.benefits" :typeContracts="props.typeContracts"
        :requiredSkills="props.requiredSkills" :academicRequirements="props.academicRequirements"
        @addAcademicRequirement="emit('addAcademicRequirement', $event)" :headquarters="props.headquarters"
        @removeAcademicRequirement="emit('removeAcademicRequirement', $event)" :entities="props.entities"
        :profileCategories="props.profileCategories" :currentLabel="props.currentLabel"
        :currentColor="props.currentColor" @addRequiredSkill="emit('addRequiredSkill')"
        @removeRequiredSkill="emit('removeRequiredSkill', $event)" @addBenefit="emit('addBenefit')"
        @removeBenefit="emit('removeBenefit', $event)" :requiredBenefits="props.requiredBenefits"
        @addRequiredExperience="emit('addRequiredExperience')"
        @removeRequiredExperience="emit('removeRequiredExperience', $event)" :responsabilities="props.responsabilities"
        @addResponsability="emit('addResponsability')" @removeResponsability="emit('removeResponsability', $event)"
        :formatTime="props.formatTime" :requiredExperiences="props.requiredExperiences"
        @submitPersonnelRequisitionStore="emit('submitPersonnelRequisitionStore', $event)"
        :workArrangements="props.workArrangements" :workDays="props.workDays" :modelEmployee="props.modelEmployee"
        :employees="props.employees" :errors="props.errors" />

    <ViewEdit v-if="props.showEditPersonnelRequisition" :modelPersonnelRequisition="props.modelPersonnelRequisition"
        :modelPosition="props.modelPosition" :modelRequiredSkill="props.modelRequiredSkill"
        :modelBenefit="props.modelBenefit" :areas="props.areas" :academicLevels="props.academicLevels"
        :formationStatuses="props.formationStatuses" @close="emit('close')" @index="emit('index')"
        :skills="props.skills" :benefits="props.benefits" :typeContracts="props.typeContracts"
        :requiredSkills="props.requiredSkills" :academicRequirements="props.academicRequirements"
        @addAcademicRequirement="emit('addAcademicRequirement', $event)" :hiringReasons="props.hiringReasons"
        @removeAcademicRequirement="emit('removeAcademicRequirement', $event)"
        :profileCategories="props.profileCategories" :currentLabel="props.currentLabel"
        :currentColor="props.currentColor" @addRequiredSkill="emit('addRequiredSkill')"
        @removeRequiredSkill="emit('removeRequiredSkill', $event)" @addBenefit="emit('addBenefit')"
        @removeBenefit="emit('removeBenefit', $event)" :requiredBenefits="props.requiredBenefits"
        @addRequiredExperience="emit('addRequiredExperience')"
        @removeRequiredExperience="emit('removeRequiredExperience', $event)" :responsabilities="props.responsabilities"
        @addResponsability="emit('addResponsability')" @removeResponsability="emit('removeResponsability', $event)"
        :formatTime="props.formatTime" :requiredExperiences="props.requiredExperiences"
        @submitPersonnelRequisitionUpdate="emit('submitPersonnelRequisitionUpdate', $event)"
        :workArrangements="props.workArrangements" :workDays="props.workDays"
        @findPosition="emit('findPosition', $event)" :submitRequiredSkillAll="props.submitRequiredSkillAll"
        :loading="props.loadingDetail" :employees="props.employees" :errors="props.errors" />

    <ViewExist v-if="props.showExistPersonnelRequisition" :modelPersonnelRequisition="props.modelPersonnelRequisition"
        :modelPosition="props.modelPosition" :modelRequiredSkill="props.modelRequiredSkill"
        :modelBenefit="props.modelBenefit" :areas="props.areas" :academicLevels="props.academicLevels"
        :formationStatuses="props.formationStatuses" :hiringReasons="props.hiringReasons" @index="emit('index')"
        :skills="props.skills" :benefits="props.benefits" :typeContracts="props.typeContracts"
        :requiredSkills="props.requiredSkills" :academicRequirements="props.academicRequirements"
        @addAcademicRequirement="emit('addAcademicRequirement', $event)"
        @removeAcademicRequirement="emit('removeAcademicRequirement', $event)"
        :profileCategories="props.profileCategories" :currentLabel="props.currentLabel"
        :currentColor="props.currentColor" @addRequiredSkill="emit('addRequiredSkill')"
        @removeRequiredSkill="emit('removeRequiredSkill', $event)" @addBenefit="emit('addBenefit')"
        @removeBenefit="emit('removeBenefit', $event)" :requiredBenefits="props.requiredBenefits"
        @addRequiredExperience="emit('addRequiredExperience')"
        @removeRequiredExperience="emit('removeRequiredExperience', $event)" :responsabilities="props.responsabilities"
        @addResponsability="emit('addResponsability')" @removeResponsability="emit('removeResponsability', $event)"
        :formatTime="props.formatTime" :requiredExperiences="props.requiredExperiences"
        @submitPersonnelRequisitionStore="emit('submitPersonnelRequisitionStore', $event)"
        @submitPersonnelRequisitionUpdate="emit('submitPersonnelRequisitionUpdate')"
        @findPosition="emit('findPosition', $event)" :workArrangements="props.workArrangements"
        :workDays="props.workDays" @close="emit('index')" :positions="props.positions"
        :modelEmployee="props.modelEmployee" :employees="props.employees" :errors="props.errors" :loadingDetail="props.loadingDetail" />

    <ViewPublic v-if="props.showPublicPersonnelRequisition" :modelPersonnelRequisition="props.modelPersonnelRequisition"
        :modelPosition="props.modelPosition" :modelRequiredSkill="props.modelRequiredSkill"
        :modelBenefit="props.modelBenefit" :areas="props.areas" :academicLevels="props.academicLevels"
        :formationStatuses="props.formationStatuses" @close="emit('close')" @index="emit('index')"
        :skills="props.skills" :benefits="props.benefits" :typeContracts="props.typeContracts"
        :requiredSkills="props.requiredSkills" :academicRequirements="props.academicRequirements"
        @addAcademicRequirement="emit('addAcademicRequirement', $event)" :hiringReasons="props.hiringReasons"
        @removeAcademicRequirement="emit('removeAcademicRequirement', $event)"
        :profileCategories="props.profileCategories" :currentLabel="props.currentLabel"
        :currentColor="props.currentColor" @addRequiredSkill="emit('addRequiredSkill')"
        @removeRequiredSkill="emit('removeRequiredSkill', $event)" @addBenefit="emit('addBenefit')"
        @removeBenefit="emit('removeBenefit', $event)" :requiredBenefits="props.requiredBenefits"
        @addRequiredExperience="emit('addRequiredExperience')"
        @submitPersonnelRequisitionPublished="emit('submitPersonnelRequisitionPublished')"
        @removeRequiredExperience="emit('removeRequiredExperience', $event)" :responsabilities="props.responsabilities"
        @addResponsability="emit('addResponsability')" @removeResponsability="emit('removeResponsability', $event)"
        :formatTime="props.formatTime" :requiredExperiences="props.requiredExperiences"
        @submitPersonnelRequisitionStore="emit('submitPersonnelRequisitionStore')"
        :workArrangements="props.workArrangements" :workDays="props.workDays"
        :submitRequiredSkillAll="props.submitRequiredSkillAll" :loading="props.loadingDetail" />
</template>
