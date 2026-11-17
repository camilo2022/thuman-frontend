<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'

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
function downloadPdf() {
    const url = ''
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'pdf.pdf'
            link.click()
            URL.revokeObjectURL(link.href)
        })
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

function fileUrl(aq) {
    return aq?.file?.path || '';
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

const fixStorageUrl = (url) =>
    typeof url === 'string'
        ? // deja solo la primera base ".../storage/" si viene repetida
        url.replace(/^(.+?\/storage\/)(?:https?:\/\/[^/]+\/storage\/)+/i, '$1')
        : ''

const basename = (p) => (typeof p === 'string' ? p.split('/').pop() : '')

const bytesToSize = (b) => {
    const n = Number(b)
    if (!n || n <= 0) return ''
    const i = Math.floor(Math.log(n) / Math.log(1024))
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${sizes[i]}`
}

// Si tienes un catálogo de tipos/subtipos, puedes inyectarlo por props y usarlo aquí
// const props = defineProps({ fileTypeMap: Object, ... })

const detectType = (fileObj) => {
    const mime = fileObj?.mime || fileObj?.metadata?.mime
    const ext = (fileObj?.extension || '').toString().toLowerCase()

    // 1) Por MIME (más confiable)
    if (mime === 'application/pdf') return 'PDF'
    if (mime?.startsWith('image/')) return 'Imagen'
    if (mime?.startsWith('video/')) return 'Video'
    if (mime?.startsWith('audio/')) return 'Audio'
    if (mime === 'application/zip' || mime === 'application/x-zip-compressed') return 'ZIP'

    // 2) Por extensión
    if (['pdf'].includes(ext)) return 'PDF'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext)) return 'Imagen'
    if (['zip', 'rar', '7z'].includes(ext)) return ext.toUpperCase()
    if (ext) return ext.toUpperCase()

    // 3) (Opcional) Por IDs si tienes mapa:
    // const key = `${fileObj?.file_type_id}:${fileObj?.file_subtype_id}`
    // const byId = props.fileTypeMap?.[key]
    // if (byId) return byId

    return 'Documento'
}

const pickDisplayName = (fileObj) =>
    fileObj?.metadata?.client_original_name ||
    fileObj?.name ||
    basename(fileObj?.path) ||
    'Documento'

// Extrae el "file object" sin importar si está en file.file o file
const extractFileObject = (container) => {
    const candidate = container?.file?.file || container?.file || null
    if (!candidate) return null
    return {
        ...candidate,
        path: fixStorageUrl(candidate.path || '')
    }
}

// --- Formación: docs (solo los que traen archivo) ---
const formationDocs = computed(() =>
    (props.academicQualifications ?? []).map(aq => {
        const f = extractFileObject(aq)
        return {
            url: f?.path || '',
            name: f ? pickDisplayName(f) : '',
            type: f ? detectType(f) : '',
            size: f ? bytesToSize(f.size || f.metadata?.size) : '',
            // info extra para la UI
            title: aq?.academic_title ?? aq?.academic_level?.name ?? 'Formación',
            subtitle: [aq?.academic_institution, dateRange(aq)].filter(Boolean).join(' · ')
        }
    }).filter(d => d.url) // renderiza solo si hay archivo
)

// Docs de IDIOMAS (si tu API trae archivo para idiomas; si no, quedará vacío)
const languageDocs = computed(() =>
    (props.languageProficiencies ?? []).map(lp => {
        const f = extractFileObject(lp) // en tu payload es lp.file, pero esto soporta ambos
        return {
            url: f?.path || '',
            name: f ? pickDisplayName(f) : '',
            type: f ? detectType(f) : '',
            size: f ? bytesToSize(f.size || f.metadata?.size) : '',
            // contexto para mostrar
            title: lp?.language?.name || 'Idioma',
            subtitle: levelShort(lp)
        }
    }).filter(d => d.url)
)

// Docs de EXPERIENCIA (solo los que traen archivo)
const experienceDocs = computed(() =>
    (props.professionalExperiences ?? []).map(exp => {
        const f = extractFileObject(exp)
        return {
            url: f?.path || '',
            name: f ? pickDisplayName(f) : '',
            type: f ? detectType(f) : '',
            size: f ? bytesToSize(f.size || f.metadata?.size) : '',
            // contexto para mostrar
            title: exp?.company_name || 'Experiencia',
            subtitle: [
                exp?.position,
                exp?.work_arrangement?.name,
                placeLine(exp),
                dateRange(exp)
            ].filter(Boolean).join(' · ')
        }
    }).filter(d => d.url)
)

const person = computed(() => props.modelApplication?.relationships?.person ?? {})

// Lista de 3 documentos personales
const personalDocs = computed(() => {
    const list = []
    const push = (fileLike, label) => {
        const f = fileLike && fileLike.path ? { ...fileLike, path: fixStorageUrl(fileLike.path) } : null
        if (!f) return
        list.push({
            url: f.path,
            name: pickDisplayName(f),
            type: detectType(f),
            label
        })
    }

    push(person.value?.file, 'Documento personal')
    push(person.value?.profile?.file, 'Archivo de perfil')
    push(person.value?.photo, 'Foto')

    return list
})

const preview = ref({ url: '', name: '' })
const showPreview = ref(false)

function openPreview(doc) {
    preview.value = { url: doc?.url || '', name: doc?.name || 'Documento.pdf' }
    showPreview.value = true
}

function download(url, name, extension) {
    fetch(url).then(res => res.blob()).then(blob => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${name}.${extension}`;
        link.click()
        URL.revokeObjectURL(link.href)
    })
}

