<script setup>
import { computed } from 'vue'
import imgEnterprise from '@/assets/img/ENTERPRISE-ARCHITECTURE.gif'
import imgGroup from '@/assets/img/GROUP.gif'

const props = defineProps({
    loadingDetail: Boolean,
    model: Object,
    responsabilities: Array,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
})

const emit = defineEmits(['close', 'close-detail'])

/* ===== Utils ===== */
const formatCOP = (value) => {
    if (value == null || value == 0) return null;
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });
};

const isFormReady = computed(() => {
    // considera “listo” cuando dejó de cargar y ya tienes la posición y catálogos mínimos
    const rel = props.model?.relationships
    const catalogsOk =
        Array.isArray(props.academicRequirements) &&
        Array.isArray(props.requiredExperiences) &&
        Array.isArray(props.requiredSkills) &&
        Array.isArray(props.responsabilities)

    return !props.loadingDetail && !!rel?.position && catalogsOk
})
</script>

<template>
    <div>
        <!-- TÍTULO -->
        <div class="vacante">
            <!-- Header -->
            <Transition name="fade">
                <!-- CONTENIDO REAL -->
                <div v-if="isFormReady">
                    <div>
                        <header class="vac-header">
                            <div class="vh-left">
                                <span v-if="props.model?.relationships?.position?.area">
                                    <small class="vh-area wrap-text">{{
                                        props.model?.relationships?.position.area.name || 'Sin área'
                                    }}</small>
                                    <h1 class="vh-title wrap-text">{{
                                        props.model?.relationships?.position.name || 'Sin título'
                                    }}
                                    </h1>
                                    <div class="vh-cat">{{
                                        props.model?.relationships?.position.profile_category.name || 'Sin categoría'
                                    }}
                                    </div>
                                </span>

                                <div class="vh-row">
                                    <span class="vh-meta">
                                        Cierre estimado: {{ props.model?.end_date || 'Sin fecha' }}
                                    </span>
                                </div>

                                <div class="chips">
                                    <span class="chip" v-if="props.model?.relationships?.contract_type">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="furrentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-38.34-85.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L116,164.69l42.34-42.35A8,8,0,0,1,169.66,122.34Z">
                                            </path>
                                        </svg>
                                        {{ props.model?.relationships?.contract_type.name || 'Sin contrato' }}
                                    </span>
                                    <span class="chip">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="furrentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z">
                                            </path>
                                        </svg>
                                        {{ [formatCOP(props.model?.salary_min),
                                        formatCOP(props.model?.salary_max)].filter(Boolean).join(' - ') }}
                                    </span>
                                    <span class="chip" v-if="props.model?.relationships?.headquarter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="furrentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M112,80a16,16,0,1,1,16,16A16,16,0,0,1,112,80ZM64,80a64,64,0,0,1,128,0c0,59.95-57.58,93.54-60,94.95a8,8,0,0,1-7.94,0C121.58,173.54,64,140,64,80Zm16,0c0,42.2,35.84,70.21,48,78.5,12.15-8.28,48-36.3,48-78.5a48,48,0,0,0-96,0Zm122.77,67.63a8,8,0,0,0-5.54,15C213.74,168.74,224,176.92,224,184c0,13.36-36.52,32-96,32s-96-18.64-96-32c0-7.08,10.26-15.26,26.77-21.36a8,8,0,0,0-5.54-15C29.22,156.49,16,169.41,16,184c0,31.18,57.71,48,112,48s112-16.82,112-48C240,169.41,226.78,156.49,202.77,147.63Z">
                                            </path>
                                        </svg>
                                        {{ props.model?.relationships?.headquarter.city.name || 'Sin sede' }}
                                    </span>
                                    <span class="chip" v-if="props.model?.relationships?.headquarter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                            fill="furrentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M240,208h-8V72a8,8,0,0,0-8-8H184V40a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8V96H32a8,8,0,0,0-8,8V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,112H80a8,8,0,0,0,8-8V48h80V72a8,8,0,0,0,8,8h40V208H152V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40H40Zm96,96H120V176h16ZM112,72a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,72Zm0,32a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,104Zm56,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,104ZM88,136a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H80A8,8,0,0,1,88,136Zm0,32a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H80A8,8,0,0,1,88,168Zm24-32a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,136Zm56,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,168Z">
                                            </path>
                                        </svg>
                                        {{ props.model?.relationships?.headquarter.name || 'Sin sede' }}
                                    </span>
                                </div>
                            </div>
                            <hr style="width: 100%; margin-top: 20px;">
                        </header>
                    </div>
                    <!-- Cuerpo: grid 2 columnas -->
                    <div class="vac-grid">
                        <div class="vh-right">
                            <div class="stat">
                                <img :src="imgGroup" alt="Cargando…" width="60" height="60" />
                                <div class="stat-text">Personal requerido: <strong>{{
                                    props.model?.quantity || 0 }}</strong></div>
                            </div>
                            <div class="stat" v-if="props.model?.relationships?.headquarter?.entity?.enterprise">
                                <img :src="imgEnterprise" alt="Cargando…" width="60" height="60" />
                                <div class="stat-text motivo wrap-text">{{
                                    `${props.model?.relationships?.headquarter?.entity?.name}
                                    ${props.model?.relationships?.headquarter?.entity?.entity_type?.settings?.abreviature}`
                                }}
                                </div>
                            </div>
                        </div>
                        <!-- Columna izquierda -->
                        <main class="vac-main">
                            <section class="block">
                                <h3>Descripción</h3>
                                <ul class="bullets">
                                    <p class="wrap-text" style="white-space: pre-line;">{{ props.model?.description ||
                                        props.model?.relationships?.position?.description }}</p>
                                </ul>
                            </section>

                            <section class="block">
                                <h3>Responsabilidades</h3>
                                <div v-if="!props.responsabilities || props.responsabilities.length === 0">
                                    <ul class="bullets">
                                        <li>
                                            Esta vacante no cuenta con responsabilidades requeridas.
                                        </li>
                                    </ul>
                                </div>
                                <div v-else>
                                    <ul class="bullets">
                                        <li v-for="(responsability, index) in props.responsabilities"
                                            :key="responsability.id">
                                            <strong>{{ responsability.name }}</strong>:
                                            {{ responsability.description }}
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section class="block">
                                <h3>Formación / Conocimientos</h3>
                                <div v-if="!props.academicRequirements || props.academicRequirements.length === 0">
                                    <ul class="bullets">
                                        <li>
                                            Esta vacante no cuenta con formaciones requeridas.
                                        </li>
                                    </ul>
                                </div>
                                <div v-else>
                                    <ul class="bullets">
                                        <li v-for="(academicRequirement, index) in props.academicRequirements"
                                            :key="academicRequirement.id">
                                            <strong>{{ academicRequirement.academic_level.name }}</strong>:
                                            {{ academicRequirement.academic_title }}
                                            ({{ academicRequirement.formation_status.name }})
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section class="block">
                                <h3>Experiencia</h3>
                                <div v-if="!props.requiredExperiences || props.requiredExperiences.length === 0">
                                    <ul class="bullets">
                                        <li>
                                            Este perfil de cargo no cuenta con experiencias requeridas.
                                        </li>
                                    </ul>
                                </div>
                                <div v-else>
                                    <ul class="bullets">
                                        <li v-for="(requiredExperience, index) in props.requiredExperiences"
                                            :key="requiredExperience.id">
                                            <strong>{{ `${requiredExperience.name}
                                                (${props.formatTime(requiredExperience.duration_months)})` }}</strong>:
                                            {{ requiredExperience.description }}
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section class="block">

                                <h3>Beneficios</h3>
                                <div>
                                    <div v-if="props.model?.relationships?.benefits.length > 0"
                                        class="benefits-container">
                                        <div class="benefit-card"
                                            v-for="(benefit, index) in props.model?.relationships?.benefits"
                                            :key="benefit.id">
                                            <img v-if="benefit.icon" :src="benefit.icon.path" alt="icono"
                                                class="benefit-icon" style="width: 40px;" />
                                            <span class="tooltip motivo benefit-name"
                                                :data-title="benefit.description">{{ benefit.name
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <!-- Columna derecha -->
                        <aside class="vac-side">
                            <section class="block">
                                <h3>Habilidades</h3>
                            </section>

                            <ul class="bullets">
                                <li>
                                    <h4>Habilidades sociales</h4>
                                </li>
                                <div class="skill-star-wrapper"
                                    v-if="(props.requiredSkills?.filter(s => s.skill_type_id === 21) || []).length > 0">
                                    <div class="skill-star-row"
                                        v-for="(requiredSkill, index) in props.requiredSkills.filter(s => s.skill_type_id === 21)"
                                        :key="requiredSkill.name">
                                        <div class="skill-star-item">
                                            <div class="skill-star-left">
                                                <div class="skill-star-header">
                                                    <span class="skill-star-name">{{ requiredSkill.skill.name }}</span>
                                                </div>

                                                <div class="valoracion">
                                                    <button v-for="n in [5, 4, 3, 2, 1]">
                                                        <svg class="star"
                                                            :class="{ active: requiredSkill.percentage >= n }"
                                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 256 256">
                                                            <path v-if="requiredSkill.percentage >= n"
                                                                d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                            <path v-else
                                                                d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="skill-list" v-else>
                                    <ul class="bullets">
                                        <li>
                                            Esta vacante no cuenta con habilidades sociales requeridas.
                                        </li>
                                    </ul>
                                </div>

                                <li>
                                    <h4>Habilidades técnicas</h4>
                                </li>
                                <div class="skill-list"
                                    v-if="(props.requiredSkills?.filter(s => s.skill_type_id === 22) || []).length > 0">
                                    <div class="skill-row"
                                        v-for="(requiredSkill, index) in props.requiredSkills.filter(s => s.skill_type_id === 22)"
                                        :key="requiredSkill.name">
                                        <div class="skill-item">
                                            <div class="skill-left">
                                                <div class="skill-header">
                                                    <span class="skill-name">{{ requiredSkill.skill.name }}</span>

                                                    <div class="skill-info">
                                                        <span class="skill-level"
                                                            :style="{ backgroundColor: props.currentColor(requiredSkill.percentage) }">
                                                            {{ props.currentLabel(requiredSkill.percentage) }}
                                                        </span>
                                                        <span class="skill-percent">{{ requiredSkill.percentage
                                                        }}%</span>
                                                    </div>
                                                </div>

                                                <input type="range" class="skill-range is-display-only"
                                                    :value="requiredSkill.percentage" min="0" max="100" step="1"
                                                    disabled
                                                    :style="{ background: `linear-gradient(to right, #5b4cd0 ${requiredSkill.percentage}%, #e6e2ff ${requiredSkill.percentage}%)` }" />

                                                <div class="labels">
                                                    <span>Principiante</span><span>Básico</span><span>Intermedio</span><span>Avanzado</span><span>Experto</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="skill-list" v-else>
                                    <ul class="bullets">
                                        <li>
                                            Esta vacante no cuenta con habilidades técnicas requeridas.
                                        </li>
                                    </ul>
                                </div>
                            </ul>
                        </aside>
                    </div>
                </div>
                <div v-else class="card" aria-busy="true" :inert="true"
                    style="padding:15px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);">

                    <!-- Nombre -->
                    <div class="skeleton skel-line" style="width:80%;"></div>
                    <div class="skeleton skel-line" style="width:50%;"></div>

                    <hr style="margin:12px 0;">

                    <!-- Texto inferior -->
                    <div class="skeleton skel-half"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:55%;"></div>
                    <div class="skeleton skel-footer"></div>
                    <div class="skeleton skel-half"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:55%;"></div>
                    <div class="skeleton skel-footer"></div>
                    <div class="skeleton skel-half"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:70%;"></div>
                    <div class="skeleton skel-half" style="width:55%;"></div>
                    <div class="skeleton skel-footer"></div>

                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    position: relative;
    font-size: 12px;
}

.tooltip:hover::after {
    opacity: 1;
}

.benefit-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.sub-titulo {
    font-size: 20px;
    font-weight: 600;
    color: #5b4cd0;
}


.vacante {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .06);
    overflow: hidden;
}

