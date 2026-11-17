<script setup>
import { ref, computed, watch } from 'vue'
import { useSwalStore } from '@/stores/swalStore'
import DateTimeInput from '@/components/UI/templates/DateTimeInput.vue'
// si tu template tiene varios roots, evita herencia implícita de attrs
defineOptions({ inheritAttrs: false })

// declara los props que recibes
const props = defineProps({
    modelVacant: Object,
    modelApplication: Object,
    loadingData: Boolean,
    modelInterviewPsychotechnical: Object,
    getData: Boolean,
    isDesist: Boolean,
    isFinished: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const minDateTime = computed(() => {
    const d = new Date()
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
})

const emit = defineEmits([
    'submitInterviewInitialStore',
    'submitInterviewInitialPsychotechnical',
    'index'
])

const swalStore = useSwalStore()

// mock data
const registros = ref([
    { id: 1, postulante: 'Ana María Pérez', identificacion: '1012345678', entidad: 'Coguasimales - Sede Centro', sede: 'Sede Centro', direccion: 'Cra 7 #12-34, Bogotá', hasAppointment: true, status: 'Programada', date: '2025-09-05', evaluaciones: { th: { done: false, rating: null, comments: '' } } },
    { id: 2, postulante: 'Carlos Rodríguez', identificacion: '1022334455', entidad: 'Coguasimales - Sede Norte', sede: 'Sede Norte', direccion: 'Av. 19 #120-45, Bogotá', hasAppointment: false, status: null, date: null, evaluaciones: { th: { done: false, rating: null, comments: '' } } },
    { id: 3, postulante: 'María Fernanda López', identificacion: '1033344455', entidad: 'Coguasimales - Sede Occidente', sede: 'Sede Occidente', direccion: 'Cll 80 #72-10, Bogotá', hasAppointment: true, status: 'Programada', date: '2025-09-10', evaluaciones: { th: { done: false, rating: null, comments: '' } } },
    { id: 4, postulante: 'Julián Andrés Torres', identificacion: '1045566778', entidad: 'Coguasimales - Sede Centro', sede: 'Sede Centro', direccion: 'Cra 7 #12-34, Bogotá', hasAppointment: true, status: 'Reprogramada', date: '2025-09-12', evaluaciones: { th: { done: false, rating: 5, comments: 'Excelente actitud, competencias blandas destacadas.' } } },
    { id: 5, postulante: 'Luisa Fernanda García', identificacion: '1056677889', entidad: 'Coguasimales - Sede Norte', sede: 'Sede Norte', direccion: 'Av. 19 #120-45, Bogotá', hasAppointment: true, status: 'Programada', date: '2025-09-15', evaluaciones: { th: { done: true, rating: 4, comments: 'Comentarios de TH' } } }
])

// seleccionado
const selectedRecordId = ref(2)
const currentRecord = computed(() => registros.value.find(r => r.id === selectedRecordId.value))

// fecha form
const fechaEntrevista = ref('')
const today = computed(() => new Date().toISOString().slice(0, 10))

// opciones estado
const estadoOptions = [
    { id: 'Programado', name: 'Programado' },
    { id: 'Reprogramado', name: 'Reprogramado' },
    { id: 'Desistió', name: 'Desistió' },
    { id: 'Realizado', name: 'Realizado' }
]

const compatibilityClass = (status) => {
    if (status == 'Aprobado') return 'badge--success'
    if (status == 'Rechazado') return 'badge--danger'
    return 'badge--danger'
}

// sync fecha al cambiar registro
watch(
    currentRecord,
    rec => { fechaEntrevista.value = rec?.hasAppointment && rec?.date ? rec.date : '' },
    { immediate: true }
)
// refs del FORM
const ratingTH = ref(0)
const thComments = ref('')

// resetea/precarga form al cambiar de registro
watch(currentRecord, rec => {
    if (!rec) return
    if (rec.evaluaciones?.th?.done) {
        ratingTH.value = Number(rec.evaluaciones.th.rating || 0)
        thComments.value = rec.evaluaciones.th.comments || ''
    } else {
        ratingTH.value = 0
        thComments.value = ''
    }
}, { immediate: true })


const agendCollapsed = ref(false)
watch(currentRecord, rec => { agendCollapsed.value = !!rec?.hasAppointment && !!rec?.date }, { immediate: true })

// transiciones
function accEnter(el) {
    el.style.height = '0px'; el.style.opacity = '0'; el.style.overflow = 'hidden'
    requestAnimationFrame(() => {
        el.style.transition = 'height .24s ease, opacity .18s ease'
        el.style.height = el.scrollHeight + 'px'
        el.style.opacity = '1'
    })
}
function accAfterEnter(el) { el.style.height = ''; el.style.transition = ''; el.style.overflow = '' }
function accLeave(el) {
    el.style.height = el.scrollHeight + 'px'; el.style.opacity = '1'; el.style.overflow = 'hidden'
    void el.offsetHeight
    el.style.transition = 'height .24s ease, opacity .18s ease'
    el.style.height = '0px'
    el.style.opacity = '0'
}

// 👇 helper para normalizar el valor del estado (string u objeto)
const statusId = computed(() => {
    const s = props.modelInterviewPsychotechnical?.status
    if (!s) return null
    return typeof s === 'string' ? s : (s.id ?? s.name ?? null)
})

const editableStatuses = ['Reprogramado', 'Desistió', 'Realizado']
const isEditableByStatus = computed(() => editableStatuses.includes(statusId.value))

// Guardar (emite el estado actual normalizado)
function onSaveInterview() {
    const st = statusId.value
    // fuerza a string en el modelo por si venía como objeto
    if (st) props.modelInterviewPsychotechnical.status = st

    // (opcional) si quieres exigir fecha solo cuando reprograma:
    // if (st === 'Reprogramado' && !props.modelInterviewPsychotechnical.date_time) return

    emit('submitInterviewInitialStore', st) // 'Reprogramado' o 'Desistió' (o lo que haya)
}

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
        <span>Entrevista</span><span>|</span>
        <span class="active">Entrevista psicotécnica</span>
    </div>

    <div class="container-data">
        <div class="main-container">

            <h2 class="titulo">Entrevista psicotécnica</h2>
            <div v-if="props.loadingData" class="loading-data">
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

                        <!-- Botón alineado a la derecha (ultima columna) -->
                        <div class="card-skel__actions">
                            <div class="skel skel-button"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="form-container agend-card" :class="{ 'is-collapsed': props.getData }">
                <div v-if="props.isDesist" class="alert alert-warning" style="margin-bottom:12px;">
                    <div class="bg-danger" style="display:flex;gap:10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                        </svg>
                        <p>Este candidato está marcado como “Desistió” en el sistema. La información se muestra
                            en
                            lectura y no se puede continuar con la evaluación.
                        </p>
                    </div>
                </div>
                <div class="form-section">
                    <div class="section-title-row">
                        <div class="section-title">Agendamiento de entrevista</div>

                        <button v-if="props.getData && !props.isDesist" class="collapse-btn"
                            @click="agendCollapsed = !agendCollapsed" :aria-expanded="!agendCollapsed"
                            :title="agendCollapsed ? 'Expandir' : 'Contraer'">
                            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0" stroke-width="1.8" />
                                <path class="chev" :class="{ rotated: !agendCollapsed }" d="M10 8 L14 12 L10 16"
                                    fill="none" stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                        <div v-if="currentRecord" v-show="!agendCollapsed" class="agend-content">
                            <p v-if="props.errors?.interviewPsychotechnical_application_id" class="error-text">
                                {{ props.errors?.interviewPsychotechnical_application_id[0] }}
                            </p>
                            <div id="agendamiento-body" class="grid-layout">
                                <!-- Precargados (deshabilitados) -->
                                <div class="input-group" v-if="props.modelApplication?.relationships?.person">
                                    <label class="label-bold" for="postulante">Candidato</label>
                                    <input type="text" :value="[
                                        props.modelApplication?.relationships?.person?.first_name,
                                        props.modelApplication?.relationships?.person?.second_name,
                                        props.modelApplication?.relationships?.person?.first_last_name,
                                        props.modelApplication?.relationships?.person?.second_last_name
                                    ].filter(Boolean).join(' ')" name="person" id="person" class="input-box disabled"
                                        placeholder="Candidato" :disabled="true" />
                                </div>

                                <div class="input-group" v-if="props.modelApplication?.relationships?.person">
                                    <label class="label-bold" for="identificacion">Identificación</label>
                                    <input type="text" id="identificacion" class="input-box disabled"
                                        :value="props.modelApplication.relationships.person.document_number"
                                        disabled></input>
                                </div>

                                <!-- Estado (solo si el registro ya tiene agendamiento) -->
                                <div class="input-group" v-if="props.getData">
                                    <label class="label-bold" for="estado">Estado</label>
                                    <SearchSelect id="estado" v-model="props.modelInterviewPsychotechnical.status"
                                        :options="estadoOptions" :disabled="isDesist || isFinished" optionKey="name"
                                        valueKey="id" placeholder="Estado" />
                                </div>

                                <div class="input-group" v-if="props.modelVacant?.relationships?.headquarter">
                                    <label class="label-bold" for="entidad">Entidad</label>
                                    <input type="text" id="entidad" class="input-box disabled"
                                        :value="props.modelVacant.relationships.headquarter.entity.name" disabled>
                                </div>

                                <div class="input-group" v-if="props.modelVacant?.relationships?.headquarter">
                                    <label class="label-bold" for="sede">Sede</label>
                                    <input type="text" id="sede" class="input-box disabled"
                                        :value="props.modelVacant.relationships.headquarter.name" disabled>
                                </div>

                                <div class="input-group" v-if="props.modelVacant?.relationships?.headquarter">
                                    <label class="label-bold" for="direccion">Dirección</label>
                                    <input type="text" id="direccion" class="input-box disabled"
                                        :value="props.modelVacant.relationships.headquarter.address" disabled>
                                </div>

                                <!-- Fecha (NO se precarga) -->
                                <div class="input-group">
                                    <label class="label-bold" for="fecha">Fecha</label>
                                    <DateTimeInput id="fecha" v-model="props.modelInterviewPsychotechnical.date_time"
                                        :error="props.errors?.interviewPsychotechnical_date_time?.length" :class="{
                                            disabled: props.getData && (props.isDesist || props.isFinished),
                                        }" :disabled="props.getData && (props.isDesist || props.isFinished)"
                                        :min="minDateTime" placeholder="Fecha" />
                                    <p v-for="(msg, i) in props.errors?.interviewPsychotechnical_date_time ?? []"
                                        :key="'type-' + i" class="error-text">
                                        {{ msg }}
                                    </p>
                                </div>
                            </div>
                            <div class="input-group full-width">
                                <label class="label-bold" for="indication">Indicación (Opcional)</label>
                                <div class="textarea-wrapper">
                                    <textarea v-model="props.modelInterviewPsychotechnical.indication" name="indication"
                                        id="indication" placeholder="Indicación"
                                        :disabled="getData && props.modelInterviewPsychotechnical.status != 'Reprogramado'"
                                        :class="{ disabled: getData && props.modelInterviewPsychotechnical.status != 'Reprogramado' }"
                                        maxlength="2000" class="text-area"></textarea>
                                    <div class="char-limit-text">({{ (props.modelInterviewPsychotechnical.indication
                                        ||
                                        '').length }}/2000)</div>
                                </div>
                            </div>
                            <template v-if="!props.isDesist && !props.isFinished">
                                <div class="form-buttons">
                                    <button class="btn-primary" @click="onSaveInterview"
                                        :disabled="props.getData && !isEditableByStatus">
                                        Guardar
                                    </button>
                                </div>
                            </template>
                        </div>
                    </transition>
                </div>

            </div>

            <!-- Evaluación (solo TH) -->
            <template v-if="props.getData && props.isFinished && !props.isDesist">
                <div class="form-container" style="margin-top:12px;">
                    <div class="form-section">
                        <div class="section-title">Evaluación de entrevista</div>

                        <!-- Si TH ya evaluó: número, estrellas y comentario -->
                        <div v-if="props.modelInterviewPsychotechnical.psychologist_id" class="leader-summary">
                            <div class="leader-score">
                                <div class="leader-score-title">Puntuación del candidato</div>
                                <div class="leader-score-number">{{
                                    props.modelInterviewPsychotechnical.psychologist_score }}</div>
                                <div class="stars-lg">
                                    <span v-for="n in [1, 2, 3, 4, 5]" :key="'ldr-sum' + n">
                                        <svg class="star"
                                            :class="{ active: props.modelInterviewPsychotechnical.psychologist_score >= n }"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 256 256">
                                            <path v-if="props.modelInterviewPsychotechnical.psychologist_score >= n"
                                                d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                            <path v-else
                                                d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div class="summary-columns">
                                <div class="summary-box">
                                    <div class="summary-subtitle">Comentarios de talento humano</div>
                                    <p class="summary-text">{{
                                        props.modelInterviewPsychotechnical.psychologist_observation }}</p>
                                    <div class="summary-subtitle">Estado</div>
                                    <p class="summary-text"><span class="badge"
                                            :class="compatibilityClass(props.modelInterviewPsychotechnical.psychologist_status)">
                                            {{ props.modelInterviewPsychotechnical.psychologist_status }}
                                        </span></p>
                                </div>
                            </div>
                        </div>

                        <!-- Si TH no ha evaluado: formulario -->
                        <div v-else>
                            <div class="input-group">
                                <label class="label-bold" for="description">Comentarios de talento humano</label>
                                <div class="textarea-wrapper">
                                    <textarea id="description"
                                        :class="{ disabled: props.modelInterviewPsychotechnical.psychologist_id, 'input-error': props.errors?.interviewPsychotechnical_psychologist_observation }"
                                        :disabled="props.modelInterviewPsychotechnical.psychologist_id"
                                        v-model="props.modelInterviewPsychotechnical.psychologist_observation"
                                        class="text-area" placeholder="Comentarios de talento humano"
                                        maxlength="500"></textarea>
                                    <p v-for="(msg, i) in props.errors?.interviewPsychotechnical_psychologist_observation ?? []"
                                        :key="'type-' + i" class="error-text">
                                        {{ msg }}
                                    </p>
                                    <div class="char-limit-text">
                                        ({{ (props.modelInterviewPsychotechnical.psychologist_observation ||
                                            '').length }}/500)</div>
                                </div>
                            </div>

                            <strong>Puntuación</strong>
                            <div class="skill-star-item"
                                :class="{ 'input-error': props.errors?.interviewPsychotechnical_psychologist_score }">
                                <div class="skill-star-left">
                                    <div class="valoracion">
                                        <template v-if="props.modelInterviewPsychotechnical.psychologist_id">
                                            <span v-for="n in [5, 4, 3, 2, 1]" :key="'ro-' + n" style="padding:4px">
                                                <svg class="star"
                                                    :class="{ active: props.modelInterviewPsychotechnical.psychologist_score >= n }"
                                                    viewBox="0 0 256 256" width="24" height="24">
                                                    <path
                                                        d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                </svg>
                                            </span>
                                        </template>
                                        <template v-else>
                                            <button v-for="n in [5, 4, 3, 2, 1]" :key="n"
                                                @click="props.modelInterviewPsychotechnical.psychologist_score = n">
                                                <svg class="star"
                                                    :class="{ active: props.modelInterviewPsychotechnical.psychologist_score >= n }"
                                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 256 256">
                                                    <path
                                                        v-if="props.modelInterviewPsychotechnical.psychologist_score >= n"
                                                        d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                    <path v-else
                                                        d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                </svg>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <p v-for="(msg, i) in props.errors?.interviewPsychotechnical_psychologist_score ?? []"
                                :key="'type-' + i" class="error-text">
                                {{ msg }}
                            </p>
                            <div class="form-buttons" v-if="!props.modelInterviewPsychotechnical.psychologist_id">
                                <button class="btn-outline btn-danger-light"
                                    @click="emit('submitInterviewInitialPsychotechnical', 'Rechazado')"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                        </path>
                                    </svg>No aprobar</button>
                                <button class="btn-outline btn-success-light"
                                    @click="emit('submitInterviewInitialPsychotechnical', 'Aprobado')"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                        </path>
                                    </svg> Aprobar</button>
                            </div>
                            <div v-else>
                                <strong>Estado</strong>
                                <div>
                                    <span class="badge"
                                        :class="compatibilityClass(props.modelInterviewPsychotechnical.psychologist_status)">
                                        {{ props.modelInterviewPsychotechnical.psychologist_status }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.empresa-container {
    padding: 30px;
    background-color: #ffffff;
}

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

.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.agend-content {
    display: grid;
    gap: 8px 12px;
}

/* Layout del agendamiento */
.grid-layout {
    display: grid;
    gap: 8px 12px;
    grid-template-columns: repeat(3, 1fr);
}

.grid-layout .input-group {
    flex: 1;
}

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

/* Estrellas (form) */
.valoracion {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 1px;
}

.valoracion button {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
}

.valoracion .star {
    width: 28px;
    height: 28px;
    fill: #5f5050;
    transition: fill 0.3s, transform 0.3s;
}

.valoracion:not(.readonly) button:hover~button .star,
.valoracion:not(.readonly) button:hover .star {
    fill: #ffa400;
    transform: rotate(72deg);
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
}

/* Header bloque + colapso */
.section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

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

.collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

.collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

.collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

/* Card estado colapsado */
.agend-card {
    transition: padding .22s ease, margin .22s ease, box-shadow .22s ease, border-color .22s ease, background-color .22s ease;
}

.agend-card.is-collapsed {
    padding-bottom: 12px;
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}

/* Resumen TH */
.leader-summary {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid #E3DFFF;
    border-radius: 10px;
    background: #fff;
}

.leader-score-title {
    text-align: center;
    color: #5B4CD0;
    font-weight: 600;
}

.leader-score-number {
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    color: #5B4CD0;
    line-height: 1;
    margin: 4px 0;
}

.stars-lg {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;
}

.stars-lg .star {
    fill: #D1D5DB;
    /* estrella vacía */
    transition: fill .2s ease;
    width: 28px;
    height: 28px;
}

.stars-lg .star.active {
    fill: #FFA400;
    /* estrella llena */
}

/* Contenedor de la sección de estrellas del form */
.skill-star-item {
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.skill-star-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.summary-box {
    border: 1px solid #E3DFFF;
    background: #fff;
    border-radius: 8px;
    padding: 12px 14px;
}

.summary-subtitle {
    color: #898A8B;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}

.summary-text {
    padding: 0 10px 0 10px;
    color: #2b2c34;
    line-height: 1.6;
    white-space: pre-wrap;
    font-weight: 500;
    font-size: 14px;
    /* respeta saltos de línea */
}

.btn-group {
    display: flex;
    gap: 12px;
}

.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

/* ❌ Botón rojo suave */
.btn-danger-light {
    background-color: #fde8e8;
    color: #e74c3c;
    border-color: #f8d7da;
}

.btn-danger-light:hover {
    background-color: #f8d7da;
    transform: scale(1.03);
}

/* ✅ Botón verde suave */
.btn-success-light {
    background-color: #e6f9ec;
    color: #27ae60;
    border-color: #c3f1d2;
}

.btn-success-light:hover {
    background-color: #c3f1d2;
    transform: scale(1.03);
}

.btn-outline svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
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

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
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
