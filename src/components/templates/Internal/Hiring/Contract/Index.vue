<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue';
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    applications: Array,
    pagination: Object,
    showDetailContractManagement: Boolean,
    areasWithAll: Array,
    contractTypeWithAll: Array,
    entityWithAll: Array
})

const emit = defineEmits(['management', 'create', 'submitApplicationFind', 'submitcontractfind', 'contractsTypeAll']);

const Detail = defineAsyncComponent(() => import('@/components/shared/features/ContractDetail.vue'))

const activeTab = ref(0);

const ICON_PATHS = {
    //Candidato pendiente
    'Pendiente': "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z",
    //Candidato revisado
    'Actualizar': "M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z",
    //Candidato finalista
    'Aprobado': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    //Candidato rechazado
    'Firmado': "M222.33,123.89c-.06-.13-.12-.26-.19-.38L192,69.9V32a16,16,0,0,0-16-16H80A16,16,0,0,0,64,32V69.92L33.86,123.51c-.07.12-.13.25-.2.38a15.94,15.94,0,0,0,1.46,16.57l.11.14,86.44,112.28a8,8,0,0,0,12.67,0L220.77,140.6l.11-.14A15.92,15.92,0,0,0,222.33,123.89ZM176,32V64H80V32ZM128,144a12,12,0,1,1,12-12A12,12,0,0,1,128,144Zm8,80.5V158.83a28,28,0,1,0-16,0v65.66L48,131,76.69,80H179.32L208,131Z",
    //Candadito desiste
    'Desistió': "M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z",
    'Devuelto': "M140,80v41.21l34.17,20.5a12,12,0,1,1-12.34,20.58l-40-24A12,12,0,0,1,116,128V80a12,12,0,0,1,24,0ZM128,28A99.38,99.38,0,0,0,57.24,57.34c-4.69,4.74-9,9.37-13.24,14V64a12,12,0,0,0-24,0v40a12,12,0,0,0,12,12H72a12,12,0,0,0,0-24H57.77C63,86,68.37,80.22,74.26,74.26a76,76,0,1,1,1.58,109,12,12,0,0,0-16.48,17.46A100,100,0,1,0,128,28Z",
    'En revisión': "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
}

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

function openPreview(doc) {
    const url = 'http://transformacion_digital-recursos_humanos-backend.test/storage/Person/fR1bwAvlWKMKOSt9uzcpVjmLDtRoWgdIidJJGtyY.pdf'
    const name = 'Exámenes_médicos.pdf'
    preview.value = { url: url || '', name: name || 'Documento.pdf' }

    // Se comentarea temporalmente, para cuando se haga conexión con el backend
    // preview.value = { url: doc?.url || '', name: doc?.name || 'Documento.pdf' }
    showPreview.value = true
}

function getContractStatus(application) {
    const c = application?.contract;

    if (!c) return 'Pendiente';
    if (c.person_status === 'Firmado') return 'Firmado';
    if (c.person_status === 'Desistió') return 'Desistió';
    if (c.person_status === 'Actualizar') return 'Actualizar';
    if (c.legal_representative_status === 'En revisión') return 'En revisión';
    if (c.legal_representative_status === 'Aprobado') return 'Aprobado';

    return 'Pendiente';
}

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
</script>

