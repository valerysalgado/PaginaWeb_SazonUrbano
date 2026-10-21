# 🔥 Sazón Urbano - Plantilla Web Comercial para Restaurantes y Negocios Locales

> **Demostración Comercial de Alto Rendimiento** desarrollada con HTML5 semántico, CSS3 modular (Custom Properties) y JavaScript Vanilla puro (cero dependencias). Diseñada específicamente para el mercado gastronómico y comercial colombiano (restaurantes de comidas rápidas, hamburgueserías, salchipaperías, cafeterías, barberías y pequeños negocios).

---

## 🌟 Características Destacadas

- 🎨 **Identidad Visual Moderna:** Paleta premium de Negro Carbón (`#121216`), Crema suave (`#fbf7ee`), Blanco y Naranja Cálido (`#ff5a1f`), con tipografías Google Fonts (*Outfit* para títulos y *Plus Jakarta Sans* para lectura).
- 💬 **Generador de Pedidos a WhatsApp:** Cada plato y combo tiene un botón directo para pedir por WhatsApp con un mensaje estructurado y precargado que incluye el nombre del producto y precio en COP.
- ⚙️ **Configuración Centralizada en 1 Solo Archivo (`js/config.js`):** Cambia el nombre del restaurante, logo, número de WhatsApp, ubicación, horarios, precios, platos, promociones y preguntas frecuentes en minutos sin tocar una sola línea de HTML o CSS.
- 📱 **100% Responsive y Mobile-First:** Experiencia ultra fluida en smartphones (Android/iOS), tablets y computadores de escritorio, con menú móvil deslizable accesible.
- 🚀 **Cero Dependencias y Despliegue Inmediato:** No requiere `npm install`, Node.js ni bases de datos. Puedes abrirlo con doble clic o arrastrar la carpeta a **Netlify Drop** para tenerlo online gratis en 10 segundos.
- ⚡ **Optimización y SEO:** Metadatos Open Graph para compartir en WhatsApp y redes sociales, carga diferida (`loading="lazy"`), accesibilidad WCAG y animaciones suaves con `IntersectionObserver`.

---

## 📁 Estructura del Proyecto

```text
DemoRestaurante/
├── index.html              # Estructura semántica, accesibilidad y SEO
├── netlify.toml            # Configuración de cabeceras de seguridad y caché para Netlify
├── README.md               # Documentación y manual de adaptación
├── css/
│   ├── variables.css       # Tokens de diseño: colores, fuentes, sombras y radios
│   ├── styles.css          # Reset, tipografía, utilidades y animaciones scroll
│   ├── components.css      # Header, Hero, Cards de menú, Promos, FAQ, Footer y Modales
│   └── responsive.css      # Reglas para móviles, tablets y pantallas compactas
├── js/
│   ├── config.js           # BASE DE DATOS Y CONFIGURACIÓN CENTRALIZADA (Edita aquí)
│   └── app.js              # Lógica de renderizado dinámico, filtros y WhatsApp
└── images/                 # Carpeta para recursos visuales locales
```

---

## 🚀 Cómo Ejecutar la Página Localmente en Windows

Tienes tres formas sencillas de probarla:

### Método 1: Apertura Directa en el Navegador (El más rápido)
1. Abre el explorador de archivos de Windows en la carpeta:
   `c:\Users\RAUL\Documents\Proyectos.X\DemoRestaurante`
2. Haz doble clic sobre el archivo `index.html`.
3. Se abrirá automáticamente en Google Chrome, Microsoft Edge, Brave o tu navegador favorito.

### Método 2: Servidor Ligero con Python
Abre una terminal PowerShell en la carpeta del proyecto y ejecuta:
```powershell
cd c:\Users\RAUL\Documents\Proyectos.X\DemoRestaurante
python -m http.server 8080
```
Luego abre tu navegador e ingresa a: **`http://localhost:8080`**

### Método 3: Servidor Ligero con Node.js / NPX
Si prefieres usar Node.js:
```powershell
cd c:\Users\RAUL\Documents\Proyectos.X\DemoRestaurante
npx serve .
```

---

## 📱 Cómo Probar la Adaptación en Pantallas Móviles

1. **Desde tu computador (Modo Inspección de Chrome/Edge):**
   - Presiona `F12` (o clic derecho > **Inspeccionar**).
   - Presiona `Ctrl + Shift + M` para activar la vista de dispositivos móviles.
   - Selecciona dispositivos como *iPhone 14 Pro*, *Samsung Galaxy S20* o prueba en modo responsivo arrastrando el ancho de la ventana.