.vh-area {
    font-weight: 700;
}

.vh-cat {
    font-weight: 600;
    font-size: 14px;
}

.vh-row {
    margin-top: 6px
}

.vh-meta {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    color: #000000;
    font-weight: 700;
    font-size: 14px
}

.vh-meta svg {
    width: 18px;
    height: 18px;
    fill: #5b4cd0
}

.chip svg {
    width: 16px;
    height: 16px;
    fill: #5b4cd0
}

.stat-ico {
    width: 60px;
    height: 60px
}

@media (max-width:1100px) {
    .vac-grid {
        grid-template-columns: 1fr
    }

    .vh-right {
        position: static;
        margin-top: 12px
    }
}

/* bloques */
.block+.block {
    margin-top: 18px
}

.block h3,
.block h4 {
    color: #4b3bbf;
    margin: 0 0 8px;
}

.block p {
    font-size: 13px;
}

.bullets li::marker {
    color: #5b4cd0;
    font-size: 18px;
}

/* beneficios */
/* Contenedor en grid, responde al ancho disponible */
.beneficios {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}


/* Tarjeta */
.benef {
    display: flex;
    align-items: center;
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 10px 12px;
    font-weight: 500;
    color: #5b4cd0;
    font-size: 13px;
    white-space: nowrap;
    /* evita cortes raros */
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Icono */
.benef-emoji {
    font-size: 20px;
    line-height: 1;
    text-align: center;
}

/* Ajustes responsivos opcionales */
@media (max-width: 900px) {
    .beneficios {
        --min-col: 200px;
    }
}

@media (max-width: 600px) {
    .beneficios {
        --min-col: 160px;
    }
}

/* side */
.vac-side h3 {
    margin-top: 0
}

.vac-side h4 {
    margin: 16px 0 10px
}

/* sociales */
.social-card {
    background: #f9f5ff;
    padding: 12px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.social-name {
    font-weight: 700;
    margin-bottom: 6px
}

.stars {
    display: flex;
    gap: 6px
}

.star {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: #6b5ce2;
    stroke-width: 1.2
}

.star.on {
    fill: #6b5ce2
}

.section-body.skills-body {
    display: grid;
    gap: 12px;
}

/* Social: ya tienes .skill-star-wrapper en tu CSS (3 columnas).
   Si quieres 2 columnas: grid-template-columns: repeat(2, 1fr); */
.skill-list {
    display: grid;
    gap: 8px;
}

/* lista técnica (vertical) */

/* Botón eliminar usado arriba */
.icon-btn-danger {
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 4px;
}

.skill-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-level {
    color: white;
    padding: 3px 8px;
    font-size: 11px;
    border-radius: 6px;
    font-weight: 600;
    background-color: #7255f8;
}

.skill-percent {
    font-size: 12px;
    color: #2b2c34;
    font-weight: 600;
}

.skill-range {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    outline: none;
    background: linear-gradient(to right, #5b4cd0 85%, #e6e2ff 85%);
}

.skill-range.is-display-only {
    /* que no reciba interacción ni se ponga opaco */
    pointer-events: none;
    opacity: 1;

    /* reseteos de apariencia */
    -webkit-appearance: none;
    appearance: none;
}

/* Safari/Chrome */
.skill-range.is-display-only::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
    border: 0;
    box-shadow: none;
}

/* Firefox */
.skill-range.is-display-only::-moz-range-thumb {
    width: 0;
    height: 0;
    border: 0;
    box-shadow: none;
}

.skill-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: white;
    border: 3px solid #5b4cd0;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #5b4cd0;
}

.skill-range::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border: 3px solid #5b4cd0;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #5b4cd0;
}

