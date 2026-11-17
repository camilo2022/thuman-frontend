<script setup>
// imports
import { ref, computed, watch } from 'vue'
import { useSwalStore } from '@/stores/swalStore'
import DateTimeInput from '@/components/UI/templates/DateTimeInput.vue';

const props = defineProps({
    modelVacant: Object,
    modelApplication: Object,
    loadingData: Boolean,
    loadingExam: Boolean,
    modelExamMedical: Object,
    getData: Boolean,
    isDesist: Boolean,
    isFinished: Boolean,
    countries: Array,
    departaments: Array,
    cities: Array,
    healthEntities: Array,
    epidemiologicalPrograms: Array,
    newResult: Function,
    isPending: Boolean,
    isFinishedResult: Boolean,
    errors: {
        type: Object,
        default: () => ({}),
    }
})

const isNewResult = ref(true);
const show = ref(false);

const emit = defineEmits([
    'submitExamMedicalStore',
    'submitDepartmentFind',
    'submitCityFind',
    'submitHealthEntityFind',
    'submitExamMedicalReviewer',
    'index'
])

// store y flags UI
const swalStore = useSwalStore()
const showCV = ref(false)
const agendCollapsed = ref(true)
const localErrors = ref({})
const mergedErrors = computed(() => ({
    ...props.errors,
    ...localErrors.value
}))

// fecha mínima (hoy) para el datetime-local
const today = computed(() => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
})

// opciones selects
const estadoOptions = ref([
    { id: 'Programado', name: 'Programado' },
    { id: 'Reprogramado', name: 'Reprogramado' },
    { id: 'Desistió', name: 'Desistió' },
    { id: 'Realizado', name: 'Realizado' },
])
const resultOptions = ref([
    { id: 'Apto', name: 'Apto' },
    { id: 'Apto con recomendaciones', name: 'Apto con recomendaciones' },
    { id: 'No apto', name: 'No apto' },
    { id: 'Aplazado', name: 'Aplazado' },
])

// transiciones acordeón
function accEnter(el) {
    el.style.height = '0px'
    el.style.opacity = '0'
    el.style.overflow = 'hidden'
    requestAnimationFrame(() => {
        el.style.transition = 'height .24s ease, opacity .18s ease'
        el.style.height = el.scrollHeight + 'px'
        el.style.opacity = '1'
    })
}
function accAfterEnter(el) {
    el.style.height = ''
    el.style.transition = ''
    el.style.overflow = ''
}
function accLeave(el) {
    el.style.height = el.scrollHeight + 'px'
    el.style.opacity = '1'
    el.style.overflow = 'hidden'
    void el.offsetHeight
    el.style.transition = 'height .24s ease, opacity .18s ease'
    el.style.height = '0px'
    el.style.opacity = '0'
}

// Guardar agendamiento / cambios de estado
function onSaveExam() {
    const s = statusString.value
    if (s) props.modelExamMedical.status = s
    emit('submitExamMedicalStore', s)
}

// Resultado: Apto con recomendaciones => requiere PVE
const isAptoConRecomendaciones = computed(() =>
    (props.modelExamMedical?.result
        ? (typeof props.modelExamMedical.result === 'string'
            ? props.modelExamMedical.result
            : (props.modelExamMedical.result.name ?? props.modelExamMedical.result.id ?? '')
        )
        : ''
    ).toLowerCase() === 'apto con recomendaciones'
)

watch(isAptoConRecomendaciones, (isAptoCR) => {
    if (!isAptoCR) {
        props.modelExamMedical.pve_id = null
    }
})

watch(() => props.getData, (hasData) => {
    // Si NO hay agendamiento -> mostrar abierto para crear
    agendCollapsed.value = hasData ? true : false
}, { immediate: true })

// Guardar resultados
const saveResults = async () => {
    localErrors.value = {} // limpiar

    if (
        isAptoConRecomendaciones.value &&
        !props.modelExamMedical.epidemiological_program_id
    ) {
        localErrors.value.modelExamMedical_epidemiological_program_id = [
            'Seleccione un programa epidemiológico'
        ]
        return
    }

    emit('submitExamMedicalReviewer')
}

