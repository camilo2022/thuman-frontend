<script setup>
import { ref, computed } from 'vue'
import { Model, surveyLocalization } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import * as SurveyTheme from "survey-core/themes";
import "survey-core/defaultV2.min.css";

// Configura el idioma global
surveyLocalization.defaultLocale = "es";

import imgTest from '@/assets/img/TEST.gif'

const props = defineProps({
  surveys: Array,
  modelForm: Object,
  modelSurvey: Object,
  showQualificationEntity: Boolean,
  showTestEntity: Boolean,
  personId: Number,
  ExistForm: Boolean
})

const emit = defineEmits(['qualification', 'test', 'submitSurveyStore'])

const survey = new Model(props.modelForm.questions);
survey.locale = 'es';
survey.applyTheme(SurveyTheme.LayeredLight);

const calculatePercentageRatings = (surveys) => {
  const total = surveys.length;

  const conteo = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  surveys.forEach(survey => {
    const stars = Math.round(survey.rating?.stars) || 0;
    if (conteo[stars] !== undefined) {
      conteo[stars]++;
    }
  });

  return Object.keys(conteo).map(star => ({
    stars: Number(star),
    percent: total > 0 ? Number(((conteo[star] / total) * 100).toFixed(2)) : 0
  }));
};

const totalStars = computed(() => {
  return (props.surveys || []).reduce((acc, survey) => {
    return acc + (Number(survey.rating?.stars) || 0);
  }, 0);
});

const totalReviews = computed(() => {
  return (props.surveys || []).length;
});

const averageRating = computed(() => {
  return totalReviews.value > 0
    ? totalStars.value / totalReviews.value
    : 0;
});

const ratings = computed(() => {
  return calculatePercentageRatings(props.surveys || []);
});

const visibleCount = ref(5);

const loadMore = () => {
  visibleCount.value += 5;
};

const showLess = () => {
  visibleCount.value = 5;
};

// LISTA REACTIVA
const visibleSurveys = computed(() => {
  return props.surveys.slice(0, visibleCount.value);
});

// BOTONES INTELIGENTES
const hasMore = computed(() => visibleCount.value < props.surveys.length);
const canShowLess = computed(() => visibleCount.value > 5);

const getStarColor = (promedio, n) => {
  const diff = promedio - (n - 1)
  if (diff >= 1) return '100%' // llena
  if (diff <= 0) return '0%'   // vacía
  return `${diff * 100}%`      // parcial
}

survey.onComplete.add((sender) => {
  props.modelSurvey.form_id = props.modelForm.id;
  props.modelSurvey.questions = props.modelForm.questions;
  props.modelSurvey.answers = sender.data;
  props.modelSurvey.person_id = props.personId;
  emit('submitSurveyStore');
});

const getSurveyResponseData = (surveyItem) => {
  const pages = surveyItem?.questions?.pages ?? [];
  const answers = surveyItem?.answers ?? {};

  const allQuestions = pages.flatMap(page => page?.elements ?? []);

  const openQuestion = allQuestions.find(q =>
    ['text', 'comment'].includes(q?.type)
  );

  const ratingQuestion = allQuestions.find(q => {
    if (q?.type !== 'rating') return false;

    const rateMin = Number(q?.rateMin ?? 1);
    const rateMax = Number(q?.rateMax ?? 5);
    const rateStep = Number(q?.rateStep ?? 1);

    return rateMin === 1 && rateMax === 5 && rateStep === 1;
  });

  return {
    openText: openQuestion ? answers[openQuestion.name] ?? '' : '',
    ratingValue: ratingQuestion ? answers[ratingQuestion.name] ?? null : null,
    openTitle: openQuestion?.title ?? '',
    ratingTitle: ratingQuestion?.title ?? 'Calificación'
  };
};
</script>

