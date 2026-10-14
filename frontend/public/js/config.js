// ============================================================================
// CONFIGURACIÓN GENERAL DEL SITIO
// Cambia aquí los datos de contacto y se actualizan en todas las páginas.
// ============================================================================
const SITIO = {
  nombre: "RaícesGT",

  // Número de WhatsApp con código de país (502 = Guatemala), sin espacios ni "+"
  whatsapp: "50236355457",
  whatsappVisible: "+502 3635 5457",

  // Redes sociales: pega el enlace completo. Las que queden vacías no se muestran.
  redes: {
    facebook: "https://www.facebook.com/profile.php?id=61595374225329",
    instagram: "https://www.instagram.com/raices3gt",
    tiktok: "",
  },
};

// Abre WhatsApp con un mensaje ya escrito
function abrirWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje || "Hola, quisiera más información sobre sus textiles.");
  window.open(`https://wa.me/${SITIO.whatsapp}?text=${texto}`, "_blank", "noopener");
}

// Consulta sobre un producto específico
function consultar(producto) {
  abrirWhatsApp(`Hola, quisiera consultar disponibilidad y precio del producto: ${producto}.`);
}
