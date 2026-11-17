<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelInduction: Object,
    enterprises: Array,
    entities: Array,
    headquarters: Array,
    areas: Array,
    positions: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelInduction', 'closeModals', 'submitInductionUpdate']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <div class="modal-header">
                    <h1 class="modal-title">Editar inducción</h1>
                </div>

                <section class="modal-body">
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">

                        <div class="content-data">
                            <div class="">
                                <label class="label-bold" for="name">Nombre</label>
                                <input type="text" v-model="props.modelInduction.name" name="name" id="name"
                                    class="input-box" placeholder="Nombre" maxlength="255"
                                    :class="{ 'input-error': props.errors?.induction_name }">
                                <p v-if="props.errors?.induction_name" class="error-text">
                                    {{ props.errors.induction_name[0] }}
                                </p>
                            </div>

                            <div class="">
                                <label class="label-bold" for="name">Dirigido a</label>
                                <SearchSelect v-model="props.modelInduction.assignable_type" :options="[
                                    { model: 'App\\Models\\Enterprise', name: 'Empresa' },
                                    { model: 'App\\Models\\Entity', name: 'Entidad' },
                                    { model: 'App\\Models\\Headquarter', name: 'Sede' }
                                ]" optionKey="name" valueKey="model" placeholder="Dirigido a" />
                            </div>

                            <div class=""
                                v-if="['App\\Models\\Enterprise', 'App\\Models\\Entity', 'App\\Models\\Headquarter'].includes(props.modelInduction.assignable_type)">
                                <label class="label-bold" for="name">Empresas</label>
                                <SearchSelect v-model="props.modelInduction.enterprise_id" :options="props.enterprises"
                                    optionKey="name" valueKey="id" placeholder="Empresas" />
                            </div>

                            <div class=""
                                v-if="['App\\Models\\Headquarter', 'App\\Models\\Entity'].includes(props.modelInduction.assignable_type)">
                                <label class="label-bold" for="name">Entidades</label>
                                <SearchSelect v-model="props.modelInduction.entity_id" :options="props.entities"
                                    :displayFormatter="opt => `${opt.name} ${opt.entity_type?.settings?.abreviature}`"
                                    optionKey="name" valueKey="id" placeholder="Entidades" />
                            </div>

                            <div class=""
                                v-if="['App\\Models\\Headquarter'].includes(props.modelInduction.assignable_type)">
                                <label class="label-bold" for="name">Sedes</label>
                                <SearchSelect v-model="props.modelInduction.headquarter_id"
                                    :options="props.headquarters" optionKey="name" valueKey="id" placeholder="Sedes" />
                            </div>

                            <div class="">
                                <label class="label-bold" for="name">Área</label>
                                <SearchSelect v-model="props.modelInduction.area_id" :options="props.areas"
                                    optionKey="name" valueKey="id" placeholder="Área" />
                            </div>

                            <div class="">
                                <label class="label-bold" for="name">Cargo</label>
                                <SearchSelect v-model="props.modelInduction.position_id" :options="props.positions"
                                    optionKey="name" valueKey="id" placeholder="Cargo" />
                            </div>
                        </div>

                        <div class="">
                            <label class="label-bold" for="description">Descripción</label>
                            <div class="textarea-wrapper">
                                <textarea class="text-area" v-model="props.modelInduction.description" maxlength="500"
                                    placeholder="Descripción"
                                    :class="{ 'input-error': props.errors?.induction_description }"></textarea>
                                <div :class="{ 'display-data': props.errors?.induction_description }">
                                    <div v-if="props.errors?.induction_description" class="error-text">
                                        {{ props.errors?.induction_description[0] }}
                                    </div>
                                    <div class="char-limit-text">
                                        ({{ (props.modelInduction.description || '').length }}/500)
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer" style="display: flex; justify-content: center;">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitInductionUpdate', props.modelInduction)">Guardar</button>
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
    gap: 7px;
    /* altura fija para controlar tamaño */
}

.content-data {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 7px 10px;
}

@media (max-width: 570px) {
    .content-data {
        grid-template-columns: 1fr;
    }
}
</style>