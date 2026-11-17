<script setup>
import { computed, isRef, unref } from "vue";

const props = defineProps({
    content: { type: [String, Object], required: true },
    data: { type: Object, required: true },
    type: { type: String, required: false }
});

// 1) Normaliza content a HTML string
const contentHtml = computed(() => {
    const c = props.content;

    // Si ya es string
    if (typeof c === "string") return c;

    // Si es objeto, intenta campos típicos
    if (c && typeof c === "object") {
        return (
            c.html ??
            c.content ??
            c.template ??
            c.body ??
            "" // fallback
        );
    }

    return "";
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
    return section.replace(
        /<span[^>]*data-key=["']([^"']+)["'][^>]*>(.*?)<\/span>/gi,
        (match, id, placeholder) => {
            const key = id.trim();

            // 2) Si viene como ref (porque la vista 1 manda refs), lo resolvemos
            const rawValue = data?.[key];
            const value = unref(rawValue); // funciona para ref y no-ref

            const clean = String(value ?? "")
                .replace(/<\/?p[^>]*>/gi, "")      // quita <p> y </p>
                .replace(/<br\s*\/?>/gi, " ")      // br -> espacio
                .replace(/&nbsp;/gi, " ")
                .replace(/<[^>]+>/g, "")           // quita cualquier otro tag
                .replace(/\s+/g, " ")
                .trim();
            const hasValue = clean.length > 0;

            // Si hay valor → strong
            if (options.strongIfValue && hasValue) {
                return `<strong>${clean}</strong>`;
            }

            // Si no hay valor → deja chip
            if (!hasValue) {
                return `<span class="var-chip" data-key="${key}">${placeholder}</span>`;
            }

            return `<span class="var-chip" data-key="${key}">${clean}</span>`;
        }
    );
}

const html = computed(() => renderTemplate(contentHtml.value, props.data));

defineExpose({
    getHtml: () => html.value
});
</script>

<template>
    <div class="preview-wrapper">
        <div class="header-row">
            <img src="@/assets/img/THUMAN.png" alt="Logo" class="header-logo" />
            <span class="header-title">{{ props.type }}</span>
        </div>

        <hr class="separadores" />

        <div class="preview-text" v-html="html"></div>
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
    display: inline;
    padding: 2px 6px;
    border-radius: 6px;
    background: #f4eeff;
    color: #5b4cd0;
    border: 1px solid #e0d5ff;
    font-weight: 600;
    font-size: 13px;
    overflow-wrap: anywhere;
    white-space: normal;
}

.preview-text ul {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
}

.separadores {
    width: 100%;
    border: none;
    border-top: 1px solid #dcdcdc;
    margin: 12px 0 18px
}

.preview-text,
.preview-text * {
    overflow-wrap: anywhere;
    word-break: break-word;
}

.chip-value {
    overflow-wrap: anywhere;
    word-break: break-word;
}
</style>