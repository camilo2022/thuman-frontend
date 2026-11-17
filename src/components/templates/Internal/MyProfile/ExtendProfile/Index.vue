<script setup>

const props = defineProps({
    welfareEdit: Boolean,
    errors: {
        type: Object,
        default: () => ({}),
    }
})

const emit = defineEmits(['welfareStatusEdting', 'submitwelfareUpdate']);
</script>
<template>
    <div class="breadcrumb">
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
        <span class="active">Datos adicionales</span>
    </div>
    <div class="container-data">
        <div class="main-container">
            <!-- TÍTULO -->
            <h2 class="titulo">Datos adicionales</h2>

            <div class="auth-form">
                <div class="auth-form-header">
                    <h2>
                        Bienestar
                        <svg xmlns="http://www.w3.org/2000/svg" class="edit-form-body" width="18" height="18"
                            fill="#5b4cd0" viewBox="0 0 256 256" @click="emit('welfareStatusEdting')">
                            <path
                                d="M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM93,180l71-71,11,11-71,71ZM76,163,65,152l71-71,11,11ZM52,173l15.51,15.51h0L83,204H52ZM192,103,153,64l18.34-18.34,39,39Z">
                            </path>
                        </svg>
                    </h2>
                </div>
                <div class="auth-form-body">
                    <ul class="custom-list">
                        <li>
                            <h4>Dotación</h4>
                        </li>
                        <div class="form-row" v-if="props.welfareEdit">
                            <div class="form-group">
                                <label class="label-bold" for="person">Tipo de dotación</label>
                                <SearchSelect :options="[]" optionKey="name" valueKey="id" placeholder="Seleccionar" />
                            </div>
                            <div class="form-group">
                                <label class="label-bold" for="shirt">Camisa</label>
                                <SearchSelect :options="[]" optionKey="name" valueKey="id" placeholder="Seleccionar" />
                            </div>
                            <div class="form-group">
                                <label class="label-bold" for="short">Pantalón</label>
                                <SearchSelect :options="[]" optionKey="name" valueKey="id" placeholder="Seleccionar" />
                            </div>
                            <div class="form-group">
                                <label class="label-bold" for="sneaker">Zapatos</label>
                                <SearchSelect :options="[]" optionKey="name" valueKey="id" placeholder="Seleccionar" />
                            </div>
                        </div>
                        <div class="form-group" v-else>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M221.29,131.34,176.17,80.19A36,36,0,0,0,150.55,68a36,36,0,1,0-45.1,0A36,36,0,0,0,79.83,80.19L34.71,131.34a24,24,0,0,0,33.7,34.16l6.73-5.39L61.74,211a24,24,0,0,0,43.74,19.69L128,191.9l22.52,38.79a23.82,23.82,0,0,0,13.27,11.85A24,24,0,0,0,194.26,211l-13.4-50.89,6.73,5.39a24,24,0,0,0,33.7-34.16ZM128,28a12,12,0,1,1-12,12A12,12,0,0,1,128,28Zm75,119.12-35.52-28.49a12,12,0,0,0-19.11,12.42L171.27,218a12.18,12.18,0,0,0,.73,2,10.72,10.72,0,0,0-.5-1L138.38,162a12,12,0,0,0-20.76,0L84.5,219a10.72,10.72,0,0,0-.5,1,13.16,13.16,0,0,0,.73-2l22.87-86.92a12,12,0,0,0-19.11-12.42L53,147.12a11.5,11.5,0,0,0-1,.87c.18-.17.35-.36.52-.54L97.83,96.06a12,12,0,0,1,9-4.06h42.34a12,12,0,0,1,9,4.06l45.32,51.39c.17.18.34.37.52.54A11.5,11.5,0,0,0,203,147.12Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    Femenina
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M200,36H177L164.49,23.51h0A12,12,0,0,0,156,20H100a12,12,0,0,0-8.49,3.51h0L79,36H56A20,20,0,0,0,36,56V208a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V56A20,20,0,0,0,200,36ZM96,53l7.33-7.33L118.82,72.2,96,94.48ZM137.18,72.2l15.49-26.56L160,53V94.48ZM60,60H72v44a20,20,0,0,0,34.08,14.21L116,108.5V204H60ZM196,204H140V108.5l9.92,9.69A20,20,0,0,0,184,104V60h12Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    M
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M227.85,213.52l-22-176A20,20,0,0,0,186,20H70A20,20,0,0,0,50.15,37.52l-22,176A20,20,0,0,0,48,236H88.69A19.94,19.94,0,0,0,108.07,221l19.93-77,19.91,76.94A20,20,0,0,0,167.31,236H208a20,20,0,0,0,19.85-22.48ZM182.47,44l2,16H71.53l2-16ZM85.6,212H52.53l11.2-89.6A44.11,44.11,0,0,0,95.81,84H116V94.47Zm84.81,0L140,94.47V84h20.19a44.09,44.09,0,0,0,32.08,38.39L203.47,212Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    32
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M255.8,162.93l0-.31A43.94,43.94,0,0,0,226,125.36l-56.62-20.2-.24-.09a20,20,0,0,1-11.92-10.78L134.06,40l-.06-.16A20.06,20.06,0,0,0,108.89,29.2L33.17,56.73A20.07,20.07,0,0,0,20,75.53V192a20,20,0,0,0,20,20H236a20,20,0,0,0,20-20V167.06C256,165.67,255.93,164.3,255.8,162.93ZM113.53,53.05l6,14L103.9,72.72a12,12,0,1,0,8.2,22.55L129,89.14l4.54,10.63-13.6,5A12,12,0,0,0,124,128a11.79,11.79,0,0,0,4.1-.73l19.57-7.11a43.86,43.86,0,0,0,13.8,7.64L218.09,148l.23.08a19.89,19.89,0,0,1,6.84,3.91H44V78.33ZM44,188V176H232v12Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    35
                                </p>
                            </div>
                        </div>
                        <template v-if="props.welfareEdit">
                            <hr class="separadores">
                        </template>
                        <li>
                            <h4>Seguridad y salud en el trabajo</h4>
                        </li>
                        <div v-if="props.welfareEdit">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="label-bold" for="first_name">Entidad financiera</label>
                                    <input class="input-box disabled" type="text" placeholder="Entidad financiera"
                                        minlength="1" maxlength="25" disabled />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold" for="second_name">Fondo de pensión</label>
                                    <input class="input-box disabled" type="text" placeholder="Fondo de pensión"
                                        minlength="1" maxlength="25" disabled />
                                </div>

                                <div class="form-group">
                                    <label class="label-bold" for="first_last_name">Sistema de salud</label>
                                    <input class="input-box disabled" type="text" placeholder="Sistema de salud"
                                        minlength="1" maxlength="25" disabled />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold" for="second_last_name">Caja de compesación
                                        familiar</label>
                                    <input class="input-box disabled" type="text" id="second_last_name"
                                        placeholder="Caja de compesación familiar" minlength="1" maxlength="25"
                                        disabled />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold">Administradora de riesgos laborales</label>
                                    <input class="input-box disabled" type="text" id="second_name"
                                        placeholder="Administradora de riesgos laborales" minlength="1" maxlength="25"
                                        disabled />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M24,108H44v48H32a12,12,0,0,0,0,24H224a12,12,0,0,0,0-24H212V108h20a12,12,0,0,0,6.29-22.22l-104-64a12,12,0,0,0-12.58,0l-104,64A12,12,0,0,0,24,108Zm44,0H92v48H68Zm72,0v48H116V108Zm48,48H164V108h24ZM128,46.09,189.6,84H66.4ZM252,208a12,12,0,0,1-12,12H16a12,12,0,0,1,0-24H240A12,12,0,0,1,252,208Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    Davivienda
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M232.76,137.88A28.39,28.39,0,0,0,208.13,133L172,141.26c0-.42,0-.84,0-1.26a32,32,0,0,0-32-32H89.94a35.76,35.76,0,0,0-25.45,10.54L43,140H20A20,20,0,0,0,0,160v40a20,20,0,0,0,20,20H120a11.89,11.89,0,0,0,2.91-.36l64-16a11.4,11.4,0,0,0,1.79-.6l38.82-16.54c.23-.09.45-.19.67-.3a28.61,28.61,0,0,0,4.57-48.32ZM36,196H24V164H36Zm181.68-31.39-37.51,16L118.52,196H60V157l21.46-21.46A11.93,11.93,0,0,1,89.94,132H140a8,8,0,0,1,0,16H112a12,12,0,0,0,0,24h32a12.19,12.19,0,0,0,2.69-.3l67-15.41.47-.12a4.61,4.61,0,0,1,5.82,4.44A4.58,4.58,0,0,1,217.68,164.61ZM164,100a40.36,40.36,0,0,0,5.18-.34,40,40,0,1,0,29.67-59.32A40,40,0,1,0,164,100Zm40-36a16,16,0,1,1-16,16A16,16,0,0,1,204,64ZM164,44a16,16,0,0,1,12.94,6.58A39.9,39.9,0,0,0,164.2,76H164a16,16,0,0,1,0-32Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    Colpensiones
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M244,204h-4V128a20,20,0,0,0-20-20H172V48a20,20,0,0,0-20-20H56A20,20,0,0,0,36,48V204H32a12,12,0,0,0,0,24H244a12,12,0,0,0,0-24Zm-28-72v72H172V132ZM60,52h88V204H136V160a12,12,0,0,0-12-12H84a12,12,0,0,0-12,12v44H60Zm52,152H96V172h16ZM72,96A12,12,0,0,1,84,84h8V76a12,12,0,0,1,24,0v8h8a12,12,0,0,1,0,24h-8v8a12,12,0,0,1-24,0v-8H84A12,12,0,0,1,72,96Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    Nueva eps
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M184,36H72A60.07,60.07,0,0,0,12,96v96a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V96A60.07,60.07,0,0,0,184,36Zm36,60v4H192V60.91A36.05,36.05,0,0,1,220,96Zm-92,60a12,12,0,0,0,12-12V124h28v64H88V124h28v20A12,12,0,0,0,128,156Zm12-56V96a12,12,0,0,0-24,0v4H88V60h80v40ZM64,60.91V100H36V96A36.05,36.05,0,0,1,64,60.91ZM36,124H64v64H36Zm156,64V124h28v64Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    Confanorte
                                </p>
                            </div>
                            <div class="data-icons">
                                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                    fill="#000000" viewBox="0 0 256 256">
                                    <path
                                        d="M228,148.4V136a100.41,100.41,0,0,0-64-93.3V40a20,20,0,0,0-20-20H112A20,20,0,0,0,92,40v2.7A100.41,100.41,0,0,0,28,136v12.4A20,20,0,0,0,12,168v24a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V168A20,20,0,0,0,228,148.4ZM204,136v12H164V69.07A76.35,76.35,0,0,1,204,136ZM140,44V148H116V44ZM92,69.07V148H52V136A76.35,76.35,0,0,1,92,69.07ZM220,188H36V172H220Z">
                                    </path>
                                </svg>
                                <p class="text">
                                    AXA colpatria
                                </p>
                            </div>
                        </div>
                        <template v-if="props.welfareEdit">
                            <hr class="separadores">
                        </template>
                        <li>
                            <h4>Contacto de emergencia</h4>
                        </li>
                        <div v-if="props.welfareEdit">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="label-bold">Primer nombre</label>
                                    <input class="input-box" type="text" placeholder="Primer nombre" minlength="1"
                                        maxlength="25" />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold">Segundo nombre (Opcional)</label>
                                    <input class="input-box" type="text" placeholder="Segundo nombre" minlength="1"
                                        maxlength="25" />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold">Primer apellido</label>
                                    <input class="input-box" type="text" placeholder="Primer apellido" minlength="1"
                                        maxlength="25" />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold">Segundo apellido (Opcional)</label>
                                    <input class="input-box" type="text" placeholder="Segundo apellido" minlength="1"
                                        maxlength="25" />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold">Estado civil</label>
                                    <SearchSelect :options="[]" optionKey="name" valueKey="id"
                                        placeholder="Seleccionar" />
                                </div>
                                <div class="form-group">
                                    <label class="label-bold">Género</label>
                                    <SearchSelect :options="[]" optionKey="name" valueKey="id"
                                        placeholder="Seleccionar" />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p class="text">
                                Steffany Valeria Borrego Machado
                            </p>
                            <p class="text">
                                Convive con el colaborador
                            </p>
                            <p class="text">
                                Hermana
                            </p>
                        </div>
                        <div class="form-buttons" v-if="props.welfareEdit">
                            <button class="btn-secondary" @click="emit('welfareStatusEdting')">Cancelar</button>
                            <button class="btn-primary" @click="emit('submitwelfareUpdate')">Guardar</button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    fill: #5B4CD0;
}

