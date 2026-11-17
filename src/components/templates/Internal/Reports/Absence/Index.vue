<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import DonutChart from "../../../../../Plugins/Charts/DonutChart.vue";
import BarChart from "@/Plugins/Charts/Bars/BarChart.vue";
import HorizontalBar from "@/Plugins/Charts/Bars/HorizontalBar.vue";
import EmpleoyeesBar from "@/Plugins/Charts/Bars/EmpleoyeesBar.vue";

/* ---------------- KPIs + datos (igual que tu ejemplo) ---------------- */
const kpis = [
    { title: "Total de permisos", value: 78, percent: null, variant: "purple", icon: "tag" },
    { title: "Promedio duración de permisos", value: 56, percent: null, variant: "purple", icon: "users" },
];
const backGroundColors = ref([
    "#DDD6FE",
    "#D8B4FE",
    "#CFA9F3",
    "#C084FC",
    "#B794F4",
    "#A78BFA",
    "#9F7AEA",
    "#8B5CF6",
]);

const sedeLabels = ["Permiso medico", "Permiso personal", "Permiso laboral", "Permiso medico", "Permiso personal", "Permiso laboral", "Permiso medico", "Permiso personal", "Permiso laboral", "Permiso medico", "Permiso personal", "Permiso laboral", "Permiso medico", "Permiso personal", "Permiso laboral", "Permiso medico", "Permiso personal", "Permiso laboral", "Permiso medico", "Permiso personal", "Permiso laboral"];
const sedeDatasets = [
    { label: "Cantidad", data: [124, 24, 7, 124, 24, 7, 124, 24, 7, 124, 24, 7, 124, 24, 7, 124, 24, 7, 124, 24, 7], borderRadius: 8 },
];

const cargoLabels = [
    "CONCILIADOR",
    "APRENDIZ SENA",
    "ANALISTA A3",
    "AGENTE DE COBRO",
    "ANALISTA A1",
    "ASISTENTE DE AJUSTA...",
    "COORDINADOR DE CU...",
    "SUPLENTE DE CUENTA",
    "TÉCNICO SENIOR",
];
const cargoDatasets = [
    { label: "Cantidad", data: [135, 3, 2, 1, 1, 1, 1, 1, 1], backgroundColor: backGroundColors.value, borderRadius: 8 },
];


/* ------------------- CALCS (ResizeObserver por card) ------------------- */
const cardRefs = {
    employees: ref(null),
    pagos: ref(null),
    genero: ref(null),
    rango: ref(null),
    edad: ref(null),
    sede: ref(null),
    tipos: ref(null),
    diagnostico: ref(null),
    cargo: ref(null),
    recupero: ref(null),
};

const dims = ref({}); // { key: { h, headH } }

let ros = [];
function observeCard(key, el) {
    if (!el) return;
    const head = el.querySelector(".card__head");
    const ro = new ResizeObserver(() => {
        const h = el.getBoundingClientRect().height || 0;
        const headH = head ? head.getBoundingClientRect().height : 0;
        dims.value = { ...dims.value, [key]: { h, headH } };
    });
    ro.observe(el);
    ros.push(ro);
}

onMounted(() => {
    Object.entries(cardRefs).forEach(([key, r]) => observeCard(key, r.value));
});

onBeforeUnmount(() => {
    ros.forEach((ro) => ro.disconnect());
    ros = [];
});

/**
 * height útil: altoCard - altoHeader - paddings - (extra por note si aplica)
 * Ajusta estos números si cambias padding.
 */
function calcChartHeight(key, opts = {}) {
    const d = dims.value[key];
    if (!d) return opts.fallback ?? 220;

    const paddingTopBottom = 14 + 14; // padding card
    const gapHeadBody = 10; // margin-bottom del head
    const bodyGap = 12; // gap interno body
    const extra = opts.extra ?? 0;

    const raw = d.h - d.headH - paddingTopBottom - gapHeadBody - bodyGap - extra;
    const min = opts.min ?? 160;
    const max = opts.max ?? 320;

    return Math.max(min, Math.min(max, Math.floor(raw)));
}