// “Subir nuevo resultado” (limpia temporalmente y oculta Aplazado)
function newFile() {
    props.modelExamMedical.relationships.file = null
    props.modelExamMedical.description = ''
    props.modelExamMedical.file.file = null
    props.modelExamMedical.result = 'Pendiente'
    isNewResult.value = false
    resultOptions.value = resultOptions.value.filter(opt => opt.id !== 'Aplazado')
}

// Pasar de “Realizado” a “Reprogramado”
function enable() {
    const exclude = ['Programado', 'Desistió', 'Realizado']
    estadoOptions.value = estadoOptions.value.filter(opt => !exclude.includes(opt.id))

    if (exclude.includes(props.modelExamMedical.status)) {
        props.modelExamMedical.status = 'Reprogramado'
    }
}

// Normalización
const statusString = computed(() => {
    const s = props.modelExamMedical?.status
    if (!s) return ''
    if (typeof s === 'string') return s
    return s.name ?? s.id ?? ''
})
const statusNorm = computed(() => statusString.value.toLowerCase().trim())

// Flags por estado
const isProgramado = computed(() => ['programado', 'programada'].includes(statusNorm.value))
const isReprogramado = computed(() => ['reprogramado', 'reprogramada'].includes(statusNorm.value))
const isDesistio = computed(() => ['desistió', 'desistio'].includes(statusNorm.value))
const isRealizado = computed(() => statusNorm.value === 'realizado')

// Select "Estado" SIEMPRE habilitado salvo que el proceso esté marcado como desistido globalmente
const estadoDisabled = computed(() => props.isDesist)

// Candidato y Documento SIEMPRE deshabilitados
const disableNombre = computed(() => true)
const disableDocumento = computed(() => true)

// Resto de campos del agendamiento (fecha, país, ciudad, etc.)
const fieldsDisabled = computed(() => {
    // Desistió o Realizado: bloquear todo
    if (isDesistio.value || isRealizado.value) return true
    // Programado: bloquear todo
    if (isProgramado.value) return true
    // Reprogramado: habilitar
    if (isReprogramado.value) return false
    // Por defecto: habilitar
    return false
})

// Botón Guardar
const disableGuardar = computed(() => {
    if (isProgramado.value) return true       // no se guarda "Programado"
    // En Reprogramado / Desistió / Realizado -> habilitado
    return false
})

watch(
    () => props.loadingExam,
    (nuevo, anterior) => {
        if (anterior === true && nuevo === false) {
            // Se terminó de cargar el examen médico
            isNewResult.value = true;
        }
    }
);

</script>


