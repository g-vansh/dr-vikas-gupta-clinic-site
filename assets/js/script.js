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
    initWhatsAppAssistant();
    initDoctorImageFlip();
    
    // Set active navigation
    setActiveNavigation();
});

// Language Toggle Functionality
function initLanguageToggle() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const body = document.body;
    
    // Function to get URL parameter
    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    // Function to update URL with language parameter (optional - for persistence)
    function updateURL(lang) {
        const url = new URL(window.location);
        if (lang && lang !== 'en') {
            url.searchParams.set('lang', lang);
        } else {
            url.searchParams.delete('lang');
        }
        // Update URL without page reload
        window.history.replaceState({}, '', url);
    }
    
    // Determine language preference with priority order:
    // 1. URL parameter (highest priority)
    // 2. Saved localStorage preference
    // 3. Default to English
    let currentLang = getURLParameter('lang') || localStorage.getItem('prefLang') || 'en';
    
    // Validate language code
    if (!['en', 'hi'].includes(currentLang)) {
        currentLang = 'en';
    }
    
    // Apply language on load
    setLanguage(currentLang);
    
    // Add click event listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const newLang = this.dataset.lang;
            setLanguage(newLang);
        });
    });
    
    function setLanguage(lang) {
        console.log('🔄 STARTING setLanguage with:', lang);
        currentLang = lang;
        
        console.log('📋 BEFORE - Body classes:', body.classList.toString());
        console.log('📋 BEFORE - HTML lang:', document.documentElement.lang);
        
        // Clear all language classes first
        body.classList.remove('lang-en', 'lang-hi');
        console.log('🧹 CLEARED - Body classes:', body.classList.toString());
        
        // Add the new language class
        body.classList.add('lang-' + lang);
        console.log('➕ ADDED - Body classes:', body.classList.toString());
        
        // Update HTML lang attribute and direction
        document.documentElement.lang = lang;
        document.documentElement.dir = 'ltr'; // Both English and Hindi are left-to-right
        
        // Update Content-Language meta tag
        let contentLangMeta = document.querySelector('meta[http-equiv="Content-Language"]');
        if (contentLangMeta) {
            contentLangMeta.setAttribute('content', lang);
        } else {
            // Create the meta tag if it doesn't exist
            contentLangMeta = document.createElement('meta');
            contentLangMeta.setAttribute('http-equiv', 'Content-Language');
            contentLangMeta.setAttribute('content', lang);
            document.head.appendChild(contentLangMeta);
        }
        
        // Force font and text refresh for Hindi
        if (lang === 'hi') {
            console.log('🔤 HINDI MODE ACTIVATED');
            
            // Immediately make Hindi elements visible
            const hindiElements = document.querySelectorAll('.lang-hi');
            const englishElements = document.querySelectorAll('.lang-en');
            
            console.log('📊 ELEMENT COUNT:');
            console.log('  - Hindi elements found:', hindiElements.length);
            console.log('  - English elements found:', englishElements.length);
            
            // Check first few Hindi elements before changes
            console.log('🔍 HINDI ELEMENTS BEFORE CHANGES:');
            hindiElements.forEach((element, index) => {
                if (index < 3) {
                    const computedStyle = window.getComputedStyle(element);
                    console.log(`  Element ${index + 1}:`, {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        text: element.textContent.substring(0, 30) + '...'
                    });
                }
            });
            
            hindiElements.forEach(element => {
                element.style.display = 'inline';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.style.fontFamily = "'Noto Sans Devanagari', 'Noto Sans', 'Mangal', 'Utsaah', 'Aparajita', sans-serif";
            });
            
            // Check first few Hindi elements after changes
            console.log('✅ HINDI ELEMENTS AFTER CHANGES:');
            hindiElements.forEach((element, index) => {
                if (index < 3) {
                    const computedStyle = window.getComputedStyle(element);
                    console.log(`  Element ${index + 1}:`, {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        text: element.textContent.substring(0, 30) + '...'
                    });
                }
            });
            
            // Check English elements
            console.log('👁️ ENGLISH ELEMENTS STATUS:');
            englishElements.forEach((element, index) => {
                if (index < 3) {
                    const computedStyle = window.getComputedStyle(element);
                    console.log(`  Element ${index + 1}:`, {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity
                    });
                }
            });
            
            // Additional font loading with fallback
            if (document.fonts) {
                document.fonts.load('16px "Noto Sans Devanagari"').then(() => {
                    console.log('✅ Hindi fonts loaded successfully');
                    // Force reflow
                    document.body.offsetHeight;
                }).catch(() => {
                    console.log('⚠️ Using fallback fonts for Hindi');
                    // Apply fallback fonts
                    hindiElements.forEach(element => {
                        element.style.fontFamily = "'Mangal', 'Utsaah', 'Aparajita', sans-serif";
                    });
                });
            }
            
            // Force reflow immediately
            document.body.offsetHeight;
            console.log('🔄 HINDI SETUP COMPLETE');
        } else {
            console.log('🔤 ENGLISH MODE ACTIVATED');
            const hindiElements = document.querySelectorAll('.lang-hi');
            const englishElements = document.querySelectorAll('.lang-en');
            
            console.log('📊 ELEMENT COUNT:');
            console.log('  - Hindi elements found:', hindiElements.length);
            console.log('  - English elements found:', englishElements.length);
            
            // Check first few English elements
            console.log('👁️ ENGLISH ELEMENTS STATUS:');
            englishElements.forEach((element, index) => {
                if (index < 3) {
                    const computedStyle = window.getComputedStyle(element);
                    console.log(`  Element ${index + 1}:`, {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity
                    });
                }
            });
        }
        
        // Update active button state
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Save preference
        localStorage.setItem('prefLang', lang);
        
        // Update URL to reflect current language (optional - remove if you don't want URL to change)
        updateURL(lang);
        
        // Update all navigation links
        updateNavigationLinks();
        
        // Update page title if needed
        updatePageTitle(lang);
        
        // Final state check
        console.log('🏁 FINAL STATE:');
        console.log('  - Body classes:', body.classList.toString());
        console.log('  - HTML lang:', document.documentElement.lang);
        console.log('  - Current language:', currentLang);
        console.log('  - Saved preference:', localStorage.getItem('prefLang'));
        
        // Check if page content is visible
        setTimeout(() => {
            const visibleElements = document.querySelectorAll(lang === 'hi' ? '.lang-hi:not([style*="display: none"])' : '.lang-en:not([style*="display: none"])');
            console.log('👀 VISIBLE ELEMENTS COUNT:', visibleElements.length);
            
            if (visibleElements.length === 0) {
                console.error('❌ NO VISIBLE ELEMENTS FOUND! This is likely the cause of blank page.');
                console.log('🔧 TROUBLESHOOTING STEPS:');
                console.log('1. Check CSS for conflicting display rules');
                console.log('2. Verify .lang-' + lang + ' elements exist in HTML');
                console.log('3. Check for JavaScript errors interrupting execution');
            } else {
                console.log('✅ Elements are visible, page should not be blank');
            }
        }, 100);
        
        console.log('✅ setLanguage COMPLETE for:', lang);
    }
    
    function updatePageTitle(lang) {
        // Get current page for title mapping
        const currentPage = getCurrentPage();
        
        // Title mappings for different pages and languages
        const pageTitles = {
            'index': {
                'en': 'Dr. Vikas Gupta - Best Dermatologist Moradabad | मुरादाबाद के शीर्ष त्वचा विशेषज्ञ',
                'hi': 'डॉ विकास गुप्ता - मुरादाबाद के सर्वश्रेष्ठ त्वचा विशेषज्ञ | Best Dermatologist'
            },
            'about': {
                'en': 'About Dr. Vikas Gupta - Leading Dermatologist | 30+ Years Experience',
                'hi': 'डॉ विकास गुप्ता के बारे में - प्रमुख त्वचा विशेषज्ञ | 30+ वर्ष अनुभव'
            },
            'services': {
                'en': 'Dermatology Services - Dr. Vikas Gupta | Skin, Hair & Nail Treatment',
                'hi': 'त्वचा रोग सेवाएं - डॉ विकास गुप्ता | त्वचा, बाल और नाखून उपचार'
            },
            'appointment': {
                'en': 'Book Appointment - Dr. Vikas Gupta | Online & In-Person Consultation',
                'hi': 'अपॉइंटमेंट बुक करें - डॉ विकास गुप्ता | ऑनलाइन और व्यक्तिगत परामर्श'
            }
        };
        
        // Update page title if mapping exists
        if (pageTitles[currentPage] && pageTitles[currentPage][lang]) {
            document.title = pageTitles[currentPage][lang];
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

    // Helper function to generate language-specific URLs
    function generateLanguageURL(targetLang, customPath = null) {
        const currentPath = customPath || window.location.pathname;
        const url = new URL(window.location.origin + currentPath);
        
        if (targetLang && targetLang !== 'en') {
            url.searchParams.set('lang', targetLang);
        } else {
            url.searchParams.delete('lang');
        }
        
        return url.toString();
    }

    // Function to update all navigation links with current language
    function updateNavigationLinks() {
        const currentLang = getCurrentLanguage();
        
        // Update all internal navigation links
        const navLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="index.html"], a[href^="about.html"], a[href^="services.html"], a[href^="appointment.html"], a[href^="testimonials.html"]');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Skip if it's an external link or already has language parameter
            if (href && !href.includes('lang=') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                const newURL = generateLanguageURL(currentLang, href.startsWith('/') ? href : '/' + href);
                link.setAttribute('href', newURL);
            }
        });
    }

    // Function to get current language
    function getCurrentLanguage() {
        return currentLang;
    }

    // Expose functions globally for external use
    window.generateLanguageURL = generateLanguageURL;
    window.getCurrentLanguage = getCurrentLanguage;
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
    let intervalId;
    
    // Hide all slides initially
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        slide.style.zIndex = index === 0 ? 10 : 1;
    });
    
    // Show first slide
    slides[currentSlide].classList.add('active');
    
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        slides[index].classList.add('active');
        
        // Update z-index for proper layering
        slides.forEach((slide, i) => {
            slide.style.zIndex = i === index ? 10 : 1;
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Start auto-rotation
    function startRotation() {
        intervalId = setInterval(nextSlide, 4000); // Change every 4 seconds
    }
    
    function stopRotation() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }
    
    // Initialize rotation
    startRotation();
    
    // Add navigation dots (optional)
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    dotsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    `;
    
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: none;
            background: #ddd;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        
        if (index === 0) {
            dot.style.background = 'var(--primary-color)';
        }
        
        dot.addEventListener('click', () => {
            stopRotation();
            currentSlide = index;
            showSlide(currentSlide);
            startRotation();
            
            // Update dot states
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
                d.style.background = i === index ? 'var(--primary-color)' : '#ddd';
            });
        });
        
        dotsContainer.appendChild(dot);
    });
    
    carousel.appendChild(dotsContainer);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopRotation);
    carousel.addEventListener('mouseleave', startRotation);
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopRotation();
        } else {
            startRotation();
        }
    });
}

// Doctor Image Flip Animation (Front Page Only)
// Simple Doctor Image Flip (CSS hover-based)
function initDoctorImageFlip() {
    console.log('✅ Simple flip animation enabled (CSS hover-based)');
    // No JavaScript needed - flip is handled by CSS :hover
}

// Interactive Patient Origin Map with Modern Design
function initMap() {
    const mapContainer = document.getElementById('patientMap');
    if (!mapContainer || typeof L === 'undefined') return;
    
    try {
        // Initialize map centered on clinic with modern styling
        const map = L.map('patientMap', {
            center: [28.8285263, 78.7752077],
            zoom: 8,
            zoomControl: false,
            scrollWheelZoom: true,
            dragging: true,
            touchZoom: true,
            attributionControl: false
        });
        
        // Add custom zoom control
        L.control.zoom({
            position: 'bottomleft'
        }).addTo(map);
        
        // Add tile layer with city labels
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '',
            maxZoom: 18,
            subdomains: 'abcd'
        }).addTo(map);
        
        // Clinic coordinates (Dr. Gupta's location) - Updated with precise coordinates
        const clinicCoords = [28.8285263, 78.7752077];
        
        // Hardcoded route data reference - full data loaded from external file
        // Note: Full route data is loaded from hardcoded_routes.js
        let HARDCODED_ROUTES = {};
        
        // Helper function to get hardcoded route for a city
        function getHardcodedRoute(cityName) {
            return HARDCODED_ROUTES[cityName] || null;
        }
        
        // Extended list of cities where patients come from (within ~300km radius)
        const cities = [
            { 
                name: "Dr. Gupta's Skin Care Clinic", 
                coords: [28.8285263, 78.7752077], 
                isClinic: true,
                description: {
                    en: "Leading Dermatologist in Moradabad",
                    hi: "मुरादाबाद के प्रमुख त्वचा विशेषज्ञ"
                },
                patients: "500,000+"
            },
            // Existing nearby cities
            { 
                name: "Sambhal", 
                coords: [28.58, 78.55], 
                isClinic: false,
                description: {
                    en: "Patients from Sambhal district",
                    hi: "संभल जिले के मरीज़"
                },
                patients: "5,000+"
            },
            { 
                name: "Rampur", 
                coords: [28.80, 79.02], 
                isClinic: false,
                description: {
                    en: "Regular patients from Rampur",
                    hi: "रामपुर के नियमित मरीज़"
                },
                patients: "8,000+"
            },
            { 
                name: "Badaun", 
                coords: [28.03, 79.13], 
                isClinic: false,
                description: {
                    en: "Patients from Badaun region",
                    hi: "बदायूं क्षेत्र के मरीज़"
                },
                patients: "5,000+"
            },
            { 
                name: "Bareilly", 
                coords: [28.37, 79.43], 
                isClinic: false,
                description: {
                    en: "Regular visitors from Bareilly",
                    hi: "बरेली के नियमित आगंतुक"
                },
                patients: "9,000+"
            },
            { 
                name: "Meerut", 
                coords: [28.98, 77.70], 
                isClinic: false,
                description: {
                    en: "Patients from Meerut district",
                    hi: "मेरठ जिले के मरीज़"
                },
                patients: "10,000+"
            },
            { 
                name: "Delhi NCR", 
                coords: [28.68, 77.10], 
                isClinic: false,
                description: {
                    en: "Patients from New Delhi metropolitan area",
                    hi: "नई दिल्ली महानगरीय क्षेत्र के मरीज़"
                },
                patients: "10,000+"
            },
            // New cities within 300km radius
            { 
                name: "Haldwani", 
                coords: [29.22, 79.52], 
                isClinic: false,
                description: {
                    en: "Patients from Haldwani, Uttarakhand",
                    hi: "हल्द्वानी, उत्तराखंड के मरीज़"
                },
                patients: "3,000+"
            },
            { 
                name: "Rudrapur", 
                coords: [28.98, 79.40], 
                isClinic: false,
                description: {
                    en: "Patients from Rudrapur, Uttarakhand",
                    hi: "रुद्रपुर, उत्तराखंड के मरीज़"
                },
                patients: "2,000+"
            },
            { 
                name: "Bijnor", 
                coords: [29.37, 78.13], 
                isClinic: false,
                description: {
                    en: "Patients from Bijnor district",
                    hi: "बिजनौर जिले के मरीज़"
                },
                patients: "3,000+"
            },
            { 
                name: "Gurugram", 
                coords: [28.46, 77.03], 
                isClinic: false,
                description: {
                    en: "Patients from Gurugram, Haryana",
                    hi: "गुरुग्राम, हरियाणा के मरीज़"
                },
                patients: "4,000+"
            },
            { 
                name: "Kashipur", 
                coords: [29.21, 78.96], 
                isClinic: false,
                description: {
                    en: "Patients from Kashipur, Uttarakhand",
                    hi: "काशीपुर, उत्तराखंड के मरीज़"
                },
                patients: "4000+"
            },
            { 
                name: "Noida", 
                coords: [28.58, 77.33], 
                isClinic: false,
                description: {
                    en: "Patients from Noida, UP",
                    hi: "नोएडा, UP के मरीज़"
                },
                patients: "12,000+"
            },
            { 
                name: "Ghaziabad", 
                coords: [28.67, 77.43], 
                isClinic: false,
                description: {
                    en: "Patients from Ghaziabad, UP",
                    hi: "गाजियाबाद, UP के मरीज़"
                },
                patients: "12,000+"
            },
            { 
                name: "Faridabad", 
                coords: [28.41, 77.31], 
                isClinic: false,
                description: {
                    en: "Patients from Faridabad, Haryana",
                    hi: "फरीदाबाद, हरियाणा के मरीज़"
                },
                patients: "8,000+"
            },
            // Additional nearby important cities
            { 
                name: "Aligarh", 
                coords: [27.88, 78.08], 
                isClinic: false,
                description: {
                    en: "Patients from Aligarh district",
                    hi: "अलीगढ़ जिले के मरीज़"
                },
                patients: "9,000+"
            },
            { 
                name: "Muzaffarnagar", 
                coords: [29.47, 77.70], 
                isClinic: false,
                description: {
                    en: "Patients from Muzaffarnagar",
                    hi: "मुजफ्फरनगर के मरीज़"
                },
                patients: "6,000+"
            },
            { 
                name: "Saharanpur", 
                coords: [29.97, 77.55], 
                isClinic: false,
                description: {
                    en: "Patients from Saharanpur district",
                    hi: "सहारनपुर जिले के मरीज़"
                },
                patients: "7,000+"
            },
            { 
                name: "Haridwar", 
                coords: [29.95, 78.16], 
                isClinic: false,
                description: {
                    en: "Patients from Haridwar, Uttarakhand",
                    hi: "हरिद्वार, उत्तराखंड के मरीज़"
                },
                patients: "3000+"
            }
        ];
        
        // Create modern custom icons with Font Awesome
        const clinicIcon = L.divIcon({
            className: 'custom-clinic-marker',
            html: `
                <div class="clinic-marker-container">
                    <div class="clinic-marker-pulse"></div>
                    <div class="clinic-marker-icon">
                        <i class="fa-solid fa-user-doctor"></i>
                    </div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50]
        });
        
        const patientIcon = L.divIcon({
            className: 'custom-patient-marker',
            html: `
                <div class="patient-marker-container">
                    <div class="patient-marker-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="8" fill="white" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
        
        // Add markers and store references
        const markers = [];
        const patientCities = [];
        
        cities.forEach(city => {
            const icon = city.isClinic ? clinicIcon : patientIcon;
            const marker = L.marker(city.coords, { icon })
                .addTo(map)
                .bindPopup(`
                    <div class="modern-popup">
                        <h3>${city.name}</h3>
                        <p>
                            <span class="lang-en">${typeof city.description === 'object' ? city.description.en : city.description}</span>
                            <span class="lang-hi">${typeof city.description === 'object' ? city.description.hi : city.description}</span>
                        </p>
                        ${city.patients ? `<div class="patient-count">${city.patients} <span class="lang-en">patients</span><span class="lang-hi">मरीज़</span></div>` : ''}
                    </div>
                `, {
                    className: 'modern-popup-container',
                    closeButton: false,
                    offset: [0, -10]
                });
            
            markers.push(marker);
            
            if (!city.isClinic) {
                patientCities.push(city);
            }
        });
        
        // Create route lines from clinic to all patient cities using hardcoded routes
        const connectionLines = [];
        
        // Load hardcoded routes from external script if available
        if (typeof window.HARDCODED_ROUTES !== 'undefined') {
            HARDCODED_ROUTES = window.HARDCODED_ROUTES;
        } else if (typeof HARDCODED_ROUTES === 'undefined') {
            // Fallback: try to load from global scope or provide empty object
            HARDCODED_ROUTES = {};
            console.warn('⚠️ Hardcoded routes not found, using fallback to direct routes');
        }
        
        console.log('�️ Loading hardcoded real road routes...');
        
        // Create routes for each patient city instantly
        const createRoutes = () => {
            let successCount = 0;
            let totalCities = patientCities.length;
            
            patientCities.forEach((city, index) => {
                try {
                    // Get hardcoded route for this city
                    const routeCoords = getHardcodedRoute(city.name);
                    
                    if (routeCoords && routeCoords.length > 0) {
                        // Create the connecting line with real route data
                        const line = L.polyline(routeCoords, {
                            color: '#3B82F6',
                            weight: 2,
                            opacity: 0.7,
                            smoothFactor: 1.0,
                            className: 'connection-line route-line'
                        }).addTo(map);
                        
                        connectionLines.push(line);
                        successCount++;
                        
                        // Add tooltip with route info
                        line.bindTooltip(`
                            <div style="text-align: center;">
                                <strong>${city.name}</strong><br>
                                <small>
                                    <span class="lang-en">Real road route</span>
                                    <span class="lang-hi">वास्तविक सड़क मार्ग</span>
                                </small>
                            </div>
                        `, {
                            permanent: false,
                            direction: 'center'
                        });
                        
                        // Add animation delay based on index
                        setTimeout(() => {
                            if (line.getElement()) {
                                line.getElement().classList.add('animate');
                            }
                        }, index * 100);
                        
                    } else {
                        // Fallback to straight line if no hardcoded route available
                        console.log(`📍 Using direct route for ${city.name}`);
                        const fallbackLine = L.polyline([clinicCoords, city.coords], {
                            color: '#6B7280',
                            weight: 2,
                            opacity: 0.6,
                            smoothFactor: 1.0,
                            className: 'connection-line fallback-line',
                            dashArray: '8, 4'
                        }).addTo(map);
                        
                        connectionLines.push(fallbackLine);
                        
                        // Add tooltip for fallback
                        fallbackLine.bindTooltip(`
                            <div style="text-align: center;">
                                <strong>${city.name}</strong><br>
                                <small>
                                    <span class="lang-en">Direct route</span>
                                    <span class="lang-hi">सीधा मार्ग</span>
                                </small>
                            </div>
                        `, {
                            permanent: false,
                            direction: 'center'
                        });
                        
                        // Add animation
                        setTimeout(() => {
                            if (fallbackLine.getElement()) {
                                fallbackLine.getElement().classList.add('animate');
                            }
                        }, index * 100);
                    }
                    
                } catch (error) {
                    console.error(`❌ Error creating route for ${city.name}:`, error);
                    
                    // Create fallback straight line
                    const fallbackLine = L.polyline([clinicCoords, city.coords], {
                        color: '#6B7280',
                        weight: 2,
                        opacity: 0.6,
                        smoothFactor: 1.0,
                        className: 'connection-line fallback-line',
                        dashArray: '8, 4'
                    }).addTo(map);
                    
                    connectionLines.push(fallbackLine);
                    
                    // Add animation
                    setTimeout(() => {
                        if (fallbackLine.getElement()) {
                            fallbackLine.getElement().classList.add('animate');
                        }
                    }, index * 100);
                }
            });
            
            console.log(`✅ Routes complete: ${successCount}/${totalCities} real routes, ${totalCities - successCount} direct routes`);
        };
        
        // Start creating routes
        createRoutes();
        
        // Fit map to show all markers with padding, but maintain minimum zoom level
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1), {
            maxZoom: 8
        });
        
        // Add modern legend with glassmorphism effect
        const legend = L.control({position: 'topright'});
        legend.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'modern-map-legend');
            div.innerHTML = `
                <div class="legend-header">
                    <h4>
                        <span class="lang-en">Patient Network</span>
                        <span class="lang-hi">मरीज़ों का नेटवर्क</span>
                    </h4>
                </div>
                <div class="legend-item">
                    <div class="legend-icon clinic-legend"></div>
                    <span class="lang-en">Dr. Gupta's Clinic</span>
                    <span class="lang-hi">डॉ गुप्ता का क्लिनिक</span>
                </div>
                <div class="legend-item">
                    <div class="legend-icon patient-legend"></div>
                    <span class="lang-en">Patient Origins</span>
                    <span class="lang-hi">मरीजों के शहर</span>
                </div>

                <div class="legend-stats">
                    <div class="stat-item">
                        <strong>18+</strong> 
                        <span class="lang-en">Cities</span>
                        <span class="lang-hi">शहर</span>
                    </div>
                    <div class="stat-item">
                        <strong>500,000+</strong> 
                        <span class="lang-en">Patients</span>
                        <span class="lang-hi">मरीज़</span>
                    </div>
                </div>
            `;
            return div;
        };
        legend.addTo(map);
        
        // Add attribution with custom styling
        const attribution = L.control.attribution({
            position: 'bottomright',
            prefix: false
        });
        attribution.addAttribution('');
        attribution.addTo(map);
        
        // Add hover effects for enhanced interactivity
        markers.forEach((marker, index) => {
            const city = cities[index];
            
            marker.on('mouseover', function() {
                const element = this.getElement();
                if (element) {
                    // Add CSS class for stable hover effects instead of direct transform
                    element.classList.add('marker-hover');
                    
                    // Highlight connecting lines for patient cities
                    if (!city.isClinic) {
                        connectionLines.forEach(line => {
                            if (line.getLatLngs().some(latLng => 
                                Math.abs(latLng.lat - city.coords[0]) < 0.01 && 
                                Math.abs(latLng.lng - city.coords[1]) < 0.01)) {
                                line.setStyle({
                                    color: '#F59E0B',
                                    weight: 4,
                                    opacity: 1
                                });
                            }
                        });
                    }
                }
            });
            
            marker.on('mouseout', function() {
                const element = this.getElement();
                if (element) {
                    // Remove CSS class to reset hover effects
                    element.classList.remove('marker-hover');
                    
                    // Reset line styles
                    connectionLines.forEach(line => {
                        line.setStyle({
                            color: '#3B82F6',
                            weight: 2,
                            opacity: 0.7
                        });
                    });
                }
            });
        });
        
        // Add floating info box that follows mouse
        const floatingInfo = L.control({position: 'topleft'});
        floatingInfo.onAdd = function() {
            const div = L.DomUtil.create('div', 'floating-map-info');
            div.innerHTML = `
                <div class="info-content">
                    <h3>
                        <span class="lang-en">🌟 Trusted Across North India</span>
                        <span class="lang-hi">🌟 उत्तर भारत में भरोसेमंद</span>
                    </h3>
                    <p>
                        <span class="lang-en">Patients from 300+ km radius choose Dr. Gupta for expert skin care</span>
                        <span class="lang-hi">300+ किमी की दूरी के मरीज़ विशेषज्ञ त्वचा देखभाल के लिए डॉ गुप्ता को चुनते हैं</span>
                    </p>

                    <div class="info-highlight" style="margin-top: 8px;">
                        <span class="highlight-number">30+</span> 
                        <span class="lang-en">years experience</span>
                        <span class="lang-hi">साल का अनुभव</span>
                    </div>
                </div>
            `;
            return div;
        };
        floatingInfo.addTo(map);
        
        console.log('✅ Enhanced patient map with OSRM routing initialized with', cities.length, 'locations');
        
    } catch (error) {
        console.error('Error initializing modern map:', error);
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
    if ('performance' in window && 'timing' in performance) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const navigation = performance.timing;
                if (navigation.loadEventEnd > 0) {
                    const loadTime = navigation.loadEventEnd - navigation.navigationStart;
                    if (loadTime > 0) {
                        console.log('Page load time:', loadTime + 'ms');
                    }
                }
            }, 100);
        });
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Debug function for testing Hindi display (call in console: testHindi())
window.testHindi = function() {
    console.log('=== HINDI DISPLAY TEST ===');
    
    // Switch to Hindi
    document.body.classList.remove('lang-en');
    document.body.classList.add('lang-hi');
    
    const hindiElements = document.querySelectorAll('.lang-hi');
    console.log('Total Hindi elements found:', hindiElements.length);
    
    if (hindiElements.length > 0) {
        const firstElement = hindiElements[0];
        const computedStyle = window.getComputedStyle(firstElement);
        console.log('First Hindi element text:', firstElement.textContent.substring(0, 50) + '...');
        console.log('Font family:', computedStyle.fontFamily);
        console.log('Display:', computedStyle.display);
        console.log('Visibility:', computedStyle.visibility);
        console.log('Opacity:', computedStyle.opacity);
        
        // Test if fonts are loaded
        document.fonts.load('16px "Noto Sans Devanagari"').then(() => {
            console.log('✅ Noto Sans Devanagari font loaded successfully');
        }).catch(() => {
            console.log('❌ Noto Sans Devanagari font failed to load');
        });
    }
    
    console.log('=== TEST COMPLETE ===');
    console.log('If you see Hindi text above and font shows as "Noto Sans Devanagari", Hindi is working!');
};

// Debug function for complete language state analysis
window.debugLanguageState = function() {
    console.log('🔬 === COMPLETE LANGUAGE STATE ANALYSIS ===');
    
    const bodyClasses = document.body.classList.toString();
    const htmlLang = document.documentElement.lang;
    const savedLang = localStorage.getItem('prefLang');
    
    console.log('📋 CURRENT STATE:');
    console.log('  Body classes:', bodyClasses);
    console.log('  HTML lang:', htmlLang);
    console.log('  Saved preference:', savedLang);
    
    const hindiElements = document.querySelectorAll('.lang-hi');
    const englishElements = document.querySelectorAll('.lang-en');
    
    console.log('\n📊 ELEMENT COUNTS:');
    console.log('  Hindi elements:', hindiElements.length);
    console.log('  English elements:', englishElements.length);
    
    console.log('\n🔍 ELEMENT VISIBILITY ANALYSIS:');
    
    // Check Hindi elements
    let visibleHindi = 0;
    let hiddenHindi = 0;
    hindiElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const isVisible = computedStyle.display !== 'none' && 
                         computedStyle.visibility !== 'hidden' && 
                         computedStyle.opacity !== '0';
        
        if (isVisible) visibleHindi++;
        else hiddenHindi++;
        
        if (index < 5) { // Show details for first 5 elements
            console.log(`  Hindi ${index + 1}:`, {
                visible: isVisible,
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                text: element.textContent.substring(0, 30) + '...'
            });
        }
    });
    
    // Check English elements
    let visibleEnglish = 0;
    let hiddenEnglish = 0;
    englishElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const isVisible = computedStyle.display !== 'none' && 
                         computedStyle.visibility !== 'hidden' && 
                         computedStyle.opacity !== '0';
        
        if (isVisible) visibleEnglish++;
        else hiddenEnglish++;
        
        if (index < 5) { // Show details for first 5 elements
            console.log(`  English ${index + 1}:`, {
                visible: isVisible,
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                text: element.textContent.substring(0, 30) + '...'
            });
        }
    });
    
    console.log('\n📈 VISIBILITY SUMMARY:');
    console.log('  Visible Hindi elements:', visibleHindi);
    console.log('  Hidden Hindi elements:', hiddenHindi);
    console.log('  Visible English elements:', visibleEnglish);
    console.log('  Hidden English elements:', hiddenEnglish);
    
    // Check if page appears blank
    const totalVisible = visibleHindi + visibleEnglish;
    if (totalVisible === 0) {
        console.error('❌ BLANK PAGE DETECTED - NO VISIBLE ELEMENTS!');
        console.log('🔧 POSSIBLE CAUSES:');
        console.log('1. CSS display rules are overriding visibility');
        console.log('2. JavaScript errors are preventing proper execution');
        console.log('3. Elements exist but are positioned off-screen');
        console.log('4. Font loading issues making text invisible');
    } else {
        console.log('✅ Elements are visible, page should display content');
    }
    
    console.log('\n🎯 RECOMMENDATION:');
    if (bodyClasses.includes('lang-hi') && visibleHindi === 0) {
        console.log('Hindi mode is active but no Hindi elements are visible - CSS issue likely');
    } else if (bodyClasses.includes('lang-en') && visibleEnglish === 0) {
        console.log('English mode is active but no English elements are visible - CSS issue likely');
    } else if (!bodyClasses.includes('lang-')) {
        console.log('No language class detected on body - JavaScript initialization issue');
    }
    
    console.log('🔬 === ANALYSIS COMPLETE ===');
};

// Deep dive debugging for "invisible but visible" elements
window.deepDiveDebug = function() {
    console.log('🔬 === DEEP DIVE DEBUG FOR BLANK PAGE ===');
    
    const hindiElements = document.querySelectorAll('.lang-hi');
    console.log('🔍 Analyzing first 10 Hindi elements in detail...');
    
    for (let i = 0; i < Math.min(10, hindiElements.length); i++) {
        const element = hindiElements[i];
        const computedStyle = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        console.log(`\n📋 Hindi Element ${i + 1}:`);
        console.log('  Text:', element.textContent.substring(0, 50) + '...');
        console.log('  Tag:', element.tagName.toLowerCase());
        
        // Basic visibility
        console.log('  Basic Visibility:', {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity
        });
        
        // Dimensions and position
        console.log('  Dimensions:', {
            width: rect.width + 'px',
            height: rect.height + 'px',
            top: rect.top + 'px',
            left: rect.left + 'px'
        });
        
        // Font and text properties
        console.log('  Text Properties:', {
            fontSize: computedStyle.fontSize,
            fontFamily: computedStyle.fontFamily.substring(0, 50) + '...',
            color: computedStyle.color,
            backgroundColor: computedStyle.backgroundColor,
            lineHeight: computedStyle.lineHeight,
            textIndent: computedStyle.textIndent
        });
        
        // Layout properties
        console.log('  Layout:', {
            position: computedStyle.position,
            zIndex: computedStyle.zIndex,
            transform: computedStyle.transform,
            overflow: computedStyle.overflow,
            clipPath: computedStyle.clipPath || 'none'
        });
        
        // Check if element is in viewport
        const inViewport = rect.top >= 0 && rect.left >= 0 && 
                          rect.bottom <= window.innerHeight && 
                          rect.right <= window.innerWidth;
        console.log('  In Viewport:', inViewport);
        
        // Parent container analysis
        const parent = element.parentElement;
        if (parent) {
            const parentStyle = window.getComputedStyle(parent);
            const parentRect = parent.getBoundingClientRect();
            console.log('  Parent Container:', {
                tag: parent.tagName.toLowerCase(),
                display: parentStyle.display,
                width: parentRect.width + 'px',
                height: parentRect.height + 'px',
                overflow: parentStyle.overflow
            });
        }
        
        // Check for zero dimensions that would make text invisible
        if (rect.width === 0 || rect.height === 0) {
            console.warn('  ⚠️ ZERO DIMENSIONS - Element has no visible area!');
        }
        
        // Check for transparent text
        const colorMatch = computedStyle.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (colorMatch) {
            const alpha = colorMatch[4] ? parseFloat(colorMatch[4]) : 1;
            if (alpha === 0) {
                console.warn('  ⚠️ TRANSPARENT TEXT - Color alpha is 0!');
            }
        }
        
        // Check if text is off-screen
        if (rect.top < -1000 || rect.left < -1000 || 
            rect.top > window.innerHeight + 1000 || 
            rect.left > window.innerWidth + 1000) {
            console.warn('  ⚠️ OFF-SCREEN - Element is positioned far off-screen!');
        }
    }
    
    // Check viewport and page dimensions
    console.log('\n🖥️ VIEWPORT & PAGE INFO:');
    console.log('  Window dimensions:', window.innerWidth + 'x' + window.innerHeight);
    console.log('  Document dimensions:', document.documentElement.scrollWidth + 'x' + document.documentElement.scrollHeight);
    console.log('  Scroll position:', window.scrollX + ', ' + window.scrollY);
    console.log('  Device pixel ratio:', window.devicePixelRatio);
    
    // Check for CSS animations/transitions that might hide content
    console.log('\n🎬 CHECKING FOR ANIMATIONS:');
    const animatedElements = document.querySelectorAll('*');
    let animationCount = 0;
    for (let element of animatedElements) {
        const style = window.getComputedStyle(element);
        if (style.animationName !== 'none' || style.transition !== 'all 0s ease 0s') {
            animationCount++;
        }
    }
    console.log('  Elements with animations/transitions:', animationCount);
    
    // Check for problematic CSS rules
    console.log('\n🎨 CSS RULE ANALYSIS:');
    const bodyStyle = window.getComputedStyle(document.body);
    console.log('  Body background:', bodyStyle.backgroundColor);
    console.log('  Body color:', bodyStyle.color);
    console.log('  Body font-size:', bodyStyle.fontSize);
    console.log('  Body overflow:', bodyStyle.overflow);
    
    // Check if main content container exists and is visible
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
        const mainStyle = window.getComputedStyle(mainContent);
        const mainRect = mainContent.getBoundingClientRect();
        console.log('  Main content container:', {
            display: mainStyle.display,
            width: mainRect.width + 'px',
            height: mainRect.height + 'px',
            visible: mainRect.width > 0 && mainRect.height > 0
        });
    }
    
    console.log('\n🔬 === DEEP DIVE COMPLETE ===');
};

// Check HTML structure and DOM integrity
window.checkHTMLStructure = function() {
    console.log('🏗️ === HTML STRUCTURE ANALYSIS ===');
    
    // Check basic HTML structure
    const basicElements = ['html', 'head', 'body', 'main', 'header', 'footer'];
    basicElements.forEach(tag => {
        const elements = document.querySelectorAll(tag);
        console.log(`  ${tag.toUpperCase()} elements found: ${elements.length}`);
        if (elements.length > 0) {
            const style = window.getComputedStyle(elements[0]);
            console.log(`    Display: ${style.display}, Visibility: ${style.visibility}`);
        }
    });
    
    // Check if main content sections exist
    const contentSections = ['.hero', '.highlights', '.section', '.testimonials-carousel', '.contact-info'];
    contentSections.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`\n  ${selector} sections found: ${elements.length}`);
        elements.forEach((element, index) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            console.log(`    Section ${index + 1}: ${rect.width}x${rect.height} (${style.display})`);
        });
    });
    
    // Check if Hindi content actually exists in expected places
    console.log('\n📝 HINDI CONTENT VERIFICATION:');
    const hindiSelectors = [
        '.hero .lang-hi',
        '.highlights .lang-hi', 
        '.section .lang-hi',
        'header .lang-hi',
        'footer .lang-hi'
    ];
    
    hindiSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`  ${selector}: ${elements.length} elements`);
        if (elements.length > 0) {
            const firstElement = elements[0];
            const style = window.getComputedStyle(firstElement);
            console.log(`    First element: "${firstElement.textContent.substring(0, 30)}..." (${style.display})`);
        }
    });
    
    // Check for CSS conflicts with language classes
    console.log('\n🎨 CSS CONFLICT CHECK:');
    const testDiv = document.createElement('div');
    testDiv.className = 'lang-hi';
    testDiv.textContent = 'टेस्ट टेक्स्ट';
    testDiv.style.position = 'absolute';
    testDiv.style.top = '10px';
    testDiv.style.left = '10px';
    testDiv.style.fontSize = '16px';
    testDiv.style.color = 'red';
    testDiv.style.zIndex = '9999';
    testDiv.style.backgroundColor = 'yellow';
    testDiv.style.padding = '10px';
    
    document.body.appendChild(testDiv);
    
    setTimeout(() => {
        const testStyle = window.getComputedStyle(testDiv);
        const testRect = testDiv.getBoundingClientRect();
        console.log('  Test Hindi element:', {
            display: testStyle.display,
            visibility: testStyle.visibility,
            opacity: testStyle.opacity,
            fontSize: testStyle.fontSize,
            color: testStyle.color,
            dimensions: `${testRect.width}x${testRect.height}`,
            position: `${testRect.top}, ${testRect.left}`
        });
        
        if (testRect.width > 0 && testRect.height > 0) {
            console.log('✅ Test Hindi element is visible - CSS rules are working');
        } else {
            console.log('❌ Test Hindi element has zero dimensions - CSS issue detected');
        }
        
        document.body.removeChild(testDiv);
    }, 100);
    
    console.log('\n🏗️ === STRUCTURE ANALYSIS COMPLETE ===');
};

// Nuclear option - create highly visible test elements
window.createVisibleTest = function() {
    console.log('💥 === NUCLEAR VISIBILITY TEST ===');
    
    // Remove any existing test elements
    const existingTests = document.querySelectorAll('.visibility-test');
    existingTests.forEach(el => el.remove());
    
    // Create multiple test elements with different approaches
    const tests = [
        {
            name: 'Fixed Position Test',
            element: createTestElement('HINDI TEST 1: यह दिखना चाहिए', {
                position: 'fixed',
                top: '50px',
                left: '50px',
                zIndex: '999999',
                fontSize: '24px',
                color: 'red',
                backgroundColor: 'yellow',
                padding: '20px',
                border: '5px solid blue',
                fontWeight: 'bold'
            })
        },
        {
            name: 'Document Body Append Test',
            element: createTestElement('HINDI TEST 2: हिंदी टेक्स्ट', {
                display: 'block',
                fontSize: '20px',
                color: 'white',
                backgroundColor: 'red',
                padding: '15px',
                margin: '10px',
                border: '3px solid black'
            })
        },
        {
            name: 'Header Replacement Test',
            element: createTestElement('HINDI TEST 3: मुख्य शीर्षक', {
                fontSize: '30px',
                color: 'blue',
                backgroundColor: 'lightblue',
                padding: '10px',
                textAlign: 'center',
                display: 'block'
            })
        }
    ];
    
    function createTestElement(text, styles) {
        const element = document.createElement('div');
        element.className = 'visibility-test lang-hi';
        element.textContent = text;
        
        // Apply styles
        Object.keys(styles).forEach(key => {
            element.style[key] = styles[key];
        });
        
        return element;
    }
    
    // Add tests to different parts of the page
    document.body.appendChild(tests[0].element);
    document.body.appendChild(tests[1].element);
    
    // Try to replace header content
    const header = document.querySelector('header h1');
    if (header) {
        header.appendChild(tests[2].element);
    }
    
    // Check if any test elements are visible
    setTimeout(() => {
        console.log('🔍 Checking test element visibility...');
        tests.forEach((test, index) => {
            const rect = test.element.getBoundingClientRect();
            const style = window.getComputedStyle(test.element);
            
            console.log(`  ${test.name}:`, {
                dimensions: `${rect.width}x${rect.height}`,
                position: `${rect.top}, ${rect.left}`,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                zIndex: style.zIndex,
                isVisible: rect.width > 0 && rect.height > 0
            });
        });
        
        // Create an absolutely positioned overlay that covers the entire screen
        const overlay = document.createElement('div');
        overlay.className = 'visibility-test';
        overlay.innerHTML = `
            <h1>🚨 EMERGENCY VISIBILITY TEST 🚨</h1>
            <p>यदि आप यह देख सकते हैं, तो हिंदी काम कर रही है!</p>
            <p>If you can see this, Hindi is working!</p>
            <button onclick="this.parentElement.remove()">Remove Test</button>
        `;
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(255, 0, 0, 0.9) !important;
            color: white !important;
            font-size: 24px !important;
            padding: 50px !important;
            z-index: 999999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            font-family: "Noto Sans Devanagari", Arial, sans-serif !important;
        `;
        
        document.body.appendChild(overlay);
        console.log('💥 Full-screen overlay test created');
        
            console.log('💥 === NUCLEAR TEST COMPLETE ===');
    console.log('If you cannot see ANY red test elements, there is a fundamental rendering issue');
    
}, 200);
};

