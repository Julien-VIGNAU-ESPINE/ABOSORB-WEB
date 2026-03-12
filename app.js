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

                }, 1200); // Expanded wait for the 2s ripple
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

/**
 * Scroll Reveal Animations
 * Uses IntersectionObserver for high performance
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
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
    const particleCount = 250;
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
            this.x = randomX ? Math.random() * w : -10;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseSpeed = Math.random() * 1.5 + 1;
            this.speedX = this.baseSpeed;
            this.isClean = this.x > w * filterZonePercent;
            this.hue = this.isClean ? 200 : 210; // Blue vs Dark Grey-Blue
            this.saturation = this.isClean ? 80 : 10;
            this.lightness = this.isClean ? 60 : 30;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;

            // Filtration logic
            const filterX = w * filterZonePercent;
            if (!this.isClean && this.x > filterX) {
                this.isClean = true;
                this.lightness = 60;
                this.saturation = 80;
                this.hue = 200;
                this.speedX = this.baseSpeed * 1.4; // Clean water flows faster
            }

            // Mouse interaction - "Clean" water on touch
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60 && !this.isClean) {
                this.isClean = true;
                this.lightness = 70;
                this.saturation = 100;
                this.hue = 190;
            }

            // Reset when off screen
            if (this.x > w + 20) {
                this.init(false);
            }
        }

        draw() {
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Glow for clean particles
            if (this.isClean) {
                ctx.shadowBlur = 4;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.5)`;
            } else {
                ctx.shadowBlur = 0;
            }
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

        // The Glow Zone
        const grad = ctx.createLinearGradient(fx - 20, 0, fx + 20, 0);
        grad.addColorStop(0, 'rgba(14, 165, 233, 0)');
        grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.2)');
        grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(fx - 30, 0, 60, h);

        // Tech Line
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.setLineDash([10, 15]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx, 0);
        ctx.lineTo(fx, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Interactive Label
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.font = '600 10px Inter';
        ctx.letterSpacing = '1px';
        ctx.fillText('ZONE DE FILTRATION ABSORB', fx + 15, 25);
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