//permisos por empleado
const empleadosIncap = [
    { name: "Andrés Rodríguez", value: 12 },
    { name: "Maria Lopez", value: 5 },
    { name: "Carlos Garcia", value: 7 },
    { name: "Daniela Torres", value: 6 },
    { name: "Fernanda Gómez", value: 6 },
    { name: "Maria Lopez", value: 5 },
    { name: "Carlos Garcia", value: 7 },
    { name: "Daniela Torres", value: 6 },
    { name: "Fernanda Gómez", value: 6 },
    { name: "Maria Lopez", value: 5 },
    { name: "Carlos Garcia", value: 7 },
    { name: "Daniela Torres", value: 30 },
];


function calcTallBarHeight(key, count, opts = {}) {
    const base = calcChartHeight(key, opts); // tu altura “normal”
    const n = Number(count) || 0;

    // ✅ hasta 10 barras usa normal; después crece
    const extraBars = Math.max(0, n - 10);

    // ✅ px extra por cada barra adicional (ajústalo: 18-28 suele verse bien)
    const pxPerBar = 30;

    const grown = base + extraBars * pxPerBar;

    const min = opts.min ?? 220;
    const max = opts.max ?? 900;

    return Math.max(min, Math.min(max, Math.floor(grown)));
}

</script>

