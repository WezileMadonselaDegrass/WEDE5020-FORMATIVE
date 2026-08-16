/**
 * ============================================
 * SHOUT OUT — Luxury Cybersecurity
 * Main JavaScript
 * ============================================
 * 
 * Table of Contents:
 * 1. Mobile Navigation
 * 2. Header Scroll Effect
 * 3. Product Filtering
 * 4. Product Enquiry Buttons
 * 5. Enquiry Form Validation
 * 6. Contact Form Validation
 * 7. Message Character Counter
 * 8. Smooth Scrolling
 * 9. Back to Top
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 1. Mobile Navigation
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
        });

        // Close nav when a link is clicked (mobile)
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close nav on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // ============================================
    // 2. Header Scroll Effect
    // ============================================
    const header = document.querySelector('.site-header');
    let lastScrollY = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ============================================
    // 3. Product Filtering
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Update active button state
                filterButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                const filterValue = this.getAttribute('data-filter');

                // Filter products
                productCards.forEach(function(card) {
                    const categories = card.getAttribute('data-category') || '';
                    const categoryList = categories.split(' ');

                    if (filterValue === 'all' || categoryList.includes(filterValue)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });

                // Announce filter change to screen readers
                const visibleCount = document.querySelectorAll('.product-card:not(.hidden)').length;
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.classList.add('visually-hidden');
                announcement.textContent = `Showing ${visibleCount} products`;
                document.body.appendChild(announcement);
                setTimeout(function() {
                    announcement.remove();
                }, 2000);
            });
        });
    }

    // ============================================
    // 4. Product Enquiry Buttons
    // ============================================
    const enquiryButtons = document.querySelectorAll('.btn-enquiry');
    if (enquiryButtons.length > 0) {
        enquiryButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const productName = this.getAttribute('data-product') || '';
                // Redirect to enquiry page with product prefilled if possible
                const enquiryUrl = 'enquiry.html';
                // Store product name in sessionStorage for the enquiry page to pick up
                if (productName) {
                    sessionStorage.setItem('selectedProduct', productName);
                }
                window.location.href = enquiryUrl;
            });
        });
    }

    // Auto-fill product on enquiry page if coming from product card
    if (window.location.pathname.includes('enquiry.html')) {
        const selectedProduct = sessionStorage.getItem('selectedProduct');
        if (selectedProduct) {
            const productSelect = document.getElementById('productService');
            if (productSelect) {
                // Try to match the product name to a select option
                const options = productSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].textContent.trim().toLowerCase() === selectedProduct.toLowerCase()) {
                        productSelect.value = options[i].value;
                        break;
                    }
                }
            }
            sessionStorage.removeItem('selectedProduct');
        }
    }

    // ============================================
    // 5. Enquiry Form Validation
    // ============================================
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const isValid = validateEnquiryForm(this);
            if (isValid) {
                // Show success message
                const successDiv = document.getElementById('formSuccess');
                if (successDiv) {
                    successDiv.hidden = false;
                }
                this.reset();
                // Reset character counter
                const msgInput = document.getElementById('message');
                const msgCount = document.getElementById('messageCount');
                if (msgInput && msgCount) {
                    msgCount.textContent = '0 / 500 characters';
                }
                // Scroll to success message
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    function validateEnquiryForm(form) {
        let isValid = true;

        // Full Name
        const fullName = document.getElementById('fullName');
        const nameError = document.getElementById('fullNameError');
        if (fullName && nameError) {
            const nameValue = fullName.value.trim();
            if (nameValue.length < 2) {
                nameError.textContent = 'Please enter your full name (minimum 2 characters).';
                fullName.classList.add('error');
                isValid = false;
            } else if (!/^[a-zA-Z\s'-]+$/.test(nameValue)) {
                nameError.textContent = 'Name should only contain letters, spaces, hyphens and apostrophes.';
                fullName.classList.add('error');
                isValid = false;
            } else {
                nameError.textContent = '';
                fullName.classList.remove('error');
            }
        }

        // Email
        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        if (email && emailError) {
            const emailValue = email.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailValue) {
                emailError.textContent = 'Please enter your email address.';
                email.classList.add('error');
                isValid = false;
            } else if (!emailPattern.test(emailValue)) {
                emailError.textContent = 'Please enter a valid email address (e.g., name@domain.com).';
                email.classList.add('error');
                isValid = false;
            } else {
                emailError.textContent = '';
                email.classList.remove('error');
            }
        }

        // Phone
        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        if (phone && phoneError) {
            const phoneValue = phone.value.trim();
            // Simple SA phone validation (basic)
            const phonePattern = /^[0-9\s+\-()]{10,15}$/;
            if (!phoneValue) {
                phoneError.textContent = 'Please enter your phone number.';
                phone.classList.add('error');
                isValid = false;
            } else if (!phonePattern.test(phoneValue)) {
                phoneError.textContent = 'Please enter a valid phone number (e.g., 082 123 4567).';
                phone.classList.add('error');
                isValid = false;
            } else {
                phoneError.textContent = '';
                phone.classList.remove('error');
            }
        }

        // Branch
        const branch = document.getElementById('branch');
        const branchError = document.getElementById('branchError');
        if (branch && branchError) {
            if (!branch.value) {
                branchError.textContent = 'Please select a preferred branch.';
                branch.classList.add('error');
                isValid = false;
            } else {
                branchError.textContent = '';
                branch.classList.remove('error');
            }
        }

        // Product/Service
        const productService = document.getElementById('productService');
        const productServiceError = document.getElementById('productServiceError');
        if (productService && productServiceError) {
            if (!productService.value) {
                productServiceError.textContent = 'Please select a product or service of interest.';
                productService.classList.add('error');
                isValid = false;
            } else {
                productServiceError.textContent = '';
                productService.classList.remove('error');
            }
        }

        // Contact Method
        const contactMethod = document.getElementById('contactMethod');
        const contactMethodError = document.getElementById('contactMethodError');
        if (contactMethod && contactMethodError) {
            if (!contactMethod.value) {
                contactMethodError.textContent = 'Please select a preferred contact method.';
                contactMethod.classList.add('error');
                isValid = false;
            } else {
                contactMethodError.textContent = '';
                contactMethod.classList.remove('error');
            }
        }

        // Message
        const message = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (message && messageError) {
            const msgValue = message.value.trim();
            if (msgValue.length < 10) {
                messageError.textContent = 'Please enter a message of at least 10 characters.';
                message.classList.add('error');
                isValid = false;
            } else if (msgValue.length > 500) {
                messageError.textContent = 'Message must not exceed 500 characters.';
                message.classList.add('error');
                isValid = false;
            } else {
                messageError.textContent = '';
                message.classList.remove('error');
            }
        }

        // Consent
        const consent = document.getElementById('consent');
        const consentError = document.getElementById('consentError');
        if (consent && consentError) {
            if (!consent.checked) {
                consentError.textContent = 'Please consent to us contacting you about your enquiry.';
                consent.classList.add('error');
                isValid = false;
            } else {
                consentError.textContent = '';
                consent.classList.remove('error');
            }
        }

        return isValid;
    }

    // ============================================
    // 6. Contact Form Validation
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const isValid = validateContactForm(this);
            if (isValid) {
                const successDiv = document.getElementById('contactSuccess');
                if (successDiv) {
                    successDiv.hidden = false;
                }
                this.reset();
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    function validateContactForm(form) {
        let isValid = true;

        // Name
        const name = document.getElementById('contactName');
        const nameError = document.getElementById('contactNameError');
        if (name && nameError) {
            const nameValue = name.value.trim();
            if (nameValue.length < 2) {
                nameError.textContent = 'Please enter your full name.';
                name.classList.add('error');
                isValid = false;
            } else {
                nameError.textContent = '';
                name.classList.remove('error');
            }
        }

        // Email
        const email = document.getElementById('contactEmail');
        const emailError = document.getElementById('contactEmailError');
        if (email && emailError) {
            const emailValue = email.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailValue || !emailPattern.test(emailValue)) {
                emailError.textContent = 'Please enter a valid email address.';
                email.classList.add('error');
                isValid = false;
            } else {
                emailError.textContent = '';
                email.classList.remove('error');
            }
        }

        // Subject
        const subject = document.getElementById('contactSubject');
        const subjectError = document.getElementById('contactSubjectError');
        if (subject && subjectError) {
            if (subject.value.trim().length < 3) {
                subjectError.textContent = 'Please enter a subject (minimum 3 characters).';
                subject.classList.add('error');
                isValid = false;
            } else {
                subjectError.textContent = '';
                subject.classList.remove('error');
            }
        }

        // Message
        const message = document.getElementById('contactMessage');
        const messageError = document.getElementById('contactMessageError');
        if (message && messageError) {
            if (message.value.trim().length < 10) {
                messageError.textContent = 'Please enter a message of at least 10 characters.';
                message.classList.add('error');
                isValid = false;
            } else {
                messageError.textContent = '';
                message.classList.remove('error');
            }
        }

        return isValid;
    }

    // ============================================
    // 7. Message Character Counter
    // ============================================
    const msgTextarea = document.getElementById('message');
    const msgCount = document.getElementById('messageCount');

    if (msgTextarea && msgCount) {
        msgTextarea.addEventListener('input', function() {
            const length = this.value.length;
            msgCount.textContent = length + ' / 500 characters';
            
            // Highlight if over limit
            if (length > 500) {
                msgCount.style.color = '#c0392b';
                this.classList.add('error');
            } else {
                msgCount.style.color = '';
                this.classList.remove('error');
            }
        });
    }

    // ============================================
    // 8. Smooth Scrolling for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header').offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // ============================================
    // 9. Back to Top (with keyboard support)
    // ============================================
    // Create back to top button dynamically
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-black);
        color: var(--color-white);
        font-size: 1.5rem;
        border: 2px solid var(--color-gold);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all var(--transition-medium);
        z-index: 999;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(backToTop);

    // Show/hide based on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
            backToTop.style.transform = 'translateY(20px)';
        }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Keyboard support for back to top
    backToTop.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    console.log('SHOUT OUT — Luxury Cybersecurity website initialised successfully.');
});