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
        <span class="active">Home</span>
    </div>
    <div class="container-data">
        <main class="home-page">
            <section v-if="true" class="welcome-card">
                <div class="welcome-decoration welcome-decoration--top"></div>
                <div class="welcome-decoration welcome-decoration--bottom"></div>

                <!-- Contenido -->
                <div class="welcome-content">
                    <div class="welcome-content__line"></div>

                    <span class="welcome-content__label">
                        TALENTO HUMANO
                    </span>

                    <h1>Bienvenido a T-HÜMAN</h1>

                    <p class="welcome-content__description">
                        Un espacio creado para acompañar a las personas y fortalecer la
                        cultura de nuestra organización.
                    </p>

                    <p class="welcome-content__secondary">
                        Aquí comienza una experiencia más cercana, clara y humana.
                    </p>
                </div>

                <!-- Ilustración -->
                <div class="welcome-illustration" aria-hidden="true">
                    <div class="illustration-glow"></div>

                    <svg class="team-scene" viewBox="0 0 620 470" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="purpleShirt" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#7855E6" />
                                <stop offset="100%" stop-color="#5634C7" />
                            </linearGradient>

                            <linearGradient id="backgroundCircle" x1="100" y1="30" x2="490" y2="390"
                                gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#F6F0FF" />
                                <stop offset="100%" stop-color="#E9DFFF" />
                            </linearGradient>

                            <filter id="sceneShadow" x="-30%" y="-30%" width="160%" height="180%">
                                <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#503989"
                                    flood-opacity="0.10" />
                            </filter>
                        </defs>

                        <!-- Fondo -->
                        <path d="
    M105 200
    C105 105 200 28 350 28
    C510 28 605 102 605 200
    C605 292 512 338 355 338
    C195 338 105 298 105 200
    Z
  " fill="url(#backgroundCircle)" />

                        <!-- Mensaje -->
                        <g filter="url(#sceneShadow)">
                            <rect x="206" y="49" width="104" height="58" rx="17" fill="#FFFFFF" />

                            <path d="M236 107 224 121 226 104Z" fill="#FFFFFF" />

                            <circle cx="239" cy="78" r="5" fill="#7956E5" />
                            <circle cx="258" cy="78" r="5" fill="#AA91EE" />
                            <circle cx="277" cy="78" r="5" fill="#C8B8F5" />
                        </g>

                        <!-- Tarjeta -->
                        <g filter="url(#sceneShadow)">
                            <rect x="415" y="53" width="108" height="78" rx="18" fill="#FFFFFF" />

                            <rect x="435" y="75" width="55" height="7" rx="3.5" fill="#7652E1" />

                            <rect x="435" y="93" width="70" height="6" rx="3" fill="#B8A6ED" />

                            <rect x="435" y="110" width="48" height="6" rx="3" fill="#D5C9F6" />

                            <circle cx="499" cy="112" r="14" fill="#EFEAFF" />

                            <path d="m493 112 4 4 8-10" fill="none" stroke="#6742D4" stroke-width="3"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </g>

                        <!-- Persona izquierda -->
                        <g>
                            <path d="
                M219 182
                C219 138 244 111 283 111
                C321 111 347 138 347 182
                L347 201
                L219 201
                Z
              " fill="#34204F" />

                            <ellipse cx="283" cy="186" rx="57" ry="65" fill="#D58D59" />

                            <path d="
                M227 171
                C233 130 256 109 283 109
                C312 109 338 130 344 171
                C325 164 305 149 284 126
                C264 151 246 164 227 171
                Z
              " fill="#34204F" />

                            <circle cx="264" cy="187" r="4" fill="#35233F" />
                            <circle cx="303" cy="187" r="4" fill="#35233F" />

                            <path d="M272 209 C280 216 289 216 297 209" fill="none" stroke="#8E4D43" stroke-width="3.5"
                                stroke-linecap="round" />

                            <rect x="274" y="238" width="20" height="27" rx="9" fill="#C57B4E" />

                            <path d="
                M228 272
                C243 251 261 242 283 242
                C306 242 326 252 339 272
                C348 291 352 316 351 345
                L214 345
                C214 317 218 291 228 272
                Z
              " fill="url(#purpleShirt)" />

                            <path d="
                M229 282
                C212 298 205 319 209 343
              " fill="none" stroke="#6040CF" stroke-width="18" stroke-linecap="round" />

                            <circle cx="282" cy="334" r="11" fill="#D58D59" />
                        </g>

                        <!-- Persona derecha -->
                        <g>
                            <path d="
                M372 182
                C372 138 397 111 436 111
                C474 111 500 138 500 182
                L500 201
                L372 201
                Z
              " fill="#34204F" />

                            <ellipse cx="436" cy="186" rx="57" ry="65" fill="#B76E43" />

                            <path d="
                M380 171
                C386 130 409 109 436 109
                C465 109 491 130 497 171
                C478 164 458 149 437 126
                C417 151 399 164 380 171
                Z
              " fill="#34204F" />

                            <circle cx="417" cy="187" r="4" fill="#35233F" />
                            <circle cx="456" cy="187" r="4" fill="#35233F" />

                            <path d="M425 209 C433 216 442 216 450 209" fill="none" stroke="#7A4036" stroke-width="3.5"
                                stroke-linecap="round" />

                            <rect x="427" y="238" width="20" height="27" rx="9" fill="#A95E3C" />

                            <path d="
                M383 272
                C399 251 418 242 436 242
                C459 242 479 252 492 272
                C500 292 505 317 504 345
                L367 345
                C367 317 373 292 383 272
                Z
              " fill="#FFFFFF" />

                            <path d="
                M392 284
                C417 264 448 252 481 253
                C490 258 496 264 501 272
                C472 283 444 299 417 322
                Z
              " fill="#F1EDFF" />

                            <circle cx="436" cy="334" r="11" fill="#B76E43" />
                        </g>

                        <!-- Portátil -->
                        <g>
                            <rect x="318" y="276" width="92" height="68" rx="8" fill="#3B225F" />

                            <rect x="327" y="285" width="74" height="49" rx="4" fill="#FFFFFF" />

                            <path d="M309 343H420L411 354H318Z" fill="#2F194F" />
                        </g>

                        <!-- Mesa -->
                        <rect x="179" y="339" width="351" height="18" rx="9" fill="#51328C" />

                        <rect x="196" y="354" width="10" height="50" rx="5" fill="#C2ADEF" />

                        <rect x="504" y="354" width="10" height="50" rx="5" fill="#C2ADEF" />

                        <path d="M195 404 C275 390 412 390 514 404" fill="none" stroke="#D2C1F4" stroke-width="8"
                            stroke-linecap="round" />

                        <ellipse cx="354" cy="444" rx="195" ry="17" fill="#5738D6" opacity="0.07" />
                    </svg>
                </div>
            </section>
            <section v-else class="main-container">
                <!-- Encabezado -->
                <header class="home-header">
                    <div>
                        <h1>Bienvenido a T-HÜMAN</h1>

                        <p>
                            Gestione de manera centralizada los procesos y novedades de
                            Talento Humano.
                        </p>
                    </div>

                    <div class="date-badge">
                        <i class="fa-regular fa-calendar"></i>
                        {{ currentDate }}
                    </div>
                </header>

                <!-- Indicadores -->
                <section class="stats-grid">
                    <article v-for="stat in stats" :key="stat.label" class="stat-card">
                        <div class="stat-card__main">
                            <div class="stat-card__icon">
                                <i :class="stat.icon"></i>
                            </div>

                            <div>
                                <strong>{{ stat.value }}</strong>
                                <span>{{ stat.label }}</span>
                            </div>
                        </div>

                        <p>{{ stat.detail }}</p>
                    </article>
                </section>

                <!-- Accesos rápidos -->
                <section class="quick-section">
                    <h2>Accesos rápidos</h2>

                    <div class="quick-grid">
                        <button v-for="access in quickAccess" :key="access.title" type="button" class="quick-card"
                            @click="navigateTo(access.route)">
                            <span class="quick-card__icon">
                                <i :class="access.icon"></i>
                            </span>

                            <span class="quick-card__content">
                                <strong>{{ access.title }}</strong>
                                <small>{{ access.description }}</small>
                            </span>

                            <i class="fa-solid fa-chevron-right quick-card__arrow"></i>
                        </button>
                    </div>
                </section>

                <!-- Panel inferior -->
                <section class="dashboard-grid">
                    <!-- Solicitudes pendientes -->
                    <article class="dashboard-card requests-card">
                        <header class="card-header">
                            <div>
                                <span class="card-header__eyebrow">GESTIÓN</span>
                                <h2>Solicitudes pendientes</h2>
                            </div>

                            <button type="button" class="text-button">
                                Ver todas
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </header>

                        <div class="requests-list">
                            <article v-for="request in pendingRequests" :key="`${request.type}-${request.employee}`"
                                class="request-item">
                                <div class="request-item__icon">
                                    <i :class="request.icon"></i>
                                </div>

                                <div class="request-item__info">
                                    <strong>{{ request.type }}</strong>
                                    <span>{{ request.employee }}</span>
                                </div>

                                <time>{{ request.date }}</time>

                                <span class="status-badge" :class="`status-badge--${request.statusType}`">
                                    {{ request.status }}
                                </span>
                            </article>
                        </div>
                    </article>

                    <!-- Cumpleaños ampliados -->
                    <article class="dashboard-card birthday-card">
                        <header class="card-header birthday-card__header">
                            <div>
                                <span class="card-header__eyebrow">CELEBRACIONES</span>
                                <h2>Cumpleaños próximos</h2>
                            </div>

                            <div class="birthday-card__icon">
                                <i class="fa-solid fa-cake-candles"></i>
                            </div>
                        </header>

                        <div class="birthday-card__featured">
                            <div class="birthday-card__featured-avatar">
                                {{ getInitials(birthdays[0]?.name) }}
                            </div>

                            <div>
                                <span>Próximo cumpleaños</span>
                                <strong>{{ birthdays[0]?.name }}</strong>
                                <small>{{ birthdays[0]?.date }}</small>
                            </div>
                        </div>

                        <div class="birthday-list">
                            <article v-for="birthday in birthdays" :key="birthday.name" class="birthday-item">
                                <div class="birthday-item__avatar">
                                    {{ getInitials(birthday.name) }}
                                </div>

                                <div class="birthday-item__info">
                                    <strong>{{ birthday.name }}</strong>
                                    <span>{{ birthday.position }}</span>
                                </div>

                                <div class="birthday-item__date">
                                    <strong>{{ birthday.day }}</strong>
                                    <span>{{ birthday.month }}</span>
                                </div>
                            </article>
                        </div>

                        <footer class="birthday-card__footer">
                            <i class="fa-solid fa-gift"></i>

                            <p>
                                Hay <strong>{{ birthdays.length }} cumpleaños</strong>
                                próximos para celebrar.
                            </p>
                        </footer>
                    </article>
                </section>
            </section>
        </main>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const stats = [
    {
        value: 286,
        label: "Empleados activos",
        detail: "Personas vinculadas",
        icon: "fa-solid fa-users",
    },
    {
        value: 18,
        label: "Solicitudes pendientes",
        detail: "6 requieren atención",
        icon: "fa-regular fa-clipboard",
    },
    {
        value: 7,
        label: "Ausencias de hoy",
        detail: "3 incapacidades",
        icon: "fa-regular fa-calendar-xmark",
    },
    {
        value: 12,
        label: "Cumpleaños del mes",
        detail: "2 esta semana",
        icon: "fa-solid fa-cake-candles",
    },
];

const quickAccess = [
    {
        title: "Requisición de personal",
        description: "Crear o consultar requisiciones",
        icon: "fa-solid fa-user-plus",
        route: "/recruitment/requisitions",
    },
    {
        title: "Vacantes",
        description: "Gestionar vacantes disponibles",
        icon: "fa-solid fa-magnifying-glass",
        route: "/recruitment/vacancies",
    },
    {
        title: "Solicitudes",
        description: "Revisar novedades y solicitudes",
        icon: "fa-regular fa-clipboard",
        route: "/requests",
    },
    {
        title: "Configuración",
        description: "Administrar parámetros del sistema",
        icon: "fa-solid fa-gear",
        route: "/settings",
    },
];

const pendingRequests = [
    {
        type: "Vacaciones",
        employee: "Carlos Rodríguez",
        date: "24 jul 2026",
        status: "Pendiente",
        statusType: "pending",
        icon: "fa-solid fa-umbrella-beach",
    },
    {
        type: "Incapacidad",
        employee: "Laura Gómez",
        date: "24 jul 2026",
        status: "Por validar",
        statusType: "pending",
        icon: "fa-solid fa-notes-medical",
    },
    {
        type: "Permiso laboral",
        employee: "Andrés Pérez",
        date: "23 jul 2026",
        status: "Pendiente",
        statusType: "pending",
        icon: "fa-regular fa-clock",
    },
    {
        type: "Certificación",
        employee: "María Torres",
        date: "23 jul 2026",
        status: "Lista",
        statusType: "success",
        icon: "fa-solid fa-file-circle-check",
    },
];

const birthdays = [
    {
        name: "María González",
        position: "Analista administrativa",
        date: "Hoy",
        day: "24",
        month: "JUL",
    },
    {
        name: "Juan Salazar",
        position: "Auxiliar de operaciones",
        date: "26 de julio",
        day: "26",
        month: "JUL",
    },
    {
        name: "Laura Martínez",
        position: "Coordinadora de talento humano",
        date: "29 de julio",
        day: "29",
        month: "JUL",
    },
    {
        name: "Daniel Vargas",
        position: "Desarrollador de software",
        date: "2 de agosto",
        day: "02",
        month: "AGO",
    },
];

const currentDate = computed(() => {
    return new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());
});

const getInitials = (name = "") => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
};

