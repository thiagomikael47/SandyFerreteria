// ===== MENÚ HAMBURGUESA =====
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId);
    const nav    = document.getElementById(navId);
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        nav.classList.toggle('show-menu');
        toggle.classList.toggle('show-icon');
    });
};
showMenu('nav-toggle', 'nav-menu');

// ===== ACORDEÓN DROPDOWN EN MÓVIL =====
document.querySelectorAll('.dropdown__item').forEach(item => {
    const trigger = item.querySelector('.nav__link--drop, .nav__link');
    const menu    = item.querySelector('.dropdown__menu');
    const arrow   = item.querySelector('.dropdown__arrow');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', () => {
        if (window.innerWidth > 768) return;

        const isOpen = menu.classList.contains('open');

        document.querySelectorAll('.dropdown__menu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.dropdown__arrow.rotated').forEach(a => a.classList.remove('rotated'));

        if (!isOpen) {
            menu.classList.add('open');
            if (arrow) arrow.classList.add('rotated');
        }
    });
});

// Acordeón de submenús en móvil
document.querySelectorAll('.dropdown__subitem > .dropdown__link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth > 1118) return;
        const submenu = link.nextElementSibling;
        if (!submenu) return;
        submenu.classList.toggle('open');
    });
});

// ===== CAROUSEL PRINCIPAL =====
if (document.querySelector('.carousel')) {
    class ModernCarousel {
        constructor() {
            this.currentIndex = 0;
            this.slides = document.querySelectorAll('.carousel__slide');
            this.dots = document.querySelectorAll('.carousel__dot');
            this.track = document.querySelector('.carousel__track');
            this.progressBar = document.querySelector('.carousel__progress-bar');
            this.counter = document.querySelector('.carousel__counter-current');
            this.totalSlides = this.slides.length;
            this.autoPlayInterval = null;
            this.autoPlayDuration = 5000;
            if (this.totalSlides > 0) this.init();
        }

        init() {
            const leftArrow = document.querySelector('.carousel__arrow--left');
            const rightArrow = document.querySelector('.carousel__arrow--right');

            if (leftArrow) leftArrow.addEventListener('click', () => this.goToSlide(this.currentIndex - 1));
            if (rightArrow) rightArrow.addEventListener('click', () => this.goToSlide(this.currentIndex + 1));

            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            const carousel = document.querySelector('.carousel');
            carousel.addEventListener('mouseenter', () => this.pause());
            carousel.addEventListener('mouseleave', () => this.play());

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.goToSlide(this.currentIndex - 1);
                if (e.key === 'ArrowRight') this.goToSlide(this.currentIndex + 1);
            });

            let touchStartX = 0;
            carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
            carousel.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (diff > 50) this.goToSlide(this.currentIndex + 1);
                else if (diff < -50) this.goToSlide(this.currentIndex - 1);
            });

            this.play();
        }

        goToSlide(index) {
            if (index < 0) this.currentIndex = this.totalSlides - 1;
            else if (index >= this.totalSlides) this.currentIndex = 0;
            else this.currentIndex = index;

            if (this.track) this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;

            this.slides.forEach((slide, i) => slide.classList.toggle('active', i === this.currentIndex));
            this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));

            if (this.counter) this.counter.textContent = (this.currentIndex + 1).toString().padStart(2, '0');

            this.resetProgress();
            this.play();
        }

        resetProgress() {
            if (!this.progressBar) return;
            this.progressBar.classList.remove('active');
            void this.progressBar.offsetWidth;
            this.progressBar.classList.add('active');
        }

        play() {
            this.pause();
            this.resetProgress();
            this.autoPlayInterval = setInterval(() => this.goToSlide(this.currentIndex + 1), this.autoPlayDuration);
        }

        pause() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
            if (this.progressBar) this.progressBar.classList.remove('active');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new ModernCarousel();
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== CARRUSEL DE MARCAS =====
const carruselEl = document.querySelector('.carrusel-items');
if (carruselEl) {
    let step = 1;
    let intervalo = null;

    const startBrands = () => {
        intervalo = setInterval(() => {
            carruselEl.scrollLeft += step;
            const maxScroll = carruselEl.scrollWidth - carruselEl.clientWidth;
            if (carruselEl.scrollLeft >= maxScroll) step = -Math.abs(step);
            else if (carruselEl.scrollLeft <= 0) step = Math.abs(step);
        }, 15);
    };

    const stopBrands = () => clearInterval(intervalo);

    carruselEl.addEventListener('mouseover', stopBrands);
    carruselEl.addEventListener('mouseout', startBrands);
    startBrands();
}

// ===== SCROLL REVEAL =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.style.animation || 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.item').forEach(item => observer.observe(item));

// ===== FORM VALIDATION (solo en páginas con formulario) =====
const form = document.querySelector('form');
if (form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.style.animation = 'shake 0.5s ease';
            input.style.borderColor = '#ef4444';
            setTimeout(() => { input.style.animation = ''; }, 500);
        });

        input.addEventListener('input', () => {
            if (input.validity.valid) input.style.borderColor = '';
        });

        input.addEventListener('focus', () => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transform = 'translateY(-5px)';
                label.style.color = '#FDB912';
            }
        });

        input.addEventListener('blur', () => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transform = 'translateY(0)';
                label.style.color = '';
            }
        });
    });

    form.addEventListener('submit', () => {
        const submitBtn = form.querySelector('input[type="submit"]');
        if (submitBtn) submitBtn.style.opacity = '0.7';
    });
}
