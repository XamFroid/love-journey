/* ==========================================================================
   COUNTDOWN.JS: CONTADOR DE TIEMPO TRANSCURRIDO EN VIVO
   ========================================================================== */

class AnniversaryTimer {
    constructor() {
        // Fecha de aniversario: 30 de Abril de 2026 a las 8:00 p.m. (20:00:00 GMT-0500 u hora local)
        // Usaremos la zona horaria del usuario o local. 
        this.startDate = new Date('2026-04-30T20:00:00-05:00'); 
        
        this.daysEl = document.getElementById('days');
        this.hoursEl = document.getElementById('hours');
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        
        if (!this.daysEl || !this.hoursEl || !this.minutesEl || !this.secondsEl) return;
        
        this.start();
    }

    start() {
        this.update();
        // Actualizar cada segundo
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const difference = now.getTime() - this.startDate.getTime();
        
        if (difference < 0) {
            // En caso de que se configure una fecha futura
            this.render(0, 0, 0, 0);
            return;
        }

        // Cálculos matemáticos de conversión de milisegundos
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        this.render(days, hours, minutes, seconds);
    }

    render(d, h, m, s) {
        const daysStr = String(d).padStart(2, '0');
        const hoursStr = String(h).padStart(2, '0');
        const minutesStr = String(m).padStart(2, '0');
        const secondsStr = String(s).padStart(2, '0');

        this.updateValueWithAnimation(this.daysEl, daysStr);
        this.updateValueWithAnimation(this.hoursEl, hoursStr);
        this.updateValueWithAnimation(this.minutesEl, minutesStr);
        this.updateValueWithAnimation(this.secondsEl, secondsStr);
    }

    // Aplica una micro-animación de zoom para cuando cambian los dígitos de manera premium
    updateValueWithAnimation(element, newValue) {
        if (element.textContent !== newValue) {
            element.style.transform = 'scale(0.8)';
            element.style.opacity = '0.5';
            element.style.transition = 'all 0.15s ease-out';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            }, 150);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnniversaryTimer();
});
