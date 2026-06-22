(function() {
    const isCartPage = window.location.pathname.includes('cart.html');

    if (!isCartPage) {
        const style = document.createElement('style');
        style.textContent = `
            .music-control-text {
                position: fixed;
                bottom: 30px;
                left: 30px;
                z-index: 9999;
                background: none;
                border: none;
                outline: none;
                color: #6b5e3e;
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                user-select: none;
                padding: 0;
                opacity: 0.45;
                text-decoration: line-through;
                transition: all 0.3s ease;
            }

            .music-control-text:hover {
                opacity: 0.85;
            }

            .music-control-text.active {
                opacity: 1;
                text-decoration: none;
                color: #D4AF37;
            }

            /* Responsive per dispositivi mobili */
            @media (max-width: 768px) {
                .music-control-text {
                    bottom: 20px;
                    left: 20px;
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
        button.className = 'music-control-text';
        button.innerHTML = 'Sound';
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
            if (button) {
                button.classList.add('active');
            }
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
        if (button) {
            button.classList.remove('active');
        }
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
