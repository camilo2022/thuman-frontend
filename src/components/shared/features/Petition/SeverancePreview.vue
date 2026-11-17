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
    const alwaysRenderKeys = ["reason"];
    const EMPTY_MARKER = "__EMPTY_CHIP__";

    const replaced = section.replace(
        /<span[^>]*class=["']var-chip["'][^>]*data-key=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi,
        (match, key, placeholder) => {
            const normalizedKey = key.replace(":", "").trim();
            const value = data[normalizedKey];

            const clean = String(value || "")
                .replace(/<p><br><\/p>/gi, "")
                .replace(/<p><\/p>/gi, "")
                .replace(/<br\s*\/?>/gi, "")
                .replace(/&nbsp;/gi, " ")
                .trim();

            const hasValue = clean.length > 0;

            if (normalizedKey === "compensation") {
                if (!hasValue) {
                    return `<strong>El permiso otorgado no será objeto de compensación.</strong>`;
                }
                return `<strong>${clean}</strong>`;
            }

            if (options.strongIfValue && hasValue) {
                return `<strong>${clean}</strong>`;
            }

            if (!hasValue && alwaysRenderKeys.includes(normalizedKey)) {
                return `<span class="var-chip" data-key="${key}">${placeholder}</span>`;
            }

            if (!hasValue) {
                return EMPTY_MARKER;
            }

            return clean;
        }
    );

    return replaced
        .replace(/&nbsp;/gi, " ")
        .replace(new RegExp(`\\s*${EMPTY_MARKER}\\s*`, "g"), " ")
        .replace(/\s+,/g, ",")
        .replace(/\s+\./g, ".")
        .replace(/\s+;/g, ";")
        .replace(/\s+:/g, ":")
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ")
        .replace(/<p>\s*<\/p>/gi, "")
        .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "")
        .replace(/<p>\s+/gi, "<p>")
        .replace(/\s+<\/p>/gi, "</p>");
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
                </div>

                <br>

                <!-- Archivo -->
                <div class="skel-file">
                    <div class="skeleton skel-file-icon"></div>
                    <div class="skeleton skel-file-line"></div>
                </div>

            </div>
        </template>
        <template v-else>
            <!-- HEADER -->
            <div class="header-row">
                <!-- AQUI IR EL LOGO DE LA ENTIDAD CORRESPONDIENTE -->
                <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo">
                <span class="header-title">Solicitud de cesantías</span>
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

    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
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
</style>