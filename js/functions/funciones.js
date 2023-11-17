import { Futbolista } from "../model/futbolista.js";
import { Profesional } from "../model/profesional.js";

export const $ = (id) => document.getElementById(id);

export const validarDato = (persona) => {
  console.log(persona);
  if (persona.id < 0) return false;
  if (!persona.nombre) return false;
  if (!persona.apellido) return false;
  if (!persona.edad || isNaN(persona.edad) || persona.edad < 15) return false;

  if (
    // Futbolista
    (!persona.equipo || !persona.posicion) &&
    // Profesional
    (!persona.titulo ||
      !persona.facultad ||
      isNaN(persona.añoGraduacion) ||
      !persona.añoGraduacion ||
      persona.añoGraduacion < 1950)
  ) {
    return false;
  }

  return true;
};

export const agregarDato = (persona, listado) => {
  const {
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
  } = persona;

  if (
    validarDato({ id, nombre, apellido, edad, equipo, posicion, cantidadGoles })
  ) {
    listado.push(
      new Futbolista(
        id,
        nombre,
        apellido,
        edad,
        equipo,
        posicion,
        cantidadGoles
      )
    );
  } else if ({ id, nombre, apellido, edad, titulo, facultad, añoGraduacion }) {
    listado.push(
      new Profesional(
        id,
        nombre,
        apellido,
        edad,
        titulo,
        facultad,
        añoGraduacion
      )
    );
  }
};

export const modificarDato = (dato, nuevosDatos) => {
  dato.nombre = nuevosDatos.nombre;
  dato.apellido = nuevosDatos.apellido;
  dato.edad = nuevosDatos.edad;

  if (nuevosDatos.equipo && nuevosDatos.posicion) {
    dato.equipo = nuevosDatos.equipo;
    dato.posicion = nuevosDatos.posicion;
    dato.cantidadGoles = nuevosDatos.cantidadGoles;
  } else if (
    nuevosDatos.titulo &&
    nuevosDatos.facultad &&
    nuevosDatos.añoGraduacion
  ) {
    dato.titulo = nuevosDatos.titulo;
    dato.facultad = nuevosDatos.facultad;
    dato.añoGraduacion = nuevosDatos.añoGraduacion;
  }
};

export const eliminarDato = (listado, id) => {
  if (id > 0) {
    const persona = listado.findIndex((persona) => persona.id === parseInt(id));

    if (persona >= 0) {
      listado.splice(persona, 1);
    }
  }
};

export const llenarListado = (mock, listado) => {
  mock.forEach((dato) => {
    agregarDato(dato, listado);
  });
};

export const calcularEdad = (personas) => {
  if (personas.length === 0) return 0;

  let length = 0;

  const edad = personas
    .map((persona) => {
      length++;
      return persona.edad;
    })
    .reduce((accumulator, current) => accumulator + current);

  return (edad / length).toFixed(2);
};

export const actualizarTabla = (listado, campos) => {
  const tableBody = $("table-body");

  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
  }

  listado.forEach((dato) => {
    const tableRow = document.createElement("tr");

    tableRow.setAttribute("id-dato", `${dato.id}`);

    campos.forEach((campo) => {
      const tableData = document.createElement("td");
      const elemento = dato[campo];

      tableData.appendChild(
        document.createTextNode(
          `${elemento !== null && elemento !== undefined ? elemento : "N/A"}`
        )
      );

      tableData.setAttribute("class", `col-${campo}`);
      tableRow.setAttribute("scope", "row");
      tableRow.appendChild(tableData);
    });

    // Botones eliminar y modificar
    const tdModificar = document.createElement("td");
    const tdEliminar = document.createElement("td");

    const btnModificar = document.createElement("input");
    const btnEliminar = document.createElement("input");

    btnModificar.setAttribute("element-id", `${dato.id}`);
    btnModificar.setAttribute("type", "button");
    btnModificar.setAttribute("class", "btn btn-warning");
    btnModificar.setAttribute("value", "modificar");
    btnModificar.addEventListener("click", (e) => {
      $("tipo-form").replaceChildren(document.createTextNode("Modificacion"));
      $("tipo").setAttribute("disabled", true);
      const dato = {};
      const fila = e.target.parentNode.parentNode;

      for (let i = 0; i < campos.length; i++) {
        const element = fila.cells[i].textContent;
        dato[campos[i]] = element === "N/A" ? undefined : element;
      }

      if (validarDato(dato)) {
        cambiarForm($("form-agregar").style.display == "none", dato);
      }
    });

    btnEliminar.setAttribute("element-id", `${dato.id}`);
    btnEliminar.setAttribute("type", "button");
    btnEliminar.setAttribute("class", "btn btn-danger");
    btnEliminar.setAttribute("value", "eliminar");
    btnEliminar.addEventListener("click", (e) => {
      $("tipo-form").replaceChildren(document.createTextNode("Baja"));
      $("tipo").setAttribute("disabled", true);
      const dato = {};
      const fila = e.target.parentNode.parentNode;

      for (let i = 0; i < campos.length; i++) {
        const element = fila.cells[i].textContent;
        dato[campos[i]] = element === "N/A" ? undefined : element;
      }

      if (validarDato(dato)) {
        cambiarForm($("form-agregar").style.display == "none", dato);
      }
    });

    tdModificar.appendChild(btnModificar);
    tdEliminar.appendChild(btnEliminar);

    tableRow.appendChild(tdModificar);
    tableRow.appendChild(tdEliminar);

    tableBody.appendChild(tableRow);
  });
};

