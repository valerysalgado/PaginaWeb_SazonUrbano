/**
 * ==============================================================================
 * SAZÓN URBANO - LÓGICA PRINCIPAL DE LA APLICACIÓN (JS)
 * ==============================================================================
 * Maneja el renderizado dinámico desde config.js, filtros de categorías,
 * sistema de carrito de compras, barra flotante, drawer lateral de pedido,
 * validación de datos de entrega y generación de pedidos a WhatsApp.
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

  // --- 2. SISTEMA DE CARRITO DE COMPRAS (ESTADO Y PERSISTENCIA) ---
  const CART_STORAGE_KEY = "sazon_urbano_cart_items";
  let cart = [];

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (err) {
    console.warn("No se pudo cargar el carrito previo:", err);
    cart = [];
  }

  const saveCart = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn("No se pudo guardar el carrito:", err);
    }
    updateCartUI();
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Toast flotante de notificación
  const cartToast = document.getElementById("cartToast");
  const cartToastMessage = document.getElementById("cartToastMessage");
  let toastTimer = null;

  const showCartToast = (message) => {
    if (!cartToast) return;
    if (cartToastMessage) cartToastMessage.textContent = message;
    cartToast.classList.add("is-show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cartToast.classList.remove("is-show");
    }, 2400);
  };

  // Agregar producto al carrito
  const addToCart = (product) => {
    const existingIndex = cart.findIndex(item => String(item.id) === String(product.id));
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: String(product.id),
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1
      });
    }
    saveCart();
    showCartToast(`¡${product.name} agregado al pedido! 🛒`);
  };

  // Actualizar cantidad
  const updateQuantity = (id, delta) => {
    const index = cart.findIndex(item => String(item.id) === String(id));
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart();
    }
  };

  // Eliminar producto
  const removeFromCart = (id) => {
    cart = cart.filter(item => String(item.id) !== String(id));
    saveCart();
  };

  // Vaciar carrito
  const clearCart = () => {
    cart = [];
    saveCart();
    showCartToast("Se vació el pedido 🗑️");
  };

  // --- 3. ACTUALIZACIÓN VISUAL DEL CARRITO ---
  const headerCartCountEl = document.getElementById("headerCartCount");
  const cartBarBadgeEl = document.getElementById("cartBarBadge");
  const cartBarTotalEl = document.getElementById("cartBarTotal");
  const cartBarCountLabelEl = document.getElementById("cartBarCountLabel");
  const cartFloatingBarEl = document.getElementById("cartFloatingBar");
  const cartItemsListEl = document.getElementById("cartItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartGrandTotalEl = document.getElementById("cartGrandTotal");
  const cartDrawerCountEl = document.getElementById("cartDrawerCount");

  const updateCartUI = () => {
    const totalCount = getCartCount();
    const totalPrice = getCartTotal();
    const formattedTotal = formatCOP(totalPrice);

    // 1. Contador en Cabecera
    if (headerCartCountEl) {
      headerCartCountEl.textContent = totalCount;
      headerCartCountEl.classList.add("is-bumping");
      setTimeout(() => headerCartCountEl.classList.remove("is-bumping"), 300);
    }

    // 2. Barra Flotante Inferior
    if (cartBarBadgeEl) cartBarBadgeEl.textContent = totalCount;
    if (cartBarTotalEl) cartBarTotalEl.textContent = formattedTotal;
    if (cartBarCountLabelEl) {
      cartBarCountLabelEl.textContent = `Tu Pedido (${totalCount} ${totalCount === 1 ? 'plato' : 'platos'})`;
    }

    // Botón flotante directo de carrito
    const floatingCartBadgeEl = document.getElementById("floatingCartBadge");
    if (floatingCartBadgeEl) {
      floatingCartBadgeEl.textContent = totalCount;
    }

    if (cartFloatingBarEl) {
      if (totalCount > 0) {
        cartFloatingBarEl.classList.add("is-visible");
        document.body.classList.add("has-cart-bar");
      } else {
        cartFloatingBarEl.classList.remove("is-visible");
        document.body.classList.remove("has-cart-bar");
      }
    }

    // 3. Subtotales en Drawer
    if (cartSubtotalEl) cartSubtotalEl.textContent = formattedTotal;
    if (cartGrandTotalEl) cartGrandTotalEl.textContent = formattedTotal;
    if (cartDrawerCountEl) {
      cartDrawerCountEl.textContent = `${totalCount} ${totalCount === 1 ? 'plato seleccionado' : 'platos seleccionados'}`;
    }

    // 4. Lista de Productos en el Drawer
    if (cartItemsListEl) {
      if (cart.length === 0) {
        cartItemsListEl.innerHTML = `
          <div class="cart-empty-state">
            <div class="cart-empty-icon">🍽️</div>
            <h4 class="cart-empty-title">Tu pedido está vacío</h4>
            <p class="cart-empty-desc">Explora el menú y agrega tus hamburguesas y salchipapas favoritas.</p>
            <a href="#menu" class="btn btn-outline btn-sm" id="emptyCartExploreBtn">Explorar Menú</a>
          </div>
        `;
        const exploreBtn = document.getElementById("emptyCartExploreBtn");
        if (exploreBtn) {
          exploreBtn.addEventListener("click", () => closeCartDrawer());
        }
      } else {
        cartItemsListEl.innerHTML = cart.map(item => {
          const itemSubtotal = formatCOP(item.price * item.quantity);
          return `
            <div class="cart-item" data-id="${item.id}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
              <div class="cart-item-info">
                <h5 class="cart-item-title">${item.name}</h5>
                <span class="cart-item-unit-price">${formatCOP(item.price)} • Total: ${itemSubtotal}</span>
              </div>
              <div class="cart-item-actions">
                <button type="button" class="cart-qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Disminuir cantidad">−</button>
                <span class="cart-qty-number">${item.quantity}</span>
                <button type="button" class="cart-qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
              </div>
              <button type="button" class="cart-item-delete-btn btn-delete-item" data-id="${item.id}" title="Eliminar plato" aria-label="Eliminar ${item.name}">🗑️</button>
            </div>
          `;
        }).join("");

        // Eventos en botones de cantidad
        cartItemsListEl.querySelectorAll(".btn-qty-minus").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            updateQuantity(id, -1);
          });
        });

        cartItemsListEl.querySelectorAll(".btn-qty-plus").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            updateQuantity(id, 1);
          });
        });

        cartItemsListEl.querySelectorAll(".btn-delete-item").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            removeFromCart(id);
          });
        });
      }
    }
  };

  // --- 4. CONTROL DEL DRAWER / PANEL LATERAL DEL CARRITO ---
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const openCartDrawerBtn = document.getElementById("openCartDrawerBtn");
  const headerCartBtn = document.getElementById("headerCartBtn");
  const floatingCartBtn = document.getElementById("floatingCartBtn");
  const closeCartDrawerBtn = document.getElementById("closeCartDrawerBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");

  const openCartDrawer = () => {
    if (!cartDrawerOverlay) return;
    cartDrawerOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeCartDrawer = () => {
    if (!cartDrawerOverlay) return;
    cartDrawerOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  // Toda la barra flotante abre el carrito al hacer clic en cualquier parte de ella
  if (cartFloatingBarEl) {
    cartFloatingBarEl.addEventListener("click", () => {
      openCartDrawer();
    });
  }

  // El botón específico "Ver Pedido" también abre el carrito
  if (openCartDrawerBtn) {
    openCartDrawerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openCartDrawer();
    });
  }

  if (headerCartBtn) headerCartBtn.addEventListener("click", openCartDrawer);
  if (floatingCartBtn) floatingCartBtn.addEventListener("click", openCartDrawer);
  if (closeCartDrawerBtn) closeCartDrawerBtn.addEventListener("click", closeCartDrawer);

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener("click", (e) => {
      if (e.target === cartDrawerOverlay) closeCartDrawer();
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      if (confirm("¿Estás seguro de que deseas vaciar todos los platos de tu pedido?")) {
        clearCart();
      }
    });
  }

  // Tecla Escape cierra el carrito
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawerOverlay && cartDrawerOverlay.classList.contains("is-open")) {
      closeCartDrawer();
    }
  });

  // --- 5. GESTIÓN CENTRALIZADA DE ENLACES DE WHATSAPP ---
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

  // Modal de demostración comercial
  const modalOverlay = document.getElementById("demoModal");
  const modalTargetUrlBtn = document.getElementById("modalProceedBtn");
  const modalCloseBtns = document.querySelectorAll("[data-close-modal]");

  const showDemoModal = (targetUrl, textSample) => {
    if (!modalOverlay) return;
    
    if (modalTargetUrlBtn) {
      modalTargetUrlBtn.onclick = () => {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        closeDemoModal();
      };
    }

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

  // --- 6. PROCESAMIENTO Y ENVÍO DEL PEDIDO POR WHATSAPP ---
  const submitOrderWhatsAppBtn = document.getElementById("submitOrderWhatsAppBtn");
  const orderCustomerNameInput = document.getElementById("orderCustomerName");
  const orderCustomerAddressInput = document.getElementById("orderCustomerAddress");
  const orderPaymentMethodSelect = document.getElementById("orderPaymentMethod");
  const orderNotesTextarea = document.getElementById("orderNotes");

  if (submitOrderWhatsAppBtn) {
    submitOrderWhatsAppBtn.addEventListener("click", () => {
      // 1. Validar que el carrito no esté vacío
      if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega al menos un plato o combo antes de enviar.");
        return;
      }

      // 2. Validar campos obligatorios
      const customerName = (orderCustomerNameInput ? orderCustomerNameInput.value : "").trim();
      const customerAddress = (orderCustomerAddressInput ? orderCustomerAddressInput.value : "").trim();
      const paymentMethod = orderPaymentMethodSelect ? orderPaymentMethodSelect.value : "Nequi";
      const notes = (orderNotesTextarea ? orderNotesTextarea.value : "").trim();

      if (!customerName) {
        if (orderCustomerNameInput) {
          orderCustomerNameInput.focus();
          orderCustomerNameInput.style.borderColor = "#ef4444";
          setTimeout(() => { orderCustomerNameInput.style.borderColor = ""; }, 2500);
        }
        alert("Por favor ingresa tu nombre para que sepamos a quién entregar el pedido.");
        return;
      }

      if (!customerAddress) {
        if (orderCustomerAddressInput) {
          orderCustomerAddressInput.focus();
          orderCustomerAddressInput.style.borderColor = "#ef4444";
          setTimeout(() => { orderCustomerAddressInput.style.borderColor = ""; }, 2500);
        }
        alert("Por favor ingresa tu dirección y barrio en Cartagena para coordinar el domicilio.");
        return;
      }

      // 3. Formatear la lista limpia de productos
      const itemsFormatted = cart.map(item => {
        const itemTotal = formatCOP(item.price * item.quantity);
        return `• ${item.quantity}x ${item.name} (${itemTotal})`;
      }).join("\n");

      const grandTotal = formatCOP(getCartTotal());

      // 4. Construir el mensaje completo de WhatsApp
      let whatsappOrderMessage = `¡Hola ${config.business.name}! 🍔 Quiero realizar el siguiente pedido:\n\n`;
      whatsappOrderMessage += `📋 *DETALLE DEL PEDIDO:*\n${itemsFormatted}\n\n`;
      whatsappOrderMessage += `💰 *TOTAL A PAGAR:* ${grandTotal}\n\n`;
      whatsappOrderMessage += `🛵 *DATOS DE ENTREGA (Cartagena):*\n`;
      whatsappOrderMessage += `• *Cliente:* ${customerName}\n`;
      whatsappOrderMessage += `• *Dirección / Barrio:* ${customerAddress}\n`;
      whatsappOrderMessage += `• *Método de Pago:* ${paymentMethod}\n`;
      if (notes) {
        whatsappOrderMessage += `• *Notas / Aclaraciones:* ${notes}\n`;
      }
      whatsappOrderMessage += `\n¿Me confirman tiempo estimado de entrega y costo del domicilio? ¡Muchas gracias!`;

      // 5. Cerrar el carrito y abrir WhatsApp
      closeCartDrawer();
      handleWhatsAppAction(whatsappOrderMessage);
    });
  }

  // --- 7. RENDERIZADO DEL MENÚ Y FILTRADO POR CATEGORÍAS ---
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

  // Renderizar productos con botón «Agregar al pedido» con precio visible
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
                class="btn btn-primary btn-full btn-add-cart" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}"
                data-image="${product.image}">
                <span>➕</span>
                <span>Agregar al Pedido</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Adjuntar evento de "Agregar al pedido" a cada botón
    productsContainer.querySelectorAll(".btn-add-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = Number(btn.getAttribute("data-price"));
        const image = btn.getAttribute("data-image");

        addToCart({ id, name, price, image });
      });
    });
  };

  // Render inicial del catálogo
  renderProducts("all");

  // --- 8. RENDERIZADO DE PROMOCIONES CON BOTÓN «AGREGAR AL PEDIDO» ---
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
              class="btn btn-primary btn-full btn-add-promo" 
              data-id="promo-${promo.id}" 
              data-name="${promo.title}" 
              data-price="${promo.promoPrice}"
              data-image="${promo.image}">
              <span>➕</span>
              <span>Agregar Combo • ${formattedPromo}</span>
            </button>
          </div>
        </article>
      `;
    }).join("");

    promosContainer.querySelectorAll(".btn-add-promo").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = Number(btn.getAttribute("data-price"));
        const image = btn.getAttribute("data-image");

        addToCart({ id, name, price, image });
      });
    });
  }

  // --- 9. RENDERIZADO DE VENTAJAS COMPETITIVAS ---
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

  // --- 10. RENDERIZADO DE HORARIOS Y UBICACIÓN ---
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

  // --- 11. RENDERIZADO DEL ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
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

        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("is-open");
            const otherBtn = otherItem.querySelector(".faq-question");
            const otherAns = otherItem.querySelector(".faq-answer");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherAns) otherAns.style.maxHeight = "0";
          }
        });

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

  // --- 12. BOTONES GENERALES DE WHATSAPP ---
  const generalContactButtons = document.querySelectorAll("[data-action='contact-whatsapp']");
  generalContactButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      handleWhatsAppAction(config.whatsappMessages.generalContact);
    });
  });

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

  // --- 13. MENÚ MÓVIL (HAMBURGER TOGGLE) ---
  const mobileToggleBtn = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggleBtn && navMenu) {
    const toggleMobileMenu = () => {
      const isOpen = navMenu.classList.toggle("is-open");
      mobileToggleBtn.classList.toggle("is-active", isOpen);
      mobileToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    mobileToggleBtn.addEventListener("click", toggleMobileMenu);

    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("is-open")) {
          toggleMobileMenu();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("is-open") && 
          !navMenu.contains(e.target) && 
          !mobileToggleBtn.contains(e.target)) {
        toggleMobileMenu();
      }
    });
  }

  // --- 14. EFECTO SCROLL DEL HEADER ---
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

  // --- 15. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
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
    animElements.forEach(el => el.classList.add("is-visible"));
  }

  // --- 16. RESALTAR ENLACE DE NAVEGACIÓN ACTIVO ---
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

  // Inicializar UI del carrito al cargar
  updateCartUI();
});
