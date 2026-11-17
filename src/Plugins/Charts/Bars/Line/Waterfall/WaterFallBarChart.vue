<template>
    <div class="chart-wrap" :style="{ height: typeof height === 'number' ? `${height}px` : height }">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS } from "chart.js";

// ✅ registra una sola vez (evita duplicados)
const waterfallConnectors = {
    id: "waterfallConnectors",
    afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, chartArea, scales } = chart;
        const meta = chart.getDatasetMeta(pluginOptions?.datasetIndex ?? 0);
        if (!meta?.data?.length) return;

        const xScale = scales.x;
        const yScale = scales.y;
        if (!xScale || !yScale) return;

        const opts = {
            color: pluginOptions?.color ?? "rgba(0,0,0,0.18)",
            width: pluginOptions?.width ?? 1,
            dash: pluginOptions?.dash ?? [0, 0],
            paddingX: pluginOptions?.paddingX ?? 10,
            skipToTotal: pluginOptions?.skipToTotal ?? true, // ✅ no conectar hacia Total
            totalLabel: pluginOptions?.totalLabel ?? "Total",
        };

        const ds = chart.data.datasets[meta.index];
        const raw = ds.data;
        const labels = chart.data.labels || [];

        ctx.save();
        ctx.beginPath();
        ctx.rect(
            chartArea.left,
            chartArea.top,
            chartArea.right - chartArea.left,
            chartArea.bottom - chartArea.top
        );
        ctx.clip();

        ctx.strokeStyle = opts.color;
        ctx.lineWidth = opts.width;
        ctx.setLineDash(opts.dash);

        for (let i = 0; i < raw.length - 1; i++) {
            // ✅ opcional: no conectar hacia la barra Total
            const nextLabel = String(labels[i + 1] ?? "");
            if (opts.skipToTotal && nextLabel === opts.totalLabel) break;

            const cur = raw[i];
            const next = raw[i + 1];
            if (!Array.isArray(cur) || !Array.isArray(next)) continue;

            const curEnd = Number(cur[1]);
            if (!Number.isFinite(curEnd)) continue;

            const y = yScale.getPixelForValue(curEnd);

            const x0 = xScale.getPixelForValue(i);
            const x1 = xScale.getPixelForValue(i + 1);

            ctx.beginPath();
            ctx.moveTo(x0 + opts.paddingX, y);
            ctx.lineTo(x1 - opts.paddingX, y);
            ctx.stroke();
        }

        ctx.restore();
    },
};

if (!ChartJS.registry.plugins.get("waterfallConnectors")) {
    ChartJS.register(waterfallConnectors);
}

const props = defineProps({
    title: { type: [String, Boolean], default: false },
    labels: { type: Array, required: true },
    values: { type: Array, required: true },

    height: { type: [String, Number], default: 320 },
    showTotal: { type: Boolean, default: true },
    totalLabel: { type: String, default: "Total" },

    // estilo
    upColor: { type: String, default: "#16a34a" },
    downColor: { type: String, default: "#ef4444" },
    totalColor: { type: String, default: "#3b82f6" },

    valueDecimals: { type: Number, default: 1 },
    valueSuffix: { type: String, default: "%" },

    fontFamily: { type: String, default: '"Twemoji Country Flags","Poppins",sans-serif' },
    fontSize: { type: Number, default: 12 },

    // conectores
    showConnectors: { type: Boolean, default: true },
    skipConnectorToTotal: { type: Boolean, default: true },
});

const items = computed(() => {
    const base = props.values.map((v, i) => ({
        label: props.labels[i] ?? `#${i + 1}`,
        value: Number(v) || 0,
        kind: "step",
    }));

    if (!props.showTotal) return base;

    const total = base.reduce((acc, it) => acc + it.value, 0);
    return [...base, { label: props.totalLabel, value: total, kind: "total" }];
});

// Floating bars: [start,end]
const floatingData = computed(() => {
    let running = 0;
    return items.value.map((it) => {
        if (it.kind === "total") return [0, it.value];
        const start = running;
        const end = running + it.value;
        running = end;
        return [start, end];
    });
});

const colors = computed(() =>
    items.value.map((it, i) => {
        if (it.kind === "total") return props.totalColor;
        const v = Number(props.values[i] ?? 0);
        return v >= 0 ? props.upColor : props.downColor;
    })
);

const chartData = computed(() => ({
    labels: items.value.map((x) => x.label),
    datasets: [
        {
            label: "Waterfall",
            data: floatingData.value,
            backgroundColor: colors.value,
            borderWidth: 0,
            borderRadius: 4,
            barPercentage: 0.9,
            categoryPercentage: 0.8,
        },
    ],
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    font: { family: props.fontFamily, size: props.fontSize },

    plugins: {
        gaugeText: false,
        legend: { display: false },
        title: {
            display: typeof props.title === "string" && props.title.trim().length > 0,
            text: typeof props.title === "string" ? props.title : "",
            font: { family: props.fontFamily, size: props.fontSize + 2, weight: "700" },
            color: "#2c2b34",
        },

        datalabels: {
            display: true,
            anchor: "end",
            align: "end",
            offset: 2,
            clamp: true,
            clip: false,
            font: { family: props.fontFamily, size: props.fontSize, weight: "700" },
            color: "#2c2b34",
            formatter: (val, ctx) => {
                const it = items.value[ctx.dataIndex];
                const v = it?.kind === "total" ? it.value : (Number(props.values[ctx.dataIndex]) || 0);
                return `${v.toFixed(props.valueDecimals)}${props.valueSuffix}`;
            },
        },

        tooltip: {
            callbacks: {
                label: (ctx) => {
                    const it = items.value[ctx.dataIndex];
                    const raw = ctx.raw; // [start,end]
                    const start = Number(raw?.[0] ?? 0);
                    const end = Number(raw?.[1] ?? 0);

                    if (it?.kind === "total") {
                        return `Total: ${end.toFixed(props.valueDecimals)}${props.valueSuffix}`;
                    }

                    const delta = end - start;
                    return `Cambio: ${delta.toFixed(props.valueDecimals)}${props.valueSuffix} (Acum: ${end.toFixed(
                        props.valueDecimals
                    )}${props.valueSuffix})`;
                },
            },
        },

        // ✅ Conectores (opcional)
        ...(props.showConnectors
            ? {
                waterfallConnectors: {
                    datasetIndex: 0,
                    color: "rgba(0,0,0,0.18)",
                    width: 1,
                    dash: [0, 0],
                    paddingX: 10,
                    skipToTotal: props.skipConnectorToTotal,
                    totalLabel: props.totalLabel,
                },
            }
            : {}),
    },

    layout: { padding: { left: 8, right: 12, top: 10, bottom: 0 } },

    scales: {
        x: {
            grid: { display: false },
            ticks: {
                maxRotation: 0,
                autoSkip: true,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
        },
        y: {
            beginAtZero: false,
            grace: "10%",
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: {
                callback: (v) => `${v}${props.valueSuffix}`,
                font: { family: props.fontFamily, size: props.fontSize, weight: "600" },
            },
        },
    },
}));
</script>

<style scoped>
.chart-wrap {
    width: 100%;
    position: relative;
}
</style>
