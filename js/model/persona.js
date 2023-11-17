export class Persona {
  constructor(id, nombre, apellido, edad) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
  }

  toString() {
    return `Persona { id: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, edad: ${this.edad} }`;
  }
}
