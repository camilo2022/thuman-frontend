<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import  imgUserPic from '@/assets/img/USERPIC.png';

import { SurveyModel, surveyLocalization } from "survey-core";
surveyLocalization.defaultLocale = "es";

const props = defineProps({
    modelInterviewInitial: Object,
    loadingDetail: Boolean
})
const emit = defineEmits(['detail'])

const agendCollapsed = ref(true);

const plainData = ref([]);

watch(() => props.modelInterviewInitial, (v) => {
    if (!v || !v.questions || !v.answers) return;
    
    const survey = new SurveyModel(v.questions);
    survey.data = v.answers;
    const data = survey.getPlainData({ includeQuestionTypes: true });
    plainData.value = data;
  }, { deep: true, immediate: true }
);

function formatDisplayValue(value) {
  if (value === true) return "Sí";
  if (value === false) return "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" — ");
  }
  return value ?? "—";
}

const formatCOP = (value) => {
  if (value == null || value == 0) return null;
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
};

const getStarColor = (promedio, n) => {
  const diff = promedio - (n - 1);
  if (diff >= 1) return '100%'; // estrella completa
  if (diff <= 0) return '0%';   // vacía
  return `${diff * 100}%`;      // parcial
};
</script>

<template>
    <div>
        <div class="sub-container" v-if="props.loadingDetail">
            <div aria-busy="true" :inert="true">
                <!-- HEADER -->
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div class="skeleton-title skeleton-block"></div>
                    <div class="skeleton-block" style="width:30px;height:30px;border-radius:6px;"></div>
                </div>

                <!-- FOTO + NOMBRE -->
                <div class="card-img" style="margin-top:20px;display:flex;gap:15px;align-items:center;">
                    <div class="skeleton-avatar skeleton-block"></div>
                    <div class="skeleton-title skeleton-block" style="width:250px;"></div>
                </div>

                <!-- DATOS DE AGENDAMIENTO -->
                <div style="margin-top:30px;">
                    <div class="skeleton-title skeleton-block" style="width:200px;"></div>
                    <div  v-for="n in 10" class="skeleton-line skeleton-block"></div>
                </div>

                <!-- RESULTADOS -->
                <div style="margin-top:30px;">
                    <div class="skeleton-title skeleton-block" style="width:180px;"></div>
                    <div class="skeleton-title skeleton-block" style="width:60px;height:30px;"></div>
                    <div  v-for="n in 5" class="skeleton-line skeleton-block"></div>
                </div>

                <!-- COMENTARIOS / META -->
                <div  v-for="n in 2" style="margin-top:20px;">
                    <div class="skeleton-line skeleton-block"></div>
                    <div class="skeleton-textarea skeleton-block"></div>
                    <div class="skeleton-badge skeleton-block" style="width:120px;"></div>
                </div>
            </div>
        </div>
        <div class="sub-container" v-else>

            <!-- Cabecera con foto + nombre -->
            <div class="card-img">
                <img class="profile-pic" :src="props.modelInterviewInitial.relationships?.application?.person?.photo?.path || imgUserPic" alt="Foto candidata/o" />
                <span style="display:flex;align-items:center;gap:15px;font-weight:600;font-size:18px;">
                    {{ [props.modelInterviewInitial.relationships?.application?.person.first_name, props.modelInterviewInitial.relationships?.application?.person.second_name, props.modelInterviewInitial.relationships?.application?.person.first_last_name, props.modelInterviewInitial.relationships?.application?.person.second_last_name].filter(Boolean).join(' ') }}
                </span>
            </div>

            <div style="margin-top:20px;">
                <section>
                    <ul class="section-list">

                        <!-- Agendamiento -->
                        <li>
                            <h3>Agendamiento de entrevista</h3>
                        </li>
                        <div class="card-body">
                            <div class="card-description">
                                <p><strong>Documento:</strong> {{ (props.modelInterviewInitial.relationships?.application?.person.document_type.settings.abreviature + ' - ' + props.modelInterviewInitial.relationships?.application?.person.document_number) || '—' }}</p>
                                <p><strong>Entidad:</strong> {{ props.modelInterviewInitial.relationships?.application?.vacant.headquarter.entity.name || '—' }} {{ props.modelInterviewInitial.relationships?.application?.vacant.headquarter.entity.entity_type.settings.abreviature }}</p>
                                <p><strong>Sede:</strong> {{ props.modelInterviewInitial.relationships?.application?.vacant.headquarter.name || '—' }}</p>
                                <p><strong>Dirección:</strong> 
                                    <p class="motivo">
                                        {{ props.modelInterviewInitial.relationships?.application?.vacant.headquarter.address || '—' }}
                                    </p>
                                </p>
                                <p><strong>Indicación:</strong> {{ props.modelInterviewInitial.indication || 'Sin indicaciones' }}</p>
                                <p><strong>Fecha:</strong> {{ props.modelInterviewInitial.date_time || '—' }}</p>
                                <p>
                                    <strong>Estado:</strong>
                                    <span class="badge" :class="{
                                        'bg-green': props.modelInterviewInitial.status === 'Realizado',
                                        'bg-purple': ['Programado', 'Reprogramado'].includes(props.modelInterviewInitial.status),
                                        'bg-red': props.modelInterviewInitial.status === 'Desistió',
                                    }">
                                        {{ props.modelInterviewInitial.status }}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <!-- Resultados -->
                        <li>
                            <h3>Resultados entrevista</h3>
                        </li>
                        <div class="score-summary">
                            <div class="alert-yellow" style="margin-top:15px;display:flex;gap:10px;align-content:center;align-items:center;" v-if="!props.modelInterviewInitial.leader_id || !props.modelInterviewInitial.reviewer_id">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z"/>
                                </svg>
                                <p>
                                    <template v-if="!props.modelInterviewInitial.leader_id && !props.modelInterviewInitial.reviewer_id">
                                    Aún no se ha realizado ninguna calificación para esta entrevista.
                                    </template>

                                    <template v-else-if="!props.modelInterviewInitial.leader_id">
                                    La calificación mostrada es parcial, ya que falta la evaluación del líder de área.
                                    </template>

                                    <template v-else-if="!props.modelInterviewInitial.reviewer_id">
                                    La calificación mostrada es parcial, ya que falta la evaluación del área de Talento Humano.
                                    </template>
                                </p>
                            </div>
                            <div class="leader-score" v-if="props.modelInterviewInitial.leader_id || props.modelInterviewInitial.reviewer_id" style="margin-top: 15px;">
                                <div class="leader-score-title">Puntuación del candidato</div>
                                <div class="leader-score-number">{{ ((props.modelInterviewInitial.leader_score + props.modelInterviewInitial.reviewer_score) / 2) }}</div>
                                <div class="stars-lg">
                                    <span v-for="n in [1, 2, 3, 4, 5]" :key="n">
                                        <svg class="star" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" >
                                            <defs>
                                            <!-- Gradiente dinámico para cada estrella -->
                                            <linearGradient :id="`grad-total-${n}`" x1="0" x2="1" y1="0" y2="0">
                                                <stop offset="0%" stop-color="#ffa400" />
                                                <stop :offset="getStarColor(((props.modelInterviewInitial.leader_score + props.modelInterviewInitial.reviewer_score) / 2), n)" stop-color="#ffa400" />
                                                <stop :offset="getStarColor(((props.modelInterviewInitial.leader_score + props.modelInterviewInitial.reviewer_score) / 2), n)" stop-color="#5f5050" />
                                                <stop offset="100%" stop-color="#5f5050" />
                                            </linearGradient>
                                            </defs>

                                            <!-- Usamos el gradiente calculado -->
                                            <path :fill="`url(#grad-total-${n})`" d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <!-- RESEÑAS DE AMBOS -->
                            <div class="summary-box" style="margin-top: 15px;">
                                <div class="alert-yellow" style="display:flex;gap:10px;align-content:center;align-items:center;" v-if="!props.modelInterviewInitial.reviewer_id">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                    </svg>
                                    <p>El área de Talento Humano aún no ha realizado la calificación de la entrevista del postulante para esta vacante.</p>
                                </div>
                                <div class="summary-meta" v-if="props.modelInterviewInitial.reviewer_id">
                                    <span class="summary-role">Talento humano:</span>
                                    <span class="summary-name">{{ [props.modelInterviewInitial.relationships?.reviewer?.first_name, props.modelInterviewInitial.relationships?.reviewer?.second_name, props.modelInterviewInitial.relationships?.reviewer?.first_last_name, props.modelInterviewInitial.relationships?.reviewer?.second_last_name].filter(Boolean).join(' ') }}</span>
                                </div>

                                <div class="summary-meta" v-if="props.modelInterviewInitial.reviewer_id">
                                    <span class="summary-subtitle">Aspiracion salarial:</span>
                                    <span class="summary-text">{{ [formatCOP(props.modelInterviewInitial?.salary_min), formatCOP(props.modelInterviewInitial?.salary_max)].filter(Boolean).join(' - ') || '$ -' }}</span>
                                </div>
                                
                                <div class="form-container agend-card" :class="{ 'is-collapsed': agendCollapsed }" v-if="props.modelInterviewInitial.reviewer_id && plainData.length > 0">
                                    <div class="form-section">
                                        <div class="section-title-row">
                                            <div class="section-title-acordion">Información complementaria</div>

                                            <button class="collapse-btn"
                                                @click="agendCollapsed = !agendCollapsed" :aria-expanded="!agendCollapsed"
                                                :title="agendCollapsed ? 'Expandir' : 'Contraer'">
                                                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                                                    <circle cx="12" cy="12" r="10" fill="none" stroke="#5B4CD0"
                                                        stroke-width="1.8" />
                                                    <path class="chev" :class="{ rotated: !agendCollapsed }" d="M10 8 L14 12 L10 16"
                                                        fill="none" stroke="#5B4CD0" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                        <transition >
                                            <div v-show="!agendCollapsed" class="agend-content">
                                                <div id="survey-results-container" class="grid-layout">
                                                    <ul class="summary-list-info">
                                                        <li v-for="(question, i) in plainData" :key="i" class="summary-item-info">
                                                            <span class="summary-subtitle-info">{{ question.title || question.name }}</span>
                                                            <template v-if="question.isNode && question.data?.length">
                                                            <ul class="summary-sublist-info">
                                                                <li v-for="(panel, j) in question.data" :key="j" class="summary-subitem-info">
                                                                    <span class="summary-text-info">
                                                                        <strong>Panel {{ j + 1 }}:</strong>
                                                                    </span>
                                                                    <ul>
                                                                        <li v-for="(child, k) in panel.data" :key="k" class="summary-child-item-info">
                                                                            <span class="summary-subsubtitle-info">{{ child.title }}</span>
                                                                            <ul>
                                                                                <li v-for="(val, key) in child.displayValue" :key="key" class="summary-leaf-item-info">
                                                                                    <span class="summary-leaf-label-info">{{ key }}:</span>
                                                                                    <span class="summary-leaf-value-info">{{ val }}</span>
                                                                                </li>
                                                                            </ul>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                            </template>

                                                            <template v-else>
                                                                <span class="summary-text">
                                                                    {{ formatDisplayValue(question.displayValue ?? question.value) }}
                                                                </span>
                                                            </template>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </transition>
                                    </div>
                                </div>

                                <div class="summary-meta" v-if="props.modelInterviewInitial.reviewer_id">
                                    <span class="summary-subtitle">Comentarios:</span>
                                    <span class="summary-text">{{ props.modelInterviewInitial.reviewer_observation || '—' }}</span>
                                </div>

                                <div class="summary-meta" v-if="props.modelInterviewInitial.reviewer_id">
                                    <span class="summary-role">Resultado:</span>
                                    <span class="summary-name">
                                        <span style="font-weight: bold;" :class="{
                                            'text-green': props.modelInterviewInitial.reviewer_status === 'Aprobado',
                                            'text-purple': props.modelInterviewInitial.reviewer_status === 'Pendiente',
                                            'text-red': props.modelInterviewInitial.reviewer_status === 'Rechazado',
                                        }">{{ props.modelInterviewInitial.reviewer_status }} 
                                        </span>
                                    </span>
                                    <div class="leader-score">
                                        <div class="leader-score-title">Puntuación de Talento Humano</div>
                                        <div class="leader-score-number">{{ props.modelInterviewInitial.reviewer_score }}</div>
                                        <div class="stars-lg">
                                            <span v-for="n in [1, 2, 3, 4, 5]" :key="n">
                                                <svg class="star" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" >
                                                    <defs>
                                                    <!-- Gradiente dinámico para cada estrella -->
                                                    <linearGradient :id="`grad-reviewer-${n}`" x1="0" x2="1" y1="0" y2="0">
                                                        <stop offset="0%" stop-color="#ffa400" />
                                                        <stop :offset="getStarColor(props.modelInterviewInitial.reviewer_score, n)" stop-color="#ffa400" />
                                                        <stop :offset="getStarColor(props.modelInterviewInitial.reviewer_score, n)" stop-color="#5f5050" />
                                                        <stop offset="100%" stop-color="#5f5050" />
                                                    </linearGradient>
                                                    </defs>

                                                    <!-- Usamos el gradiente calculado -->
                                                    <path :fill="`url(#grad-reviewer-${n})`" d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="summary-box" style="margin-top: 15px;">
                                <div class="alert-yellow" style="display:flex;gap:10px;align-content:center;align-items:center;" v-if="!props.modelInterviewInitial.leader_id">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                    </svg>
                                    <p>El líder de área aún no ha efectuado la calificación de la entrevista correspondiente al aspirante de esta vacante.</p>
                                </div>
                                <div class="summary-meta" v-if="props.modelInterviewInitial.leader_id">
                                    <span class="summary-role">Líder de área:</span>
                                    <span class="summary-name">{{ [props.modelInterviewInitial.relationships?.leader?.first_name, props.modelInterviewInitial.relationships?.leader?.second_name, props.modelInterviewInitial.relationships?.leader?.first_last_name, props.modelInterviewInitial.relationships?.leader?.second_last_name].filter(Boolean).join(' ') }}</span>
                                </div>

                                <div class="summary-meta" v-if="props.modelInterviewInitial.leader_id">
                                    <span class="summary-subtitle">Comentarios:</span>
                                    <span class="summary-text">{{ props.modelInterviewInitial.leader_observation || '—' }}</span>
                                </div>

                                <div class="summary-meta" v-if="props.modelInterviewInitial.leader_id">
                                    <span class="summary-role">Resultado:</span>
                                    <span class="summary-name">
                                        <span style="font-weight: bold;" :class="{
                                            'text-green': props.modelInterviewInitial.leader_status === 'Aprobado',
                                            'text-purple': props.modelInterviewInitial.leader_status === 'Pendiente',
                                            'text-red': props.modelInterviewInitial.leader_status === 'Rechazado',
                                        }">{{ props.modelInterviewInitial.leader_status }} 
                                        </span>
                                    </span>
                                    <div class="leader-score">
                                        <div class="leader-score-title">Puntuación de Líder de área</div>
                                        <div class="leader-score-number">{{ props.modelInterviewInitial.leader_score }}</div>
                                        <div class="stars-lg">
                                            <span v-for="n in [1, 2, 3, 4, 5]" :key="n">
                                                <svg class="star" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" >
                                                    <defs>
                                                    <!-- Gradiente dinámico para cada estrella -->
                                                    <linearGradient :id="`grad-leader-${n}`" x1="0" x2="1" y1="0" y2="0">
                                                        <stop offset="0%" stop-color="#ffa400" />
                                                        <stop :offset="getStarColor(props.modelInterviewInitial.leader_score, n)" stop-color="#ffa400" />
                                                        <stop :offset="getStarColor(props.modelInterviewInitial.leader_score, n)" stop-color="#5f5050" />
                                                        <stop offset="100%" stop-color="#5f5050" />
                                                    </linearGradient>
                                                    </defs>

                                                    <!-- Usamos el gradiente calculado -->
                                                    <path :fill="`url(#grad-leader-${n})`" d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96Z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </ul>
                </section>
            </div>
        </div>
    </div>
