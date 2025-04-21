const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  email: String,
  password: String,
  avatar: String,
});

module.exports = mongoose.model('Person', personSchema);
