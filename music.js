/* ==========================================================================
   MUSIC.JS: AUTOPLAY CON TRUCO MUTED → UNMUTE (funciona en móvil e iOS)
   ========================================================================== */

class MusicController {
    constructor() {
        this.player = null;
        this.isReady = false;
        this.playAttempted = false;

        this.loadAPI();
    }

    loadAPI() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => this.onAPIReady();
    }

    onAPIReady() {
        // Crear contenedor oculto para el player
        const container = document.createElement('div');
        container.id = 'yt-hidden-player';
        container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;';
        document.body.appendChild(container);

        this.player = new YT.Player('yt-hidden-player', {
            videoId: 'NdYWuo9OFAw',   // Iris – Goo Goo Dolls
            playerVars: {
                autoplay: 1,          // Intentar autoplay
                mute: 1,              // Empezar muteado (permitido en móvil)
                controls: 0,
                loop: 1,
                playlist: 'NdYWuo9OFAw',
                playsinline: 1,       // Crítico para iOS: reproduce en la página, no en fullscreen
                enablejsapi: 1,
                rel: 0,
                origin: window.location.origin
            },
            events: {
                onReady: (e) => this.onPlayerReady(e),
                onStateChange: (e) => this.onStateChange(e),
                onError: (e) => {
                    console.warn('YT error:', e.data);
                    // En caso de error, esperar interacción del usuario
                    this.waitForInteraction();
                }
            }
        });
    }

    onPlayerReady(e) {
        this.isReady = true;
        // El player ya tiene mute:1 en playerVars, solo arrancar y luego desmutear
        e.target.playVideo();
        this.fadeUnmute();
    }

    onStateChange(e) {
        // Si el navegador bloquea el autoplay (estado -1 o 2 sin haber llegado a 1)
        if (e.data === YT.PlayerState.PAUSED && !this.playAttempted) {
            this.waitForInteraction();
        }
    }

    fadeUnmute() {
        // Pequeño delay para que el play arranque, luego subir volumen suavemente
        setTimeout(() => {
            this.playAttempted = true;
            let vol = 0;
            const interval = setInterval(() => {
                vol = Math.min(vol + 3, 38);
                try {
                    this.player.unMute();
                    this.player.setVolume(vol);
                } catch(e) {}
                if (vol >= 38) clearInterval(interval);
            }, 80);
        }, 800);
    }

    waitForInteraction() {
        // Fallback: si el autoplay fue bloqueado, reproducir en la primera interacción
        const resume = () => {
            if (this.isReady && this.player) {
                try {
                    this.player.playVideo();
                    this.fadeUnmute();
                } catch(e) {}
            }
            document.removeEventListener('touchstart', resume);
            document.removeEventListener('click', resume);
        };
        document.addEventListener('touchstart', resume, { once: true, passive: true });
        document.addEventListener('click', resume, { once: true });
    }
}

// Arrancar en cuanto el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.musicCtrl = new MusicController(); });
} else {
    window.musicCtrl = new MusicController();
}
