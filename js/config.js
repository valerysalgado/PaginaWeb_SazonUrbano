/**
 * ==============================================================================
 * SAZÓN URBANO - ARCHIVO DE CONFIGURACIÓN Y DATOS CENTRALIZADOS
 * ==============================================================================
 * Este archivo es el centro de control del sitio web. 
 * Para personalizar esta página para cualquier negocio (restaurante, barbería,
 * salón de belleza, cafetería o emprendimiento), solo debes cambiar los valores
 * en este archivo sin necesidad de tocar el código HTML ni CSS.
 */

const APP_CONFIG = {
  // ----------------------------------------------------------------------------
  // 1. INFORMACIÓN DE LA EMPRESA / NEGOCIO
  // ----------------------------------------------------------------------------
  business: {
    name: "Sazón Urbano",
    slogan: "Comidas Rápidas con Sabor Caribe & Alma Callejera",
    badge: "🔥 Las mejores comidas rápidas de Cartagena",
    shortDescription: "Hamburguesas artesanales monumentales, salchipapas cargadas con auténtico queso costeño y recetas urbanas preparadas con ingredientes 100% frescos.",
    fullDescription: "Nacimos en el corazón de Cartagena de Indias con una misión clara: reinventar las comidas rápidas con ingredientes de calidad prémium, salsas de autor y la sazón auténtica del Caribe. Cada hamburguesa se prepara al momento con pan brioche artesanal, y nuestras salchipapas llevan el inconfundible toque cartagenero.",
    
    // Ciudad y Dirección (Ficticias para demostración)
    city: "Cartagena de Indias, Colombia",
    address: "Calle del Arsenal #10-45, Barrio Getsemaní",
    mapsUrl: "https://maps.google.com/?q=Getsemani,Cartagena,Colombia",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15702.632296720235!2d-75.55118744111328!3d10.420137949364942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62f7547b59365%3A0x6b63390c9b456ff8!2sGetseman%C3%AD%2C%20Cartagena%20de%20Indias%2C%20Provincia%20de%20Cartagena%2C%20Bol%C3%ADvar!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco",
    
    // Teléfonos y WhatsApp
    phoneDisplay: "+57 (300) 123-4567",
    
    // NOTA IMPORTANTE WHATSAPP:
    // Ingresa el número con código de país (ej. Colombia: 57 seguido de 10 dígitos: 573001234567)
    // Deja 'isDemoNumber: true' si es una muestra comercial para activar el aviso amigable de demostración.
    whatsappNumber: "573242526284",
    isDemoNumber: false, // Cambia a false cuando pongas el número real de tu cliente
    
    email: "contacto@sazonurbano-demo.co",
    currency: "COP",
    currencySymbol: "$",
    
    // Zonas de cobertura y tiempos de entrega
    deliveryTime: "30 a 45 minutos",
    deliveryCost: "Desde $4.000 COP (Gratis por compras superiores a $60.000)",
    coverageZones: "Getsemaní, Manga, Centro Histórico, Bocagrande, Castillogrande, Marbella, Cabrero y Crespo.",
    
    // Medios de pago aceptados
    paymentMethods: [
      { name: "Nequi", icon: "📱" },
      { name: "Daviplata", icon: "💳" },
      { name: "Bancolombia (Transferencia)", icon: "🏦" },
      { name: "Efectivo contra entrega", icon: "💵" },
      { name: "Datáfono (Todas las tarjetas)", icon: "💳" }
    ],

    // Redes sociales (Enlaces de ejemplo)
    socials: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      tiktok: "https://tiktok.com"
    }
  },

  // ----------------------------------------------------------------------------
  // 2. HORARIOS DE ATENCIÓN
  // ----------------------------------------------------------------------------
  schedule: [
    { days: "Lunes a Jueves", hours: "5:00 PM - 11:30 PM", status: "Abierto tarde" },
    { days: "Viernes y Sábados", hours: "5:00 PM - 1:30 AM", status: "Horario extendido" },
    { days: "Domingos y Festivos", hours: "4:30 PM - 11:00 PM", status: "Tarde familiar" }
  ],

  // ----------------------------------------------------------------------------
  // 3. VENTAJAS COMPETITIVAS (¿Por qué elegirnos?)
  // ----------------------------------------------------------------------------
  advantages: [
    {
      id: 1,
      icon: "🥩",
      title: "Carne 100% Artesanal",
      description: "Cortes de res seleccionados y molidos a diario sin conservantes ni carnes procesadas. Puro sabor casero."
    },
    {
      id: 2,
      icon: "🧀",
      title: "Auténtico Queso Costeño",
      description: "Tradición del Caribe: queso costeño fresco traído directamente del campo, fundido o rallado al momento."
    },
    {
      id: 3,
      icon: "🛵",
      title: "Empaque Térmico Prémium",
      description: "Tu pedido llega caliente, crujiente y en perfecto estado gracias a nuestros empaques ecológicos con ventilación controlada."
    },
    {
      id: 4,
      icon: "⚡",
      title: "Pide en 30 Segundos por WhatsApp",
      description: "Sin apps pesadas ni registros complicados. Elige tu plato, haz clic y tu pedido llega directo a nuestra cocina."
    }
  ],

  // ----------------------------------------------------------------------------
  // 4. PROMOCIONES DESTACADAS
  // ----------------------------------------------------------------------------
  promotions: [
    {
      id: "promo-1",
      badge: "⭐ COMBO MÁS VENDIDO",
      title: "Combo Dúo Costeño",
      description: "2 Hamburguesas Monumentales + 1 Salchipapa Personal + 2 Bebidas bien frías.",
      originalPrice: 78000,
      promoPrice: 62000,
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
      ctaText: "Pedir Combo Dúo",
      tag: "Ahorra $16.000 COP"
    },
    {
      id: "promo-2",
      badge: "🔥 MARTES & JUEVES URBANOS",
      title: "2x1 en Burger Costeña",
      description: "Pide una Burger Costeña con plátano maduro y suero, y llévate la segunda totalmente gratis.",
      originalPrice: 60000,
      promoPrice: 32000,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      ctaText: "Aprovechar 2x1",
      tag: "Válido 5 PM a 8 PM"
    },
    {
      id: "promo-3",
      badge: "🎉 COMBO PARCHE FAMILIAR",
      title: "Mega Salchipapa Familiar",
      description: "Papas crujientes doradas, salchicha prémium, butifarra, chorizo, tocineta, doble queso costeño y salsas especiales.",
      originalPrice: 85000,
      promoPrice: 72000,
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
      ctaText: "Pedir Combo Parche",
      tag: "Comen 4 a 5 personas"
    }
  ],

  // ----------------------------------------------------------------------------
  // 5. CATEGORÍAS DEL MENÚ
  // ----------------------------------------------------------------------------
  categories: [
    { id: "all", name: "Todos los Platos", icon: "🍽️" },
    { id: "hamburguesas", name: "Hamburguesas", icon: "🍔" },
    { id: "salchipapas", name: "Salchipapas", icon: "🍟" },
    { id: "especiales", name: "Especiales Urbanos", icon: "🌭" },
    { id: "bebidas", name: "Bebidas & Postres", icon: "🥤" }
  ],

  // ----------------------------------------------------------------------------
  // 6. CATÁLOGO DE PRODUCTOS (Al menos 6 productos con fotos y COP)
  // ----------------------------------------------------------------------------
  products: [
    {
      id: 1,
      category: "hamburguesas",
      name: "La Monumental Urbana",
      badge: "La Favorita",
      price: 32000,
      description: "Doble carne de res madurada de 150g c/u, lonjas de queso costeño frito crocante, tocineta caramelizada, cebollas crisp y salsa tártara de la casa en pan brioche dorado a la mantequilla.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      isPopular: true
    },
    {
      id: 2,
      category: "salchipapas",
      name: "Salchipapa La Heroica",
      badge: "Especialidad",
      price: 29000,
      description: "Generosa cama de papas a la francesa crocantes, salchicha seleccionada, butifarra cartagenera sofrita, lluvia de queso costeño campesino, ripio de papa y doble salsa tártara-rosada.",
      image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=800&q=80",
      isPopular: true
    },
    {
      id: 3,
      category: "hamburguesas",
      name: "Burger Costeña Suero & Plátano",
      badge: "Sabor Caribe",
      price: 30000,
      description: "180g de pura carne de res, tajadas de plátano maduro meloso glaseadas en panela, queso doble crema fundido, tocineta crocante y dip generoso de suero costeño tradicional.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
      isPopular: false
    },
    {
      id: 4,
      category: "especiales",
      name: "Perro Callejero Salvaje",
      badge: "Clásico Callejero",
      price: 22000,
      description: "Salchicha ranchera gigante de 22cm en pan extra suave, tocineta picada en cubos, ripio crocante, queso costeño rallado, salsa de piña artesanal melada y queso mozzarella gratinado al soplete.",
      image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80",
      isPopular: false
    },
    {
      id: 5,
      category: "salchipapas",
      name: "Salchipapa Callejera Suprema",
      badge: "Para Compartir",
      price: 38000,
      description: "Papas francesas y papas criollas doradas, pollo desmechado marinado en finas hierbas, tocineta ahumada, butifarra, salchicha manguera, queso costeño gratinado y maíz tierno.",
      image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
      isPopular: true
    },
    {
      id: 6,
      category: "especiales",
      name: "Mazorcada Mixta Caribeña",
      badge: "Cremosa & Gratinada",
      price: 26000,
      description: "Maíz tierno desgranado salteado en mantequilla de ajo, pechuga de pollo desmechada, lomo de res marinado, tocineta picada, salsa especial de la casa y costra dorada de queso costeño.",
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
      isPopular: false
    },
    {
      id: 7,
      category: "especiales",
      name: "Alitas BBQ Guayaba & Ron",
      badge: "8 Piezas Crocantes",
      price: 27000,
      description: "8 piezas de alitas bañadas en nuestra salsa secreta de reducción de dulce de guayaba agridulce, un toque de ron caribeño y especias locales. Acompañadas de papas a la francesa.",
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
      isPopular: false
    },
    {
      id: 8,
      category: "bebidas",
      name: "Limonada de Coco Tradicional",
      badge: "Bebida Típica",
      price: 11000,
      description: "Auténtica limonada caribeña preparada en el instante con leche de coco natural, zumo fresco de limón criollo y abundante hielo frappé. El acompañamiento refrescante perfecto.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      isPopular: true
    }
  ],

  // ----------------------------------------------------------------------------
  // 7. PREGUNTAS FRECUENTES (FAQ)
  // ----------------------------------------------------------------------------
  faqs: [
    {
      question: "¿Cómo hago mi pedido para domicilio?",
      answer: "¡Es súper fácil! Solo explora nuestro menú, elige el plato que más se te antoje y haz clic en el botón 'Pedir por WhatsApp'. Se abrirá una conversación en tu WhatsApp con el mensaje ya listo indicando tu plato y precio. Solo nos indicas tu dirección y método de pago favorito."
    },
    {
      question: "¿Cuáles son las zonas de cobertura en Cartagena?",
      answer: "Llegamos a los principales sectores de Cartagena: Getsemaní, Manga, Centro Histórico, San Diego, Bocagrande, Castillogrande, El Laguito, Marbella, Cabrero y Crespo. Si te encuentras en otro barrio, consúltanos por WhatsApp y coordinamos tu entrega con gusto."
    },
    {
      question: "¿Qué métodos de pago reciben?",
      answer: "Recibimos transferencias directas por Nequi, Daviplata y Bancolombia. También puedes pagar en efectivo al momento de la entrega o solicitar datáfono inalámbrico para pagar con tarjeta de crédito o débito en tu puerta."
    },
    {
      question: "¿Cuánto tiempo demora en llegar mi comida?",
      answer: "Nuestro tiempo promedio de entrega es de 30 a 45 minutos. En días de alta demanda (como viernes y sábados en la noche) te informaremos el tiempo exacto estimado antes de poner tu orden en parrilla."
    },
    {
      question: "¿Puedo personalizar los ingredientes de mi hamburguesa o salchipapa?",
      answer: "¡Por supuesto! Cuando se abra el chat de WhatsApp puedes indicarnos si deseas retirar algún vegetal, añadir extra tocineta, extra queso costeño o pedir tus salsas por separado. ¡Tú mandas en tu plato!"
    },
    {
      question: "¿Este sitio web es una demostración comercial?",
      answer: "Sí. Esta página es una maqueta profesional creada para mostrar cómo puede lucir la presencia digital de un restaurante o negocio de comidas en Colombia. Puedes adquirir una web idéntica adaptada con el logo, colores, productos y número de WhatsApp de tu propio negocio."
    }
  ],

  // ----------------------------------------------------------------------------
  // 8. TEXTO DEL MENSAJE DE WHATSAPP
  // ----------------------------------------------------------------------------
  whatsappMessages: {
    generalContact: "¡Hola Sazón Urbano! Vi su página web y quiero hacer una consulta sobre el menú y domicilios en Cartagena.",
    orderProduct: (productName, priceFormatted) => 
      `¡Hola Sazón Urbano! 🍔 Quiero pedir el siguiente plato de su página web:\n\n👉 *${productName}* (${priceFormatted})\n\n¿Me confirman tiempo estimado de entrega y costo del domicilio? ¡Muchas gracias!`,
    promoOrder: (promoTitle, promoPriceFormatted) =>
      `¡Hola Sazón Urbano! 🔥 Quiero aprovechar la promoción:\n\n👉 *${promoTitle}* (${promoPriceFormatted})\n\n¿Tienen disponibilidad para envío inmediato? ¡Quedo atento!`
  }
};

// Exportar globalmente para su consumo por app.js
if (typeof window !== "undefined") {
  window.APP_CONFIG = APP_CONFIG;
}
