<script setup>
const props = defineProps({
    countries: Array,
    departaments: Array,
    cities: Array,
    documentTypes: Array,
    documentTypesPerson: Array,
    entityTypes: Array,
    modelEnterprise: Object,
    modelEntity: Object,
    modelPerson: Object,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelEnterprise', 'update:modelEntity', 'update:modelPerson', 'closeModals', 'submitEntityUpdate', 'submitPersonFind', 'signature']);
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
        <span>Empresa</span>
        <span>|</span>
        <span>Entidad internacional</span>
        <span>|</span>
        <span class="active">Editar entidad</span>
    </div>
    <div class="container-data">
        <div class="main-container">
            <h2 class="titulo">Editar entidad</h2>
            <div class="form-container">
                <div class="form-section">

                    <!-- Empresa -->
                    <div class="section-title">Empresa</div>

                    <div class="empresa-row">
                        <!-- Nombre comercial -->
                        <div class="input-group">
                            <label class="label" for="name">Nombre comercial</label>
                            <input type="text" name="name" id="name" v-model="props.modelEnterprise.name"
                                placeholder="Nombre comercial" class="input-box disabled" disabled>
                        </div>

                    </div>

                    <!-- ===== Card que agrupa ===== -->
                    <div class="card">
                        <div class="section-title">Entidades</div>
                        <!-- Información legal y fiscal -->
                        <div class="section-subtitle">Información legal y fiscal</div>

                        <div class="legal-fiscal-row">
                            <!-- País -->
                            <div class="input-group">
                                <label class="label-bold">País</label>
                                <SearchSelect v-model="props.modelEntity.country_id" :options="props.countries"
                                    optionKey="name" valueKey="id" name="country_id"
                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`" id="country_id"
                                    placeholder="País" :error="!!props.errors?.entity_country_id" />
                                <p v-for="(msg, i) in props.errors?.entity_country_id ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <!-- Razón social -->
                            <div class="input-group">
                                <label class="label-bold">Razón social</label>
                                <div class="dual-input">
                                    <SearchSelect v-model="props.modelEntity.entity_type_id" class="select-duo"
                                        :options="props.entityTypes" optionKey="settings.abreviature" valueKey="id"
                                        name="entity_type_id" id="entity_type_id" placeholder="Razón social"
                                        :error="!!props.errors?.entity_entity_type_id" />
                                    <input type="text" name="name" v-model="props.modelEntity.name"
                                        placeholder="Nombre entidad" class="input-box" minlength="1" maxlength="80"
                                        :class="{ 'input-error': props.errors?.entity_name }">
                                </div>
                                <div class="dual-errors">
                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.entity_entity_type_id ?? []"
                                            :key="'type-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>

                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.entity_name ?? []" :key="'num-' + i"
                                            class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Documento fiscal -->
                            <div class="input-group">
                                <label class="label-bold" for="document_type_id">Documento</label>
                                <div class="dual-input">
                                    <SearchSelect v-model="props.modelEntity.document_type_id" class="select-duo"
                                        :options="props.documentTypes" optionKey="settings.abreviature" valueKey="id"
                                        name="document_type_id" id="document_type_id" placeholder="Documento"
                                        :error="!!props.errors?.entity_document_type_id" />
                                    <input type="text" name="document_number"
                                        v-model="props.modelEntity.document_number" placeholder="Número"
                                        class="input-box"
                                        :class="{ 'input-error': props.errors?.entity_document_number }">
                                </div>
                                <div class="dual-errors">
                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.entity_document_type_id ?? []"
                                            :key="'type-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>

                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.entity_document_number ?? []"
                                            :key="'num-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="separadores">
                        <!-- Representante legal -->
                        <div class="section-subtitle mt">Representante legal</div>

                        <div class="rep-legal-grid">

                            <div class="input-group">
                                <label class="label-bold" for="document_issue_country_id">País</label>
                                <SearchSelect v-model="props.modelPerson.document_issue_country_id"
                                    :options="props.countries" optionKey="name" valueKey="id"
                                    name="document_issue_country_id"
                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`" id="document_issue_country_id"
                                    placeholder="País"
                                    :error="!props.modelPerson.document_issue_departament_id && props.errors?.person_document_issue_city_id" />
                                <template
                                    v-if="!props.modelPerson.document_issue_departament_id && props.errors?.person_document_issue_city_id">
                                    <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []"
                                        :key="'num-' + i" class="error-text">
                                        {{ msg }}
                                    </p>
                                </template>
                            </div>

                            <div class="input-group">
                                <label class="label-bold" for="document_issue_departament_id">Departamento</label>
                                <SearchSelect v-model="props.modelPerson.document_issue_departament_id"
                                    :options="props.departaments" optionKey="name" valueKey="id"
                                    name="document_issue_departament_id" id="document_issue_departament_id"
                                    placeholder="Departamento"
                                    :error="!props.modelPerson.document_issue_departament_id && props.errors?.person_document_issue_city_id" />
                                <template
                                    v-if="!props.modelPerson.document_issue_departament_id && props.errors?.person_document_issue_city_id">
                                    <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []"
                                        :key="'num-' + i" class="error-text">
                                        {{ msg }}
                                    </p>
                                </template>
                            </div>

                            <div class="input-group">
                                <label class="label-bold" for="document_issue_city_id">Ciudad</label>
                                <SearchSelect v-model="props.modelPerson.document_issue_city_id" :options="props.cities"
                                    optionKey="name" valueKey="id" name="document_issue_city_id"
                                    id="document_issue_city_id" placeholder="Ciudad"
                                    :error="!!props.errors?.person_document_issue_city_id" />
                                <p v-for="(msg, i) in props.errors?.person_document_issue_city_id ?? []"
                                    :key="'num-' + i" class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <!-- Documento -->
                            <div class="input-group">
                                <label class="label-bold">Documento</label>
                                <div class="dual-input">
                                    <SearchSelect v-model="props.modelPerson.document_type_id" class="select-duo"
                                        :options="props.documentTypesPerson" optionKey="settings.abreviature"
                                        valueKey="id" name="document_type_id" id="document_type_id"
                                        placeholder="Documento" :error="!!props.errors?.person_document_type_id" />
                                    <input type="text" name="numero_doc_rep" v-model="props.modelPerson.document_number"
                                        @blur="emit('submitPersonFind')" placeholder="Número de documento"
                                        class="input-box"
                                        :class="{ 'input-error': props.errors?.person_document_number }">
                                </div>
                                <div class="dual-errors">
                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.person_document_type_id ?? []"
                                            :key="'type-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>

                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.person_document_number ?? []"
                                            :key="'num-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Primer nombre</label>
                                <input type="text" name="primer_nombre" v-model="props.modelPerson.first_name"
                                    placeholder="Primer nombre" class="input-box" minlength="1" maxlength="25"
                                    :class="{ 'input-error': props.errors?.person_first_name }">
                                <p v-for="(msg, i) in props.errors?.person_first_name ?? []" :key="'num-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Segundo nombre (Opcional)</label>
                                <input type="text" name="segundo_nombre" v-model="props.modelPerson.second_name"
                                    placeholder="Segundo nombre" class="input-box" minlength="1" maxlength="25"
                                    :class="{ 'input-error': props.errors?.person_second_name }">
                                <p v-if="props.errors?.person_second_name" class="error-text">
                                    {{ props.errors?.person_second_name[0] }}
                                </p>
                            </div>


                            <div class="input-group">
                                <label class="label-bold">Primer apellido</label>
                                <input type="text" name="primer_apellido" v-model="props.modelPerson.first_last_name"
                                    placeholder="Primer apellido" class="input-box" minlength="3" maxlength="25"
                                    :class="{ 'input-error': props.errors?.person_first_last_name }">
                                <p v-for="(msg, i) in props.errors?.person_first_last_name ?? []" :key="'num-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Segundo apellido (Opcional)</label>
                                <input type="text" name="segundo_apellido" v-model="props.modelPerson.second_last_name"
                                    placeholder="Segundo apellido" class="input-box" minlength="3" maxlength="25"
                                    :class="{ 'input-error': props.errors?.person_second_last_name }">
                                <p v-if="props.errors?.person_second_last_name" class="error-text">
                                    {{ props.errors?.person_second_last_name[0] }}
                                </p>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Correo electrónico</label>
                                <input type="email" name="email" v-model="props.modelPerson.email"
                                    placeholder="Correo electrónico" class="input-box" minlength="7" maxlength="75"
                                    :class="{ 'input-error': props.errors?.person_email }">
                                <p v-for="(msg, index) in errors?.person_email" :key="index" class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="input-group">
                                <label class="label-bold" for="dialing_country_id">Teléfono</label>
                                <div class="dual-input">
                                    <SearchSelect v-model="props.modelPerson.dialing_country_id" class="select-duo"
                                        :options="props.countries" optionKey="name" valueKey="id"
                                        name="dialing_country_id"
                                        :displayFormatter="opt => `${opt.emoji} +${opt.phone_code}`"
                                        id="dialing_country_id" placeholder="Prefijo"
                                        :error="!!props.errors?.person_dialing_country_id" />
                                    <input type="text" name="telefono" v-model="props.modelPerson.phone_number"
                                        placeholder="Número de teléfono" class="input-box"
                                        :class="{ 'input-error': props.errors?.person_phone_number }">
                                </div>
                                <div class="dual-errors">
                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.person_dialing_country_id ?? []"
                                            :key="'type-' + i" class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>

                                    <div class="error-col">
                                        <p v-for="(msg, i) in props.errors?.person_phone_number ?? []" :key="'num-' + i"
                                            class="error-text">
                                            {{ msg }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-buttons">
                            <button class="btn-primary" @click="emit('signature')">Firma
                                electrónica</button>
                        </div>
                        <template v-if="false">
                            <div class="section-subtitle mt">Firma electrónica</div>

                            <div class="signature-preview">
                                <div class="signature-card">
                                    <img :src="props.modelPerson.relationships?.signature?.path" alt="Firma" />
                                    <!-- <span class="signature-placeholder">Sin firma</span> -->
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="card">
                        <div class="section-title">Política de vacaciones</div>
                        <div class="legal-fiscal-row">
                            <!-- País -->
                            <div class="input-group">
                                <label class="label-bold">Días laborales</label>
                                <SelectCheckMultiple :options="[
                                    { day: 1, name: 'Lunes' },
                                    { day: 2, name: 'Martes' },
                                    { day: 3, name: 'Miércoles' },
                                    { day: 4, name: 'Jueves' },
                                    { day: 5, name: 'Viernes' },
                                    { day: 6, name: 'Sábado' },
                                    { day: 7, name: 'Domingo' }
                                ]" optionKey="name" valueKey="day" v-model="props.modelEntity.vacation.days"
                                    placeholder="Días laborales"
                                    :error="!!props.errors?.['entity_settings_vacations_0_days']" />
                                <p v-if="props.errors?.['entity_settings_vacations_0_days']" class="error-text">
                                    {{ props.errors['entity_settings_vacations_0_days'][0] }}
                                </p>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Cantidad de días</label>
                                <input class="input-box" placeholder="Cantidad de días" type="number"
                                    v-model="props.modelEntity.vacation.legal_days" min="0" max="999" :class="{
                                        'input-error': props.errors?.['entity_settings_vacations_0_legal_days']
                                    }"
                                    @input="props.modelEntity.vacation.legal_days = String(props.modelEntity.vacation.legal_days).slice(0, 3)">
                                <p v-if="props.errors?.['entity_settings_vacations_0_legal_days']" class="error-text">
                                    {{ props.errors['entity_settings_vacations_0_legal_days'][0] }}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="form-buttons">
                <button class="btn-secondary" @click="$emit('index')">Cancelar</button>
                <button class="btn-primary" @click="emit('submitEntityUpdate', props.modelEntity)">Guardar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.empresa-container {
    padding: 30px;
    background-color: #ffffff;
}

/* Contenedor principal */
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

/* Títulos */
.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
}

