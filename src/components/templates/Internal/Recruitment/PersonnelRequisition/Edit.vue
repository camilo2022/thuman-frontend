<script setup>
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue'
import iconBenefCump from '@/assets/img/BENEF-CUMP.png'
import imgCrecimientoLab from '@/assets/img/CRECIMIENTO-LAB.png'
import imgEscalabilidadLab from '@/assets/img/ESCALABILIDAD-LAB.png'

/* === Recibir el registro desde el controlador === */
const props = defineProps({
    modelPosition: Object,
    modelPersonnelRequisition: Object,
    modelRequiredSkill: Object,
    modelBenefit: Object,
    profileCategories: Array,
    areas: Array,
    formationStatuses: Array,
    academicLevels: Array,
    formationStatuses: Array,
    academicRequirements: Array,
    requiredExperiences: Array,
    responsabilities: Array,
    skills: Array,
    benefits: Array,
    typeContracts: Array,
    requiredSkills: Array,
    requiredBenefits: Array,
    formatTime: Function,
    currentLabel: Function,
    currentColor: Function,
    workArrangements: Array,
    workDays: Array,
    loading: Boolean,
    hiringReasons: Array,
    employees: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})
// props.modelPersonnelRequisition.end_date = props.modelPersonnelRequisition.end_date.split('/').reverse().join('-');

const syncBenefitsWithRequisition = () => {
    const positionBenefits = props.modelPersonnelRequisition?.relationships?.benefits || []
    if (!Array.isArray(positionBenefits)) return

    // Limpia y copia los beneficios al array reactivo de requiredBenefits
    props.requiredBenefits.splice(0, props.requiredBenefits.length,
        ...positionBenefits.map(b => ({
            id: b.id,
            name: b.name,
            description: b.description || '',
        }))
    )
}

// Ejecutar al montar
onMounted(syncBenefitsWithRequisition)

// Y observar cambios en la requisición
watch(
    () => props.modelPersonnelRequisition?.relationships?.benefits,
    () => syncBenefitsWithRequisition(),
    { deep: true, immediate: true }
)

/* === Emitir cierre hacia arriba (para botón Cancelar) === */
const emit = defineEmits([
    'index', 'addAcademicRequirement', 'removeAcademicRequirement', 'addRequiredSkill', 'removeRequiredSkill', 'addRequiredExperience', 'removeRequiredExperience', 'addBenefit', 'removeBenefit',
    'addResponsability', 'removeResponsability', 'submitPersonnelRequisitionUpdate', 'findPosition'
]);

/* === Solo EDIT === */
const isReadOnly = computed(() => false)
const pageTitle = computed(() => 'Editar requisición')


const socialOptions = [
    { value: 'comunicacion', label: 'Comunicación asertiva' },
    { value: 'equipo', label: 'Trabajo en equipo' },
    { value: 'adaptabilidad', label: 'Adaptabilidad' },
    { value: 'liderazgo', label: 'Liderazgo' },
    { value: 'cliente', label: 'Orientación al cliente' }
]
const techOptions = [
    { value: 'excel', label: 'Manejo de excel avanzado' },
    { value: 'java', label: 'Programación en Java' },
    { value: 'sql', label: 'SQL' },
    { value: 'python', label: 'Python' },
    { value: 'git', label: 'Git' }
]
const benefitOptions = [
    { value: 'estabilidad', label: 'Estabilidad laboral', img: imgEscalabilidadLab },
    { value: 'cumplimiento', label: 'Beneficios por cumplimiento', img: iconBenefCump },
    { value: 'crecimiento', label: 'Oportunidad de crecimiento laboral', img: imgCrecimientoLab }
]
const catalogoBeneficios = [
    { value: 'estabilidad', label: 'Estabilidad laboral' },
    { value: 'cumplimiento', label: 'Beneficios por cumplimiento' },
    { value: 'crecimiento', label: 'Oportunidad de crecimiento laboral' },
    { value: 'remoto', label: 'Trabajo remoto' },
    { value: 'seguro', label: 'Seguro médico' }
]

const skillsSociales = reactive([]) // [{id,value,nombre,valor}]
const seleccionSocial = ref('')
const usadosSocial = computed(() => skillsSociales.map(s => s.value))
watch(seleccionSocial, (val) => {
    if (!val || isReadOnly.value) return
    const opt = socialOptions.find(o => o.value === val)
    if (opt && !usadosSocial.value.includes(val)) {
        skillsSociales.push({ id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, value: val, nombre: opt.label, valor: 0 })
    }
    nextTick(() => { seleccionSocial.value = null })
})

const habilidades = reactive([]) // [{id,value,nombre,percentage}]
const seleccionTecnica = ref('')
const usadosTech = computed(() => habilidades.map(t => t.value))
watch(seleccionTecnica, (val) => {
    if (!val || isReadOnly.value) return
    const opt = techOptions.find(o => o.value === val)
    if (opt && !usadosTech.value.includes(val)) {
        const pct = 80
        habilidades.push({ id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, value: val, nombre: opt.label, percentage: pct })
    }
    nextTick(() => { seleccionTecnica.value = null })
})

/* Beneficios visuales (tarjetas) */
const beneficios = reactive([]) // [{id,value,nombre,img}]
const seleccionBeneficios = ref('')
const usadosBeneficios = computed(() => beneficios.map(s => s.value))
watch(seleccionBeneficios, (val) => {
    if (!val || isReadOnly.value) return
    const opt = benefitOptions.find(o => o.value === val)
    if (opt && !usadosBeneficios.value.includes(val)) {
        beneficios.push({ id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, value: val, nombre: opt.label, img: opt.img })
    }
    nextTick(() => { seleccionBeneficios.value = null })
})

