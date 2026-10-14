// ============================================================================
// INICIO: muestra los últimos productos agregados al catálogo.
// "Últimos" = los de id más alto en js/producto.js.
// ============================================================================
(function () {
  const CANTIDAD = 3;
  const contenedor = document.getElementById("recientes");
  if (!contenedor || typeof productos === "undefined") return;

  function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  const recientes = [...productos].sort((a, b) => b.id - a.id).slice(0, CANTIDAD);

  contenedor.innerHTML = recientes
    .map(
      (p) => `
      <article class="bg-white border border-border-cool rounded-[22px] overflow-hidden shadow-[0_10px_30px_rgba(30,27,75,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(30,27,75,0.08)] flex flex-col group">
        <a href="./producto.html?id=${p.id}" class="block aspect-[4/5] overflow-hidden bg-gradient-to-br from-mesh-blue to-inverse-on-surface">
          <img alt="${escaparHTML(p.nombre)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${escaparHTML(p.imagen)}" />
        </a>
        <div class="p-5 flex flex-col flex-grow">
          <div class="flex flex-wrap gap-2 mb-2.5">
            <span class="inline-block px-2.5 py-1 rounded-full bg-mesh-blue text-primary text-[0.75rem] font-black">Recién agregado</span>
            <span class="inline-block px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-[0.75rem] font-semibold">${escaparHTML(p.departamento)}</span>
          </div>
          <h3 class="text-[1.22rem] font-bold mb-1.5">
            <a href="./producto.html?id=${p.id}" class="hover:text-primary">${escaparHTML(p.nombre)}</a>
          </h3>
          <p class="text-on-surface-variant text-[0.91rem] mb-4 line-clamp-2">${escaparHTML(p.descripcion)}</p>
          <div class="mt-auto flex justify-between items-center gap-2.5">
            <a href="./producto.html?id=${p.id}" class="font-bold text-secondary hover:text-primary">Ver detalles</a>
            <button type="button" data-consultar="${p.id}" class="bg-inverse-on-surface text-secondary px-3.5 py-2 rounded-[10px] font-black hover:bg-secondary-fixed">
              Consultar
            </button>
          </div>
        </div>
      </article>`
    )
    .join("");

  contenedor.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-consultar]");
    if (!boton) return;
    const p = productos.find((x) => x.id === Number(boton.dataset.consultar));
    if (p) consultar(`${p.nombre} (${p.color}, código ${p.id})`);
  });
})();