<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('index')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <span>Volver</span>
        </button>
        <span>|</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
            <path
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reclutamiento</span><span>|</span><span>Vacantes</span><span>|</span>
        <span>Candidatos {{ props.modelVacant.relationships?.position?.name }}</span><span>|</span>
        <span>Exámenes</span><span>|</span>
        <span class="active">Exámenes medicos</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <div class="two-pane" :class="{ 'cv-open': showCV }">
                <div class="left-pane" ref="leftPane">
                    <h2 class="titulo">Exámenes medicos</h2>
                    <div>
                        <template v-if="props.loadingExam">
                            <div class="loading-data">
                                <div class="card-skel">
                                    <!-- Header -->
                                    <div class="card-skel__header">
                                        <div class="skel skel-title" style="width: 280px; height: 28px;"></div>
                                        <div class="skel skel-circle"></div>
                                    </div>

                                    <!-- Grid 3 columnas -->
                                    <div class="card-skel__grid">
                                        <!-- Fila 1 -->
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 120px;"></div>
                                            <div class="skel skel-input"></div>
                                        </div>
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 120px;"></div>
                                            <div class="skel skel-input"></div>
                                        </div>
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 90px;"></div>
                                            <div class="skel skel-select"></div>
                                        </div>

                                        <!-- Fila 2 -->
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 80px;"></div>
                                            <div class="skel skel-input"></div>
                                        </div>
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 100px;"></div>
                                            <div class="skel skel-select"></div>
                                        </div>
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 120px;"></div>
                                            <div class="skel skel-select"></div>
                                        </div>

                                        <!-- Fila 3 -->
                                        <div class="card-skel__field card-skel__field--span2">
                                            <div class="skel skel-label" style="width: 100px;"></div>
                                            <div class="skel skel-input"></div>
                                        </div>
                                        <div class="card-skel__field">
                                            <div class="skel skel-label" style="width: 70px;"></div>
                                            <div class="skel skel-input"></div>
                                        </div>

                                        <!-- Textarea a TODO el ancho -->
                                        <div class="card-skel__field card-skel__field--full">
                                            <div class="skel skel-label" style="width: 120px;"></div>
                                            <div class="skel skel-textarea"></div>
                                            <div class="skel skel-hint" style="width: 80px;"></div>
                                        </div>

                                        <!-- Botón alineado a la derecha (ultima columna) -->
                                        <div class="card-skel__actions">
                                            <div class="skel skel-button"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="form-container agend-card" :class="{ 'is-collapsed': agendCollapsed }">
                                <div class="form-section">
                                    <div v-if="props.isDesist" class="alert alert-warning" style="margin-bottom:12px;">
                                        <div class="bg-danger" style="display:flex;gap:10px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                            </svg>
                                            <p>Este candidato está marcado como “Desistió” en el sistema. La información
                                                se
                                                muestra
                                                en
                                                lectura y no se puede continuar con la evaluación.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="section-title-row">
                                        <div class="section-title">Agendamiento de cita</div>

                                        <button v-if="props.getData && !props.isDesist" class="collapse-btn"
                                            @click="agendCollapsed = !agendCollapsed" :aria-expanded="!agendCollapsed"
                                            :title="agendCollapsed ? 'Expandir' : 'Contraer'">
                                            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                    stroke-width="1.8" />
                                                <path class="chev" :class="{ rotated: !agendCollapsed }"
                                                    d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </button>
                                    </div>

                                    <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                        <div v-if="true" v-show="!agendCollapsed" class="agend-content">
                                            <div id="agendamiento-body" class="grid-layout">
                                                <!-- Candidato (solo lectura) -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="person">Candidato</label>
                                                    <input type="text" :value="[
                                                        props.modelApplication?.relationships?.person?.first_name,
                                                        props.modelApplication?.relationships?.person?.second_name,
                                                        props.modelApplication?.relationships?.person?.first_last_name,
                                                        props.modelApplication?.relationships?.person?.second_last_name
                                                    ].filter(Boolean).join(' ')" name="person" id="person"
                                                        class="input-box disabled" placeholder="Candidato"
                                                        :disabled="disableNombre" />
                                                </div>

                                                <!-- Documento (solo lectura) -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="documento">Documento</label>
                                                    <input
                                                        :value="props.modelApplication?.relationships?.person?.document_number"
                                                        type="text" id="documento" class="input-box disabled"
                                                        :disabled="disableDocumento" />
                                                </div>

                                                <!-- Estado (siempre habilitado) -->
                                                <div class="input-group" v-if="props.getData">
                                                    <label class="label-bold" for="estado">Estado</label>
                                                    <SearchSelect id="estado" v-model="props.modelExamMedical.status"
                                                        :options="estadoOptions" optionKey="name" valueKey="id"
                                                        placeholder="Estado"
                                                        :disabled="estadoDisabled || props.isDesist || props.isFinished" />
                                                </div>

                                                <!-- Fecha -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="fecha">Fecha</label>
                                                    <DateTimeInput type="datetime-local"
                                                        v-model="props.modelExamMedical.date_time" :min="today"
                                                        :disabled="fieldsDisabled"
                                                        :class="{ 'disabled': fieldsDisabled, 'input-error': props.errors?.modelExamMedical_date_time }" />
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedical_date_time ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                </div>

                                                <!-- País -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="pais">País</label>
                                                    <SearchSelect v-model="props.modelExamMedical.country_id"
                                                        :displayFormatter="opt => `${opt.emoji} ${opt.name}`"
                                                        :options="props.countries" optionKey="name" valueKey="id"
                                                        id="country_id" placeholder="País" :disabled="fieldsDisabled"
                                                        @update:modelValue="id => (emit('submitDepartmentFind', id), emit('submitHealthEntityFind', id))"
                                                        :error="!props.modelExamMedical.country_id && props.errors?.modelExamMedical_city_id" />
                                                    <template
                                                        v-if="!props.modelExamMedical.country_id && props.errors?.modelExamMedical_city_id">
                                                        <p v-for="(msg, i) in props.errors?.modelExamMedical_city_id ?? []"
                                                            :key="'type-' + i" class="error-text">
                                                            {{ msg }}
                                                        </p>
                                                    </template>
                                                </div>

                                                <!-- Departamento -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="departamento">Departamento</label>
                                                    <SearchSelect v-model="props.modelExamMedical.departament_id"
                                                        :options="props.departaments" optionKey="name" valueKey="id"
                                                        id="departament_id" placeholder="Departamento"
                                                        :disabled="fieldsDisabled"
                                                        @update:modelValue="id => emit('submitCityFind', id)"
                                                        :error="!props.modelExamMedical.departament_id && props.errors?.modelExamMedical_city_id" />
                                                    <template
                                                        v-if="!props.modelExamMedical.departament_id && props.errors?.modelExamMedical_city_id">
                                                        <p v-for="(msg, i) in props.errors?.modelExamMedical_city_id ?? []"
                                                            :key="'type-' + i" class="error-text">
                                                            {{ msg }}
                                                        </p>
                                                    </template>
                                                </div>

                                                <!-- Ciudad -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="ciudad">Ciudad</label>
                                                    <SearchSelect v-model="props.modelExamMedical.city_id"
                                                        :options="props.cities" optionKey="name" valueKey="id"
                                                        id="city_id" placeholder="Ciudad" :disabled="fieldsDisabled"
                                                        :error="!!props.errors?.modelExamMedical_city_id" />
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedical_city_id ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                </div>

                                                <!-- Entidad -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="entidad">Entidad</label>
                                                    <SearchSelect v-model="props.modelExamMedical.health_entity_id"
                                                        :options="props.healthEntities ?? []" optionKey="name"
                                                        valueKey="id" id="health_entity_id"
                                                        placeholder="Entidad de salud" :disabled="fieldsDisabled"
                                                        :error="!!props.errors?.modelExamMedical_health_entity_id" />
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedical_health_entity_id ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                </div>

                                                <!-- Dirección -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="direccion">Dirección</label>
                                                    <input type="text" id="direccion" class="input-box"
                                                        maxlength="75"
                                                        v-model="props.modelExamMedical.address" placeholder="Dirección"
                                                        :disabled="fieldsDisabled"
                                                        :class="{ 'disabled': fieldsDisabled, 'input-error': props.errors?.modelExamMedical_address }" />
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedical_address ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                </div>

                                                <!-- Barrio -->
                                                <div class="input-group">
                                                    <label class="label-bold" for="barrio">Barrio</label>
                                                    <input type="text" id="barrio" class="input-box"
                                                        maxlength="50"
                                                        v-model="props.modelExamMedical.neighborhood"
                                                        placeholder="Barrio" :disabled="fieldsDisabled"
                                                        :class="{ 'disabled': fieldsDisabled, 'input-error': props.errors?.modelExamMedical_neighborhood }" />
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedical_neighborhood ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                </div>
                                            </div>

                                            <!-- Indicación -->
                                            <div class="input-group" style="margin-top: 10px;">
                                                <label class="label-bold" for="description">Indicación
                                                    (Opcional)</label>
                                                <div class="textarea-wrapper">
                                                    <textarea id="description" class="text-area"
                                                        v-model="props.modelExamMedical.indication"
                                                        placeholder="Indicaciones" maxlength="500"
                                                        :disabled="fieldsDisabled"
                                                        :class="{ 'disabled': fieldsDisabled, 'input-error': props.errors?.modelExamMedical_indication }" />
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedical_indication ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                    <div class="char-limit-text">
                                                        ({{ (props.modelExamMedical.indication ||
                                                            '').length }}/500)</div>
                                                </div>
                                            </div>
                                            <div class="form-buttons" v-if="!props.isDesist && !props.isFinished">
                                                <button class="btn-primary" @click="onSaveExam"
                                                    :disabled="disableGuardar">Guardar</button>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>
                            <template v-if="props.isFinished">
                                <div style="margin-top:12px;" ref="resultsCard">
                                    <div class="form-container">
                                        <div class="section-title-row">
                                            <div class="section-title">Resultados del examen</div>
                                        </div>

                                        <div class="grid-two" :class="[props.isFinishedResult || !props.isPending && isNewResult ? 'has-preview' : 'no-preview',
                                        { 'with-pve': isAptoConRecomendaciones }
                                        ]">
                                            <!-- Resultado -->
                                            <div class="input-group area-resultado">
                                                <label class="label-bold" for="resultado">Resultado</label>
                                                <SearchSelect id="resultado" v-model="props.modelExamMedical.result"
                                                    :options="resultOptions" optionKey="name" valueKey="id"
                                                    :disabled="!props.isPending && isNewResult"
                                                    placeholder="Selecciona un resultado"
                                                    :error="!!props.errors?.modelExamMedicalReviewer_result" />
                                                <p v-for="(msg, i) in props.errors?.modelExamMedicalReviewer_result ?? []"
                                                    :key="'type-' + i" class="error-text">
                                                    {{ msg }}
                                                </p>
                                            </div>

                                            <div class="input-group area-pve" v-if="isAptoConRecomendaciones">
                                                <label class="label-bold" for="pve">PVE</label>
                                                <SearchSelect
                                                    v-model="props.modelExamMedical.epidemiological_program_id"
                                                    :options="epidemiologicalPrograms" optionKey="name" valueKey="id"
                                                    :disabled="props.isFinishedResult" name="pve_id" id="pve_id"
                                                    placeholder="Seleccionar"
                                                    :error="!!props.errors?.modelExamMedical_epidemiological_program_id" />
                                                <p v-for="(msg, i) in props.errors?.modelExamMedical_epidemiological_program_id ?? []"
                                                    :key="'type-' + i" class="error-text">
                                                    {{ msg }}
                                                </p>
                                            </div>
                                            <!-- Archivo (preview, arriba derecha solo en Aplazado + archivo) -->
                                            <div class="input-group area-archivo"
                                                v-if="!props.isPending && isNewResult">
                                                <label class="label-bold">Archivo</label>
                                                <div class="input-box" style="font-size:14px; max-height:37.5px;">
                                                    <div class="preview-file"
                                                        style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                                                        <div
                                                            style="align-items: center; text-align: center; display: flex;">
                                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg"
                                                                width="32" height="32" fill="currentColor"
                                                                viewBox="0 0 256 256">
                                                                <path
                                                                    d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                            </svg>
                                                            <span style="font-size:14px;">{{
                                                                props.modelExamMedical.relationships?.file?.name
                                                            }}</span>
                                                        </div>
                                                        <Button title="Previsualizar" icon="preview"
                                                            variant="transparent" @click="show = true" />
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Subir archivo -->
                                            <div v-else class="input-group area-subir">
                                                <label class="label-bold" for="archivo">Resultados examen</label>
                                                <FileUpload v-model="props.modelExamMedical.file.file" id="file"
                                                    name="file" :multiple="false" accept="application/pdf"
                                                    :error="!!props.errors?.modelExamMedicalReviewer_file" />
                                                <p v-for="(msg, i) in props.errors?.modelExamMedicalReviewer_file ?? []"
                                                    :key="'type-' + i" class="error-text">
                                                    {{ msg }}
                                                </p>
                                            </div>

                                            <!-- Descripción -->
                                            <div class="input-group area-descripcion">
                                                <label class="label-bold" for="obs">Descripción</label>
                                                <div class="textarea-wrapper">
                                                    <textarea id="obs" class="text-area" maxlength="500"
                                                        :class="{ 'disabled': !props.isPending && isNewResult, 'input-error': props.errors?.modelExamMedicalReviewer_description }"
                                                        :disabled="!props.isPending && isNewResult"
                                                        v-model="props.modelExamMedical.description"
                                                        placeholder="Descripción">
                                                    </textarea>
                                                    <p v-for="(msg, i) in props.errors?.modelExamMedicalReviewer_description ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                    <div class="char-limit-text">
                                                        ({{ (props.modelExamMedical.description ||
                                                            '').length }}/500)</div>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="form-buttons">
                                            <!-- Siempre mostrar VOLVER -->
                                            <RouterLink :to="{ name: 'RecruitmentScheduleExamMedical' }">
                                                <button class="btn-secondary">
                                                    Volver
                                                </button>
                                            </RouterLink>

                                            <!-- Si el resultado cargado es APLAZADO y ya hay archivo => permitir reiniciar carga -->
                                            <button v-if="!props.isFinishedResult && !props.isPending && isNewResult"
                                                class="btn-primary" @click="newFile">
                                                Subir nuevo resultado
                                            </button>

                                            <!-- Si NO hay archivo (estado inicial o tras 'Subir nuevo resultado') => permitir GUARDAR -->
                                            <button v-else-if="!props.isFinishedResult" class="btn-primary"
                                                @click="saveResults">
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <PDFPreview :show="show" :pdfUrl="props.modelExamMedical.relationships?.file?.path"
        :pdfName="props.modelExamMedical.relationships?.file?.name" @close="show = false" />