const beneficioSeleccion = ref('')
const usadosBenef = computed(() => formExpo.condiciones.beneficios.map(b => b.value))
watch(beneficioSeleccion, (val) => {
    if (!val || isReadOnly.value) return
    const opt = catalogoBeneficios.find(b => b.value === val)
    if (opt && !usadosBenef.value.includes(val)) formExpo.condiciones.beneficios.push({ ...opt, activo: true })
    beneficioSeleccion.value = ''
})
function sanearSalarios(origen) {
    if (isReadOnly.value) return
    const c = formExpo.condiciones
    if (c.salarioDesde != null) c.salarioDesde = Math.max(0, Math.floor(+c.salarioDesde || 0))
    if (c.salarioHasta != null) c.salarioHasta = Math.max(0, Math.floor(+c.salarioHasta || 0))
    if (c.salarioDesde != null && c.salarioHasta != null && c.salarioDesde > c.salarioHasta) {
        if (origen === 'desde') c.salarioHasta = c.salarioDesde
        else c.salarioDesde = c.salarioHasta
    }
}

const addBenefitsFromPosition = (benefits) => {
    if (Array.isArray(benefits)) {
        benefits.forEach(benefit => {
            const exists = props.requiredBenefits.some(rb => rb.id === benefit.id)
            if (!exists) {
                props.requiredBenefits.push(benefit)
            }
        })
    }
}

// 🔹 Al montar el componente, cargar los beneficios del cargo
onMounted(() => {
    const positionBenefits = props.modelPersonnelRequisition?.relationships?.benefits || []
    addBenefitsFromPosition(positionBenefits)
})

// 🔹 También observar si cambia el cargo o la requisición
watch(
    () => props.modelPersonnelRequisition?.relationship?.position?.benefits,
    (newBenefits) => {
        addBenefitsFromPosition(newBenefits || [])
    },
    { immediate: true }
)

const isFormReady = computed(() => {
    // considera “listo” cuando dejó de cargar y ya tienes la posición y catálogos mínimos
    const rel = props.modelPersonnelRequisition?.relationships
    const catalogsOk =
        Array.isArray(props.areas) &&
        Array.isArray(props.profileCategories) &&
        Array.isArray(props.workArrangements) &&
        Array.isArray(props.workDays)

    return !props.loading && !!rel?.position && catalogsOk
})

const clamp = (v) => {
    let n = Number(v)
    if (Number.isNaN(n)) n = 0
    return Math.min(999, Math.max(0, n))
}

const limpiarNumero = (valor = '') => String(valor).replace(/\D/g, '');

