/* ==========================================================================
   APP.JS: COORDINADOR PRINCIPAL DE EFECTOS E INTERACCIONES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. REVELACIÓN DE SECCIONES AL HACER SCROLL (IntersectionObserver)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.timeline-item');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Dejar de observar una vez revelado para rendimiento
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Revelar un poco antes de llegar
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 2. GALERÍA: LIGHTBOX ANIMADO DE ALTA FIDELIDAD
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.getAttribute('data-caption');
                
                if (img && lightboxImg) {
                    lightboxImg.src = img.src;
                    lightboxCap.textContent = caption || '';
                    lightbox.style.display = 'flex';
                    
                    // Pequeña espera para activar la transición CSS
                    setTimeout(() => {
                        lightbox.classList.add('active');
                    }, 50);
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 500); // Mismo tiempo que la transición CSS
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // ==========================================================================
    // 3. CARTAS: SOBRE 3D Y EFECTO MÁQUINA DE ESCRIBIR (TYPEWRITER)
    // ==========================================================================
    const envelope = document.getElementById('love-envelope');
    const typewriterContainer = document.getElementById('typewriter-text');
    let hasLetterOpened = false;

    // Carta escrita por Max y enriquecida sutilmente en su ortografía y ritmo
    const romanticLetter = `Me senté a escribirte sin saber por dónde empezar, porque contigo me pasa algo muy lindo: tengo demasiado que decir y, al mismo tiempo, ninguna palabra me parece suficiente. Así que voy a intentarlo despacio...\n\nAunque llevamos poquito tiempo formalmente, siento en lo más profundo de mi ser que te conozco desde mucho antes. Como si en otra vida ya hubiéramos compartido lluvias, risas y silencios cómplices. Por eso no me asustó quererte tan rápido; solo estaba recordando algo que mi alma ya sabía de ti.\n\nMe enamora por completo cómo eres por dentro. Tu manera tan tuya de ser, ese gesto único en tus ojos cuando algo realmente te importa, tu nobleza infinita, tu paciencia, tu inteligencia callada y esa fuerza dulce y serena con la que enfrentas todo. Eres luz sin tener que esforzarte en serlo.\n\nYa conocí a tu mamá y a tu papá, y no sabes lo sumamente bonito que se sintió. Verlos, escucharlos y entender de dónde vienen todos tus hermosos gestos, tu manera de reír, tu infinita ternura… fue exactamente como leer las primeras páginas de tu hermosa historia. Me cayeron increíblemente bien, y me hizo quererte todavía más, porque entendí que detrás de la mujer que amo hay una familia maravillosa que te formó con puro amor.\n\nGracias por dejarme entrar a tu mundo sin pedirme requisitos ni condiciones. Gracias por tus abrazos largos, por tus hermosos mensajes de buenos días, por escucharme con paciencia cuando hablo de tonterías y por mirarme siempre de esa forma tan especial, como si yo fuera tu lugar seguro. No tienes idea de lo inmenso que es eso para mí.\n\nMe encanta cómo ordenas mi caos sin proponértelo. Me fascina tu risa cristalina cuando se te escapa. Me vuelve loco cómo me dices "Mi viejito" cuando te diviertes. Me encanta sentir tu olor impregnado en mi ropa. Me gusta cómo te quedas pensando antes de responder algo importante. Me gustan tus manías, tus silencios y tu simple forma de existir. Me gusta hasta lo que aún no conozco de ti, porque sé que también lo voy a amar.\n\nMe encanta pensar en futuros pequeños contigo... en viajes juntos, comidas deliciosas, domingos lentos de café, nuestras manos entrelazadas mientras conduzco, criar más mascotas virtuales en nuestro zoológico digital, y esos abrazos y besos infinitos antes de despedirnos.\n\nYa pasó exactamente un mes desde que decidí invertir todo mi amor en ti, un hermoso mes de relación, y sinceramente ya no sé cómo era mi vida antes de ti. Y si esto es solo el principio, no me imagino lo extraordinariamente bonito que va a ser todo lo demás.\n\nTe amo, mi hermosa Tassie. Hoy, mañana, y en cada vida que el universo me regale a tu lado.`;

    if (envelope) {
        envelope.addEventListener('click', () => {
            if (!envelope.classList.contains('open')) {
                envelope.classList.add('open');
                
                // Disparar la máquina de escribir solo la primera vez que se abre
                if (!hasLetterOpened) {
                    hasLetterOpened = true;
                    setTimeout(() => {
                        typewriterEffect(typewriterContainer, romanticLetter, 28);
                    }, 800); // Esperar que termine la animación del sobre
                }
            } else {
                // Si ya está abierto, se puede cerrar o mantener
                // Para una carta tan larga, se prefiere dejar abierta para su lectura cómoda, 
                // pero si el usuario hace clic de nuevo, podemos reajustarla.
            }
        });
    }

    function typewriterEffect(element, text, speed) {
        if (!element) return;
        element.innerHTML = ''; // Limpiar
        let i = 0;
        
        function type() {
            if (i < text.length) {
                const char = text.charAt(i);
                if (char === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += char;
                }
                i++;
                
                // Auto-scroll del papel conforme escribe
                element.scrollTop = element.scrollHeight;
                
                setTimeout(type, speed);
            }
        }
        type();
    }



    // ==========================================================================
    // 5. BOTÓN DE REINICIO DE VIAJE (FOOTER) Y SCROLL SUAVE
    // ==========================================================================
    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Opcional: Cerrar la carta si quieren reiniciar todo
            if (envelope && envelope.classList.contains('open')) {
                envelope.classList.remove('open');
                hasLetterOpened = false;
                if (typewriterContainer) typewriterContainer.innerHTML = '';
            }
        });
    }

    // Flip cards para móviles (Tocar para girar en lugar de hover obligatorio)
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});
