<script setup>
import DateInput from '@/components/UI/templates/DateInput.vue'
import { defineAsyncComponent, ref, computed, watch } from 'vue'

const props = defineProps({
    showDetailsPolice: Boolean,
    modelContract: Object,
    countries: Array,
    policesContract: Array,
    contractPreview: Object
})

const emit = defineEmits(['police', 'otroSi', 'configurationFind', 'renew', 'detail', 'close-detail', 'editPolice', 'submitContractPreview'])

const activeTab = ref(0)

const vacancies = ref([
    { id: 1, name: 'Vacante 1', acept_contract: false, status: 'Pendiente', tipo: 'OPS' },
    { id: 2, name: 'Vacante 2', acept_contract: true, status: 'Aprobado', tipo: 'Indefinido' },
    { id: 3, name: 'Vacante 3', acept_contract: false, status: 'Firmado', tipo: 'Término fijo' },
    { id: 4, name: 'Vacante 4', acept_contract: false, status: 'Desistió', tipo: 'Indefinido' },
    { id: 5, name: 'Vacante 5', acept_contract: false, status: 'Actualizar', tipo: 'Indefinido' },
    { id: 5, name: 'Vacante 5', acept_contract: false, status: 'Devuelto', tipo: 'Indefinido' },
    { id: 5, name: 'Vacante 5', acept_contract: false, status: 'En revisión', tipo: 'Indefinido' },
])

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

// Estado para habilitar/deshabilitar la edición
const isEditing = ref(false)
const pendingOpenPreview = ref(false);

// Datos del contrato (valores de ejemplo para mostrar en pantalla)
const contrato = ref({
    codigo: "00000",
    tipo: "Termino fijo",
    cargo: "Coordinador(a) de bienestar",
    valor: "00.000.0000",
    fecha_inicio: "",
    fecha_fin: "",
    notificaciones: 15,
})

// Método para alternar edición
const toggleEdit = () => {
    isEditing.value = !isEditing.value
}

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

function openPreview(doc) {
    const url = props.contractPreview.url
    const name = props.contractPreview.name
    preview.value = { url: url || '', name: name || 'Documento.pdf' }

    // Se comentarea temporalmente, para cuando se haga conexión con el backend
    // preview.value = { url: doc?.url || '', name: doc?.name || 'Documento.pdf' }
    showPreview.value = true
}

const PdfPreview = defineAsyncComponent(() => import('../../../../UI/templates/PDFPreview.vue'))
const PoliceDetails = defineAsyncComponent(() => import('../../../../shared/features/PolicesDetails.vue'))

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

const handlePreview = () => {
    pendingOpenPreview.value = true;
    emit('submitContractPreview', props.modelContract.id);
};

watch(
    () => props.contractPreview?.url,
    (url) => {
        if (!pendingOpenPreview.value || !url) return;

        openPreview();
        pendingOpenPreview.value = false;
    }
);

const limitNotificationDigits = (event) => {
    const value = event.target.value
        .replace(/\D/g, '')
        .slice(0, 3);

    contrato.value.notificaciones = value;
    event.target.value = value;
};

const useThousandsFormat = (getModel, field, maxDigits = 11) => {
    return computed({
        get() {
            const model = getModel();
            const value = model?.[field];

            if (value === null || value === undefined || value === '') return '';

            return Number(value).toLocaleString('es-CO');
        },
        set(value) {
            const model = getModel();
            if (!model) return;

            const onlyNumbers = String(value)
                .replace(/\D/g, '')
                .slice(0, maxDigits);

            model[field] = onlyNumbers
                ? Number(onlyNumbers)
                : null;
        }
    });
};