const formatearMiles = (valor = '') => {
    const limpio = limpiarNumero(valor);
    if (!limpio) return '';
    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const onSalaryInput = (campo, event) => {
    let limpio = limpiarNumero(event.target.value).slice(0, 8);

    props.modelPersonnelRequisition[campo] = limpio || '';

    const formateado = formatearMiles(limpio);
    event.target.value = formateado;

    requestAnimationFrame(() => {
        const pos = formateado.length;
        event.target.setSelectionRange(pos, pos);
    });
};

const getSalaryDisplay = (valor) => {
    return valor ? formatearMiles(valor) : '';
};

function findPosition() {
    if (props.modelPersonnelRequisition.hiring_reason_id != 352 && props.modelPersonnelRequisition.hiring_reason_id) {
        emit('findPosition', props.modelPersonnelRequisition.relationships.position.id);
    }
}

const socialSkillsWithIndex = computed(() =>
    props.requiredSkills
        .map((skill, index) => ({ skill, index }))
        .filter(item => item.skill.skill_type_id === 21)
)

const technicalSkillsWithIndex = computed(() =>
    props.requiredSkills
        .map((skill, index) => ({ skill, index }))
        .filter(item => item.skill.skill_type_id === 22)
)
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
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Reclutamiento</span>
        <span>|</span>
        <span>Requisición de personal</span>
        <span>|</span>
        <span class="active">{{ pageTitle }}</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <!-- TÍTULO -->
            <h2 class="titulo">{{ pageTitle }}</h2>

            <div class="card">
                <section class="form-section">
                    <!-- Lateral -->
                    <aside class="section-aside">
                        <h3>Información general</h3>
                    </aside>

                    <!-- Cuerpo -->
                    <template v-if="!props.loading">
                        <div class="section-body">
                            <!-- Fila 1 -->
                            <div class="field">
                                <label class="label-bold" for="nombrePerfil">Motivo</label>
                                <div>
                                    <SearchSelect v-model="props.modelPersonnelRequisition.hiring_reason_id"
                                        :options="props.hiringReasons" optionKey="name" valueKey="id"
                                        name="hiring_reason_id" id="hiring_reason_id" placeholder="Motivo"
                                        @select="findPosition"
                                        :error="props.errors?.personnel_requisition?.personnel_requisition_hiring_reason_id" />
                                    <p class="error-text"
                                        v-if="props.errors?.personnel_requisition?.personnel_requisition_hiring_reason_id">
                                        {{
                                            props.errors?.personnel_requisition?.personnel_requisition_hiring_reason_id[0]
                                        }}
                                    </p>
                                </div>
                            </div>

                            <div class="field" v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <label class="label-bold" for="nombrePerfil">Nombre del perfil</label>
                                <input id="nombrePerfil"
                                    :value="props.modelPersonnelRequisition.relationships.position.name" type="text"
                                    class="input-box disabled" placeholder="nombre del perfil" :disabled="true"
                                    aria-disabled="isReadOnly" />
                            </div>

                            <div class="field"
                                v-if="props.modelPersonnelRequisition.hiring_reason_id != 352 && props.modelPersonnelRequisition.hiring_reason_id">
                                <label class="label-bold" for="empresa">Personal</label>
                                <div>
                                    <SearchSelect v-model="props.modelPersonnelRequisition.person_id"
                                        :options="props.employees" optionKey="name" valueKey="id" name="person_id"
                                        id="person_id" placeholder="Personal"
                                        :error="props.errors?.personnel_requisition?.personnel_requisition_person_id" />
                                    <p class="error-text"
                                        v-if="props.errors?.personnel_requisition?.personnel_requisition_person_id">
                                        {{ props.errors?.personnel_requisition?.personnel_requisition_person_id[0] }}
                                    </p>
                                </div>
                            </div>


                            <div class="field">
                                <label class="label-bold" for="empresa">Empresa</label>
                                <input class="input-box disabled" placeholder="Empresa" :disabled="true" type="text"
                                    :value="props.modelPersonnelRequisition.relationships.headquarter?.entity?.enterprise?.name">
                            </div>

                            <div class="field">
                                <label class="label-bold" for="empresa">Entidad</label>
                                <input class="input-box disabled" placeholder="Entidad" :disabled="true" type="text"
                                    :value="props.modelPersonnelRequisition.relationships.headquarter?.entity?.name">
                            </div>

                            <!-- Fila 2 -->
                            <div class="field" v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <label class="label-bold" for="sede">Sede</label>
                                <input class="input-box disabled" placeholder="Sede" :disabled="true" type="text"
                                    :value="props.modelPersonnelRequisition.relationships.headquarter?.name">
                            </div>

                            <div class="field" v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <label class="label-bold" for="area">Área</label>
                                <input class="input-box disabled" placeholder="Área" :disabled="true" type="text"
                                    :value="props.modelPersonnelRequisition.relationships.position?.area?.name">
                            </div>

                            <!-- Fila 3 -->
                            <div class="field" v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <label class="label-bold" for="categoria">Categoría</label>
                                <input class="input-box disabled" placeholder="Categoría" :disabled="true" type="text"
                                    :value="props.modelPersonnelRequisition.relationships.position?.profile_category?.name">
                            </div>

                            <div class="field">
                                <label class="label-bold" for="cantidad">Cantidad de personal</label>
                                <div>
                                    <input id="cantidad" v-model.number="props.modelPersonnelRequisition.quantity"
                                        type="number" class="input-box" aria-disabled="isReadOnly"
                                        @input="props.modelPersonnelRequisition.quantity = clamp(props.modelPersonnelRequisition.quantity)"
                                        placeholder="Cantidad de personal"
                                        :class="{ 'input-error': props.errors.personnel_requisition?.personnel_requisition_quantity }" />
                                    <p class="error-text"
                                        v-if="props.errors.personnel_requisition?.personnel_requisition_quantity">
                                        {{ props.errors.personnel_requisition.personnel_requisition_quantity[0] }}
                                    </p>
                                </div>
                            </div>

                            <!-- Fila 4 -->
                            <div class="field">
                                <label class="label-bold" for="cierre">Cierre estimado</label>
                                <DateInput id="cierre" v-model="props.modelPersonnelRequisition.end_date" type="date"
                                    placeholder="Cierre estimado"
                                    :error="props.errors?.personnel_requisition?.personnel_requisition_end_date" />
                                <p class="error-text"
                                    v-if="props.errors?.personnel_requisition?.personnel_requisition_end_date">
                                    {{ props.errors?.personnel_requisition?.personnel_requisition_end_date[0] }}
                                </p>
                            </div>

                            <div class="field">
                                <label class="label-bold" for="nombrePerfil">Modalidad de trabajo</label>
                                <div>
                                    <SearchSelect v-model="props.modelPersonnelRequisition.work_arrangement_id"
                                        :options="props.workArrangements" optionKey="name" valueKey="id"
                                        name="work_arrangement_id" id="work_arrangement_id"
                                        placeholder="Modalidad de trabajo"
                                        :error="props.errors?.personnel_requisition?.personnel_requisition_work_arrangement_id" />
                                    <p class="error-text"
                                        v-if="props.errors?.personnel_requisition?.personnel_requisition_work_arrangement_id">
                                        {{
                                            props.errors?.personnel_requisition?.personnel_requisition_work_arrangement_id[0]
                                        }}
                                    </p>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label-bold" for="nombrePerfil">Jornada laboral</label>
                                <div>
                                    <SearchSelect v-model="props.modelPersonnelRequisition.work_day_id"
                                        :options="props.workDays" optionKey="name" valueKey="id" name="work_day_id"
                                        id="work_day_id" placeholder="Jornada laboral"
                                        :error="props.errors?.personnel_requisition?.personnel_requisition_work_day_id" />
                                    <p class="error-text"
                                        v-if="props.errors?.personnel_requisition?.personnel_requisition_work_day_id">
                                        {{ props.errors?.personnel_requisition?.personnel_requisition_work_day_id[0] }}
                                    </p>
                                </div>
                            </div>

                            <div class="field" v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <div class="checkbox-container">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelPersonnelRequisition.relationships.position.settings.polygraph" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Requiere polígrafo</span>
                                    </label>
                                </div>
                            </div>

                            <div class="field" v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <div class="checkbox-container">
                                    <label class="checkbox-label">
                                        <input type="checkbox" class="checkbox-input"
                                            v-model="props.modelPersonnelRequisition.relationships.position.settings.video_interview" />
                                        <div class="checkbox-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="check-icon" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="checkbox-text">Requiere video entrevista</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Fila 5 (ancho completo) -->
                            <div class="field field--full"
                                v-if="props.modelPersonnelRequisition?.relationships?.position">
                                <label class="label-bold" for="descripcion">Descripción</label>
                                <div class="textarea-wrapper">
                                    <textarea id="descripcion"
                                        v-model="props.modelPersonnelRequisition.relationships.position.description"
                                        placeholder="Descripción" maxlength="500" class="text-area"
                                        aria-disabled="isReadOnly"
                                        :class="{ 'input-error': props.errors?.position?.position_description }"></textarea>
                                    <div :class="{ 'display-data': props.errors?.position?.position_description }">
                                        <div v-if="props.errors?.position?.position_description" class="error-text">
                                            {{ props.errors?.position?.position_description[0] }}
                                        </div>
                                        <div class="char-limit-text">({{
                                            (props.modelPersonnelRequisition.relationships.position.description ||
                                                '').length }}/500)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="section-body">
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-textarea skeleton field--full"></div>
                        </div>
                    </template>
                </section>
            </div>

            <div class="card">
                <section class="form-section">
                    <!-- Lateral -->
                    <aside class="section-aside">
                        <h3>Formación</h3>
                    </aside>
                    <template v-if="!props.loading">
                        <!-- Cuerpo -->
                        <div class="section-body formaciones-body">

                            <template v-if="academicRequirements.length > 0">
                                <article v-for="(academicRequirement, index) in academicRequirements"
                                    :key="academicRequirement.id" class="formacion-card card">

                                    <div class="grid-2 formacion-grid">
                                        <div class="field">
                                            <label class="label-bold" :for="`academic_level_id-${index}`">Nivel
                                                académico</label>
                                            <div>
                                                <SearchSelect v-model="academicRequirement.academic_level_id"
                                                    :options="props.academicLevels" optionKey="name" valueKey="id"
                                                    name="academic_level_id" id="academic_level_id"
                                                    placeholder="Nivel académico" disabled
                                                    :error="!!props.errors?.academic_requirements?.[index]?.academic_level_id" />
                                                <p v-if="props.errors?.academic_requirements?.[index]?.academic_level_id"
                                                    class="error-text">
                                                    {{
                                                        props.errors?.academic_requirements?.[index]?.academic_level_id[0]
                                                    }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="field">
                                            <label class="label-bold" :for="`academic_title-${index}`">Programa
                                                académico</label>
                                            <div>
                                                <input :id="`academic_title-${index}`"
                                                    v-model="academicRequirement.academic_title" type="text"
                                                    class="input-box disabled" placeholder="Programa académico"
                                                    maxlength="100" disabled
                                                    :class="{ 'input-error': props.errors?.academic_requirements?.[index]?.academic_title }" />
                                                <p v-if="props.errors?.academic_requirements?.[index]?.academic_title"
                                                    class="error-text">
                                                    {{
                                                        props.errors?.academic_requirements?.[index]?.academic_title[0]
                                                    }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="field">
                                            <label class="label-bold"
                                                :for="`formation_status_id-${index}`">Estado</label>
                                            <div>
                                                <SearchSelect v-model="academicRequirement.formation_status_id"
                                                    :options="props.formationStatuses" optionKey="name" valueKey="id"
                                                    name="formation_status_id" disabled id="formation_status_id"
                                                    placeholder="Estado"
                                                    :error="!!props.errors?.academic_requirements?.[index]?.formation_status_id" />
                                                <p v-if="props.errors?.academic_requirements?.[index]?.formation_status_id"
                                                    class="error-text">
                                                    {{
                                                        props.errors?.academic_requirements?.[index]?.formation_status_id[0]
                                                    }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </template>
                            <template v-else>
                                <div class="alert-warning"
                                    style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                    </svg>
                                    <p>Este perfil de cargo no cuenta con formaciones requeridas.</p>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <div class="grid-2 formacion-grid">
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                        </div>
                    </template>
                </section>
            </div>

            <div class="card">
                <section class="form-section">
                    <aside class="section-aside">
                        <h3>Habilidades</h3>
                    </aside>

                    <div class="section-body skills-body">
                        <section class="skills-block">
                            <!-- ===== Sociales ===== -->
                            <h4>Habilidades sociales</h4>
                            <template v-if="!props.loading">
                                <template v-if="socialSkillsWithIndex.length > 0">
                                    <div class="skill-star-wrapper">
                                        <div class="skill-star-row" v-for="item in socialSkillsWithIndex"
                                            :key="item.skill.id ?? item.skill.skill_id ?? item.index">
                                            <div class="skill-star-item"
                                                :class="{ 'input-error': errors.required_skills?.[item.index]?.percentage }">
                                                <div class="skill-star-left">
                                                    <div class="skill-star-header">
                                                        <span class="skill-star-name" :title="item.skill.skill.name">{{
                                                            item.skill.skill.name
                                                        }}</span>
                                                    </div>

                                                    <div class="valoracion">
                                                        <button v-for="n in [5, 4, 3, 2, 1]" :key="n">
                                                            <svg class="star"
                                                                :class="{ active: item.skill.percentage >= n }"
                                                                xmlns="http://www.w3.org/2000/svg" width="24"
                                                                height="24" viewBox="0 0 256 256">
                                                                <path v-if="item.skill.percentage >= n"
                                                                    d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                                <path v-else
                                                                    d="M243,96a20.33,20.33,0,0,0-17.74-14l-56.59-4.57L146.83,24.62a20.36,20.36,0,0,0-37.66,0L87.35,77.44,30.76,82A20.45,20.45,0,0,0,19.1,117.88l43.18,37.24-13.2,55.7A20.37,20.37,0,0,0,79.57,233L128,203.19,176.43,233a20.39,20.39,0,0,0,30.49-22.15l-13.2-55.7,43.18-37.24A20.43,20.43,0,0,0,243,96ZM172.53,141.7a12,12,0,0,0-3.84,11.86L181.58,208l-47.29-29.08a12,12,0,0,0-12.58,0L74.42,208l12.89-54.4a12,12,0,0,0-3.84-11.86L41.2,105.24l55.4-4.47a12,12,0,0,0,10.13-7.38L128,41.89l21.27,51.5a12,12,0,0,0,10.13,7.38l55.4,4.47Z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p v-if="errors.required_skills?.[item.index]?.percentage"
                                                class="error-text">
                                                {{ errors.required_skills[item.index].percentage[0] }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="alert-warning"
                                        style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                        </svg>
                                        <p>Este perfil de cargo no cuenta con habilidades sociales requeridas.</p>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <div class="skill-star-wrapper">
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                </div>
                            </template>
                        </section>
                        <section class="skills-block">
                            <!-- ===== Técnicas ===== -->
                            <h4>Habilidades técnicas</h4>

                            <template v-if="!props.loading">
                                <template v-if="technicalSkillsWithIndex.length > 0">
                                    <div class="skill-list">
                                        <div class="skill-star-row" v-for="item in technicalSkillsWithIndex"
                                            :key="item.skill.id ?? item.skill.skill_id ?? item.index">
                                            <div class="skill-item"
                                                :class="{ 'input-error': errors.required_skills?.[item.index]?.percentage }">
                                                <div class="skill-left">
                                                    <div class="skill-header">
                                                        <span class="skill-name">{{ item.skill.skill.name }}</span>
                                                        <div class="skill-info">
                                                            <span class="skill-level"
                                                                :style="{ backgroundColor: props.currentColor(item.skill.percentage) }">
                                                                {{ props.currentLabel(item.skill.percentage) }}
                                                            </span>
                                                            <span class="skill-percent">{{ item.skill.percentage
                                                                }}%</span>
                                                        </div>
                                                    </div>

                                                    <input type="range" class="skill-range readonly-range"
                                                        :value="item.skill.percentage" min="0" max="100" step="1"
                                                        disabled
                                                        :style="{ background: `linear-gradient(to right, #5b4cd0 ${item.skill.percentage}%, #e6e2ff ${item.skill.percentage}%)` }" />

                                                    <div class="labels">
                                                        <span>Principiante</span>
                                                        <span>Básico</span>
                                                        <span>Intermedio</span>
                                                        <span>Avanzado</span>
                                                        <span>Experto</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <p v-if="errors.required_skills?.[item.index]?.percentage"
                                                class="error-text">
                                                {{ errors.required_skills[item.index].percentage[0] }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="alert-warning"
                                        style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                        </svg>
                                        <p>Este perfil de cargo no cuenta con habilidades técnicas requeridas.</p>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <div class="skill-list">
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                </div>
                            </template>
                        </section>
                    </div>
                </section>
            </div>

            <div class="card">
                <section class="form-section">
                    <!-- Lateral -->
                    <aside class="section-aside">
                        <h3>Experiencia</h3>
                    </aside>

                    <template v-if="!props.loading">
                        <div class="section-body experiencias-body">

                            <template v-if="props.requiredExperiences.length > 0">
                                <!-- Tarjetas (una por fila) -->
                                <article class="exp-card card"
                                    v-for="(requiredExperience, index) in props.requiredExperiences"
                                    :key="requiredExperience.id">
                                    <header class="card-head">
                                        <strong></strong>
                                        <Button title="Eliminar" icon="trash" variant="danger"
                                            @click="emit('removeRequiredExperience', index)" />
                                    </header>

                                    <div class="grid-2 exp-grid">
                                        <div class="field">
                                            <label class="label-bold"
                                                :for="`name-requiredExperience-${index}`">Nombre</label>
                                            <div>
                                                <input :id="`name-requiredExperience-${index}`" type="text"
                                                    class="input-box disabled" disabled
                                                    v-model="requiredExperience.name" placeholder="Nombre"
                                                    :class="{ 'input-error': props.errors?.required_experiences?.[index]?.name }" />
                                                <p v-if="props.errors?.required_experiences?.[index]?.name"
                                                    class="error-text">
                                                    {{ props.errors.required_experiences[index].name[0] }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="field">
                                            <label class="label-bold"
                                                :for="`duration_months-requiredExperience-${index}`">Duración en meses
                                                ({{
                                                    formatTime(requiredExperience.duration_months) }})</label>
                                            <div>
                                                <input :id="`duration_months-requiredExperience-${index}`" type="number"
                                                    class="input-box disabled" disabled
                                                    v-model="requiredExperience.duration_months"
                                                    :class="{ 'input-error': props.errors?.required_experiences?.[index]?.duration_months }" />
                                                <p v-if="props.errors?.required_experiences?.[index]?.duration_months"
                                                    class="error-text">
                                                    {{ props.errors.required_experiences[index].duration_months[0] }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="field field--full">
                                            <label class="label-bold"
                                                :for="`description-requiredExperience-${index}`">Descripción</label>
                                            <div class="textarea-wrapper">
                                                <textarea :id="`description-requiredExperience-${index}`"
                                                    v-model="requiredExperience.description"
                                                    placeholder="Describa la experiencia requerida" maxlength="500"
                                                    class="text-area disabled" disabled
                                                    :class="{ 'input-error': props.errors?.required_experiences?.[index]?.description }"></textarea>
                                                <div
                                                    :class="{ 'display-data': props.errors?.required_experiences?.[index]?.description }">
                                                    <p v-if="props.errors?.required_experiences?.[index]?.description"
                                                        class="error-text">
                                                        {{ props.errors.required_experiences[index].description[0] }}
                                                    </p>
                                                    <div class="char-limit-text">
                                                        ({{ (requiredExperience.description || '').length }}/500)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </template>
                            <template v-else>
                                <div class="alert-warning"
                                    style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                        viewBox="0 0 256 256">
                                        <path
                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                    </svg>
                                    <p>Este perfil de cargo no cuenta con experiencias requeridas.</p>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <div class="section-body">
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-textarea skeleton field--full"></div>
                        </div>
                    </template>
                </section>
            </div>

            <div class="card">
                <section class="form-section">
                    <!-- Lateral -->
                    <aside class="section-aside">
                        <h3>Responsabilidades</h3>
                    </aside>

                    <template v-if="!props.loading">
                        <template v-if="props.responsabilities.length > 0">
                            <div class="section-body responsabilidades-body">

                                <!-- Tarjetas (una por fila) -->
                                <article class="resp-card card"
                                    v-for="(responsability, index) in props.responsabilities" :key="responsability.id">

                                    <div class="resp-grid">
                                        <div class="field">
                                            <label class="label-bold"
                                                :for="`name-responsability-${index}`">Nombre</label>
                                            <div>
                                                <input :id="`name-responsability-${index}`" type="text"
                                                    class="input-box disabled" v-model="responsability.name"
                                                    placeholder="Nombre" maxlength="80" disabled
                                                    :class="{ 'input-error': props.errors?.responsabilities?.[index]?.name }" />
                                                <div v-if="props.errors?.responsabilities?.[index]?.name"
                                                    class="error-text">
                                                    {{ props.errors?.responsabilities?.[index]?.name[0] }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="field field--full">
                                            <div class="textarea-wrapper">
                                                <label class="label-bold"
                                                    :for="`description-responsability-${index}`">Descripción</label>
                                                <textarea :id="`description-responsability-${index}`"
                                                    v-model="responsability.description"
                                                    placeholder="Describa la responsibilidad" maxlength="500"
                                                    class="text-area disabled" disabled
                                                    :class="{ 'input-error': props.errors?.responsabilities?.[index]?.description }"></textarea>
                                                <div
                                                    :class="{ 'display-data': props.errors?.responsabilities?.[index]?.description }">
                                                    <div v-if="props.errors?.responsabilities?.[index]?.description"
                                                        class="error-text">
                                                        {{ props.errors?.responsabilities?.[index]?.description[0] }}
                                                    </div>
                                                    <div class="char-limit-text">
                                                        ({{ (responsability.description || '').length }}/500)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </template>
                        <template v-else>
                            <div class="alert-warning"
                                style="margin-top:15px; display:flex; gap:10px; align-content:center; align-items:center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Este perfil de cargo no cuenta con responsabilidades requeridas.</p>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <div class="resp-grid">
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-textarea skeleton field--full"></div>
                        </div>
                    </template>
                </section>
            </div>

            <div class="card">
                <section class="form-section">
                    <aside class="section-aside">
                        <h3>Condiciones laborales</h3>
                    </aside>

                    <template v-if="!props.loading">
                        <div class="section-body condiciones-body" style="grid-template-columns: 1fr !important;">
                            <div class="cond-grid">
                                <!-- Tipo contrato -->
                                <div class="field">
                                    <label for="tipoContrato" class="label-bold">Tipo de contrato</label>
                                    <div>
                                        <SearchSelect v-model="props.modelPersonnelRequisition.contract_type_id"
                                            :options="typeContracts" optionKey="name" valueKey="id"
                                            name="contract_type_id" id="contract_type_id" placeholder="Tipo de contrato"
                                            :error="props.errors.personnel_requisition?.personnel_requisition_contract_type_id" />
                                        <p class="error-text"
                                            v-if="props.errors.personnel_requisition?.personnel_requisition_contract_type_id">
                                            {{
                                                props.errors.personnel_requisition?.personnel_requisition_contract_type_id[0]
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Salario desde -->
                                <div class="field">
                                    <label for="salarioDesde" class="label-bold">Salario - Desde</label>
                                    <div>
                                        <input id="salarioDesde" type="text" class="input-box" inputmode="numeric"
                                            minlength="3" maxlength="12"
                                            :value="getSalaryDisplay(props.modelPersonnelRequisition.salary_min)"
                                            @input="onSalaryInput('salary_min', $event)"
                                            placeholder="Ingrese monto mínimo"
                                            :class="{ 'input-error': props.errors.personnel_requisition?.personnel_requisition_salary_min }" />
                                        <p class="error-text"
                                            v-if="props.errors.personnel_requisition?.personnel_requisition_salary_min">
                                            {{
                                                props.errors.personnel_requisition?.personnel_requisition_salary_min[0]
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Salario hasta -->
                                <div class="field">
                                    <label for="salarioHasta" class="label-bold">Salario - Hasta</label>
                                    <div>
                                        <input id="salarioHasta" type="text" class="input-box" inputmode="numeric"
                                            minlength="3" maxlength="12"
                                            :value="getSalaryDisplay(props.modelPersonnelRequisition.salary_max)"
                                            @input="onSalaryInput('salary_max', $event)"
                                            placeholder="Ingrese monto máximo"
                                            :class="{ 'input-error': props.errors.personnel_requisition?.personnel_requisition_salary_max }" />
                                        <p class="error-text"
                                            v-if="props.errors.personnel_requisition?.personnel_requisition_salary_max">
                                            {{
                                                props.errors.personnel_requisition?.personnel_requisition_salary_max[0]
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="cond-grid">
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                            <div class="skeleton-field skeleton"></div>
                        </div>
                    </template>
                </section>
            </div>

            <div class="card">
                <section class="form-section">
                    <aside class="section-aside">
                        <h3>Beneficios</h3>
                    </aside>

                    <div class="section-body skills-body">
                        <section class="skills-block">
                            <!-- Selector de beneficios -->
                            <h4>Beneficios</h4>
                            <template v-if="!props.loading">

                                <div>
                                    <SearchSelect v-if="!isReadOnly" v-model="props.modelBenefit.id"
                                        :options="props.benefits.filter(b => !props.requiredBenefits.some(rb => rb.id === b.id))"
                                        optionKey="name" valueKey="id" name="benefit_id" id="benefit_id"
                                        placeholder="Beneficios" @update:modelValue="val => {
                                            if (val) {
                                                emit('addBenefit', val)
                                                props.modelBenefit.id = null
                                            }
                                        }" :clearOnSelect="true"
                                        :error="props.errors.personnel_requisition?.personnel_requisition_benefits_id" />

                                    <p class="error-text"
                                        v-if="props.errors.personnel_requisition?.personnel_requisition_benefits_id">
                                        {{
                                            props.errors.personnel_requisition?.personnel_requisition_benefits_id[0] }}
                                    </p>

                                </div>


                                <!-- Lista de beneficios -->
                                <div class="skill-star-wrapper">
                                    <div class="benefit-row" v-for="(benefit, i) in props.requiredBenefits"
                                        :key="benefit.id">
                                        <div class="skill-star-item">
                                            <div class="skill-star-left">
                                                <div class="skill-star-header">
                                                    <span class="skill-star-name motivo">{{ benefit.name }}</span>
                                                </div>
                                            </div>
                                            <Button title="Eliminar" icon="trash" variant="danger"
                                                @click="emit('removeBenefit', benefit.id)" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="skill-star-wrapper">
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                    <div style="height: 70px;" class="skeleton-field skeleton"></div>
                                </div>
                            </template>
                        </section>
                    </div>
                </section>
            </div>

            <div class="form-buttons" v-if="!props.loading">
                <button class="btn-secondary"
                    style="background-color: white; color: #5b4cd0; border: 2px solid #5b4cd0;"
                    @click="$emit('index')">Cancelar</button>
                <button class="btn-primary" @click="emit('submitPersonnelRequisitionUpdate', 'edit')">Guardar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.checkbox-container {
    display: flex;
    align-items: center;
    height: 100%;
}

.checkbox-container label {
    font-size: 14px;
}

/* Ocultar checkbox nativo */
.checkbox-container input[type="checkbox"] {
    display: none;
}

/* Checkbox personalizado */
.checkbox-container .custom-checkbox {
    width: 24px;
    height: 24px;
    display: inline-block;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>');
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
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%235b4cd0" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>');
}

/* Layout básico (sin estilos de inputs) */
.form-section {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px 24px;
}

.section-aside {
    padding-top: 6px;
}

.section-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
}

.section-body.skills-body {
    display: grid;
    grid-template-columns: 1fr !important;
    /* pisa grids heredadas */
    gap: 20px;
}

/* Cada bloque (título + selector + tarjetas) */
.skills-block {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.formaciones-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

.formaciones-body .formacion-card {
    grid-column: 1 / -1;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field--full {
    grid-column: 1 / -1;
}

.help.right {
    font-size: .85rem;
    text-align: right;
    opacity: .7;
}

/* Responsive */
@media (max-width: 900px) {
    .form-section {
        grid-template-columns: 1fr;
    }

    .section-body {
        grid-template-columns: 1fr;
    }
}

.card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EEEAFD;
    box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
    padding: 20px;
    margin-top: 10px;
}


/* Enlace/botón agregar (solo estructura) */
.add-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
}

/* Card contenedora de cada formación (estructura básica) */
.formacion-card {
    display: grid;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    /* solo contenedor */
    /* (sin estilos de inputs) */
}

/* Header de la card */
.card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Grid de campos */
.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
}

.formacion-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px 24px;
}


/* Botón ícono (solo estructura) */
.icon-btn {
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 4px;
}

.icon-btn.danger {
    color: #c73737;
}

/* Responsive */
@media (max-width: 900px) {
    .form-section {
        grid-template-columns: 1fr;
    }

    .grid-2 {
        grid-template-columns: 1fr;
    }

    .formacion-grid {
        grid-template-columns: 1fr;
    }
}

.section-body.skills-body {
    display: grid;
    gap: 12px;
}

/* Social: ya tienes .skill-star-wrapper en tu CSS (3 columnas).
   Si quieres 2 columnas: grid-template-columns: repeat(2, 1fr); */
.skill-list {
    display: grid;
    gap: 8px;
}

/* lista técnica (vertical) */

/* Botón eliminar usado arriba */
.icon-btn-danger {
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 4px;
}

.skill-row {
    padding: 8px 0;
}

.skill-item {
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

.skill-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.skill-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-name {
    font-weight: 600;
    font-size: 16px;
    color: #2b2c34;
}

.skill-level {
    color: white;
    padding: 3px 8px;
    font-size: 11px;
    border-radius: 6px;
    font-weight: 600;
    background-color: #7255f8;
}

.skill-percent {
    font-size: 12px;
    color: #2b2c34;
    font-weight: 600;
}

.skill-range {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    background: linear-gradient(to right, #5b4cd0 85%, #e6e2ff 85%);
}

.skill-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: white;
    border: 3px solid #5b4cd0;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #5b4cd0;
    cursor: pointer;
}

.skill-range::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border: 3px solid #5b4cd0;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #5b4cd0;
    cursor: pointer;
}

.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 10px;
    width: 100%;
}

.skill-star-row {
    padding: 8px 0;
}

.benefit-row {
    padding: 0px;
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
    font-size: 16px;
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

/* experiencia */
/* 1 columna para esta sección */
.experiencias-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* Tarjeta ocupa todo el ancho de la grid */
.exp-card {
    grid-column: 1 / -1;
}

/* Grid interna de campos */
.exp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
}

/* responsabilidades */
/* Una sola columna en esta sección */
.section-body.responsabilidades-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* Cada card ocupa todo el ancho */
.resp-card {
    grid-column: 1 / -1;
}

/* Grid interna (por si agregas más campos luego) */
.resp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

/* expo */
/* layout básico; sin estilos de inputs */
.section-body.condiciones-body {
    display: grid;
    gap: 16px;
}

/* 3 columnas en desktop, 1 en móvil */
.cond-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px 24px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.beneficios-list {
    list-style: none;
    padding: 0;
    margin: 8px 0 0;
    display: grid;
    gap: 6px;
}

.beneficio-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.benef-check {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* buttons */
.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

/* Cuando estás en modo solo lectura (publish-vacancy), agregas una clase */
.readonly-range {
    pointer-events: none;
    /* Desactiva interacción */
}

/* Ocultar el thumb en navegadores Webkit */
.readonly-range::-webkit-slider-thumb {
    display: none;
}

/* Ocultar el thumb en Firefox */
.readonly-range::-moz-range-thumb {
    display: none;
}

/* Input deshabilitado */
.input-disabled {
    background: #f4f2ff;
    color: #000000;
    border-color: #ddd;
    box-shadow: none !important;
    cursor: not-allowed;
    pointer-events: none;
}

/* Elimina efectos hover/focus cuando está deshabilitado */
.input-disabled:hover,
.input-disabled:focus {
    border-color: #ddd;
    box-shadow: none;
}

.add-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    color: #5b4cd0;
    font-weight: 600;
}

.skills-block h4 {
    color: var(--brand);
}

.card,
.form-section,
.section-body,
.grid-2,
.formacion-grid,
.exp-grid,
.skill-item,
.skill-star-item {
    min-width: 0;
}

.skill-name,
.skill-star-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* =========================
   BREAKPOINT: <= 1024px
   (mismo enfoque que "Mi perfil")
   ========================= */
@media (max-width: 1024px) {
    .container-data {
        padding: 0 16px;
    }

    .main-container {
        padding: 10px;
    }

    .card {
        padding: 16px;
    }

    /* Sidebar + Body a 1 columna */
    .form-section {
        grid-template-columns: 1fr !important;
        gap: 12px;
    }

    .section-aside {
        padding-top: 0;
    }

    /* Body que era 2 columnas -> 1 */
    .section-body {
        grid-template-columns: 1fr !important;
        gap: 12px;
    }

    /* Formación / grids de 3 columnas -> 1 */
    .grid-2,
    .formacion-grid {
        grid-template-columns: 1fr !important;
        gap: 12px;
    }

    /* Experiencia -> 1 columna */
    .exp-grid {
        grid-template-columns: 1fr !important;
        gap: 12px;
    }

    .skill-header {
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 8px;
    }

    /* Botones eliminar alineados */
    .skill-item> :last-child,
    .skill-star-item> :last-child {
        align-self: flex-end;
    }

    /* Footer botones: que se estiren */
    .form-buttons {
        align-items: stretch;
        gap: 12px;
    }
}

/* =========================
   BREAKPOINT: <= 600px
   ========================= */
@media (max-width: 600px) {
    .container-data {
        padding: 0 12px;
    }

    .card {
        padding: 12px;
        border-radius: 10px;
    }

    .add-link {
        font-size: 13px;
        gap: 6px;
    }

    .add-link svg {
        width: 20px;
        height: 20px;
    }

    .skill-name,
    .skill-star-name {
        font-size: 14px;
    }

    .skill-level {
        font-size: 10px;
    }

    .labels {
        gap: 6px;
    }

    /* slider no reviente */
    .skill-range {
        width: 100%;
    }
}

@media (max-width: 592px) {
    .cond-grid {
        grid-template-columns: 1fr !important;
    }
}

/* =========================
   BREAKPOINT: <= 375px
   (el que más se siente)
   ========================= */
@media (max-width: 375px) {
    .container-data {
        padding: 0 10px;
    }

    .cond-grid {
        grid-template-columns: 1fr !important;
    }

    .card {
        padding: 10px;
    }

    /* Botones del final en columna */
    .form-buttons {
        flex-direction: column;
        gap: 8px;
    }

    .form-buttons .btn-primary,
    .form-buttons .btn-secondary,
    .sections-add-btn {
        width: 100%;
    }

    /* Skills: padding más pequeño */
    .skill-item,
    .skill-star-item {
        padding: 10px;
    }
}

.alert-warning {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 500;
    align-items: center;
}

.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.skeleton-field {
    height: 50px;
    border-radius: 10px;
}

.skeleton-select {
    height: 42px;
    border-radius: 10px;
}

.skeleton-textarea {
    height: 120px;
    border-radius: 10px;
}

.skeleton-title {
    height: 20px;
    width: 180px;
    border-radius: 8px;
    margin-bottom: 10px;
}

.skeleton-card {
    border: 1px solid #EEEAFD;
    border-radius: 12px;
    padding: 12px;
    display: grid;
    gap: 12px;
}

.skeleton-stars {
    height: 72px;
    border-radius: 10px;
}

.skeleton-range {
    height: 82px;
    border-radius: 10px;
}

.skeleton-benefit {
    height: 56px;
    border-radius: 10px;
}

.skeleton-button {
    height: 42px;
    width: 130px;
    border-radius: 10px;
}

.skeleton-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}
</style>