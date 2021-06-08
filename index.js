// Imports express to the package
const express = require('express'),
  morgan = require('morgan');

// Creates an Express instance.
// Declares a new variable to encapsulate the Express's functionality.
const app = express();
// Top 10 movies of all time.
// source: https://www.imdb.com/chart/top/
let top10Movies = [
  {
    title: 'The Shawshank Redemption (1994)',
    director: 'Frank Darabont'
  },
  {
    title: 'The Godfather (1972)',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'The Godfather: Part II (1974)',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'The Dark Knight (2008)',
    director: 'Christopher Nolan'
  },
  {
    title: '12 Angry Men (1957)',
    director: 'Sidney Lumet'
  },
  {
    title: "Schindler's List (1993)",
    director: 'Steven Spielberg'
  },
  {
    title: 'The Lord of the Rings: The Return of the King (2003)',
    director: 'Peter Jackson'
  },
  {
    title: 'Pulp Fiction (1994)',
    director: 'Quentin Tarantino'
  },
  {
    title: 'The Good, the Bad and the Ugly (1966)',
    director: 'Sergio Leone'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
    director: 'Peter Jackson'
  }
];

// logs all request to terminal.
app.use(morgan('common'));

// Serve documentation.html (static files) from '/public' folder.
app.use(express.static('public'));

// Gets requests.
// Maps a route at the endpoint “/movies”.
app.get('/movies', function (req, res) {
  res.json(top10Movies);
});

// Maps a route at the endpoint “/”.
app.get('/', function (req, res) {
  res.send('Welcome to my movie club!');
});

// Error handling.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listens on port 8080.
app.listen(8080, function () {
  console.log('Server is running on port 8080.');
});
