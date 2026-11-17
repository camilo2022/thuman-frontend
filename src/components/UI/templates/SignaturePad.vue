<template>
    <div class="signature-pad">
        <!-- Caja con borde punteado -->
        <div class="signature-pad__box" :class="{ disabled: props.disabled }">
            <canvas ref="canvas" class="signature-pad__canvas" :class="{ disabled: props.disabled }"
                @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing"
                @touchstart.prevent="startDrawingTouch" @touchmove.prevent="drawTouch"
                @touchend.prevent="stopDrawing"></canvas>
        </div>

        <!-- Botón fuera del borde -->
        <div class="signature-pad__footer">
            <Button title="Limpiar" icon="clean" variant="question" @click="clearCanvas" :disabled="props.disabled" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
    modelValue: { type: String, default: null },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const canvas = ref(null);
const ctx = ref(null);
const isDrawing = ref(false);

const setupCanvas = () => {
    const c = canvas.value;
    if (!c) return;

    const rect = c.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    // tamaño REAL del canvas (pixeles)
    c.width = Math.max(1, Math.floor(rect.width * ratio));
    c.height = Math.max(1, Math.floor(rect.height * ratio));

    const context = c.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0); // limpia y aplica escala
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000";

    ctx.value = context;
};

// Convierte coords de pantalla -> coords reales del canvas (corrige desface)
const getCanvasPoint = (clientX, clientY) => {
    const c = canvas.value;
    const rect = c.getBoundingClientRect();


    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};


const getPosition = (event) => getCanvasPoint(event.clientX, event.clientY);

const getTouchPosition = (event) => {
    const touch = event.touches[0] || event.changedTouches[0];
    return getCanvasPoint(touch.clientX, touch.clientY);
};

const startDrawing = (event) => {
    if (props.disabled || !ctx.value) return;
    isDrawing.value = true;
    const { x, y } = getPosition(event);
    ctx.value.beginPath();
    ctx.value.moveTo(x, y);
};

const draw = (event) => {
    if (props.disabled || !isDrawing.value || !ctx.value) return;
    const { x, y } = getPosition(event);
    ctx.value.lineTo(x, y);
    ctx.value.stroke();
};

const startDrawingTouch = (event) => {
    if (props.disabled || !ctx.value) return;
    isDrawing.value = true;
    const { x, y } = getTouchPosition(event);
    ctx.value.beginPath();
    ctx.value.moveTo(x, y);
};

const drawTouch = (event) => {
    if (props.disabled || !isDrawing.value || !ctx.value) return;
    const { x, y } = getTouchPosition(event);
    ctx.value.lineTo(x, y);
    ctx.value.stroke();
};

const stopDrawing = () => {
    if (!isDrawing.value || !ctx.value) return;
    isDrawing.value = false;
    ctx.value.closePath();

    emit("update:modelValue", canvas.value.toDataURL("image/png"));
};

const clearCanvas = () => {
    if (!ctx.value || !canvas.value) return;
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    emit("update:modelValue", null);
};

// Reajusta si cambia el tamaño (responsive)
let ro;
onMounted(async () => {
    await nextTick();
    setupCanvas();

    if (window.ResizeObserver && canvas.value) {
        ro = new ResizeObserver(() => setupCanvas());
        ro.observe(canvas.value);
    } else {
        window.addEventListener("resize", setupCanvas);
    }
});

onBeforeUnmount(() => {
    if (ro) ro.disconnect();
    window.removeEventListener("resize", setupCanvas);
});
</script>

<style scoped>
.signature-pad {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Borde punteado solo alrededor del área de firma */
.signature-pad__box {
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 8px;
}

/* Canvas dentro de la caja */
.signature-pad__canvas {
    width: 100%;
    height: 100px;
    /* ajusta a gusto */
    background: #fff;
    border-radius: 4px;
    display: block;
}

/* Botón fuera de la caja */
.signature-pad__footer {
    display: flex;
    justify-content: flex-start;
}

.signature-pad__canvas.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.signature-pad__box.disabled {
    cursor: not-allowed;
}
</style>
