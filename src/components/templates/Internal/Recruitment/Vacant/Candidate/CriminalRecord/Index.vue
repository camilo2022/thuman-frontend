<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

// props para integrarte con tu servicio externo
const props = defineProps({
    modelVacant: Object,
    modelApplication: Object,
    loadingData: Boolean,
    modelCriminalRecord: Object,
    getData: Boolean,
    loadingCriminalR: Boolean,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits([
    'submitCriminalRecordStore',
    'index'
])

const show = ref(false);

watch(props.errors, () => {
    console.log(props.errors)
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
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reclutamiento</span><span>|</span><span>Vacantes</span><span>|</span>
        <span>Candidatos {{ props.modelVacant.relationships?.position?.name }}</span><span>|</span>
        <span class="active">Validación de antecedentes</span>
    </div>

    <div class="empresa-container">
        <div class="main-container">
            <h2 class="titulo">Validación de antecedentes</h2>

            <div class="agend-card">
                <div class="section-title">Ficha del candidato</div>
                <div v-if="props.loadingData" class="loading-data">
                    <div class="ficha-skel">
                        <!-- ===== Tarjeta: Datos personales ===== -->
                        <section class="card-skel">
                            <header class="card-skel__header">
                                <div class="skel skel-circle"></div>
                                <div class="skel skel-title" style="width:200px;height:18px;"></div>
                            </header>

                            <div class="card-skel__grid">
                                <!-- Nombre completo -->
                                <div class="card-skel__field">
                                    <div class="skel skel-label" style="width:140px;"></div>
                                    <div class="field-stack">
                                        <div class="skel skel-line" style="width:80%;"></div>
                                        <div class="skel skel-line" style="width:60%;"></div>
                                    </div>
                                </div>

                                <!-- Estado civil -->
                                <div class="card-skel__field">
                                    <div class="skel skel-label" style="width:110px;"></div>
                                    <div class="skel skel-line" style="width:60%;"></div>
                                </div>

                                <!-- Género -->
                                <div class="card-skel__field">
                                    <div class="skel skel-label" style="width:80px;"></div>
                                    <div class="skel skel-line" style="width:55%;"></div>
                                </div>
                            </div>
                        </section>

                        <!-- ===== Tarjeta: Antecedentes ===== -->
                        <section class="card-skel">
                            <header class="card-skel__header">
                                <div class="skel skel-circle"></div>
                                <div class="skel skel-title" style="width:160px;height:18px;"></div>
                            </header>

                            <div class="card-skel__grid card-skel__grid--2">
                                <!-- Archivo -->
                                <div class="card-skel__field">
                                    <div class="skel skel-label" style="width:80px;"></div>
                                    <div class="input-group">
                                        <div class="skel skel-input"></div>
                                        <div class="skel input-btn"></div>
                                    </div>
                                    <div class="skel skel-hint" style="width:40%;"></div>
                                </div>

                                <!-- Observación -->
                                <div class="card-skel__field">
                                    <div class="skel skel-label" style="width:110px;"></div>
                                    <div class="skel skel-textarea"></div>
                                    <div class="skel skel-hint hint-right" style="width:80px;"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <!-- === FICHA DEL CANDIDATO === -->
                <div v-else class="cards-grid">


                    <!-- 1) Datos personales -->
                    <section class="card">
                        <header class="card-head">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                viewBox="0 0 256 256" aria-hidden="true">
                                <path d="M192,96a64,64,0,1,1-64-64A64,64,0,0,1,192,96Z" opacity="0.2"></path>
                                <path
                                    d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
                            </svg>
                            Datos personales
                        </header>

                        <div class="card-body">
                            <dl class="kv-grid">
                                <div class="kv-item">
                                    <dt>Nombre completo</dt>
                                    <dd class="motivo">{{
                                        `${props.modelApplication.relationships?.person?.first_name || ''}
                                        ${props.modelApplication.relationships?.person?.second_name || ''}
                                        ${props.modelApplication.relationships?.person?.first_last_name || ''}
                                        ${props.modelApplication.relationships?.person?.second_last_name || ''}`.trim()
                                        || 'Sin información'
                                    }}</dd>
                                </div>
                                <div class="kv-item">
                                    <dt>Estado civil</dt>
                                    <dd>{{ props.modelApplication.relationships?.person?.marital_status?.name
                                        || 'Sin información' }}</dd>
                                </div>
                                <div class="kv-item">
                                    <dt>Género</dt>
                                    <dd>{{ props.modelApplication.relationships?.person?.sex?.name
                                        || 'Sin información'
                                        }}</dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <!-- 2) Datos del documento -->
                    <section class="card">
                        <header class="card-head">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                viewBox="0 0 256 256" aria-hidden="true">
                                <path
                                    d="M216,48H40a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V56A8,8,0,0,0,216,48ZM96,144a24,24,0,1,1,24-24A24,24,0,0,1,96,144Z"
                                    opacity="0.2"></path>
                                <path
                                    d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z" />
                            </svg>
                            Datos del documento
                        </header>

                        <div class="card-body">
                            <dl class="kv-grid">
                                <div class="kv-item">
                                    <dt>Documento</dt>
                                    <dd>{{
                                        props.modelApplication.relationships?.person?.document_type?.settings?.abreviature
                                        || '' }} {{
                                            props.modelApplication.relationships?.person?.document_number ||
                                            'Sin información'
                                        }}</dd>
                                </div>
                                <div class="kv-item">
                                    <dt>Lugar de expedición</dt>
                                    <dd>{{
                                        props.modelApplication.relationships?.person?.document_issue_city?.departament.country.name
                                    }},
                                        {{
                                            props.modelApplication.relationships?.person?.document_issue_city?.departament?.name
                                        }},
                                        {{ props.modelApplication.relationships?.person?.document_issue_city.name ||
                                            'Sin información' }}</dd>
                                </div>
                                <div class="kv-item">
                                    <dt>Fecha de expedición</dt>
                                    <dd>
                                        {{ props.modelApplication.relationships?.person?.
                                            document_issue_date?.split(' ')[0] ||
                                            'Sin información' }}</dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <section class="card card--full">
                        <header class="card-head">Antecedentes</header>

                        <div class="card-body card-body--lg">
                            <div class="antecedentes-grid">
                                <!-- Columna izquierda: Archivo -->
                                <div class="left-col">
                                    <label class="label-bold">Archivo</label>
                                    <div class="field">
                                        <div class="input-group area-archivo"
                                            v-if="props.modelCriminalRecord.relationships?.file">
                                            <div class="input-box" style="font-size:14px; max-height:37.5px;">
                                                <div class="preview-file"
                                                    style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                                                    <div
                                                        style="align-items: center; text-align: center; display: flex;">
                                                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32"
                                                            height="32" fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                        </svg>
                                                        <span style="font-size:14px;">{{
                                                            props.modelCriminalRecord.relationships?.file.name
                                                        }}</span>
                                                    </div>
                                                    <Button title="Previsualizar" icon="preview" variant="transparent"
                                                        @click="show = true" />
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Estado GUARDADO: píldora como en el mock -->
                                        <div v-else-if="saved && fileName" class="file-pill">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z">
                                                </path>
                                            </svg>
                                            <span class="file-name">{{ fileName }}</span>
                                            <!-- Lápiz -->
                                            <div class="action-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z">
                                                    </path>
                                                </svg>
                                            </div>

                                        </div>

                                        <!-- Estado EDICIÓN: tu cargador + drop -->
                                        <div v-else class="file-row">
                                            <FileUpload v-model="props.modelCriminalRecord.file.file" id="file"
                                                name="file" :multiple="false" accept="application/pdf"
                                                :error="props.errors?.criminalRecord_file" />
                                            <p v-for="(msg, i) in props.errors?.criminalRecord_file ?? []"
                                                :key="'type-' + i" class="error-text">
                                                {{ msg }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Columna derecha: Observación -->
                                <div class="right-col">
                                    <label class="label-bold" for="description">Observación</label>

                                    <!-- EDICIÓN -->
                                    <div v-if="!saved" class="textarea-wrapper">
                                        <textarea id="description" class="text-area"
                                            :class="{ 'disabled': getData, 'input-error': props.errors?.criminalRecord_observation }"
                                            :maxlength="500" placeholder="Escribe una observación breve"
                                            :disabled="getData"
                                            v-model="props.modelCriminalRecord.observation"></textarea>
                                        <p v-for="(msg, i) in props.errors?.criminalRecord_observation ?? []"
                                            :key="'type-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                        <div class="char-limit-text">({{
                                            (props.modelCriminalRecord.observation ||
                                                '').length }}/500)</div>
                                    </div>

                                    <!-- LECTURA -->
                                    <div v-else class="textarea-wrapper">
                                        <textarea id="description" class="text-area disabled" disabled
                                            placeholder="Escribe una observación breve"
                                            :value="props.modelCriminalRecord.observation"></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Botones -->
                            <div class="form-buttons">
                                <button v-if="!getData" class="btn-outline btn-danger-light"
                                    @click="emit('submitCriminalRecordStore', 'Rechazado')"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="currentColor" viewBox="0 0 256 256">
                                        <path
                                            d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                        </path>
                                    </svg>No aprobar</button>
                                <button v-if="!getData" class="btn-outline btn-success-light"
                                    @click="emit('submitCriminalRecordStore', 'Aprobado')"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        fill="currentColor" viewBox="0 0 256 256">
                                        <path
                                            d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                        </path>
                                    </svg> Aprobar</button>
                                <button v-if="false" class="btn-primary" @click="emit('submitCriminalRecordStore')">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    </div>
    <PDFPreview v-if="props.modelCriminalRecord?.relationships?.file" :show="show"
        :pdfUrl="props.modelCriminalRecord.relationships?.file?.path"
        :pdfName="props.modelCriminalRecord.relationships?.file?.name" @close="show = false" />
