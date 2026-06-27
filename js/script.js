// Neelkanth Steel India — main script

function playWelcomeSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const notes = [220, 277, 330];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const start = now + 0.95 + index * 0.12;
    osc.start(start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.07, start + 0.05);
    gain.gain.linearRampToValueAtTime(0.0001, start + 0.18);
    osc.stop(start + 0.2);
  });
}

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
    const seen = sessionStorage.getItem('nsiIntroSeen');
    if (seen) {
      preloader.remove();
    } else {
      document.body.classList.add('pl-lock');
      playWelcomeSound();
      setTimeout(hidePreloader, 3000);
      sessionStorage.setItem('nsiIntroSeen', '1');
    }
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
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


