<!-- src/components/ui/PanelTabs.vue -->
<template>
    <div class="pt">
        <nav v-if="tabs.length > 1" class="pt-nav" role="tablist" style="display: flex; justify-content: center;">
            <button v-for="t in tabs" :key="t.key" class="pt-tab" :class="{ active: t.key === current }" role="tab"
                :aria-selected="t.key === current" @click="current = t.key">
                {{ t.label }}
            </button>
        </nav>

        <keep-alive>
            <component :is="active.component" v-bind="active.props" />
        </keep-alive>
    </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'

const props = defineProps({
    tabs: { // [{ key, label, component, props }]
        type: Array,
        default: () => []
    },
    initial: { type: String, default: '' }
})

const current = ref('')
watchEffect(() => { current.value = props.initial || props.tabs?.[0]?.key || '' })

const active = computed(() => props.tabs.find(t => t.key === current.value) || {})
</script>

<style scoped>
.pt-nav {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.pt-tab {
    padding: 8px 10px;
    border: 0;
    color: #C394FF;
    background: transparent;
    cursor: pointer;
    font-weight: 600;
}

.pt-tab.active {
    color: #5B4CD0;
    border-bottom: 2px solid #5B4CD0;
}
</style>
