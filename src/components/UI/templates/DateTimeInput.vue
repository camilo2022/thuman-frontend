<!-- DateInput.vue -->
<template>
    <div class="date-field">
        <label v-if="label" class="date-label">{{ label }}</label>

        <div class="date-wrap">
            <input ref="inputRef" type="datetime-local" class="input-box" :class="{ 'input-box--error': !!error }"
                :value="modelValue ?? ''" :min="min" :max="max" :disabled="disabled" :required="required"
                @input="onInput" @blur="$emit('blur')" @focus="$emit('focus')" />

            <button type="button" class="date-btn" :disabled="disabled" aria-label="Abrir calendario"
                @click="openPicker">
                <!-- ícono calendario -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" viewBox="0 0 256 256">
                    <path
                        d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z">
                    </path>
                </svg>
            </button>
        </div>

        <small v-if="hint" class="date-hint">{{ hint }}</small>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    // ✅ permite null (tu backend a veces devuelve null)
    modelValue: { type: [String, null], default: "" }, // "YYYY-MM-DD" o null
    label: { type: String, default: "" },
    hint: { type: String, default: "" },
    error: { type: Boolean, default: false },
    min: { type: String, default: "" },
    max: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "focus", "blur"]);

const inputRef = ref(null);

function onInput(e) {
    const v = e.target.value;
    // ✅ si borran la fecha, mandamos null (no string vacío) para que tu modelo quede consistente
    emit("update:modelValue", v === "" ? null : v);
}

function openPicker() {
    const el = inputRef.value;
    if (!el || props.disabled) return;

    // Chrome/Edge (y algunos Safari) modernos
    if (typeof el.showPicker === "function") el.showPicker();
    el.focus();
}
</script>

<style scoped>
.date-label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
}

.date-wrap {
    position: relative;
}

.date-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    color: #4f46e5;
    display: grid;
    place-items: center;
}

.date-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

/* Oculta el ícono nativo del input date (Chrome/Edge/Safari) */
.input-box::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 12px;
    width: 24px;
    height: 24px;
    cursor: pointer;
}

/* textos opcionales */
.date-hint {
    display: block;
    margin-top: 6px;
    color: #6b7280;
}

.date-error {
    display: block;
    margin-top: 6px;
    color: #ef4444;
}

svg {
    fill: #5b4cd0;
}

.input-box--error {
    border: 1.98px solid #c40003 !important;
}

.input-box:disabled {
    background-color: #f1edff !important;
    color: black;
}

</style>