<template>
    <div class="breadcrumb">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
            <path
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reporte</span>
        <span>|</span>
        <span class="active">Permisos</span>
    </div>
    <div class="container-data">
        <div class="main-container">
            <!-- Top bar -->
            <div class="topbar">
                <h2 class="page-title">Permisos</h2>

                <div class="filtros">

                    <SearchSelect name="estado" :options="[]" placeholder="Por empresa" />

                    <SelectCheckMultiple :options="[]" placeholder="Por años" />

                    <SelectCheckMultiple :options="[]" placeholder="Por meses" />

                    <button class="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="content">
                <!-- KPIs en una fila completa -->
                <div class="kpi-row">
                    <div v-for="(k, idx) in kpis" :key="`${k.title}-${idx}`" class="kpi" :class="`kpi--${k.variant}`">
                        <div class="kpi__icon">
                            <svg v-if="k.icon === 'tag'" viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor"
                                    d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0l-8.18-8.18A2 2 0 012 11V4a2 2 0 012-2h7a2 2 0 011.41.59l8.18 8.18a2 2 0 010 2.83zM7.5 8A1.5 1.5 0 109 6.5 1.5 1.5 0 007.5 8z" />
                            </svg>

                            <svg v-else-if="k.icon === 'users'" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M125.18,156.94a64,64,0,1,0-82.36,0,100.23,100.23,0,0,0-39.49,32,12,12,0,0,0,19.35,14.2,76,76,0,0,1,122.64,0,12,12,0,0,0,19.36-14.2A100.33,100.33,0,0,0,125.18,156.94ZM44,108a40,40,0,1,1,40,40A40,40,0,0,1,44,108Zm206.1,97.67a12,12,0,0,1-16.78-2.57A76.31,76.31,0,0,0,172,172a12,12,0,0,1,0-24,40,40,0,1,0-10.3-78.67,12,12,0,1,1-6.16-23.19,64,64,0,0,1,57.64,110.8,100.23,100.23,0,0,1,39.49,32A12,12,0,0,1,250.1,205.67Z">
                                </path>
                            </svg>

                            <svg v-else-if="k.icon === 'days'" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm92-76a16,16,0,1,1-16-16A16,16,0,0,1,144,128Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,128ZM96,176a16,16,0,1,1-16-16A16,16,0,0,1,96,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,144,176Zm48,0a16,16,0,1,1-16-16A16,16,0,0,1,192,176Z">
                                </path>
                            </svg>

                            <svg v-else-if="k.icon === 'totalDays'" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M204,75.64V40a20,20,0,0,0-20-20H72A20,20,0,0,0,52,40V76a20.1,20.1,0,0,0,8,16l48,36L60,164a20.1,20.1,0,0,0-8,16v36a20,20,0,0,0,20,20H184a20,20,0,0,0,20-20V180.36a20.13,20.13,0,0,0-7.94-16L147.9,128l48.16-36.4A20.13,20.13,0,0,0,204,75.64ZM180,44V72H76V44Zm-52,69L105.33,96h45.1Zm52,99H76V182l40-30v16a12,12,0,0,0,24,0V152.11l40,30.24Z">
                                </path>
                            </svg>

                            <svg v-else-if="k.icon === 'eps'" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z">
                                </path>
                            </svg>

                            <svg v-else-if="k.icon === 'enterprise'" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="" viewBox="0 0 256 256">
                                <path
                                    d="M240,204H228V96a20,20,0,0,0-20-20H172V32a20,20,0,0,0-28.45-18.12l-104,48.54A20.06,20.06,0,0,0,28,80.55V204H16a12,12,0,0,0,0,24H240a12,12,0,0,0,0-24ZM204,100V204H172V100ZM52,83.09,148,38.3V204H52ZM132,112v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm-40,0v12a12,12,0,0,1-24,0V112a12,12,0,0,1,24,0Zm0,52v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Zm40,0v12a12,12,0,0,1-24,0V164a12,12,0,0,1,24,0Z">
                                </path>
                            </svg>

                            <svg v-else-if="k.icon === 'payment'" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z">
                                </path>
                            </svg>

                            <svg v-else-if="k.icon === 'pending'" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path
                                    d="M236,137A108.13,108.13,0,1,1,119,20,12,12,0,0,1,121,44,84.12,84.12,0,1,0,212,135,12,12,0,1,1,236,137ZM116,76v52a12,12,0,0,0,12,12h52a12,12,0,0,0,0-24H140V76a12,12,0,0,0-24,0Zm92,20a16,16,0,1,0-16-16A16,16,0,0,0,208,96ZM176,64a16,16,0,1,0-16-16A16,16,0,0,0,176,64Z">
                                </path>
                            </svg>
                        </div>

                        <div class="kpi__meta">
                            <div class="kpi__title">{{ k.title }}</div>
                            <div style="display: flex; align-items: center;">
                                <div class="kpi__value">{{ k.value }} </div><template v-if="k.percent">
                                    ({{ k.percent }}%)
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard -->
                <div class="grid-dashboard">

                    <!-- Donut género -->
                    <div ref="cardRefs.genero" class="card">
                        <div class="card__head centered">
                            <h3 class="card__title">Permisos por género</h3>
                        </div>

                        <div class="card__body">
                            <DonutChart :title="false" :labels="['Masculino', 'Femenino']" :values="[38, 122]"
                                :colors="backGroundColors" cutout="45%" legendPosition="bottom"
                                :height="calcChartHeight('genero', { min: 170, max: 260, fallback: 280 })" />
                        </div>
                    </div>

                    <!-- Barras sede (span-2) -->
                    <div ref="cardRefs.sede" class="card span-2">
                        <div class="card__head centered">
                            <h3 class="card__title">Cantidad de permisos por tipo</h3>
                        </div>
                        <div class="card__body">
                            <HorizontalBar :title="false" :labels="sedeLabels" :datasets="sedeDatasets"
                                :maxVisibleItems="10" :maxScrollHeight="320" :rowPx="15" :height="260" :stacked="false"
                                :showLegend="false" :xStep="10" />
                        </div>
                    </div>

                    <!-- Donut género -->
                    <div ref="cardRefs.genero" class="card">
                        <div class="card__head centered">
                            <h3 class="card__title">Cantidad de permisos por área</h3>
                        </div>

                        <div class="card__body">
                            <DonutChart :title="false" :labels="['Administrativa', 'Operativo']" :values="[38, 122]"
                                :colors="backGroundColors" cutout="45%" legendPosition="bottom"
                                :height="calcChartHeight('genero', { min: 170, max: 260, fallback: 220 })" />
                        </div>
                    </div>

                    <!-- Cargo (span-2) -->
                    <div ref="cardRefs.cargo" class="card span-3">
                        <div class="card__head centered">
                            <h3 class="card__title">Cantidad de permisos por cargo</h3>
                        </div>
                        <div class="card__body">
                            <HorizontalBar :title="false" :labels="cargoLabels" :datasets="cargoDatasets"
                                :height="calcChartHeight('cargo', { min: 220, max: 340, fallback: 280 })"
                                :stacked="false" :showLegend="false" :yStep="10" />
                        </div>
                    </div>

                    <div ref="cardRefs.sede" class="card">
                        <div class="card__head centered">
                            <h3 class="card__title">Cantidad de permisos por persona</h3>
                        </div>
                        <div class="card__body">
                            <EmpleoyeesBar :items="empleadosIncap" />
                        </div>
                    </div>
                </div>
                <div class="form-buttons">
                    <button class="btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                            fill="#000000" viewBox="0 0 256 256">
                            <path
                                d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z">
                            </path>
                        </svg>Descargar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    background: #f5f6fb;
    min-height: 100vh;
    padding: 18px 18px 28px;
    color: #232237;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

