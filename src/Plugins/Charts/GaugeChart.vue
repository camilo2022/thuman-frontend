<template>
    <div class="chart" :style="{ height: typeof height === 'number' ? `${height}px` : height }">
        <Doughnut :data="data" :options="options" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CHART_COLORS } from "../Chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ Plugin: texto central + min/max
const GaugeTextPlugin = {
    id: "gaugeText",
    afterDraw(chart, args, pluginOptions) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const {
            text = "",
            subText = "",
            minLabel = "0",
            maxLabel = "",
            color = "#2c2b34",
            subColor = "#7b7aa7",
            fontFamily = '"Twemoji Country Flags","Poppins",sans-serif',
            fontSize = 24,
            subFontSize = 12,
        } = pluginOptions || {};

        const cx = (chartArea.left + chartArea.right) / 2;
        const cy = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = color;
        ctx.font = `800 ${fontSize}px ${fontFamily}`;
        ctx.fillText(text, cx, cy + 10);

        if (subText) {
            ctx.fillStyle = subColor;
            ctx.font = `600 ${subFontSize}px ${fontFamily}`;
            ctx.fillText(subText, cx, cy + 36);
        }

        ctx.fillStyle = subColor;
        ctx.font = `600 ${subFontSize}px ${fontFamily}`;

        ctx.restore();
    },
};

ChartJS.register(GaugeTextPlugin);

const props = defineProps({
    value: { type: Number, required: true },
    max: { type: Number, required: true },

    title: { type: [String, Boolean], default: false },
    height: { type: [String, Number], default: 220 },
    cutout: { type: String, default: "70%" },

    achievedColor: { type: String, default: CHART_COLORS[5] },
    remainingColor: { type: String, default: "#EDEFF7" },

    showPercent: { type: Boolean, default: true },
    percentDecimals: { type: Number, default: 1 },
    valueDecimals: { type: Number, default: 0 }, // lo puedes dejar, pero ya no lo usaremos adentro

    // ✅ nuevo: controla decimales del texto interno del gauge
    insideDecimals: { type: Number, default: 0 }, // 0 = sin decimales

    fontFamily: { type: String, default: '"Twemoji Country Flags","Poppins",sans-serif' },
    fontSize: { type: Number, default: 26 },
    subFontSize: { type: Number, default: 12 },
});

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

// ✅ formateador local (para evitar 5469.099999999)
const fmt = computed(() => {
    const d = Math.max(0, Number(props.insideDecimals ?? 0));
    return new Intl.NumberFormat("es-CO", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
    });
});
const f = (n) => fmt.value.format(Number(n ?? 0));

const achieved = computed(() => {
    const a = clamp(Number(props.value || 0), 0, Number(props.max || 0));
    return Math.round(a); // ✅ entero
});

const remaining = computed(() => {
    const r = Math.max(0, Number(props.max || 0) - achieved.value);
    return Math.round(r); // ✅ entero
});


const pct = computed(() => {
    const m = Number(props.max || 0);
    return m ? (achieved.value / m) * 100 : 0;
});

const centerText = computed(() => {
    if (!props.showPercent) return f(achieved.value); // ✅ sin decimales (o los que definas)
    return `${pct.value.toFixed(props.percentDecimals)} %`;
});

const centerSubText = computed(() => {
    // ✅ muestra "5.469 / 7.813" sin decimales raros
    return `${f(achieved.value)} / ${f(props.max)}`;
});

const data = computed(() => ({
    labels: ["Alcanzado", "Faltante"],
    datasets: [
        {
            data: [achieved.value, remaining.value],
            backgroundColor: [props.achievedColor, props.remainingColor],
            borderWidth: 0,
            borderRadius: 10,
        },
    ],
}));

const options = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: props.cutout,

    rotation: -90,
    circumference: 180,
    layout: { padding: { top: 5, right: 10, bottom: 10, left: 10 } },
    plugins: {
        legend: { display: false },

        // ✅ tooltip también sin decimales raros (usa insideDecimals)
        tooltip: {
            callbacks: {
                label: (ctx) => {
                    const v = Number(ctx.raw ?? 0);
                    const label = ctx.label || "";
                    if (label === "Faltante") return `${label}: ${f(v)}`;
                    return `${label}: ${f(v)} (${pct.value.toFixed(props.percentDecimals)}%)`;
                },
            },
        },

        gaugeText: {
            text: centerText.value,
            subText: centerSubText.value,
            minLabel: "0",
            maxLabel: f(props.max), // ✅ 7.813
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            subFontSize: props.subFontSize,
        },

        title: {
            display: typeof props.title === "string" && props.title.trim().length > 0,
            text: typeof props.title === "string" ? props.title : "",
            font: { family: props.fontFamily, size: props.subFontSize + 4, weight: "800" },
            color: "#2c2b34",
            padding: { bottom: 6 },
        },
        datalabels: {
            display: true,
            formatter: (v) => f(v),     // 5.469 / 2.344
            color: "#2c2b34",
            font: { family: props.fontFamily, size: props.subFontSize, weight: "700" },

            // clave: posicionarlos dentro
            anchor: "center",
            align: "center",
            offset: 0,
            clamp: true,
            clip: false,
        },
    },
}));
</script>


<style scoped>
.chart {
    width: 100%;
    position: relative;
}
</style>
