<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import imgUserPic from '@/assets/img/USERPIC.png';

const props = defineProps({
    loading: Boolean,
    modelApplication: Object,
    contarMeses: Function,
    modelVacant: Object,
    loadingFind: Boolean,
    academicQualifications: Array,
    languageProficiencies: Array,
    professionalSkills: Array,
    professionalExperiences: Array,
    compatibility: Number
})

const show = ref(false);
const emit = defineEmits(['index'])

//Semaforización por % de los candidatos
const compatibilityClass = (compat) => {
    const value = parseInt(compat)
    if (value >= 80) return 'badge--success'
    if (value >= 60) return 'badge--warn'
    return 'badge--danger'
}

function currentLabel(p) {
    if (p >= 81) return 'Experto'
    if (p >= 61) return 'Avanzado'
    if (p >= 41) return 'Intermedio'
    if (p >= 21) return 'Básico'
    return 'Principiante'
}
function currentColor(p) {
    if (p >= 81) return '#2bb673'
    if (p >= 61) return '#5b4cd0'
    if (p >= 41) return '#f7db23'
    if (p >= 21) return '#f78d2f'
    return '#d82724'
}

const langs = computed(() =>
    props.languageProficiencies ??
    props.modelApplication?.relationships?.languageProficiencies ??
    []
)

// Saca una abreviatura del nivel (B1, B2, etc.) o cae al nombre
const levelShort = (lp) =>
    lp?.language_level?.settings?.short ??
    lp?.language_level?.settings?.code ??
    lp?.language_level?.name ?? ''

const fechaActual = new Date().toISOString().split('T')[0]; // Ejemplo: "2025-10-19"

function placeLine(aq) {
    const city = aq?.city?.name;
    const dept = aq?.city?.departament?.name;
    const country = aq?.city?.departament?.country?.name;
    return [country, dept, city].filter(Boolean).join(', ');
}