</template>

<style scoped>
/* Panel derecho */
.panel-test-right {
    padding: 20px 24px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
}

/* Encabezado */
.test-detail-header {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 30px;
}

.test-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
}

.test-subtitle {
    font-size: 12px;
    color: #777;
    margin: 4px 0 0 0;
}




.test-grid-container {
    display: grid;
    grid-template-columns: 20% 80%;
    /* cercano a 20/80, un poco más cómodo */
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    overflow: hidden;
    /* aplica el radius a los hijos */
    background: #fff;
}

/* Panel izquierdo (morado) */
.panel-test-left {
    background: var(--brand);
    color: var(--text-on-brand);
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Encabezado centrado */
.panel-test-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
    padding: 8px 6px 12px;
}

/* Jerarquía visual */
.panel-test-left h3 {
    margin: 0;
    font-size: 1.05rem;
    /* ~16-17px */
    font-weight: 700;
    line-height: 1.1;
}

.panel-test-left h4 {
    margin: 0;
    font-size: .9rem;
    font-weight: 700;
    opacity: .95;
}

.panel-test-left h2 {
    margin: 2px 0 0 0;
    font-size: 2.2rem;
    /* número grande */
    font-weight: 800;
    letter-spacing: .2px;
}

.panel-test-left p {
    margin: 0;
    font-size: .8rem;
    opacity: .9;
}

