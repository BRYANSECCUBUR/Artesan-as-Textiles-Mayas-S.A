// ============================================================================
// PANEL DE ADMINISTRACIÓN DEL CATÁLOGO
// Edita una copia de `productos` (de js/producto.js), la guarda como borrador
// en este navegador y genera un nuevo producto.js para reemplazar el actual.
// ============================================================================
(function () {
  const CLAVE_BORRADOR = "raicesgt-admin-borrador";
  const DEPARTAMENTOS = [
    "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso", "Escuintla",
    "Guatemala", "Huehuetenango", "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango",
    "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá",
    "Suchitepéquez", "Totonicapán", "Zacapa",
  ];
  const CATEGORIAS = ["Traje", "Traje de gala", "Huipil", "Blusa", "Corte"];
  const CAMPOS = ["id", "nombre", "municipio", "departamento", "categoria", "color", "precio", "imagen", "descripcion"];

  const original = JSON.stringify(productos);
  let lista = JSON.parse(original);
  const fotosNuevas = new Map(); // nombre de archivo -> URL temporal para vista previa

  // ---------------- Borrador ----------------
  function cargarBorrador() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_BORRADOR) || "null");
      if (!guardado) return;
      lista = guardado.productos;
      if (guardado.original !== original) {
        mostrarAviso(
          "Tienes un borrador creado sobre una versión anterior del catálogo. Revísalo o descártalo antes de descargar para no perder cambios de otras personas."
        );
        return;
      }
    } catch (e) {}
    if (JSON.stringify(lista) !== original) mostrarAviso("Tienes cambios sin publicar. Descarga el producto.js cuando termines.");
  }

  function guardarBorrador() {
    try {
      if (JSON.stringify(lista) === original) {
        localStorage.removeItem(CLAVE_BORRADOR);
        ocultarAviso();
      } else {
        localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ original, productos: lista }));
        mostrarAviso("Tienes cambios sin publicar. Descarga el producto.js cuando termines.");
      }
    } catch (e) {}
  }

  const aviso = document.getElementById("aviso-borrador");
  function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.classList.remove("hidden");
  }
  function ocultarAviso() {
    aviso.classList.add("hidden");
  }

  // ---------------- Utilidades ----------------
  function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function normalizar(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }
  // "Traje Rojo (2).JPG" -> "traje-rojo-2.jpg"
  function nombreArchivoSeguro(nombre) {
    const punto = nombre.lastIndexOf(".");
    const base = punto > 0 ? nombre.slice(0, punto) : nombre;
    const ext = punto > 0 ? nombre.slice(punto + 1).toLowerCase() : "jpg";
    const limpio = normalizar(base).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "foto";
    return `${limpio}.${ext}`;
  }
  function siguienteId() {
    return lista.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
  }
  function srcImagen(imagen) {
    const archivo = String(imagen || "").replace(/^\.\/img\//, "");
    return fotosNuevas.get(archivo) || `./img/${archivo}`;
  }

  // ---------------- Lista ----------------
  const ul = document.getElementById("lista");
  const buscar = document.getElementById("buscar");

  function pintarLista() {
    const texto = normalizar(buscar.value);
    const visibles = lista.filter(
      (p) => !texto || [p.nombre, p.municipio, p.departamento, p.categoria, p.color, p.id].some((c) => normalizar(c).includes(texto))
    );
    document.getElementById("total").textContent = `${visibles.length} de ${lista.length}`;

    ul.innerHTML = visibles
      .map(
        (p) => `
      <li class="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-low/60">
        <img src="${escaparHTML(srcImagen(p.imagen))}" alt="" loading="lazy" class="w-14 h-16 object-cover rounded-md bg-surface-container shrink-0" onerror="this.style.visibility='hidden'" />
        <div class="min-w-0 flex-grow">
          <div class="font-semibold truncate">${escaparHTML(p.nombre)} <span class="text-xs font-normal text-outline">#${p.id}</span></div>
          <div class="text-sm text-on-surface-variant truncate">${escaparHTML(p.categoria)} · ${escaparHTML(p.municipio)}, ${escaparHTML(p.departamento)} · ${escaparHTML(p.color)}</div>
        </div>
        <div class="hidden sm:block text-sm font-semibold text-primary w-24 text-right">Q${Number(p.precio).toLocaleString("es-GT")}</div>
        <div class="flex gap-1 shrink-0">
          <button type="button" data-editar="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-secondary hover:bg-secondary-fixed">Editar</button>
          <button type="button" data-eliminar="${p.id}" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-error hover:bg-error-container">Eliminar</button>
        </div>
      </li>`
      )
      .join("") || `<li class="px-5 py-10 text-center text-on-surface-variant">No hay productos que coincidan.</li>`;
  }

  ul.addEventListener("click", (e) => {
    const editar = e.target.closest("[data-editar]");
    const eliminar = e.target.closest("[data-eliminar]");
    if (editar) abrirFormulario(lista.find((p) => p.id === Number(editar.dataset.editar)));
    if (eliminar) {
      const p = lista.find((x) => x.id === Number(eliminar.dataset.eliminar));
      if (p && confirm(`¿Eliminar "${p.nombre}" (#${p.id}) del catálogo?`)) {
        lista = lista.filter((x) => x.id !== p.id);
        guardarBorrador();
        pintarLista();
      }
    }
  });
  buscar.addEventListener("input", pintarLista);

  // ---------------- Formulario ----------------
  const panel = document.getElementById("panel");
  const form = document.getElementById("form");
  const archivo = document.getElementById("archivo");
  const vistaPrevia = document.getElementById("vista-previa");
  const sinImagen = document.getElementById("sin-imagen");
  const errores = document.getElementById("errores");
  // namedItem evita choques con propiedades propias del form (como form.id)
  const campo = (nombre) => form.elements.namedItem(nombre);

  campo("departamento").innerHTML = DEPARTAMENTOS.map((d) => `<option>${d}</option>`).join("");
  const categorias = [...new Set([...CATEGORIAS, ...lista.map((p) => p.categoria)])];
  document.getElementById("lista-categorias").innerHTML = categorias.map((c) => `<option value="${escaparHTML(c)}">`).join("");

  function actualizarVistaPrevia() {
    const nombre = campo("imagen").value.trim();
    if (!nombre) {
      vistaPrevia.classList.add("hidden");
      sinImagen.classList.remove("hidden");
      return;
    }
    vistaPrevia.src = srcImagen(nombre);
    vistaPrevia.classList.remove("hidden");
    sinImagen.classList.add("hidden");
    document.getElementById("aviso-imagen").classList.toggle("hidden", !fotosNuevas.has(nombre));
  }
  vistaPrevia.addEventListener("error", () => {
    vistaPrevia.classList.add("hidden");
    sinImagen.textContent = "No se encontró la imagen";
    sinImagen.classList.remove("hidden");
  });

  function abrirFormulario(producto) {
    const nuevo = !producto;
    const datos = producto || {
      id: siguienteId(),
      nombre: "",
      municipio: "",
      departamento: "Guatemala",
      categoria: "",
      color: "",
      precio: "",
      imagen: "",
      descripcion: "",
    };
    document.getElementById("panel-titulo").textContent = nuevo ? "Nuevo producto" : `Editar producto #${datos.id}`;
    form.dataset.editando = nuevo ? "" : datos.id;
    CAMPOS.forEach((c) => {
      campo(c).value = c === "imagen" ? String(datos.imagen).replace(/^\.\/img\//, "") : datos[c];
    });
    if (!DEPARTAMENTOS.includes(datos.departamento)) {
      campo("departamento").insertAdjacentHTML("afterbegin", `<option>${escaparHTML(datos.departamento)}</option>`);
      campo("departamento").value = datos.departamento;
    }
    archivo.value = "";
    sinImagen.textContent = "Sin imagen";
    errores.classList.add("hidden");
    actualizarVistaPrevia();
    panel.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    campo("nombre").focus();
  }

  function cerrarFormulario() {
    panel.classList.add("hidden");
    document.body.style.overflow = "";
  }

  panel.addEventListener("click", (e) => {
    if (e.target === panel || e.target.closest("[data-cerrar]")) cerrarFormulario();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.classList.contains("hidden")) cerrarFormulario();
  });

  archivo.addEventListener("change", () => {
    const f = archivo.files[0];
    if (!f) return;
    const nombre = nombreArchivoSeguro(f.name);
    fotosNuevas.set(nombre, URL.createObjectURL(f));
    campo("imagen").value = nombre;
    actualizarVistaPrevia();
  });
  campo("imagen").addEventListener("change", actualizarVistaPrevia);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = {};
    CAMPOS.forEach((c) => (datos[c] = String(campo(c).value).trim()));
    datos.id = Number(datos.id);
    datos.precio = Number(datos.precio);
    datos.imagen = datos.imagen.replace(/^\.\/img\//, "");

    const problemas = [];
    ["nombre", "municipio", "departamento", "categoria", "color", "descripcion", "imagen"].forEach((c) => {
      if (!datos[c]) problemas.push(`Falta llenar: ${c}.`);
    });
    if (!Number.isFinite(datos.precio) || datos.precio < 0 || campo("precio").value === "") problemas.push("El precio debe ser un número válido.");
    if (/\s/.test(datos.imagen)) problemas.push("El nombre de la imagen no debe tener espacios (usa guiones: traje-40.jpeg).");
    if (datos.imagen && !/\.(jpe?g|png|webp|avif|gif)$/i.test(datos.imagen)) problemas.push("La imagen debe terminar en .jpg, .jpeg, .png o .webp.");
    if (normalizar(datos.descripcion) === normalizar(datos.nombre)) problemas.push("La descripción no debe ser igual al nombre.");

    if (problemas.length) {
      errores.innerHTML = problemas.map(escaparHTML).join("<br>");
      errores.classList.remove("hidden");
      return;
    }

    datos.imagen = `./img/${datos.imagen}`;
    const editando = Number(form.dataset.editando);
    if (editando) {
      lista = lista.map((p) => (p.id === editando ? datos : p));
    } else {
      lista.push(datos);
    }
    guardarBorrador();
    pintarLista();
    cerrarFormulario();
  });

  // ---------------- Exportar ----------------
  function generarArchivo() {
    const encabezado = `// ============================================================================
// CATÁLOGO DE PRODUCTOS
// Para agregar un producto puedes usar el editor en admin.html, o copiar un
// bloque { ... } y cambiar sus datos. Reglas:
//  - "id" debe ser único.
//  - "categoria": Traje, Traje de gala, Huipil, Blusa o Corte.
//  - "departamento": escrito con tildes (Sololá, Quiché, Totonicapán...).
//  - "imagen": archivo dentro de img/, sin espacios. Ej.: "./img/traje-40.jpeg"
// ============================================================================
`;
    const bloques = lista.map((p) => {
      const lineas = CAMPOS.map((c) => {
        const valor = c === "id" || c === "precio" ? Number(p[c]) : JSON.stringify(String(p[c] ?? ""));
        return `        ${c}: ${valor}`;
      });
      return `    {\n${lineas.join(",\n")}\n    }`;
    });
    return `${encabezado}const productos = [\n${bloques.join(",\n")}\n];\n`;
  }

  document.getElementById("btn-nuevo").addEventListener("click", () => abrirFormulario(null));

  document.getElementById("btn-descargar").addEventListener("click", () => {
    const blob = new Blob([generarArchivo()], { type: "text/javascript;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "producto.js";
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  });

  document.getElementById("btn-restaurar").addEventListener("click", () => {
    if (!confirm("¿Descartar todos los cambios del borrador y volver al catálogo publicado?")) return;
    lista = JSON.parse(original);
    try {
      localStorage.removeItem(CLAVE_BORRADOR);
    } catch (e) {}
    ocultarAviso();
    pintarLista();
  });

  cargarBorrador();
  pintarLista();
})();
