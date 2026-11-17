<script setup>
import { ref, watchEffect, computed } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'

const props = defineProps({
    employees: Array,
    modelTermination: Object,
    terminationTypes: Array,
    reasons: Array,
    paginate: Object,
    errors: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['index', 'submitTerminationNoRenewMassive']);

const allSelected = ref(false);
const selectedItems = ref([]);

const selectedTerminationType = computed(() => {
    return props.terminationTypes.find(
        at => at.id === props.modelTermination.termination_type_id
    ) || null;
});

const isEmptyHtml = (html) => {
    const text = String(html || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .trim()

    return text.length === 0
}

const massiveAllowed = computed(() => {
    return selectedTerminationType.value?.settings?.massive_allowed == true;
});

const hasTemplate = computed(() => {
    const settings = selectedTerminationType.value?.settings?.message;

    return !!settings && Object.keys(settings).length > 0 && !isEmptyHtml(settings);
});

const toggleSelectAll = () => {
    if (allSelected.value) {
        selectedItems.value = [];
    } else {
        selectedItems.value = [...props.employees]
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

const goTo = p => props.paginate.current_page = p
const prev = () => goTo(props.paginate.current_page - 1)
const next = () => goTo(props.paginate.current_page + 1)

const pageItems = computed(() => {
    const total = props.paginate.total_pages
    const current = props.paginate.current_page
    const delta = 2
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    const pages = []
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)
    pages.push(1)
    if (left > 2) pages.push('…')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < total - 1) pages.push('…')
    pages.push(total)
    return pages
})

const allEmployees = computed(() => props.employees ?? [])
const norm = v => (v ?? '').toString().toLowerCase()
const searchTokens = computed(() =>
    norm(props.paginate.search).split(/\s+/).filter(Boolean)
)

const filtered = computed(() => {
    const tokens = searchTokens.value
    if (!tokens.length) return allEmployees.value
    return allEmployees.value.filter(e => {
        const hay = norm(JSON.stringify(e))
        return tokens.some(t => hay.includes(t)) // OR
    })
})

watchEffect(() => {
    const per = Number(props.paginate.per_page) || 5
    props.paginate.total = filtered.value.length
    props.paginate.total_pages = Math.max(1, Math.ceil(props.paginate.total / per))
    if (props.paginate.current_page > props.paginate.total_pages) props.paginate.current_page = props.paginate.total_pages
    if (props.paginate.current_page < 1) props.paginate.current_page = 1
})

const paginatedEmployees = computed(() => {
    const per = Number(props.paginate.per_page) || 5
    const start = (props.paginate.current_page - 1) * per
    return filtered.value.slice(start, start + per)
})

function submitTerminations() {
    if (!props.modelTermination.termination_type_id || (!hasTemplate.value || !massiveAllowed.value)) return
    emit('submitTerminationNoRenewMassive', selectedItems.value)
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
        <span>Terminación de contrato</span>
        <span>|</span>
        <span class="active">Terminar contrato</span>
    </div>
    <div class="container-data">
        <div class="split">
            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Terminar contrato</h2>            

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
                        <div class="select-data" v-if="props.employees.length != 0">
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

                        <div class="tabla-toolbar"
                            style="display:flex;gap:16px;align-items:center;justify-content:space-between">
                            <label class="page-size" style="display:flex;align-items:center;gap:8px">
                                Elementos por página:
                                <select class="select-underline" v-model.number="props.paginate.per_page">
                                    <option v-for="n in props.paginate.sizes" :key="n" :value="n">{{ n }}</option>
                                </select>
                            </label>
                            <div class="search-underline"
                                style="min-width:260px;display:flex;align-items:center;gap:8px">
                                <input type="text" v-model="props.paginate.search" placeholder="Buscar" />
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
                                            <th style="width: 5%;">Seleccionar</th>
                                            <th style="width: 12%;">Empleado</th>
                                            <th style="width: 10%;">Tipo de documento</th>
                                            <th style="width: 10%;">Documento</th>
                                            <th style="width: 10%;">Ciudad</th>
                                            <th style="width: 10%;">Sede</th>
                                            <th style="width: 10%;">Área</th>
                                            <th style="width: 10%;">Perfil de cargo</th>
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
                                        <tr v-for="employee in paginatedEmployees" :key="employee.id">
                                            <td style="text-align: center;">
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
                                            <td>{{ employee.person.document_type.settings?.abreviature }}</td>
                                            <td>{{ employee.person.document_number }}</td>
                                            <td>{{ employee.headquarter?.city?.name || 'Sin ciudad' }}</td>
                                            <td>{{ employee.headquarter?.name || 'Sin sede' }}</td>
                                            <td>{{ employee.position?.area?.name || 'Sin área' }}</td>
                                            <td>{{ employee.position?.name || 'Sin cargo' }}</td>
                                        </tr>
                                        <tr v-if="paginatedEmployees.length === 0">
                                            <td colspan="8" class="no-results">Sin resultados</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="table-footer"
                                style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px">
                                <div class="page-info">
                                    Página {{ props.paginate.current_page }} de {{ props.paginate.total_pages }}
                                </div>
                                <div class="pagination" style="display:flex;gap:6px;align-items:center">
                                    <button class="page-btn" aria-label="Primera" @click="goTo(1)"
                                        :disabled="props.paginate.current_page === 1">
                                        &laquo;
                                    </button>
                                    <button class="page-btn" aria-label="Anterior" @click="prev()"
                                        :disabled="props.paginate.current_page === 1">
                                        &lsaquo;
                                    </button>
                                    <template v-for="(p, i) in pageItems" :key="i">
                                        <button v-if="p !== '…'" class="page-btn"
                                            :class="{ active: p === props.paginate.current_page }" @click="goTo(p)">
                                            {{ p }}
                                        </button>
                                        <span v-else class="dots">…</span>
                                    </template>
                                    <button class="page-btn" aria-label="Siguiente" @click="next()"
                                        :disabled="props.paginate.current_page === props.paginate.total_pages">
                                        &rsaquo;
                                    </button>
                                    <button class="page-btn" aria-label="Última"
                                        @click="goTo(props.paginate.total_pages)"
                                        :disabled="props.paginate.current_page === props.paginate.total_pages">
                                        &raquo;
                                    </button>
                                </div>
                            </div>
                        </div>
                        <template v-if="selectedItems.length > 0">
                            <div style="margin-top: 20px;" class="card">
                                <div class="grid-2">
                                    <div>
                                        <label class="label-bold">Tipo de terminación de contrato</label>
                                        <SearchSelect v-model="props.modelTermination.termination_type_id"
                                            :options="props.terminationTypes" optionKey="name" valueKey="id"
                                            placeholder="Tipo de terminación de contrato"
                                            :error="props.errors.termination_model_id || (props.modelTermination.termination_type_id && (!hasTemplate || !massiveAllowed))" />
                                        <p v-if="props.errors.termination_model_id" class="error-text">
                                            {{ props.errors.termination_model_id[0] }}
                                        </p>
                                        <p v-if="props.modelTermination.termination_type_id && !hasTemplate"
                                            class="error-text">
                                            El tipo de terminación de contrato seleccionado no tiene plantilla.
                                        </p>
                                        <p v-if="props.modelTermination.termination_type_id && !massiveAllowed"
                                            class="error-text">
                                            El tipo de terminación de contrato seleccionado no permite la terminación
                                            masiva.
                                        </p>
                                    </div>
                                    <div
                                        v-if="props.terminationTypes.find(at => at.id === props.modelTermination.termination_type_id)?.settings?.reason_required && props.modelTermination.termination_type_id">
                                        <label class="label-bold">Motivo</label>
                                        <SearchSelect v-model="props.modelTermination.reason_id"
                                            :options="props.reasons" optionKey="name" valueKey="id" placeholder="Motivo"
                                            :error="props.errors.termination_model_type" />
                                        <p v-if="props.errors.termination_model_type?.length" class="error-text">
                                            {{ props.errors.termination_model_type[0] }}
                                        </p>
                                    </div>
                                    <div>
                                        <label class="label-bold">Decisión</label>
                                        <SearchSelect v-model="props.modelTermination.decision"
                                            :options="[{ name: 'Terminar' }, { name: 'No renovar' }]" optionKey="name"
                                            valueKey="name" placeholder="Decisión" :error="props.errors.termination_decision" />
                                        <p v-if="props.errors.termination_decision" class="error-text">
                                            {{ props.errors.termination_decision[0] }}
                                        </p>
                                    </div>

                                    <div
                                        v-if="props.modelTermination.termination_type_id && props.modelTermination.decision === 'Terminar'">
                                        <label class="label-bold">Fecha de finalización</label>
                                        <DateInput v-model="props.modelTermination.date" :error="props.errors.termination_date" />
                                        <p v-if="props.errors.termination_date" class="error-text">
                                            {{ props.errors.termination_date[0] }}
                                        </p>
                                    </div>

                                    <div v-if="props.modelTermination.termination_type_id">
                                        <label class="label-bold">Archivo <template
                                                v-if="!props.terminationTypes.find(at => at.id === props.modelTermination.termination_type_id)?.settings.file_required">(opcional)</template></label>
                                        <FileUpload id="file" v-model="props.modelTermination.file.file"
                                            :multiple="false" accept="application/pdf" :error="props.errors.termination_file" />
                                        <p v-if="props.errors.termination_file" class="error-text">
                                            {{ props.errors.termination_file[0] }}
                                        </p>
                                    </div>
                                </div>
                                <div style="margin-top: 10px;">
                                    <label class="label-bold">Justificación</label>
                                    <AdvancedEditor v-model="props.modelTermination.reason" />
                                    <p v-if="props.errors.termination_reason" class="error-text">
                                        {{ props.errors.termination_reason[0] }}
                                    </p>
                                </div>
                            </div>
                        </template>
                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                            <button v-if="selectedItems.length > 0" class="btn-primary" @click="submitTerminations"
                                :disabled="!props.modelTermination.termination_type_id || (!hasTemplate || !massiveAllowed)">Enviar</button>
                        </div>
                    </template>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
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
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;
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

.full-width {
    grid-column: 1 / -1;
}

.card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, .03);
    border: 1px solid #f1f1f1;
    padding: 20px 22px;
    margin-bottom: 16px;
}
</style>