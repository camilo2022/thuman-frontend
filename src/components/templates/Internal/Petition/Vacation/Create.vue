<script setup>
import DateInput from '@/components/UI/templates/DateInput.vue';
import { ref, computed, nextTick, watch, defineAsyncComponent } from 'vue'

const props = defineProps({
    modelEmployee: Object,
    modelVacation: Object,
    availabilities: Array,
    vacationTypes: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['index', 'submitVacationStore', 'clearErrors']);

const allowedDaysCount = computed(() => {
    const { start_date, end_date, period } = props.modelVacation

    if (!start_date || !end_date || !period) return 0

    const availability = props.availabilities?.find(a => a.period === period)
    if (!availability) return 0

    const allowedDays = (props.availabilities?.find(a => a.period === period)?.days ?? []).map(Number)
    const availableDays = Number(availability.available_days || 0)

    if (!allowedDays.length) return 0

    const start = new Date(start_date + 'T00:00:00')
    const end = new Date(end_date + 'T00:00:00')

    if (isNaN(start) || isNaN(end) || start > end) return 0

    let count = 0
    const current = new Date(start)

    while (current <= end) {
        const jsDay = current.getDay()
        const isoDay = jsDay === 0 ? 7 : jsDay

        const dateString = current.toISOString().slice(0, 10)
        const isAllowedDay = allowedDays.includes(isoDay)
        const isHoliday = holidays.value.includes(dateString)

        if (isAllowedDay && !isHoliday) count++


        current.setDate(current.getDate() + 1)
    }

    return count
})

const Preview = defineAsyncComponent(() => import('@/components/shared/features/Petition/VacationPreview.vue'))

const selectedVacationType = computed(() => {
    return props.vacationTypes.find(
        at => at.id === props.modelVacation.vacation_type_id
    ) || null;
});

const hasTemplate = computed(() => {
    const settings = selectedVacationType.value?.settings?.message;
    return !!settings && Object.keys(settings).length > 0;
});

const progress = computed(() => {
    const availability = props.availabilities.find(a => a.period === props.modelVacation.period)

    if (!availability) return 0

    const legalDays = Number(availability.legal_days) || 0
    const availableDays = Number(availability.available_days) || 0

    if (legalDays === 0) return 0

    const usedBefore = legalDays - availableDays


    const isNumeric = props.vacationTypes.find(at => at.id === props.modelVacation.vacation_type_id)?.settings?.field_type === 'numeric'

    let selectedDays = 0

    if (isNumeric) {
        const days = Number(props.modelVacation.days || 0)

        if (days > availableDays) {
            props.modelVacation.days = 0
            selectedDays = 0
        } else {
            selectedDays = days
        }
    } else {
        selectedDays = Number(allowedDaysCount.value || 0)
    }

    const usedTotal = usedBefore + selectedDays

    const raw = (usedTotal * 100) / legalDays

    return Math.min(100, Math.max(0, Math.round(raw)))
})

watch(
    () => props.modelVacation.vacation_type_id,
    () => {
        emit('clearErrors')
    }
)

const holidays = ref([])

const loadHolidays = async (year, countryCode = 'CO') => {
    if (!year) {
        holidays.value = []
        return
    }

    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)

        if (!response.ok) {
            holidays.value = []
            return
        }

        const data = await response.json()

        holidays.value = data.map(holiday => holiday.date)
    } catch (error) {
        console.error('Error cargando festivos:', error)
        holidays.value = []
    }
}

