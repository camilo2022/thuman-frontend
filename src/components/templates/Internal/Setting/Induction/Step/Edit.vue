<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelStep: Object,
    forms: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelStep', 'closeModals', 'submitStepUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <div class="modal-header">
                    <h1 class="modal-title">Editar video</h1>
                </div>
                <section class="modal-body">
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">
                        <div class="">
                            <label class="label-bold" for="name">Nombre</label>
                            <input type="text" v-model="props.modelStep.name" name="name" id="name" class="input-box"
                                placeholder="Nombre" maxlength="255" :class="{ 'input-error': props.errors?.step_name }">
                            <p v-if="props.errors?.step_name" class="error-text">
                                {{ props.errors.step_name[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Video</label>
                            <FileUpload id="icon" v-model="props.modelStep.video.file" :multiple="false"
                                accept="video/mp4" :types="['MP4']" :maxSize="20" :error="props.errors?.step_file" />
                            <p v-if="props.errors?.step_file" class="error-text">
                                {{ props.errors.step_file[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Encuesta</label>
                            <SearchSelect v-model="props.modelStep.form_id" :options="props.forms"
                                optionKey="questions.title" valueKey="id" placeholder="Encuesta"
                                :error="props.errors?.step_form_id" />
                            <p v-if="props.errors?.step_form_id" class="error-text">
                                {{ props.errors.step_form_id[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="description">Descripción</label>
                            <div class="textarea-wrapper">
                                <textarea class="text-area" placeholder="Descripción"
                                    v-model="props.modelStep.description" maxlength="500"
                                    :class="{ 'input-error': props.errors?.step_description }"></textarea>

                                <div :class="{ 'display-data': props.errors?.step_description }">
                                    <p v-if="props.errors?.step_description" class="error-text">
                                        {{ props.errors?.step_description[0] }}
                                    </p>

                                    <div class="char-limit-text">
                                        ({{ (props.modelStep.description || '').length }}/500)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer" style="display: flex; justify-content: center;">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitStepUpdate', props.modelStep)">Guardar</button>
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

.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 500px;
    width: 90vw;
    height: 100%;
    max-height: 600px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.content-container {
    display: flex;
    gap: 2px;
    /* altura fija para controlar tamaño */
}
</style>