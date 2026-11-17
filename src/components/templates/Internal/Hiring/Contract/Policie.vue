<script setup>
import DateInput from "@/components/UI/templates/DateInput.vue";
import { onMounted, onUnmounted, computed } from "vue"

const props = defineProps({
    modelPolicy: Object,
    policiesTypes: Array,
    riskManagers: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['closeModals', 'submitPolicyStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")

const useThousandsFormat = (getModel, field, maxDigits = 17) => {
    return computed({
        get() {
            const model = getModel();
            const value = model?.[field];

            if (value === null || value === undefined || value === '') return '';

            return Number(value).toLocaleString('es-CO');
        },
        set(value) {
            const model = getModel();
            if (!model) return;

            const onlyNumbers = String(value)
                .replace(/\D/g, '')
                .slice(0, maxDigits);

            model[field] = onlyNumbers
                ? Number(onlyNumbers)
                : null;
        }
    });
};

const valueFormatted = useThousandsFormat(() => props.modelPolicy, 'value');
const insuredValueFormatted = useThousandsFormat(() => props.modelPolicy, 'insured_value');

const onlyNumberKeys = (event) => {
    const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End'
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
        return;
    }

    if (!/^[0-9]$/.test(event.key)) {
        event.preventDefault();
    }
};

</script>
<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <div class="modal-header">
                    <h1 class="modal-title">Agregar póliza</h1>
                </div>

                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container"
                        style="display: grid; grid-template-columns: 1fr 1fr; gap: 7px 12px;">

                        <div>
                            <label class="label-bold" for="code">Código</label>
                            <input id="code" v-model="props.modelPolicy.code" type="text" class="input-box"
                                placeholder="Código" :class="{ 'input-error': props.errors.policy_code }" />
                            <p v-if="props.errors.policy_code" class="error-text">
                                {{ props.errors.policy_code[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="risk_manager">Aseguradora</label>
                            <SearchSelect id="risk_manager" v-model="props.modelPolicy.risk_manager_id"
                                class="select-duo" :options="props.riskManagers" optionKey="name" valueKey="id"
                                placeholder="Aseguradora" :error="props.errors.policy_risk_manager_id" />
                            <p v-if="props.errors.policy_risk_manager_id" class="error-text">
                                {{ props.errors.policy_risk_manager_id[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="policy_type">Tipo</label>
                            <SearchSelect id="policy_type" v-model="props.modelPolicy.policy_type_id" class="select-duo"
                                :options="props.policiesTypes" optionKey="name" valueKey="id" placeholder="Tipo"
                                :error="props.errors.policy_type_id" />
                            <p v-if="props.errors.policy_type_id" class="error-text">
                                {{ props.errors.policy_type_id[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="value">Valor</label>
                            <input id="value" v-model="valueFormatted" type="text" inputmode="numeric" class="input-box"
                                placeholder="Valor" :class="{ 'input-error': props.errors.policy_value }" maxlength="17"
                                @keydown="onlyNumberKeys" />
                            <p v-if="props.errors.policy_value" class="error-text">
                                {{ props.errors.policy_value[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="insured_value">Valor asegurado</label>
                            <input id="insured_value" v-model="insuredValueFormatted" type="text" inputmode="numeric"
                                class="input-box" placeholder="Valor asegurado" maxlength="17"
                                :class="{ 'input-error': props.errors.policy_insured_value }"
                                @keydown="onlyNumberKeys" />
                            <p v-if="props.errors.policy_insured_value" class="error-text">
                                {{ props.errors.policy_insured_value[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="start_date">Fecha inicio</label>
                            <DateInput v-model="props.modelPolicy.start_date" :error="props.errors.policy_start_date" />
                            <p v-if="props.errors.policy_start_date" class="error-text">
                                {{ props.errors.policy_start_date[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="end_date">Fecha fin</label>
                            <DateInput v-model="props.modelPolicy.end_date" :error="props.errors.policy_end_date" />
                            <p v-if="props.errors.policy_end_date" class="error-text">
                                {{ props.errors.policy_end_date[0] }}
                            </p>
                        </div>

                        <div>
                            <label class="label-bold" for="file">Archivo</label>
                            <FileUpload v-model="props.modelPolicy.file.file" id="icon" :multiple="false"
                                :types="['PDF']" :error="props.errors.policy_file" />
                            <p v-if="props.errors.policy_file" class="error-text">
                                {{ props.errors.policy_file[0] }}
                            </p>
                        </div>

                    </div>
                </section>

                <footer class="modal-footer" style="display: flex; justify-content: center;">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitPolicyStore')">Guardar</button>
                </footer>

            </div>
        </div>
    </div>
</template>
<style scoped>
/* Estilos modal */

.modal-container {
    padding: 10px;
    background-color: #eee;
    border-radius: 18px;
}

.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 600px;
    width: 90vw;
    height: 100%;
    max-height: 600px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.content-container {
    display: flex;
    gap: 10px;
    /* altura fija para controlar tamaño */
}

.full-width {
    grid-column: span 2;
}
</style>