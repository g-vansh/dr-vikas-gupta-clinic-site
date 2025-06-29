// Dr. Vikas Gupta Skin Care Clinic - Main JavaScript File

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLanguageToggle();
    initMobileMenu();
    initTestimonialsCarousel();
    initMap();
    initSmoothScrolling();
    initContactForms();
    
    // Set active navigation
    setActiveNavigation();
});

// Language Toggle Functionality
function initLanguageToggle() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const body = document.body;
    
    // Get saved language preference or default to English
    let currentLang = localStorage.getItem('prefLang') || 'en';
    
    // Apply saved language on load
    setLanguage(currentLang);
    
    // Add click event listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const newLang = this.dataset.lang;
            setLanguage(newLang);
        });
    });
    
    function setLanguage(lang) {
        currentLang = lang;
        
        // Update body class
        body.classList.toggle('lang-hi', lang === 'hi');
        body.classList.toggle('lang-en', lang === 'en');
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update active button state
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Save preference
        localStorage.setItem('prefLang', lang);
        
        // Update page title if needed
        updatePageTitle(lang);
    }
    
    function updatePageTitle(lang) {
        const titles = {
            'en': {
                'index': 'Dr. Vikas Gupta - Best Dermatologist in Moradabad | Skin Care Clinic',
                'about': 'About Dr. Vikas Gupta - Dermatologist in Moradabad',
                'services': 'Services - Dr. Vikas Gupta Skin Clinic Moradabad',
                'testimonials': 'Patient Reviews - Dr. Vikas Gupta Dermatologist',
                'appointment': 'Book Appointment - Dr. Vikas Gupta Skin Clinic'
            },
            'hi': {
                'index': 'डॉ विकास गुप्ता - मुरादाबाद के सर्वश्रेष्ठ त्वचा विशेषज्ञ | स्किन केयर क्लिनिक',
                'about': 'डॉ विकास गुप्ता के बारे में - मुरादाबाद के त्वचा विशेषज्ञ',
                'services': 'सेवाएं - डॉ विकास गुप्ता स्किन क्लिनिक मुरादाबाद',
                'testimonials': 'मरीजों की समीक्षाएं - डॉ विकास गुप्ता त्वचा विशेषज्ञ',
                'appointment': 'अपॉइंटमेंट बुक करें - डॉ विकास गुप्ता स्किन क्लिनिक'
            }
        };
        
        const currentPage = getCurrentPage();
        if (titles[lang] && titles[lang][currentPage]) {
            document.title = titles[lang][currentPage];
        }
    }
    
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('testimonials')) return 'testimonials';
        if (path.includes('appointment')) return 'appointment';
        return 'index';
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Show first slide
    slides[currentSlide].classList.add('active');
    
    // Auto-rotate testimonials
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); // Change every 5 seconds
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
}

// Interactive Patient Origin Map
function initMap() {
    const mapContainer = document.getElementById('patientMap');
    if (!mapContainer || typeof L === 'undefined') return;
    
    try {
        // Initialize map centered on Moradabad
        const map = L.map('patientMap').setView([28.84, 78.78], 8);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Define cities where patients come from
        const cities = [
            { 
                name: "Dr. Gupta's Skin Care Clinic", 
                coords: [28.84, 78.78], 
                isClinic: true,
                description: "Main clinic location in Moradabad"
            },
            { 
                name: "Sambhal", 
                coords: [28.58, 78.55], 
                isClinic: false,
                description: "Patients travel from Sambhal"
            },
            { 
                name: "Rampur", 
                coords: [28.80, 79.02], 
                isClinic: false,
                description: "Patients travel from Rampur"
            },
            { 
                name: "Badaun", 
                coords: [28.03, 79.13], 
                isClinic: false,
                description: "Patients travel from Badaun"
            },
            { 
                name: "Bareilly", 
                coords: [28.37, 79.43], 
                isClinic: false,
                description: "Patients travel from Bareilly"
            },
            { 
                name: "Meerut", 
                coords: [28.98, 77.70], 
                isClinic: false,
                description: "Patients travel from Meerut"
            },
            { 
                name: "Delhi/NCR", 
                coords: [28.68, 77.10], 
                isClinic: false,
                description: "Patients travel from Delhi NCR region"
            }
        ];
        
        // Create custom icons
        const clinicIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#28A745" stroke="#fff" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-weight="bold">+</text>
                </svg>
            `),
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        const patientIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                    <circle cx="15" cy="15" r="13" fill="#2E86AB" stroke="#fff" stroke-width="2"/>
                    <circle cx="15" cy="15" r="6" fill="#fff"/>
                </svg>
            `),
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        
        // Add markers for each city
        const markers = [];
        cities.forEach(city => {
            const icon = city.isClinic ? clinicIcon : patientIcon;
            const marker = L.marker(city.coords, { icon })
                .addTo(map)
                .bindPopup(`<strong>${city.name}</strong><br>${city.description}`);
            markers.push(marker);
        });
        
        // Fit map to show all markers
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
        
        // Add a legend
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'map-legend');
            div.style.background = 'white';
            div.style.padding = '10px';
            div.style.borderRadius = '5px';
            div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            div.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <span style="display: inline-block; width: 20px; height: 20px; background: #28A745; border-radius: 50%; margin-right: 5px;"></span>
                    <span class="lang-en">Clinic Location</span>
                    <span class="lang-hi">क्लिनिक स्थान</span>
                </div>
                <div>
                    <span style="display: inline-block; width: 20px; height: 20px; background: #2E86AB; border-radius: 50%; margin-right: 5px;"></span>
                    <span class="lang-en">Patient Origins</span>
                    <span class="lang-hi">मरीजों के शहर</span>
                </div>
            `;
            return div;
        };
        legend.addTo(map);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        // Hide map container if there's an error
        mapContainer.style.display = 'none';
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling
function initContactForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '#28a745';
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data
                // For now, show a success message
                showNotification('Thank you! Your message has been sent.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Set Active Navigation
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.includes(href.replace('.html', '')) && href !== '/')) {
            link.classList.add('active');
        }
    });
}

// Scroll-based Header Effects
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .highlight-item, .testimonial-slide');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Accessibility Enhancements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add keyboard navigation for carousel
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.setAttribute('tabindex', '0');
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'Patient testimonials');
        
        carousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // Manual control can be added here if needed
            }
        });
    }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Error Handling for External Resources
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' && e.target.src.includes('leaflet')) {
        console.warn('Leaflet failed to load, map will be hidden');
        const mapContainer = document.getElementById('patientMap');
        if (mapContainer) {
            mapContainer.style.display = 'none';
        }
    }
});

// Performance Monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Track Core Web Vitals if supported
            if ('web-vital' in window) {
                // This would require the web-vitals library
                // getCLS(console.log);
                // getFID(console.log);
                // getLCP(console.log);
            }
        });
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();