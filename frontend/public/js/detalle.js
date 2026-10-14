// ============================================================================
// PÁGINA DE PRODUCTO: producto.html?id=12
// Muestra un producto, permite consultarlo o compartir su enlace y sugiere
// productos relacionados (mismo departamento o categoría).
// ============================================================================
(function () {
  const detalle = document.getElementById("detalle");
  const id = Number(new URLSearchParams(location.search).get("id"));
  const producto = productos.find((p) => p.id === id);

  function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  if (!producto) {
    document.title = "Producto no encontrado | RaícesGT";
    document.getElementById("ruta-actual").textContent = "No encontrado";
    detalle.className = "";
    detalle.innerHTML = `
      <div class="text-center py-20 px-6 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
        <h1 class="text-2xl font-bold mb-2">No encontramos este producto</h1>
        <p class="text-on-surface-variant mb-6">Puede que ya no esté disponible o que el enlace esté incompleto.</p>
        <a href="./productos.html" class="inline-block px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-container">Ver la colección</a>
      </div>`;
    return;
  }

  // Título y descripción de la pestaña / buscadores
  document.title = `${producto.nombre} | RaícesGT`;
  document.querySelector('meta[name="description"]').setAttribute("content", producto.descripcion);
  document.getElementById("ruta-actual").textContent = producto.nombre;

  detalle.innerHTML = `
    <div class="rounded-2xl overflow-hidden bg-surface-container-low border border-border-cool shadow-[0_18px_45px_rgba(30,27,75,0.08)]">
      <img src="${escaparHTML(producto.imagen)}" alt="${escaparHTML(producto.nombre)}" class="w-full aspect-[4/5] object-cover" />
    </div>
    <div class="md:sticky md:top-28">
      <div class="flex flex-wrap gap-2 mb-4">
        <a href="./productos.html?categoria=${encodeURIComponent(producto.categoria)}" class="text-xs font-semibold uppercase tracking-wide text-tertiary bg-tertiary-fixed/40 px-2.5 py-1 rounded-full hover:bg-tertiary-fixed">${escaparHTML(producto.categoria)}</a>
        <a href="./productos.html?departamento=${encodeURIComponent(producto.departamento)}" class="text-xs font-semibold text-primary bg-mesh-blue px-2.5 py-1 rounded-full hover:bg-primary-fixed">${escaparHTML(producto.departamento)}</a>
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">${escaparHTML(producto.nombre)}</h1>
      <p class="text-lg text-on-surface-variant mb-8">${escaparHTML(producto.descripcion)}</p>

      <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-6 border-y border-border-cool mb-8">
        <dt class="font-semibold">Origen</dt>
        <dd class="text-on-surface-variant">${escaparHTML(producto.municipio)}, ${escaparHTML(producto.departamento)}</dd>
        <dt class="font-semibold">Color</dt>
        <dd class="text-on-surface-variant">${escaparHTML(producto.color)}</dd>
        <dt class="font-semibold">Código</dt>
        <dd class="text-on-surface-variant">#${producto.id}</dd>
        <dt class="font-semibold">Precio</dt>
        <dd class="text-on-surface-variant">Consulta precio y disponibilidad</dd>
      </dl>

      <div class="flex flex-col sm:flex-row gap-3">
        <button type="button" id="btn-consultar" class="flex-grow inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-whatsapp text-white font-bold shadow-md hover:brightness-105 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/></svg>
          Consultar por WhatsApp
        </button>
        <button type="button" id="btn-compartir" class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border-cool bg-white font-bold text-on-surface hover:border-primary hover:text-primary transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
          <span id="texto-compartir">Compartir</span>
        </button>
      </div>
    </div>`;

  document.getElementById("btn-consultar").addEventListener("click", () => {
    consultar(`${producto.nombre} (${producto.color}, código ${producto.id}) ${location.href}`);
  });

  document.getElementById("btn-compartir").addEventListener("click", async () => {
    const datos = { title: producto.nombre, text: `${producto.nombre} - RaícesGT`, url: location.href };
    if (navigator.share) {
      try {
        await navigator.share(datos);
      } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(location.href);
      const texto = document.getElementById("texto-compartir");
      texto.textContent = "¡Enlace copiado!";
      setTimeout(() => (texto.textContent = "Compartir"), 2000);
    } catch (e) {
      prompt("Copia este enlace:", location.href);
    }
  });

  // Relacionados: primero mismo departamento, luego misma categoría
  const puntaje = (p) => (p.departamento === producto.departamento ? 2 : 0) + (p.categoria === producto.categoria ? 1 : 0);
  const relacionados = productos
    .filter((p) => p.id !== producto.id && puntaje(p) > 0)
    .sort((a, b) => puntaje(b) - puntaje(a) || b.id - a.id)
    .slice(0, 3);

  if (relacionados.length) {
    document.getElementById("relacionados-seccion").classList.remove("hidden");
    document.getElementById("relacionados").innerHTML = relacionados
      .map(
        (p) => `
        <a href="./producto.html?id=${p.id}" class="group bg-white rounded-xl border border-border-cool overflow-hidden shadow-[0_8px_30px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300 block">
          <div class="aspect-[4/5] overflow-hidden bg-surface-container-low">
            <img src="${escaparHTML(p.imagen)}" alt="${escaparHTML(p.nombre)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold uppercase tracking-wide text-tertiary">${escaparHTML(p.categoria)}</span>
            <h3 class="font-bold text-lg mt-1 group-hover:text-primary">${escaparHTML(p.nombre)}</h3>
            <p class="text-sm text-on-surface-variant">${escaparHTML(p.municipio)}, ${escaparHTML(p.departamento)}</p>
          </div>
        </a>`
      )
      .join("");
  }
})();
