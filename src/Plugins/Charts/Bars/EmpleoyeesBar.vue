<script setup>
import { computed } from "vue";

const props = defineProps({
    items: { type: Array, required: true }, // [{name, value}]
    maxItems: { type: Number, default: 10 }, // limita lista
    maxValue: { type: Number, default: null }, // opcional, si quieres fijar el máximo
});

const shown = computed(() => props.items); // sin slice

const computedMax = computed(() => {
    if (props.maxValue != null) return props.maxValue;
    return Math.max(1, ...props.items.map((i) => Number(i.value) || 0));
});

function pct(v) {
    const val = Number(v) || 0;
    return Math.round((val / computedMax.value) * 100);
}
</script>

<template>
    <div class="list scroll">
        <div v-for="(it, idx) in shown" :key="idx" class="row">
            <span class="name text" :title="it.name">{{ it.name }}</span>

            <div class="track" aria-hidden="true">
                <i class="fill" :style="{ width: pct(it.value) + '%' }"></i>
            </div>

            <strong class="val">{{ it.value }}</strong>
        </div>
    </div>
</template>


<style scoped>
.list {
    display: flex;
    flex-direction: column;
}

.row {
    display: grid;
    grid-template-columns: 1fr 140px 28px;
    align-items: center;
    font-size: 13px;
    color: #3b3a59;
}

.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.track {
    height: 10px;
    background: rgba(91, 76, 208, 0.12);
    border-radius: 999px;
    overflow: hidden;
}

.fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #6d5ff6, #a193ff);
}

.val {
    text-align: right;
    font-weight: 800;
    color: #2b2a44;
}

.list {
    display: flex;
    flex-direction: column;
}

/* ✅ scroll cuando se desborde */
.scroll {
    max-height: 320px;
    /* ajusta a tu diseño */
    overflow-y: auto;
    padding-right: 6px;
    /* para que no tape el scrollbar */
}

/* scrollbar suave */
.scroll::-webkit-scrollbar {
    width: 8px;
}

.scroll::-webkit-scrollbar-thumb {
    background: rgba(91, 76, 208, 0.25);
    border-radius: 999px;
}

.scroll::-webkit-scrollbar-track {
    background: transparent;
}
</style>
