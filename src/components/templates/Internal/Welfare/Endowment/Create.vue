<script setup>
import { ref, defineAsyncComponent } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'
import { useAlertStore } from '@/stores/alertStore';
const alertStore = useAlertStore();

const props = defineProps({
    showDetailEndowment: Boolean,
})

const emit = defineEmits(['index', 'sendPetition', 'close-detail', 'addEndowment', 'deliver'])

const expandedKey = ref(null);

const toggleRow = (key) => {
    expandedKey.value = (expandedKey.value === key) ? null : key;
};

const isExpanded = (key) => expandedKey.value === key;

const endowments = ref([
    {
        id: 1,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Información',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
    {
        id: 2,
        fecha: 'Enero 2026',
        total: 3,
        estado: 'Información',
        items: [
            { nombre: 'Camisa', cantidad: 2 },
            { nombre: 'Pantalón', cantidad: 1 },
        ],
    },
]);


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
        <span>Bienestar</span>
        <span>|</span>
        <span>Dotación</span>
        <span>|</span>
        <span class="active">Entrega dotación</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailEndowment }">
            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Entregar dotación</h2>
                    <template v-if="false">
                        <!-- GRID 1: Tipo de incapacidad / Fecha inicio -->
                        <div class="skel-form-grid">

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                        </div>

                        <!-- GRID 2: Fecha fin / Archivo -->
                        <div class="skel-form-grid">

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                            <div>
                                <div class="skeleton skel-label"></div>
                                <div class="skeleton skel-input"></div>
                            </div>

                        </div>

                        <!-- EDITOR -->
                        <div>
                            <div class="skeleton skel-label" style="width:80px;"></div>

                            <!-- Toolbar -->
                            <div class="skel-editor-toolbar">
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                                <div class="skeleton skel-toolbar-icon"></div>
                            </div>

                            <!-- Textarea -->
                            <div class="skeleton skel-textarea"></div>
                        </div>

                        <!-- BOTONES -->
                        <div class="skel-btns">
                            <div class="skeleton skel-btn"></div>
                            <div class="skeleton skel-btn"></div>
                        </div>

                    </template>
                    <template v-else>

                        <!-- Si accedemos por un usuario debemos ocultar este menú de busqueda -->
                        <div v-if="true" class="grid-doc">
                            <div class="input-group">
                                <label class="label-bold">Documento</label>

                                <div class="dual-input">
                                    <SearchSelect class="select-duo" :options="[]" optionKey="settings.abreviature"
                                        valueKey="id" name="entity_type_id" id="entity_type_id"
                                        placeholder="Acronimo" />
                                    <input type="text" name="name" placeholder="Número de documento" class="input-box"
                                        :class="{ 'input-error': props.errors?.entity_name }" />
                                </div>
                            </div>

                            <!-- wrapper para alinear el botón abajo -->
                            <div class="doc-btn">
                                <button class="btn-primary">Consultar</button>
                            </div>
                        </div>


                        <div class="delivery-card">
                            <div class="delivery-title">
                                Datos de entrega
                            </div>
                            <div class="delivery-section-title">
                                Información Empleado
                            </div>
                            <div>

                                <div class="tabla-style">
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Tipo de dotación</th>
                                                    <th>Tipo de documento</th>
                                                    <th>Documento</th>
                                                    <th>Talla camisa</th>
                                                    <th>Talla pantalón</th>
                                                    <th>Talla zapatos</th>
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
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr v-for="p in 1" :key="p.id">
                                                    <td>Información</td>
                                                    <td>Información</td>
                                                    <td>Información</td>
                                                    <td>Información</td>
                                                    <td>Información</td>
                                                    <td>Información</td>
                                                    <td>Información</td>
                                                </tr>
                                                <tr v-if="false">
                                                    <td colspan="10" class="no-results-cell">
                                                        <div class="no-results">
                                                            <div class="no-results">
                                                                <div class="no-results-icon">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="38"
                                                                        height="38" fill="#000000"
                                                                        viewBox="0 0 256 256">
                                                                        <path
                                                                            d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                        </path>
                                                                    </svg>
                                                                </div>
                                                                <p class="info" style="font-size: 16px;">No se
                                                                    encontraron registros
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="delivery-section-title">Registro de dotación</div>

                            <div class="dotation-row">
                                <div class="dotation-field">
                                    <label class="label-bold">Dotación</label>
                                    <SearchSelect :options="[]" optionKey="name" valueKey="id"
                                        placeholder="Seleccionar" />
                                </div>

                                <div class="dotation-field">
                                    <label class="label-bold">Cantidad entregada</label>
                                    <input type="number" min="0" class="input-box" placeholder="0" />
                                </div>

                                <!-- WRAPPER para alinear el botón -->
                                <div class="dotation-btn">
                                    <button type="button" class="btn-primary"
                                        @click="emit('addEndowment')">Agregar</button>
                                </div>
                            </div>

                        </div>

                        <div style="border: #D3D3D3 solid 1px; padding: 18px 18px 14px; border-radius: 5px;">
                            <div class="delivery-title">
                                Historial de entregas
                            </div>
                            <div class="tabla-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Fecha de entrega</th>
                                            <th>Cantidad total entregada</th>
                                            <th>Estado</th>
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
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <template v-for="(p, index) in endowments" :key="p.id ?? index">
                                            <!-- FILA PADRE -->
                                            <tr class="row-parent">
                                                <td @click="toggleRow(p.id ?? index)">
                                                    <span class="chev" :class="{ open: isExpanded(p.id ?? index) }"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                                            fill="#000000" viewBox="0 0 256 256">
                                                            <path
                                                                d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z">
                                                            </path>
                                                        </svg></span>
                                                </td>
                                                <td>
                                                    <span>{{ p.fecha }}</span>
                                                </td>

                                                <td>{{ p.total }}</td>

                                                <td>
                                                    <span class="badge bg-purple">
                                                        {{ p.estado }}
                                                    </span>
                                                </td>
                                            </tr>

                                            <!-- FILA HIJA (SUBTABLA) -->
                                            <tr v-if="isExpanded(p.id ?? index)" class="row-child">
                                                <td :colspan="5" class="child-cell">
                                                    <table class="subtable">
                                                        <thead>
                                                            <tr>
                                                                <th>Dotación</th>
                                                                <th>Cantidad</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(it, i) in p.items" :key="i">
                                                                <td>{{ it.nombre }}</td>
                                                                <td>{{ it.cantidad }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                        </div>
                    </template>
                </div>
            </div>

            <Transition name="slide-panel">
                <div class="split-panel" v-if="showDetailEndowment">
                    <SidePanel :title="'Detalle del examen'" width="480px">
                        <div style="display: flex; justify-content: space-between;" class="sub-title">
                            <h2 class="sub-titulo">Detalles de la entrega</h2>
                        </div>
                        <Suspense>
                            <template #default>
                                <div class="sub-container">
                                    <div class="preview-wrapper">
                                        <template v-if="false">
                                            <div>

                                                <!-- Header -->
                                                <div class="skel-flex">
                                                    <div class="skeleton"
                                                        style="width:140px; height:60px; border-radius:6px;"></div>
                                                    <div class="skeleton skel-badge"></div>
                                                </div>

                                                <br>

                                                <!-- Cuerpo del texto -->
                                                <div>
                                                    <div class="skeleton skel-paragraph long"></div>
                                                    <div class="skeleton skel-paragraph medium"></div>
                                                    <div class="skeleton skel-paragraph long"></div>
                                                    <div class="skeleton skel-paragraph long"></div>
                                                    <div class="skeleton skel-paragraph medium"></div>
                                                    <div class="skeleton skel-paragraph short"></div>
                                                </div>
                                                <div>
                                                    <div class="skeleton skel-paragraph long"></div>
                                                    <div class="skeleton skel-paragraph medium"></div>
                                                    <div class="skeleton skel-paragraph long"></div>
                                                    <div class="skeleton skel-paragraph long"></div>
                                                    <div class="skeleton skel-paragraph medium"></div>
                                                    <div class="skeleton skel-paragraph short"></div>
                                                </div>

                                                <br>

                                                <!-- Firma -->
                                                <div>
                                                    <div class="skeleton skel-paragraph medium"></div>
                                                    <div class="skeleton skel-paragraph short"></div>
                                                </div>

                                                <br>

                                                <!-- Archivo -->
                                                <div class="skel-file">
                                                    <div class="skeleton skel-file-icon"></div>
                                                </div>

                                            </div>
                                        </template>
                                        <template v-else>
                                            <!-- HEADER -->
                                            <div class="header-row">
                                                <!-- AQUI IR EL LOGO DE LA ENTIDAD CORRESPONDIENTE -->
                                                <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo" />
                                                <span class="header-title">Dotación</span>
                                            </div>

                                            <hr class="separadores" />

                                            <div class="mini-table">
                                                <div class="mini-head">
                                                    <div>Nombre</div>
                                                    <div>Cantidad</div>
                                                </div>

                                                <div class="mini-row" v-for="(it, i) in 2" :key="i">
                                                    <div>camisa</div>
                                                    <div>2</div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <div style="margin-top: 10px;">
                                        <label class="label-bold" style="display:flex; align-items:center; gap:8px;">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="checkbox-input"
                                                    v-model="entregaExterna" />
                                                <div class="checkbox-box">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        stroke-width="3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span class="checkbox-text">Entrega externa</span>
                                            </label>
                                        </label>
                                    </div>
                                    <div class="form-buttons">
                                        <button class="btn-primary" @click="emit('deliver')">Entregar</button>
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
.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
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

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-2 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

/* ====== LAYOUT GENERAL ====== */
.skel-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
    margin-bottom: 24px;
}