/* Separador sutil opcional para el body */
.panel-test-left-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* Estilo base de cada item */
.test-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    /* radio normal */
    font-size: .9rem;
    cursor: pointer;
    transition: all .25s ease;
    background: transparent;
    color: #fff;
}

/* Hover */
.test-item:hover {
    background: rgba(234, 230, 255, 0.2);
}

/* Activo */
.test-item.active {
    background: #EAE6FF;
    color: #5B4CD0;
    border-bottom-right-radius: 90px;
    /* la curva grande */
    font-weight: 600;
}

/* Icono check */
.test-item .check {
    color: #28c840;
    /* verde */
    font-weight: bold;
}

/* Panel derecho (contenido) */
.panel-test-right {
    padding: 16px;
    background: #fff;
}

/* Hover/Focus del contenedor (opcional) */
.test-grid-container:focus-within,
.test-grid-container:hover {
    box-shadow: 0 6px 18px rgba(91, 76, 208, 0.12);
    border-color: #DACFFF;
}

/* Responsivo */
@media (max-width: 900px) {
    .test-grid-container {
        grid-template-columns: 1fr;
        /* apilado */
    }

    .panel-test-left {
        padding: 18px 16px;
    }
}

/* Contenedor principal */
.form-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #E3DFFF;
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Títulos */
.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
}

