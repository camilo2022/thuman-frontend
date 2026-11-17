<script setup>
const configurationTypes = [
    {
        title: 'Estructura organizacional',
        description:
            'Empresas, sedes, áreas y cargos que conforman la organización.',
    },
    {
        title: 'Personas y perfiles',
        description:
            'Documentos, niveles educativos, profesiones y datos maestros del personal.',
    },
    {
        title: 'Contratación y afiliaciones',
        description:
            'Tipos de contrato y entidades relacionadas con seguridad social.',
    },
    {
        title: 'Solicitudes y novedades',
        description:
            'Categorías utilizadas para permisos, licencias y demás solicitudes.',
    },
    {
        title: 'Bienestar y relaciones laborales',
        description:
            'Parámetros de apoyo para los procesos de bienestar y gestión laboral.',
    },
    {
        title: 'Dotación y elementos',
        description:
            'Tipos de dotación y elementos definidos para su posterior entrega.',
    },
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
        <span class="active">Configuración</span>
    </div>

    <div class="container-data">
        <div class="main-container">

            <section class="petition-header card-header">
                <div class="petition-header__accent"></div>

                <div class="petition-header__content">
                    <span class="petition-header__eyebrow">
                        MÓDULO DE CONFIGURACIÓN
                    </span>

                    <h1>Parámetros generales</h1>

                    <p>
                        Consulta la organización de los elementos que permiten adaptar el sistema a las necesidades de la empresa.
                    </p>
                </div>

                <div class="petition-header__icon">
                    <!-- Agrega aquí el icono principal -->
                </div>
            </section>

            <section class="petition-content">
                <header class="section-heading">
                    <h2>Categorías de configuración</h2>
                    <p>Parámetros organizados por su ambito de aplicación.</p>
                </header>

                <div class="request-grid">
                    <article v-for="item in configurationTypes" :key="item.title" class="request-card">
                        <div class="request_flex">
                            <div class="request-card__icon">
                                <!-- Agrega aquí el icono de cada tarjeta -->
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