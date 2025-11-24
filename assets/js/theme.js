const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const switchLabel = document.querySelector('.theme-switch');
    if (switchLabel) {
        switchLabel.setAttribute('aria-pressed', theme === 'dark');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(currentTheme);
    if (themeToggle) {
        themeToggle.checked = currentTheme === 'dark';
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Active section highlighting for nav (stable)
    const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActiveSection = () => {
        if (!sections.length) return;
        const viewportOffset = window.innerHeight * 0.3;
        let currentId = sections[0].id;
        sections.forEach(sec => {
            const top = sec.getBoundingClientRect().top;
            if (top <= viewportOffset) {
                currentId = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                setActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setActiveSection);
    setActiveSection();

    // Accordion behavior for sections from News onward
    const initAccordions = () => {
        const accordionSections = Array.from(document.querySelectorAll('.accordion-section'));
        accordionSections.forEach(section => {
            const list = section.querySelector('.news-list, ol.bibliography, ul, ol');
            if (!list) return;

            const items = Array.from(list.children).filter(node => node.tagName && node.tagName.toLowerCase() === 'li');
            if (items.length <= 2) return;

            const hiddenItems = items.slice(2);
            hiddenItems.forEach(item => item.classList.add('accordion-item-hidden'));

            const control = document.createElement('div');
            control.className = 'accordion-control';

            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'accordion-toggle';
            toggle.setAttribute('aria-expanded', 'false');

            const heading = section.querySelector('h2');
            const headingText = heading ? heading.textContent.trim() : 'items';
            toggle.setAttribute('aria-label', `Show all ${headingText}`);

            toggle.innerHTML = `
                <span class="accordion-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 9l6 6 6-6"></path>
                    </svg>
                </span>
                <span class="accordion-toggle-text">Show all</span>
            `;

            control.appendChild(toggle);
            list.insertAdjacentElement('afterend', control);

            const setExpanded = (expanded) => {
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                hiddenItems.forEach(item => item.classList.toggle('accordion-item-hidden', !expanded));
                const label = toggle.querySelector('.accordion-toggle-text');
                if (label) {
                    label.textContent = expanded ? 'Show less' : 'Show all';
                }
            };

            toggle.addEventListener('click', () => {
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                setExpanded(!expanded);
            });
        });
    };

    initAccordions();
});
