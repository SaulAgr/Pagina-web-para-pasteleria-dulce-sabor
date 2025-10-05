// ========== NAVEGACIÓN ========== 
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const scrollIndicator = document.querySelector('.scroll-indicator');
const heroContent = document.querySelector('.hero-content');
const hero = document.querySelector('.hero');

// Efecto de scroll optimizado
let ticking = false;
const navbarHeight = navbar.offsetHeight;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // Navbar y scroll top
            const isScrolled = scrollY > 100;
            navbar.classList.toggle('scrolled', isScrolled);
            scrollTopBtn.classList.toggle('visible', isScrolled);

            // Scroll indicator
            if (scrollIndicator) {
                scrollIndicator.classList.toggle('hidden', scrollY > 50);
            }

            // Hero content fade
            if (heroContent && hero) {
                const heroHeight = hero.offsetHeight;
                const fadeStart = 50;
                const fadeUntil = heroHeight * 0.7;
                
                if (scrollY >= fadeStart) {
                    const fadeProgress = Math.min((scrollY - fadeStart) / (fadeUntil - fadeStart), 1);
                    const opacity = Math.max(1 - fadeProgress, 0.1);
                    const translateY = fadeProgress * 40;
                    
                    heroContent.style.cssText = `opacity: ${opacity}; transform: translateY(-${translateY}px); filter: blur(${fadeProgress * 2}px)`;
                } else {
                    heroContent.style.cssText = 'opacity: 1; transform: translateY(0); filter: blur(0px)';
                }
            }

            // Active nav link
            let current = '';
            document.querySelectorAll('section').forEach(section => {
                if (scrollY >= (section.offsetTop - navbarHeight - 200)) {
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle('active', link.hash === `#${current}`);
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// Menu toggle
const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
};

menuToggle.addEventListener('click', toggleMenu);
navLinks.forEach(link => link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.hash);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to top
scrollTopBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

// ========== FILTROS DEL MENÚ ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        menuItems.forEach((item, index) => {
            const isVisible = filter === 'all' || item.dataset.category === filter;
            
            item.style.cssText = 'transition: none; opacity: 0; transform: scale(0.8)';

            setTimeout(() => {
                if (isVisible) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.cssText = 'transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); opacity: 1; transform: scale(1)';
                    }, index * 50);
                } else {
                    item.style.display = 'none';
                }
            }, 200);
        });
    });
});

// ========== BOTONES DE MENÚ ==========
const quickViewBtns = document.querySelectorAll('.quick-view');
const addCartBtns = document.querySelectorAll('.add-cart');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.closest('.menu-item').querySelector('h3').textContent;
        
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);
        alert(`Vista rápida de: ${productName}\n\n¡Próximamente más detalles!`);
    });
});

addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const menuItem = btn.closest('.menu-item');
        const productName = menuItem.querySelector('h3').textContent;
        const productPrice = menuItem.querySelector('.price').textContent;
        
        const originalText = btn.textContent;
        btn.textContent = '✓ Agregado';
        btn.style.background = '#4caf50';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);

        console.log(`Producto agregado: ${productName} - ${productPrice}`);
    });
});

// ========== FORMULARIO DE CONTACTO ==========
const contactForm = document.getElementById('contactForm');
const formFields = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = formFields.reduce((data, field) => {
        data[field] = document.getElementById(field).value;
        return data;
    }, {});
    
    if (!Object.values(formData).every(value => value.trim())) {
        alert('Por favor, completa todos los campos');
        return;
    }

    const submitBtn = contactForm.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span>Enviando...</span>';
    submitBtn.style.background = 'var(--secondary-color)';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ Enviado</span>';
        submitBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            alert(`¡Gracias ${formData.nombre}!\n\nTu mensaje ha sido enviado exitosamente.\nNos pondremos en contacto contigo pronto.`);
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 1000);
    }, 2000);
});

// ========== ANIMACIONES AL HACER SCROLL ==========
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -80px 0px' };
const animatedElements = new Set();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animatedElements.has(entry.target)) {
            entry.target.style.cssText = 'opacity: 1; transform: translateY(0)';
            animatedElements.add(entry.target);
            
            if (entry.target.classList.contains('stat-card')) {
                setTimeout(() => animateCounter(entry.target), 200);
            }
        }
    });
}, observerOptions);

const animatedItems = document.querySelectorAll('.stat-card, .info-item, .about-feature');
animatedItems.forEach(item => {
    item.style.cssText = 'opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(item);
});

// ========== ANIMACIÓN DE CONTADORES MEJORADA Y OPTIMIZADA ==========
const animatedCounters = new Set();

function animateCounter(element) {
    if (animatedCounters.has(element)) return;
    animatedCounters.add(element);
    
    const target = element.querySelector('.stat-number');
    if (!target) return;
    
    const text = target.textContent.trim();
    const finalNumber = parseInt(text.replace(/\D/g, ''));
    const hasPlusSign = text.includes('+');
    
    if (isNaN(finalNumber)) return;
    
    // Layout bloqueado
    target.style.cssText = 'width: 100%; height: 75px; display: flex; align-items: center; justify-content: center; overflow: hidden';
    
    const duration = 2500;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(finalNumber * easeOutCubic);
        
        target.textContent = current + (hasPlusSign ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            target.textContent = finalNumber + (hasPlusSign ? '+' : '');
        }
    };
    
    requestAnimationFrame(animate);
}

// ========== EFECTOS ADICIONALES ==========
// Parallax effect optimizado
let heroParallaxTicking = false;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (!heroParallaxTicking) {
        window.requestAnimationFrame(() => {
            if (hero && scrollY < window.innerHeight) {
                hero.style.transform = `translateY(${scrollY * 0.4}px)`;
            }
            heroParallaxTicking = false;
        });
        heroParallaxTicking = true;
    }
});

// Efecto hover en tarjetas del menú
menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => item.style.zIndex = '10');
    item.addEventListener('mouseleave', () => item.style.zIndex = '1');
});

// Mensaje de bienvenida
console.log('%c🧁 Bienvenido a Dulce Sabor 🧁', 'font-size: 20px; color: #d4a574; font-weight: bold;');
console.log('%c¡Gracias por visitar nuestra página!', 'font-size: 14px; color: #5a4a42;');

// Inicializar animaciones al cargar
window.addEventListener('load', () => {
    menuItems.forEach(item => {
        item.style.cssText = 'opacity: 1; transform: translateY(0)';
    });
});