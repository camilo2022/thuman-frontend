<script setup>
import { computed } from 'vue'

const props = defineProps({
  applications: Array,
  pagination: Object,
  showIndexApplication: Boolean
})

const emit = defineEmits([
  'token', 'submitApplicationFind', 'submitContractFind', 'submitApplicationNotifyToken', 'affiliation', 'contract', 'submitContractNotifyToken', 'toFavorite'
])

const tooltipMessage = computed(() => {
  const tech = application?.test_technical?.status
  const psycho = application?.test_psychotechnical?.status

  // Sin pruebas asignadas
  if (!application.test_technical && !application.test_psychotechnical)
    return 'Aún no tienes pruebas técnicas o psicotécnicas asignadas.'

  // Ambas completadas o expiradas
  if (['Realizado', 'Expirado'].includes(tech) && ['Realizado', 'Expirado'].includes(psycho))
    return 'Ya se entregaron los resultados de las pruebas.'

  // Cualquier otro caso (por seguridad)
  return 'Las pruebas no están disponibles en este momento.'
})

const goTo = p => props.pagination.current_page = p
const prev = () => goTo(props.pagination.current_page - 1)
const next = () => goTo(props.pagination.current_page + 1)

const pageItems = computed(() => {
  const total = props.pagination.total_pages
  const current = props.pagination.current_page
  const delta = 2
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)
  pages.push(1)
  if (left > 2) pages.push('…')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('…')
  pages.push(total)
  return pages
})

const BASE_PHASES = [
  { key: 'postulacion', label: 'Postulación' },
  { key: 'revision', label: 'Revisión' },
  { key: 'pruebas', label: 'Pruebas' },
  { key: 'finalista', label: 'Finalista' },
  { key: 'contratacion', label: 'Contratación' }
]

const FINAL_STATUSES = ['Vinculado', 'Rechazado', 'Desistió']

const isRejectedApplication = application => application?.status === 'Rechazado'
const isLinkedApplication = application => application?.status === 'Vinculado'

const getTimelinePhases = application => {
  if (isRejectedApplication(application)) {
    const lastPhaseIndex = getPhaseIndex(application)

    return [
      ...BASE_PHASES.slice(0, lastPhaseIndex + 1),
      { key: 'rechazado', label: 'Rechazado' }
    ]
  }

  if (isLinkedApplication(application)) {
    return [
      ...BASE_PHASES,
      { key: 'vinculado', label: 'Vinculado' }
    ]
  }

  return BASE_PHASES
}

const isStoppedPhase = (application, phase) =>
  isRejectedApplication(application) &&
  phase.key === BASE_PHASES[getPhaseIndex(application)]?.key

const isStepDone = (application, phase, index) => {
  if (isLinkedApplication(application)) {
    return phase.key !== 'vinculado'
  }

  return index < getPhaseIndex(application)
}

const isStepCurrent = (application, phase, index) => {
  if (isRejectedApplication(application)) return phase.key === 'rechazado'
  if (isLinkedApplication(application)) return phase.key === 'vinculado'

  return index === getPhaseIndex(application) && !isFinalStatus(application?.status)
}

const isStepPending = (application, index) => {
  if (isRejectedApplication(application) || isLinkedApplication(application)) return false
  return index > getPhaseIndex(application)
}

const getPhaseIndex = application => {
  const status = application?.status

  if (status === 'Postulación') return 0
  if (status === 'En revisión') return 1
  if (status === 'Prueba') return 2
  if (status === 'Finalista') return 3
  if (['Contratación', 'Vinculado'].includes(status)) return 4

  if (['Rechazado', 'Desistió'].includes(status)) {
    if (application?.exam_medical || application?.exam_polygraph) return 3
    if (application?.test_technical || application?.test_psychotechnical) return 2
    return 1
  }

  return 0
}

const isFinalStatus = status => FINAL_STATUSES.includes(status)

