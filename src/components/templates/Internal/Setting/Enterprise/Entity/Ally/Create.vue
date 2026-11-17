<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelAlly: Object,
    countries: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelAlly', 'closeModals', 'submitAllyStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Crear aliado</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container">

                        <!-- 2x2 -->
                        <div class="grid-top">
                            <div>
                                <label class="label-bold" for="name">Nombre</label>
                                <input type="text" v-model="props.modelAlly.name" name="name" id="name"
                                    class="input-box" placeholder="Nombre" minlength="1" maxlength="80"
                                    :class="{ 'input-error': props.errors?.ally_name }">
                                <p v-for="(msg, i) in props.errors?.ally_name ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="form-group">
                                <label class="label-bold" for="document_issue_country_id">País</label>
                                <SearchSelect v-model="props.modelAlly.country_id" :options="countries" optionKey="name"
                                    :displayFormatter="opt => `${opt.emoji} ${opt.name}`" valueKey="id"
                                    name="document_issue_country_id" id="document_issue_country_id" placeholder="País"
                                    :error="!!props.errors?.ally_country_id" />
                                <p v-for="(msg, i) in props.errors?.ally_country_id ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="form-group">
                                <label class="label-bold">Días laborales</label>
                                <SelectCheckMultiple :options="[
                                    { day: 1, name: 'Lunes' },
                                    { day: 2, name: 'Martes' },
                                    { day: 3, name: 'Miércoles' },
                                    { day: 4, name: 'Jueves' },
                                    { day: 5, name: 'Viernes' },
                                    { day: 6, name: 'Sábado' },
                                    { day: 7, name: 'Domingo' }
                                ]" optionKey="name" valueKey="day" v-model="props.modelAlly.work.days"
                                    placeholder="Días laborales"
                                    :error="!!props.errors?.ally_days" />
                                <p v-if="props.errors?.ally_days" class="error-text">
                                    {{ props.errors.ally_days[0] }}
                                </p>
                            </div>

                            <div class="form-group">
                                <label class="label-bold" for="description">Descripción</label>
                                <div class="textarea-wrapper">
                                    <textarea v-model="props.modelAlly.description" class="text-area"
                                        placeholder="Descripción" maxlength="500"
                                        :class="{ 'input-error': props.errors?.ally_description }"></textarea>
                                    <div :class="{ 'display-data': props.errors?.ally_description }">
                                        <div v-if="props.errors?.ally_description" class="error-text">
                                            {{ props.errors?.ally_description[0] }}
                                        </div>
                                        <div class="char-limit-text">
                                            ({{ (props.modelAlly.description || '').length }}/500)
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="checkbox-grid">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelAlly.work.holidays" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Trabajar los festivos</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitAllyStore', props.modelAlly)">Guardar</button>
                </footer>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos modal */
.modal-container {
    padding: 10px;
    background-color: #eee;
    border-radius: 18px;
}

/* bloque superior: 2x2 */
.grid-top {
    display: grid;
    gap: 7px;
}

/* filas que deben ocupar todo el ancho (textarea, separador, etc.) */
.row-span-2 {
    grid-column: 1 / -1;
}

/* bloque posterior al hr en una sola columna */
.post-hr {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
}

/* Evita alturas fijas dentro del body */
.content-container {
    display: grid;
    gap: 10px;
}

/* Caja del modal: crece con contenido hasta un tope y luego scroll en body */
.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 500px;
    width: 90vw;
    height: 100%;
    max-height: 800px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>