<template>
  <div class="grid-container" :class="{ 'grid-two': !props.ExistForm }" v-if="props.showQualificationEntity">
    <!-- Columna izquierda -->
    <template v-if="props.ExistForm">
      <div class="col-left">
        <img :src="imgTest" alt="" style="width: 120px; height: 120px;">
        <button class="btn-evaluar" @click="emit('test')">Evaluar Empresa</button>
      </div>
    </template>

    <!-- Columna central (reseñas) -->
    <div class="col-center">
      <h3 style="text-align: start;">{{ props.surveys.length }}
        {{ props.surveys.length === 1 ? 'evaluación' : 'evaluaciones' }}</h3>
      <!-- Reseña 1 -->
      <div class="review" v-for="(survey, i) in visibleSurveys" :key="survey.id">
        <div class="review-header">
          <div class="stars-lg" :aria-label="`Calificación: ${survey.rating.stars} de 5`">
            <span v-for="n in 5" :key="n">
              <svg class="star" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                <defs>
                  <linearGradient :id="`grad-survey-${survey.id}-${n}`" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stop-color="#ffa400" />
                    <stop :offset="getStarColor(survey.rating.stars, n)" stop-color="#ffa400" />
                    <stop :offset="getStarColor(survey.rating.stars, n)" stop-color="#5f5050" />
                    <stop offset="100%" stop-color="#5f5050" />
                  </linearGradient>
                </defs>
                <path :fill="`url(#grad-survey-${survey.id}-${n})`"
                  d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
              </svg>
            </span>
          </div>
          <span class="date">{{ survey.created_at }}</span>
        </div>

        <p class="location" v-if="survey.person.city">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M108,80a20,20,0,1,1,20,20A20,20,0,0,1,108,80ZM60,80a68,68,0,0,1,136,0c0,62.25-59.51,97-62.05,98.42a12,12,0,0,1-11.9,0C119.51,177,60,142.25,60,80Zm24,0c0,38.2,30.71,64.2,44,73.64C141.21,144.15,172,118,172,80a44,44,0,0,0-88,0Zm124.57,65.6a12,12,0,1,0-9.14,22.19C213.56,173.61,220,180.27,220,184c0,4-7.13,11.07-22.77,17.08-18.3,7-42.89,10.92-69.23,10.92s-50.93-3.88-69.23-10.92C43.12,195.07,36,188,36,184c0-3.73,6.44-10.39,20.57-16.21a12,12,0,1,0-9.14-22.19C31.27,152.25,12,164.31,12,184c0,34.14,58.36,52,116,52,29.22,0,56.86-4.44,77.85-12.52C220.1,218,244,205.59,244,184,244,164.31,224.73,152.25,208.57,145.6Z">
            </path>
          </svg>{{ survey.person?.city?.name }}, {{ survey.person.city?.departament?.name }},
          {{ survey.person.city?.departament?.country?.name }}
        </p>

        <p v-if="getSurveyResponseData(survey).openText" class="comment">
          {{ getSurveyResponseData(survey).openText }}.
        </p>

        <div class="calification" v-if="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256">
            <path d="M80,104V208H32a8,8,0,0,1-8-8V112a8,8,0,0,1,8-8Z" opacity="0.2"></path>
            <path
              d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z">
            </path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 256 256">
            <path d="M80,48V152H32a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8Z" opacity="0.2"></path>
            <path
              d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z">
            </path>
          </svg>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <!-- Mostrar menos -->
        <button v-if="canShowLess" class="btn-evaluar btn-less" @click="showLess">
          Mostrar menos
        </button>
        <!-- Mostrar más -->
        <button v-if="hasMore" class="btn-evaluar btn-more" @click="loadMore">
          Mostrar más
        </button>
      </div>
    </div>

    <!-- Columna derecha (puntuación) -->
    <div class="col-right">
      <div class="general-rating">
        <h3>Puntuación general</h3>
        <p class="rating">{{ averageRating.toFixed(1) }}</p>

        <!-- estrellas promedio -->

        <span v-for="n in 5" :key="n">
          <svg class="star" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
            <defs>
              <linearGradient :id="`grad-average-${n}`" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stop-color="#ffa400" />
                <stop :offset="getStarColor(averageRating.toFixed(1), n)" stop-color="#ffa400" />
                <stop :offset="getStarColor(averageRating.toFixed(1), n)" stop-color="#5f5050" />
                <stop offset="100%" stop-color="#5f5050" />
              </linearGradient>
            </defs>
            <path :fill="`url(#grad-average-${n})`"
              d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
          </svg>
        </span>

        <p class="total-reviews">Basado en {{ totalReviews.toLocaleString() }} {{ totalReviews > 1 ? 'evaluaciones' :
          'evaluación' }}</p>
      </div>

      <!-- distribución -->
      <div class="bars">
        <div v-for="r in ratings" :key="r.stars" class="bar-row">
          <span class="stars-label">{{ r.stars }}</span>
          <div class="bar">
            <div class="fill" :style="{ width: r.percent + '%' }"></div>
          </div>
          <span class="percent">{{ r.percent }}%</span>
        </div>
      </div>
    </div>
  </div>
  <div class="review-container" v-else-if="props.showTestEntity">
    <SurveyComponent :model="survey" />
  </div>
</template>

<style scoped>
.btn-more,
.btn-less {
  padding: 10px 18px;
  margin: 0 8px;
}

.review-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  align-items: flex-start;
  grid-template-areas:
    "left center right";
}

.grid-two {
  display: grid;
  grid-template-columns: 2fr 1fr !important;
  gap: 20px;
  align-items: flex-start;
  grid-template-areas:
    "center right" !important;
}

