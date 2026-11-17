<script setup>
import { ref, onMounted } from 'vue'
import { Model as SurveyModel, surveyLocalization } from 'survey-core'
import { SurveyComponent } from 'survey-vue3-ui'
import * as SurveyTheme from 'survey-core/themes'
import 'survey-core/defaultV2.min.css'

surveyLocalization.defaultLocale = 'es'

const props = defineProps({
  modelApplication: Object,
  modelTestTechnical: Object,
  modelTestPsychotechnical: Object,
  typeFormApplication: String
})

const emit = defineEmits(['test','submitTestTechnicalFinish','submitTestPsychotechnicalFinish']);
const survey = ref(null);

onMounted(() => {
  let form = {};
  let start_at = null;

  if(props.typeFormApplication == 'technical') {
    form = props.modelTestTechnical?.relationships?.form?.questions;
    start_at = props.modelTestTechnical.start_at;
  } else if(props.typeFormApplication == 'psychotechnical'){
    form = props.modelTestPsychotechnical?.relationships?.form?.questions;
    start_at = props.modelTestPsychotechnical.start_at;
  } else {
    emit('test');
  }

  survey.value = new SurveyModel(form);
  survey.value.locale = 'es';
  survey.value.applyTheme(SurveyTheme.LayeredLight);

  if (survey.value.timeLimit && start_at) {
    const tiempoTotal = survey.value.timeLimit;
    const inicio = new Date(start_at);
    const ahora = new Date();
    const segundosPasados = Math.floor((ahora - inicio) / 1000);
    const restante = tiempoTotal - segundosPasados;

    if (restante <= 0) {
      survey.value.timeLimit = 0;
      survey.value.completedHtml = `
        <div class="result-container" style=" background: white; width: 100%; height: 100%; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; padding: 20px;">
          <div class="result-title" style=" color: #5B4CD0; font-size: 24px; font-weight: 600; text-align: center; ">
            El tiempo para completar esta prueba ha expirado
          </div>

          <img class="result-image" src="/src/assets/img/ANSWER.gif" alt="Éxito" style=" width: 150px; height: 150px;">

          <div class="result-text" style="width: 100%; max-width: 479px; text-align: center; color: black; font-size: 15px; font-weight: 500; line-height: 24px;">
            El periodo establecido para responder la prueba ha concluido. 
            Tus respuestas disponibles fueron registradas automáticamente.
          </div>

          <div class="result-highlight" style="width: 100%; max-width: 479px; text-align: center; color: #5B4CD0; font-size: 15px; font-weight: 500;">
            Agradecemos tu participación y compromiso con el proceso.
          </div>
        </div>
      `;
      survey.value.completeLastPageAutomatically = true;

      setTimeout(() => survey.value.doComplete(), 300);
    } else {
      survey.value.timeLimit = restante;
    }
  }

  if (survey.value.timeLimit > 0 && survey.value.onTimerFinished) {
    survey.value.onTimerFinished.add(() => {
      survey.value.completedHtml = `
        <div class="result-container" style=" background: white; width: 100%; height: 100%; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; padding: 20px;">
          <div class="result-title" style=" color: #5B4CD0; font-size: 24px; font-weight: 600; text-align: center; ">
            El tiempo se ha agotado
          </div>

          <img class="result-image" src="/src/assets/img/ANSWER.gif" alt="Éxito" style=" width: 150px; height: 150px;">

          <div class="result-text" style="width: 100%; max-width: 479px; text-align: center; color: black; font-size: 15px; font-weight: 500; line-height: 24px;">
            El tiempo asignado para completar la prueba ha finalizado.
            Tus respuestas fueron enviadas automáticamente para su revisión.
          </div>

          <div class="result-highlight" style="width: 100%; max-width: 479px; text-align: center; color: #5B4CD0; font-size: 15px; font-weight: 500;">
            Gracias por tu participación.
          </div>
        </div>
      `;
      survey.value.completeLastPageAutomatically = true;
      setTimeout(() => survey.value.doComplete(), 300);
    })
  }

  survey.value.onComplete.add((sender) => {
    sender.completedHtml = `
      <div class="result-container" style=" background: white; width: 100%; height: 100%; border-radius: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; padding: 20px;">
        <div class="result-title" style=" color: #5B4CD0; font-size: 24px; font-weight: 600; text-align: center; ">
          ¡Has finalizado la prueba con éxito!
        </div>

        <img class="result-image" src="/src/assets/img/STARS.gif" alt="Éxito" style=" width: 150px; height: 150px;">

        <div class="result-text" style="width: 100%; max-width: 479px; text-align: center; color: black; font-size: 15px; font-weight: 500; line-height: 24px;">
          Agradecemos su compromiso y dedicación en este proceso. 
          Confíe en sus habilidades, en su experiencia y en todo lo que ha demostrado.
        </div>

        <div class="result-highlight" style="width: 100%; max-width: 479px; text-align: center; color: #5B4CD0; font-size: 15px; font-weight: 500;">
          ¡Este es solo el comienzo de grandes oportunidades!
        </div>
      </div>
    `;
    
    if(props.typeFormApplication == 'technical') {
      props.modelTestTechnical.questions = props.modelTestTechnical?.relationships?.form?.questions;
      props.modelTestTechnical.answers = sender.data;
      emit('submitTestTechnicalFinish');
    } else if(props.typeFormApplication == 'psychotechnical'){
      props.modelTestPsychotechnical.questions = props.modelTestPsychotechnical?.relationships?.form?.questions;
      props.modelTestPsychotechnical.answers = sender.data;
      emit('submitTestPsychotechnicalFinish');
    }
    setTimeout(() => emit('test'), 5000); 
  })
})
</script>

<template>
  <div class="review-container">
    <SurveyComponent v-if="survey" :model="survey" />
  </div>
</template>

<style scoped>
::v-deep(.sd-body__completed) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.review-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.title {
  text-align: center;
  font-weight: 600;
  color: #4b0082;
  margin-bottom: 1rem;
}

.score-box {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
  color: #2b2c34;
}

.correctAnswer {
  color: #2f855a;
  font-weight: 600;
}

.incorrectAnswer {
  color: #c53030;
  font-weight: 600;
}
</style>