</template>

<style scoped>
.empresa-container {
    padding: 0 30px 0 30px;
}

.main-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
}

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

.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

/* Grid de 2 columnas arriba + 1 full abajo */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
}

/* Caja base */
.card {
    grid-column: span 6;
    /* 6/12 = 2 columnas */
    background: #fff;
    border: 1px solid #ebe9ff;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(91, 76, 208, .08);
    padding: 16px;
}

/* Caja completa (fila entera) */
.card--full {
    grid-column: 1 / -1;
}

/* Encabezado de la caja (solo marco) */
.card-head {
    display: inline-flex;
    /* o display:flex si prefieres que ocupe toda la línea */
    align-items: center;
    /* centra verticalmente icono y texto */
    gap: 8px;
    /* separación icono–texto */
    font-weight: 700;
    font-size: 16px;
    color: #5b4cd0;
    /* el svg heredará este color por currentColor */
    padding-bottom: 8px;
    border-bottom: 1px solid #f0ecff;
    margin-bottom: 12px;
    line-height: 1.2;
    width: 100%;
}

/* Ajustes del icono */
.card-head>svg {
    flex: 0 0 auto;
    /* evita que se estire/encoga */
    width: 20px;
    height: 20px;
    display: block;
    /* quita “gaps” de inline svg */
    pointer-events: none;
    /* no captura clicks */
}