</template>


<!-- pega aquí exactamente tus estilos existentes -->
<style scoped>
.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
}

.skeleton-avatar { width:75px; height:75px; border-radius:20%; }
.skeleton-title  { width:180px; height:22px; margin:8px 0; }
.skeleton-line   { width:100%; height:14px; margin:6px 0; }
.skeleton-badge  { width:85px; height:22px; border-radius:20px; margin-top:8px; }
.skeleton-stars  { width:140px; height:26px; margin:15px 0; }

@keyframes shimmer {
    0%   { background-position: 100% 0 }
    100% { background-position: 0 0 }
}
.alert-yellow {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 500;
    align-items: center;
}
/* (PEGADO SIN CAMBIOS) todo tu CSS del componente anterior */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap
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

.badge svg {
    display: block
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2
}

.badge--warn {
    color: #8a6a00;
    background: #fff7cc;
    border-color: #ffe894
}

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca
}

.card-img {
    display: flex;
    justify-content: start;
    padding: 10px 0 0;
    gap: 20px
}

.profile-pic {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff
}

.card-body {
    padding: 0 0 5px 10px
}

.card-body-formation {
    padding: 5px 0 5px 10px;
    border-left: 3px solid #5b4cd0
}

.card-description {
    font-size: .9rem;
    color: #111
}