const navigateTo = (route) => {
    router.push(route);
};
</script>

<style scoped>
.home-page {
    --primary: #5738d6;
    --primary-dark: #4326b6;
    --primary-light: #f1edfd;
    --background: #f8f7fc;
    --surface: #ffffff;
    --surface-soft: #fbfafe;
    --text: #1f1c26;
    --text-muted: #858091;
    --border: #e8e5f0;
    min-height: 100vh;
    background: var(--background);
    font-family: Poppins, sans-serif;
    box-sizing: border-box;
}

.home-panel {
    padding: 28px;
    background: var(--surface);
    border-radius: 18px;
    box-shadow: 0 8px 30px rgba(51, 41, 77, 0.06);
}

.home-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
}

.home-header h1 {
    margin: 0;
    color: var(--text);
    font-size: clamp(24px, 2.2vw, 30px);
    font-weight: 700;
}

.home-header p {
    margin: 8px 0 0;
    color: var(--text-muted);
    font-size: 13px;
}

.date-badge {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 16px;
    color: var(--primary);
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
    background: var(--primary-light);
    border-radius: 10px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.stat-card {
    min-width: 0;
    padding: 18px;
    background: var(--surface-soft);
    border: 1px solid var(--border);
    border-radius: 14px;
    transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
}

.stat-card:hover {
    border-color: rgba(87, 56, 214, 0.3);
    box-shadow: 0 10px 24px rgba(87, 56, 214, 0.08);
    transform: translateY(-2px);
}

.stat-card__main {
    display: flex;
    align-items: center;
    gap: 15px;
}

.stat-card__icon {
    display: grid;
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    color: var(--primary);
    font-size: 18px;
    background: #ebe3fc;
    border-radius: 11px;
    place-items: center;
}

.stat-card strong {
    display: block;
    color: var(--text);
    font-size: 25px;
    line-height: 1;
}

.stat-card span {
    display: block;
    margin-top: 7px;
    color: var(--text-muted);
    font-size: 11px;
}

.stat-card p {
    margin: 15px 0 0;
    color: var(--primary);
    font-size: 10px;
    font-weight: 600;
}

.quick-section {
    margin-top: 30px;
}

.quick-section>h2 {
    margin: 0 0 15px;
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
}

.quick-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
}