watch(
    () => props.modelVacation.period,
    (period) => {
        loadHolidays(period, 'CO')
    },
    { immediate: true }
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
        <span>Solicitudes</span>
        <span>|</span>
        <span>Vacaciones</span>
        <span>|</span>
        <span class="active">Solicitar vacaciones</span>
    </div>
    <div class="container-data">
        <div class="split with-panel">
            <div class="split-main">
                <div class="split-main">
                    <div class="main-container">
                        <h2 class="titulo">Solicitar vacaciones</h2>

                        <template v-if="false">
                            <!-- HEADER -->
                            <div class="vac-header-skeleton">
                                <div class="vac-header-left">
                                    <div class="skeleton skel-num"></div>
                                    <div>
                                        <div class="skeleton skel-title"></div>
                                        <div class="skeleton skel-small"></div>
                                    </div>
                                </div>

                                <div class="vac-header-right">
                                    <div class="skeleton skel-title" style="width:70px;"></div>
                                    <div class="skeleton skel-num" style="width:40px; height:40px;"></div>
                                </div>
                            </div>

                            <!-- INFORMACIÓN GENERAL -->
                            <div class="vac-skeleton-card">
                                <div class="skeleton vac-label" style="width:160px;"></div>

                                <div class="vac-grid-2" style="margin-top: 16px;">
                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>

                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- PERIODO DISFRUTABLE -->
                            <div class="vac-skeleton-card">
                                <div class="skeleton vac-label" style="width:160px;"></div>

                                <div class="vac-grid-2" style="margin-top: 16px;">
                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>

                                    <div>
                                        <div class="skeleton vac-label" style="width:120px;"></div>
                                        <div class="skeleton skel-input"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- BOTONES -->
                            <div class="vac-btns">
                                <div class="skeleton skel-btn"></div>
                                <div class="skeleton skel-btn" style="width:120px;"></div>
                            </div>
                        </template>
                        <template v-else>
                            <!-- CARD MORADO: RESUMEN DE DÍAS -->
                            <div class="card-vacaciones">
                                <div class="card-left">
                                    <div class="numero-dias">
                                        {{props.vacationTypes.find(at => at.id ===
                                            props.modelVacation.vacation_type_id)?.settings?.field_type == 'numeric' ?
                                            (props.modelVacation.days || 0) : allowedDaysCount}}
                                    </div>

                                    <div class="info-dias">
                                        <div class="titulo">
                                            Días seleccionados
                                        </div>
                                        <p class="subtitulo">
                                            de {{props.availabilities.find(a => a.period ===
                                                props.modelVacation.period)?.legal_days || 0}} hábiles totales
                                        </p>

                                        <div class="barra-progreso">
                                            <div class="barra-progreso-fill" :style="{ width: progress + '%' }" />
                                        </div>
                                    </div>
                                </div>

                                <div class="toolbar-divider" />

                                <div class="card-right">
                                    <span class="label">Disponibles</span>
                                    <span class="valor">
                                        {{props.availabilities.find(a => a.period ===
                                            props.modelVacation.period)?.available_days || 0}} <span
                                            class="unidad">días</span>
                                    </span>
                                </div>
                            </div>

                            <!-- CARDS DEL FORMULARIO -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">

                                <!-- 1) INFORMACIÓN GENERAL -->
                                <div class="card">
                                    <div class="card-header">
                                        <div class="section-title">Información general</div>
                                    </div>
                                    <div class="grid-2">
                                        <div>
                                            <label class="label-bold">Tipo de vacaciones</label>
                                            <SearchSelect v-model="props.modelVacation.vacation_type_id" name="estado"
                                                :options="props.vacationTypes" optionKey="name" valueKey="id"
                                                placeholder="Tipo de vacaciones"
                                                :error="props.modelVacation.vacation_type_id && !hasTemplate" />
                                            <p v-if="props.modelVacation.vacation_type_id && !hasTemplate"
                                                class="error-text">
                                                El tipo de vacaciones seleccionado no tiene plantilla.
                                            </p>
                                        </div>
                                        <div>
                                            <label class="label-bold">Periodo de vacaciones</label>
                                            <SearchSelect v-model="props.modelVacation.period" name="estado"
                                                :options="props.availabilities" optionKey="period" valueKey="period"
                                                placeholder="Periodo de vacaciones"
                                                :error="props.errors.vacation_period" />
                                            <p v-if="props.errors.vacation_period" class="error-text">
                                                {{ props.errors.vacation_period[0] }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- 2) PERIODO DISFRUTABLE (solo si escogió tipo + periodo) -->
                                <div class="card"
                                    v-if="props.modelVacation.vacation_type_id && props.modelVacation.period && hasTemplate">
                                    <div class="card-header">
                                        <div class="section-title section-title--dot">{{props.vacationTypes.find(at =>
                                            at.id === props.modelVacation.vacation_type_id)?.name}}</div>

                                        <div class="pill-dias">
                                            <span class="pill-text">
                                                {{props.vacationTypes.find(at => at.id ===
                                                    props.modelVacation.vacation_type_id)?.settings?.field_type == 'numeric'
                                                    ? (props.modelVacation.days || 0) : allowedDaysCount}} días
                                            </span>
                                        </div>
                                    </div>
                                    <p v-if="props.errors.vacation_days" class="error-text">
                                        {{ props.errors.vacation_days[0] }}
                                    </p>
                                    <div v-if="props.errors.vacation_vacation_type_id" class="bg-red"
                                        style="display:flex;gap:10px;margin-bottom: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                            fill="currentColor" viewBox="0 0 256 256" data-darkreader-inline-fill=""
                                            style="--darkreader-inline-fill: var(--darkreader-background-000000, #181a1b);">
                                            <path
                                                d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z">
                                            </path>
                                        </svg>
                                        <p style="font-size: 13px;">{{ props.errors.vacation_vacation_type_id[0] }}
                                        </p>
                                    </div>
                                    <div class="grid-2"
                                        v-if="props.vacationTypes.find(at => at.id === props.modelVacation.vacation_type_id)?.settings?.field_type === 'date_range'">
                                        <div>
                                            <label class="label-bold">Fecha inicio</label>
                                            <DateInput v-model="props.modelVacation.start_date"
                                                :error="props.errors.vacation_start_date" />
                                            <p v-if="props.errors.vacation_start_date" class="error-text">
                                                {{ props.errors.vacation_start_date[0] }}
                                            </p>
                                        </div>

                                        <div>
                                            <label class="label-bold">Fecha fin</label>
                                            <DateInput v-model="props.modelVacation.end_date"
                                                :error="props.errors.vacation_end_date" />
                                            <p v-if="props.errors.vacation_end_date" class="error-text">
                                                {{ props.errors.vacation_end_date[0] }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="grid-2"
                                        v-if="props.vacationTypes.find(at => at.id === props.modelVacation.vacation_type_id)?.settings?.field_type == 'numeric'">
                                        <div>
                                            <label class="label-bold">Días solicitados</label>
                                            <input v-model="props.modelVacation.days" type="number"
                                                placeholder="Días solicitados" class="input-box">
                                            <small style="font-size: 11px; color:#888;">
                                                Máx: {{props.availabilities.find(a => a.period ===
                                                    props.modelVacation.period)?.available_days}} días
                                            </small>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-buttons">
                                <button class="btn-secondary" @click="emit('index')">Cancelar</button>
                                <button class="btn-primary" @click="emit('submitVacationStore')"
                                    :disabled="!props.modelVacation.vacation_type_id || !hasTemplate">
                                    Enviar
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- PANEL DERECHO -->
            <div class="split-panel">
                <SidePanel title="Previsualización" width="480px">
                    <div class="sub-title" style="display:flex; justify-content:space-between;">
                        <h2 class="sub-titulo">Previsualización</h2>
                    </div>
                    <div class="sub-container">
                        <Preview ref="previewRef"
                            :content="props.vacationTypes.find(vt => vt.id === props.modelVacation.vacation_type_id)?.settings?.message || ''"
                            :data="{
                                person_first_name: props.modelEmployee?.relationships?.person?.first_name,
                                person_second_name: props.modelEmployee?.relationships?.person?.second_name,
                                person_first_last_name: props.modelEmployee?.relationships?.person?.first_last_name,
                                person_second_last_name: props.modelEmployee?.relationships?.person?.second_last_name,
                                person_document_type: props.modelEmployee?.relationships?.person?.document_type?.settings?.abreviature,
                                person_document_issue_country: props.modelEmployee?.relationships?.person?.document_issue_city?.departament?.country?.name,
                                person_document_issue_departament: props.modelEmployee?.relationships?.person?.document_issue_city?.departament?.name,
                                person_document_issue_city: props.modelEmployee?.relationships?.person?.document_issue_city?.name,
                                person_document_number: props.modelEmployee?.relationships?.person?.document_number,
                                person_document_issue_date: props.modelEmployee?.relationships?.person?.document_issue_date,
                                person_birth_country: props.modelEmployee?.relationships?.person?.birth_city?.departament?.country?.name,
                                person_birth_departament: props.modelEmployee?.relationships?.person?.birth_city?.departament?.name,
                                person_birth_city: props.modelEmployee?.relationships?.person?.birth_city?.departament?.name,
                                person_birth_date: props.modelEmployee?.relationships?.person?.person_birth_date,
                                person_dialing_country: props.modelEmployee?.relationships?.person?.dialing_country?.name,
                                person_phone_number: props.modelEmployee?.relationships?.person?.phone_number,
                                person_email: props.modelEmployee?.relationships?.person?.email,
                                person_country: props.modelEmployee?.relationships?.person?.city?.departament?.country?.name,
                                person_departament: props.modelEmployee?.relationships?.person?.city?.departament?.name,
                                person_city: props.modelEmployee?.relationships?.person?.city?.name,
                                person_address: props.modelEmployee?.relationships?.person?.address,
                                person_neighborhood: props.modelEmployee?.relationships?.person?.neighborhood,
                                vacation_type_name: props.vacationTypes.find(vt => vt.id === props.modelVacation.vacation_type_id)?.name,
                                period: props.modelVacation.period,
                                days: props.modelVacation.days,
                                start_date: props.modelVacation.start_date,
                                end_date: props.modelVacation.end_date
                            }" />
                    </div>
                </SidePanel>
            </div>
        </div>
    </div>
