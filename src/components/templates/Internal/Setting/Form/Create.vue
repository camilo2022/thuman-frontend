<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { SurveyCreatorComponent } from "survey-creator-vue";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

const props = defineProps({
    creator: { type: Object, required: true },
    showSettingFullScreen: Boolean,
    modelForm: Object,
    enterprises: Array,
    entities: Array,
    headquarters: Array,
    formTypes: Array,
    areas: Array,
    positions: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['fullScreen', 'index', 'submitFormStore'])

const agendCollapsed = ref(false);

watch(
    () => props.errors,
    (errors) => {
        if (!errors || Object.keys(errors).length === 0) return;

        const creator = props.creator;
        if (!creator) return;

        let showDesigner = false;

        // 🔴 Falta título
        if (errors["questions_title"]) {
            creator.notify(
                "El formulario debe tener un título.",
                "error"
            );
            showDesigner = true;
        }

        // 🔴 No hay preguntas / páginas vacías
        if (errors["questions_pages"] || errors["questions_questions"]) {
            creator.notify(
                "El formulario debe tener al menos una pregunta.",
                "error"
            );
            showDesigner = true;
        }

        if (errors["questions_open_required"]) {
            creator.notify(
                "Este formulario requiere al menos una pregunta abierta.",
                "error"
            );
            showDesigner = true;
        }

        if (errors["questions_rating_required"]) {
            creator.notify(
                "Este formulario requiere al menos una pregunta de calificación del 1 al 5.",
                "error"
            );
            showDesigner = true;
        }

        if (errors["questions_open_max"]) {
            creator.notify(
                "Este formulario solo permite una pregunta abierta.",
                "error"
            );
            showDesigner = true;
        }

        if (errors["questions_rating_max"]) {
            creator.notify(
                "Este formulario solo permite una pregunta de calificación del 1 al 5.",
                "error"
            );
            showDesigner = true;
        }

        if (showDesigner) {
            creator.makeNewViewActive("designer");
        }
    },
    { immediate: true, deep: true }
);


</script>

<template>
    <div :class="!props.showSettingFullScreen ? '' : 'creator-full'">
        <div class="breadcrumb">
            <button type="button" class="crumb-back" @click="emit('index')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                    <path
                        d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                    </path>
                </svg>
                <span>Volver</span>
            </button>
            <span>|</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
                </path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path
                    d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                    fill="#5B4CD0" />
            </svg>
            <span>Configuración</span>
            <span>|</span>
            <span>Formulario</span>
            <span>|</span>
            <span class="active">Crear formulario</span>
        </div>
        <div :class="!props.showSettingFullScreen ? 'container-data' : ''"
            :style="props.showSettingFullScreen ? 'width:100%;height:100%;' : ''">
            <div class="main-container">

                <h2 class="titulo" v-if="!props.showSettingFullScreen">Crear formulario</h2>

                <div class="form-container agend-card" :class="{ 'is-collapsed': agendCollapsed }"
                    v-if="!props.showSettingFullScreen">
                    <div class="form-section">
                        <div class="section-title-row">
                            <div class="section-title-acordion">Configuración de formulario</div>
                            <button class="collapse-btn" @click="agendCollapsed = !agendCollapsed"
                                :aria-expanded="!agendCollapsed" :title="agendCollapsed ? 'Expandir' : 'Contraer'">
                                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0" stroke-width="1.8" />
                                    <path class="chev" :class="{ rotated: !agendCollapsed }" d="M10 8 L14 12 L10 16"
                                        fill="none" stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <transition>

                            <div v-show="!agendCollapsed" class="agend-content">
                                <div class="form-section">
                                    <div class="legal-fiscal-row">
                                        <div class="input-group">
                                            <label class="label-bold">Tipo de formulario</label>
                                            <SearchSelect v-model="props.modelForm.form_type_id"
                                                :options="props.formTypes" optionKey="name" valueKey="id"
                                                name="form_type_id" id="form_type_id" placeholder="Tipo de formulario"
                                                :error="!!props.errors?.questions_form_type_id" />
                                            <p v-for="(msg, i) in props.errors?.questions_form_type_id ?? []"
                                                :key="'type-' + i" class="error-text">
                                                {{ msg }}
                                            </p>
                                        </div>
                                        <div class="">
                                            <label class="label-bold" for="name">Dirigido a</label>
                                            <SearchSelect v-model="props.modelForm.assignable_type" :options="[
                                                { model: 'App\\Models\\Enterprise', name: 'Empresa' },
                                                { model: 'App\\Models\\Entity', name: 'Entidad' },
                                                { model: 'App\\Models\\Headquarter', name: 'Sede' }
                                            ]" optionKey="name" valueKey="model" placeholder="Dirigido a" />
                                        </div>
                                        <div class=""
                                            v-if="['App\\Models\\Enterprise', 'App\\Models\\Entity', 'App\\Models\\Headquarter'].includes(props.modelForm.assignable_type)">
                                            <label class="label-bold" for="name">Empresas</label>
                                            <SearchSelect v-model="props.modelForm.enterprise_id"
                                                :options="props.enterprises" optionKey="name" valueKey="id"
                                                placeholder="Empresas" />
                                        </div>

                                        <div class=""
                                            v-if="['App\\Models\\Headquarter', 'App\\Models\\Entity'].includes(props.modelForm.assignable_type)">
                                            <label class="label-bold" for="name">Entidades</label>
                                            <SearchSelect v-model="props.modelForm.entity_id"
                                                :options="props.entities"
                                                :displayFormatter="opt => `${opt.name} ${opt.entity_type?.settings?.abreviature}`"
                                                optionKey="name" valueKey="id" placeholder="Entidades" />
                                        </div>

                                        <div class=""
                                            v-if="['App\\Models\\Headquarter'].includes(props.modelForm.assignable_type)">
                                            <label class="label-bold" for="name">Sedes</label>
                                            <SearchSelect v-model="props.modelForm.headquarter_id"
                                                :options="props.headquarters" optionKey="name" valueKey="id"
                                                placeholder="Sedes" />
                                        </div>
                                    </div>
                                    <div class="legal-fiscal-row">
                                        <div class="input-group">
                                            <label class="label-bold">Área</label>
                                            <SearchSelect v-model="props.modelForm.area_id" :options="props.areas"
                                                optionKey="name" valueKey="id" name="area_id" id="area_id"
                                                placeholder="Área" :error="!!props.errors?.questions_area_id" />
                                            <p v-for="(msg, i) in props.errors?.questions_area_id ?? []"
                                                :key="'type-' + i" class="error-text">
                                                {{ msg }}
                                            </p>
                                        </div>
                                        <div class="input-group">
                                            <label class="label-bold">Cargo</label>
                                            <SearchSelect v-model="props.modelForm.position_id"
                                                :options="props.positions" optionKey="name" valueKey="id"
                                                name="position_id" id="position_id" placeholder="Cargo"
                                                :error="!!props.errors?.questions_position_id" />
                                            <p v-for="(msg, i) in props.errors?.questions_position_id ?? []"
                                                :key="'type-' + i" class="error-text">
                                                {{ msg }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <SurveyCreatorComponent :model="props.creator" />
                <P v-for="(msg, i) in props.errors?.creator ?? []" :key="'type-' + i" class="error-text">
                    {{ msg }}
                </P>

                <div class="form-buttons" v-if="!props.showSettingFullScreen">
                    <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                    <button class="btn-primary" @click="emit('submitFormStore')">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.label {
    font: 600 12px/1 Poppins, sans-serif;
    color: #2B2C34;
}

.label-bold {
    font: 700 12px/1 Poppins, sans-serif;
    color: #2B2C34;
}

/* Grupo de inputs */
.input-group {
    min-width: 0;
    /* <-- clave para que el contenido no empuje al grid */
    width: 100%;
}

.legal-fiscal-row,
.rep-legal-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
}

.section-title-acordion {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
}

.collapse-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.collapse-btn svg {
    display: block;
}

.collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

/* Cuando está expandido, rota el chevron para apuntar hacia abajo */
.collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

/* (Opcional) Hover sutil */
.collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

.form-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #E3DFFF;
    box-shadow: 0 2px 8px rgba(91, 76, 208, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.agend-card {
    transition: padding .22s ease, margin .22s ease, box-shadow .22s ease, border-color .22s ease, background-color .22s ease;
}

/* Cuando está colapsado: menos padding inferior, sombra más sutil, borde un pelín más claro */
.agend-card.is-collapsed {
    padding-bottom: 12px;
    /* antes tenía 20px */
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}

.section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

.titulo {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #222;
}

.creator-full {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 9999;
}

.actions {
    margin: auto;
    align-items: center;
    justify-content: flex-end;
    display: flex;
    gap: 12px;
}

.actions svg {
    cursor: pointer;
}
</style>