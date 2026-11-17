<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelDocumentType: Object,
    personTypes: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

function formatSentences(text) {
    if (!text) return "";
    text = text.toLowerCase();
    // NO usar trim aquí → respeta espacios del usuario
    return text.replace(/(^\s*[a-záéíóúñ])|([.?!]\s+[a-záéíóúñ])/gi, match => {
        return match.toUpperCase();
    });
}

const emit = defineEmits(['update:modelDocumentType', 'closeModals', 'submitDocumentTypeUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar tipo de documento</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container">

                        <!-- 2x2 -->
                        <div class="grid-top">
                            <div class="">
                                <label class="label-bold" for="person_type_id">Tipo de Persona</label>
                                <SearchSelect v-model="props.modelDocumentType.person_type_id"
                                    :options="props.personTypes" optionKey="name" valueKey="id" name="person_type_id"
                                    id="person_type_id" placeholder="Tipo de persona" :disabled
                                    :error="!!props.errors?.documentType_person_type_id">
                                </SearchSelect>
                                <p v-for="(msg, i) in props.errors?.documentType_person_type_id ?? []"
                                    :key="'type-' + i" class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div>
                                <label class="label-bold" for="name">Nombre</label>
                                <input type="text" v-model="props.modelDocumentType.name" name="name" id="name"
                                    class="input-box" placeholder="Nombre" maxlength="80"
                                    :class="{ 'input-error': props.errors?.documentType_name }">
                                <p v-for="(msg, i) in props.errors?.documentType_name ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div>
                                <label class="label-bold" for="initials">Sigla</label>
                                <input type="text" v-model="props.modelDocumentType.settings.abreviature" maxlength="10"
                                    name="initials" id="initials" class="input-box" placeholder="Sigla"
                                    :class="{ 'input-error': props.errors?.documentType_abreviature }">
                                <p v-for="(msg, i) in props.errors?.documentType_abreviature ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="">
                                <label class="label-bold" for="description">Descripción</label>
                                <div class="textarea-wrapper">
                                    <textarea v-model="props.modelDocumentType.description" name="description"
                                        id="description" placeholder="Descripción" maxlength="500" rows="5"
                                        class="text-area"
                                        @input="props.modelDocumentType.description = formatSentences(props.modelDocumentType.description)"
                                        :class="{ 'input-error': props.errors?.documentType_description }"></textarea>
                                    <div :class="{ 'display-data': props.errors?.documentType_description }">
                                        <p v-if="props.errors?.documentType_description" class="error-text">
                                            {{ props.errors?.documentType_description[0] }}
                                        </p>

                                        <div class="char-limit-text">
                                            ({{ (props.modelDocumentType.description || '').length }}/500)
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
                    <button class="btn btn-primary"
                        @click="emit('submitDocumentTypeUpdate', props.modelDocumentType)">Guardar</button>
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
    gap: 7px 0;
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