<script setup>
import { ref, watch, defineAsyncComponent } from "vue";

const props = defineProps({
    welfareEdit: Boolean,
    errors: {
        type: Object,
        default: () => ({}),
    },
    modelContract: Object,
    policesContract: Array,
    findContract: Boolean,
    addendums: Array,
    contractPreview: Object,
    showDetailsPolice: Boolean,
    modelPolicy: Object
})

const emit = defineEmits(['welfareStatusEdting', 'submitwelfareUpdate', 'submitContractPreview', 'detail', 'close-detail', 'submitPolicyFind']);

const ICON_PATHS = {
    'Activo': "M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
    'Inactivo': "M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z",
}

const activeTab = ref(0)

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

watch(showPreview, (visible) => {
    document.body.style.overflow = visible ? 'hidden' : ''
})

function openPreview(doc) {
    //dato quemado
    if (typeof doc === "string") {
        preview.value = { url: doc, name: "Documento.pdf" };
        showPreview.value = true;
        return;
    }
    if (
        doc && typeof doc === "object" && "name" in doc && "size" in doc && "type" in doc &&
        typeof doc.size === "number" && typeof doc.name === "string"
    ) {
        const fileURL = URL.createObjectURL(doc);
        preview.value = { url: fileURL, name: doc.name };
        showPreview.value = true;
        return;
    }
    preview.value = { url: doc?.path || "", name: doc?.name || "Documento.pdf" };
    showPreview.value = true;
}

const PdfPreview = defineAsyncComponent(() => import('../../../../UI/templates/PDFPreview.vue'))
const PoliceDetails = defineAsyncComponent(() => import('../../../../shared/features/PolicesDetails.vue'))
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
        <span class="active">Mi contrato</span>
    </div>
    <div class="container-data">
        <div class="split" :class="{ 'with-panel': showDetailsPolice }">
            <div class="split-main">
                <div class="main-container">
                    <!-- TÍTULO -->
                    <h2 class="titulo">Mi contrato</h2>
                    <div class="auth-form" v-if="props.findContract">
                        <div class="auth-form-body">
                            <ul class="custom-list">
                                <li class="li-with-title-dot">
                                    <div class="section-head">
                                        <div class="section-title">
                                            <h4 class="title-dot">Información general</h4>
                                        </div>

                                        <div class="section-actions">
                                            <button class="btn-primary btn-action"
                                                @click="emit('submitContractPreview', props.modelContract.id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                    <path
                                                        d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z" />
                                                </svg>
                                                <span>Descargar PDF</span>
                                            </button>

                                            <button class="btn-primary btn-action">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                    <path
                                                        d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z" />
                                                </svg>
                                                <span>Descargar Paz y salvo</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                                <div class="info-grid">
                                    <div class="info-card">
                                        <div class="label-bold">Tipo de contrato</div>
                                        <div class="text">{{ props.modelContract.relationships.contract_type.name }}
                                        </div>
                                    </div>

                                    <div class="info-card">
                                        <div class="label-bold">Cargo</div>
                                        <div class="text">{{ props.modelContract.relationships.position.name }}</div>
                                    </div>

                                    <div class="info-card">
                                        <div class="label-bold">Área</div>
                                        <div class="text">{{ props.modelContract.relationships.position.area.name }}
                                        </div>
                                    </div>

                                    <div class="info-card">
                                        <div class="label-bold">Fecha inicio</div>
                                        <div class="text">{{ props.modelContract.start_date }}</div>
                                    </div>

                                    <div class="info-card">
                                        <div class="label-bold">Fecha fin</div>
                                        <div class="text">{{ props.modelContract.end_date }}</div>
                                    </div>

                                    <div class="info-card">
                                        <div class="label-bold">Salario base</div>
                                        <div class="text">${{ props.modelContract.salary }}</div>
                                    </div>
                                </div>
                                <hr class="separadores">
                                <div class="contract-wrapper">
                                    <div class="nav-tabs" :style="{ '--active': activeTab, '--count': 2 }"
                                        role="tablist">
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
                                        <div class="tabla-toolbar">
                                            <label class="page-size">
                                                Elementos por página:
                                                <select class="select-underline">
                                                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                                                </select>
                                            </label>
                                            <div class="search-underline">
                                                <input type="text" placeholder="Buscar" />
                                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16"
                                                    height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
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
                                                            <td>{{ policy.policy_type.name }}</td>
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
                                                                    <Button title="Detalles" icon="list"
                                                                        variant="question" @click="emit('detail'); emit('submitPolicyFind', policy.id)" />
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="props.policesContract.length == 0">
                                                            <td colspan="11" class="no-results-cell">
                                                                <div class="no-results">
                                                                    <div class="no-results-icon">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="38" height="38" fill="#000000"
                                                                            viewBox="0 0 256 256">
                                                                            <path
                                                                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                            </path>
                                                                        </svg>
                                                                    </div>
                                                                    <p class="info" style="font-size: 16px;">No se
                                                                        encontraron
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
                                                    <button v-if="p !== '…'" class="page-btn"
                                                        :class="{ active: p === 1 }" @click="goTo(p)">
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
                                        <div class="tabla-toolbar">
                                            <label class="page-size">
                                                Elementos por página:
                                                <select class="select-underline">
                                                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                                                </select>
                                            </label>
                                            <div class="search-underline">
                                                <input type="text" placeholder="Buscar" />
                                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16"
                                                    height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
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
                                                        <tr v-for="vacante in props.addendums" :key="vacante.id">
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
                                                                    <Button title="Previsualizar" icon="preview"
                                                                        variant="question" @click="openPreview(null)" />
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="props.addendums.length === 0">
                                                            <td colspan="11" class="no-results-cell">
                                                                <div class="no-results">
                                                                    <div class="no-results-icon">
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            width="38" height="38" fill="#000000"
                                                                            viewBox="0 0 256 256">
                                                                            <path
                                                                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                                            </path>
                                                                        </svg>
                                                                    </div>
                                                                    <p class="info" style="font-size: 16px;">No se
                                                                        encontraron
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
                                                    <button v-if="p !== '…'" class="page-btn"
                                                        :class="{ active: p === 1 }" @click="goTo(p)">
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
                            </ul>
                        </div>
                    </div>
                    <div>

                    </div>
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
                                        @editPolice="emit('editPolice')" :modelPolicy="props.modelPolicy" />
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

