<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelSkill: Object,
    skillTypes: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelSkill', 'closeModals', 'submitSkillUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Editar habilidad</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Registre la información requerida
                    </div>
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">

                        <div class="">
                            <label class="label-bold" for="name">Nombre</label>
                            <input type="text" v-model="props.modelSkill.name" name="name" id="name" class="input-box"
                                placeholder="Nombre" :class="{ 'input-error': props.errors?.name }" maxlength="80">
                            <p v-for="(msg, i) in props.errors?.name ?? []" :key="'type-' + i" class="error-text">
                                {{ msg }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="skill_type_id">Categoría</label>
                            <SearchSelect v-model="props.modelSkill.skill_type_id" :options="props.skillTypes"
                                optionKey="name" valueKey="id" name="skill_type_id" id="skill_type_id"
                                placeholder="Categoría" :error="!!props.errors?.skill_type_id">
                            </SearchSelect>
                            <p v-for="(msg, i) in props.errors?.skill_type_id ?? []" :key="'type-' + i"
                                class="error-text">
                                {{ msg }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="description">Descripción (Opcional)</label>
                            <div class="textarea-wrapper">
                                <textarea v-model="props.modelSkill.description" name="description" id="description"
                                    placeholder="Descripción" maxlength="500" rows="5" class="text-area"
                                    :class="{ 'input-error': props.errors?.description }"></textarea>
                                <p v-for="(msg, i) in props.errors?.description ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                                <div class="char-limit-text">({{ (props.modelSkill.description || '').length }}/500)
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitSkillUpdate', props.modelSkill)">Guardar</button>
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
    max-height: 700px;
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