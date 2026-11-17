<script setup>
import { ref, computed, watch } from 'vue'
import { useSwalStore } from '@/stores/swalStore'

const showCV = ref(false)
const swalStore = useSwalStore()
const agendCollapsed = ref(false)
const showCollapse = computed(() => !!currentRecord.value)

// ===== MOCK: 3 casos =====
const registros = ref([
    {
        id: 1,
        postulante: 'Ana María Pérez',
        identificacion: '1012345678',
        entidad: 'Coguasimales - Sede Centro',
        sede: 'Sede Centro',
        direccion: 'Cra 7 #12-34, Bogotá',
        hasAppointment: false,
        status: null,
        startDate: null,
        endDate: null,
        testSent: false,
        testMeta: null,
        testCompleted: false
    },
    {
        id: 2,
        postulante: 'Carlos Rodríguez',
        identificacion: '1022334455',
        entidad: 'Coguasimales - Sede Norte',
        sede: 'Sede Norte',
        direccion: 'Av. 19 #120-45, Bogotá',
        hasAppointment: true,
        status: 'Programada',
        startDate: '2025-09-10',
        endDate: '2025-09-10',
        testSent: true,
        testMeta: {
            title: 'Nombre',
            category: 'Categoría',
            subtitle: 'Evaluación de conocimientos básicos sobre el cargo',
            questions: 25,
            duration: 25
        },
        testCompleted: false
    },
    {
        id: 3,
        postulante: 'Laura Gómez',
        identificacion: '1033445566',
        entidad: 'Coguasimales - Sede Occidente',
        sede: 'Sede Occidente',
        direccion: 'Cl. 80 #45-67, Bogotá',
        hasAppointment: true,
        status: 'Programada',
        startDate: '2025-09-05',
        endDate: '2025-09-06',
        testSent: true,
        testMeta: {
            title: 'Nombre',
            category: 'Categoría',
            subtitle: 'Evaluación de conocimientos básicos sobre el cargo',
            questions: 25,
            duration: 25
        },
        testCompleted: true,
        testResult: {
            score: 80,
            correct: 20,
            wrong: 5,
            submittedAt: '2025-09-05T15:30:00'
        }
    }
])

// selección de caso
const selectedRecordId = ref(3)
const currentRecord = computed(() => registros.value.find(r => r.id === selectedRecordId.value))

// opciones
const estadoOptions = [
    { id: 'Programada', name: 'Programada' },
    { id: 'Reprogramada', name: 'Reprogramada' },
    { id: 'Desistió', name: 'Desistió' }
]
const testOptions = [
    { id: 'prueba_1', name: 'Prueba 1' },
    { id: 'prueba_2', name: 'Prueba 2' }
]

// fechas/prueba
const fechaInicio = ref('')
const fechaFin = ref('')
const selectedTestId = ref(null)
const today = computed(() => new Date().toISOString().slice(0, 10))

// flags y estado normalizado
const isScheduled = computed(() => !!currentRecord.value?.hasAppointment && !!currentRecord.value?.startDate && !!currentRecord.value?.endDate)

const statusId = computed(() => {
    const s = currentRecord.value?.status
    if (!s) return null
    return typeof s === 'string' ? s : (s.id ?? s.name ?? null)
})

// Habilitados/Deshabilitados
const fechaDisabled = computed(() => {
    // habilita si NO está agendado o si está en Reprogramada
    if (!isScheduled.value) return false
    return statusId.value !== 'Reprogramada'
})

const guardarDisabled = computed(() => {
    if (fechaDisabled.value) return true
    if (!fechaInicio.value || !fechaFin.value || !selectedTestId.value) return true
    // fin >= inicio
    return new Date(fechaFin.value) < new Date(fechaInicio.value)
})

// Sync al cambiar registro
watch(currentRecord, rec => {
    if (!rec) return
    fechaInicio.value = rec.startDate || ''
    fechaFin.value = rec.endDate || ''
    selectedTestId.value = null
}, { immediate: true })

