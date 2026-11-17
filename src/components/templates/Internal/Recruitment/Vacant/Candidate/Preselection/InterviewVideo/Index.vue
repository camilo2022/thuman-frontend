<script setup>
import { Model, surveyLocalization } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import * as SurveyTheme from "survey-core/themes";
import "survey-core/defaultV2.min.css";
import { ref, computed, watch } from 'vue';

surveyLocalization.defaultLocale = "es";

const props = defineProps({
    modelApplication: Object,
    modelInterviewVideo: Object,
    modelInterviewVideo: Object,

    loadingData: Boolean,
    modelForm: Object,
    modelInterviewVideo: Boolean,
    pendingVideoInterview: Boolean,
    requierdInterview: Boolean,
    pendingForm: Boolean
})

const emit = defineEmits(['submitInterviewVideoStore', 'index'])

const survey = ref(null)
const mode = ref('preview')

watch(
    () => props.modelForm?.questions,
    (questions) => {
        if (!questions) return

        const m = new Model(questions)
        m.locale = 'es'
        m.applyTheme(SurveyTheme.LayeredLight)
        m.showCompleteButton = false

        m.onComplete.add((sender) => {
            props.modelApplication.form_id = props.modelForm.id
            props.modelApplication.questions = props.modelForm.questions
            props.modelApplication.answers = sender.data
        })

        survey.value = m
    },
    { immediate: true }
)

const isEditing = ref(false)

function startEvaluation() {
    mode.value = '';
    isEditing.value = true
}

