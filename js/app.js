/**
 * ==============================================================================
 * SAZÓN URBANO - LÓGICA PRINCIPAL DE LA APLICACIÓN (JS)
 * ==============================================================================
 * Maneja el renderizado dinámico desde config.js, filtros de categorías,
 * botones interactivos de WhatsApp, menú responsive, acordeón FAQ y modales.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Asegurar que la configuración esté cargada
  const config = window.APP_CONFIG;
  if (!config) {
    console.error("No se encontró el objeto APP_CONFIG. Verifica que js/config.js esté cargado.");
    return;
  }

  // --- 1. FORMATEADOR DE MONEDA COLOMBIANA (COP) ---
  const formatCOP = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(amount) + " COP";
  };

  // --- 2. GESTIÓN CENTRALIZADA DE ENLACES DE WHATSAPP ---
  const handleWhatsAppAction = (textMessage) => {
    const phone = config.business.whatsappNumber || "573001234567";
    const encodedText = encodeURIComponent(textMessage);
    const waUrl = `https://wa.me/${phone}?text=${encodedText}`;

    // Si está en modo demostración, mostramos el modal informativo primero
    if (config.business.isDemoNumber) {
      showDemoModal(waUrl, textMessage);
    } else {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  // --- 3. MODAL DE DEMOSTRACIÓN COMERCIAL ---
  const modalOverlay = document.getElementById("demoModal");
  const modalTargetUrlBtn = document.getElementById("modalProceedBtn");
  const modalCloseBtns = document.querySelectorAll("[data-close-modal]");

  const showDemoModal = (targetUrl, textSample) => {
    if (!modalOverlay) return;
    
    // Configurar enlace del botón de prueba
    if (modalTargetUrlBtn) {
      modalTargetUrlBtn.onclick = () => {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        closeDemoModal();
      };
    }

    // Actualizar vista previa del mensaje en el modal
    const previewEl = document.getElementById("modalMessagePreview");
    if (previewEl) {
      previewEl.textContent = textSample;
    }

    modalOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
  };

  const closeDemoModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
  };

  modalCloseBtns.forEach(btn => btn.addEventListener("click", closeDemoModal));
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeDemoModal();
    });
  }

  // Escuchar tecla Escape para cerrar modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("is-active")) {
      closeDemoModal();
    }
  });

  // --- 4. RENDERIZADO DEL MENÚ Y FILTRADO POR CATEGORÍAS ---
  const filtersContainer = document.getElementById("menuFilters");
  const productsContainer = document.getElementById("productsGrid");

  // Renderizar pestañas de categorías
  if (filtersContainer && config.categories) {
    filtersContainer.innerHTML = config.categories.map((cat, index) => `
      <button 
        type="button" 
        class="filter-btn ${index === 0 ? 'is-active' : ''}" 
        data-category="${cat.id}"
        aria-label="Filtrar por ${cat.name}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join("");

    // Eventos de clic en filtros
    const filterButtons = filtersContainer.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const categoryId = btn.getAttribute("data-category");
        renderProducts(categoryId);
      });
    });
  }

  // Renderizar productos
  const renderProducts = (categoryFilter = "all") => {
    if (!productsContainer || !config.products) return;

    const filtered = categoryFilter === "all" 
      ? config.products 
      : config.products.filter(p => p.category === categoryFilter);

    if (filtered.length === 0) {
      productsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-cream-muted);">
          <p style="font-size: 1.25rem;">No hay platos disponibles en esta categoría por el momento.</p>
        </div>
      `;
      return;
    }

    productsContainer.innerHTML = filtered.map(product => {
      const formattedPrice = formatCOP(product.price);
      return `
        <article class="product-card animate-on-scroll is-visible" data-product-id="${product.id}">
          <div class="product-media">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="product-img" 
              loading="lazy"
              width="400" 
              height="250">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
          </div>
          <div class="product-body">
            <div class="product-header">
              <h3 class="product-title">${product.name}</h3>
              <span class="product-price">${formattedPrice}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <button 
                type="button" 
                class="btn btn-whatsapp btn-full btn-order-product" 
                data-name="${product.name}" 
                data-price="${formattedPrice}">
                <span>💬</span>
                <span>Pedir por WhatsApp</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Adjuntar evento de pedido a cada botón de producto
    productsContainer.querySelectorAll(".btn-order-product").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const price = btn.getAttribute("data-price");
        const message = config.whatsappMessages.orderProduct(name, price);
        handleWhatsAppAction(message);
      });
    });
  };

  // Render inicial del catálogo
  renderProducts("all");

  // --- 5. RENDERIZADO DE PROMOCIONES ---
  const promosContainer = document.getElementById("promosGrid");
  if (promosContainer && config.promotions) {
    promosContainer.innerHTML = config.promotions.map(promo => {
      const formattedPromo = formatCOP(promo.promoPrice);
      const formattedOld = formatCOP(promo.originalPrice);
      return `
        <article class="promo-card animate-on-scroll">
          <div class="promo-media">
            <img 
              src="${promo.image}" 
              alt="${promo.title}" 
              class="promo-img" 
              loading="lazy"
              width="400" 
              height="200">
            <span class="promo-tag">${promo.tag}</span>
          </div>
          <div class="promo-body">
            <span class="promo-badge-text">${promo.badge}</span>
            <h3 class="promo-title">${promo.title}</h3>
            <p class="promo-desc">${promo.description}</p>
            <div class="promo-pricing">
              <span class="promo-price-current">${formattedPromo}</span>
              <span class="promo-price-old">${formattedOld}</span>
            </div>
            <button 
              type="button" 
              class="btn btn-primary btn-full btn-order-promo" 
              data-title="${promo.title}" 
              data-price="${formattedPromo}">
              <span>🔥</span>
              <span>${promo.ctaText}</span>
            </button>
          </div>
        </article>
      `;
    }).join("");

    promosContainer.querySelectorAll(".btn-order-promo").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        const price = btn.getAttribute("data-price");
        const message = config.whatsappMessages.promoOrder(title, price);
        handleWhatsAppAction(message);
      });
    });
  }

  // --- 6. RENDERIZADO DE VENTAJAS COMPETITIVAS ---
  const advantagesContainer = document.getElementById("advantagesGrid");
  if (advantagesContainer && config.advantages) {
    advantagesContainer.innerHTML = config.advantages.map(adv => `
      <div class="advantage-card animate-on-scroll">
        <div class="advantage-icon">${adv.icon}</div>
        <h3 class="advantage-title">${adv.title}</h3>
        <p class="advantage-desc">${adv.description}</p>
      </div>
    `).join("");
  }

  // --- 7. RENDERIZADO DE HORARIOS Y UBICACIÓN ---
  const scheduleListContainer = document.getElementById("scheduleList");
  if (scheduleListContainer && config.schedule) {
    scheduleListContainer.innerHTML = config.schedule.map(item => `
      <div class="schedule-row">
        <span class="schedule-days">${item.days}</span>
        <span class="schedule-hours">${item.hours}</span>
      </div>
    `).join("");
  }

  const paymentPillsContainer = document.getElementById("paymentPills");
  if (paymentPillsContainer && config.business.paymentMethods) {
    paymentPillsContainer.innerHTML = config.business.paymentMethods.map(p => `
      <span class="payment-pill">${p.icon} ${p.name}</span>
    `).join("");
  }

  // Actualizar textos dinámicos de ubicación y contacto
  const addressEl = document.getElementById("businessAddress");
  if (addressEl) addressEl.textContent = config.business.address + ", " + config.business.city;

  const phoneEl = document.getElementById("businessPhone");
  if (phoneEl) phoneEl.textContent = config.business.phoneDisplay;

  const coverageEl = document.getElementById("coverageZones");
  if (coverageEl) coverageEl.textContent = config.business.coverageZones;

  const deliveryTimeEl = document.getElementById("deliveryTimeInfo");
  if (deliveryTimeEl) deliveryTimeEl.textContent = config.business.deliveryTime;

  // --- 8. RENDERIZADO DEL ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
  const faqContainer = document.getElementById("faqAccordion");
  if (faqContainer && config.faqs) {
    faqContainer.innerHTML = config.faqs.map((faq, index) => `
      <div class="faq-item animate-on-scroll ${index === 0 ? 'is-open' : ''}">
        <button 
          type="button" 
          class="faq-question" 
          aria-expanded="${index === 0 ? 'true' : 'false'}"
          aria-controls="faq-ans-${index}">
          <span>${faq.question}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div 
          id="faq-ans-${index}" 
          class="faq-answer" 
          style="${index === 0 ? 'max-height: 200px;' : 'max-height: 0;'}">
          <p>${faq.answer}</p>
        </div>
      </div>
    `).join("");

    // Interactividad del acordeón
    const faqItems = faqContainer.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
      const questionBtn = item.querySelector(".faq-question");
      const answerEl = item.querySelector(".faq-answer");

      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // Cerrar otros elementos
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("is-open");
            const otherBtn = otherItem.querySelector(".faq-question");
            const otherAns = otherItem.querySelector(".faq-answer");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherAns) otherAns.style.maxHeight = "0";
          }
        });

        // Alternar el actual
        if (isOpen) {
          item.classList.remove("is-open");
          questionBtn.setAttribute("aria-expanded", "false");
          answerEl.style.maxHeight = "0";
        } else {
          item.classList.add("is-open");
          questionBtn.setAttribute("aria-expanded", "true");
          answerEl.style.maxHeight = answerEl.scrollHeight + 30 + "px";
        }
      });
    });
  }

  // --- 9. BOTONES GENERALES DE WHATSAPP ---
  // Botones de llamada a la acción en el Hero, Header y Botón Flotante
  const generalContactButtons = document.querySelectorAll("[data-action='contact-whatsapp']");
  generalContactButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      handleWhatsAppAction(config.whatsappMessages.generalContact);
    });
  });

  // Enlace para saber cómo adaptar la plantilla en el banner superior
  const bannerLearnMore = document.getElementById("bannerLearnMore");
  if (bannerLearnMore) {
    bannerLearnMore.addEventListener("click", (e) => {
      e.preventDefault();
      showDemoModal(
        `https://wa.me/${config.business.whatsappNumber || '573001234567'}?text=${encodeURIComponent(config.whatsappMessages.generalContact)}`,
        config.whatsappMessages.generalContact
      );
    });
  }

  // --- 10. MENÚ MÓVIL (HAMBURGER TOGGLE) ---
  const mobileToggleBtn = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggleBtn && navMenu) {
    const toggleMobileMenu = () => {
      const isOpen = navMenu.classList.toggle("is-open");
      mobileToggleBtn.classList.toggle("is-active", isOpen);
      mobileToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    mobileToggleBtn.addEventListener("click", toggleMobileMenu);

    // Cerrar al hacer clic en un enlace de navegación
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("is-open")) {
          toggleMobileMenu();
        }
      });
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("is-open") && 
          !navMenu.contains(e.target) && 
          !mobileToggleBtn.contains(e.target)) {
        toggleMobileMenu();
      }
    });
  }

  // --- 11. EFECTO SCROLL DEL HEADER ---
  const siteHeader = document.querySelector(".site-header");
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // --- 12. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
  const animElements = document.querySelectorAll(".animate-on-scroll");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    animElements.forEach(el => observer.observe(el));
  } else {
    // Fallback para navegadores antiguos
    animElements.forEach(el => el.classList.add("is-visible"));
  }

  // --- 13. RESALTAR ENLACE DE NAVEGACIÓN ACTIVO ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("is-active");
          } else {
            link.classList.remove("is-active");
          }
        });
      }
    });
  };
  window.addEventListener("scroll", highlightNavOnScroll, { passive: true });
});
