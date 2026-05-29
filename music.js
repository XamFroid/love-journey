/* ==========================================================================
   MUSIC.JS: AUTOPLAY EN PRIMERA INTERACCIÓN DEL USUARIO
   ========================================================================== */

class MusicController {
    constructor() {
        this.player = null;
        this.isPlaying = false;
        this.isReady = false;
        this.hasStarted = false;

        this.init();
    }

    init() {
        // Cargar la API de YouTube
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => this.onAPIReady();

        // Iniciar música en la PRIMERA interacción del usuario (click, touch, tecla)
        const startOnInteraction = () => {
            if (!this.hasStarted) {
                this.hasStarted = true;
                this.play();
                // Limpiamos los listeners una vez arranca
                document.removeEventListener('click', startOnInteraction);
                document.removeEventListener('touchstart', startOnInteraction);
                document.removeEventListener('keydown', startOnInteraction);
            }
        };

        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
    }

    onAPIReady() {
        const container = document.createElement('div');
        container.id = 'yt-player-container';
        container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;';
        document.body.appendChild(container);

        this.player = new YT.Player('yt-player-container', {
            videoId: 'NdYWuo9OFAw',   // Iris - Goo Goo Dolls
            playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: 'NdYWuo9OFAw',
                enablejsapi: 1,
                origin: window.location.origin
            },
            events: {
                onReady: () => {
                    this.isReady = true;
                    this.player.setVolume(0);
                    // Si el usuario ya interactuó antes de que el player esté listo
                    if (this.hasStarted) this.play();
                },
                onError: (e) => {
                    console.warn('YouTube player error:', e);
                }
            }
        });
    }

    play() {
        if (!this.isReady) return; // onReady lo activará cuando esté listo
        if (this.isPlaying) return;

        this.player.playVideo();
        this.isPlaying = true;
        this.fadeIn();
    }

    fadeIn() {
        let vol = 0;
        const interval = setInterval(() => {
            vol = Math.min(vol + 4, 40);
            this.player.setVolume(vol);
            if (vol >= 40) clearInterval(interval);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicController = new MusicController();
});