function endEvaluation(status) {
    if (!survey.value) return

    const validate = survey.value.validate()
    if (!validate) {
        document.querySelector('.sd-question--error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return;
    }

    props.modelInterviewVideo.form_id = props.modelForm.id;
    props.modelInterviewVideo.questions = props.modelForm.questions;
    props.modelInterviewVideo.answers = survey.value.data;
    props.modelInterviewVideo.status = status;

    emit('submitInterviewVideoStore')
}

function normalizarValor(pregunta, respuesta) {
  if (respuesta === null || respuesta === undefined) return null;

  switch (pregunta.type) {
    case "rating":
      const max = pregunta.rateMax || 5;
      return respuesta / max;

    case "radiogroup":
    case "dropdown":
      return respuesta ? 1 : 0;

    case "checkbox":
      if (!Array.isArray(respuesta)) return 0;
      const totalOpciones = pregunta.choices?.length || respuesta.length;
      return respuesta.length / totalOpciones;

    case "boolean":
      return respuesta ? 1 : 0;

    case "text":
    case "comment":
      return respuesta.trim() !== "" ? 1 : 0;

    case "matrix":
      const filas = Object.keys(respuesta || {});
      const respondidas = filas.filter(k => respuesta[k] !== null && respuesta[k] !== "").length;
      return filas.length > 0 ? respondidas / filas.length : 0;

    default:
      return respuesta ? 1 : 0;
  }
}

// ------- COMPUTED FINAL --------
const puntajeEstrellas = computed(() => {
  let sum = 0;
  let count = 0;

  props.modelInterviewVideo.questions.pages.forEach(page => {
    page.elements.forEach(pregunta => {
      const resp = props.modelInterviewVideo.answers[pregunta.name];
      const valor = normalizarValor(pregunta, resp);

      if (valor !== null) {
        sum += valor;
        count++;
      }
    });
  });

  const normalizado = count > 0 ? sum / count : 0;
  return normalizado * 5; // ⭐ 0–5
});

const getStarColor = (prom, n) => {
    const diff = prom - (n - 1)
    if (diff >= 1) return '100%' // estrella llena
    if (diff <= 0) return '0%'   // estrella vacía

    const porcentaje = Math.round(diff * 100) // redondea
    return `${porcentaje}%`
}
</script>


<template>
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
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reclutamiento</span><span>|</span><span>Vacantes</span><span>|</span>
        <span>Candidatos {{ props.modelApplication.relationships?.vacant?.position?.name }}</span><span>|</span>
        <span>Preselección</span><span>|</span>
        <span class="active">Video entrevista</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <div class="two-pane">
                <div class="left-pane" ref="leftPane">
                    <h2 class="titulo">Video entrevista</h2>


                    <div style="margin-top:12px;">
                        <div>
                            <div v-if="loadingData">
                                <div class="cv-skeleton">

                                    <!-- Título -->
                                    <div class="section">
                                        <div class="skeleton skel-line" style="width: 40%; height: 22px;"></div>
                                    </div>

                                    <!-- Video placeholder -->
                                    <div class="section video-box">
                                        <div class="skeleton" style="width: 100%; height: 320px; border-radius: 12px;">
                                        </div>
                                    </div>

                                    <!-- Información descriptiva -->
                                    <div class="section">
                                        <div class="skeleton skel-line"></div>
                                        <div class="skeleton skel-line"></div>
                                        <div class="skeleton skel-half"></div>
                                    </div>

                                    <!-- Criterios de evaluación -->
                                    <div class="section">
                                        <div class="skeleton skel-line" style="width: 30%; height: 18px;"></div>

                                        <div style="display:flex; flex-direction:column; gap:1rem; margin-top:1rem;">
                                            <div class="skeleton" style="height: 18px; width: 60%;"></div>
                                            <div class="skeleton" style="height: 18px; width: 80%;"></div>
                                            <div class="skeleton" style="height: 18px; width: 50%;"></div>
                                        </div>
                                    </div>

                                    <!-- Botón -->
                                    <div class="section" style="border: none;">
                                        <div class="skeleton skel-pill"
                                            style="width: 140px; height: 38px; margin-top:1rem;"></div>
                                    </div>

                                </div>

                            </div>
                            <div v-else class="">

                                <template v-if="!props.modelApplication.relationships?.vacant?.settings?.video_interview">
                                    <div class="no-requierd-wrap">
                                        <div class="no-requierd-badge">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                fill="#1565c0" viewBox="0 0 256 256">
                                                <path
                                                    d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                </path>
                                            </svg>
                                        </div>

                                        <h3 class="title-data">No requiere video entrevista.</h3>
                                        <p class="subtitle-data">
                                            Esta vacante no requiere video entrevista para ser seleccionada.
                                        </p>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-if="!props.modelApplication.relationships?.video_interview">
                                        <div class="pending-wrap">
                                            <div class="pending-badge">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                    fill="#f9a825" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                    </path>
                                                </svg>
                                            </div>

                                            <h3 class="title-data">Video entrevista pendiente.</h3>
                                            <p class="subtitle-data">
                                                El candidato aun no ha enviado su video entrevista.
                                            </p>
                                        </div>
                                    </div>
                                    <div v-else-if="!props.modelForm.id">
                                        <div class="pending-wrap">
                                            <div class="pending-badge">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                                                    fill="#f9a825" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                                                    </path>
                                                </svg>
                                            </div>

                                            <h3 class="title-data">Formulario de calificación no disponible.</h3>
                                            <p class="subtitle-data">
                                                No hay un formulario para realizar la evaluación a la video entrevista.
                                            </p>
                                        </div>
                                    </div>
                                    <div v-else class="video-eval-grid" :class="{ preview: mode === 'preview' }">
                                        <!-- Columna izquierda: media -->
                                        <div class="media" v-if="!mode">
                                            <video :src="props.modelApplication?.relationships?.video_interview?.path"
                                                controls preload="metadata">
                                                Tu navegador no admite el elemento <code>video</code>.
                                            </video>
                                        </div>

                                        <!-- Columna derecha: cambia según el modo -->
                                        <div class="calification-list">
                                            <!-- ====== PREVIEW (no hay evaluación en el registro) ====== -->
                                            <template v-if="mode === 'preview'">
                                                <div class="calif-header">Video entrevista</div>

                                                <div class="preview-wrap">
                                                    <video class="preview-img"
                                                        :src="props.modelApplication?.relationships?.video_interview?.path"
                                                        controls preload="metadata">
                                                        Tu navegador no admite el elemento <code>video</code>.
                                                    </video>
                                                    <div v-if="!props.modelInterviewVideo.id">
                                                        <button class="btn btn-primary" @click="startEvaluation">Evaluar video</button>
                                                    </div>
                                                    <div v-else>
                                                        <button class="btn btn-primary" @click="startEvaluation">Ver resultado
                                                            </button>
                                                    </div>
                                                </div>
                                            </template>

                                            <template v-else-if="!props.modelInterviewVideo.id">
                                                <div class="calif-header">Evaluar video entrevista</div>

                                                <div class="survey-compact" style="height: 450px;">
                                                    <SurveyComponent v-if="survey" :model="survey" />
                                                </div>

                                                <div class="notes-wrap">
                                                    <div class="skill-star-header">
                                                        <span class="skill-star-name">Notas del evaluador</span>
                                                    </div>
                                                    <div class="textarea-wrapper">
                                                        <textarea v-model="props.modelInterviewVideo.reviewer_observation" name="description"
                                                            id="description" placeholder="Descripción" maxlength="500" rows="7"
                                                            class="text-area"></textarea>
                                                        <div class="char-limit-text">({{props.modelInterviewVideo.reviewer_observation.length}}/500)</div>
                                                    </div>
                                                </div>
                                                <div class="form-buttons">
                                                    <button class="btn-outline btn-danger-light"
                                                        @click="endEvaluation('Rechazado')"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M243.78,156.53l-12-96A28,28,0,0,0,204,36H32A20,20,0,0,0,12,56v88a20,20,0,0,0,20,20H72.58l36.69,73.37A12,12,0,0,0,120,244a44.05,44.05,0,0,0,44-44V188h52a28,28,0,0,0,27.78-31.47ZM68,140H36V60H68Zm151,22.65a4,4,0,0,1-3,1.35H152a12,12,0,0,0-12,12v24a20,20,0,0,1-13.18,18.8L92,149.17V60H204a4,4,0,0,1,4,3.5l12,96A4,4,0,0,1,219,162.65Z">
                                                            </path>
                                                        </svg>No aprobar</button>
                                                    <button class="btn-outline btn-success-light"
                                                        @click="endEvaluation('Aprobado')"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            fill="currentColor" viewBox="0 0 256 256">
                                                            <path
                                                                d="M237,77.47A28,28,0,0,0,216,68H164V56a44.05,44.05,0,0,0-44-44,12,12,0,0,0-10.73,6.63L72.58,92H32a20,20,0,0,0-20,20v88a20,20,0,0,0,20,20H204a28,28,0,0,0,27.78-24.53l12-96A28,28,0,0,0,237,77.47ZM36,116H68v80H36ZM220,96.5l-12,96a4,4,0,0,1-4,3.5H92V106.83L126.82,37.2A20,20,0,0,1,140,56V80a12,12,0,0,0,12,12h64a4,4,0,0,1,4,4.5Z">
                                                            </path>
                                                        </svg> Aprobar</button>
                                                </div>
                                            </template>

                                            <!-- ====== SUMMARY (ya evaluado) ====== -->
                                            <template v-else-if="props.modelInterviewVideo.reviewer_id">
                                                <div class="calif-header">Evaluación del video</div>

                                                <div class="leader-score">
                                                    <div class="leader-score-title">Puntuación del candidato</div>
                                                    <div class="leader-score-number">{{ puntajeEstrellas }}</div>
                                                    <div class="valoracion stars-lg">
                                                        <span v-for="n in 5" :key="n">
                                                            <svg class="star" xmlns="http://www.w3.org/2000/svg"
                                                                width="28" height="28" viewBox="0 0 256 256">
                                                                <defs>
                                                                    <linearGradient :id="`grad-video-${n}`" x1="0"
                                                                        x2="1" y1="0" y2="0">
                                                                        <stop offset="0%" stop-color="#FFA400" />
                                                                        <stop :offset="getStarColor(puntajeEstrellas, n)"
                                                                            stop-color="#FFA400" />
                                                                        <stop :offset="getStarColor(puntajeEstrellas, n)"
                                                                            stop-color="#ccc" />
                                                                        <stop offset="100%" stop-color="#ccc" />
                                                                    </linearGradient>
                                                                </defs>

                                                                <path :fill="`url(#grad-video-${n})`"
                                                                    d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style="display:flex; flex-direction:column; gap:10px;">
                                                    <div class="summary-evaluation">
                                                        <div class="summary-meta">
                                                            <span class="summary-role">Evaluado por:</span>
                                                            <span class="summary-name">{{ [props.modelInterviewVideo.relationships?.reviewer?.first_name, props.modelInterviewVideo.relationships?.reviewer?.second_name, props.modelInterviewVideo.relationships?.reviewer?.first_last_name, props.modelInterviewVideo.relationships?.reviewer?.second_last_name].filter(Boolean).join(' ') }}</span>
                                                        </div>
                                                    </div>

                                                    <div class="summary-comments">
                                                        <div class="summary-meta">
                                                            <span class="summary-subtitle">Comentarios:</span>
                                                            <span class="summary-text">{{ props.modelInterviewVideo.reviewer_observation || '—' }}</span>
                                                        </div>
                                                        <span class="summary-role">Estado:</span>
                                                        <span class="summary-name">
                                                            <span style="font-weight: bold;" :class="{
                                                                'text-green': props.modelInterviewVideo.status === 'Aprobado',
                                                                'text-purple': props.modelInterviewVideo.status === 'Pendiente',
                                                                'text-red': props.modelInterviewVideo.status === 'Rechazado',
                                                            }">{{ props.modelInterviewVideo.status }}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* Contenedor principal */
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