const canDoTests = application =>
  application.status === 'Prueba' &&
  (
    ['Pendiente', 'En curso'].includes(application?.test_technical?.status) ||
    ['Pendiente', 'En curso'].includes(application?.test_psychotechnical?.status)
  )

const canShowNoTestsAssigned = application =>
  application.status === 'Prueba' &&
  !application.test_technical &&
  !application.test_psychotechnical

const canShowTestsFinished = application =>
  application.status === 'Prueba' &&
  (
    ['Finalizado', 'Expirado'].includes(application?.test_technical?.status) ||
    ['Finalizado', 'Expirado'].includes(application?.test_psychotechnical?.status)
  )

const canShowDocumentation = application =>
  application.status === 'Contratación' &&
  !application.contract

const canShowContractSign = application =>
  application.status === 'Contratación' &&
  ['Aprobado'].includes(application.contract?.legal_representative_status) &&
  ['Pendiente', 'Actualizar'].includes(application.contract?.person_status)

const hasActions = application =>
  canDoTests(application) ||
  canShowNoTestsAssigned(application) ||
  canShowTestsFinished(application) ||
  canShowDocumentation(application) ||
  canShowContractSign(application)
</script>

<template>
  <div style="margin: 3% 8%;">
    <div class="profile-wrapper">
      <div class="tabs">
        <router-link to="/profile" class="tab">Perfil</router-link>
        <div @click="emit('toFavorite')" class="tab">Favoritos</div>
        <router-link to="/application" class="tab active">Postulaciones</router-link>
      </div>
      <div style="padding: 20px;">

        <div class="tabla-toolbar">
          <label class="page-size">
            Elementos por página:
            <select v-model="props.pagination.per_page" class="select-underline">
              <option v-for="n in props.pagination.sizes" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>

          <div class="search-underline">
            <input v-model="props.pagination.search" type="text" placeholder="Buscar" />
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#5B4CD0"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
        <template v-if="props.applications.length == 0">
          <div class="no-results">
            <div class="no-results">
              <div class="no-results-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="#000000" viewBox="0 0 256 256">
                  <path
                    d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z">
                  </path>
                </svg>
              </div>
              <p class="info" style="font-size: 14px;">No se encontraron registros</p>
            </div>
          </div>
        </template>
        <template v-else>
          <section class="content-section">
            <div v-for="(application, index) in props.applications" :key="index" class="card-container">
              <div class="card-header">
                <div class="card-area">{{ application.vacant.position.area?.name }}</div>
                <div class="card-title">{{ application.vacant.position.name }}</div>
                <div class="text">Fecha de publicación: {{ application.vacant.start_date }}</div>
                <div class="text">
                  {{ `${application.vacant.headquarter.entity.name}
                  ${application.vacant.headquarter.entity.entity_type.settings.abreviature}` }}
                </div>
              </div>

              <div class="card-body">
                <div class="timeline compact-timeline">
                  <div v-for="(phase, phaseIndex) in getTimelinePhases(application)" :key="phase.key" class="step"
                    :class="{
                      done: isStepDone(application, phase, phaseIndex),
                      current: isStepCurrent(application, phase, phaseIndex),
                      pending: isStepPending(application, phaseIndex),
                      stopped: isStoppedPhase(application, phase),
                      rejected: phase.key === 'rechazado',
                      linked: phase.key === 'vinculado'
                    }">

                    <div class="icon2">
                      <svg v-if="phase.key === 'postulacion'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 256 256" fill="currentColor">
                        <path
                          d="M220.49,59.51l-40-40A12,12,0,0,0,172,16H92A20,20,0,0,0,72,36V56H56A20,20,0,0,0,36,76V216a20,20,0,0,0,20,20H164a20,20,0,0,0,20-20V196h20a20,20,0,0,0,20-20V68A12,12,0,0,0,220.49,59.51ZM160,212H60V80h67l33,33Zm40-40H184V108a12,12,0,0,0-3.51-8.49l-40-40A12,12,0,0,0,132,56H96V40h71l33,33Z" />
                      </svg>

                      <svg v-else-if="phase.key === 'revision'" xmlns="http://www.w3.org/2000/svg" width="18"
                        height="18" viewBox="0 0 256 256" fill="currentColor">
                        <path
                          d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" />
                      </svg>

                      <svg v-else-if="phase.key === 'pruebas'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                        viewBox="0 0 256 256" fill="currentColor">
                        <path
                          d="M240.49,83.51l-60-60a12,12,0,0,0-17,0L34.28,152.75a48.77,48.77,0,0,0,69,69L214.48,110.49l21.31-7.11a12,12,0,0,0,4.7-19.87ZM86.28,204.75a24.77,24.77,0,0,1-35-35l28.13-28.13c7.73-2.41,19.58-3,35.06,5a83.94,83.94,0,0,0,21.95,8ZM204.2,88.62a12.15,12.15,0,0,0-4.69,2.89l-38.89,38.9c-7.73,2.41-19.58,3-35.06-5a83.94,83.94,0,0,0-21.94-8L172,49l37.79,37.79Z" />
                      </svg>

                      <svg v-else-if="phase.key === 'finalista'" xmlns="http://www.w3.org/2000/svg" width="18"
                        height="18" viewBox="0 0 256 256" fill="currentColor">
                        <path
                          d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                      </svg>

                      <svg v-else-if="phase.key === 'rechazado'" xmlns="http://www.w3.org/2000/svg" width="18"
                        height="18" viewBox="0 0 256 256" fill="currentColor">
                        <path
                          d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm36.49,131.51a12,12,0,0,1-17,17L128,145l-19.51,23.51a12,12,0,0,1-17-17L111,128,91.51,108.49a12,12,0,0,1,17-17L128,111l19.49-19.51a12,12,0,0,1,17,17L145,128Z" />
                      </svg>

                      <svg v-else-if="phase.key === 'vinculado'" xmlns="http://www.w3.org/2000/svg" width="18"
                        height="18" viewBox="0 0 256 256" fill="currentColor">
                        <path
                          d="M229.66,90.34l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,201.37,218.34,79a8,8,0,0,1,11.32,11.32Z" />
                      </svg>

                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                        viewBox="0 0 256 256">
                        <path
                          d="M114.32,49.8A19.79,19.79,0,0,0,81.72,57L29.22,201.41A19.82,19.82,0,0,0,47.75,228a20,20,0,0,0,6.84-1.22L199,174.28a19.79,19.79,0,0,0,7.24-32.6ZM104.19,183.21l-31.4-31.4L82.94,123.9l49.16,49.16Zm-52.42,26.4Zm12-32.91L79.3,192.26l-24.45,8.89ZM157,164,92,99l10-27.58L184.57,154ZM128,40V16a12,12,0,0,1,24,0V40a12,12,0,0,1-24,0Zm116.48,83.51a12,12,0,0,1-17,17l-16-16a12,12,0,0,1,17-17Zm-.69-40.13-24,8a12,12,0,0,1-7.59-22.77l24-8a12,12,0,1,1,7.59,22.77ZM156.6,65.93C159.83,47.47,173.39,36,192,36c6.45,0,8.69-2.49,10-4.92a18,18,0,0,0,2-7.22V24a12,12,0,0,1,24,0c0,14.47-9.59,36-36,36-4.94,0-10.21,1.19-11.76,10.06A12,12,0,0,1,168.43,80a12.35,12.35,0,0,1-2.08-.18A12,12,0,0,1,156.6,65.93Z">
                        </path>
                      </svg>
                    </div>

                    <span class="step-label">{{ phase.label }}</span>
                  </div>
                </div>

                <div class="actions" v-if="hasActions(application)">
                  <button type="button" class="nav-link btn-primary" v-if="canDoTests(application)"
                    @click="emit('submitApplicationFind', application.id); emit('submitApplicationNotifyToken', application.id); emit('token', 'test')">
                    Realizar pruebas
                  </button>

                  <button type="button" class="nav-link btn-primary tooltip"
                    data-title="Aún no tienes pruebas técnicas o psicotécnicas asignadas."
                    style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0; cursor: not-allowed;"
                    v-else-if="canShowNoTestsAssigned(application)">
                    Realizar pruebas
                  </button>

                  <button type="button" class="nav-link btn-primary tooltip"
                    data-title="Ya se entregaron los resultados de las pruebas."
                    style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0; cursor: not-allowed;"
                    v-else-if="canShowTestsFinished(application)">
                    Realizar pruebas
                  </button>

                  <button type="button" class="nav-link btn-primary" v-if="canShowDocumentation(application)"
                    @click="emit('submitApplicationFind', application.id); emit('affiliation');">
                    Documentación
                  </button>

                  <button type="button" class="nav-link btn-primary" v-if="canShowContractSign(application)"
                    @click="emit('submitContractFind', application.id); emit('submitContractNotifyToken', application.id); emit('token', 'contract');">
                    Firma del contrato
                  </button>
                </div>
              </div>
            </div>

          </section>
        </template>
        <div class="table-footer">
          <div class="page-info">
            Página {{ props.pagination.current_page }} de {{ props.pagination.total_pages }}
          </div>
          <div class="pagination">
            <button class="page-btn" aria-label="Primera" @click="goTo(1)"
              :disabled="props.pagination.current_page === 1">
              &laquo;
            </button>
            <button class="page-btn" aria-label="Anterior" @click="prev()"
              :disabled="props.pagination.current_page === 1">
              &lsaquo;
            </button>
            <!-- Páginas dinámicas -->
            <div v-for="(p, i) in pageItems" :key="i">
              <button v-if="p !== '…'" class="page-btn" :class="{ active: p === props.pagination.current_page }"
                @click="goTo(p)">
                {{ p }}
              </button>
              <span v-else class="dots">…</span>
            </div>
            <button class="page-btn" aria-label="Siguiente" @click="next()"
              :disabled="props.pagination.current_page === props.pagination.total_pages">
              &rsaquo;
            </button>
            <button class="page-btn" aria-label="Última" @click="goTo(props.pagination.total_pages)"
              :disabled="props.pagination.current_page === props.pagination.total_pages">
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
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
  Transition: opacity .2s ease;
  z-index: 9999;
  /* siempre al frente */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.tooltip:hover::after {
  opacity: 1;
}