.quick-card {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    padding: 17px 16px;
    text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 13px;
    cursor: pointer;
    transition:
        transform 180ms ease,
        border-color 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease;
}

.quick-card:hover {
    background: var(--surface-soft);
    border-color: rgba(87, 56, 214, 0.35);
    box-shadow: 0 8px 22px rgba(87, 56, 214, 0.08);
    transform: translateY(-2px);
}

.quick-card__icon {
    display: grid;
    flex: 0 0 38px;
    width: 38px;
    height: 38px;
    color: var(--primary);
    font-size: 16px;
    background: var(--primary-light);
    border-radius: 10px;
    place-items: center;
}

.quick-card__content {
    min-width: 0;
    margin-left: 12px;
}

.quick-card__content strong,
.quick-card__content small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.quick-card__content strong {
    color: var(--text);
    font-size: 11px;
    font-weight: 600;
}

.quick-card__content small {
    margin-top: 5px;
    color: var(--text-muted);
    font-size: 9px;
}

.quick-card__arrow {
    margin-left: auto;
    padding-left: 10px;
    color: var(--primary);
    font-size: 12px;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(330px, 0.95fr);
    align-items: stretch;
    gap: 24px;
    margin-top: 30px;
}

.dashboard-card {
    min-width: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 71px;
    padding: 0 20px;
    border-bottom: 1px solid var(--border);
}

