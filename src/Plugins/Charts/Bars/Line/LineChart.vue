<!-- LineChart.vue -->
<script setup>
import { CHART_COLORS } from "@/Plugins/Chartjs";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Line } from "vue-chartjs";

const props = defineProps({
    title: { type: [String, Boolean], default: "" }, // string o false
    labels: { type: Array, default: () => [] },
    datasets: { type: Array, default: () => [] }, // [{label,data,borderColor,backgroundColor,...}]
    height: { type: [String, Number], default: 260 },
    showLegend: { type: Boolean, default: true },

    // look & feel
    fontFamily: { type: String, default: '"Twemoji Country Flags","Poppins",sans-serif' },
    fontSize: { type: Number, default: 12 },

    // datalabels
    showDataLabels: { type: Boolean, default: true },
    dataLabelFormatter: { type: Function, default: (v) => v },
    dataLabelColor: { type: String, default: "#2c2b34" },

    // escala (opcional)
    yStep: { type: Number, default: undefined },
    beginAtZero: { type: Boolean, default: true },

    // línea
    tension: { type: Number, default: 0.35 }, // curvatura
    fill: { type: Boolean, default: false },
});

const wrapperRef = ref(null);
const widthPx = ref(0);

function measure() {
    if (!wrapperRef.value) return;
    widthPx.value = Math.max(0, Math.floor(wrapperRef.value.getBoundingClientRect().width));
}

let ro;
onMounted(() => {
    measure();
    ro = new ResizeObserver(measure);
    if (wrapperRef.value) ro.observe(wrapperRef.value);
    window.addEventListener("resize", measure);
});
onBeforeUnmount(() => {
    if (ro) ro.disconnect();
    window.removeEventListener("resize", measure);
});

const safeLabels = computed(() => (Array.isArray(props.labels) ? props.labels : []));
const safeDatasets = computed(() => (Array.isArray(props.datasets) ? props.datasets : []));

// Ajustes visuales según ancho
const lineWidth = computed(() => {
    const w = widthPx.value || 0;
    if (w < 360) return 2;
    if (w < 700) return 3;
    return 4;
});
const pointRadius = computed(() => {
    const w = widthPx.value || 0;
    if (w < 360) return 2;
    if (w < 700) return 3;
    return 4;
});

const chartData = computed(() => ({
    labels: safeLabels.value,
    datasets: safeDatasets.value.map((ds) => ({
        ...ds,
        backgroundColor: ds.backgroundColor ?? CHART_COLORS[4],
        borderColor: ds.borderColor ?? CHART_COLORS[4],
        type: "line",
        tension: ds.tension ?? props.tension,
        fill: ds.fill ?? props.fill,
        borderWidth: ds.borderWidth ?? lineWidth.value,
        pointRadius: ds.pointRadius ?? pointRadius.value,
        pointHoverRadius: ds.pointHoverRadius ?? pointRadius.value + 1,
        pointBorderWidth: ds.pointBorderWidth ?? 0,
    })),
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,

    font: { family: props.fontFamily, size: props.fontSize },

    plugins: {
        gaugeText: false,
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
            enabled: true,
            titleFont: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            bodyFont: { family: props.fontFamily, size: props.fontSize, weight: "500" },
        },

        // DATALABELS (valores sobre los puntos)
        datalabels: props.showDataLabels
            ? {
                display: true,
                align: "top",
                anchor: "end",
                offset: 4,
                color: props.dataLabelColor,
                font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
                formatter: props.dataLabelFormatter,
                clamp: true,
            }
            : { display: false },
    },

    layout: { padding: { left: 8, right: 8, top: 8, bottom: 0 } },

    scales: {
        x: {
            grid: { display: false },
            ticks: {
                autoSkip: true,
                maxRotation: 45,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
        },
        y: {
            beginAtZero: props.beginAtZero,
            ticks: {
                stepSize: props.yStep,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
            grid: { color: "rgba(0,0,0,0.06)" },
            grace: "12%",
        },
    },
}));
</script>

<template>
    <div ref="wrapperRef" class="chart-wrap" :style="{ height: typeof height === 'number' ? `${height}px` : height }">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<style scoped>
.chart-wrap {
    width: 100%;
    position: relative;
}
</style>
