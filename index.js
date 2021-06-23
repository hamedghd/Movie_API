// Imports Mongoose
const mongoose = require('mongoose');

// Imports models.
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// Imports Express
const express = require('express');

// Imports Morgan
const morgan = require('morgan');

// Imports body-parser
const bodyParser = require('body-parser');

// Connects Mongoose to the created database.
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Creates an Express instance.
// Declares a new variable to encapsulate the Express's functionality.
const app = express();

// Uses bodyparser middleware module
app.use(bodyParser.json());

// logs all requests to terminal.
app.use(morgan('common'));

// Serve documentation.html (static files) from '/public' folder.
app.use(express.static('public'));

// Maps a route at the endpoint “/”.
app.get('/', function (req, res) {
  res.send('Welcome to my movie club!');
});

// Maps a route at the endpoint “/movies”.
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  Users.findOne({ Title: req.params.Title })
    .then((title) => {
      res.json(title);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Returns data about a genre (description) by name/title.
app.get('/movies/genres/:genres', (req, res) => {
  res.send('Successful GET request returning a description of the genre');
});
app.get('/movies/genres/:genres', (req, res) => {
  Users.findOne({ 'Genre.Name': req.params.Genre })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Returns data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', (req, res) => {
  Users.findOne({ 'Dirtector.Name': req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