.profile-wrapper {
  padding: 50px;
  width: 100%;
  background: #fff;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  gap: 5px;
}

.tab {
  color: #2b2c34;
  text-decoration: none;
  border-radius: 10px;
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-weight: 600;
  font-size: 18px;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.tab:hover {
  background: #f3f3f3;
  color: #5b4cd0;
}

.tab.active {
  background: #f2eaff;
  color: #5b4cd0;
  border-bottom: none;
}

/* TARJETA PERFIL */
.profile-card {
  width: 100%;
  padding: 30px;
  text-align: center;
  box-sizing: border-box;
}

.title {
  color: #5b4cd0;
  font-weight: bold;
}

.profile-center {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.image {
  width: 8%;
}

.btn-create {
  border: 1px solid #5b4cd0;
  background: #FBF9FF;
  color: #5b4cd0;
  padding: 8px 20px;
  border-radius: 17px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-create:hover {
  background: #5b4cd0;
  color: #fff;
}

.caption {
  font-size: 12px;
  color: #555;
}

/* CONTENIDO PRINCIPAL */
.content-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 5px;
}

.card-container {
  width: 100%;
  background: white;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin-bottom: 25px;
}

.card-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.card-header {
  padding: 16px 24px;
  border-bottom: 2px solid #eee4ff;
}

.actions {
  width: 100% !important;
  text-align: center !important;
  background: #f8f5ff;
}

.actions:empty {
  width: 100% !important;
  background: #f8f5ff;
}

.actions button {
  border-radius: 8px;
}

.card-area {
  font-size: 15px !important;
  color: #898A8B !important;
  font-weight: 500;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 4px;
  color: #2b2c34;
}

.card-subtitle,
.card-company {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  background: #f8f5ff;
  border-radius: 0 0 10px 10px;
  padding: 16px 16px;
  overflow-x: auto;
  position: relative;
}

/* Paso */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 80px;
}

/* Línea entre pasos */
.step::after {
  content: "";
  position: absolute;
  top: 24px;
  /* Centra la línea verticalmente con el icono */
  right: -44px;
  /* Longitud horizontal entre círculos */
  width: 60px;
  height: 3px;
  background: #5b4cd0;
  z-index: 0;
}

/* No dibujar la línea después del último paso */
.step:last-child::after {
  display: none;
}

/* Círculo con ícono */
.icon2 {
  width: 48px;
  height: 48px;
  border: 3px solid #5b4cd0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.3s ease;
  z-index: 1;
}

.step.active .icon2 {
  background: #5b4cd0;
}

.step.active .icon2 svg {
  fill: #fff;
}

/* Texto */
.step span {
  margin-top: 6px;
  font-size: 13px;
  color: #5b4cd0;
  font-weight: 600;
  text-align: center;
}

.card-header {
  background: #fff;
  /* mantiene blanco arriba */
  border-bottom: 2px solid #eee4ff;
}

.card-body {
  background: #f8f5ff;
}

@media (max-width: 768px) {
  .profile-wrapper {
    padding: 20px 12px;
  }

  .content-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-container {
    margin-bottom: 16px;
    border-radius: 14px;
  }

  .card-header {
    padding: 14px 16px;
  }

  .card-area {
    font-size: 14px !important;
  }

  .card-title {
    font-size: 16px;
  }

}

@media (max-width: 600px) {
  .profile-wrapper {
    padding: 30px 15px 30px 15px;
  }

  .profile-card {
    padding: 0;
  }
}

@media (max-width: 768px) {
  .tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .tab {
    text-align: center;
    padding: 10px 6px;
    font-size: 13px;
    border-radius: 12px;
    white-space: nowrap;
  }
}

.timeline.compact-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #f8f5ff;
  padding: 14px 16px 10px;
  overflow: hidden;
}

