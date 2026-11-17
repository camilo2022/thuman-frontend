<script setup>
import { computed } from 'vue'
import DateInput from '@/components/UI/templates/DateInput.vue'
import SearchSelect from '@/components/UI/templates/SearchSelect.vue'

const props = defineProps({
    modelOrganizationalStructure: {
        type: Object,
        required: true
    },
    positions: {
        type: Array,
        default: () => []
    },
    modelEntity: {
        type: Object,
        default: () => ({})
    },
    errors: {
        type: Object,
        default: () => ({})
    },
})

const emit = defineEmits([
    'index',
    'submitOrganizationalStructureStore'
])

const selectedPosition = computed(() => {
    return props.positions.find(
        position =>
            String(position.id) ===
            String(props.modelOrganizationalStructure.position_id)
    ) ?? null
})

const selectedParentPosition = computed(() => {
    return props.positions.find(
        position =>
            String(position.id) ===
            String(props.modelOrganizationalStructure.parent_position_id)
    ) ?? null
})

const availablePositions = computed(() => {
    const parentId =
        props.modelOrganizationalStructure.parent_position_id

    if (!parentId) {
        return props.positions
    }

    return props.positions.filter(
        position =>
            String(position.id) !== String(parentId)
    )
})

const availableParentPositions = computed(() => {
    const positionId =
        props.modelOrganizationalStructure.position_id

    if (!positionId) {
        return props.positions
    }

    return props.positions.filter(
        position =>
            String(position.id) !== String(positionId)
    )
})

const selectPosition = (position) => {
    props.modelOrganizationalStructure.position_id =
        position?.id ?? null

    /**
     * Protección adicional por si por algún motivo
     * ambos quedaron iguales.
     */
    if (
        props.modelOrganizationalStructure.parent_position_id &&
        String(
            props.modelOrganizationalStructure.parent_position_id
        ) === String(position?.id)
    ) {
        props.modelOrganizationalStructure.parent_position_id = null
    }
}

const selectParentPosition = (position) => {
    props.modelOrganizationalStructure.parent_position_id =
        position?.id ?? null

    if (
        props.modelOrganizationalStructure.position_id &&
        String(
            props.modelOrganizationalStructure.position_id
        ) === String(position?.id)
    ) {
        props.modelOrganizationalStructure.position_id = null
    }
}

const canSubmit = computed(() => {
    return !!(
        props.modelEntity?.id &&
        props.modelOrganizationalStructure.position_id &&
        props.modelOrganizationalStructure.parent_position_id &&
        props.modelOrganizationalStructure.start_date &&
        props.modelOrganizationalStructure.reason?.trim()
    )
})
</script>

<template>
    <div class="sub-container">

        <div class="configuration-info">
            <div>
                <strong>Nueva configuración jerárquica</strong>
                <span>
                    Define qué cargo deberá reportar a otro dentro de una entidad.
                </span>
            </div>
        </div>

        <div class="form-group">
            <label>
                Entidad
            </label>

            <input type="text" id="entity" class="input-box disabled" :value="modelEntity.name" disabled />
        </div>

        <div class="form-group">
            <label>
                Cargo
            </label>

            <div>
                <SearchSelect v-model="props.modelOrganizationalStructure.position_id" :options="availablePositions"
                    :error="props.errors.organizational_structure_position_id" placeholder="Selecciona el cargo"
                    option-key="name" value-key="id" @select="selectPosition" />
                <p v-for="(msg, i) in props.errors?.organizational_structure_position_id ?? []" :key="'type-' + i"
                    class="error-text">
                    {{ msg }}
                </p>
            </div>
        </div>

        <div v-if="selectedPosition" class="hierarchy-preview">
            <div class="hierarchy-position">
                <span class="field-caption">
                    Cargo subordinado
                </span>

                <strong>
                    {{ selectedPosition.name }}
                </strong>
            </div>
        </div>

        <div class="form-group">
            <label>
                Cargo superior
            </label>

            <div>
                <SearchSelect v-model="props.modelOrganizationalStructure.parent_position_id
                    " :options="availableParentPositions" placeholder="Selecciona el cargo superior" option-key="name"
                    value-key="id" @select="selectParentPosition"
                    :error="props.errors.organizational_structure_parent_position_id" />
                <p v-for="(msg, i) in props.errors?.organizational_structure_parent_position_id ?? []"
                    :key="'type-' + i" class="error-text">
                    {{ msg }}
                </p>
            </div>
        </div>

        <div v-if="selectedPosition && selectedParentPosition" class="relationship-preview">
            <div>
                <span>Cargo</span>
                <strong>{{ selectedPosition.name }}</strong>
            </div>

            <div class="relationship-arrow">
                →
            </div>

            <div>
                <span>Cargo superior</span>
                <strong>{{ selectedParentPosition.name }}</strong>
            </div>
        </div>

        <div class="form-group">
            <label>
                Fecha de vigencia
            </label>
            <div>
                <DateInput v-model="props.modelOrganizationalStructure.start_date" name="start_date"
                    :error="props.errors.organizational_structure_start_date" />
                <p v-for="(msg, i) in props.errors?.organizational_structure_start_date ?? []" :key="'type-' + i"
                    class="error-text">
                    {{ msg }}
                </p>
            </div>
        </div>

        <div class="form-group">
            <label for="reason-hierarchy">
                Motivo
            </label>

            <div>
                <textarea id="reason-hierarchy" v-model="props.modelOrganizationalStructure.reason
                    " maxlength="500" placeholder="Describe el motivo de la configuración o cambio jerárquico"
                    class="text-area" :class="{ 'input-error': props.errors?.organizational_structure_reason }" />
                <div :class="{ 'display-data': props.errors?.organizational_structure_reason }">
                    <div v-if="props.errors?.organizational_structure_reason" class="error-text">
                        {{ props.errors?.organizational_structure_reason[0] }}
                    </div>
                    <div class="char-limit-text">
                        ({{ (props.modelOrganizationalStructure.reason || '').length }}/500)
                    </div>
                </div>
            </div>
        </div>

        <div class="alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                <path
                    d="M240.26,186.1,152.81,34.23a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Z" />
            </svg>

            <p>
                Esta configuración quedará en estado
                <strong>Pendiente</strong>
                y no modificará la jerarquía vigente hasta ser aprobada.
            </p>
        </div>

        <button type="button" class="btn btn-primary confirm-button" :disabled="!canSubmit" @click="
            emit('submitOrganizationalStructureStore', props.modelOrganizationalStructure)">
            Guardar configuración
        </button>

        <p class="notification-text">
            La relación jerárquica será aplicada únicamente después de su validación.
        </p>

    </div>
