/* ==========================================================================
   PARTICLES.JS: FONDO DE PARTÍCULAS E INTERACTIVIDAD DEL MOUSE
   ========================================================================== */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.trail = [];
        this.maxParticles = 80;
        this.trailLength = 40;
        
        this.colors = [
            'rgba(255, 117, 140, ', // Rosa pastel
            'rgba(226, 180, 253, ', // Lavanda
            'rgba(255, 215, 0, ',   // Oro
            'rgba(255, 255, 255, '  // Blanco
        ];

        this.init();
        this.setupEvents();
        this.animate();
    }

    init() {
        this.resize();
        
        // Crear partículas de fondo estables
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle(true));
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticle(randomY = false) {
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : this.height + 20,
            size: Math.random() * 3 + 1,
            speedY: -(Math.random() * 0.5 + 0.2),
            speedX: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.1,
            baseColor: this.colors[Math.floor(Math.random() * this.colors.length)],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02
        };
    }

    setupEvents() {
        window.addEventListener('resize', () => this.resize());
        
        // Rastro de cursor (Trail) interactivo con partículas tipo corazón
        window.addEventListener('mousemove', (e) => {
            this.addTrailParticle(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                this.addTrailParticle(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        // Explosión de corazones al hacer clic
        window.addEventListener('click', (e) => {
            for (let i = 0; i < 12; i++) {
                this.addExplosionParticle(e.clientX, e.clientY);
            }
        });
    }

    addTrailParticle(x, y) {
        if (Math.random() > 0.4) return; // Limitar tasa de emisión para rendimiento
        this.trail.push({
            x,
            y,
            type: Math.random() > 0.4 ? 'heart' : 'star',
            size: Math.random() * 8 + 5,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 1.5 - 0.5,
            opacity: 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.05
        });
        
        if (this.trail.length > 150) {
            this.trail.shift();
        }
    }

    addExplosionParticle(x, y) {
        this.trail.push({
            x,
            y,
            type: 'heart',
            size: Math.random() * 12 + 8,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            opacity: 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2
        });
    }

    // Dibujar corazón en canvas 2D
    drawHeart(ctx, x, y, size, opacity, colorString, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        
        // Dibujado del corazón escalado
        const d = size;
        ctx.moveTo(0, d / 4);
        ctx.quadraticCurveTo(0, 0, d / 4, 0);
        ctx.quadraticCurveTo(d / 2, 0, d / 2, d / 4);
        ctx.quadraticCurveTo(d / 2, d / 2, 0, d * 0.85);
        ctx.quadraticCurveTo(-d / 2, d / 2, -d / 2, d / 4);
        ctx.quadraticCurveTo(-d / 2, 0, -d / 4, 0);
        ctx.quadraticCurveTo(0, 0, 0, d / 4);
        
        ctx.closePath();
        ctx.fillStyle = colorString + opacity + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 117, 140, 0.5)';
        ctx.fill();
        ctx.restore();
    }

    // Dibujar estrella de 4 puntas (tipo destello premium)
    drawStar(ctx, x, y, size, opacity, colorString, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        const cx = 0, cy = 0;
        const spikes = 4;
        const outerRadius = size;
        const innerRadius = size * 0.3;
        
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        
        ctx.fillStyle = colorString + opacity + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.fill();
        ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. Dibujar partículas de fondo que suben lentamente
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.y += p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * 0.15;

            // Si sale de pantalla, reaparece abajo
            if (p.y < -10) {
                this.particles[i] = this.createParticle(false);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.baseColor + p.opacity + ')';
            this.ctx.fill();
        }

        // 2. Dibujar y actualizar rastro interactivo (Trail)
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const t = this.trail[i];
            t.x += t.vx;
            t.y += t.vy;
            t.rot += t.rotSpeed;
            t.opacity -= 0.015; // Desvanecimiento gradual

            if (t.opacity <= 0) {
                this.trail.splice(i, 1);
                continue;
            }

            if (t.type === 'heart') {
                this.drawHeart(this.ctx, t.x, t.y, t.size, t.opacity, t.color, t.rot);
            } else {
                this.drawStar(this.ctx, t.x, t.y, t.size, t.opacity, t.color, t.rot);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.globalParticles = new ParticleSystem();
});