// Al pasar a Reprogramada limpiar
watch(statusId, (val) => {
    if (val === 'Reprogramada') {
        fechaInicio.value = ''
        fechaFin.value = ''
        selectedTestId.value = null
    }
})

// Validaciones de transición (acordeón)
function accEnter(el) { el.style.height = '0px'; el.style.opacity = '0'; el.style.overflow = 'hidden'; requestAnimationFrame(() => { el.style.transition = 'height .24s ease, opacity .18s ease'; el.style.height = el.scrollHeight + 'px'; el.style.opacity = '1' }) }
function accAfterEnter(el) { el.style.height = ''; el.style.transition = ''; el.style.overflow = '' }
function accLeave(el) { el.style.height = el.scrollHeight + 'px'; el.style.opacity = '1'; el.style.overflow = 'hidden'; void el.offsetHeight; el.style.transition = 'height .24s ease, opacity .18s ease'; el.style.height = '0px'; el.style.opacity = '0' }

// Guardar agendamiento / reprogramación
const saveSchedule = async () => {
    if (!currentRecord.value) return

    // Validaciones de formulario
    if (!fechaInicio.value || !fechaFin.value || !selectedTestId.value) {
        await swalStore.openSwal({
            type: 'warning',
            title: 'Campos incompletos',
            message: 'Selecciona fecha inicio, fecha fin y la prueba antes de guardar.',
            showConfirm: true, confirmText: 'Ok', confirmColor: 'btn-primary'
        })
        return
    }
    if (new Date(fechaFin.value) < new Date(fechaInicio.value)) {
        await swalStore.openSwal({
            type: 'warning',
            title: 'Rango de fechas inválido',
            message: 'La fecha fin debe ser igual o posterior a la fecha de inicio.',
            showConfirm: true, confirmText: 'Entendido', confirmColor: 'btn-primary'
        })
        return
    }
    if (new Date(fechaInicio.value) < new Date(today.value)) {
        await swalStore.openSwal({
            type: 'warning',
            title: 'Fecha de inicio en el pasado',
            message: 'La fecha de inicio no puede ser anterior a hoy.',
            showConfirm: true, confirmText: 'Ok', confirmColor: 'btn-primary'
        })
        return
    }

    // Persistencia en mock
    currentRecord.value.hasAppointment = true
    currentRecord.value.status = (statusId.value === 'Reprogramada') ? 'Reprogramada' : 'Programada'
    currentRecord.value.startDate = fechaInicio.value
    currentRecord.value.endDate = fechaFin.value
    currentRecord.value.testSent = true
    currentRecord.value.testMeta = {
        title: 'Nombre',
        category: 'Categoría',
        subtitle: 'Evaluación de conocimientos básicos sobre el cargo',
        questions: 25,
        duration: 25
    }
}

const tests = [
    'Retención cognitiva',
    'Reconocimiento de elementos visuales',
    'Redacción'
]

const activeIndex = ref(0) // por defecto, el primero activo
</script>

