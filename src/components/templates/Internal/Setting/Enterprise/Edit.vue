<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelEnterprise: Object,
    errors: {
        type: Object,
        default: () => ({})
    }
})
console.log(props.modelEnterprise)
const emit = defineEmits(['update:modelEnterprise', 'closeModals', 'submitEnterpriseUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar empresa</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Registre la información requerida
                    </div>
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">
                        <div class="">
                            <label class="label-bold" for="name">Nombre comercial</label>
                            <input type="text" v-model="props.modelEnterprise.name" name="name" id="name"
                                class="input-box" placeholder="Nombre comercial" minlength="1" maxlength="80"
                                :class="{ 'input-error': props.errors?.name }">
                            <p v-for="(msg, i) in props.errors?.name ?? []" :key="'type-' + i" class="error-text">
                                {{ msg }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="logo">Logo</label>
                            <FileUpload v-model="props.modelEnterprise.logo" :types="['JPG', 'JPEG', 'PNG']"
                                :current-file-name="props.modelEnterprise.logo_name" dimMin="100x100" dimMax="2000x2000"
                                id="logo" :multiple="false" accept="image/png, image/jpeg"
                                :error="props.errors?.logo" />
                            <p v-if="(props.errors?.logo?.length ?? 0) > 0" class="error-text">
                                {{ props.errors.logo[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="description">Descripción (opcional)</label>
                            <div class="textarea-wrapper">
                                <textarea v-model="props.modelEnterprise.description" name="description"
                                    id="description" placeholder="Descripción" maxlength="255" class="text-area"
                                    :class="{ 'input-error': props.errors?.description }"></textarea>
                                <p v-for="(msg, i) in props.errors?.description ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                                <div class="char-limit-text">({{ (props.modelEnterprise.description || '').length
                                }}/255)
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <hr class="divider-model">
                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitEnterpriseUpdate', props.modelEnterprise)">Guardar</button>
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