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

  const parts = headline.innerHTML.split(/(<br\s*\/?>)/gi);
  headline.innerHTML = parts.map(part => {
    if (/<br\s*\/?>/i.test(part)) return part;
    return part.split(' ').map(word =>
      `<span class="word">${word.split('').map(c => `<span class="char">${c}</span>`).join('')}</span>`
    ).join(' ');
  }).join('');

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

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    revealAll();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
    return;
  }

  animateHeroHeadline();
  initScrollAnimations();
  initStaggerAnimations();
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
