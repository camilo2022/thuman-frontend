<script setup>
import { ref, onMounted } from 'vue'
import { Model as SurveyModel, surveyLocalization } from 'survey-core'
import { SurveyComponent } from 'survey-vue3-ui'
import * as SurveyTheme from 'survey-core/themes'
import 'survey-core/defaultV2.min.css'

surveyLocalization.defaultLocale = 'es'

const props = defineProps({
  modelProgress: Object
})

const emit = defineEmits(['index','submitProgressFinish']);

const survey = ref(null);

onMounted(() => {
    const form = props.modelProgress.questions
    const start_at = props.modelProgress.start_at

    survey.value = new SurveyModel(form)
    survey.value.locale = 'es'
    survey.value.applyTheme(SurveyTheme.LayeredLight)

    if (survey.value.timeLimit && start_at) {
        const tiempoTotal = survey.value.timeLimit
        const inicio = new Date(start_at)
        const ahora = new Date()
        const segundosPasados = Math.floor((ahora - inicio) / 1000)
        const restante = tiempoTotal - segundosPasados

        if (restante <= 0) {
            survey.value.timeLimit = 0
            props.modelProgress.result = 'Rechazado'

            survey.value.completedHtml = `
              <div class="result-container">
                <div class="result-title">El tiempo para completar esta prueba ha expirado</div>
                <p>El periodo establecido para responder la prueba ha concluido.</p>
                <p>Las respuestas disponibles fueron registradas automáticamente.</p>
              </div>
            `

            survey.value.completeLastPageAutomatically = true
            setTimeout(() => survey.value.doComplete(), 300)
        } else {
            survey.value.timeLimit = restante
        }
    }

    if (survey.value.timeLimit > 0 && survey.value.onTimerFinished) {
        survey.value.onTimerFinished.add(() => {
            props.modelProgress.result = 'Rechazado'

            survey.value.completedHtml = `
              <div class="result-container">
                <div class="result-title">El tiempo se ha agotado</div>
                <p>El tiempo asignado para completar la prueba ha finalizado.</p>
                <p>Tus respuestas fueron enviadas automáticamente para su revisión.</p>
              </div>
            `

            survey.value.completeLastPageAutomatically = true
            setTimeout(() => survey.value.doComplete(), 300)
        })
    }

    survey.value.onComplete.add((sender) => {
        const resultado = evaluarResultadoSurvey(sender)

        props.modelProgress.result = resultado
        props.modelProgress.answers = sender.data

        sender.completedHtml = resultado === 'Aprobado'
            ? `
              <div class="result-container">
                <div class="result-title">¡Has finalizado la prueba con éxito!</div>
                <p>Agradecemos su compromiso y dedicación en este proceso.</p>
                <p>¡Este es solo el comienzo de grandes oportunidades!</p>
              </div>
            `
            : `
              <div class="result-container">
                <div class="result-title">Resultado no aprobado</div>
                <p>No se alcanzaron los criterios requeridos para aprobar la prueba.</p>
                <p>Le invitamos a revisar el contenido y realizar un nuevo intento.</p>
              </div>
            `

        emit('submitProgressFinish')
        setTimeout(() => emit('index'), 5000)
    })
})


function evaluarResultadoSurvey(sender) {
    const questions = sender.getAllQuestions();
    const evaluables = questions.filter(q => q.correctAnswer !== undefined);
    if (evaluables.length === 0) {
        return 'Aprobado';
    }
    const todasCorrectas = evaluables.every(q => {
        const respuestaUsuario = sender.data[q.name];
        if (respuestaUsuario === undefined || respuestaUsuario === null) {
            return false;
        }
        if (Array.isArray(q.correctAnswer)) {
            return JSON.stringify(respuestaUsuario) === JSON.stringify(q.correctAnswer);
        }
        return respuestaUsuario === q.correctAnswer;
    });
    return todasCorrectas ? 'Aprobado' : 'Rechazado';
}

</script>

<template>
    <div class="breadcrumb">
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
        <span>Bienestar</span>
        <span>|</span>
        <span>Inducción</span>
        <span>|</span>
        <span class="active">Encuesta</span>
    </div>

    <div class="container-data">
        <div class="split with-panel">
            <div class="split-main">
                <div class="main-container">
                    <h2 class="titulo">Encuesta</h2>
                    <div class="preview-wrap">
                        <SurveyComponent v-if="survey" :model="survey" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>