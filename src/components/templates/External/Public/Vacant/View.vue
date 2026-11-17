<script setup>
import { defineAsyncComponent } from 'vue'

const Detail = defineAsyncComponent(() => import('@/components/templates/External/Public/Vacant/Detail.vue'));
const Form = defineAsyncComponent(() => import('@/components/templates/External/Public/Vacant/Form.vue'));
const VideoInterview = defineAsyncComponent(() => import('@/components/templates/External/Public/Vacant/VideoInterview.vue'));

const props = defineProps({
  modelVacant: Array,
  responsabilities: Array,
  academicRequirements: Array,
  requiredExperiences: Array,
  requiredSkills: Array,
  formatTime: Function,
  formatCOP: Function,
  modelApplication: Object,
  modelForm: Object,
  showDetailVacant: Boolean,
  showFormVacant: Boolean,
  showVideoInterviewVacant: Boolean,
  personId: Number,
  favorites: Array,
  errors: Object
})

function handleShare() {
  const token = props.modelVacant.uuid;

  const currentUrl = `${window.location.origin}?v=${token}`

  const vacancyName = props.modelVacant.relationships?.position?.name || "Vacante disponible";
  const entityName = `${props.modelVacant.relationships?.headquarter?.entity?.name} ${(props.modelVacant.relationships?.headquarter?.entity?.entity_type?.settings?.abreviature || '')}` || "Empresa";
  const location = `${props.modelVacant.relationships?.headquarter?.city?.departament?.country?.name} ${props.modelVacant.relationships?.headquarter?.city?.departament?.country?.emoji} ${props.modelVacant.relationships?.headquarter?.city?.departament?.name} ${props.modelVacant.relationships?.headquarter?.city?.name}`;
  const modality = props.modelVacant.relationships?.work_arrangement?.name || "Modalidad";
  const startDate = props.modelVacant.start_date || "";
  const endDate = props.modelVacant.end_date || "";
  const description = props.modelVacant.description || "";
  const text =
    "Hola 👋, quiero compartir contigo una oportunidad laboral que podría interesarte.%0A%0A" +
    "📌 *Vacante:* " + vacancyName + "%0A" +
    "🏢 *Empresa:* " + entityName + "%0A" +
    "📍 *Ubicación:* " + location + "%0A" +
    "💼 *Modalidad:* " + modality + "%0A" +
    "🗓️ *Convocatoria vigente*%0A" +
    (startDate ? "   • Inicio: " + startDate + "%0A" : "") +
    (endDate ? "   • Cierre: " + endDate + "%0A" : "") +
    "%0A" +
    "📝 *Descripción:*%0A" +
    (description ? description.replace(/\n/g, "%0A") + "%0A%0A" : "Consulta todos los detalles en el enlace.%0A%0A") +
    "🔗 Puedes ver todos los detalles y postularte aquí:%0A" +
    currentUrl + "%0A%0A" +
    "Si consideras que esta oportunidad puede interesarle a alguien más, ¡compártela! 🚀";
  const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
  window.open(whatsappUrl, "_blank");
}

const emit = defineEmits(['index', 'detail', 'form', 'videoInterview', 'processApplication', 'submitApplicationStore', 'submitPersonToggle']);
</script>

