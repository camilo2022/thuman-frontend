<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelApplication: Object,
})

const emit = defineEmits(["close-modals",'submitApplicationRejected']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Autorización</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">

                        <div class="">
                            <div class="textarea-wrapper">
                                <label class="label-bold" for="observation">Observación</label>
                                <textarea v-model="props.modelApplication.observation" name="observation" id="observation" placeholder="Observación" 
                                    maxlength="500" class="text-area"></textarea>
                                <div class="char-limit-text">({{props.modelApplication.observation.length}}/500)</div>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary"
                        @click="emit('close-modals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitApplicationRejected')">Guardar</button>
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
    max-width: 450px;
    width: 90vw;
    height: 100%;
    max-height: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.content-container {
    display: flex;
    gap: 10px;
    /* altura fija para controlar tamaño */
}
</style>