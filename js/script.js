// Emporium Steels — main script

function hidePreloader() {
  const pl = document.getElementById('preloader');
  if (!pl) return;
  pl.classList.add('pl-hide');
  document.body.classList.remove('pl-lock');
  setTimeout(() => { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 700);
}

document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const seen = sessionStorage.getItem('esIntroSeen');
    if (seen) {
      preloader.remove();
    } else {
      document.body.classList.add('pl-lock');
      sessionStorage.setItem('esIntroSeen', '1');
      const minDelay = new Promise(res => setTimeout(res, 600));
      const pageLoad = new Promise(res => {
        if (document.readyState === 'complete') res();
        else window.addEventListener('load', res, { once: true });
      });
      Promise.all([minDelay, pageLoad]).then(hidePreloader);
      // safety fallback so it never hangs on slow connections
      setTimeout(hidePreloader, 2500);
    }
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  function openNav() {
    links.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('nav-lock');
  }
  function closeNav() {
    links.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('nav-lock');
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.contains('open') ? closeNav() : openNav();
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    if (overlay) overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  }

  // Navbar shadow on scroll
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 6px 20px rgba(0,0,0,0.25)' : 'none';
  });

  // Staggered reveal delays — cards inside the same grid animate in one after another
  document.querySelectorAll('.grid, .pd-grid, .footer-grid, .gallery-grid, .hero-stats, .stats-grid').forEach(group => {
    const items = group.querySelectorAll(':scope > .reveal');
    items.forEach((el, i) => { el.style.setProperty('--stagger-delay', Math.min(i * 90, 540) + 'ms'); });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  reveals.forEach(el => obs.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let count = 0;
        const step = Math.max(target / 60, 1);
        const update = () => {
          count += step;
          if (count >= target) { el.textContent = target + (el.getAttribute('data-suffix') || ''); }
          else { el.textContent = Math.floor(count) + (el.getAttribute('data-suffix') || ''); requestAnimationFrame(update); }
        };
        update();
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObs.observe(c));

  // Inquiry / contact form submit (demo)
  document.querySelectorAll('form[data-inquiry]').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      setTimeout(() => {
        btn.textContent = 'Enquiry Sent ✓';
        form.reset();
        setTimeout(() => { btn.textContent = original; }, 2500);
      }, 900);
    });
  });

});