</template>

<style scoped>
.configuration-info {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 20px;
    padding: 12px;
    background: #f7f8fc;
    border: 1px solid #e0e6f0;
    border-radius: 8px;
}

.configuration-info strong,
.configuration-info span {
    display: block;
}

.configuration-info strong {
    color: #172554;
    font-size: 13px;
}

.configuration-info span {
    margin-top: 3px;
    color: #647195;
    font-size: 11px;
}

.configuration-icon {
    display: grid;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    place-items: center;
    color: #5b4cd0;
    background: #f0edff;
    border-radius: 9px;
}

.configuration-icon svg {
    fill: currentColor;
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
    color: #ed4560;
    font-style: normal;
}

.form-group textarea {
    min-height: 82px;
    padding: 11px;
    resize: vertical;
    color: #172554;
    background: #fff;
    border: 1px solid #e5eaf4;
    border-radius: 7px;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.45;
}

.character-counter {
    position: absolute;
    right: 8px;
    bottom: 5px;
    color: #647195;
    font-size: 10px;
}

.hierarchy-preview {
    display: grid;
    place-items: center;
    margin: -2px 0 15px;
}

.hierarchy-position {
    width: 100%;
    padding: 10px 12px;
    background: #f7f8fc;
    border: 1px solid #e0e6f0;
    border-radius: 7px;
}

.hierarchy-position strong,
.hierarchy-position span {
    display: block;
}

.hierarchy-position strong {
    color: #172554;
    font-size: 13px;
}

.field-caption {
    margin-bottom: 3px;
    color: #647195;
    font-size: 10px;
}

.relationship-preview {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    margin: 0 0 17px;
    padding: 12px;
    background: #f1efff;
    border: 1px solid #ddd7ff;
    border-radius: 8px;
}

.relationship-preview div:not(.relationship-arrow) {
    min-width: 0;
}

.relationship-preview span,
.relationship-preview strong {
    display: block;
}

.relationship-preview span {
    color: #647195;
    font-size: 10px;
}

.relationship-preview strong {
    margin-top: 3px;
    overflow: hidden;
    color: #172554;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.relationship-arrow {
    color: #5b4cd0;
    font-size: 20px;
    font-weight: 700;
}

.alert-warning {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 9px;
    color: #ca8a04;
    background-color: #fff9c4;
    border: 1px solid #ca8a04;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.4;
}

.alert-warning svg {
    flex-shrink: 0;
}

.alert-warning p {
    margin: 0;
    color: #ca8a04;
}

.confirm-button {
    width: 100% !important;
    margin-top: 13px;
}

.confirm-button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.notification-text {
    margin: 8px 0 0;
    color: #647195;
    text-align: center;
    font-size: 10.5px;
}
</style>