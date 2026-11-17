<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import imgUserPic from '@/assets/img/USERPIC.png'

const props = defineProps({
    employees: Array,
    modelTermination: Object,
    pagination: Object,
    showDetailTermination: Boolean,
    loadingData: Boolean,
    areasWithAll: Array,
    statuses: Array,
    entitysWithAll: Array,
    headquartersWithAll: Array
})

const emit = defineEmits(['create', 'massive', 'detail', 'close-detail', 'submitTerminationRenew', 'submitEmployeeFind', 'submitTerminationFind', 'submitHeadquarterAll']);

const authStore = useAuthStore();

const Detail = defineAsyncComponent(() => import('@/components/shared/features/LaborRelation/TerminationDetail.vue'));

const activeTab = ref(0);

const ICON_PATHS = {
    'Vigente': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Próximo a vencer': "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z",
}

const allSelected = ref(false);
const selectedItems = ref([]);

const toggleSelectAll = () => {
    if (allSelected.value) {
        selectedItems.value = [];
    } else {
        selectedItems.value = props.employees.filter(e => !e.person?.termination_review)
    }

    allSelected.value = !allSelected.value;
};

const toggleSelect = (item) => {
    const exists = selectedItems.value.some(i => i.id === item.id);

    if (exists) {
        selectedItems.value = selectedItems.value.filter(i => i.id !== item.id);
    } else {
        selectedItems.value.push(item);
    }

    allSelected.value =
        selectedItems.value.length === props.employees.length;
};

const getEmployeeStatus = (employee) => {
    if (!employee?.end_date) return 'Vigente'

    const today = new Date()
    const endDate = new Date(employee.end_date + 'T00:00:00')

    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Vencido';

    if (diffDays <= 30) return 'Próximo a vencer';

    return 'Vigente'
}

function submitHeadquarterAll(val) {
    emit('submitHeadquarterAll', val);
}

const searchInput = ref(props.pagination.search || '')
let searchTimeout = null

watch(searchInput, (value) => {
    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
        props.pagination.search = value
    }, 400)
})

