<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
    router.push("/home");
};

const goBack = () => {
    if (window.history.length > 1) {
        router.back();
        return;
    }

    router.push("/");
};
</script>

<template>
    <main class="not-found-page">
        <!-- Luces decorativas del fondo -->
        <div class="background-glow glow-left"></div>
        <div class="background-glow glow-right"></div>

        <span class="floating-dot dot-one"></span>
        <span class="floating-dot dot-two"></span>
        <span class="floating-dot dot-three"></span>
        <span class="floating-dot dot-four"></span>

        <section class="not-found-container">
            <!-- INFORMACIÓN -->
            <div class="not-found-content">
                <div class="status-badge">
                    <span class="status-dot"></span>
                    <span>Página no encontrada</span>
                </div>

                <div class="error-number">
                    404
                </div>

                <h1>Esta página quedó fuera de órbita</h1>

                <p class="description">
                    No pudimos encontrar la página que buscas.
                    Es posible que el enlace haya cambiado o que
                    el contenido ya no esté disponible.
                </p>

                <div class="actions">
                    <button type="button" class="button button-primary" @click="goHome">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"
                            fill="currentColor">
                            <path
                                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z" />
                        </svg>

                        Volver al inicio
                    </button>

                    <button type="button" class="button button-secondary" @click="goBack">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"
                            fill="currentColor">
                            <path
                                d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                        </svg>

                        Regresar
                    </button>
                </div>
            </div>

            <!-- ILUSTRACIÓN -->
            <div class="illustration-container">
                <div class="illustration-glow"></div>

                <svg class="space-scene" viewBox="0 0 620 700" role="img" aria-label="Cohete perdido en el espacio">
                    <defs>
                        <linearGradient id="bodyGradient404" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="52%" stop-color="#f2eafe" />
                            <stop offset="100%" stop-color="#c4a6f4" />
                        </linearGradient>

                        <linearGradient id="purpleGradient404" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#8b5cf6" />
                            <stop offset="100%" stop-color="#5b21b6" />
                        </linearGradient>

                        <linearGradient id="darkPurple404" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#7137dc" />
                            <stop offset="100%" stop-color="#43178f" />
                        </linearGradient>

                        <linearGradient id="fireGradient404" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#fff3b0" />
                            <stop offset="38%" stop-color="#ffb45e" />
                            <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
                        </linearGradient>

                        <radialGradient id="glassGradient404">
                            <stop offset="0%" stop-color="#351765" />
                            <stop offset="72%" stop-color="#241044" />
                            <stop offset="100%" stop-color="#16082d" />
                        </radialGradient>

                        <filter id="rocketShadow404" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="18" stdDeviation="17" flood-color="#5e16c5" flood-opacity=".22" />
                        </filter>

                        <filter id="blur404" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="12" />
                        </filter>
                    </defs>

                    <!-- Trayectoria desorientada -->
                    <g class="lost-path">
                        <path d="M54 196 C170 83 352 92 445 181 C506 239 495 316 435 347" />

                        <path d="M435 347 C405 364 406 399 438 414 C480 434 530 401 534 355" />

                        <path d="M534 355 C537 321 517 300 491 298" />

                        <circle cx="52" cy="197" r="7" />
                        <circle cx="491" cy="298" r="7" />
                    </g>

                    <!-- Símbolo de interrogación -->
                    <g class="question-symbol">
                        <path
                            d="M492 137 C492 108 515 91 543 91 C571 91 592 108 592 135 C592 158 579 170 560 181 C545 190 541 199 541 214" />

                        <circle cx="541" cy="239" r="7" />
                    </g>

                    <!-- Planeta inferior -->
                    <g class="planet">
                        <ellipse class="planet-body" cx="337" cy="641" rx="226" ry="63" />

                        <ellipse class="planet-line" cx="337" cy="603" rx="226" ry="37" />

                        <ellipse class="planet-crater crater-one" cx="352" cy="607" rx="61" ry="17" />

                        <ellipse class="planet-crater crater-two" cx="177" cy="646" rx="17" ry="9" />

                        <ellipse class="planet-crater crater-three" cx="492" cy="650" rx="22" ry="11" />
                    </g>

                    <!-- Humo -->
                    <g class="smoke">
                        <path d="M176 447 C144 478 143 515 164 532" />

                        <path d="M194 453 C174 487 177 519 196 538" />
                    </g>

                    <!-- Cohete -->
                    <!-- COHETE MEJORADO -->
                    <g class="rocket rocket-lost" filter="url(#rocketShadow404)">
                        <!-- Fuego: se dibuja primero para quedar detrás del motor -->
                        <g class="rocket-fire">
                            <path class="fire-glow" d="
                M231 449
                C216 478 209 508 221 535
                C228 550 238 561 248 574
                C256 554 264 537 276 519
                C285 542 291 562 303 570
                C315 543 311 501 290 457
                Z
            " />

                            <path class="fire-outer" d="
                M237 450
                C224 479 220 504 230 528
                C236 542 244 550 250 560
                C257 542 264 525 275 509
                C283 528 289 543 298 551
                C306 527 302 493 286 454
                Z
            " />

                            <path class="fire-middle" d="
                M246 451
                C237 477 237 496 244 513
                C249 524 253 531 258 540
                C263 524 268 510 276 496
                C282 511 286 524 290 529
                C296 509 291 483 281 453
                Z
            " />

                            <path class="fire-inner" d="
                M256 453
                C250 472 251 487 257 498
                C261 506 265 513 269 522
                C273 507 278 494 282 484
                C286 495 289 505 291 510
                C294 494 289 474 278 454
                Z
            " />
                        </g>

                        <!-- Cuello del motor -->
                        <path class="rocket-engine-neck" d="
            M207 403
            L304 420
            L299 450
            C279 460 254 463 229 454
            L204 438
            Z
        " />

                        <!-- Motor -->
                        <path class="rocket-engine" d="
            M218 435
            C241 446 270 451 296 442
            L300 466
            C277 479 244 477 218 464
            Z
        " />

                        <!-- Cuerpo principal -->
                        <path class="rocket-body" d="
            M199 394
            C180 309 204 211 294 143
            C338 110 393 88 452 76
            C478 126 483 181 469 232
            C449 311 400 374 311 427
            C284 444 259 451 238 445
            L205 418
            Z
        " />

                        <!-- Punta -->
                        <path class="rocket-head" d="
            M294 143
            C338 110 393 88 452 76
            C478 126 483 181 469 232
            C435 190 381 159 294 143
            Z
        " />

                        <!-- Unión entre punta y cuerpo -->
                        <path class="rocket-head-seam" d="
            M294 143
            C360 151 422 178 469 232
        " />

                        <!-- Aleta izquierda -->
                        <path class="rocket-fin rocket-fin-left" d="
            M213 304
            C171 305 127 323 91 355
            C70 374 56 394 50 416
            C91 422 135 416 177 399
            C191 379 207 354 222 329
            Z
        " />

                        <!-- Unión aleta izquierda -->
                        <path class="fin-attachment" d="
            M211 308
            C205 340 194 371 177 399
        " />

                        <!-- Aleta derecha -->
                        <path class="rocket-fin rocket-fin-right" d="
            M372 366
            C414 378 440 412 447 452
            C454 493 442 528 418 557
            C391 526 369 489 353 450
            C357 420 363 392 372 366
            Z
        " />

                        <!-- Unión aleta derecha -->
                        <path class="fin-attachment" d="
            M373 370
            C367 400 360 426 353 450
        " />

                        <!-- Detalles de aletas -->
                        <path class="fin-line" d="M82 395 C114 398 145 390 175 376" />

                        <path class="fin-line" d="M386 415 C400 449 412 480 428 507" />

                        <!-- Ventana exterior -->
                        <circle class="window-glow" cx="340" cy="249" r="82" />

                        <circle class="window-outer-ring" cx="340" cy="249" r="67" />

                        <circle class="window-border" cx="340" cy="249" r="60" />

                        <circle class="window-middle" cx="340" cy="249" r="52" />

                        <circle class="window-glass" cx="340" cy="249" r="44" />

                        <!-- Tornillos de la ventana -->
                        <g class="window-bolts">
                            <circle cx="340" cy="190" r="3.5" />
                            <circle cx="382" cy="207" r="3.5" />
                            <circle cx="399" cy="249" r="3.5" />
                            <circle cx="382" cy="291" r="3.5" />
                            <circle cx="340" cy="308" r="3.5" />
                            <circle cx="298" cy="291" r="3.5" />
                            <circle cx="281" cy="249" r="3.5" />
                            <circle cx="298" cy="207" r="3.5" />
                        </g>

                        <!-- Reflejos ventana -->
                        <path class="window-reflection" d="M307 215 C326 201 351 199 371 211" />

                        <circle class="window-reflection-dot" cx="382" cy="230" r="5" />

                        <circle class="window-point" cx="365" cy="281" r="11" />

                        <!-- Reflejo del cuerpo -->
                        <path class="body-reflection" d="
            M281 173
            C233 230 219 301 228 365
        " />
                    </g>

                    <!-- Fragmentos espaciales -->
                    <g class="space-particles">
                        <rect x="86" y="257" width="10" height="10" rx="3" />

                        <rect x="485" y="384" width="8" height="8" rx="3" />

                        <rect x="472" y="173" width="14" height="14" rx="5" />

                        <circle cx="520" cy="461" r="6" />
                        <circle cx="107" cy="167" r="5" />
                    </g>
                </svg>
            </div>
        </section>
    </main>
