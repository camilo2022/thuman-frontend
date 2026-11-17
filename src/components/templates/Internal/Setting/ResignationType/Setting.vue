<script setup>
import { ref, computed, watchEffect, watch } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'

const props = defineProps({
    modelResignationType: Object,
    paginate: Object,
    countries: Array,
    modelResignationTypeSettingValidation: Object,
    isEditingResignationTypeSettingValidation: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    },
    loadingIndex: Boolean
})

const emit = defineEmits(['index', 'submitSettingStore', 'submitResignationTypeSetting'])

const activeTab = ref(0)
const editorRef = ref(null)

const handleVariableClick = (field) => {
    if (!editorRef.value) return
    editorRef.value.insertVariable(
        `<span class="var-chip" data-key="${field.key}">[${field.label}]</span>`
    )
}

const searchInput = ref(props.paginate.search || '')
let searchTimeout = null

watch(searchInput, (value) => {
    clearTimeout(searchTimeout)

    searchTimeout = setTimeout(() => {
        props.paginate.search = value
    }, 400)
})

const goTo = (p) => {
    const total = props.paginate.total_pages || 1
    props.paginate.current_page = Math.max(1, Math.min(p, total))
}

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

const allValidations = computed(() => props.modelResignationType?.settings?.validations ?? [])
const norm = v => (v ?? '').toString().toLowerCase()
const searchTokens = computed(() =>
    norm(props.paginate.search).split(/\s+/).filter(Boolean)
)

