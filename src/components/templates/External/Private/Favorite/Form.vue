<script setup>
import { SurveyModel, surveyLocalization } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import * as SurveyTheme from "survey-core/themes";
import "survey-core/defaultV2.min.css";

// Configura el idioma global
surveyLocalization.defaultLocale = "es";

const props = defineProps({
  modelForm: Object,
  modelVacant: Object,
  modelApplication: Object,
  showVideoInterviewVacant: Boolean
});

const emit = defineEmits(['videoInterview','submitApplicationStore']);

const survey = new SurveyModel(props.modelForm.questions);
survey.locale = 'es';
survey.applyTheme(SurveyTheme.LayeredLight);

survey.onComplete.add((sender) => {
    props.modelApplication.form_id = props.modelForm.id;
    props.modelApplication.questions = props.modelForm.questions;
    props.modelApplication.answers = sender.data;
    
    props.modelVacant.settings.video_interview ? emit('videoInterview') : emit('submitApplicationStore');
});
</script>
<template>
  <div class="review-container">
    <SurveyComponent :model="survey" />
  </div>
</template>
<style scoped>
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