.timeline.compact-timeline .step {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 0 0 auto;
  width: 26px;
  min-width: 26px;
  transition: all 0.25s ease;
}

.timeline.compact-timeline .step::after {
  content: "";
  position: absolute;
  top: 50%;
  left: calc(100% + 4px);
  transform: translateY(-50%);
  width: 12px;
  height: 2px;
  background: #d8cffd;
}

.timeline.compact-timeline .step:last-child::after {
  display: none;
}

.timeline.compact-timeline .step.done::after,
.timeline.compact-timeline .step.current::after {
  background: #5b4cd0;
}

.timeline.compact-timeline .icon2 {
  width: 26px;
  height: 26px;
  min-width: 26px;
  border: 2px solid #cfc5fb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #b4a9ef;
  transition: all 0.25s ease;
  z-index: 1;
}

.timeline.compact-timeline .step.done .icon2 {
  background: #5b4cd0;
  border-color: #5b4cd0;
  color: #fff;
}

.timeline.compact-timeline .step.pending .icon2 {
  background: #fff;
  border-color: #d8cffd;
  color: #c7bcfa;
}

.timeline.compact-timeline .step.current {
  width: auto;
  min-width: 120px;
  justify-content: flex-start;
  gap: 8px;
}

.timeline.compact-timeline .step.current .icon2 {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border: 3px solid #5b4cd0;
  background: #5b4cd0;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(91, 76, 208, 0.12);
}

