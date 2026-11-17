<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelTerminationType: Object,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['submitTerminationTypeUpdate', 'closeModals']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar tipo de terminación de contrato</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Registre la información requerida
                    </div>
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">

                        <div class="">
                            <label class="label-bold" for="name">Nombre</label>
                            <div class="input-wrapper">
                                <input type="text" v-model="props.modelTerminationType.name" name="name" id="name"
                                    class="input-box" :class="{ 'input-error': props.errors?.terminationType_name }"
                                    placeholder="Nombre" maxlength="80" />
                            </div>
                            <p v-for="(msg, i) in props.errors?.terminationType_name ?? []" :key="'type-' + i"
                                class="error-text">{{ msg }}</p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="description">Descripción (Opcional)</label>
                            <div class="textarea-wrapper">
                                <textarea v-model="props.modelTerminationType.description" name="description"
                                    id="description" placeholder="Descripción" maxlength="500" rows="5"
                                    class="text-area"
                                    :class="{ 'input-error': props.errors?.terminationType_description }"></textarea>
                                <div :class="{ 'display-data': props.errors?.terminationType_description }">
                                    <p v-for="(msg, i) in props.errors?.terminationType_description ?? []"
                                        :key="'type-' + i" class="error-text">{{ msg }}</p>
                                    <div class="char-limit-text">({{ (props.modelTerminationType.description ||
                                        '').length
                                    }}/500)
                                    </div>
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
                        @click="emit('submitTerminationTypeUpdate', 'data')">Guardar</button>
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