.card-header__eyebrow {
    display: block;
    margin-bottom: 3px;
    color: var(--primary);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.8px;
}

.card-header h2 {
    margin: 0;
    color: var(--text);
    font-size: 15px;
    font-weight: 600;
}

.text-button {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px;
    color: var(--primary);
    font-family: inherit;
    font-size: 10px;
    font-weight: 600;
    background: transparent;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
}

.text-button:hover {
    background: var(--primary-light);
}

.requests-list {
    padding: 5px 20px 13px;
}

.request-item {
    display: grid;
    grid-template-columns: 38px minmax(160px, 1fr) 110px 100px;
    align-items: center;
    gap: 13px;
    min-height: 62px;
    border-bottom: 1px solid #f0edf5;
}

.request-item:last-child {
    border-bottom: 0;
}

.request-item__icon {
    display: grid;
    width: 36px;
    height: 36px;
    color: var(--primary);
    font-size: 13px;
    background: var(--primary-light);
    border-radius: 50%;
    place-items: center;
}

.request-item__info strong,
.request-item__info span {
    display: block;
}

.request-item__info strong {
    color: var(--text);
    font-size: 11px;
    font-weight: 600;
}

.request-item__info span,
.request-item time {
    margin-top: 3px;
    color: var(--text-muted);
    font-size: 9px;
}

