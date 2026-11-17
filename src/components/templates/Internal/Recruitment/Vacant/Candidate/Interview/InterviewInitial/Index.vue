<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import { SurveyModel } from "survey-core";
import { Model, surveyLocalization } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import * as SurveyTheme from "survey-core/themes";
import "survey-core/defaultV2.min.css";
import DateInput from '@/components/UI/templates/DateInput.vue';
import DateTimeInput from '@/components/UI/templates/DateTimeInput.vue';

surveyLocalization.defaultLocale = "es";

const props = defineProps({
    modelVacant: Object,
    modelApplication: Object,
    loadingData: Boolean,
    modelInterviewInitial: Object,
    getData: Boolean,
    isDesist: Boolean,
    isFinished: Boolean,
    isPending: Boolean,
    showDetailInitialInterview: Boolean,
    showDetailCurriculum: Boolean,
    loadingDetails: Boolean,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    requiredBenefits: Array,
    responsabilities: Array,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
    contarMeses: Function,
    academicQualifications: Array,
    languageProficiencies: Array,
    professionalSkills: Array,
    professionalExperiences: Array,
    forms: Array,
    modelForm: Object,
    errors: {
        type: Array,
        default: () => []
    },
    pendingForm: Boolean
})


const emit = defineEmits([
    'submitInterviewInitialStore',
    'submitInterviewInitialReviewer',
    'submitInterviewInitialLeader',
    'detail',
    'submitVacantFind',
    'detailCurriculum',
    'index'
])

const salarioDesde = ref(0);
const salarioHasta = ref(0);
const survey = ref(null)
const formatCOP = (value) => {
    if (value == null || value == 0) return null;
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });
};
watch(
    () => props.modelForm?.questions,
    (questions) => {
        if (!questions) return

        const m = new Model(questions)
        m.locale = 'es'
        m.applyTheme(SurveyTheme.LayeredLight)
        m.showCompleteButton = false

        m.onComplete.add((sender) => {
            props.modelApplication.form_id = props.modelForm.id
            props.modelApplication.questions = props.modelForm.questions
            props.modelApplication.answers = sender.data
        })

        survey.value = m
    },
    { immediate: true }
)

// UI: panel y rol
const showCV = ref(false)
const permiso = ref('th')

const VacantDetail = defineAsyncComponent(() => import('@/components/shared/features/VacantDetail.vue'))
const CurriculumDetail = defineAsyncComponent(() => import('@/components/shared/features/CurriculumDetail.vue'))

// Badges por estado de compatibilidad
const compatibilityClass = (status) => {
    if (status == 'Aprobado') return 'badge--success'
    if (status == 'Rechazado') return 'badge--danger'
    return 'badge--danger'
}

// Fecha mínima para el input datetime-local
const today = computed(() => new Date().toISOString().slice(0, 10))

// Opciones de selects
const estadoOptions = [
    { id: 'Programado', name: 'Programado' },
    { id: 'Reprogramado', name: 'Reprogramado' },
    { id: 'Desistió', name: 'Desistió' },
    { id: 'Realizado', name: 'Realizado' },
]


// Collapse de agendamiento (usado en el template)
const agendCollapsed = ref(false)
const agendCollapsedSubData = ref(true)

// Transiciones (usadas en <transition>)
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

// Extra collapse TH (usado
// Medición del panel derecho (usado)
const leftPane = ref(null)
const cvHeader = ref(null)

const rightH = ref(0)
const headerH = ref(0)

function measure() {
    const l = leftPane.value
    rightH.value = l ? l.offsetHeight : 0
    headerH.value = cvHeader.value ? cvHeader.value.offsetHeight : 0
}

let ro
onMounted(async () => {
    await nextTick()
    ro = new ResizeObserver(measure)
    if (leftPane.value) ro.observe(leftPane.value)
    window.addEventListener('resize', measure)
    measure()
})

onBeforeUnmount(() => {
    ro?.disconnect()
    window.removeEventListener('resize', measure)
})

// Re-medición cuando se abre/cierra el CV
watch(showCV, async () => {
    await nextTick()
    measure()
})

// 👇 helper para normalizar el valor del estado (string u objeto)
const statusId = computed(() => {
    const s = props.modelInterviewInitial?.status
    if (!s) return null
    return typeof s === 'string' ? s : (s.id ?? s.name ?? null)
})

const editableStatuses = ['Reprogramado', 'Desistió', 'Realizado']
const isEditableByStatus = computed(() => editableStatuses.includes(statusId.value))

// Guardar (emite el estado actual normalizado)
function onSaveInterview() {
    const st = statusId.value
    // fuerza a string en el modelo por si venía como objeto
    if (st) props.modelInterviewInitial.status = st

    // (opcional) si quieres exigir fecha solo cuando reprograma:
    // if (st === 'Reprogramado' && !props.modelInterviewInitial.date_time) return

    emit('submitInterviewInitialStore', st) // 'Reprogramado' o 'Desistió' (o lo que haya)
}

const hasBoth = computed(() =>
    Boolean(props.modelInterviewInitial.leader_id && props.modelInterviewInitial.reviewer_id)
)

// promedio entero (round). Devuelve null si falta alguien.
const avgScore = computed(() => {
    if (!hasBoth.value) return null
    const a = Number(props.modelInterviewInitial.leader_score ?? 0)
    const b = Number(props.modelInterviewInitial.reviewer_score ?? 0)
    return Math.round((a + b) / 2)
})

const plainData = ref([]);

watch(() => props.modelInterviewInitial, (v) => {
    if (!v || !v.questions || !v.answers) return;

    const survey = new SurveyModel(v.questions);
    survey.data = v.answers;
    const data = survey.getPlainData({ includeQuestionTypes: true });
    plainData.value = data;
}, { deep: true, immediate: true }
);

