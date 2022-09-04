const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:app:db');
const express = require("express");
const Joi = require("@hapi/joi");
const morgan = require('morgan');
const config = require('config');
const debug = 
//instanciamos este elemento

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
//configuración de entornos
console.log('Aplicacion'+ config.get('nombre'));
console.log('DB server'+ config.get('configDB.host'));
//verificar en que entorno nos encontramos
if(app.get('enn')==='development'){
  app.use(morgan('tiny'));
  inicioDebug('Morgan esta habilitado');
}


//data ejemplo
const usuarios = [
  {
    id: 1,
    nombre: "Vittorio Cassetta",
  },
  {
    id: 2,
    nombre: "Vicente Cassetta",
  }
];

//indicamos a la aplicación cuales son los métodos a implementar, las rutas

app.get("/", (req, res) => {
  res.send("Hola express");
});

app.get("/api/usuarios", (req, res) => {
  res.send(usuarios);
});

app.get("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("El usuario no se encuentra");
  }
  res.send(usuario);
});

//ejemplo petición post
app.post("/api/usuarios", (req, res) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
  });

  const { error, value } = validarUsuario(req.body.nombre);
  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre,
    };
    usuarios.push(usuario);
    res.send(usuario);
  } else {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }
});

//verbo PUT
app.put("/api/usuarios/:id", (req, res) => {
  //buscamos si existe el objeto usuario
let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("El usuario no se encuentra");
    return;
  }
  const { error, value } = validarUsuario(req.body.nombre);
  if (error) {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return;
  }
  usuario.nombre = value.nombre;
  res.send(usuario);
});
//verbo DELETE
app.delete("/api/usuarios/:id", (req, res) => {
  //buscamos si existe el objeto usuario
let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("El usuario no se encuentra");
    return;
  }
  const index = usuarios.indexOf(usuario);
  usuarios.splice(index,1);
  res.send(usuarios);
});

//puerto donde escucha el servidor

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});


//FUNCIONES DE VALIDACIÓN

function existeUsuario(id){
  return(usuarios.find(
    (usuario) => usuario.id === parseInt(id)));
}

function validarUsuario(nom){
  const schema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
  });
  return(schema.validate({ nombre: nom }));
}
