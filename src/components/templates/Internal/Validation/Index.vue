<script setup>
const validationTypes = [
    // {
    //     title: 'Requisición de personal',
    //     description:
    //         'Revisión de las solicitudes asociadas a nuevas necesidades de personal.',
    // },
    // {
    //     title: 'Ingreso de personal',
    //     description:
    //         'Validación de la información requerida durante el proceso de vinculación.',
    // },
    // {
    //     title: 'Afiliaciones',
    //     description:
    //         'Verificación de los procesos relacionados con afiliaciones del colaborador.',
    // },
    // {
    //     title: 'Gestión de contratos',
    //     description:
    //         'Revisión de contratos y documentos asociados a la relación laboral.',
    // },
    {
        title: 'Solicitudes',
        description:
            'Validación de solicitudes laborales registradas por los colaboradores.',
        icono: 'M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM92.69,56l16,16H40V56ZM216,200H40V88H216Zm-88-88a8,8,0,0,1,8,8v16h16a8,8,0,0,1,0,16H136v16a8,8,0,0,1-16,0V152H104a8,8,0,0,1,0-16h16V120A8,8,0,0,1,128,112Z'
    },
    // {
    //     title: 'Entrega de puesto',
    //     description:
    //         'Verificación de la información asociada a la entrega formal del puesto.',
    // },
];
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
        <span class="active">Validación</span>
    </div>

    <div class="container-data">
        <div class="main-container">

            <section class="petition-header card-header">
                <div class="petition-header__accent"></div>

                <div class="petition-header__content">
                    <span class="petition-header__eyebrow">
                        MÓDULO DE VALIDACIÓN
                    </span>

                    <h1>Procesos disponibles para validación</h1>

                    <p>
                        Consulta las categorías de procesos que requieren revisión dentro de Talento Humano.
                    </p>
                </div>

                <div class="petition-header__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" fill="currentColor"
                        viewBox="0 0 256 256">
                        <path
                            d="M228.75,100.05c-3.52-3.67-7.15-7.46-8.34-10.33-1.06-2.56-1.14-7.83-1.21-12.47-.15-10-.34-22.44-9.18-31.27s-21.27-9-31.27-9.18c-4.64-.07-9.91-.15-12.47-1.21-2.87-1.19-6.66-4.82-10.33-8.34C148.87,20.46,140.05,12,128,12s-20.87,8.46-27.95,15.25c-3.67,3.52-7.46,7.15-10.33,8.34-2.56,1.06-7.83,1.14-12.47,1.21C67.25,37,54.81,37.14,46,46S37,67.25,36.8,77.25c-.07,4.64-.15,9.91-1.21,12.47-1.19,2.87-4.82,6.66-8.34,10.33C20.46,107.13,12,116,12,128S20.46,148.87,27.25,156c3.52,3.67,7.15,7.46,8.34,10.33,1.06,2.56,1.14,7.83,1.21,12.47.15,10,.34,22.44,9.18,31.27s21.27,9,31.27,9.18c4.64.07,9.91.15,12.47,1.21,2.87,1.19,6.66,4.82,10.33,8.34C107.13,235.54,116,244,128,244s20.87-8.46,27.95-15.25c3.67-3.52,7.46-7.15,10.33-8.34,2.56-1.06,7.83-1.14,12.47-1.21,10-.15,22.44-.34,31.27-9.18s9-21.27,9.18-31.27c.07-4.64.15-9.91,1.21-12.47,1.19-2.87,4.82-6.66,8.34-10.33C235.54,148.87,244,140.05,244,128S235.54,107.13,228.75,100.05Zm-17.32,39.29c-4.82,5-10.28,10.72-13.19,17.76-2.82,6.8-2.93,14.16-3,21.29-.08,5.36-.19,12.71-2.15,14.66s-9.3,2.07-14.66,2.15c-7.13.11-14.49.22-21.29,3-7,2.91-12.73,8.37-17.76,13.19C135.78,214.84,130.4,220,128,220s-7.78-5.16-11.34-8.57c-5-4.82-10.72-10.28-17.76-13.19-6.8-2.82-14.16-2.93-21.29-3-5.36-.08-12.71-.19-14.66-2.15s-2.07-9.3-2.15-14.66c-.11-7.13-.22-14.49-3-21.29-2.91-7-8.37-12.73-13.19-17.76C41.16,135.78,36,130.4,36,128s5.16-7.78,8.57-11.34c4.82-5,10.28-10.72,13.19-17.76,2.82-6.8,2.93-14.16,3-21.29C60.88,72.25,61,64.9,63,63s9.3-2.07,14.66-2.15c7.13-.11,14.49-.22,21.29-3,7-2.91,12.73-8.37,17.76-13.19C120.22,41.16,125.6,36,128,36s7.78,5.16,11.34,8.57c5,4.82,10.72,10.28,17.76,13.19,6.8,2.82,14.16,2.93,21.29,3,5.36.08,12.71.19,14.66,2.15s2.07,9.3,2.15,14.66c.11,7.13.22,14.49,3,21.29,2.91,7,8.37,12.73,13.19,17.76,3.41,3.56,8.57,8.94,8.57,11.34S214.84,135.78,211.43,139.34ZM176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51Z">
                        </path>
                    </svg>
                </div>
            </section>

            <section class="petition-content">
                <header class="section-heading">
                    <h2>Tipos de validación</h2>
                    <p>Información organizada para cada proceso.</p>
                </header>

                <div class="request-grid">
                    <article v-for="item in validationTypes" :key="item.title" class="request-card">
                        <div class="request_flex">
                            <div class="request-card__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path :d="item.icono">
                                    </path>
                                </svg>
                            </div>
                            <h3>{{ item.title }}</h3>
                        </div>


                        <p>{{ item.description }}</p>
                    </article>
                </div>

            </section>
        </div>
    </div>