.status-badge {
    justify-self: end;
    min-width: 88px;
    padding: 7px 10px;
    text-align: center;
    font-size: 9px;
    font-weight: 600;
    border-radius: 999px;
}

.status-badge--pending {
    color: #bd741b;
    background: #fff2d9;
}

.status-badge--success {
    color: #278358;
    background: #e0f7eb;
}

/* Tarjeta de cumpleaños ampliada */

.birthday-card {
    display: flex;
    flex-direction: column;
    min-height: 335px;
    overflow: hidden;
}

.birthday-card__header {
    background:
        radial-gradient(circle at 100% 0%,
            rgba(210, 195, 255, 0.45),
            transparent 42%),
        #ffffff;
}

.birthday-card__icon {
    display: grid;
    width: 42px;
    height: 42px;
    color: var(--primary);
    font-size: 17px;
    background: var(--primary-light);
    border-radius: 12px;
    place-items: center;
}

.birthday-card__featured {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 16px 18px 10px;
    padding: 16px;
    background: linear-gradient(135deg, #f5f1ff 0%, #eee8ff 100%);
    border: 1px solid #e1d7ff;
    border-radius: 13px;
}

.birthday-card__featured-avatar {
    display: grid;
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    background: var(--primary);
    border: 4px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    place-items: center;
}

.birthday-card__featured span,
.birthday-card__featured strong,
.birthday-card__featured small {
    display: block;
}

.birthday-card__featured span {
    color: var(--primary);
    font-size: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
}

.birthday-card__featured strong {
    margin-top: 3px;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.birthday-card__featured small {
    margin-top: 3px;
    color: var(--text-muted);
    font-size: 9px;
}

.birthday-list {
    flex: 1;
    padding: 0 18px;
}

.birthday-item {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) 42px;
    align-items: center;
    gap: 11px;
    min-height: 54px;
    border-bottom: 1px solid #f0edf5;
}

.birthday-item:last-child {
    border-bottom: 0;
}

.birthday-item__avatar {
    display: grid;
    width: 34px;
    height: 34px;
    color: var(--primary);
    font-size: 9px;
    font-weight: 700;
    background: var(--primary-light);
    border-radius: 50%;
    place-items: center;
}

.birthday-item__info {
    min-width: 0;
}

.birthday-item__info strong,
.birthday-item__info span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.birthday-item__info strong {
    color: var(--text);
    font-size: 10px;
    font-weight: 600;
}

.birthday-item__info span {
    margin-top: 2px;
    color: var(--text-muted);
    font-size: 8px;
}

.birthday-item__date {
    text-align: center;
}

.birthday-item__date strong,
.birthday-item__date span {
    display: block;
}

.birthday-item__date strong {
    color: var(--primary);
    font-size: 13px;
    line-height: 1;
}

.birthday-item__date span {
    margin-top: 3px;
    color: var(--text-muted);
    font-size: 7px;
    font-weight: 600;
}

.birthday-card__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 12px 18px 16px;
    padding: 11px 13px;
    color: var(--primary);
    background: #faf8ff;
    border-radius: 10px;
}

