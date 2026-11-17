<template>
    <div class="wrap" :style="{ height }">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";

const props = defineProps({
    labels: { type: Array, required: true },

    // series: [{ label, data, color }]
    // orden = de abajo hacia arriba
    series: { type: Array, required: true },

    height: { type: String, default: "280px" },
    barThickness: { type: [Number, String], default: 14 },
    radius: { type: Number, default: 10 },

    legendPosition: { type: String, default: "bottom" },
});

const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.series.map((s, datasetIndex) => ({
        label: s.label,
        data: s.data,
        backgroundColor: s.color,
        stack: "stack-1",
        barThickness: props.barThickness,
        borderWidth: 0,
        borderSkipped: false,

        // ✅ redondeo adaptativo por barra
        borderRadius: (ctx) => {
            const di = ctx.dataIndex;
            const datasets = ctx.chart.data.datasets;

            let topDatasetIndex = -1;
            for (let i = datasets.length - 1; i >= 0; i--) {
                const v = Number(datasets[i].data?.[di] ?? 0);
                if (v > 0) { topDatasetIndex = i; break; }
            }

            const isTop = datasetIndex === topDatasetIndex;
            return {
                topLeft: isTop ? props.radius : 0,
                topRight: isTop ? props.radius : 0,
                bottomLeft: 0,
                bottomRight: 0,
            };
        },
    })),
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: props.legendPosition,
            align: "start",
            labels: { usePointStyle: true, pointStyle: "rectRounded" },
        },
        tooltip: { enabled: true },
        datalabels: { display: false }, // ✅ sin valores (como pediste)
    },
    scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, grace: "10%" },
    },
}));
</script>

<style scoped>
.wrap {
    width: 100%;
}
</style>
