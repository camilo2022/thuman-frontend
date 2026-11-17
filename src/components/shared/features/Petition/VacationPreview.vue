<script setup>
import { computed } from "vue";

const props = defineProps({
    content: { type: String, required: true },
    data: { type: Object, required: true }
});

/*
-------------------------------------------------------------
 Procesa chips según estén antes o después de “Cordialmente”
-------------------------------------------------------------
*/
function renderTemplate(html, data) {
    if (!html) return "";

    const splitIndex = html.indexOf("Cordialmente");

    if (splitIndex === -1) {
        return replaceChips(html, data, { strongIfValue: true });
    }

    const before = html.substring(0, splitIndex);
    const after = html.substring(splitIndex);

    return (
        replaceChips(before, data, { strongIfValue: true }) +
        replaceChips(after, data, { strongIfValue: true })
    );
}

function replaceChips(section, data, options = {}) {
    const alwaysRenderKeys = ["start_date", "end_date", "days", "period"];

    return section.replace(
        /<span[^>]*class=["']var-chip["'][^>]*data-key=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi,
        (match, key, placeholder) => {
            const normalizedKey = key.replace(":", "").trim();
            let value = data[normalizedKey];

            const clean = String(value || "")
                .replace(/<p><br><\/p>/gi, "")
                .replace(/<p><\/p>/gi, "")
                .replace(/<br>/gi, "")
                .replace(/&nbsp;/gi, "")
                .trim();

            const hasValue = clean.length > 0;

            // Caso especial: compensación
            if (normalizedKey === "compensation") {
                if (!hasValue) {
                    return `<strong>El permiso otorgado no será objeto de compensación.</strong>`;
                }
                return `<strong>${clean}</strong>`;
            }

            // Si hay valor → mostrar en strong
            if (options.strongIfValue && hasValue) {
                return `<strong>${clean}</strong>`;
            }

            // Si no hay valor y es uno de los campos que sí deben mantenerse visibles
            if (!hasValue && alwaysRenderKeys.includes(normalizedKey)) {
                return `<span class="var-chip" data-key="${key}">${placeholder}</span>`;
            }

            // Si no hay valor y NO es uno de los campos obligatorios de mostrar → no mostrar nada
            if (!hasValue) {
                return "";
            }

            return clean;
        }
    );
}
const html = computed(() => renderTemplate(props.content, props.data));

defineExpose({
    getHtml: () => html.value
});
</script>

<template>
    <div class="preview-wrapper">

        <template v-if="false">
            <div>

                <!-- Header -->
                <div class="skel-flex">
                    <div class="skeleton" style="width:140px; height:60px; border-radius:6px;"></div>
                    <div class="skeleton skel-badge"></div>
                </div>

                <br>

                <!-- Cuerpo del texto -->
                <div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph short"></div>
                </div>
                <div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph long"></div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph short"></div>
                </div>

                <br>

                <!-- Firma -->
                <div>
                    <div class="skeleton skel-paragraph medium"></div>
                    <div class="skeleton skel-paragraph short"></div>
                    <div class="skeleton skel-paragraph short"></div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="bg-blue" style="display:flex;gap:10px;margin-bottom: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor"
                    viewBox="0 0 256 256">
                    <path
                        d="M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z">
                    </path>
                </svg>
                <p>Cada periodo de vacaciones otorga 15 días hábiles disponibles para disfrutar.
                </p>
            </div>
            <!-- HEADER -->
            <div class="header-row">
                <!-- AQUI IR EL LOGO DE LA ENTIDAD CORRESPONDIENTE -->
                <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo">
                <span class="header-title">Solicitud de vacaciones</span>
            </div>

            <hr class="separadores" />

            <!-- CONTENIDO -->
            <div class="preview-text" v-html="html"></div>
        </template>
    </div>
</template>

<style>
.preview-wrapper {
    width: 100%;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-logo {
    height: 45px;
}

.header-title {
    font-size: 13px;
    font-weight: 600;
    color: #8d8d8d;
}

.separadores {
    border: none;
    border-top: 1px solid #dcdcdc;
    margin: 12px 0 18px;
}

.preview-text {
    font-size: 14px;
    line-height: 1.6;
    color: #2d2d2d;
}

.var-chip {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 6px;
    background: #f4eeff;
    color: #5b4cd0;
    border: 1px solid #e0d5ff;
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
}

.permission-skeleton {
    padding: 24px;
    background: #fff;
    border-radius: 12px;
}

.skel-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.skel-badge {
    width: 110px;
    height: 26px;
    border-radius: 20px;
}

.skel-title {
    width: 180px;
    height: 24px;
    border-radius: 6px;
    margin-bottom: 12px;
}

.skel-paragraph {
    height: 14px;
    margin: 6px 0;
    border-radius: 6px;
}

.skel-paragraph.short {
    width: 40%;
}

.skel-paragraph.medium {
    width: 70%;
}

.skel-paragraph.long {
    width: 100%;
}

.skel-file {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
}

.skel-file-icon {
    width: 46px;
    height: 56px;
    border-radius: 8px;
}

.skel-file-line {
    width: 160px;
    height: 14px;
    border-radius: 6px;
}

/* Re-uso de tu animación */
.skeleton {
    background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
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