const mongoose = require("mongoose");


const booksSchema = mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  rating: String,
  image: String,
});

const booksData = mongoose.model("booksDetails", booksSchema);

module.exports = booksData;
