<template>
    <div class="chart">
        <Doughnut :data="data" :options="options" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CHART_COLORS } from "../Chartjs";

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const props = defineProps({
    title: { type: [String, Boolean], default: false },
    labels: { type: Array, required: true },
    values: { type: Array, required: true },
    colors: { type: Array, default: () => ["#4CAF50", "#FFC107"] },
    cutout: { type: String, default: "45%" },
    legendPosition: { type: String, default: "bottom" },

    percentDecimals: { type: Number, default: 0 },
    fontFamily: { type: String, default: '"Twemoji Country Flags","Poppins",sans-serif' },
    fontSize: { type: Number, default: 10 },
});

const data = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            data: props.values,
            backgroundColor: CHART_COLORS,
            borderColor: "#ffffff",
            borderWidth: 2,
        },
    ],
}));

const options = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: props.cutout,

    plugins: {
        gaugeText: false,
        legend: {
            position: props.legendPosition,
            labels: {
                boxWidth: 10,      // ✅ ancho del cuadrito
                boxHeight: 10,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },

                // ✅ Label del legend con porcentaje
                generateLabels: (chart) => {
                    const ds = chart.data.datasets?.[0];
                    const vals = (ds?.data || []).map((x) => Number(x) || 0);
                    const labels = chart.data.labels || [];
                    const total = vals.reduce((a, b) => a + b, 0);

                    return vals.map((v, i) => {
                        const pct = total ? (v / total) * 100 : 0;

                        return {
                            text: `${labels[i] ?? "Sin dato"} (${pct.toFixed(props.percentDecimals)}%)`,
                            fillStyle: ds.backgroundColor?.[i],
                            strokeStyle: ds.borderColor,
                            lineWidth: 1,
                            hidden: false,
                            index: i,
                        };
                    });
                },
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
                    const arr = ctx.dataset.data || [];
                    const total = arr.reduce((a, b) => Number(a) + Number(b), 0);
                    const pct = total ? (v / total) * 100 : 0;
                    return `${ctx.label}: ${v} (${pct.toFixed(props.percentDecimals)}%)`;
                },
            },
        },

        // ✅ Value dentro del segmento
        datalabels: {
            display: true,
            anchor: "center",
            align: "center",
            offset: 0,
            clip: true,
            clamp: true,
            font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            color: "#2b2c34",
            textStrokeColor: "rgba(0,0,0,0.25)",
            textStrokeWidth: 0,

            // solo el valor
            formatter: (value) => `${Number(value ?? 0)}`,
        },
    },
}));
</script>

<style scoped>
.chart {
    height: 220px;
}
</style>
