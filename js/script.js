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
        // Exit if the ScrollReveal library isn't loaded
        if (typeof ScrollReveal === 'undefined') {
            return; 
        }

        // 1. General instance for all elements on the main page scroll
        const srPage = ScrollReveal({
            origin: 'bottom',
            distance: '50px',
            duration: 1000,
            delay: 200,
            reset: false
        });

        // Animate all general elements, EXCLUDING both project and recommendation cards inside sliders.
        srPage.reveal('.hero-content, .section-title, .timeline-item, .glass-card:not(.project-card):not(.recommendation-card), .skill-icon, .cert-logo-link, .floating-logos-container, .about-profile-pic, .about-logos');

        // 2. A second, specific instance for the project cards inside the slider
        const projectTrackContainer = document.querySelector('.projects-track');

        // Make sure the container element exists before trying to initialize ScrollReveal on it
        if (projectTrackContainer) {
            ScrollReveal().reveal('.project-card', {
                // --- THIS IS THE CRITICAL FIX ---
                // The container MUST be the element that actually scrolls (.projects-track)
                container: projectTrackContainer,
                
                // Configuration for the animation
                origin: 'bottom',
                distance: '50px',
                duration: 800,
                delay: 200,
                // 'interval' creates a nice staggered effect for items in a sequence
                interval: 150, 
                reset: false,
                // This can help trigger the animation as soon as 10% of the card is visible
                viewFactor: 0.1 
            });
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
        
        if (!track || !prevButton || !nextButton || !cards.length || !dotsContainer) {
            return; // Exit if any element is missing
        }

        // --- HELPER FUNCTION ---
        // This function calculates the full width of a single card, including its margin.
        // It's defined here so the rest of the code can use it.
        const calculateCardWidth = () => {
            // We need to check if cards[0] exists before trying to access it
            if (cards[0]) {
                const cardStyle = window.getComputedStyle(cards[0]);
                cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight, 10);
            }
        };
        
        // --- SETUP & LOGIC ---
        let cardWidth = 0;
        let currentIndex = 0;
        const visibleCardsOnDesktop = 2;
        // Calculate the number of possible scroll positions
        const numPositions = cards.length > visibleCardsOnDesktop ? cards.length - visibleCardsOnDesktop + 1 : 1;
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < numPositions; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to project set ${i + 1}`);
            dotsContainer.appendChild(dot);
        }
        
        const dots = Array.from(dotsContainer.children);

        const updateUI = () => {
            // Update button visibility
            prevButton.style.visibility = currentIndex <= 0 ? 'hidden' : 'visible';
            nextButton.style.visibility = currentIndex >= numPositions - 1 ? 'hidden' : 'visible';
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const scrollToCard = (index) => {
            const maxIndex = numPositions - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            const scrollPos = currentIndex * cardWidth;
            track.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
            updateUI();
        };

        // --- EVENT LISTENERS ---
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => scrollToCard(index));
        });

        prevButton.addEventListener('click', () => scrollToCard(currentIndex - 1));
        nextButton.addEventListener('click', () => scrollToCard(currentIndex + 1));
        
        track.addEventListener('scroll', () => {
            if (cardWidth > 0) {
                currentIndex = Math.round(track.scrollLeft / cardWidth);
                updateUI();
            }
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                calculateCardWidth();
                // Recalculate scroll position to keep the view consistent
                const scrollPos = currentIndex * cardWidth;
                track.scrollTo({ left: scrollPos, behavior: 'auto' }); // Use 'auto' for instant jump on resize
            }, 100);
        });

        // --- INITIALIZATION ---
        calculateCardWidth();
        updateUI();
    };

    const initRecommendationsSlider = () => {
        const slider = document.querySelector('.recommendations-slider');
        const track = document.querySelector('.recommendations-track');
        const cards = document.querySelectorAll('.recommendation-card');
        const dotsContainer = document.querySelector('.recommendations-dots');
        // 1. Select the new navigation buttons
        const prevButton = slider?.querySelector('.slider-nav.prev');
        const nextButton = slider?.querySelector('.slider-nav.next');

        if (!track || !cards.length || !dotsContainer || !prevButton || !nextButton) return;

        let currentIndex = 0;
        let autoPlayInterval;

        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to recommendation ${i + 1}`);
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.children);

        const goToSlide = (index) => {
            currentIndex = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };

        const nextSlide = () => {
            const nextIndex = (currentIndex + 1) % cards.length;
            goToSlide(nextIndex);
        };

        // 2. Create a function for the previous slide
        const prevSlide = () => {
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            goToSlide(prevIndex);
        };

        const startAutoPlay = () => {
            clearInterval(autoPlayInterval); // Stop any existing timers
            autoPlayInterval = setInterval(nextSlide, 7000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // 3. Helper to reset the autoplay timer on user interaction
        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        dots.forEach((dot, i) => dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoPlay(); // Reset timer on dot click
        }));

        // 4. Add click event listeners to the buttons
        prevButton.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay(); // Reset timer on prev click
        });

        nextButton.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay(); // Reset timer on next click
        });

        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();
    };

    // Initialize all functionalities
    initMouseAura();
    initSidebar();
    initParticles();
    initTyped();
    initScrollReveal();
    initScrollSpy();
    initExperienceAccordion();
    initProjectSlider();
    initRecommendationsSlider();
});