/* Layouts */

.grid-layout {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(3, 1fr);
}

/* padre: 2 columnas (izq / der) */
.grid-layout-th {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
}

/* cada columna apila sus bloques */
.grid-col {
    display: grid;
    grid-auto-rows: min-content;
}

/* subgrid de 3 columnas para vive + salario */
.grid-trio {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 3 columnas iguales */
    gap: 16px;
}

/* inputs a ancho completo */

/* responsive: apilar */
@media (max-width: 992px) {
    .grid-layout-th {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 720px) {
    .grid-trio {
        grid-template-columns: 1fr;
    }

    /* los 3 se apilan */
}

.grid-layout .input-group {
    flex: 1;
}


/* Indentar contenido en card */

/* Responsive */
@media (max-width:1024px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width:768px) {

    .grid-layout {
        grid-template-columns: 1fr;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-interview {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
}

.grid-interview.one-col {
    grid-template-columns: 1fr;
}

.form-container p {
    font-size: 14px;
}

.form-container strong {
    font-weight: 600;
    font-size: 14px;
    color: #898A8B;
    display: inline-block;
    min-width: 60px;
}

/* Header del bloque con botón a la derecha */
.section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

/* Botón circular con chevron */
.collapse-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.collapse-btn svg {
    display: block;
}

.collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

/* Cuando está expandido, rota el chevron para apuntar hacia abajo */
.collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

/* (Opcional) Hover sutil */
.collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity .18s ease, transform .24s ease;
}

/* El propio contenedor (card) también transiciona sutilmente */
.agend-card {
    transition: padding .22s ease, margin .22s ease, box-shadow .22s ease, border-color .22s ease, background-color .22s ease;
}

/* Cuando está colapsado: menos padding inferior, sombra más sutil, borde un pelín más claro */
.agend-card.is-collapsed {
    padding-bottom: 12px;
    /* antes tenía 20px */
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}


/* --- Tarjeta del cuestionario --- */
.exam-card {
    width: min(880px, 96%);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 14px;
    align-items: flex-start;
    border: 1px solid #e6ddff;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(91, 76, 208, .08);
    padding: 16px;
}

.exam-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: #5b4cd0;
    background: #f3efff;
    border: 1px solid #ebe9ff;
}

.exam-main {
    display: flex;
    flex-direction: column;
}

.exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.exam-title {
    margin: 0;
    color: #111827;
    font: 700 18px/1.2 Poppins, ui-sans-serif;
}

.exam-subtitle {
    color: #6b7280;
    font-size: 12px;
    margin-top: 2px;
    text-align: start;
}

.exam-tag {
    align-self: flex-start;
    background: #f3efff;
    color: #5b4cd0;
    border: 1px solid #e6ddff;
    border-radius: 5px;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 10px;
}

.exam-sep {
    border: 0;
    height: 1px;
    background: #efeaff;
    margin: 4px 0 0;
    width: 100%;
}

.exam-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 6px;
}

