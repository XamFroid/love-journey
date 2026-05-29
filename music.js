/* ==========================================================================
   MUSIC.JS: CONTROLADOR DE MÚSICA - Iris (Goo Goo Dolls) vía YouTube
   ========================================================================== */

class MusicController {
    constructor() {
        this.player = null;
        this.isPlaying = false;
        this.isReady = false;

        this.init();
    }

    init() {
        // Cargar la API de YouTube de forma dinámica
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }

        // Callback global requerido por YouTube IFrame API
        window.onYouTubeIframeAPIReady = () => this.onAPIReady();
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
                origin: window.location.origin
            },
            events: {
                onReady: () => {
                    this.isReady = true;
                    this.player.setVolume(0);
                    this.play();
                },
                onError: (e) => {
                    console.warn('YouTube player error, sin música:', e);
                }
            }
        });
    }

    play() {
        if (!this.isReady) return;
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