/* asignar áreas */
.col-left {
  grid-area: left;
}

.col-center {
  grid-area: center;
}

.col-right {
  grid-area: right;
}

/* En pantallas pequeñas (mobile) */
@media (max-width: 960px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "left"
      "right"
      "center";
  }
}


/* Columna izquierda */
.col-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  gap: 6px;
}

.btn-evaluar {
  background-color: white;
  color: #5b4cd0;
  border: 2px solid #5b4cd0;
  border-radius: 30px;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.btn-evaluar:hover {
  background: #5b4cd0;
  color: white;
}

/* Columna central */
.col-center {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
}

.review {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.review:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 14px;
}

.stars-lg {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
}

.stars-lg .star {
  width: 15px;
  height: 15px;
}

.star {
  color: #ff9800;
}

.date {
  color: #888;
}

.location {
  display: flex;
  text-align: center;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.location svg {
  color: #6a5acd !important;
}

.comment {
  text-align: start;
  margin-top: 5px;
  font-size: 13px;
}

.calification {
  display: flex;
  gap: 6px;
  color: #6a5acd !important;
  font-weight: bold;
}

/* Columna derecha */
.col-right {
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.general-rating {
  background: #f7f5ff;
  border-radius: 10px;
  padding: 10px;
}

.general-rating h3 {
  color: #5B4CD0 !important;
}

.rating {
  font-size: 2rem;
  font-weight: bold;
  color: #6a5acd;
}

.bars {
  margin-top: 15px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 6px;
}

.bar {
  flex: 1;
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #6a5acd;
}

/* Responsivo */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    /* una sola columna en móvil */
  }
}

/* @media (max-width: 700px) {
  .grid-two{
    display: grid;
    grid-template-columns: 1fr !important;
    gap: 20px;
    align-items: flex-start;
    grid-template-areas: none !important;
  }
} */

.stars-lg {
  display: inline-flex;
  gap: 2px;
  vertical-align: middle;
}

.star {
  fill: #d1d5db;
  /* gris claro */
}

.star.active {
  fill: #f59e0b;
  /* ámbar */
}

/* columnas de texto */
.stars-label {
  width: 20px;
  text-align: right;
}

.percent {
  width: 40px;
  text-align: left;
}

.total-reviews {
  font-size: 14px;
}

@media (max-width: 960px) {

  .grid-container,
  .grid-two {
    display: grid;
    grid-template-columns: 1fr !important;
    grid-template-areas:
      "right"
      "left"
      "center" !important;
    gap: 16px;
  }

  .col-left,
  .col-center,
  .col-right {
    width: 100%;
  }

  .col-center,
  .col-right,
  .review-container {
    padding: 12px;
    box-sizing: border-box;
  }

  .general-rating {
    padding: 16px 12px;
  }

  .rating {
    font-size: 1.8rem;
    margin: 8px 0;
  }

  .bars {
    margin-top: 12px;
  }

  .bar-row {
    gap: 6px;
    font-size: 12px;
  }

  .stars-label {
    width: 18px;
  }

  .percent {
    width: 38px;
    font-size: 12px;
  }

  .review-header {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
  }

  .stars-lg {
    justify-content: flex-start;
  }

  .location {
    align-items: flex-start;
    text-align: left;
    line-height: 1.4;
  }

  .comment {
    font-size: 13px;
    line-height: 1.5;
  }
}

@media (max-width: 600px) {

  .grid-container,
  .grid-two {
    gap: 12px;
  }

  .col-center,
  .col-right {
    padding: 10px;
    border-radius: 8px;
  }

  .col-left img {
    width: 90px !important;
    height: 90px !important;
  }

  .btn-evaluar {
    width: 100%;
    max-width: 260px;
    padding: 10px 14px;
    font-size: 14px;
  }

  .review {
    padding: 12px 0;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .date {
    font-size: 12px;
  }

  .stars-lg .star,
  .star {
    width: 18px;
    height: 18px;
  }

  .general-rating h3 {
    font-size: 16px;
  }

  .rating {
    font-size: 1.6rem;
  }

  .total-reviews {
    font-size: 12px;
  }

  .bar-row {
    display: grid;
    grid-template-columns: 24px 1fr 42px;
    gap: 6px;
    width: 100%;
  }

  .bar {
    height: 7px;
  }

  .review-container {
    padding: 10px;
    overflow-x: hidden;
  }
}

@media (max-width: 380px) {
  .col-center h3 {
    font-size: 16px;
  }

  .btn-more,
  .btn-less {
    width: 100%;
    margin: 6px 0;
  }

  .location {
    font-size: 12px;
  }

  .comment {
    font-size: 12px;
  }

  .stars-lg .star,
  .star {
    width: 16px;
    height: 16px;
  }
}
</style>
