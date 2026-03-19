document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    const rotatingTexts = [
        'Operations & Project Management Professional',
        'Google-Certified Project Manager',
        'Integrating Strategy, Operations & Human Experience',
        'Crafting Scalable, Agile Business Solutions',
        'Optimizing Systems, Teams & Project Delivery'
    ];

    let currentIndex = 0;
    const rotatingTextElement = document.getElementById('rotatingText');

    function rotateText() {
        rotatingTextElement.style.animation = 'none';
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % rotatingTexts.length;
            rotatingTextElement.textContent = rotatingTexts[currentIndex];
            rotatingTextElement.style.animation = 'fadeIn 0.8s ease-in-out';
        }, 50);
    }

    setInterval(rotateText, 4500);

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;

        const aboutSection = document.querySelector('.about');
        const sectionTop = aboutSection.offsetTop;
        const sectionHeight = aboutSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition > sectionTop + sectionHeight / 3) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
            counterAnimated = true;
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    function renderCertifications() {
        const grid = document.getElementById('certificationsGrid');
        let html = '';

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
                    <button class="dropdown-toggle" data-target="${specializationId}">
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

        certificationsData.individualCertificates.forEach((cert, index) => {
            const delay = (certificationsData.specializations.length + index) * 100;
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

        grid.innerHTML = html;

        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);

                this.classList.toggle('active');
                
                if (targetElement.classList.contains('active')) {
                    targetElement.style.maxHeight = null;
                    targetElement.classList.remove('active');
                } else {
                    targetElement.classList.add('active');
                    targetElement.style.maxHeight = targetElement.scrollHeight + 30 + "px"; // +30 for padding
                }
            });
        });

        AOS.refresh();
    }

    renderCertifications();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