.card-description p {
    display: flex;
    gap: 6px;
    font-size: 13px
}

.card-description strong {
    font-weight: 600;
    font-size: 13px;
    color: #000;
}

.card-description svg {
    color: #5b4cd0
}

.info-icon {
    width: 16px;
    height: 16px;
    fill: #5b4cd0;
    flex-shrink: 0
}

.section-list {
    list-style: none;
    padding: 0;
    margin: 0
}

.section-list>li {
    position: relative;
    padding-left: 20px;
    color: #5b4cd0
}

.section-list>li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 4px;
    font-size: 20px;
    color: #5b4cd0;
    line-height: 1
}

.subtitulo {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%
}

.card-body-files {
    padding: 0 0 5px 10px
}

.info-file {
    display: flex;
    align-items: center;
    background-color: #F4EFFC;
    padding: 10px;
    border: 2px solid #5B4CD0;
    border-radius: 5px;
    justify-content: space-between
}

.info-file span {
    color: #000;
    font-weight: 600;
    font-size: 16px
}

.action-file {
    display: flex;
    align-items: center;
    gap: 8px
}

.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #5b4cd0;
    cursor: pointer;
    border: 1px solid #dadcfb;
    transition: transform .15s ease, background .15s ease
}

.icon-btn:hover {
    transform: translateY(-1px);
    background: #e6e8ff
}

