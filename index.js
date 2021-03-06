const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
/**
 * Creates an Express instance.
 * Declares a new variable to encapsulate the Express's functionality.
*/
const app = express();
const cors = require('cors');
const { check, validationResult } = require('express-validator');

// app.use(cors());

/**
 * To restrict the access to the API from different domains:
 */
const allowedOrigins = [
  'http://localhost:8080',
  'https://myflix-movieapi.herokuapp.com',
  'http://localhost:1234',
  'http://localhost:4200',
  'https://hamedghd.github.io',
  'https://hamedghd.github.io/myFlix-Angular-client',
  'https://hamedghd.github.io/myFlix-Angular-client/welcome'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      const message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());
// Serve documentation.html (static files) from '/public' folder.
app.use(express.static('public'));
// logs all requests to terminal.
app.use(morgan('common'));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Connects Mongoose to the created database.
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

/**
 * Maps a route at the endpoint “/”.
 */
app.get('/', function (req, res) {
  res.send('Welcome to my movie club!');
});

/**
 * Maps a route at the endpoint “/movies”.
 * @func getAllMovies
 * @param {string} endpoint
 * @returns {object} containing all the movies data
 * @requires authentication JWT
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Gets the data about a single movie, by title
 * @func getASingleMovie
 * @param {string} (title) endpoint
 * @returns {object} data about a single movie
 * @requires authentication JWT
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Returns data about a genre (description) by name/title.
 * @func getMovieGenre
 * @param {string} (name) endpoint
 * @returns {object} data about a genre
 * @requires authentication JWT 
 */
app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })
    .then((genre) => {
      res.status(200).json(genre.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Returns data about a director (bio, birth year, death year) by name
 * @func getMovieDirector
 * @param {string} (name) endpoint
 * @returns {object} data about a director
 * @requires authenticate JWT
 */
app.get('/movies/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((director) => {
      res.status(200).json(director.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Allows new users to register.
 * We’ll expect JSON in this format
 * {
    ID: Integer,
    Username: String,
    Password: String (hashes Password),
    Email: String,
    Birth: Date
  }
 * @func registerUser
 * @param {object} object containing user details
 * @returns {object} json-object added user
 * @requires properties username, password, email
 * @requires auth no authentication - public
 */

app.post('/users',
  // Validation logic here for request
  // you can either use a chain of methods like .not().isEmpty()
  // which means "opposite of isEmpty" in plain english "is not empty"
  // or use .isLength({min: 5}) which means
  // minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Hashes the password before storing it
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birth: req.body.Birth
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

/**
 * Allows users to retrieve their user info (username).
 * @func getUserInfo
 * @param {string} (username) endpoint
 * @returns {object} containing details of one user
 * @requires authentication JWT
 */
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * Allows users to update their user info (username).
 * We’ll expect JSON in this format:
 * {
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birth: Date
}
 * @func updateUserInfo
 * @param {object} object containing user details
 * @returns {object} json-object added user
 * @requires properties username, password, email
 * @requires authentication JWT
 */

app.put('/users/:Username',
  //app.put('/users/profile',
  passport.authenticate('jwt', { session: false }),

  // passport.authenticate('jwt', { session: false }), (req, res) => {
  // Validation logic here for request
  // you can either use a chain of methods like .not().isEmpty()
  // which means "opposite of isEmpty" in plain english "is not empty"
  // or use .isLength({min: 5}) which means
  // minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.body.Username }, {
      $set:
      //Users.findOneAndUpdate({ _id: req.body._id }, { $set:

      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birth: req.body.Birth
      }
    },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

/**
 * Gets the list of favorite movies
 * @func getFavoriteMovies
 * @param {string} (username) endpoint
 * @returns {object} containing favoritemovies array of user
 * @requires authentication JWT
 */
app.get('/users/:Username/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);


/**
 * Allows users to add a movie to their list of favorites.
 * @func AddAMovieToFavorites
 * @param {string} (username, movieId) endpoint
 * @returns {statusMessage} success/error
 * @requires authentication JWT
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


/**
 * Allows users to remove a movie from their list of favorites.
 * @func RemoveAMovieFromFavorites
 * @param {string} (username, movieId) endpoint
 * @returns {statusMessage} success/error
 * @requires authentication JWT
 */
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * Allows existing users to deregister.
 * @func RemoveUserAccount
 * @param {string} (username) endpoint
 * @returns {statusMessage} success/error
 * @requires authentication JWT
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Error handling.
 */
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Allows the port to change.
const port = process.env.PORT || 8080;

/**
 * Listens on port 8080 or another port.
 */
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