.timeline.compact-timeline .step-label {
  width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  font-size: 0;
  transition: all 0.2s ease;
}

.timeline.compact-timeline .step.current .step-label {
  width: auto;
  opacity: 1;
  font-size: 13px;
  font-weight: 700;
  color: #5b4cd0;
}

.final-badge {
  margin: 0 16px 14px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  background: #eee4ff;
  color: #5b4cd0;
}

.final-badge.Vinculado {
  background: #e8f7ee;
  color: #1f7a3f;
}

.final-badge.Rechazado,
.final-badge.Desistió {
  background: #fdecec;
  color: #b42318;
}

@media (max-width: 768px) {
  .timeline.compact-timeline {
    gap: 8px;
    padding: 12px;
  }

  .timeline.compact-timeline .step.current {
    min-width: 96px;
  }

  .timeline.compact-timeline .step.current .step-label {
    font-size: 12px;
  }
}

/* Estilo para el modal */

/* el step ya no dibuja la línea */
.timeline.compact-timeline .step::after {
  display: none;
}

/* línea ahora sale desde el círculo */
.timeline.compact-timeline .step:not(:last-child) .icon2::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  width: 12px;
  height: 2px;
  border-radius: 999px;
  background: #d8cffd;
}

/* líneas activas */
.timeline.compact-timeline .step.done .icon2::after,
.timeline.compact-timeline .step.current .icon2::after {
  background: #5b4cd0;
}

