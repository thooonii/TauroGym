/* *********** */
/* CARRITO */
/* *********** */
document.addEventListener("DOMContentLoaded", function () {
    const btnCart = document.querySelector(".container-car-icon");
    const containerCartProducts = document.querySelector(".buy-card");

    btnCart.addEventListener("click", () => {
      containerCartProducts.classList.toggle("hidden-cart");
    });

    //Variables
    const carrito = document.getElementById("carrito"),
      listaClases = document.getElementById("lista-clases"),
      contenedorCarrito = document.querySelector(".buy-card .lista_de_clases"),
      vaciarCarritoBtn = document.querySelector("#vaciar_carrito");

    let articulosCarrito = [];

    registrarEventsListeners();

    function registrarEventsListeners() {
      //Cuando yo le de click a "agregar al carrito de compras"
      listaClases.addEventListener("click", agregarClase);

      //Eliminar clase del carrito
      carrito.addEventListener("click", eliminarClase);

      //Vaciar el carrito
      vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = [];
        total = 0; // Restablecer el valor de 'total' a cero
        limpiarHTML();
        actualizarPrecioTotal(); // Llamar a una función para actualizar el precio total
        actualizarContadorCarrito();
      });
    }

    function actualizarPrecioTotal() {
      const sumaTotal = document.querySelector(".suma-total");
      if (sumaTotal) {
        sumaTotal.textContent = `S/${calcularTotal().toFixed(2)}`;
      }
    }

    function agregarClase(e) {
      if (e.target.classList.contains("agregar-carrito")) {
        const claseSeleccionada = e.target.parentElement.parentElement;
        leerInfo(claseSeleccionada);
        actualizarContadorCarrito();  
      }
    }

    //Elimina un clase del carrito
    function eliminarClase(e) {
      if (e.target.classList.contains("borrar-clase")) {
        const claseId = e.target.getAttribute("data-id");

        //Eliminar del arreglo del articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(
          (clase) => clase.id !== claseId
        );

        carritoHTML();
        actualizarContadorCarrito();  
      }
    }

    function actualizarContadorCarrito() {
      const contadorCarrito = document.getElementById("contador-carrito");
      // Actualizar el texto del contador con la longitud del arreglo de artículos
      contadorCarrito.textContent = articulosCarrito.length; 
    }
    
    //Leer el contenido HTML al que le dimos click y extrae la info de la clase
    function leerInfo(clase) {
      //Crear un objeto con el contenido del clase actual
      const infoClase = {
        imagen: clase.querySelector("img").src,
        titulo: clase.querySelector("h3").textContent,
        precio: clase.querySelector(".descuento").textContent,
        id: clase.querySelector("button").getAttribute("data-id"),
        cantidad: 1,
      };

      //Revisa si un elemento ya existe en el carrito
      const existe = articulosCarrito.some((clase) => clase.id === infoClase.id);

      if (existe) {
        //Actualizar la cantidad
        const clase = articulosCarrito.map((clase) => {
          if (clase.id === infoClase.id) {
            clase.cantidad++;
            return clase;
          } else {
            return clase;
          }
        });
        [...articulosCarrito, infoClase];
      } else {
        //Agregamos elementos al carrito de compras
        articulosCarrito = [...articulosCarrito, infoClase];
      }
      carritoHTML();
    }

    //Función para calcular la suma total
    function calcularTotal() {
      let total = 0;
      articulosCarrito.forEach((clase) => {
        const precio = parseFloat(clase.precio.replace("S/", ""));
        total += precio * clase.cantidad;
      });

      return total;
    }

    //Muestra el carrito en el HTML

    function carritoHTML() {
      limpiarHTML();
      //Recorre el carrito de compras y genera el HTML
      articulosCarrito.forEach((clase) => {
        const fila = document.createElement("div");
        fila.innerHTML = `
              <img src="${clase.imagen}"></img>
              <p>${clase.titulo}</p>
              <p>${clase.precio}</p>
              <p>${clase.cantidad}</p>
              <p><span class="borrar-clase" data-id="${clase.id}">X</span></p>
          `;

        contenedorCarrito.appendChild(fila);
      });

      // Actualizar la suma total en el HTML dentro del div 'buy-card'
      const sumaTotal = document.querySelector(".suma-total");
      sumaTotal.textContent = `S/${calcularTotal().toFixed(2)}`;
    }

    //Elimina las clases de la lista_de_clases
    function limpiarHTML() {
      while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
    }

    // Función para obtener la fecha actual en formato dd/mm/aaaa
    function obtenerFechaActual() {
      const fecha = new Date();
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // ¡Recuerda que enero es 0!
      const anio = fecha.getFullYear();
      return `${dia}/${mes}/${anio}`;
    }

    function generarPDF() {
      // Crear un nuevo documento PDF
      const doc = new jsPDF();

      // Título del PDF - Encabezado
      doc.setFont("helvetica");
      doc.setFontSize(12);
      doc.text("TAURO GYM - BOLETA", 100, 15, null, null, "center");

      // Crear la tabla en el PDF
      doc.autoTable({
        startY: 30, // Posición inicial de la tabla
        head: [["Producto", "Precio", "Cantidad"]],
        body: articulosCarrito.map((clase) => [
          clase.titulo,
          clase.precio,
          clase.cantidad,
        ]),
      });

      // Calcular el precio total y agregarlo al PDF
      const precioTotal = calcularTotal().toFixed(2);
      doc.text(
        `Precio Total: S/${precioTotal}`,
        10,
        doc.autoTable.previous.finalY + 20
      );

      // Pie de página - Fecha
      doc.setFontStyle("normal");
      doc.text(
        "Fecha: " + obtenerFechaActual(),
        10,
        doc.autoTable.previous.finalY + 30
      );

      // Guardar el PDF en un archivo o mostrarlo en el navegador
      doc.save("carrito_de_compras.pdf");
    }

    // Asociar un evento click al botón "GENERAR PDF"
    const generarPDFBtn = document.getElementById("generar-pdf");

    generarPDFBtn.addEventListener("click", () => {
      generarPDF(); // Llama a la función para generar el PDF
    });
});