<template>
    <div class="breadcrumb">
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
        <span>Contratación</span>
        <span>|</span>
        <span class="active">Gestión de contratos</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailContractManagement }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Gestión de contratos</h2>
                    <div class="tabs-wrap">
                        <div class="nav-tabs" :style="{ '--active': activeTab }" role="tablist">
                            <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                :aria-selected="activeTab === 0"
                                @click="activeTab = 0; props.pagination.status = 'Contratación'">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z">
                                    </path>
                                </svg>Candidatos
                            </button>
                            <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                :aria-selected="activeTab === 1"
                                @click="activeTab = 1; props.pagination.status = 'Vinculado';">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M200,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V40A20,20,0,0,0,200,20Zm-4,192H60V44H196ZM84,68A12,12,0,0,1,96,56h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,68Zm8.8,127.37a48,48,0,0,1,70.4,0,12,12,0,0,0,17.6-16.32,72,72,0,0,0-19.21-14.68,44,44,0,1,0-67.19,0,72.12,72.12,0,0,0-19.2,14.68,12,12,0,0,0,17.6,16.32ZM128,116a20,20,0,1,1-20,20A20,20,0,0,1,128,116Z">
                                    </path>
                                </svg>Empleados
                            </button>
                            <span class="underline"></span>
                        </div>
                    </div>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total === 1 ? 'Contrato' : 'Contratos' }}
                        </button>

                        <SearchSelect :options="props.entityWithAll" v-model="props.pagination.entity_id"
                            optionKey="name" valueKey="id" placeholder="Todas las entidades" />

                        <SearchSelect :options="props.areasWithAll" v-model="props.pagination.area_id" optionKey="name"
                            valueKey="id" placeholder="Todas las áreas" />

                        <SearchSelect :options="props.contractTypeWithAll" v-model="props.pagination.contract_type_id"
                            optionKey="name" valueKey="id" placeholder="Todas los tipos de contrato" />

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


                    <div v-if="props.pagination.mode == 'grid'" class="grid-content">
                        <template v-if="false">
                            <!-- 5 cards de ejemplo -->
                            <div class="candidate-card-skeleton" v-for="n in 5" :key="n">
                                <!-- Header -->
                                <div class="candidate-card-header">
                                    <div class="skeleton-block skeleton-menu-icon"></div>
                                    <div class="skeleton-block skeleton-menu-icon"></div>
                                </div>

                                <!-- Avatar -->
                                <div class="candidate-avatar-wrapper">
                                    <div class="skeleton-block skeleton-avatar-large"></div>
                                </div>

                                <!-- Texto -->
                                <div class="candidate-card-body">
                                    <div class="skeleton-block skeleton-vacancy-title"></div>
                                    <div class="skeleton-block skeleton-body-line"></div>
                                    <div class="skeleton-block skeleton-body-line"></div>
                                    <div class="skeleton-block skeleton-body-line short"></div>
                                </div>

                                <!-- Botones -->
                                <div class="candidate-card-footer">
                                    <div class="skeleton-block skeleton-action-btn"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="props.pagination.total === 0" class="no-results">
                                <div class="no-results">
                                    <div class="no-results-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="#000000"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <p class="info" style="font-size: 16px;">No se encontraron registros</p>
                                </div>
                            </div>
                            <div v-else class="card" v-for="application in props.applications" :key="application.id">
                                <!-- Header / acciones -->
                                <div class="card-header">
                                    <span class="badge bg-purple">{{ application.vacant.contract_type.name }}</span>
                                    <!-- Botón Detalles -->
                                    <div class="card-actions">
                                        <span class="badge" :class="{
                                            'bg-purple-strong': application?.contract?.person_status === 'Firmado',
                                            'bg-yellow': !application?.contract /*'Pendiente'*/,
                                            'bg-blue': application?.contract?.legal_representative_status === 'En revisión',
                                            'bg-green': application?.contract?.legal_representative_status === 'Aprobado',
                                            'bg-orange': application?.contract?.person_status === 'Desistió',
                                            'bg-purple': application?.contract?.person_status === 'Actualizar'
                                        }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                <path :d="ICON_PATHS[getContractStatus(application)]" />
                                            </svg>{{ getContractStatus(application) }}</span>
                                    </div>
                                </div>
                                <!-- Foto -->
                                <div class="card-img">
                                    <img class="profile-pic" :src="application.person.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>

                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <h4 class="title-name">{{ [application.person.first_name,
                                        application.person.second_name, application.person.first_last_name,
                                        application.person.second_last_name].filter(Boolean).join(' ') }}</h4>
                                    <hr class="divider" />
                                    <div class="info-row"><span class="muted">Área:</span>{{
                                        application.vacant.position.area.name }}</div>
                                    <div class="info-row"><span class="muted">Cargo:</span>{{
                                        application.vacant.position.name }}</div>
                                    <div class="info-row"><span class="muted">Fecha de postulación:</span>{{
                                        application.created_at }}
                                    </div>
                                </div>
                                <div class="form-buttons">
                                    <template v-if="activeTab == 0">
                                        <template v-if="!application.contract">
                                            <Button title="Crear contrato" icon="file-plus" variant="question"
                                                @click="emit('create'); emit('submitApplicationFind', application.id);" />
                                        </template>
                                        <template
                                            v-else-if="['Actualizar'].includes(application.contract?.person_status)">
                                            <Button title="Editar contrato" icon="hands" variant="question"
                                                @click="emit('create'); emit('configurationFind')" />
                                        </template>
                                    </template>

                                    <template v-else-if="activeTab == 1">
                                        <template
                                            v-if="application?.contract?.legal_representative_status == 'Firmado'">
                                            <Button title="Gestionar contrato" icon="hands" variant="question"
                                                @click="emit('management'); emit('submitcontractfind', application.id);" />
                                        </template>
                                        <template
                                            v-else-if="application?.contract?.legal_representative_status == 'Aprobado' || application?.contract?.legal_representative_status == 'Desistió' || application?.contract?.legal_representative_status == 'En revisión'">
                                            <Button title="Previsualizar" icon="preview" variant="question"
                                                @click="openPreview(null)" />
                                        </template>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="props.pagination.mode === 'tabla'" class=" tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Area</th>
                                        <th>Cargo</th>
                                        <th>Fecha de postulación</th>
                                        <th>Tipo de contrato</th>
                                        <th>Estado</th>
                                        <th class="col-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody v-if="false">
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
                                    <tr v-for="application in props.applications" :key="application.id">
                                        <td>{{ [application.person.first_name, application.person.second_name,
                                            application.person.first_last_name,
                                            application.person.second_last_name]
                                            .filter(Boolean).join('') }}</td>
                                        <td>{{ application.vacant.position.area.name }}</td>
                                        <td>{{ application.vacant.position.name }}</td>
                                        <td>{{ application.created_at }}</td>
                                        <td>{{ application.vacant.contract_type.name }}</td>
                                        <td><span class="badge" :class="{
                                            'bg-purple-strong': application?.contract?.person_status === 'Firmado',
                                            'bg-yellow': !application?.contract /*'Pendiente'*/,
                                            'bg-blue': application?.contract?.legal_representative_status === 'En revisión',
                                            'bg-green': application?.contract?.legal_representative_status === 'Aprobado',
                                            'bg-orange': application?.contract?.person_status === 'Desistió',
                                            'bg-purple': application?.contract?.person_status === 'Actualizar'
                                        }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                    <path :d="ICON_PATHS[getContractStatus(application)]" />
                                                </svg>{{ getContractStatus(application) }}</span></td>
                                        <td class="acciones">
                                            <span class="actions">
                                                <template v-if="activeTab == 0">
                                                    <template v-if="!application.contract">
                                                        <Button title="Crear contrato" icon="file-plus"
                                                            variant="question"
                                                            @click="emit('create'); emit('configurationFind')" />
                                                    </template>
                                                    <template
                                                        v-else-if="['Pendiente', 'Actualizar'].includes(application.contract?.person_status) && ['En revisión', 'Aprobado'].includes(application?.contract?.legal_representative_status)">
                                                        <Button title="Editar contrato" icon="hands" variant="question"
                                                            @click="emit('create'); emit('configurationFind')" />
                                                    </template>
                                                </template>

                                                <template v-else-if="activeTab == 1">
                                                    <template
                                                        v-if="application?.contract?.legal_representative_status == 'Firmado'">
                                                        <Button title="Gestionar contrato" icon="hands"
                                                            variant="question"
                                                            @click="emit('management'); emit('submitcontractfind', application.id);" />
                                                    </template>
                                                    <template
                                                        v-else-if="application?.contract?.legal_representative_status == 'Aprobado' || application?.contract?.legal_representative_status == 'Desistió' || application?.contract?.legal_representative_status == 'En revisión'">
                                                        <Button title="Previsualizar" icon="preview" variant="question"
                                                            @click="openPreview(null)" />
                                                    </template>
                                                </template>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="props.pagination.total == 0">
                                        <td colspan="7" class="no-results">Sin resultados</td>
                                    </tr>
                                </tbody>
                            </table>
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
                <div class="split-panel" v-if="props.showDetailContractManagement">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail @approve="emit('approve')" @reject="emit('reject')"
                                        @approveSignature="emit('approveSignature')"
                                        @rejectSignature="emit('rejectSignature')"
                                        :pdfUrl="'http://transformacion_digital-recursos_humanos-backend.test/storage/Person/7rxCG1a6NosbJySMCf1FVfKs4DTSs5RRbfL6Yn86.pdf'" />
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
    <PDFPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