.skill-star-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-star-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.skill-star-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #898a8b;
    font-weight: 500;
    flex-wrap: wrap;
    margin-top: 2px;
}

/* star */


.valoracion {
    display: flex;
    flex-direction: row-reverse;
    /* para que el hover hacia atrás funcione */
    justify-content: center;
    gap: 1px;
}

.valoracion button {
    background: transparent;
    border: none;
    padding: 4px;
}

.valoracion .star {
    width: 22px;
    height: 22px;
    fill: #5f5050;
    transition: fill 0.3s, transform 0.3s;
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
}

/* experiencia */
/* 1 columna para esta sección */
.experiencias-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* Tarjeta ocupa todo el ancho de la grid */
.exp-card {
    grid-column: 1 / -1;
}

/* Grid interna de campos */
.exp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
}

.panel-close {
    border: none;
    background: transparent;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.bg-yellow {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 500;
    align-items: center;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

.skel-pill {
    width: 90px;
    height: 22px;
    border-radius: 20px;
}

.skel-icon {
    width: 30px;
    height: 30px;
    border-radius: 6px;
}

.skel-avatar {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    margin: 12px auto;
}

.skel-line {
    height: 14px;
    margin: 6px 0;
}

.skel-half {
    height: 14px;
    width: 60%;
    margin: 6px 0;
}

.skel-footer {
    height: 14px;
    width: 40%;
    margin: 6px 0;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

.skel-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
    /* ajusta según columnas reales */
    gap: 16px;
    padding: 12px 0;
}

.skel-col {
    height: 14px;
    border-radius: 6px;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
}

.skel-pill-sm {
    width: 80px;
    height: 20px;
    border-radius: 20px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}

.block p,
.bullets li,
.vh-title,
.vh-cat {
    word-break: break-word;
    overflow-wrap: anywhere;
}

/* ===== utilitario general ===== */
.wrap-text {
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
    min-width: 0;
}

/* importante para grid/flex */
.vh-left,
.vh-right,
.vac-main,
.vac-side,
.stat,
.stat-text,
.skill-left,
.skill-star-left,
.skill-item,
.skill-star-item,
.benefit-card,
.block,
.bullets li {
    min-width: 0;
}

/* header */
.vac-header {
    position: relative;
    padding: 18px;
    background-image: linear-gradient(to bottom, rgba(234, 230, 255, 1) 55%, #fff 100%);
}

.vh-left {
    max-width: 100%;
}

.vh-title {
    margin: .25rem 0 .35rem;
    font-size: 20px;
    line-height: 1.2;
}

.vh-cat,
.vh-meta,
.stat-text,
.block p,
.bullets li {
    overflow-wrap: anywhere;
    word-break: break-word;
}

/* chips */
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f3f0ff;
    color: #000000;
    font-weight: 500;
    padding: 6px 10px;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px #e6e2ff;
    font-size: 12px;
    max-width: 100%;
    white-space: normal;
    /* antes te podía romper */
    overflow-wrap: anywhere;
}

/* grid principal */
.vac-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 16px 20px 22px;
}

/* stats */
.vh-right {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 10px;
    align-items: start;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
}

.stat-text {
    font-size: 13px;
    color: #374151;
    text-align: center;
    max-width: 100%;
}

/* beneficios */
.benefits-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
}

