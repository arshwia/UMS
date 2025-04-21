const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  }
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;