.section-subtitle {
    font: 500 13px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-weight: bold;
}

/* Labels */
.label {
    font: 600 12px/1 Poppins, sans-serif;
    color: #2B2C34;
}

.label-bold {
    font: 700 12px/1 Poppins, sans-serif;
    color: #2B2C34;
}

/* Grupo de inputs */
.input-group {
    min-width: 0;
    /* <-- clave para que el contenido no empuje al grid */
    width: 100%;
}

.placeholder {
    color: #CFCECE;
    font-size: 12px;
}

/* Inputs y selects simples */
input.input-box,
input.select-box {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    box-shadow: 0 2px 6px #D3D3D3;
    border-radius: 5px;
    padding: 7px 10px;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #E6E6E6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input.input-box:hover,
input.input-box:focus {
    box-shadow: 0 0 4px rgba(91, 76, 208, 0.6);
    border: 1px solid #5B4CD0;
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

/* SearchSelect independiente (fuera del dual-input) */
.search-input {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    padding: 8px 10px;
}


/* Ajuste especial para select-duo */
:deep(.select-duo) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}



/* Inputs base nativos */
input,
select,
textarea {
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 8px 10px;
    font-family: inherit;
    font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 4px rgba(91, 76, 208, .5);
}

/* Subcomponentes upload */
.upload-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 3px .5px #D3D3D3;
    border: 1px solid #E6E6E6;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.upload-btn {
    background: #5B4CD0;
    color: #fff;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
}

