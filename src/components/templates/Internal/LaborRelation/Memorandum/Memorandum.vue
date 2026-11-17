<script setup>
import ViewIndex from "./Index.vue"
import ViewCreate from "./Create.vue"
import ViewEdit from "./Edit.vue"

const props = defineProps({
  showDetailMemorandum: Boolean,
  showIndexMemorandum: Boolean,
  showCreateMemorandum: Boolean,
  showHistoryMemorandum: Boolean,
  showEditMemorandum: Boolean,
})

const emit = defineEmits(['index', 'create', 'edit', 'detail', 'close-detail', 'approv', 'reject', 'json', 'sendPetition', 'historyMemorandum'])
</script>

<template>
  <ViewIndex v-if="showIndexMemorandum" @detail="emit('detail')" @close-detail="emit('close-detail')"
    :showDetailMemorandum="showDetailMemorandum" @approv="emit('approv')" @reject="emit('reject')"
    @create="emit('create')" @historyMemorandum="emit('historyMemorandum')"
    :showHistoryMemorandum="showHistoryMemorandum" @edit="emit('edit')" />

  <ViewCreate v-if="showCreateMemorandum" @index="emit('index')" />

  <ViewEdit v-if="showEditMemorandum" @index="emit('index')" />
</template>