<template>
    <main class="forbidden-page">
        <div class="background-orb background-orb--top"></div>
        <div class="background-orb background-orb--bottom"></div>

        <section class="forbidden-container">
            <div class="forbidden-content">
                <div class="forbidden-badge">
                    <span class="forbidden-badge__dot"></span>
                    ACCESO RESTRINGIDO
                </div>

                <h1 class="forbidden-code">403</h1>

                <h2 class="forbidden-title">
                    No tienes permiso para entrar aquí
                </h2>

                <p class="forbidden-description">
                    No tienes autorización para acceder a esta sección. Regresa al inicio o contacta al administrador.
                </p>

                <div class="forbidden-actions">
                    <button type="button" class="button button--primary" @click="goHome">
                        Volver al inicio
                    </button>

                    <button type="button" class="button button--secondary" @click="goBack">
                        Regresar
                    </button>
                </div>
            </div>

            <div class="forbidden-illustration" aria-hidden="true">
                <div class="space-glow"></div>

                <span class="star star--one"></span>
                <span class="star star--two"></span>
                <span class="star star--three"></span>
                <span class="star star--four"></span>
                <span class="star star--five"></span>

                <div class="orbit orbit--one"></div>
                <div class="orbit orbit--two"></div>

                <svg class="rocket" viewBox="0 0 420 520" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="rocketBody" x1="110" y1="70" x2="300" y2="420"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#FFFFFF" />
                            <stop offset="0.5" stop-color="#F2EAFE" />
                            <stop offset="1" stop-color="#C4A6F4" />
                        </linearGradient>

                        <linearGradient id="rocketPurple" x1="100" y1="100" x2="310" y2="430"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#8B5CF6" />
                            <stop offset="1" stop-color="#5B21B6" />
                        </linearGradient>

                        <linearGradient id="rocketFire" x1="210" y1="390" x2="210" y2="515"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#FFF3B0" />
                            <stop offset="0.42" stop-color="#FFB45E" />
                            <stop offset="1" stop-color="#A855F7" stop-opacity="0" />
                        </linearGradient>

                        <filter id="rocketShadow" x="-30%" y="-30%" width="160%" height="170%">
                            <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#4C1D95" flood-opacity="0.25" />
                        </filter>
                    </defs>

                    <g filter="url(#rocketShadow)">
                        <path
                            d="M210 35C276 93 309 173 300 266C294 326 263 376 210 414C157 376 126 326 120 266C111 173 144 93 210 35Z"
                            fill="url(#rocketBody)" stroke="#6D28D9" stroke-width="10" stroke-linejoin="round" />

                        <path d="M210 35C245 68 270 106 285 148H135C150 106 175 68 210 35Z" fill="url(#rocketPurple)" />

                        <circle cx="210" cy="214" r="65" fill="#E9D5FF" stroke="#6D28D9" stroke-width="10" />

                        <circle cx="210" cy="214" r="46" fill="#241044" stroke="#8B5CF6" stroke-width="6" />

                        <path d="M180 194C195 180 220 176 242 185" fill="none" stroke="white" stroke-opacity="0.82"
                            stroke-width="10" stroke-linecap="round" />

                        <path d="M127 285L62 350L145 365L164 323Z" fill="url(#rocketPurple)" stroke="#6D28D9"
                            stroke-width="9" stroke-linejoin="round" />

                        <path d="M293 285L358 350L275 365L256 323Z" fill="url(#rocketPurple)" stroke="#6D28D9"
                            stroke-width="9" stroke-linejoin="round" />

                        <path d="M174 399L246 399L268 450H152L174 399Z" fill="#4C1D95" />

                        <path d="M174 446C174 446 178 487 210 512C242 487 246 446 246 446Z" fill="url(#rocketFire)" />

                        <path d="M193 446C193 446 195 475 210 493C225 475 227 446 227 446Z" fill="#FFF7D6"
                            fill-opacity="0.95" />
                    </g>
                </svg>

                <div class="rocket-shadow"></div>
            </div>
        </section>
    </main>
</template>

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

<style scoped>
.forbidden-page {
    position: relative;
    display: flex;
    min-height: 100vh;
    padding: 64px clamp(24px, 7vw, 120px);
    overflow: hidden;
    background: #f8f4fd;
    box-sizing: border-box;
}

.forbidden-container {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.92fr);
    align-items: center;
    gap: clamp(48px, 6vw, 96px);
    width: 100%;
    max-width: 1440px;
    margin: auto;
}

.forbidden-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 680px;
}

.forbidden-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 8px 14px;
    margin-bottom: 20px;
    color: #5e16c5;
    font-family: Poppins, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.65px;
    background: #f2eafd;
    border-radius: 999px;
}

.forbidden-badge__dot {
    width: 8px;
    height: 8px;
    background: #5e16c5;
    border-radius: 50%;
}

.forbidden-code {
    margin: 0;
    color: #5e16c5;
    font-family: Poppins, sans-serif;
    font-size: clamp(104px, 10vw, 148px);
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: -6px;
}

.forbidden-title {
    max-width: 650px;
    margin: 28px 0 16px;
    color: #1a2645;
    font-family: Poppins, sans-serif;
    font-size: clamp(32px, 3.2vw, 42px);
    font-weight: 700;
    line-height: 1.18;
}

