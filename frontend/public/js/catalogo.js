// ============================================================================
// CATÁLOGO: búsqueda, filtros, orden, vista columnas/lista y modal de detalle.
// Requiere js/config.js y js/producto.js.
// Los filtros se guardan en la URL (?departamento=Sololá&categoria=Blusa...)
// para poder compartir un enlace con la búsqueda ya aplicada.
// ============================================================================
(function () {
  const CLAVE_VISTA = "raicesgt-vista-productos";

  const campoBusqueda = document.getElementById("busqueda");
  const filtroDepartamento = document.getElementById("filtro-departamento");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const filtroColor = document.getElementById("filtro-color");
  const filtroOrden = document.getElementById("filtro-orden");
  const contenedor = document.getElementById("resultados");
  const contador = document.getElementById("contador");
  const filtrosActivos = document.getElementById("filtros-activos");

  let vistaActual = "grid";
  try {
    vistaActual = localStorage.getItem(CLAVE_VISTA) || "grid";
  } catch (e) {}

  const ICONO_FLECHA = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  const ICONO_UBICACION = `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`;
  const ICONO_CERRAR = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`;

  // ---------------- Utilidades ----------------
  function escaparHTML(texto) {
    return String(texto ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Minúsculas y sin tildes, para que "solola" encuentre "Sololá"
  function normalizar(texto) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // "Blanco, rojo y negro" -> ["blanco", "rojo", "negro"]
  function coloresDe(producto) {
    return normalizar(producto.color)
      .split(/,|\sy\s/)
      .map((c) => c.trim())
      .filter(Boolean);
  }

  function valoresUnicos(lista) {
    const mapa = new Map();
    lista.forEach((v) => {
      const clave = normalizar(v);
      if (clave && !mapa.has(clave)) mapa.set(clave, v.trim());
    });
    return [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0], "es"));
  }

  // ---------------- Opciones de los filtros ----------------
  function llenarSelect(select, opciones, textoTodos) {
    select.innerHTML =
      `<option value="">${textoTodos}</option>` +
      opciones.map(([valor, texto]) => `<option value="${escaparHTML(valor)}">${escaparHTML(texto)}</option>`).join("");
  }

  llenarSelect(filtroDepartamento, valoresUnicos(productos.map((p) => p.departamento)), "Todos los departamentos");
  llenarSelect(filtroCategoria, valoresUnicos(productos.map((p) => p.categoria)), "Todas las categorías");
  llenarSelect(
    filtroColor,
    valoresUnicos(productos.flatMap(coloresDe)).map(([v, t]) => [v, capitalizar(t)]),
    "Todos los colores"
  );

  // ---------------- Estado <-> URL ----------------
  function leerURL() {
    const params = new URLSearchParams(location.search);
    campoBusqueda.value = params.get("q") || "";
    filtroDepartamento.value = normalizar(params.get("departamento"));
    filtroCategoria.value = normalizar(params.get("categoria"));
    filtroColor.value = normalizar(params.get("color"));
    filtroOrden.value = params.get("orden") || "relevancia";
    if (params.get("vista") === "lista" || params.get("vista") === "grid") vistaActual = params.get("vista");
  }

  function guardarURL() {
    const params = new URLSearchParams();
    if (campoBusqueda.value.trim()) params.set("q", campoBusqueda.value.trim());
    if (filtroDepartamento.value) params.set("departamento", filtroDepartamento.value);
    if (filtroCategoria.value) params.set("categoria", filtroCategoria.value);
    if (filtroColor.value) params.set("color", filtroColor.value);
    if (filtroOrden.value !== "relevancia") params.set("orden", filtroOrden.value);
    const query = params.toString();
    history.replaceState(null, "", query ? `?${query}` : location.pathname);
  }

  // ---------------- Filtrado ----------------
  function filtrar() {
    const texto = normalizar(campoBusqueda.value);
    const departamento = filtroDepartamento.value;
    const categoria = filtroCategoria.value;
    const color = filtroColor.value;

    let lista = productos.filter((p) => {
      if (departamento && normalizar(p.departamento) !== departamento) return false;
      if (categoria && normalizar(p.categoria) !== categoria) return false;
      if (color && !coloresDe(p).includes(color)) return false;
      if (!texto) return true;
      return [p.nombre, p.municipio, p.departamento, p.categoria, p.color, p.descripcion].some((campo) =>
        normalizar(campo).includes(texto)
      );
    });

    switch (filtroOrden.value) {
      case "nombre-asc":
        lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        break;
      case "nombre-desc":
        lista = [...lista].sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
        break;
      case "recientes":
        lista = [...lista].sort((a, b) => b.id - a.id);
        break;
    }
    return lista;
  }

  // ---------------- Chips de filtros activos ----------------
  function textoOpcion(select) {
    return select.options[select.selectedIndex]?.text || "";
  }

  function pintarFiltrosActivos() {
    const activos = [];
    if (campoBusqueda.value.trim()) activos.push(["busqueda", `“${campoBusqueda.value.trim()}”`]);
    if (filtroDepartamento.value) activos.push(["departamento", textoOpcion(filtroDepartamento)]);
    if (filtroCategoria.value) activos.push(["categoria", textoOpcion(filtroCategoria)]);
    if (filtroColor.value) activos.push(["color", textoOpcion(filtroColor)]);

    if (activos.length === 0) {
      filtrosActivos.innerHTML = "";
      filtrosActivos.classList.add("hidden");
      return;
    }

    filtrosActivos.classList.remove("hidden");
    filtrosActivos.innerHTML =
      activos
        .map(
          ([clave, texto]) => `
        <button type="button" data-quitar="${clave}" class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-mesh-blue text-primary text-sm font-medium hover:bg-primary-fixed transition-colors">
          ${escaparHTML(texto)} ${ICONO_CERRAR}
        </button>`
        )
        .join("") +
      `<button type="button" data-quitar="todo" class="text-sm font-semibold text-secondary hover:underline ml-1">Limpiar filtros</button>`;
  }

  filtrosActivos.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-quitar]");
    if (!boton) return;
    const clave = boton.dataset.quitar;
    if (clave === "busqueda" || clave === "todo") campoBusqueda.value = "";
    if (clave === "departamento" || clave === "todo") filtroDepartamento.value = "";
    if (clave === "categoria" || clave === "todo") filtroCategoria.value = "";
    if (clave === "color" || clave === "todo") filtroColor.value = "";
    actualizar();
  });

  // ---------------- Tarjetas ----------------
  function botonDetalles(producto) {
    return `
      <button type="button" data-id="${producto.id}" class="btn-detalle inline-flex items-center gap-1 text-secondary hover:text-primary font-semibold transition-colors">
        <span>Ver detalles</span>
        <span class="transition-transform duration-300 group-hover:translate-x-1">${ICONO_FLECHA}</span>
      </button>`;
  }

  function etiquetaCategoria(producto) {
    return `<span class="inline-block text-xs font-semibold uppercase tracking-wide text-tertiary bg-tertiary-fixed/40 px-2.5 py-1 rounded-full">${escaparHTML(producto.categoria)}</span>`;
  }

  function tarjetaGrid(producto) {
    return `
      <article class="bg-white rounded-xl border border-border-cool shadow-[0_8px_30px_rgba(79,70,229,0.08)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.14)] hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden flex flex-col">
        <button type="button" data-id="${producto.id}" class="btn-detalle relative aspect-[4/5] overflow-hidden bg-surface-container-low" aria-label="Ver detalles de ${escaparHTML(producto.nombre)}">
          <img alt="${escaparHTML(producto.nombre)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="${escaparHTML(producto.imagen)}"/>
          <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-sm font-medium px-3 py-1 rounded-full border border-primary/10">
            ${escaparHTML(producto.departamento)}
          </span>
        </button>
        <div class="p-6 flex-grow flex flex-col">
          <div class="mb-3">${etiquetaCategoria(producto)}</div>
          <h3 class="text-xl leading-tight font-bold text-on-surface mb-2">${escaparHTML(producto.nombre)}</h3>
          <p class="flex items-center gap-1 text-sm text-on-surface-variant mb-3">${ICONO_UBICACION}${escaparHTML(producto.municipio)}</p>
          <p class="text-on-surface-variant mb-6 line-clamp-2">${escaparHTML(producto.descripcion)}</p>
          <div class="mt-auto pt-4 border-t border-border-cool flex justify-between items-center">
            <span class="font-semibold text-primary">Consúltanos</span>
            ${botonDetalles(producto)}
          </div>
        </div>
      </article>`;
  }

  function tarjetaLista(producto) {
    return `
      <article class="bg-white rounded-xl border border-border-cool shadow-[0_4px_20px_rgba(79,70,229,0.06)] hover:shadow-[0_10px_30px_rgba(79,70,229,0.12)] transition-all duration-300 group overflow-hidden flex flex-col sm:flex-row">
        <button type="button" data-id="${producto.id}" class="btn-detalle relative sm:w-56 md:w-64 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden bg-surface-container-low" aria-label="Ver detalles de ${escaparHTML(producto.nombre)}">
          <img alt="${escaparHTML(producto.nombre)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="${escaparHTML(producto.imagen)}"/>
        </button>
        <div class="p-5 md:p-6 flex-grow flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-grow min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              ${etiquetaCategoria(producto)}
              <span class="text-xs font-medium text-primary bg-mesh-blue px-2.5 py-1 rounded-full">${escaparHTML(producto.departamento)}</span>
            </div>
            <h3 class="text-xl font-bold text-on-surface mb-1">${escaparHTML(producto.nombre)}</h3>
            <p class="flex items-center gap-1 text-sm text-on-surface-variant mb-2">${ICONO_UBICACION}${escaparHTML(producto.municipio)}</p>
            <p class="text-on-surface-variant line-clamp-2">${escaparHTML(producto.descripcion)}</p>
          </div>
          <div class="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border-cool">
            <span class="font-semibold text-primary">Consúltanos</span>
            ${botonDetalles(producto)}
          </div>
        </div>
      </article>`;
  }

  function mostrarProductos(lista) {
    contador.textContent =
      lista.length === 1 ? "1 textil encontrado" : `${lista.length} textiles encontrados`;

    if (lista.length === 0) {
      contenedor.className = "";
      contenedor.innerHTML = `
        <div class="text-center py-16 px-6 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
          <h3 class="text-xl font-bold text-on-surface mb-2">No encontramos resultados</h3>
          <p class="text-on-surface-variant mb-5">Prueba con otra palabra o quita algún filtro.</p>
          <button type="button" data-quitar="todo" class="px-5 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-container">Ver todo el catálogo</button>
        </div>`;
      contenedor.querySelector("[data-quitar]").addEventListener("click", () => {
        campoBusqueda.value = "";
        filtroDepartamento.value = filtroCategoria.value = filtroColor.value = "";
        actualizar();
      });
      return;
    }

    if (vistaActual === "lista") {
      contenedor.className = "flex flex-col gap-5";
      contenedor.innerHTML = lista.map(tarjetaLista).join("");
    } else {
      contenedor.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter";
      contenedor.innerHTML = lista.map(tarjetaGrid).join("");
    }
  }

  // ---------------- Vista columnas / lista ----------------
  function actualizarBotonesVista() {
    const activo = ["bg-primary", "text-white", "shadow-sm"];
    const inactivo = ["text-on-surface-variant", "hover:text-primary"];
    [
      ["grid", "btn-vista-grid"],
      ["lista", "btn-vista-lista"],
    ].forEach(([vista, id]) => {
      const btn = document.getElementById(id);
      const esActivo = vistaActual === vista;
      btn.classList.remove(...activo, ...inactivo);
      btn.classList.add(...(esActivo ? activo : inactivo));
      btn.setAttribute("aria-pressed", esActivo);
    });
  }

  window.cambiarVista = function (vista) {
    vistaActual = vista;
    try {
      localStorage.setItem(CLAVE_VISTA, vista);
    } catch (e) {}
    actualizarBotonesVista();
    mostrarProductos(filtrar());
  };

  // ---------------- Modal ----------------
  const modal = document.getElementById("modal-enlace");
  const cajaModal = modal.querySelector(".transform");
  let productoAbierto = null;

  function abrirModal(producto) {
    productoAbierto = producto;
    document.getElementById("modal-title").textContent = producto.nombre;
    document.getElementById("modal-img").src = producto.imagen;
    document.getElementById("modal-img").alt = producto.nombre;
    document.getElementById("modal-desc").textContent = producto.descripcion;
    document.getElementById("modal-status").textContent = producto.departamento;
    document.getElementById("modal-categoria").textContent = producto.categoria;
    document.getElementById("modal-municipio").textContent = `${producto.municipio}, ${producto.departamento}`;
    document.getElementById("modal-color").textContent = producto.color;
    document.getElementById("modal-enlace").href = `./producto.html?id=${producto.id}`;

    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      cajaModal.classList.replace("scale-95", "scale-100");
    }, 10);
    document.body.style.overflow = "hidden";
  }

  window.closeModal = function () {
    modal.classList.add("opacity-0");
    cajaModal.classList.replace("scale-100", "scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }, 300);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });
  document.getElementById("modal-whatsapp").addEventListener("click", () => {
    if (productoAbierto) consultar(`${productoAbierto.nombre} (${productoAbierto.color}, código ${productoAbierto.id})`);
  });

  contenedor.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-detalle");
    if (!boton) return;
    const producto = productos.find((p) => p.id === Number(boton.dataset.id));
    if (producto) abrirModal(producto);
  });

  // ---------------- Inicio ----------------
  function actualizar() {
    guardarURL();
    pintarFiltrosActivos();
    mostrarProductos(filtrar());
  }

  campoBusqueda.addEventListener("input", actualizar);
  [filtroDepartamento, filtroCategoria, filtroColor, filtroOrden].forEach((s) => s.addEventListener("change", actualizar));

  leerURL();
  actualizarBotonesVista();
  pintarFiltrosActivos();
  mostrarProductos(filtrar());
})();
