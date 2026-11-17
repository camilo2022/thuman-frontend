<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"
import ViewProfile from "./Profile.vue"
import ViewSignature from "./ElectronicSignature.vue"

const props = defineProps({
  modelEnterprise: Object,
  modelEntity: Object,
  modelPerson: Object,
  entities: Array,
  countries: Array,
  departaments: Array,
  cities: Array,
  documentTypes: Array,
  documentTypesPerson: Array,
  entityTypes: Array,
  pagination: Object,
  showIndexEntity: Boolean,
  showCreateEntity: Boolean,
  showEditEntity: Boolean,
  showProfileEntity: Boolean,
  showSettingEntity: Boolean,
  showElectronicSignature: Boolean,
  errors: Object,
  loadingProfile: Boolean,
  loadingIndex: Boolean
})
const emit = defineEmits(['index', 'create', 'edit', 'setting', 'profile', 'submitEntityStore', 'submitEntityFind', 'submitEntityUpdate', 'submitEntityDelete', 'submitEntityRestore', 'submitPersonFind', 'signature', 'closeModals', 'indexEnterprise']);
</script>

<template>
  <ViewIndex v-if="props.showIndexEntity" :entities="props.entities" :pagination="props.pagination"
    @create="emit('create')" @edit="emit('edit')" @setting="emit('setting')"
    @submitEntityFind="emit('submitEntityFind', $event)" @submitEntityDelete="emit('submitEntityDelete', $event)"
    @submitEntityRestore="emit('submitEntityRestore', $event)" @indexEnterprise="emit('indexEnterprise')" :loadingIndex="props.loadingIndex" />

  <ViewCreate v-if="props.showCreateEntity" :countries="props.countries" :departaments="props.departaments"
    :cities="props.cities" :documentTypes="props.documentTypes" :documentTypesPerson="props.documentTypesPerson"
    :entityTypes="props.entityTypes" :modelEnterprise="props.modelEnterprise" :modelEntity="props.modelEntity"
    :modelPerson="props.modelPerson" @index="emit('index')" @submitEntityStore="emit('submitEntityStore', $event)"
    @submitPersonFind="emit('submitPersonFind')" @signature="emit('signature')" @closeModals="emit('closeModals')"
    :errors="props.errors" />

  <ViewEdit v-if="props.showEditEntity" :countries="props.countries" :departaments="props.departaments"
    :cities="props.cities" :documentTypes="props.documentTypes" :documentTypesPerson="props.documentTypesPerson"
    :entityTypes="props.entityTypes" :modelEnterprise="props.modelEnterprise" :modelEntity="props.modelEntity"
    :modelPerson="props.modelPerson" @index="emit('index')" @submitEntityUpdate="emit('submitEntityUpdate', $event)"
    @submitPersonFind="emit('submitPersonFind')" @signature="emit('signature')" @closeModals="emit('closeModals')"
    :errors="props.errors" />

  <ViewProfile v-if="showSettingEntity" @index="emit('index')"
    @submitEntityProfile="emit('submitEntityProfile', $event)" @setting="emit('setting')" @profile="emit('profile')"
    :modelEntity="props.modelEntity" :showProfileEntity="showProfileEntity" :loadingProfile="props.loadingProfile"
    :errors="props.errors" @submitEntityFind="emit('submitEntityFind')" />

  <ViewSignature v-if="props.showElectronicSignature" :modelPerson="props.modelPerson"
    @closeModals="emit('closeModals')" />
</template>