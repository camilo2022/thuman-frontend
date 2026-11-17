<script setup>
const props = defineProps({
    modelVacant: Array,
    responsabilities: Array,
    academicRequirements: Array,
    requiredExperiences: Array,
    requiredSkills: Array,
    formatTime: Function,
    formatCOP: Function,
    modelApplication: Object,
    showDetailVacant: Boolean,
    showFormVacant: Boolean,
    showVideoInterviewVacant: Boolean,
    favorites: Array
})

const emit = defineEmits(['index', 'detail', 'form', 'videoInterview', 'processApplication', 'submitPersonToggle', 'share']);
</script>

<template>
    <div class="vacancy-content">
        <div class="vacancy-info">
            <div class="info-section">
                <h2 class="section-title desc-title">Descripción</h2>
                <p class="motivo" v-if="props.modelVacant.relationships?.position?.description" style="white-space: pre-line;">{{
                    props.modelVacant.relationships?.position?.description }}</p>
                <p v-else>Esta vacante no tiene descripción detallada.</p>
            </div>
            <!-- Responsabilidades -->
            <div class="info-section">
                <h2 class="section-title">Responsabilidades</h2>
                <div v-if="!props.responsabilities.length">
                    <div class="alert-warning" style="display:flex;gap:10px;">
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
                    <ul class="bullets motivo">
                        <li v-for="(responsability, index) in props.responsabilities" :key="responsability.id">
                            <strong>{{ responsability.name }}</strong>:
                            {{ responsability.description }}
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Formación / Conocimientos -->
            <div class="info-section">
                <h2 class="section-title">Formación</h2>
                <div v-if="!props.academicRequirements.length">
                    <div class="alert-warning" style="display:flex;gap:10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                        </svg>
                        <p class="motivo">Esta vacante no cuenta con formaciones asociadas.
                        </p>
                    </div>
                </div>
                <div v-else>
                    <ul class="bullets motivo">
                        <li v-for="(academicRequirement, index) in props.academicRequirements"
                            :key="academicRequirement.id">
                            <strong>{{ academicRequirement.academic_level.name }}</strong>:
                            {{ academicRequirement.academic_title }}
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Experiencia -->
            <div class="info-section">
                <h2 class="section-title">Experiencia</h2>
                <div v-if="!props.requiredExperiences.length">
                    <div class="alert-warning" style="display:flex;gap:10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                            viewBox="0 0 256 256">
                            <path
                                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                        </svg>
                        <p class="motivo">Esta vacante no cuenta con experiencias asociadas.
                        </p>
                    </div>
                </div>
                <div v-else>
                    <ul class="bullets motivo">
                        <li v-for="(requiredExperience, index) in props.requiredExperiences"
                            :key="requiredExperience.id">
                            <strong>{{ `${requiredExperience.name} (${formatTime(requiredExperience.duration_months)})`
                                }}</strong>:
                            {{ requiredExperience.description }}
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Beneficios -->
            <div class="info-section" v-if="(props.modelVacant.relationships?.benefits || []).length">
                <h2 class="section-title">Beneficios</h2>
                <div class="benefits-container">
                    <div class="benefit-card" v-for="(benefit, index) in props.modelVacant.relationships?.benefits"
                        :key="benefit.id">
                        <img v-if="benefit.icon" :src="benefit.icon.path" alt="Icono" class="benefit-icon"
                            style="width: 40px;" />
                        <span>{{ benefit.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="vacancy-side">
            <div class="vacancy-side-button">
                <div class="rocket-wrapper">
                    <img src="../../../../../assets/img/ROCKET.gif" alt="Rocket" class="rocket-img" />
                </div>
                <button class="btn-primary" @click="emit('processApplication')" v-if="!props.modelApplication.id">
                    Aplicar
                </button>
                <button class="nav-link btn-secondary"
                    style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0; cursor: not-allowed; width: 100% !important; cursor: not-allowed !important;"
                    v-else>
                    Aplicado
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                        <path
                            d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z">
                        </path>
                    </svg>
                </button>
            </div>
            <ul class="side-info">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8" viewBox="0 0 256 256">
                        <path
                            d="M128,36A100,100,0,1,0,228,136,100.11,100.11,0,0,0,128,36Zm0,176a76,76,0,1,1,76-76A76.08,76.08,0,0,1,128,212ZM32.49,72.49a12,12,0,1,1-17-17l32-32a12,12,0,1,1,17,17Zm208,0a12,12,0,0,1-17,0l-32-32a12,12,0,1,1,17-17l32,32A12,12,0,0,1,240.49,72.49ZM176,124a12,12,0,0,1,0,24H128a12,12,0,0,1-12-12V88a12,12,0,0,1,24,0v36Z">
                        </path>
                    </svg>
                    {{formatTime(props.modelVacant.relationships?.position?.required_experiences.reduce((acc, i) => acc
                        + i.duration_months, 0) / props.modelVacant.relationships?.position?.required_experiences.length)}}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8" viewBox="0 0 256 256">
                        <path
                            d="M100,100a12,12,0,0,1,12-12h32a12,12,0,0,1,0,24H112A12,12,0,0,1,100,100ZM236,68V196a20,20,0,0,1-20,20H40a20,20,0,0,1-20-20V68A20,20,0,0,1,40,48H76V40a28,28,0,0,1,28-28h48a28,28,0,0,1,28,28v8h36A20,20,0,0,1,236,68ZM100,48h56V40a4,4,0,0,0-4-4H104a4,4,0,0,0-4,4ZM44,72v35.23A180.06,180.06,0,0,0,128,128a180,180,0,0,0,84-20.78V72ZM212,192V133.94A204.27,204.27,0,0,1,128,152a204.21,204.21,0,0,1-84-18.06V192Z">
                        </path>
                    </svg>
                    {{ props.modelVacant.relationships?.work_arrangement?.name }}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8" viewBox="0 0 256 256">
                        <path
                            d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z">
                        </path>
                    </svg>
                    {{ props.modelVacant.relationships?.work_day?.name }}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8" viewBox="0 0 256 256">
                        <path
                            d="M232,164H70.38c2.2-4.42,4.41-8.94,6.59-13.52l.79-1.66c13.52-1.65,28.69-11.3,45.38-28.87,5.31,12,14,24.73,27.59,27.29,5.26,1,13.51.79,22.93-5.82a57.86,57.86,0,0,0,9-7.91C190.9,141.2,205.68,148,232,148a12,12,0,0,0,0-24c-31,0-35.42-10.49-36-12.38.49-5.37-2.75-9.76-7.88-11.63s-11.17.78-14.22,5.46c-10,15.32-16.62,18.62-18.75,18.21-4.88-.91-12.39-15.54-15.44-30.09a12,12,0,0,0-21.13-5c-10.3,12.92-19.16,21.79-26.47,27.56,21.19-52.94,17-72.22,11.37-82.25C98.48,24.91,89.41,20,78,20,59.92,20,45.36,36.55,39,64.26c-3.45,15.1-4,31.81-1.46,45.85,2.65,14.71,8.36,25.7,16.68,32.23C50.69,149.78,47,157.06,43.47,164H24a12,12,0,0,0,0,24h6.7c-9.7,17.67-16.85,29.6-17,29.81a12,12,0,1,0,20.56,12.38C34.91,229.15,45.23,212,58,188H232a12,12,0,0,0,0-24ZM62.43,69.6C65.77,55,72.45,44,78,44c3.71,0,4.29,1,4.64,1.64,1.43,2.53,6.55,17.07-17.44,72.78a44.64,44.64,0,0,1-4-12.56C59.23,94.89,59.68,81.67,62.43,69.6Z">
                        </path>
                    </svg>
                    {{ props.modelVacant.relationships?.contract_type?.name }}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8" viewBox="0 0 256 256">
                        <path
                            d="M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z">
                        </path>
                    </svg>
                    {{ `${props.modelVacant.relationships?.headquarter?.city?.departament?.country?.name}` }} - {{
                        props.modelVacant.relationships?.headquarter?.city?.departament?.name }} - {{
                        props.modelVacant.relationships?.headquarter?.city?.name }}
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#5f46f8" viewBox="0 0 256 256">
                        <path
                            d="M152,116H140V60h4a28,28,0,0,1,28,28,12,12,0,0,0,24,0,52.06,52.06,0,0,0-52-52h-4V24a12,12,0,0,0-24,0V36h-4a52,52,0,0,0,0,104h4v56H104a28,28,0,0,1-28-28,12,12,0,0,0-24,0,52.06,52.06,0,0,0,52,52h12v12a12,12,0,0,0,24,0V220h12a52,52,0,0,0,0-104Zm-40,0a28,28,0,0,1,0-56h4v56Zm40,80H140V140h12a28,28,0,0,1,0,56Z">
                        </path>
                    </svg>
                    <template v-if="props.modelVacant.salary_min && props.modelVacant.salary_max">
                        {{ formatCOP(props.modelVacant.salary_min) }} – {{ formatCOP(props.modelVacant.salary_max) }}
                    </template>
                    <template v-else-if="props.modelVacant.salary_min">
                        {{ formatCOP(props.modelVacant.salary_min) }}
                    </template>
                    <template v-else-if="props.modelVacant.salary_max">
                        {{ formatCOP(props.modelVacant.salary_max) }}
                    </template>
                    <template v-else>—</template>
                </li>
            </ul>
        </div>
    </div>
    <div class="mobile-actions">

        <button class="icon-btn" aria-label="Favorito"
            @click="emit('submitPersonToggle', [props.modelVacant.id, null])">
            <svg v-if="props.favorites.includes(props.modelVacant.id)" width="20" height="20" viewBox="0 0 256 256"
                aria-hidden="true">
                <path fill="#5b4cd0"
                    d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36A66.08,66.08,0,0,0,12,102c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Z" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 256 256" aria-hidden="true">
                <path fill="#5b4cd0"
                    d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36A66.08,66.08,0,0,0,12,102c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z" />
            </svg>
        </button>

        <button class="icon-btn" aria-label="Compartir" @click="emit('share')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M176,156a43.78,43.78,0,0,0-29.09,11L106.1,140.8a44.07,44.07,0,0,0,0-25.6L146.91,89a43.83,43.83,0,1,0-13-20.17L93.09,95a44,44,0,1,0,0,65.94L133.9,187.2A44,44,0,1,0,176,156Zm0-120a20,20,0,1,1-20,20A20,20,0,0,1,176,36ZM64,148a20,20,0,1,1,20-20A20,20,0,0,1,64,148Zm112,72a20,20,0,1,1,20-20A20,20,0,0,1,176,220Z">
                </path>
            </svg>
        </button>
        <button class="btn-primary" @click="emit('processApplication')" v-if="!props.modelApplication.id">
            Aplicar
        </button>
        <button class="nav-link btn-secondary"
            style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0; cursor: not-allowed; width: 100% !important; cursor: not-allowed !important;"
            v-else>
            Aplicado
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z">
                </path>
            </svg>
        </button>
    </div>

</template>


<style scoped>
.tooltip {
    position: relative;
}

.tooltip::after {
    content: attr(data-title);
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: #3e32bf;
    color: white;
    font-weight: bold;
    padding: 3px 6px;
    font-size: 12px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease;
    z-index: 9999;
    /* siempre al frente */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.tooltip:hover::after {
    opacity: 1;
}

.benefits-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}

.benefit-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: #f4efff;
    /* fondo suave lila */
    border-radius: 9999px;
    /* totalmente redondeado */
    padding: 0.5rem 1.25rem;
    font-weight: 600;
    color: #3b2667;
    /* tono púrpura oscuro */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    white-space: nowrap;
}

.benefit-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.alert-warning {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
}

.alert-warning p {
    color: #CA8A04;
}

.bullets {
    margin: 0;
    padding-left: 18px;
    font-size: 13px
}

.bullets li {
    margin: 6px 0;
    font-size: 15px !important;
}

.bullets li::marker {
    color: #5b4cd0;
    font-size: 18px;
}

.vacancy-detail-layout {
    border-radius: 12px;
    width: 100%;
}

.vacancy-header {
    background: #6b6781;
    position: relative;
    width: 100%;
    overflow: hidden;
}

.header-bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    opacity: 0.28;
    pointer-events: none;
}

