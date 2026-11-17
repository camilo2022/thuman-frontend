<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelExamMedical: Object,
    countries: Array,
    departaments: Array,
    cities: Array,
    healthEntities: Array,
    statuses: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelExamMedical', 'closeModals', 'submitExamMedicalUpdate', 'submitDepartamentAll', 'submitCityAll', 'submitHealthEntityAll']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar agendamiento examen médico</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="content-container">
                        <div>
                            <label class="label-bold" for="entity">Entidad</label>
                            <input type="text" disabled
                                :value="props.modelExamMedical.relationships.application?.vacant.headquarter.entity.name"
                                name="entity" id="entity" class="input-box disabled" placeholder="Entidad">
                        </div>
                        <div>
                            <label class="label-bold" for="entity">Vacante</label>
                            <input type="text" disabled
                                :value="props.modelExamMedical.relationships.application?.vacant.position.name"
                                name="position" id="position" class="input-box disabled" placeholder="Vacante">
                        </div>
                        <div>
                            <label class="label-bold" for="person">Candidato</label>
                            <input type="text" disabled
                                :value="[props.modelExamMedical.relationships.application?.person.first_name, props.modelExamMedical.relationships.application?.person.second_name, props.modelExamMedical.relationships.application?.person.first_last_name, props.modelExamMedical.relationships.application?.person.second_last_name].filter(Boolean).join(' ')"
                                name="person" id="person" class="input-box disabled" placeholder="Candidato">
                        </div>
                        <div>
                            <label class="label-bold" for="number_document">Documento</label>
                            <input type="text" disabled
                                :value="props.modelExamMedical.relationships.application?.person.document_number"
                                name="number_document" id="number_document" class="input-box disabled" placeholder="Documento">
                        </div>
                        <div class="input-group">
                            <label class="label-bold">País</label>
                            <SearchSelect v-model="props.modelExamMedical.country_id" :options="props.countries"
                                optionKey="name"
                                @click="emit('submitDepartamentAll', props.modelExamMedical.country_id); emit('submitHealthEntityAll', props.modelExamMedical.country_id)"
                                :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id" name="country_id"
                                id="country_id" placeholder="País" />
                        </div>
                        <div class="input-group">
                            <label class="label-bold">Departamento</label>
                            <SearchSelect v-model="props.modelExamMedical.departament_id" :options="props.departaments"
                                optionKey="name" @click="emit('submitCityAll', props.modelExamMedical.departament_id)"
                                valueKey="id" name="departament_id" id="departament_id" placeholder="Depatamento" />
                        </div>
                        <div class="input-group">
                            <label class="label-bold">Ciudad</label>
                            <SearchSelect v-model="props.modelExamMedical.city_id" :options="props.cities"
                                optionKey="name" valueKey="id" name="city_id" id="city_id" placeholder="Ciudad" />
                        </div>
                        <div class="input-group">
                            <label class="label-bold">Entidad de salud</label>
                            <SearchSelect v-model="props.modelExamMedical.health_entity_id"
                                :options="props.healthEntities ?? []" optionKey="name" valueKey="id"
                                name="health_entity_id" id="health_entity_id" placeholder="Entidad de salud" />
                        </div>
                        <div class="input-group">
                            <label class="label-bold">Dirección</label>
                            <input type="text" v-model="props.modelExamMedical.address" name="address" id="address"
                                class="input-box" placeholder="Dirección">
                        </div>
                        <div class="input-group">
                            <label class="label-bold">Barrio</label>
                            <input type="text" v-model="props.modelExamMedical.neighborhood" name="neighborhood"
                                id="neighborhood" class="input-box" placeholder="Barrio">
                        </div>
                        <div class="input-group">
                            <label class="label-bold">Fecha</label>
                            <input type="datetime-local" v-model="props.modelExamMedical.date_time" name="date_time"
                                id="date_time" class="input-box"
                                :class="{ 'input-error': props.errors?.modelExamMedical_date_time }">
                            <p v-for="(msg, i) in props.errors?.modelExamMedical_date_time ?? []" :key="'type-' + i"
                                class="error-text">
                                {{ msg }}
                            </p>
                        </div>
                        <div>
                            <label class="label-bold" for="status">Estado</label>
                            <SearchSelect v-model="props.modelExamMedical.status"
                                :options="props.statuses.map(s => ({ label: s, value: s }))" name="status" id="status"
                                placeholder="Estado" :error="props.errors?.modelExamMedical_status" />
                            <p v-for="(msg, i) in props.errors?.modelExamMedical_status ?? []" :key="'type-' + i"
                                class="error-text">
                                {{ msg }}
                            </p>
                        </div>
                        <div class="input-group full-width">
                            <label class="label-bold" for="indication">Indicación</label>
                            <div class="textarea-wrapper">
                                <textarea v-model="props.modelExamMedical.indication" name="indication" id="indication"
                                    placeholder="Indicación" maxlength="2000" class="text-area"></textarea>
                                <div class="char-limit-text">({{ (props.modelExamMedical.indication || '').length
                                }}/2000)
                                </div>
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
                        @click="emit('submitExamMedicalUpdate', props.modelExamMedical)">Guardar</button>
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