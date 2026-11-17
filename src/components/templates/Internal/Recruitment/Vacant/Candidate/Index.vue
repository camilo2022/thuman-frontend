<script setup>
import { computed, defineAsyncComponent } from 'vue'
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    vacants: Array,
    vacant: Object,
    applications: Array,
    pagination: Object,
    filters: Object,
    modelVacant: Object,
    formatTime: Function,
    contarMeses: Function,
    showCandidate: Boolean,
    loadingData: Boolean,
    modelApplication: Object,
    loadingFind: Boolean,
    academicQualifications: Array,
    languageProficiencies: Array,
    professionalSkills: Array,
    professionalExperiences: Array,
    compatibility: Number
})

const Detail = defineAsyncComponent(() => import('@/components/shared/features/CurriculumDetail.vue'))

const emit = defineEmits(['curriculum', 'submitCandidateFind', 'close-detail', 'detail', 'indexVacant'])

// Navegación de páginas
const goTo = p => props.pagination.current_page = p;
const prev = () => goTo(props.pagination.current_page - 1);
const next = () => goTo(props.pagination.current_page + 1);

const pageItems = computed(() => {
    const total = props.pagination.total_pages
    const current = props.pagination.current_page
    const delta = 2 // cuántas páginas mostrar alrededor del actual
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)
    pages.push(1)
    if (left > 2) pages.push('…')
    for (let i = left; i <= right; i++) {
        pages.push(i)
    }
    if (right < total - 1) pages.push('…')
    pages.push(total)
    return pages
})

const keyMap = {
    Pendientes: 'Pendiente',
    Revisados: 'En revisión',
    Pruebas: 'Prueba',
    Finalistas: 'Finalista',
    Contratación: 'Contratación',
    Rechazados: 'Rechazado',
    Desistidos: 'Desistió',
    Vinculados: 'Vinculado'
}

const totals = computed(() => {
    const f = props.filters ?? {}
    const total =
        props.postulates?.length ??
        Object.values(f).reduce((a, b) => a + (Number(b) || 0), 0)

    return [
        { type: 'Totales', count: total, status: null },
        ...Object.entries(keyMap).map(([type, status]) => ({
            type,
            count: f[status] ?? 0,
            status
        }))
    ]
})

//Paths de los iconos para los diferentes estados de los cantidatos
const ICON_PATHS = {
    //Todos los candidatos
    null: "M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z",
    //Candidato pendiente
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
    //Candidato revisado
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    //Candidato en pruebas
    'Prueba': "M237.66,86.34l-60-60a8,8,0,0,0-11.32,0L37.11,155.57a44.77,44.77,0,0,0,63.32,63.32L212.32,107l22.21-7.4a8,8,0,0,0,3.13-13.25ZM89.11,207.57a28.77,28.77,0,0,1-40.68-40.68l28.8-28.8c8.47-2.9,21.75-4,39.07,5,10.6,5.54,20.18,8,28.56,8.73ZM205.47,92.41a8,8,0,0,0-3.13,1.93l-39.57,39.57c-8.47,2.9-21.75,4-39.07-5-10.6-5.54-20.18-8-28.56-8.73L172,43.31,217.19,88.5Z",
    //Candidato finalista
    'Finalista': "M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z",
    //Candidato finalista
    'Contratación': "M114.32,49.8A19.79,19.79,0,0,0,81.72,57L29.22,201.41A19.82,19.82,0,0,0,47.75,228a20,20,0,0,0,6.84-1.22L199,174.28a19.79,19.79,0,0,0,7.24-32.6ZM104.19,183.21l-31.4-31.4L82.94,123.9l49.16,49.16Zm-52.42,26.4Zm12-32.91L79.3,192.26l-24.45,8.89ZM157,164,92,99l10-27.58L184.57,154ZM128,40V16a12,12,0,0,1,24,0V40a12,12,0,0,1-24,0Zm116.48,83.51a12,12,0,0,1-17,17l-16-16a12,12,0,0,1,17-17Zm-.69-40.13-24,8a12,12,0,0,1-7.59-22.77l24-8a12,12,0,1,1,7.59,22.77ZM156.6,65.93C159.83,47.47,173.39,36,192,36c6.45,0,8.69-2.49,10-4.92a18,18,0,0,0,2-7.22V24a12,12,0,0,1,24,0c0,14.47-9.59,36-36,36-4.94,0-10.21,1.19-11.76,10.06A12,12,0,0,1,168.43,80a12.35,12.35,0,0,1-2.08-.18A12,12,0,0,1,156.6,65.93Z",
    //Candidato rechazado
    'Rechazado': "M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
    //Candadito desiste
    'Desistió': "M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z",
    //Condidato vinculado
    'Vinculado': "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
}