// Check for page refresh or redirect issues
window.checkPageRedirect = function() {
    console.log('🔄 === PAGE REDIRECT CHECK ===');
    
    // Monitor page navigation
    let navigationCount = 0;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
        navigationCount++;
        console.log('📍 pushState called:', args);
        return originalPushState.apply(this, args);
    };
    
    history.replaceState = function(...args) {
        navigationCount++;
        console.log('📍 replaceState called:', args);
        return originalReplaceState.apply(this, args);
    };
    
    // Monitor page reload
    window.addEventListener('beforeunload', function(e) {
        console.log('🔄 Page is about to reload/navigate');
    });
    
    // Monitor hash changes
    window.addEventListener('hashchange', function(e) {
        console.log('🔗 Hash change detected:', e.oldURL, '->', e.newURL);
    });
    
    // Check current URL and any potential redirects
    console.log('📍 Current URL:', window.location.href);
    console.log('📍 Referrer:', document.referrer);
    
    // Check for meta refresh tags
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh) {
        console.log('⚠️ Meta refresh detected:', metaRefresh.content);
    }
    
    // Check for JavaScript redirects in next few seconds
    setTimeout(() => {
        console.log('📊 Navigation events in last 3 seconds:', navigationCount);
        if (navigationCount > 0) {
            console.log('⚠️ Page navigation detected - this could cause blank page');
        }
    }, 3000);
    
    console.log('🔄 === REDIRECT CHECK COMPLETE ===');
};

