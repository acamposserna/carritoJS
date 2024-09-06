/**
 * Gestión un carrito de la compra con JavaScript
 * 
 * Incluye las funcionalidades de añadir y eliminar artículos, también se incluye
 * la opción de vaciar el carrito completamente.
 * 
 * Los productos añadidos quedan almacenados en localStorage para que, si se vuelve
 * a entrar en la página, siguan estando disponibles en el carrito.
 * 
 * @author Antonio Campos (https://github.com/acamposserna)
 * @version 1.0.0
 * @license MIT License
 */

/*************
 * VARIABLES *
 *************/
 
// Elementos de HTML
const carritoDiv = document.querySelector('#carrito');
const tbodyListaCarritoTable = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursosDiv = document.querySelector('#lista-cursos');

// Variables
let articulosCarrito = [];


// Registramos todos los eventos de la aplicación
registrarEventListeners();

/*************
 * FUNCIONES *
 *************/

/**
 * Función que registra todos los eventos de la aplicación
 */
function registrarEventListeners() {
    // Evento para agregar un curso al carrito
    listaCursosDiv.addEventListener('click', agregarCurso);

    // Evento para eliminar un curso del carrito
    carritoDiv.addEventListener('click', eliminarCurso);

    // Evento click en el botón 'Vaciar carrito'
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // Evento para inicializar el carrito desde LocalStorage
    document.addEventListener('DOMContentLoaded', inicializarCarrito);
}

/**
 * Función que se ejecuta cuando se carga la página para cargar en el carrito
 * los artículos que hay en localStorage. Si no hay artículos, la variable
 * se inicializa con el contenido vacío.
 * 
 * @param {Event} evento que se está ejecutando
 */
function inicializarCarrito(ev) {
    // Si existen articulos en el carrito los cargamos en la variable 'articulosCarrito'.
    // Sino vaciamos el contenido de la variable
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Mostramos el contenido el carrito
    carritoHTML();
}

/**
 * Función que borra todos los artículos del carrito.
 * 
 * @param {Event} evento que se está ejecutando 
 */
function vaciarCarrito(ev) {
    // Evitamos la ejecución por defecto
    ev.preventDefault();
    
    // Vaciamos el carrito
    articulosCarrito = [];

    // Borramos los datos de LocalStorage
    localStorage.removeItem('carrito');
    
    // Borramos el HTML
    limpiarCarritoHTML();
}

/**
 * Función para eliminar un artículo del carrito.
 * 
 * Si la cantidad del artículo es mayor de uno, se resta un elemento en lugar de borrarlo.
 * 
 * @param {Event} evento que se está ejecutando
 */
function eliminarCurso(ev) {
    // Evitamos la ejecución por defecto
    ev.preventDefault();

    // Ejecutamos la función sólo si se ha pulsado el botón de "Eliminar"
    if (ev.target.classList.contains('borrar-curso')) {
        // ID del curso a borrar
        const cursoId = ev.target.getAttribute('data-id');

        // Indice del curso dentro del carrito
        const indiceCurso = articulosCarrito.findIndex ( curso => curso.id === cursoId );
        if (indiceCurso !== -1) {
            if (articulosCarrito[indiceCurso].cantidad === 1) {
                // Si la cantidad es 1, borramos el curso
                articulosCarrito.splice(indiceCurso, 1);
            }
            else {
                // Si la cantidad es mayor de 1, restamos un curso
                articulosCarrito[indiceCurso].cantidad--;
            }
        }

        // Actualizamos los datos de LocalStorage
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));

        // Mostramos el contenido el carrito
        carritoHTML();
    }
}

/**
 * Función que agrega un artículo al carrito.
 * 
 * @param {Event} evento que se está ejecutando
 */
function agregarCurso(ev) {
    // Evitamos la ejecución por defecto
    ev.preventDefault();

    // Ejecutamos la función sólo si se ha pulsado el botón "Agregar al carrito"
    if (ev.target.classList.contains('agregar-carrito')) {
        // Seleccionamos el div card con los datos del curso
        const cursoSeleccionado = ev.target.parentElement.parentElement;
        
        // Obtenemos los datos del curso
        const datosCurso = obtenerDatosCurso(cursoSeleccionado);
        
        // Comprobamos si el curso ya está en el carrito
        const indiceCurso = articulosCarrito.findIndex ( curso => curso.id === datosCurso.id );
        if (indiceCurso !== -1) {
            // Si ya existe, actualizamos la cantidad
            articulosCarrito[indiceCurso].cantidad++;
        }
        else {
            // Si no existe, agragamos el curso al carrito
            articulosCarrito = [...articulosCarrito, datosCurso];
        }
        
        // Actualizamos los datos de LocalStorage
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));

        // Mostramos el contenido el carrito
        carritoHTML();
    }
}

/**
 * Esta función extrae de las etiquetas HTML datos del artículo y los devuelve
 * en un objeto.
 * 
 * @param {Element} curso seleccionado
 * @returns {Object} datos del curso seleccionado
 */
function obtenerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        nombre: curso.querySelector('.info-card h4').textContent,
        precio: curso.querySelector('.info-card .precio span').textContent,
        id: curso.querySelector('.info-card a').getAttribute('data-id'),
        cantidad: 1
    };

    return infoCurso;
}

/**
 * Función para generar el HTML del carrito
 */
function carritoHTML() {
    // Limpiamos el HTML
    limpiarCarritoHTML();

    // Recorremos el carrito y generamos el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, nombre, precio, cantidad, id } = curso;
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${imagen}"width="100px"></td>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}"> X </a></td>
        `;

        // Agregamos el HTML al tbody
        tbodyListaCarritoTable.appendChild(fila);
    });
}

/**
 * Función para limpiar el contenido HTML del carrito.
 */
function limpiarCarritoHTML() {
    // Borramos todos los elementos HTML del carrito
    while (tbodyListaCarritoTable.firstChild) {
        tbodyListaCarritoTable.removeChild(tbodyListaCarritoTable.firstChild);
    }
}