.meta-item {
    text-align: left;
}

.meta-label {
    display: block;
    color: #6b7280;
    font-size: 13px;
}

.meta-value {
    color: #111827;
    font-size: 13px;
}

@media (max-width: 640px) {
    .exam-card {
        grid-template-columns: 1fr;
    }

    .exam-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .exam-meta {
        grid-template-columns: 1fr;
    }
}

.btn-primary:disabled,
.btn-primary[disabled] {
    opacity: .5;
    /* se ve “apagado” */
    cursor: not-allowed;
    /* cursor invalido */
    filter: grayscale(10%);
    /* leve desaturación */
    box-shadow: none;
    /* sin sombra activa */
    pointer-events: none;
    /* evita hovers fantasma */
}

.grid-two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
}

/* Áreas */
.area-resultado {
    grid-area: resultado;
}

.area-pve {
    grid-area: pve;
}

.area-archivo {
    grid-area: archivo;
}

.area-descripcion {
    grid-area: descripcion;
}

.area-subir {
    grid-area: subir;
}

/* Cuando hay PVE + NO hay preview de archivo */
.grid-two.no-preview.with-pve {
    grid-template-areas:
        "resultado pve"
        "descripcion subir";
}

/* Cuando hay PVE + SÍ hay preview de archivo */
.grid-two.has-preview.with-pve {
    grid-template-areas:
        "resultado pve"
        "descripcion archivo";
}