function dateRange(aq) {
    const fmt = (d) => {
        if (!d) return '';
        const date = new Date(d);
        if (isNaN(date)) return d; // por si ya viene formateada
        return date.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
    const s = fmt(aq?.start_date);
    const e = fmt(aq?.end_date);
    if (s && e) return `${s} - ${e}`;
    if (s && !e) return `${s} - Actual`;
    return s || e || '';
}

function phoneLine(exp) {
    // Prefijo internacional desde supervisor_dialing_country.phone_code
    const cc = exp?.supervisor_dialing_country?.phone_code;
    const num = (exp?.supervisor_phone_number || '').toString().trim();

    if (!num) return '';

    // Limpieza básica del número (solo dígitos)
    const digits = num.replace(/\D+/g, '');

    // Construimos línea tipo: +57 31330054454 (Supervisor: Nombre)
    const parts = [];
    if (cc) parts.push(`+${cc}`);
    parts.push(digits);

    const label = parts.join(' ');
    const supName = exp?.supervisor_name ? ` (Supervisor: ${exp.supervisor_name})` : '';
    return `${label}${supName}`;
}

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

function openPreview(doc) {
    if (doc && typeof doc === 'object' && 'name' in doc && 'size' in doc && 'type' in doc && typeof doc.size === 'number' && typeof doc.name === 'string') {
        const fileURL = URL.createObjectURL(doc);
        preview.value = { url: fileURL, name: doc.name };
    } else {
        preview.value = { url: doc?.path || '', name: doc?.name || 'Documento.pdf' };
    }
    showPreview.value = true
}

async function download(url, name = "archivo", extension = "pdf") {
    try {
        if (!url) throw new Error("URL vacía o undefined");

        // OJO: fetch falla por CORS/mixed content antes de llegar aquí
        const res = await fetch(url, {
            method: "GET",
            // credentials: "include", // si tu backend usa cookies/sesión
            // headers: { Authorization: `Bearer ${token}` } // si usas token
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status} ${res.statusText} - ${text.slice(0, 200)}`);
        }

        const blob = await res.blob();

        const a = document.createElement("a");
        const blobUrl = URL.createObjectURL(blob);

        a.href = blobUrl;
        a.download = `${name}.${extension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error("Download error:", err, { url, name, extension });
    }
}

const countLanges = computed(() =>
    props.languageProficiencies?.filter(lp => lp?.file?.file).length || 0
);

</script>

<template>
    <div class="">

        <div style="box-shadow: none; padding: 0;">

            <div v-if="false" :key="n" aria-busy="true" :inert="true">
                <div class="cv-skeleton">

                    <!-- Badge compatibilidad -->
                    <div class="skeleton-block skeleton-compat-badge"></div>

                    <!-- Foto + info personal -->
                    <div class="cv-header-skeleton">
                        <div class="skeleton-block skeleton-photo-vertical"></div>

                        <div class="cv-header-info">
                            <div class="skeleton-block skeleton-section-title-main"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                            <div class="skeleton-block skeleton-info-line short"></div>

                            <div class="skeleton-block skeleton-subheading"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                            <div class="skeleton-block skeleton-info-line"></div>
                        </div>
                    </div>

                    <!-- Separador -->
                    <div class="skeleton-block skeleton-divider"></div>

                    <!-- Formación -->
                    <div class="cv-section-skeleton">
                        <div class="skeleton-block skeleton-section-title"></div>
                        <div class="skeleton-block skeleton-warning-card"></div>
                    </div>

                    <!-- Idiomas -->
                    <div class="cv-section-skeleton">
                        <div class="skeleton-block skeleton-section-title"></div>
                        <div class="skeleton-block skeleton-warning-card"></div>
                    </div>

                    <!-- Experiencia -->
                    <div class="cv-section-skeleton">
                        <div class="skeleton-block skeleton-section-title"></div>
                        <div class="skeleton-block skeleton-warning-card"></div>
                    </div>

                </div>

            </div>
            <div v-else>
                <span class="badge" :class="compatibilityClass(props.modelApplication?.compatibility || '0')">
                    {{ props.modelApplication?.compatibility || '0' }}% compatible
                </span>

                <div class="card-img">
                    <img class="profile-pic"
                        :src="props.modelApplication?.relationships?.person?.photo?.path || imgUserPic"
                        alt="Foto candidata/o" />
                    <span class="candidate-name motivo">
                        {{ [props.modelApplication?.relationships?.person?.first_name,
                        props.modelApplication?.relationships?.person?.second_name,
                        props.modelApplication?.relationships?.person?.first_last_name,
                        props.modelApplication?.relationships?.person?.second_last_name].filter(Boolean).join(' ') }}
                    </span>
                </div>
                <div style="margin-top: 20px;">
                    <section>
                        <ul class="section-list">
                            <li>
                                <h3>Información personal</h3>
                            </li>
                            <div class="card-body">
                                <div class="card-description">
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z">
                                            </path>
                                        </svg>
                                        <strong>Edad:</strong> {{ typeof contarMeses === 'function' ?
                                            contarMeses(props.modelApplication?.relationships?.person?.birth_date,
                                                fechaActual) : 0 }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z">
                                            </path>
                                        </svg>
                                        <strong>Documento:</strong>
                                        {{
                                            props.modelApplication?.relationships?.person?.document_type?.settings?.abreviature
                                        }} {{
                                            props.modelApplication?.relationships
                                                ?.person?.document_number || 'Sin documento'
                                        }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z">
                                            </path>
                                        </svg>
                                        <strong>Fecha de expedición:</strong> {{
                                            props.modelApplication?.relationships
                                                ?.person?.document_issue_date?.split(' ')[0]
                                        }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z">
                                            </path>
                                        </svg>
                                        <strong>Estado civil:</strong> {{
                                            props.modelApplication?.relationships?.person?.marital_status?.name
                                            || 'Sin estado civil' }}
                                    </p>
                                </div>
                            </div>

                            <li>
                                <h3>Datos de contacto</h3>
                            </li>
                            <div class="card-body">
                                <div class="card-description">
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z">
                                            </path>
                                        </svg>
                                        <strong>Teléfono:</strong> {{
                                            props.modelApplication?.relationships?.person?.phone_number || 'Sin descripción'
                                        }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z">
                                            </path>
                                        </svg>
                                        <strong>Correo electrónico:</strong> {{
                                            props.modelApplication?.relationships?.person?.email || 'Sin correo' }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z">
                                            </path>
                                        </svg>
                                        <strong>Ubicación:</strong> {{
                                            `${props.modelApplication?.relationships?.person?.city?.departament?.country?.name}`
                                        }}, {{ props.modelApplication?.relationships?.person?.city?.departament?.name
                                        }}, {{ props.modelApplication?.relationships?.person?.city?.name }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z">
                                            </path>
                                        </svg>
                                        <strong>Dirección:</strong>
                                    <p class="motivo">
                                        {{
                                            `${props.modelApplication?.relationships?.person?.address}
                                        ${props.modelApplication?.relationships?.person?.neighborhood}` }}
                                    </p>
                                    </p>
                                </div>
                            </div>
                        </ul>
                    </section>
                </div>
                <hr class="separadores">
                <div style="margin-top: 20px;">
                    <section>
                        <ul class="section-list">
                            <li>
                                <h3>Formación</h3>
                            </li>

                            <!-- Si hay formaciones -->
                            <template v-if="(props.academicQualifications || []).length">
                                <div class="card-body-formation" v-for="aq in props.academicQualifications"
                                    :key="aq.id">
                                    <div class="card-description">
                                        <p><strong>{{ aq?.academic_level?.name }}</strong></p>

                                        <p class="motivo" v-if="aq?.academic_institution">{{ aq?.academic_institution }}
                                        </p>
                                        <p class="motivo" v-if="aq?.academic_title">{{ aq?.academic_title }}</p>
                                        <p class="motivo">{{ aq?.formation_status?.name }}</p>

                                        <p class="motivo" v-if="placeLine(aq)">{{ placeLine(aq) }}</p>

                                        <p class="motivo" v-if="dateRange(aq)">{{ dateRange(aq) }}</p>

                                    </div>
                                </div>
                            </template>

                            <!-- Si no hay formaciones -->
                            <div class="bg-yellow" style="display:flex;gap:10px;" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Este cargo no cuenta con formaciones.
                                </p>
                            </div>

                            <br />

                            <!-- Tu sección de Idiomas queda igual -->
                            <li>
                                <h3>Idiomas</h3>
                            </li>
                            <div v-if="(props.languageProficiencies || []).length" class="card-body-formation">
                                <div class="card-description">
                                    <p v-for="lp in langs" :key="lp.id">
                                        {{ lp.language && lp.language.name }}
                                        <span v-if="levelShort(lp)"> ({{ levelShort(lp) }})</span>
                                    </p>
                                </div>
                            </div>

                            <div class="bg-yellow" style="display:flex;gap:10px;" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>El candidato no cuenta con idiomas.
                                </p>
                            </div>
                        </ul>
                    </section>
                </div>
                <hr class="separadores">
                <div style="margin-top: 20px;">
                    <section>
                        <ul class="section-list">
                            <li>
                                <h3>Experiencia</h3>
                            </li>

                            <!-- Si hay experiencias -->
                            <template v-if="(props.professionalExperiences || []).length">
                                <div class="card-body-formation" v-for="exp in props.professionalExperiences"
                                    :key="exp.id">
                                    <div class="card-description">
                                        <!-- Empresa -->
                                        <p>
                                            <strong>{{ exp?.company_name }}</strong>
                                        </p>

                                        <!-- Cargo -->
                                        <p v-if="exp.position">{{ exp.position }}</p>

                                        <!-- Teléfono jefe con indicativo país -->
                                        <p v-if="phoneLine(exp)">{{ phoneLine(exp) }}</p>

                                        <!-- Dirección de la empresa -->
                                        <p v-if="exp.company_address">{{ exp.company_address }}</p>

                                        <!-- Modalidad (Presencial/Virtual/Híbrido, etc.) -->
                                        <p>{{ exp?.work_arrangement?.name }}</p>

                                        <!-- Ubicación -->
                                        <p v-if="placeLine(exp)">{{ placeLine(exp) }}</p>

                                        <!-- Fechas -->
                                        <p v-if="dateRange(exp)">{{ dateRange(exp) }}</p>

                                        <!-- Descripción del cargo -->
                                        <p v-if="exp.position_description" class="motivo">{{ exp.position_description }}
                                        </p>

                                    </div>
                                </div>
                            </template>

                            <!-- Si NO hay experiencias -->
                            <div class="bg-yellow" style="display:flex;gap:10px;" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>El candidato no cuenta con experiencias laborales.
                                </p>
                            </div>
                        </ul>
                    </section>
                </div>
                <hr class="separadores">
                <div style="margin-top: 20px;">
                    <section>
                        <ul class="section-list">
                            <li>
                                <h3>Habilidades técnicas</h3>
                            </li>
                            <div class="skills-container"
                                v-if="props.professionalSkills.filter(s => s.skill_type_id === 22).length">
                                <div class="card-body-skills"
                                    v-for="(requiredSkill, index) in props.professionalSkills.filter(s => s.skill_type_id === 22)"
                                    :key="requiredSkill.name">
                                    <div class="skill-star-item">
                                        <div class="skill-star-left">
                                            <div class="skill-star-header">
                                                <span class="skill-star-name">{{ requiredSkill.skill.name }}</span>

                                                <div class="skill-info">
                                                    <span class="skill-level"
                                                        :style="{ backgroundColor: currentColor(requiredSkill.percentage) }">
                                                        {{ currentLabel(requiredSkill.percentage) }}
                                                    </span>
                                                    <span class="skill-percent">{{ requiredSkill.percentage
                                                    }}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-yellow" style="display:flex;gap:10px;" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>El candidato no cuenta con habilidades técnicas.
                                </p>
                            </div>
                            <br>
                            <li>
                                <h3>Habilidades sociales</h3>
                            </li>
                            <div class="skills-container"
                                v-if="props.professionalSkills.filter(s => s.skill_type_id === 21).length">
                                <div class="card-body-skills"
                                    v-for="(requiredSkill, index) in props.professionalSkills.filter(s => s.skill_type_id === 21)"
                                    :key="requiredSkill.name">
                                    <div class="skill-star-item">
                                        <div class="skill-star-left">
                                            <div class="skill-star-header">
                                                <span class="skill-star-name motivo">{{ requiredSkill.skill.name
                                                }}</span>

                                                <div class="skill-info">
                                                    <svg class="star active" xmlns="http://www.w3.org/2000/svg"
                                                        width="24" height="24" viewBox="0 0 256 256">
                                                        <path
                                                            d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                                                    </svg>
                                                    <span class="skill-percent">{{ requiredSkill.percentage
                                                    }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-yellow" style="display:flex;gap:10px;" v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                </svg>
                                <p>Este cargo no cuenta con habilidades sociales.
                                </p>
                            </div>
                        </ul>
                    </section>
                </div>
                <hr class="separadores">
                <div style="margin-top: 20px;">
                    <section>
                        <ul class="section-list">
                            <li>
                                <h3>Documentos de soporte</h3>
                            </li>
                            <ul class="section-list" style="padding: 0px 20px 0px 20px;">
                                <template v-if="props.academicQualifications.length > 0">
                                    <li>
                                        <h4>Documentos de formación</h4>
                                    </li>
                                    <ul class="section-list">
                                        <ul class="section-list">
                                            <div class="card-body-files"
                                                v-for="(academicQualification, i) in props.academicQualifications"
                                                :key="'f-' + i">
                                                <div class="info-file" v-if="academicQualification?.file?.file">
                                                    <div class="action-file">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                            fill="red" viewBox="0 0 256 256">
                                                            <path
                                                                d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                        </svg>
                                                        <div>
                                                            <span style="font-weight:600;">{{
                                                                academicQualification?.file?.file?.name }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="action-file">
                                                        <Button title="Previsualizar" icon="preview" variant="success"
                                                            @click="openPreview(academicQualification?.file?.file)" />
                                                        <Button title="Descargar" icon="download"
                                                            @click="download(academicQualification?.file?.file?.path, academicQualification?.file?.file?.name, academicQualification?.file?.file?.extension)"
                                                            variant="danger" />
                                                    </div>
                                                </div>
                                            </div>
                                        </ul>
                                    </ul>
                                </template>

                                <template v-if="countLanges > 0">
                                    <li>
                                        <h4>Documentos de idiomas</h4>
                                    </li>
                                    <ul class="section-list">
                                        <div class="card-body-files"
                                            v-for="(languageProficiencie, i) in props.languageProficiencies"
                                            :key="'f-' + i">
                                            <div class="info-file" v-if="languageProficiencie?.file?.file">
                                                <div class="action-file">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                        fill="red" viewBox="0 0 256 256">
                                                        <path
                                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                    </svg>
                                                    <div>
                                                        <span style="font-weight:600;">{{
                                                            languageProficiencie?.file?.file?.name }}</span>
                                                    </div>
                                                </div>
                                                <div class="action-file">
                                                    <Button title="Previsualizar" icon="preview" variant="success"
                                                        @click="openPreview(languageProficiencie?.file?.file)" />
                                                    <Button title="Descargar" icon="download"
                                                        @click="download(languageProficiencie?.file?.file?.path, languageProficiencie?.file?.file?.name, languageProficiencie?.file?.file?.extension)"
                                                        variant="danger" />
                                                </div>
                                            </div>
                                            <div class="skill-list" v-else>
                                                <div class="bg-yellow" style="display:flex;gap:10px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                                    </svg>
                                                    <p>Tiene un idioma sin certificado</p>
                                                </div>
                                            </div>
                                        </div>
                                    </ul>
                                </template>
                                <template v-if="props.professionalExperiences.length > 0">
                                    <li>
                                        <h4>Documentos de experiencia</h4>
                                    </li>
                                    <ul class="section-list">
                                        <div class="card-body-files"
                                            v-for="(professionalExperience, i) in props.professionalExperiences"
                                            :key="'f-' + i">
                                            <div class="info-file" v-if="professionalExperience?.file?.file">
                                                <div class="action-file">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                        fill="red" viewBox="0 0 256 256">
                                                        <path
                                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                    </svg>
                                                    <div>
                                                        <span style="font-weight:600;">{{
                                                            professionalExperience?.file?.file?.name }}</span>
                                                    </div>
                                                </div>
                                                <div class="action-file">
                                                    <Button title="Previsualizar" icon="preview" variant="success"
                                                        @click="openPreview(professionalExperience?.file?.file)" />
                                                    <Button title="Descargar" icon="download"
                                                        @click="download(professionalExperience?.file?.file?.path, professionalExperience?.file?.file?.name, professionalExperience?.file?.file?.extension)"
                                                        variant="danger" />
                                                </div>
                                            </div>
                                        </div>

                                    </ul>
                                </template>
                                <li>
                                    <h4>Documentos personales</h4>
                                </li>
                                <ul class="section-list">
                                    <ul class="section-list">
                                        <div class="card-body-files"
                                            v-if="modelApplication.relationships?.person?.file">
                                            <div class="info-file">
                                                <div class="action-file">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                        fill="red" viewBox="0 0 256 256">
                                                        <path
                                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                    </svg>
                                                    <div>
                                                        <span style="font-weight:600;">{{
                                                            props.modelApplication.relationships?.person?.file.name
                                                            }}</span>
                                                    </div>
                                                </div>
                                                <div class="action-file">
                                                    <Button title="Previsualizar" icon="preview" variant="success"
                                                        @click="openPreview(modelApplication.relationships?.person?.file)" />
                                                    <Button title="Descargar" icon="download"
                                                        @click="download(props.modelApplication.relationships?.person?.file?.path, props.modelApplication.relationships?.person?.file?.name, props.modelApplication.relationships?.person?.file?.extension)"
                                                        variant="danger" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="card-body-files"
                                            v-if="props.modelApplication.relationships?.person?.photo">
                                            <div class="info-file">
                                                <div class="action-file">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                        fill="blue" viewBox="0 0 256 256">
                                                        <path
                                                            d="M60,144H44a8,8,0,0,0-8,8v56a8,8,0,0,0,16,0v-8h8a28,28,0,0,0,0-56Zm0,40H52V160h8a12,12,0,0,1,0,24Zm164,16.87a8,8,0,0,1-2.22,5.53A30.06,30.06,0,0,1,200,216c-17.65,0-32-16.15-32-36s14.35-36,32-36a29.45,29.45,0,0,1,16.48,5.11,8,8,0,0,1-9,13.27A13.21,13.21,0,0,0,200,160c-8.82,0-16,9-16,20s7.18,20,16,20a13.57,13.57,0,0,0,8-2.72V192a8,8,0,0,1,0-16h8a8,8,0,0,1,8,8ZM156,152v56a8,8,0,0,1-5.56,7.62A7.91,7.91,0,0,1,148,216a8,8,0,0,1-6.51-3.35L116,177v31a8,8,0,0,1-16,0V152a8,8,0,0,1,14.51-4.65L140,183V152a8,8,0,0,1,16,0ZM48,120a8,8,0,0,0,8-8V40h88V88a8,8,0,0,0,8,8h48v16a8,8,0,0,0,16,0V88a8,8,0,0,0-2.34-5.66l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v72A8,8,0,0,0,48,120ZM160,51.31,188.69,80H160Z" />
                                                    </svg>
                                                    <div>
                                                        <span style="font-weight:600;">{{
                                                            modelApplication.relationships?.person?.photo.name }}</span>
                                                    </div>
                                                </div>
                                                <div class="action-file">
                                                    <Button title="Previsualizar" icon="preview" variant="success"
                                                        @click="openPreview(props.modelApplication.relationships?.person?.photo)" />
                                                    <Button title="Descargar" icon="download"
                                                        @click="download(props.modelApplication.relationships?.person?.photo?.path, props.modelApplication.relationships?.person?.photo?.name, props.modelApplication.relationships?.person?.photo?.extension)"
                                                        variant="danger" />
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            v-if="!props.modelApplication.relationships?.person?.file && !props.modelApplication.relationships?.person?.photo">
                                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                                </svg>
                                                <p>No hay documentos personales.</p>
                                            </div>
                                        </div>
                                    </ul>
                                </ul>
                            </ul>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
    <PDFPreview v-if="showPreview && preview.url" :key="preview.url" :show="showPreview" :pdfUrl="preview.url"
        :pdfName="preview.name" @close="showPreview = false" />
</template>

<style scoped>
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
    white-space: nowrap;
}

.badge svg {
    display: block;
    /* elimina espacios fantasmas */
}

.badge--success {
    color: #18794e;
    background: #e6f6ec;
    border-color: #bbebd2;
}

.badge--warn {
    color: #8a6a00;
    background: #fff7cc;
    border-color: #ffe894;
}

.badge--danger {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fecaca;
}

.card-img {
    display: flex;
    justify-content: start;
    padding: 10px 0 0;
    gap: 20px;
}

.profile-pic {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(91, 76, 208, .25);
    border: 3px solid #fff;
}

.card-body {
    padding: 0 0 5px 10px;
}

.card-body-formation {
    padding: 5px 0 5px 10px;
    border-left: 3px solid #5b4cd0;
}

.card-description {
    font-size: 0.9rem;
    color: #111;
}

.card-description p {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 13px;
    min-width: 0;
    line-height: 1.45;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.card-description svg {
    color: #5b4cd0;
    flex-shrink: 0;
    margin-top: 2px;
}

.card-description strong {
    font-weight: 600;
    font-size: 13px;
    color: #000;
    margin-right: -3px;
}

.card-description svg {
    color: #5b4cd0;
}

.info-icon {
    width: 16px;
    height: 16px;
    fill: #5b4cd0;
    flex-shrink: 0;
}

.section-list {
    list-style: none;
    /* quitamos bullets nativos */
    padding: 0;
    margin: 0;
}

.section-list>li {
    position: relative;
    padding-left: 20px;
    color: #5b4cd0;
    /* espacio para el punto */
}

.section-list>li::before {
    content: "•";
    /* bullet personalizado */
    position: absolute;
    left: 0;
    top: 4px;
    font-size: 20px;
    color: #5b4cd0;
    /* color morado */
    line-height: 1;
}

.subtitulo {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
}

.separadores {
    margin: 0;
    margin-top: 20px;
    background-color: #E3DFFF;
    width: 100%;
}

.skill-star-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Cada columna ocupa 50% */
    gap: 12px;
    width: 100%;
    align-items: start;
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
    align-items: flex-start;
    gap: 20px;
    font-size: 14px;
    min-width: 0;
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

.skill-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skill-level {
    color: white;
    padding: 3px 8px;
    font-size: 11px;
    border-radius: 6px;
    font-weight: 600;
}

.skill-percent {
    font-size: 12px;
    color: #2b2c34;
    font-weight: 600;
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

.skills-container {
    display: flex;
    flex-wrap: wrap;
}

.card-body-skills {
    padding: 0 0 5px 10px;
}

.bg-purple {
    background-color: #FBF9FF;
    color: #5B4CD0;
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
}

.bg-red {
    background-color: #FFEDED;
    color: #DC2626;
}

.bg-orange {
    background-color: #FFEFD9;
    color: #FD9300;
}

.card-body-files {
    padding: 0 0 5px 10px;
}

.info-file {
    display: flex;
    align-items: center;
    background-color: #FBF9FF;
    padding: 10px;
    border: 2px solid #5B4CD0;
    border-radius: 5px;
    justify-content: space-between;
}

.info-file span {
    color: #000000;
    font-weight: 600;
    font-size: 16px;
}

.action-file {
    display: flex;
    align-items: center;
    gap: 8px;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    color: #5b4cd0;
    cursor: pointer;
    border: 1px solid #dadcfb;
    transition: transform .15s ease, background .15s ease;
}

.icon-btn:hover {
    transform: translateY(-1px);
    background: #e6e8ff;
}

.icon-btn svg {
    width: 18px;
    height: 18px;
    display: block;
}

/* --- Skeleton Curriculum Details --- */

/* Badge compatibilidad */
.skeleton-compat-badge {
    width: 120px;
    height: 24px;
    border-radius: 999px;
    margin-bottom: 12px;
}

/* Foto + datos personales */
.cv-header-skeleton {
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 20px;
}

.skeleton-photo-vertical {
    width: 100px;
    height: 100px;
    border-radius: 20px;
}

/* Bloque de info personal */
.skeleton-section-title-main {
    width: 200px;
    height: 22px;
    margin-bottom: 10px;
}

.skeleton-info-line {
    width: 70%;
    height: 14px;
    margin-bottom: 6px;
}

.skeleton-info-line.short {
    width: 45%;
}

/* Subtítulo tipo "Datos de contacto:" */
.skeleton-subheading {
    width: 160px;
    height: 18px;
    margin: 12px 0 8px;
}

/* Separador entre secciones (línea morada) */
.skeleton-divider {
    width: 100%;
    height: 2px;
    border-radius: 999px;
    margin: 20px 0;
}

/* Secciones Formación / Idiomas / Experiencia */
.cv-section-skeleton {
    margin-bottom: 22px;
}

.skeleton-section-title {
    width: 160px;
    height: 20px;
    margin-bottom: 10px;
}

/* Tarjeta de advertencia ("Este cargo no cuenta con ...") */
.skeleton-warning-card {
    width: 100%;
    height: 50px;
    border-radius: 12px;
}

.skeleton-block {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 10px;
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

/* Utilidades para maquetar */
.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.justify-between {
    justify-content: space-between;
}

.items-center {
    align-items: center;
}

.space-y-1>*+* {
    margin-top: 0.25rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.flex-wrap {
    flex-wrap: wrap;
}

.gap-2 {
    gap: 0.5rem;
}

.panel-close {
    border: none;
    background: transparent;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

/* ====== Fila de documento responsiva ====== */
.card-body-files {
    margin-bottom: 10px;
}

.info-file {
    /* 2 columnas: nombre (flexible) | acciones (auto) */
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px 12px;
    max-width: 100%;
    padding: 10px;
    background: #FBF9FF;
    border: 2px solid #5B4CD0;
    border-radius: 10px;
}


/* ====== Responsive: cuando el panel sea más angosto, las acciones bajan ====== */
@media (max-width: 520px) {
    .info-file {
        grid-template-columns: 1fr;
        /* una sola columna */
        row-gap: 8px;
    }

    .info-file .action-file:last-child {
        justify-content: flex-end;
        /* botones alineados a la derecha */
    }
}

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
}

.card-description p,
.card-description strong,
.skill-star-name,
.info-file span {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
}

.card-img {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 10px 0 0;
    gap: 20px;
    min-width: 0;
}

.candidate-name {
    display: block;
    min-width: 0;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.35;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.action-file {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.action-file:first-child {
    min-width: 0;
    overflow: hidden;
}

.action-file:first-child>div {
    min-width: 0;
}

.info-file span {
    display: block;
    min-width: 0;
    font-weight: 600;
    font-size: 16px;
    color: #000;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
}

.skill-star-header,
.skill-star-left,
.card-body-skills {
    min-width: 0;
}

.skill-star-name {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: normal;
}

@media (max-width: 768px) {
    .card-img {
        align-items: flex-start;
        gap: 12px;
    }

    .candidate-name {
        font-size: 16px;
    }

    .profile-pic {
        width: 72px;
        height: 72px;
        flex-shrink: 0;
    }

    .card-description p {
        font-size: 12px;
    }

    .card-description strong {
        font-size: 12px;
    }

    .info-file span {
        font-size: 14px;
    }

    .skill-star-header {
        flex-direction: column;
        gap: 8px;
    }

    .skill-info {
        align-self: flex-start;
        flex-wrap: wrap;
    }
}
</style>