/* (Opcional) si algún header no lleva icono, el texto no se descuadra */
.card-head:has(> svg) {
    padding-left: 0;
}

/* Área para que ubiques tu contenido */
.card-body {
    min-height: 80px;
    /* alto mínimo de referencia */
    border-radius: 8px;
}

/* La de antecedentes puede ser más alta */
.card-body--lg {
    min-height: 140px;
}

@media (max-width: 1024px) {
    .card {
        grid-column: 1 / -1;
    }
}

/* Responsive: apilar en una columna */
@media (max-width: 880px) {
    .card {
        grid-column: 1 / -1;
    }
}

/* dentro de cada tarjeta superior: 3 columnas de pares clave-valor */
.kv-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px 24px;
    padding: 5px 10px;
}

.kv-item {
    display: flex;
    flex-direction: column;
}

.kv-item dt {
    font-weight: 600;
    color: #898A8B;
    margin-bottom: 6px;
    font-size: 13px;
}

.kv-item dd {
    font-weight: 500;
    color: #000000;
    margin-bottom: 6px;
    font-size: 13px;
}

/* antecedentes: dos columnas (izq más ancha), botón al final derecha */
.antecedentes-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    gap: 16px 24px;
    align-items: start;
    padding: 10px;
}

.file-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

/* zona grande para arrastrar/preview (puedes reemplazar por tu lista) */
.dropzone {
    min-height: 140px;
}

