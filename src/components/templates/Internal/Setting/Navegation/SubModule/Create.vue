<script setup>
import { onMounted, onUnmounted } from "vue";
import { useModuleStore } from '@/stores/moduleStore';

const props = defineProps({
    modelSubmodule: Object,
    models: Array,
    roles: Array,
    permissions: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})
console.log(props.roles)
const emit = defineEmits(['update:modelSubmodule', 'closeModals', 'submitSubmoduleStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")

const selectModel = () => {
    if (props.modelSubmodule.model_type === '' || props.modelSubmodule.model_type === null || props.modelSubmodule.model_type === undefined) {
        props.modelSubmodule.model_id = null;
    } else if (props.modelSubmodule.model_type === 'App\\Models\\Module') {
        props.modelSubmodule.model_id = useModuleStore().selectedId;
    }
}

const selectType = () => {
    if (props.modelSubmodule.type === 'Desplegable') {
        props.modelSubmodule.role_id = null;
        props.modelSubmodule.permission_id = null;
        props.modelSubmodule.route = null;
    }
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <div class="modal-header">
                    <h1 class="modal-title">Crear submódulo</h1>
                </div>

                <section class="modal-body">
                    <div class="content-container">

                        <div class="">
                            <label class="label-bold" for="name">Nombre</label>
                            <input v-model="props.modelSubmodule.name" type="text" name="name" id="name"
                                class="input-box" placeholder="Nombre" :class="{ 'input-error': props.errors?.name }">
                            <p v-if="props.errors?.name" class="error-text">
                                {{ props.errors.name[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold">Asignado a</label>
                            <SearchSelect v-model="props.modelSubmodule.model_type"
                                :options="[{ 'option': 'Modulo', 'value': 'App\\Models\\Module' }, { 'option': 'Submodulo', 'value': 'App\\Models\\Submodule' }]"
                                optionKey="option" valueKey="value" placeholder="Asignado a" @select="selectModel" :error="props.errors.model_type" />
                            <p v-if="props.errors?.model_type" class="error-text">
                                {{ props.errors.model_type[0] }}
                            </p>
                        </div>

                        <div class="" v-if="props.modelSubmodule.model_type === 'App\\Models\\Submodule'">
                            <label class="label-bold">Submodulo</label>
                            <SearchSelect v-model="props.modelSubmodule.model_id" :options="props.models"
                                optionKey="name" valueKey="id"
                                :displayFormatter="opt => `${opt.model.name} → ${opt.name}`" placeholder="Submodulo"
                                :error="props.errors.model_id" />
                            <p v-if="props.errors?.model_id" class="error-text">
                                {{ props.errors.model_id[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold">Tipo</label>
                            <SearchSelect v-model="props.modelSubmodule.type"
                                :options="[{ 'option': 'Desplegable', 'value': 'Desplegable' }, { 'option': 'Vista', 'value': 'Vista' }]"
                                optionKey="option" valueKey="value" placeholder="Tipo" @select="selectType" :error="props.errors.type" />
                            <p v-if="props.errors?.type" class="error-text">
                                {{ props.errors.type[0] }}
                            </p>
                        </div>

                        <div class="" v-if="props.modelSubmodule.type != 'Desplegable'">
                            <label class="label-bold">Rol</label>
                            <SearchSelect v-model="props.modelSubmodule.role_id" :options="props.roles"
                                optionKey="title" valueKey="id" placeholder="Rol" :error="props.errors.role_id" />
                            <p v-if="props.errors?.role_id" class="error-text">
                                {{ props.errors.role_id[0] }}
                            </p>
                        </div>

                        <div class="" v-if="props.modelSubmodule.type != 'Desplegable'">
                            <label class="label-bold">Permiso</label>
                            <SearchSelect v-model="props.modelSubmodule.permission_id" :options="props.permissions"
                                optionKey="title" valueKey="id" placeholder="Permiso" :error="props.errors.permission_id" />
                            <p v-if="props.errors?.permission_id" class="error-text">
                                {{ props.errors.permission_id[0] }}
                            </p>
                        </div>

                        <div class="" v-if="props.modelSubmodule.type != 'Desplegable'">
                            <label class="label-bold" for="route">Ruta</label>
                            <input v-model="props.modelSubmodule.route" type="text" name="route" id="route"
                                class="input-box" placeholder="Ruta" maxlength="255" 
                                :class="{'input-error' : props.errors.route}">
                            <p v-if="props.errors?.route" class="error-text">
                                {{ props.errors.route[0] }}
                            </p>
                        </div>

                        <div class="">
                            <label class="label-bold" for="icon">Icono</label>
                            <input v-model="props.modelSubmodule.icon" type="text" name="icon" id="icon"
                                class="input-box" placeholder="Icono" :class="{ 'input-error': props.errors?.icon }">
                            <p v-if="props.errors?.icon" class="error-text">
                                {{ props.errors.icon[0] }}
                            </p>
                        </div>
                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer" style="display: flex; justify-content: center;">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitSubmoduleStore', props.modelSubmodule)">Guardar</button>
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px 10px;
    /* altura fija para controlar tamaño */
}

@media (max-width: 600px) {
    .content-container {
        grid-template-columns: 1fr;
    }
}
</style>