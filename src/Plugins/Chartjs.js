import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

export const CHART_COLORS = [
  "#F3E8FF",
  "#E9D5FF",
  "#DDD6FE",
  "#D8B4FE",
  "#CFA9F3",
  "#C084FC",
  "#B794F4",
  "#A78BFA",
  "#9F7AEA",
  "#8B5CF6",
];

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels,
);

// ✅ Defaults globales
ChartJS.defaults.color = "#2c2b34";
ChartJS.defaults.font.family = '"Twemoji Country Flags","Poppins",sans-serif';
ChartJS.defaults.font.size = 12;

// ✅ Datalabels global (para todos)
ChartJS.defaults.plugins.datalabels = {
  display: true,
  color: "#2c2b34",
  font: { weight: "800" },
  anchor: "end",
  align: "end",
  clamp: true,
};

ChartJS.defaults.elements.arc.backgroundColor = CHART_COLORS; // donut/pie
ChartJS.defaults.elements.arc.borderColor = "#ffffff";
ChartJS.defaults.elements.arc.borderWidth = 2;

ChartJS.defaults.datasets.bar.backgroundColor = CHART_COLORS[7]; // barra por defecto
ChartJS.defaults.datasets.bar.borderRadius = 8;

ChartJS.defaults.datasets.line.borderColor = CHART_COLORS[9];
ChartJS.defaults.datasets.line.backgroundColor = CHART_COLORS[2];
ChartJS.defaults.datasets.line.pointBackgroundColor = CHART_COLORS[9];
