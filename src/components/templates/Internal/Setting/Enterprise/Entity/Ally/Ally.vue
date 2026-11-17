<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  modelAlly: Object,
  allies: Array,
  pagination: Object,
  showCreateAlly: Boolean,
  showEditAlly: Boolean,
  errors: Object,
  loagindData: Boolean,
  countries: Array
})
const emit = defineEmits(['index', 'create', 'edit', 'closeModals', 'submitAllyStore', 'submitAllyFind', 'submitAllyUpdate', 'submitAllyDelete', 'submitAllyRestore'])
</script>

<template>

  <ViewIndex :allies="props.allies" :pagination="props.pagination" @create="emit('create')" @edit="emit('edit')"
    @submitAllyFind="emit('submitAllyFind', $event)" @submitAllyDelete="emit('submitAllyDelete', $event)"
    @submitAllyRestore="emit('submitAllyRestore', $event)" :loagindData="props.loagindData" @index="emit('index')" />
  <ViewCreate :modelAlly="props.modelAlly" @submitAllyStore="emit('submitAllyStore', $event)"
    v-if="props.showCreateAlly" @closeModals="emit('closeModals')" :errors="props.errors"
    :countries="props.countries" />
  <ViewEdit :modelAlly="props.modelAlly" @submitAllyUpdate="emit('submitAllyUpdate', $event)" v-if="props.showEditAlly"
    @closeModals="emit('closeModals')" :errors="props.errors" :countries="props.countries" />
</template>