.header-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.header-main {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    position: relative;
    z-index: 2;
    padding: 28px 46px 20px 50px;
}

.header-main>div {
    width: 100%;
}

.header-area {
    color: #fff;
    font-size: 1.23rem;
    font-weight: 600;
    opacity: 0.93;
    margin-bottom: 4px;
}

.header-title {
    color: #fff;
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 7px 0;
    letter-spacing: 0.5px;
    padding-bottom: 6px;
}

.header-meta {
    color: #fff;
    font-size: 1.09rem;
    margin-bottom: 7px;
    font-weight: 400;
    opacity: 0.97;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    align-items: center;
}

.header-meta label {
    font-weight: 400;
}

.header-meta span {
    margin: 0 9px;
}

.header-tags {
    color: #fff;
    font-size: 1.1rem;
    margin-bottom: 7px;
    font-weight: 500;
    opacity: 0.98;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    align-items: center;
}

.header-tags span {
    margin: 0 9px;
}

.header-tags label {
    font-weight: 600;
}

.header-icons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    margin-bottom: 0;
    width: 100%;
}

.icon-btn {
    background: #F4EFFC;
    border: none;
    border-radius: 100%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.17s;
    padding: 0;
}

.icon-btn:hover {
    background: #cfc6e6;
}

.vacancy-content {
    display: flex;
    gap: 48px;
    padding: 44px 46px 44px 50px;
    background: #fff;
    border-radius: 0 0 12px 12px;
}

