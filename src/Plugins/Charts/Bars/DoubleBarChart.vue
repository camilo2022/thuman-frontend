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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CHART_COLORS } from "@/Plugins/Chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

// Fuente global
ChartJS.defaults.font.family = '"Twemoji Country Flags","Poppins",sans-serif';
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#3b3a59";

const props = defineProps({
    title: { type: [String, Boolean], default: false },
    labels: { type: Array, required: true },
    datasets: { type: Array, required: true }, // ✅ 2 datasets: A y B

    height: { type: [String, Number], default: 260 },
    stacked: { type: Boolean, default: false },

    showLegend: { type: Boolean, default: true },
    showDataLabels: { type: Boolean, default: true },

    // eje numérico
    xStep: { type: Number, default: undefined },

    // scroll
    maxVisibleItems: { type: Number, default: 7 },
    rowPx: { type: Number, default: 34 },
    maxScrollHeight: { type: Number, default: 320 },

    fontFamily: { type: String, default: '"Twemoji Country Flags","Poppins",sans-serif' },
    fontSize: { type: Number, default: 10 },

    // labels y ticks
    maxLabelChars: { type: Number, default: 22 },

    // ✅ spacing (separación)
    categoryPercentage: { type: Number, default: 0.60 },
    barPercentage: { type: Number, default: 0.85 },
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
    ro = new ResizeObserver(measure);
    if (wrapperRef.value) ro.observe(wrapperRef.value);
    window.addEventListener("resize", measure);
});
onBeforeUnmount(() => {
    if (ro && wrapperRef.value) ro.unobserve(wrapperRef.value);
    window.removeEventListener("resize", measure);
});

function formatCompact(n) {
    const v = Number(n ?? 0);
    const abs = Math.abs(v);
    if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (abs >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    return String(Math.round(v));
}

const xMax = computed(() => {
    const all = (props.datasets || []).flatMap(ds => (ds.data || []).map(n => Number(n) || 0));
    const maxVal = Math.max(0, ...all);
    const step = Number(props.xStep) > 0 ? Number(props.xStep) : 1;
    const extra = Math.max(step * 3, Math.ceil(maxVal * 0.15));
    const padded = maxVal + extra;
    return Math.ceil(padded / step) * step;
});

// ✅ Grosor por fila (2 barras => más delgado)
const barThickness = computed(() => {
    const n = Math.max(1, props.labels.length);
    const h = Math.max(220, heightPx.value || 0);
    const effective = Math.max(160, h - 70);
    const perRow = effective / n;

    // 2 barras por fila
    const raw = Math.floor(perRow * 0.45);
    return Math.min(34, Math.max(12, raw));
});

const shouldScroll = computed(() => (props.labels?.length || 0) > props.maxVisibleItems);

const chartHeightPx = computed(() => {
    const n = Math.max(1, props.labels.length);
    const base = 10;
    return base + n * props.rowPx;
});

const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.datasets.map((ds, i) => ({
        ...ds,

        // ✅ color por datasetIndex
        backgroundColor: ds.backgroundColor ?? CHART_COLORS[i % CHART_COLORS.length],
        borderColor: ds.borderColor ?? CHART_COLORS[i % CHART_COLORS.length],

        barThickness: barThickness.value,
        maxBarThickness: barThickness.value,
        borderRadius: ds.borderRadius ?? 8,

        categoryPercentage: props.categoryPercentage,
        barPercentage: props.barPercentage,
    })),
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,

    // ✅ Horizontal
    indexAxis: "y",

    layout: { padding: { left: 8, right: 28, top: 6, bottom: 6 } },

    scales: {
        y: {
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
        },
        x: {
            stacked: props.stacked,
            beginAtZero: true,
            max: xMax.value,
            ticks: {
                stepSize: props.xStep,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
                callback: (v) => formatCompact(v),
            },
            grid: { color: "rgba(0,0,0,0.06)" },
        },
    },

    plugins: {
        gaugeText: false,
        legend: {
            display: props.showLegend,
            position: "top",
            labels: {
                font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
                boxWidth: 10,
                boxHeight: 10,
            },
        },

        title: {
            display: typeof props.title === "string" && props.title.trim().length > 0,
            text: typeof props.title === "string" ? props.title : "",
            font: { family: props.fontFamily, size: props.fontSize + 2, weight: "800" },
            color: "#2c2b34",
            padding: { bottom: 6 },
        },

        tooltip: {
            titleFont: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            bodyFont: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            callbacks: {
                label: (ctx) => {
                    const v = Number(ctx.raw ?? 0);
                    return `${ctx.dataset.label || "Dato"}: ${v}`;
                },
            },
        },

        // ✅ Datalabels sin colisiones (A a un lado, B al otro)
        datalabels: {
            display: props.showDataLabels,
            anchor: "end",
            offset: 6,
            clamp: true,
            clip: false,
            font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            color: "#2c2b34",
            formatter: (value) => {
                const v = Number(value ?? 0);
                return Number.isFinite(v) ? formatCompact(v) : "";
            },
        },
    },
}));
</script>

<template>
    <div ref="wrapperRef" class="chart-wrap">
        <div class="scroll-area" :class="{ 'scroll-area--on': shouldScroll }" :style="{
            maxHeight: shouldScroll ? `${maxScrollHeight}px` : 'none',
            height: shouldScroll
                ? `${maxScrollHeight}px`
                : (typeof height === 'number' ? `${height}px` : height),
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

/* scroll */
.scroll-area {
    width: 100%;
    overflow-y: auto;
    padding-right: 6px;
}

.scroll-area--on {
    overflow-y: auto;
}

.canvas-area {
    width: 100%;
}

/* scrollbar */
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

.scroll-area--on {
    scrollbar-width: thin;
    scrollbar-color: rgba(91, 76, 208, 0.25) transparent;
}
</style>