function formatDisplayValue(value) {
    if (value === true) return "Sí";
    if (value === false) return "No";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
        return Object.entries(value)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" — ");
    }
    return value ?? "—";
}

function submitReviewer(decision) {
    // 1) Validar survey si existe
    if (survey.value) {
        const ok = survey.value.validate();
        if (!ok) {
            // Llevar al primer error
            setTimeout(() => {
                document.querySelector('.sd-question--error')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
            return;
        }
    }

    // 2) Validar puntaje (opcional, pero recomendable)
    const score = Number(props.modelInterviewInitial?.reviewer_score ?? 0);

    // 3) Construir payload
    const payload = {
        // estado/decisión del reviewer
        decision,                           // 'Aprobado' | 'Rechazado'
        reviewer_status: decision,
        approved: decision === 'Aprobado',

        // ids útiles
        interview_initial_id: props.modelInterviewInitial?.id ?? null,
        application_id: props.modelApplication?.id ?? null,
        form_id: props.modelForm?.id ?? null,

        // formulario
        questions: props.modelForm?.questions ?? [],
        answers: survey.value ? { ...survey.value.data } : {},
        answersPretty: survey.value
            ? survey.value.getPlainData({ includeEmpty: false })
            : [],

        // evaluador
        reviewer_observation:
            (props.modelInterviewInitial?.reviewer_observation || '').trim() || null,
        reviewer_score: score,
    };

    // 4) Emitir al padre
    emit('submitInterviewInitialReviewer', payload);
}

const activeTab = ref(0)

function goTab(i) {
    activeTab.value = i
    if (i === 0) {
        emit('detail', props.modelVacant)
        emit('submitVacantFind', props.modelVacant.id)
    } else {
        emit('detailCurriculum')
    }
}

watch(salarioDesde, (nuevo) => {
    if (!nuevo) return;

    const desdeNum = Number(nuevo);
    const hastaNum = Number(salarioHasta.value);

    // Si DESDE supera a HASTA → igualar
    if (desdeNum > hastaNum) {
        salarioHasta.value = nuevo;
    }
});

const limpiarNumero = (valor = '') => {
    return String(valor).replace(/\D/g, '');
};

const formatearMiles = (valor = '') => {
    const limpio = limpiarNumero(valor);
    if (!limpio) return '';
    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const onSalaryInput = (campo, event) => {
    let limpio = limpiarNumero(event.target.value);

    // límite: 99.999.999
    limpio = limpio.slice(0, 8);

    if (Number(limpio) > 99999999) {
        limpio = '99999999';
    }

    props.modelInterviewInitial[campo] = limpio || '';

    const formateado = formatearMiles(limpio);
    event.target.value = formateado;

    requestAnimationFrame(() => {
        const pos = formateado.length;
        event.target.setSelectionRange(pos, pos);
    });
};

const getSalaryDisplay = (valor) => {
    return valor ? formatearMiles(valor) : '';
};


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
        <span class="active">Entrevista inicial</span>
    </div>

    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailInitialInterview || showDetailCurriculum }">
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Entrevista inicial</h2>
                    <!-- SKELETON -->
                    <template v-if="props.loadingData">
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

                                    <!-- Botón alineado a la derecha (ultima columna) -->
                                    <div class="card-skel__actions">
                                        <div class="skel skel-button"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="form-container agend-card" :class="{ 'is-collapsed': props.getData }">
                            <div v-if="props.isDesist" class="alert alert-warning" style="margin-bottom:12px;">
                                <div class="bg-danger" style="display:flex;gap:10px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                    </svg>
                                    <p>Este candidato está marcado como “Desistió” en el sistema. La información se
                                        muestra
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
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                stroke-width="1.8" />
                                            <path class="chev" :class="{ rotated: !agendCollapsed }"
                                                d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                    <div v-if="true" v-show="!agendCollapsed" class="agend-content">
                                        <div id="agendamiento-body" class="grid-layout-data">
                                            <!-- Precargados (deshabilitados) -->
                                            <div class="input-group"
                                                v-if="props.modelApplication?.relationships?.person">
                                                <label class="label-bold" for="postulante">Candidato</label>
                                                <input type="text" :value="[
                                                    props.modelApplication?.relationships?.person?.first_name,
                                                    props.modelApplication?.relationships?.person?.second_name,
                                                    props.modelApplication?.relationships?.person?.first_last_name,
                                                    props.modelApplication?.relationships?.person?.second_last_name
                                                ].filter(Boolean).join(' ')" name="person" id="person"
                                                    class="input-box disabled" placeholder="Candidato"
                                                    :disabled="true" />
                                            </div>

                                            <div class="input-group"
                                                v-if="props.modelApplication?.relationships?.person">
                                                <label class="label-bold" for="identificacion">Identificación</label>
                                                <input type="text" id="identificacion" class="input-box disabled"
                                                    :value="props.modelApplication.relationships.person.document_number"
                                                    disabled></input>
                                            </div>

                                            <!-- Estado (solo si el registro ya tiene agendamiento) -->
                                            <div class="input-group" v-if="props.getData">
                                                <label class="label-bold" for="estado">Estado</label>
                                                <SearchSelect id="estado" v-model="props.modelInterviewInitial.status"
                                                    :options="estadoOptions" :disabled="isDesist || isFinished"
                                                    optionKey="name" valueKey="id" placeholder="Estado" />
                                            </div>

                                            <div class="input-group"
                                                v-if="props.modelVacant?.relationships?.headquarter">
                                                <label class="label-bold" for="entidad">Entidad</label>
                                                <input type="text" id="entidad" class="input-box disabled"
                                                    :value="props.modelVacant.relationships.headquarter.entity.name"
                                                    disabled>
                                            </div>

                                            <div class="input-group"
                                                v-if="props.modelVacant?.relationships?.headquarter">
                                                <label class="label-bold" for="sede">Sede</label>
                                                <input type="text" id="sede" class="input-box disabled"
                                                    :value="props.modelVacant.relationships.headquarter.name" disabled>
                                            </div>

                                            <div class="input-group"
                                                v-if="props.modelVacant?.relationships?.headquarter">
                                                <label class="label-bold" for="direccion">Dirección</label>
                                                <input type="text" id="direccion" class="input-box disabled"
                                                    :value="props.modelVacant.relationships.headquarter.address"
                                                    disabled>
                                            </div>

                                            <!-- Fecha (NO se precarga) -->
                                            <div class="input-group">
                                                <label class="label-bold" for="fecha">Fecha</label>
                                                <DateTimeInput id="fecha"
                                                    v-model="props.modelInterviewInitial.date_time" :class="{
                                                        disabled: props.getData && (props.isDesist || props.isFinished)
                                                    }" :error="props.errors?.interviewInitial_date_time"
                                                    :disabled="props.getData && (props.isDesist || props.isFinished)"
                                                    :min="today" placeholder="Fecha" />
                                                <p v-for="(msg, i) in props.errors?.interviewInitial_date_time ?? []"
                                                    :key="'type-' + i" class="error-text">
                                                    {{ msg }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="input-group full-width">
                                            <label class="label-bold" for="indication">Indicación (Opcional)</label>
                                            <div class="textarea-wrapper">
                                                <textarea v-model="props.modelInterviewInitial.indication"
                                                    name="indication" id="indication" placeholder="Indicación"
                                                    :disabled="getData && props.modelInterviewInitial.status != 'Reprogramado'"
                                                    :class="{ disabled: getData && props.modelInterviewInitial.status != 'Reprogramado' }"
                                                    maxlength="2000" class="text-area"></textarea>
                                                <div class="char-limit-text">({{ (props.modelInterviewInitial.indication
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
                        <template v-if="props.getData && props.isFinished && !props.isDesist">
                            <div class="form-container" style="margin-top:12px;">
                                <div class="form-section">
                                    <div
                                        style="display: flex; justify-content: space-between;text-align: center;align-items: center; margin-bottom: 10px;">
                                        <div class="section-title">Evaluación de entrevista</div>
                                        <Button title="Detalle" icon="list" variant="question"
                                            @click="emit('detail', props.modelVacant); emit('submitVacantFind', props.modelVacant.id)" />
                                    </div>
                                    <div v-if="false" class="leader-summary">
                                        <div class="leader-score">
                                            <div class="leader-score-title">Puntuación del candidato</div>
                                            <div class="leader-score-number">{{ leaderRating }}</div>
                                            <div class="stars-lg">
                                                <span v-for="n in [1, 2, 3, 4, 5]" :key="'ldr-sum' + n">
                                                    <svg class="star" :class="{ active: leaderRating >= n }"
                                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 256 256">
                                                        <path v-if="leaderRating >= n"
                                                            d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                        <path v-else
                                                            d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="summary-comments">
                                            <div class="summary-comments-title">Comentarios</div>
                                            <p class="summary-comment-text">{{
                                                currentRecord.evaluaciones.leader.comments }}
                                            </p>
                                        </div>
                                    </div>

                                    <div v-else-if="props.modelInterviewInitial.leader_id && props.modelInterviewInitial.reviewer_id"
                                        class="score-summary">
                                        <div class="leader-score">
                                            <div class="leader-score-title">Puntuación del candidato</div>
                                            <div class="leader-score-number">{{ avgScore }}</div>
                                            <div class="stars-lg">
                                                <span v-for="n in [1, 2, 3, 4, 5]" :key="'ldr-sum' + n">
                                                    <svg class="star" :class="{ active: avgScore >= n }"
                                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 256 256">
                                                        <path v-if="avgScore >= n"
                                                            d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                        <path v-else
                                                            d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        <!-- RESEÑAS DE AMBOS -->
                                        <div class="summary-box">
                                            <div class="summary-meta">
                                                <div v-if="props.modelInterviewInitial.relationships.reviewer">
                                                    <p class="summary-name"><strong>Talento humano:</strong>
                                                        {{
                                                            [
                                                                props.modelInterviewInitial?.relationships?.reviewer?.first_name,
                                                                props.modelInterviewInitial?.relationships?.reviewer?.second_name,
                                                                props.modelInterviewInitial?.relationships?.reviewer?.first_last_name,
                                                                props.modelInterviewInitial?.relationships?.reviewer?.second_last_name
                                                            ].filter(Boolean).join(' ')
                                                        }}
                                                    </p>
                                                </div>
                                            </div>

                                            <div class="form-container agend-card"
                                                :class="{ 'is-collapsed': agendCollapsed }"
                                                v-if="props.modelInterviewInitial.reviewer_id && plainData.length > 0">
                                                <div class="form-section">
                                                    <div class="section-title-row">
                                                        <div class="section-title">Información complementaria</div>

                                                        <button class="collapse-btn"
                                                            @click="agendCollapsedSubData = !agendCollapsedSubData"
                                                            :aria-expanded="!agendCollapsedSubData"
                                                            :title="agendCollapsedSubData ? 'Expandir' : 'Contraer'">
                                                            <svg width="24" height="24" viewBox="0 0 24 24"
                                                                aria-hidden="true">
                                                                <circle cx="12" cy="12" r="10" fill="none"
                                                                    stroke="#5B4CD0" stroke-width="1.8" />
                                                                <path class="chev"
                                                                    :class="{ rotated: !agendCollapsedSubData }"
                                                                    d="M10 8 L14 12 L10 16" fill="none" stroke="#5B4CD0"
                                                                    stroke-width="2" stroke-linecap="round"
                                                                    stroke-linejoin="round" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <transition>
                                                        <div v-show="!agendCollapsedSubData" class="agend-content">
                                                            <div id="survey-results-container" class="grid-layout">
                                                                <ul class="summary-list-info">
                                                                    <li v-for="(question, i) in plainData" :key="i"
                                                                        class="summary-item-info">
                                                                        <span class="summary-subtitle-info">{{
                                                                            question.title || question.name }}</span>
                                                                        <template
                                                                            v-if="question.isNode && question.data?.length">
                                                                            <ul class="summary-sublist-info">
                                                                                <li v-for="(panel, j) in question.data"
                                                                                    :key="j"
                                                                                    class="summary-subitem-info">
                                                                                    <span class="summary-text-info">
                                                                                        <strong>Panel {{ j + 1
                                                                                            }}:</strong>
                                                                                    </span>
                                                                                    <ul>
                                                                                        <li v-for="(child, k) in panel.data"
                                                                                            :key="k"
                                                                                            class="summary-child-item-info">
                                                                                            <span
                                                                                                class="summary-subsubtitle-info">{{
                                                                                                    child.title }}</span>
                                                                                            <ul>
                                                                                                <li v-for="(val, key) in child.displayValue"
                                                                                                    :key="key"
                                                                                                    class="summary-leaf-item-info">
                                                                                                    <span
                                                                                                        class="summary-leaf-label-info">{{
                                                                                                            key }}:</span>
                                                                                                    <span
                                                                                                        class="summary-leaf-value-info">{{
                                                                                                            val }}</span>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </li>
                                                                                    </ul>
                                                                                </li>
                                                                            </ul>
                                                                        </template>

                                                                        <template v-else>
                                                                            <span class="summary-text">
                                                                                {{
                                                                                    formatDisplayValue(question.displayValue
                                                                                        ??
                                                                                        question.value) }}
                                                                            </span>
                                                                        </template>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                            <div class="summary-subtitle">Rango salaria solicitado</div>
                                            <p class="summary-text">
                                                {{ [formatCOP(props.modelInterviewInitial?.salary_min),
                                                formatCOP(props.modelInterviewInitial?.salary_max)]
                                                    .filter(Boolean).join(' - ') }}
                                            </p>
                                            <div class="summary-subtitle">Comentarios de talento humano</div>
                                            <p class="summary-text">{{
                                                props.modelInterviewInitial.reviewer_observation }}
                                            </p>
                                            <div class="summary-subtitle">Estado</div>
                                            <p class="summary-text"><span class="badge"
                                                    :class="compatibilityClass(props.modelInterviewInitial.reviewer_status)">
                                                    {{ props.modelInterviewInitial.reviewer_status }}
                                                </span></p>
                                        </div>

                                        <div class="summary-columns">
                                            <div class="summary-box">
                                                <div class="summary-meta">
                                                    <div v-if="props.modelInterviewInitial.relationships.leader">
                                                        <p class="summary-name"><strong>Líder de área:</strong>
                                                            {{
                                                                [
                                                                    props.modelInterviewInitial?.relationships?.leader?.first_name,
                                                                    props.modelInterviewInitial?.relationships?.leader?.second_name,
                                                                    props.modelInterviewInitial?.relationships?.leader?.first_last_name,
                                                                    props.modelInterviewInitial?.relationships?.leader?.second_last_name
                                                                ].filter(Boolean).join(' ')
                                                            }}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="summary-subtitle">Comentarios del líder</div>
                                                <p class="summary-text">{{
                                                    props.modelInterviewInitial.leader_observation }}
                                                </p>
                                                <div class="summary-subtitle">Estado</div>
                                                <p class="summary-text"><span class="badge"
                                                        :class="compatibilityClass(props.modelInterviewInitial.leader_status)">
                                                        {{ props.modelInterviewInitial.leader_status }}
                                                    </span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Vista ESTÁNDAR: grid (lo que ya tienes) -->
                                    <div v-else class="grid-interview">
                                        <div class="form-container">
                                            <div v-if="props.modelInterviewInitial.relationships.reviewer">
                                                <p><strong>Talento humano:</strong>
                                                    {{
                                                        [
                                                            props.modelInterviewInitial?.relationships?.reviewer?.first_name,
                                                            props.modelInterviewInitial?.relationships?.reviewer?.second_name,
                                                            props.modelInterviewInitial?.relationships?.reviewer?.first_last_name,
                                                            props.modelInterviewInitial?.relationships?.reviewer?.second_last_name
                                                        ].filter(Boolean).join(' ')
                                                    }}
                                                </p>
                                            </div>
                                            <div v-else>
                                                <p><strong>Talento humano:</strong> Pendiente
                                                </p>
                                            </div>

                                            <!-- Si TH ya evaluó, mostrar lectura -->
                                            <template v-if="hasThDone">
                                            </template>

                                            <!-- Si TH NO ha evaluado -> formulario editable SOLO si permiso es TH -->
                                            <template v-else>
                                                <template v-if="!props.pendingForm">
                                                    <div v-if="!props.modelInterviewInitial.reviewer_id"
                                                        class="survey-compact" style="height: 400px;">
                                                        <SurveyComponent v-if="survey" :model="survey" />
                                                    </div>
                                                    <div v-else>
                                                        <div class="form-container agend-card"
                                                            :class="{ 'is-collapsed': agendCollapsed }"
                                                            v-if="props.modelInterviewInitial.reviewer_id">
                                                            <div class="form-section">
                                                                <div class="section-title-row">
                                                                    <div class="section-title-acordion">Información
                                                                        complementaria</div>

                                                                    <button class="collapse-btn"
                                                                        @click="agendCollapsedSubData = !agendCollapsedSubData"
                                                                        :aria-expanded="!agendCollapsedSubData"
                                                                        :title="agendCollapsedSubData ? 'Expandir' : 'Contraer'">
                                                                        <svg width="24" height="24" viewBox="0 0 24 24"
                                                                            aria-hidden="true">
                                                                            <circle cx="12" cy="12" r="10" fill="none"
                                                                                stroke="#5B4CD0" stroke-width="1.8" />
                                                                            <path class="chev"
                                                                                :class="{ rotated: !agendCollapsedSubData }"
                                                                                d="M10 8 L14 12 L10 16" fill="none"
                                                                                stroke="#5B4CD0" stroke-width="2"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <transition>
                                                                    <div v-show="!agendCollapsedSubData"
                                                                        class="agend-content">
                                                                        <div id="survey-results-container"
                                                                            class="grid-layout">
                                                                            <ul class="summary-list-info">
                                                                                <li v-for="(question, i) in plainData"
                                                                                    :key="i" class="summary-item-info">
                                                                                    <span
                                                                                        class="summary-subtitle-info">{{
                                                                                            question.title ||
                                                                                            question.name }}</span>
                                                                                    <template
                                                                                        v-if="question.isNode && question.data?.length">
                                                                                        <ul
                                                                                            class="summary-sublist-info">
                                                                                            <li v-for="(panel, j) in question.data"
                                                                                                :key="j"
                                                                                                class="summary-subitem-info">
                                                                                                <span
                                                                                                    class="summary-text-info">
                                                                                                    <strong>Panel {{ j +
                                                                                                        1
                                                                                                        }}:</strong>
                                                                                                </span>
                                                                                                <ul>
                                                                                                    <li v-for="(child, k) in panel.data"
                                                                                                        :key="k"
                                                                                                        class="summary-child-item-info">
                                                                                                        <span
                                                                                                            class="summary-subsubtitle-info">{{
                                                                                                                child.title
                                                                                                            }}</span>
                                                                                                        <ul>
                                                                                                            <li v-for="(val, key) in child.displayValue"
                                                                                                                :key="key"
                                                                                                                class="summary-leaf-item-info">
                                                                                                                <span
                                                                                                                    class="summary-leaf-label-info">{{
                                                                                                                        key
                                                                                                                    }}:</span>
                                                                                                                <span
                                                                                                                    class="summary-leaf-value-info">{{
                                                                                                                        val
                                                                                                                    }}</span>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </li>
                                                                                                </ul>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </template>

                                                                                    <template v-else>
                                                                                        <span class="summary-text">
                                                                                            {{
                                                                                                formatDisplayValue(question.displayValue
                                                                                                    ??
                                                                                                    question.value) }}
                                                                                        </span>
                                                                                    </template>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </transition>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <div class="input-group">
                                                    <div class="grid-2">
                                                        <div class="textarea-wrapper">
                                                            <label class="label-bold" for="description">Salario -
                                                                Desde</label>
                                                            <input type="text" inputmode="numeric" maxlength="10"
                                                                @input="onSalaryInput('salary_min', $event)"
                                                                class="input-box"
                                                                :disabled="props.modelInterviewInitial.reviewer_id"
                                                                :class="{ disabled: props.modelInterviewInitial.reviewer_id }"
                                                                :value="getSalaryDisplay(props.modelInterviewInitial.salary_min)"
                                                                placeholder="Salario - Desde" />
                                                        </div>
                                                        <div class="textarea-wrapper">
                                                            <label class="label-bold" for="description">Salario -
                                                                Hasta</label>
                                                            <input type="text" inputmode="numeric" maxlength="10"
                                                                @input="onSalaryInput('salary_max', $event)"
                                                                class="input-box"
                                                                :disabled="props.modelInterviewInitial.reviewer_id"
                                                                :class="{ disabled: props.modelInterviewInitial.reviewer_id }"
                                                                :value="getSalaryDisplay(props.modelInterviewInitial.salary_max)"
                                                                placeholder="Salario - Hasta" />
                                                        </div>
                                                    </div>
                                                    <label class="label-bold" for="description">Comentarios de
                                                        talento
                                                        humano sobre la entrevista</label>
                                                    <div class="textarea-wrapper">
                                                        <textarea name="description" id="description" class="text-area"
                                                            :class="{
                                                                disabled: props.modelInterviewInitial.reviewer_id,
                                                                'input-error': props.errors?.interviewInitialReviewer_reviewer_observation
                                                            }" :disabled="props.modelInterviewInitial.reviewer_id"
                                                            v-model="props.modelInterviewInitial.reviewer_observation"
                                                            placeholder="Comentarios de talento humano"
                                                            maxlength="500"></textarea>
                                                        <p v-for="(msg, i) in props.errors?.interviewInitialReviewer_reviewer_observation ?? []"
                                                            :key="'type-' + i" class="error-text">
                                                            {{ msg }}
                                                        </p>
                                                        <div class="char-limit-text">
                                                            ({{ (props.modelInterviewInitial.reviewer_observation ||
                                                                '').length }}/500)</div>
                                                    </div>
                                                </div>

                                                <strong>Puntuación</strong>
                                                <div class="skill-star-item">
                                                    <div class="skill-star-left">
                                                        <div class="valoracion">
                                                            <template v-if="props.modelInterviewInitial.reviewer_id">
                                                                <span class="stars-lg" v-for="n in [5, 4, 3, 2, 1]"
                                                                    :key="'ro-' + n" style="padding:4px">
                                                                    <svg class="star"
                                                                        :class="{ active: props.modelInterviewInitial.reviewer_score >= n }"
                                                                        viewBox="0 0 256 256" width="24" height="24">
                                                                        <path
                                                                            d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                                    </svg>
                                                                </span>
                                                            </template>
                                                            <template v-else>
                                                                <button v-for="n in [5, 4, 3, 2, 1]" :key="n"
                                                                    @click="props.modelInterviewInitial.reviewer_score = n">
                                                                    <svg class="star"
                                                                        :class="{ active: props.modelInterviewInitial.reviewer_score >= n }"
                                                                        xmlns="http://www.w3.org/2000/svg" width="24"
                                                                        height="24" viewBox="0 0 256 256">
                                                                        <path
                                                                            v-if="props.modelInterviewInitial.reviewer_score >= n"
                                                                            d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                                        <path v-else
                                                                            d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                                    </svg>
                                                                </button>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p v-for="(msg, i) in props.errors?.interviewInitialReviewer_reviewer_score ?? []"
                                                    :key="'type-' + i" class="error-text">
                                                    {{ msg }}
                                                </p>
                                                <div class="form-buttons"
                                                    v-if="!props.modelInterviewInitial.reviewer_id">
                                                    <button class="btn-outline btn-danger-light"
                                                        @click="submitReviewer('Rechazado')"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                                            </path>
                                                        </svg>No aprobar</button>
                                                    <button class="btn-outline btn-success-light"
                                                        @click="submitReviewer('Aprobado')"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                                            </path>
                                                        </svg> Aprobar</button>
                                                </div>
                                                <div v-else>
                                                    <strong>Estado</strong>
                                                    <div>
                                                        <span class="badge"
                                                            :class="compatibilityClass(props.modelInterviewInitial.reviewer_status)">
                                                            {{ props.modelInterviewInitial.reviewer_status }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                        <div class="form-container">
                                            <div v-if="props.modelInterviewInitial.relationships.leader">
                                                <p><strong>Líder del área:</strong>
                                                    {{
                                                        [
                                                            props.modelInterviewInitial?.relationships?.leader?.first_name,
                                                            props.modelInterviewInitial?.relationships?.leader?.second_name,
                                                            props.modelInterviewInitial?.relationships?.leader?.first_last_name,
                                                            props.modelInterviewInitial?.relationships?.leader?.second_last_name
                                                        ].filter(Boolean).join(' ')
                                                    }}
                                                </p>
                                            </div>
                                            <div v-else>
                                                <p><strong>Líder del área:</strong> Pendiente
                                                </p>
                                            </div>

                                            <!-- Caso A: ya evaluó -> mostrar lectura -->
                                            <template v-if="hasLeaderDone">
                                                <div class="input-group">
                                                    <label class="label-bold" for="desc-leader-read">Comentarios del
                                                        líder
                                                        sobre
                                                        la
                                                        entrevista</label>
                                                    <div class="textarea-wrapper">
                                                        <textarea id="desc-leader-read" class="text-area disabled"
                                                            disabled
                                                            style="min-height:80px; padding:10px; background:#f9f9f9; white-space: pre-wrap;">
                                                        {{ currentRecord.evaluaciones.leader.comments }}
                                                    </textarea>
                                                        <div class="char-limit-text">(Respuesta registrada)</div>
                                                    </div>
                                                </div>

                                                <strong>Puntuación</strong>
                                                <div class="skill-star-item">
                                                    <div class="skill-star-left">
                                                        <div class="valoracion readonly">
                                                            <span v-for="n in [5, 4, 3, 2, 1]" :key="'ldr' + n"
                                                                style="padding:4px;">
                                                                <svg class="star"
                                                                    :class="{ active: (currentRecord.evaluaciones.leader.rating || 0) >= n }"
                                                                    xmlns="http://www.w3.org/2000/svg" width="24"
                                                                    height="24" viewBox="0 0 256 256">
                                                                    <path
                                                                        v-if="(currentRecord.evaluaciones.leader.rating || 0) >= n"
                                                                        d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                                    <path v-else
                                                                        d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Caso B: NO ha evaluado -->
                                            <template v-else>
                                                <!-- B1: Puede editar (rol líder) -> formulario original -->
                                                <template v-if="true">
                                                    <div class="input-group">
                                                        <label class="label-bold" for="description">Comentarios del
                                                            líder
                                                            sobre
                                                            la
                                                            entrevista</label>
                                                        <div class="textarea-wrapper">
                                                            <textarea name="description" id="description"
                                                                :class="{ disabled: props.modelInterviewInitial.leader_id, 'input-error': props.errors?.interviewInitialLeader_leader_observation }"
                                                                :disabled="props.modelInterviewInitial.leader_id"
                                                                placeholder="Comentarios del líder sobre la entrevista"
                                                                maxlength="500" class="text-area"
                                                                v-model="props.modelInterviewInitial.leader_observation"></textarea>
                                                            <p v-for="(msg, i) in props.errors?.interviewInitialLeader_leader_observation ?? []"
                                                                :key="'type-' + i" class="error-text">
                                                                {{ msg }}
                                                            </p>
                                                            <div class="char-limit-text">
                                                                ({{ (props.modelInterviewInitial.leader_observation
                                                                    ||
                                                                    '').length }}/500)</div>
                                                        </div>
                                                    </div>
                                                    <strong>Puntuación</strong>
                                                    <div class="skill-star-item">
                                                        <div class="skill-star-left">
                                                            <div class="valoracion">
                                                                <template v-if="props.modelInterviewInitial.leader_id">
                                                                    <span v-for="n in [5, 4, 3, 2, 1]" :key="'ro-' + n"
                                                                        style="padding:4px">
                                                                        <svg class="star"
                                                                            :class="{ active: props.modelInterviewInitial.leader_score >= n }"
                                                                            viewBox="0 0 256 256" width="24"
                                                                            height="24">
                                                                            <path
                                                                                d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                                        </svg>
                                                                    </span>
                                                                </template>
                                                                <template v-else>
                                                                    <button v-for="n in [5, 4, 3, 2, 1]" :key="n"
                                                                        @click="props.modelInterviewInitial.leader_score = n">
                                                                        <svg class="star"
                                                                            :class="{ active: props.modelInterviewInitial.leader_score >= n }"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24" height="24"
                                                                            viewBox="0 0 256 256">
                                                                            <path
                                                                                v-if="props.modelInterviewInitial.leader_score >= n"
                                                                                d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                                            <path v-else
                                                                                d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                                        </svg>
                                                                    </button>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p v-for="(msg, i) in props.errors?.interviewInitialLeader_leader_score ?? []"
                                                        :key="'type-' + i" class="error-text">
                                                        {{ msg }}
                                                    </p>
                                                    <div class="form-buttons"
                                                        v-if="!props.modelInterviewInitial.leader_id">
                                                        <button class="btn-outline btn-danger-light"
                                                            @click="emit('submitInterviewInitialLeader', 'Rechazado')"><svg
                                                                xmlns="http://www.w3.org/2000/svg" width="32"
                                                                height="32" fill="currentColor" viewBox="0 0 256 256">
                                                                <path
                                                                    d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                                                </path>
                                                            </svg>No aprobar</button>
                                                        <button class="btn-outline btn-success-light"
                                                            @click="emit('submitInterviewInitialLeader', 'Aprobado')"><svg
                                                                xmlns="http://www.w3.org/2000/svg" width="32"
                                                                height="32" fill="currentColor" viewBox="0 0 256 256">
                                                                <path
                                                                    d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                                                </path>
                                                            </svg> Aprobar</button>
                                                    </div>
                                                    <div v-else>
                                                        <strong>Estado</strong>
                                                        <div>
                                                            <span class="badge"
                                                                :class="compatibilityClass(props.modelInterviewInitial.leader_status)">
                                                                {{ props.modelInterviewInitial.leader_status }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- B2: No puede editar (rol TH) -> muestra “pendiente por líder” -->
                                                <template v-else>
                                                    <!-- Solo texto informativo, sin textarea ni estrellas -->
                                                    <div class="empty-state">
                                                        (Líder aún no registra comentarios)
                                                    </div>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>


                </div>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="showDetailInitialInterview || showDetailCurriculum">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <div class="nav-tabs" :style="{ '--active': activeTab, '--count': 2 }" role="tablist">
                            <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                :aria-selected="activeTab === 0" @click="goTab(0)">
                                Vacante
                            </button>

                            <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                :aria-selected="activeTab === 1" @click="goTab(1)">
                                Hoja de vida
                            </button>

                            <span class="underline"></span>
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <div v-if="showDetailInitialInterview">
                                        <VacantDetail :loadingDetail="loadingDetails" :model="props.modelVacant"
                                            :responsabilities="props.responsabilities"
                                            @close-detail="emit('close-detail')"
                                            :academicRequirements="props.academicRequirements"
                                            :requiredExperiences="props.requiredExperiences" :formatTime="formatTime"
                                            :currentLabel="currentLabel" :currentColor="currentColor"
                                            :requiredSkills="props.requiredSkills"
                                            :requiredBenefits="props.requiredBenefits" />
                                    </div>
                                    <div v-else-if="showDetailCurriculum">
                                        <CurriculumDetail :loadingFind="props.loadingDetails"
                                            :modelApplication="props.modelApplication" :modelvacant="props.modelVacant"
                                            :contarMeses="props.contarMeses" :formatTime="props.formatTime"
                                            :academicQualifications="props.academicQualifications"
                                            :languageProficiencies="props.languageProficiencies"
                                            :professionalSkills="props.professionalSkills"
                                            :professionalExperiences="props.professionalExperiences"
                                            @close-detail="emit('close-detail')" />
                                    </div>
                                </div>
                            </template>
                            <template #fallback>
                                <div style="padding:16px">Cargando…</div>
                            </template>
                        </Suspense>
                    </SidePanel>
                </div>
            </Transition>
        </div>
    </div>
</template>
<style scoped>
.empresa-container {
    padding: 30px;
    background-color: #ffffff;
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

.agend-content {
    display: grid;
    gap: 8px 12px;
}

/* Layouts */
.grid-layout-data {
    display: grid;
    gap: 8px 12px;
    grid-template-columns: repeat(3, 1fr);
}

.grid-layout {
    display: grid;
    gap: 8px;
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
.input-group .input-box,
.input-group input,
.input-group select,
.input-group :where(.search-select, .SearchSelect) {
    width: 100%;
}

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


.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Cada columna ocupa 50% */
    gap: 12px;
    width: 100%;
    align-items: start;
}

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

.skill-star-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-star-name {
    font-weight: 600;
    font-size: 16px;
    color: #2b2c34;
}

/* star */


.valoracion {
    display: flex;
    flex-direction: row-reverse;
    /* para que el hover hacia atrás funcione */
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

/* Efecto de hover y relleno progresivo */
.valoracion:not(.readonly) button:hover~button .star,
.valoracion:not(.readonly) button:hover .star {
    fill: #ffa400;
    transform: rotate(72deg);
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
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

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    padding: 12px 16px;
    border: 1px solid #5B4CD0;
    /* borde en color de marca */
    background: #FCFAFF;
    /* fondo suave */
    color: #5B4CD0;
    /* texto del mismo tono */
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    height: 100%;
}

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
    width: 28px;
    height: 28px;
    fill: #D1D5DB;
    /* estrella vacía */
    transition: fill .2s ease;
}

.stars-lg .star.active {
    fill: #FFA400;
    /* estrella llena */
}

.summary-comments {
    border: 1px solid #E3DFFF;
    background: #FCFAFF;
    border-radius: 8px;
    padding: 12px 16px;
}

.summary-comments-title {
    font-weight: 600;
    color: #898A8B;
    margin-bottom: 6px;
}

.summary-comment-text {
    color: #2b2c34;
    line-height: 1.5;
}

.summary-columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 8px;
}

.summary-box {
    border: 1px solid #E3DFFF;
    background: #fff;
    border-radius: 8px;
    padding: 12px 14px;
}

.summary-meta {
    color: #898A8B;
    margin-bottom: 6px;
}

.summary-role {
    font-weight: 600;
    color: #898A8B;
    font-size: 14px;
}

.summary-name {
    color: #2b2c34;
    margin-left: 6px;
    font-weight: 500;
    font-size: 14px;
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
    /* respeta saltos de línea */
}

@media (max-width: 1024px) {
    .summary-columns {
        grid-template-columns: 1fr;
    }

    .grid-interview {
        grid-template-columns: 1fr;
    }
}

.children-ages {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.child-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.btn-ghost {
    border: 0;
    background: #fff;
    color: #5B4CD0;
    cursor: pointer;
}

.btn-link {
    border: 0;
    background: transparent;
    color: #5B4CD0;
    cursor: pointer;
    padding: 0;
}

.add-link {
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #5b4cd0;
    font-weight: 600;
    justify-content: center;
    font-size: 12px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked+.slider {
    background-color: #5B4CD0;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.checkbox-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

/* Ocultar checkbox nativo */
.checkbox-container input[type="checkbox"] {
    display: none;
}

/* Checkbox personalizado */
.checkbox-container .custom-checkbox {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="%23000000" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-right: 8px;
    cursor: pointer;
    flex-shrink: 0;
}

/* Asegurar alineación vertical del label */
.checkbox-container label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23000000" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23000000" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Layout a dos paneles */
.two-pane {
    display: grid;
    grid-template-columns: 1fr;
    /* por defecto una columna */
    gap: 16px;
    align-items: start;
}

.two-pane.cv-open {
    grid-template-columns: 1fr min(520px, 42vw);
    /* abre 2da col para la CV */
}

.left-pane {
    min-width: 0;
}

/* Encabezado de la sección */
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

/* Cabecera del panel CV */
.cv-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.cv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #EEEAFD;
}

/* Botón reutilizable */
.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #5b4cd0;
    border: 1px solid #dadcfb;
    cursor: pointer;
}

.icon-btn:hover {
    background: #e6e8ff;
}

/* Animaciones */
.slide-in-enter-from,
.slide-in-leave-to {
    opacity: 0;
    transform: translateX(8px);
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: transform .22s ease, opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.cv-scroll {
    min-height: 0;
    /* IMPORTANTE para Flex: permite el overflow */
    overflow: auto;
    /* scroll interno */
    overscroll-behavior: contain;
    /* no arrastra el scroll del body */
    padding: 12px;
}

/* MUY IMPORTANTE para permitir overflow dentro de items de grid */
.left-pane,
.right-panel {
    min-width: 0;
    min-height: 0;
}

/* ----- Panel derecho (contenedor) ----- */
.right-panel {
    display: none;
    /* oculto cuando no hay CV */
    background: #fff;
    border: 1px solid #E3DFFF;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(91, 76, 208, .08);
    /* que no se “estire” por el contenido */
    overflow: hidden;
    /* que quede visible en viewport y no crezca más */
    position: sticky;
    top: 12px;
    height: calc(100vh - 24px);
    /* alto acotado al viewport */
    /* flex para separar header (fijo) y body (scroll) */
    display: flex;
    flex-direction: column;
}

.two-pane.cv-open .right-panel {
    display: flex;
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

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 520px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
    background-color: white;
    border-radius: 10px;
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

/* ===== LISTA PRINCIPAL ===== */
.summary-list-info {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

/* ===== BLOQUES DE INFORMACIÓN ===== */
.summary-item-info {
    background: #fcfcff;
    border: 1px solid #ece9f6;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 2px 6px rgba(75, 0, 130, 0.05);
    transition: all 0.25s ease;
}

.summary-item-info:hover {
    box-shadow: 0 4px 10px rgba(75, 0, 130, 0.08);
    transform: translateY(-2px);
}

/* ===== TITULOS PRINCIPALES ===== */
.summary-subtitle-info {
    display: block;
    font-weight: 600;
    font-size: 1rem;
    color: #5b4cd0;
    margin-bottom: 0.75rem;
    letter-spacing: 0.2px;
}

/* ===== SUBLISTAS (ej. panel dinámico) ===== */
.summary-sublist-info {
    list-style: none;
    padding-left: 1rem;
    margin-top: 0.3rem;
    border-left: 3px solid #e6defa;
}

.summary-subitem-info {
    margin-bottom: 0.5rem;
}

/* ===== SUBTÍTULOS DENTRO DE LOS PANELS ===== */
.summary-child-item-info {
    list-style: none;
    padding-left: 1rem;
    margin-top: 0.4rem;
}

.summary-subsubtitle-info {
    font-weight: 600;
    color: #5b4cd0;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
}

/* ===== VALORES ===== */
.summary-leaf-label-info {
    font-weight: 500;
    color: #2b2c34;
}

.summary-leaf-value-info {
    margin-left: 4px;
    color: #555;
    font-weight: 400;
}

/* ===== MINI BULLETS ===== */
.summary-leaf-item-info::before {
    content: "▪";
    color: #5b4cd0;
    margin-right: 0.4rem;
    font-size: 0.8rem;
}

/* ===== ANIMACIÓN SUAVE ===== */
@media (prefers-reduced-motion: no-preference) {
    .summary-item-info {
        transition: all 0.25s ease-in-out;
    }
}

.summary-list-info li,
.summary-sublist-info li,
.summary-subitem-info li,
.summary-child-item-info li {
    list-style-type: none !important;
}

.grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
}

@media (max-width: 920px) {
    .grid-layout-data {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .grid-layout-data {
        grid-template-columns: 1fr;
    }
}
</style>