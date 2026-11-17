<script setup>
import { onMounted, onUnmounted } from "vue"

const props = defineProps({
    modelHeadquarter: Object,
    departaments: Array,
    cities: Array,
    errors: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:modelHeadquarter', 'closeModals', 'submitHeadquarterStore']);

onMounted(() => document.body.style.overflow = "hidden")
onUnmounted(() => document.body.style.overflow = "")
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-box">

                <!-- HEADER -->
                <div class="modal-header">
                    <h1 class="modal-title">Crear sede</h1>
                </div>

                <!-- BODY (dos columnas como en la imagen) -->
                <section class="modal-body">
                    <div class="info">
                        Todos los campos son requeridos
                    </div>
                    <div class="content-container">

                        <!-- 2x2 -->
                        <div class="grid-top">
                            <div>
                                <label class="label-bold" for="name">Nombre</label>
                                <input type="text" v-model="props.modelHeadquarter.name" name="name" id="name"
                                    class="input-box" placeholder="Nombre" minlength="1" maxlength="80"
                                    :class="{ 'input-error': props.errors?.headquarter_name }">
                                <p v-for="(msg, i) in props.errors?.headquarter_name ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Departamento</label>
                                <SearchSelect v-model="props.modelHeadquarter.departament_id"
                                    :options="props.departaments" optionKey="name" valueKey="id" name="departament_id"
                                    id="departament_id" placeholder="Departamento"
                                    :error="!props.modelHeadquarter.departament_id && props.errors?.headquarter_city_id" />
                                <template
                                    v-if="!props.modelHeadquarter.departament_id && props.errors?.headquarter_city_id">
                                    <p v-for="(msg, i) in props.errors?.headquarter_city_id ?? []" :key="'type-' + i"
                                        class="error-text">
                                        {{ msg }}
                                    </p>
                                </template>
                            </div>

                            <div class="input-group">
                                <label class="label-bold">Ciudad</label>
                                <SearchSelect v-model="props.modelHeadquarter.city_id" :options="props.cities"
                                    optionKey="name" valueKey="id" name="city_id" id="city_id" placeholder="Ciudad"
                                    :error="props.errors?.headquarter_city_id" />
                                <p v-for="(msg, i) in props.errors?.headquarter_city_id ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>

                            <div>
                                <label class="label-bold" for="address">Dirección</label>
                                <input type="text" v-model="props.modelHeadquarter.address" name="address" id="address"
                                    class="input-box" placeholder="Dirección" minlength="1" maxlength="110"
                                    :class="{ 'input-error': props.errors?.headquarter_address }">
                                <p v-for="(msg, i) in props.errors?.headquarter_address ?? []" :key="'type-' + i"
                                    class="error-text">
                                    {{ msg }}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                <!-- FOOTER -->
                <footer class="modal-footer">
                    <button class="btn btn-secondary" @click="emit('closeModals')">Cancelar</button>
                    <button class="btn btn-primary"
                        @click="emit('submitHeadquarterStore', props.modelHeadquarter)">Guardar</button>
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

/* bloque superior: 2x2 */
.grid-top {
    display: grid;
    gap: 7px;
}

/* filas que deben ocupar todo el ancho (textarea, separador, etc.) */
.row-span-2 {
    grid-column: 1 / -1;
}

/* bloque posterior al hr en una sola columna */
.post-hr {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
}

/* Evita alturas fijas dentro del body */
.content-container {
    display: grid;
    gap: 10px;
}

/* Caja del modal: crece con contenido hasta un tope y luego scroll en body */
.modal-box {
    background: linear-gradient(180deg, #EAE6FF 0%, #EFECFF 3.6%, #F5F3FF 7.35%, #F9F8FF 11.48%, #FFF 14.97%, #FFF 60.05%, #FFF 100%);
    border-radius: 10px;
    border: 0.5px solid var(--Font-Color-palet-color1-Gris, #CFCECE);
    max-width: 500px;
    width: 90vw;
    height: 100%;
    max-height: 800px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>