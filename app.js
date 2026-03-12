/**
 * ABOSORB - Main Website Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initScrollAnimations();
    initFiltrationSim();
});

/**
 * Header transparency and scroll effect
 */
function initHeader() {
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.backgroundColor = 'rgba(3, 7, 18, 0.9)';
        } else {
            header.style.padding = '1rem 0';
            header.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
        }
    });
}

/**
 * Reveal animations on scroll
 */
function initScrollAnimations() {
    const observers = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observers.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        // We start with opacity 0 in CSS and let the reveal class animate it
        el.style.opacity = '0'; 
        observers.observe(el);
    });
}

/**
 * Particle Simulation for Filtration Impact
 */
function initFiltrationSim() {
    const canvas = document.getElementById('filtration-sim');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    let particles = [];
    const particleCount = 100;
    const filterZoneX = 0.7; // 70% of the way across
    
    function resize() {
        canvas.width = container.offsetWidth * window.devicePixelRatio;
        canvas.height = container.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * (canvas.width / window.devicePixelRatio);
            this.y = Math.random() * (canvas.height / window.devicePixelRatio);
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 + 1;
            this.isClean = this.x > (canvas.width / window.devicePixelRatio) * filterZoneX;
            this.color = this.isClean ? '#0ea5e9' : '#334155'; // Clean blue vs Dirty grey
        }

        update() {
            this.x += this.speedX;
            
            // If it crosses the filter zone, it becomes clean
            const threshold = (canvas.width / window.devicePixelRatio) * filterZoneX;
            if (!this.isClean && this.x > threshold) {
                this.isClean = true;
                this.color = '#0ea5e9';
                this.speedX *= 1.2; // Speed up clean water
            }

            if (this.x > (canvas.width / window.devicePixelRatio)) {
                this.reset();
                this.x = 0;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw filter line/cell representation
    function drawFilter() {
        const x = (canvas.width / window.devicePixelRatio) * filterZoneX;
        const h = (canvas.height / window.devicePixelRatio);
        
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = '#22d3ee';
        ctx.font = '10px Space Grotesk';
        ctx.fillText('ABOSORB FILTER ZONE', x - 110, 20);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawFilter();
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
}