</template>

<style scoped>
.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 800px;
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

.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 20px;
}

/* Normalizamos alto/espaciado de todos los controles */
.filtros>* {
    height: 40px;
    /* clave para que todo se vea alineado */
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

.select-data {
    margin-bottom: 20px;
}

.checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}

/* Ocultar el input nativo */
.checkbox-input {
    display: none;
}

/* Caja del checkbox */
.checkbox-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.25s ease;
}

/* Ícono del check */
.check-icon {
    width: 14px;
    height: 14px;
    color: white;
    opacity: 0;
    transition: opacity 0.25s ease;
}

/* Efecto al marcar */
.checkbox-input:checked+.checkbox-box {
    background-color: #5b4cd0;
    box-shadow: 0 0 8px rgba(91, 76, 208, 0.5);
    transform: scale(1.05);
}

/* Mostrar el ícono */
.checkbox-input:checked+.checkbox-box .check-icon {
    opacity: 1;
}

/* Hover */
.checkbox-label:hover .checkbox-box {
    box-shadow: 0 3px 6px rgba(91, 76, 208, 0.3);
    transform: scale(1.03);
}

/* Texto */
.checkbox-text {
    font-weight: 600;
    color: #222;
    font-size: 14px;
}

.grid-content {
    --card-min: 280px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
}

/* Solo las tarjetas entran al grid */
.grid-content>.card {
    display: block;
}

