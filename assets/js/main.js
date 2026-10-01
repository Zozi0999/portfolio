// Digital Portfolio Logic & Bilingual Engine - Zozi Atul Azimi

let currentLang = localStorage.getItem('user_lang') || 'en';
let typedTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initParticleCanvas();
    initCertFilter();
    initCertModal();
    initMobileMenu();
    initContactForm();
    initCopyEmailButton();
    initScrollSpy();
});

// 1. Internationalization (i18n) Engine
function initLanguage() {
    applyLanguage(currentLang);

    // Desktop Toggles
    const btnEn = document.getElementById('lang-btn-en');
    const btnId = document.getElementById('lang-btn-id');

    // Mobile Toggles
    const mobBtnEn = document.getElementById('mob-lang-en');
    const mobBtnId = document.getElementById('mob-lang-id');

    function updateToggleUI(lang) {
        const activeClasses = ['bg-cyan-500', 'text-slate-950', 'font-bold', 'shadow-md', 'shadow-cyan-500/30'];
        const inactiveClasses = ['text-slate-400', 'hover:text-white', 'font-medium'];

        [btnEn, mobBtnEn].forEach(el => {
            if (!el) return;
            if (lang === 'en') {
                el.classList.add(...activeClasses);
                el.classList.remove(...inactiveClasses);
            } else {
                el.classList.remove(...activeClasses);
                el.classList.add(...inactiveClasses);
            }
        });

        [btnId, mobBtnId].forEach(el => {
            if (!el) return;
            if (lang === 'id') {
                el.classList.add(...activeClasses);
                el.classList.remove(...inactiveClasses);
            } else {
                el.classList.remove(...activeClasses);
                el.classList.add(...inactiveClasses);
            }
        });
    }

    if (btnEn) btnEn.addEventListener('click', () => switchLanguage('en'));
    if (btnId) btnId.addEventListener('click', () => switchLanguage('id'));
    if (mobBtnEn) mobBtnEn.addEventListener('click', () => switchLanguage('en'));
    if (mobBtnId) mobBtnId.addEventListener('click', () => switchLanguage('id'));

    updateToggleUI(currentLang);
}

function switchLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem('user_lang', lang);
    applyLanguage(lang);

    // Update active UI pills
    const btnEn = document.getElementById('lang-btn-en');
    const btnId = document.getElementById('lang-btn-id');
    const mobBtnEn = document.getElementById('mob-lang-en');
    const mobBtnId = document.getElementById('mob-lang-id');

    const activeClasses = ['bg-cyan-500', 'text-slate-950', 'font-bold', 'shadow-md', 'shadow-cyan-500/30'];
    const inactiveClasses = ['text-slate-400', 'hover:text-white', 'font-medium'];

    [btnEn, mobBtnEn].forEach(el => {
        if (!el) return;
        if (lang === 'en') {
            el.classList.add(...activeClasses);
            el.classList.remove(...inactiveClasses);
        } else {
            el.classList.remove(...activeClasses);
            el.classList.add(...inactiveClasses);
        }
    });

    [btnId, mobBtnId].forEach(el => {
        if (!el) return;
        if (lang === 'id') {
            el.classList.add(...activeClasses);
            el.classList.remove(...inactiveClasses);
        } else {
            el.classList.remove(...activeClasses);
            el.classList.add(...inactiveClasses);
        }
    });

    // Re-init typed effect
    initTypedEffect();
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    const dict = translations[lang] || translations.en;

    // Replace text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // Replace placeholder elements
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    // Re-init typed effect
    initTypedEffect();
}

// 2. Dynamic Typed Text Effect
function initTypedEffect() {
    if (typedTimeout) clearTimeout(typedTimeout);

    const roles = typedRoles[currentLang] || typedRoles.en;
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTarget = document.getElementById('typed-text');

    if (!typedTarget) return;
    typedTarget.textContent = '';

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 65;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 350;
        }

        typedTimeout = setTimeout(type, typeSpeed);
    }

    type();
}

// 3. Interactive Constellation Canvas Background
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor(width * 0.05), 55);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.8 + 0.8;
            this.color = Math.random() > 0.5 ? '#06b6d4' : '#6366f1';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${0.12 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Mouse proximity interaction
            if (mouse.x !== null && mouse.y !== null) {
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - mdist / 140)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// 4. Certificate Filter System
function initCertFilter() {
    const filterButtons = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-cyan-500', 'text-slate-950', 'shadow-lg', 'shadow-cyan-500/20');
                b.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
            });

            btn.classList.add('active', 'bg-cyan-500', 'text-slate-950', 'shadow-lg', 'shadow-cyan-500/20');
            btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-800');

            const filterValue = btn.getAttribute('data-filter');

            certCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || cardCategory.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