const goTo = (p) => {
    const total = props.pagination.total_pages || 1
    props.pagination.current_page = Math.max(1, Math.min(p, total))
}
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
        <span>Relaciones laborales</span>
        <span>|</span>
        <span class="active">Terminación de contrato</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.showDetailTermination }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Terminación de contrato</h2>
                    <div class="tabs-wrap">
                        <div class="nav-tabs" :style="{ '--active': activeTab, '--count': 2 }" role="tablist">
                            <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                :aria-selected="activeTab === 0"
                                @click="activeTab = 0; props.pagination.person_id = authStore.personId; props.pagination.entity_id = null; props.pagination.headquarter_id = null;">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z">
                                    </path>
                                </svg>Equipo asignado
                            </button>
                            <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                :aria-selected="activeTab === 1"
                                @click="activeTab = 1; props.pagination.person_id = null">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                                    </path>
                                </svg>Planta personal
                            </button>
                            <span class="underline"></span>
                        </div>
                    </div>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ props.pagination.total }}
                            {{ props.pagination.total == 1 ? 'Empleado' : 'Empleados' }}
                        </button>
                        <template v-if="activeTab == 1">
                            <SearchSelect :options="entitysWithAll" v-model="pagination.entity_id" optionKey="name"
                                valueKey="id" name="entity_id" id="entity_id" placeholder="Todos las entidades"
                                @update:modelValue="submitHeadquarterAll" />

                            <template v-if="pagination.entity_id">
                                <SearchSelect :options="headquartersWithAll" v-model="pagination.headquarter_id"
                                    optionKey="name" valueKey="id" name="headquarter_id" id="headquarter_id"
                                    placeholder="Todos las sedes" />
                            </template>
                        </template>

                        <SearchSelect name="estado" :options="props.statuses" v-model="pagination.status"
                            placeholder="Todos los estados" />

                        <SearchSelect :options="areasWithAll" v-model="props.pagination.area_id" optionKey="name"
                            valueKey="id" name="area_id" id="area_id" placeholder="Todas las áreas" />


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

                        <template v-if="activeTab == 1 && selectedItems.length > 0">
                            <button class="btn-primary" @click="emit('massive', selectedItems);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM183,80H160V57ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm100.49-75.51L145,152l15.52,15.51a12,12,0,0,1-17,17L128,169l-15.51,15.52a12,12,0,0,1-17-17L111,152,95.51,136.49a12,12,0,1,1,17-17L128,135l15.51-15.52a12,12,0,1,1,17,17Z">
                                    </path>
                                </svg>
                                Terminar
                            </button>
                        </template>
                    </div>
                    <div class="select-data" v-if="activeTab == 1">
                        <div class="select-actions">
                            <label class="checkbox-label">
                                <input type="checkbox" class="checkbox-input" :checked="allSelected"
                                    @change="toggleSelectAll" />
                                <div class="checkbox-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span class="checkbox-text">Seleccionar todos</span>
                            </label>
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
                            <input v-model="searchInput" type="text" placeholder="Buscar" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div v-if="props.pagination.mode == 'grid'" class="grid-layout"
                        :class="{ 'grid-dinamic': props.showDetailTermination }">
                        <div v-if="props.loadingData" v-for="n in 4" :key="n" class="card" aria-busy="true"
                            :inert="true" style="padding:15px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05)">

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
                            <div v-else class="card" v-for="employee in props.employees" :key="employee.id">
                                <!-- Header / acciones -->
                                <div class="card-header">
                                    <template v-if="activeTab == 1">
                                        <label class="checkbox-label">
                                            <input type="checkbox" class="checkbox-input"
                                                :checked="selectedItems.some(i => i.id === employee.id)"
                                                @change="toggleSelect(employee)"
                                                v-if="!employee.person.termination_review" />
                                            <div class="checkbox-box" v-if="!employee.person.termination_review">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </label>
                                    </template>
                                    <div style="display: flex; flex-direction: column;">
                                        <span class="badge" :class="{
                                            'bg-green': getEmployeeStatus(employee) === 'Vigente',
                                            'bg-red': getEmployeeStatus(employee) === 'Próximo a vencer'
                                        }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                <path :d="ICON_PATHS[getEmployeeStatus(employee)]" />
                                            </svg>{{ getEmployeeStatus(employee) }}</span>

                                    </div>
                                </div>
                                <div class="card-img">
                                    <img class="profile-pic" :src="employee.person.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>
                                <div class="card-header">
                                    <span class="title-name">{{ [employee.person.first_name,
                                    employee.person.second_name,
                                    employee.person.first_last_name,
                                    employee.person.second_last_name].filter(Boolean).join(' ') }}</span>
                                </div>
                                <hr>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <div class="card-description">
                                        <div class="info-row">
                                            <span class="muted">Tipo de contrato:</span>
                                            {{
                                                employee.person.contract?.contract_type?.name || 'Sin contrato'
                                            }}
                                            {{  }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Área:</span>
                                            {{ employee.position?.area?.name || 'Sin área' }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Perfil de cargo:</span>{{ employee.position?.name ||
                                                'Sin cargo' }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Fecha inicio:</span>{{
                                                employee.person.contract?.start_date ||
                                                'Sin fecha de inicio' }}
                                        </div>
                                        <div class="info-row">
                                            <span class="muted">Fecha fin:</span>{{ employee.person.contract?.end_date
                                                ||
                                                'Sin fecha de fin' }}
                                        </div>
                                    </div>
                                    <div class="form-buttons" v-if="activeTab == 0">
                                        <template v-if="!employee.person.termination_review">
                                            <template v-if="getEmployeeStatus(employee) === 'Próximo a vencer'">
                                                <Button title="Terminar | No renovar" icon="x" variant="error"
                                                    @click="emit('create'); emit('submitEmployeeFind', employee.id)" />
                                                <Button title="Renovar" icon="check-pure" variant="success"
                                                    @click="emit('submitTerminationRenew', employee.person.id)" />
                                            </template>

                                            <template v-else-if="getEmployeeStatus(employee) === 'Vigente'">
                                                <Button title="Terminar | No renovar" icon="x" variant="error"
                                                    @click="emit('create'); emit('submitEmployeeFind', employee.id)" />
                                            </template>
                                        </template>
                                        <template
                                            v-else-if="employee.person.termination_review && ['Terminar', 'No renovar'].includes(employee.person.termination_review.decision)">
                                            <Button title="Detalles" icon="list" variant="question"
                                                @click="emit('detail'); emit('submitTerminationFind', employee.person.termination_review.id)" />
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="props.pagination.mode === 'tabla'" class=" tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th v-if="activeTab == 1" style="width: 8%;">Seleccionar</th>
                                        <th style="width: 12%;">Empleado</th>
                                        <th style="width: 10%;">Tipo de contrato</th>
                                        <th style="width: 10%;">Área</th>
                                        <th style="width: 10%;">Perfil de cargo</th>
                                        <th style="width: 10%;">Fecha de inicio</th>
                                        <th style="width: 10%;">Fecha de fin</th>
                                        <th style="width: 8%;">Estado</th>
                                        <th v-if="activeTab == 0" style="width: 12%;">Acciones</th>
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
                                    <tr v-for="employee in props.employees" :key="employee.id">
                                        <td v-if="activeTab == 1">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="checkbox-input"
                                                    :checked="selectedItems.some(i => i.id === employee.id)"
                                                    @change="toggleSelect(employee)" />
                                                <div class="checkbox-box">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        stroke-width="3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </label>
                                        </td>
                                        <td>
                                            {{ [employee.person.first_name, employee.person.second_name,
                                            employee.person.first_last_name,
                                            employee.person.second_last_name].filter(Boolean).join(' ') }}
                                        </td>
                                        <td>{{ employee.person.contract?.contract_type?.name || 'Sin contrato' }}</td>
                                        <td>{{ employee.position?.area?.name || 'Sin área' }}</td>
                                        <td>{{ employee.position?.name || 'Sin cargo' }}</td>
                                        <td>{{ employee.start_date }}</td>
                                        <td>{{ employee.endDate }}</td>
                                        <td>
                                            <span class="badge" :class="{
                                                'bg-green': getEmployeeStatus(employee) === 'Vigente',
                                                'bg-red': getEmployeeStatus(employee) === 'Próximo a vencer'
                                            }"><svg viewBox="0 0 256 256" width="12" height="12" fill="currentColor">
                                                    <path :d="ICON_PATHS[getEmployeeStatus(employee)]" />
                                                </svg>{{ getEmployeeStatus(employee) }}</span>
                                        </td>
                                        <td v-if="activeTab == 0" class="acciones">
                                            <span class="actions">
                                                <template v-if="!employee.person.termination_review">
                                                    <template v-if="getEmployeeStatus(employee) === 'Próximo a vencer'">
                                                        <Button title="Terminar | No renovar" icon="x" variant="error"
                                                            @click="emit('create'); emit('submitEmployeeFind', employee.id)" />
                                                        <Button title="Renovar" icon="check-pure" variant="success"
                                                            @click="emit('submitTerminationRenew', employee.person.id)" />
                                                    </template>

                                                    <template v-else-if="getEmployeeStatus(employee) === 'Vigente'">
                                                        <Button title="Terminar | No renovar" icon="x" variant="error"
                                                            @click="emit('create'); emit('submitEmployeeFind', employee.id)" />
                                                    </template>
                                                </template>
                                                <template
                                                    v-else-if="employee.person.termination_review && ['Terminar', 'No renovar'].includes(employee.person.termination_review.decision)">
                                                    <Button title="Detalles" icon="list" variant="question"
                                                        @click="emit('detail'); emit('submitTerminationFind', employee.person.termination_review.id)" />
                                                </template>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="props.pagination.total == 0">
                                        <td :colspan="8" class="no-results">Sin resultados</td>
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
                <div class="split-panel" v-if="props.showDetailTermination">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <Detail :modelTermination="props.modelTermination"
                                        :content="(props.modelTermination.relationships?.model?.termination_type[0]?.settings?.message || props.modelTermination.relationships?.model?.settings?.message) || ''"
                                        :loadingData="props.loadingData" :data="{
                                            person_first_name: props.modelTermination?.relationships?.person?.first_name,
                                            person_second_name: props.modelTermination?.relationships?.person?.second_name,
                                            person_first_last_name: props.modelTermination?.relationships?.person?.first_last_name,
                                            person_second_last_name: props.modelTermination?.relationships?.person?.second_last_name,
                                            person_document_type: props.modelTermination?.relationships?.person?.document_type?.settings?.abreviature,
                                            person_document_issue_country: props.modelTermination?.relationships?.person?.document_issue_city?.departament?.country?.name,
                                            person_document_issue_departament: props.modelTermination?.relationships?.person?.document_issue_city?.departament?.name,
                                            person_document_issue_city: props.modelTermination?.relationships?.person?.document_issue_city?.name,
                                            person_document_number: props.modelTermination?.relationships?.person?.document_number,
                                            person_document_issue_date: props.modelTermination?.relationships?.person?.document_issue_date,
                                            person_birth_country: props.modelTermination?.relationships?.person?.birth_city?.departament?.country?.name,
                                            person_birth_departament: props.modelTermination?.relationships?.person?.birth_city?.departament?.name,
                                            person_birth_city: props.modelTermination?.relationships?.person?.birth_city?.departament?.name,
                                            person_birth_date: props.modelTermination?.relationships?.person?.person_birth_date,
                                            person_dialing_country: props.modelTermination?.relationships?.person?.dialing_country?.name,
                                            person_phone_number: props.modelTermination?.relationships?.person?.phone_number,
                                            person_email: props.modelTermination?.relationships?.person?.email,
                                            person_country: props.modelTermination?.relationships?.person?.city?.departament?.country?.name,
                                            person_departament: props.modelTermination?.relationships?.person?.city?.departament?.name,
                                            person_city: props.modelTermination?.relationships?.person?.city?.name,
                                            person_address: props.modelTermination?.relationships?.person?.address,
                                            person_neighborhood: props.modelTermination?.relationships?.person?.neighborhood,
                                            termination_type_name: props.modelTermination.relationships?.model?.termination_type[0]?.name || props.modelTermination.relationships?.model?.name,
                                            reason_name: props.modelTermination.relationships?.model?.name,
                                            date: props.modelTermination.date,
                                            reason: props.modelTermination.reason,
                                            decision: props.modelTermination.decision,
                                            status: props.modelTermination.end_date
                                        }" />
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
    min-width: 60px;
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

.grid-dinamic {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)) !important;
    gap: 16px !important;
}