</template>

<style scoped>
.not-found-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 50px 7%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
        radial-gradient(circle at 74% 45%,
            rgba(237, 233, 254, 0.9) 0%,
            rgba(245, 243, 255, 0.45) 34%,
            transparent 62%),
        #f8f4fd;
}

.not-found-container {
    position: relative;
    z-index: 2;
    width: min(1360px, 100%);
    display: grid;
    grid-template-columns:
        minmax(420px, 1.05fr) minmax(430px, 0.95fr);
    align-items: center;
    gap: 60px;
}

/* =====================================
   CONTENIDO
===================================== */

.not-found-content {
    max-width: 680px;
}

.status-badge {
    width: fit-content;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    gap: 9px;
    border-radius: 999px;
    color: #5e16c5;
    background: #f2eafd;
    font-family: Poppins, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.65px;
    text-transform: uppercase;
}

.status-dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #5e16c5;
    box-shadow: 0 0 0 5px rgba(94, 22, 197, 0.08);
    animation: statusPulse 2.2s ease-in-out infinite;
}

.error-number {
    margin-top: 19px;
    color: transparent;
    background: linear-gradient(135deg,
            #5e16c5 0%,
            #7c3aed 55%,
            #9b6be5 100%);
    background-clip: text;
    -webkit-background-clip: text;
    font-family: Poppins, sans-serif;
    font-size: clamp(105px, 12vw, 148px);
    font-weight: 700;
    line-height: 0.94;
    letter-spacing: -7px;
}

.not-found-content h1 {
    max-width: 650px;
    margin: 17px 0 0;
    color: #1a2645;
    font-family: Poppins, sans-serif;
    font-size: clamp(33px, 4vw, 44px);
    font-weight: 700;
    line-height: 1.18;
}

.description {
    max-width: 620px;
    margin: 20px 0 0;
    color: #576682;
    font-family: Poppins, sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.7;
}

.actions {
    margin-top: 31px;
    display: flex;
    align-items: center;
    gap: 13px;
}

.button {
    min-height: 46px;
    padding: 12px 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border-radius: 9px;
    border: 1px solid transparent;
    font-family: Poppins, sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;
}

.button:hover {
    transform: translateY(-2px);
}

.button-primary {
    color: #ffffff;
    background: linear-gradient(135deg,
            #6d28d9,
            #5e16c5);
    box-shadow: 0 12px 25px rgba(94, 22, 197, 0.24);
}

.button-primary:hover {
    box-shadow: 0 16px 30px rgba(94, 22, 197, 0.34);
}

.button-secondary {
    color: #303030;
    border-color: #ded3ed;
    background: rgba(255, 255, 255, 0.68);
}

.button-secondary:hover {
    color: #5e16c5;
    border-color: #bda0e5;
    background: #ffffff;
}

/* =====================================
   ILUSTRACIÓN
===================================== */

.illustration-container {
    position: relative;
    min-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.illustration-glow {
    position: absolute;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: rgba(223, 208, 250, 0.54);
    filter: blur(70px);
}

.space-scene {
    position: relative;
    z-index: 2;
    width: min(620px, 100%);
    overflow: visible;
}

/* =====================================
   COHETE
===================================== */

/* =====================================
   COHETE MEJORADO
===================================== */

.rocket {
    transform-origin: 310px 355px;
}

.rocket-lost {
    animation: lostRocket 5.5s ease-in-out infinite;
}

.rocket-body {
    fill: url(#bodyGradient404);
    stroke: #6426cf;
    stroke-width: 8;
    stroke-linejoin: round;
}

.rocket-head {
    fill: url(#purpleGradient404);
    stroke: #6426cf;
    stroke-width: 8;
    stroke-linejoin: round;
}

.rocket-head-seam {
    fill: none;
    stroke: rgba(69, 21, 149, 0.7);
    stroke-width: 6;
    stroke-linecap: round;
}

.body-reflection {
    fill: none;
    stroke: rgba(255, 255, 255, 0.58);
    stroke-width: 11;
    stroke-linecap: round;
    opacity: 0.65;
}

/* Motor */

.rocket-engine-neck {
    fill: #6024c7;
    stroke: #4a178f;
    stroke-width: 7;
    stroke-linejoin: round;
}

.rocket-engine {
    fill: url(#darkPurple404);
    stroke: #4a178f;
    stroke-width: 7;
    stroke-linejoin: round;
}

/* Aletas */

.rocket-fin {
    fill: url(#darkPurple404);
    stroke: #6426cf;
    stroke-width: 8;
    stroke-linejoin: round;
}

.rocket-fin-left {
    transform-origin: 190px 370px;
    animation: leftFin404 5.5s ease-in-out infinite;
}

.rocket-fin-right {
    transform-origin: 380px 420px;
    animation: rightFin404 5.5s ease-in-out infinite;
}

.fin-attachment {
    fill: none;
    stroke: rgba(69, 21, 149, 0.8);
    stroke-width: 6;
    stroke-linecap: round;
}

.fin-line {
    fill: none;
    stroke: #d2c6ff;
    stroke-width: 10;
    stroke-linecap: round;
}

/* Ventana */

.window-glow {
    fill: #eadcff;
    opacity: 0.72;
    transform-origin: 340px 249px;
    animation: windowPulse404 2.6s ease-in-out infinite;
}

.window-outer-ring {
    fill: #6d28d9;
    stroke: #45158f;
    stroke-width: 4;
}

.window-border {
    fill: #a17af0;
}

.window-middle {
    fill: #4c1d95;
}

.window-glass {
    fill: url(#glassGradient404);
    stroke: #210b43;
    stroke-width: 3;
}

.window-bolts {
    fill: #d9ccff;
    stroke: #5c28b3;
    stroke-width: 1.5;
}

.window-reflection {
    fill: none;
    stroke: rgba(255, 255, 255, 0.88);
    stroke-width: 12;
    stroke-linecap: round;
}

.window-reflection-dot {
    fill: rgba(255, 255, 255, 0.76);
}

.window-point {
    fill: #c4b5fd;
}

/* =====================================
   FUEGO AJUSTADO AL MOTOR
===================================== */

.rocket-fire {
    transform-origin: 260px 453px;
    transform-box: view-box;
    animation: fire404 0.42s ease-in-out infinite alternate;
}

.fire-glow {
    fill: #a855f7;
    opacity: 0.18;
    filter: url(#blur404);
}

.fire-outer {
    fill: #7c3aed;
    opacity: 0.68;
}

.fire-middle {
    fill: #ff8a4c;
}

.fire-inner {
    fill: #fff0a6;
}

/* =====================================
   ELEMENTOS ESPACIALES
===================================== */

.lost-path path {
    fill: none;
    stroke: rgba(124, 58, 237, 0.27);
    stroke-width: 5;
    stroke-linecap: round;
    stroke-dasharray: 12 16;
    animation: routeMovement404 12s linear infinite;
}

.lost-path circle {
    fill: #8b5cf6;
    animation: particlePulse404 2.5s ease-in-out infinite;
}

.question-symbol {
    fill: none;
    stroke: #8b5cf6;
    stroke-width: 10;
    stroke-linecap: round;
    opacity: 0.6;
    transform-origin: 542px 165px;
    animation: questionFloat404 3.4s ease-in-out infinite;
}

.planet-body {
    fill: #eee8ff;
}

.planet-line {
    fill: none;
    stroke: #9b7ae8;
    stroke-width: 6;
}

.planet-crater {
    fill: #d7c8fa;
}

.crater-two,
.crater-three {
    fill: #ddd1f8;
}

.smoke path {
    fill: none;
    stroke: #c4a6f4;
    stroke-width: 18;
    stroke-linecap: round;
    opacity: 0.42;
    animation: smoke404 1.8s ease-in-out infinite;
}

.smoke path:last-child {
    animation-delay: 0.4s;
}

.space-particles {
    fill: #8153d8;
}

.space-particles rect,
.space-particles circle {
    transform-box: fill-box;
    transform-origin: center;
    animation: floatingParticle404 3s ease-in-out infinite;
}

.space-particles :nth-child(2) {
    animation-delay: 0.7s;
}

.space-particles :nth-child(3) {
    fill: #c4b5fd;
    animation-delay: 1.1s;
}

.space-particles :nth-child(4) {
    fill: #9b7ae8;
    animation-delay: 1.5s;
}

/* =====================================
   FONDO
===================================== */

.background-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
}

.glow-left {
    width: 560px;
    height: 560px;
    top: -300px;
    left: -250px;
    background: rgba(209, 181, 249, 0.34);
    filter: blur(80px);
}

.glow-right {
    width: 620px;
    height: 620px;
    right: -270px;
    bottom: -310px;
    background: rgba(189, 148, 247, 0.25);
    filter: blur(90px);
}

.floating-dot {
    position: absolute;
    display: block;
    border-radius: 50%;
    background: #8b5cf6;
    opacity: 0.3;
    animation: backgroundDot404 4s ease-in-out infinite;
}

.dot-one {
    width: 9px;
    height: 9px;
    top: 16%;
    left: 7%;
}

.dot-two {
    width: 13px;
    height: 13px;
    top: 13%;
    right: 12%;
    animation-delay: 0.8s;
}

.dot-three {
    width: 7px;
    height: 7px;
    bottom: 16%;
    left: 13%;
    animation-delay: 1.3s;
}

.dot-four {
    width: 10px;
    height: 10px;
    right: 7%;
    bottom: 12%;
    animation-delay: 1.9s;
}

/* =====================================
   ANIMACIONES
===================================== */

@keyframes lostRocket {

    0%,
    100% {
        transform:
            translate(-4px, 7px) rotate(-8deg);
    }

    25% {
        transform:
            translate(9px, -12px) rotate(-4deg);
    }

    50% {
        transform:
            translate(-3px, -22px) rotate(-11deg);
    }

    75% {
        transform:
            translate(-11px, -7px) rotate(-6deg);
    }
}

@keyframes fire404 {
    from {
        transform:
            scaleX(0.93) scaleY(0.86);
    }

    to {
        transform:
            scaleX(1.05) scaleY(1.17);
    }
}

@keyframes leftFin404 {

    0%,
    100% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(-2deg);
    }
}

@keyframes rightFin404 {

    0%,
    100% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(2deg);
    }
}

@keyframes windowPulse404 {

    0%,
    100% {
        opacity: 0.67;
        transform: scale(1);
    }

    50% {
        opacity: 0.93;
        transform: scale(1.05);
    }
}

@keyframes routeMovement404 {
    to {
        stroke-dashoffset: -280;
    }
}

@keyframes questionFloat404 {

    0%,
    100% {
        transform:
            translateY(0) rotate(-3deg);
        opacity: 0.45;
    }

    50% {
        transform:
            translateY(-13px) rotate(4deg);
        opacity: 0.85;
    }
}

@keyframes smoke404 {
    0% {
        opacity: 0.16;
        transform: translateY(9px);
    }

    50% {
        opacity: 0.48;
    }

    100% {
        opacity: 0.06;
        transform: translateY(28px);
    }
}

@keyframes particlePulse404 {

    0%,
    100% {
        opacity: 0.5;
        transform: scale(1);
        transform-origin: center;
    }

    50% {
        opacity: 1;
        transform: scale(1.25);
        transform-origin: center;
    }
}

@keyframes floatingParticle404 {

    0%,
    100% {
        transform:
            translateY(0) rotate(0deg);
    }

    50% {
        transform:
            translateY(-11px) rotate(20deg);
    }
}

@keyframes backgroundDot404 {

    0%,
    100% {
        opacity: 0.2;
        transform: translateY(0);
    }

    50% {
        opacity: 0.55;
        transform: translateY(-12px);
    }
}

@keyframes statusPulse {

    0%,
    100% {
        box-shadow:
            0 0 0 4px rgba(94, 22, 197, 0.08);
    }

    50% {
        box-shadow:
            0 0 0 8px rgba(94, 22, 197, 0.03);
    }
}

/* =====================================
   RESPONSIVE
===================================== */

@media (max-width: 1020px) {
    .not-found-page {
        padding: 35px 30px 50px;
    }

    .not-found-container {
        grid-template-columns: 1fr;
        gap: 10px;
        text-align: center;
    }

    .not-found-content {
        max-width: 700px;
        margin: 0 auto;
    }

    .status-badge {
        margin-inline: auto;
    }

    .description {
        margin-inline: auto;
    }

    .actions {
        justify-content: center;
    }

    .illustration-container {
        min-height: 530px;
        margin-top: -20px;
    }

    .space-scene {
        width: min(500px, 100%);
    }
}

@media (max-width: 600px) {
    .not-found-page {
        padding: 30px 20px 40px;
    }

    .error-number {
        letter-spacing: -4px;
    }

    .not-found-content h1 {
        font-size: 31px;
    }

    .description {
        font-size: 16px;
        line-height: 1.65;
    }

    .actions {
        flex-direction: column;
    }

    .button {
        width: 100%;
    }

    .illustration-container {
        min-height: 430px;
    }

    .space-scene {
        width: 430px;
        max-width: 118%;
    }
}

@media (prefers-reduced-motion: reduce) {

    .rocket,
    .rocket-fire,
    .rocket-fin,
    .window-glow,
    .lost-path path,
    .lost-path circle,
    .question-symbol,
    .smoke path,
    .space-particles *,
    .floating-dot,
    .status-dot {
        animation: none !important;
    }
}
</style>