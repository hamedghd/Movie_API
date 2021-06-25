// Import Passport middleware
//  “LocalStrategy,” defines the basic HTTP authentication for login requests.
// “JWTStrategy,” allows users to be authenticated based on the JWT submitted alongside their request.
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');