//Semaforización por % de los candidatos
const compatibilityClass = (compat) => {
    const value = parseInt(compat)
    if (value >= 80) return 'badge--success'
    if (value >= 60) return 'badge--warn'
    return 'badge--danger'
}
</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('indexVacant')">
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
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reclutamiento</span>
        <span>|</span>
        <span>Vacantes</span>
        <span>|</span>
        <span class="active">Candidatos de {{ modelVacant.relationships?.position?.name }}</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showCandidate }">
            <div class="split-main">
                <div class="main-container">

                    <!-- TÍTULO -->
                    <h2 class="titulo">Candidatos de {{ modelVacant.relationships?.position?.name }} | ({{
                        modelVacant.relationships?.position?.area?.name }})</h2>

                    <!-- FILTROS SUPERIORES -->
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total === 1 ? 'Candidato' : 'Candidatos' }}
                        </button>

                        <!-- Botones de vista y botón crear juntos -->
                        <div class="acciones-derecha">
                            <div class="vista-toggle">
                                <button :class="{ active: props.pagination.mode === 'grid' }"
                                    @click="props.pagination.mode = 'grid'" aria-label="Vista de tarjetas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M180,72H36A20,20,0,0,0,16,92V204a20,20,0,0,0,20,20H180a20,20,0,0,0,20-20V92A20,20,0,0,0,180,72Zm-4,128H40V96H176ZM240,52V176a12,12,0,0,1-24,0V56H64a12,12,0,0,1,0-24H220A20,20,0,0,1,240,52Z" />
                                    </svg>
                                </button>
                                <button :class="{ active: props.pagination.mode === 'tabla' }"
                                    @click="props.pagination.mode = 'tabla'" aria-label="Vista de tabla">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M84,64A12,12,0,0,1,96,52H216a12,12,0,0,1,0,24H96A12,12,0,0,1,84,64Zm132,52H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM56,52H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="filterPostulates">
                        <div v-for="(t, i) in totals" :key="i" class="card-filter"
                            :class="{ 'is-selected': t.status === props.pagination.status }"
                            @click="props.pagination.status = t.status">
                            <div class="card-header-filter" :class="{
                                'status-total': t.type === 'Totales',
                                'status-pending': t.type === 'Pendientes',
                                'status-reviewed': t.type === 'Revisados',
                                'status-tests': t.type === 'Pruebas',
                                'status-finalist': t.type === 'Finalistas',
                                'status-hiring': t.type === 'Contratación',
                                'status-rejected': t.type === 'Rechazados',
                                'status-withdrawn': t.type === 'Desistidos',
                                'status-linked': t.type === 'Vinculados'
                            }">
                                <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor">
                                    <path :d="ICON_PATHS[t.status]" />
                                </svg>
                            </div>
                            <div class="card-count">
                                <span>{{ t.type }}</span>
                                {{ t.count }}
                            </div>
                        </div>
                    </div>




                    <div class="tabla-toolbar">
                        <label class="page-size">
                            Elementos por página:
                            <select v-model="props.pagination.per_page" class="select-underline">
                                <option v-for="n in props.pagination.sizes" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </label>

                        <div class="search-underline">
                            <input v-model="props.pagination.search" type="text" placeholder="Buscar" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>


                    <div class="grid-layout" v-if="props.pagination.mode === 'grid'">
                        <div v-if="props.loadingData" v-for="n in 4" :key="n" class="card" aria-busy="true"
                            :inert="true"
                            style="padding:15px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);width:280px;">

                            <!-- Header pill + icon -->
                            <div
                                style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                <div class="skeleton skel-pill"></div>
                                <div class="skeleton skel-icon"></div>
                            </div>

                            <!-- Avatar -->
                            <div class="skeleton skel-avatar"></div>

                            <!-- Nombre -->
                            <div class="skeleton skel-line" style="width:80%;"></div>
                            <div class="skeleton skel-line" style="width:50%;"></div>

                            <hr style="margin:12px 0;">

                            <!-- Texto inferior -->
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-half" style="width:70%;"></div>
                            <div class="skeleton skel-half" style="width:55%;"></div>
                            <div class="skeleton skel-footer"></div>

                        </div>
                        <div v-else v-for="(application, index) in props.applications" :key="index">
                            <div class="card">
                                <!-- Header: badges superior izquierda y derecha -->
                                <div class="card-header card-header--badges">
                                    <span class="badge" :class="compatibilityClass(application.compatibility)">
                                        {{ application.compatibility }}%
                                    </span>

                                    <span class="badge" :class="{
                                        'status-total': application.status === 'Totales',
                                        'status-pending': application.status === 'Pendiente',
                                        'status-reviewed': application.status === 'En revisión',
                                        'status-tests': application.status === 'Prueba',
                                        'status-finalist': application.status === 'Finalista',
                                        'status-hiring': application.status === 'Contratación',
                                        'status-rejected': application.status === 'Rechazado',
                                        'status-withdrawn': application.status === 'Desistió',
                                        'status-linked': application.status === 'Vinculado',
                                    }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                            <path :d="ICON_PATHS[application.status]" />
                                        </svg>{{ application.status }}</span>
                                </div>

                                <!-- Foto -->
                                <div class="card-img">
                                    <img class="profile-pic" :src="application.person.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>

                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <h3 class="title-name">{{ [application.person.first_name,
                                    application.person.second_name, application.person.first_last_name,
                                    application.person.second_last_name].filter(Boolean).join(' ') }}</h3>
                                    <div class="subtitle ">{{ application.person.profile?.title || 'Sin información' }}
                                    </div>

                                    <div class="meta-row">
                                        <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="#000000" viewBox="0 0 256 256">
                                            <path
                                                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z">
                                            </path>
                                        </svg>
                                        <span>{{ `${application.person.city?.departament?.country?.name}` }}, {{
                                            application.person.city?.departament?.name }}, {{
                                                application.person.city?.name }}</span>
                                    </div>

                                    <hr class="divider" />

                                    <div class="info-row"><span class="muted">Experiencia:</span>
                                        <p>{{
                                            contarMeses(application.person.profile?.professional_experiences[0]?.start_date,
                                                application.person.profile?.professional_experiences[0]?.
                                                    end_date) == '0 meses' ? 'Sin experiencia' :
                                                contarMeses(application.person.profile?.professional_experiences[0]?.
                                                    start_date,
                                                    application.person.profile?.professional_experiences[0]?.
                                                        end_date) || 'Sin información' }}</p>
                                    </div>
                                    <div class="info-row"><span class="muted">Fecha de postulación:</span>{{
                                        application.created_at?.split(' ')[0] ||
                                        '00/00/0000 00:00' }}</div>

                                    <div class="card-actions-bottom">
                                        <Button title="Hoja de vida" icon="files" variant="question"
                                            @click="emit('curriculum', application); emit('submitCandidateFind', application.id)" />
                                        <Button title="Detalle" icon="list" variant="question"
                                            @click="emit('detail', application); emit('submitCandidateFind', application.id)" />
                                        <template v-if="application.status === ''">
                                            <Button title="Realizar" icon="handshake" variant="question" />
                                        </template>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div v-if="props.pagination.mode === 'tabla'">

                        <div class="tabla-style">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Profesión</th>
                                        <th>Ciudad</th>
                                        <th>Experiencia</th>
                                        <th>Fecha de postulación</th>
                                        <th>compatibilidad</th>
                                        <th>Estado</th>
                                        <th class="col-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody v-if="props.loadingData">
                                    <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-col"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton skel-pill-sm"></div>
                                        </td>
                                        <td>
                                            <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(application, index) in props.applications" :key="index">
                                        <td>{{ application.person.first_name }} {{
                                            application.person.first_last_name
                                            }}</td>
                                        <td>{{ application.person.profile?.title ||
                                            'Sin información' }}</td>
                                        <td>{{ application.person.city?.name || '' }}, {{
                                            application.person.city?.departament?.country?.name || 'Sin información' }}
                                        </td>
                                        <td>{{
                                            contarMeses(application.person.profile?.professional_experiences[0]?.
                                                start_date,
                                                application.person.profile?.professional_experiences[0]?.
                                                    end_date) == '0 meses' ? 'Sin experiencia' :
                                                contarMeses(application.person.profile?.professional_experiences[0]?.
                                                    start_date,
                                                    application.person.profile?.professional_experiences[0]?.
                                                        end_date) || 'Sin información' }}
                                        </td>
                                        <td>{{
                                            application.created_at ||
                                            '00/00/0000 00:00' }}
                                        </td>
                                        <td>
                                            <span class="badge" :class="compatibilityClass(application.compatibility)">
                                                {{ application.compatibility }}%
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge" :class="{
                                                'status-total': application.status === 'Totales',
                                                'status-pending': application.status === 'Pendiente',
                                                'status-reviewed': application.status === 'En revisión',
                                                'status-tests': application.status === 'Prueba',
                                                'status-finalist': application.status === 'Finalista',
                                                'status-hiring': application.status === 'Contratación',
                                                'status-rejected': application.status === 'Rechazado',
                                                'status-withdrawn': application.status === 'Desistió',
                                                'status-linked': application.status === 'Vinculado',
                                            }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                    <path :d="ICON_PATHS[application.status]" />
                                                </svg>{{ application.status }}</span>
                                        </td>
                                        <td class="acciones">
                                            <span class="actions">
                                                <Button title="Hoja de vida" icon="files" variant="question"
                                                    @click="emit('curriculum', application); emit('submitCandidateFind', application.id)" />
                                                <Button title="Detalle" icon="list" variant="question"
                                                    @click="emit('detail', application); emit('submitCandidateFind', application.id)" />
                                                <template v-if="application.status === ''">
                                                    <Button title="Realizar" icon="handshake" variant="question" />
                                                </template>
                                            </span>
                                        </td>
                                    </tr>

                                    <tr v-if="props.pagination.total === 0">
                                        <td colspan="4" class="no-results">Sin resultados</td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Pie: texto izquierda + paginación derecha -->

                        </div>
                    </div>

                    <div class="table-footer">
                        <div class="page-info">
                            Página {{ props.pagination.current_page }} de {{ props.pagination.total_pages }}
                        </div>

                        <div class="pagination">
                            <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                :disabled="props.pagination.current_page === 1">
                                &laquo;
                            </button>

                            <button class="page-btn" aria-label="Anterior" @click="prev()"
                                :disabled="props.pagination.current_page === 1">
                                &lsaquo;
                            </button>

                            <!-- Páginas dinámicas -->
                            <div v-for="(p, i) in pageItems" :key="i">
                                <button v-if="p !== '…'" class="page-btn"
                                    :class="{ active: p === props.pagination.current_page }" @click="goTo(p)">
                                    {{ p }}
                                </button>
                                <span v-else class="dots">…</span>
                            </div>

                            <button class="page-btn" aria-label="Siguiente" @click="next()"
                                :disabled="props.pagination.current_page === props.pagination.total_pages">
                                &rsaquo;
                            </button>

                            <button class="page-btn" aria-label="Última" @click="goTo(props.pagination.total_pages)"
                                :disabled="props.pagination.current_page === props.pagination.total_pages">
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="showCandidate">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Hoja de vida</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail :loadingFind="loadingFind" :modelApplication="modelApplication"
                                        :modelvacant="modelVacant" :contarMeses="props.contarMeses"
                                        :formatTime="props.formatTime" :academicQualifications="academicQualifications"
                                        :languageProficiencies="languageProficiencies"
                                        :professionalSkills="professionalSkills"
                                        :professionalExperiences="professionalExperiences"
                                        :compatibility="compatibility" @close-detail="emit('close-detail')" />
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
/* === FILTROS === */
.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
}

