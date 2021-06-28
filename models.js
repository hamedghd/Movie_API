// Imports mongoose package.
const mongoose = require('mongoose');
// Defines a schema for documents in the "Movies" collection
let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

// Import bcrypt
const bcrypt = require('bcrypt');

// Defines a schema for documents in the "Users" collection
let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birth: Date,
  FavoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Movie'
  }]
})

// hashes of submitted passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compares submitted hashed passwords with the hashed passwords stored in the database
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

// Creates models using schemas.
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// Exports the models.
module.exports.Movie = Movie;
module.exports.User = User;