export const agregarItemSelector = (tipoSeleccionado) => {
  const divSelectedType = $("selected-type");

  while (divSelectedType.hasChildNodes()) {
    divSelectedType.removeChild(divSelectedType.lastChild);
  }

  const div1 = document.createElement("div");
  const label1 = document.createElement("label");
  const input1 = document.createElement("input");

  const div2 = document.createElement("div");
  const label2 = document.createElement("label");
  const input2 = document.createElement("input");

  const div3 = document.createElement("div");
  const label3 = document.createElement("label");
  const input3 = document.createElement("input");

  switch (tipoSeleccionado) {
    case "":
      break;
    case "profesional":
      input1.setAttribute("type", "text");
      input1.setAttribute("name", "titulo");
      input1.setAttribute("id", "titulo");

      label1.appendChild(document.createTextNode(`Titulo: `));
      label1.setAttribute("for", "titulo");

      input2.setAttribute("type", "text");
      input2.setAttribute("name", "facultad");
      input2.setAttribute("id", "facultad");

      label2.appendChild(document.createTextNode(`Facultad: `));
      label2.setAttribute("for", "facultad");

      input3.setAttribute("type", "number");
      input3.setAttribute("min", "1950");
      input3.setAttribute("step", "1");
      input3.setAttribute("name", "añoGraduacion");
      input3.setAttribute("id", "añoGraduacion");

      label3.appendChild(document.createTextNode(`Años de graduacion: `));
      label3.setAttribute("for", "añoGraduacion");
      break;
    case "futbolista":
      input1.setAttribute("type", "text");
      input1.setAttribute("name", "equipo");
      input1.setAttribute("id", "equipo");

      label1.appendChild(document.createTextNode(`Equipo: `));
      label1.setAttribute("for", "equipo");

      input2.setAttribute("type", "text");
      input2.setAttribute("name", "posicion");
      input2.setAttribute("id", "posicion");

      label2.appendChild(document.createTextNode(`Posicion: `));
      label2.setAttribute("for", "posicion");

      input3.setAttribute("type", "number");
      input3.setAttribute("min", "0");
      input3.setAttribute("step", "1");
      input3.setAttribute("name", "cantidadGoles");
      input3.setAttribute("id", "cantidadGoles");

      label3.appendChild(document.createTextNode(`Cantidad de goles: `));
      label3.setAttribute("for", "cantidadGoles");
      break;
    default:
      alert("Tipo invalido: " + tipoSeleccionado);
  }

  if (tipoSeleccionado !== "") {
    input1.setAttribute("required", "true");
    input2.setAttribute("required", "true");
    input3.setAttribute("required", "true");

    div1.appendChild(label1);
    div2.appendChild(label2);
    div3.appendChild(label3);

    div1.appendChild(input1);
    div2.appendChild(input2);
    div3.appendChild(input3);

    div1.className = "d-flex justify-content-between my-2";
    div2.className = "d-flex justify-content-between my-2";
    div3.className = "d-flex justify-content-between my-2";

    divSelectedType.appendChild(div1);
    divSelectedType.appendChild(div2);
    divSelectedType.appendChild(div3);
  }
};

