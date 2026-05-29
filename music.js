/* ==========================================================================
   MUSIC.JS: CONTROLADOR DE MÚSICA - Iris (Goo Goo Dolls) vía YouTube
   Autoplay al primer gesto del usuario (requisito del navegador)
   ========================================================================== */

class MusicController {
    constructor() {
        this.player = null;
        this.isPlaying = false;
        this.isReady = false;
        this.pendingPlay = false;

        this.init();
    }

    init() {
        // Cargar la API de YouTube de forma dinámica
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);

        // Callback global requerido por YouTube IFrame API
        window.onYouTubeIframeAPIReady = () => this.onAPIReady();

        // Arrancar música al primer gesto del usuario (click, scroll, touch)
        // Los navegadores modernos exigen esto para reproducir audio
        const startOnGesture = () => {
            if (!this.isPlaying) {
                this.pendingPlay = true;
                this.play();
            }
            document.removeEventListener('click',      startOnGesture);
            document.removeEventListener('touchstart', startOnGesture);
            document.removeEventListener('scroll',     startOnGesture);
            document.removeEventListener('keydown',    startOnGesture);
        };

        document.addEventListener('click',      startOnGesture, { once: true, passive: true });
        document.addEventListener('touchstart', startOnGesture, { once: true, passive: true });
        document.addEventListener('scroll',     startOnGesture, { once: true, passive: true });
        document.addEventListener('keydown',    startOnGesture, { once: true, passive: true });
    }

    onAPIReady() {
        const container = document.createElement('div');
        container.id = 'yt-player-container';
        container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;';
        document.body.appendChild(container);

        this.player = new YT.Player('yt-player-container', {
            videoId: 'NdYWuo9OFAw',   // Iris - Goo Goo Dolls
            playerVars: {
                autoplay: 1,
                controls: 0,
                loop: 1,
                playlist: 'NdYWuo9OFAw',
                enablejsapi: 1,
                origin: window.location.origin,
                rel: 0,
                fs: 0
            },
            events: {
                onReady: () => {
                    this.isReady = true;
                    this.player.setVolume(0);
                    // Si el usuario ya hizo un gesto antes de que cargara el player
                    if (this.pendingPlay) {
                        this.player.playVideo();
                        this.fadeIn();
                        this.isPlaying = true;
                        this.pendingPlay = false;
                    }
                },
                onError: (e) => {
                    console.warn('YouTube player error:', e);
                }
            }
        });
    }

    play() {
        if (!this.isReady) {
            // El player aún no cargó, pendingPlay ya está marcado, se ejecutará en onReady
            return;
        }
        if (this.isPlaying) return;
        this.player.playVideo();
        this.isPlaying = true;
        this.pendingPlay = false;
        this.fadeIn();
    }

    fadeIn() {
        let vol = 0;
        const interval = setInterval(() => {
            vol = Math.min(vol + 3, 40);
            if (this.player && typeof this.player.setVolume === 'function') {
                this.player.setVolume(vol);
            }
            if (vol >= 40) clearInterval(interval);
        }, 150);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicController = new MusicController();
});
