<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelTestPsychotechnical: Object,
    statuses: Array,
    forms: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelTestPsychotechnical', 'closeModals', 'submitTestPsychotechnicalUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar agendamiento prueba psicotécnica</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="content-container">
                        <div>
                            <label class="label-bold" for="entity">Entidad</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.vacant.headquarter.entity.name"
                                name="entity" id="entity" class="input-box" placeholder="Entidad">
                        </div>
                        <div>
                            <label class="label-bold" for="entity">Vacante</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.vacant.position.name"
                                name="position" id="position" class="input-box" placeholder="Vcante">
                        </div>
                        <div>
                            <label class="label-bold" for="person">Candidato</label>
                            <input type="text"
                                :value="[props.modelTestPsychotechnical.relationships.application?.person.first_name, props.modelTestPsychotechnical.relationships.application?.person.second_name, props.modelTestPsychotechnical.relationships.application?.person.first_last_name, props.modelTestPsychotechnical.relationships.application?.person.second_last_name].filter(Boolean).join(' ')"
                                name="person" id="person" class="input-box" placeholder="Candidato">
                        </div>
                        <div>
                            <label class="label-bold" for="number_document">Documento</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.person.document_number"
                                name="number_document" id="number_document" class="input-box" placeholder="Documento">
                        </div>
                        <div>
                            <label class="label-bold" for="headquarter">Sede</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.vacant.headquarter.name"
                                name="headquarter" id="headquarter" class="input-box" placeholder="Sede">
                        </div>
                        <div>
                            <label class="label-bold" for="country">Pais</label>
                            <input type="text"
                                :value="[props.modelTestPsychotechnical.relationships.application?.vacant?.headquarter?.city?.departament?.country?.emoji, props.modelTestPsychotechnical.relationships.application?.vacant?.headquarter?.city?.departament?.country?.name].filter(Boolean).join(' ')"
                                name="country" id="country" class="input-box" placeholder="Pais">
                        </div>
                        <div>
                            <label class="label-bold" for="departament">Departamento</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.vacant?.headquarter?.city?.departament?.name"
                                name="departament" id="departament" class="input-box" placeholder="Departamento">
                        </div>
                        <div>
                            <label class="label-bold" for="city">Ciudad</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.vacant.headquarter.city.name"
                                name="city" id="city" class="input-box" placeholder="Direccion">
                        </div>
                        <div>
                            <label class="label-bold" for="address">Direccion</label>
                            <input type="text"
                                :value="props.modelTestPsychotechnical.relationships.application?.vacant.headquarter.address"
                                name="address" id="address" class="input-box" placeholder="Direccion">
                        </div>
                        <div>
                            <label class="label-bold" for="start_date">Fecha inicio</label>
                            <input type="date" v-model="props.modelTestPsychotechnical.start_date" name="start_date"
                                id="start_date" class="input-box"
                                :class="{ 'input-error': props.errors?.modelTestPsychotechnical_start_date }">
                            <p v-for="(msg, i) in props.errors?.modelTestPsychotechnical_start_date ?? []"
                                :key="'type-' + i" class="error-text">
                                {{ msg }}
                            </p>
                        </div>
                        <div>
                            <label class="label-bold" for="end_date">Fecha fin</label>
                            <input type="date" v-model="props.modelTestPsychotechnical.end_date" name="end_date"
                                id="end_date" class="input-box"
                                :class="{ 'input-error': props.errors?.modelTestPsychotechnical_end_date }">
                            <p v-for="(msg, i) in props.errors?.modelTestPsychotechnical_end_date ?? []"
                                :key="'type-' + i" class="error-text">
                                {{ msg }}
                            </p>
                        </div>
                        <div>
                            <label class="label-bold">Prueba</label>
                            <SearchSelect v-model="props.modelTestPsychotechnical.form_id" :options="props.forms"
                                optionKey="questions.title" valueKey="id" name="test" id="test" placeholder="Prueba"
                                :error="!!props.errors?.modelTestPsychotechnical_form_id" />
                            <p v-for="(msg, i) in props.errors?.modelTestPsychotechnical_form_id ?? []"
                                :key="'type-' + i" class="error-text">
                                {{ msg }}
                            </p>
                        </div>

                        <div class="full-width">
                            <label class="label-bold" for="indication">Indicación</label>
                            <div class="textarea-wrapper">
                                <textarea v-model="props.modelTestPsychotechnical.indication" name="indication"
                                    id="indication" placeholder="Indicación" maxlength="2000"
                                    class="text-area"></textarea>
                                <div class="char-limit-text">({{ (props.modelTestPsychotechnical.indication ||
                                    '').length }}/2000)</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary"
                        style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0;"
                        @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitTestPsychotechnicalUpdate', props.modelTestPsychotechnical)">Guardar</button>
                </footer>

            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-container {
    padding: 10px;
    background-color: #eee;
    border-radius: 18px;
}

.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 1100px;
    width: 420vw;
    height: 100%;
    max-height: 1500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.content-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 2 columnas iguales */
    gap: 12px;
    /* espacio entre columnas y filas */
}

.full-width {
    grid-column: 1 / -1;
}

/* Hace que un div ocupe solo la primera columna */
.col-1 {
    grid-column: 1 / 2;
}

/* Hace que un div ocupe solo la segunda columna */
.col-2 {
    grid-column: 1 / 2;
}
</style>