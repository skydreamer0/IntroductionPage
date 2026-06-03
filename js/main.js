document.addEventListener('DOMContentLoaded', function () {
    // 加載導航欄
    fetch('components/nav.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            // 在導航加載完成後初始化活動狀態
            initializeActiveNav();
            // 調整主內容的填充
            adjustMainPadding();
            // 初始化導航滾動效果
            initNavScroll();
        })
        .catch(error => {
            console.error('Error loading navigation:', error);
        });

    // 初始化導航活動狀態
    function initializeActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // 調整主內容的填充
    function adjustMainPadding() {
        const nav = document.querySelector('nav');
        const main = document.querySelector('main');

        if (nav && main) {
            const navHeight = nav.offsetHeight;
            main.style.paddingTop = (navHeight + 20) + 'px';
        }
    }

    // 導航滾動效果
    function initNavScroll() {
        window.addEventListener('scroll', function () {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }

    // 確保在視窗調整大小時也更新填充
    window.addEventListener('resize', adjustMainPadding);

    // Lightbox options
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
    }

    $(document).on('lightbox:opened', function () {
        if ($('#lightbox-back-button').length === 0) {
            $('<button id="lightbox-back-button" class="lightbox-back-button">Back</button>')
                .appendTo('body')
                .on('click', function () {
                    window.history.back();
                });
        }
    });

    $(document).on('lightbox:closed', function () {
        $('#lightbox-back-button').remove();
    });

    // 監聽按鍵事件
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (typeof lightbox !== 'undefined' && typeof lightbox.close === 'function') {
                lightbox.close();
            }
        }
    });

    // ============================
    // Scroll Reveal Animation
    // ============================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Apply reveal to major sections and cards
    const revealSelectors = [
        '.about-content',
        '.stat-item',
        '.timeline-item',
        '.timeline-card',
        '.cert-card',
        '.project-card',
        '.skill-card',
        '.skill-section',
        '.highlight-box',
        '.certification-card',
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 0.08}s`;
            revealObserver.observe(el);
        });
    });

    // 添加滾動動畫 for timeline items
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item, .experience-card').forEach((el, index) => {
        el.style.setProperty('--item-index', index);
        timelineObserver.observe(el);
    });

    // ============================
    // Number Counter Animation
    // ============================
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            if (!target) return;

            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateNumber = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };

            const numberObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateNumber();
                        numberObserver.unobserve(entry.target);
                    }
                });
            });

            numberObserver.observe(stat);
        });
    }

    // 初始化數字動畫
    animateNumbers();

    // ============================
    // Smooth Scroll for anchors
    // ============================
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
