(() => {
  const ready = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };

  ready(() => {

    // Bootstrap components: tooltips & popovers
    try {
      if (window.bootstrap) {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));

        const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.forEach((el) => new bootstrap.Popover(el));
      }
    } catch (e) {
      // Non-fatal: keep the site usable even if Bootstrap JS is missing or blocked.
      console.warn('Bootstrap UI initialisation failed:', e);
    }
    // Back-to-top (fixed button)
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      const toggle = () => {
        if (window.scrollY > 400) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
      };
      toggle();
      window.addEventListener('scroll', toggle, { passive: true });
      backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Bootstrap interactions (guarded)
    if (!window.bootstrap) {
      // If Bootstrap JS failed to load, we keep the site usable and avoid breaking other scripts.
      console.warn('Bootstrap JS not detected; dropdowns/tooltips/popovers will not initialise.');
      return;
    }

    // Tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      // Ensure there is a title available for older attribute patterns.
      if (!el.getAttribute('data-bs-title') && el.getAttribute('title')) {
        el.setAttribute('data-bs-title', el.getAttribute('title'));
      }
      new bootstrap.Tooltip(el, { container: 'body' });
    });

    // Popovers (default to hover+focus unless specified)
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
      const trigger = el.getAttribute('data-bs-trigger') || 'hover focus';
      new bootstrap.Popover(el, { trigger, container: 'body' });
    });

    // Accessible mailto helper: build mailto from form fields.
    const form = document.querySelector('[data-enrate-mailto-form]');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (form.querySelector('[name="name"]')?.value || '').trim();
        const email = (form.querySelector('[name="email"]')?.value || '').trim();
        const phone = (form.querySelector('[name="phone"]')?.value || '').trim();
        const subject = (form.querySelector('[name="subject"]')?.value || 'Website enquiry').trim();
        const message = (form.querySelector('[name="message"]')?.value || '').trim();

        const lines = [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          '',
          message
        ].join('\n');

        const mailto = `mailto:enrate01@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
        window.location.href = mailto;
      });
    }
  });
})();
