<script setup>
import { ref, watch, nextTick } from 'vue'
import AdvancedEditor from '@/components/UI/templates/AdvancedEditor.vue'

const props = defineProps({
    modelNotificationType: Object,
    notificationChannels: Array
})

const emit = defineEmits(['index', 'submitNotificationTypeSetting'])

const activeTab = ref(0)
const activeChannelId = ref(null)

const channelSelecteds = ref([])
const editorRefs = {}
const editorIds = ref({})
const colapsosCanales = ref({})

if (!props.modelNotificationType.settings) {
    props.modelNotificationType.settings = {}
}

if (!Array.isArray(props.modelNotificationType.settings.channels)) {
    props.modelNotificationType.settings.channels = []
}

const getChannelById = (id) =>
    props.notificationChannels.find(c => c.id === id)

watch(channelSelecteds, async (ids) => {
    const channels = props.modelNotificationType.settings.channels

    ids.forEach(id => {
        if (!channels.some(c => c.notification_channel_id === id)) {
            channels.push({
                notification_channel_id: id,
                title: '',
                message: ''
            })
        }
    })

    props.modelNotificationType.settings.channels =
        channels.filter(c => ids.includes(c.notification_channel_id))

    props.modelNotificationType.settings.channels.forEach(c => {
        const id = c.notification_channel_id

        if (!editorIds.value[id]) {
            editorIds.value[id] = `editor_${id}`
        }

        if (colapsosCanales.value[id] === undefined) {
            colapsosCanales.value[id] = false
        }
    })

    await nextTick()

    // cargar contenido en editor
    props.modelNotificationType.settings.channels.forEach(c => {
        editorRefs[editorIds.value[c.notification_channel_id]]
            ?.setContent(c.message || '')
    })

}, { immediate: true })


const handleVariableClick = (field) => {
    if (!activeChannelId.value) return

    const editorId = editorIds.value[activeChannelId.value]
    const editor = editorRefs[editorId]

    if (!editor) return

    editor.insertVariable(
        `<span class="var-chip" data-key="${field.key}">[${field.label}]</span>`
    )
}

const toggleColapso = (id) => {
    colapsosCanales.value[id] = !colapsosCanales.value[id]

    if (colapsosCanales.value[id]) {
        activeChannelId.value = id
    }
}

const initialized = ref(false)

