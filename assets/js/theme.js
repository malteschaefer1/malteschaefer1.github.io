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
});