/* --- Contenedor general (card con degradado) --- */
.body-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 28px 16px 32px;
    background: linear-gradient(180deg,
            #EAE6FF 0%,
            #EFECFF 4%,
            #F5F3FF 8%,
            #F9F8FF 12%,
            #FFFFFF 18%,
            #FFFFFF 100%);
    border-radius: 14px;
    width: 100%;
    border: 1px solid #ebe9ff;
}

.no-requierd-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #90caf9 0%, #ffffff 50%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

/* --- Área del media (imagen/video centrado y responsivo) --- */
.media {
    align-items: center;
    display: flex;
    justify-content: center;
}

.media img,
.media video {
    width: 100%;
    max-width: 600px;
    /* ancho grande como en la maqueta */
    aspect-ratio: 16/9;
    /* mantiene proporción tipo video */
    object-fit: cover;
    border-radius: 2px;
    box-shadow: 0 1px 4px rgba(15, 14, 35, 0.08);
}

/* --- Botón centrado --- */
.actions {
    margin-top: 18px;
    display: flex;
    justify-content: center;
    width: 100%;
}

.btn {
    appearance: none;
    border: 0;
    border-radius: 10px;
    padding: 12px 22px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
}

.btn-primary {
    background: #6C47FF;
    color: #fff;
    box-shadow: 0 6px 18px rgba(108, 71, 255, 0.25);
    transition: transform .08s ease, box-shadow .2s ease, background .2s ease;
}

