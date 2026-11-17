<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelApplication: Object,
  modelTestTechnical: Object,
  modelTestPsychotechnical: Object,
  formatTime: Function
});

const emit = defineEmits([
  'form',
  'submitApplicationFind',
  'submitTestTechnicalFind',
  'submitTestPsychotechnicalFind',
  'submitTestTechnicalStart',
  'submitTestPsychotechnicalStart'
]);

const status = ref({
  Pendiente: {
    color: '#5b5bd6',
    soft: '#eeedff',
    border: '#d9d6ff',
    description: 'Debe realizar la prueba antes de que pase la fecha límite para presentarla.',
    icon: `<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z"></path>`
  },
  'En curso': {
    color: '#d97706',
    soft: '#fff4e5',
    border: '#fde7bf',
    description: 'Debe completar la prueba antes de que pase el tiempo estipulado.',
    icon: `<path d="M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z"></path>`
  },
  Finalizado: {
    color: '#16a34a',
    soft: '#eaf8ef',
    border: '#ccefd7',
    description: 'La prueba ya fue respondida exitosamente.',
    icon: `<path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path>`
  },
  Expirado: {
    color: '#dc2626',
    soft: '#feecec',
    border: '#f7caca',
    description: 'Ya pasó la fecha límite para presentar la prueba.',
    icon: `<path d="M225.81,74.65A11.86,11.86,0,0,1,220.3,76a12,12,0,0,1-10.67-6.47,90.1,90.1,0,0,0-32-35.38,12,12,0,1,1,12.8-20.29,115.25,115.25,0,0,1,40.54,44.62A12,12,0,0,1,225.81,74.65ZM46.37,69.53a90.1,90.1,0,0,1,32-35.38A12,12,0,1,0,65.6,13.86,115.25,115.25,0,0,0,25.06,58.48a12,12,0,0,0,5.13,16.17A11.86,11.86,0,0,0,35.7,76,12,12,0,0,0,46.37,69.53Zm173.51,98.35A20,20,0,0,1,204,200H171.81a44,44,0,0,1-87.62,0H52a20,20,0,0,1-15.91-32.12c7.17-9.33,15.73-26.62,15.88-55.94A76,76,0,0,1,204,112C204.15,141.26,212.71,158.55,219.88,167.88ZM147.6,200H108.4a20,20,0,0,0,39.2,0Zm48.74-24c-8.16-13-16.19-33.57-16.34-63.94A52,52,0,1,0,76,112c-.15,30.42-8.18,51-16.34,64Z"></path>`
  }
});

function getStatusConfig(testStatus) {
  return status.value[testStatus] || status.value.Pendiente;
}

function getQuestionCount(test) {
  return (
    test?.relationships?.form?.questions?.pages?.reduce(
      (acc, page) => acc + (page.elements?.length || 0),
      0
    ) || 0
  );
}

function isActionable(testStatus) {
  return testStatus === 'Pendiente' || testStatus === 'En curso';
}

function getActionText(testStatus) {
  if (testStatus === 'Pendiente') return 'Iniciar prueba';
  if (testStatus === 'En curso') return 'Continuar prueba';
  if (testStatus === 'Finalizado') return 'Prueba completada';
  if (testStatus === 'Expirado') return 'Prueba expirada';
  return 'Ver prueba';
}

const availableTests = computed(() =>
  [props.modelTestTechnical, props.modelTestPsychotechnical].filter(test => test?.id)
);

const activeTests = computed(() =>
  availableTests.value.filter(test => ['Pendiente', 'En curso'].includes(test?.status)).length
);

const totalQuestions = computed(() =>
  availableTests.value.reduce((acc, test) => acc + getQuestionCount(test), 0)
);

function handleTestTechnical() {
  if (props.modelTestTechnical?.status === 'Pendiente') {
    emit('submitTestTechnicalStart');
    emit('form', 'technical');
  } else if (props.modelTestTechnical?.status === 'En curso') {
    emit('form', 'technical');
  }
}

