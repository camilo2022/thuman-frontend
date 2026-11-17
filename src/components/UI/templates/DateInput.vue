<!-- DateInput.vue -->
<template>
    <div class="date-field">
        <label v-if="label" class="date-label">{{ label }}</label>

        <div class="date-wrap">
            <input ref="inputRef" type="date" :class="['input-box', { 'input-error': error }, { 'disabled': disabled }]" :value="modelValue"
                :min="min" :max="max" :disabled="disabled" :required="required" @input="onInput" @blur="$emit('blur')"
                @focus="$emit('focus')" />

            <button type="button" class="date-btn" :disabled="disabled" aria-label="Abrir calendario"
                @click="openPicker">
                <!-- ícono calendario -->
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M8 3v2M16 3v2M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8 13h2M12 13h2M16 13h2M8 17h2M12 17h2" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" />
                </svg>
            </button>
        </div>

        <small v-if="hint" class="date-hint">{{ hint }}</small>
        <!-- <small v-if="error" class="date-error">{{ error }}</small> -->
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    modelValue: { type: String, default: "" }, // "YYYY-MM-DD"
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
    emit("update:modelValue", e.target.value);
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
    /* azul del ícono */
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

.date-wrap.disabled {
    pointer-events: none;
}

.date-wrap.disabled .input-box {
    background: #f4f2ff;
    color: #000000;
    border-color: #ddd;
    cursor: not-allowed;
    box-shadow: none;
}

.date-wrap.disabled .date-btn {
    color: #aaa;
    cursor: not-allowed;
    opacity: 1;
}

.date-wrap.disabled .input-box:hover,
.date-wrap.disabled .input-box:focus {
    border-color: #ddd;
    box-shadow: none;
}
</style>