.btn-primary:hover {
    background: #5b3de0;
    box-shadow: 0 8px 22px rgba(108, 71, 255, 0.32);
}

.btn-primary:active {
    transform: translateY(1px);
    box-shadow: 0 4px 14px rgba(108, 71, 255, 0.22);
}

/* --- Responsivo: reduce el máximo en pantallas chicas --- */
@media (max-width: 1024px) {

    .media img,
    .media video {
        max-width: 92vw;
    }
}

.skill-star-item {
    background-color: transparent;
    border-radius: 8px;
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
    justify-content: space-between;
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
    font-size: 14px;
    color: #2b2c34;
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
    /* para que el hover hacia atrás funcione */
    justify-content: flex-end;
    gap: 1px;
}

.valoracion button {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
}

.valoracion .star {
    width: 22px;
    height: 22px;
    fill: #5f5050;
    transition: fill 0.3s, transform 0.3s;
}

/* Efecto de hover y relleno progresivo */
.valoracion button:hover~button .star,
.valoracion button:hover .star {
    fill: #ffa400;
    transform: rotate(72deg);
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
}

/* grid 2 columnas (colapsa a 1 en pantallas pequeñas) */
.video-eval-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    width: 100%;
}

@media (max-width: 1024px) {
    .video-eval-grid {
        grid-template-columns: 1fr;
    }
}