.forbidden-description {
    max-width: 620px;
    margin: 0;
    color: #576682;
    font-family: Poppins, sans-serif;
    font-size: clamp(16px, 1.35vw, 19px);
    font-weight: 400;
    line-height: 1.58;
}

.forbidden-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
}

.button {
    min-height: 46px;
    padding: 13px 22px;
    border-radius: 10px;
    font-family: Inter, sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease;
}

.button:hover {
    transform: translateY(-2px);
}

.button:focus-visible {
    outline: 3px solid rgba(94, 22, 197, 0.25);
    outline-offset: 3px;
}

.button--primary {
    color: #ffffff;
    background: #5e16c5;
    border: 1px solid #5e16c5;
    box-shadow: 0 10px 24px rgba(94, 22, 197, 0.22);
}

.button--primary:hover {
    background: #4c10a5;
    box-shadow: 0 14px 30px rgba(94, 22, 197, 0.28);
}

.button--secondary {
    color: #303030;
    background: transparent;
    border: 1px solid rgba(87, 102, 130, 0.25);
}

.button--secondary:hover {
    background: rgba(94, 22, 197, 0.06);
    border-color: rgba(94, 22, 197, 0.2);
}

.forbidden-illustration {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 620px;
}

.space-glow {
    position: absolute;
    width: min(100%, 560px);
    aspect-ratio: 1;
    background: radial-gradient(circle,
            rgba(225, 210, 251, 0.95) 0%,
            rgba(241, 234, 253, 0.62) 42%,
            rgba(248, 244, 253, 0) 72%);
    border-radius: 50%;
}

.rocket {
    position: relative;
    z-index: 4;
    width: min(92%, 420px);
    height: auto;
    transform: rotate(7deg);
    animation: rocketFloat 4.2s ease-in-out infinite;
}

.rocket-shadow {
    position: absolute;
    z-index: 2;
    bottom: 52px;
    width: 58%;
    height: 28px;
    background: rgba(76, 29, 149, 0.18);
    border-radius: 50%;
    filter: blur(12px);
    animation: shadowPulse 4.2s ease-in-out infinite;
}

.orbit {
    position: absolute;
    border: 2px solid rgba(139, 92, 246, 0.23);
    border-radius: 50%;
    transform: rotate(-14deg);
}

.orbit--one {
    width: 78%;
    height: 30%;
    top: 25%;
    left: 8%;
}

.orbit--two {
    width: 94%;
    height: 42%;
    top: 14%;
    left: 3%;
    border-color: rgba(167, 139, 250, 0.18);
    transform: rotate(13deg);
}

.star {
    position: absolute;
    z-index: 3;
    display: block;
    background: #8b5cf6;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.35);
}

.star--one {
    top: 23%;
    left: 13%;
    width: 9px;
    height: 9px;
}

.star--two {
    top: 15%;
    right: 15%;
    width: 13px;
    height: 13px;
    background: #c4b5fd;
}

.star--three {
    top: 37%;
    right: 6%;
    width: 6px;
    height: 6px;
}

.star--four {
    bottom: 25%;
    right: 12%;
    width: 9px;
    height: 9px;
}

.star--five {
    top: 11%;
    left: 29%;
    width: 6px;
    height: 6px;
    background: #a78bfa;
}

.background-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
}

.background-orb--top {
    top: -260px;
    left: -220px;
    width: 560px;
    height: 560px;
    background: rgba(209, 181, 249, 0.38);
}

.background-orb--bottom {
    right: -230px;
    bottom: -300px;
    width: 620px;
    height: 620px;
    background: rgba(189, 148, 247, 0.28);
}

@keyframes rocketFloat {

    0%,
    100% {
        transform: translateY(0) rotate(7deg);
    }

    50% {
        transform: translateY(-16px) rotate(5deg);
    }
}

@keyframes shadowPulse {

    0%,
    100% {
        width: 58%;
        opacity: 0.85;
    }

    50% {
        width: 50%;
        opacity: 0.55;
    }
}

@media (max-width: 1024px) {
    .forbidden-page {
        padding: 52px 40px;
    }

    .forbidden-container {
        grid-template-columns: 1fr 0.8fr;
        gap: 38px;
    }

    .forbidden-illustration {
        min-height: 500px;
    }
}

@media (max-width: 820px) {
    .forbidden-page {
        padding: 48px 24px;
    }

    .forbidden-container {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .forbidden-content {
        align-items: center;
        max-width: 100%;
    }

    .forbidden-description {
        max-width: 600px;
    }

    .forbidden-actions {
        justify-content: center;
    }

    .forbidden-illustration {
        min-height: 420px;
    }

    .rocket {
        width: min(75%, 350px);
    }

    .rocket-shadow {
        bottom: 15px;
    }
}

@media (max-width: 480px) {
    .forbidden-page {
        padding: 34px 18px;
    }

    .forbidden-code {
        letter-spacing: -3px;
    }

    .forbidden-title {
        margin-top: 20px;
    }

    .forbidden-actions {
        flex-direction: column;
        width: 100%;
    }

    .button {
        width: 100%;
    }

    .forbidden-illustration {
        min-height: 350px;
    }

    .rocket {
        width: min(88%, 310px);
    }
}

@media (prefers-reduced-motion: reduce) {

    .rocket,
    .rocket-shadow {
        animation: none;
    }

    .button {
        transition: none;
    }
}
</style>