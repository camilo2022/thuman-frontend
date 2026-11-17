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

// ✅ Fuente global (afecta todos los charts)
ChartJS.defaults.font.family =
    '"Twemoji Country Flags","Poppins",sans-serif';
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#3b3a59";

const props = defineProps({
    title: { type: [String, Boolean], default: "" }, // ahora soporta false
    labels: { type: Array, required: true },
    datasets: { type: Array, required: true },
    height: { type: [String, Number], default: 260 },
    stacked: { type: Boolean, default: false },
    showLegend: { type: Boolean, default: true },
    yStep: { type: Number, default: 1 },

    // ✅ opcional (si quieres control por chart)
    fontFamily: {
        type: String,
        default: '"Twemoji Country Flags","Poppins",sans-serif',
    },
    fontSize: { type: Number, default: 12 },
});

const wrapperRef = ref(null);
const widthPx = ref(0);

function measure() {
    if (!wrapperRef.value) return;
    const rect = wrapperRef.value.getBoundingClientRect();
    widthPx.value = Math.max(0, Math.floor(rect.width));
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

const barThickness = computed(() => {
    const n = Math.max(1, props.labels.length);
    const w = Math.max(320, widthPx.value || 0);
    const effective = Math.max(200, w - 90);
    const perCategory = effective / n;
    const raw = Math.floor(perCategory * 0.55);
    return Math.min(42, Math.max(6, raw));
});

function splitParen(label) {
    // "Millennials (28-43 años en 2024)" -> ["Millennials", "(28-43 años en 2024)"]
    const s = String(label ?? "");
    const i = s.indexOf(" (");
    if (i === -1) return s;
    return [s.slice(0, i), s.slice(i + 1)]; // quita el espacio antes del "("
}

function wrapLabel(label, maxChars = 14) {
    const words = String(label ?? "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (test.length > maxChars) {
            if (line) lines.push(line);
            line = w;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

const yMax = computed(() => {
    const all = (props.datasets || []).flatMap(ds => (ds.data || []).map(n => Number(n) || 0));
    const maxVal = Math.max(0, ...all);

    const step = Number(props.yStep) > 0 ? Number(props.yStep) : 1;

    // ✅ mínimo 2 steps o 10% (lo que sea mayor)
    const extra = Math.max(step * 2, Math.ceil(maxVal * 0.1));

    const padded = maxVal + extra;
    return Math.ceil(padded / step) * step;
});


const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.datasets.map((ds) => ({
        ...ds,
        barThickness: barThickness.value,
        maxBarThickness: barThickness.value,
        borderRadius: ds.borderRadius ?? 8,
        backgroundColor: ds.backgroundColor ?? CHART_COLORS,
        borderColor: ds.borderColor ?? CHART_COLORS,
    })),
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,

    // ✅ fuente a nivel de este chart (override local)
    font: {
        family: props.fontFamily,
        size: props.fontSize,
    },

    plugins: {
        gaugeText: false,
        legend: {
            display: props.showLegend,
            labels: {
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
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

                    // total robusto (dataset 0)
                    const arr = (ctx.chart.data.datasets?.[0]?.data || []).map(n => Number(n) || 0);
                    const total = arr.reduce((a, b) => a + b, 0);

                    const pct = total ? (v / total) * 100 : 0;

                    // muestra: "CONCILIADOR: 135 (91.2%)"
                    return `Cantidad: ${v} (${pct.toFixed(0)}%)`;
                },
            },
        },
        datalabels: {
            display: true,
            anchor: "end",
            align: "end",
            offset: 4,
            clamp: true,
            clip: false,
            font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            color: "#2c2b34",
            formatter: (value, ctx) => {
                const v = Number(value ?? 0);

                // total del dataset (si tienes 1 dataset)
                const arr = ctx.dataset.data || [];
                const total = arr.reduce((a, b) => Number(a) + Number(b), 0);
                const pct = total ? (v / total) * 100 : 0;

                return `${v} (${pct.toFixed(0)}%)`; // ajusta decimales aquí
            },
        },
    },
    layout: { padding: { left: 8, right: 8, top: 24, bottom: 0 } },
    scales: {
        x: {
            stacked: props.stacked,
            grid: { display: false },
            ticks: {
                maxRotation: 0,
                minRotation: 0,

                // si hay muchos labels, autoSkip puede saltar algunos.
                // Si quieres que SIEMPRE se vean todos, ponlo en false.
                autoSkip: true,

                padding: 8,

                callback: (value, index) => {
                    const label = props.labels?.[index] ?? "";

                    // ✅ 1) Si tiene paréntesis, lo partimos a 2 líneas (tipo imagen2)
                    const byParen = splitParen(label);
                    if (Array.isArray(byParen)) return byParen;

                    // ✅ 2) Si no, hacemos wrap por ancho (responsive)
                    const w = widthPx.value || 0;
                    const maxChars = w < 420 ? 10 : w < 720 ? 14 : 18;
                    return wrapLabel(label, maxChars);
                },

                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
        },
        y: {
            stacked: props.stacked,
            beginAtZero: true,
            max: yMax.value, // ✅ aquí
            ticks: {
                stepSize: props.yStep || undefined,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
            grid: { color: "rgba(0,0,0,0.06)" },
        },

    },
}));
</script>

<template>
    <div ref="wrapperRef" class="chart-wrap" :style="{ height: typeof height === 'number' ? `${height}px` : height }">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<style scoped>
.chart-wrap {
    width: 100%;
    position: relative;
}
</style>