.auth-form {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0px 4px 4px rgba(151, 71, 255, 0.16);
    padding: 30px 30px 25px;
    margin-bottom: 15px;

    display: grid;
    grid-template-columns: 180px 1fr;
    align-items: start;
}

.auth-form-header {
    padding-right: 0;
}

.auth-form-header h2 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin: 0;
    color: #3e32bf;
    font-size: 19px;
    font-weight: 700;
}

.edit-form-body {
    cursor: pointer;
}

.auth-form-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

/* =========================
   Textos
   ========================= */
.text {
    margin: 0 !important;
}

.form-group p {
    font-size: 14px;
}

.form-group label {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 5px;
}

/* =========================
   Listas (custom-list)
   ========================= */
.custom-list {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

/* encabezados (li) */
.custom-list>li {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* bullet custom */
.custom-list>li::before {
    content: "";
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><circle cx='5' cy='5' r='2' fill='%235b4cd0'/></svg>");
    background-repeat: no-repeat;
    background-size: contain;
}

/* sangría del contenido que viene después del li */
.custom-list> :not(li) {
    padding-left: 28px;
    /* 18 icon + 10 gap */
}

/* h4 de sección */
.custom-list h4 {
    margin: 0;
    font-size: 18px;
    color: #5b4cd0;
    font-weight: 600;
    display: block;
}

/* =========================
   Forms / inputs
   ========================= */
.form-row,
.form-row-view {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.text-area {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: vertical;
}

.char-limit {
    text-align: right;
    font-size: 0.75rem;
    color: #666;
    margin-top: 4px;
}

/* focus/hover */
input:hover,
input:focus,
select:hover,
select:focus,
textarea:hover,
textarea:focus {
    border-color: #5b4cd0;
    outline: none;
}

/* =========================
   Dual input (prefijo + teléfono)
   ========================= */
.dual-input {
    --left-width: clamp(140px, 32%, 240px);

    display: flex;
    width: 100%;
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    background: #fff;
    align-items: stretch;
    height: 37px;
}

:deep(.dual-input .select-duo) {
    flex: 0 1 var(--left-width);
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.dual-input .input-box {
    flex: 1;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

/* =========================
   Errores (dual-errors)
   ========================= */
.dual-errors {
    --left-width: clamp(140px, 32%, 240px);

    display: grid;
    grid-template-columns: var(--left-width) 1fr;
    row-gap: 2px;

    width: 100%;
    margin-top: 4px;
}

.dual-errors .error-col:first-child {
    grid-column: 1;
}

.dual-errors .error-col:last-child {
    grid-column: 2;
}

.dual-errors .error-text {
    margin: 0;
    line-height: 1.3;
}

/* =========================
   Responsive
   ========================= */
@media (max-width: 1024px) {
    .auth-form {
        grid-template-columns: 1fr !important;
        padding: 0 16px;
    }

    .auth-form-header {
        width: 100%;
    }

    .form-group {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .auth-form-header h2 {
        font-size: 14px;
    }

    .form-group label {
        font-size: 11px;
    }

    .text-area,
    .input-box {
        font-size: 13px;
    }
}

.data-icons {
    display: flex;
    justify-content: start;
    gap: 5px;
    margin-bottom: 1px;
}

.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

@media (max-width: 1140px) {
    .form-row {
        grid-template-columns: repeat(2, 1fr);
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .custom-list> :not(li) {
        padding-left: 0px;
        /* 18 icon + 10 gap */
    }
}

@media (max-width: 630px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}

.separadores {
    margin: 0;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #E3DFFF;
    width: 100%;
}
</style>