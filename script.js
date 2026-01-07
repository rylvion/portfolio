// ==========================================
// BACK TO TOP BUTTON
// ==========================================

/**
 * Initialize back to top button functionality
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 100));
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// PROJECT TAG FILTERING (FUTURE ENHANCEMENT)
// ==========================================

/**
 * Filter projects by tag
 * @param {string} tag - Tag to filter by
 */
function filterProjectsByTag(tag) {
    const projectCards = document.querySelectorAll('.project-card');
    const target = tag.toLowerCase();

    projectCards.forEach(card => {
        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
        const matches = target === 'all' || tags.includes(target);

        card.classList.toggle('is-hidden', !matches);
        card.setAttribute('aria-hidden', (!matches).toString());
    });
}

/**
 * Wire up project filter buttons
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tag = btn.getAttribute('data-tag') || 'all';
            filterProjectsByTag(tag);
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ========================================== 

/**
 * Animate elements on scroll into view
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.project-card, .tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ==========================================
// PROJECT DETAIL MODALS
// ==========================================

const projectDetails = {
    'uncon-visualizer': {
        title: 'Unconventional Abilities Visualizer',
        description: 'Interactive radar charts to compare abilities across multiple stats for the Roblox game Unconventional.',
        features: [
            'Radar chart with power, agility, defense, intelligence, and perception',
            'Data sourced from Google Sheets',
            'Responsive UI with accessibility focus'
        ],
        live: 'https://rylvion.github.io/unconventional/',
        repo: 'https://github.com/rylvion/unconventional'
    },
    'uncon-wiki': {
        title: 'Unconventional Wiki',
        description: 'Community-driven wiki documenting mechanics, items, and strategies for the Unconventional Roblox game.',
        features: [
            '15+ pages live, goal to 100',
            'MediaWiki-powered with community contributions',
            'Active maintenance'
        ],
        live: 'https://uncon.fandom.com',
        repo: ''
    },
    'portfolio': {
        title: 'Portfolio Website',
        description: 'This portfolio site showcasing projects, accessibility, and responsive design.',
        features: [
            'Dark mode with system preference',
            'Project filters and back-to-top',
            'Accessible navigation and responsive layout'
        ],
        live: 'https://rylvion.github.io/portfolio',
        repo: 'https://github.com/rylvion/portfolio'
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('#modal-title');
    const descEl = modal.querySelector('#modal-description');
    const featuresEl = modal.querySelector('#modal-features');
    const liveEl = modal.querySelector('#modal-live');
    const repoEl = modal.querySelector('#modal-repo');
    const modalContent = modal.querySelector('.modal-content');
    const closeEls = modal.querySelectorAll('[data-close-modal]');
    const triggers = document.querySelectorAll('.view-details');
    let lastFocus = null;

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (lastFocus) lastFocus.focus();
    };

    const openModal = (key, trigger) => {
        const data = projectDetails[key];
        if (!data) return;
        lastFocus = trigger || null;
        titleEl.textContent = data.title;
        descEl.textContent = data.description;
        featuresEl.innerHTML = '';
        data.features.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            featuresEl.appendChild(li);
        });

        liveEl.href = data.live || '#';
        liveEl.classList.toggle('is-hidden', !data.live);

        if (data.repo) {
            repoEl.href = data.repo;
            repoEl.classList.remove('is-hidden');
        } else {
            repoEl.classList.add('is-hidden');
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        if (modalContent) modalContent.focus();
    };

    triggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            openModal(key, btn);
        });
    });

    closeEls.forEach(el => el.addEventListener('click', closeModal));
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    modal.addEventListener('click', (e) => {
        if (e.target.dataset.closeModal !== undefined) closeModal();
    });
}

// Updates feature removed

// ==========================================
// CONTACT UTILITIES
// ==========================================

function initCopyEmail() {
    const copyBtns = document.querySelectorAll('.copy-email');
    if (!copyBtns.length) return;

    copyBtns.forEach(btn => {
        const status = btn.parentElement?.querySelector('.copy-status');
        btn.addEventListener('click', async () => {
            const email = btn.getAttribute('data-email');
            if (!email) return;
            try {
                await navigator.clipboard.writeText(email);
                if (status) status.textContent = 'Copied!';
            } catch (err) {
                if (status) status.textContent = 'Press Ctrl/Cmd+C to copy';
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const reason = form.reason.value;
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            status.textContent = 'Please fill out name, email, and message.';
            return;
        }

        const subject = encodeURIComponent(`${reason} from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`);
        const mailto = `mailto:abdurahmansharif.uk@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailto;
        status.textContent = 'Opening your mail app...';
        form.reset();
    });
}

// Resume feature disabled: no CV available currently.

// ==========================================
// ==========================================

/**
 * Initialize dark mode on page load
 * Check for user preference, localStorage, or system preference
 */