/* Todo lo demás NO se comporta como item del grid */
.grid-content> :not(.card) {
    grid-column: 1 / -1;
    /* ocupa todo el ancho */
}

.card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    transition: transform .2s ease;
}

.card:hover {
    transform: translateY(-4px);
}

.card-header {
    display: grid;
    grid-template-columns: 1fr auto;
    /* título se expande; acciones ocupan lo justo */
    align-items: center;
    /* acciones pegadas arriba */
    gap: 8px;
    padding: 14px 16px 0;
}

.card-title {
    margin: 0;
    color: #2b2c34;
    font-size: 1rem;
    line-height: 1.25rem;
    min-width: 0;
    overflow: hidden;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.card-actions {
    justify-self: end;
    align-self: start;
    display: flex;
    gap: 6px;
}

.card-img {
    display: flex;
    justify-content: center;
    padding: 10px 16px 0;
}

.profile-pic {
    width: 130px;
    height: 140px;
    object-fit: cover;
    border-radius: 9px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.card-body {
    padding: 16px;
}

.title-name {
    margin: 10px 0 2px;
    font-size: 14px;
    font-weight: 700;
    color: #2b2c34;
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

.form-buttons {
    display: flex;
    justify-content: center;
    /* Centra los botones */
    align-items: center;
    gap: 12px;
    /* Espacio entre botones */
    margin-top: 10px;
    padding-bottom: 10px;
}

.checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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

/* ✅ Botón verde suave */
.btn-success-light {
    background-color: #e6f9ec;
    color: #27ae60;
    border-color: #c3f1d2;
}


.btn-outline svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
}

.select-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    /* separación entre checkbox y botones */
}

.buttons-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* ========= SKELETON TARJETAS CANDIDATAS ========= */

.candidates-skeleton {
    padding: 24px 24px 32px;
}

.candidates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px 32px;
}

/* Tarjeta */
.candidate-card-skeleton {
    background: #ffffff;
    border-radius: 24px;
    padding: 18px 20px 18px;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

/* Header (icono menú arriba derecha) */
.candidate-card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.skeleton-menu-icon {
    width: 80px;
    height: 30px;
    border-radius: 12px;
}

/* Avatar grande centrado */
.candidate-avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 18px;
}

.skeleton-avatar-large {
    width: 160px;
    height: 160px;
    border-radius: 26px;
}

/* Cuerpo: textos */
.candidate-card-body {
    padding-top: 4px;
}

.skeleton-vacancy-title {
    width: 120px;
    height: 18px;
    margin-bottom: 10px;
}

.skeleton-body-line {
    width: 80%;
    height: 14px;
    margin-bottom: 6px;
}

.skeleton-body-line.short {
    width: 60%;
}

/* Footer: botones like / dislike */
.candidate-card-footer {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.skeleton-action-btn {
    width: 44px;
    height: 36px;
    border-radius: 14px;
}

/* ========= BASE SHIMMER ========= */

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
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

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
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
    width: auto;
    justify-content: center;
    max-width: max-content;
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

.bg-purple {
    border-color: #5B4CD0;
    background-color: #F4EFFC;
    color: #5B4CD0;
}

.bg-purple-strong {
    border-color: #3B3094;
    background-color: #F4EFFC;
    color: #3B3094;
}

.bg-lavender {
    border-color: #A68EF4;
    background-color: #F4EFFC;
    color: #A68EF4;
}

.bg-yellow {
    border-color: #B98800;
    background-color: #FEF9C2;
    color: #B98800;
}

.bg-blue {
    border-color: #2D76D8;
    background-color: #DBEAFE;
    color: #2D76D8;
}

.bg-cyan {
    border-color: #005C83;
    background-color: #C2EDFF;
    color: #005C83;
}

.bg-green {
    border-color: #28A745;
    background-color: #DCFCE7;
    color: #28A745;
}

.bg-red {
    border-color: #DC2626;
    background-color: #FFEDED;
    color: #DC2626;
}

.bg-orange {
    border-color: #FD9300;
    background-color: #FFEFD9;
    color: #FD9300;
}

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

.tab {
    background: transparent;
    border: 0;
    padding: 10px 12px 8px;
    font-weight: 600;
    cursor: pointer;
    color: #9a86ff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;
    white-space: nowrap;
}

.tabs-wrap {
    width: 100%;
    max-width: 500px;
    margin-bottom: 10px;
}

.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0;
    margin-top: 6px;
    padding-top: 6px;
    border-bottom: 1px solid rgba(91, 76, 208, 0.25);
}

.underline {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    width: calc(100% / var(--count));
    background: #5b4cd0;
    transform: translateX(calc(var(--active) * 100%));
    transition: transform 0.25s ease;
    pointer-events: none;
}
</style>