/* botón “Guardar” abajo a la derecha */
.antecedentes-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
}

/* Responsive: apila en pantallas pequeñas */
@media (max-width: 992px) {
    .kv-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .antecedentes-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .cards-grid {
        grid-template-columns: 1fr;
    }

    .kv-grid {
        grid-template-columns: 1fr;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 10px;
}

/* píldora del archivo */
.file-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #efeaff;
    border-radius: 10px;
    padding: 5px 5px;
    border: 1px solid #e5e1ff;
}

.file-pill svg {
    width: 22px;
    height: 22px;
    color: red;
}

.file-name {
    color: #000000;
    font-weight: 400;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
}

.action-icon {
    background: transparent;
    border: 0;
    border-radius: 8px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0 9px;
    font-size: 0.8rem;
}

.action-icon svg {
    width: 22px;
    height: 22px;
    color: #5b4cd0;
}

.input-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px 0.5px #d3d3d3;
    box-shadow: 0 2px 6px #d3d3d3;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    outline: none;
    justify-content: space-between;
    border: 1px solid #e6e6e6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.preview-file svg {
    color: red;
}

/* ===== Card base ===== */
.card-skel {
    border: 1px solid #f3f3f3;
    background: #fff;
    border-radius: 12px;
    padding: 18px 18px 12px;
    box-shadow: 0 0 0 1px rgba(91, 76, 208, .03) inset;
}

/* ===== Header ===== */
.card-skel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.skel-title {
    border-radius: 10px;
}

/* ===== Grid: 3 columnas ===== */
.card-skel__grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* 3 cols */
    gap: 16px 18px;
}

.card-skel__field {}

.card-skel__field--span2 {
    grid-column: span 2;
}

/* ocupa 2 columnas */
.card-skel__field--full {
    grid-column: 1 / -1;
}

/* ocupa todas */

.card-skel__actions {
    grid-column: 3 / 4;
    /* botón en la 3ra columna */
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* ===== Shimmer (paleta tuya) ===== */
@keyframes skel-shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.skel {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: skel-shimmer 1.2s ease-in-out infinite;
}

/* ===== Variantes de tamaño ===== */
.skel-circle {
    width: 32px;
    height: 32px;
    border-radius: 999px;
}

.skel-label {
    height: 12px;
    border-radius: 6px;
    margin-bottom: 8px;
}

.skel-input,
.skel-select {
    height: 44px;
    border-radius: 10px;
    border: 1px solid #eeeaff;
}

.skel-select {
    position: relative;
}

.skel-select::before {
    content: "";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: rgba(0, 0, 0, .06);
}

.skel-textarea {
    height: 160px;
    border-radius: 12px;
    border: 1px solid #eeeaff;
}

.skel-hint {
    height: 10px;
    margin-top: 6px;
    border-radius: 6px;
}

.skel-button {
    width: 130px;
    height: 44px;
    border-radius: 999px;
    border: 1px solid #e1d9ff;
}

/* ===== Responsive ===== */
@media (max-width:1200px) {
    .card-skel__grid {
        grid-template-columns: 1fr 1fr;
    }

    /* 2 cols */
    .card-skel__actions {
        grid-column: 2 / 3;
    }
}

@media (max-width:680px) {
    .card-skel__grid {
        grid-template-columns: 1fr;
    }

    /* 1 col */
    .card-skel__actions {
        grid-column: 1 / 2;
    }

    .skel-button {
        width: 100%;
    }
}

/* Layout de la ficha */
.ficha-skel {
    display: grid;
    gap: 16px;
}

/* Piezas pequeñas de texto */
.skel-line {
    height: 14px;
    border-radius: 6px;
}

/* Pila vertical para valores con 2 líneas */
.field-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* Grid de 2 columnas para “Antecedentes” */
.card-skel__grid--2 {
    grid-template-columns: 1fr 1fr;
    gap: 16px 18px;
}

/* Input con botón al extremo (ojo) */
.input-group {
    position: relative;
}

.input-btn {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1px solid #eeeaff;
}

/* Contador alineado a la derecha en Observación */
.hint-right {
    margin-left: auto;
}

/* Responsive: acompaña tus reglas ya existentes */
@media (max-width:1200px) {
    .card-skel__grid--2 {
        grid-template-columns: 1fr;
    }
}
</style>
