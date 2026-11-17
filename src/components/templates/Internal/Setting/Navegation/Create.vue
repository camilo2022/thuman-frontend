<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelModule: Object
})

const emit = defineEmits(['update:modelModule', 'closeModals', 'submitModuleStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <div class="modal-header">
                    <h1 class="modal-title">Crear módulo</h1>
                </div>

                <section class="modal-body">
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">

                        <div class="">
                            <label class="label-bold" for="name">Nombre</label>
                            <input v-model="props.modelModule.name" type="text" name="name" id="name" class="input-box" placeholder="Nombre">
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Entorno</label>
                            <SearchSelect v-model="props.modelModule.type" :options="[{'option': 'Interno', 'value': 'Interno'}, {'option': 'Externo', 'value': 'Externo'}]"
                                optionKey="option" valueKey="value" placeholder="Entorno" />
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Ruta</label>
                            <input v-model="props.modelModule.route" type="text" name="route" id="route" class="input-box" placeholder="Ruta">
                        </div>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitModuleStore', props.modelModule)">Guardar</button>
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
    gap: 10px;
    /* altura fija para controlar tamaño */
}
</style>