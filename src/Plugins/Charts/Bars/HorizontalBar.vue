<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Bar } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { CHART_COLORS } from "@/Plugins/Chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Fuente global
ChartJS.defaults.font.family = '"Twemoji Country Flags","Poppins",sans-serif';
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#3b3a59";

const props = defineProps({
    title: { type: [String, Boolean], default: false },
    labels: { type: Array, required: true },     // diagnósticos
    datasets: { type: Array, required: true },   // [{label, data, backgroundColor}]
    height: { type: [String, Number], default: 260 },
    stacked: { type: Boolean, default: false },
    showLegend: { type: Boolean, default: false },
    xStep: { type: Number, default: undefined },
    maxVisibleItems: { type: Number, default: 10 },     // desde fuera decides cuándo scrollear
    rowPx: { type: Number, default: 30 },               // px por barra (tuneable)
    maxScrollHeight: { type: Number, default: 320 },    // alto visible del área con scroll

    fontFamily: {
        type: String,
        default: '"Twemoji Country Flags","Poppins",sans-serif',
    },
    fontSize: { type: Number, default: 11 },

    // cuántos labels quieres mostrar sin cortar tanto
    maxLabelChars: { type: Number, default: 22 },
});

const wrapperRef = ref(null);
const heightPx = ref(0);

function measure() {
    if (!wrapperRef.value) return;
    const rect = wrapperRef.value.getBoundingClientRect();
    heightPx.value = Math.max(0, Math.floor(rect.height));
}

let ro;
onMounted(() => {
    measure();
    ro = new ResizeObserver(() => measure());
    if (wrapperRef.value) ro.observe(wrapperRef.value);
    window.addEventListener("resize", measure);
});
onBeforeUnmount(() => {
    if (ro && wrapperRef.value) ro.unobserve(wrapperRef.value);
    window.removeEventListener("resize", measure);
});

const xMax = computed(() => {
    const all = (props.datasets || []).flatMap(ds => (ds.data || []).map(n => Number(n) || 0));
    const maxVal = Math.max(0, ...all);

    // step (si no viene, usa 1)
    const step = Number(props.xStep) > 0 ? Number(props.xStep) : 1;

    // ✅ margen: mínimo 2 steps o 10% del max (lo que sea mayor)
    const extra = Math.max(step * 2, Math.ceil(maxVal * 0.12));

    const padded = maxVal + extra;
    return Math.ceil(padded / step) * step;
});

// Grosor dinámico por fila (depende del alto disponible)
const barThickness = computed(() => {
    const n = Math.max(1, props.labels.length);
    const h = Math.max(220, heightPx.value || 0);

    // espacio útil por categoría
    const effective = Math.max(160, h - 70);
    const perRow = effective / n;

    const raw = Math.floor(perRow * 0.6);
    return Math.min(26, Math.max(8, raw));
});

const shouldScroll = computed(() => (props.labels?.length || 0) > props.maxVisibleItems);

// alto total del canvas según cantidad de filas (cuando hay muchas)
const chartHeightPx = computed(() => {
    const n = Math.max(1, props.labels.length);
    const base = 120; // paddings/titulo/leyenda aprox dentro del chart
    return base + n * props.rowPx;
});

const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: ds.backgroundColor ?? CHART_COLORS,
        borderColor: ds.borderColor ?? CHART_COLORS,
        barThickness: barThickness.value,
        maxBarThickness: barThickness.value,
        borderRadius: ds.borderRadius ?? 8,
    })),
}));

