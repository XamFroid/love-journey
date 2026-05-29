/* ==========================================================================
   MUSIC.JS: CONTROLADOR DE AUDIO NATIVO HTML5 (Música Romántica de Fondo)
   ========================================================================== */

class MusicController {
    constructor() {
        this.btn = document.getElementById('music-btn');
        this.ctaBtn = document.getElementById('btn-start');
        this.audio = null;
        this.isPlaying = false;

        // Fuentes de audio directas (sin YouTube, sin restricciones locales)
        // Lista de URLs de respaldo - se prueba de primera a última
        this.sources = [
            'https://assets.mixkit.co/music/preview/mixkit-love-in-the-air-148.mp3',
            'https://assets.mixkit.co/music/preview/mixkit-classical-romantic-guitar-121.mp3',
            'https://assets.mixkit.co/music/preview/mixkit-piano-reflections-22.mp3'
        ];

        this.init();
    }

    init() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = 0;

        // Intentar cargar las fuentes en orden hasta que una funcione
        this.loadAudio(0);
        this.setupEvents();
    }

    loadAudio(index) {
        if (index >= this.sources.length) {
            console.warn('No se pudo cargar ninguna fuente de audio.');
            return;
        }

        this.audio.src = this.sources[index];
        this.audio.load();

        // Si hay error, intentar la siguiente fuente
        this.audio.onerror = () => {
            console.warn(`Fuente ${index} falló, probando siguiente...`);
            this.loadAudio(index + 1);
        };
    }

    setupEvents() {
        if (!this.btn) return;

        this.btn.addEventListener('click', () => this.toggle());

        // Iniciar música con el CTA principal
        if (this.ctaBtn) {
            this.ctaBtn.addEventListener('click', () => {
                if (!this.isPlaying) this.play();
            });
        }
    }

    toggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    play() {
        if (!this.audio) return;

        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.btn.classList.add('playing');
                this.fadeIn();
            }).catch(err => {
                console.warn('Reproducción bloqueada por el navegador (requiere interacción del usuario):', err);
                // El botón de música ya actúa como interacción - reintentar
            });
        }
    }

    pause() {
        this.fadeOut(() => {
            this.audio.pause();
            this.isPlaying = false;
            this.btn.classList.remove('playing');
        });
    }

    fadeIn() {
        this.audio.volume = 0;
        let vol = 0;
        const interval = setInterval(() => {
            vol = Math.min(vol + 0.04, 0.45);
            this.audio.volume = vol;
            if (vol >= 0.45) clearInterval(interval);
        }, 80);
    }

    fadeOut(callback) {
        let vol = this.audio.volume;
        const interval = setInterval(() => {
            vol = Math.max(vol - 0.04, 0);
            this.audio.volume = vol;
            if (vol <= 0) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicController = new MusicController();
});