export const filtrarTabla = (listado, filtrarPor) => {
  let listadoFiltrado = [];

  switch (filtrarPor.toLowerCase()) {
    case "todos":
      listadoFiltrado = [...listado];
      break;
    case "futbolistas":
      listadoFiltrado = listado.filter((data) => data.equipo && data.posicion);
      break;
    case "profesionales":
      listadoFiltrado = listado.filter(
        (data) => data.titulo && data.facultad && data.añoGraduacion
      );
      break;
    default:
      alert("Filtro invalido: " + filtrarPor);
  }

  return listadoFiltrado;
};

export const ocultarColumna = (columna) => {
  const celdas = document.querySelectorAll(`.col-${columna}`);
  const checkbox = $(`checkbox-${columna}`);

  for (let i = 0; i < celdas.length; i++) {
    if (checkbox.checked) {
      celdas[i].style.display = "";
    } else {
      celdas[i].style.display = "none";
    }
  }
};

export const cambiarForm = (inicial, dato) => {
  let formIn;
  let formOut;

  const id = $("id");
  const nombre = $("nombre");
  const apellido = $("apellido");
  const edad = $("edad");

  if (inicial) {
    formOut = $("form-agregar");
    formIn = $("form-tabla");
  } else {
    formOut = $("form-tabla");
    formIn = $("form-agregar");
  }

  if (dato) {
    id.value = dato.id;
    nombre.value = dato.nombre;
    apellido.value = dato.apellido;
    edad.value = dato.edad;

    if (dato.equipo && dato.posicion) {
      agregarItemSelector("futbolista");
      $("tipo").value = "futbolista";

      const equipo = $("equipo");
      const posicion = $("posicion");
      const cantidadGoles = $("cantidadGoles");

      equipo.value = dato.equipo;
      posicion.value = dato.posicion;
      cantidadGoles.value = dato.cantidadGoles;
    } else if (dato.titulo && dato.facultad && dato.añoGraduacion) {
      agregarItemSelector("profesional");
      $("tipo").value = "profesional";

      const titulo = $("titulo");
      const facultad = $("facultad");
      const añoGraduacion = $("añoGraduacion");

      titulo.value = dato.titulo;
      facultad.value = dato.facultad;
      añoGraduacion.value = dato.añoGraduacion;
    }
  } else {
    setTimeout(() => {
      id.value = "";
      nombre.value = "";
      apellido.value = "";
      edad.value = "";
    }, 450);
  }

  formOut.className = "fade-out bordered";

  setTimeout(() => {
    formOut.className = "d-none";
    formIn.className = "fade-in bordered";
  }, 350);
};

export const ordenarFilasPor = (columna, listado) => {
  if (columna.tagName.toLowerCase() !== "TH".toLowerCase()) return;

  const nombreColumna = columna.className.split("-")[1].toLowerCase();
  let funcionComparar;
  let listadoOrdenado = [];

  switch (nombreColumna) {
    case "id":
      funcionComparar = (a, b) => a.id - b.id;
      break;
    case "nombre":
      funcionComparar = (a, b) => a.nombre.localeCompare(b.nombre);
      break;
    case "apellido":
      funcionComparar = (a, b) => a.apellido.localeCompare(b.apellido);
      break;
    case "edad":
      funcionComparar = (a, b) => a.edad - b.edad;
      break;
    case "equipo":
      funcionComparar = (a, b) => a.equipo?.localeCompare(b.equipo);
      break;
    case "posicion":
      funcionComparar = (a, b) => a.posicion?.localeCompare(b.posicion);
      break;
    case "cantidadGoles":
      funcionComparar = (a, b) => a.cantidadGoles - b.cantidadGoles;
      break;
    case "titulo":
      funcionComparar = (a, b) => a.titulo?.localeCompare(b.titulo);
      break;
    case "facultad":
      funcionComparar = (a, b) => a.facultad?.localeCompare(b.facultad);
      break;
    case "añoGraduacion":
      funcionComparar = (a, b) => a.añoGraduacion - b.añoGraduacion;
      break;
    default:
      alert("TableHeader invalido: " + nombreColumna);
  }

  listadoOrdenado = [...listado].sort(funcionComparar);

  return listadoOrdenado;
};

export const actualizarListado = (lista, campos) => {
  agregarItemSelector("");

  const listadoFiltrado = filtrarTabla(lista, "todos");

  actualizarTabla(listadoFiltrado, campos);

  cambiarForm($("form-tabla").style.display != "none");
};

export const mostrarSpinner = () => {
  $("spinnerContainer").style.display = "flex";
};

export const ocultarSpinner = () => {
  $("spinnerContainer").style.display = "none";
};