</template>

<style scoped>
.label-bold {
    margin-bottom: 5px;
}

.split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: start;
    transition: grid-template-columns .22s ease;
}

.split.with-panel {
    grid-template-columns: 1fr 480px;
}

.split-main,
.split-panel {
    min-width: 0;
}

/* Responsive: apilar en pantallas pequeñas */
@media (max-width: 980px) {
    .split.with-panel {
        grid-template-columns: 1fr;
    }

    .split-panel {
        order: 2;
    }

    .split-main {
        order: 1;
    }
}

.slide-panel-enter-active,
.slide-panel-leave-active {
    transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
    transform: translateX(30px);
    opacity: 0;
}

/* --------- Layout principal --------- */

.titulo {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #222;
}

/* --------- Botones --------- */

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

/* --------- Grid y cards --------- */

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

@media (max-width: 768px) {
    .grid-2 {
        grid-template-columns: 1fr;
    }
}

/* Card de vacaciones (lo dejo tal cual lo tienes) */
.card-vacaciones {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;

    padding: 16px 32px;
    border-radius: 10px;
    background: linear-gradient(180deg,
            #5B4CD0 0%,
            #6C5ED5 50%,
            #7C6DD8 100%);
    color: #ffffff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    margin-bottom: 20px;
}

/* Izquierda */
.card-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.numero-dias {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    box-shadow: 0 5px 8px rgba(0, 0, 0, .5);
}

.info-dias .titulo {
    font-size: 18px;
    margin-bottom: 5px;
    font-weight: 500;
    color: #ffffff;
}

.info-dias .subtitulo {
    font-size: 13px;
    opacity: 0.9;
}

/* Barra de progreso */
.barra-progreso {
    position: relative;
    width: 220px;
    max-width: 100%;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.22);
    overflow: hidden;
}