.birthday-card__footer i {
    font-size: 14px;
}

.birthday-card__footer p {
    margin: 0;
    color: var(--text-muted);
    font-size: 8px;
}

.birthday-card__footer strong {
    color: var(--primary);
}

@media (max-width: 1100px) {

    .stats-grid,
    .quick-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .birthday-card {
        min-height: auto;
    }
}

@media (max-width: 700px) {

    .home-panel {
        padding: 20px;
    }

    .home-header {
        flex-direction: column;
    }

    .date-badge {
        width: 100%;
        box-sizing: border-box;
    }

    .stats-grid,
    .quick-grid {
        grid-template-columns: 1fr;
    }

    .request-item {
        grid-template-columns: 38px minmax(0, 1fr) auto;
    }

    .request-item time {
        display: none;
    }

    .status-badge {
        min-width: auto;
    }
}

@media (max-width: 480px) {
    .home-panel {
        padding: 16px;
        border-radius: 14px;
    }

    .card-header {
        padding: 0 15px;
    }

    .requests-list {
        padding-inline: 15px;
    }

    .request-item {
        grid-template-columns: 36px minmax(0, 1fr);
    }

    .status-badge {
        grid-column: 2;
        justify-self: start;
        margin-bottom: 8px;
    }
}

.human-home {
    --primary: #5738d6;
    --background: #f8f7fc;
    --surface: #ffffff;
    --text-primary: #1f1c26;
    --text-secondary: #6e697a;
    --text-muted: #8f8a99;

    width: 100%;
    min-height: 100vh;
    padding: 8px 12px 12px;
    overflow-x: hidden;
    background: var(--background);
    box-sizing: border-box;
    font-family: Poppins, sans-serif;
}

.welcome-card {
    position: relative;
    display: grid;
    grid-template-columns: minmax(380px, 0.95fr) minmax(440px, 1.05fr);
    align-items: center;
    gap: clamp(24px, 4vw, 64px);
    width: min(1500px, 100%);
    height: calc(100vh - 54px);
    min-height: 560px;
    max-height: 820px;
    padding: clamp(30px, 4vh, 54px) clamp(34px, 5vw, 72px);
    overflow: hidden;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(46, 38, 71, 0.05);
    box-sizing: border-box;
    width: 100%;
}