watch(() => props.modelNotificationType.settings, (settings) => {
    if (initialized.value) return
    channelSelecteds.value = (settings?.channels || []).map(c => c.notification_channel_id).filter(Boolean)
    initialized.value = false;
}, { immediate: true })

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
        <span>Tipo de notificación</span>
        <span>|</span>
        <span class="active">Configuración de tipo de notificación</span>
    </div>

    <div class="container-data">
        <div class="split with-panel">
            <div class="split-main">
                <div class="main-container">

                    <!-- TÍTULO -->
                    <div style="display: flex; justify-content: start;">
                        <h2 class="titulo">Configuración de tipo de notificación</h2>

                    </div>
                    <template v-if="false">
                        <div class="otrosi-skeleton">

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

                                    <div class="sk-divider"></div>

                                    <!-- GRID 4 columnas -->
                                    <div class="sk-grid">
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>

                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>
                                        <div class="sk-input"></div>

                                        <div class="sk-input sk-full"></div>
                                    </div>
                                </div>

                                <!-- ====== CARD 2 ====== -->
                                <div class="sk-card">

                                    <div class="sk-section-header">
                                        <div class="sk-line sk-subtitle"></div>
                                        <div class="sk-circle"></div>
                                    </div>

                                    <div class="sk-divider"></div>

                                    <div class="sk-grid">
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
                        <div class="top-grid">
                            <div>
                                <label class="label-bold">Tipo de notifiación</label>
                                <input type="text" v-model="props.modelNotificationType.name" class="input-box disabled"
                                    disabled placeholder="Tipo de notificación" />
                            </div>
                            <div>
                                <label class="label-bold">Canal de notifiación</label>
                                <SelectCheckMultiple :options="props.notificationChannels" v-model="channelSelecteds"
                                    optionKey="name" valueKey="id" placeholder="Selecciona uno o varios canales" />

                            </div>
                        </div>

                        <div v-for="channel in props.modelNotificationType.settings.channels"
                            :key="channel.notification_channel_id" class="card-colapsable">

                            <!-- HEADER -->
                            <div class="section-header">
                                <span class="section-title">
                                    {{props.notificationChannels.find(c => c.id ===
                                        channel.notification_channel_id)?.name}}
                                </span>

                                <div class="section-right">
                                    <button class="section-toggle"
                                        @click="toggleColapso(channel.notification_channel_id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#5b4cd0"
                                            viewBox="0 0 256 256"
                                            :style="{ transform: colapsosCanales[channel.notification_channel_id] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .18s' }">
                                            <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2" />
                                            <path
                                                d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm29.66-93.66a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32L140.69,128,106.34,93.66a8,8,0,0,1,11.32-11.32Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- BODY -->
                            <transition @enter="accEnter" @after-enter="accAfterEnter" @leave="accLeave">
                                <div v-if="colapsosCanales[channel.notification_channel_id]" class="section-body-anim"
                                    style="padding: 0 10px 10px 10px;">

                                    <!-- TITLE -->
                                    <label class="label-bold">Título</label>
                                    <input v-model="channel.title" type="text" class="input-box"
                                        placeholder="Título del mensaje" />

                                    <!-- MESSAGE -->
                                    <label class="label-bold">Mensaje</label>
                                    <AdvancedEditor v-model="channel.message"
                                        :id="editorIds[channel.notification_channel_id]"
                                        :ref="el => el && (editorRefs[editorIds[channel.notification_channel_id]] = el)"
                                        @focus="activeChannelId = channel.notification_channel_id" />
                                </div>
                            </transition>

                        </div>

                        <div class="form-buttons">
                            <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                            <button class="btn-primary" @click="emit('submitNotificationTypeSetting')">Guardar</button>
                        </div>
                    </template>

                </div>
            </div>
            <div class="slide-panel">
                <div class="split-panel">
                    <h2 class="sub-titulo">Variables</h2>
                    <template v-if="(props.modelNotificationType.settings?.variables || []).length">
                        <!-- Tabs dinámicos -->
                        <div class="nav-tabs"
                            :style="{ '--active': activeTab, '--count': (props.modelNotificationType.settings?.variables || []).length }"
                            role="tablist">
                            <button v-for="(tab, i) in (props.modelNotificationType.settings?.variables || [])" :key="i"
                                class="tab" :class="{ active: activeTab === i }" @click="activeTab = i" role="tab"
                                :aria-selected="activeTab === i">
                                {{ tab.label }}
                            </button>

                            <span class="underline"></span>
                        </div>

                        <div class="info-panel">

                            <!-- CONTENIDO DEL TAB ACTUAL -->
                            <template v-if="(props.modelNotificationType.settings?.variables || []).length">

                                <div class="info-group"
                                    v-for="(group, gi) in (props.modelNotificationType.settings?.variables || [])[activeTab].groups"
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
                                No hay variables disponibles. El tipo de notificación no tiene variables configuradas.
                            </p>
                        </div>
                        <div class="variables-empty">

                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.toolbar {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 0.25rem 1rem 0.5rem;
    background: #fbf9ff;
    border-radius: 10px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
}