.grid-layout {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

@media (max-width:1200px) {
    .grid-layout {
        grid-template-columns: repeat(3, 1fr);
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

.grid-layout>.card {
    display: block;
}

/* Todo lo demás NO se comporta como item del grid */
.grid-layout> :not(.card) {
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

.card-body {
    padding: 5px 16px 5px 16px;
}

.card-description p {
    margin: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    line-height: 1.4;
}

.card-description strong {
    font-weight: 600;
    color: #555;
    margin-right: 6px;
    /* Alinea todas las etiquetas verticalmente */
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

.info-row {
    display: flex;
    gap: 6px;
    font-size: 11px !important;
    margin: 4px 0;
    font-weight: 500;
}

.muted {
    color: #6b7280;
}

.title-name {
    font-size: 13px;
    font-weight: 700;
    color: #2b2c34;
}

/* ========= BASE SKELETON ========= */

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

/* ========= SKELETON VACANTES ========= */

/* Grid de tarjetas */
.vacancies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px 32px;
}

/* Tarjeta */
.vacancy-card-skeleton {
    padding: 18px 20px 16px;
    border-radius: 22px;
    background: #ffffff;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 220px;
}

/* Header de la tarjeta */
.card-header-skeleton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.skeleton-checkbox {
    width: 22px;
    height: 22px;
    border-radius: 6px;
}

.skeleton-vacancy-title {
    width: 110px;
    height: 18px;
}

.skeleton-menu-icon {
    width: 34px;
    height: 30px;
    border-radius: 12px;
}

/* Cuerpo de la tarjeta */
.card-body-skeleton {
    margin-top: 6px;
}

.skeleton-info-line {
    width: 80%;
    height: 14px;
    margin-bottom: 6px;
}

.skeleton-info-line.short {
    width: 55%;
}

/* Footer: botones de like/dislike */
.card-footer-skeleton {
    margin-top: 14px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.skeleton-action-btn {
    width: 44px;
    height: 36px;
    border-radius: 14px;
}

/* Paginación */
.pagination-skeleton {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skeleton-pagination-text {
    width: 140px;
    height: 16px;
}

.pagination-controls-skeleton {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skeleton-page-arrow {
    width: 24px;
    height: 24px;
    border-radius: 999px;
}

.skeleton-page-dot {
    width: 30px;
    height: 30px;
    border-radius: 999px;
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

/* Quita el display:flex general de los <p> */
.card-description p {
    margin: 0;
    line-height: 1.4;
}

/* El row sigue siendo flex, el texto ocupa el resto */
.info-row {
    display: flex;
    gap: 6px;
    font-size: 12px;
    margin: 4px 0;
    font-weight: 500;
}

.info-row .motivo {
    flex: 1;
    /* ocupa todo el espacio restante */
}

/* Limitar el motivo a 2 líneas */
.motivo {
    display: -webkit-box !important;
    /* fuerza a pisar el display anterior */
    -webkit-line-clamp: 4;
    /* 👈 2 líneas */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    line-height: 1;
    padding: 4px 6px;
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

.bg-gray {
    border-color: #adadad;
    background-color: #F9FBFC;
    color: #adadad;
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

.motivo-box {
    width: 100%;
    /* SOLUCIÓN: ahora ocupa TODA la columna */
    max-height: 100px;
    overflow-y: auto;
    padding-right: 8px;

    white-space: normal;
    word-break: break-word;
    line-height: 1.35;
    display: block;
}


.motivo-box::-webkit-scrollbar {
    width: 4px;
}

.motivo-box::-webkit-scrollbar-thumb {
    background: #bfb9e6;
    border-radius: 8px;
}

.tabla-style th:nth-child(5),
.tabla-style td:nth-child(5) {
    width: 300px;
    /* ajusta a tu gusto */
    max-width: 300px;
}

.jobs-skel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 20px;
}

@media (max-width:1200px) {
    .jobs-skel-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width:600px) {
    .jobs-skel-grid {
        grid-template-columns: 1fr;
    }
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

.card-img {
    display: flex;
    justify-content: center;
    padding: 10px 16px 0;
}

.profile-pic {
    width: 100px;
    height: 110px;
    object-fit: cover;
    border-radius: 9px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

/* Barra superior (Elementos por página + Buscar) */
.tabla-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    /* permite bajar de línea */
}

.page-size {
    flex: 0 0 auto;
    white-space: nowrap;
}

/* En móvil: buscar arriba full width */
@media (max-width: 768px) {
    .tabla-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }
}

/* Filtros: contador + acciones derecha */
.filtros {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
}

/* Asegura que la zona derecha pueda ajustar */
.acciones-derecha {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    /* empuja a la derecha en desktop */
    flex-wrap: wrap;
    /* permite que baje */
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
        justify-content: center;
    }

    /* El botón crear ocupa lo disponible y si no cabe baja */
    .acciones-derecha .btn-primary {
        flex: 1 1 240px;
        max-width: 100%;
        justify-content: center;
    }
}

/* <= 620px: cuando baje, que quede full width sin “inflarse” */
@media (max-width: 620px) {
    .acciones-derecha {
        justify-content: center;
    }

    .acciones-derecha .btn-primary {
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        padding: 0 14px;
        line-height: 1;
        white-space: nowrap;
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

/* ===============================
   RESPONSIVE: Grid padding
================================ */

@media (max-width: 768px) {
    .grid-layout {
        padding: 0;
        /* evita que se vea apretado o “cortado” */
    }
}

.acciones-derecha,
.acciones-derecha .btn-primary {
    position: static !important;
    float: none !important;
}

@media (max-width: 620px) {
    .acciones-derecha {
        align-items: stretch;
    }

    .btn-primary {
        width: 100%;
    }

}
</style>