/**
 * Vida Rosé Beauty Lounge — GSAP, ScrollTrigger & Lenis Animation Engine (Revision 2)
 * Welcome Curtain, Robust Heading Reveals, Louver Scroll Shutter & Safe RTL Flow
 */

(function () {
  'use strict';

  let lenisInstance = null;
  let louverTimeline = null;

  // 1. Enforce Clean Refresh at Top of Page
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // 2. Smooth Scroll Setup (Lenis)
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.8
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // 3. Welcome / Refresh Curtain Reveal
  function initWelcomeCurtain() {
    const curtain = document.querySelector('.welcome-curtain');
    if (!curtain) {
      animateHeroIn();
      return;
    }

    const fill = curtain.querySelector('.welcome-loader-fill');
    const inner = curtain.querySelector('.welcome-inner');

    const tl = gsap.timeline({
      onComplete: () => {
        curtain.style.display = 'none';
        animateHeroIn();
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    });

    tl.fromTo(inner, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(fill, { width: '100%', duration: 0.75, ease: 'power1.inOut' }, '-=0.2')
      .to(inner, { opacity: 0, y: -15, duration: 0.3, ease: 'power2.in' }, '+=0.1')
      .to(curtain, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' }, '-=0.1');
  }

  // 4. Hero Content Entrance (Safe Staggered Reveal, Never Mutates DOM)
  function animateHeroIn() {
    gsap.fromTo(
      '.hero-badge-pill',
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const targets = heroTitle.children.length > 0 ? heroTitle.querySelectorAll('span') : heroTitle;
      gsap.fromTo(
        targets,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.15, ease: 'power2.out', delay: 0.2 }
      );
    }

    gsap.fromTo(
      '.hero-subtitle, .hero-actions, .hero-rating-badge',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.45 }
    );
  }

  // 5. Signature Rosé Louver Shutter (Behind Hero Text, Scrubs on Scroll Only)
  function initRoseLouver() {
    const cover = document.querySelector('.rose-louver-cover');
    const hero = document.querySelector('.hero-section');
    if (!cover || !hero) return;

    if (louverTimeline) {
      if (louverTimeline.scrollTrigger) louverTimeline.scrollTrigger.kill();
      louverTimeline.kill();
      louverTimeline = null;
    }

    const screenWidth = window.innerWidth;
    let blindsCount = 38;
    if (screenWidth <= 767) blindsCount = 18;
    else if (screenWidth <= 1024) blindsCount = 28;

    const heroWidth = hero.clientWidth;
    const stripWidth = heroWidth / blindsCount;

    cover.innerHTML = '';
    const isRtl = document.documentElement.dir === 'rtl';

    gsap.set(cover, { opacity: 0 });

    for (let i = 0; i < blindsCount; i++) {
      const strip = document.createElement('div');
      strip.classList.add('louver-strip');
      strip.style.width = (stripWidth + 1.2) + 'px';

      if (isRtl) {
        strip.style.right = (i * stripWidth - 0.5) + 'px';
        strip.style.transformOrigin = 'right center';
        strip.style.transform = 'rotateY(90deg)';
      } else {
        strip.style.left = (i * stripWidth - 0.5) + 'px';
        strip.style.transformOrigin = 'left center';
        strip.style.transform = 'rotateY(-90deg)';
      }

      cover.appendChild(strip);
    }

    // Only create scroll timeline if hero exists
    louverTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      }
    });

    louverTimeline
      .fromTo(cover, { opacity: 0 }, { opacity: 0.75, duration: 0.25, ease: 'none' }, 0)
      .fromTo(
        cover.querySelectorAll('.louver-strip'),
        { rotationY: isRtl ? 90 : -90 },
        { rotationY: 0, stagger: 0.005, ease: 'power2.inOut' },
        0
      );
  }

  // 6. Cathedral Arch Morph (1200px -> 350px)
  function initArchMorph() {
    const archSection = document.querySelector('.arch-section');
    if (!archSection || window.innerWidth <= 767) return;

    gsap.to(archSection, {
      borderTopLeftRadius: '350px',
      borderTopRightRadius: '350px',
      scrollTrigger: {
        trigger: archSection,
        start: 'top 95%',
        end: '+=500',
        scrub: true
      }
    });
  }

  // 7. Early Triggered Clip-Path Image Reveals
  function initClipPathReveals() {
    const revealWraps = document.querySelectorAll('.clip-reveal-wrap');
    revealWraps.forEach((wrap) => {
      const img = wrap.querySelector('img');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top 92%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      tl.fromTo(
        wrap,
        { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.9, ease: 'power2.out' }
      );

      if (img) {
        tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 0.9, ease: 'power2.out' }, 0);
      }
    });
  }

  // 8. Elegant Scroll Reveals for Headings & Content (Pure GSAP, No DOM Mutation)
  function initTextReveals() {
    const headings = document.querySelectorAll('.js-split-heading, .arch-narrative-title, .section-title');
    headings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 92%',
            once: true
          }
        }
      );
    });

    const subheadings = document.querySelectorAll('.js-split-words, .section-subtitle, .arch-narrative-text');
    subheadings.forEach((sub) => {
      gsap.fromTo(
        sub,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sub,
            start: 'top 94%',
            once: true
          }
        }
      );
    });
  }

  // 9. Re-trigger on Language Change
  window.addEventListener('vidaRoseLanguageChanged', () => {
    initRoseLouver();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  // Master Init
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initSmoothScroll();
    initRoseLouver();
    initArchMorph();
    initClipPathReveals();
    initTextReveals();
    initWelcomeCurtain();

    window.addEventListener('resize', () => {
      initRoseLouver();
    });
  });
})();