.toolbar-section {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.advanced-editor,
.advanced-editor * {
    margin-top: 0 !important;
}

.section-title {
    font-weight: 600;
    color: #444;
}

.toolbar-margins .margins-grid {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 0.4rem 1rem;
}

.field {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.field label {
    min-width: 65px;
}

.field-input {
    max-width: 70px;
    background: #fff;
    text-align: center;
    padding: 0.15rem 0.4rem;
    text-align: center;
}

.icon-group {
    display: flex;
    gap: 0.5rem;
}

.icon-button {
    min-width: 32px;
    min-height: 32px;
    padding: 0.3rem 0.5rem;
    border-radius: 10px;
    border: 1px solid transparent;
    background: #fbf9ff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background .2s ease;
}

.icon-button:hover {
    background: #e4dbff;
    border-color: #b39dff;
    box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
}

.icon-button.is-active {
    background: #e4dbff;
    border-color: #b39dff;
}

.icon-dropdown {
    margin-left: 0.25rem;
    font-size: 10px;
}

.toolbar-divider {
    width: 0.5px;
    align-self: stretch;
    background: #e8e2fd;
}

.toolbar-flex-spacer {
    flex: 1;
}

.icon-btn {
    border: none;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s ease;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
}

/* === TOOLTIP REUTILIZABLE === */
.tooltip {
    position: relative;
}

/* El globito del tooltip */
.tooltip::after {
    content: attr(data-tooltip);
    /* texto desde data-tooltip */
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #3e32bf;
    color: #fff;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.25;
    padding: 6px 10px;
    border-radius: 10px;
    white-space: nowrap;
    /* una sola línea */
    opacity: 0;
    pointer-events: none;
    transition: opacity .15s ease, transform .15s ease;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
}

/* Mostrar tooltip al pasar el mouse */
.tooltip:hover::after {
    opacity: 1;
    transform: translate(-50%, -6px);
    /* sube un poquito al aparecer */
}

.icon-file {
    color: #5b4cd0 !important;
}

/* sección de Tamaño para que el dropdown se posicione respecto a ella */
.size-section {
    position: relative;
}

/* contenedor del menú desplegable */
.size-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
    padding: 6px 0;
    z-index: 10000;
    min-width: 190px;
}

/* cada opción */
.size-option {
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.size-option.active {
    background-color: #f5f2ff;
}

.size-option:hover {
    background: #f5f2ff;
}

.size-option-icon {
    flex-shrink: 0;
}

.size-option-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.size-option-title {
    font-size: 13px;
    font-weight: 600;
    color: #2b2c34;
}

.size-option-sub {
    font-size: 11px;
    color: #999;
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

.sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Caja grande con borde punteado */
.sections-empty {
    border-radius: 10px;
    border: 2px dashed #d4d0f3;
    background: transparent;
    padding: 32px 16px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

/* Botón redondo con + */
.sections-plus {
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: #EBDEFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

/* Textos */
.sections-title {
    font-weight: 600;
    font-size: 14px;
    color: #222;
    margin: 0 0 4px;
}

.sections-subtitle {
    font-size: 12px;
    color: #a0a0b5;
    margin: 0;
}

/* Pie con botón a la derecha */
.sections-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
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
    height: auto !important;
    width: auto !important;
    align-self: flex-start;
}

.sections-add-btn:hover {
    filter: brightness(0.95);
}

.sections-cancel-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 5px;
    border: 1px solid #5b4cd0;
    background: #ffffff;
    color: #5b4cd0;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}

.sections-cancel-btn:hover {
    filter: brightness(0.95);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
}

.section-body-placeholder {
    font-size: 12px;
    color: #777;
    margin: 0;
}

.sections-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-item {
    border-radius: 8px;
    background: #f7f4ff;
}

/* CABECERA TIPO "CONTRATO" */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
}

.section-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.section-title {
    font-size: 13px;
    font-weight: 700;
    color: #5b4cd0;
}

.section-eye {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px;
}

.section-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-pill {
    font-size: 11px;
    border-radius: 5px;
    border: 1px solid #5b4cd0;
    padding: 2px 10px;
    color: #5b4cd0;
    background: #fdfbff;
}

.section-more {
    border-radius: 999px;
    border: none;
    background: transparent;
    color: #5b4cd0;
    font-size: 16px;
    cursor: pointer;
    padding: 0 6px;
}

.section-toggle {
    border-radius: 999px;
    border: transparent;
    background: transparent;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* el que se anima (SIN padding) */
.section-body-anim {
    /* overflow: hidden; */
    /* por si acaso */
}

/* el que lleva el padding real */
.section-body {
    padding: 10px;
}

.section-dropdown {
    position: absolute;
    top: 28px;
    right: 10px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, .08);
    padding: 6px 0;
    z-index: 10000;
    min-width: 130px;
}

.dropdown-item {
    width: 100%;
    padding: 8px 12px;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 13px;
    cursor: pointer;
    color: #4c3acb;
}

.dropdown-item:hover {
    background: #f5f2ff;
}

.dropdown-item.delete {
    color: #d9534f;
}

.dropdown-item.delete:hover {
    background: #ffeaea;
}

.section-header {
    position: relative;
}

/* subsecciones */
.subsections-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 10px 10px;
}

.subsection-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.subsection-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 12px 12px 0 0;
    padding: 8px 12px;
    cursor: pointer;
}

.subsection-title {
    font-size: 13px;
    font-weight: 700;
    color: #5b4cd0;
}

.subsection-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* tarjeta grande del detalle */
.subsection-card {
    background: #ffffff;
    border-radius: 0 0 12px 12px;
    margin-top: 0;
    /* quita separación */
    padding-top: 0;
    padding: 10px 12px 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .03);
}

.not-padding {
    padding: 0 10px !important;
}

.subsection-card-header {
    margin-bottom: 8px;
}

.subsection-card-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
}

