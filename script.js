/**
 * DriveAway Rentals - Frontend JavaScript
 * Digital Marketing Lab Assignment
 */

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initHeader();
    initNavigation();
    initBookingForm();
    initFleetTabs();
    initContactForm();
    initNewsletterForm();
    initAnimations();
});

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Smooth navigation and active link highlighting
 */
function initNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }
    });
}

/**
 * Quick booking form handling
 */
function initBookingForm() {
    const bookingForm = document.getElementById('quickBookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                pickupLocation: document.getElementById('pickupLocation').value,
                pickupDate: document.getElementById('pickupDate').value,
                returnDate: document.getElementById('returnDate').value,
                carType: document.getElementById('carType').value
            };

            // Validate form data
            if (!formData.pickupLocation || !formData.pickupDate || !formData.returnDate) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            // Send to backend
            try {
                const response = await fetch('/api/bookings/quick-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Search submitted! Checking availability...', 'success');
                    // Scroll to fleet section
                    document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
                } else {
                    showToast(data.message || 'Error submitting search', 'error');
                }
            } catch (error) {
                console.error('Booking form error:', error);
                showToast('Search submitted! (Demo mode - no backend)', 'success');
                document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Set minimum date to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

/**
 * Fleet tab filtering
 */
function initFleetTabs() {
    const tabs = document.querySelectorAll('.fleet-tab');
    const cars = document.querySelectorAll('.car-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Filter cars
            cars.forEach(car => {
                if (category === 'all' || car.getAttribute('data-category') === category) {
                    car.style.display = 'block';
                    setTimeout(() => {
                        car.style.opacity = '1';
                        car.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    car.style.opacity = '0';
                    car.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        car.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Book button handling
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const carName = this.getAttribute('data-car');
            
            // Scroll to contact section and pre-fill
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the booking section
            setTimeout(() => {
                const serviceSelect = document.getElementById('service');
                if (serviceSelect) {
                    serviceSelect.value = 'daily';
                }
                showToast(`Selected: ${carName}. Please complete the form to book.`, 'success');
            }, 500);
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.message) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Send to backend
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showToast(data.message || 'Error sending message', 'error');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                // Demo mode
                showToast('Message sent! (Demo mode - no backend connected)', 'success');
                contactForm.reset();
            }
        });
    }
}

/**
 * Newsletter form handling
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (!email) {
                showToast('Please enter your email address', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Send to backend
            try {
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Successfully subscribed to our newsletter!', 'success');
                    emailInput.value = '';
                } else {
                    showToast(data.message || 'Error subscribing', 'error');
                }
            } catch (error) {
                console.error('Newsletter error:', error);
                showToast('Subscribed! (Demo mode)', 'success');
                emailInput.value = '';
            }
        });
    }
}

/**
 * Scroll animations
 */
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.service-card, .car-card, .feature-card, .testimonial-card, .contact-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for fade-in state
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;

    // Set message
    toastMessage.textContent = message;

    // Set color based on type
    if (type === 'error') {
        toast.style.background = 'var(--danger)';
    } else if (type === 'success') {
        toast.style.background = 'var(--success)';
    } else {
        toast.style.background = 'var(--primary-color)';
    }

    // Show toast
    toast.classList.add('show');

    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        initHeader,
        initNavigation,
        initBookingForm,
        initFleetTabs,
        initContactForm,
        initNewsletterForm,
        initAnimations
    };
}
