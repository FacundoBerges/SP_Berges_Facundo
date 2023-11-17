import { campos } from "./static/campos.js";
import {
  deleteFetch,
  getXMLHttpRequest,
  postFetch,
  putAsyncAwait,
} from "./functions/peticiones.js";
import {
  $,
  actualizarTabla,
  agregarItemSelector,
  calcularEdad,
  cambiarForm,
  filtrarTabla,
  ocultarColumna,
  ordenarFilasPor,
  validarDato,
} from "./functions/funciones.js";

const listado = [];
let listadoFiltrado = [];

window.addEventListener("load", () => {
  getXMLHttpRequest(listado);

  // Llenado de array
  listadoFiltrado = filtrarTabla(listado, "todos");
  agregarItemSelector("");

  // Filtro
  const filtro = $("filtro");
  filtro.addEventListener("change", () => {
    listadoFiltrado = filtrarTabla(
      listado,
      filtro.options[filtro.selectedIndex].value
    );

    actualizarTabla(listadoFiltrado, campos);
  });

  /*      Listeners     */
  // Calculo promedio edad
  $("btn-calcular").addEventListener("click", () => {
    const input = $("promedio-edad");
    input.value = calcularEdad(listadoFiltrado);
  });

  $("tipo").addEventListener("change", (e) => {
    agregarItemSelector(e.target.value);
  });

  // Checkboxes
  campos.forEach((campo) => {
    document
      .getElementById(`checkbox-${campo}`)
      .addEventListener("change", (e) => {
        ocultarColumna(e.target.name);
      });
  });

  // ordenar tabla
  $("table-head").addEventListener("click", (e) => {
    listadoFiltrado = ordenarFilasPor(e.target, listado);
    actualizarTabla(listadoFiltrado, campos);
  });

  $("btn-agregar").addEventListener("click", () => {
    $("tipo-form").replaceChildren(document.createTextNode("Alta"));
    $("tipo").removeAttribute("disabled");

    cambiarForm($("form-agregar").style.display == "none");
  });

  $("cancelar").addEventListener("click", () => {
    cambiarForm($("form-tabla").style.display != "none");

    agregarItemSelector("");
  });

  $("form-agregar").addEventListener("submit", (e) => {
    const aceptar = $("tipo-form").textContent.toLowerCase();

    let id;

    if (aceptar === "alta") {
      id = listado[listado.length - 1].id + 1;
    } else {
      id = parseInt($("id").value);
    }
    let nombre = $("nombre").value;
    let apellido = $("apellido").value;
    let edad = parseInt($("edad").value);
    let equipo;
    let posicion;
    let cantidadGoles;
    let titulo;
    let facultad;
    let añoGraduacion;

    const tipo = $("tipo").value;

    if (tipo) {
      switch ($("tipo").value) {
        case "futbolista":
          equipo = $("equipo").value;
          posicion = $("posicion").value;
          cantidadGoles = parseInt($("cantidadGoles").value);
          break;
        case "profesional":
          titulo = $("titulo").value;
          facultad = $("facultad").value;
          añoGraduacion = parseInt($("añoGraduacion").value);
          break;
        default:
          break;
      }

      let dato = {
        id,
        nombre,
        apellido,
        edad,
        equipo,
        posicion,
        cantidadGoles,
        titulo,
        facultad,
        añoGraduacion,
      };

      if (validarDato(dato)) {
        switch (aceptar) {
          case "alta":
            dato.id = null;
            putAsyncAwait(listado, dato);
            break;

          case "baja":
            deleteFetch(listado, dato);
            break;

          case "modificacion":
            postFetch(listado, dato);
            break;

          default:
            alert("Error: peticion desconocida");
            break;
        }
      } else {
        alert("Datos invalidos en formulario.");
      }
    } else {
      alert("Datos invalidos en formulario.");
    }

    e.preventDefault();
  });

  // Actualizar tabla
  agregarItemSelector("");
  actualizarTabla(listadoFiltrado, campos);
});
