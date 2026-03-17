// Estado central de la aplicación
let tarjetas = [];
let idContador = 1;

// Generar ID único
const generarId = () => idContador++;

// Obtiene el valor de un campo y lo limpia
const leerCampo = (selector) => {
  const campo = document.querySelector(selector);
  const valor = campo.value.trim();
  campo.value = "";
  return valor;
};

//Referencia al contenedor de la galería
const galeria = document.querySelector("#galeria");

// Crear tarjeta en el DOM
function crearElementoTarjeta({ id, titulo, descripcion, categoria }) {
// Crear el contenedor de la tarjeta
  const tarjeta = document.createElement("article");

  tarjeta.classList.add(
    "tarjeta",
    `categoria-${categoria}`
  );

  tarjeta.dataset.id = id;

  tarjeta.innerHTML = `
    <span class="badge">${categoria}</span>
    <h3>${titulo}</h3>
    <p>${descripcion}</p>
    <button class="btn-eliminar" data-id="${id}">Eliminar</button>
  `;

  return tarjeta;
}


// Agregar tarjeta
function agregarTarjeta() {

  const titulo = leerCampo("#input-titulo");
  const descripcion = leerCampo("#input-descripcion");
  const categoria = document.querySelector("#select-categoria").value;

  // Validación básoca: los campos son obligatorios
  if (!titulo || !descripcion) {
    alert("El título y la descripción son obligatorios.");
    return;
  }

  const nuevaTarjeta = {
    id: generarId(),
    titulo,
    descripcion,
    categoria
  };

  tarjetas.push(nuevaTarjeta);

  // Crear el elemento en el DOM y añadirlo a la galería
  const elemento = crearElementoTarjeta(nuevaTarjeta);
  galeria.appendChild(elemento);

  actualizarContador();
}


// Registrar el evento del botón
document.querySelector("#btn-agregar").addEventListener("click", agregarTarjeta);


// Delegación: un solo listener en la galería para todos los botones
galeria.addEventListener("click", (e) => {
// Verificar que el clic fue en un botón de eliminar
  if (!e.target.matches(".btn-eliminar")) return;

  const idEliminar = Number(e.target.dataset.id);

  // Eliminar del estado
  tarjetas = tarjetas.filter(t => t.id !== idEliminar);

  // Eliminar del DOM
  const tarjeta = galeria.querySelector(`[data-id="${idEliminar}"]`);
  if (tarjeta) tarjeta.remove();

  actualizarContador();
});


// Filtros
const btnsFiltro = document.querySelectorAll(".filters__btn");

btnsFiltro.forEach(btn => {
  btn.addEventListener("click", () => {

    // Resaltar el botón activo
    btnsFiltro.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    const categoriaFiltro = btn.dataset.categoria;

    const todasLasTarjetas = galeria.querySelectorAll(".tarjeta");
    todasLasTarjetas.forEach(tarjeta => {

      if (categoriaFiltro === "todas") {
        tarjeta.classList.remove("oculta");
      } else {
        const coincide = tarjeta.classList.contains(
          `categoria-${categoriaFiltro}`
        );

        tarjeta.classList.toggle("oculta", !coincide);
      }
    });

    actualizarContador();
  });
});


// Actualizar el contador de tarjetas
function actualizarContador() {

  const visibles = galeria.querySelectorAll(".tarjeta:not(.oculta)").length;
  const total = galeria.querySelectorAll(".tarjeta").length;

  const contador = document.querySelector("#contador");
  contador.textContent = `Mostrando ${visibles} tarjeta(s)`;

  let mensaje = galeria.querySelector(".mensaje-vacio");

  // Si no hay tarjetas
  if (total === 0) {

    if (!mensaje) {
      mensaje = document.createElement("p");
      mensaje.classList.add("mensaje-vacio");
      mensaje.textContent = "No hay tarjetas. Crea la primera usando el formulario.";
      galeria.appendChild(mensaje);
    }

  } else {
    if (mensaje) mensaje.remove();
  }
}

// Para mostrar mensaje al inicio
actualizarContador();