/* panel derecho */
.calification-list {
    padding: 16px 14px;
}

.calif-header {
    font-weight: 700;
    font-size: 18px;
    color: var(--brand);
    margin-bottom: 6px;
}

/* notas */
.notes-wrap {
    margin-top: 14px;
}

.notes {
    width: 100%;
    min-height: 96px;
    resize: vertical;
    border: 1px solid #E3E3F0;
    background: #fff;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    color: #2b2c34;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, .03);
}

.notes:focus {
    outline: none;
    border-color: #6C47FF;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, .12);
}

/* Icono info + globo */
.info {
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-left: 6px;
}

.info-btn {
    background: transparent;
    border: 0;
    padding: 2px;
    cursor: pointer;
    line-height: 0;
    border-radius: 6px;
}

.info-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(51, 0, 255, 0.25);
}

/* Tooltip */
.tooltip {
    position: absolute;
    top: 100%;
    right: 0;
    /* alinear a la derecha del icono */
    transform: translateY(8px);
    max-width: 280px;
    background: var(--brand);
    color: #fff;
    font-weight: 500;
    font-size: 11px;
    line-height: 1.35;
    padding: 8px 10px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, .18);
    opacity: 0;
    pointer-events: none;
    transition: opacity .15s ease, transform .15s ease;
    z-index: 5;
    text-align: left;
    white-space: normal;
}

