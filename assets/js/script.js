document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // 2. Hero Section Text Rotation
    const rotatingTexts = [
        'Operations & Project Management Professional',
        'Google-Certified Project Manager',
        'Integrating Strategy, Operations & Human Experience',
        'Crafting Scalable, Agile Business Solutions',
        'Optimizing Systems, Teams & Project Delivery'
    ];

    let currentIndex = 0;
    const rotatingTextElement = document.getElementById('rotatingText');

    if (rotatingTextElement) {
        function rotateText() {
            rotatingTextElement.style.animation = 'none';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % rotatingTexts.length;
                rotatingTextElement.textContent = rotatingTexts[currentIndex];
                rotatingTextElement.style.animation = 'fadeIn 0.8s ease-in-out';
            }, 50);
        }
        setInterval(rotateText, 4500);
    }

    // 3. Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Accessibility state
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 4. Navbar Scroll Effect (Performance Optimized)
    let ticking = false;
    
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // 5. Performance-Optimized Number Counters (Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counterAnimated) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    counter.textContent = Math.floor(progress * target);
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        counter.textContent = target; // Ensure it ends exactly on target
                    }
                };
                window.requestAnimationFrame(step);
            });
            counterAnimated = true;
            counterObserver.unobserve(entries[0].target); // Stop observing once done
        }
    }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

    const aboutSection = document.querySelector('.about');
    if (aboutSection && counters.length > 0) {
        counterObserver.observe(aboutSection);
    }

    // 6. Render Certifications Dynamically
    function renderCertifications() {
        const grid = document.getElementById('certificationsGrid');
        if (!grid || typeof certificationsData === 'undefined') return;
        
        let html = '';

        // Render Specializations
        if (certificationsData.specializations) {
            certificationsData.specializations.forEach((spec, index) => {
                const specializationId = `spec-${index}`;
                html += `
                    <div class="cert-card specialization" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="cert-header">
                            <div class="cert-icon">
                                ${spec.logo ? `<img src="${spec.logo}" alt="${spec.provider}" class="cert-logo">` : '<i class="fas fa-award"></i>'}
                            </div>
                            <span class="specialization-badge">Specialization</span>
                        </div>
                        <h3 class="cert-title">${spec.name}</h3>
                        <p class="cert-provider">${spec.provider}</p>
                        <p class="cert-date"><i class="fas fa-calendar"></i> ${spec.date}</p>
                        <a href="${spec.link}" target="_blank" class="cert-link">
                            View Certificate <i class="fas fa-external-link-alt"></i>
                        </a>
                        <button class="dropdown-toggle" data-target="${specializationId}" aria-expanded="false">
                            Show ${spec.courses.length} Courses <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="cert-courses" id="${specializationId}">
                            ${spec.courses.map(course => `
                                <div class="course-item">
                                    <h4>${course.name}</h4>
                                    <p>${course.provider} • ${course.date}</p>
                                    <a href="${course.link}" target="_blank" class="cert-link" style="font-size: 0.85rem; margin-top: 0.5rem; display: inline-flex;">
                                        View <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
        }

        // Render Individual Certificates
        if (certificationsData.individualCertificates) {
            certificationsData.individualCertificates.forEach((cert, index) => {
                const baseDelay = certificationsData.specializations ? certificationsData.specializations.length : 0;
                const delay = (baseDelay + index) * 100;
                html += `
                    <div class="cert-card" data-aos="fade-up" data-aos-delay="${delay > 600 ? 600 : delay}">
                        <div class="cert-header">
                            <div class="cert-icon">
                                ${cert.logo ? `<img src="${cert.logo}" alt="${cert.provider}" class="cert-logo">` : '<i class="fas fa-certificate"></i>'}
                            </div>
                        </div>
                        ${cert.partOf ? `<div class="cert-tag">Part of ${cert.partOf}</div>` : ''}
                        <h3 class="cert-title">${cert.name}</h3>
                        <p class="cert-provider">${cert.provider}</p>
                        <p class="cert-date"><i class="fas fa-calendar"></i> ${cert.date}</p>
                        <a href="${cert.link}" target="_blank" class="cert-link">
                            View Certificate <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                `;
            });
        }

        grid.innerHTML = html;

        // Accordion functionality for courses with a11y support
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                this.classList.toggle('active');
                this.setAttribute('aria-expanded', !isExpanded); // Toggle accessibility state
                
                if (targetElement.classList.contains('active')) {
                    targetElement.style.maxHeight = null;
                    targetElement.classList.remove('active');
                } else {
                    targetElement.classList.add('active');
                    targetElement.style.maxHeight = targetElement.scrollHeight + 30 + "px"; // +30 for padding
                }
            });
        });

        // Refresh AOS after DOM manipulation
        window.requestAnimationFrame(() => {
            AOS.refresh();
        });
    }

    renderCertifications();

    // 7. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ignore if it's just '#'
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Adjust for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Formspree AJAX Submission (Stay on Page)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success state
                    contactForm.reset();
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.backgroundColor = '#10b981'; // Tailwind emerald-500
                    submitBtn.style.borderColor = '#10b981';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error state
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error. Try Again.';
                submitBtn.style.backgroundColor = '#ef4444'; // Tailwind red-500
                submitBtn.style.borderColor = '#ef4444';
            } finally {
                // Reset button after 4 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = ''; // Reset to default CSS
                    submitBtn.style.borderColor = '';     // Reset to default CSS
                }, 4000);
            }
        });
    }
});