function getTotal(chart) {
    const dss = chart?.data?.datasets || [];
    let total = 0;

    for (const ds of dss) {
        const arr = (ds.data || []).map(n => Number(n) || 0);
        total += arr.reduce((a, b) => a + b, 0);
    }
    return total;
}

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",

    font: { family: props.fontFamily, size: props.fontSize },

    plugins: {
        gaugeText: false,
        datalabels: {
            // ✅ muestra solo si hay valor y si el usuario quiere %
            display: (ctx) => {
                const v = Number(ctx.raw ?? 0);
                return props.showPercent && v >= props.minValueToShowLabel;
            },

            anchor: "end",
            align: "right",   // ✅ afuera a la derecha
            offset: 6,
            clamp: false,
            clip: false,

            font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            color: "#2c2b34",

            formatter: (value, ctx) => {
                const v = Number(value ?? 0);
                const total = getTotal(ctx.chart);
                if (!v || !total) return "";
                const pct = (v / total) * 100;
                return `${v} (${pct.toFixed(1)}%)`;
            },
        },
        legend: {
            display: props.showLegend,
            labels: { font: { family: props.fontFamily, size: props.fontSize, weight: "600" } },
        },
        title: {
            display: typeof props.title === "string" && props.title.trim().length > 0,
            text: typeof props.title === "string" ? props.title : "",
            font: { family: props.fontFamily, size: props.fontSize + 2, weight: "700" },
            color: "#2c2b34",
        },
        tooltip: {
            titleFont: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            bodyFont: { family: props.fontFamily, size: props.fontSize, weight: "500" },

            callbacks: {
                label: (ctx) => {
                    const v = Number(ctx.raw ?? 0);
                    const total = getTotal(ctx.chart);
                    const pct = total ? (v / total) * 100 : 0;
                    return `Cantidad: ${v} (${pct.toFixed(1)}%)`;
                },
            },
        },

    },

    layout: { padding: { left: 8, right: 12, top: 6, bottom: 6 } },

    scales: {
        y: {
            beginAtZero: true,
            stacked: props.stacked,
            grid: { display: false },
            ticks: {
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
                callback: (val, idx) => {
                    const label = props.labels?.[idx] ?? "";
                    if (label.length <= props.maxLabelChars) return label;
                    return label.slice(0, props.maxLabelChars - 1) + "…";
                },
            },
            grace: "12%",
        },
        x: {
            stacked: props.stacked,
            beginAtZero: true,
            max: xMax.value,     // ✅ evita que llegue al borde
            grace: "8%",         // ✅ colchón extra (por si cambia font/label)

            ticks: {
                stepSize: props.xStep,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
            grid: { color: "rgba(0,0,0,0.06)" },
        },
    },
}));
</script>

<template>
    <div ref="wrapperRef" class="chart-wrap">
        <div class="scroll-area" :class="{ 'scroll-area--on': shouldScroll }" :style="{
            maxHeight: shouldScroll ? `${maxScrollHeight}px` : 'none',
            height: shouldScroll ? `${maxScrollHeight}px` : (typeof height === 'number' ? `${height}px` : height),
        }">
            <div class="canvas-area" :style="{ height: shouldScroll ? `${chartHeightPx}px` : '100%' }">
                <Bar :data="chartData" :options="chartOptions" />
            </div>
        </div>
    </div>
</template>


<style scoped>
.chart-wrap {
    width: 100%;
    position: relative;
}

.chart-wrap {
    width: 100%;
    position: relative;
}

/* el que hace overflow */
.scroll-area {
    width: 100%;
    overflow-y: auto;
    /* si no hay scroll */
    padding-right: 6px;
    /* separa el thumb */
}

.scroll-area--on {
    overflow-y: auto;
}

/* contenedor del canvas */
.canvas-area {
    width: 100%;
}

/* Scrollbar “amigable” (Chrome/Edge) */
.scroll-area--on::-webkit-scrollbar {
    width: 8px;
}

.scroll-area--on::-webkit-scrollbar-thumb {
    background: rgba(91, 76, 208, 0.25);
    border-radius: 999px;
}

.scroll-area--on::-webkit-scrollbar-thumb:hover {
    background: rgba(91, 76, 208, 0.35);
}

.scroll-area--on::-webkit-scrollbar-track {
    background: transparent;
}

/* Firefox */
.scroll-area--on {
    scrollbar-width: thin;
    scrollbar-color: rgba(91, 76, 208, 0.25) transparent;
}
</style>