function handleTestPsychotechnical() {
  if (props.modelTestPsychotechnical?.status === 'Pendiente') {
    emit('submitTestPsychotechnicalStart');
    emit('form', 'psychotechnical');
  } else if (props.modelTestPsychotechnical?.status === 'En curso') {
    emit('form', 'psychotechnical');
  }
}
</script>

<template>
  <div class="competencias-container">
    <div class="hero">
      <div class="hero-copy">
        <span class="hero-eyebrow">Proceso de evaluación</span>
        <h2>
          Pruebas
          <span v-if="props.modelApplication?.relationships?.vacant?.position?.name">
            - {{ props.modelApplication.relationships.vacant.position.name }}
          </span>
        </h2>
        <p class="hero-text">
          Completa las pruebas pendientes para continuar con tu proceso. Revisa el tipo
          de prueba, su duración y el estado actual antes de comenzar.
        </p>
      </div>

     
    </div>

    <div class="cards-container">
      <!-- Tarjeta técnica -->
      <article v-if="props.modelTestTechnical?.id" class="test-card"
        :class="{ actionable: isActionable(props.modelTestTechnical?.status), disabled: !isActionable(props.modelTestTechnical?.status) }"
        :style="{
          '--accent': getStatusConfig(props.modelTestTechnical?.status).color,
          '--accent-soft': getStatusConfig(props.modelTestTechnical?.status).soft,
          '--accent-border': getStatusConfig(props.modelTestTechnical?.status).border
        }" @click="isActionable(props.modelTestTechnical?.status) ? handleTestTechnical() : null">
        <div class="card-top">
          <div class="card-heading">
            <div class="test-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                :fill="getStatusConfig(props.modelTestTechnical?.status).color" viewBox="0 0 256 256"
                v-html="getStatusConfig(props.modelTestTechnical?.status).icon" />
            </div>

            <div class="card-title-group">
              <span class="test-type">
                {{ props.modelTestTechnical?.relationships?.form?.form_type?.name }}
              </span>
              <h3>
                {{ props.modelTestTechnical?.relationships?.form?.questions?.title }}
              </h3>
            </div>
          </div>

          <span class="status-badge" :style="{
            color: getStatusConfig(props.modelTestTechnical?.status).color,
            backgroundColor: getStatusConfig(props.modelTestTechnical?.status).soft,
            borderColor: getStatusConfig(props.modelTestTechnical?.status).border
          }">
            {{ props.modelTestTechnical?.status }}
          </span>
        </div>

        <p class="test-description">
          {{
            props.modelTestTechnical?.relationships?.form?.questions?.description ||
            getStatusConfig(props.modelTestTechnical?.status).description
          }}
        </p>

        <div class="test-meta">
          <div class="meta-item">
            <span class="meta-label">Preguntas</span>
            <span class="meta-value">
              {{ getQuestionCount(props.modelTestTechnical) }}
            </span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Duración</span>
            <span class="meta-value">
              {{ props.formatTime(props.modelTestTechnical?.relationships?.form?.questions?.timeLimit) }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <p class="status-text">
            {{ getStatusConfig(props.modelTestTechnical?.status).description }}
          </p>

          <button class="action-btn" :disabled="!isActionable(props.modelTestTechnical?.status)"
            @click.stop="handleTestTechnical">
            {{ getActionText(props.modelTestTechnical?.status) }}
          </button>
        </div>
      </article>

      <!-- Tarjeta psicotécnica -->
      <article v-if="props.modelTestPsychotechnical?.id" class="test-card"
        :class="{ actionable: isActionable(props.modelTestPsychotechnical?.status), disabled: !isActionable(props.modelTestPsychotechnical?.status) }"
        :style="{
          '--accent': getStatusConfig(props.modelTestPsychotechnical?.status).color,
          '--accent-soft': getStatusConfig(props.modelTestPsychotechnical?.status).soft,
          '--accent-border': getStatusConfig(props.modelTestPsychotechnical?.status).border
        }" @click="isActionable(props.modelTestPsychotechnical?.status) ? handleTestPsychotechnical() : null">
        <div class="card-top">
          <div class="card-heading">
            <div class="test-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                :fill="getStatusConfig(props.modelTestPsychotechnical?.status).color" viewBox="0 0 256 256"
                v-html="getStatusConfig(props.modelTestPsychotechnical?.status).icon" />
            </div>

            <div class="card-title-group">
              <span class="test-type">
                {{ props.modelTestPsychotechnical?.relationships?.form?.form_type?.name }}
              </span>
              <h3>
                {{ props.modelTestPsychotechnical?.relationships?.form?.questions?.title }}
              </h3>
            </div>
          </div>

          <span class="status-badge" :style="{
            color: getStatusConfig(props.modelTestPsychotechnical?.status).color,
            backgroundColor: getStatusConfig(props.modelTestPsychotechnical?.status).soft,
            borderColor: getStatusConfig(props.modelTestPsychotechnical?.status).border
          }">
            {{ props.modelTestPsychotechnical?.status }}
          </span>
        </div>

        <p class="test-description">
          {{
            props.modelTestPsychotechnical?.relationships?.form?.questions?.description ||
            getStatusConfig(props.modelTestPsychotechnical?.status).description
          }}
        </p>

        <div class="test-meta">
          <div class="meta-item">
            <span class="meta-label">Preguntas</span>
            <span class="meta-value">
              {{ getQuestionCount(props.modelTestPsychotechnical) }}
            </span>
          </div>

          <div class="meta-item">
            <span class="meta-label">Duración</span>
            <span class="meta-value">
              {{ props.formatTime(props.modelTestPsychotechnical?.relationships?.form?.questions?.timeLimit) }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <p class="status-text">
            {{ getStatusConfig(props.modelTestPsychotechnical?.status).description }}
          </p>

          <button class="action-btn" :disabled="!isActionable(props.modelTestPsychotechnical?.status)"
            @click.stop="handleTestPsychotechnical">
            {{ getActionText(props.modelTestPsychotechnical?.status) }}
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

.competencias-container {
  width: 100%;
  padding: 32px;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.hero-copy {
  flex: 1 1 620px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: #eeedff;
  color: #5b5bd6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero h2 {
  margin: 0 0 10px;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
}

.hero-text {
  margin: 0;
  max-width: 780px;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.hero-summary {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.summary-box {
  padding: 16px 18px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.summary-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}

.summary-box strong {
  font-size: 1.5rem;
  color: #111827;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 22px;
}

.test-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.test-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 5px;
  background: linear-gradient(90deg, var(--accent));
}

.test-card.actionable {
  cursor: pointer;
}

.test-card.actionable:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
  border-color: var(--accent-border);
}

.test-card.disabled {
  opacity: 0.95;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 18px;
  min-height: 0;
}

.card-heading {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  min-width: 0;
  flex: 1;
}

.test-icon {
  width: 58px;
  height: 58px;
  min-width: 58px;
  border-radius: 18px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title-group {
  min-width: 0;
}

.test-type {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

.card-title-group h3 {
  margin: 0;
  color: #111827;
  font-size: 1.2rem;
  line-height: 1.35;
  font-weight: 700;
  word-break: break-word;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 700;
}

.test-description {
  margin: 0 0 18px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.test-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.meta-item {
  padding: 5px 10px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
}

.meta-label {
  display: block;
  color: #9ca3af;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.meta-value {
  color: #111827;
  font-size: 13px;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.status-text {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.action-btn {
  border: none;
  outline: none;
  padding: 13px 18px;
  border-radius: 5px;
  background: var(--accent);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  transition: transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

@media (max-width: 768px) {
  .competencias-container {
    padding: 22px;
    border-radius: 20px;
  }

  .hero h2 {
    font-size: 1.55rem;
  }

  .cards-container {
    grid-template-columns: 1fr;
  }

  .card-top {
    flex-direction: column;
    align-items: stretch;
  }

  .status-badge {
    align-self: flex-start;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-summary {
    width: 100%;
  }

  .summary-box {
    flex: 1 1 100%;
  }

  .test-meta {
    grid-template-columns: 1fr;
  }
}
</style>