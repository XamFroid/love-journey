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
                    this.player.setVolume(0);
                    this.play();
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

        // Autoplay fallback: start music on first user interaction anywhere on the document
        const startAutoplay = () => {
            if (!this.isPlaying) {
                this.play();
            }
            // Clean up event listeners
            ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
                document.removeEventListener(event, startAutoplay);
            });
        };

        ['click', 'touchstart', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, startAutoplay, { passive: true });
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
        this.player.playVideo();
        this.isPlaying = true;
        if (this.btn) this.btn.classList.add('playing');
        this.fadeIn();
    }

    pause() {
        this.fadeOut(() => {
            this.player.pauseVideo();
            this.isPlaying = false;
            if (this.btn) this.btn.classList.remove('playing');
        });
    }

    fadeIn() {
        let vol = 0;
        const interval = setInterval(() => {
            vol = Math.min(vol + 4, 40);
            if (this.player && typeof this.player.setVolume === 'function') {
                this.player.setVolume(vol);
            }
            if (vol >= 40) clearInterval(interval);
        }, 100);
    }

    fadeOut(callback) {
        let vol = this.player && typeof this.player.getVolume === 'function' ? this.player.getVolume() : 40;
        const interval = setInterval(() => {
            vol = Math.max(vol - 5, 0);
            if (this.player && typeof this.player.setVolume === 'function') {
                this.player.setVolume(vol);
            }
            if (vol <= 0) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 60);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.musicController = new MusicController();
});