<template>
    <div class="breadcrumb">
        <!-- (tu breadcrumb tal cual) -->
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
        <span>Candidatos &lt;&lt; nombre de la vacante&gt;&gt;</span><span>|</span>
        <span>Entrevista</span><span>|</span>
        <span class="active">Prueba psicotécnica</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <div class="two-pane" :class="{ 'cv-open': showCV }">
                <div class="left-pane" ref="leftPane">
                    <h2 class="titulo">Prueba psicotécnica</h2>

                    <div class="form-container agend-card" :class="{ 'is-collapsed': agendCollapsed }">
                        <div class="form-section">
                            <div class="section-title-row">
                                <div class="section-title">Agendamiento de prueba</div>

                                <button v-if="showCollapse" class="collapse-btn"
                                    @click="agendCollapsed = !agendCollapsed" :aria-expanded="!agendCollapsed"
                                    :title="agendCollapsed ? 'Expandir' : 'Contraer'">
                                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                            stroke-width="1.8" />
                                        <path class="chev" :class="{ rotated: !agendCollapsed }" d="M10 8 L14 12 L10 16"
                                            fill="none" stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                <div v-if="currentRecord" v-show="!agendCollapsed" class="agend-content">
                                    <div id="agendamiento-body" class="grid-layout">
                                        <!-- Precargados -->
                                        <div class="input-group">
                                            <label class="label-bold" for="postulante">Postulante</label>
                                            <input type="text" id="postulante" class="input-box disabled"
                                                v-model="currentRecord.postulante" disabled>
                                        </div>

                                        <div class="input-group">
                                            <label class="label-bold" for="identificacion">Identificación</label>
                                            <input type="text" id="identificacion" class="input-box disabled"
                                                v-model="currentRecord.identificacion" disabled>
                                        </div>

                                        <!-- Estado solo si ya hay agendamiento -->
                                        <div class="input-group" v-if="currentRecord.hasAppointment">
                                            <label class="label-bold" for="estado">Estado</label>
                                            <SearchSelect id="estado" v-model="currentRecord.status"
                                                :options="estadoOptions" optionKey="name" valueKey="id"
                                                placeholder="Estado" :disabled="false" />
                                        </div>

                                        <div class="input-group">
                                            <label class="label-bold" for="entidad">Entidad</label>
                                            <input type="text" id="entidad" class="input-box disabled"
                                                v-model="currentRecord.entidad" disabled>
                                        </div>

                                        <div class="input-group">
                                            <label class="label-bold" for="sede">Sede</label>
                                            <input type="text" id="sede" class="input-box disabled"
                                                v-model="currentRecord.sede" disabled>
                                        </div>

                                        <div class="input-group">
                                            <label class="label-bold" for="direccion">Dirección</label>
                                            <input type="text" id="direccion" class="input-box disabled"
                                                v-model="currentRecord.direccion" disabled>
                                        </div>

                                        <!-- Fechas -->
                                        <div class="input-group">
                                            <label class="label-bold" for="fecha-inicio">Fecha inicio</label>
                                            <input type="date" id="fecha-inicio" class="input-box"
                                                :class="fechaDisabled ? 'disabled' : ''" v-model="fechaInicio"
                                                :disabled="fechaDisabled" :min="today" placeholder="AAAA-MM-DD"
                                                @change="() => { if (fechaFin && new Date(fechaFin) < new Date(fechaInicio)) fechaFin = '' }" />
                                        </div>

                                        <div class="input-group">
                                            <label class="label-bold" for="fecha-fin">Fecha fin</label>
                                            <input type="date" id="fecha-fin" class="input-box"
                                                :class="fechaDisabled ? 'disabled' : ''" v-model="fechaFin"
                                                :disabled="fechaDisabled" :min="fechaInicio || today"
                                                placeholder="AAAA-MM-DD" />
                                        </div>

                                        <div class="input-group">
                                            <label class="label-bold" for="test">Prueba</label>
                                            <SearchSelect id="test" v-model="selectedTestId" :options="testOptions"
                                                optionKey="name" valueKey="id" placeholder="Prueba"
                                                :disabled="fechaDisabled" />
                                        </div>
                                    </div>

                                    <div class="form-buttons">
                                        <button class="btn-primary" @click="saveSchedule" :disabled="guardarDisabled">
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <template v-if="currentRecord.hasAppointment">
                        <div style="margin-top:12px;">
                            <div v-if="currentRecord?.testSent && currentRecord?.testCompleted != true">
                                <div class="success-wrap">
                                    <div class="success-badge">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#1e8e3e"
                                            viewBox="0 0 256 256" aria-hidden="true">
                                            <path
                                                d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z" />
                                        </svg>
                                    </div>

                                    <h3 class="success-title">Prueba enviada exitosamente.</h3>
                                    <p class="success-subtitle">
                                        La respuesta del candidato aparecerá en este apartado una vez sea registrada.
                                    </p>

                                    <article class="exam-card">
                                        <div class="exam-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M249.8,85.49l-116-64a12,12,0,0,0-11.6,0l-116,64a12,12,0,0,0,0,21l21.8,12v47.76a19.89,19.89,0,0,0,5.09,13.32C46.63,194.7,77,220,128,220a136.88,136.88,0,0,0,40-5.75V240a12,12,0,0,0,24,0V204.12a119.53,119.53,0,0,0,30.91-24.51A19.89,19.89,0,0,0,228,166.29V118.53l21.8-12a12,12,0,0,0,0-21ZM128,45.71,219.16,96,186,114.3a1.88,1.88,0,0,1-.18-.12l-52-28.69a12,12,0,0,0-11.6,21l39,21.49L128,146.3,36.84,96ZM128,196c-40.42,0-64.65-19.07-76-31.27v-33l70.2,38.74a12,12,0,0,0,11.6,0L168,151.64v37.23A110.46,110.46,0,0,1,128,196Zm76-31.27a93.21,93.21,0,0,1-12,10.81V138.39l12-6.62Z">
                                                </path>
                                            </svg>
                                        </div>

                                        <div class="exam-main">
                                            <div class="exam-header">
                                                <div>
                                                    <h4 class="exam-title">Nombre</h4>
                                                    <small v-if="currentRecord.startDate && currentRecord.endDate">
                                                        {{ currentRecord.startDate }} — {{ currentRecord.endDate }}
                                                    </small>
                                                </div>
                                                <span class="exam-tag">Categoría</span>
                                            </div>
                                            <hr class="exam-sep" />
                                            <div class="exam-subtitle">Evaluación de conocimientos básicos sobre el
                                                cargo</div>
                                            <hr class="exam-sep" />

                                            <div class="exam-meta">
                                                <div class="meta-item">
                                                    <span class="meta-label">Preguntas</span>
                                                    <span class="meta-value">25</span>
                                                </div>
                                                <div class="meta-item">
                                                    <span class="meta-label">Duración</span>
                                                    <span class="meta-value">25 min</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            </div>

                            <div v-else-if="currentRecord?.testCompleted == true">
                                <div class="test-grid-container">
                                    <div class="panel-test-left">
                                        <div class="panel-test-header">
                                            <div class="test-header-name">
                                                <h3>Habilidades blandas</h3>
                                            </div>
                                            <h4>Resultados prueba</h4>
                                            <h2>0.0</h2>
                                            <p>0/5</p>
                                        </div>
                                        <div class="panel-test-left-body">
                                            <p v-for="(test, index) in tests" :key="index" class="test-item"
                                                :class="{ active: activeIndex === index }" @click="activeIndex = index">
                                                <span>{{ index + 1 }}. {{ test }}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div class="panel-test-right">
                                        <!-- Encabezado -->
                                        <div class="test-detail-header">
                                            <h2 class="test-title">1. Redacción cognitiva</h2>
                                            <p class="test-subtitle">
                                                Este ejercicio tiene como objetivo evaluar la memoria visual y la
                                                capacidad de evocación.
                                            </p>
                                        </div>

                                        <!-- Preguntas -->
                                        <div class="questions-container">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

.form-container p {
    margin: 6px 0;
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

/* --- Contenedor general --- */
.success-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #eafcf1 0%, #ffffff 35%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

/* círculo del check con degradado suave */
.success-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #d6f5e0 60%, #eafcf1 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}

.success-title {
    margin: 0;
    font: 700 20px/1.25 Poppins, ui-sans-serif, system-ui;
    color: #222;
}

.success-subtitle {
    margin: 8px 0 18px;
    color: #6b7280;
    font: 400 14px/1.5 Inter, ui-sans-serif, system-ui;
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
</style>