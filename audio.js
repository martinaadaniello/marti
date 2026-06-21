(function() {
    const isCartPage = window.location.pathname.includes('cart.html');

    if (!isCartPage) {
        const style = document.createElement('style');
        style.textContent = `
            .music-control-btn {
                position: fixed;
                bottom: 30px;
                left: 30px;
                z-index: 9999;
                background: rgba(254, 250, 242, 0.85);
                border: 1px solid rgba(212, 175, 55, 0.4);
                color: #6b5e3e;
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                padding: 12px 24px;
                border-radius: 999px;
                cursor: pointer;
                box-shadow: 
                    0 8px 32px rgba(212, 175, 55, 0.1),
                    0 4px 12px rgba(0, 0, 0, 0.04);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                display: flex;
                align-items: center;
                gap: 8px;
                user-select: none;
            }

            .music-control-btn:hover {
                transform: translateY(-2px);
                border-color: #D4AF37;
                color: #D4AF37;
                box-shadow: 
                    0 12px 40px rgba(212, 175, 55, 0.2),
                    0 6px 16px rgba(0, 0, 0, 0.06);
            }

            .music-control-btn:active {
                transform: translateY(0);
            }

            /* Responsive per dispositivi mobili */
            @media (max-width: 768px) {
                .music-control-btn {
                    bottom: 20px;
                    left: 20px;
                    padding: 10px 20px;
                    font-size: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ─── CREAZIONE ELEMENTO AUDIO ──────────────────────────
    const audio = document.createElement('audio');
    audio.src = 'assets/bg-music.mp3';
    audio.loop = true;
    audio.volume = 0;
    document.body.appendChild(audio);

    // ─── CREAZIONE PULSANTE DI CONTROLLO ───────────────────
    let button = null;
    if (!isCartPage) {
        button = document.createElement('button');
        button.className = 'music-control-btn';
        button.innerHTML = '🔊 Attiva musica';
        document.body.appendChild(button);
    }

    let fadeInterval = null;

    // ─── FUNZIONE FADE-IN (2 SECONDI) ──────────────────────
    function fadeIn() {
        if (fadeInterval) clearInterval(fadeInterval);
        audio.volume = 0;
        
        const duration = 2000; // 2 secondi
        const intervalTime = 50; // aggiorna ogni 50ms
        const targetVolume = 0.3; // 30% volume
        const steps = duration / intervalTime;
        const volumeIncrement = targetVolume / steps;

        fadeInterval = setInterval(() => {
            if (audio.volume + volumeIncrement >= targetVolume) {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
                fadeInterval = null;
            } else {
                audio.volume += volumeIncrement;
            }
        }, intervalTime);
    }

    // ─── FUNZIONI DI PLAY / PAUSE ──────────────────────────
    function playMusic() {
        audio.play().then(() => {
            if (button) button.innerHTML = '🔇 Disattiva musica';
            fadeIn();
            localStorage.setItem('musicEnabled', 'true');
        }).catch(err => {
            console.log("Autoplay bloccato dal browser, in attesa di interazione utente.");
        });
    }

    function pauseMusic() {
        if (fadeInterval) {
            clearInterval(fadeInterval);
            fadeInterval = null;
        }
        audio.pause();
        audio.volume = 0;
        if (button) button.innerHTML = '🔊 Attiva musica';
        localStorage.setItem('musicEnabled', 'false');
    }

    // ─── CLICK SUL PULSANTE ───────────────────────────────
    if (button) {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita di attivare l'evento click globale del document
            if (audio.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });
    }

    // ─── INIZIALIZZAZIONE STATO PREFERITO ──────────────────
    const musicEnabled = localStorage.getItem('musicEnabled');

    if (musicEnabled === 'true') {
        // Tentiamo il play immediato
        playMusic();

        // Se l'autoplay è bloccato, riproviamo al primo click sulla pagina
        const playOnInteraction = () => {
            if (audio.paused && localStorage.getItem('musicEnabled') === 'true') {
                playMusic();
            }
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
    }
})();