function initDarkMode() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    // Get stored theme preference or default to system preference
    let theme = localStorage.getItem('theme');
    
    if (!theme) {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    
    // Apply theme
    applyTheme(theme);
    
    // Add event listener to toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Apply theme to the document
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
            themeToggle.title = 'Switch to light mode';
        }
    } else {
        html.removeAttribute('data-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            themeToggle.title = 'Switch to dark mode';
        }
    }
    
    // Store preference
    localStorage.setItem('theme', theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
}

// ==========================================
// SMOOTH SCROLL & SCROLL TO TOP
// ==========================================

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

/**
 * Add keyboard navigation support for nav links
 */
function initKeyboardNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextLink = navLinks[(index + 1) % navLinks.length];
                nextLink.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevLink = navLinks[(index - 1 + navLinks.length) % navLinks.length];
                prevLink.focus();
            }
        });
    });
}

/**
 * Manage focus visibility
 */
function initFocusVisibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

// ==========================================
// PERFORMANCE & INTERSECTION OBSERVER
// ==========================================

/**
 * Add intersection observer for fade-in animations on scroll
 */
function initIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ==========================================
// FORM VALIDATION (FOR FUTURE USE)
// ==========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialize animation card expand/collapse functionality with modal
 */
function initAnimationCardExpand() {
    const modal = document.getElementById('animation-modal');
    const modalTitle = document.getElementById('animation-modal-title');
    const modalBody = document.getElementById('animation-modal-body');
    const modalClose = modal.querySelector('.modal-close');
    
    // Ensure modal starts hidden
    if (!modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
    }
    
    // Close button click
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAnimationModal();
        });
    }
    
    // Close on modal background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAnimationModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeAnimationModal();
        }
    });
    
    // Close modal
    function closeAnimationModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    const animations = {
        'bomb': {
            title: 'Bomb Animation',
            video: 'assets/Bomb.mp4',
            specs: '11 frames • 1 second',
            description: 'A quick explosive charge-up animation showcasing rapid frame transitions and energy buildup.'
        },
        'first-project': {
            title: 'My First Project',
            video: 'assets/MyFirstProject.mp4',
            specs: '54-56 frames • 12 FPS • ~4 seconds',
            description: 'My first complete animation project created on January 1st. A detailed sequence demonstrating frame-by-frame animation techniques.'
        },
        'roblox-vfx': {
            title: 'Roblox VFX Preview',
            image: 'assets/rblx vfx.png',
            specs: 'Static preview • Charging → Absorption → Explosion',
            description: 'Visual effects reference showing the complete sequence: energy charging up, being sucked from the atmosphere, and the final explosive impact.'
        }
    };
    
    // Open modal
    function openAnimationModal(animationKey) {
        const animation = animations[animationKey];
        if (!animation) return;
        
        modalTitle.textContent = animation.title;
        
        let content = '';
        if (animation.video) {
            content = `
                <video autoplay muted loop playsinline style="width: 100%; height: auto; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
                    <source src="${animation.video}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        } else if (animation.image) {
            content = `
                <img src="${animation.image}" alt="${animation.title}" style="width: 100%; height: auto; border-radius: var(--radius-lg); margin-bottom: 1.5rem;" />
            `;
        }
        
        content += `
            <p style="font-weight: 700; color: var(--primary-color); margin: 1rem 0 0.5rem 0; font-size: 0.95rem;">${animation.specs}</p>
            <p style="color: var(--text-medium); font-size: 0.95rem; line-height: 1.6;">${animation.description}</p>
        `;
        
        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        modalClose.focus();
    }
    
    // Close modal
    function closeAnimationModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Attach click handlers to animation cards
    document.querySelectorAll('.animation-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const h3 = card.querySelector('h3');
            let animationKey = '';
            
            // Determine which animation was clicked
            const cardText = h3.textContent.toLowerCase();
            if (cardText.includes('bomb')) {
                animationKey = 'bomb';
            } else if (cardText.includes('first') || cardText.includes('project')) {
                animationKey = 'first-project';
            } else if (cardText.includes('roblox') || cardText.includes('vfx')) {
                animationKey = 'roblox-vfx';
            }
            
            if (animationKey) {
                openAnimationModal(animationKey);
            }
        });
    });
    
    // Close button click
    modalClose.addEventListener('click', closeAnimationModal);
    
    // Close on modal background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAnimationModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeAnimationModal();
        }
    });
}

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string}
 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initBackToTop();
    initProjectFilters();
    initSmoothScroll();
    initKeyboardNavigation();
    initFocusVisibility();
    initIntersectionObserver();
    initScrollAnimations();
    initCopyEmail();
    initContactForm();
    initProjectModals();
    initAnimationCardExpand();
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function for performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Log message with timestamp (for debugging)
 * @param {string} message - Message to log
 */
function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}
