<script setup>
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    contracts: Array,
    modelTermination: Object,
    modelContract: Object,
    terminations: Array,
    pagination: Object,
    paginate: Object,
    contractPreview: Object,
    showDetailContract: Boolean,
    showDetailTermination: Boolean,
    loadingData: Boolean,
    textConfiguration: Object,
    areasWithAll: Array,
    entityWithAll: Array,
    contractTypeWithAll: Array
})

const emit = defineEmits([
    'submitContractApproved', 'submitContractRejected', 'submitContractSignedLegalRepresentative', 'detail', 'close-detail', 'detailTermination', 'submitTerminationFind',
    'submitTerminationApproved', 'submitTerminationRejected'
])

const Detail = defineAsyncComponent(() => import('@/components/shared/features/ContractDetail.vue'))
const Detail2 = defineAsyncComponent(() => import('@/components/shared/features/LaborRelation/TerminationDetail.vue'));

const allSelected = ref(false)
const selectedItems = ref([])

const toggleSelectAll = () => {
    if (allSelected.value) {
        selectedItems.value = [];
    } else {
        selectedItems.value = [...props.contracts];
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
        selectedItems.value.length === props.pagination.total;
};

const allSelected2 = ref(false)
const selectedItems2 = ref([])

const toggleSelectAll2 = () => {
    if (allSelected2.value) {
        selectedItems2.value = [];
    } else {
        selectedItems2.value = [...props.terminations];
    }

    allSelected2.value = !allSelected2.value;
};

const toggleSelect2 = (item) => {
    const exists = selectedItems2.value.some(i => i.id === item.id);

    if (exists) {
        selectedItems2.value = selectedItems2.value.filter(i => i.id !== item.id);
    } else {
        selectedItems2.value.push(item);
    }

    allSelected2.value =
        selectedItems2.value.length === props.paginate.total;
};

const activeTab = ref(0)

watch(activeTab, () => {
    if (activeTab.value == 0) {
        props.pagination.personStatus = 'Pendiente';
        props.pagination.legalRepresentativeStatus = 'En revisión';
    }
    if (activeTab.value == 1) {
        props.pagination.personStatus = 'Firmado';
        props.pagination.legalRepresentativeStatus = 'Aprobado';
    }
    if (activeTab.value == 2) {

    }
    allSelected.value = false
    selectedItems.value = []
    allSelected2.value = false
    selectedItems2.value = []
    emit('close-detail');
})

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

const goTo2 = p => props.paginate.current_page = p;
const prev2 = () => goTo(props.paginate.current_page - 1);
const next2 = () => goTo(props.paginate.current_page + 1);

const pageItems2 = computed(() => {
    const total = props.paginate.total_pages
    const current = props.paginate.current_page
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

const getTotal = () => {
    return activeTab.value != 2
        ? props.pagination.total
        : props.paginate.total;
};

const getLabel = () => {
    const total = getTotal();

    if (activeTab.value != 2) {
        return total === 1 ? 'contrato' : 'contratos';
    }

    return total === 1 ? 'solicitud' : 'solicitudes';
};

const clearContractSelection = () => {
    selectedItems.value = [];
    allSelected.value = false;
};

const clearTerminationSelection = () => {
    selectedItems2.value = [];
    allSelected2.value = false;
};

const clearSelections = () => {
    clearContractSelection();
    clearTerminationSelection();
};

defineExpose({
    clearContractSelection,
    clearTerminationSelection,
    clearSelections
});
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
        <span>Validación</span>
        <span>|</span>
        <span class="active">Gestión de contratos</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': props.showDetailContract, 'with-panel-two': props.showDetailTermination }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Gestión de contratos</h2>
                    <div class="tabs-wrap">
                        <div class="nav-tabs" :style="{ '--active': activeTab }" role="tablist">
                            <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                :aria-selected="activeTab === 0" @click="activeTab = 0;">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z">
                                    </path>
                                </svg>Revisión
                            </button>
                            <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                :aria-selected="activeTab === 1" @click="activeTab = 1;">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z">
                                    </path>
                                </svg>Firma
                            </button>
                            <button class="tab" :class="{ active: activeTab === 2 }" role="tab"
                                :aria-selected="activeTab === 2" @click="activeTab = 2;">
                                <svg class="tab-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z">
                                    </path>
                                </svg>Renovación
                            </button>
                            <span class="underline"></span>
                        </div>
                    </div>
                    <div class="filtros">
                        <button class="btn-count">
                            {{ getTotal() }} {{ getLabel() }}
                        </button>

                        <template v-if="activeTab == 2">
                            <SearchSelect :options="props.entityWithAll" v-model="props.paginate.entity_id"
                                optionKey="name" valueKey="id" placeholder="Todas las entidades" />

                            <SearchSelect :options="props.areasWithAll" v-model="props.paginate.area_id"
                                optionKey="name" valueKey="id" placeholder="Todas las áreas" />

                            <SearchSelect :options="props.contractTypeWithAll" v-model="props.paginate.contract_type_id"
                                optionKey="name" valueKey="id" placeholder="Todas los tipos de contrato" />
                        </template>
                        <template v-else>
                            <SearchSelect :options="props.entityWithAll" v-model="props.pagination.entity_id"
                                optionKey="name" valueKey="id" placeholder="Todas las entidades" />

                            <SearchSelect :options="props.areasWithAll" v-model="props.pagination.area_id"
                                optionKey="name" valueKey="id" placeholder="Todas las áreas" />

                            <SearchSelect :options="props.contractTypeWithAll"
                                v-model="props.pagination.contract_type_id" optionKey="name" valueKey="id"
                                placeholder="Todas los tipos de contrato" />
                        </template>

                        <!-- Botones de vista y botón crear juntos -->
                        <div class="acciones-derecha">
                            <div class="vista-toggle" v-if="activeTab != 2">
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
                            <div class="vista-toggle" v-if="activeTab == 2">
                                <button :class="{ active: props.paginate.mode === 'grid' }"
                                    @click="props.paginate.mode = 'grid'" aria-label="Vista de tarjetas">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M180,72H36A20,20,0,0,0,16,92V204a20,20,0,0,0,20,20H180a20,20,0,0,0,20-20V92A20,20,0,0,0,180,72Zm-4,128H40V96H176ZM240,52V176a12,12,0,0,1-24,0V56H64a12,12,0,0,1,0-24H220A20,20,0,0,1,240,52Z" />
                                    </svg>
                                </button>
                                <button :class="{ active: props.paginate.mode === 'tabla' }"
                                    @click="props.paginate.mode = 'tabla'" aria-label="Vista de tabla">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M84,64A12,12,0,0,1,96,52H216a12,12,0,0,1,0,24H96A12,12,0,0,1,84,64Zm132,52H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Zm0,64H96a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24ZM56,52H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Zm0,64H40a12,12,0,0,0,0,24H56a12,12,0,0,0,0-24Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="select-data" v-if="!props.loadingData">
                        <div class="select-actions">
                            <label class="checkbox-label">
                                <input type="checkbox" v-if="activeTab != 2" class="checkbox-input"
                                    :checked="allSelected" @change="toggleSelectAll" />
                                <input type="checkbox" v-if="activeTab == 2" class="checkbox-input"
                                    :checked="allSelected2" @change="toggleSelectAll2" />
                                <div class="checkbox-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span class="checkbox-text">Seleccionar todos</span>
                            </label>

                            <template class="buttons-group"
                                v-if="(selectedItems.length > 1 || allSelected) || (selectedItems2.length > 1 || allSelected2)">
                                <template v-if="activeTab === 0">
                                    <button class="btn-outline btn-success-light"
                                        @click="emit('submitContractApproved', [...selectedItems])">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                            </path>
                                        </svg> Aprobar</button>
                                    <button class="btn-outline btn-danger-light"
                                        @click="emit('submitContractRejected', [...selectedItems])">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                            </path>
                                        </svg>No aprobar</button>
                                </template>
                                <template v-if="activeTab === 1">
                                    <button class="btn-outline btn-success-light"
                                        @click="emit('submitContractSignedLegalRepresentative', [...selectedItems])">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z">
                                            </path>
                                        </svg>Firmar</button>
                                    <button class="btn-outline btn-danger-light"
                                        @click="emit('submitContractRejected', [...selectedItems])">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z">
                                            </path>
                                            <path d="M40 216 L216 40" fill="" stroke="currentColor" stroke-width="20"
                                                stroke-linecap="round" transform="rotate(-90 128 128)" />
                                        </svg>No firmar</button>
                                </template>
                                <template v-if="activeTab === 2">
                                    <button class="btn-outline btn-success-light"
                                        @click="emit('submitTerminationApproved', [...selectedItems2])">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                            </path>
                                        </svg> Aprobar</button>
                                    <button class="btn-outline btn-danger-light"
                                        @click="emit('submitTerminationRejected', [...selectedItems2])">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                            </path>
                                        </svg>Rechazar</button>
                                </template>
                            </template>
                        </div>
                    </div>
                    <div class="tabla-toolbar">
                        <label class="page-size">
                            Elementos por página:
                            <select v-if="activeTab != 2" v-model="props.pagination.per_page" class="select-underline">
                                <option v-for="n in props.pagination.sizes" :key="n" :value="n">{{ n }}</option>
                            </select>
                            <select v-if="activeTab == 2" v-model="props.paginate.per_page" class="select-underline">
                                <option v-for="n in props.paginate.sizes" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </label>
                        <div class="search-underline">
                            <input v-if="activeTab != 2" v-model="props.pagination.search" type="text"
                                placeholder="Buscar" />
                            <input v-if="activeTab == 2" v-model="props.paginate.search" type="text"
                                placeholder="Buscar" />
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                    stroke="#5B4CD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div v-if="props.pagination.mode == 'grid' && activeTab != 2" class="grid-content">
                        <template v-if="props.loadingData">
                            <!-- 5 cards de ejemplo -->
                            <div class="candidate-card-skeleton" v-for="n in 5" :key="n">
                                <!-- Header -->
                                <div class="candidate-card-header">
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
                                    <div class="skeleton-block skeleton-action-btn"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>

                            <div v-if="props.pagination.total == 0" class="no-results">
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
                            <div v-else v-for="(contract, index) in props.contracts" :key="index" class="card">
                                <!-- Header / acciones -->
                                <div class="card-header">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            :checked="selectedItems.some(i => i.id === contract.id)"
                                            @change="toggleSelect(contract)" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </label>
                                    <!-- Botón Detalles -->
                                    <div class="card-actions">
                                        <template
                                            v-if="['Pendiente', 'Firmado'].includes(contract.person_status) && ['En revisión', 'Aprobado'].includes(contract.legal_representative_status)">
                                            <Button title="Detalles" icon="list" variant="question"
                                                @click="emit('detail', contract.id); emit('submitContractFind', contract.id); emit('submitContractPreview', contract.id)" />
                                        </template>
                                    </div>
                                </div>
                                <!-- Foto -->
                                <div class="card-img">
                                    <img class="profile-pic" :src="contract.person.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <h4 class="title-name">{{ [contract.person.first_name, contract.person.second_name,
                                    contract.person.first_last_name,
                                    contract.person.second_last_name].filter(Boolean).join(' ') }}</h4>
                                    <hr class="divider" />
                                    <div class="info-row"><span class="muted">Tipo de contrato:</span>{{
                                        contract.contract_type.name }}</div>
                                    <div class="info-row"><span class="muted">Área:</span>{{ contract.position.area.name
                                    }}</div>
                                    <div class="info-row"><span class="muted">Cargo:</span>{{ contract.position.name }}
                                    </div>
                                </div>
                                <div v-if="selectedItems.length < 2" class="form-buttons">
                                    <template
                                        v-if="'Pendiente' == contract.person_status && 'En revisión' == contract.legal_representative_status">
                                        <Button title="Aprobar" icon="like" variant="success"
                                            @click="emit('submitContractApproved', [contract])" />
                                        <Button title="No aprobar" icon="un-like" variant="error"
                                            @click="emit('submitContractRejected', [contract])" />
                                    </template>
                                    <template
                                        v-if="'Firmado' == contract.person_status && 'Aprobado' == contract.legal_representative_status">
                                        <Button title="Firmar" icon="pen-nib" variant="success"
                                            @click="emit('submitContractSignedLegalRepresentative', [contract])" />
                                        <Button title="No firmar" icon="signature-cancel" variant="error"
                                            @click="emit('submitContractRejected', [contract])" />
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="props.paginate.mode == 'grid' && activeTab == 2" class="grid-content">
                        <template v-if="props.loadingData">
                            <!-- 5 cards de ejemplo -->
                            <div class="candidate-card-skeleton" v-for="n in 5" :key="n">
                                <!-- Header -->
                                <div class="candidate-card-header">
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
                                    <div class="skeleton-block skeleton-action-btn"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="props.paginate.total == 0" class="no-results">
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
                            <div v-else v-for="(termination, index) in props.terminations" :key="index" class="card">
                                <!-- Header / acciones -->
                                <div class="card-header">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            :checked="selectedItems2.some(i => i.id === termination.id)"
                                            @change="toggleSelect2(termination)" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </label>
                                    <!-- Botón Detalles -->
                                    <div class="card-actions">
                                        <template v-if="termination.model">
                                            <Button title="Detalles" icon="list" variant="question"
                                                @click="emit('detailTermination', termination.id); emit('submitTerminationFind', termination.id);" />
                                        </template>
                                    </div>
                                </div>
                                <!-- Foto -->
                                <div class="card-img">
                                    <img class="profile-pic" :src="termination.person.photo?.path || imgUserPic"
                                        alt="Foto candidata/o">
                                </div>
                                <!-- Cuerpo -->
                                <div class="card-body">
                                    <h4 class="title-name">{{ [termination.person.first_name,
                                    termination.person.second_name,
                                    termination.person.first_last_name,
                                    termination.person.second_last_name].filter(Boolean).join(' ') }}</h4>
                                    <hr class="divider" />
                                    <div class="info-row"><span class="muted">Tipo de contrato:</span>{{
                                        termination.person.contract?.contract_type?.name || 'Sin contrato' }}</div>
                                    <div class="info-row"><span class="muted">Área:</span>{{
                                        termination.person.employee?.position?.area?.name }}</div>
                                    <div class="info-row"><span class="muted">Cargo:</span>{{
                                        termination.person.employee?.position?.name }}</div>
                                    <div class="info-row"><span class="muted">Concepto:</span>
                                        <span :class="{
                                            'status-active': termination.decision == 'Renovar',
                                            'status-inactive': termination.decision != 'Renovar'
                                        }">{{ termination.decision }}</span>
                                    </div>
                                </div>
                                <div v-if="selectedItems.length < 2" class="form-buttons">
                                    <Button title="Aprobar" icon="check-pure" variant="success"
                                        @click="emit('submitTerminationApproved', [termination])" />
                                    <Button title="Rechazar" icon="x" variant="error"
                                        @click="emit('submitTerminationRejected', [termination])" />
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="props.pagination.mode === 'tabla' && activeTab != 2" class=" tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Candidato</th>
                                        <th>Tipo de contrato</th>
                                        <th>Área</th>
                                        <th>Cargo</th>
                                        <th class="col-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody v-if="props.loadingData">
                                    <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                        <td>
                                            <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                            </div>
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
                                    <tr v-for="(contract, index) in props.contracts" :key="index">
                                        <td>
                                            <label class="checkbox-wrapper">
                                                <input type="checkbox" class="checkbox-input"
                                                    :checked="selectedItems.some(i => i.id === contract.id)"
                                                    @change="toggleSelect(contract)" />
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
                                        <td>{{ [contract.person.first_name, contract.person.second_name,
                                        contract.person.first_last_name,
                                        contract.person.second_last_name].filter(Boolean).join(' ') }}</td>
                                        <td>{{ contract.contract_type?.name }}</td>
                                        <td>{{ contract.position?.area?.name }}</td>
                                        <td>{{ contract.position?.name }}</td>
                                        <td class="acciones">
                                            <span class="actions">

                                                <Button title="Detalles" icon="list" variant="question"
                                                    @click="emit('detail')" />
                                                <div v-if="selectedItems.length < 2" class="form-buttons">
                                                    <template
                                                        v-if="'Pendiente' == contract.person_status && 'En revisión' == contract.legal_representative_status">
                                                        <Button title="Aprobar" icon="like" variant="success"
                                                            @click="emit('submitContractApproved', [contract])" />
                                                        <Button title="No aprobar" icon="un-like" variant="error"
                                                            @click="emit('submitContractRejected', [contract])" />
                                                    </template>
                                                    <template
                                                        v-if="'Firmado' == contract.person_status && 'Aprobado' == contract.legal_representative_status">
                                                        <Button title="Firmar" icon="pen-nib" variant="success"
                                                            @click="emit('submitContractSignedLegalRepresentative', [contract])" />
                                                        <Button title="No firmar" icon="signature-cancel"
                                                            variant="error"
                                                            @click="emit('submitContractRejected', [contract])" />
                                                    </template>
                                                    <template v-if="false">
                                                        <Button title="Renovar" icon="check-pure" variant="success"
                                                            @click="emit('approve')" />
                                                        <Button title="No renovar" icon="x" variant="error"
                                                            @click="emit('reject')" />
                                                    </template>
                                                </div>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="props.pagination.total == 0">
                                        <td colspan="6" class="no-results">Sin resultados</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div v-if="props.paginate.mode === 'tabla' && activeTab == 2" class=" tabla-style">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Empleado</th>
                                        <th>Tipo de contrato</th>
                                        <th>Área</th>
                                        <th>Cargo</th>
                                        <th>Concepto</th>
                                        <th class="col-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody v-if="props.loadingData">
                                    <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                        <td>
                                            <div class="skeleton" style="width:30px;height:30px;border-radius:6px;">
                                            </div>
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
                                            <div class="skeleton skel-pill-sm"></div>
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
                                    <tr v-for="(termination, index) in props.terminations" :key="index">
                                        <td>
                                            <label class="checkbox-wrapper">
                                                <input type="checkbox" class="checkbox-input"
                                                    :checked="selectedItems2.some(i => i.id === termination.id)"
                                                    @change="toggleSelect2(termination)" />
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
                                        <td>{{ [termination.person.first_name, termination.person.second_name,
                                        termination.person.first_last_name,
                                        termination.person.second_last_name]
                                            .filter(Boolean).join('') }}</td>
                                        <td>{{ termination.person.contract?.contract_type?.name || 'Sin contrato' }}
                                        </td>
                                        <td>{{ termination.person.employee?.position?.area?.name }}</td>
                                        <td>{{ termination.person.employee?.position?.name }}</td>
                                        <td>
                                            <span :class="{
                                                'status-active': termination.decision == 'Renovar',
                                                'status-inactive': termination.decision != 'Renovar'
                                            }">{{ termination.decision }}</span>
                                        </td>
                                        <td class="acciones">
                                            <span class="actions">

                                                <template v-if="termination.model">
                                                    <Button title="Detalles" icon="list" variant="question"
                                                        @click="emit('detailTermination'); emit('submitTerminationFind', termination.id)" />
                                                </template>
                                                <div v-if="selectedItems2.length < 2" class="form-buttons">
                                                    <Button title="Renovar" icon="check-pure" variant="success"
                                                        @click="emit('submitTerminationApproved', [termination])" />
                                                    <Button title="No renovar" icon="x" variant="error"
                                                        @click="emit('submitTerminationRejected', [termination])" />
                                                </div>
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="props.paginate.total == 0">
                                        <td colspan="6" class="no-results">Sin resultados</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="table-footer" v-if="activeTab != 2">
                        <div class="page-info">
                            PáginaAAAAA {{ props.pagination.current_page }} de {{ props.pagination.total_pages }}
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

                    <div class="table-footer" v-if="activeTab == 2">
                        <div class="page-info">
                            Página {{ props.paginate.current_page }} de {{ props.paginate.total_pages }}
                        </div>

                        <div class="pagination">
                            <button class="page-btn" aria-label="Primera" @click="goTo2(1)"
                                :disabled="props.paginate.current_page === 1">
                                &laquo;
                            </button>

                            <button class="page-btn" aria-label="Anterior" @click="prev2()"
                                :disabled="props.paginate.current_page === 1">
                                &lsaquo;
                            </button>

                            <!-- Páginas dinámicas -->
                            <div v-for="(p, i) in pageItems2" :key="i">
                                <button v-if="p !== '…'" class="page-btn"
                                    :class="{ active: p === props.paginate.current_page }" @click="goTo2(p)">
                                    {{ p }}
                                </button>
                                <span v-else class="dots">…</span>
                            </div>

                            <button class="page-btn" aria-label="Siguiente" @click="next2()"
                                :disabled="props.paginate.current_page === props.paginate.total_pages">
                                &rsaquo;
                            </button>

                            <button class="page-btn" aria-label="Última" @click="goTo2(props.paginate.total_pages)"
                                :disabled="props.paginate.current_page === props.paginate.total_pages">
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="props.showDetailContract || props.showDetailTermination">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <template v-if="showDetailTermination">
                                <h2 class="sub-titulo">Previsualización</h2>
                            </template>
                            <template v-else-if="props.showDetailContract">
                                <h2 class="sub-titulo">Detalles</h2>

                            </template>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <template v-if="props.showDetailTermination">
                                        <Detail2 :modelTermination="props.modelTermination" :viewStatus="false"
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
                                            }" />
                                        <div class="form-buttons-contract">
                                            <button @click="emit('submitTerminationApproved', [props.modelTermination])"
                                                class="btn-outline btn-success-light"><svg
                                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z">
                                                    </path>
                                                </svg>Aprobar</button>
                                            <button @click="emit('submitTerminationRejected', [props.modelTermination])"
                                                class="btn-outline btn-danger-light"><svg
                                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z">
                                                    </path>
                                                </svg>Rechazar</button>
                                        </div>
                                    </template>
                                    <template v-else-if="props.showDetailContract">
                                        <Detail :contractPreview="props.contractPreview" :needDownload="false" />

                                        <div class="form-buttons-contract">
                                            <template v-if="activeTab == 0">
                                                <button @click="emit('submitContractRejected', [props.modelContract])"
                                                    class="btn-outline btn-danger-light"><svg
                                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                                        </path>
                                                    </svg>No aprobar</button>
                                                <button @click="emit('submitContractApproved', [props.modelContract])"
                                                    class="btn-outline btn-success-light"><svg
                                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                                        </path>
                                                    </svg>Aprobar</button>
                                            </template>
                                            <template v-else-if="activeTab == 1">
                                                <button @click="emit('submitContractRejected', [props.modelContract])"
                                                    class="btn-outline btn-danger-light"><svg
                                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z">
                                                        </path>
                                                        <path d="M40 216 L216 40" fill="" stroke="currentColor"
                                                            stroke-width="20" stroke-linecap="round"
                                                            transform="rotate(-90 128 128)" />
                                                    </svg>No firmar</button>
                                                <button
                                                    @click="emit('submitContractSignedLegalRepresentative', [props.modelContract])"
                                                    class="btn-outline btn-success-light"><svg
                                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M252,92.68a19.86,19.86,0,0,0-5.86-14.14L177.46,9.85a20,20,0,0,0-28.29,0L121.35,37.67,64.11,59.14A20,20,0,0,0,51.4,74.58L28.16,214A12,12,0,0,0,40,228a11.9,11.9,0,0,0,2-.16l139.45-23.25a20.07,20.07,0,0,0,15.44-12.7l21.46-57.25,27.82-27.82A19.85,19.85,0,0,0,252,92.68ZM175.2,181.3,75,198l33-33a34,34,0,1,0-17-17L58,181,74.7,80.8,125,61.94,194.05,131ZM112,134a10,10,0,1,1,10,10A10,10,0,0,1,112,134Zm96-23L145,48l18.34-18.34,63,63Z">
                                                        </path>
                                                    </svg>Firmar</button>
                                            </template>
                                        </div>

                                    </template>
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
.profile-pic {
    width: 130px;
    height: 140px;
    object-fit: cover;
    border-radius: 9px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 650px;
    /* contenido + ancho del panel */
}

.split.with-panel-two {
    grid-template-columns: 1fr 480px;
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

.filtros>* {
    height: auto !important;
    /* clave: deja que acciones crezcan */
}

.btn-count,
.vista-toggle button,
.btn-primary {
    height: 40px;
}

.filtros {
    align-items: flex-start;
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
    --card-min: 255px;
    /* ancho mínimo de cada card */
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--card-min), 1fr));
    gap: 24px;
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

.form-buttons-contract {
    display: flex;
    justify-content: end;
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
    justify-content: flex-end;
    margin-bottom: 12px;
}

.skeleton-menu-icon {
    width: 34px;
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
        justify-content: space-between;
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
        justify-content: space-between;
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