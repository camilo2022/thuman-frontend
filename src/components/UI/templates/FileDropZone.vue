<template>
    <div class="dropzone" :class="{ 'dropzone--dragover': isDragging, 'dropzone--disabled': props.disabled }"
        @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
        <!-- input invisible que ocupa todo el contenedor -->
        <input ref="input" type="file" class="dropzone__input" :accept="accept" @click="onClickInput"
            @change="onChange" :disabled="props.disabled" />


        <div class="dropzone__content">
            <svg class="icon-file" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                viewBox="0 0 256 256">
                <path
                    d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z">
                </path>
            </svg>

            <div class="dropzone__text">
                <template v-if="isDragging">
                    <strong>Suelta el archivo aquí</strong>
                </template>

                <template v-else-if="fileName">
                    <strong>Archivo seleccionado:</strong><br />
                    {{ fileName }}
                </template>

                <template v-else>
                    <span class="dropzone__action">Haga clic para subir</span>
                    o arrastre y suelte<br />
                    <span class="dropzone__hint">{{ hint }}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    modelValue: File,
    accept: {
        type: String,
        default: 'image/png,image/jpeg,application/pdf'
    },
    hint: {
        type: String,
        default: 'PNG, JPG, PDF hasta 5MB'
    },
    maxSize: {
        type: Number,
        default: 5 * 1024 * 1024
    },
    disabled: {              // ← NUEVO
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'invalid']);

const input = ref(null);
const isDragging = ref(false);
const file = ref(props.modelValue || null);

watch(
    () => props.modelValue,
    (val) => {
        file.value = val;
    }
);

const fileName = computed(() => file.value?.name ?? '');

const handleFile = (f) => {
    if (!f) return;

    if (props.maxSize && f.size > props.maxSize) {
        emit('invalid', { type: 'size', file: f });
        return;
    }

    file.value = f;
    emit('update:modelValue', f);
};

const onChange = (e) => {
    if (props.disabled) return;
    const f = e.target.files[0];
    handleFile(f);
};

const onDrop = (e) => {
    if (props.disabled) return;
    isDragging.value = false;
    const f = e.dataTransfer.files[0];
    handleFile(f);
};

const onDragOver = () => {
    if (props.disabled) return;
    isDragging.value = true;
};

const onDragLeave = () => {
    if (props.disabled) return;
    isDragging.value = false;
};

const onClickInput = (e) => {
    if (props.disabled) {
        e.preventDefault();
        return;
    }
    // limpiar el valor nativo del input para poder volver a elegir el mismo archivo
    e.target.value = '';

    // limpiar el estado en Vue
    file.value = null;
    emit('update:modelValue', null);
};

</script>

<style scoped>
.dropzone {
    position: relative;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 24px;
    width: 100%;
    height: 100%;
    min-height: 120px;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    font-size: 14px;
    color: #777;
    box-sizing: border-box;
}

.dropzone--dragover {
    border-color: #6c63ff;
    background-color: #f5f3ff;
}

.dropzone__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.dropzone__content {
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.icon-file {
    margin-bottom: 4px;
    color: #6c63ff;
}

.dropzone__action {
    color: #6c63ff;
    font-weight: 600;
}

.dropzone__hint {
    font-size: 12px;
    color: #999;
}

.dropzone__text strong {
    color: #2b2c34;
}

.dropzone--disabled {
    opacity: 5;
    cursor: not-allowed;
    background-color: #f8f8f8;
}

.dropzone--disabled .dropzone__input {
    pointer-events: none;
}
</style>