.filtros>* {
    height: auto !important;
    /* clave: deja que acciones crezcan */
}

.btn-count,
.vista-toggle button,
.btn-primary {
    height: 40px;
}

.input-search {
    flex: 1;
    /* ocupa todo el espacio libre */
    min-width: 220px;
    /* mínimo para que no se encoja demasiado */
    display: flex;
    align-items: center;
    position: relative;
}

/* Responsivo */
@media (max-width: 1024px) {
    .input-box input {
        width: min(520px, 50vw);
    }
}

@media (max-width: 768px) {
    .filtros {
        gap: 10px;
    }

    .btn-crear {
        order: 99;
        width: 100%;
        justify-content: center;
        margin-left: 0;
    }

    .select-duo {
        min-width: 220px;
    }

    .input-box input {
        width: 100%;
    }
}

/* === GRID GENERAL === */
.grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
}

@media (max-width:1200px) {
    .grid-layout {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    }
}

@media (max-width:900px) {
    .grid-layout {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width:600px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }
}

/* === CARD === */
.card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    overflow: hidden;
    transition: transform .2s ease;
}

.card:hover {
    transform: translateY(-4px);
}

/* header vacío solo para ubicar acciones arriba a la derecha */
.card-header {
    display: grid;
    grid-template-columns: 1fr auto;
    /* título se expande; acciones ocupan lo justo */
    align-items: center;
    /* acciones pegadas arriba */
    gap: 8px;
    padding: 14px 16px 0;
}