/* (ya existentes, por compatibilidad cuando NO hay PVE) */
.grid-two.no-preview:not(.with-pve) {
    grid-template-areas:
        "resultado  subir"
        "descripcion subir";
}

.grid-two.has-preview:not(.with-pve) {
    grid-template-areas:
        "resultado  archivo"
        "descripcion subir";
}


.input-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px 0.5px #d3d3d3;
    box-shadow: 0 2px 6px #d3d3d3;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    outline: none;
    justify-content: space-between;
    border: 1px solid #e6e6e6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.preview-file svg {
    color: red;
}

.action-icon svg {
    color: #5b4cd0;
}

.bg-danger {
    background-color: #ffc4c4;
    color: #ca0404;
    border: 2px solid #ca0404;
    padding: 5px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 500;
    align-items: center;
}

/* Nuevo: cuando hay PVE, mostrar Archivo + Subir debajo de PVE */
/* Modo normal: dos columnas */
.grid-two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
}

/* MODO PVE (Apto con recomendaciones): columna doble vertical */
/* MODO PVE: cuando es “Apto con recomendaciones” */
.grid-two.with-pve {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        "resultado pve"
        "archivo archivo"
        "subir subir"
        "descripcion descripcion";
}

/* MODO PVE sin archivo previo */
.grid-two.with-pve.no-preview {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        "resultado pve"
        "subir subir"
        "descripcion descripcion";
}

.grid-two.has-preview.with-pve {
    grid-template-areas:
        "resultado pve"
        "descripcion archivo"
        "descripcion subir";
}

/* ===== Card base ===== */
.card-skel {
    border: 1px solid #f3f3f3;
    background: #fff;
    border-radius: 12px;
    padding: 18px 18px 12px;
    box-shadow: 0 0 0 1px rgba(91, 76, 208, .03) inset;
}

/* ===== Header ===== */
.card-skel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.skel-title {
    border-radius: 10px;
}

/* ===== Grid: 3 columnas ===== */
.card-skel__grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* 3 cols */
    gap: 16px 18px;
}

.card-skel__field {}

.card-skel__field--span2 {
    grid-column: span 2;
}

/* ocupa 2 columnas */
.card-skel__field--full {
    grid-column: 1 / -1;
}

/* ocupa todas */

.card-skel__actions {
    grid-column: 3 / 4;
    /* botón en la 3ra columna */
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* ===== Shimmer (paleta tuya) ===== */
@keyframes skel-shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.skel {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: skel-shimmer 1.2s ease-in-out infinite;
}

/* ===== Variantes de tamaño ===== */
.skel-circle {
    width: 32px;
    height: 32px;
    border-radius: 999px;
}

.skel-label {
    height: 12px;
    border-radius: 6px;
    margin-bottom: 8px;
}

.skel-input,
.skel-select {
    height: 44px;
    border-radius: 10px;
    border: 1px solid #eeeaff;
}

.skel-select {
    position: relative;
}

.skel-select::before {
    content: "";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: rgba(0, 0, 0, .06);
}

.skel-textarea {
    height: 160px;
    border-radius: 12px;
    border: 1px solid #eeeaff;
}

.skel-hint {
    height: 10px;
    margin-top: 6px;
    border-radius: 6px;
}

.skel-button {
    width: 130px;
    height: 44px;
    border-radius: 999px;
    border: 1px solid #e1d9ff;
}

/* ===== Responsive ===== */
@media (max-width:1200px) {
    .card-skel__grid {
        grid-template-columns: 1fr 1fr;
    }

    /* 2 cols */
    .card-skel__actions {
        grid-column: 2 / 3;
    }
}

@media (max-width:680px) {
    .card-skel__grid {
        grid-template-columns: 1fr;
    }

    /* 1 col */
    .card-skel__actions {
        grid-column: 1 / 2;
    }

    .skel-button {
        width: 100%;
    }
}
</style>