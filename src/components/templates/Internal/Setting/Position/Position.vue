<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewSetting from "./Setting.vue"

const props = defineProps({
    modelPosition: Object,
    modelRequiredSkill: Object,
    positions: Array,
    profileCategories: Array,
    areas: Array,
    modules: Array,
    submodules: Array,
    permissions: Array,
    academicLevels: Array,
    formationStatuses: Array,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    responsabilities: Array,
    skills: Array,
    pagination: Object,
    showIndexPosition: Boolean,
    showCreatePosition: Boolean,
    showEditPosition: Boolean,
    showDetailPosition: Boolean,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
    loadingDetail: Boolean,
    showSettingPosition: Boolean,
    errors: Object,
    loadingIndex: Boolean
})

const emit = defineEmits([
    'index','create','edit','detail','close-detail','addAcademicRequirement','removeAcademicRequirement','addRequiredSkill','removeRequiredSkill','addRequiredExperience',
    'removeRequiredExperience','addResponsability','removeResponsability','submitPositionStore','submitPositionUpdate','submitPositionDelete','submitPositionRestore',
    'setting','submitSubmoduleAll','submitPermissionAll','submitPositionToggle'
])

</script>

<template>
    <ViewIndex v-if="props.showIndexPosition" :positions="props.positions" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')" @detail="emit('detail')" 
        @close-detail="emit('close-detail')" :showDetailPosition="props.showDetailPosition" @submitPositionFind="emit('submitPositionFind', $event)" 
        @submitPositionDelete="emit('submitPositionDelete', $event)" @submitPositionRestore="emit('submitPositionRestore', $event)" :modelPosition="props.modelPosition" 
        :formatTime="props.formatTime" :academicRequirements="props.academicRequirements" :requiredExperiences="props.requiredExperiences" :requiredSkills="props.requiredSkills" 
        @setting="emit('setting')" :responsabilities="props.responsabilities" :currentLabel="props.currentLabel" :currentColor="props.currentColor" 
        :loadingDetail="props.loadingDetail" @configuration="emit('configuration')" :loadingIndex="props.loadingIndex"/>

    <ViewCreate :modelPosition="props.modelPosition" :modelRequiredSkill="props.modelRequiredSkill" :areas="props.areas" :academicLevels="props.academicLevels" 
        :formationStatuses="props.formationStatuses" v-if="props.showCreatePosition" @close="emit('close')" @index="emit('index')" :skills="props.skills" 
        :requiredSkills="props.requiredSkills" :academicRequirements="props.academicRequirements" @addAcademicRequirement="emit('addAcademicRequirement', $event)" 
        @removeAcademicRequirement="emit('removeAcademicRequirement', $event)" :profileCategories="props.profileCategories" :currentLabel="props.currentLabel" 
        :currentColor="props.currentColor" @addRequiredSkill="emit('addRequiredSkill')" @removeRequiredSkill="emit('removeRequiredSkill', $event)" 
        @addRequiredExperience="emit('addRequiredExperience')" @removeRequiredExperience="emit('removeRequiredExperience', $event)" :responsabilities="props.responsabilities" 
        @addResponsability="emit('addResponsability')" @removeResponsability="emit('removeResponsability', $event)" :formatTime="props.formatTime" 
        :requiredExperiences="props.requiredExperiences" @submitPositionStore="emit('submitPositionStore')" :errors="props.errors" />

    <ViewEdit :modelPosition="props.modelPosition" :modelRequiredSkill="props.modelRequiredSkill" :areas="props.areas" :academicLevels="props.academicLevels" 
        :formationStatuses="props.formationStatuses" v-if="props.showEditPosition" @close="emit('close')" @index="emit('index')" :skills="props.skills" 
        :requiredSkills="props.requiredSkills" :academicRequirements="props.academicRequirements" @addAcademicRequirement="emit('addAcademicRequirement', $event)" 
        @removeAcademicRequirement="emit('removeAcademicRequirement', $event)" :profileCategories="props.profileCategories" :currentLabel="props.currentLabel" 
        :currentColor="props.currentColor" @addRequiredSkill="emit('addRequiredSkill')" @removeRequiredSkill="emit('removeRequiredSkill', $event)" 
        @addRequiredExperience="emit('addRequiredExperience')" @removeRequiredExperience="emit('removeRequiredExperience', $event)" :responsabilities="props.responsabilities" 
        @addResponsability="emit('addResponsability')" @removeResponsability="emit('removeResponsability', $event)" :formatTime="props.formatTime" 
        :requiredExperiences="props.requiredExperiences" @submitPositionUpdate="emit('submitPositionUpdate')" :errors="props.errors" />

    <ViewSetting v-if="props.showSettingPosition" :modelPosition="props.modelPosition" :modules="props.modules" :submodules="props.submodules" 
        @submitSubmoduleAll="emit('submitSubmoduleAll', $event)" @index="emit('index')" @submitPermissionAll="emit('submitPermissionAll', $event)" 
        :permissions="props.permissions" @submitPositionToggle="emit('submitPositionToggle', $event)"/>
</template>
