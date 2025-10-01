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
                    "number": { "value": 120, "density": { "enable": true, "value_area": 800 } }, 
                    "color": { "value": "#ffffff" }, 
                    "shape": { "type": "circle" }, 
                    "opacity": { "value": 0.5, "random": false }, 
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
            sr.reveal('.hero-content, .section-title, .timeline-item, .glass-card, .skill-icon, .cert-logo-link');
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
    
    // ADDED: New function for experience accordion
    const initExperienceAccordion = () => {
        const headers = document.querySelectorAll('.timeline-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.closest('.timeline-content');
                const isOpen = content.classList.contains('open');

                // Close all other items
                document.querySelectorAll('.timeline-content').forEach(item => {
                    item.classList.remove('open');
                });

                // If the clicked item was not already open, open it
                if (!isOpen) {
                    content.classList.add('open');
                }
            });
        });
    };

    const initProjectSlider = () => {
        const track = document.querySelector('.projects-track');
        const prevButton = document.querySelector('.slider-nav.prev');
        const nextButton = document.querySelector('.slider-nav.next');
        const cards = document.querySelectorAll('.project-card');
        const dotsContainer = document.querySelector('.slider-dots');
        
        if (!track || !prevButton || !nextButton || !cards.length || !dotsContainer) return;

        // Calculate number of possible shifts (total cards minus 1)
        const numShifts = cards.length - 1;
        
        // Clear existing dots and create new ones
        dotsContainer.innerHTML = '';
        for (let i = 0; i < numShifts; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to project ${i + 1}`);
            dot.addEventListener('click', () => scrollToCard(i));
            dotsContainer.appendChild(dot);
        }
        
        const dots = document.querySelectorAll('.slider-dots .dot');

        // Calculate single card width including gap
        const cardStyle = window.getComputedStyle(cards[0]);
        const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight || '0');
        let currentIndex = 0;

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const updateButtons = () => {
            // Hide/show buttons instead of changing opacity
            prevButton.style.visibility = currentIndex <= 0 ? 'hidden' : 'visible';
            nextButton.style.visibility = currentIndex >= cards.length - 2 ? 'hidden' : 'visible';
            updateDots();
        };

        const scrollToCard = (index) => {
            const maxIndex = cards.length - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            const scrollPos = currentIndex * cardWidth;
            track.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
            updateButtons();
        };

        prevButton.addEventListener('click', () => scrollToCard(currentIndex - 1));
        nextButton.addEventListener('click', () => scrollToCard(currentIndex + 1));
        
        // Initial scroll to ensure first two cards are visible
        scrollToCard(0);

        // Handle scroll events to update button states
        track.addEventListener('scroll', () => {
            currentIndex = Math.round(track.scrollLeft / cardWidth);
            updateButtons();
        });

        // Add click handlers for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => scrollToCard(index));
        });

        // Initial button state
        updateButtons();

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                cardWidth = track.offsetWidth;
                scrollToCard(currentIndex);
            }, 100);
        });
    };

    // Initialize all functionalities
    initMouseAura();
    initSidebar();
    initParticles();
    initTyped();
    initScrollReveal();
    initScrollSpy();
    initExperienceAccordion();
    initProjectSlider(); // Initialize the project slider
});