/* ====== LABELS ====== */
.skel-label {
    width: 160px;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 8px;
}

/* ====== INPUTS Y SELECTS ====== */
.skel-input {
    width: 100%;
    height: 42px;
    border-radius: 10px;
}

/* ====== ARCHIVO ====== */
.skel-file-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.skel-upload-btn {
    width: 130px;
    height: 36px;
    border-radius: 10px;
}

.skel-file-text {
    width: 180px;
    height: 14px;
    border-radius: 6px;
}

/* ====== EDITOR TOOLBAR ====== */
.skel-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
}

.skel-toolbar-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
}

/* ====== TEXTAREA ====== */
.skel-textarea {
    width: 100%;
    height: 260px;
    border-radius: 10px;
    margin-top: 10px;
}

/* ====== BOTONES ====== */
.skel-btns {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
}

.skel-btn {
    width: 110px;
    height: 38px;
    border-radius: 10px;
}

/* ====== EFECTO SHIMMER ====== */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

/* Dual input */
.dual-input {
    display: flex;
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 6px #D3D3D3;
    align-items: stretch;
    /* 🔑 clave */
    height: 37px;
}

/* Elementos internos */
.dual-input .select-box,
.dual-input .input-box {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.dual-input .select-box,
:deep(.dual-input .select-duo) {
    /* Antes: flex: 0 0 140px;  -> rígido */
    flex: 0 1 clamp(140px, 32%, 240px);
    /* mínimo 140px, ideal ~32%, máximo 240px */
    min-width: 120px;
    /* asegura legibilidad del select */
}

/* Divisor */
.dual-input .select-box::after {
    content: "";
    position: absolute;
    right: 0;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: #CFCECE;
    pointer-events: none;
}

/* SearchSelect dentro de dual-input */
.dual-input .search-input {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 8px 10px;
}

:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

/* Card contenedora (fondo lila suave) */
.delivery-card {
    background: #f7f5ff;
    border-radius: 5px;
    padding: 18px 18px 14px;
    margin-bottom: 10px;
}

/* Título principal */
.delivery-title {
    font-size: 16px;
    font-weight: 600;
    color: #5b4cd0;
    margin-bottom: 14px;
}

/* Subtítulos */
.delivery-section-title {
    font-size: 13px;
    font-weight: 600;
    color: #5b4cd0;
    margin: 14px 0 10px;
}

/* fila de registro */
.dotation-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    /* 2 inputs + botón */
    gap: 18px;
    align-items: end;
    /* botón alineado con la base de inputs */
    margin-top: 6px;
}