.divider {
    width: 1px;
    height: 20px;
    background: #CFCECE;
    z-index: 10;
}

.file-placeholder {
    font-size: 12px;
    color: #4B4B4B;
}

.upload-status {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    border-radius: 5px;
    pointer-events: none;
    transition: background-color 1.6s ease, color 1.6s ease, opacity 1.6s ease;
}

.upload-status.is-loading {
    background: #5B4CD0;
    color: #ffffff;
}

.upload-status.is-done {
    background: #ffffff;
    color: #2B2C34;
}

.upload-btn.disabled {
    opacity: .6;
    pointer-events: none;
    transition: opacity .2s ease;
}

/* Cards */
.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}

.card .section-subtitle {
    margin-bottom: 10px;
}

.card .section-subtitle.mt {
    margin-top: 14px;
}

/* Layouts */
.legal-fiscal-row,
.rep-legal-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(3, minmax(290px, 1fr));
}

.empresa-row {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
}

.empresa-row .input-group {
    flex: 1;
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

/* Indentar contenido en card */

/* Responsive */
@media (max-width:1024px) {
    .empresa-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width:768px) {
    .rep-legal-grid {
        grid-template-columns: 1fr;
    }

    .empresa-row {
        grid-template-columns: 1fr;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.card-footer {
    display: flex;
    justify-content: center;
    margin-top: 14px;
}

.titulo {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #222;
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%;
}

.signature-preview {
    border: 1px solid #e3e3e3;
    /* borde gris claro como en la imagen */
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    min-height: 80px;
    /* altura del “rectángulo” grande */
    background: #fff;
}

/* Tarjeta donde va la firma */
.signature-card {
    width: 180px;
    /* ancho de la tarjeta de firma */
    height: 70px;
    /* alto de la tarjeta de firma */
    border-radius: 10px;
    background: #fff;
    box-shadow:
        0 0 0 1px rgba(15, 23, 42, 0.03),
        0 4px 10px rgba(15, 23, 42, 0.06);
    /* sombrita suave */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* recorta lo que se salga */
}

/* Imagen de firma dentro de la tarjeta */
.signature-card img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

/* Texto de placeholder */
.signature-placeholder {
    font-size: 12px;
    color: #9ca3af;
}

/* ====== DUAL INPUT ====== */
.dual-input {
    --left-width: clamp(140px, 32%, 240px);
    display: flex;
    width: 100%;
}

:deep(.dual-input .select-duo) {
    flex: 0 1 var(--left-width);
}

.dual-input .input-box {
    flex: 1;
}

.dual-errors {
    display: flex;
    width: 100%;
    margin-top: 4px;
    align-items: flex-start;
    /* 👈 CLAVE */
}

/* Columna del SELECT */
.dual-errors .error-col:first-child {
    flex: 0 0 var(--left-width);
    /* mismo padding visual del select */
    box-sizing: border-box;
}

/* Columna del INPUT */
.dual-errors .error-col:last-child {
    flex: 1;
    /* mismo padding del input */
    box-sizing: border-box;
}

/* Cada mensaje ocupa su propia línea */
.dual-errors .error-text {
    display: block;
    line-height: 1.3;
}

.dual-errors {
    --left-width: clamp(140px, 32%, 240px);

    display: grid;
    grid-template-columns: var(--left-width) 1fr;
    column-gap: 0;
    row-gap: 2px;

    width: 100%;
    margin-top: 4px;
}

/* Columna izquierda (select) */
.dual-errors .error-col:first-child {
    grid-column: 1;
    box-sizing: border-box;
}

/* Columna derecha (input) */
.dual-errors .error-col:last-child {
    grid-column: 2;
    box-sizing: border-box;
}

/* Cada mensaje es una fila real */
.dual-errors .error-text {
    margin: 0;
    line-height: 1.3;
}

.legal-fiscal,
.rep-legal-grid,
.legal-fiscal-row {
    --gap: 16px;
    --min: 370px;
    /* desktop */

    display: grid;
    gap: var(--gap);

    /* clave para que el grid pueda encogerse */
    min-width: 0;

    grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min)), 1fr));
}


/* Tablet */
@media (max-width: 1127px) {

    .legal-fiscal,
    .rep-legal-grid,
    .legal-fiscal-row {
        --min: 240px;
    }
}

/* Mobile */
@media (max-width: 742px) {

    .legal-fiscal,
    .rep-legal-grid,
    .legal-fiscal-row {
        --gap: 12px;
        --min: 100%;
        /* fuerza 1 columna sin pelear */
    }
}

.dual-input {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    width: 100%;
    height: 37px;
    min-width: 0;

    border: 1px solid #E6E6E6;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 6px #D3D3D3;
}
</style>