async function downloadFile(doc) {
    if (!doc?.url) return
    const res = await fetch(doc.url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (doc.name || 'archivo').replace(/\s+/g, '_')
    a.click()
    URL.revokeObjectURL(a.href)
}

const countLanges = computed(() =>
    props.languageProficiencies?.filter(lp => lp?.file?.file).length || 0
);

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
        <span>Vacantes</span>
        <span>|</span>
        <span>Candidatos {{ props.modelVacant.relationships?.position?.name }}</span>
        <span>|</span>
        <span class="active">Hoja de vida</span>
    </div>
    <div class="container-data">
        <div class="main-container">
            <div v-if="props.loadingFind" :key="n" class="card" aria-busy="true" :inert="true"
                style="padding:15px;border-radius:14px;">

                <div class="cv-skeleton">
                    <!-- Botones -->
                    <div class="flex justify-between mb-4">
                        <div class="skeleton skel-pill"></div>
                        <div class="skeleton skel-pill"></div>
                    </div>

                    <!-- Avatar + nombre -->
                    <div class="tests-candidate-skeleton">
                        <div class="skeleton-block skeleton-avatar"></div>

                        <div>
                            <div class="skeleton-block skeleton-candidate-name"></div>
                            <div class="skeleton-block skeleton-candidate-subline"></div>
                        </div>
                    </div>

                    <!-- Información personal -->
                    <div class="section mb-4">
                        <div class="skeleton skel-line" style="width: 180px;"></div>
                        <div class="mt-2 space-y-1">
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-line"></div>
                            <div class="skeleton skel-line"></div>
                        </div>
                    </div>

                    <!-- Formación -->
                    <div class="section mb-4">
                        <div class="skeleton skel-line" style="width: 160px;"></div>
                        <div class="mt-2 space-y-1">
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-line"></div>
                        </div>
                    </div>

                    <!-- Idiomas -->
                    <div class="section mb-4">
                        <div class="skeleton skel-line" style="width: 100px;"></div>
                        <div class="mt-2 space-y-1">
                            <div class="skeleton skel-pill"></div>
                        </div>
                    </div>

                    <!-- Experiencia -->
                    <div class="section mb-4">
                        <div class="skeleton skel-line" style="width: 140px;"></div>
                        <div class="mt-2 space-y-1">
                            <div class="skeleton skel-half"></div>
                            <div class="skeleton skel-line"></div>
                            <div class="skeleton skel-line"></div>
                        </div>
                    </div>

                    <!-- Habilidades -->
                    <div class="section mb-4">
                        <div class="skeleton skel-line" style="width: 120px;"></div>
                        <div class="mt-2 flex flex-wrap gap-2">
                            <div class="skeleton skel-pill"></div>
                            <div class="skeleton skel-pill"></div>
                            <div class="skeleton skel-pill"></div>
                            <div class="skeleton skel-pill"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <!-- TÍTULO -->
                <span class="badge" :class="compatibilityClass(props.modelApplication.compatibility || '0')">
                    {{ props.modelApplication.compatibility || '0' }}% compatible
                </span>

                <div class="card-img">
                    <img class="profile-pic"
                        :src="props.modelApplication.relationships?.person?.photo?.path || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'"
                        alt="Foto candidata/o">
                    <span style="display: flex; align-items: center; gap: 15px; font-weight: 600; font-size: 18px;">
                        {{
                            `${props.modelApplication.relationships?.person?.first_name || ''}
                        ${props.modelApplication.relationships?.person?.second_name || ''}
                        ${props.modelApplication.relationships?.person?.first_last_name || ''}
                        ${props.modelApplication.relationships?.person?.second_last_name || ''}`.trim()
                        }}
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
                                        <strong>Edad:</strong> {{
                                            contarMeses(props.modelApplication.relationships?.person?.birth_date,
                                                fechaActual) }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z">
                                            </path>
                                        </svg>
                                        <strong>Documento:</strong> {{
                                            props.modelApplication.relationships?.person?.document_type?.settings?.abreviature
                                        }} {{
                                            props.modelApplication.relationships?.person?.document_number || 'Sin documento'
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
                                            props.modelApplication.relationships?.person?.document_issue_date?.split(' ')[0]
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
                                            props.modelApplication.relationships?.person?.marital_status?.name
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
                                            props.modelApplication.relationships?.person?.phone_number || 'Sin teléfono'
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
                                            props.modelApplication.relationships?.person?.email || 'Sin correo' }}
                                    </p>
                                    <p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
                                            fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M228.92,49.69a8,8,0,0,0-6.86-1.45L160.93,63.52,99.58,32.84a8,8,0,0,0-5.52-.6l-64,16A8,8,0,0,0,24,56V200a8,8,0,0,0,9.94,7.76l61.13-15.28,61.35,30.68A8.15,8.15,0,0,0,160,224a8,8,0,0,0,1.94-.24l64-16A8,8,0,0,0,232,200V56A8,8,0,0,0,228.92,49.69ZM104,52.94l48,24V203.06l-48-24ZM40,62.25l48-12v127.5l-48,12Zm176,131.5-48,12V78.25l48-12Z">
                                            </path>
                                        </svg>
                                        <strong>Ubicación:</strong> {{
                                            `${props.modelApplication?.relationships?.person?.city?.departament?.country?.emoji}
                                        ${props.modelApplication?.relationships?.person?.city?.departament?.country?.name}`
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
                                        <strong>Dirección:</strong> {{
                                            props.modelApplication.relationships?.person?.address
                                            || 'Sin descripción' }}
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

                                        <p v-if="aq?.academic_institution">{{ aq?.academic_institution }}</p>
                                        <p v-if="aq?.academic_title">{{ aq?.academic_title }}</p>
                                        <p>{{ aq?.formation_status?.name }}</p>

                                        <p v-if="placeLine(aq)">{{ placeLine(aq) }}</p>

                                        <p v-if="dateRange(aq)">{{ dateRange(aq) }}</p>

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
                                <p>Este cargo no cuenta con idiomas.
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
                                        <p v-if="exp.position_description">{{ exp.position_description }}</p>

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
                                <p>Este cargo no cuenta con experiencias.
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
                                <p>Este cargo no cuenta con habilidades técnicas.
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
                                                <span class="skill-star-name">{{ requiredSkill.skill.name }}</span>

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
                                <li>
                                    <h4>Documentos personales</h4>
                                </li>
                                <ul class="section-list">
                                    <template v-if="personalDocs.length">
                                        <div class="card-body-files" v-for="(doc, i) in personalDocs"
                                            :key="'perso-' + i">
                                            <div class="info-file">
                                                <div class="action-file">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                        fill="red" viewBox="0 0 256 256">
                                                        <path
                                                            d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                    </svg>
                                                    <div>
                                                        <span style="font-weight:600;">{{ doc.name }}</span>
                                                    </div>
                                                </div>

                                                <div class="action-file">
                                                    <Button title="Previsualizar" icon="preview" variant="success"
                                                        @click="openPreview(doc)" />
                                                    <Button title="Descargar" @click="downloadFile(doc)" icon="download"
                                                        variant="danger" />
                                                </div>
                                            </div>
                                        </div>
                                    </template>

                                    <div class="card-body-files" v-else>
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
                                <template v-if="formationDocs.length">
                                    <li>
                                        <h4>Documentos de formación</h4>
                                    </li>
                                    <ul class="section-list">
                                        <ul class="section-list">
                                            <template v-if="formationDocs.length">
                                                <div class="card-body-files" v-for="(doc, i) in formationDocs"
                                                    :key="'f-' + i">
                                                    <div class="info-file">
                                                        <div class="action-file">
                                                            <!-- icono -->
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25"
                                                                height="25" fill="red" viewBox="0 0 256 256">
                                                                <path
                                                                    d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                            </svg>

                                                            <!-- nombre y tipo -->
                                                            <span style="font-weight:600;">{{ doc.name }}</span>
                                                            <small style="margin-left:8px;color:#666;"></small>
                                                        </div>

                                                        <div class="action-file">
                                                            <!-- sin funcionalidad -->
                                                            <Button title="Previsualizar" icon="preview"
                                                                variant="success" @click="openPreview(doc)" />
                                                            <Button title="Descargar" @click="downloadFile(doc)"
                                                                icon="download" variant="danger" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <div class="skill-list" v-else>
                                                <div class="bg-yellow" style="display:flex;gap:10px;">
                                                    <!-- ícono alerta -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                        fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                                    </svg>
                                                    <p>No hay documentos de formación.</p>
                                                </div>
                                            </div>
                                        </ul>
                                    </ul>
                                </template>

                                <template v-if="languageDocs.length">
                                    <li>
                                        <h4>Documentos de idiomas</h4>
                                    </li>
                                    <ul class="section-list">
                                        <template v-if="languageDocs.length">
                                            <div class="card-body-files" v-for="(doc, i) in languageDocs"
                                                :key="'lang-' + i">
                                                <div class="info-file">
                                                    <div class="action-file">
                                                        <!-- icono -->
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                            fill="red" viewBox="0 0 256 256">
                                                            <path
                                                                d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                        </svg>

                                                        <!-- Nombre de archivo y tipo -->
                                                        <span style="font-weight:600;">{{ doc.name }}</span>
                                                        <small style="margin-left:8px;color:#666;"></small>
                                                    </div>

                                                    <div class="action-file">
                                                        <!-- sin funcionalidad -->
                                                        <Button title="Previsualizar" icon="preview" variant="success"
                                                            @click="openPreview(doc)" />
                                                        <Button title="Descargar" @click="downloadFile(doc)"
                                                            icon="download" variant="danger" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>

                                        <div class="skill-list" v-else>
                                            <div class="bg-yellow" style="display:flex;gap:10px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                    fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z" />
                                                </svg>
                                                <p>No hay documentos de idiomas.</p>
                                            </div>
                                        </div>
                                    </ul>
                                </template>
                                <template v-if="experienceDocs.length">
                                    <li>
                                        <h4>Documentos de experiencia</h4>
                                    </li>
                                    <ul class="section-list">
                                        <template v-if="experienceDocs.length">
                                            <div class="card-body-files" v-for="(doc, i) in experienceDocs"
                                                :key="'exp-' + i">
                                                <div class="info-file">
                                                    <div class="action-file">
                                                        <!-- ícono -->
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                            fill="red" viewBox="0 0 256 256">
                                                            <path
                                                                d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h42A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z" />
                                                        </svg>

                                                        <!-- Nombre del archivo + tipo/tamaño -->
                                                        <span style="font-weight:600;">{{ doc.name }}</span>
                                                        <small style="margin-left:8px;color:#666;"></small>
                                                    </div>

                                                    <div class="action-file">
                                                        <!-- sin funcionalidad -->
                                                        <Button title="Previsualizar" icon="preview" variant="success"
                                                            @click="openPreview(doc)" />
                                                        <Button title="Descargar" icon="download" variant="danger"
                                                            @click="downloadFile(doc)" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </ul>
                                </template>
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
    max-width: 100%;
}

.card-description {
    font-size: 0.9rem;
    color: #111;
    max-width: 100%;
}

.card-description p {
    display: flex;
    align-items: flex-start;
    /* mejor cuando hay varias líneas */
    gap: 6px;
    font-size: 13px;

    max-width: 100%;
    min-width: 0;
    /* CLAVE en flex */
    flex-wrap: wrap;
    /* ✅ permite que baje */
    white-space: normal;

    overflow-wrap: anywhere;
    /* rompe palabras largas */
    word-break: break-word;
    /* compat */
}

.card-description strong {
    font-weight: 600;
    font-size: 13px;
    color: #000;
    margin-right: 4px;
    flex: 0 0 auto;
    /* que no se comprima */
}

.card-description svg {
    color: #5b4cd0;
    flex: 0 0 auto;
    /* que el icono no se deforme */
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

.star.active {
    fill: #ffa400;
    transition: fill 0.2s ease;
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
    gap: 20px;
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
    background-color: #F4EFFC;
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
    background-color: #F4EFFC;
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

.cv-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    height: 100%;
    background-color: #fff;
}

/* Ocupar todo el alto visible */
.cv-skeleton,
.cv-skeleton * {
    box-sizing: border-box;
}

.cv-skeleton {
    min-height: calc(100vh - 120px);
    /* ajusta según tu header o toolbar */
    width: 100%;
}

/* Espaciado general entre secciones */
.cv-skeleton .section {
    border-bottom: 1px solid #eee;
    padding-bottom: 1.5rem;
}

/* Skeletons base */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
    border-radius: 8px;
}

/* Elementos */
.skel-avatar {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    margin: 12px auto;
}

.skel-line {
    height: 14px;
    margin: 6px 0;
}

.skel-half {
    height: 14px;
    width: 60%;
    margin: 6px 0;
}

.skel-pill {
    width: 90px;
    height: 22px;
    border-radius: 20px;
}

.skeleton-avatar {
    width: 90px;
    height: 90px;
    border-radius: 20%;
}

.skeleton-title {
    width: 180px;
    height: 22px;
    margin: 8px 0;
}

.skeleton-line {
    width: 100%;
    height: 14px;
    margin: 6px 0;
}

.tests-candidate-skeleton {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.skeleton-candidate-name {
    width: 220px;
    height: 18px;
    margin-bottom: 6px;
}

.skeleton-candidate-subline {
    width: 140px;
    height: 14px;
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

.bg-yellow {
    background-color: #FFF9C4;
    color: #CA8A04;
    border: 2px solid #CA8A04;
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
    align-items: center;
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