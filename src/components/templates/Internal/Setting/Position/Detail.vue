<script setup>
const props = defineProps({
    modelPosition: Object,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    responsabilities: Array,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
    loadingDetail: Boolean
})
const emit = defineEmits(['detail'])

</script>
<template>
    <div class="main-container" style="box-shadow: none; padding: 0;">
        <div v-if="loadingDetail">
            <div aria-busy="true" :inert="true">
                <!-- HEADER -->
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div class="skeleton-title skeleton-block"></div>
                    <div class="skeleton-block" style="width:30px;height:30px;border-radius:6px;"></div>
                </div>

                <!-- DATOS DE AGENDAMIENTO -->
                <div style="margin-top:30px;">
                    <div class="skeleton-title skeleton-block" style="width:200px;"></div>
                    <div v-for="n in 10" class="skeleton-line skeleton-block"></div>
                </div>

                <!-- RESULTADOS -->
                <div style="margin-top:30px;">
                    <div class="skeleton-title skeleton-block" style="width:180px;"></div>
                    <div class="skeleton-title skeleton-block" style="width:60px;height:30px;"></div>
                    <div v-for="n in 5" class="skeleton-line skeleton-block"></div>
                </div>

                <!-- COMENTARIOS / META -->
                <div v-for="n in 2" style="margin-top:20px;">
                    <div class="skeleton-line skeleton-block"></div>
                    <div class="skeleton-textarea skeleton-block"></div>
                    <div class="skeleton-badge skeleton-block" style="width:120px;"></div>
                </div>
            </div>
        </div>
        <div v-else class="vacante">
            <!-- Header -->
            <header class="vac-header">
                <div class="vh-left">
                    <small class="vh-area motivo">{{ props.modelPosition?.relationships?.area?.name }}</small>
                    <h1 class="vh-title motivo">{{ props.modelPosition.name }}</h1>
                    <div class="vh-cat">
                        {{ props.modelPosition?.relationships?.profile_category?.name }}

                        <ul class="bullets">
                            <li v-if="props.modelPosition.settings.polygraph">Requiere examen de polígrafo</li>
                            <li v-if="props.modelPosition.settings.video_interview">Requiere video entrevista</li>
                        </ul>
                    </div>
                </div>
            </header>

            <!-- Cuerpo: grid 2 columnas -->
            <div class="vac-grid">
                <!-- Columna izquierda -->
                <main class="vac-main">
                    <section class="block">
                        <h3>Descripción</h3>
                        <ul class="bullets">
                            <p style="white-space: pre-line;">{{ props.modelPosition.description }}</p>
                        </ul>
                    </section>

                    <section class="block">
                        <h3>Responsabilidades</h3>
                        <div v-if="!props.responsabilities.length">
                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Esta vacante no cuenta con resposabilidades asociadas.
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <ul class="bullets">
                                <li v-for="(responsability, index) in props.responsabilities" :key="responsability.id">
                                    <strong>{{ responsability.name }}</strong>:
                                    {{ responsability.description }}
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section class="block">
                        <h3>Formación / Conocimientos</h3>
                        <div v-if="!props.academicRequirements.length">
                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Esta vacante no cuenta con formaciones asociadas.
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <ul class="bullets">
                                <li v-for="(academicRequirement, index) in props.academicRequirements"
                                    :key="academicRequirement.id">
                                    <strong>{{ academicRequirement.academic_level.name }}</strong>:
                                    {{ academicRequirement.academic_title }} ({{
                                        academicRequirement.formation_status.name
                                    }})
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section class="block">
                        <h3>Experiencia</h3>
                        <div v-if="!props.requiredExperiences.length">
                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Esta vacante no cuenta con experiencias asociadas.
                                </p>
                            </div>
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
                            v-if="props.requiredSkills.filter(s => s.skill_type_id === 21).length">
                            <div class="skill-star-row"
                                v-for="(requiredSkill, index) in props.requiredSkills.filter(s => s.skill_type_id === 21)"
                                :key="requiredSkill.name">
                                <div class="skill-star-item">
                                    <div class="skill-star-left">
                                        <div class="skill-star-header">
                                            <span class="skill-star-name motivo">{{ requiredSkill.skill.name }}</span>
                                        </div>

                                        <div class="valoracion">
                                            <button v-for="n in [5, 4, 3, 2, 1]">
                                                <svg class="star" :class="{ active: requiredSkill.percentage >= n }"
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
                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Este cargo no cuenta con habilidades sociales.
                                </p>
                            </div>
                        </div>

                        <li>
                            <h4>Habilidades técnicas</h4>
                        </li>
                        <div class="skill-list" v-if="props.requiredSkills.filter(s => s.skill_type_id === 22).length">
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
                                                <span class="skill-percent">{{ requiredSkill.percentage }}%</span>
                                            </div>
                                        </div>

                                        <input type="range" class="skill-range is-display-only"
                                            :value="requiredSkill.percentage" min="0" max="100" step="1" disabled
                                            :style="{ background: `linear-gradient(to right, #5b4cd0 ${requiredSkill.percentage}%, #e6e2ff ${requiredSkill.percentage}%)` }" />

                                        <div class="labels">
                                            <span>Principiante</span><span>Básico</span><span>Intermedio</span><span>Avanzado</span><span>Experto</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="skill-list" v-else>
                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Este cargo no cuenta con habilidades tecnicas.
                                </p>
                            </div>
                        </div>
                    </ul>
                </aside>
            </div>
        </div>
    </div>

