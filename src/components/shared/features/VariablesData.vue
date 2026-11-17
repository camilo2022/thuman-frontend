<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
    /** true = muestra skeleton, false = muestra contenido */
    getData: { type: Boolean, default: false },

    /** Estructura:
     * [
     *  { label: "Tab 1", groups: [{ title:"...", fields:[{label:"...", value:"{{x}}"}] }] }
     * ]
     */
    variables: { type: Array, default: () => [] },
});

const emit = defineEmits(["select"]); // devuelve el field clickeado

const activeTab = ref(0);

// si cambian variables, asegurar tab válida
watch(
    () => props.variables,
    (v) => {
        if (!v?.length) activeTab.value = 0;
        else if (activeTab.value > v.length - 1) activeTab.value = 0;
    },
    { deep: true }
);

const hasVars = computed(() => !!props.variables?.length);

const handleVariableClick = (field) => {
    emit("select", field);
};
</script>

<template>
    <!-- LOADER -->
    <template v-if="props.getData">
        <div>
            <div class="variables-tabs">
                <div class="skeleton-block skeleton-tab"></div>
                <div class="skeleton-block skeleton-tab"></div>
                <div class="skeleton-block skeleton-tab"></div>
            </div>

            <div class="skeleton-group" v-for="n in 3" :key="n">
                <div class="skeleton-group-title">
                    <div class="skeleton-block skeleton-dot"></div>
                    <div class="skeleton-block skeleton-title"></div>
                </div>

                <div class="skeleton-chips">
                    <div class="skeleton-block skeleton-chip" v-for="c in 5" :key="c"></div>
                </div>
            </div>
        </div>
    </template>

    <!-- CONTENIDO -->
    <template v-else>

        <template v-if="hasVars">
            <div class="nav-tabs" :style="{ '--active': activeTab, '--count': props.variables.length }" role="tablist">
                <button v-for="(tab, i) in props.variables" :key="i" class="tab" :class="{ active: activeTab === i }"
                    @click="activeTab = i" role="tab" :aria-selected="activeTab === i">
                    {{ tab.label }}
                </button>
            </div>

            <div class="info-panel">
                <div class="info-group" v-for="(group, gi) in props.variables[activeTab].groups" :key="gi">
                    <div class="info-header">
                        <span class="info-dot"></span>
                        <span class="info-title">{{ group.title }}</span>
                    </div>

                    <div class="info-tags">
                        <button v-for="(field, fi) in group.fields" :key="fi" class="info-chip" type="button"
                            @click="handleVariableClick(field)">
                            {{ field.label }}
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="bg-yellow variables-empty-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                    viewBox="0 0 256 256">
                    <path
                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Z" />
                </svg>

                <div>
                    <p class="variables-empty-title">No hay variables disponibles.</p>
                    <p class="variables-empty-sub">
                        Esta plantilla no tiene variables asociadas al tipo de documento seleccionado.
                    </p>
                </div>
            </div>
        </template>
    </template>
</template>

<style scoped>
/* ===== Encabezado ===== */
.sub-titulo {
    font-size: 20px;
    font-weight: 600 !important;
    color: #5b4cd0;
    margin: 0 0 12px;
}

/* ===== Tabs (reusando tu estilo) ===== */
.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--count), minmax(120px, 1fr));
    gap: 0;
    margin-top: 6px;
    padding-top: 6px;
    border-bottom: 1px solid rgba(91, 76, 208, 0.25);
    overflow-x: auto;
    scrollbar-width: none;
}

.nav-tabs::-webkit-scrollbar {
    display: none;
}

.tab {
    background: transparent;
    border: 0;
    padding: 10px 0 8px;
    font-weight: 600;
    cursor: pointer;
    color: #9a86ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    white-space: nowrap;
}

.tab.active {
    color: #5b4cd0;
    background-color: #f7f5ff;
    border-bottom: 1px solid #5b4cd0;
}

/* ===== Panel ===== */
.info-panel {
    margin-top: 12px;
}

/* Grupo */
.info-group {
    padding: 10px 0;
    border-bottom: 1px solid #efeaff;
}

.info-group:last-child {
    border-bottom: 0;
}

.info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.info-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #5b4cd0;
    box-shadow: 0 0 0 4px rgba(91, 76, 208, 0.15);
}

.info-title {
    font-size: 14px;
    font-weight: 700;
    color: #5B4CD0;
}

/* Chips */
.info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.info-chip {
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    border: 1px solid #5b4cd0;
    background: #f4eeff;
    color: #5b4cd0;
    cursor: pointer;
    line-height: 1.2;
    white-space: nowrap;
}

.info-chip:hover {
    background: #f5f2ff;
}

/* ===== Empty state ===== */
.variables-empty-box {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 12px;
    border-radius: 10px;
}

.variables-empty-title {
    margin: 0;
    font-weight: 700;
}

.variables-empty-sub {
    margin: 2px 0 0;
    font-size: 12px;
    opacity: .8;
}

/* ===== Skeleton ===== */
.variables-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
}

.skeleton-group {
    padding: 12px 0;
    border-bottom: 1px solid #efeaff;
}

.skeleton-group-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.skeleton-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

.skeleton-tab {
    width: 90px;
    height: 28px;
}

.skeleton-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
}

.skeleton-title {
    width: 140px;
    height: 12px;
}

.skeleton-chip {
    width: 110px;
    height: 26px;
    border-radius: 12px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}
</style>
