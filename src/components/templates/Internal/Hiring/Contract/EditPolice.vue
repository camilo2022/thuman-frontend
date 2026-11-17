<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    model: Object
})

const emit = defineEmits(['closeModals', 'submitAreaStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar póliza</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="content-container" style="display: grid; grid-template-columns: 1fr 1fr;">

                        <div class="">
                            <label class="label-bold" for="name">Código</label>
                            <input type="text" name="name" id="name" class="input-box" placeholder="Código">
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Aseguradora</label>
                            <SearchSelect class="select-duo" :options="[]" optionKey="settings.abreviature"
                                valueKey="id" name="entity_type_id" id="entity_type_id" placeholder="Aseguradora" />
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Tipo</label>
                            <SearchSelect class="select-duo" :options="[]" optionKey="settings.abreviature"
                                valueKey="id" name="entity_type_id" id="entity_type_id" placeholder="Tipo" />
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Número de póliza</label>
                            <input type="text" name="name" id="name" class="input-box" placeholder="Número de póliza">
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Valor</label>
                            <input type="text" name="name" id="name" class="input-box" placeholder="Valor">
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Valor asegurado</label>
                            <input type="text" name="name" id="name" class="input-box" placeholder="Número de póliza">
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Fecha inicio</label>
                            <input type="date" name="name" id="name" class="input-box" placeholder="Fecha inicio">
                        </div>

                        <div class="">
                            <label class="label-bold" for="name">Fecha fin</label>
                            <input type="date" name="name" id="name" class="input-box" placeholder="Fecha fin">
                        </div>

                        <div class="full-width">
                            <label class="label-bold" for="extra">Archivo</label>
                            <FileUpload id="icon" :multiple="false" accept="image/png, image/jpeg" />
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer" style="display: flex; justify-content: center;">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitAreaStore', props.modelArea)">Guardar</button>
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
    max-width: 600px;
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

.full-width {
    grid-column: span 2;
}

.content-container {
    display: grid;
    gap: 14px;
    padding-bottom: 20px;
    /* evita que quede pegado */
}
</style>