// Master debugging function that runs all tests
window.masterDebug = function() {
    console.log('🎯 === MASTER DEBUG SESSION STARTING ===');
    console.log('This will run comprehensive tests to identify the blank page issue');
    
    // Step 1: Check page redirect
    console.log('\n🔄 Step 1: Checking for page redirects...');
    checkPageRedirect();
    
    // Step 2: Deep dive analysis
    setTimeout(() => {
        console.log('\n🔬 Step 2: Deep dive element analysis...');
        deepDiveDebug();
    }, 500);
    
    // Step 3: HTML structure check
    setTimeout(() => {
        console.log('\n🏗️ Step 3: HTML structure verification...');
        checkHTMLStructure();
    }, 1000);
    
    // Step 4: Create visible test elements
    setTimeout(() => {
        console.log('\n💥 Step 4: Creating visible test elements...');
        createVisibleTest();
    }, 1500);
    
    // Step 5: Summary and recommendations
    setTimeout(() => {
        console.log('\n📋 === MASTER DEBUG SUMMARY ===');
        console.log('🔍 If you can see the red overlay test elements, the issue is with existing content');
        console.log('❌ If you cannot see ANY test elements, there is a fundamental rendering problem');
        console.log('📱 Check if you are zoomed out too far (try Ctrl+0 to reset zoom)');
        console.log('🖥️ Try refreshing the page and running: masterDebug() immediately after clicking Hindi');
        console.log('🌐 Try opening the same page in an incognito/private browser window');
    }, 2000);
};