const filtered = computed(() => {
    const tokens = searchTokens.value
    if (!tokens.length) return allValidations.value
    return allValidations.value.filter(v => {
        const hay = norm(`${v.country?.name} ${v.regex} ${v.message}`)
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

const paginatedValidations = computed(() => {
    const per = Number(props.paginate.per_page) || 5
    const start = (props.paginate.current_page - 1) * per
    return filtered.value.slice(start, start + per)
})
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
        <span>Configuración</span>
        <span>|</span>
        <span>Tipo de renuncia</span>
        <span>|</span>
        <span class="active">Configuración tipo de renuncia</span>
    </div>
    <div class="container-data">
        <div class="split with-panel">

            <!-- IZQUIERDA: FORMULARIO -->
            <div class="split-main">
                <div class="form-container">
                    <h2 class="titulo">Configuración de tipo de renuncia</h2>
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
                        <div class="form-container" style="margin-top: -10px !important;">
                            <div class="form-section">
                                <div class="section-title">Tipo de renuncia</div>
                                <div class="empresa-row" style="margin-top: 8px !important;">
                                    <div class="input-group">
                                        <label class="label-bold">Nombre</label>
                                        <input type="text" v-model="props.modelResignationType.name" disabled
                                            class="input-box disabled" placeholder="Nombre">
                                    </div>
                                </div>
                                <div class="grid-2">
                                    <div style="margin-top: 10px;">
                                        <label class="label-bold" style="display:flex; gap:8px;">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="checkbox-input"
                                                    v-model="props.modelResignationType.settings.file_required" />
                                                <div class="checkbox-box">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="check-icon"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        stroke-width="3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span class="checkbox-text" style="font-weight: 500;">Marcar archivo
                                                    como obligatorio</span>
                                            </label>
                                        </label>
                                    </div>
                                </div>
                                <div class="card">
                                    <h2 class="sub-titulo-sm">Configuración del mensaje</h2>
                                    <AdvancedEditor ref="editorRef"
                                        v-model="props.modelResignationType.settings.message" />
                                    <p v-if="props.errors?.resignationTypeSetting_message" class="error-text">
                                        {{ props.errors.resignationTypeSetting_message[0] }}
                                    </p>
                                </div>

                                <div class="card">
                                    <div class="section-title">Configuración</div>
                                    <div class="legal-fiscal-row">
                                        <div class="input-group">
                                            <label class="label-bold">País</label>
                                            <SearchSelect
                                                v-model="props.modelResignationTypeSettingValidation.country_id"
                                                :options="props.countries" optionKey="name" valueKey="id"
                                                name="country_id" :displayFormatter="opt => `${opt.emoji} ${opt.name}`"
                                                id="country_id" placeholder="País"
                                                :error="!!props.errors?.resignationTypeSetting_country_id" />
                                            <p v-for="(msg, i) in props.errors?.resignationTypeSetting_country_id ?? []"
                                                :key="'type-' + i" class="error-text">
                                                {{ msg }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="actions actions-inside-card"
                                        style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px">
                                        <button v-if="props.isEditingResignationTypeSettingValidation"
                                            class="btn-secondary" @click="emit('clean')">
                                            Nuevo
                                        </button>

                                        <button class="btn-primary"
                                            @click="emit('submitResignationTypeSettingValidationStore')"
                                            v-if="!props.isEditingResignationTypeSettingValidation">
                                            Crear
                                        </button>
                                        <button class="btn-primary"
                                            @click="emit('submitResignationTypeSettingValidationUpdate')" v-else>
                                            Editar
                                        </button>
                                    </div>
                                </div>

                                <div class="tabla-toolbar"
                                    style="display:flex;gap:16px;align-items:center;justify-content:space-between">
                                    <label class="page-size" style="display:flex;align-items:center;gap:8px">
                                        Elementos por página:
                                        <select class="select-underline" v-model.number="props.paginate.per_page">
                                            <option v-for="n in props.paginate.sizes" :key="n" :value="n">{{ n }}
                                            </option>
                                        </select>
                                    </label>

                                    <div class="search-underline"
                                        style="min-width:260px;display:flex;align-items:center;gap:8px">
                                        <input type="text" v-model="searchInput" placeholder="Buscar" maxlength="100" />
                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                                                stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>

                                <div class="tabla-style">
                                    <table class="data-table" style="width:100%;border-collapse:collapse">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>País</th>
                                                <th>Estado</th>
                                                <th class="col-actions">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="props.loadingIndex">
                                            <tr v-for="n in 5" :key="n" aria-busy="true" :inert="true">
                                                <td>
                                                    <div class="skeleton skel-col"></div>
                                                </td>
                                                <td>
                                                    <div class="skeleton skel-col"></div>
                                                </td>
                                                <td>
                                                    <div class="skeleton skel-pill-sm"></div>
                                                </td>
                                                <td style="display: flex; gap: 10px;">
                                                    <div class="skeleton"
                                                        style="width:30px;height:30px;border-radius:6px;">
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody v-else>
                                            <tr v-for="validation in paginatedValidations" :key="validation.id">
                                                <td>{{ validation.id }}</td>
                                                <td>{{ validation.country?.emoji + ' ' + validation.country?.name }}
                                                </td>
                                                <td :class="{
                                                    'txt-green': !validation.deleted_at,
                                                    'txt-red': validation.deleted_at
                                                }">
                                                    {{ !validation.deleted_at ? 'Activo' : 'Inactivo' }}
                                                </td>
                                                <td class="acciones" style="display:flex;gap:8px">
                                                    <span class="actions">
                                                        <template v-if="!validation.deleted_at">
                                                            <Button title="Editar" icon="pencil" variant="question"
                                                                @click="emit('submitResignationTypeSettingValidationFind', validation.id)" />

                                                            <Button title="Inactivar" icon="ban" variant="danger"
                                                                @click="emit('submitResignationTypeSettingValidationDelete', validation.id)" />
                                                        </template>
                                                        <template v-else>
                                                            <Button title="Activar" icon="check" variant="success"
                                                                @click="emit('submitResignationTypeSettingValidationRestore', validation.id)" />
                                                        </template>
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr v-if="paginate.total == 0">
                                                <td colspan="10" class="no-results-cell">
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

                                <!-- Footer: paginación -->
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

                                <div class="form-buttons">
                                    <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                                    <button class="btn-primary"
                                        @click="emit('submitResignationTypeSetting')">Guardar</button>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- DERECHA: PANEL DE PREVISUALIZACIÓN -->
            <div class="split-panel">
                <template v-if="false">
                    <div>
                        <!-- Tabs -->
                        <div class="variables-tabs">
                            <div class="skeleton-block skeleton-tab"></div>
                            <div class="skeleton-block skeleton-tab"></div>
                            <div class="skeleton-block skeleton-tab"></div>
                        </div>

                        <!-- Grupo 1 -->
                        <div class="skeleton-group">
                            <div class="skeleton-group-title">
                                <div class="skeleton-block skeleton-dot"></div>
                                <div class="skeleton-block skeleton-title"></div>
                            </div>

                            <div class="skeleton-chips">
                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>
                            </div>
                        </div>

                        <!-- Grupo 2 -->
                        <div class="skeleton-group">
                            <div class="skeleton-group-title">
                                <div class="skeleton-block skeleton-dot"></div>
                                <div class="skeleton-block skeleton-title"></div>
                            </div>

                            <div class="skeleton-chips">
                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>

                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>
                            </div>
                        </div>

                        <!-- Grupo 3 -->
                        <div class="skeleton-group">
                            <div class="skeleton-group-title">
                                <div class="skeleton-block skeleton-dot"></div>
                                <div class="skeleton-block skeleton-title"></div>
                            </div>

                            <div class="skeleton-chips">
                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>

                                <div class="skeleton-block skeleton-chip"></div>
                                <div class="skeleton-block skeleton-chip"></div>
                            </div>
                        </div>

                    </div>

                </template>
                <template v-else>
                    <h2 class="sub-titulo">Variables</h2>
                    <template v-if="(props.modelResignationType.relationships?.item?.settings?.variables || []).length">
                        <!-- Tabs dinámicos -->
                        <div class="nav-tabs"
                            :style="{ '--active': activeTab, '--count': (props.modelResignationType.relationships?.item?.settings?.variables || []).length }"
                            role="tablist">
                            <button
                                v-for="(tab, i) in (props.modelResignationType.relationships?.item?.settings?.variables || [])"
                                :key="i" class="tab" :class="{ active: activeTab === i }" @click="activeTab = i"
                                role="tab" :aria-selected="activeTab === i">
                                {{ tab.label }}
                            </button>

                            <span class="underline"></span>
                        </div>

                        <div class="info-panel">

                            <!-- CONTENIDO DEL TAB ACTUAL -->
                            <template
                                v-if="(props.modelResignationType.relationships?.item?.settings?.variables || []).length">

                                <div class="info-group"
                                    v-for="(group, gi) in (props.modelResignationType.relationships?.item?.settings?.variables || [])[activeTab].groups"
                                    :key="gi">
                                    <div class="info-header">
                                        <span class="info-dot"></span>
                                        <span class="info-title">{{ group.title }}</span>
                                    </div>

                                    <div class="info-tags">
                                        <button v-for="(field, fi) in group.fields" :key="fi" class="info-chip"
                                            @click="handleVariableClick(field)">
                                            {{ field.label }}
                                        </button>
                                    </div>
                                </div>

                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <div class="alert-yellow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                                viewBox="0 0 256 256">
                                <path
                                    d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                            </svg>
                            <p class="variables-empty-title">
                                No hay variables disponibles. La tipificación de renuncias no tiene variables
                                configuradas.
                            </p>
                        </div>
                        <div class="variables-empty">

                        </div>
                    </template>
                </template>
            </div>

        </div>
    </div>
</template>

<style scoped>
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

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 350px;
    /* contenido + ancho del panel */
}

.split-main {
    min-width: 0;
}

.split-panel {
    min-width: 0;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
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
    gap: 10px;
    margin-bottom: 10px;
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}

.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
}

.section-subtitle {
    font: 500 13px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}

/* Layouts */
.empresa-row {
    margin-top: 15px;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
}

.empresa-row .input-group {
    flex: 1;
}

.legal-fiscal-row {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
}

.rep-legal-grid {
    margin-top: 15px !important;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(1, 1fr);
}

.actions {
    display: flex;
    justify-content: flex-end;
}

.actions-inside-card {
    justify-content: flex-end;
    margin-top: 18px;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
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

.sub-titulo {
    padding: 10px;
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 22px;
    font-weight: bold;
}

.sub-titulo-sm {
    font-size: 15px;
    font-weight: 600 !important;
    color: #5b4cd0;
    margin-bottom: 10px;
}

.nav-tabs {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--count), 1fr);
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
    width: calc(100% / var(--count));
    height: 2px;
    background: #5b4cd0;
    transform: translateX(calc(var(--active) * 100%));
    transition: transform 0.2s ease;
    pointer-events: none;
}

.alert-yellow {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 15px;
    display: flex;
    gap: 10px;
    align-content: center;
    align-items: center;
    font-weight: 500;
}

/* Info panel */

.info-panel {
    background: #ffffff;
    padding: 16px 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #3c2f91;
}

/* Cada bloque (Empresa, Entidad, etc.) */
.info-group {
    margin-bottom: 18px;
}

.info-group:last-child {
    margin-bottom: 0;
}

/* Título con punto morado */
.info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.info-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #5b4cd0;
    box-shadow: 0 0 0 4px rgba(91, 76, 208, 0.15);
}

.info-title {
    font-size: 14px;
    font-weight: 700;
}

/* Contenedor de los "chips" */
.info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-left: 18px;
    /* sangría respecto al punto/título */
}

/* Chip / pill */
.info-chip {
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
    border: 1px solid #5b4cd0;
    background: #f4eeff;
    color: #5b4cd0;
    cursor: pointer;
    line-height: 1.2;
    white-space: nowrap;
}

.info-chip:hover {
    background: #f5f2ff;
}
</style>