const salaryFormatted = useThousandsFormat(() => props.modelContract, 'salary');
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
        <span class="active">Gestión contrato</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailsPolice }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Gestión contrato</h2>
                    <template v-if="false">
                        <div class="skeleton">

                            <!-- ====== ENCABEZADO PRINCIPAL ====== -->
                            <div class="sk-card">
                                <div style="display: flex; justify-content: space-between;">
                                    <div class="sk-line sk-title"></div>
                                    <div class="sk-circle"></div>
                                </div>


                                <!-- ====== CARD 1 ====== -->
                                <div class="sk-card">

                                    <!-- Título del card -->
                                    <div class="sk-section-header">
                                        <div class="sk-line sk-subtitle"></div>
                                        <div class="sk-circle"></div>
                                    </div>

                                    <!-- GRID 4 columnas -->
                                    <div class="sk-grid">
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>

                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>

                                    </div>
                                </div>

                                <!-- ====== CARD 2 ====== -->
                                <div class="sk-card">

                                    <div class="sk-section-header">
                                        <div class="sk-line sk-subtitle"></div>
                                        <div class="sk-circle"></div>
                                    </div>

                                    <div class="sk-grid">
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                    </div>

                                </div>
                            </div>

                            <!-- ====== FOOTER ====== -->
                            <div class="sk-footer">
                                <div class="sk-button"></div>
                                <div class="sk-button"></div>
                            </div>

                        </div>
                    </template>
                    <template v-else>
                        <div class="contract-wrapper">
                            <div class="card-all">
                                <div class="section-header">
                                    <h2 class="section-main-title">
                                        Información general del contrato
                                    </h2>
                                    <Button title="Previsualizar" icon="preview" variant="question"
                                        @click="handlePreview" />
                                </div>
                                <section class="card">

                                    <div class="section-header">
                                        <h3 class="section-title">Datos del contrato</h3>

                                        <!-- Botón editar -->
                                        <Button :title="isEditing ? 'Bloquear' : 'Editar'" icon="pencil"
                                            variant="question" @click="toggleEdit" />
                                    </div>

                                    <div class="section-grid">

                                        <div class="form-group">
                                            <label class="label-bold">Código</label>
                                            <input type="text" class="input-box disabled" v-model="contrato.codigo"
                                                disabled placeholder="Código" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Tipo de contrato</label>
                                            <input type="text" class="input-box disabled" placeholder="Tipo de contrato"
                                                disabled
                                                :value="props.modelContract.relationships?.contract_type?.name" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Cargo</label>
                                            <input type="text" class="input-box disabled"
                                                :value="modelContract.relationships?.position?.name" disabled>
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Valor del contrato</label>
                                            <input type="text" class="input-box disabled" :value="salaryFormatted"
                                                disabled placeholder="Valor del contrato" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Fecha inicio de labores</label>
                                            <DateInput v-model="modelContract.start_date" disabled />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Fecha fin de labores</label>
                                            <DateInput v-model="modelContract.end_date" disabled />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Notificaciones (Días)</label>
                                            <input type="text" inputmode="numeric" class="input-box"
                                                :class="{ 'disabled': !isEditing }" :value="contrato.notificaciones"
                                                :disabled="!isEditing" placeholder="Notificaciones" maxlength="3"
                                                @input="limitNotificationDigits" />
                                        </div>

                                    </div>
                                    <div v-if="isEditing" class="form-actions">
                                        <button class="sections-add-btn">
                                            <span>Guardar</span>
                                        </button>
                                    </div>
                                </section>
                                <section class="card">

                                    <div class="section-header">
                                        <h3 class="section-title">Información del trabajador</h3>
                                        <!-- <Button :title="editTrabajador ? 'Bloquear' : 'Editar'" icon="pencil"
                                            variant="question" @click="toggleEditTrabajador" /> -->
                                    </div>

                                    <div class="section-grid">

                                        <div class="form-group">
                                            <label class="label-bold">Primer nombre</label>
                                            <input type="text" class="input-box disabled" disabled
                                                :value="props.modelContract.relationships?.person?.first_name"
                                                placeholder="Primer nombre" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Segundo nombre (Opcional)</label>
                                            <input type="text" class="input-box disabled" disabled
                                                :value="props.modelContract.relationships?.person?.second_name"
                                                placeholder="Segundo nombre" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Primer apellido</label>
                                            <input type="text" class="input-box disabled" disabled
                                                :value="props.modelContract.relationships?.person?.first_last_name"
                                                placeholder="Primer apellido" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Segundo apellido (Opcional)</label>
                                            <input type="text" class="input-box disabled" disabled
                                                :value="props.modelContract.relationships?.person?.second_last_name"
                                                placeholder="Segundo apellido" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Documento</label>
                                            <div class="row-2">
                                                <input type="text" class="select-duo input-box disabled"
                                                    :value="props.modelContract.relationships?.person?.document_type?.settings?.abreviature"
                                                    disabled>
                                                <input type="text" class="input-box input-duo disabled"
                                                    :value="props.modelContract.relationships?.person?.document_number"
                                                    disabled placeholder="Documento" />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Teléfono</label>
                                            <div class="row-2">
                                                <input type="text"
                                                    :value="'+ ' + props.modelContract.relationships.person?.dialing_country?.phone_code"
                                                    class="select-duo input-box disabled" disabled />
                                                <input :value="props.modelContract.relationships.person?.phone_number"
                                                    type="text" class="input-box input-duo disabled"
                                                    placeholder="Teléfono" disabled />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Correo electrónico</label>
                                            <input type="email" class="input-box disabled" disabled
                                                :value="modelContract.relationships.person?.email"
                                                placeholder="Correo electrónico" />
                                        </div>

                                    </div>
                                    <!-- <div v-if="editTrabajador" class="form-actions">
                                        <button class="sections-add-btn">
                                            <span>Guardar</span>
                                        </button>
                                    </div> -->
                                </section>
                                <section class="card">

                                    <div class="section-header">
                                        <h3 class="section-title">Información de la empresa</h3>
                                    </div>

                                    <div class="section-grid">

                                        <div class="form-group">
                                            <label class="label-bold">País</label>
                                            <input type="text" class="input-box disabled" disabled placeholder="Entidad"
                                                :value="props.modelContract.relationships.headquarter?.entity?.country?.name" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Departamento</label>
                                            <input type="text" class="input-box disabled" disabled placeholder="Entidad"
                                                :value="props.modelContract.relationships.headquarter?.city?.departament?.name" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Ciudad</label>
                                            <input type="text" class="input-box disabled" disabled placeholder="Entidad"
                                                :value="props.modelContract.relationships.headquarter?.city?.name" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Empresa</label>
                                            <input type="text" class="input-box disabled" disabled placeholder="Entidad"
                                                :value="props.modelContract.relationships.headquarter?.entity?.enterprise?.name" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Entidad</label>
                                            <input type="text" class="input-box disabled" disabled placeholder="Entidad"
                                                :value="props.modelContract.relationships.headquarter?.entity?.name" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">NIT</label>
                                            <input type="text" class="input-box disabled" disabled
                                                :value="props.modelContract.relationships.headquarter?.entity?.document_number" />
                                        </div>

                                        <div class="form-group">
                                            <label class="label-bold">Sede</label>
                                            <input type="text"
                                                :value="props.modelContract.relationships.headquarter?.name"
                                                class="input-box disabled" disabled>
                                        </div>

                                    </div>
                                </section>
                            </div>
                        </div>
                        <div class="contract-wrapper">
                            <div class="nav-tabs" :style="{ '--active': activeTab, '--count': 2 }" role="tablist">
                                <button class="tab" :class="{ active: activeTab === 0 }" role="tab"
                                    :aria-selected="activeTab === 0" @click="activeTab = 0">
                                    Pólizas
                                </button>
                                <button class="tab" :class="{ active: activeTab === 1 }" role="tab"
                                    :aria-selected="activeTab === 1" @click="activeTab = 1">
                                    Otrosíes
                                </button>
                                <span class="underline"></span>
                            </div>
                            <template v-if="activeTab == 0">
                                <div class="form-buttons">
                                    <button class="sections-add-btn" @click="emit('police')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M216,128a12,12,0,0,1-12,12H140v64a12,12,0,0,1-24,0V140H52a12,12,0,0,1,0-24h64V52a12,12,0,0,1,24,0v64h64A12,12,0,0,1,216,128Z">
                                            </path>
                                        </svg>
                                        <span>Agregar póliza</span>
                                    </button>
                                </div>
                                <div class="tabla-toolbar">
                                    <label class="page-size">
                                        Elementos por página:
                                        <select class="select-underline">
                                            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                                        </select>
                                    </label>
                                    <div class="search-underline">
                                        <input type="text" placeholder="Buscar" />
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div class=" tabla-style">
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Tipo</th>
                                                    <th>Código</th>
                                                    <!-- <th>Número</th> -->
                                                    <th>Aseguradora</th>
                                                    <th>Valor</th>
                                                    <th>Valor asegurado</th>
                                                    <th>Fecha inicio</th>
                                                    <th>Fecha fin</th>
                                                    <th>Cantidad de renovaciones</th>
                                                    <th>Estados</th>
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
                                                        <div class="skeleton"
                                                            style="width:30px;height:30px;border-radius:6px;">
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr v-for="policy in props.policesContract" :key="policy.id">
                                                    <td class="descripcion-col">
                                                        <div class="descripcion-texto">
                                                            {{ policy.policy_type.name  || 'Sin tipo' }}
                                                        </div>
                                                    </td>
                                                    <td>{{ policy.code }}</td>
                                                    <!-- <td>Desarrollo</td> -->
                                                    <td>{{ policy.risk_manager.name }}</td>
                                                    <td>{{ policy.value }}</td>
                                                    <td>{{ policy.insured_value }}</td>
                                                    <td>{{ policy.start_date.split('T')[0] }}</td>
                                                    <td>{{ policy.end_date.split('T')[0] }}</td>
                                                    <td>
                                                        4
                                                    </td>
                                                    <td><span class="badge" :class="{
                                                        'bg-purple-strong': policy.status === 'Firmado',
                                                        'bg-yellow': policy.status === 'Pendiente',
                                                        'bg-blue': policy.status === 'En revisión',
                                                        'bg-green': policy.status === 'Aprobado',
                                                        'bg-orange': policy.status === 'Desistió',
                                                        'bg-purple': policy.status === 'Actualizar',
                                                        'bg-lavender': policy.status === 'Devuelto'
                                                    }"><svg viewBox="0 0 256 256" width="12" height="12"
                                                                fill="currentColor">
                                                                <path :d="ICON_PATHS[policy.status]" />
                                                            </svg>{{ policy.status }}</span></td>
                                                    <td class="acciones">
                                                        <span class="actions">
                                                            <Button title="Detalles" icon="list" variant="question"
                                                                @click="emit('detail')" />
                                                            <Button title="Renovar" icon="renew" variant="question"
                                                                @click="emit('renew')" />
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr v-if="props.policesContract.length == 0">
                                                    <td colspan="11" class="no-results-cell">
                                                        <div class="no-results">
                                                            <div class="no-results-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="38"
                                                                    height="38" fill="#000000" viewBox="0 0 256 256">
                                                                    <path
                                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                    </path>
                                                                </svg>
                                                            </div>
                                                            <p class="info" style="font-size: 16px;">No se encontraron
                                                                registros</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="table-footer">
                                    <div class="page-info">
                                        Página {{ 1 }} de {{
                                            1 }}
                                    </div>

                                    <div class="pagination">
                                        <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                            :disabled="1 === 1">
                                            &laquo;
                                        </button>

                                        <button class="page-btn" aria-label="Anterior" @click="prev()"
                                            :disabled="1 === 1">
                                            &lsaquo;
                                        </button>

                                        <!-- Páginas dinámicas -->
                                        <div v-for="(p, i) in 1" :key="i">
                                            <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                                @click="goTo(p)">
                                                {{ p }}
                                            </button>
                                            <span v-else class="dots">…</span>
                                        </div>

                                        <button class="page-btn" aria-label="Siguiente" @click="next()"
                                            :disabled="1 === 1">
                                            &rsaquo;
                                        </button>

                                        <button class="page-btn" aria-label="Última" @click="goTo(1)"
                                            :disabled="1 === 1">
                                            &raquo;
                                        </button>
                                    </div>
                                </div>
                            </template>
                            <template v-if="activeTab == 1">
                                <div class="form-buttons">
                                    <button class="sections-add-btn" @click="emit('otroSi'); emit('configurationFind')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M216,128a12,12,0,0,1-12,12H140v64a12,12,0,0,1-24,0V140H52a12,12,0,0,1,0-24h64V52a12,12,0,0,1,24,0v64h64A12,12,0,0,1,216,128Z">
                                            </path>
                                        </svg>
                                        <span>Agregar otrosí</span>
                                    </button>
                                </div>
                                <div class="tabla-toolbar">
                                    <label class="page-size">
                                        Elementos por página:
                                        <select class="select-underline">
                                            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                                        </select>
                                    </label>
                                    <div class="search-underline">
                                        <input type="text" placeholder="Buscar" />
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div class=" tabla-style">
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Tipo</th>
                                                    <th>Código</th>
                                                    <th>Valor del contrato</th>
                                                    <th>Fecha inicio</th>
                                                    <th>Fecha fin</th>
                                                    <th>Descripción</th>
                                                    <th>Estados</th>
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
                                                        <div class="skeleton skel-col"></div>
                                                    </td>
                                                    <td>
                                                        <div class="skeleton"
                                                            style="width:30px;height:30px;border-radius:6px;">
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr v-for="vacante in vacancies" :key="vacante.id">
                                                    <td>Jorge Mendoza</td>
                                                    <td>River Plaza</td>
                                                    <td>Desarrollo</td>
                                                    <td>Jorge Mendoza</td>
                                                    <td>4</td>
                                                    <td>4</td>
                                                    <td><span class="badge" :class="{
                                                        'bg-purple-strong': vacante.status === 'Firmado',
                                                        'bg-yellow': vacante.status === 'Pendiente',
                                                        'bg-blue': vacante.status === 'En revisión',
                                                        'bg-green': vacante.status === 'Aprobado',
                                                        'bg-orange': vacante.status === 'Desistió',
                                                        'bg-purple': vacante.status === 'Actualizar',
                                                        'bg-lavender': vacante.status === 'Devuelto'
                                                    }"><svg viewBox="0 0 256 256" width="12" height="12"
                                                                fill="currentColor">
                                                                <path :d="ICON_PATHS[vacante.status]" />
                                                            </svg>{{ vacante.status }}</span></td>
                                                    <td class="acciones">
                                                        <span class="actions">
                                                            <Button v-if="vacante.status == 'Actualizar'" title="Editar"
                                                                icon="pencil" variant="question"
                                                                @click="emit('otroSi'); emit('configurationFind')" />
                                                            <Button title="Previsualizar" icon="preview"
                                                                variant="question" @click="openPreview(null)" />
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr v-if="vacancies.length == 0">
                                                    <td colspan="11" class="no-results-cell">
                                                        <div class="no-results">
                                                            <div class="no-results-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="38"
                                                                    height="38" fill="#000000" viewBox="0 0 256 256">
                                                                    <path
                                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                    </path>
                                                                </svg>
                                                            </div>
                                                            <p class="info" style="font-size: 16px;">No se encontraron
                                                                registros</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="table-footer">
                                    <div class="page-info">
                                        Página {{ 1 }} de {{
                                            1 }}
                                    </div>

                                    <div class="pagination">
                                        <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                            :disabled="1 === 1">
                                            &laquo;
                                        </button>

                                        <button class="page-btn" aria-label="Anterior" @click="prev()"
                                            :disabled="1 === 1">
                                            &lsaquo;
                                        </button>

                                        <!-- Páginas dinámicas -->
                                        <div v-for="(p, i) in 1" :key="i">
                                            <button v-if="p !== '…'" class="page-btn" :class="{ active: p === 1 }"
                                                @click="goTo(p)">
                                                {{ p }}
                                            </button>
                                            <span v-else class="dots">…</span>
                                        </div>

                                        <button class="page-btn" aria-label="Siguiente" @click="next()"
                                            :disabled="1 === 1">
                                            &rsaquo;
                                        </button>

                                        <button class="page-btn" aria-label="Última" @click="goTo(1)"
                                            :disabled="1 === 1">
                                            &raquo;
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>

                </div>
            </div>
            <Transition name="slide-panel">
                <div class="split-panel" v-if="showDetailsPolice">
                    <SidePanel width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles pólizas</h2>
                            <Button title="Cerrar detalles" icon="rowLeft" variant="transparent"
                                @click="emit('close-detail')" />
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <PoliceDetails @close-detail="emit('close-detail')"
                                        @editPolice="emit('editPolice')" />
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
    <pdfPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
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