.icon-btn svg {
    width: 18px;
    height: 18px;
    display: block
}

.sub-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    gap: 10px;
    margin-bottom: 30px
}

.sub-titulo {
    font-size: 20px;
    font-weight: 600;
    color: #5b4cd0;
}

.bg-purple {
    background-color: #F4EFFC;
    color: #5B4CD0;
    border-color: #5B4CD0;
}

.bg-yellow {
    background-color: #FEF9C2;
    color: #B98800;
}

.bg-blue {
    background-color: #DBEAFE;
    color: #2D76D8;
}

.bg-cyan {
    background-color: #C2EDFF;
    color: #005C83;
}

.bg-green {
    background-color: #DCFCE7;
    color: #28A745;
    border-color: #28A745;
}

.bg-red {
    background-color: #FFEDED;
    color: #DC2626;
    border-color: #DC2626;
}

.bg-orange {
    background-color: #FFEFD9;
    color: #FD9300;
}

.empresa-container {
    padding: 30px;
    background-color: #ffffff;
}

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

/* Títulos */
.section-title {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
}

.section-title-acordion {
    font: 500 15px/1 Poppins, sans-serif;
    color: #5B4CD0;
    font-size: 20px;
    font-weight: bold;
}

/* Layouts */

.grid-layout {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* padre: 2 columnas (izq / der) */
.grid-layout-th {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
}

/* cada columna apila sus bloques */
.grid-col {
    display: grid;
    grid-auto-rows: min-content;
}

/* subgrid de 3 columnas para vive + salario */
.grid-trio {
    display: grid;
    grid-template-columns: 1fr 1fr;
    /* 3 columnas iguales */
    gap: 16px;
}

/* inputs a ancho completo */
.input-group .input-box,
.input-group input,
.input-group select,
.input-group :where(.search-select, .SearchSelect) {
    width: 100%;
}

/* responsive: apilar */
@media (max-width: 992px) {
    .grid-layout-th {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 720px) {
    .grid-trio {
        grid-template-columns: 1fr;
    }

    /* los 3 se apilan */
}

.grid-layout .input-group {
    flex: 1;
}


/* Indentar contenido en card */

/* Responsive */
@media (max-width:1024px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width:768px) {

    .grid-layout {
        grid-template-columns: 1fr;
    }
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.grid-interview {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
}

.grid-interview.one-col {
    grid-template-columns: 1fr;
}


.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Cada columna ocupa 50% */
    gap: 12px;
    width: 100%;
    align-items: start;
}

.skill-star-item {
    background-color: #f9f5ff;
    border-radius: 8px;
    padding: 12px;
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

.skill-star-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-star-name {
    font-weight: 600;
    font-size: 16px;
    color: #2b2c34;
}

/* star */


.valoracion {
    display: flex;
    flex-direction: row-reverse;
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
    width: 28px;
    height: 28px;
    fill: #5f5050;
    transition: fill 0.3s, transform 0.3s;
}

/* Efecto de hover y relleno progresivo */
.valoracion:not(.readonly) button:hover~button .star,
.valoracion:not(.readonly) button:hover .star {
    fill: #ffa400;
    transform: rotate(72deg);
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
}

.form-container p {
    margin: 6px 0;
    font-size: 14px;
}

.form-container strong {
    font-weight: 600;
    font-size: 14px;
    color: #898A8B;
    display: inline-block;
    min-width: 60px;
}

/* Header del bloque con botón a la derecha */
.section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

/* Botón circular con chevron */
.collapse-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.collapse-btn svg {
    display: block;
}

.collapse-btn .chev {
    transform-origin: 12px 12px;
    transition: transform .2s ease;
}

/* Cuando está expandido, rota el chevron para apuntar hacia abajo */
.collapse-btn .chev.rotated {
    transform: rotate(90deg);
}

/* (Opcional) Hover sutil */
.collapse-btn:hover circle {
    stroke: #6A5BEA;
}

.collapse-btn:hover .chev {
    stroke: #6A5BEA;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity .18s ease, transform .24s ease;
}

/* El propio contenedor (card) también transiciona sutilmente */
.agend-card {
    transition: padding .22s ease, margin .22s ease, box-shadow .22s ease, border-color .22s ease, background-color .22s ease;
}

/* Cuando está colapsado: menos padding inferior, sombra más sutil, borde un pelín más claro */
.agend-card.is-collapsed {
    padding-bottom: 12px;
    /* antes tenía 20px */
    box-shadow: 0 2px 6px rgba(91, 76, 208, .05);
    border-color: #EEEAFD;
    background-color: #FCFAFF;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    padding: 12px 16px;
    border: 1px solid #5B4CD0;
    /* borde en color de marca */
    background: #FCFAFF;
    /* fondo suave */
    color: #5B4CD0;
    /* texto del mismo tono */
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    height: 100%;
}

.leader-summary {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid #E3DFFF;
    border-radius: 10px;
    background: #fff;
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

.stars-lg {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;
}

.stars-lg .star {
    width: 28px;
    height: 28px;
}

.summary-comments {
    border: 1px solid #E3DFFF;
    background: #FCFAFF;
    border-radius: 8px;
    padding: 12px 16px;
}

.summary-comments-title {
    font-weight: 600;
    color: #898A8B;
    margin-bottom: 6px;
}

.summary-comment-text {
    color: #2b2c34;
    line-height: 1.5;
}

.summary-columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 8px;
}

.summary-box {
    border: 1px solid #E3DFFF;
    background: #fff;
    border-radius: 8px;
    padding: 12px 14px;
}

.summary-meta {
    color: #898A8B;
    margin-bottom: 6px;
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

@media (max-width: 1024px) {
    .summary-columns {
        grid-template-columns: 1fr;
    }

    .grid-interview {
        grid-template-columns: 1fr;
    }
}

.children-ages {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.child-row {
    display: flex;
    gap: 8px;
    align-items: center;
}

.btn-ghost {
    border: 0;
    background: #fff;
    color: #5B4CD0;
    cursor: pointer;
}

.btn-link {
    border: 0;
    background: transparent;
    color: #5B4CD0;
    cursor: pointer;
    padding: 0;
}

.add-link {
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #5b4cd0;
    font-weight: 600;
    justify-content: center;
    font-size: 12px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked+.slider {
    background-color: #5B4CD0;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.checkbox-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

/* Ocultar checkbox nativo */
.checkbox-container input[type="checkbox"] {
    display: none;
}

/* Checkbox personalizado */
.checkbox-container .custom-checkbox {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="%23000000" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-right: 8px;
    cursor: pointer;
    flex-shrink: 0;
}

/* Asegurar alineación vertical del label */
.checkbox-container label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23000000" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Estado marcado */
.checkbox-container input[type="checkbox"]:checked+.custom-checkbox {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23000000" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Layout a dos paneles */
.two-pane {
    display: grid;
    grid-template-columns: 1fr;
    /* por defecto una columna */
    gap: 16px;
    align-items: start;
}

.two-pane.cv-open {
    grid-template-columns: 1fr min(520px, 42vw);
    /* abre 2da col para la CV */
}

.left-pane {
    min-width: 0;
}

/* Encabezado de la sección */
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

/* Cabecera del panel CV */
.cv-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.cv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #EEEAFD;
}

/* Botón reutilizable */
.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #5b4cd0;
    border: 1px solid #dadcfb;
    cursor: pointer;
}

.icon-btn:hover {
    background: #e6e8ff;
}

/* Animaciones */
.slide-in-enter-from,
.slide-in-leave-to {
    opacity: 0;
    transform: translateX(8px);
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: transform .22s ease, opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.cv-scroll {
    min-height: 0;
    /* IMPORTANTE para Flex: permite el overflow */
    overflow: auto;
    /* scroll interno */
    overscroll-behavior: contain;
    /* no arrastra el scroll del body */
    padding: 12px;
}

/* MUY IMPORTANTE para permitir overflow dentro de items de grid */
.left-pane,
.right-panel {
    min-width: 0;
    min-height: 0;
}

/* ----- Panel derecho (contenedor) ----- */
.right-panel {
    display: none;
    /* oculto cuando no hay CV */
    background: #fff;
    border: 1px solid #E3DFFF;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(91, 76, 208, .08);
    /* que no se “estire” por el contenido */
    overflow: hidden;
    /* que quede visible en viewport y no crezca más */
    position: sticky;
    top: 12px;
    height: calc(100vh - 24px);
    /* alto acotado al viewport */
    /* flex para separar header (fijo) y body (scroll) */
    display: flex;
    flex-direction: column;
}

.two-pane.cv-open .right-panel {
    display: flex;
}

.summary-item {
    display: flex;
    gap: 6px;
    line-height: 1.5;
}

.summary-item .summary-subtitle {
    margin: 0;
}

.panel-close {
    border: none; 
    background: transparent; 
    width: 40px; 
    height: 40px; 
    cursor: pointer;
}



/* ===== LISTA PRINCIPAL ===== */
.summary-list-info {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* ===== BLOQUES DE INFORMACIÓN ===== */
.summary-item-info {
  background: #fcfcff;
  border: 1px solid #ece9f6;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 6px rgba(75, 0, 130, 0.05);
  transition: all 0.25s ease;
}

.summary-item-info:hover {
  box-shadow: 0 4px 10px rgba(75, 0, 130, 0.08);
  transform: translateY(-2px);
}

/* ===== TITULOS PRINCIPALES ===== */
.summary-subtitle-info {
  display: block;
  font-weight: 600;
  font-size: 1rem;
  color: #5b4cd0;
  margin-bottom: 0.75rem;
  letter-spacing: 0.2px;
}

/* ===== SUBLISTAS (ej. panel dinámico) ===== */
.summary-sublist-info {
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.3rem;
  border-left: 3px solid #e6defa;
}

.summary-subitem-info {
  margin-bottom: 0.5rem;
}

/* ===== SUBTÍTULOS DENTRO DE LOS PANELS ===== */
.summary-child-item-info {
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.4rem;
}

.summary-subsubtitle-info {
  font-weight: 600;
  color: #5b4cd0;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

/* ===== VALORES ===== */
.summary-leaf-label-info {
  font-weight: 500;
  color: #2b2c34;
}

.summary-leaf-value-info {
  margin-left: 4px;
  color: #555;
  font-weight: 400;
}

/* ===== MINI BULLETS ===== */
.summary-leaf-item-info::before {
  content: "▪";
  color: #5b4cd0;
  margin-right: 0.4rem;
  font-size: 0.8rem;
}

/* ===== ANIMACIÓN SUAVE ===== */
@media (prefers-reduced-motion: no-preference) {
  .summary-item-info {
    transition: all 0.25s ease-in-out;
  }
}

.summary-list-info li,
.summary-sublist-info li,
.summary-subitem-info li,
.summary-child-item-info li {
  list-style-type: none !important;
}


</style>
