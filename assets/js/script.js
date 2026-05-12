import { certificationsData } from './certifications-data.js';

// 1. Initialize AOS (Animate on Scroll) 
// respects-reduced-motion natively by disabling if OS setting is active
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

// 2. Hero Section Text Rotation (With Battery/Visibility Saving API)
const rotatingTexts = [
    'Operations & Project Management Professional',
    'Google-Certified Project Manager',
    'Integrating Strategy, Operations & Human Experience',
    'Crafting Scalable, Agile Business Solutions',
    'Optimizing Systems, Teams & Project Delivery'
];

let currentIndex = 0;
const rotatingTextElement = document.getElementById('rotatingText');
let textInterval;

function rotateText() {
    if (!rotatingTextElement) return;
    rotatingTextElement.style.animation = 'none';
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % rotatingTexts.length;
        rotatingTextElement.textContent = rotatingTexts[currentIndex];
        rotatingTextElement.style.animation = 'fadeIn 0.8s ease-in-out';
    }, 50);
}

function startRotation() {
    if (!textInterval && rotatingTextElement) {
        textInterval = setInterval(rotateText, 4500);
    }
}

function stopRotation() {
    clearInterval(textInterval);
    textInterval = null;
}

startRotation();

// Pause rotation when tab is inactive to save CPU/Battery
document.addEventListener("visibilitychange", () => {
    document.hidden ? stopRotation() : startRotation();
});

// 3. Mobile Navigation Toggle with Scroll Locking
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent background scrolling
        hamburger.setAttribute('aria-expanded', !isExpanded);
    };

    hamburger.addEventListener('click', toggleMenu);

    // Allow keyboard 'Enter' to trigger the menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') toggleMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// 4. Navbar Scroll Effect (Throttled for Performance)
let ticking = false;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
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
const statsGrid = document.querySelector('.achievements-grid');
let counterAnimated = false;

if (statsGrid && counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true; 
                
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; 
                    let startTimestamp = null;

                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        counter.textContent = Math.floor(progress * target);
                        
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            counter.textContent = target; 
                        }
                    };
                    window.requestAnimationFrame(step);
                });
                
                // Disconnect completely to free memory once task is done
                counterObserver.disconnect(); 
            }
        });
    }, { threshold: 0.1 });

    counterObserver.observe(statsGrid);
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
                            ${spec.logo ? `<img src="${spec.logo}" alt="${spec.provider}" class="cert-logo" decoding="async">` : '<i class="fas fa-award"></i>'}
                        </div>
                        <span class="specialization-badge">Specialization</span>
                    </div>
                    <h3 class="cert-title">${spec.name}</h3>
                    <p class="cert-provider">${spec.provider}</p>
                    <p class="cert-date"><i class="fas fa-calendar"></i> ${spec.date}</p>
                    <a href="${spec.link}" target="_blank" rel="noopener noreferrer" class="cert-link">
                        View Certificate <i class="fas fa-external-link-alt"></i>
                    </a>
                    <button class="dropdown-toggle" data-target="${specializationId}" aria-expanded="false" aria-controls="${specializationId}">
                        Show ${spec.courses.length} Courses <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="cert-courses" id="${specializationId}">
                        ${spec.courses.map(course => `
                            <div class="course-item">
                                <h4>${course.name}</h4>
                                <p>${course.provider} • ${course.date}</p>
                                <a href="${course.link}" target="_blank" rel="noopener noreferrer" class="cert-link" style="font-size: 0.85rem; margin-top: 0.5rem; display: inline-flex;">
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
                            ${cert.logo ? `<img src="${cert.logo}" alt="${cert.provider}" class="cert-logo" decoding="async">` : '<i class="fas fa-certificate"></i>'}
                        </div>
                    </div>
                    ${cert.partOf ? `<div class="cert-tag">Part of ${cert.partOf}</div>` : ''}
                    <h3 class="cert-title">${cert.name}</h3>
                    <p class="cert-provider">${cert.provider}</p>
                    <p class="cert-date"><i class="fas fa-calendar"></i> ${cert.date}</p>
                    <a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="cert-link">
                        View Certificate <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
        });
    }

    grid.innerHTML = html;

    // Accordion functionality
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const isExpanding = !this.classList.contains('active');

            this.classList.toggle('active');
            this.setAttribute('aria-expanded', isExpanding); 
            
            if (!isExpanding) {
                targetElement.style.maxHeight = null;
                targetElement.classList.remove('active');
            } else {
                targetElement.classList.add('active');
                targetElement.style.maxHeight = targetElement.scrollHeight + 30 + "px"; 
            }
        });
    });

    window.requestAnimationFrame(() => AOS.refresh());
}

renderCertifications();

// 7. Formspree AJAX Submission
const contactForm = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success-msg');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.reset();
                contactForm.style.display = 'none';
                successMsg.style.display = 'block';
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error. Try Again.';
            submitBtn.classList.add('btn-error');
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-error'); 
            }, 4000);
        }
    });
}
