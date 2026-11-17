<script setup>
const requestTypes = [
    {
        title: 'Permisos',
        description:
            'Solicite tiempo para diligencias personales, citas o asuntos especiales.',
        icono: 'M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z'
    },
    {
        title: 'Vacaciones',
        description:
            'Registre y consulte sus periodos de descanso programados.',
        icono: 'M238.25,229A8,8,0,0,1,227,230.25c-.37-.3-38.82-30.25-99-30.25S29.36,230,29,230.26a8,8,0,0,1-10-12.51c1.63-1.3,38.52-30.26,98.29-33.45A119.94,119.94,0,0,1,114,146.37c1.74-21.71,10.92-50.63,43-72.48A64.65,64.65,0,0,0,140.26,72c-19,.62-30.94,11.71-36.5,33.92A8,8,0,0,1,96,112a7.64,7.64,0,0,1-1.94-.24,8,8,0,0,1-5.82-9.7c9.25-36.95,33.11-45.42,51.5-46a81.48,81.48,0,0,1,21.68,2.45c-3.83-6.33-9.43-12.93-17.21-16.25-10-4.24-22.17-2.39-36.31,5.51a8,8,0,0,1-7.8-14c18.74-10.45,35.72-12.54,50.48-6.2,12.49,5.36,20.73,15.78,25.87,25,6.18-9.64,13.88-16.17,22.39-18.94,11.86-3.87,24.64-.72,38,9.37a8,8,0,0,1-9.64,12.76c-8.91-6.73-16.77-9.06-23.35-6.93-7.29,2.35-12.87,10-16.37,16.61A70.46,70.46,0,0,1,208,73.07c14.61,8.35,32,26.05,32,62.94a8,8,0,0,1-16,0c0-23.46-8.07-40-24-49a50.49,50.49,0,0,0-5.75-2.8,55.64,55.64,0,0,1,5.06,33.06,59.41,59.41,0,0,1-8.86,23.41,8,8,0,0,1-13.09-9.2c.74-1.09,16.33-24.38-3.26-49.37-27,15.21-41.89,37.25-44.16,65.59a104.27,104.27,0,0,0,3.83,36.44c62.65,1.81,101.52,32.33,103.2,33.66A8,8,0,0,1,238.25,229ZM24,140a28,28,0,1,1,28,28A28,28,0,0,1,24,140Zm16,0a12,12,0,1,0,12-12A12,12,0,0,0,40,140Z',
    },
    {
        title: 'Cesantías',
        description:
            'Gestione solicitudes relacionadas con el retiro de cesantías.',
        icono: 'M192,116a12,12,0,1,1-12-12A12,12,0,0,1,192,116ZM152,64H112a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm96,48v32a24,24,0,0,1-24,24h-2.36l-16.21,45.38A16,16,0,0,1,190.36,224H177.64a16,16,0,0,1-15.07-10.62L160.65,208h-57.3l-1.92,5.38A16,16,0,0,1,86.36,224H73.64a16,16,0,0,1-15.07-10.62L46,178.22a87.69,87.69,0,0,1-21.44-48.38A16,16,0,0,0,16,144a8,8,0,0,1-16,0,32,32,0,0,1,24.28-31A88.12,88.12,0,0,1,112,32H216a8,8,0,0,1,0,16H194.61a87.93,87.93,0,0,1,30.17,37c.43,1,.85,2,1.25,3A24,24,0,0,1,248,112Zm-16,0a8,8,0,0,0-8-8h-3.66a8,8,0,0,1-7.64-5.6A71.9,71.9,0,0,0,144,48H112A72,72,0,0,0,58.91,168.64a8,8,0,0,1,1.64,2.71L73.64,208H86.36l3.82-10.69A8,8,0,0,1,97.71,192h68.58a8,8,0,0,1,7.53,5.31L177.64,208h12.72l18.11-50.69A8,8,0,0,1,216,152h8a8,8,0,0,0,8-8Z'
    },
    {
        title: 'Incapacidades',
        description:
            'Reporte incapacidades y adjunte la documentación correspondiente.',
        icono: 'M220,160a12,12,0,1,1-12-12A12,12,0,0,1,220,160Zm-4.55,39.29A48.08,48.08,0,0,1,168,240H144a48.05,48.05,0,0,1-48-48V151.49A64,64,0,0,1,40,88V40a8,8,0,0,1,8-8H72a8,8,0,0,1,0,16H56V88a48,48,0,0,0,48.64,48c26.11-.34,47.36-22.25,47.36-48.83V48H136a8,8,0,0,1,0-16h24a8,8,0,0,1,8,8V87.17c0,32.84-24.53,60.29-56,64.31V192a32,32,0,0,0,32,32h24a32.06,32.06,0,0,0,31.22-25,40,40,0,1,1,16.23.27ZM232,160a24,24,0,1,0-24,24A24,24,0,0,0,232,160Z'
    },
    {
        title: 'Licencias',
        description:
            'Solicite licencias laborales según el motivo y las condiciones aplicables.',
        icono: 'M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-48-56a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z'
    },
    // {
    //     title: 'Certificados',
    //     description:
    //         'Solicite certificados laborales y documentos relacionados con su vinculación.',
    //     icono: ''
    // },
    // {
    //     title: 'Memorandos',
    //     description:
    //         'Consulte los memorandos asociados a su historial laboral.',
    //     icono: ''
    // },
    // {
    //     title: 'Descuento de nómina',
    //     description:
    //         'Registre solicitudes de descuento y consulte su información asociada.',
    //     icono: ''
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
        <span class="active">Solicitudes</span>
    </div>

    <div class="container-data">
        <div class="main-container">

            <section class="petition-header card-header">
                <div class="petition-header__accent"></div>

                <div class="petition-header__content">
                    <span class="petition-header__eyebrow">
                        MÓDULO DE SOLICITUDES
                    </span>

                    <h1>Solicitudes disponibles</h1>

                    <p>
                        Conozca las categorías de solicitudes disponibles para los
                        colaboradores.
                    </p>
                </div>

                <div class="petition-header__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M232.49,55.51l-32-32a12,12,0,0,0-17,0l-96,96A12,12,0,0,0,84,128v32a12,12,0,0,0,12,12h32a12,12,0,0,0,8.49-3.51l96-96A12,12,0,0,0,232.49,55.51ZM192,49l15,15L196,75,181,60Zm-69,99H108V133l56-56,15,15Zm105-7.43V208a20,20,0,0,1-20,20H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28h67.43a12,12,0,0,1,0,24H52V204H204V140.57a12,12,0,0,1,24,0Z">
                        </path>
                    </svg>
                </div>
            </section>

            <section class="petition-content">
                <header class="section-heading">
                    <h2>Tipos de solicitud</h2>
                    <p>Información general de cada categoría.</p>
                </header>

                <div class="request-grid">
                    <article v-for="item in requestTypes" :key="item.title" class="request-card">
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