</template>

<style scoped>
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

.vacante {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, .06);
    overflow: hidden;
}

/* Header con degradado extendido */
.vac-header {
    position: relative;
    padding: 18px 20px;
    background-image: linear-gradient(to bottom, rgba(234, 230, 255, 1) 55%, #fff 100%);
}

.vh-left {
    max-width: 760px
}

.vh-area {
    font-weight: 700;
}

.vh-title {
    margin: .25rem 0 .35rem;
    font-size: 19px
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

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px
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
}

.chip svg {
    width: 16px;
    height: 16px;
    fill: #5b4cd0
}

/* stats derecha */
.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px
}

.stat-ico {
    width: 60px;
    height: 60px
}

.stat-text {
    font-size: 13px;
    color: #374151;
    text-align: center
}

/* GRID */
.vac-grid {
    display: grid;
    /* grid-template-columns: 1fr 380px; */
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 16px 20px 22px;
}

.vh-right {
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
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

.block h3 {
    color: #4b3bbf;
    margin: 0 0 8px;
}

.block p {
    font-size: 13px;
}

.bullets {
    margin: 0;
    padding-left: 18px;
    font-size: 13px
}

.bullets li::marker {
    color: #5b4cd0;
    font-size: 18px;
}

.bullets li {
    margin: 6px 0
}

/* beneficios */
/* Contenedor en grid, responde al ancho disponible */
.beneficios {
    --min-col: 220px;
    /* ancho mínimo de cada tarjeta */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--min-col), 1fr));
    gap: 14px;
    /* espacio entre tarjetas */
    margin-top: 8px;
}

/* Tarjeta */
.benef {
    display: grid;
    grid-template-columns: 26px 1fr;
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 8px;
    font-weight: 500;
    color: #5b4cd0;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
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
}

.skill-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.skill-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-name {
    font-weight: 600;
    font-size: 14px;
    color: #2b2c34;
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

.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    align-items: start;
    gap: 5px;
}

.skill-star-item {
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
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

.skill-star-name {
    font-weight: 600;
    font-size: 12px;
    color: #2b2c34;
    text-align: center;
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

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

.skeleton-avatar {
    width: 75px;
    height: 75px;
    border-radius: 20%;
}

.skeleton-title {
    width: 180px;
    height: 22px;
    margin: 8px 0;
}

.skeleton-line {
    width: 100%;
    height: 14px;
    margin: 6px 0;
}

.skeleton-badge {
    width: 85px;
    height: 22px;
    border-radius: 20px;
    margin-top: 8px;
}

.skeleton-stars {
    width: 140px;
    height: 26px;
    margin: 15px 0;
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
</style>
