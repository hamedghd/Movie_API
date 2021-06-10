// Imports express to the package
const express = require('express'),
  morgan = require('morgan');

// Creates an Express instance.
// Declares a new variable to encapsulate the Express's functionality.
const app = express();
// Top 10 movies of all time.
// source: https://www.imdb.com/chart/top/
let movies = [
  {
    title: 'The Shawshank Redemption (1994)',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: 'Drama',
    director: 'Frank Darabont',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BNjQ2NDA3MDcxMF5BMl5BanBnXkFtZTgwMjE5NTU0NzE@._V1_CR0,60,640,360_AL_UX477_CR0,0,477,268_AL_.jpg'
  },
  {
    title: 'The Godfather (1972)',
    description: "An organized crime dynasty's aging patriarch transfers control of his clandestine empire to his reluctant son.",
    genre: 'Crime, Drama',
    director: 'Francis Ford Coppola',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg'
  },
  {
    title: 'The Godfather: Part II (1974)',
    description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
    genre: 'Crime, Drama',
    director: 'Francis Ford Coppola',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg'
  },
  {
    title: 'The Dark Knight (2008)',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: 'Action, Crime, Drama',
    director: 'Christopher Nolan',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg'
  },
  {
    title: '12 Angry Men (1957)',
    description: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
    genre: 'Crime, Drama',
    director: 'Sidney Lumet',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_UX182_CR0,0,182,268_AL_.jpg'
  },
  {
    title: "Schindler's List (1993)",
    description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
    genre: 'Biography, Drama, History',
    director: 'Steven Spielberg',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg'
  },
  {
    title: 'The Lord of the Rings: The Return of the King (2003)',
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    genre: ' Action, Adventure, Drama',
    director: 'Peter Jackson',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg'
  },
  {
    title: 'Pulp Fiction (1994)',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genre: 'Crime, Drama',
    director: 'Quentin Tarantino',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR1,0,182,268_AL_.jpg'
  },
  {
    title: 'The Good, the Bad and the Ugly (1966)',
    description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
    genre: 'Western',
    director: 'Sergio Leone',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_UX182_CR0,0,182,268_AL_.jpg'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
    description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    genre: 'Action, Adventure, Drama',
    director: 'Peter Jackson',
    image_URL: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_UX182_CR0,0,182,268_AL_.jpg'
  }
];

// logs all request to terminal.
app.use(morgan('common'));

// Serve documentation.html (static files) from '/public' folder.
app.use(express.static('public'));

// Gets requests.
// Maps a route at the endpoint “/movies”.
app.get('/movies', function (req, res) {
  res.json(movies);
});

// Maps a route at the endpoint “/”.
app.get('/', function (req, res) {
  res.send('Welcome to my movie club!');
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

// Returns data about a genre (description) by name/title.
app.get('/movies/genres/:genres', (req, res) => {
  res.send('Successful GET request returning a description of the genre');
});

// Returns data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', (req, res) => {
  res.send('Successful GET request returning data of the Director');
});

// Allows new users to register.
app.post('/users', (req, res) => {
  res.send('Registration succesful!');
});

// Allows users to update their user info (username).
app.put('/users/:username', (req, res) => {
  res.send(
    'The user: ' + req.params.username + ' ' + 'was successfully updated'
  );
});

// Allows users to add a movie to their list of favorites.
app.post('/users/:username/favourites/:title', (req, res) => {
  res.send('Movie:' + req.params.title + ' ' + 'was added to favourites. ');
});

// Allows users to remove a movie from their list of favorites.
app.delete('/users/:username/favourites/:title', (req, res) => {
  res.send(
    'Movie:' + req.params.title + ' ' + 'has been removed from favourites'
  );
});

// Allow existing users to deregister.
app.delete('/users/:username', (req, res) => {
  res.send('User ' + req.params.username + ' ' + 'was deleted.');
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
