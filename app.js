const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a la base de datos
mongoose
  .connect('mongodb://0.0.0.0:27017/mydatabase_music', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Esquema de cancion
const musicSchema = new mongoose.Schema({
  name_music: String,
  author_music: String,
  type_music: String,
});

// Definir el modelo en base al esquema anterior
const Music = mongoose.model('Music', musicSchema);

// Ruta para mostrar el formulario de ingreso de datos
app.get('/', (req, res) => {
  res.render('register'); // Renderizar la vista formulario.ejs
});

// Ruta para capturar datos de registro de cancion y almacenarlo en la base de datos
app.post('/register', (req, res) => {
  const { name_music, author_music, type_music } = req.body;

  const newMusic = new Music({
    name_music: name_music,
    author_music: author_music,
    type_music: type_music,
  });

  newMusic
    .save()
    .then(() => {
      console.log('Cancion registrada con exito!');
      res.redirect('/listado');
    })
    .catch((error) => {
      console.log('Error al registrar tu cancion: ', error);
    });
});

// Ruta para mostrar el listado de usuarios
app.get('/listado', (req, res) => {
  Music.find()
    .then((musics) => {
      res.render('listado', { musics: musics }); // Renderizar la vista listado.ejs con los usuarios
    })
    .catch((error) => {
      console.error('Error al recuperar canciones:', error);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
