/**
 * ABSORB - Radical Engineering for Water Purity
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initiation of immersive sequence
    initImmersiveSequence();

    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initFiltrationSim();
});

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const wrapper = document.querySelector('.nav-wrapper');
    const body = document.body;

    if (!toggle || !wrapper) return;

    const icons = toggle.querySelectorAll('i');

    const toggleMenu = (forceClose = false) => {
        if (forceClose) {
            wrapper.classList.remove('active');
            body.classList.remove('menu-open');
            icons[0].classList.remove('hidden');
            icons[1].classList.add('hidden');
        } else {
            const isOpen = wrapper.classList.toggle('active');
            body.classList.toggle('menu-open');
            icons[0].classList.toggle('hidden', isOpen);
            icons[1].classList.toggle('hidden', !isOpen);
        }
    };

    toggle.addEventListener('click', () => toggleMenu());

    // Close menu when clicking on a link
    const navLinks = wrapper.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // Close menu when clicking outside (on the overlay)
    wrapper.addEventListener('click', (e) => {
        if (e.target === wrapper) toggleMenu(true);
    });
}

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
/**
 * Cinema-Grade Filtration Simulation
 * A sophisticated fluid-like particle system representing the Ovicell impact
 */
function initFiltrationSim() {
    // Blueprint logic implemented via CSS
}