.welcome-decoration {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
}

.welcome-decoration--top {
    top: -250px;
    right: 11%;
    width: 430px;
    height: 430px;
    background: rgba(222, 209, 255, 0.2);
}

.welcome-decoration--bottom {
    right: -230px;
    bottom: -260px;
    width: 470px;
    height: 470px;
    background: rgba(211, 194, 251, 0.14);
}

.welcome-content {
    position: relative;
    z-index: 2;
    max-width: 560px;
    align-self: center;
}

.welcome-content__line {
    width: 78px;
    height: 4px;
    margin-bottom: 16px;
    background: var(--primary);
    border-radius: 999px;
}

.welcome-content__label {
    display: block;
    margin-bottom: 18px;
    color: var(--primary);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.85px;
}

.welcome-content h1 {
    margin: 0;
    color: var(--text-primary);
    font-size: clamp(32px, 3.2vw, 45px);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -1px;
}

.welcome-content__description {
    max-width: 525px;
    margin: 18px 0 0;
    color: var(--text-secondary);
    font-size: clamp(12px, 1.1vw, 14px);
    font-weight: 400;
    line-height: 1.7;
}

.welcome-content__secondary {
    max-width: 480px;
    margin: 36px 0 0;
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 400;
    line-height: 1.7;
}

.welcome-illustration {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 0;
    height: 100%;
    max-height: 580px;
}

.illustration-glow {
    position: absolute;
    width: min(500px, 94%);
    aspect-ratio: 1;
    background: radial-gradient(circle,
            rgba(232, 220, 255, 0.75) 0%,
            rgba(244, 238, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 73%);
    border-radius: 50%;
}

.team-scene {
    position: relative;
    z-index: 2;
    display: block;
    width: min(580px, 100%);
    max-height: 100%;
    height: auto;
    object-fit: contain;
}

/* Pantallas grandes con poca altura */
@media (min-width: 1051px) and (max-height: 760px) {
    .human-home {
        padding-top: 5px;
        padding-bottom: 8px;
    }

    .welcome-card {
        height: calc(100vh - 41px);
        min-height: 500px;
        padding-top: 24px;
        padding-bottom: 24px;
    }

    .welcome-content__line {
        margin-bottom: 12px;
    }

    .welcome-content__label {
        margin-bottom: 13px;
    }

    .welcome-content__description {
        margin-top: 14px;
    }

    .welcome-content__secondary {
        margin-top: 26px;
    }

    .welcome-illustration {
        max-height: 500px;
    }

    .team-scene {
        width: min(520px, 100%);
    }
}

/* Portátiles */
@media (max-width: 1050px) {
    .human-home {
        overflow-y: auto;
    }

    .welcome-card {
        grid-template-columns: 1fr;
        height: auto;
        max-height: none;
        min-height: calc(100vh - 54px);
        gap: 10px;
        padding: 42px 36px 28px;
        text-align: center;
    }

    .welcome-content {
        max-width: 700px;
        margin: 0 auto;
    }

    .welcome-content__line {
        margin-inline: auto;
    }

    .welcome-content__description,
    .welcome-content__secondary {
        margin-inline: auto;
    }

    .welcome-content__secondary {
        margin-top: 22px;
    }

    .welcome-illustration {
        height: auto;
        min-height: 350px;
        max-height: 440px;
    }

    .team-scene {
        width: min(520px, 100%);
    }
}

/* Celulares */
@media (max-width: 640px) {
    .human-home {
        padding: 7px;
    }

    .welcome-card {
        min-height: auto;
        padding: 36px 18px 22px;
        border-radius: 13px;
    }

    .welcome-content h1 {
        font-size: 29px;
        letter-spacing: -0.5px;
    }

    .welcome-content__description {
        font-size: 12px;
    }

    .welcome-content__secondary {
        margin-top: 20px;
    }

    .welcome-illustration {
        min-height: 290px;
    }

    .team-scene {
        width: 112%;
        max-width: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .team-scene {
        animation: none;
    }
}
</style>