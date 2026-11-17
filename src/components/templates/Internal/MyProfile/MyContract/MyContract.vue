<script setup>
import ViewIndex from "./Index.vue"

const props = defineProps({
    welfareEdit: Boolean,
    modelContract: Object,
    policesContract: Array,
    findContract: Boolean,
    addendums: Array,
    contractPreview: Object,
    showDetailsPolice: Boolean,
    modelPolicy: Object
})

const emit = defineEmits(['welfareStatusEdting', 'submitwelfareUpdate', 'submitContractPreview', 'detail', 'close-detail', 'submitPolicyFind']);
</script>

<template>
    <ViewIndex @welfareStatusEdting="$emit('welfareStatusEdting')" :welfareEdit="props.welfareEdit"
        @submitwelfareUpdate="$emit('submitwelfareUpdate')" :findContract="props.findContract"
        :modelContract="props.modelContract" :policesContract="props.policesContract" :addendums="props.addendums"
        @submitContractPreview="$emit('submitContractPreview')" :contractPreview="props.contractPreview"
        :showDetailsPolice="showDetailsPolice" @close-detail="$emit('close-detail')" @detail="$emit('detail')"
        @submitPolicyFind="$emit('submitPolicyFind', $event)" :modelPolicy="props.modelPolicy" />
</template>