<template>
  <div class="vacancy-detail-layout">
    <div class="vacancy-header">

      <div class="header-top">
        <button class="panel-close" @click="emit('index')">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" aria-hidden="true">
            <path fill="#fff"
              d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm52-84a12,12,0,0,1-12,12H117l11.52,11.51a12,12,0,0,1-17,17l-32-32a12,12,0,0,1,0-17l32-32a12,12,0,0,1,17,17L117,116h51A12,12,0,0,1,180,128Z" />
          </svg>
          <span class="panel-close-text">Volver</span>
        </button>
      </div>

      <div class="header-main">
        <div>
          <div class="header-area">{{ props.modelVacant.relationships?.position?.area?.name }}</div>
          <h1 class="header-title">{{ props.modelVacant.relationships?.position?.name }}</h1>

          <div class="header-meta">
            <label v-if="props.modelVacant.start_date">Fecha inicio de la convocatoria: {{ props.modelVacant.start_date
              }}</label>
            <span v-if="props.modelVacant.start_date && props.modelVacant.end_date">|</span>
            <label class="motivo" v-if="props.modelVacant.end_date">Fecha fin de convocatoria: {{
              props.modelVacant.end_date }}</label>
            <span
              v-if="(props.modelVacant.start_date || props.modelVacant.end_date) && props.modelVacant.headquarter_id">|</span>
            <label class="motivo" v-if="props.modelVacant.headquarter_id">{{
              `${props.modelVacant.relationships?.headquarter?.entity?.name}
              ${(props.modelVacant.relationships?.headquarter?.entity?.entity_type?.settings?.abreviature || '')}`
            }}</label>
          </div>

          <div class="header-tags" v-if="props.modelVacant.work_arrangement_id || props.modelVacant.work_day_id">
            <label v-if="props.modelVacant.work_arrangement_id">{{
              props.modelVacant.relationships?.work_arrangement?.name }}</label>
            <span v-if="props.modelVacant.work_arrangement_id && props.modelVacant.work_day_id">|</span>
            <label v-if="props.modelVacant.work_day_id">{{ props.modelVacant.relationships?.work_day?.name }}</label>
          </div>

          <div class="header-icons">
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
            <button class="icon-btn" aria-label="Compartir" @click="handleShare">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                  d="M176,156a43.78,43.78,0,0,0-29.09,11L106.1,140.8a44.07,44.07,0,0,0,0-25.6L146.91,89a43.83,43.83,0,1,0-13-20.17L93.09,95a44,44,0,1,0,0,65.94L133.9,187.2A44,44,0,1,0,176,156Zm0-120a20,20,0,1,1-20,20A20,20,0,0,1,176,36ZM64,148a20,20,0,1,1,20-20A20,20,0,0,1,64,148Zm112,72a20,20,0,1,1,20-20A20,20,0,0,1,176,220Z">
                </path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Detail v-if="props.showDetailVacant && !props.showFormVacant && !props.showVideoInterviewVacant"
      :modelVacant="props.modelVacant" :responsabilities="props.responsabilities"
      :academicRequirements="props.academicRequirements" :requiredExperiences="props.requiredExperiences"
      :requiredSkills="props.requiredSkills" :formatTime="props.formatTime" :formatCOP="props.formatCOP"
      :modelApplication="props.modelApplication" :showDetailVacant="props.showDetailVacant"
      :showFormVacant="props.showFormVacant" :showVideoInterviewVacant="props.showVideoInterviewVacant"
      @detail="emit('detail')" @form="emit('form')" @videoInterview="emit('videoInterview')"
      @processApplication="emit('processApplication')" @submitPersonToggle="emit('submitPersonToggle', $event)"
      :favorites="props.favorites" @share="handleShare" />

    <Form v-if="props.showDetailVacant && props.showFormVacant && !props.showVideoInterviewVacant"
      :modelForm="props.modelForm" :showVideoInterviewVacant="props.showVideoInterviewVacant"
      :modelApplication="props.modelApplication" :modelVacant="props.modelVacant"
      @videoInterview="emit('videoInterview')" @submitApplicationStore="emit('submitApplicationStore')" />

    <VideoInterview v-if="props.showDetailVacant && props.showFormVacant && props.showVideoInterviewVacant"
      :modelApplication="props.modelApplication" @index="emit('index')"
      @submitApplicationStore="emit('submitApplicationStore')" :errors="props.errors" />
  </div>
</template>


<style scoped>
.header-top {
  position: relative;
  z-index: 4;
  height: 52px;
  /* 👈 este es el "espacio del hr" */
  display: flex;
  align-items: center;
  /* 👈 centra verticalmente */
  padding-left: 12px;
}

.panel-close {
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 4;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 6px 10px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.vacancy-detail-layout {
  border-radius: 12px;
  width: 100%;
}

.vacancy-header {
  position: relative;
  width: 100%;
  overflow: hidden;
  /* “pesado” base */
  background-image: url("../../../../../assets/img/VACANTE.png");
  background-size: cover;
  background-position: right center;
  background-repeat: no-repeat;
}

.vacancy-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(107, 103, 129, 0.72);
  /* ajusta 0.55–0.85 */
  z-index: 0;
}


.header-divider {
  position: absolute;
  top: 48px;
  margin: 0;
  height: 1px;
  border: none;
  background: rgba(255, 255, 255, 0.55);
  z-index: 3;
  width: 100%;
}

.header-main {
  position: relative;
  z-index: 2;
  padding: 12px 46px 20px 50px;
  /* 🔥 sube/baja: 64–80 */
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


.header-main>div {
  width: 100%;
}

.header-area {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  opacity: 0.93;
  margin-bottom: 4px;
}

.header-title {
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 7px 0;
  letter-spacing: 0.5px;
  padding-bottom: 6px;
}

.header-meta {
  color: #fff;
  font-size: 15px;
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
  font-size: 14px;
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

p {
  color: #000;
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

@media (max-width: 1100px) {
  .vacancy-content {
    flex-direction: column;
    gap: 24px;
    padding: 24px 10px 20px 10px;
  }

  .vacancy-side {
    min-width: unset;
    margin-top: 0;
  }

  .vacancy-info {
    width: 100%;
  }

  .header-main {
    flex-direction: column;
    gap: 16px;
    padding: 24px 10px 20px 10px;
  }
}

@media (max-width: 600px) {
  .panel-close {
    top: 10px;
    left: 10px;
  }

  .header-main {
    padding: 16px 14px 16px 14px;
  }

  .header-divider {
    margin: 44px 0 0 0;
    /* antes 58 */
  }
}

.panel-close-text {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .header-icons {
    display: none;
  }
}
</style>
