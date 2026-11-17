<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelCampaign: Object,
    departaments: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelCampaign', 'closeModals', 'submitCampaignStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Crear campaña</h1>
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
                                <input type="text" v-model="props.modelCampaign.name" name="name" id="name"
                                    class="input-box" placeholder="Nombre" minlength="1" maxlength="80"
                                    :class="{ 'input-error': props.errors?.campaign_name }">
                                <p v-for="(msg, i) in props.errors?.campaign_name ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="">
                                <label class="label-bold" for="description">Descripción</label>
                                <div class="textarea-wrapper">
                                    <textarea v-model="props.modelCampaign.description" class="text-area"
                                        placeholder="Descripción" maxlength="500"
                                        :class="{ 'input-error': props.errors?.campaign_description }"></textarea>
                                    <div :class="{ 'display-data': props.errors?.campaign_description }">
                                        <div v-if="props.errors?.campaign_description" class="error-text">
                                            {{ props.errors?.campaign_description[0] }}
                                        </div>
                                        <div class="char-limit-text">
                                            ({{ (props.modelCampaign.description || '').length }}/500)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitCampaignStore', props.modelCampaign)">Guardar</button>
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