// 5. Certificate Lightbox Modal
function initCertModal() {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalIssuer = document.getElementById('modal-issuer');
    const modalId = document.getElementById('modal-id');
    const modalDate = document.getElementById('modal-date');
    const modalPdfLink = document.getElementById('modal-pdf-link');
    const modalDownloadLink = document.getElementById('modal-download-link');
    const modalClose = document.getElementById('modal-close');

    if (!modal) return;

    const triggers = document.querySelectorAll('.cert-preview-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = trigger.getAttribute('data-img');
            const pdfSrc = trigger.getAttribute('data-pdf');
            const title = trigger.getAttribute('data-title');
            const issuer = trigger.getAttribute('data-issuer');
            const id = trigger.getAttribute('data-id');
            const date = trigger.getAttribute('data-date');

            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalIssuer.textContent = issuer;
            modalId.textContent = id;
            modalDate.textContent = date;

            modalPdfLink.href = pdfSrc;
            modalDownloadLink.href = pdfSrc;
            modalDownloadLink.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
            }, 10);
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.add('opacity-0');
        modal.classList.remove('opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// 6. Mobile Navigation
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        });
    });
}

// 7. Copy Email Button Handler
function initCopyEmailButton() {
    const copyBtn = document.getElementById('copy-email-btn');
    const copyText = document.getElementById('copy-email-text');
    if (!copyBtn || !copyText) return;

    copyBtn.addEventListener('click', () => {
        const email = copyBtn.getAttribute('data-email') || 'zoziazimi@gmail.com';
        const dict = translations[currentLang] || translations.en;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
                showCopiedFeedback();
            }).catch(() => fallbackCopy(email));
        } else {
            fallbackCopy(email);
        }

        function showCopiedFeedback() {
            copyText.textContent = dict.contact_copied || 'Copied!';
            copyBtn.classList.add('border-emerald-500', 'text-emerald-400', 'bg-emerald-950/40');
            setTimeout(() => {
                copyText.textContent = dict.contact_copy_btn || 'Copy';
                copyBtn.classList.remove('border-emerald-500', 'text-emerald-400', 'bg-emerald-950/40');
            }, 2000);
        }

        function fallbackCopy(text) {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showCopiedFeedback();
        }
    });
}

// 8. Contact Form Interactive Feedback (Webmail Direct)
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sender-name').value;
        const email = document.getElementById('sender-email').value;
        const subject = document.getElementById('sender-subject').value || 'AI Collaboration / Project';
        const message = document.getElementById('sender-message').value;

        // Button state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i><span>Processing...</span>`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i><span>${currentLang === 'en' ? 'Send Message Now' : 'Kirim Pesan Sekarang'}</span>`;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=zoziazimi@gmail.com&su=${encodeURIComponent(`[Portfolio Inquiry] ${subject} - ${name}`)}&body=${encodeURIComponent(`Hi Zozi Atul Azimi,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`)}`;

            feedback.classList.remove('hidden');
            feedback.className = 'p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-slate-200 block space-y-3';
            
            if (currentLang === 'en') {
                feedback.innerHTML = `
                    <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <i class="fa-solid fa-circle-check text-lg"></i>
                        <span>Message Ready to Dispatch!</span>
                    </div>
                    <p class="text-xs text-slate-300">
                        Thank you <strong>${name}</strong>! You can now launch Gmail web compose directly with pre-filled details:
                    </p>
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                        <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20">
                            <i class="fa-brands fa-google"></i>
                            <span>Open & Send via Gmail Web</span>
                        </a>
                        <button type="button" id="copy-quick-email" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors">
                            <i class="fa-regular fa-copy mr-1"></i> Copy Email (zoziazimi@gmail.com)
                        </button>
                    </div>
                `;
            } else {
                feedback.innerHTML = `
                    <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <i class="fa-solid fa-circle-check text-lg"></i>
                        <span>Pesan Siap Dikirim!</span>
                    </div>
                    <p class="text-xs text-slate-300">
                        Terima kasih <strong>${name}</strong>! Anda dapat langsung membuka form email di Gmail Web:
                    </p>
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                        <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20">
                            <i class="fa-brands fa-google"></i>
                            <span>Buka di Gmail Web</span>
                        </a>
                        <button type="button" id="copy-quick-email" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors">
                            <i class="fa-regular fa-copy mr-1"></i> Salin Email (zoziazimi@gmail.com)
                        </button>
                    </div>
                `;
            }

            const copyQuickBtn = document.getElementById('copy-quick-email');
            if (copyQuickBtn) {
                copyQuickBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText('zoziazimi@gmail.com');
                    copyQuickBtn.innerHTML = `<i class="fa-solid fa-check mr-1 text-emerald-400"></i> ${currentLang === 'en' ? 'Email Copied!' : 'Email Tersalin!'}`;
                    setTimeout(() => {
                        copyQuickBtn.innerHTML = `<i class="fa-regular fa-copy mr-1"></i> ${currentLang === 'en' ? 'Copy Email (zoziazimi@gmail.com)' : 'Salin Email (zoziazimi@gmail.com)'}`;
                    }, 2000);
                });
            }

            form.reset();
        }, 600);
    });
}

// 9. ScrollSpy Active Nav Link Indicator
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-cyan-400', 'bg-slate-800/80');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-cyan-400', 'bg-slate-800/80');
            }
        });
    });
}