.vacancy-info {
    flex: 3.2;
}

.info-section {
    margin-bottom: 28px;
}

.section-title {
    color: #5b4cd0;
    font-size: 16px !important;
    font-weight: 800;
    margin-bottom: 7px;
}

p {
    color: #000;
}

.desc-title {
    color: #5b4cd0;
    font-size: 1.23rem;
}

.info-section ul {
    margin: 10px 0 0 0;
    padding-left: 24px;
}

.info-section li {
    margin-bottom: 9px;
    font-size: 1.13rem;
}

.vacancy-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 70px;
    min-width: 340px;
}

.rocket-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 18px;
}

.rocket-img {
    width: 66px;
    height: 66px;
    object-fit: contain;
    background: #fff;
    border-radius: 18px;
}

.nav-link {
    text-decoration: none;
    color: #2b2c34;
    font-weight: 600;
    font-size: 16px;
}

.apply-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    /* Espacio entre el texto y el ícono */
    text-align: center;
    background: #5b4cd0;
    color: #fff;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    padding: 15px 0;
    margin-bottom: 34px;
    font-size: 1.2rem;
    transition: background 0.18s;
    cursor: pointer;
    width: 100%;
}

.apply-btn svg {
    width: 22px;
    height: 22px;
    fill: #5b4cd0;
}

