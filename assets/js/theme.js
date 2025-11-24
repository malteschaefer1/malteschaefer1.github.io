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
});