2. **Desde tu propio celular en la misma red Wi-Fi:**
   - Inicia el servidor con `python -m http.server 8080`.
   - Consulta tu IP local ejecutando `ipconfig` (ejemplo: `192.168.1.15`).
   - Desde el navegador de tu celular, ingresa a: `http://192.168.1.15:8080`.

---

## 🌐 Cómo Publicar la Página Gratis en Netlify (Paso a Paso)

Netlify ofrece alojamiento estático gratuito con HTTPS automático, CDN global y dominio personalizado.

### Opción A: Despliegue Rápido "Netlify Drop" (Sin Git, en 30 segundos)
1. Ve a [https://app.netlify.com/drop](https://app.netlify.com/drop) e inicia sesión o crea una cuenta gratuita.
2. Arrastra la carpeta completa `DemoRestaurante` y suéltala en el recuadro que dice **"Drag and drop your site folder here"**.
3. En menos de 10 segundos Netlify te generará una URL pública y gratuita (ejemplo: `sazon-urbano.netlify.app`).
4. Ve a **Site configuration > Change site name** para asignarle un nombre personalizado (ejemplo: `sazonurbano-cartagena.netlify.app`).

### Opción B: Conectar con un Repositorio de GitHub
1. Sube este proyecto a un repositorio privado o público en GitHub.
2. En Netlify, haz clic en **"Add new site" > "Import an existing project"** y selecciona GitHub.
3. Elige el repositorio. En configuración deja el comando de build vacío y el directorio de publicación como `.` (raíz).
4. Cada vez que hagas un `git push`, Netlify actualizará la web en vivo automáticamente.

---

## 🛠️ Cómo Adaptar Esta Plantilla para tu Primer Cliente (en 5 Minutos)

Para cambiar la web y vendérsela a otro restaurante, barbería, peluquería o negocio:

1. **Abre el archivo [js/config.js](file:///c:/Users/RAUL/Documents/Proyectos.X/DemoRestaurante/js/config.js):**
   - **Nombre y Eslogan:** Cambia `business.name` y `business.slogan`.
   - **Número de WhatsApp:** Coloca el número real del cliente en `business.whatsappNumber` (ejemplo: `"573101234567"` con código de país 57) y cambia `business.isDemoNumber: false`.
   - **Ubicación y Cobertura:** Modifica `business.address`, `business.city` y `business.coverageZones`.
   - **Horarios:** Ajusta la lista en `schedule`.
   - **Productos y Precios:** Edita los platos en `products` asignando sus nombres, descripciones, categorías y precios en pesos colombianos (`price: 25000`).
   - **Promociones:** Edita `promotions` con los combos de tu cliente.
   - **Preguntas Frecuentes:** Edita las preguntas y respuestas en `faqs`.

2. **Personalizar los Colores (Opcional):**
   - Abre [css/variables.css](file:///c:/Users/RAUL/Documents/Proyectos.X/DemoRestaurante/css/variables.css).
   - Si es una **barbería**, puedes cambiar `--color-orange-primary` por un azul rey o dorado (`#d4af37`).
   - Si es una **cafetería**, puedes usar tonos terracota o café (`#a0522d`).

---

## 💼 Argumentos Comerciales de Venta (Pitch para Clientes)

Cuando presentes esta demostración a dueños de restaurantes y negocios en Colombia, resalta estos puntos clave:

1. **Ahorro en Comisiones de Apps:** *"Plataformas como Rappi o Didi Food cobran entre el 20% y 30% de comisión por cada pedido. Con esta web, los clientes te piden directo a tu WhatsApp y el 100% de la ganancia es tuya."*
2. **Velocidad y Cero Fricción:** *"Tus clientes no tienen que descargar aplicaciones pesadas ni crear contraseñas. Entran desde su celular, eligen el plato y en 1 clic ya tienes la orden en tu chat."*
3. **Control Total de tu Marca:** *"Tienes una presencia digital profesional que transmite higiene, seriedad y alta cocina, ideal para pautar en Instagram y TikTok Ads."*

---

## ⚠️ Limitaciones de esta Versión

- **Sin pasarela de pagos integrada:** Los pedidos se procesan y acuerdan por WhatsApp (transferencia por Nequi, Daviplata o contraentrega). No requiere pagar suscripciones mensuales a pasarelas de pago complejas.
- **Sin panel de administración web (CMS):** Los cambios de menú se realizan directamente en `js/config.js`. Esto garantiza máxima velocidad de carga (menos de 1 segundo), cero costos de base de datos y nula vulnerabilidad a ataques informáticos.
