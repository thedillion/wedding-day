/* ==========================================================================
   REFINE ELEGANCE — INTERACTIVE JAVASCRIPT & PARALLAX ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. COUNTDOWN TIMER (Target: 23rd of August 2026, 18:00:00)
    // ----------------------------------------------------------------------
    const weddingDate = new Date('2026-08-23T18:00:00').getTime();


    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minsEl = document.getElementById('minutes');
            const secsEl = document.getElementById('seconds');

            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
            if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
        } else {
            const timerContainer = document.getElementById('countdownTimer');
            if (timerContainer) {
                timerContainer.innerHTML = '<div class="timer-box"><span class="timer-number">TODAY!</span><span class="timer-label">Today is our Special Day!</span></div>';
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ----------------------------------------------------------------------
    // 2. SCROLL REVEAL OBSERVER
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------------
    // 3. AUTOMATIC SMOOTH PARALLAX & 3D FLOATING ENGINE
    // ----------------------------------------------------------------------
    const heroCard = document.getElementById('heroCard');
    const cardShadow = document.getElementById('cardShadow');
    const decorLayer = document.getElementById('decorLayer');

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let autoTime = 0;
    let scrollSpeedFactor = 1.0;
    let lastScrollY = window.scrollY;

    document.addEventListener('mousemove', (e) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
        mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);
    });

    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
            mouseX = Math.min(Math.max(e.gamma / 30, -1), 1);
            mouseY = Math.min(Math.max((e.beta - 45) / 30, -1), 1);
        }
    });

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const delta = Math.abs(currentScroll - lastScrollY);
        scrollSpeedFactor = Math.min(1.0 + delta * 0.15, 4.0);
        lastScrollY = currentScroll;

        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(() => {
            scrollSpeedFactor = 1.0;
        }, 150);
    });

    function animateParallax() {
        autoTime += 0.015;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        const autoFloatX = Math.sin(autoTime * 0.8) * 6;
        const autoFloatY = Math.cos(autoTime * 0.6) * 8;
        const autoRotateX = Math.sin(autoTime * 0.5) * 2.5;
        const autoRotateY = Math.cos(autoTime * 0.7) * 2.5;

        if (heroCard) {
            const finalRotateX = autoRotateX + (-targetY * 7);
            const finalRotateY = autoRotateY + (targetX * 7);
            const finalTranslateX = autoFloatX + (targetX * 12);
            const finalTranslateY = autoFloatY + (targetY * 12);

            heroCard.style.transform = `translate3d(${finalTranslateX}px, ${finalTranslateY}px, 0px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg)`;
        }

        if (cardShadow) {
            const shadowX = -autoFloatX * 0.5 + (-targetX * 15);
            const shadowY = -autoFloatY * 0.5 + (-targetY * 15);
            cardShadow.style.transform = `translate3d(${shadowX}px, ${shadowY}px, 0px)`;
        }

        if (decorLayer) {
            const decorX = autoFloatX * 1.5 + (targetX * 22);
            const decorY = autoFloatY * 1.5 + (targetY * 22);
            decorLayer.style.transform = `translate3d(${decorX}px, ${decorY}px, 0px)`;
        }

        requestAnimationFrame(animateParallax);
    }
    animateParallax();




    // ----------------------------------------------------------------------
    // 4. CANVAS 1: SUNLIGHT DUST PARTICLES
    // ----------------------------------------------------------------------
    const dustCanvas = document.getElementById('lightDustCanvas');
    if (dustCanvas) {
        const ctx = dustCanvas.getContext('2d');
        let width = dustCanvas.width = window.innerWidth;
        let height = dustCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = dustCanvas.width = window.innerWidth;
            height = dustCanvas.height = window.innerHeight;
        });

        const dustParticles = [];
        const DUST_COUNT = window.innerWidth < 768 ? 18 : 35;

        for (let i = 0; i < DUST_COUNT; i++) {
            dustParticles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.4 - 0.1,
                pulseSpeed: Math.random() * 0.02 + 0.005
            });
        }

        function renderDust() {
            ctx.clearRect(0, 0, width, height);

            dustParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

                if (p.y < 0) p.y = height;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 245, 220, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
                ctx.shadowBlur = window.innerWidth < 768 ? 0 : 8; // Disable expensive canvas shadowBlur on mobile for GPU savings
                ctx.shadowColor = 'rgba(255, 230, 180, 0.8)';
                ctx.fill();
            });

            requestAnimationFrame(renderDust);
        }
        renderDust();
    }

    // ----------------------------------------------------------------------
    // 5. CANVAS 2: FALLING ALMOND BLOSSOM PETALS
    // ----------------------------------------------------------------------
    const petalsCanvas = document.getElementById('petalsCanvas');
    if (petalsCanvas) {
        const ctx = petalsCanvas.getContext('2d');
        let width = petalsCanvas.width = window.innerWidth;
        let height = petalsCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = petalsCanvas.width = window.innerWidth;
            height = petalsCanvas.height = window.innerHeight;
        });

        const petals = [];
        const PETAL_COUNT = window.innerWidth < 768 ? 16 : 30;


        for (let i = 0; i < PETAL_COUNT; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                size: Math.random() * 10 + 10,
                speedY: Math.random() * 1.2 + 0.8,
                speedX: Math.random() * 0.8 - 0.4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                swing: Math.random() * Math.PI * 2,
                swingSpeed: Math.random() * 0.03 + 0.01,
                opacity: Math.random() * 0.4 + 0.6
            });
        }

        function drawPetal(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;

            // Draw organic petal shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 1.2, p.size * 0.3, 0, p.size * 1.2);
            ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.3, -p.size * 0.6, -p.size * 0.8, 0, 0);

            // Soft blush champagne gradient for almond petal
            const gradient = ctx.createLinearGradient(0, 0, p.size, p.size);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.6, '#F8ECE9');
            gradient.addColorStop(1, '#E8CFCA');

            ctx.fillStyle = gradient;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
            ctx.fill();
            ctx.restore();
        }

        function renderPetals() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(p => {
                p.swing += p.swingSpeed;
                p.x += Math.sin(p.swing) * 0.8 + p.speedX;
                p.y += p.speedY * scrollSpeedFactor;
                p.rotation += p.rotationSpeed;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                drawPetal(p);
            });

            requestAnimationFrame(renderPetals);
        }
        renderPetals();
    }

    // ----------------------------------------------------------------------
    // 6. RSVP FORM TOGGLE & SUBMISSION
    // ----------------------------------------------------------------------
    const rsvpForm = document.getElementById('rsvpForm');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const guestsCountGroup = document.getElementById('guestsCountGroup');
    const dietaryGroup = document.getElementById('dietaryGroup');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const modalMessage = document.getElementById('modalMessage');

    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'decline') {
                if (guestsCountGroup) guestsCountGroup.style.display = 'none';
                if (dietaryGroup) dietaryGroup.style.display = 'none';
            } else {
                if (guestsCountGroup) guestsCountGroup.style.display = 'block';
                if (dietaryGroup) dietaryGroup.style.display = 'block';
            }
        });
    });

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(rsvpForm);
            const guestName = formData.get('guestName');
            const guestContact = formData.get('guestContact');
            const attendance = formData.get('attendance');
            const guestsCount = formData.get('guestsCount');
            const dietary = formData.getAll('dietary');
            const songRequest = formData.get('songRequest');

            const responseObj = {
                guestName,
                guestContact,
                attendance,
                guestsCount: attendance === 'accept' ? guestsCount : 0,
                dietary,
                songRequest,
                timestamp: new Date().toISOString()
            };

            const existingResponses = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
            existingResponses.push(responseObj);
            localStorage.setItem('wedding_rsvp_responses', JSON.stringify(existingResponses));

            if (attendance === 'accept') {
                if (modalMessage) modalMessage.innerText = `Dear ${guestName}, we are overjoyed to celebrate with you on June 20th, 2026!`;
            } else {
                if (modalMessage) modalMessage.innerText = `Dear ${guestName}, thank you for letting us know. You will be dearly missed!`;
            }

            if (successModal) successModal.classList.add('active');
            rsvpForm.reset();
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (successModal) successModal.classList.remove('active');
        });
    }

    // ----------------------------------------------------------------------
    // 7. CUSTOM MP3 AUDIO PLAYER (Kamro - Dernière Enigma Slowed Reverb)
    // Starts strictly upon first scroll gesture from 29th second with smooth volume fade-in
    // ----------------------------------------------------------------------
    const audioToggle = document.getElementById('audioToggle');
    const soundWave = document.getElementById('soundWave');
    const bgAudio = document.getElementById('bgAudio') || new Audio('assets/music.mp3');

    bgAudio.loop = true;
    let isPlaying = false;
    let fadeInterval = null;

    function playMusicWithFadeIn() {
        if (isPlaying) return;

        // Set start position strictly to 29 seconds as requested
        if (bgAudio.currentTime < 29 || bgAudio.paused) {
            bgAudio.currentTime = 29;
        }

        bgAudio.volume = 0;
        const playPromise = bgAudio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                if (soundWave) soundWave.classList.remove('hidden');
                if (audioToggle) audioToggle.style.borderColor = 'var(--color-accent-taupe)';

                // Smooth volume fade-in from 0 to 0.75 over 2.5 seconds
                let currentVol = 0;
                if (fadeInterval) clearInterval(fadeInterval);
                fadeInterval = setInterval(() => {
                    if (currentVol < 0.75) {
                        currentVol += 0.03;
                        bgAudio.volume = Math.min(currentVol, 0.75);
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 100);
            }).catch(err => {
                console.log('Scroll audio trigger caught by browser policy:', err);
            });
        }
    }

    function pauseMusic() {
        isPlaying = false;
        if (fadeInterval) clearInterval(fadeInterval);

        let currentVol = bgAudio.volume;
        fadeInterval = setInterval(() => {
            if (currentVol > 0.05) {
                currentVol -= 0.05;
                bgAudio.volume = Math.max(currentVol, 0);
            } else {
                bgAudio.pause();
                bgAudio.volume = 0;
                clearInterval(fadeInterval);
                if (soundWave) soundWave.classList.add('hidden');
                if (audioToggle) audioToggle.style.borderColor = 'var(--color-border)';
            }
        }, 50);
    }

    // Scroll Trigger Handler — Starts music strictly upon first scroll
    const scrollAudioHandler = () => {
        if (!isPlaying) {
            playMusicWithFadeIn();
        }
    };

    // Attach listeners for first scroll / touch gesture
    window.addEventListener('scroll', scrollAudioHandler);
    document.addEventListener('scroll', scrollAudioHandler);
    document.addEventListener('wheel', scrollAudioHandler);
    document.addEventListener('touchmove', scrollAudioHandler);

    // Manual Audio Toggle Button (top right)
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusicWithFadeIn();
            }
        });
    }
});