</template>
<style scoped>
.petition-page {
    min-height: 100vh;
    padding: 14px 20px 28px;
    background: #f9f7fd;
    box-sizing: border-box;
    font-family: Poppins, sans-serif;
}

.petition-header {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 128px;
    padding: 24px 150px 24px 48px;
    overflow: hidden;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 18px rgba(46, 33, 77, 0.05);
}

.card-header {
    background: #ffffff;
    border: 1px solid #e8e3f2;
    border-radius: 14px;
    box-shadow: 0 4px 14px rgba(43, 31, 71, 0.04);
    box-sizing: border-box;
    transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
}

.petition-header__accent {
    position: absolute;
    top: 32px;
    bottom: 32px;
    left: 24px;
    width: 5px;
    background: #5738d6;
    border-radius: 3px;
}

.petition-header__content {
    min-width: 0;
}

.petition-header__eyebrow {
    display: block;
    margin-bottom: 7px;
    color: #5738d6;
    font-size: 10px;
    font-weight: 600;
}

.petition-header h1 {
    margin: 0;
    color: #1a1721;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
}

.petition-header p {
    margin: 7px 0 0;
    color: #6e697a;
    font-size: 12px;
    line-height: 1.6;
}

.petition-header__icon {
    position: absolute;
    top: 16px;
    right: 24px;
    display: grid;
    width: 96px;
    height: 96px;
    color: #5738d6;
    background: #f1ecff;
    border-radius: 50%;
    place-items: center;
}

.petition-content {
    margin-top: 30px;
}

.section-heading h2 {
    margin: 0;
    color: #1a1721;
    font-size: 16px;
    font-weight: 600;
}

.section-heading p {
    margin: 4px 0 0;
    color: #6e697a;
    font-size: 11px;
}

.request-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px 20px;
    margin-top: 24px;
}

.request-card {
    padding: 16px;
    background: #ffffff;
    border: 1px solid #e8e3f2;
    border-radius: 14px;
    box-shadow: 0 4px 14px rgba(43, 31, 71, 0.04);
    box-sizing: border-box;
    transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
}

.request-card:hover {
    border-color: rgba(87, 56, 214, 0.28);
    box-shadow: 0 10px 24px rgba(43, 31, 71, 0.08);
    transform: translateY(-3px);
}

.request-card__icon {
    display: grid;
    width: 46px;
    height: 46px;
    color: #5738d6;
    background: #f2edff;
    border-radius: 50%;
    place-items: center;
}

.request_flex {
    display: flex;
    align-items: center;
    gap: 10px;
}

.request-card h3 {
    color: #211f29;
    font-size: 14px;
    font-weight: 600;
}

.request-card p {
    max-width: 280px;
    margin: 10px 0 0;
    color: #757082;
    font-size: 11px;
    line-height: 1.7;
}

@media (max-width: 1150px) {
    .request-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 700px) {
    .petition-page {
        padding: 12px;
    }

    .petition-header {
        padding: 24px 28px 24px 46px;
    }

    .petition-header__icon {
        display: none;
    }

    .request-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .request-card {
        min-height: 180px;
    }
}
</style>