.page-title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
}

/* topbar */
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
}

.filters {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.filter {
    border: 1px solid rgba(91, 76, 208, .12);
    background: rgba(255, 255, 255, .8);
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 13px;
    color: #3b3a59;
    cursor: pointer;
}

.icon-btn {
    border: 1px solid rgba(91, 76, 208, .12);
    background: rgba(255, 255, 255, .9);
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: #5b4cd0;
    cursor: pointer;
}

.content {
    display: block;
}

/* KPIs: una fila “real” (auto-fit) */
.kpi-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 14px;
    margin-bottom: 14px;
}

.kpi {
    border-radius: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 10px 22px rgba(36, 35, 70, .06);
    border: 1px solid rgba(255, 255, 255, .6);
    overflow: hidden;
    position: relative;
    min-height: 78px;
}

.kpi::after {
    content: "";
    position: absolute;
    inset: -40% -40% auto auto;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(255, 255, 255, .55), transparent 60%);
    transform: rotate(20deg);
    pointer-events: none;
}

.kpi__icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .25);
}

.kpi__title {
    font-size: 13px;
    font-weight: 600;
    opacity: .95;
}

.kpi__value {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.1;
}


/* variants */
.kpi--purple {
    background: linear-gradient(90deg, #7a6bf1 0%, #9a8cff 100%);
    color: #fff;
}

.kpi--purple .kpi__icon {
    background: rgba(255, 255, 255, .22);
}

.kpi--green {
    background: linear-gradient(90deg, #55c88b 0%, #84ddb0 100%);
    color: #fff;
}

.kpi--green .kpi__icon {
    background: rgba(255, 255, 255, .22);
}

.kpi--yellow {
    background: linear-gradient(90deg, #f3c247 0%, #ffe08a 100%);
    color: #3a2d05;
}

.kpi--yellow .kpi__icon {
    background: rgba(255, 255, 255, .35);
    color: #3a2d05;
}

/* GRID dashboard */
.grid-dashboard {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    align-items: stretch;

    grid-auto-rows: minmax(320px, auto);
    /* ✅ filas flexibles */
}


.span-2 {
    grid-column: span 2;
}

.span-3 {
    grid-column: span 3;
}

/* Cards */
.card {
    background: rgba(255, 255, 255, .92);
    border-radius: 16px;
    padding: 14px;
    border: 1px solid rgba(91, 76, 208, .08);
    box-shadow: 0 10px 24px rgba(36, 35, 70, .06);
    display: flex;
    flex-direction: column;
    min-height: 320px;
    /* base, ya el chart se calcula */
    min-width: 0;
    height: 100%;
}

.card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    flex: 0 0 auto;
}

.card__head.centered {
    justify-content: center;
}

.card__title {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #2b2a44;
}

.card__body {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
}

/* Note */
.note {
    margin-top: auto;
    background: rgba(245, 246, 251, .9);
    border: 1px solid rgba(91, 76, 208, .08);
    border-radius: 14px;
    padding: 12px;
}

.note__title {
    font-weight: 800;
    color: #2b2a44;
    margin-bottom: 4px;
}

.note__sub {
    color: #7b7aa7;
    font-size: 13px;
}

/* Empleados scroll (sin maxItems) */
.card.employees {
    min-height: 320px;
}

.employees-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding-right: 6px;
}

/* Responsive */
@media (max-width: 1200px) {
    .grid-dashboard {
        grid-template-columns: repeat(2, 1fr);
    }

    .span-2 {
        grid-column: auto;
    }
}

@media (max-width: 700px) {
    .grid-dashboard {
        grid-template-columns: 1fr;
    }
}

.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
}

