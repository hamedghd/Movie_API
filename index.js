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