.auth-form {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0px 4px 4px rgba(151, 71, 255, 0.16);
    padding: 30px 30px 25px;
    margin-bottom: 15px;
    align-items: start;
}

.auth-form-header {
    padding-right: 0;
}

.auth-form-header h2 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin: 0;
    color: #3e32bf;
    font-size: 19px;
    font-weight: 700;
}

.edit-form-body {
    cursor: pointer;
}

.auth-form-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

/* =========================
   Textos
   ========================= */
.text {
    margin: 0 !important;
}

.form-group p {
    font-size: 14px;
}

.form-group label {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 5px;
}

/* =========================
   Listas (custom-list)
   ========================= */
.custom-list {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
    gap: 10px;
    display: flex;
    flex-direction: column;
}

/* encabezados (li) */
.custom-list>li {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* bullet custom */
.custom-list>li::before {
    content: "";
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><circle cx='5' cy='5' r='2' fill='%235b4cd0'/></svg>");
    background-repeat: no-repeat;
    background-size: contain;
}

/* h4 de sección */
.custom-list h4 {
    margin: 0;
    font-size: 18px;
    color: #5b4cd0;
    font-weight: 600;
    display: block;
}

/* =========================
   Forms / inputs
   ========================= */
.form-row,
.form-row-view {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.text-area {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;
}

.char-limit {
    text-align: right;
    font-size: 0.75rem;
    color: #666;
    margin-top: 4px;
}

/* focus/hover */
input:hover,
input:focus,
select:hover,
select:focus,
textarea:hover,
textarea:focus {
    border-color: #5b4cd0;
    outline: none;
}

/* =========================
   Dual input (prefijo + teléfono)
   ========================= */
.dual-input {
    --left-width: clamp(140px, 32%, 240px);

    display: flex;
    width: 100%;
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    background: #fff;
    align-items: stretch;
    height: 37px;
}

:deep(.dual-input .select-duo) {
    flex: 0 1 var(--left-width);
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.dual-input .input-box {
    flex: 1;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

/* =========================
   Errores (dual-errors)
   ========================= */
.dual-errors {
    --left-width: clamp(140px, 32%, 240px);

    display: grid;
    grid-template-columns: var(--left-width) 1fr;
    row-gap: 2px;

    width: 100%;
    margin-top: 4px;
}

.dual-errors .error-col:first-child {
    grid-column: 1;
}

.dual-errors .error-col:last-child {
    grid-column: 2;
}

.dual-errors .error-text {
    margin: 0;
    line-height: 1.3;
}

/* =========================
   Responsive
   ========================= */
@media (max-width: 1024px) {
    .auth-form {
        grid-template-columns: 1fr !important;
        padding: 0 16px;
    }

    .auth-form-header {
        width: 100%;
    }

    .form-group {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .auth-form-header h2 {
        font-size: 14px;
    }

    .form-group label {
        font-size: 11px;
    }

    .text-area,
    .input-box {
        font-size: 13px;
    }
}

.data-icons {
    display: flex;
    justify-content: start;
    gap: 5px;
    margin-bottom: 1px;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

@media (max-width: 1140px) {
    .form-row {
        grid-template-columns: repeat(2, 1fr);
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .custom-list> :not(li) {
        padding-left: 0px;
        /* 18 icon + 10 gap */
    }
}

@media (max-width: 630px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}

.separadores {
    margin: 0;
    margin-top: 10px;
    background-color: #E3DFFF;
    width: 100%;
}


.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 18px;
}

.info-card {
    background: #FBF9FF;
    border-radius: 10px;
    padding: 14px 18px;
    min-height: 62px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.info-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--label);
    margin-bottom: 6px;
}

.info-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
}

/* Responsive */
@media (max-width: 900px) {
    .info-grid {
        grid-template-columns: repeat(2, minmax(220px, 1fr));
    }
}

@media (max-width: 560px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
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

.section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    /* clave: permite que baje */
    width: 100%;
}

.section-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    /* clave: permite wrap de botones */
    justify-content: flex-end;
}

.btn-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 10px;
    min-height: 40px;
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
}

/* fuerza el icono a tamaño controlado (aunque el svg traiga width/height inline) */
.btn-action svg {
    width: 18px !important;
    height: 18px !important;
    flex: 0 0 18px;
    fill: currentColor !important;
    /* evita fill="#000" */
}

/* Tablet / pantallas medianas */
@media (max-width: 760px) {
    .section-actions {
        width: 100%;
        justify-content: flex-start;
        /* mejor en móvil */
    }

    .btn-action {
        flex: 1 1 220px;
        /* 2 por fila si cabe */
    }
}

/* Móvil pequeño */
@media (max-width: 420px) {
    .btn-action {
        flex: 1 1 100%;
        width: 100%;
        justify-content: center;
        padding: 10px 12px;
        font-size: 13px;
    }

    .btn-action svg {
        width: 16px !important;
        height: 16px !important;
    }
}

/* Quitar el punto por defecto SOLO en este li */
.li-with-title-dot::before {
    content: none !important;
    display: none !important;
}

/* Poner el punto al lado del texto */
.title-dot {
    position: relative;
    padding-left: 28px;
    /* espacio para el punto */
}

.title-dot::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><circle cx='5' cy='5' r='2' fill='%235b4cd0'/></svg>");
    background-repeat: no-repeat;
    background-size: contain;
}

.tabla-style td .descripcion-texto {
    line-height: 1.3;
    max-height: calc(1.3em * 4);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 6px;
}

/* (Opcional) scroll más fino */
.tabla-style td .descripcion-texto::-webkit-scrollbar {
    width: 6px;
}

.tabla-style td .descripcion-texto::-webkit-scrollbar-thumb {
    background: rgba(91, 76, 208, .45);
    border-radius: 8px;
}

.tabla-style td .descripcion-texto::-webkit-scrollbar-track {
    background: rgba(91, 76, 208, .10);
    border-radius: 8px;
}
</style>