.timeline.compact-timeline .step.done .icon2 {
  background: #5b4cd0;
  border-color: #5b4cd0;
  color: #fff;
}

.timeline.compact-timeline .step.pending .icon2 {
  background: #fff;
  border-color: #d8cffd;
  color: #c7bcfa;
}

.timeline.compact-timeline .step.current {
  width: auto;
  min-width: 120px;
  justify-content: flex-start;
  gap: 8px;
}

.timeline.compact-timeline .step.current .icon2 {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border: 3px solid #5b4cd0;
  background: #5b4cd0;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(91, 76, 208, 0.12);
}

/* opcional: línea del paso actual un poco más corta */
.timeline.compact-timeline .step.current .icon2::after {
  width: 10px;
}

.timeline.compact-timeline .step-label {
  width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  font-size: 0;
  transition: all 0.2s ease;
}

.timeline.compact-timeline .step.current .step-label {
  width: auto;
  opacity: 1;
  font-size: 13px;
  font-weight: 700;
  color: #5b4cd0;
}

.card-container {
  width: 100%;
  background: white;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
}

.card-body {
  background: #f8f5ff;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 16px;
}

.timeline.compact-timeline {
  background: transparent;
}

.final-badge {
  margin: 8px 16px 0;
}

.actions {
  width: 100% !important;
  text-align: center !important;
  background: transparent;
  margin-top: auto;
  padding: 14px 16px 0;
  min-height: 56px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.actions:empty {
  background: transparent;
  min-height: 56px;
  padding: 14px 16px 0;
}

.actions button {
  border-radius: 8px;
}

.timeline.compact-timeline {
  gap: 8px;
  padding: 10px 14px 6px;
}

.timeline.compact-timeline .step.current {
  min-width: 96px;
  gap: 6px;
}

.timeline.compact-timeline .step.current .icon2 {
  width: 44px;
  height: 44px;
  min-width: 44px;
}

.timeline.compact-timeline .step-label {
  line-height: 1;
}

.timeline.compact-timeline .step.current .step-label {
  font-size: 12px;
}

.card-body {
  padding-bottom: 10px;
}

.final-badge {
  margin: 4px 16px 0;
}

.actions {
  min-height: 44px;
  padding: 10px 16px 0;
}

.timeline.compact-timeline .step.linked .icon2 {
  background: #e8f7ee;
  border-color: #1f7a3f;
  color: #1f7a3f;
  box-shadow: 0 0 0 4px rgba(31, 122, 63, 0.08);
}

.timeline.compact-timeline .step.linked .step-label {
  width: auto;
  opacity: 1;
  font-size: 12px;
  font-weight: 700;
  color: #1f7a3f;
}

.timeline.compact-timeline .step.done.linked .icon2::after,
.timeline.compact-timeline .step.linked .icon2::after {
  background: #1f7a3f;
}
</style>