/* Normalizamos alto/espaciado de todos los controles */
.filtros>* {
    height: 40px;
    /* clave para que todo se vea alineado */
}

@media (max-width: 1024px) {
    .topbar {
        flex-direction: column;
        align-items: flex-start;
    }

    .page-title {
        margin-bottom: 8px;
    }

    .filtros {
        width: 100%;
    }
}

/* =========================
   GRID + CARDS (base)
========================= */
.grid-dashboard {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    align-items: stretch;
    grid-auto-rows: minmax(320px, auto);
}

.card__title {
    /* evita que títulos largos descuadren */
    text-align: center;
    line-height: 1.2;
    word-break: break-word;
}

/* =========================
   >= 1200px (desktop grande)
========================= */
@media (min-width: 1326px) {
    .span-2 {
        grid-column: span 2;
    }

    .span-3 {
        grid-column: span 3;
    }
}

/* =========================
   1024px - 1199px (laptop / tablet grande)
   3 columnas se ve más balanceado
========================= */
@media (max-width: 1326px) {
    .grid-dashboard {
        grid-template-columns: repeat(3, 1fr);
    }

    /* cards grandes se vuelven 2 columnas para no aplastar a las demás */
    .span-3 {
        grid-column: span 2;
    }

    .span-2 {
        grid-column: span 2;
    }
}

/* =========================
   768px - 1023px (tablet)
   2 columnas y sin spans raros
========================= */
@media (max-width: 1023px) {
    .page {
        padding: 14px;
    }

    .grid-dashboard {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        grid-auto-rows: minmax(300px, auto);
    }

    /* en tablet, todos los spans se neutralizan */
    .span-2,
    .span-3 {
        grid-column: auto;
    }

    .card {
        padding: 12px;
    }

    .card__title {
        font-size: 14px;
    }

    /* filtros debajo del título (ya lo haces), ahora que ocupen todo */
    .topbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .filtros {
        width: 100%;
        gap: 10px;
    }

    /* si tus componentes permiten width:100% esto ayuda */
    .filtros>* {
        flex: 1 1 220px;
        min-width: 220px;
    }

    .btn-primary {
        flex: 0 0 44px;
        height: 44px;
    }
}

/* =========================
   <= 700px (móvil)
   1 columna, menos padding, todo full width
========================= */
@media (max-width: 700px) {
    .page {
        padding: 12px;
    }

    .kpi-row {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .grid-dashboard {
        grid-template-columns: 1fr;
        gap: 10px;
        grid-auto-rows: minmax(280px, auto);
    }

    .card {
        padding: 12px;
        border-radius: 14px;
    }

    .card__head {
        margin-bottom: 8px;
    }

    .card__title {
        font-size: 14px;
        font-weight: 800;
    }

    /* filtros en columna (más usable) */
    .filtros {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .filtros>* {
        width: 100%;
        min-width: 0;
        height: 44px;
        /* mejor touch */
    }

    .btn-primary {
        width: 100%;
        height: 46px;
        border-radius: 12px;
        display: grid;
        place-items: center;
    }

    /* empleados: que no se coma toda la pantalla */
    .employees-scroll {
        max-height: 360px;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
}
</style>