.subsection-select {
    min-width: 140px;
}

.subsection-editor {
    border-radius: 10px;
    border: 1px solid #e1ddff;
    background: #faf9ff;
    padding: 8px;
}

.editor-textarea {
    width: 100%;
    min-height: 140px;
    border: none;
    outline: none;
    resize: vertical;
    font-family: inherit;
    font-size: 13px;
    background: transparent;
}

.var-chip {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid #5b4cd0;
    background: #f4eeff;
    color: #5b4cd0;
    font-size: 12px;
}

.subsection-extra {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 16px;
    margin: 8px 0 4px;
    margin-bottom: 20px;
}

.subsection-extra .field {
    align-items: flex-start;
    flex-direction: column;
}

.subsection-input,
.subsection-select {
    width: 100%;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.clauses-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.clause-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: flex-start;
    column-gap: 8px;
    padding: 10px 12px;
    border-radius: 6px;
    background: #ffffff;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.clause-item:hover {
    background: #faf7ff;
}

.clause-handle {
    border: none;
    background: transparent;
    cursor: grab;
    padding: 4px 0;
    color: #4b5563;
}

.clause-number {
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
    text-align: right;
    padding-right: 8px;

    flex: 0 0 auto;
    /* ⭐ Se adapta al tamaño del texto */
    white-space: nowrap;
}


.clause-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    color: #111827;
}

.clause-title {
    font-weight: 700;
    text-transform: uppercase;
}

.clause-edit {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #5b4cd0;
    padding: 4px;
    border-radius: 999px;
}

.clause-edit:hover {
    background: #efe9ff;
}

.subsection-item.unified {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, .06);
    /* overflow: hidden; */
    /* 🔥 CLAVE para que no se vean cortes */
    display: flex;
    flex-direction: column;
}

/* header */
.subsection-header {
    position: relative;
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

/* contenido */
.subsection-content {
    padding: 12px;
    border-top: 1px solid #eee;
    /* opcional */
}

.drag-over {
    background: #f3ebff !important;
    transform: scale(1.01);
    transition: .15s ease;
}

.clause-item[draggable="true"] {
    cursor: grab;
}

.clause-item:active {
    cursor: grabbing;
}

.clause-separator {
    margin: 0 2px;
    color: #4b5563;
}

.subsection-dropdown {
    position: absolute;
    right: 0;
    top: 32px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
}

.section-title {
    font: 500 18px Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

.section-subtitle {
    font: 500 14px Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

.general-card {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px 5px 10px;
    margin-bottom: 15px;
}

.card {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px 5px 10px;
    margin-bottom: 5px;
    padding: 20px;
}

.card-colapsable {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 5px 10px 5px 10px;
    margin-bottom: 5px;
}

.general-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.general-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.row-2 {
    display: grid;
    grid-template-columns: 120px 1fr;
}

:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.input-duo {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}

.card-separator {
    width: 100% !important;
    display: block !important;
    border: 0;
    border-top: 1px solid #efe7ff;
    margin: 16px 0;
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.otrosi-skeleton {
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

.comment-card {
    border: 2px solid #5B4CD0;
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #fff;
    font-family: Poppins, sans-serif;
    margin: 10px 0;
}

.comment-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.comment-title {
    font-size: 14px;
    font-weight: 700;
    color: #5B4CD0;
}

.comment-text {
    margin: 4px 0 0;
    font-size: 12px;
    color: #444;
    font-weight: 500;
}

.comment-date {
    font-size: 12px;
    color: #9CA3AF;
    white-space: nowrap;
    margin-left: 10px;
}

.add-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #5b4cd0;
    font-weight: 600;
}

/* ===== Split: evitar overlays y permitir encoger ===== */
.split.with-panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 350px;
    gap: 16px;
    align-items: start;
}

.split-main,
.slide-panel,
.split-panel {
    min-width: 0;
    /* clave anti-desborde */
}

/* el panel nunca debe salirse del grid */
.slide-panel {
    position: static;
    /* por si algún estilo global lo puso fixed/absolute */
    width: 100%;
}

/* ===== Responsive: apilar (panel abajo) ===== */
@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split-main {
        order: 1;
    }

    .slide-panel {
        order: 2;
    }

    /* evita que el panel “flote” encima */
    .split-panel {
        position: static;
        width: 100%;
    }
}

.top-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 20px;
}

@media (max-width: 640px) {
    .top-grid {
        grid-template-columns: 1fr;
    }
}
</style>