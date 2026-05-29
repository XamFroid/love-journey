/* ==========================================================================
   MUSIC.JS: CONTROLADOR DE MÚSICA - Iris (Goo Goo Dolls) vía YouTube
   ========================================================================== */

class MusicController {
    constructor() {
        this.btn = document.getElementById('music-btn');
        this.ctaBtn = document.getElementById('btn-start');
        this.player = null;
        this.isPlaying = false;
        this.isReady = false;
        this.pendingPlay = false;

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

        this.setupEvents();
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
                    // Reproducir inmediatamente a volumen cómodo (60)
                    this.player.setVolume(60);
                    this.player.playVideo();
                    this.isPlaying = true;
                },
                onError: (e) => {
                    console.warn('YouTube player error, sin música:', e);
                }
            }
        });
    }

    setupEvents() {
        if (this.btn) this.btn.addEventListener('click', () => this.toggle());
        if (this.ctaBtn) this.ctaBtn.addEventListener('click', () => {
            if (!this.isPlaying) this.play();
        });
    }

    toggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    play() {
        if (!this.isReady) {
            this.pendingPlay = true;
            return;
        }
        if (this.player && typeof this.player.playVideo === 'function') {
            this.player.setVolume(60);
            this.player.playVideo();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.player && typeof this.player.pauseVideo === 'function') {
            this.player.pauseVideo();
            this.isPlaying = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicController = new MusicController();
});
