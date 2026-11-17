<script setup>
import { computed } from 'vue'
import DateInput from '@/components/UI/templates/DateInput.vue'

const props = defineProps({
    selectedIds: {
        type: Array,
        default: () => []
    },
    superiorActual: {
        type: Object,
        default: null
    },
    nuevoSuperior: {
        type: Object,
        default: null
    },
    fechaVigencia: {
        type: String,
        default: ''
    },
    motivo: {
        type: String,
        default: ''
    }
})

const emit = defineEmits([
    'update:nuevoSuperior',
    'update:fechaVigencia',
    'update:motivo',
    'select-superior',
    'confirm'
])

const fechaModel = computed({
    get: () => props.fechaVigencia,
    set: value => emit('update:fechaVigencia', value)
})

const motivoModel = computed({
    get: () => props.motivo,
    set: value => emit('update:motivo', value)
})
</script>

<template>
    <div class="sub-container">
        <div class="selected-info">
            <span class="selected-info-number">{{ selectedIds.length }}</span>
            <span>colaboradores seleccionados</span>
        </div>

        <div class="form-group">
            <label>Superior actual</label>

            <div v-if="superiorActual" class="supervisor-preview">
                <img :src="superiorActual.foto" :alt="superiorActual.nombre" />

                <div>
                    <strong>{{ superiorActual.nombre }}</strong>
                    <span>{{ superiorActual.cargo }}</span>
                </div>
            </div>

            <div v-else class="supervisor-preview empty">
                Los colaboradores seleccionados no tienen un superior común.
            </div>
        </div>

        <div class="form-group">
            <label>Nuevo superior <em>*</em></label>

            <button type="button" class="supervisor-select" @click="emit('select-superior')">
                <span v-if="nuevoSuperior" class="person-cell">
                    <img :src="nuevoSuperior.foto" :alt="nuevoSuperior.nombre" />

                    <span>
                        <strong>{{ nuevoSuperior.nombre }}</strong>
                        <small>{{ nuevoSuperior.cargo }}</small>
                    </span>
                </span>

                <span v-else class="placeholder-supervisor">
                    Selecciona un superior
                </span>

                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
        </div>

        <div class="form-group">
            <label>Fecha de vigencia <em>*</em></label>
            <DateInput v-model="fechaModel" />
        </div>

        <div class="form-group">
            <label for="reason">Motivo <em>*</em></label>

            <textarea id="reason" v-model="motivoModel" maxlength="200" placeholder="Describe el motivo del cambio"
                class="text-area" />

            <small class="character-counter">
                {{ motivoModel.length }}/200
            </small>
        </div>

        <div class="alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                <path
                    d="M240.26,186.1,152.81,34.23a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1ZM219.46,201.8a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
            </svg>

            <p>Las solicitudes nuevas usarán la jerarquía desde esta fecha.</p>
        </div>

        <button type="button" class="btn btn-primary confirm-button"
            :disabled="!selectedIds.length || !nuevoSuperior || !motivoModel.trim()" @click="emit('confirm')">
            Confirmar reasignación
        </button>

        <p class="notification-text">
            Se notificará a los colaboradores y sus superiores.
        </p>
    </div>
</template>
<style scoped>
.selected-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
    color: #5d4ed0;
    font-size: 12px;
    font-weight: 700;
}

.selected-info-number {
    display: grid;
    width: 23px;
    height: 23px;
    place-items: center;
    color: #fff;
    background: #5b4cd0;
    border-radius: 50%;
    font-size: 11px;
}

.form-group {
    position: relative;
    display: grid;
    gap: 7px;
    margin-bottom: 15px;
}

.form-group label {
    color: #172554;
    font-size: 12px;
    font-weight: 800;
}

.form-group em {
    color: var(--danger);
    font-style: normal;
}

.supervisor-preview,
.supervisor-select {
    gap: 10px;
    min-height: 57px;
    padding: 9px 11px;
    background: #f7f8fc;
    border: 1px solid #e0e6f0;
    border-radius: 7px;
    box-sizing: border-box;
}

.supervisor-preview strong,
.supervisor-preview span,
.supervisor-select strong,
.supervisor-select small {
    display: block;
}

.supervisor-preview strong,
.supervisor-select strong {
    color: #1a2858;
    font-size: 13px;
    font-weight: 800;
}

.supervisor-preview span,
.supervisor-select small {
    margin-top: 3px;
    color: var(--muted);
    font-size: 11px;
}

.supervisor-preview.empty {
    color: var(--muted);
    font-size: 12px;
}

.supervisor-select {
    justify-content: space-between;
    width: 100%;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
}

.supervisor-select>svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: var(--primary);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}

.form-group input {
    height: 42px;
    padding: 0 12px;
    font-size: 13px;
}

.form-group textarea {
    min-height: 82px;
    padding: 11px;
    resize: vertical;
    font-size: 13px;
    line-height: 1.45;
}

.character-counter {
    position: absolute;
    right: 8px;
    bottom: 5px;
    color: var(--muted);
    font-size: 10px;
}

.confirm-button {
    width: 100% !important;
    margin-top: 13px;
}

.notification-text {
    margin: 8px 0 0;
    color: var(--muted);
    text-align: center;
    font-size: 10.5px;
}

.card-filter {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /* 👈 centra horizontalmente contenido */
    gap: 12px;
    border-radius: 10px;
    padding: 10px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.card-filter.is-selected {
    border-color: 0.5px solid #5B4CD0;
    /* color del marco */
    box-shadow: 0 0 0 3px #8d7ff8;
}

.alert-warning {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
}

.alert-warning p {
    color: #CA8A04;
}

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 420px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
}

/* Responsive: apilar en pantallas pequeñas */
@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split-panel {
        order: 2;
    }

    .split-main {
        order: 1;
    }
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(30px);
    /* mueve 30px a la derecha */
    opacity: 0;
}

.organizational-structure {
    --primary: #5b4cd0;
    --primary-hover: #493cc2;
    --primary-soft: #f1efff;
    --text: #172554;
    --muted: #647195;
    --border: #e5eaf4;
    --surface: #ffffff;
    --row-selected: #f6f3ff;
    --danger: #ed4560;

    width: 100%;
    padding: 6px 0 26px;
    color: var(--text);
    font-family: Inter, 'Segoe UI', sans-serif;
}

.page-header,
.header-actions,
.pagination-info,
.filters,
.person-cell,
.panel-header,
.supervisor-preview,
.supervisor-select {
    display: flex;
    align-items: center;
}

.page-header {
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 22px;
}

.title-eyebrow,
.panel-label {
    color: #5b4cd0;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}

.page-header h1 {
    margin: 4px 0 6px;
    color: #121e50;
    font-size: 31px;
    font-weight: 800;
    letter-spacing: -0.8px;
    line-height: 1.1;
}

.selected-row {
    background: linear-gradient(90deg, #fbfaff 0%, #f4f0ff 100%);
}

.person-cell {
    gap: 8px;
}

.person-cell img,
.supervisor-preview img {
    width: 29px;
    height: 29px;
    object-fit: cover;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(35, 51, 95, 0.12);
}

.supervisor small {
    display: block;
    margin-top: 2px;
    color: #7581a1;
    font-size: 10px;
}

.form-group input {
    height: 42px;
    padding: 0 12px;
    font-size: 13px;
}

.form-group textarea {
    min-height: 82px;
    padding: 11px;
    resize: vertical;
    font-size: 13px;
    line-height: 1.45;
}
</style>