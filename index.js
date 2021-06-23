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
