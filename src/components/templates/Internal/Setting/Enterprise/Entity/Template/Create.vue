<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelTemplate: Object,
    fileTypes: Array,
    fileSubtypes: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelTemplate', 'closeModals', 'submitTemplateStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <!-- <h1 class="modal-title">Crear documento</h1> -->
                    <h1 class="modal-title">Crear plantilla</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container">
                        <!-- 2x2 -->
                        <div class="grid-top">
                            <div class="input-group">
                                <label class="label-bold">Tipo de archivo</label>
                                <SearchSelect v-model="props.modelTemplate.file_type_id" :options="props.fileTypes"
                                    optionKey="name" valueKey="id" name="file_type_id" id="file_type_id"
                                    placeholder="Tipo de archivo" :error="!!props.errors?.modelTemplate_file_type_id" />
                                <p v-if="props.errors?.modelTemplate_file_type_id?.length" class="error-text">
                                    {{ props.errors.modelTemplate_file_type_id[0] }}
                                </p>

                            </div>

                            <div class="input-group">
                                <label class="label-bold">Subtipo de archivo</label>
                                <SearchSelect v-model="props.modelTemplate.file_subtype_id"
                                    :options="props.fileSubtypes" optionKey="name" valueKey="id" name="file_subtype_id"
                                    id="file_subtype_id" placeholder="Subtipo de archivo"
                                    :error="!!props.errors?.modelTemplate_file_subtype_id" />
                                <p v-if="props.errors?.modelTemplate_file_subtype_id?.length" class="error-text">
                                    {{ props.errors.modelTemplate_file_subtype_id[0] }}
                                </p>
                            </div>

                            <div class="">
                                <label class="label-bold" for="file">Plantilla</label>
                                <FileUpload v-model="props.modelTemplate.file" id="file" :multiple="false"
                                    dimMin="800x1000" dimMax="2000x2600" accept=".pdf, .png, .jpg, .jpeg, .doc, .docx"
                                    :error="!!props.errors?.modelTemplate_file" />
                                <p v-if="props.errors?.modelTemplate_file?.length" class="error-text">
                                    {{ props.errors.modelTemplate_file[0] }}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitTemplateStore', props.modelTemplate)">Guardar</button>
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
    gap: 10px;
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