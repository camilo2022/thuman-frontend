<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelCampaign: Object,
  campaigns: Array,
  pagination: Object,
  showCreateCampaign: Boolean,
  showEditCampaign: Boolean,
  errors: Object,
  loagindData: Boolean
})
const emit = defineEmits(['index', 'create', 'edit', 'closeModals', 'submitCampaignStore', 'submitCampaignFind', 'submitCampaignUpdate', 'submitCampaignDelete', 'submitCampaignRestore'])
</script>

<template>

  <ViewIndex :campaigns="props.campaigns" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @submitCampaignFind="emit('submitCampaignFind', $event)"
    @submitCampaignDelete="emit('submitCampaignDelete', $event)"
    @submitCampaignRestore="emit('submitCampaignRestore', $event)" :loagindData="props.loagindData"
    @index="emit('index')" />
  <ViewCreate :modelCampaign="props.modelCampaign" @submitCampaignStore="emit('submitCampaignStore', $event)"
    v-if="props.showCreateCampaign" @closeModals="emit('closeModals')" :errors="props.errors" />
  <ViewEdit :modelCampaign="props.modelCampaign" @submitCampaignUpdate="emit('submitCampaignUpdate', $event)"
    v-if="props.showEditCampaign" @closeModals="emit('closeModals')" :errors="props.errors" />
</template>