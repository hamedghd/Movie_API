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

// Creates models using schemas.
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