// WhatsApp Floating Assistant
function initWhatsAppAssistant() {
    const assistant = document.getElementById('whatsappAssistant');
    const chatBubble = document.getElementById('chatBubble');
    const doctorAvatar = document.getElementById('doctorAvatar');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');

    if (!assistant || !chatBubble || !doctorAvatar || !whatsappBtn || !closeChatBtn) {
        console.log('WhatsApp Assistant: Required elements not found');
        return;
    }

    let chatVisible = false;
    let assistantHidden = false;
    let lastScrollY = window.scrollY;

    // Show assistant with animation after page load
    setTimeout(() => {
        assistant.classList.add('animate-in');
        
        // Show doctor avatar after button animation
        setTimeout(() => {
            doctorAvatar.classList.add('show');
        }, 300);
        
        // Show chat bubble after avatar
        setTimeout(() => {
            showChatBubble();
        }, 1000);
    }, 2000);

    // Show chat bubble function
    function showChatBubble() {
        if (!chatVisible && !assistantHidden) {
            chatBubble.classList.add('show');
            chatVisible = true;
            
            // Auto-hide bubble after 8 seconds
            setTimeout(() => {
                if (chatVisible) {
                    hideChatBubble();
                }
            }, 8000);
        }
    }

    // Hide chat bubble function
    function hideChatBubble() {
        chatBubble.classList.remove('show');
        chatVisible = false;
    }

    // Close chat button functionality
    closeChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideChatBubble();
    });

    // Show chat bubble on WhatsApp button hover
    whatsappBtn.addEventListener('mouseenter', () => {
        if (!chatVisible && !assistantHidden) {
            showChatBubble();
        }
    });

    // Hide assistant on scroll down, show on scroll up
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
                // Scrolling down
                if (!assistantHidden) {
                    assistant.classList.add('hidden');
                    assistantHidden = true;
                }
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                if (assistantHidden) {
                    assistant.classList.remove('hidden');
                    assistantHidden = false;
                }
            }
            
            lastScrollY = currentScrollY;
        }, 100);
    });

    // Show bubble when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !assistantHidden) {
            setTimeout(() => {
                showChatBubble();
            }, 1000);
        }
    });

    // Add click tracking for analytics (optional)
    whatsappBtn.addEventListener('click', () => {
        // Track WhatsApp click event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': 'floating_button'
            });
        }
        
        // Optional: Track in console for testing
        console.log('WhatsApp assistant clicked - appointment booking initiated');
    });

    // Add different chat messages for variety
    const chatMessages = [
        {
            en: "Hi! Need help booking an appointment? 👋",
            hi: "नमस्ते! अपॉइंटमेंट बुक करने में मदद चाहिए? 👋"
        },
        {
            en: "Ready for healthier skin? Let's chat! ✨",
            hi: "स्वस्थ त्वचा के लिए तैयार हैं? आइए बात करते हैं! ✨"
        },
        {
            en: "Have a skin concern? I'm here to help! 🩺",
            hi: "त्वचा की कोई समस्या है? मैं मदद के लिए यहाँ हूँ! 🩺"
        },
        {
            en: "Book your consultation with Dr. Vikas! 📅",
            hi: "डॉ विकास के साथ अपना परामर्श बुक करें! 📅"
        }
    ];

    // Rotate chat messages periodically
    let messageIndex = 0;
    function rotateChatMessage() {
        const message = chatMessages[messageIndex];
        const bubbleText = chatBubble.querySelector('.bubble-text');
        
        if (bubbleText) {
            bubbleText.innerHTML = `
                <span class="lang-en">${message.en}</span>
                <span class="lang-hi">${message.hi}</span>
            `;
        }
        
        messageIndex = (messageIndex + 1) % chatMessages.length;
    }

    // Change message every 30 seconds when visible
    setInterval(() => {
        if (chatVisible && !assistantHidden) {
            rotateChatMessage();
        }
    }, 30000);

    // Typing animation (optional enhancement)
    function showTypingAnimation() {
        const bubbleText = chatBubble.querySelector('.bubble-text');
        if (bubbleText) {
            bubbleText.innerHTML = `
                <span class="lang-en">Dr. Vikas is typing</span>
                <span class="lang-hi">डॉ विकास टाइप कर रहे हैं</span>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            
            setTimeout(() => {
                rotateChatMessage();
            }, 2000);
        }
    }

    // Show typing animation occasionally for engagement
    setInterval(() => {
        if (chatVisible && !assistantHidden && Math.random() > 0.7) {
            showTypingAnimation();
        }
    }, 45000);

    console.log('WhatsApp Assistant initialized successfully');
}

// Emergency fix function for blank page issue
window.emergencyFixHindi = function() {
    console.log('🚨 === EMERGENCY HINDI FIX ===');
    
    // Force body class
    document.body.className = 'lang-hi';
    console.log('✅ Body class set to lang-hi');
    
    // Force all Hindi elements visible with aggressive styling
    const hindiElements = document.querySelectorAll('.lang-hi');
    hindiElements.forEach(element => {
        element.style.cssText = `
            display: inline !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-family: "Noto Sans Devanagari", "Noto Sans", "Mangal", sans-serif !important;
            color: #000 !important;
            font-size: 16px !important;
            position: static !important;
            transform: none !important;
            clip-path: none !important;
            white-space: normal !important;
            line-height: normal !important;
            text-indent: 0 !important;
            z-index: auto !important;
            background-color: transparent !important;
        `;
    });
    console.log('✅ All Hindi elements forced visible with aggressive styles');
    
    // Force parent containers to be visible
    const containers = document.querySelectorAll('.container, .section, main, .hero-content');
    containers.forEach(container => {
        container.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
        `;
    });
    console.log('✅ Parent containers forced visible');
    
    // Hide all English elements
    const englishElements = document.querySelectorAll('.lang-en');
    englishElements.forEach(element => {
        element.style.display = 'none !important';
    });
    console.log('✅ All English elements hidden');
    
    // Update HTML lang
    document.documentElement.lang = 'hi';
    console.log('✅ HTML lang set to hi');
    
    // Update button states
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === 'hi') {
            btn.classList.add('active');
        }
    });
    console.log('✅ Button states updated');
    
    // Save preference
    localStorage.setItem('prefLang', 'hi');
    console.log('✅ Preference saved');
    
    // Force page reflow and repaint
    document.body.offsetHeight;
    window.getComputedStyle(document.body).getPropertyValue('color');
    console.log('✅ Forced reflow and repaint');
    
    console.log('🚨 === EMERGENCY FIX COMPLETE ===');
    console.log('If page is still blank, run deepDiveDebug() for detailed analysis');
};