.benefit-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: #f4efff;
    border-radius: 16px;
    padding: 0.75rem 1rem;
    font-weight: 600;
    color: #3b2667;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    min-width: 0;
    white-space: normal;
    /* quita nowrap */
}

.benefit-name {
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
    min-width: 0;
}

/* skills sociales */
.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    align-items: start;
    gap: 10px;
}

.skill-star-item {
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    min-width: 0;
}

.skill-star-name {
    font-weight: 600;
    font-size: 12px;
    color: #2b2c34;
    text-align: center;
    overflow-wrap: anywhere;
    word-break: break-word;
}

/* skills técnicas */
.skill-row {
    padding: 8px 0;
}

.skill-item {
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    min-width: 0;
}

.skill-left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    font-size: 14px;
    flex-wrap: wrap;
}

.skill-name {
    font-weight: 600;
    font-size: 14px;
    color: #2b2c34;
    overflow-wrap: anywhere;
    word-break: break-word;
}

/* bullets */
.bullets {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
}

.bullets li {
    margin: 6px 0;
    overflow-wrap: anywhere;
    word-break: break-word;
}

/* tooltip: que no desborde tanto */
.tooltip::after {
    content: attr(data-title);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: #3e32bf;
    color: white;
    font-weight: bold;
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 4px;
    white-space: normal;
    width: max-content;
    max-width: 220px;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* ===== TABLET ===== */
@media (max-width: 900px) {
    .vac-grid {
        padding: 14px;
        gap: 18px;
    }

    .vh-right {
        grid-template-columns: 1fr;
    }

    .benefits-container {
        grid-template-columns: 1fr;
    }

    .skill-star-wrapper {
        grid-template-columns: 1fr;
    }

    .vh-title {
        font-size: 18px;
    }
}

/* ===== MOBILE ===== */
@media (max-width: 600px) {
    .vac-header {
        padding: 14px;
    }

    .vac-grid {
        padding: 12px;
    }

    .vh-title {
        font-size: 17px;
    }

    .vh-cat,
    .vh-meta,
    .block p,
    .bullets li,
    .skill-name,
    .skill-percent {
        font-size: 12px;
    }

    .chip {
        width: 100%;
        justify-content: flex-start;
        border-radius: 12px;
    }

    .skill-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .skill-info {
        width: 100%;
        justify-content: space-between;
    }

    .labels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
        font-size: 9px;
    }

    .benefit-card {
        align-items: flex-start;
        border-radius: 12px;
    }
}
</style>