/* cada campo */
.dotation-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.dotation-label {
    font-weight: 700;
    color: #111827;
    font-size: 14px;
}

/* input visual (sirve para input/select y el searchselect si lo envuelve) */
.dotation-input {
    height: 44px;
    width: 100%;
    border-radius: 10px;
    border: 1px solid rgba(17, 24, 39, .12);
    background: #fff;
    padding: 0 12px;
    box-shadow: 0 2px 6px rgba(17, 24, 39, .06);
    outline: none;
}

/* si SearchSelect es componente y el input real está adentro */
:deep(.dotation-input .search-input) {
    height: 44px;
    border: 0;
    box-shadow: none;
    padding: 0 12px;
    border-radius: 10px;
}

/* responsive: en móvil baja el botón */
@media (max-width: 900px) {
    .dotation-row {
        grid-template-columns: 1fr;
        align-items: stretch;
    }

    .btn-add {
        width: 100%;
    }
}

/* ====== celda expandible (icono + texto alineado) ====== */
.cell-expand {
    cursor: pointer;
    display: flex;
    /* importante en td */
    align-items: center;
    gap: 10px;
    user-select: none;
}

/* contenedor del chevron */
.chev {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: transform .18s ease, background-color .18s ease;
    color: #5b4cd0;
}

/* el SVG hereda color y se ve consistente */
.chev svg {
    fill: currentColor !important;
}

