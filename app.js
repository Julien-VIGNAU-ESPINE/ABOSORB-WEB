/**
 * ABSORB - Radical Engineering for Water Purity
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initiation of immersive sequence
    initImmersiveSequence();

    initHeader();
    initScrollAnimations();
    initFiltrationSim();
});

/**
 * Handles the preloader and entrance animations
 */
function initImmersiveSequence() {
    const preloader = document.getElementById('preloader');

    // Trigger on window fully loaded to ensure assets are ready
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                // Start ripple effect
                preloader.classList.add('ripple-active');

                setTimeout(() => {
                    // Fade out preloader and show site
                    preloader.classList.add('fade-out');
                    document.body.classList.remove('no-js');
                    document.body.classList.add('loaded');

                }, 600); // Expanded wait for the 2s ripple
            }
        }, 1000); // Premium pause on Petroleum Blue
    });
}

/**
 * Navigation Header Management
 * Handles scroll-based styling and transparency
 */
function initHeader() {
    const header = document.getElementById('main-header');
    const heroActions = document.querySelector('.hero-actions');
    if (!header) return;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Header reveal on scroll
        if (scrollY > 150) {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
            header.style.padding = '0.75rem 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
        } else {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            header.style.padding = '1.25rem 0';
            header.style.backgroundColor = 'transparent';
            header.style.borderBottom = 'none';
        }

        // Hero buttons reveal on scroll
        if (heroActions) {
            if (scrollY > 60) {
                heroActions.style.opacity = '1';
                heroActions.style.transform = 'translateY(0)';
            } else {
                heroActions.style.opacity = '0';
                heroActions.style.transform = 'translateY(20px)';
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init state
}

function initStatCounters() {
    const stats = document.querySelectorAll('.stat-num');

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * target);

            stat.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                stat.textContent = target;
            }
        }

        requestAnimationFrame(animate);
    });
}

/**
 * Scroll Reveal Animations
 * Uses IntersectionObserver for high performance
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-item');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger stat counters if this is the impact section
                if (entry.target.closest('#impact')) {
                    setTimeout(initStatCounters, 400); // Small delay for visual sync
                }

                observers.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observers.observe(el));
}

/**
 * High-Performance Filtration Particle Simulation
 * Represents the ABSORB impact in harbor waters
 */
function initFiltrationSim() {
    const canvas = document.getElementById('filtration-sim');
    const container = document.getElementById('filtration-canvas-container');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let w, h;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    const particleCount = 400;
    const filterZonePercent = 0.65; // Zone positioned at 65% of width

    // Robust resizing using ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            w = width;
            h = height;
            canvas.width = w * window.devicePixelRatio;
            canvas.height = h * window.devicePixelRatio;
            ctx.resetTransform();
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            // Re-init particles on significant resize to prevent gaps
            if (particles.length === 0) initParticles();
        }
    });

    resizeObserver.observe(container);

    // Mouse tracking for interaction
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() {
            this.init(true);
        }

        init(randomX = false) {
            this.x = randomX ? Math.random() * w : -20;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.baseSpeed = Math.random() * 1.5 + 0.8;
            this.speedX = this.baseSpeed;
            this.isClean = this.x > w * filterZonePercent;

            // Movement parameters
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = Math.random() * 0.05 + 0.02;
            this.amplitude = Math.random() * 1.5;

            // Visual parameters
            this.updateAppearance();
            this.opacity = Math.random() * 0.6 + 0.3;
        }

        updateAppearance() {
            if (this.isClean) {
                this.hue = 200; // Bright Blue
                this.saturation = 80;
                this.lightness = 65;
            } else {
                this.hue = 210; // Dark / Muddy oily color
                this.saturation = 20;
                this.lightness = 25;
            }
        }

        update() {
            // Wave movement
            this.angle += this.angleSpeed;
            this.y += Math.sin(this.angle) * this.amplitude;

            this.x += this.speedX;

            // Filtration logic
            const filterX = w * filterZonePercent;
            if (!this.isClean && this.x > filterX) {
                this.triggerPurification();
            }

            // Mouse interaction - Active cleaning
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && !this.isClean) {
                this.triggerPurification(true);
            }

            // Reset when off screen
            if (this.x > w + 40) {
                this.init(false);
            }
        }

        triggerPurification(isMouse = false) {
            this.isClean = true;
            this.updateAppearance();
            this.speedX = this.baseSpeed * (isMouse ? 2 : 1.5);
            if (isMouse) {
                this.lightness = 80;
                this.saturation = 100;
            }
        }

        draw() {
            ctx.save();
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;

            if (this.isClean) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.6)`;
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawInfrastructure() {
        const fx = w * filterZonePercent;
        const time = Date.now() * 0.002;
        const pulse = Math.sin(time) * 10 + 20;

        // The Glow Zone - Dynamic Pulse
        const grad = ctx.createLinearGradient(fx - 40, 0, fx + 40, 0);
        grad.addColorStop(0, 'rgba(14, 165, 233, 0)');
        grad.addColorStop(0.5, `rgba(34, 211, 238, ${0.1 + Math.sin(time * 0.5) * 0.05})`);
        grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(fx - 40, 0, 80, h);

        // Tech Line with Scanning effect
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.setLineDash([5, 10]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, 0);
        ctx.lineTo(fx, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Scanning Dot
        const scanY = (Date.now() * 0.1) % (h + 100) - 50;
        ctx.fillStyle = '#22d3ee';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#22d3ee';
        ctx.beginPath();
        ctx.arc(fx, scanY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Interactive Label - Sober & Modern
        ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.font = '700 9px Sora, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.save();
        ctx.translate(fx + 20, h / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('OVICELL ACTIVE - ABSORB', 0, 0);
        ctx.restore();
    }

    function animate() {
        if (!w || !h) {
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, w, h);

        drawInfrastructure();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
