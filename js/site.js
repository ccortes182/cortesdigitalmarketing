/* ==========================================================================
   Site motion — trimmed from the brand repo docs/js/animations.js and
   brand-cards.js @ 01c2934 (hero letters, scroll reveals, stagger, card glow)
   ========================================================================== */

function initCardGlow() {
  document.querySelectorAll('.service-card').forEach(card => {
    const setGlow = (x, y) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${x - rect.left}px`);
      card.style.setProperty('--mouse-y', `${y - rect.top}px`);
    };
    card.addEventListener('pointerenter', e => setGlow(e.clientX, e.clientY));
    card.addEventListener('pointermove', e => setGlow(e.clientX, e.clientY));
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

function revealAll() {
  document.querySelectorAll('[data-animate], [data-animate-stagger] > *, .hero__headline .char').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

function animateHeroHeadline() {
  const headline = document.getElementById('hero-headline');
  if (!headline) return;

  // Split plain text (not innerHTML) so entities like &amp; stay one character
  const text = headline.textContent.trim();
  headline.setAttribute('aria-label', text);
  headline.textContent = '';
  text.split(/\s+/).forEach((word, i) => {
    if (i) headline.append(' ');
    const w = document.createElement('span');
    w.className = 'word';
    w.setAttribute('aria-hidden', 'true');
    [...word].forEach(c => {
      const ch = document.createElement('span');
      ch.className = 'char';
      ch.textContent = c;
      w.append(ch);
    });
    headline.append(w);
  });

  gsap.to(headline.querySelectorAll('.char'), {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.8,
    stagger: 0.025,
    ease: 'power3.out',
    delay: 0.2
  });
  // Rest of the hero copy fades in on load (not on scroll) so the CTA is always shown
  const heroItems = document.querySelectorAll('.cdm-hero [data-animate]');
  if (heroItems.length) {
    gsap.fromTo(heroItems,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.7, ease: 'power2.out' }
    );
  }
}

function initScrollAnimations() {
  document.querySelectorAll('[data-animate]:not(.cdm-hero [data-animate])').forEach(el => {
    const type = el.getAttribute('data-animate');
    const fromVars = { opacity: 0 };
    if (type === 'fade-up') fromVars.y = 40;
    if (type === 'scale-in') fromVars.scale = 0.95;

    gsap.fromTo(el, fromVars, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });
}

function initStaggerAnimations() {
  document.querySelectorAll('[data-animate-stagger]').forEach(container => {
    gsap.fromTo(container.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: container, start: 'top 85%', once: true }
      }
    );
  });
}

// Resolve once the brand font is ready (or after a short cap) so the hero
// headline never renders in the wider fallback font and then re-wraps.
function brandFontReady(timeout = 1500) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  return Promise.race([
    document.fonts.load('600 1em "adelphi-pe-variable"'),
    new Promise(resolve => setTimeout(resolve, timeout))
  ]).catch(() => {});
}

function showHeadline() {
  const headline = document.getElementById('hero-headline');
  if (headline) headline.style.visibility = 'visible';
}

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    revealAll();
    showHeadline();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
    brandFontReady().then(showHeadline);
    return;
  }

  initScrollAnimations();
  initStaggerAnimations();
  brandFontReady().then(() => {
    animateHeroHeadline();
    showHeadline();
  });
}

function initSite() {
  initCardGlow();
  initAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
