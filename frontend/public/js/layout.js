// ============================================================================
// CABECERA Y PIE DE PÁGINA COMPARTIDOS
// Cada página tiene <header id="encabezado"></header> y <footer id="pie"></footer>
// y la etiqueta <body data-pagina="..."> para resaltar el enlace activo.
// Requiere que js/config.js se cargue antes.
// ============================================================================
(function () {
  const paginaActual = document.body.dataset.pagina || "";

  const ICONOS = {
    whatsapp: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>`,
    facebook: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8h3.3Z"/></svg>`,
    instagram: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
    tiktok: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 3c.3 2.3 1.6 3.8 3.9 4v3.1a7 7 0 0 1-3.9-1.2v6.4A5.7 5.7 0 1 1 10.9 9.6v3.2a2.6 2.6 0 1 0 2.5 2.6V3h3.2Z"/></svg>`,
    menu: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  };

  const ENLACES = [
    { id: "inicio", texto: "Inicio", href: "./index.html" },
    { id: "productos", texto: "Colección", href: "./productos.html" },
    { id: "historia", texto: "Nuestra historia", href: "./index.html#historia" },
    { id: "envios", texto: "Envíos", href: "./index.html#envios" },
    { id: "contacto", texto: "Contacto", href: "./contacto.html" },
  ];

  const LEGALES = [
    { texto: "Privacidad", href: "./privacidad.html" },
    { texto: "Términos de servicio", href: "./terminos.html" },
    { texto: "Sostenibilidad", href: "./sostenibilidad.html" },
    { texto: "Contacto", href: "./contacto.html" },
  ];

  function enlacesRedes(clase) {
    return Object.entries(SITIO.redes)
      .filter(([, url]) => url)
      .map(
        ([red, url]) =>
          `<a href="${url}" target="_blank" rel="noopener" aria-label="${red}" class="${clase}">${ICONOS[red] || ""}</a>`
      )
      .join("");
  }

  // ---------------- Cabecera ----------------
  const encabezado = document.getElementById("encabezado");
  if (encabezado) {
    encabezado.className = "sticky top-0 z-50 text-white shadow-lg";
    encabezado.innerHTML = `
      <div class="bg-gradient-to-r from-deep-indigo via-[#1a2f6b] to-primary">
        <div class="max-w-[1160px] w-[92%] mx-auto h-[68px] flex items-center justify-between gap-6">
          <a href="./index.html" class="font-black text-xl tracking-tight">
            Raíces<span class="text-inverse-primary">GT</span>
          </a>
          <nav class="hidden md:flex items-center gap-1 text-[0.94rem] font-semibold" aria-label="Principal">
            ${ENLACES.map(
              (e) => `<a href="${e.href}" class="px-3 py-2 rounded-full transition-colors ${
                e.id === paginaActual ? "bg-white/15 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
              }">${e.texto}</a>`
            ).join("")}
          </nav>
          <div class="flex items-center gap-2">
            <button type="button" onclick="abrirWhatsApp()" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-whatsapp text-white font-bold text-sm shadow-md hover:brightness-105 transition">
              ${ICONOS.whatsapp}<span>Escríbenos</span>
            </button>
            <button type="button" id="btn-menu" class="md:hidden p-2 rounded-lg hover:bg-white/10" aria-label="Abrir menú" aria-expanded="false">
              ${ICONOS.menu}
            </button>
          </div>
        </div>
        <nav id="menu-movil" class="hidden md:hidden border-t border-white/10" aria-label="Menú móvil">
          <div class="w-[92%] mx-auto py-3 flex flex-col">
            ${ENLACES.map(
              (e) => `<a href="${e.href}" class="px-3 py-2.5 rounded-lg font-semibold ${
                e.id === paginaActual ? "bg-white/15" : "text-white/85 hover:bg-white/10"
              }">${e.texto}</a>`
            ).join("")}
            <button type="button" onclick="abrirWhatsApp()" class="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-whatsapp font-bold">
              ${ICONOS.whatsapp}<span>Escríbenos por WhatsApp</span>
            </button>
          </div>
        </nav>
      </div>
      <div class="franja-textil"></div>`;

    const btnMenu = document.getElementById("btn-menu");
    const menuMovil = document.getElementById("menu-movil");
    btnMenu.addEventListener("click", () => {
      const abierto = menuMovil.classList.toggle("hidden") === false;
      btnMenu.setAttribute("aria-expanded", abierto);
    });
    menuMovil.addEventListener("click", (e) => {
      if (e.target.closest("a")) menuMovil.classList.add("hidden");
    });
  }

  // ---------------- Pie de página ----------------
  const pie = document.getElementById("pie");
  if (pie) {
    const redes = enlacesRedes(
      "w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
    );
    pie.className = "bg-deep-indigo text-white";
    pie.innerHTML = `
      <div class="franja-textil"></div>
      <div class="max-w-[1160px] w-[92%] mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div class="lg:col-span-2">
          <div class="font-black text-xl">Raíces<span class="text-inverse-primary">GT</span></div>
          <p class="text-surface-dim text-sm mt-3 max-w-sm">
            El arte del tejido guatemalteco con una presentación moderna.
          </p>
          ${redes ? `<div class="flex gap-2 mt-5">${redes}</div>` : ""}
        </div>
        <div>
          <h2 class="font-bold mb-3">Explora</h2>
          <ul class="space-y-2 text-sm text-surface-dim">
            ${ENLACES.map((e) => `<li><a href="${e.href}" class="hover:text-white">${e.texto}</a></li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 class="font-bold mb-3">Información</h2>
          <ul class="space-y-2 text-sm text-surface-dim">
            ${LEGALES.map((e) => `<li><a href="${e.href}" class="hover:text-white">${e.texto}</a></li>`).join("")}
            <li class="pt-2">
              <button type="button" onclick="abrirWhatsApp()" class="inline-flex items-center gap-2 text-white font-semibold hover:text-whatsapp">
                ${ICONOS.whatsapp}${SITIO.whatsappVisible}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <p class="max-w-[1160px] w-[92%] mx-auto py-5 text-xs text-surface-dim">
          © ${new Date().getFullYear()} ${SITIO.nombre} · Artesanías y Textiles Mayas, S.A. · Todos los derechos reservados
        </p>
      </div>`;
  }

  // ---------------- Botón flotante de WhatsApp ----------------
  if (!document.body.hasAttribute("data-sin-whatsapp")) {
    const flotante = document.createElement("button");
    flotante.type = "button";
    flotante.setAttribute("aria-label", "Escríbenos por WhatsApp");
    flotante.className =
      "fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-whatsapp text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform [&>svg]:w-7 [&>svg]:h-7";
    flotante.innerHTML = ICONOS.whatsapp;
    flotante.addEventListener("click", () => abrirWhatsApp());
    document.body.appendChild(flotante);
  }
})();
