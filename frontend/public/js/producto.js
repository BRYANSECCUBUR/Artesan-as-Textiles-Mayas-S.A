// ============================================================================
// CATÁLOGO DE PRODUCTOS
// Para agregar un producto puedes usar el editor en admin.html, o copiar un
// bloque { ... } y cambiar sus datos. Reglas:
//  - "id" debe ser único.
//  - "categoria": Traje, Traje de gala, Huipil, Blusa o Corte.
//  - "departamento": escrito con tildes (Sololá, Quiché, Totonicapán...).
//  - "imagen": archivo dentro de img/, sin espacios. Ej.: "./img/traje-40.jpeg"
// ============================================================================
const productos = [
    {
        id: 1,
        nombre: "Traje de Patzún",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Traje",
        color: "Rojo",
        precio: 350,
        imagen: "./img/patzun.png",
        descripcion: "Traje típico de Patzún, Chimaltenango, en tonos rojos característicos del municipio. Una pieza que refleja la identidad textil de la región."
    },
    {
        id: 2,
        nombre: "Huipil de Santiago Atitlán",
        municipio: "Santiago Atitlán",
        departamento: "Sololá",
        categoria: "Huipil",
        color: "Multicolor",
        precio: 450,
        imagen: "./img/santiago.jpeg",
        descripcion: "Huipil multicolor de Santiago Atitlán, Sololá. Sus colores y diseños representan la tradición textil de las orillas del lago de Atitlán."
    },
    {
        id: 3,
        nombre: "Corte tradicional",
        municipio: "San Juan Sacatepéquez",
        departamento: "Guatemala",
        categoria: "Corte",
        color: "Azul",
        precio: 300,
        imagen: "./img/san-juan.jpg",
        descripcion: "Corte tradicional en tonos azules de San Juan Sacatepéquez. Una base versátil para combinar con huipiles y blusas bordadas."
    },
    {
        id: 4,
        nombre: "Indumentaria de gala de Patzún",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Traje de gala",
        color: "Rojo",
        precio: 3200,
        imagen: "./img/traje-01.jpeg",
        descripcion: "Indumentaria de gala de Patzún en color rojo. Un conjunto pensado para ocasiones especiales, que luce el detalle y la elegancia del traje del municipio."
    },
    {
        id: 5,
        nombre: "Set Clavel",
        municipio: "Patzicía",
        departamento: "Chimaltenango",
        categoria: "Traje",
        color: "Rojo",
        precio: 3500,
        imagen: "./img/traje-02.jpeg",
        descripcion: "Conjunto completo de Patzicía, Chimaltenango, en tonos rojos. Un set coordinado listo para lucir de pies a cabeza."
    },
    {
        id: 6,
        nombre: "Blusa bordada beige",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Blusa",
        color: "Beige",
        precio: 3500,
        imagen: "./img/traje-03.jpeg",
        descripcion: "Blusa bordada a mano de Patzún en tono beige. Un color suave que resalta el bordado y combina con cortes de distintos colores."
    },
    {
        id: 7,
        nombre: "Blusa bordada rosa",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Blusa",
        color: "Rosa",
        precio: 3500,
        imagen: "./img/traje-04.jpeg",
        descripcion: "Blusa bordada a mano de Patzún en color rosa. Una pieza delicada y llamativa, ideal para combinar con un corte tradicional."
    },
    {
        id: 8,
        nombre: "Blusa bordada rojo y blanco",
        municipio: "San Lucas",
        departamento: "Guatemala",
        categoria: "Blusa",
        color: "Rojo y blanco",
        precio: 3500,
        imagen: "./img/traje-05.jpeg",
        descripcion: "Blusa bordada a mano de San Lucas en rojo y blanco. El contraste de colores hace que cada detalle del bordado destaque."
    },
    {
        id: 9,
        nombre: "Set Flora",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Traje",
        color: "Rosa",
        precio: 4500,
        imagen: "./img/traje-06.jpeg",
        descripcion: "Set de Patzún en tonos rosa: blusa bordada a mano acompañada de un corte de gala. Un conjunto coordinado para eventos y celebraciones."
    },
    {
        id: 10,
        nombre: "Blusa bordada rosa",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Blusa",
        color: "Rosa",
        precio: 3500,
        imagen: "./img/traje-07.jpeg",
        descripcion: "Blusa bordada a mano de Patzún en tono rosa, con un bordado que aporta color y textura a la prenda."
    },
    {
        id: 11,
        nombre: "Blusa bordada roja",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Blusa",
        color: "Rojo",
        precio: 1900,
        imagen: "./img/traje-08.jpeg",
        descripcion: "Blusa bordada a mano de Patzún en color rojo. Un clásico del municipio que combina con cortes oscuros o multicolores."
    },
    {
        id: 12,
        nombre: "Indumentaria de gala de San Lucas",
        municipio: "San Lucas",
        departamento: "Guatemala",
        categoria: "Traje de gala",
        color: "Lila",
        precio: 2800,
        imagen: "./img/traje-09.jpeg",
        descripcion: "Indumentaria de gala de San Lucas en color lila, con blusa bordada a mano. Un conjunto elegante para ocasiones especiales."
    },
    {
        id: 13,
        nombre: "Set Kotzij",
        municipio: "Sacapulas",
        departamento: "Quiché",
        categoria: "Traje",
        color: "Multicolor",
        precio: 2500,
        imagen: "./img/traje-10.jpeg",
        descripcion: "Traje tradicional de Sacapulas, Quiché. Un conjunto multicolor que representa la riqueza textil del altiplano."
    },
    {
        id: 14,
        nombre: "Indumentaria tradicional de San Pedro La Laguna",
        municipio: "San Pedro La Laguna",
        departamento: "Sololá",
        categoria: "Traje",
        color: "Blanco y verde",
        precio: 3500,
        imagen: "./img/traje-11.jpeg",
        descripcion: "Indumentaria tradicional original de San Pedro La Laguna, Sololá, en tonos blanco y verde."
    },
    {
        id: 15,
        nombre: "Indumentaria tradicional de San Lucas Tolimán",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Traje",
        color: "Multicolor",
        precio: 4800,
        imagen: "./img/traje-12.jpeg",
        descripcion: "Indumentaria tradicional original de San Lucas Tolimán, Sololá. Un conjunto multicolor que muestra el estilo textil del municipio."
    },
    {
        id: 16,
        nombre: "Blusa bordada verde",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Blusa",
        color: "Verde",
        precio: 900,
        imagen: "./img/traje-13.jpeg",
        descripcion: "Blusa bordada a mano de San Lucas Tolimán en color verde. Fresca, colorida y fácil de combinar."
    },
    {
        id: 17,
        nombre: "Blusa bordada blanca",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Blusa",
        color: "Blanco, multicolor",
        precio: 900,
        imagen: "./img/traje-14.jpeg",
        descripcion: "Blusa bordada a mano de San Lucas Tolimán, con base blanca y bordado multicolor que resalta cada detalle."
    },
    {
        id: 18,
        nombre: "Blusa bordada café",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Blusa",
        color: "Café",
        precio: 900,
        imagen: "./img/traje-15.jpeg",
        descripcion: "Blusa bordada a mano de San Lucas Tolimán en tono café. Un color sobrio que da protagonismo al bordado."
    },
    {
        id: 19,
        nombre: "Set Iris",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Traje",
        color: "Rojo",
        precio: 4500,
        imagen: "./img/traje-16.jpeg",
        descripcion: "Set de Patzún en color rojo: blusa bordada a mano acompañada de un corte de gala. Un conjunto completo para lucir en celebraciones."
    },
    {
        id: 20,
        nombre: "Indumentaria de gala de San Lucas Tolimán",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Traje de gala",
        color: "Rosa",
        precio: 4800,
        imagen: "./img/traje-17.jpeg",
        descripcion: "Indumentaria tradicional de gala de San Lucas Tolimán en color rosa. Una pieza especial para eventos y ocasiones importantes."
    },
    {
        id: 21,
        nombre: "Blusa bordada negra",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Blusa",
        color: "Negro",
        precio: 900,
        imagen: "./img/traje-18.jpeg",
        descripcion: "Blusa bordada a mano de San Lucas Tolimán en color negro. El fondo oscuro hace que los colores del bordado resalten."
    },
    {
        id: 22,
        nombre: "Blusa bordada celeste",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Blusa",
        color: "Celeste",
        precio: 900,
        imagen: "./img/traje-19.jpeg",
        descripcion: "Blusa bordada a mano de San Lucas Tolimán en color celeste, ligera y alegre."
    },
    {
        id: 23,
        nombre: "Indumentaria de gala de San Lucas Tolimán",
        municipio: "San Lucas Tolimán",
        departamento: "Sololá",
        categoria: "Traje de gala",
        color: "Amarillo",
        precio: 4800,
        imagen: "./img/traje-20.jpeg",
        descripcion: "Indumentaria tradicional de gala de San Lucas Tolimán en color amarillo. Un conjunto luminoso y lleno de detalle."
    },
    {
        id: 24,
        nombre: "Blusa bordada celeste",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Blusa",
        color: "Celeste",
        precio: 3500,
        imagen: "./img/traje-21.jpeg",
        descripcion: "Blusa bordada a mano de Patzún en color celeste. Una alternativa suave al rojo tradicional del municipio."
    },
    {
        id: 25,
        nombre: "Indumentaria tradicional de Santiago Atitlán",
        municipio: "Santiago Atitlán",
        departamento: "Sololá",
        categoria: "Traje",
        color: "Amarillo",
        precio: 4800,
        imagen: "./img/traje-22.jpeg",
        descripcion: "Indumentaria tradicional original de Santiago Atitlán, Sololá, en color amarillo."
    },
    {
        id: 26,
        nombre: "Huipil bordado de Sacatepéquez",
        municipio: "Sacatepéquez",
        departamento: "Sacatepéquez",
        categoria: "Huipil",
        color: "Multicolor",
        precio: 2900,
        imagen: "./img/traje-23.png",
        descripcion: "Huipil bordado a mano de Sacatepéquez, con diseño multicolor que llena de vida la prenda."
    },
    {
        id: 27,
        nombre: "Huipil bordado de Nebaj",
        municipio: "Nebaj",
        departamento: "Quiché",
        categoria: "Huipil",
        color: "Multicolor",
        precio: 3000,
        imagen: "./img/traje-24.png",
        descripcion: "Huipil bordado a mano de Nebaj, Quiché. Sus colores vivos son característicos de la región ixil."
    },
    {
        id: 28,
        nombre: "Blusa bordada naranja",
        municipio: "Cobán",
        departamento: "Alta Verapaz",
        categoria: "Blusa",
        color: "Naranja",
        precio: 450,
        imagen: "./img/traje-25.png",
        descripcion: "Blusa bordada a mano de Cobán, Alta Verapaz, en color naranja. Una pieza alegre y fresca para el día a día."
    },
    {
        id: 29,
        nombre: "Huipil bordado de San Pedro Sacatepéquez",
        municipio: "San Pedro Sacatepéquez",
        departamento: "Guatemala",
        categoria: "Huipil",
        color: "Multicolor",
        precio: 3000,
        imagen: "./img/traje-26.png",
        descripcion: "Huipil bordado a mano de San Pedro Sacatepéquez, con un diseño multicolor lleno de detalle."
    },
    {
        id: 30,
        nombre: "Blusa bordada roja",
        municipio: "Patzún",
        departamento: "Chimaltenango",
        categoria: "Blusa",
        color: "Rojo",
        precio: 3500,
        imagen: "./img/traje-27.png",
        descripcion: "Blusa bordada a mano de Patzún en color rojo, el tono que identifica al traje del municipio."
    },
    {
        id: 31,
        nombre: "Indumentaria de Sumpango",
        municipio: "Sumpango",
        departamento: "Sacatepéquez",
        categoria: "Traje",
        color: "Blanco",
        precio: 3500,
        imagen: "./img/traje-28.jpeg",
        descripcion: "Indumentaria de Sumpango, Sacatepéquez, con base blanca y detalles multicolor."
    },
    {
        id: 32,
        nombre: "Indumentaria de San Miguel Totonicapán",
        municipio: "San Miguel Totonicapán",
        departamento: "Totonicapán",
        categoria: "Traje",
        color: "Rojo",
        precio: 4500,
        imagen: "./img/traje-29.jpeg",
        descripcion: "Indumentaria de San Miguel Totonicapán en color rojo. Un conjunto tradicional con fuerte presencia de color."
    },
    {
        id: 33,
        nombre: "Indumentaria de San Juan La Laguna",
        municipio: "San Juan La Laguna",
        departamento: "Sololá",
        categoria: "Traje",
        color: "Amarillo",
        precio: 2800,
        imagen: "./img/traje-30.jpeg",
        descripcion: "Indumentaria de San Juan La Laguna, Sololá, en color amarillo. Luminosa y llena de tradición."
    },
    {
        id: 34,
        nombre: "Indumentaria de San Juan La Laguna",
        municipio: "San Juan La Laguna",
        departamento: "Sololá",
        categoria: "Traje",
        color: "Azul",
        precio: 2800,
        imagen: "./img/traje-31.jpeg",
        descripcion: "Indumentaria de San Juan La Laguna, Sololá, modelo «Mojado» en color azul."
    },
    {
        id: 35,
        nombre: "Indumentaria de San Cristóbal",
        municipio: "San Cristóbal Totonicapán",
        departamento: "Totonicapán",
        categoria: "Traje",
        color: "Rojo",
        precio: 3900,
        imagen: "./img/traje-32.jpeg",
        descripcion: "Indumentaria de San Cristóbal Totonicapán en color rojo, representativa de la tradición textil del municipio."
    },
    {
        id: 36,
        nombre: "Indumentaria de San Pedro",
        municipio: "San Pedro",
        departamento: "San Marcos",
        categoria: "Traje",
        color: "Amarillo",
        precio: 5000,
        imagen: "./img/traje-33.jpeg",
        descripcion: "Indumentaria de San Pedro, San Marcos, en color amarillo. Un conjunto vistoso del occidente del país."
    },
    {
        id: 37,
        nombre: "Indumentaria de San Pedro Soloma",
        municipio: "San Pedro Soloma",
        departamento: "Huehuetenango",
        categoria: "Traje",
        color: "Rojo y blanco",
        precio: 4500,
        imagen: "./img/traje-34.jpeg",
        descripcion: "Indumentaria de San Pedro Soloma, Huehuetenango, en rojo y blanco. Un diseño tradicional de los Cuchumatanes."
    },
    {
        id: 38,
        nombre: "Indumentaria de Sumpango negra",
        municipio: "Sumpango",
        departamento: "Sacatepéquez",
        categoria: "Traje",
        color: "Negro",
        precio: 3500,
        imagen: "./img/traje-35.jpeg",
        descripcion: "Indumentaria de Sumpango, Sacatepéquez, bordada a mano en color negro. Elegante y con bordados que contrastan con el fondo oscuro."
    },
    {
        id: 39,
        nombre: "Indumentaria bordada de San Pedro Sacatepéquez",
        municipio: "San Pedro Sacatepéquez",
        departamento: "Guatemala",
        categoria: "Traje",
        color: "Multicolor",
        precio: 5200,
        imagen: "./img/traje-36.jpeg",
        descripcion: "Indumentaria de San Pedro Sacatepéquez bordada a mano, con un diseño multicolor de gran detalle."
    },
    {
        id: 40,
        nombre: "Indumentaria bordada de San Juan Sacatepéquez",
        municipio: "San Juan Sacatepéquez",
        departamento: "Guatemala",
        categoria: "Traje",
        color: "Amarillo",
        precio: 5200,
        imagen: "./img/traje-37.jpeg",
        descripcion: "Indumentaria de San Juan Sacatepéquez bordada a mano en color amarillo."
    },
    {
        id: 41,
        nombre: "Indumentaria bordada de Palín",
        municipio: "Palín",
        departamento: "Escuintla",
        categoria: "Traje",
        color: "Blanco, rojo y negro",
        precio: 5200,
        imagen: "./img/traje-38.jpeg",
        descripcion: "Indumentaria de Palín, Escuintla, bordada a mano en blanco, rojo y negro."
    },
    {
        id: 42,
        nombre: "Indumentaria bordada de Palín",
        municipio: "Palín",
        departamento: "Escuintla",
        categoria: "Traje",
        color: "Celeste",
        precio: 5200,
        imagen: "./img/traje-39.jpeg",
        descripcion: "Indumentaria de Palín, Escuintla, bordada a mano en color celeste."
    }
];