.barra-progreso-fill {
    height: 100%;
    border-radius: inherit;
    background: #36d399;
}

/* Derecha */
.card-right {
    padding: 10px 18px;
    border-radius: 10px;
    background: #ffffff;
    color: #5a3fdc;
    text-align: right;
    min-width: 110px;
}

.card-right .label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #5a3fdc !important;
}

.card-right .valor {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 26px;
    font-weight: 1000;
    line-height: 1.2;
}

.card-right .unidad {
    font-size: 12px;
    font-weight: 500;
}

/* Responsive: en pantallas pequeñas se apila */
@media (max-width: 600px) {
    .card-vacaciones {
        flex-direction: column;
        align-items: flex-start;
        border-radius: 24px;
    }

    .card-right {
        align-self: flex-end;
    }
}

.toolbar-divider {
    width: 5px;
    align-self: stretch;
    background: #FFFFFF;
    border-radius: 999px;
    opacity: 30%;
}

/* --------- Cards de contenido --------- */

.card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, .03);
    border: 1px solid #f1f1f1;
    padding: 20px 22px;
    margin-bottom: 16px;
}

/* header del card (título + pill de días) */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

/* Títulos de sección */
.section-title {
    font-family: Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #5B4CD0;
}

/* Punto morado a la izquierda SOLO en "Periodo disfrutable" */
.section-title--dot {
    position: relative;
    padding-left: 16px;
}

.section-title--dot::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #5B4CD0;
    transform: translateY(-50%);
}

/* Pill "0 días" */
.pill-dias {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    background: #f4f1fe;
    color: #5B4CD0;
    font-size: 13px;
    font-weight: 600;
}

.pill-icon {
    font-size: 14px;
}

.pill-text {
    white-space: nowrap;
}

/* --------- Labels e inputs --------- */

.input-box:focus,
:deep(.search-select__control--is-focused) {
    border-color: #5B4CD0;
    box-shadow: 0 0 0 1px rgba(91, 76, 208, 0.25);
}

/* ====== CONTENEDOR GENERAL ====== */
.vac-skeleton-card {
    border: 1px solid #f1f1f1;
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 20px;
}

/* ====== BARRA SUPERIOR ====== */
.vac-header-skeleton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f2ff;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 24px;
}

.vac-header-left,
.vac-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.skel-num {
    width: 42px;
    height: 42px;
    border-radius: 12px;
}

.skel-title {
    width: 180px;
    height: 18px;
    border-radius: 6px;
}

.skel-small {
    width: 120px;
    height: 12px;
    border-radius: 6px;
}

/* ====== CAMPOS ====== */
.vac-field-group {
    margin-bottom: 26px;
}

.vac-label {
    width: 140px;
    height: 14px;
    margin-bottom: 10px;
    border-radius: 6px;
}

.skel-input {
    width: 100%;
    height: 42px;
    border-radius: 10px;
}

/* Para columnas lado a lado */
.vac-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
}

/* ====== BOTONES ====== */
.vac-btns {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 25px;
}

.skel-btn {
    width: 100px;
    height: 36px;
    border-radius: 10px;
}

/* ====== ANIMACIÓN SHIMMER (la tuya) ====== */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

@keyframes shimmer {
    0% {
        background-position: 100% 0
    }

    100% {
        background-position: 0 0
    }
}
</style>