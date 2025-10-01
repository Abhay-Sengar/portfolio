document.addEventListener("DOMContentLoaded", () => {
    
    const initMouseAura = () => {
        const blob = document.getElementById("cursor-blob");
        if (!blob) return;
        document.body.onpointermove = event => {
            const { clientX, clientY } = event;
            blob.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 3000, fill: "forwards" });
        };
    };

    const initSidebar = () => {
        const toggleButton = document.getElementById("sidebar-toggle");
        const body = document.body;
        if (window.innerWidth <= 992 && window.innerWidth > 768) {
             body.classList.add('sidebar-collapsed');
        }
        toggleButton.addEventListener("click", () => {
            if (window.innerWidth > 768) {
                body.classList.toggle('sidebar-collapsed');
                body.classList.remove('sidebar-expanded');
            } else {
                body.classList.toggle('sidebar-expanded');
                body.classList.remove('sidebar-collapsed');
            }
        });
        document.querySelectorAll('.sidebar-links a').forEach(link => {
            link.addEventListener('click', () => { if (window.innerWidth <= 768) body.classList.remove('sidebar-expanded'); });
        });
    };
    
    const initParticles = () => {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": { 
                    "number": { "value": 100, "density": { "enable": true, "value_area": 800 } }, 
                    "color": { "value": "#ffffff" }, 
                    "shape": { "type": "circle" }, 
                    "opacity": { "value": 0.3, "random": false }, 
                    "size": { "value": 3, "random": true }, 
                    "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.6, "width": 1 }, 
                    "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" } 
                },
                "interactivity": { 
                    "detect_on": "canvas", 
                    "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } }, 
                    "modes": { "repulse": { "distance": 80, "duration": 0.4 }, "push": { "particles_nb": 4 } } 
                },
                "retina_detect": true
            });
        }
    };

    const initTyped = () => {
        if (typeof Typed !== 'undefined') {
            new Typed(".typed-text", {
                strings: ["Software Developer", "Cybersecurity Researcher", "AI-ML Enthusiast"],
                typeSpeed: 50, backSpeed: 30, loop: true, backDelay: 2000,
            });
        }
    };

    const initScrollReveal = () => {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'bottom', distance: '50px', duration: 1000, delay: 200, reset: false
            });
            sr.reveal('.hero-content, .section-title, .timeline-item, .glass-card, .skill-icon');
        }
    };

    const initScrollSpy = () => {
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll(".sidebar-links a");
        window.addEventListener('scroll', () => {
            let current = 'hero';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) current = section.getAttribute('id');
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
            });
        });
    };

    // Initialize all functionalities
    initMouseAura();
    initSidebar();
    initParticles();
    initTyped();
    initScrollReveal();
    initScrollSpy();
});