.apply-btn:hover {
    background-color: #6e61d4;
}

.side-info {
    list-style: none;
    padding: 0 0 0 8px;
    margin: 0;
    width: 100%;
    color: #5b4cd0;
    font-size: 1.17rem;
}

.side-info li {
    display: flex;
    align-items: center;
    /* Alinea verticalmente */
    gap: 10px;
    /* Espacio entre SVG y texto */
    padding: 8px 0;
    font-size: 1.09rem;
    color: #000;
}

.side-info li svg {
    min-width: 22px;
    /* Para que todos los ítems se alineen aunque no tengan svg */
    height: 22px;
    display: block;
}

@media (max-width: 1100px) {
    .vacancy-content {
        flex-direction: column-reverse;
        gap: 24px;
        padding: 24px 10px 20px 10px;
    }

    .vacancy-side {
        min-width: unset;
        margin-top: 0;
        padding: 0;
    }

    .vacancy-info {
        width: 100%;
    }

    .header-main {
        flex-direction: column;
        gap: 16px;
        padding: 24px 10px 20px 10px;
    }

    .btn-primary {
        padding: 15px !important;
        font-size: 15px !important;
    }

    .btn-secondary {
        padding: 15px !important;
        font-size: 15px !important;
    }
}

/* Oculta por defecto (solo se verá en móvil) */
.mobile-actions {
    display: none;
}

@media (max-width: 1100px) {

    /* Para que el contenido no quede tapado por la barra fija */
    .vacancy-content {
        padding: 15px 30px;
    }

    /* Oculta el bloque lateral en móvil si no lo necesitas */
    .vacancy-side-button {
        display: none;
    }

    /* Barra fija inferior */
    .mobile-actions {
        display: flex;
        align-items: center;
        gap: 12px;

        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;

        padding: 12px 12px calc(12px + env(safe-area-inset-bottom));
        background: #fff;
        box-shadow: 0 -6px 18px rgba(0, 0, 0, .08);
        z-index: 9999;
    }

    /* Botón aplicar dentro de la barra */
    .mobile-apply {
        margin-bottom: 0;
        flex: 1;
        /* ocupa el resto del espacio */
        padding: 14px 0;
        border-radius: 12px;
    }

    /* Los iconos a la izquierda */
    .mobile-actions .icon-btn {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
    }
}

p {
    font-size: 12px !important;
    margin: 4px 0;
    font-weight: 500;
    align-items: start;
    color: #000000;
    text-align: left;
}

.bullets li {
    font-size: 12px !important;
    margin: 4px 0;
    font-weight: 500;
    align-items: start;
    color: #000000;
    text-align: left;
}

.btn-primary {
    width: 100% !important;
}

.side-info li {
    font-size: 14px !important;
    font-weight: 500;
    align-items: start;
    color: #000000;
    text-align: justify;
}

.vacancy-side-button {
    width: 100% !important;
}
</style>
