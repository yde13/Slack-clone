const mongoose = require('mongoose');


const UsersSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    image: String,
  },{collection: 'users'});

module.exports = mongoose.model('Users', UsersSchema);