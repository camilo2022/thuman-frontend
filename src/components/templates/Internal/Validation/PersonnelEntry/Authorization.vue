<script setup>
import { onMounted, onUnmounted, computed } from "vue"

const props = defineProps({
    modelApplication: Object,
    modelInterviewInitial: Object
})

const emit = defineEmits(["close-modals", 'submitApplicationHiring']);

const formatCOP = (value) => {
    if (value == null || value == 0) return null;
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    });
};

const salaryFormatted = computed({
    get() {
        const value = props.modelApplication?.salary;

        if (!value) return '';

        return Number(value).toLocaleString('es-CO');
    },
    set(value) {
        const onlyNumbers = String(value).replace(/\D/g, '').slice(0, 10);

        props.modelApplication.salary = onlyNumbers
            ? Number(onlyNumbers)
            : null;
    }
});

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Autorización</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container" style="display: grid; grid-template-columns: auto;">

                        <div>
                            <label class="label-bold">Vacante:</label>
                            <div>
                                <p class="info-row">{{
                                    [formatCOP(props.modelApplication?.relationships?.vacant?.salary_min),
                                    formatCOP(props.modelApplication?.relationships?.vacant?.salary_max)]
                                        .filter(Boolean).join(' - ') || '$ -' }}</p>
                            </div>
                            <label class="label-bold">Aspiración:</label>
                            <div>
                                <p class="info-row">{{ [formatCOP(props.modelInterviewInitial?.salary_min),
                                formatCOP(props.modelInterviewInitial?.salary_max)].filter(Boolean).join(' - ') ||
                                    '$ -' }}</p>
                            </div>
                        </div>
                        <div class="">
                            <div class="textarea-wrapper">
                                <label class="label-bold" for="salary">Salario</label>
                                <input type="text" v-model="salaryFormatted" name="salary" id="salary" class="input-box"
                                    placeholder="Salario" maxlength="10">
                            </div>
                        </div>
                        <div class="">
                            <div class="textarea-wrapper">
                                <label class="label-bold" for="observation">Observación</label>
                                <textarea v-model="props.modelApplication.observation" name="observation"
                                    id="observation" placeholder="Observación" maxlength="500"
                                    class="text-area"></textarea>
                                <div class="char-limit-text">({{ props.modelApplication.observation.length }}/500)</div>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('close-modals')">Cancelar</button>
                    <button class="btn btn-primary" @click="emit('submitApplicationHiring')">Guardar</button>
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
    max-width: 450px;
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

.info-row {
    display: flex;
    gap: 6px;
    font-size: 15px;
    margin: 4px 0;
    font-weight: 500;
}
</style>