.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
}

.section-main-title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #5B4CD0;
}

.card-all {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #d9ceff;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin-bottom: 16px;
    color: #5B4CD0;
}



.section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 6px;
}


.row-2 {
    display: grid;
    grid-template-columns: 120px 1fr;
}

.section-edit-btn {
    background: transparent;
    border: none;
    cursor: pointer;
}

:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.input-duo {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}

.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    margin-top: 6px;
    padding-top: 6px;
    border-bottom: 1px solid rgba(91, 76, 208, 0.25);
}

.tab {
    background: transparent;
    border: 0;
    padding: 10px 0 8px;
    font-weight: 600;
    cursor: pointer;
    color: #9a86ff;
    transition: color 0.15s;
}

.tab:nth-child(calc(var(--active) + 1)) {
    color: #5b4cd0;
    background: #f7f5ff;
}

.underline {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 50%;
    height: 2px;
    background: #5b4cd0;
    transform: translateX(calc(var(--active) * 100%));
    transition: transform 0.2s ease;
    pointer-events: none;
}

.sections-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 5px;
    border: none;
    background: #5b4cd0;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.sections-add-btn:hover {
    filter: brightness(0.95);
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
    border-color: #9747FF;
    background-color: #F4EFFC;
    color: #9747FF;
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

/* === EFECTO SHIMMER REAL === */
.sk-line,
.sk-input,
.sk-circle,
.sk-button,
.sk-textarea,
.sk-badge {
    background: linear-gradient(90deg, #ececec 25%, #f4f4f4 50%, #ececec 75%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.3s infinite;
}

@keyframes loadingShimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

/* ===== WRAPPER ===== */
.skeleton {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* ===== CARDS ===== */
.sk-card {
    background: white;
    padding: 26px;
    border-radius: 16px;
    border: 1px solid #efe7ff;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

/* ENCABEZADOS */
.sk-header,
.sk-subheader {
    display: flex;
    align-items: center;
    padding: 22px;
    border-radius: 16px;
    border: 1px solid #efe7ff;
}

/* Títulos */
.sk-title {
    width: 320px;
    height: 20px;
    border-radius: 10px;
}

.sk-subtitle {
    width: 180px;
    height: 18px;
    border-radius: 8px;
}

/* Badge */
.sk-badge {
    width: 100px;
    height: 28px;
    border-radius: 12px;
    margin-left: auto;
    margin-right: 16px;
}

/* Circulitos (iconos) */
.sk-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

/* Divider */
.sk-divider {
    width: 100%;
    height: 1px;
    background: #efe7ff;
}

/* GRID DE INPUTS */
.sk-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.sk-input {
    height: 48px;
    border-radius: 12px;
}

.sk-input.sk-full {
    grid-column: span 2;
}

/* Textarea */
.sk-textarea {
    height: 140px;
    border-radius: 14px;
}

/* Sección Header Card */
.sk-section-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.sk-section-header .sk-circle {
    margin-left: auto;
}

/* Footer */
.sk-footer {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
}

.sk-button {
    width: 160px;
    height: 42px;
    border-radius: 12px;
}

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
</style>
