// main.js - Vanilla JS Scroll Reveal for Executive Minimalist Portfolio
// No external libraries. Pure Intersection Observer API.

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Hero Entrance Animation (Triggers on page load) ──
    // Hero elements animate in immediately upon page load, 
    // respecting their individual transition-delay set in HTML.
    const heroReveals = document.querySelectorAll('.hero .reveal');

    // Small delay to ensure CSS is painted before triggering animation
    setTimeout(() => {
        heroReveals.forEach(el => {
            el.classList.add('active');
        });
    }, 100);


    // ── 2. Scroll Reveal (Triggers on scroll into viewport) ──
    const scrollReveals = document.querySelectorAll('main .reveal:not(.hero .reveal), footer .reveal');

    const observerOptions = {
        root: null,          // Use viewport
        rootMargin: '0px',
        threshold: 0.15      // Trigger when 15% of element is visible
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    scrollReveals.forEach(el => {
        revealObserver.observe(el);
    });


    // ── 3. Smooth Header Blur on Scroll ──
    const header = document.querySelector('.site-header');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.style.borderBottomColor = 'rgba(0,0,0,0.08)';
        } else {
            header.style.borderBottomColor = 'rgba(0,0,0,0.05)';
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

});