/* rotación cuando abre */
.chev.open {
    transform: rotate(90deg);
    background: rgba(91, 76, 208, 0.08);
}

.fecha {
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
}

/* ====== fila hija integrada ====== */
.row-child .child-cell {
    padding: 0 !important;
    background: transparent;
    border-top: 0;
}

/* subtabla como "sección" dentro de la fila */
.subtable {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
}

/* header de subtabla */
.subtable thead th {
    background: #f3f0ff;
    color: #5b4cd0;
    font-weight: 700;
    font-size: 12px;
    padding: 10px 16px;
    text-align: left;
}

/* filas subtabla */
.subtable tbody td {
    padding: 10px 16px;
    border-top: 1px solid #eee;
    font-size: 12px;
}

/* opcional: leve indent para diferenciar */
.subtable {
    border-top: 1px solid #eee;
}

/* Reemplaza tu grid-2 para esta sección */
.grid-doc {
    display: grid;
    grid-template-columns: clamp(420px, 70%, 520px) auto;
    gap: 18px;
    align-items: end;
    padding-bottom: 10px;
}

/* El wrapper empuja el botón abajo SIN tocar btn-primary */
.doc-btn {
    display: flex;
    align-items: flex-end;
    height: 100%;
}

/* Tu btn-primary tiene align-self:flex-start !important -> lo anulamos solo aquí */
.doc-btn>.btn-primary {
    align-self: auto !important;
}

/* Responsive: en móvil baja el botón */
@media (max-width: 900px) {
    .grid-doc {
        grid-template-columns: 1fr;
    }

    .doc-btn {
        justify-content: flex-end;
    }
}

.preview-wrapper {
    width: 100%;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-logo {
    height: 45px;
}

.header-title {
    font-size: 13px;
    font-weight: 600;
    color: #8d8d8d;
}

.separadores {
    border: none;
    border-top: 1px solid #dcdcdc;
    margin: 12px 0 18px;
    width: 100%;
}

.preview-text {
    font-size: 14px;
    line-height: 1.6;
    color: #2d2d2d;
}

.var-chip {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 6px;
    background: #f4eeff;
    color: #5b4cd0;
    border: 1px solid #e0d5ff;
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
}

.file-row-clean {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin: 6px 0;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px 0 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 2px 6px #d3d3d3;
}

.file-row-clean .pdf-icon {
    flex-shrink: 0;
}

.file-name-clean {
    font-weight: 500;
    color: #111;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* ✨ Centra el título con el botón */
    width: 100%;
}

.header-title {
    display: flex;
    align-items: center;
    /* ✨ Evita que el texto se baje */
    gap: 10px;
    margin-bottom: 10px;
}

.view-file {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin: 6px 0;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px 0 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 2px 6px #d3d3d3;
    background-color: #f4f2ff;
}

.preview-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-info span {
    font-size: 14px;
}

.preview-file svg {
    color: red;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}

.header-title svg {
    flex-shrink: 0;
    background: #f4effc;
    border-radius: 8px;
    padding: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-title h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #222;
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

/* mini tabla */
.mini-table {
    background: #fff;
    border: 1px solid rgba(17, 24, 39, .08);
    border-radius: 12px;
    overflow: hidden;
}

.mini-head,
.mini-row {
    display: grid;
    grid-template-columns: 1fr 140px;
    /* segunda columna fija */
    gap: 12px;
    padding: 10px 14px;
    align-items: center;
}


.mini-head {
    background-color: #f8f6ff;
    color: #5b4cd0;
    font-weight: 600;
    padding: 9px 12px;
    font-size: 12.5px;
    text-align: left;
    vertical-align: middle;

    display: grid;
    grid-template-columns: 1fr 140px;
    /* o lo que uses */
    gap: 12px;
    align-items: center;
    /* centra verticalmente en grid */
}

.mini-row {
    font-size: 13px;
}

.mini-row:last-child {
    border-bottom: 0;
}

.mini-row:hover {
    background: rgba(91, 76, 208, .04);
}

.right {
    text-align: right;
    font-weight: 700;
}

.name {
    font-weight: 600;
    color: #111827;
}

/* responsive: en pantallas pequeñas, la cantidad baja debajo */
@media (max-width: 520px) {
    .mini-head {
        display: none;
    }

    .mini-row {
        grid-template-columns: 1fr;
    }

    .right {
        text-align: left;
        font-weight: 700;
        color: #5b4cd0;
    }
}
</style>