/* Mostrar tooltip al hover/focus */
.info:hover .tooltip,
.info:focus-within .tooltip {
    opacity: 1;
    transform: translateY(4px);
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.leader-score-title {
    text-align: center;
    color: #5B4CD0;
    font-weight: 600;
}

.leader-score-number {
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    color: #5B4CD0;
    line-height: 1;
    margin: 4px 0;
}

.summary-evaluation {
    display: flex;
    flex-direction: column;
    background: transparent;
    border-radius: 8px;
    text-align: start;
}

.summary-comments {
    border: 1px solid #E3DFFF;
    background: transparent;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: start;
    box-shadow: 0 2px 6px #D3D3D3;
}
.summary-meta {
    color: #898A8B;
    margin-bottom: 6px;
}
.summary-subtitle {
    color: #898A8B;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}

.summary-text {
    padding: 0 10px 0 10px;
    color: #2b2c34;
    line-height: 1.6;
    white-space: pre-wrap;
    font-weight: 500;
    font-size: 13px;
    /* respeta saltos de línea */
}

.summary-comments-title {
    font-weight: 600;
    color: #898A8B;
    margin-bottom: 6px;
}

.summary-comment-text {
    color: #000000;
    font-size: 14px;
    font-weight: 500;
}

.summary-role {
    font-weight: 600;
    color: #898A8B;
    font-size: 14px;
}

.summary-name {
    color: #2b2c34;
    margin-left: 6px;
    font-weight: 500;
    font-size: 14px;
}

.summary-label {
    font-weight: 600;
    font-size: 14px;
    color: #898A8B;
    /* estilo solo para el label */
    margin-right: 6px;
}

.summary-value {
    font-weight: 500;
    font-size: 14px;
    color: #000000;
    /* estilo independiente para el dato */
}

.stars-lg {
    display: flex !important;
    justify-content: center !important;
    gap: 6px !important;
    margin-top: 4px !important;
}

.stars-lg .star {
    width: 28px !important;
    height: 28px !important;
}

/* Preview: imagen encima del botón y centrados */
.preview-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding: 8px 0 4px;
    width: 100%; /* Asegura contenedor responsivo */
}

.preview-img {
    width: 100%;          /* Nunca sobrepasa el contenedor */
    max-width: 550px;     /* El límite máximo que tú quieres */
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(15, 14, 35, 0.08);
}

.preview-wrap .btn.btn-primary {
    margin-top: 4px;
}

/* preview = 1 columna centrada */
.video-eval-grid.preview {
    grid-template-columns: 1fr;
    justify-items: center;
    /* centra el contenido horizontal */
    text-align: center;
}

.btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 18px;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

/* ❌ Botón rojo suave */
.btn-danger-light {
    background-color: #fde8e8;
    color: #e74c3c;
    border-color: #f8d7da;
}

.btn-danger-light:hover {
    background-color: #f8d7da;
    transform: scale(1.03);
}

/* ✅ Botón verde suave */
.btn-success-light {
    background-color: #e6f9ec;
    color: #27ae60;
    border-color: #c3f1d2;
}

.btn-success-light:hover {
    background-color: #c3f1d2;
    transform: scale(1.03);
}

.btn-outline svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
}


.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
}

.text-purple {
    color: #5B4CD0;
}

.text-yellow {
    color: #B98800;
}

.text-blue {
    color: #2D76D8;
}

.text-cyan {
    color: #005C83;
}

.text-green {
    color: #28A745;
}

.text-red {
    color: #DC2626;
}

.text-orange {
    color: #FD9300;
}

.no-requierd-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #75c1ff 60%, #e3f2fd 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}

.cv-skeleton {
    width: 750px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
    background: #fff;
    border-radius: 12px;
}

/* Quitar bordes innecesarios */
.cv-skeleton .section {
    border-bottom: none;
    padding-bottom: 0;
}

/* Base skeleton */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

/* Línea de texto */
.skel-line {
    height: 14px;
    width: 45%;
    margin: 0 auto 10px auto;
}

/* Media: contenedor del video */
.cv-skeleton .section.video-box {
    display: flex;
    justify-content: center;
}

.cv-skeleton .section.video-box .skeleton {
    width: 550px;
    height: 310px;
    border-radius: 12px;
}

/* Botón */
.skel-pill {
    width: 160px;
    height: 42px;
    border-radius: 25px;
    margin: 0 auto;
}

/* Animación */
@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.pending-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px 24px;
    background: linear-gradient(180deg, #ffe08a 0%, #ffffff 50%);
    border-radius: 16px;
    width: 100%;
    height: 100%;
    gap: 10px;
}

/* círculo del check con degradado suave */
.pending-badge {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(closest-side, #fadf88 60%, #fff3cd 100%);
    border: 1px solid #d3f1dc;
    box-shadow: 0 4px 18px rgba(30, 142, 62, .12), inset 0 0 0 6px #f2fbf6;
    margin-bottom: 14px;
}

.title-data {
    margin: 0;
    font: 700 20px/1.25 Poppins, ui-sans-serif, system-ui;
    color: #222;
}

.subtitle-data {
    margin: 8px 0 18px;
    color: #6b7280;
    font: 400 14px/1.5 Inter, ui-sans-serif, system-ui;
    font-weight: bold;
}
</style>