/* acciones flotantes */
.card-actions {
    justify-self: end;
    align-self: start;
    display: flex;
    gap: 6px;
}

.btn-text {
    color: #5b4cd0;
    font-weight: 500;
}

/* cuerpo */
.card-body {
    padding: 16px;
}

.card-title {
    margin: 0;
    color: #2b2c34;
    font-size: 12px;
}


.card-description {
    font-size: .85rem;
    color: #666;
}

.card-description p {
    margin: 6px 0;
}

.card-description strong {
    font-weight: 600;
    color: #555;
    display: inline-block;
}

.filterPostulates {
    display: grid;
    grid-template-columns: repeat(auto-fit, 220px);
    justify-content: center;
    gap: 14px;
    background: #eae3ff;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
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

.card-header-filter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    flex-shrink: 0;
}

.card-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* ya tienes tu .grid-layout y .card base */

.card-header--badges {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px 0;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
}

.badge svg {
    display: block;
    /* elimina espacios fantasmas */
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2;
}

.badge--warn {
    color: #8a6a00;
    background: #fff7cc;
    border-color: #ffe894;
}

.card-img {
    display: flex;
    justify-content: center;
    padding: 10px 16px 0;
}

.profile-pic {
    width: 140px;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.title-name {
    margin: 10px 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: #2b2c34;
}

.subtitle {
    color: #5b4cd0;
    font-weight: 600;
    text-decoration: none;
    font-size: 12px;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
}

.meta-row {
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    font-size: 12px;
}

.meta-icon {
    width: 14px;
    height: 14px;
    display: block;
    color: #6b7280;
}

.divider {
    border: 0;
    border-top: 1px solid #eee;
    margin: 10px 0;
    width: 100% !important;
}

.info-row {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
}

.muted {
    color: #6b7280;
}

.card-actions-bottom {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef0ff;
    color: #5b4cd0;
    border: 1px solid #dadcfb;
    transition: transform .15s ease, background .15s ease;
}

.icon-btn:hover {
    transform: translateY(-1px);
    background: #e6e8ff;
}

.icon-btn svg {
    width: 18px;
    height: 18px;
    display: block;
}

.status-total {
    background: #F2EFFF;
    border: 2px solid #7C6CF6;
    color: #4C3BCF;
}

.status-pending {
    background: #fff9c4;
    border: 2px solid #ca8a04;
    color: #ca8a04;
}

.status-reviewed {
    background: #EAF2FF;
    border: 2px solid #3B82F6;
    color: #3B82F6;
}

.status-tests {
    background: #E6F9FB;
    border: 2px solid #06B6D4;
    color: #06B6D4;
}

.status-finalist {
    background: #EAFBF1;
    border: 2px solid #22C55E;
    color: #15803D;
}

.status-hiring {
    background: #E8F5EC;
    border: 2px solid #16A34A;
    color: #16A34A;
}

.status-rejected {
    background: #FEECEC;
    border: 2px solid #EF4444;
    color: #EF4444;
}

.status-withdrawn {
    background: #FFF1E8;
    border: 2px solid #F97316;
    color: #F97316;
}

.status-linked {
    background: #E6F4EA;
    border: 2px solid #15803D;
    color: #15803D;
}


.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

/* Split layout: 1 columna por defecto, 2 cuando el panel está abierto */
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

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

.skel-pill {
    width: 90px;
    height: 22px;
    border-radius: 20px;
}

.skel-icon {
    width: 30px;
    height: 30px;
    border-radius: 6px;
}

.skel-avatar {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    margin: 12px auto;
}

.skel-line {
    height: 14px;
    margin: 6px 0;
}

.skel-half {
    height: 14px;
    width: 60%;
    margin: 6px 0;
}

.skel-footer {
    height: 14px;
    width: 40%;
    margin: 6px 0;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

.skel-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
    /* ajusta según columnas reales */
    gap: 16px;
    padding: 12px 0;
}

.skel-col {
    height: 14px;
    border-radius: 6px;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

.skel-pill-sm {
    width: 80px;
    height: 20px;
    border-radius: 20px;
}

@media (max-width: 500px) {
    .filterPostulates {
        grid-template-columns: repeat(2, 1fr);
    }

    .card-count {
        font-size: 12px;
    }

    .card-header-filter {
        width: 30px;
        height: 30px;
        border-radius: 5px;
    }

    .card-header-filter svg {
        width: 15px;
        height: 15px;
    }
}

@media (max-width: 400px) {
    .card-filter {
        padding: 5px;
        gap: 6px;
    }

    .card-count {
        font-size: 11px;
    }
}

/* En tablet/móvil: todo en columna y acciones con wrap */
@media (max-width: 768px) {
    .filtros {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .acciones-derecha {
        width: 100%;
        margin-left: 0;
        justify-content: space-between;
    }

    /* El botón crear ocupa lo disponible y si no cabe baja */
    .acciones-derecha .btn-primary {
        flex: 1 1 240px;
        max-width: 100%;
        justify-content: center;
    }
}


/* <= 480px: fuerza el botón a 100% siempre */
@media (max-width: 480px) {
    .acciones-derecha {
        justify-content: center;
    }

    .acciones-derecha .btn-primary {
        flex-basis: 100%;
        min-width: 100%;
    }
}
</style>