import {
  actualizarTabla,
  actualizarListado,
  llenarListado,
  modificarDato,
  mostrarSpinner,
  ocultarSpinner,
  eliminarDato,
} from "./funciones.js";
import { campos } from "../static/campos.js";

const URL = "http://localhost/personasFutbolitasProfesionales.php";

export const getXMLHttpRequest = (listado) => {
  const xml = new XMLHttpRequest();
  mostrarSpinner();

  xml.onreadystatechange = () => {
    if (xml.readyState === XMLHttpRequest.DONE) {
      ocultarSpinner();

      if (xml.status >= 200 && xml.status < 300) {
        const json = JSON.parse(xml.responseText);

        llenarListado(json, listado);
        actualizarTabla(listado, campos);
      } else {
        alert(`Error: no se pudo realizar lo solicitado. ${xml.response}`);
      }
    }
  };

  xml.open("GET", URL, true);
  xml.send();
};

export const postFetch = (lista, dato) => {
  mostrarSpinner();

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dato),
  })
    .then((resp) => {
      if (!resp.ok || resp.status < 200 || resp.status >= 300)
        throw new Error(`no se pudo realizar lo solicitado.`);

      return resp.text();
    })
    .then((text) => {
      const item = lista.find((item) => item.id === dato.id);

      modificarDato(item, dato);
    })
    .catch((err) => alert(err.message))
    .finally(() => {
      ocultarSpinner();

      actualizarListado(lista, campos);
    });
};

export const putAsyncAwait = async (lista, dato) => {
  mostrarSpinner();

  try {
    const resp = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dato),
    });

    if (!resp.ok || resp.status < 200 || resp.status >= 300)
      throw new Error(`no se pudo realizar lo solicitado.`);

    const json = await resp.json();

    dato.id = json.id;
    lista.push(dato);
  } catch (error) {
    alert(error);
  } finally {
    ocultarSpinner();

    actualizarListado(lista, campos);
  }
};

export const deleteFetch = (lista, dato) => {
  mostrarSpinner();
  const id = { id: dato.id };

  fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  })
    .then((resp) => {
      if (!resp.ok || resp.status < 200 || resp.status >= 300)
        throw new Error(`no se pudo realizar lo solicitado. `);

      return;
    })
    .then(() => {
      eliminarDato(lista, id.id);
    })
    .catch((err) => alert(err))
    .finally(() => {
      ocultarSpinner();

      actualizarListado(lista, campos);
    });
};
