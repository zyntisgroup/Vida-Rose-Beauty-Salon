/**
 * Vida Rosé Beauty Lounge — Main Application Controller (Revised)
 * Swiper Infinite Carousel, Service Selector Pills & VIP WhatsApp Concierge
 */

(function () {
  'use strict';

  // 1. Two-State Sticky Header Observer
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const scrollThreshold = 75;

    const updateHeader = () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // 2. Mobile Off-Canvas Drawer
  function initMobileDrawer() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const closeBtn = document.querySelector('.drawer-close');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!drawer || !toggleBtn) return;

    const openDrawer = () => {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    navLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  // 3. Infinite Looping Swiper Carousel
  let servicesSwiper = null;

  function initServicesCarousel() {
    const swiperEl = document.querySelector('.services-swiper');
    if (!swiperEl || typeof Swiper === 'undefined') return;

    if (servicesSwiper) {
      try {
        servicesSwiper.destroy(true, true);
      } catch (e) {}
      servicesSwiper = null;
    }

    servicesSwiper = new Swiper('.services-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 20,
      loop: true,
      loopPreventsSliding: false,
      speed: 550,
      navigation: {
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom'
      },
      breakpoints: {
        640: {
          slidesPerView: 1.8,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 28
        },
        1280: {
          slidesPerView: 3.2,
          spaceBetween: 32
        }
      }
    });
  }

  window.addEventListener('vidaRoseLanguageChanged', () => {
    setTimeout(() => {
      initServicesCarousel();
    }, 60);
  });

  // 4. VIP Concierge Modal & Service Selector Pills
  function initConciergeModal() {
    const modal = document.querySelector('#concierge-modal');
    const openBtns = document.querySelectorAll('.js-open-concierge');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.querySelector('#concierge-form');
    const servicePills = document.querySelectorAll('.service-pill-label');

    if (!modal) return;

    const openModal = (e, preselectedService) => {
      if (e) e.preventDefault();
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';

      if (preselectedService) {
        servicePills.forEach(pill => {
          const input = pill.querySelector('input');
          if (input && input.value.toLowerCase().includes(preselectedService.toLowerCase())) {
            input.checked = true;
            pill.classList.add('is-selected');
          } else {
            pill.classList.remove('is-selected');
          }
        });
      }
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const service = btn.getAttribute('data-service') || '';
        openModal(e, service);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Interactive Service Selection Pills
    const updateSelectedPill = () => {
      servicePills.forEach(pill => {
        const radio = pill.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
          pill.classList.add('is-selected');
        } else {
          pill.classList.remove('is-selected');
        }
      });
    };

    servicePills.forEach(pill => {
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) {
        radio.addEventListener('change', updateSelectedPill);
      }
      pill.addEventListener('click', () => {
        if (radio) {
          radio.checked = true;
          updateSelectedPill();
        }
      });
    });

    // Form Submission -> WhatsApp Direct Line
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="client_name"]');
        const name = nameInput ? nameInput.value.trim() : '';
        const selectedRadio = form.querySelector('input[name="service_choice"]:checked');
        const service = selectedRadio ? selectedRadio.value : 'General Consultation';
        const currentLang = document.documentElement.lang || 'en';

        let message = '';
        if (currentLang === 'ar') {
          message = `مرحباً صالون ڤيدا روز (EastHub Madinaty)، أود حجز موعد:\nالاسم: ${name || 'عميلة'}\nالخدمة: ${service}`;
        } else {
          message = `Hello Vida Rosé (EastHub Madinaty), I would like to book an appointment:\nName: ${name || 'Guest'}\nService: ${service}`;
        }

        const encoded = encodeURIComponent(message);
        const waUrl = `https://wa.me/201041212004?text=${encoded}`;

        window.open(waUrl, '_blank');
        closeModal();
      });
    }
  }

  // 5. Copy Plus Code Helper
  function initPlusCodeCopy() {
    const copyBtn = document.querySelector('.js-copy-code');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      const code = copyBtn.getAttribute('data-code') || '3MFC+HP Second New Cairo';
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = document.documentElement.lang === 'ar' ? 'تم النسخ!' : 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
    });
  }

  // 6. Interactive Experience Showcase & Spotlight Sync
  function initExperienceInteractions() {
    const section = document.querySelector('.experience-section');
    if (!section) return;

    const featureItems = section.querySelectorAll('.exp-feature-item');
    const spotlightTag = section.querySelector('#exp-dynamic-spotlight');
    const spotlightIcon = section.querySelector('#spotlight-icon');
    const spotlightText = section.querySelector('#spotlight-text');
    const mediaContainer = section.querySelector('#experience-media-container');
    const mediaCard = section.querySelector('#experience-media');
    const mediaGlare = section.querySelector('.experience-media-glare');

    // Feature highlights data
    const featureData = {
      '1': {
        icon: '✨',
        i18nKey: 'experience.tag_highlight1',
        fallbackEn: 'Dedicated 1-on-1 Consultation',
        fallbackAr: 'جلسة استشارة خاصة ومخصصة'
      },
      '2': {
        icon: '🛡️',
        i18nKey: 'experience.tag_highlight2',
        fallbackEn: 'Hospital-Grade Autoclave Sterilization',
        fallbackAr: 'تعقيم طبي حراري فائق 100%'
      },
      '3': {
        icon: '🌙',
        i18nKey: 'experience.tag_highlight3',
        fallbackEn: 'Open Daily Until 11:00 PM',
        fallbackAr: 'نستقبلكم يومياً حتى 11:00 مساءً'
      }
    };

    function setActiveFeature(featureId) {
      featureItems.forEach(item => {
        const isCurrent = item.getAttribute('data-feature') === featureId;
        item.classList.toggle('is-active', isCurrent);
        item.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });

      if (spotlightTag && featureData[featureId]) {
        const data = featureData[featureId];
        const spotlightContent = spotlightTag.querySelector('.spotlight-content');

        if (spotlightContent) {
          spotlightContent.classList.add('is-animating');
          setTimeout(() => {
            if (spotlightIcon) spotlightIcon.textContent = data.icon;
            if (spotlightText) {
              spotlightText.setAttribute('data-i18n', data.i18nKey);
              const lang = document.documentElement.lang || 'en';
              if (window.i18n) {
                spotlightText.textContent = window.i18n.get(data.i18nKey);
              } else {
                spotlightText.textContent = lang === 'ar' ? data.fallbackAr : data.fallbackEn;
              }
            }
            spotlightContent.classList.remove('is-animating');
          }, 160);
        }
      }
    }

    featureItems.forEach(item => {
      const featureId = item.getAttribute('data-feature');

      // Click activation
      item.addEventListener('click', () => {
        setActiveFeature(featureId);
      });

      // Hover activation for seamless polish
      item.addEventListener('mouseenter', () => {
        setActiveFeature(featureId);
      });

      // Keyboard accessibility
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveFeature(featureId);
        }
      });
    });

    // 3D Card Tilt on Media Container (Desktop Pointer Only)
    if (mediaContainer && mediaCard && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let rafId = null;

      const handleMouseMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = mediaContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5.5; // Max 5.5 deg
        const rotateY = ((x - centerX) / centerX) * 5.5;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          mediaCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          if (mediaGlare) {
            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;
            mediaGlare.style.background = `radial-gradient(circle at ${pctX.toFixed(1)}% ${pctY.toFixed(1)}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`;
          }
        });
      };

      const handleMouseLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        mediaCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (mediaGlare) {
          mediaGlare.style.background = '';
        }
      };

      mediaContainer.addEventListener('mousemove', handleMouseMove, { passive: true });
      mediaContainer.addEventListener('mouseleave', handleMouseLeave);
    }
  }

  // Master Init
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileDrawer();
    initServicesCarousel();
    initConciergeModal();
    initPlusCodeCopy();
    initExperienceInteractions();
  });
})();

